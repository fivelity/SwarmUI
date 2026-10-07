# Verify ADS tags on files
$testFiles = @(
    'K:\.ai_local\SwarmUI\Models\vae\wan_2.1_vae.safetensors',
    'K:\.ai_local\SwarmUI\Models\stable-diffusion\Realistic_Vision_V6-0_B1_-_V5-1_Hyper_-VAE-.safetensors',
    'K:\.ai_local\SwarmUI\Models\lora\qwen_3_4b.safetensors'
)
foreach ($f in $testFiles) {
    Write-Host "Checking: $($f.Substring($f.LastIndexOf('\')+1))" -ForegroundColor Cyan
    try {
        $ads = Get-Content "$f:$originalfilename" -ErrorAction Stop
        Write-Host "  ADS Content: $ads" -ForegroundColor Green
    } catch {
        Write-Host "  ADS not found or error" -ForegroundColor Red
    }
}