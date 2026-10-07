# Check current state of files
$files = @(
    'K:\\.ai_local\\SwarmUI\\Models\\Lora\\Krea2\\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors',
    'K:\\.ai_local\\SwarmUI\\Models\\vae\\wan_2.1_vae.safetensors',
    'K:\\.ai_local\\SwarmUI\\Models\\Lora\\Krea2\\Better_amateur_anal-_LoRA-_Krea_2_-_PonyXL_-_Illustrious_XL_-_v1-0-_Krea2.safetensors'
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $bytes = [System.IO.File]::ReadAllBytes($f)
        $v0 = $bytes[0]
        $v1 = $bytes[1]
        $v2 = $bytes[2]
        $v8 = $bytes[8]
        Write-Host "File: $($f.Substring($f.LastIndexOf("\")+1))" -ForegroundColor Cyan
        Write-Host "  Byte0: " $v0 " (0x" $v0.ToString("X2") ")" -ForegroundColor Gray
        Write-Host "  Byte1: " $v1 -ForegroundColor Gray
        Write-Host "  Byte2: " $v2 -ForegroundColor Gray
        Write-Host "  Byte8: " $v8 " (0x" $v8.ToString("X2") ")" -ForegroundColor Gray
        if ($v8 -eq 123) {
            Write-Host "  JSON header: starts with `{` - OK" -ForegroundColor Green
        }
        else {
            Write-Host "  JSON header: NOT starting with `{` - PROBLEM" -ForegroundColor Red
        }
        Write-Host ""
    }
}