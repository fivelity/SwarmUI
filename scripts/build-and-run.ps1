param(
  [int]$Port = 7801,
  [switch]$Https,
  [switch]$NoBuild
)

$ErrorActionPreference = 'Stop'

# Resolve repo root and project
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path "$repoRoot/../src/SwarmUI.csproj")) {
  # if script is under scripts/, go up one
  $repoRoot = (Get-Item "$repoRoot/..\").FullName
}
$proj = Join-Path $repoRoot 'src/SwarmUI.csproj'

if (-not (Test-Path $proj)) {
  Write-Error "Could not find project at $proj"
}

# Build (unless skipped)
if (-not $NoBuild) {
  Write-Host "Building SwarmUI..." -ForegroundColor Cyan
  dotnet build "$proj" -c Release | Write-Output
}

# Choose scheme
$scheme = if ($Https) { 'https' } else { 'http' }
$listenUrl = "$scheme://localhost:$Port"

# Launch the server
Write-Host "Starting SwarmUI on $listenUrl ..." -ForegroundColor Cyan
$env:ASPNETCORE_URLS = $listenUrl
$server = Start-Process -PassThru -FilePath dotnet -ArgumentList @('run','-c','Release','--project',"$proj") -WorkingDirectory $repoRoot

Start-Sleep -Seconds 2

# Launch browser in private/incognito mode
# Prefer Edge on Windows, fall back to Chrome/Firefox if available
$opened = $false

$edge = "$Env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe"
if (Test-Path $edge) {
  Start-Process -FilePath $edge -ArgumentList @('--inprivate', $listenUrl) | Out-Null
  $opened = $true
}

if (-not $opened) {
  $chrome = "$Env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe"
  if (Test-Path $chrome) {
    Start-Process -FilePath $chrome -ArgumentList @('--incognito', $listenUrl) | Out-Null
    $opened = $true
  }
}

if (-not $opened) {
  $firefox = "$Env:ProgramFiles\Mozilla Firefox\firefox.exe"
  if (Test-Path $firefox) {
    Start-Process -FilePath $firefox -ArgumentList @('-private-window', $listenUrl) | Out-Null
    $opened = $true
  }
}

if (-not $opened) {
  Write-Warning "Could not find Edge/Chrome/Firefox. Opening default browser without incognito."
  Start-Process $listenUrl | Out-Null
}

Write-Host "SwarmUI running (PID $($server.Id)). Press Ctrl+C in terminal to stop." -ForegroundColor Green

