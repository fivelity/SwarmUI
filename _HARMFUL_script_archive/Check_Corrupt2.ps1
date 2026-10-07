# Check corrupted file status
$file = 'K:\.ai_local\SwarmUI\Models\Lora\Krea2\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors'
$bytes = [System.IO.File]::ReadAllBytes($file)
Write-Host "Byte 0: $($bytes[0])"
Write-Host "Byte 1: $($bytes[1])"
Write-Host "Bytes 2-7: $($bytes[2..7] -join ', ')"
Write-Host "Byte 8: $($bytes[8]) (0x$($bytes[8].ToString('X2')))"
if ($bytes[8] -eq 123) { Write-Host "Byte 8 is '{'" }
else { Write-Host "Byte 8 is NOT '{'" }
"