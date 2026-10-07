# Compare file headers
$file1 = 'K:\.ai_local\SwarmUI\Models\vae\wan_2.1_vae.safetensors'
$file2 = 'K:\.ai_local\SwarmUI\Models\Lora\Krea2\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors'

$bytes1 = [System.IO.File]::ReadAllBytes($file1)
$bytes2 = [System.IO.File]::ReadAllBytes($file2)

Write-Host "File 1 (wan_2.1_vae):" -ForegroundColor Cyan
Write-Host "  Size: $($bytes1.Length)" -ForegroundColor Gray
Write-Host "  Byte 0: $($bytes1[0])" -ForegroundColor Gray
Write-Host "  Byte 1: $($bytes1[1])" -ForegroundColor Gray
Write-Host "  Byte 2: $($bytes1[2])" -ForegroundColor Gray
Write-Host "  Byte 3: $($bytes1[3])" -ForegroundColor Gray
$ascii1 = [System.Text.Encoding]::ASCII.GetString($bytes1[0..15]) -replace '[^x20-x7E]', '.'
Write-Host "  First 15 ASCII: $ascii1" -ForegroundColor Gray

Write-Host "" -ForegroundColor Cyan
Write-Host "File 2 (Krea2 corrupted):" -ForegroundColor Cyan
Write-Host "  Size: $($bytes2.Length)" -ForegroundColor Gray
Write-Host "  Byte 0: $($bytes2[0])" -ForegroundColor Gray
Write-Host "  Byte 1: $($bytes2[1])" -ForegroundColor Gray
Write-Host "  Byte 2: $($bytes2[2])" -ForegroundColor Gray
Write-Host "  Byte 3: $($bytes2[3])" -ForegroundColor Gray
$ascii2 = [System.Text.Encoding]::ASCII.GetString($bytes2[0..15]) -replace '[^x20-x7E]', '.'
Write-Host "  First 15 ASCII: $ascii2" -ForegroundColor Gray