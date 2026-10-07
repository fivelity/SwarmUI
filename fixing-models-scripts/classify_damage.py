import os
import sys
import struct
import json
from pathlib import Path

models_dir = Path(r"K:\.ai_local\SwarmUI\Models")
all_files = sorted(list(models_dir.rglob("*.safetensors")))

meta_damage = []
tensor_damage = []
no_tag = []

for f in all_files:
    with open(f, "rb") as fp:
        head = fp.read(4096)
    
    # Check if tagged at 1024
    if head[1024:].startswith(f.name.encode("utf-8")):
        tag_len = len(f.name.encode("utf-8")) + 2 # include \r\n
        # Check where the tag falls
        # In safetensors, __metadata__ is at the beginning
        # Let's see if '__metadata__' is present and where its key starts
        meta_pos = head.find(b'"__metadata__":')
        if meta_pos != -1 and meta_pos < 1024:
            # Let's see if tensor definitions (keys outside __metadata__) appear before 1024
            # We can check if any tensor field appears before 1024: '"data_offsets":' or '"dtype":'
            # Note: __metadata__ usually doesn't have "data_offsets"
            has_offsets_before_1024 = (head.find(b'"data_offsets":', 0, 1024) != -1)
            if not has_offsets_before_1024:
                meta_damage.append((str(f), tag_len))
            else:
                tensor_damage.append((str(f), tag_len))
        else:
            tensor_damage.append((str(f), tag_len))
    else:
        no_tag.append(str(f))

print(f"Total files: {len(all_files)}")
print(f"Files with NO tag at 1024: {len(no_tag)}")
print(f"Files where 1024 damage is ONLY inside __metadata__: {len(meta_damage)}")
print(f"Files where 1024 damage is inside tensor definitions: {len(tensor_damage)}")

# Save detailed lists
out = {
    "no_tag": no_tag,
    "metadata_damage_count": len(meta_damage),
    "metadata_damage_files": [x[0] for x in meta_damage],
    "tensor_damage_count": len(tensor_damage),
    "tensor_damage_files": [x[0] for x in tensor_damage],
}

with open(r"C:\Users\jpfive\.gemini\antigravity\brain\f2c86248-7cd3-483c-88cc-a68f5dd19dd0\scratch\damage_breakdown.json", "w") as fp:
    json.dump(out, fp, indent=2)

print("Saved to damage_breakdown.json")
