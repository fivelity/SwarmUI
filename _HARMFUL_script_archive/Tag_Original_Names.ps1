# Tag Original Filenames in Windows 11
# This script adds the original filename as a custom property to each .safetensors file

$ModelRoot = "K:\.ai_local\SwarmUI\Models"
$files = Get-ChildItem -Path $ModelRoot -Filter "*.safetensors" -Recurse | Where-Object { -not $_.PsIsContainer }

Write-Host "Found $($files.Count) .safetensors files" -ForegroundColor Cyan

# Use Set-ItemProperty to add custom property
$success = 0
$failed = 0
foreach ($file in $files) {
    $origName = $file.Name
    try {
        # Use Set-ItemProperty to store original filename as custom property
        Set-ItemProperty -Path $file.FullName -Name "OriginalFilename" -Value $origName -Force
        $success++
        if ($success % 100 -eq 0) { Write-Host "Progress: $success tagged, $failed failed" -ForegroundColor DarkYellow }
    } catch {
        $failed++
    }
}
Write-Host "`nCompleted: $success success, $failed failed out of $($files.Count) files" -ForegroundColor Cyan