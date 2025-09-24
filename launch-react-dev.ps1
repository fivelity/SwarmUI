# Ensure correct local path.
$thisPath = Split-Path $MyInvocation.MyCommand.Path -Parent
Set-Location $thisPath

# Launch Backend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", ".\launch-windows-dev.ps1"

# Launch Frontend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "Set-Location src/WebApp; npm install; npm run dev"