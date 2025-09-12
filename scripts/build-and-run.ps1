param(
    [int]$Port = 7801,
    [switch]$Https,
    [switch]$NoBuild,
    [switch]$NoBrowser,
    [ValidateSet('Debug','Release')][string]$Configuration = 'Release',
    [ValidateSet('Development','Production')][string]$Environment = 'Production'
)

$ErrorActionPreference = 'Stop'

# Ensure we are running from the repo root (like the launch scripts do)
$thisPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $thisPath
if (Test-Path "$thisPath/../src/SwarmUI.csproj") {
    Set-Location (Resolve-Path "$thisPath/..")
}
$repoRoot = Get-Location
$proj = Join-Path $repoRoot 'src/SwarmUI.csproj'

if (-not (Test-Path $proj)) {
    Write-Error "Could not find project at $proj"
}

# Visual Studio occasionally generates a bad launchSettings.json — mirror dev launcher behavior and remove it
if (Test-Path "src/Properties/launchSettings.json") {
    Remove-Item "src/Properties/launchSettings.json" -Force
}

# Compute URL scheme and binding host. Use * to match the working launch scripts
$scheme = if ($Https) { 'https' } else { 'http' }
$listenUrl = "$scheme://*:$Port"
$openUrl = "$scheme://localhost:$Port"

# Default env configuration, gets overwritten by the C# settings handler
$Env:ASPNETCORE_ENVIRONMENT = if ($Environment -eq 'Development') { 'Development' } else { 'Production' }
$Env:ASPNETCORE_URLS = $listenUrl

# Paths
$liveDir = Join-Path $repoRoot 'src/bin/live_release'
$exePath = Join-Path $liveDir 'SwarmUI.exe'

# Optionally build like the working launch scripts (to live_release)
$needsBuild = -not (Test-Path $exePath)
if (-not $NoBuild -or $needsBuild) {
    # Ensure NuGet official source exists (mirrors batch launcher safety)
    try {
        dotnet nuget add source https://api.nuget.org/v3/index.json --name "NuGet official package source" 2>$null | Out-Null
    } catch {}

    # If we had a previous build, rotate it to backup in case of failure
    $backupDir = Join-Path $repoRoot 'src/bin/live_release_backup'
    if (Test-Path $liveDir) {
        if (Test-Path $backupDir) { Remove-Item $backupDir -Recurse -Force }
        Move-Item $liveDir $backupDir -Force
    }

    Write-Host "Building SwarmUI ($Configuration) to $liveDir ..." -ForegroundColor Cyan
    dotnet build $proj --configuration $Configuration -o $liveDir

    if (-not (Test-Path $exePath) -and (Test-Path (Join-Path $backupDir 'SwarmUI.exe'))) {
        Write-Warning "Build appears to have failed. Restoring previous build..."
        if (Test-Path $liveDir) { Remove-Item $liveDir -Recurse -Force }
        Move-Item $backupDir $liveDir -Force
    } else {
        if (Test-Path $backupDir) { Remove-Item $backupDir -Recurse -Force }
    }
}

if (-not (Test-Path $exePath)) {
    Write-Error "Executable not found at $exePath. Build may have failed."
}

# Optionally open browser in incognito/private mode before launching the app
if (-not $NoBrowser) {
    $opened = $false

    $edge = "$Env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe"
    if (Test-Path $edge) {
        Start-Process -FilePath $edge -ArgumentList @('--inprivate', $openUrl) | Out-Null
        $opened = $true
    }

    if (-not $opened) {
        $chrome = "$Env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe"
        if (Test-Path $chrome) {
            Start-Process -FilePath $chrome -ArgumentList @('--incognito', $openUrl) | Out-Null
            $opened = $true
        }
    }

    if (-not $opened) {
        $firefox = "$Env:ProgramFiles\Mozilla Firefox\firefox.exe"
        if (Test-Path $firefox) {
            Start-Process -FilePath $firefox -ArgumentList @('-private-window', $openUrl) | Out-Null
            $opened = $true
        }
    }

    if (-not $opened) {
        Write-Warning "Could not find Edge/Chrome/Firefox. Opening default browser without incognito."
        Start-Process $openUrl | Out-Null
    }
}

# Run with restart-on-42 behavior, like the working launch scripts.
function Start-SwarmUI {
    param(
        [string]$Executable,
        [string[]]$ForwardArgs
    )
    & $Executable @ForwardArgs
    return $LASTEXITCODE
}

# Forward any unbound args to the application (after our named params)
$forward = @()
if ($Environment -eq 'Development') {
    $forward += '--environment'
    $forward += 'dev'
}
# Preserve any extra args the user supplied when calling this script
$forward += $args

while ($true) {
    Write-Host "Launching SwarmUI at $listenUrl (ENV=$($Env:ASPNETCORE_ENVIRONMENT)) ..." -ForegroundColor Green
    $code = Start-SwarmUI -Executable $exePath -ForwardArgs $forward
    if ($code -eq 42) {
        Write-Host "Restart requested by application (exit code 42). Restarting..." -ForegroundColor Yellow
        Start-Sleep -Seconds 1
        continue
    }
    if ($code -ne 0) {
        Write-Warning "SwarmUI exited with code $code"
    }
    break
}
