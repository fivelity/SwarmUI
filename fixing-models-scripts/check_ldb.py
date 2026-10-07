import re
from pathlib import Path

ldb_path = Path(r"K:\.ai_local\SwarmUI\Data\model_metadata.ldb")
data = ldb_path.read_bytes()
print(f"model_metadata.ldb size: {len(data)} bytes")

# Let's search for "civitai" URLs or model IDs or hashes in the ldb
civitai_matches = set(re.findall(rb"https?://civitai\.com/[^\x00\"'\s]+", data))
print(f"CivitAI URLs found in ldb: {len(civitai_matches)}")
for m in list(civitai_matches)[:10]:
    print(" ", m.decode('utf-8', errors='ignore'))

# Check for model hashes (e.g. 64-char hex sha256 or 0x...)
hashes = set(re.findall(rb"0x[a-fA-F0-9]{64}", data))
print(f"0x SHA256 hashes found in ldb: {len(hashes)}")
for h in list(hashes)[:5]:
    print(" ", h.decode('utf-8', errors='ignore'))

raw_hashes = set(re.findall(rb"\b[a-fA-F0-9]{64}\b", data))
print(f"Raw 64-char hex hashes found in ldb: {len(raw_hashes)}")
