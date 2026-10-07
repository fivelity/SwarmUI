import os
import sys
import struct
import json
from pathlib import Path
from safetensors import safe_open

models_dir = Path(r"K:\.ai_local\SwarmUI\Models")
all_files = sorted(list(models_dir.rglob("*.safetensors")))

print(f"Total files: {len(all_files)}")

# Metrics
already_valid = []
tagged_files = []
untagged_files = []
header_len_modified = [] # Files where header length was forcibly changed to 96016

# Damage classification for tagged files:
metadata_damage_only = []
tensor_definition_damage = []
other_damage = []

for idx, f in enumerate(all_files):
    file_size = f.stat().st_size
    try:
        with open(f, "rb") as fp:
            head = fp.read(4096)
    except Exception as e:
        other_damage.append((str(f), f"File read error: {e}"))
        continue

    if len(head) < 8:
        other_damage.append((str(f), "File smaller than 8 bytes"))
        continue

    u64_len = struct.unpack("<Q", head[:8])[0]
    
    # Check if safe_open works right now
    is_valid_now = False
    try:
        with safe_open(str(f), framework="numpy") as s:
            _ = s.keys()
            is_valid_now = True
            already_valid.append(str(f))
    except Exception:
        pass

    # Check for tag at offset 1024
    name_bytes = f.name.encode("utf-8")
    tag_pos = head.find(name_bytes, 1020, 1040)
    has_tag = (tag_pos != -1)

    if has_tag:
        tagged_files.append(str(f))
    else:
        untagged_files.append(str(f))

    # Check if header length was set to 96016
    if u64_len == 96016:
        header_len_modified.append(str(f))

    # If tagged, check where offset 1024 falls
    if has_tag:
        # Check if 1024 is inside __metadata__
        # In safetensors, __metadata__ is usually the first key: {"__metadata__":{ ... }}
        meta_start = head.find(b'"__metadata__":')
        if meta_start != -1 and meta_start < tag_pos:
            # Let's see if __metadata__ ends after tag_pos
            # In safetensors JSON, __metadata__ is a dict. Let's inspect text before tag
            before_tag = head[meta_start:tag_pos]
            # If we don't see the closing of metadata before tag, it was in metadata
            # A good heuristic: does head[8:tag_pos] contain any tensor definitions?
            # Tensor definitions look like: "tensor_name":{"dtype":
            # If "dtype" has not appeared yet, 1024 is 100% inside __metadata__!
            dtype_pos = head.find(b'"dtype":', 8, tag_pos)
            if dtype_pos == -1:
                metadata_damage_only.append((str(f), tag_pos, len(name_bytes) + 2))
            else:
                tensor_definition_damage.append((str(f), tag_pos, len(name_bytes) + 2))
        else:
            tensor_definition_damage.append((str(f), tag_pos, len(name_bytes) + 2))

print("=" * 60)
print(f"Already valid right now: {len(already_valid)}")
print(f"Files tagged at 1024: {len(tagged_files)}")
print(f"Files NOT tagged at 1024: {len(untagged_files)}")
print(f"Files with header_len == 96016: {len(header_len_modified)}")
print("-" * 60)
print(f"Tagged files where damage is ONLY in __metadata__: {len(metadata_damage_only)}")
print(f"Tagged files where damage is in tensor definitions: {len(tensor_definition_damage)}")
print(f"Other damaged files: {len(other_damage)}")
print("=" * 60)

# Write full results to json
result_data = {
    "total": len(all_files),
    "already_valid_count": len(already_valid),
    "tagged_count": len(tagged_files),
    "metadata_damage_only_count": len(metadata_damage_only),
    "tensor_definition_damage_count": len(tensor_definition_damage),
    "metadata_damage_samples": [x[0] for x in metadata_damage_only[:10]],
    "tensor_damage_samples": [x[0] for x in tensor_definition_damage[:10]],
    "untagged_samples": untagged_files[:10],
}

with open(r"C:\Users\jpfive\.gemini\antigravity\brain\f2c86248-7cd3-483c-88cc-a68f5dd19dd0\scratch\scan_summary.json", "w") as out_fp:
    json.dump(result_data, out_fp, indent=2)

print("Summary written to scan_summary.json")
