# Check all files current header status
$ModelRoot = "K:\\.ai_local\\SwarmUI\\Models"
$files = Get-ChildItem -Path $ModelRoot -Filter "*.safetensors" -Recurse | Where-Object { -not $_.PsIsContainer }

Write-Host "Checking " $files.Count " files" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan

$good = 0
$different_header = 0
$problematic = 0

foreach ($file in $files) {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        if ($bytes.Length -ge 9) {
            $byte0 = $bytes[0]
            $byte8 = $bytes[8]
            
            if ($byte0 -eq 16 -and $byte8 -eq 123) {
                $good++
            }
            elseif ($byte8 -eq 123) {
                $different_header++
            }
            else {
                $problematic++
            }
        }
        else {
            $problematic++
        }
    }
    catch {
        $problematic++
    }
}

Write-Host "Files with standard header (0x10 0x77 0x01 ...): $good" -ForegroundColor Green
Write-Host "Files with JSON header at byte 8 but different first 8 bytes: $different_header" -ForegroundColor Yellow
Write-Host "Files with problematic headers (byte 8 != 123): $problematic" -ForegroundColor Red
Write-Host "Total: " ($good + $different_header + $problematic) -ForegroundColor Cyan