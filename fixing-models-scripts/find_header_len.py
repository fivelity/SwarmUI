import struct
from pathlib import Path

files_96016 = [
    r"K:\.ai_local\SwarmUI\Models\clip\long_clip_g_hi_dream.safetensors",
    r"K:\.ai_local\SwarmUI\Models\clip_vision\clip_vision_h.safetensors",
    r"K:\.ai_local\SwarmUI\Models\checkpoints\v1-5-pruned-emaonly-fp16.safetensors",
    r"K:\.ai_local\SwarmUI\Models\Lora\Krea2\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors",
]

for p in files_96016:
    f = Path(p)
    if not f.exists():
        continue
    with open(f, "rb") as fp:
        buf = fp.read(300000)

    print("=== File:", f.name)
    current_u64 = struct.unpack("<Q", buf[:8])[0]
    print(f"Current uint64 in file: {current_u64}")

    # Let's find JSON closing braces
    # In safetensors, the JSON starts at 8 with '{'
    # Count braces starting from 8, ignoring escaped characters and strings
    in_string = False
    escape = False
    depth = 0
    end_pos = None

    for i in range(8, len(buf)):
        b = buf[i:i+1]
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
        # Check padding spaces after end_pos
        # Safetensors standard aligns to 8 bytes, padding with spaces (0x20)
        pad_end = end_pos + 1
        while pad_end < len(buf) and buf[pad_end:pad_end+1] == b" ":
            pad_end += 1
        calc_len = pad_end - 8
        print(f"Calculated header end: file offset {pad_end}, length = {calc_len}")
    else:
        print(f"Could not cleanly find closing brace in first 300KB (depth was {depth})")
