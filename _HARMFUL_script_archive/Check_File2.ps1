# Check corrupted safetensors file - v2
$file = 'K:\.ai_local\SwarmUI\Models\Lora\Krea2\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors'
$bytes = [System.IO.File]::ReadAllBytes($file)
Write-Host "File size: $($bytes.Length)" -ForegroundColor Cyan

# Try UTF-8 with BOM detection
try {
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    Write-Host "UTF-8 decodable: Yes" -ForegroundColor Green
    Write-Host "First 200 chars:" -ForegroundColor Gray
    Write-Host $bytes[0..199] | % { [char]$_ } -ForegroundColor Gray
} catch {
    Write-Host "UTF-8 decodable: No" -ForegroundColor Red
}

# Check for safetensors magic bytes
# The safetensors format starts with a JSON-like header
$headerBytes = $bytes[0..20]
$headerHex = [BitConverter]::ToString($headerBytes).Replace("-", "")
Write-Host "Header hex: $headerHex" -ForegroundColor Cyan

# Look for common patterns
$asString = [System.Text.Encoding]::ASCII.GetString($bytes[0..100]) -replace '[^x20-x7E]', '.'
Write-Host "First 100 chars ASCII: $asString" -ForegroundColor Gray

# Try to find { or " at the start
if ($bytes[0] -eq 123) { Write-Host "Starts with '{'" -ForegroundColor Green }
if ($bytes[1] -eq 34) { Write-Host "Second byte is '\"'" -ForegroundColor Green }