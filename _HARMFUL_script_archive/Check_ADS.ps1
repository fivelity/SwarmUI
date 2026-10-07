# Check ADS streams on safetensor files
$ModelRoot = "K:\.ai_local\SwarmUI\Models"
$files = Get-ChildItem -Path $ModelRoot -Filter "*.safetensors" -Recurse | Where-Object { -not $_.PsIsContainer }
Write-Host "Checking ADS streams on $($files.Count) files" -ForegroundColor Cyan

# Check a sample of files for ADS streams
$sample = $files | Sort-Object { [Guid]::NewGuid() } | Select-Object -First 10
foreach ($file in $sample) {
    $adsStreams = Get-Item $file.FullName -Stream *
    Write-Host "File: $($file.Name) - Streams: $($adsStreams.Count)" -ForegroundColor DarkYellow
    foreach ($stream in $adsStreams.Stream) {
        if ($stream -ne ":$DATA") {
            Write-Host "  ADS: $stream" -ForegroundColor Cyan
        }
    }
}