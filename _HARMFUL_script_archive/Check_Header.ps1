# Check safetensor file header
$file = 'K:\.ai_local\SwarmUI\Models\Lora\Krea2\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors'
$bytes = [System.IO.File]::ReadAllBytes($file)
Write-Host "File size: $($bytes.Length)" -ForegroundColor Cyan
Write-Host "Byte 0: $($bytes[0])" -ForegroundColor Gray
Write-Host "Byte 1: $($bytes[1])" -ForegroundColor Gray
Write-Host "Byte 2: $($bytes[2])" -ForegroundColor Gray
Write-Host "Byte 3: $($bytes[3])" -ForegroundColor Gray
# Check if starts with '{' (123)
if ($bytes[0] -eq 123) { Write-Host "Starts with JSON '{'" -ForegroundColor Green }
else { Write-Host "Does not start with JSON {" -ForegroundColor Red }
# Check if it's a safetensors file by looking for common patterns
# The safetensors format usually has a JSON header with tensors info
$asciiChars = [System.Text.Encoding]::ASCII.GetString($bytes[0..20]) -replace '[^x20-x7E]', '.'
Write-Host "First 20 as ASCII: $asciiChars" -ForegroundColor Gray