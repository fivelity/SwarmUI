# Assess ALL 796 files - check byte 0 and byte 8
# This will tell us which files have valid JSON headers vs. which are broken

$ModelRoot = "K:\\.ai_local\\SwarmUI\\Models"
$files = Get-ChildItem -Path $ModelRoot -Filter "*.safetensors" -Recurse | Where-Object { -not $_.PsIsContainer }

Write-Host "Assessing " $files.Count " files..." -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$good = 0        # Byte0=16 AND Byte8=123 (standard header, definitely working)
$json_only = 0   # Byte8=123 but Byte0 != 16 (JSON header intact, different format)
$broken = 0      # Byte8 != 123 (JSON header broken)
$total_bytes_check = 0

foreach ($file in $files) {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        if ($bytes.Length -ge 9) {
            $total_bytes_check++
            $byte0 = $bytes[0]
            $byte8 = $bytes[8]
            
            if ($byte0 -eq 16 -and $byte8 -eq 123) {
                $good++
                $status = "STANDARD repaired"
            }
            elseif ($byte8 -eq 123) {
                $json_only++
                $status = "JSON header OK, byte0=$byte0 (different format)"
            }
            else {
                $broken++
                $status = "BROKEN - byte8=$byte8 (no JSON header start)"
            }
        }
        else {
            $broken++
            $status = "TOO SMALL"
        }
    }
    catch {
        $broken++
        $status = "ERROR: $($_.Exception.Message)"
    }
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "RESULTS:" -ForegroundColor Cyan
Write-Host "  Files with standard repaired header (Byte0=16, Byte8=123): $good" -ForegroundColor Green
Write-Host "  Files with JSON header intact but different format (Byte8=123): $json_only" -ForegroundColor Yellow
Write-Host "  Files with BROKEN headers (Byte8 != 123): $broken" -ForegroundColor Red
Write-Host "  Total assessed: $total_bytes_check" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# List files in each category
Write-Host "" -ForegroundColor Cyan
Write-Host "FILES WITH STANDARD REPAIRED HEADER:" -ForegroundColor Green
$files | ForEach-Object {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        if ($bytes.Length -ge 9 -and $bytes[0] -eq 16 -and $bytes[8] -eq 123) {
            Write-Host "  $($file.Name)"
        }
    } catch { }
} | Select-Object -First 20

Write-Host "" -ForegroundColor Cyan
Write-Host "FILES WITH JSON HEADER INTACT (different format):" -ForegroundColor Yellow
$files | ForEach-Object {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        if ($bytes.Length -ge 9 -and $bytes[8] -eq 123 -and $bytes[0] -ne 16) {
            Write-Host "  $($file.Name)"
        }
    } catch { }
} | Select-Object -First 20

Write-Host "" -ForegroundColor Cyan
Write-Host "FILES WITH BROKEN HEADERS (listed first 20):" -ForegroundColor Red
$files | ForEach-Object {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        if ($bytes.Length -ge 9 -and $bytes[8] -ne 123) {
            Write-Host "  $($file.Name) - Byte8: $($bytes[8])"
        }
    } catch { }
} | Select-Object -First 20