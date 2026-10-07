# Deep examination of safetensor headers
$file1 = 'K:\.ai_local\SwarmUI\Models\vae\wan_2.1_vae.safetensors'
$file2 = 'K:\.ai_local\SwarmUI\Models\Lora\Krea2\Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0.safetensors'

$bytes1 = [System.IO.File]::ReadAllBytes($file1)
$bytes2 = [System.IO.File]::ReadAllBytes($file2)

Write-Host "=== Working File (wan_2.1_vae) ===" -ForegroundColor Cyan
Write-Host "Size: $($bytes1.Length)" -ForegroundColor Gray
Write-Host "First 50 bytes decimal:" -ForegroundColor Gray
for ($i=0; $i -lt 50 -and $i -lt $bytes1.Length; $i++) {
    Write-Host "$($bytes1[$i]) " -ForegroundColor Gray
}
Write-Host ""
Write-Host "First 50 bytes hex:" -ForegroundColor Gray
for ($i=0; $i -lt 50 -and $i -lt $bytes1.Length; $i++) {
    Write-Host "0x$($bytes1[$i].ToString('X2')) " -ForegroundColor Gray
}
Write-Host ""
Write-Host "First 50 bytes ASCII (printable only):" -ForegroundColor Gray
$printable1 = ""
for ($i=0; $i -lt 50 -and $i -lt $bytes1.Length; $i++) {
    if ($bytes1[$i] -ge 32 -and $bytes1[$i] -le 126) {
        $printable1 += [char]$bytes1[$i]
    } else {
        $printable1 += "."
    }
}
Write-Host $printable1 -ForegroundColor Gray

Write-Host "" -ForegroundColor Cyan
Write-Host "=== Corrupted File (Krea2) ===" -ForegroundColor Cyan
Write-Host "Size: $($bytes2.Length)" -ForegroundColor Gray
Write-Host "First 50 bytes decimal:" -ForegroundColor Gray
for ($i=0; $i -lt 50 -and $i -lt $bytes2.Length; $i++) {
    Write-Host "$($bytes2[$i]) " -ForegroundColor Gray
}
Write-Host ""
Write-Host "First 50 bytes hex:" -ForegroundColor Gray
for ($i=0; $i -lt 50 -and $i -lt $bytes2.Length; $i++) {
    Write-Host "0x$($bytes2[$i].ToString('X2')) " -ForegroundColor Gray
}
Write-Host ""
Write-Host "First 50 bytes ASCII (printable only):" -ForegroundColor Gray
$printable2 = ""
for ($i=0; $i -lt 50 -and $i -lt $bytes2.Length; $i++) {
    if ($bytes2[$i] -ge 32 -and $bytes2[$i] -le 126) {
        $printable2 += [char]$bytes2[$i]
    } else {
        $printable2 += "?"
    }
}
Write-Host $printable2 -ForegroundColor Gray