# Verify ADS tags on files
$testFiles = @(
    'K:\.ai_local\SwarmUI\Models\vae\wan_2.1_vae.safetensors',
    'K:\.ai_local\SwarmUI\Models\stable-diffusion\Realistic_Vision_V6-0_B1_-_V5-1_Hyper_-VAE-.safetensors',
    'K:\.ai_local\SwarmUI\Models\lora\qwen_3_4b.safetensors'
)
foreach ($f in $testFiles) {
    $filename = [System.IO.Path]::GetFileName($f)
    Write-Host "Checking: $filename" -ForegroundColor Cyan
    $adsPath = "$f:$originalfilename"
    Write-Host "  ADS Path: $adsPath" -ForegroundColor DarkYellow
    try {
        $ads = Get-Content $adsPath -ErrorAction Stop
        Write-Host "  ADS Content: $ads" -ForegroundColor Green
    } catch {
        Write-Host "  ADS not found or error" -ForegroundColor Red
    }
}