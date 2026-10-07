#!/usr/bin/env python3
"""Unit tests for scan_safetensors detection helpers on synthetic files."""

import json
import os
import struct
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import scan_safetensors as S

FAILS = []


def check(name, cond, detail=""):
    if cond:
        print(f"  PASS  {name}")
    else:
        print(f"  FAIL  {name} {detail}")
        FAILS.append(name)


def make_header(n_tensors=3, metadata=None, indent=None, ensure_ascii=True):
    h = {}
    if metadata is not None:
        h["__metadata__"] = metadata
    for i in range(n_tensors):
        h[f"tensor.{i}"] = {
            "dtype": "F16",
            "shape": [2, 2],
            "data_offsets": [i * 8, i * 8 + 8],
        }
    return json.dumps(h, indent=indent, ensure_ascii=ensure_ascii).encode("utf-8")


def write(path, *chunks):
    with open(path, "wb") as f:
        for c in chunks:
            f.write(c)


def run(path, **kw):
    kw.setdefault("max_header", 16 * 1024 * 1024)
    kw.setdefault("forward_scan", 4 * 1024 * 1024)
    kw.setdefault("do_hash", False)
    return S.scan_file(path, kw["max_header"], kw["forward_scan"], kw["do_hash"])


tmp = tempfile.mkdtemp(prefix="safetest_")
print(f"tmp = {tmp}\n")

# --- 1. healthy file -------------------------------------------------------
p = os.path.join(tmp, "healthy.safetensors")
hdr = make_header(metadata={"format": "pt"})
tensor_blob = bytes(range(256)) * 64  # full of control bytes and 0x7B/0x7D
write(p, struct.pack("<Q", len(hdr)), hdr, tensor_blob)
r = run(p)
check("healthy: verdict ok", r["verdict"] == "ok", r)
check("healthy: true len correct", r["true_header_len"] == len(hdr),
      f'got {r["true_header_len"]} want {len(hdr)}')
check("healthy: stored==true", r["stored_header_len"] == len(hdr))
check("healthy: offset 8", r["detected_header_offset"] == 8)
check("healthy: shape ok", r["header_shape_ok"] is True)

# --- 2. bad 8-byte pattern, header otherwise intact ------------------------
p = os.path.join(tmp, "badpattern.safetensors")
hdr = make_header(n_tensors=50)
write(p, S.BAD_PATTERN, hdr, tensor_blob)
r = run(p)
check("badpattern: byte8==123", r["byte8"] == 123)
check("badpattern: bad_pattern flag", r["bad_pattern"] is True)
check("badpattern: verdict rewrite_stored_len", r["verdict"] == "rewrite_stored_len", r)
check("badpattern: new_len correct", r["candidate_fix"] is not None
      and r["candidate_fix"]["new_value"] == len(hdr),
      f'got {r.get("candidate_fix")}')
check("badpattern: old_value 96016", r["candidate_fix"]["old_value"] == 96016,
      f'got {r["candidate_fix"]["old_value"]}')
check("badpattern: priority high", r["priority"] == "high")

# --- 3. stored length too SMALL (truncated view) ---------------------------
p = os.path.join(tmp, "toosmall.safetensors")
hdr = make_header(n_tensors=20)
write(p, struct.pack("<Q", 100), hdr, tensor_blob)
r = run(p)
check("stored-small: rewrite verdict", r["verdict"] == "rewrite_stored_len", r)
check("stored-small: correct new len", r["true_header_len"] == len(hdr),
      f'got {r["true_header_len"]} want {len(hdr)}')

# --- 4. stored length too LARGE -------------------------------------------
p = os.path.join(tmp, "toolarge.safetensors")
hdr = make_header(n_tensors=20)
write(p, struct.pack("<Q", len(hdr) + 5000), hdr, tensor_blob)
r = run(p)
check("stored-large: rewrite verdict", r["verdict"] == "rewrite_stored_len", r)
check("stored-large: correct new len", r["true_header_len"] == len(hdr),
      f'got {r["true_header_len"]} want {len(hdr)}')

# --- 5. non-ASCII header: byte length must not be char length --------------
p = os.path.join(tmp, "utf8.safetensors")
hdr = make_header(metadata={"name": "モデル-v2", "note": "café ✓"},
                  ensure_ascii=False)
assert len(hdr) != len(hdr.decode("utf-8")), "test bug: header not multibyte"
write(p, struct.pack("<Q", 123456), hdr, tensor_blob)
r = run(p)
check("utf8: byte length exact", r["true_header_len"] == len(hdr),
      f'got {r["true_header_len"]} want {len(hdr)} '
      f'(chars={len(hdr.decode())}, bytes={len(hdr)})')
check("utf8: verdict rewrite", r["verdict"] == "rewrite_stored_len", r)
check("utf8: parses cleanly", r["header_shape_ok"] is True)

# --- 6. byte8 != 123, displaced header ------------------------------------
p = os.path.join(tmp, "displaced.safetensors")
hdr = make_header(n_tensors=10)
garbage = bytes([0x41, 0x7B, 0x00, 0xFF, 0x01]) * 100  # contains stray '{'
write(p, struct.pack("<Q", 0), b"\x00\x01\x02\x03\x04\x05\x06\x07",
     garbage, hdr, tensor_blob)
r = run(p)
check("displaced: verdict", r["verdict"] == "displaced_header", r)
check("displaced: offset > 8", r["detected_header_offset"] is not None
      and r["detected_header_offset"] > 8, r)
check("displaced: len exact", r["true_header_len"] == len(hdr), r)
check("displaced: priority high", r["priority"] == "high")

# --- 7. header with indentation (JSON whitespace/newlines) -----------------
p = os.path.join(tmp, "pretty.safetensors")
hdr = make_header(n_tensors=4, indent=2)
write(p, struct.pack("<Q", 999999), hdr, tensor_blob)
r = run(p)
check("pretty: verdict rewrite", r["verdict"] == "rewrite_stored_len", r)
check("pretty: len exact", r["true_header_len"] == len(hdr),
      f'got {r["true_header_len"]} want {len(hdr)}')

# --- 8. truly unrecoverable ------------------------------------------------
p = os.path.join(tmp, "junk.safetensors")
write(p, bytes([0x10, 0x77, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00]),
     bytes([0x00, 0xFF, 0x13, 0x37] * 4096))
r = run(p)
check("junk: verdict unrecoverable", r["verdict"] == "unrecoverable", r)
check("junk: bad_pattern", r["bad_pattern"] is True)
check("junk: byte8 != 123", r["byte8"] != 123)
check("junk: priority high", r["priority"] == "high")

# --- 9. tiny file ----------------------------------------------------------
p = os.path.join(tmp, "tiny.safetensors")
write(p, b"\x01\x02")
r = run(p)
check("tiny: verdict too_small", r["verdict"] == "too_small", r)

# --- 10. tensor blob starting with bytes that could fake a header ----------
p = os.path.join(tmp, "sneaky.safetensors")
hdr = make_header(n_tensors=2)
# tensor data begins with '{"fake": {"data_offsets": [0, 8]}}' then junk
fake = json.dumps({"fake": {"dtype": "F16", "shape": [1], "data_offsets": [0, 8]}}).encode()
write(p, S.BAD_PATTERN, hdr, fake, tensor_blob)
r = run(p)
check("sneaky: stage-1 wins with real header", r["verdict"] == "rewrite_stored_len", r)
check("sneaky: true len is real header", r["true_header_len"] == len(hdr),
      f'got {r["true_header_len"]} want {len(hdr)}')

# --- 11. helper: decode_json_prefix on trailing junk -----------------------
hdr = make_header()
for junk in (b"", tensor_blob, b"\xff\xfe\x00\x7b{}", b"x" * 1000):
    got = S.decode_json_prefix(hdr + junk)
    check(f"decode_json_prefix ignores {junk[:6]!r}", got == len(hdr), f"got {got}")

# --- 12. helpers: starts_like_json / screen_candidate ----------------------
check("starts_like_json: json start ok", S.starts_like_json(hdr[:64]) is True)
check("starts_like_json: tensor junk rejected",
      S.starts_like_json(tensor_blob[:64]) is False)
check("starts_like_json: non-{ rejected", S.starts_like_json(b"ABCD") is False)
check("starts_like_json: pretty-printed ok",
      S.starts_like_json(make_header(indent=2)[:64]) is True)

# A short header (< PROBE_BYTES) followed by tensor data must still screen
# True -- this is the regression the first version of the screen got wrong.
short_hdr = make_header(n_tensors=2)
assert len(short_hdr) < S.PROBE_BYTES, "test bug: header should be short"
check("screen_candidate: short header + tensor tail accepted",
      S.screen_candidate(short_hdr + tensor_blob) is True)
check("screen_candidate: raw tensor noise rejected",
      S.screen_candidate(tensor_blob[:S.PROBE_BYTES]) is False)
check("screen_candidate: lone { is inconclusive",
      S.screen_candidate(b"{") is None)

# Escaped quote and escaped control chars inside string values must not
# confuse the region-bounding logic (raw_decode handles them natively).
esc_hdr = json.dumps(
    {"__metadata__": {"q": 'say "hi"', "n": "line\nbreak", "t": "tab\there"}},
    ensure_ascii=False,
).encode("utf-8")
p = os.path.join(tmp, "escaped.safetensors")
write(p, struct.pack("<Q", 7), esc_hdr, tensor_blob)
r = run(p)
check("escaped: byte length exact", r["true_header_len"] == len(esc_hdr),
      f'got {r["true_header_len"]} want {len(esc_hdr)}')
check("escaped: verdict rewrite", r["verdict"] == "rewrite_stored_len", r)

print()
if FAILS:
    print(f"{len(FAILS)} FAILURE(S): {FAILS}")
    sys.exit(1)
print("ALL TESTS PASSED")
