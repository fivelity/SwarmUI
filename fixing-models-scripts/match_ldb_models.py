import re
from pathlib import Path

ldb_path = Path(r"K:\.ai_local\SwarmUI\Data\model_metadata.ldb")
data = ldb_path.read_bytes()

# Search for all strings matching model filenames or paths
# All .safetensors filenames in Models:
models_dir = Path(r"K:\.ai_local\SwarmUI\Models")
all_files = sorted(list(models_dir.rglob("*.safetensors")))

found_in_ldb = 0
for f in all_files:
    # search for filename in ldb
    name_bytes = f.name.encode("utf-8")
    if name_bytes in data:
        found_in_ldb += 1

print(f"Total .safetensors files: {len(all_files)}")
print(f"Files found in model_metadata.ldb: {found_in_ldb} / {len(all_files)} ({(found_in_ldb/len(all_files))*100:.1f}%)")
