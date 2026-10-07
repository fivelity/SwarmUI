#!/usr/bin/env python3
"""
Safetensor Header Repair Script

This script repairs corrupted safetensor files by:
1. Recalculating the actual JSON header length from the closing '}'
2. Writing the correct header length to bytes 0-7 (uint64 little-endian)
3. Replacing the corrupted filename at byte 1024 with spaces

The actual tensor weights (the gigabytes of data) are NOT touched.
Only the first 8 bytes (header length) and bytes 1024-1040 (corrupted filename) are modified.

This fixes files where:
- Byte8 = 123 (0x7B) - JSON header starts with '{' (intact)
- Byte0-7 contain an incorrect header length
- Byte1024-1040 contain the original filename instead of JSON data
"""

import os
import struct
import glob
import json
import sys
from pathlib import Path

# Configuration
MODEL_DIR = r'K:\.ai_local\SwarmUI\Models'
DRY_RUN = True  # Set to False to actually modify files
BACKUP_DIR = r'K:\.ai_local\SwarmUI\scratch\backups'
LOG_FILE = r'K:\.ai_local\SwarmUI\scratch\repair_log.txt'

# Statistics
stats = {
    'total': 0,
    'fixed': 0,
    'skipped': 0,
    'errors': 0,
    'already_ok': 0,
    'broken': 0,
    'bytes_fixed': 0,
}
