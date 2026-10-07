# Verify the repair - simpler version
$file = 'K:\\.ai_local\\SwarmUI\\Models\\Lora\\Krea2\\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors'
$bytes = [System.IO.File]::ReadAllBytes($file)
Write-Host "File size: $($bytes.Length)" -ForegroundColor Cyan
Write-Host "First 8 bytes (decimal): " -ForegroundColor Gray
for ($i=0; $i -lt 8; $i++) { Write-Host $bytes[$i] " " } Write-Host ""
Write-Host "First 8 bytes (hex): " -ForegroundColor Gray
for ($i=0; $i -lt 8; $i++) { Write-Host "0x" + $bytes[$i].ToString("X2") + " " } Write-Host ""
Write-Host "Byte 8: " $bytes[8] " (0x" + $bytes[8].ToString("X2") + ")"
if ($bytes[8] -eq 123) { Write-Host "JSON header starts with `'{`'' -ForegroundColor Green }
else { Write-Host "JSON header does NOT start with `'{`'' -ForegroundColor Red }