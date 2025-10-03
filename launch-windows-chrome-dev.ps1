# Ensure correct local path.
$thisPath = Split-Path $MyInvocation.MyCommand.Path -Parent
Set-Location $thisPath

# Visual Studio likes to generate invalid files here for some reason, so autonuke it
if (Test-Path "src/Properties/launchSettings.json") {
    Remove-Item src/Properties/launchSettings.json
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

# Actual runner - Build the command with arguments
$swarmArgs = "--environment dev"
if ($args.Count -gt 0) {
    $swarmArgs = "--environment dev " + ($args -join " ")
}
$command = "cd '$thisPath'; .\src\bin\live_release\SwarmUI.exe $swarmArgs"
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", $command

# Wait for the server to be ready
Write-Host "Waiting for SwarmUI to start..."
Start-Sleep -Seconds 5

# Open Chrome
$chrome = "$Env:ProgramFiles\Google\Chrome\Application\chrome.exe"
$chromeAlt = "${Env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
$chromeLcl = "$Env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
if (Test-Path $chrome) {
    Start-Process $chrome "http://localhost:7801"
}
elseif (Test-Path $chromeAlt) {
    Start-Process $chromeAlt "http://localhost:7801"
}
elseif (Test-Path $chromeLcl) {
    Start-Process $chromeLcl "http://localhost:7801"
}
else {
    Write-Host "Google Chrome not found, opening default browser."
    Start-Process "http://localhost:7801"
}

# Keep this script alive until the server process is closed
Write-Host "Main script is now waiting for SwarmUI process to close..."
$process = Get-Process -Name "SwarmUI" -ErrorAction SilentlyContinue
if ($process) {
    $processResult = Wait-Process -Id $process.Id -PassThru
    Write-Host "SwarmUI exited with code $($processResult.ExitCode)"
    # Exit code 42 means restart, anything else = don't.
    if ($processResult.ExitCode -eq 42) {
        & "$PSCommandPath" @args
    }
}
else {
    Write-Host "Could not find SwarmUI process to monitor."
}
