# Verify ADS streams
Write-Host "=== Verifying ADS streams ===" -ForegroundColor Cyan

$file1 = "K:\\.ai_local\\SwarmUI\\Models\\vae\\wan_2.1_vae.safetensors"
$file2 = "K:\\.ai_local\\SwarmUI\\Models\\Lora\\Krea2\\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors"

Write-Host "File 1: $file1" -ForegroundColor Yellow
$adsStreams1 = Get-Item $file1 -Stream *
Write-Host "  Streams: $($adsStreams1.Count)" -ForegroundColor Gray
foreach ($stream in $adsStreams1.Stream) {
    Write-Host "    Stream: $stream" -ForegroundColor Gray
    if ($stream -ne ":DATA" -and $stream -ne ":$DATA") {
        try {
            $content = Get-Content "$($file1):$($stream.Substring(1))" -ErrorAction SilentlyContinue
            Write-Host "    Content: `"$content`"" -ForegroundColor Cyan
        } catch {
            Write-Host "    Content: Error - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "" -ForegroundColor Yellow
Write-Host "File 2: $file2" -ForegroundColor Yellow
$adsStreams2 = Get-Item $file2 -Stream *
Write-Host "  Streams: $($adsStreams2.Count)" -ForegroundColor Gray
foreach ($stream in $adsStreams2.Stream) {
    Write-Host "    Stream: $stream" -ForegroundColor Gray
    if ($stream -ne ":DATA" -and $stream -ne ":$DATA") {
        try {
            $content = Get-Content "$($file2):$($stream.Substring(1))" -ErrorAction SilentlyContinue
            Write-Host "    Content: `"$content`"" -ForegroundColor Cyan
        } catch {
            Write-Host "    Content: Error - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}