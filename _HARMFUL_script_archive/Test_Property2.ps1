# Test setting file properties v2
$fileFullName = 'K:\.ai_local\SwarmUI\Models\vae\wan_2.1_vae.safetensors'
Write-Host "File FullName: $fileFullName" -ForegroundColor Cyan

# Set a test property using FullName
$result = Set-ItemProperty -Path $fileFullName -Name 'TestProperty' -Value 'test_value' -Force
Write-Host "Set-ItemProperty result: $result" -ForegroundColor Cyan

# Check if property was set
$file2 = Get-Item $fileFullName
$props = $file2.PSObject.Properties
Write-Host "Number of properties: $($props.Count)" -ForegroundColor Cyan
Write-Host "Looking for TestProperty..." -ForegroundColor Cyan
foreach ($p in $props) {
    Write-Host "  Property: $($p.Name) = $($p.Value)" -ForegroundColor Gray
}