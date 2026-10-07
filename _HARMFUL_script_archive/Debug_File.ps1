# Debug the corrupted file
$file = 'K:\.ai_local\SwarmUI\Models\Lora\Krea2\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors'
$bytes = [System.IO.File]::ReadAllBytes($file)
Write-Host "File size: $($bytes.Length)" -ForegroundColor Cyan

# Write first 30 bytes as hex
Write-Host "First 30 bytes (hex):" -ForegroundColor Gray
for ($i=0; $i -lt 30 -and $i -lt $bytes.Length; $i++) {
    Write-Host "$($bytes[$i].ToString('X2')) " -ForegroundColor Gray
}
Write-Host ""

# Check if starts with safetensors marker
# Standard safetensors format has specific header
$byte0 = $bytes[0]
$byte1 = $bytes[1]
Write-Host "Byte 0: $byte0 (0x$($byte0.ToString('X2')))" -ForegroundColor Cyan
Write-Host "Byte 1: $byte1 (0x$($byte1.ToString('X2')))" -ForegroundColor Cyan
Write-Host "Byte 2: $($bytes[2].ToString('X2'))" -ForegroundColor Cyan
Write-Host "Byte 3: $($bytes[3].ToString('X2'))" -ForegroundColor Cyan

# Check for JSON start
if ($bytes[0] -eq 123) { Write-Host "Starts with '{'" -ForegroundColor Green }
if ($bytes[0] -eq 115 -and $bytes[1] -eq 97 -and $bytes[1] -eq 102 -and $bytes[2] -eq 101 -and $bytes[3] -eq 116 -and $bytes[4] -eq 111 -and $bytes[5] -eq 114 -and $bytes[6] -eq 115 -and $bytes[7] -eq 116 -and $bytes[8] -eq 111 -and $bytes[9] -eq 110 -and $bytes[10] -eq 116 -and $bytes[11] -eq 115) {
    Write-Host "Starts with 'safetensors'" -ForegroundColor Green
}

# Try to read as text
try {
    $text = [System.Text.Encoding]::.UTF8.GetString($bytes[0..100])
    Write-Host "First 100 chars as text: $text" -ForegroundColor Cyan
} catch {
    Write-Host "Cannot decode as UTF8" -ForegroundColor Red
}