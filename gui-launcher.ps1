#requires -Version 7.0
# SwarmUI GUI Launcher (PowerShell + WPF)
# Single-file GUI: dark theme, optional Mica/Acrylic, toggles, live output, Start/Stop

Add-Type -AssemblyName PresentationCore,PresentationFramework,WindowsBase

# Try enabling Mica/Acrylic-like backdrop via DWM (best-effort)
$dwminvoke = @"
using System;
using System.Runtime.InteropServices;

public static class DwmApi
{
    // Windows 11 Mica - DWMWA_SYSTEMBACKDROP_TYPE (38)
    // 2 = Mica, 3 = Acrylic (backdrop types depend on OS build)
    const int DWMWA_SYSTEMBACKDROP_TYPE = 38;

    [DllImport("dwmapi.dll", CharSet = CharSet.Unicode, PreserveSig = true)]
    public static extern int DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int attrValue, int attrSize);

    // Legacy accent (Windows 10 acrylic-like)
    public enum AccentState
    {
        ACCENT_DISABLED = 0,
        ACCENT_ENABLE_GRADIENT = 1,
        ACCENT_ENABLE_TRANSPARENTGRADIENT = 2,
        ACCENT_ENABLE_BLURBEHIND = 3,
        ACCENT_ENABLE_ACRYLICBLURBEHIND = 4,
        ACCENT_ENABLE_HOSTBACKDROP = 5
    }
    [StructLayout(LayoutKind.Sequential)]
    public struct AccentPolicy
    {
        public int AccentState;
        public int AccentFlags;
        public int GradientColor;
        public int AnimationId;
    }
    [StructLayout(LayoutKind.Sequential)]
    public struct WindowCompositionAttributeData
    {
        public int Attribute; // 19 = WCA_ACCENT_POLICY
        public IntPtr Data;
        public int SizeOfData;
    }
    [DllImport("user32.dll")]
    public static extern int SetWindowCompositionAttribute(IntPtr hwnd, ref WindowCompositionAttributeData data);
}
"@
try { Add-Type -TypeDefinition $dwminvoke -ErrorAction Stop } catch {}

# Simple dark theme WPF XAML
$xaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="SwarmUI Launcher" Height="640" Width="980"
        WindowStartupLocation="CenterScreen"
        Background="#FF1E1E1E" Foreground="#FFF0F0F0">
  <Window.Resources>
    <SolidColorBrush x:Key="AccentBrush" Color="#FF3B82F6"/>
    <Style TargetType="Button">
      <Setter Property="Margin" Value="4"/>
      <Setter Property="Padding" Value="10,6"/>
      <Setter Property="Background" Value="#FF2A2A2A"/>
      <Setter Property="Foreground" Value="White"/>
      <Setter Property="BorderBrush" Value="#FF3B82F6"/>
      <Setter Property="BorderThickness" Value="1"/>
    </Style>
    <Style TargetType="CheckBox">
      <Setter Property="Margin" Value="6,0,6,0"/>
      <Setter Property="Foreground" Value="White"/>
    </Style>
    <Style TargetType="ComboBox">
      <Setter Property="Margin" Value="6,0,6,0"/>
    </Style>
    <Style TargetType="TextBox">
      <Setter Property="Background" Value="#FF151515"/>
      <Setter Property="Foreground" Value="#FFEFEFEF"/>
      <Setter Property="BorderBrush" Value="#FF3B82F6"/>
      <Setter Property="BorderThickness" Value="1"/>
    </Style>
  </Window.Resources>

  <Grid Margin="12" RowDefinitions="Auto,Auto,*">
    <!-- Controls row -->
    <DockPanel LastChildFill="False" Grid.Row="0" Margin="0,0,0,8">
      <StackPanel Orientation="Horizontal">
        <StackPanel Margin="0,0,16,0">
          <TextBlock Text="Port" Margin="0,0,0,2"/>
          <TextBox x:Name="PortBox" Width="100" Text="7801"/>
        </StackPanel>

        <StackPanel Margin="0,0,16,0">
          <TextBlock Text="Configuration" Margin="0,0,0,2"/>
          <ComboBox x:Name="ConfigBox" Width="140" SelectedIndex="1">
            <ComboBoxItem Content="Debug"/>
            <ComboBoxItem Content="Release"/>
          </ComboBox>
        </StackPanel>

        <StackPanel Margin="0,0,16,0">
          <TextBlock Text="Environment" Margin="0,0,0,2"/>
          <ComboBox x:Name="EnvBox" Width="160" SelectedIndex="1">
            <ComboBoxItem Content="Development"/>
            <ComboBoxItem Content="Production"/>
          </ComboBox>
        </StackPanel>

        <CheckBox x:Name="HttpsToggle" Content="HTTPS"/>
        <CheckBox x:Name="SkipBuildToggle" Content="Skip Build"/>
        <CheckBox x:Name="NoBrowserToggle" Content="No Browser"/>

        <Button x:Name="StartBtn" Content="Start" Margin="12,0,6,0"/>
        <Button x:Name="StopBtn" Content="Stop" IsEnabled="False"/>
      </StackPanel>
    </DockPanel>

    <!-- URL/Status -->
    <StackPanel Orientation="Horizontal" Grid.Row="1" Margin="0,0,0,8">
      <TextBlock Text="URL: " Foreground="#FFAAAAAA"/>
      <TextBlock x:Name="UrlLabel" Text="http://localhost:7801"/>
      <Button x:Name="OpenBtn" Content="Open" Margin="16,0,0,0"/>
      <TextBlock x:Name="StatusLabel" Text="Idle" Margin="16,0,0,0" Foreground="#FFAAAAAA"/>
    </StackPanel>

    <!-- Output -->
    <Grid Grid.Row="2">
      <TextBox x:Name="OutputBox" FontFamily="Consolas" FontSize="12"
               TextWrapping="NoWrap" AcceptsReturn="True" VerticalScrollBarVisibility="Auto"
               HorizontalScrollBarVisibility="Auto" IsReadOnly="True"/>
    </Grid>
  </Grid>
</Window>
"@

# Parse XAML
$reader = [System.Xml.XmlReader]::Create([System.IO.StringReader]::new($xaml))
$Window = [System.Windows.Markup.XamlReader]::Load($reader)

# Lookup controls
$PortBox        = $Window.FindName('PortBox')
$ConfigBox      = $Window.FindName('ConfigBox')
$EnvBox         = $Window.FindName('EnvBox')
$HttpsToggle    = $Window.FindName('HttpsToggle')
$SkipBuildToggle= $Window.FindName('SkipBuildToggle')
$NoBrowserToggle= $Window.FindName('NoBrowserToggle')
$StartBtn       = $Window.FindName('StartBtn')
$StopBtn        = $Window.FindName('StopBtn')
$OpenBtn        = $Window.FindName('OpenBtn')
$UrlLabel       = $Window.FindName('UrlLabel')
$StatusLabel    = $Window.FindName('StatusLabel')
$OutputBox      = $Window.FindName('OutputBox')

# State
$global:proc = $null
$global:cts  = $null
$repoRoot    = (Get-Location).Path  # assumes script is run from repo root; adjust if needed

function Append-Line($text) {
    $null = $Window.Dispatcher.Invoke([action]{ 
        $OutputBox.AppendText(($text ?? '') + [Environment]::NewLine)
        $OutputBox.ScrollToEnd()
    })
}

function Set-Status($text) {
    $null = $Window.Dispatcher.Invoke([action]{ $StatusLabel.Text = $text })
}

function Resolve-Config() {
    $portStr = $PortBox.Text.Trim()
    if (-not [int]::TryParse($portStr, [ref]([int]$null))) { throw "Invalid Port '$portStr'" }
    $port = [int]$portStr
    $conf = ($ConfigBox.SelectedItem.Content.ToString())
    $env  = ($EnvBox.SelectedItem.Content.ToString())
    $https = $HttpsToggle.IsChecked -eq $true
    $skipBuild = $SkipBuildToggle.IsChecked -eq $true
    $noBrowser = $NoBrowserToggle.IsChecked -eq $true

    $scheme = if ($https) { 'https' } else { 'http' }
    $urls   = "{0}://*:{1}" -f $scheme, $port
    $openUrl= "{0}://localhost:{1}" -f $scheme, $port

    [pscustomobject]@{
        Port      = $port
        Configuration = $conf
        Environment   = $env
        Https     = $https
        SkipBuild = $skipBuild
        NoBrowser = $noBrowser
        Urls      = $urls
        OpenUrl   = $openUrl
        Proj      = Join-Path $repoRoot 'src/SwarmUI.csproj'
        LiveDir   = Join-Path $repoRoot 'src/bin/live_release'
        ExePath   = Join-Path $repoRoot 'src/bin/live_release/SwarmUI.exe'
        BackupDir = Join-Path $repoRoot 'src/bin/live_release_backup'
    }
}

function Ensure-NugetSource {
    try { dotnet nuget add source https://api.nuget.org/v3/index.json --name "NuGet official package source" 2>$null | Out-Null } catch {}
}

function Remove-LaunchSettings {
    $ls = Join-Path $repoRoot 'src/Properties/launchSettings.json'
    if (Test-Path $ls) { Remove-Item $ls -Force }
}

function Build-Project([object]$cfg) {
    Append-Line "Building $($cfg.Proj) ($($cfg.Configuration)) -> $($cfg.LiveDir)"
    if (Test-Path $cfg.LiveDir) {
        if (Test-Path $cfg.BackupDir) { Remove-Item $cfg.BackupDir -Recurse -Force }
        Move-Item $cfg.LiveDir $cfg.BackupDir -Force
    }
    $psi = [System.Diagnostics.ProcessStartInfo]::new('dotnet', "build `"$($cfg.Proj)`" --configuration $($cfg.Configuration) -o `"$($cfg.LiveDir)`"")
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError  = $true
    $p = [System.Diagnostics.Process]::Start($psi)
    $p.add_OutputDataReceived({ param($s,$e) if ($e.Data) { Append-Line $e.Data } })
    $p.add_ErrorDataReceived( { param($s,$e) if ($e.Data) { Append-Line $e.Data } })
    $p.BeginOutputReadLine(); $p.BeginErrorReadLine()
    $p.WaitForExit()

    if (-not (Test-Path $cfg.ExePath)) {
        Append-Line "Build failed. Restoring backup..."
        if (Test-Path $cfg.LiveDir) { Remove-Item $cfg.LiveDir -Recurse -Force }
        if (Test-Path $cfg.BackupDir) { Move-Item $cfg.BackupDir $cfg.LiveDir -Force }
        throw "Build failed"
    }
    if (Test-Path $cfg.BackupDir) { Remove-Item $cfg.BackupDir -Recurse -Force }
}

function Open-Incognito($url) {
    $edge   = "$Env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe"
    $chrome = "$Env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe"
    $firefox= "$Env:ProgramFiles\Mozilla Firefox\firefox.exe"
    try {
        if (Test-Path $edge) { Start-Process $edge   @('--inprivate', $url); return }
        if (Test-Path $chrome){ Start-Process $chrome @('--incognito', $url); return }
        if (Test-Path $firefox){Start-Process $firefox @('-private-window', $url); return }
        Start-Process $url
    } catch { Append-Line "Browser open failed: $($_.Exception.Message)" }
}

function Run-WithRestart([object]$cfg, [System.Threading.CancellationToken]$token) {
    while ($true) {
        $args = @()
        if ($cfg.Environment -eq 'Development') { $args += @('--environment','dev') }

        $psi = [System.Diagnostics.ProcessStartInfo]::new($cfg.ExePath, [string]::Join(' ', $args))
        $psi.UseShellExecute = $false
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError  = $true
        $global:proc = [System.Diagnostics.Process]::Start($psi)
        $global:proc.add_OutputDataReceived({ param($s,$e) if ($e.Data) { Append-Line $e.Data } })
        $global:proc.add_ErrorDataReceived( { param($s,$e) if ($e.Data) { Append-Line $e.Data } })
        $global:proc.BeginOutputReadLine(); $global:proc.BeginErrorReadLine()

        $exitWaiter = [System.Threading.Tasks.Task]::Run({
            $global:proc.WaitForExit()
            return $global:proc.ExitCode
        })
        while (-not $exitWaiter.IsCompleted) {
            if ($token.IsCancellationRequested) {
                try { if ($global:proc -and -not $global:proc.HasExited) { $global:proc.Kill($true) } } catch {}
                return
            }
            Start-Sleep -Milliseconds 150
        }
        $code = $exitWaiter.Result
        Append-Line "Exited with code $code"
        if ($code -ne 42) { break }
        Append-Line "Restart requested (42). Relaunching..."
        Start-Sleep -Seconds 1
    }
}

# Wire up buttons
$StartBtn.Add_Click({
    try {
        $OutputBox.Clear()
        $StartBtn.IsEnabled = $false
        $StopBtn.IsEnabled  = $true
        $OpenBtn.IsEnabled  = $false

        $cfg = Resolve-Config

        # Update URL label
        $UrlLabel.Text = $cfg.OpenUrl

        # Environment variables for app
        [Environment]::SetEnvironmentVariable('ASPNETCORE_ENVIRONMENT', $cfg.Environment, 'Process')
        [Environment]::SetEnvironmentVariable('ASPNETCORE_URLS', $cfg.Urls, 'Process')

        Set-Status "Preparing..."
        Remove-LaunchSettings
        Ensure-NugetSource

        if (-not $cfg.SkipBuild -or -not (Test-Path $cfg.ExePath)) {
            Build-Project $cfg
        } else {
            Append-Line "Skipping build (per toggle) and executable exists."
        }

        if (-not $cfg.NoBrowser) { Open-Incognito $cfg.OpenUrl }

        # Cancellation for Stop
        $global:cts = [System.Threading.CancellationTokenSource]::new()
        Set-Status "Running..."
        Run-WithRestart $cfg $global:cts.Token

        Set-Status "Stopped"
    }
    catch {
        Append-Line "ERROR: $($_.Exception.Message)"
        Set-Status "Error"
    }
    finally {
        $StartBtn.IsEnabled = $true
        $StopBtn.IsEnabled  = $false
        $OpenBtn.IsEnabled  = $true
    }
})

$StopBtn.Add_Click({
    try {
        Set-Status "Stopping..."
        if ($global:cts) { $global:cts.Cancel() }
        if ($global:proc -and -not $global:proc.HasExited) { try { $global:proc.Kill($true) } catch {} }
        Set-Status "Stopped"
    } finally {
        $StartBtn.IsEnabled = $true
        $StopBtn.IsEnabled  = $false
    }
})

$OpenBtn.Add_Click({
    try {
        $cfg = Resolve-Config
        Open-Incognito $cfg.OpenUrl
    } catch {
        Append-Line "Open failed: $($_.Exception.Message)"
    }
})

# Update URL label on changes
$updateUrl = {
    try {
        $cfg = Resolve-Config
        $UrlLabel.Text = $cfg.OpenUrl
    } catch {}
}
$PortBox.Add_TextChanged($updateUrl)
$HttpsToggle.Add_Checked($updateUrl)
$HttpsToggle.Add_Unchecked($updateUrl)

# Try enable Mica/Acrylic-like backdrop after window shown
$Window.Add_SourceInitialized({
    try {
        $hwndSrc = [System.Windows.Interop.WindowInteropHelper]::new($Window)
        $h = $hwndSrc.Handle
        # Prefer Mica (2). If not supported, try acrylic host backdrop (5) or blur.
        if ([type]::GetType('DwmApi') -ne $null) {
            try {
                $val = 2; [DwmApi]::DwmSetWindowAttribute($h, 38, [ref]$val, 4) | Out-Null
            } catch {
                # Fallback to Accent blur
                try {
                    $policy = New-Object DwmApi+AccentPolicy
                    $policy.AccentState = [DwmApi+AccentState]::ACCENT_ENABLE_BLURBEHIND.value__
                    $size = [System.Runtime.InteropServices.Marshal]::SizeOf([type]::GetType('DwmApi+AccentPolicy'))
                    $ptr = [System.Runtime.InteropServices.Marshal]::AllocHGlobal($size)
                    [System.Runtime.InteropServices.Marshal]::StructureToPtr($policy, $ptr, $false)
                    $data = New-Object DwmApi+WindowCompositionAttributeData
                    $data.Attribute = 19
                    $data.SizeOfData = $size
                    $data.Data = $ptr
                    [DwmApi]::SetWindowCompositionAttribute($h, [ref]$data) | Out-Null
                    [System.Runtime.InteropServices.Marshal]::FreeHGlobal($ptr)
                } catch {}
            }
        }
    } catch {}
})

# Show
$Window.ShowDialog() | Out-Null