#!/usr/bin/env python3
"""
scan_safetensors.py

Read-only scanner for .safetensors files that writes an NDJSON log of
header metadata and candidate fixes. No model files are modified.

Usage:
  python scan_safetensors.py --model-dir "K:/.ai_local/SwarmUI/Models" \
      --log report.ndjson --workers 4

Modes:
  --sample 5        scan only the first 5 files (sanity check)
  --hash            additionally compute SHA256 (reads whole file; off by default)

Detection logic:
  * read the u64 little-endian header length stored at bytes 0..7
  * read byte 8 (expected 0x7B '{')
  * locate the true JSON header end via json.JSONDecoder().raw_decode(),
    which parses one complete JSON value and ignores trailing tensor bytes
  * if the true length differs from the stored length -> verdict
    "rewrite_stored_len" (logged, never applied)
  * if no header at offset 8, search a bounded window (default 4 MB)
    for a displaced header -> verdict "displaced_header"
  * otherwise -> verdict "unrecoverable"

Verdicts:
  ok                  stored length matches the real header length
  rewrite_stored_len  header intact but bytes 0..7 hold the wrong length
  displaced_header    valid header found somewhere other than offset 8
  unrecoverable       no valid safetensors header located
  too_small           file is under 8 bytes
  read_error          file could not be opened/read
"""

from __future__ import annotations

import argparse
import glob
import hashlib
import json
import os
import struct
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any, Iterator

# Defaults and limits -------------------------------------------------------
DEFAULT_MAX_HEADER = 16 * 1024 * 1024  # 16 MB: no real header comes close
DEFAULT_FORWARD_SCAN = 4 * 1024 * 1024  # 4 MB: where a displaced header would sit
DEFAULT_WORKERS = 4
DEFAULT_PROGRESS_EVERY = 25
GROWTH_CHUNK = 64 * 1024
MAX_GROWTH_CHUNK = 8 * 1024 * 1024
PROBE_BYTES = 512  # bytes screened for JSON plausibility
MAX_GROWTH_ATTEMPTS = 200  # per-file cap on full header growth in stage 2

# First 8 bytes written by the broken uniform repair pass.
BAD_PATTERN = bytes([0x10, 0x77, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00])

_JSON_DECODER = json.JSONDecoder()

# Maps raw control bytes (and DEL) to 0xFF, everything else to 0x00, so a
# single translate()+find() locates the first control byte at C speed.
# JSON whitespace (TAB/LF/CR) is deliberately NOT treated as a control byte.
_CTRL_TABLE = bytes(
    0xFF if (i == 0x7F or (i < 0x20 and i not in (0x09, 0x0A, 0x0D))) else 0x00
    for i in range(256)
)


# Arguments -----------------------------------------------------------------
def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Read-only safetensors header scanner (NDJSON report)"
    )
    p.add_argument("--model-dir", required=True, help="Root directory to scan")
    p.add_argument("--log", required=True, help="NDJSON output file (overwritten)")
    p.add_argument("--workers", type=int, default=DEFAULT_WORKERS)
    p.add_argument(
        "--max-header",
        type=int,
        default=DEFAULT_MAX_HEADER,
        help="Upper bound on a single header read, in bytes",
    )
    p.add_argument(
        "--forward-scan",
        type=int,
        default=DEFAULT_FORWARD_SCAN,
        help="How far past offset 8 to hunt for a displaced header, in bytes",
    )
    p.add_argument(
        "--hash",
        action="store_true",
        help="Compute SHA256 for each file (reads the entire file; off by default)",
    )
    p.add_argument(
        "--sample",
        type=int,
        default=0,
        help="Scan only the first N files (0 = all)",
    )
    p.add_argument(
        "--progress-every",
        type=int,
        default=DEFAULT_PROGRESS_EVERY,
        help="Print a progress line every N completed files",
    )
    return p.parse_args(argv)


# Helpers -------------------------------------------------------------------
def iter_files(model_dir: str) -> Iterator[str]:
    """Yield .safetensors paths under model_dir without building a huge list."""
    pattern = os.path.join(model_dir, "**", "*.safetensors")
    yield from glob.iglob(pattern, recursive=True)


def read_u64_le(b: bytes) -> int:
    if len(b) < 8:
        raise ValueError("need 8 bytes to read u64")
    return struct.unpack("<Q", b)[0]


def compute_sha256(path: str, chunk_size: int = 1 << 20) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()


def find_control_byte(buf: bytes) -> int | None:
    """Index of the first raw control byte, or None if there is none."""
    i = buf.translate(_CTRL_TABLE).find(b"\xff")
    return i if i >= 0 else None


def starts_like_json(buf: bytes) -> bool:
    """
    Structural screen: does `buf` begin with '{' followed by optional
    whitespace and then '"'? JSON object keys must be quoted, so a real
    safetensors header always satisfies this.

    Only the opening bytes are examined -- deliberately NOT the whole probe
    region, because a header may be shorter than PROBE_BYTES and the bytes
    after it are tensor payload.
    """
    if not buf or buf[0] != 0x7B:
        return False
    i = 1
    n = len(buf)
    while i < n and buf[i] in (0x09, 0x0A, 0x0D, 0x20):
        i += 1
    if i >= n:
        return True  # probe ended after '{' -- inconclusive, not a rejection
    return buf[i] == 0x22


def screen_candidate(buf: bytes) -> bool | None:
    """
    Cheap in-memory screen for a displaced-header candidate.

    Returns True (worth a real read), False (reject), or None (inconclusive).

    The key insight: valid JSON cannot contain a raw control byte, so the
    first control byte bounds the header region. If that region does not
    itself parse as JSON, the candidate is tensor noise and can be rejected
    without touching the file again. That is what keeps the forward scan
    affordable -- stray '{' bytes in tensor data almost always hit a control
    byte within a few bytes and die here.
    """
    if not buf or buf[0] != 0x7B:
        return False
    i = 1
    n = len(buf)
    while i < n and buf[i] in (0x09, 0x0A, 0x0D, 0x20):
        i += 1
    if i >= n:
        return None  # probe ends right after the opening brace
    if buf[i] != 0x22:
        return False
    ctrl = find_control_byte(buf[:PROBE_BYTES])
    if ctrl is None:
        return None  # no control byte in probe: may be a long header
    return decode_json_prefix(buf[:ctrl]) is not None


def decode_json_prefix(buf: bytes) -> int | None:
    """
    Return the byte length of the complete JSON value at the start of `buf`.

    Uses raw_decode so trailing tensor bytes are ignored. The header region is
    valid UTF-8, so decoding leniently and re-encoding the parsed prefix yields
    the exact original byte length even when later bytes are not UTF-8.
    """
    if not buf or buf[0] != 0x7B:
        return None
    try:
        text = buf.decode("utf-8", errors="ignore")
    except Exception:
        return None
    if not text or text[0] != "{":
        return None
    try:
        _obj, end = _JSON_DECODER.raw_decode(text)
    except (json.JSONDecodeError, ValueError, RecursionError):
        return None
    if end <= 0:
        return None
    try:
        prefix = text[:end].encode("utf-8")
    except Exception:
        return None
    return len(prefix)


def is_safetensors_header(obj: Any) -> bool:
    """
    Shape check used to reject spurious '{' bytes found inside tensor data.

    A real header is a dict of tensor-name -> {dtype, shape, data_offsets},
    optionally with a __metadata__ dict.
    """
    if not isinstance(obj, dict) or not obj:
        return False
    tensor_entries = 0
    for key, val in obj.items():
        if key == "__metadata__":
            if not isinstance(val, dict):
                return False
            continue
        if not isinstance(val, dict):
            return False
        if "data_offsets" in val:
            tensor_entries += 1
    return tensor_entries > 0


def parse_header_object(buf: bytes) -> Any:
    """Best-effort parse of a header byte slice into a Python object."""
    try:
        return json.loads(buf)
    except Exception:
        return None


def new_record(path: str) -> dict[str, Any]:
    return {
        "path": path,
        "size_bytes": None,
        "sha256": None,
        "stored_header_len": None,
        "byte8": None,
        "stored_header_parses": False,
        "true_header_len": None,
        "detected_header_len": None,
        "detected_header_offset": None,
        "detected_header_parses": False,
        "header_shape_ok": False,
        "bad_pattern": False,
        "verdict": None,
        "candidate_fix": None,
        "priority": "normal",
        "notes": "",
    }


def grow_and_decode(f, max_header: int) -> int | None:
    """
    Read forward from the current file position in doubling chunks and return
    the byte length of the JSON value found there, or None.

    Bails as soon as the bytes stop looking like JSON, so a broken file never
    reads the full cap. The first control byte bounds the header region: if
    that bounded region does not parse, the header is malformed and growing
    further cannot help.
    """
    buf = bytearray()
    chunk = GROWTH_CHUNK
    while len(buf) < max_header:
        part = f.read(min(chunk, max_header - len(buf)))
        if not part:
            break
        buf.extend(part)
        view = bytes(buf)

        if not starts_like_json(view):
            return None

        ctrl = find_control_byte(view)
        region = view if ctrl is None else view[:ctrl]

        length = decode_json_prefix(region)
        if length is not None:
            return length
        if ctrl is not None:
            return None  # header region fully present but unparseable

        # No control byte yet: the header may extend past the buffer.
        chunk = min(chunk * 2, MAX_GROWTH_CHUNK)
    return None


def scan_file(
    path: str,
    max_header: int,
    forward_scan: int,
    do_hash: bool,
) -> dict[str, Any]:
    rec = new_record(path)

    try:
        rec["size_bytes"] = os.path.getsize(path)

        if do_hash:
            try:
                rec["sha256"] = compute_sha256(path)
            except OSError as e:
                rec["notes"] = f"hash error: {e}"

        with open(path, "rb") as f:
            prefix8 = f.read(8)
            if len(prefix8) < 8:
                rec["verdict"] = "too_small"
                rec["notes"] = "file smaller than 8 bytes"
                return rec

            stored = read_u64_le(prefix8)
            rec["stored_header_len"] = stored

            rec["bad_pattern"] = prefix8 == BAD_PATTERN
            if rec["bad_pattern"]:
                rec["priority"] = "high"
                rec["notes"] = "matches known bad 8-byte overwrite pattern"

            first = f.read(1)
            rec["byte8"] = first[0] if first else None

            def note(extra: str) -> None:
                rec["notes"] = f"{rec['notes']}; {extra}" if rec["notes"] else extra

            # --- Stage 1: header at the normal offset 8 -------------------
            if rec["byte8"] == 0x7B:
                f.seek(8)
                length = grow_and_decode(f, max_header)
                if length is not None:
                    rec["true_header_len"] = length
                    rec["detected_header_len"] = length
                    rec["detected_header_offset"] = 8
                    rec["detected_header_parses"] = True
                    rec["stored_header_parses"] = stored == length

                    f.seek(8)
                    obj = parse_header_object(f.read(length))
                    rec["header_shape_ok"] = is_safetensors_header(obj)

                    if stored == length:
                        rec["verdict"] = "ok"
                        rec["candidate_fix"] = None
                        note("header intact")
                        return rec

                    rec["verdict"] = "rewrite_stored_len"
                    rec["candidate_fix"] = {
                        "action": "rewrite_stored_len",
                        "byte_range": [0, 8],
                        "old_value": stored,
                        "new_value": length,
                    }
                    note(f"stored len {stored} != true len {length}")
                    return rec

            # --- Stage 2: hunt for a displaced header ---------------------
            # Candidates are screened in-memory first so that stray '{' bytes
            # inside tensor data never trigger an expensive header read. A
            # candidate is only accepted if it also passes the structural
            # shape check (tensor entries with data_offsets).
            window = 64 * 1024
            pos = 8
            scan_end = 8 + max(0, forward_scan)
            growth_attempts = 0

            while pos < scan_end and growth_attempts < MAX_GROWTH_ATTEMPTS:
                f.seek(pos)
                data = f.read(min(window, scan_end - pos))
                if not data:
                    break
                start = 0
                while True:
                    idx = data.find(b"{", start)
                    if idx < 0:
                        break
                    cand = pos + idx
                    probe = data[idx : idx + PROBE_BYTES]
                    if len(probe) >= 2:
                        verdict_screen = screen_candidate(probe)
                        if verdict_screen is False:
                            start = idx + 1
                            continue
                    # None (inconclusive) or True: worth a real read.

                    growth_attempts += 1
                    f.seek(cand)
                    length = grow_and_decode(f, max_header)
                    if length is not None:
                        f.seek(cand)
                        obj = parse_header_object(f.read(length))
                        if is_safetensors_header(obj):
                            rec["true_header_len"] = length
                            rec["detected_header_len"] = length
                            rec["detected_header_offset"] = cand
                            rec["detected_header_parses"] = True
                            rec["header_shape_ok"] = True
                            rec["verdict"] = "displaced_header"
                            rec["priority"] = "high"
                            rec["candidate_fix"] = {
                                "action": "manual_review",
                                "found_offset": cand,
                                "true_header_len": length,
                                "note": "valid header does not start at offset 8",
                            }
                            note(f"header found at offset {cand}, not 8")
                            return rec
                    if growth_attempts >= MAX_GROWTH_ATTEMPTS:
                        break
                    start = idx + 1
                pos += len(data)

            if growth_attempts >= MAX_GROWTH_ATTEMPTS:
                note(f"forward scan stopped after {growth_attempts} candidates")

            # --- Stage 3: nothing found -----------------------------------
            rec["verdict"] = "unrecoverable"
            rec["priority"] = "high"
            rec["candidate_fix"] = {"action": "manual_review"}
            extra = "no valid safetensors header found"
            if rec["byte8"] is not None and rec["byte8"] != 0x7B:
                extra += f" (byte8={rec['byte8']} != 123)"
            note(extra)
            return rec

    except OSError as e:
        rec["verdict"] = "read_error"
        rec["priority"] = "high"
        rec["notes"] = f"os error: {e}"
        return rec


# Orchestration -------------------------------------------------------------
def empty_summary(total: int) -> dict[str, Any]:
    return {
        "total": total,
        "scanned": 0,
        "by_verdict": {},
        "bad_pattern": 0,
        "high_priority": 0,
        "elapsed_seconds": 0.0,
        "files_per_second": 0.0,
    }


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    workers = max(1, args.workers)
    log_path = args.log

    files = list(iter_files(args.model_dir))
    if args.sample > 0:
        files = files[: args.sample]
    total = len(files)

    print(f"Scanning {total} files from {args.model_dir} with {workers} workers")
    print(
        f"  max-header={args.max_header}  forward-scan={args.forward_scan}  "
        f"hash={'on' if args.hash else 'off'}",
        flush=True,
    )

    os.makedirs(os.path.dirname(os.path.abspath(log_path)), exist_ok=True)

    summary = empty_summary(total)
    started = time.monotonic()

    with open(log_path, "w", buffering=1, encoding="utf-8") as log_file:
        with ThreadPoolExecutor(max_workers=workers) as ex:
            futures = [
                ex.submit(scan_file, p, args.max_header, args.forward_scan, args.hash)
                for p in files
            ]
            for fut in as_completed(futures):
                try:
                    rec = fut.result()
                except Exception as e:  # one bad file must not abort the run
                    rec = new_record("<unknown>")
                    rec["verdict"] = "read_error"
                    rec["priority"] = "high"
                    rec["notes"] = f"unhandled exception: {type(e).__name__}: {e}"

                summary["scanned"] += 1
                verdict = rec.get("verdict") or "unknown"
                summary["by_verdict"][verdict] = (
                    summary["by_verdict"].get(verdict, 0) + 1
                )
                if rec.get("bad_pattern"):
                    summary["bad_pattern"] += 1
                if rec.get("priority") == "high":
                    summary["high_priority"] += 1

                log_file.write(json.dumps(rec, ensure_ascii=False) + "\n")

                n = summary["scanned"]
                if n % 100 == 0:
                    try:
                        os.fsync(log_file.fileno())
                    except OSError:
                        pass
                if args.progress_every and n % args.progress_every == 0:
                    elapsed = time.monotonic() - started
                    rate = n / elapsed if elapsed > 0 else 0.0
                    eta = (total - n) / rate if rate > 0 else 0.0
                    print(
                        f"  [{n}/{total}] {rate:6.1f} files/s  ETA {eta:6.0f}s  "
                        f"{summary['by_verdict']}",
                        flush=True,
                    )

    elapsed = time.monotonic() - started
    summary["elapsed_seconds"] = round(elapsed, 2)
    summary["files_per_second"] = (
        round(summary["scanned"] / elapsed, 2) if elapsed else 0.0
    )

    print("\nScan complete.")
    print(json.dumps(summary, indent=2, ensure_ascii=False))

    attention: list[dict[str, Any]] = []
    with open(log_path, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            r = json.loads(line)
            if r.get("verdict") not in (None, "ok"):
                attention.append(r)

    print(f"\n{len(attention)} file(s) need attention:")
    for r in sorted(attention, key=lambda r: (r.get("verdict") or "", r.get("path") or "")):
        print(
            f"  [{r.get('verdict')}] {r.get('priority')}: {r.get('path')} "
            f"-> {r.get('notes')}"
        )

    return 0


if __name__ == "__main__":
    sys.exit(main())
