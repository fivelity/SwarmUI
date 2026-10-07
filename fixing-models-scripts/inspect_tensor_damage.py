import json
from pathlib import Path
from collections import Counter

with open(r"C:\Users\jpfive\.gemini\antigravity\brain\f2c86248-7cd3-483c-88cc-a68f5dd19dd0\scratch\damage_breakdown.json") as fp:
    data = json.load(fp)

tensor_files = data["tensor_damage_files"]
print(f"Total tensor-damaged files: {len(tensor_files)}")

# Group by parent directory relative to Models
parents = []
for p in tensor_files:
    rel = Path(p).relative_to(r"K:\.ai_local\SwarmUI\Models")
    parents.append(str(rel.parent))

c = Counter(parents)
print("\nBreakdown by folder:")
for folder, count in c.most_common():
    print(f"  {folder:40}: {count}")

print("\nSample files in tensor damage:")
for p in tensor_files[:15]:
    print(" ", Path(p).relative_to(r"K:\.ai_local\SwarmUI\Models"))
