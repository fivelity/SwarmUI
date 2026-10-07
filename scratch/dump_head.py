#!/usr/bin/env python3
"""Hex/text dump of the first bytes of a file, for manual verification."""
import sys

path = sys.argv[1]
n = int(sys.argv[2]) if len(sys.argv) > 2 else 512
off = int(sys.argv[3]) if len(sys.argv) > 3 else 0

with open(path, "rb") as f:
    f.seek(off)
    data = f.read(n)

print(f"file   : {path}")
print(f"offset : {off}   showing {len(data)} bytes\n")

for i in range(0, len(data), 16):
    row = data[i : i + 16]
    hexpart = " ".join(f"{b:02x}" for b in row).ljust(47)
    text = "".join(chr(b) if 32 <= b < 127 else "." for b in row)
    print(f"{off + i:08x}  {hexpart}  |{text}|")

# First 120 chars of anything JSON-looking
try:
    head = data.decode("utf-8", errors="ignore")
    if head.startswith("{"):
        print(f"\nfirst 200 chars of header text:\n{head[:200]}")
    else:
        print(f"\ndoes NOT start with '{{'  first byte = {data[0]!r} = {data[0] if data else None}")
except Exception as e:
    print(f"\ndecode error: {e}")
