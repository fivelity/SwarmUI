# Test ADS creation - simpler
$testFile = "K\\test_ads.txt"
# Create a test file
Set-Content -Path $testFile -Value "test content"
Write-Host "Test file created" -ForegroundColor Cyan
# Try to create ADS with :teststream name
$adsPath = "$testFile:teststream"
Write-Host "ADS path: [" $adsPath "]" -ForegroundColor Gray
# List streams before
$streamsBefore = Get-Item $testFile -Stream *
Write-Host "Streams before: $($streamsBefore.Count)" -ForegroundColor Gray
foreach ($s in $streamsBefore.Stream) {
    Write-Host "  Stream: $s" -ForegroundColor Gray
}
# Try to create ADS
try {
    Set-Content -Path $adsPath -Value "ADS test content" -Force
    Write-Host "ADS created successfully" -ForegroundColor Cyan
} catch {
    Write-Host "Error creating ADS: $_" -ForegroundColor Red
}
# List streams after
$streamsAfter = Get-Item $testFile -Stream *
Write-Host "Streams after: $($streamsAfter.Count)" -ForegroundColor Gray
foreach ($s in $streamsAfter.Stream) {
    Write-Host "  Stream: $s" -ForegroundColor Gray
}
# Read the ADS content
try {
    $content = Get-Content $adsPath -Force
    Write-Host "ADS content: $content" -ForegroundColor Cyan
} catch {
    Write-Host "Error reading ADS: $_" -ForegroundColor Red
}
# Clean up
Remove-Item $testFile -Force