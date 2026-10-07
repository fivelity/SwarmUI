#!/usr/bin/env python3
"""
Probe the filename-injection damage class.

For each file: locate the injected <name>.safetensors\\r\\n span, compute the
open brace/bracket depth at the damage point, derive a reconstruction, and
test whether re-inserting it yields a valid JSON header (in memory only --
the file is never written).
"""

import json
import re
import struct
import sys

FILES = [
    r"K:\.ai_local\SwarmUI\Models\clip\gemma_2_2b_fp16.safetensors",
    r"K:\.ai_local\SwarmUI\Models\clip\llama_3.1_8b_instruct_fp8_scaled.safetensors",
    r"K:\.ai_local\SwarmUI\Models\clip\gemma_3_12B_it_fp4_mixed.safetensors",
]

SPAN_RE = re.compile(rb"[A-Za-z0-9_.-]+\.safetensors\r\n")


def depth_at(buf: bytes, upto: int):
    """Open brace / bracket depth at byte index `upto`, string-aware."""
    db = cb = 0
    instr = False
    esc = False
    for ch in buf[:upto]:
        c = chr(ch)
        if instr:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                instr = False
            continue
        if c == '"':
            instr = True
        elif c == "{":
            db += 1
        elif c == "}":
            db -= 1
        elif c == "[":
            cb += 1
        elif c == "]":
            cb -= 1
    return db, cb


def main() -> int:
    any_ok = False
    for path in FILES:
        print("=" * 74)
        with open(path, "rb") as f:
            stored = struct.unpack("<Q", f.read(8))[0]
            hdr = f.read(stored)

        # Anchor at absolute offset 1024 (header-relative 1016): that is where
        # the filename injection lands. Searching greedily backwards would
        # swallow the digits of the preceding JSON number.
        m = SPAN_RE.match(hdr, 1016)
        if not m:
            m2 = SPAN_RE.search(hdr)
            if not m2:
                print(f"{path}\n  NO injected span found")
                continue
            m = m2
        s, e = m.span()
        print(path.replace("\\", "/").split("/")[-1])
        print(f"  injected span hdr[{s}:{e}] len={e - s} abs_start={s + 8}")
        print(f"  injected text : {m.group().decode()!r}")
        print(f"  hdr[-1]        : {hdr[-1:]!r}  (stored len {'VALID' if hdr[-1:] == b'}' else 'INVALID'})")

        db, cb = depth_at(hdr, s)
        print(f"  open braces={db} open brackets={cb} at damage point")
        print(f"  before: ...{hdr[s - 30:s]!r}")
        print(f"  after : {hdr[e:e + 40]!r}")

        need = e - s
        nxt = re.match(rb"([A-Za-z0-9_.]+)", hdr[e:])
        tail_key = nxt.group(1).decode() if nxt else ""
        print(f"  next key fragment: {tail_key!r}")

        # Derive candidate reconstructions: close what's open, then reopen a key.
        prefix, suffix = hdr[:s], hdr[e:]
        candidates = []
        closers = "]" * cb + "}" * db
        for layer in ["0", "1", "2", "10", "11"]:
            for tail in [
                "model.layers.%s.self_attn" % layer,
                "model.layers.%s.mlp" % layer,
                "model.layers.%s" % layer,
                "model.layers.%s.self_attn." % layer,
                "model.layers.%s.self_attn.o_proj" % layer,
            ]:
                candidates.append(closers + ',"' + tail)
                candidates.append(closers + ',"' + tail + '"')

        # Also try: derive the key prefix directly from what follows.
        # The full next key is <prefix><tail_key>; closers are fixed.

        found = None
        for cand in sorted(set(candidates), key=len):
            if len(cand) != need:
                continue
            rebuilt = prefix + cand.encode() + suffix
            try:
                obj = json.loads(rebuilt)
            except Exception:
                continue
            found = (cand, obj)
            break

        if found:
            any_ok = True
            cand, obj = found
            print(f"  *** RECONSTRUCTED with {len(cand)} bytes: {cand!r}")
            print(f"      parsed OK, {len(obj)} tensor entries, header len {len(rebuilt)}")
        else:
            print(f"  reconstruction NOT derived automatically (need {need} bytes)")
        print()

    print("RESULT:", "repairable in principle" if any_ok else "no reconstruction found")
    return 0 if any_ok else 1


if __name__ == "__main__":
    sys.exit(main())
