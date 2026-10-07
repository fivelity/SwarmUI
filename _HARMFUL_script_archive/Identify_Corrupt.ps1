# Identify corrupted safetensor files
$ModelRoot = "K:\.ai_local\SwarmUI\Models"
$files = Get-ChildItem -Path $ModelRoot -Filter "*.safetensors" -Recurse | Where-Object { -not $_.PsIsContainer }

$corrupted = @()
$total = $files.Count

Write-Host "Scanning $total files for corruption" -ForegroundColor Cyan

foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    if ($bytes.Length -ge 1) {
        $byte0 = $bytes[0]
        # Working files have byte 0 = 16 (0x10), corrupted have byte 0 = 221 (0xDD)
        if ($byte0 -ne 16) {
            $corrupted += $file.FullName
            Write-Host "CORRUPTED: $($file.Name) - Byte 0: $byte0" -ForegroundColor Red
        }
    }
}

Write-Host "" -ForegroundColor Cyan
Write-Host "Total files: $total" -ForegroundColor Cyan
Write-Host "Corrupted files: $($corrupted.Count)" -ForegroundColor Red

if ($corrupted.Count -gt 0) {
    Write-Host "" -ForegroundColor Cyan
    Write-Host "Saving list to corrupted_files.txt" -ForegroundColor Cyan
    $corrupted | Out-File "K:\.ai_local\SwarmUI\corrupted_files.txt" -Encoding UTF8
}