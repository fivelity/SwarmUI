# Test ADS creation with a simple file
$testFile = "K:\\test_ads.txt"
# Create a test file
Set-Content -Path $testFile -Value "test content"
Write-Host "Test file created" -ForegroundColor Cyan
# Try to create ADS with :teststream name
$adsPath = "$testFile:teststream"
Write-Host "ADS path: $adsPath" -ForegroundColor Gray
Set-Content -Path $adsPath -Value "ADS test content" -Force
Write-Host "ADS created" -ForegroundColor Cyan
# Read it back
$content = Get-Content $adsPath -Force
Write-Host "ADS content: $content" -ForegroundColor Cyan
# List streams
$streams = Get-Item $testFile -Stream *
Write-Host "Streams:" -ForegroundColor Gray
foreach ($s in $streams.Stream) {
    Write-Host "  $s" -ForegroundColor Gray
}
# Clean up
Remove-Item $testFile -Force
Remove-Item "$testFile:teststream" -Force