# Check corrupted safetensors file
$file = 'K:\.ai_local\SwarmUI\Models\Lora\Krea2\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors'
$bytes = [System.IO.File]::ReadAllBytes($file)
Write-Host "File size: $($bytes.Length)" -ForegroundColor Cyan
Write-Host "First 20 bytes:" -ForegroundColor Gray
for ($i=0; $i -lt 20 -and $i -lt $bytes.Length; $i++) {
    Write-Host "$($bytes[$i]) " -ForegroundColor Gray
}
Write-Host ""
Write-Host "Last 20 bytes:" -ForegroundColor Gray
$start = [math]::max(0,$bytes.Length-20)
for ($i=$start; $i -lt $bytes.Length; $i++) {
    Write-Host "$($bytes[$i]) " -ForegroundColor Gray
}
Write-Host ""
# Check for safetensors magic (usually starts with specific bytes)
# The safetensor format has a header section
$header = $bytes[0..11] -join ""
Write-Host "First 12 bytes as string: $header" -ForegroundColor Cyan
# Check if it contains "safetensor"
if ($header -contains "safetensor" -or $bytes[0] -eq 115) {
    Write-Host "Contains 'safetensor' reference" -ForegroundColor Green
} else {
    Write-Host "Does not contain expected safetensors header" -ForegroundColor Red
}