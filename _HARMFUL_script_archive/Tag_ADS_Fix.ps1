# Re-tag all safetensor files with original filenames via NTFS ADS
# This ensures all files have the :$originalfilename ADS stream

$ModelRoot = "K:\\.ai_local\\SwarmUI\\Models"
$files = Get-ChildItem -Path $ModelRoot -Filter "*.safetensors" -Recurse | Where-Object { -not $_.PsIsContainer }

Write-Host "Tagging $($files.Count) files with original filenames via ADS" -ForegroundColor Cyan
Write-Host "================================================================-" -ForegroundColor Cyan

$success = 0
$failed = 0

foreach ($file in $files) {
    $currentName = $file.Name
    $adsPath = "$($file.FullName):$originalfilename"
    
    try {
        # Write the original filename (same as current name) to the ADS
        Set-Content -Path $adsPath -Value $currentName -Force
        $success++
        if ($success -le 3 -or $success % 50 -eq 1) {
            Write-Host "Tagged: $($currentName)" -ForegroundColor Green
        }
    } catch {
        $failed++
        Write-Host "FAILED: $($currentName) - $_" -ForegroundColor Red
    }
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Tagging complete:" -ForegroundColor Cyan
Write-Host "  Success: $success" -ForegroundColor Green
Write-Host "  Failed: $failed" -ForegroundColor Red
Write-Host "  Total: $($files.Count)" -ForegroundColor Cyan

# Verify a few files
Write-Host "" -ForegroundColor Cyan
Write-Host "Verification:" -ForegroundColor Cyan
Write-Host "Checking a few files for ADS integrity..." -ForegroundColor Gray

$verifyFiles = @(
    "K:\\.ai_local\\SwarmUI\\Models\\vae\\wan_2.1_vae.safetensors",
    "K:\\.ai_local\\SwarmUI\\Models\\Lora\\Krea2\\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors"
)

foreach ($filePath in $verifyFiles) {
    if (Test-Path $filePath) {
        $adsStreams = Get-Item $filePath -Stream *
        Write-Host "File: $($filePath.Substring($filePath.LastIndexOf("\\")+1))" -ForegroundColor DarkYellow
        foreach ($stream in $adsStreams.Stream) {
            Write-Host "  Stream: $stream" -ForegroundColor Gray
            if ($stream -ne ":DATA" -and $stream -ne ":$DATA") {
                try {
                    $content = Get-Content "$($filePath):$($stream.Substring(1))" -ErrorAction SilentlyContinue
                    Write-Host "  ADS Content: $content" -ForegroundColor Cyan
                } catch {
                    Write-Host "  ADS Content: Error reading" -ForegroundColor Red
                }
            }
        }
    }
}