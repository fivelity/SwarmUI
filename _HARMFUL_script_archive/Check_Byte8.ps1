# Check byte 8 for all files
$ModelRoot = "K:\\.ai_local\\SwarmUI\\Models"
$files = Get-ChildItem -Path $ModelRoot -Filter "*.safetensors" -Recurse | Where-Object { -not $_.PsIsContainer }

Write-Host "Checking byte 8 (JSON header start) on " $files.Count " files" -ForegroundColor Cyan

$byte8_123 = 0
$byte8_not_123 = 0

foreach ($file in $files) {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        if ($bytes.Length -ge 9) {
            $b8 = $bytes[8]
            if ($b8 -eq 123) {
                $byte8_123++
            }
            else {
                $byte8_not_123++
            }
        }
        else {
            $byte8_not_123++
        }
    }
    catch {
        $byte8_not_123++
    }
}

Write-Host "" -ForegroundColor Cyan
Write-Host "Files with Byte8=123 (JSON header starts with {): $byte8_123" -ForegroundColor Green
Write-Host "Files with Byte8!=123 (BROKEN): $byte8_not_123" -ForegroundColor Red
Write-Host "" -ForegroundColor Cyan
Write-Host "KEY INSIGHT: Byte8=123 means the JSON header '{' starts at byte 8" -ForegroundColor Yellow
Write-Host "This is the most critical indicator of whether a safetensor file can be loaded" -ForegroundColor Yellow
Write-Host "Files with Byte8=123 should be loadable in ComfyUI regardless of Byte0 value" -ForegroundColor Yellow
Write-Host "Files with Byte8!=123 are genuinely broken" -ForegroundColor Red