# Check ADS streams on all safetensor files
$ModelRoot = "K:\\.ai_local\\SwarmUI\\Models"
$files = Get-ChildItem -Path $ModelRoot -Filter "*.safetensors" -Recurse | Where-Object { -not $_.PsIsContainer }

Write-Host "Checking ADS streams on $($files.Count) files" -ForegroundColor Cyan
$adsCount = 0
$noCustomAdsCount = 0

foreach ($file in $files) {
    $adsStreams = Get-Item $file.FullName -Stream *
    $hasCustomAds = $false
    foreach ($stream in $adsStreams.Stream) {
        if ($stream -ne ":DATA" -and $stream -ne ":$DATA") {
            $hasCustomAds = $true
        }
    }
    if ($hasCustomAds) {
        $adsCount++
    } else {
        $noCustomAdsCount++
    }
}

Write-Host "Files with custom ADS streams: $adsCount" -ForegroundColor Yellow
Write-Host "Files without custom ADS streams: $noCustomAdsCount" -ForegroundColor Gray

# Check a few specific files for the original filename ADS
Write-Host "" -ForegroundColor Cyan
Write-Host "Checking specific files for :$originalfilename ADS:" -ForegroundColor Cyan

$checkFiles = @(
    "K:\\.ai_local\\SwarmUI\\Models\\Lora\\Krea2\\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors",
    "K:\\.ai_local\\SwarmUI\\Models\\vae\\wan_2.1_vae.safetensors"
)

foreach ($f in $checkFiles) {
    Write-Host "File: $($f.Substring($f.LastIndexOf("\\")+1))" -ForegroundColor DarkYellow
    $adsStreams = Get-Item $f -Stream *
    foreach ($stream in $adsStreams.Stream) {
        Write-Host "  Stream: $stream" -ForegroundColor Gray
        if ($stream -ne ":DATA" -and $stream -ne ":$DATA") {
            try {
                $content = Get-Content "$($f):$($stream.Substring(1))" -ErrorAction SilentlyContinue
                if ($content) {
                    Write-Host "  ADS Content: $content" -ForegroundColor Cyan
                }
            } catch {
                Write-Host "  ADS Content: Error reading - $_" -ForegroundColor Red
            }
        }
    }
}