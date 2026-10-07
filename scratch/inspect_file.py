import struct

filepath = r'K:\.ai_local\SwarmUI\Models\diffusion_models\MysticXXX.safetensors'

with open(filepath, 'rb') as f:
    data = f.read()

print(f'File: {filepath}')
print(f'Size: {len(data)} bytes')
print(f'Byte0: {data[0]} (0x{data[0]:02x})')
print(f'Byte8: {data[8]} (0x{data[8]:02x})')
print(f'Byte1024-1030: {data[1024:1030]}')
print(f'Byte1024-1050: {data[1024:1050]}')

# Check if JSON header starts with { at byte 8
if data[8] == 123:  # 0x7B = '{'
    print('JSON header starts with { at byte 8 - GOOD')
else:
    print(f'JSON header at byte 8 is 0x{data[8]:02x} - BROKEN')

# Find the closing } of JSON header
json_start = 8
json_end = data.find(b'}', json_start)
if json_end != -1:
    header_len = json_end - json_start + 1
    print(f'JSON header length: {header_len} bytes')
    # Check if the first 8 bytes match the header length
    stored_len = struct.unpack('<Q', data[0:8])[0]
    print(f'Stored header length (bytes 0-7): {stored_len}')
    print(f'Mismatch: stored={stored_len}, actual={header_len}')
else:
    print('JSON closing } not found - header is broken')
