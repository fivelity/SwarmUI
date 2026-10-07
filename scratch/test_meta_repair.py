import json
import struct
from pathlib import Path
from safetensors import safe_open

with open(r"C:\Users\jpfive\antigravity\brain\f2c86248-7cd3-483c-88cc-a68f5dd19dd0\scratch\damage_breakdown.json".replace("jpfive\\", "jpfive\\.gemini\\")) as fp:
    data = json.load(fp)

meta_files = [Path(p) for p in data["metadata_damage_files"]]

def test_repair(f):
    with open(f, "rb") as fp:
        head = bytearray(fp.read(300000))
    
    name_bytes = f.name.encode("utf-8")
    
    # 1. Replace the tag at 1024 with spaces
    # Check if 1024 starts with name_bytes
    if head[1024:].startswith(name_bytes):
        # find where \r\n ends
        end_idx = 1024 + len(name_bytes)
        if head[end_idx:end_idx+2] == b"\r\n":
            end_idx += 2
        elif head[end_idx:end_idx+1] == b"\n":
            end_idx += 1
        
        # Replace with spaces
        head[1024:end_idx] = b" " * (end_idx - 1024)
    
    # 2. Check header length
    u64_len = struct.unpack("<Q", head[:8])[0]
    
    # Try parsing json with current u64_len
    json_bytes = head[8:8+u64_len]
    try:
        parsed = json.loads(json_bytes.decode("utf-8"))
        return True, "Valid with existing length"
    except Exception as e:
        # Maybe length was modified to 96016? Try finding real closing brace
        in_string = False
        escape = False
        depth = 0
        end_pos = None
        for i in range(8, len(head)):
            b = head[i:i+1]
            if in_string:
                if escape:
                    escape = False
                elif b == b"\\":
                    escape = True
                elif b == b'"':
                    in_string = False
            else:
                if b == b'"':
                    in_string = True
                elif b == b"{":
                    depth += 1
                elif b == b"}":
                    depth -= 1
                    if depth == 0:
                        end_pos = i
                        break
        if end_pos is not None:
            # account for space padding
            pad_end = end_pos + 1
            while pad_end < len(head) and head[pad_end:pad_end+1] == b" ":
                pad_end += 1
            calc_len = pad_end - 8
            try:
                parsed = json.loads(head[8:8+calc_len].decode("utf-8"))
                return True, f"Valid after fixing length from {u64_len} to {calc_len}"
            except Exception as e2:
                return False, f"Failed parse with calc_len {calc_len}: {e2}"
        return False, f"Could not find closing brace: {e}"

print("Testing repair logic on 20 sample metadata-damaged files:")
success_count = 0
for f in meta_files[:20]:
    ok, msg = test_repair(f)
    print(f"  {f.name[:35]:35}: {ok} ({msg})")
    if ok: success_count += 1

print(f"\nResult: {success_count}/20 successful!")
