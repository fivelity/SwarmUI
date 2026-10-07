# Repair corrupted safetensor files
# The issue: ADS tagging modified the first 8 bytes of some files
# Working files have first 8 bytes: 0x10 0x77 0x01 0x00 0x00 0x00 0x00 0x00
# Corrupted files have first 8 bytes modified to other values

$corruptedFile = 'K:\.ai_local\SwarmUI\Models\Lora\Krea2\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors'

$bytes = [System.IO.File]::ReadAllBytes($corruptedFile)
Write-Host "Original file size: $($bytes.Length)" -ForegroundColor Cyan
Write-Host "First 8 bytes (decimal): " -ForegroundColor Gray
for ($i=0; $i -lt 8; $i++) { Write-Host $bytes[$i] " " } Write-Host ""
Write-Host "First 8 bytes (hex): " -ForegroundColor Gray
for ($i=0; $i -lt 8; $i++) { Write-Host "0x$($bytes[$i].ToString('X2')) " } Write-Host ""
Write-Host "Byte 8 (should be 0x7B = '{'): $($bytes[8])" -ForegroundColor Cyan

# The fix: restore the first 8 bytes to the working header pattern
# Working header: 0x10 0x77 0x01 0x00 0x00 0x00 0x00 0x00
$fixedBytes = @(16, 119, 1, 0, 0, 0, 0, 0)
Write-Host "Setting first 8 bytes to: 0x10 0x77 0x01 0x00 0x00 0x00 0x00 0x00" -ForegroundColor Cyan

# Replace the first 8 bytes
for ($i=0; $i -lt 8 -and $i -lt $bytes.Length; $i++) {
    $bytes[$i] = $fixedBytes[$i]
}
Write-Host "Writing fixed file..." -ForegroundColor Cyan
[System.IO.File]::WriteAllBytes($corruptedFile, $bytes)

# Verify the fix
$bytes2 = [System.IO.File]::ReadAllBytes($corruptedFile)
Write-Host "Verifying fixed file:" -ForegroundColor Cyan
Write-Host "First 8 bytes (decimal): " -ForegroundColor Gray
for ($i=0; $i -lt 8; $i++) { Write-Host $bytes2[$i] " " } Write-Host ""
Write-Host "Byte 8 (should be 0x7B = '{'): $($bytes2[8])" -ForegroundColor Cyan
Write-Host "First 50 bytes ASCII (printable only):" -ForegroundColor Gray
$printable = ""
for ($i=0; $i -lt 50 -and $i -lt $bytes2.Length; $i++) {
    if ($bytes2[$i] -ge 32 -and $bytes2[$i] -le 126) {
        $printable += [char]$bytes2[$i]
    } else {
        $printable += "."
    }
}
Write-Host $printable -ForegroundColor Gray