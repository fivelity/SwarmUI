# Ensure correct local path.
$thisPath = Split-Path $MyInvocation.MyCommand.Path -Parent
cd $thisPath

# Launch Backend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", ".\launch-windows-dev.ps1"

# Launch Frontend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd src/WebApp; npm install; npm run dev"
