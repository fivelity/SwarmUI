import json
import struct
from pathlib import Path

with open(r"C:\Users\jpfive\.gemini\antigravity\brain\f2c86248-7cd3-483c-88cc-a68f5dd19dd0\scratch\damage_breakdown.json") as fp:
    data = json.load(fp)

tensor_files = [Path(p) for p in data["tensor_damage_files"]]

min_header_len = 999999999
header_lens = []

for f in tensor_files:
    with open(f, "rb") as fp:
        head = fp.read(8)
    u64 = struct.unpack("<Q", head)[0]
    header_lens.append((f.name, u64))
    min_header_len = min(min_header_len, u64)

print(f"Minimum header length among 182 tensor-damaged files: {min_header_len}")
header_lens.sort(key=lambda x: x[1])
print("Smallest 10 headers:")
for name, l in header_lens[:10]:
    print(f"  {l:8d} : {name}")
