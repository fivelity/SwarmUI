# Ensure correct local path.
$thisPath = Split-Path $MyInvocation.MyCommand.Path -Parent
cd $thisPath

# Visual Studio likes to generate invalid files here for some reason, so autonuke it
if (Test-Path "src/Properties/launchSettings.json") {
    rm src/Properties/launchSettings.json
}

# Nuke build files to ensure our build is fresh and won't skip past errors
if (Test-Path 'src/bin/') {
    Remove-Item 'src/bin/' -Recurse -Force
}
if (Test-Path 'src/obj/') {
    Remove-Item 'src/obj/' -Recurse -Force
}

# Building first is more reliable than running directly from src
dotnet build src/SwarmUI.csproj --configuration Debug -o src/bin/live_release

if (-not (Test-Path ".\src\bin\live_release\SwarmUI.exe")) {
    Write-Host "Build failed, SwarmUI.exe not found."
    Read-Host -Prompt "Press Enter to exit"
    exit
}

# Default env configuration, gets overwritten by the C# code's settings handler
$Env:ASPNETCORE_ENVIRONMENT = "Development"
$Env:ASPNETCORE_URLS = "http://*:7801"

# Wait for the server to be ready
Write-Host "Waiting for SwarmUI to start..."
Start-Sleep -Seconds 5

# Open Chrome in Incognito mode
$chrome = "$Env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe"
$chromeAlt = "$Env:ProgramFiles\Google\Chrome\Application\chrome.exe"
Write-Host "Chrome path: $chrome"
if (Test-Path $chrome) {
    Write-Host "Chrome found, launching..."
    Start-Process $chrome @('--incognito', "http://localhost:7801")
} 
elseif (Test-Path $chromeAlt) {
    Write-Host "Chrome found at alternate path, launching..."
    Start-Process $chromeAlt @('--incognito', "http://localhost:7801")
}
else {
    Write-Host "Google Chrome not found, opening default browser."
    Start-Process "http://localhost:7801"
}

# Start SwarmUI in a new window
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command `".\src\bin\live_release\SwarmUI.exe --environment dev $args`""
