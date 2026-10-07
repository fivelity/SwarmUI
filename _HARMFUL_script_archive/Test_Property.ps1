# Test setting file properties
$file = Get-Item 'K:\.ai_local\SwarmUI\Models\vae\wan_2.1_vae.safetensors'
Write-Host "File Path: $($file.Path)" -ForegroundColor Cyan
Write-Host "File Name: $($file.Name)" -ForegroundColor Cyan

# Set a test property
$result = Set-ItemProperty -Path $file.Path -Name 'TestProperty' -Value 'test_value' -Force
Write-Host "Set-ItemProperty result: $result" -ForegroundColor Cyan

# Check properties
$props = $file.PSObject.Properties
Write-Host "Number of properties: $($props.Count)" -ForegroundColor Cyan
foreach ($p in $props) {
    Write-Host "  Property: $($p.Name) = $($p.Value)" -ForegroundColor Gray
}