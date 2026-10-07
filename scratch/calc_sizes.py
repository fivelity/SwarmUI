import json
from pathlib import Path

with open(r"C:\Users\jpfive\.gemini\antigravity\brain\f2c86248-7cd3-483c-88cc-a68f5dd19dd0\scratch\damage_breakdown.json") as fp:
    data = json.load(fp)

no_tag = [Path(p) for p in data["no_tag"]]
meta = [Path(p) for p in data["metadata_damage_files"]]
tensor = [Path(p) for p in data["tensor_damage_files"]]

def get_total_gb(file_list):
    total = sum(f.stat().st_size for f in file_list if f.exists())
    return total / (1024**3)

gb_no_tag = get_total_gb(no_tag)
gb_meta = get_total_gb(meta)
gb_tensor = get_total_gb(tensor)
gb_total = gb_no_tag + gb_meta + gb_tensor

print(f"Total library size: {gb_total:.2f} GB across 796 files")
print("-" * 50)
print(f"1. No tag / undamaged at 1024:    {len(no_tag):3d} files | {gb_no_tag:7.2f} GB")
print(f"2. Metadata-only damage (REPAIRABLE LOCALLY): {len(meta):3d} files | {gb_meta:7.2f} GB")
print(f"3. Tensor-definition damage:      {len(tensor):3d} files | {gb_tensor:7.2f} GB")
print("=" * 50)
print(f"Locally fixable right now: {len(no_tag) + len(meta)} files ({(gb_no_tag + gb_meta):.2f} GB, {((gb_no_tag + gb_meta)/gb_total)*100:.1f}% of total data!)")
print(f"Needs re-downloading / CivitAI fetch: {len(tensor)} files ({gb_tensor:.2f} GB, {(gb_tensor/gb_total)*100:.1f}%)")
