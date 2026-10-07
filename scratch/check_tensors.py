#!/usr/bin/env python3
import glob
import json
import os
import struct

MODEL_DIR = r"K:\.ai_local\SwarmUI\Models"
PATTERN = "**/*.safetensors"

# Safety limit for header size (prevents reading absurd values)
MAX_HEADER_SIZE = 100_000_000  # 100 MB


def iter_safetensors_files(model_dir: str, pattern: str):
    """Yield all .safetensors files under model_dir."""
    return glob.iglob(os.path.join(model_dir, pattern), recursive=True)


def read_header_info(path: str) -> tuple[bool, int, str]:
    """
    Validate safetensors header and return:
    (is_valid, header_size, error_message)

    Checks:
    - file has at least 9 bytes
    - first 8 bytes are a valid u64 header length
    - header length is sane
    - header starts with '{'
    - header is valid UTF‑8 JSON
    """
    try:
        with open(path, "rb") as f:
            prefix = f.read(8)
            if len(prefix) < 8:
                return False, 0, "File too small (< 8 bytes)"

            (header_len,) = struct.unpack("<Q", prefix)

            if header_len == 0:
                return False, header_len, "Header length is zero"

            if header_len > MAX_HEADER_SIZE:
                return False, header_len, f"Header length too large ({header_len})"

            header_bytes = f.read(header_len)
            if len(header_bytes) < header_len:
                return False, header_len, "File truncated (header incomplete)"

            if header_bytes[0] != 0x7B:  # '{'
                return False, header_len, "Header does not start with '{'"

            try:
                header_str = header_bytes.decode("utf-8")
                json.loads(header_str)
            except UnicodeDecodeError:
                return False, header_len, "Header not valid UTF‑8"
            except json.JSONDecodeError:
                return False, header_len, "Header not valid JSON"

            return True, header_len, ""

    except OSError as e:
        return False, 0, f"OS error: {e}"


def main():
    files = list(iter_safetensors_files(MODEL_DIR, PATTERN))
    total_files = len(files)

    print(f"Model directory: {MODEL_DIR}")
    print(f"Found .safetensors files: {total_files}")

    if total_files == 0:
        return

    # Preview first N files
    preview_n = min(10, total_files)
    print(f"\nChecking first {preview_n} files (preview)...")

    preview_good = 0
    preview_bad = 0

    for path in files[:preview_n]:
        is_valid, header_len, err = read_header_info(path)
        size = os.path.getsize(path)
        status = "GOOD" if is_valid else "BAD"
        print(
            f"- {status}: {path} (size={size / 1e9:.3f} GB, header_len={header_len}, err='{err}')"
        )

        if is_valid:
            preview_good += 1
        else:
            preview_bad += 1

    print("\nPreview summary:")
    print(f"  Good: {preview_good}")
    print(f"  Bad:  {preview_bad}")

    # Full scan
    print("\nChecking all files...")

    good_count = 0
    bad_count = 0
    total_size = 0
    good_size = 0
    bad_size = 0

    for path in files:
        is_valid, header_len, err = read_header_info(path)
        size = os.path.getsize(path)
        total_size += size

        if is_valid:
            good_count += 1
            good_size += size
        else:
            bad_count += 1
            bad_size += size

    good_pct = good_count / total_files * 100.0
    bad_pct = bad_count / total_files * 100.0

    print("\n=== Overall summary ===")
    print(f"Total files: {total_files}")
    print(f"Good files:  {good_count} ({good_pct:.1f}%)")
    print(f"Bad files:   {bad_count} ({bad_pct:.1f}%)")

    print("\nSizes:")
    print(f"  Total size: {total_size / 1e9:.2f} GB")
    print(f"  Good size:  {good_size / 1e9:.2f} GB")
    print(f"  Bad size:   {bad_size / 1e9:.2f} GB")


if __name__ == "__main__":
    main()
