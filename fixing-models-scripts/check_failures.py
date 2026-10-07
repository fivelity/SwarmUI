import os
import sys
import struct
import json
from pathlib import Path
from safetensors import safe_open

models_dir = Path(r"K:\.ai_local\SwarmUI\Models")
all_files = sorted(list(models_dir.rglob("*.safetensors")))

print(f"Total files: {len(all_files)}")

# Let's inspect why files fail
failures = []
tag_at_1024_count = 0
cr_lf_at_1024_count = 0
header_96016_count = 0

for f in all_files:
    with open(f, "rb") as fp:
        head = fp.read(4096)
    
    u64_len = struct.unpack("<Q", head[:8])[0] if len(head) >= 8 else 0
    if u64_len == 96016:
        header_96016_count += 1
    
    name_bytes = f.name.encode("utf-8")
    
    # Check if filename is at 1024
    if head[1024:].startswith(name_bytes):
        tag_at_1024_count += 1
        has_tag = True
    else:
        # Check if maybe part of the name or just \r\n is at 1024
        has_tag = False
    
    # Check if CRLF is somewhere in 1024..1200
    if b"\r\n" in head[1024:1200]:
        cr_lf_at_1024_count += 1
    
    # Try safe_open
    try:
        with safe_open(str(f), framework="numpy") as s:
            _ = s.keys()
            err = None
    except Exception as e:
        err = str(e)
        failures.append((str(f), u64_len, head[1020:1060], err))

print(f"Total failures: {len(failures)}")
print(f"Header 96016 count: {header_96016_count}")
print(f"Exact name match at 1024 count: {tag_at_1024_count}")
print(f"CRLF in 1024..1200 count: {cr_lf_at_1024_count}")

# Print first 20 failures to understand the patterns
print("\nFirst 20 failures:")
for f_path, u64_len, chunk, err in failures[:20]:
    print("-" * 50)
    print("File:", Path(f_path).name)
    print("Header Len uint64:", u64_len)
    print("Chunk around 1024:", repr(chunk))
    print("Error:", err)
