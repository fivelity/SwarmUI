# Tag using NTFS Alternate Data Streams
$ModelRoot = "K:\.ai_local\SwarmUI\Models"
$files = Get-ChildItem -Path $ModelRoot -Filter "*.safetensors" -Recurse | Where-Object { -not $_.PsIsContainer }
Write-Host "Found $($files.Count) .safetensors files" -ForegroundColor Cyan

$success = 0
$failed = 0
foreach ($file in $files) {
    $origName = $file.Name
    # Method: NTFS Alternate Data Stream
    # Syntax: "path:streamname"
    $adsPath = "{0}:$originalfilename" -f $file.FullName
    try {
        # Enclose in quotes to handle special characters
        $adsPathQuoted = "$($file.FullName):$originalfilename"
        Set-Content -Path $adsPathQuoted -Value $origName -Force
        $success++
        if ($success % 50 -eq 0) { Write-Host "Progress: $success tagged, $failed failed" -ForegroundColor DarkYellow }
    } catch {
        $failed++
    }
}
Write-Host "`nCompleted: $success success, $failed failed out of $($files.Count) files" -ForegroundColor Cyan