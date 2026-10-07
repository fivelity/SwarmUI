# Verify the repair - simplest version
$file = 'K:\\.ai_local\\SwarmUI\\Models\\Lora\\Krea2\\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors'
$bytes = [System.IO.File]::ReadAllBytes($file)
Write-Host "FileSize=" $bytes.Length
Write-Host "Byte0=" $bytes[0]
Write-Host "Byte8=" $bytes[8]
if ($bytes[8] -eq 123) { Write-Host "GOOD: Byte8 is 123 (char `{`)" }
else { Write-Host "BAD: Byte8 is not 123" }