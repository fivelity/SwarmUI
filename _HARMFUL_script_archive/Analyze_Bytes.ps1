# Analyze byte 0 distribution across all safetensor files
$ModelRoot = "K:\.ai_local\SwarmUI\Models"
$files = Get-ChildItem -Path $ModelRoot -Filter "*.safetensors" -Recurse | Where-Object { -not $_.PsIsContainer }

$byte0Counts = @{}
$totalFiles = 0

foreach ($file in $files) {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        if ($bytes.Length -ge 1) {
            $byte0 = $bytes[0]
            $totalFiles++
            if (-not $byte0Counts.ContainsKey($byte0)) {
                $byte0Counts[$byte0] = 0
            }
            $byte0Counts[$byte0]++
        }
    } catch {
        # Skip files that can't be read
    }
}

Write-Host "Byte 0 distribution across $totalFiles files:" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan

# Sort by count descending
$sortedBytes = $byte0Counts.GetEnumerator() | Sort-Object -Property value -Descending

foreach ($entry in $sortedBytes) {
    $byte0 = $entry.Key
    $count = $entry.Value
    $hex = "0x$($byte0.ToString('X2'))"
    # Check if this is a "valid" header byte (16 = 0x10)
    $isStandard = ($byte0 -eq 16)
    Write-Host "Byte 0: $hex ($byte0) - $count files $(if ($isStandard) {'[STANDARD]'} else {'[CHECK]'} )" -ForegroundColor Gray
}