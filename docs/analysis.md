ProceedWithoutPlan

To analyze your codebase thoroughly, I'll search the indexed repository for routing, pages, layouts, and core UI components to understand the current structure and implementation. I'll start by scanning for common frameworks' entry points (e.g., Next.js app/pages, React Router routes, SvelteKit routes, Vue Router) and any core layout or UI directories. Then I’ll review representative files to provide concrete, code-informed recommendations.

**Codebase Search Results:**

**Codebase Search Results:**

**Codebase Search Results:**

To provide a concrete, code-informed UI/UX analysis, I will first inventory the repository to identify the framework, routing structure, and core page/layout files. I’ll run a few read-only commands to detect the tech stack (e.g., presence of package.json, framework configs) and list key directories and files. This will not modify anything.

**Command Executed:**

```bash
git --no-pager rev-parse --is-inside-work-tree; $ErrorActionPreference = 'SilentlyContinue'; if (Test-Path package.json) { Write-Host "\n--- package.json (first 200 lines) ---"; Get-Content -Path package.json -TotalCount 200 }; Write-Host "\n--- Top-level entries ---"; Get-ChildItem -Force | Select-Object -ExpandProperty Name; Write-Host "\n--- Key config files (top-level) ---"; Get-ChildItem -Force -File -Include package.json,pnpm-workspace.yaml,yarn.lock,package-lock.json,tsconfig.json,jsconfig.json,next.config.*,vite.config.*,angular.json,nuxt.config.*,svelte.config.*,remix.config.*,astro.config.*,turbo.json,lerna.json | Select-Object -ExpandProperty Name; Write-Host "\n--- Candidate app/page directories ---"; Get-ChildItem -Directory -Name app,apps,page,pages,src,client,frontend,web,packages | ForEach-Object { $_ }; Write-Host "\n--- Find routing/page files ---"; Get-ChildItem -Recurse -File -Include "**/app/**","**/pages/**","**/src/routes/**","**/src/app/**","**/src/pages/**" | Select-Object -First 50 -ExpandProperty FullName
```

**Output:**

```
true
\n--- Top-level entries ---
.git
.github
colab
Data
dlbackend
docs
languages
launchtools
Models
Output
scripts
src
.dockerignore
.gitattributes
.gitignore
CONTRIBUTING.md
gui-launcher.ps1
launch-linux-dev.sh
launch-linux.sh
launch-macos.sh
launch-windows-chrome-dev.ps1
launch-windows-dev.ps1
launch-windows.bat
LICENSE.txt
README.md
SwarmUI.sln
\n--- Key config files (top-level) ---
\n--- Candidate app/page directories ---
Accounts
Backends
bin
BuiltinExtensions
Core
DataHolders
Extensions
obj
Pages
srcdata
Text2Image
Utils
WebAPI
wwwroot
\n--- Find routing/page files ---
```

**Command Executed:**

```bash
Get-ChildItem -Recurse -File Pages | Select-Object FullName, Length | Format-Table -AutoSize | Out-String -Width 4096
```

**Output:**

```

```

**Command Executed:**

```bash
Get-ChildItem -Recurse -Filter *.csproj | Select-Object -ExpandProperty FullName
```

**Output:**

```
K:\.ai_local\SwarmUI\src\SwarmUI.csproj
```

**Command Executed:**

```bash
& dotnet --info
```

**Output:**

```
.NET SDK:
 Version:           9.0.304
 Commit:            f12f5f689e
 Workload version:  9.0.300-manifests.ad61bb1c
 MSBuild version:   17.14.16+5d8159c5f

Runtime Environment:
 OS Name:     Windows
 OS Version:  10.0.26100
 OS Platform: Windows
 RID:         win-x64
 Base Path:   C:\Program Files\dotnet\sdk\9.0.304\

.NET workloads installed:
 [maui-windows]
   Installation Source: VS 17.14.36408.4
   Manifest Version:    9.0.51/9.0.100
   Manifest Path:       C:\Program Files\dotnet\sdk-manifests\9.0.100\microsoft.net.sdk.maui\9.0.51\WorkloadManifest.json
   Install Type:              Msi

 [ios]
   Installation Source: VS 17.14.36408.4
   Manifest Version:    18.5.9214/9.0.100
   Manifest Path:       C:\Program Files\dotnet\sdk-manifests\9.0.100\microsoft.net.sdk.ios\18.5.9214\WorkloadManifest.json
   Install Type:              Msi

 [wasm-tools-net8]
   Installation Source: VS 17.14.36408.4
   Manifest Version:    9.0.8/9.0.100
   Manifest Path:       C:\Program Files\dotnet\sdk-manifests\9.0.100\microsoft.net.workload.mono.toolchain.net8\9.0.8\WorkloadManifest.json
   Install Type:              Msi

 [maccatalyst]
   Installation Source: VS 17.14.36408.4
   Manifest Version:    18.5.9214/9.0.100
   Manifest Path:       C:\Program Files\dotnet\sdk-manifests\9.0.100\microsoft.net.sdk.maccatalyst\18.5.9214\WorkloadManifest.json
   Install Type:              Msi

 [android]
   Installation Source: VS 17.14.36408.4
   Manifest Version:    35.0.78/9.0.100
   Manifest Path:       C:\Program Files\dotnet\sdk-manifests\9.0.100\microsoft.net.sdk.android\35.0.78\WorkloadManifest.json
   Install Type:              Msi

Configured to use loose manifests when installing new manifests.

Host:
  Version:      9.0.8
  Architecture: x64
  Commit:       aae90fa090

.NET SDKs installed:
  6.0.428 [C:\Program Files\dotnet\sdk]
  9.0.304 [C:\Program Files\dotnet\sdk]

.NET runtimes installed:
  Microsoft.AspNetCore.App 6.0.36 [C:\Program Files\dotnet\shared\Microsoft.AspNetCore.App]
  Microsoft.AspNetCore.App 7.0.20 [C:\Program Files\dotnet\shared\Microsoft.AspNetCore.App]
  Microsoft.AspNetCore.App 8.0.19 [C:\Program Files\dotnet\shared\Microsoft.AspNetCore.App]
  Microsoft.AspNetCore.App 8.0.20 [C:\Program Files\dotnet\shared\Microsoft.AspNetCore.App]
  Microsoft.AspNetCore.App 9.0.8 [C:\Program Files\dotnet\shared\Microsoft.AspNetCore.App]
  Microsoft.NETCore.App 6.0.36 [C:\Program Files\dotnet\shared\Microsoft.NETCore.App]
  Microsoft.NETCore.App 7.0.20 [C:\Program Files\dotnet\shared\Microsoft.NETCore.App]
  Microsoft.NETCore.App 8.0.19 [C:\Program Files\dotnet\shared\Microsoft.NETCore.App]
  Microsoft.NETCore.App 8.0.20 [C:\Program Files\dotnet\shared\Microsoft.NETCore.App]
  Microsoft.NETCore.App 9.0.8 [C:\Program Files\dotnet\shared\Microsoft.NETCore.App]
  Microsoft.WindowsDesktop.App 6.0.36 [C:\Program Files\dotnet\shared\Microsoft.WindowsDesktop.App]
  Microsoft.WindowsDesktop.App 7.0.20 [C:\Program Files\dotnet\shared\Microsoft.WindowsDesktop.App]
  Microsoft.WindowsDesktop.App 8.0.19 [C:\Program Files\dotnet\shared\Microsoft.WindowsDesktop.App]
  Microsoft.WindowsDesktop.App 8.0.20 [C:\Program Files\dotnet\shared\Microsoft.WindowsDesktop.App]
  Microsoft.WindowsDesktop.App 9.0.8 [C:\Program Files\dotnet\shared\Microsoft.WindowsDesktop.App]

Other architectures found:
  x86   [C:\Program Files (x86)\dotnet]
    registered at [HKLM\SOFTWARE\dotnet\Setup\InstalledVersions\x86\InstallLocation]

Environment variables:
  Not set

global.json file:
  Not found

Learn more:
  https://aka.ms/dotnet/info

Download .NET:
  https://aka.ms/dotnet/download
```

**Command Executed:**

```bash
Get-ChildItem -Recurse src | Select-Object FullName, PSIsContainer | Format-Table -AutoSize | Out-String -Width 4096
```

**Output:**

```

FullName                                                                                                                              PSIsContainer
--------                                                                                                                              -------------
K:\.ai_local\SwarmUI\src\Accounts                                                                                                              True
K:\.ai_local\SwarmUI\src\Backends                                                                                                              True
K:\.ai_local\SwarmUI\src\bin                                                                                                                   True
K:\.ai_local\SwarmUI\src\BuiltinExtensions                                                                                                     True
K:\.ai_local\SwarmUI\src\Core                                                                                                                  True
K:\.ai_local\SwarmUI\src\DataHolders                                                                                                           True
K:\.ai_local\SwarmUI\src\Extensions                                                                                                            True
K:\.ai_local\SwarmUI\src\obj                                                                                                                   True
K:\.ai_local\SwarmUI\src\Pages                                                                                                                 True
K:\.ai_local\SwarmUI\src\srcdata                                                                                                               True
K:\.ai_local\SwarmUI\src\Text2Image                                                                                                            True
K:\.ai_local\SwarmUI\src\Utils                                                                                                                 True
K:\.ai_local\SwarmUI\src\WebAPI                                                                                                                True
K:\.ai_local\SwarmUI\src\wwwroot                                                                                                               True
K:\.ai_local\SwarmUI\src\GlobalSuppressions.cs                                                                                                False
K:\.ai_local\SwarmUI\src\GlobalUsings.cs                                                                                                      False
K:\.ai_local\SwarmUI\src\jsconfig.json                                                                                                        False
K:\.ai_local\SwarmUI\src\SwarmUI.csproj                                                                                                       False
K:\.ai_local\SwarmUI\src\Accounts\Permissions.cs                                                                                              False
K:\.ai_local\SwarmUI\src\Accounts\Role.cs                                                                                                     False
K:\.ai_local\SwarmUI\src\Accounts\Session.cs                                                                                                  False
K:\.ai_local\SwarmUI\src\Accounts\SessionHandler.cs                                                                                           False
K:\.ai_local\SwarmUI\src\Accounts\User.cs                                                                                                     False
K:\.ai_local\SwarmUI\src\Backends\AbstractT2IBackend.cs                                                                                       False
K:\.ai_local\SwarmUI\src\Backends\AutoScalingBackend.cs                                                                                       False
K:\.ai_local\SwarmUI\src\Backends\BackendHandler.cs                                                                                           False
K:\.ai_local\SwarmUI\src\Backends\NetworkBackendUtils.cs                                                                                      False
K:\.ai_local\SwarmUI\src\Backends\SwarmSwarmBackend.cs                                                                                        False
K:\.ai_local\SwarmUI\src\bin\Debug                                                                                                             True
K:\.ai_local\SwarmUI\src\bin\live_release                                                                                                      True
K:\.ai_local\SwarmUI\src\bin\Debug\net8.0                                                                                                      True
K:\.ai_local\SwarmUI\src\bin\live_release\BuiltinExtensions                                                                                    True
K:\.ai_local\SwarmUI\src\bin\live_release\runtimes                                                                                             True
K:\.ai_local\SwarmUI\src\bin\live_release\FreneticUtilities.dll                                                                               False
K:\.ai_local\SwarmUI\src\bin\live_release\Hardware.Info.dll                                                                                   False
K:\.ai_local\SwarmUI\src\bin\live_release\jsconfig.json                                                                                       False
K:\.ai_local\SwarmUI\src\bin\live_release\LiteDB.dll                                                                                          False
K:\.ai_local\SwarmUI\src\bin\live_release\Newtonsoft.Json.dll                                                                                 False
K:\.ai_local\SwarmUI\src\bin\live_release\SixLabors.Fonts.dll                                                                                 False
K:\.ai_local\SwarmUI\src\bin\live_release\SixLabors.ImageSharp.dll                                                                            False
K:\.ai_local\SwarmUI\src\bin\live_release\SixLabors.ImageSharp.Drawing.dll                                                                    False
K:\.ai_local\SwarmUI\src\bin\live_release\SwarmUI.deps.json                                                                                   False
K:\.ai_local\SwarmUI\src\bin\live_release\SwarmUI.dll                                                                                         False
K:\.ai_local\SwarmUI\src\bin\live_release\SwarmUI.exe                                                                                         False
K:\.ai_local\SwarmUI\src\bin\live_release\SwarmUI.pdb                                                                                         False
K:\.ai_local\SwarmUI\src\bin\live_release\SwarmUI.runtimeconfig.json                                                                          False
K:\.ai_local\SwarmUI\src\bin\live_release\SwarmUI.staticwebassets.endpoints.json                                                              False
K:\.ai_local\SwarmUI\src\bin\live_release\SwarmUI.staticwebassets.runtime.json                                                                False
K:\.ai_local\SwarmUI\src\bin\live_release\System.CodeDom.dll                                                                                  False
K:\.ai_local\SwarmUI\src\bin\live_release\System.Configuration.ConfigurationManager.dll                                                       False
K:\.ai_local\SwarmUI\src\bin\live_release\System.Diagnostics.PerformanceCounter.dll                                                           False
K:\.ai_local\SwarmUI\src\bin\live_release\System.Management.dll                                                                               False
K:\.ai_local\SwarmUI\src\bin\live_release\System.Security.Cryptography.ProtectedData.dll                                                      False
K:\.ai_local\SwarmUI\src\bin\live_release\BuiltinExtensions\ComfyUIBackend                                                                     True
K:\.ai_local\SwarmUI\src\bin\live_release\BuiltinExtensions\GridGenerator                                                                      True
K:\.ai_local\SwarmUI\src\bin\live_release\BuiltinExtensions\ComfyUIBackend\CustomWorkflows                                                     True
K:\.ai_local\SwarmUI\src\bin\live_release\BuiltinExtensions\ComfyUIBackend\ExampleWorkflows                                                    True
K:\.ai_local\SwarmUI\src\bin\live_release\BuiltinExtensions\ComfyUIBackend\CustomWorkflows\Examples                                            True
K:\.ai_local\SwarmUI\src\bin\live_release\BuiltinExtensions\ComfyUIBackend\CustomWorkflows\Examples\Basic SDXL.json                           False
K:\.ai_local\SwarmUI\src\bin\live_release\BuiltinExtensions\ComfyUIBackend\ExampleWorkflows\Basic SDXL.json                                   False
K:\.ai_local\SwarmUI\src\bin\live_release\BuiltinExtensions\GridGenerator\Assets                                                               True
K:\.ai_local\SwarmUI\src\bin\live_release\BuiltinExtensions\GridGenerator\Assets\grid.schema.json                                             False
K:\.ai_local\SwarmUI\src\bin\live_release\runtimes\win                                                                                         True
K:\.ai_local\SwarmUI\src\bin\live_release\runtimes\win\lib                                                                                     True
K:\.ai_local\SwarmUI\src\bin\live_release\runtimes\win\lib\net8.0                                                                              True
K:\.ai_local\SwarmUI\src\bin\live_release\runtimes\win\lib\net8.0\System.Diagnostics.PerformanceCounter.dll                                   False
K:\.ai_local\SwarmUI\src\bin\live_release\runtimes\win\lib\net8.0\System.Management.dll                                                       False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\AutoWebUIBackend                                                                                    True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend                                                                                      True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\DynamicThresholding                                                                                 True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator                                                                                       True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ImageBatchTool                                                                                      True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\Scorers                                                                                             True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\AutoWebUIBackend\AutoWebUIAPIAbstractBackend.cs                                                    False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\AutoWebUIBackend\AutoWebUIAPIBackend.cs                                                            False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\AutoWebUIBackend\AutoWebUIBackendExtension.cs                                                      False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\AutoWebUIBackend\AutoWebUISelfStartBackend.cs                                                      False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\AutoWebUIBackend\README.md                                                                         False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\Assets                                                                               True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\CustomWorkflows                                                                      True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes                                                                              True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExampleWorkflows                                                                     True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes                                                                           True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\Tabs                                                                                 True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ThemeCSS                                                                             True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\.gitignore                                                                          False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ComfyUIAPIAbstractBackend.cs                                                        False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ComfyUIAPIBackend.cs                                                                False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ComfyUIBackendExtension.cs                                                          False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ComfyUIRedirectHelper.cs                                                            False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ComfyUISelfStartBackend.cs                                                          False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ComfyUIWebAPI.cs                                                                    False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\README.md                                                                           False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\WorkflowGenerator.cs                                                                False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\WorkflowGeneratorSteps.cs                                                           False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\Assets\comfy_workflow_editor_helper.js                                              False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\Assets\comfy_workflow_editor.css                                                    False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\CustomWorkflows\Examples                                                             True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\CustomWorkflows\Examples\Basic SDXL.json                                            False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF                                                                 True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\__pycache__                                                     True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\tools                                                           True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\__init__.py                                                    False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\.gitignore                                                     False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\dequant.py                                                     False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\LICENSE                                                        False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\loader.py                                                      False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\nodes.py                                                       False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\ops.py                                                         False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\pyproject.toml                                                 False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\README.md                                                      False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\requirements.txt                                               False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\tools\convert.py                                               False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\tools\fix_5d_tensors.py                                        False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\tools\fix_lines_ending.py                                      False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\tools\lcpp.patch                                               False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\tools\read_tensors.py                                          False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\tools\README.md                                                False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\__pycache__\__init__.cpython-312.pyc                           False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\__pycache__\dequant.cpython-312.pyc                            False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\__pycache__\loader.cpython-312.pyc                             False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\__pycache__\nodes.cpython-312.pyc                              False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\DLNodes\ComfyUI-GGUF\__pycache__\ops.cpython-312.pyc                                False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExampleWorkflows\Basic SDXL.json                                                    False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon                                                          True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyExtra                                                           True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__                                              True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\web                                                      True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__init__.py                                             False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmBlending.py                                        False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmClipSeg.py                                         False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmExtractLora.py                                     False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmImages.py                                          False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmInputNodes.py                                      False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmInternalUtil.py                                    False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmKSampler.py                                        False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmLatents.py                                         False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmLoadImageB64.py                                    False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmLoraLoader.py                                      False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmMasks.py                                           False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmMath.py                                            False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmReference.py                                       False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmSaveImageWS.py                                     False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmTextHandling.py                                    False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmTiling.py                                          False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\SwarmUnsampler.py                                       False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\web\swarmhelper.js                                      False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\__init__.cpython-312.pyc                    False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmBlending.cpython-312.pyc               False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmClipSeg.cpython-312.pyc                False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmExtractLora.cpython-312.pyc            False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmImages.cpython-312.pyc                 False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmInputNodes.cpython-312.pyc             False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmInternalUtil.cpython-312.pyc           False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmKSampler.cpython-312.pyc               False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmLatents.cpython-312.pyc                False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmLoadImageB64.cpython-312.pyc           False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmLoraLoader.cpython-312.pyc             False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmMasks.cpython-312.pyc                  False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmMath.cpython-312.pyc                   False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmReference.cpython-312.pyc              False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmSaveImageWS.cpython-312.pyc            False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmTextHandling.cpython-312.pyc           False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmTiling.cpython-312.pyc                 False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyCommon\__pycache__\SwarmUnsampler.cpython-312.pyc              False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyExtra\__pycache__                                               True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyExtra\__init__.py                                              False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyExtra\requirements.txt                                         False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyExtra\SwarmRemBg.py                                            False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyExtra\SwarmSaveAnimationWS.py                                  False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyExtra\SwarmYolo.py                                             False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyExtra\__pycache__\__init__.cpython-312.pyc                     False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyExtra\__pycache__\SwarmRemBg.cpython-312.pyc                   False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyExtra\__pycache__\SwarmSaveAnimationWS.cpython-312.pyc         False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ExtraNodes\SwarmComfyExtra\__pycache__\SwarmYolo.cpython-312.pyc                    False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\Tabs\Text2Image                                                                      True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\Tabs\Text2Image\Comfy Workflow.html                                                 False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ThemeCSS\modern_dark.css                                                            False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ComfyUIBackend\ThemeCSS\punked.css                                                                 False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\DynamicThresholding\assets                                                                          True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\DynamicThresholding\DynamicThresholdingExtension.cs                                                False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\DynamicThresholding\README.md                                                                      False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\DynamicThresholding\assets\dyn_thresh.js                                                           False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets                                                                                True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\GridGenCore.cs                                                                       False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\GridGeneratorExtension.cs                                                            False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\README.md                                                                            False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\bootstrap.bundle.min.js                                                       False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\bootstrap.min.css                                                             False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\grid_gen.css                                                                  False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\grid_gen.js                                                                   False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\grid.schema.json                                                              False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\jquery.min.js                                                                 False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\jsgif.js                                                                      False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\page.html                                                                     False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\placeholder.png                                                               False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\proc.js                                                                       False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\styles-user.css                                                               False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\styles.css                                                                    False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\GridGenerator\Assets\swarmui_gridgen_local.js                                                      False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ImageBatchTool\Assets                                                                               True
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ImageBatchTool\ImageBatchToolExtension.cs                                                          False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ImageBatchTool\README.md                                                                           False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\ImageBatchTool\Assets\image_batcher.js                                                             False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\Scorers\christoph_aesthetic.py                                                                     False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\Scorers\README.md                                                                                  False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\Scorers\requirements.txt                                                                           False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\Scorers\scorer_engine.py                                                                           False
K:\.ai_local\SwarmUI\src\BuiltinExtensions\Scorers\ScorersExtension.cs                                                                        False
K:\.ai_local\SwarmUI\src\Core\Extension.cs                                                                                                    False
K:\.ai_local\SwarmUI\src\Core\ExtensionsManager.cs                                                                                            False
K:\.ai_local\SwarmUI\src\Core\InstallableFeatures.cs                                                                                          False
K:\.ai_local\SwarmUI\src\Core\Installation.cs                                                                                                 False
K:\.ai_local\SwarmUI\src\Core\Program.cs                                                                                                      False
K:\.ai_local\SwarmUI\src\Core\Settings.cs                                                                                                     False
K:\.ai_local\SwarmUI\src\Core\WebServer.cs                                                                                                    False
K:\.ai_local\SwarmUI\src\DataHolders\DataHolder.cs                                                                                            False
K:\.ai_local\SwarmUI\src\DataHolders\NetConfigMetadata.cs                                                                                     False
K:\.ai_local\SwarmUI\src\Extensions\put_extensions_here                                                                                       False
K:\.ai_local\SwarmUI\src\obj\Debug                                                                                                             True
K:\.ai_local\SwarmUI\src\obj\project.assets.json                                                                                              False
K:\.ai_local\SwarmUI\src\obj\project.nuget.cache                                                                                              False
K:\.ai_local\SwarmUI\src\obj\SwarmUI.csproj.nuget.dgspec.json                                                                                 False
K:\.ai_local\SwarmUI\src\obj\SwarmUI.csproj.nuget.g.props                                                                                     False
K:\.ai_local\SwarmUI\src\obj\SwarmUI.csproj.nuget.g.targets                                                                                   False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0                                                                                                      True
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\ref                                                                                                  True
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\refint                                                                                               True
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\staticwebassets                                                                                      True
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\.NETCoreApp,Version=v8.0.AssemblyAttributes.cs                                                      False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\apphost.exe                                                                                         False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\rjimswa.dswa.cache.json                                                                             False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\rjsmcshtml.dswa.cache.json                                                                          False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\rjsmrazor.dswa.cache.json                                                                           False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\rpswa.dswa.cache.json                                                                               False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\staticwebassets.build.endpoints.json                                                                False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\staticwebassets.build.json                                                                          False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\staticwebassets.build.json.cache                                                                    False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\staticwebassets.development.json                                                                    False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.AssemblyInfo.cs                                                                             False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.AssemblyInfoInputs.cache                                                                    False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.assets.cache                                                                                False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.csproj.AssemblyReference.cache                                                              False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.csproj.CoreCompileInputs.cache                                                              False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.csproj.FileListAbsolute.txt                                                                 False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.csproj.Up2Date                                                                              False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.dll                                                                                         False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.GeneratedMSBuildEditorConfig.editorconfig                                                   False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.genruntimeconfig.cache                                                                      False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.MvcApplicationPartsAssemblyInfo.cache                                                       False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.pdb                                                                                         False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.RazorAssemblyInfo.cache                                                                     False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.RazorAssemblyInfo.cs                                                                        False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\SwarmUI.sourcelink.json                                                                             False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\ref\SwarmUI.dll                                                                                     False
K:\.ai_local\SwarmUI\src\obj\Debug\net8.0\refint\SwarmUI.dll                                                                                  False
K:\.ai_local\SwarmUI\src\Pages\_Generate                                                                                                       True
K:\.ai_local\SwarmUI\src\Pages\Error                                                                                                           True
K:\.ai_local\SwarmUI\src\Pages\Shared                                                                                                          True
K:\.ai_local\SwarmUI\src\Pages\_ViewImports.cshtml                                                                                            False
K:\.ai_local\SwarmUI\src\Pages\_ViewStart.cshtml                                                                                              False
K:\.ai_local\SwarmUI\src\Pages\Install.cshtml                                                                                                 False
K:\.ai_local\SwarmUI\src\Pages\Login.cshtml                                                                                                   False
K:\.ai_local\SwarmUI\src\Pages\Text2Image.cshtml                                                                                              False
K:\.ai_local\SwarmUI\src\Pages\Error\404.cshtml                                                                                               False
K:\.ai_local\SwarmUI\src\Pages\Error\BasicAPI.cshtml                                                                                          False
K:\.ai_local\SwarmUI\src\Pages\Error\Internal.cshtml                                                                                          False
K:\.ai_local\SwarmUI\src\Pages\Error\NoGetAPI.cshtml                                                                                          False
K:\.ai_local\SwarmUI\src\Pages\Error\Permissions.cshtml                                                                                       False
K:\.ai_local\SwarmUI\src\Pages\Shared\_Layout.cshtml                                                                                          False
K:\.ai_local\SwarmUI\src\Pages\_Generate\GenerateTab.cshtml                                                                                   False
K:\.ai_local\SwarmUI\src\Pages\_Generate\GenTabModals.cshtml                                                                                  False
K:\.ai_local\SwarmUI\src\Pages\_Generate\ServerTab.cshtml                                                                                     False
K:\.ai_local\SwarmUI\src\Pages\_Generate\SimpleTab.cshtml                                                                                     False
K:\.ai_local\SwarmUI\src\Pages\_Generate\UserTab.cshtml                                                                                       False
K:\.ai_local\SwarmUI\src\Pages\_Generate\UtilitiesTab.cshtml                                                                                  False
K:\.ai_local\SwarmUI\src\srcdata\Tokensets                                                                                                     True
K:\.ai_local\SwarmUI\src\srcdata\Tokensets\clip.txt.gz                                                                                        False
K:\.ai_local\SwarmUI\src\Text2Image\CommonModels.cs                                                                                           False
K:\.ai_local\SwarmUI\src\Text2Image\T2IEngine.cs                                                                                              False
K:\.ai_local\SwarmUI\src\Text2Image\T2IModel.cs                                                                                               False
K:\.ai_local\SwarmUI\src\Text2Image\T2IModelClass.cs                                                                                          False
K:\.ai_local\SwarmUI\src\Text2Image\T2IModelClassSorter.cs                                                                                    False
K:\.ai_local\SwarmUI\src\Text2Image\T2IModelHandler.cs                                                                                        False
K:\.ai_local\SwarmUI\src\Text2Image\T2IMultiStepObjectBuilder.cs                                                                              False
K:\.ai_local\SwarmUI\src\Text2Image\T2IParamInput.cs                                                                                          False
K:\.ai_local\SwarmUI\src\Text2Image\T2IParamSet.cs                                                                                            False
K:\.ai_local\SwarmUI\src\Text2Image\T2IParamTypes.cs                                                                                          False
K:\.ai_local\SwarmUI\src\Text2Image\T2IPreset.cs                                                                                              False
K:\.ai_local\SwarmUI\src\Text2Image\T2IPromptHandling.cs                                                                                      False
K:\.ai_local\SwarmUI\src\Utils\AutoCompleteListHelper.cs                                                                                      False
K:\.ai_local\SwarmUI\src\Utils\CliplikeTokenizer.cs                                                                                           False
K:\.ai_local\SwarmUI\src\Utils\GeneratePageModel.cs                                                                                           False
K:\.ai_local\SwarmUI\src\Utils\Image.cs                                                                                                       False
K:\.ai_local\SwarmUI\src\Utils\ImageMetadataTracker.cs                                                                                        False
K:\.ai_local\SwarmUI\src\Utils\LanguagesHelper.cs                                                                                             False
K:\.ai_local\SwarmUI\src\Utils\Logs.cs                                                                                                        False
K:\.ai_local\SwarmUI\src\Utils\MemCleaner.cs                                                                                                  False
K:\.ai_local\SwarmUI\src\Utils\MemoryNum.cs                                                                                                   False
K:\.ai_local\SwarmUI\src\Utils\MetadataHelper.cs                                                                                              False
K:\.ai_local\SwarmUI\src\Utils\NvidiaUtil.cs                                                                                                  False
K:\.ai_local\SwarmUI\src\Utils\PromptRegion.cs                                                                                                False
K:\.ai_local\SwarmUI\src\Utils\ProxyHandler.cs                                                                                                False
K:\.ai_local\SwarmUI\src\Utils\PythonLaunchHelper.cs                                                                                          False
K:\.ai_local\SwarmUI\src\Utils\SwarmExceptions.cs                                                                                             False
K:\.ai_local\SwarmUI\src\Utils\SystemStatusMonitor.cs                                                                                         False
K:\.ai_local\SwarmUI\src\Utils\UserSoundHelper.cs                                                                                             False
K:\.ai_local\SwarmUI\src\Utils\Utilities.cs                                                                                                   False
K:\.ai_local\SwarmUI\src\Utils\WebhookManager.cs                                                                                              False
K:\.ai_local\SwarmUI\src\Utils\WebUtil.cs                                                                                                     False
K:\.ai_local\SwarmUI\src\Utils\WildcardsHelper.cs                                                                                             False
K:\.ai_local\SwarmUI\src\WebAPI\AdminAPI.cs                                                                                                   False
K:\.ai_local\SwarmUI\src\WebAPI\API.cs                                                                                                        False
K:\.ai_local\SwarmUI\src\WebAPI\APICall.cs                                                                                                    False
K:\.ai_local\SwarmUI\src\WebAPI\APICallReflectBuilder.cs                                                                                      False
K:\.ai_local\SwarmUI\src\WebAPI\BackendAPI.cs                                                                                                 False
K:\.ai_local\SwarmUI\src\WebAPI\BasicAPIFeatures.cs                                                                                           False
K:\.ai_local\SwarmUI\src\WebAPI\ModelsAPI.cs                                                                                                  False
K:\.ai_local\SwarmUI\src\WebAPI\T2IAPI.cs                                                                                                     False
K:\.ai_local\SwarmUI\src\WebAPI\UserUpstreamApiKeys.cs                                                                                        False
K:\.ai_local\SwarmUI\src\WebAPI\UtilAPI.cs                                                                                                    False
K:\.ai_local\SwarmUI\src\wwwroot\css                                                                                                           True
K:\.ai_local\SwarmUI\src\wwwroot\fonts                                                                                                         True
K:\.ai_local\SwarmUI\src\wwwroot\imgs                                                                                                          True
K:\.ai_local\SwarmUI\src\wwwroot\js                                                                                                            True
K:\.ai_local\SwarmUI\src\wwwroot\favicon.ico                                                                                                  False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes                                                                                                    True
K:\.ai_local\SwarmUI\src\wwwroot\css\bootstrap.min.css                                                                                        False
K:\.ai_local\SwarmUI\src\wwwroot\css\choices.min.css                                                                                          False
K:\.ai_local\SwarmUI\src\wwwroot\css\genpage.css                                                                                              False
K:\.ai_local\SwarmUI\src\wwwroot\css\installer.css                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\css\site.css                                                                                                 False
K:\.ai_local\SwarmUI\src\wwwroot\css\theme.css                                                                                                False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\beweish.css                                                                                       False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\custom-theme.css                                                                                  False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\cyber_swarm.css                                                                                   False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\cyber-noir.css                                                                                    False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\dark_dreams.css                                                                                   False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\eyesear_white.css                                                                                 False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\gravity_blue.css                                                                                  False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\midnight-dystopia.css                                                                             False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\modern_dark.css                                                                                   False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\modern_light.css                                                                                  False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\modern.css                                                                                        False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\punked.css                                                                                        False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\sentinel.css                                                                                      False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\solarized.css                                                                                     False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\swarmpunk.css                                                                                     False
K:\.ai_local\SwarmUI\src\wwwroot\css\themes\void-runner.css                                                                                   False
K:\.ai_local\SwarmUI\src\wwwroot\fonts\Inter.woff2                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\fonts\MaterialSymbolsOutlined.LICENSE.txt                                                                    False
K:\.ai_local\SwarmUI\src\wwwroot\fonts\MaterialSymbolsOutlined.woff2                                                                          False
K:\.ai_local\SwarmUI\src\wwwroot\fonts\unifont-12.0.01.woff2                                                                                  False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags                                                                                                    True
K:\.ai_local\SwarmUI\src\wwwroot\imgs\automatic.jpg                                                                                           False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\canvas_move.png                                                                                         False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\canvas_rotate.png                                                                                       False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\dotdotdot.png                                                                                           False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\eraser.png                                                                                              False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\folder.png                                                                                              False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\html.jpg                                                                                                False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\icon-attrib.txt                                                                                         False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\legacy_ckpt.jpg                                                                                         False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\model_placeholder.jpg                                                                                   False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\mouse.png                                                                                               False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\move.png                                                                                                False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\noise.png                                                                                               False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\none.jpg                                                                                                False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\paintbrush.png                                                                                          False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\paintbucket.png                                                                                         False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\select.png                                                                                              False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\ar.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\de.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\en.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\es.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\fr.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\hi.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\it.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\ja.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\nl.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\pt.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\ru.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\sv.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\tr.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\vi.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\imgs\flags\zh.jpg                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage                                                                                                    True
K:\.ai_local\SwarmUI\src\wwwroot\js\lib                                                                                                        True
K:\.ai_local\SwarmUI\src\wwwroot\js\installer.js                                                                                              False
K:\.ai_local\SwarmUI\src\wwwroot\js\loginpage.js                                                                                              False
K:\.ai_local\SwarmUI\src\wwwroot\js\permissions.js                                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\js\site.js                                                                                                   False
K:\.ai_local\SwarmUI\src\wwwroot\js\translator.js                                                                                             False
K:\.ai_local\SwarmUI\src\wwwroot\js\util.js                                                                                                   False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\gentab                                                                                             True
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\helpers                                                                                            True
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\server                                                                                             True
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\main.js                                                                                           False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\simpletab.js                                                                                      False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\usertab.js                                                                                        False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\utiltab.js                                                                                        False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\gentab\currentimagehandler.js                                                                     False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\gentab\generatecontrols.js                                                                        False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\gentab\imagehistory.js                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\gentab\layout.js                                                                                  False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\gentab\loras.js                                                                                   False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\gentab\models.js                                                                                  False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\gentab\params.js                                                                                  False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\gentab\presets.js                                                                                 False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\gentab\prompttools.js                                                                             False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\gentab\welcomemessages.js                                                                         False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\gentab\wildcards.js                                                                               False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\helpers\browsers.js                                                                               False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\helpers\finalscript.js                                                                            False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\helpers\generatehandler.js                                                                        False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\helpers\image_editor.js                                                                           False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\helpers\metadatahelpers.js                                                                        False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\helpers\settings_editor.js                                                                        False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\helpers\ui_improvements.js                                                                        False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\server\backends.js                                                                                False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\server\logs.js                                                                                    False
K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\server\servertab.js                                                                               False
K:\.ai_local\SwarmUI\src\wwwroot\js\lib\bootstrap.bundle.min.js                                                                               False
K:\.ai_local\SwarmUI\src\wwwroot\js\lib\bootstrap.min.js                                                                                      False
K:\.ai_local\SwarmUI\src\wwwroot\js\lib\choices.min.js                                                                                        False
K:\.ai_local\SwarmUI\src\wwwroot\js\lib\exif-reader.min.js                                                                                    False


```

**Files Read:**

**K:\.ai_local\SwarmUI\src\Pages\Shared\_Layout.cshtml**

```
﻿﻿<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title id="page_title">@ViewData["Title"] - SwarmUI</title>
    <link id="bs_theme_header" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" id="sitecssheader" href="~/css/site.css?vary=@Utilities.VaryID" />
    <link rel="stylesheet" id="themecssheader" href="~/css/theme.css?vary=@Utilities.VaryID" />
    @RenderSection("Header", required: false)
    @WebServer.PageHeaderExtra
    <link id="favicon" rel="shortcut icon" href="~/favicon.ico" />
    <script src="~/js/util.js?vary=@Utilities.VaryID"></script>
    <script src="~/js/translator.js?vary=@Utilities.VaryID"></script>
</head>
<body>
    <header>
        <!-- Tier 1: Global header -->
        <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
            <div class="container-fluid">
                <a class="navbar-brand" href="/Text2Image">
                    <img src="/imgs/logo_icon.svg" alt="SwarmUI Logo" width="30" height="24" class="d-inline-block align-text-top">
                    SwarmUI
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item"><a class="nav-link" href="/Text2Image#Generate">Generate</a></li>
                        <li class="nav-item"><a class="nav-link" href="/Text2Image#Comfy">Comfy Workflow</a></li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Utilities</a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/Text2Image#Utilities">Open Utilities</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Settings</a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/Text2Image#Settings/API-Keys">API Keys</a></li>
                                <li><a class="dropdown-item" href="/Text2Image#Settings/User">User Config</a></li>
                                <li><a class="dropdown-item" href="/Text2Image#Settings/Layout">Layout Config</a></li>
                            </ul>
                        </li>
                        <li class="nav-item"><a class="nav-link" href="/Text2Image#Server">Server</a></li>
                    </ul>
                    <div class="d-flex align-items-center gap-2">
                        <div id="top_status_bar" class="pe-2"></div>
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-person-circle"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="/Accounts/View">Account</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/Logout">Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <!-- Tier 2: Workspace bar -->
        <div class="bg-body-tertiary border-bottom">
            <div class="container-fluid py-1 d-flex flex-wrap align-items-center gap-2">
                <div class="btn-group" role="group" aria-label="Workspace selector">
                    <a id="ws_generate" class="btn btn-sm btn-outline-secondary" href="/Text2Image#Generate">Generate</a>
                    <a id="ws_simple" class="btn btn-sm btn-outline-secondary" href="/Text2Image#Simple">Simple</a>
                    <a id="ws_comfy" class="btn btn-sm btn-outline-secondary" href="/Text2Image#Comfy">Comfy</a>
                    <a id="ws_utilities" class="btn btn-sm btn-outline-secondary" href="/Text2Image#Utilities">Utilities</a>
                    <a id="ws_settings" class="btn btn-sm btn-outline-secondary" href="/Text2Image#Settings">Settings</a>
                    <a id="ws_server" class="btn btn-sm btn-outline-secondary" href="/Text2Image#Server">Server</a>
                </div>
                <div class="ms-auto small text-secondary" id="workspace_hint"></div>
            </div>
        </div>
        <!-- Tier 2 Sub-nav: mirrors page sub-tabs for active workspace -->
        <div class="bg-body-tertiary border-bottom" id="workspace_subnav_bar" style="display:none;">
            <div class="container-fluid py-1">
                <ul class="nav nav-pills nav-sm" id="workspace_subnav_list"></ul>
            </div>
        </div>
    </header>
    <main role="main" class="container-fluid mt-3">
        @RenderBody()
    </main>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="error_toast_box" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">Error</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div id="error_toast_content" class="toast-body">
            </div>
        </div>
    </div>
    <footer class="footer mt-auto py-3 bg-light">
        <div class="container">
            <span class="text-muted" id="version_display">SwarmUI v<span>@Utilities.Version</span><span> (@Program.CurrentGitDate)</span></span>
        </div>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="~/js/permissions.js?vary=@Utilities.VaryID"></script>
    <script src="~/js/site.js?vary=@Utilities.VaryID"></script>
    @RenderSection("Scripts", required: false)
</body>
</html>

```

**K:\.ai_local\SwarmUI\src\Pages\Text2Image.cshtml**

```
﻿@page
@{
    ViewData["Title"] = "Page is loading...";
    GeneratePageModel pageModel = new(HttpContext);
    string doCheckForUpdates = Program.ServerSettings.Maintenance.CheckForUpdates ? "true" : "false";
}
@section Header {
    <link rel="stylesheet" href="css/genpage.css?vary=@Utilities.VaryID" />
}

@if (!Program.ServerSettings.IsInstalled)
{
    <script>
        window.location.href = "Install";
    </script>
    return;
}
@if (pageModel.IsLoginEnabled && pageModel.User is null)
{
    <script>
        window.location.href = "Login";
    </script>
    return;
}
<script>
    window.alwaysRefreshOnLoad = @pageModel.AlwaysRefreshOnLoad;
    window.instanceTitle = "@pageModel.InstanceTitle";
    window.comfy_features = {};
    window.checkForUpdatesAutomatically = @doCheckForUpdates;
    @foreach (InstallableFeatures.ComfyInstallableFeature feature in InstallableFeatures.ComfyFeatures.Values)
    {
        <text>
            window.comfy_features["@feature.ID"] = {
                "display_name": "@feature.DisplayName",
                "id": "@feature.ID",
                "url": "@feature.URL",
                "author": "@feature.Author",
                "notice": "@(new HtmlString(Utilities.EscapeJsonString(feature.Notice)))"
            };
        </text>
    }
</script>

<div class="container-fluid mt-2">
    <ul class="nav nav-pills" role="tablist" id="toptablist" style="display:none">
        <li class="nav-item" role="presentation" data-requiredpermission="comfy_dynamic_custom_workflows">
            <a class="nav-link translate" data-bs-toggle="tab" href="#Simple" id="simpletabbutton" aria-selected="false" tabindex="-1" role="tab">Simple</a>
        </li>
        <li class="nav-item" role="presentation">
            <a class="nav-link active translate" data-bs-toggle="tab" href="#Text2Image" id="text2imagetabbutton" aria-selected="true" role="tab">Generate</a>
        </li>
        @WebServer.T2ITabHeader
        <li class="nav-item" role="presentation">
            <a class="nav-link translate" data-bs-toggle="tab" href="#utilities_tab" id="utilitiestabbutton" aria-selected="false" tabindex="-1" role="tab">Utilities</a>
        </li>
        <li class="nav-item" role="presentation">
            <a class="nav-link translate" data-bs-toggle="tab" href="#user_tab" id="usersettingstabbutton" aria-selected="false" tabindex="-1" role="tab">User</a>
        </li>
        <li class="nav-item" role="presentation" data-requiredpermission="view_server_tab">
            <a class="nav-link translate" data-bs-toggle="tab" href="#server_tab" id="servertabbutton" aria-selected="false" tabindex="-1" role="tab">Server</a>
        </li>
    </ul>
    <div class="tab-content tab-hundred mt-2">
        <div class="tab-pane tab-pane-vw" id="Simple" role="tabpanel">
            @await Html.PartialAsync("_Generate/SimpleTab.cshtml", pageModel)
        </div>
        <div class="tab-pane show active" id="Text2Image" role="tabpanel">
            @await Html.PartialAsync("_Generate/GenerateTab.cshtml", pageModel)
        </div>
        @WebServer.T2ITabBody
        <div class="tab-pane tab-pane-vw" id="utilities_tab" role="tabpanel">
            @await Html.PartialAsync("_Generate/UtilitiesTab.cshtml", pageModel)
        </div>
        <div class="tab-pane tab-pane-vw" id="user_tab" role="tabpanel">
            @await Html.PartialAsync("_Generate/UserTab.cshtml", pageModel)
        </div>
        <div class="tab-pane tab-pane-vw" id="server_tab" role="tabpanel">
            @await Html.PartialAsync("_Generate/ServerTab.cshtml", pageModel)
        </div>
    </div>
</div>

@section Scripts {
    <script src="js/lib/exif-reader.min.js"></script>
    <script src="js/lib/choices.min.js"></script>
    <script src="js/genpage/gentab/welcomemessages.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/helpers/browsers.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/server/logs.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/server/backends.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/gentab/presets.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/gentab/wildcards.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/gentab/loras.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/gentab/models.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/gentab/params.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/gentab/prompttools.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/utiltab.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/server/servertab.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/usertab.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/helpers/image_editor.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/helpers/generatehandler.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/simpletab.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/gentab/layout.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/helpers/metadatahelpers.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/gentab/generatecontrols.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/gentab/currentimagehandler.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/gentab/imagehistory.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/main.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/helpers/settings_editor.js?vary=@Utilities.VaryID"></script>
    <script src="js/genpage/helpers/ui_improvements.js?vary=@Utilities.VaryID"></script>
    @WebServer.PageFooterExtra
    <script src="js/genpage/helpers/finalscript.js?vary=@Utilities.VaryID"></script>
}

```

**K:\.ai_local\SwarmUI\src\Pages\_ViewStart.cshtml**

```
﻿@{
    Layout = "_Layout";
}

```

**K:\.ai_local\SwarmUI\src\Pages\_ViewImports.cshtml**

```
﻿@using SwarmUI.Core
@using SwarmUI.Utils
@using Microsoft.AspNetCore.Html
@using SwarmUI.Text2Image
@using SwarmUI.WebAPI
@using SwarmUI.Accounts
@using FreneticUtilities.FreneticExtensions
@namespace SwarmUI.Pages
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers

```

**K:\.ai_local\SwarmUI\src\wwwroot\js\genpage\main.js**

```
let gen_param_types = null, rawGenParamTypesFromServer = null, rawGroupMapFromServer = null;

let swarmHasLoaded = false;

let lastImageDir = '';

let lastModelDir = '';

let num_current_gens = 0, num_models_loading = 0, num_live_gens = 0, num_backends_waiting = 0;

let shouldApplyDefault = false;

let sessionReadyCallbacks = [];

let allModels = [];

let coreModelMap = {};

let otherInfoSpanContent = [];

let isGeneratingForever = false, isGeneratingPreviews = false;

let lastHistoryImage = null, lastHistoryImageDiv = null;

let currentMetadataVal = null, currentImgSrc = null;

let autoCompletionsList = null;
let autoCompletionsOptimize = false;

let mainGenHandler = new GenerateHandler();

let pageTitleSuffix = document.title.split(' - ')[1];
let curAutoTitle = "Page is loading...";

function setPageTitle(newTitle) {
    document.title = `${newTitle} - ${pageTitleSuffix}`;
}

function autoTitle() {
    let tabList = getRequiredElementById('toptablist');
    let activeTopTab = tabList.querySelector('.active');
    curAutoTitle = activeTopTab.textContent;
    setPageTitle(curAutoTitle);
}

function updateOtherInfoSpan() {
    let span = getRequiredElementById('other_info_span');
    span.innerHTML = otherInfoSpanContent.join(' ');
}

const time_started = Date.now();

let statusBarElem = getRequiredElementById('top_status_bar');

let generatingPreviewsText = translatable('Generating live previews...');
let waitingOnModelLoadText = translatable('waiting on model load');
let generatingText = translatable('generating');

function updateCurrentStatusDirect(data) {
    if (data) {
        num_current_gens = data.waiting_gens;
        num_models_loading = data.loading_models;
        num_live_gens = data.live_gens;
        num_backends_waiting = data.waiting_backends;
    }
    let total = num_current_gens + num_models_loading + num_live_gens + num_backends_waiting;
    if (isGeneratingPreviews && num_current_gens <= getRequiredElementById('usersettings_maxsimulpreviews').value) {
        total = 0;
    }
    getRequiredElementById('alt_interrupt_button').classList.toggle('interrupt-button-none', total == 0);
    let oldInterruptButton = document.getElementById('interrupt_button');
    if (oldInterruptButton) {
        oldInterruptButton.classList.toggle('interrupt-button-none', total == 0);
    }
    let elem = getRequiredElementById('num_jobs_span');
    function autoBlock(num, text) {
        if (num == 0) {
            return '';
        }
        return `<span class="interrupt-line-part">${num} ${text.replaceAll('%', autoS(num))},</span> `;
    }
    let timeEstimate = '';
    if (total > 0 && mainGenHandler.totalGensThisRun > 0) {
        let avgGenTime = mainGenHandler.totalGenRunTime / mainGenHandler.totalGensThisRun;
        let estTime = avgGenTime * total;
        timeEstimate = ` (est. ${durationStringify(estTime)})`;
    }
    elem.innerHTML = total == 0 ? (isGeneratingPreviews ? generatingPreviewsText.get() : '') : `${autoBlock(num_current_gens, 'current generation%')}${autoBlock(num_live_gens, 'running')}${autoBlock(num_backends_waiting, 'queued')}${autoBlock(num_models_loading, waitingOnModelLoadText.get())} ${timeEstimate}...`;
    let max = Math.max(num_current_gens, num_models_loading, num_live_gens, num_backends_waiting);
    setPageTitle(total == 0 ? curAutoTitle : `(${max} ${generatingText.get()}) ${curAutoTitle}`);
}

let doesHaveGenCountUpdateQueued = false;

function updateGenCount() {
    updateCurrentStatusDirect(null);
    if (doesHaveGenCountUpdateQueued) {
        return;
    }
    doesHaveGenCountUpdateQueued = true;
    setTimeout(() => {
        reviseStatusBar();
    }, 500);
}

let hasAppliedFirstRun = false;
let backendsWereLoadingEver = false;
let reviseStatusInterval = null;
let currentBackendFeatureSet = [];
let rawBackendFeatureSet = [];
let lastStatusRequestPending = 0;
function reviseStatusBar() {
    if (lastStatusRequestPending + 20 * 1000 > Date.now()) {
        return;
    }
    if (session_id == null) {
        statusBarElem.innerText = 'Loading...';
        statusBarElem.className = `top-status-bar status-bar-warn`;
        return;
    }
    lastStatusRequestPending = Date.now();
    genericRequest('GetCurrentStatus', {}, data => {
        lastStatusRequestPending = 0;
        if (JSON.stringify(data.supported_features) != JSON.stringify(currentBackendFeatureSet)) {
            rawBackendFeatureSet = data.supported_features;
            currentBackendFeatureSet = data.supported_features;
            reviseBackendFeatureSet();
            hideUnsupportableParams();
        }
        doesHaveGenCountUpdateQueued = false;
        updateCurrentStatusDirect(data.status);
        let status;
        if (versionIsWrong) {
            status = { 'class': 'error', 'message': 'The server has updated since you opened the page, please refresh.' };
        }
        else {
            status = data.backend_status;
            if (data.backend_status.any_loading) {
                backendsWereLoadingEver = true;
            }
            else {
                if (!hasAppliedFirstRun) {
                    hasAppliedFirstRun = true;
                    refreshParameterValues(backendsWereLoadingEver || window.alwaysRefreshOnLoad);
                }
            }
            if (reviseStatusInterval != null) {
                if (status.class != '') {
                    clearInterval(reviseStatusInterval);
                    reviseStatusInterval = setInterval(reviseStatusBar, 2 * 1000);
                }
                else {
                    clearInterval(reviseStatusInterval);
                    reviseStatusInterval = setInterval(reviseStatusBar, 60 * 1000);
                }
            }
        }
        statusBarElem.innerText = translate(status.message);
        statusBarElem.className = `top-status-bar status-bar-${status.class}`;
    });
}

/** Array of functions called on key events (eg model selection change) to update displayed features.
 * Return format [array addMe, array removeMe]. For example `[[], ['sd3']]` indicates that the 'sd3' feature flag is not currently supported (eg by current model).
 * Can use 'curModelCompatClass', 'curModelArch' to check the current model architecture. Note these values may be null.
 * */
let featureSetChangers = [];

function reviseBackendFeatureSet() {
    currentBackendFeatureSet = Array.from(currentBackendFeatureSet);
    let addMe = [], removeMe = [];
    function doCompatFeature(compatClass, featureFlag) {
        if (curModelCompatClass && curModelCompatClass.startsWith(compatClass)) {
            addMe.push(featureFlag);
        }
        else {
            removeMe.push(featureFlag);
        }
    }
    function doAnyCompatFeature(compatClasses, featureFlag) {
        for (let compatClass of compatClasses) {
            if (curModelCompatClass && curModelCompatClass.startsWith(compatClass)) {
                addMe.push(featureFlag);
                return;
            }
        }
        removeMe.push(featureFlag);
    }
    function doAnyArchFeature(archIds, featureFlag) {
        for (let archId of archIds) {
            if (curModelArch && curModelArch.startsWith(archId)) {
                addMe.push(featureFlag);
                return;
            }
        }
        removeMe.push(featureFlag);
    }
    doCompatFeature('stable-diffusion-v3', 'sd3');
    doCompatFeature('stable-cascade-v1', 'cascade');
    doAnyArchFeature(['Flux.1-dev', 'hunyuan-video'], 'flux-dev');
    doCompatFeature('stable-diffusion-xl-v1', 'sdxl');
    doAnyCompatFeature(['genmo-mochi-1', 'lightricks-ltx-video', 'hunyuan-video', 'nvidia-cosmos-1', `wan-21`, `wan-22`], 'text2video');
    for (let changer of featureSetChangers) {
        let [add, remove] = changer();
        addMe.push(...add);
        removeMe.push(...remove);
    }
    let anyChanged = false;
    for (let add of addMe) {
        if (!currentBackendFeatureSet.includes(add)) {
            currentBackendFeatureSet.push(add);
            anyChanged = true;
        }
    }
    for (let remove of removeMe) {
        let index = currentBackendFeatureSet.indexOf(remove);
        if (index != -1) {
            currentBackendFeatureSet.splice(index, 1);
            anyChanged = true;
        }
    }
    if (anyChanged) {
        hideUnsupportableParams();
    }
}

let toolSelector = getRequiredElementById('tool_selector');
let toolContainer = getRequiredElementById('tool_container');

function genToolsList() {
    let altGenerateButton = getRequiredElementById('alt_generate_button');
    let oldGenerateButton = document.getElementById('generate_button');
    let altGenerateButtonRawText = altGenerateButton.innerText;
    let altGenerateButtonRawOnClick = altGenerateButton.onclick;
    toolSelector.value = '';
    // TODO: Dynamic-from-server option list generation
    toolSelector.addEventListener('change', () => {
        for (let opened of toolContainer.getElementsByClassName('tool-open')) {
            opened.classList.remove('tool-open');
        }
        altGenerateButton.innerText = altGenerateButtonRawText;
        altGenerateButton.onclick = altGenerateButtonRawOnClick;
        if (oldGenerateButton) {
            oldGenerateButton.innerText = altGenerateButtonRawText;
        }
        let tool = toolSelector.value;
        if (tool == '') {
            getRequiredElementById('clear_selected_tool_button').style.display = 'none';
            return;
        }
        let div = getRequiredElementById(`tool_${tool}`);
        div.classList.add('tool-open');
        let override = toolOverrides[tool];
        if (override) {
            altGenerateButton.innerText = override.text;
            altGenerateButton.onclick = override.run;
            if (oldGenerateButton) {
                oldGenerateButton.innerText = override.text;
            }
        }
        div.dispatchEvent(new Event('tool-opened'));
        getRequiredElementById('clear_selected_tool_button').style.display = '';
    });
}

let toolOverrides = {};

function registerNewTool(id, name, genOverride = null, runOverride = null) {
    let option = document.createElement('option');
    option.value = id;
    option.innerText = name;
    toolSelector.appendChild(option);
    let div = createDiv(`tool_${id}`, 'tool');
    toolContainer.appendChild(div);
    if (genOverride) {
        toolOverrides[id] = { 'text': genOverride, 'run': runOverride };
    }
    return div;
}
function disableSelectedTool() {
    toolSelector.value = '';
    triggerChangeFor(toolSelector);
}

let notePadTool = registerNewTool('note_pad', 'Text Notepad');
notePadTool.appendChild(createDiv(`note_pad_tool_wrapper`, `note_pad_tool_wrapper`, `<span class="translate hoverable-minor-hint-text">This is an open text box where you can type any notes you need to keep track of. They will be temporarily persisted in browser session.</span><br><br><textarea id="note_pad_tool" class="auto-text" style="width:100%;height:100%;" placeholder="Type any notes here..."></textarea>`));
let notePadToolElem = getRequiredElementById('note_pad_tool');
notePadToolElem.value = localStorage.getItem('note_pad_tool') || '';
let notePadToolSaveEvent = null;
notePadToolElem.addEventListener('input', () => {
    if (notePadToolSaveEvent) {
        clearTimeout(notePadToolSaveEvent);
    }
    notePadToolSaveEvent = setTimeout(() => {
        localStorage.setItem('note_pad_tool', notePadToolElem.value);
    }, 1000);
    textBoxSizeAdjust(notePadToolElem);
});
notePadTool.addEventListener('tool-opened', () => {
    textBoxSizeAdjust(notePadToolElem);
});

function tweakNegativePromptBox() {
    let altNegText = getRequiredElementById('alt_negativeprompt_textbox');
    let cfgScale = document.getElementById('input_cfgscale');
    let cfgScaleVal = cfgScale ? parseFloat(cfgScale.value) : 7;
    if (cfgScaleVal == 1) {
        altNegText.classList.add('alt-negativeprompt-textbox-invalid');
        altNegText.placeholder = translate(`Negative Prompt is not available when CFG Scale is 1`);
    }
    else {
        altNegText.classList.remove('alt-negativeprompt-textbox-invalid');
        altNegText.placeholder = translate(`Optionally, type a negative prompt here...`);
    }
    altNegText.title = altNegText.placeholder;
}

function loadUserData(callback) {
    genericRequest('GetMyUserData', {}, data => {
        permissions.updateFrom(data.permissions);
        starredModels = data.starred_models;
        autoCompletionsList = {};
        if (data.autocompletions) {
            let allSet = [];
            autoCompletionsList['all'] = allSet;
            for (let val of data.autocompletions) {
                let split = val.split('\n');
                let datalist = autoCompletionsList[val[0]];
                let entry = { name: split[0], low: split[1].replaceAll(' ', '_').toLowerCase(), clean: split[1], raw: val, count: 0 };
                if (split.length > 2) {
                    entry.tag = split[2];
                }
                if (split.length > 3) {
                    count = parseInt(split[3]) || 0;
                    if (count) {
                        entry.count = count;
                        entry.count_display = largeCountStringify(count);
                    }
                }
                if (split.length > 4) {
                    entry.alts = split[4].split(',').map(x => x.trim().toLowerCase());
                    for (let alt of entry.alts) {
                        if (!autoCompletionsList[alt]) {
                            autoCompletionsList[alt] = [];
                        }
                        autoCompletionsList[alt].push(entry);
                    }
                }
                else {
                    entry.alts = [];
                }
                if (!datalist) {
                    datalist = [];
                    autoCompletionsList[val[0]] = datalist;
                }
                datalist.push(entry);
                allSet.push(entry);
            }
        }
        else {
            autoCompletionsList = null;
        }
        if (!language) {
            language = data.language;
        }
        allPresetsUnsorted = data.presets;
        sortPresets();
        presetBrowser.update();
        if (shouldApplyDefault) {
            shouldApplyDefault = false;
            let defaultPreset = getPresetByTitle('default');
            if (defaultPreset) {
                applyOnePreset(defaultPreset);
            }
        }
        if (callback) {
            callback();
        }
        loadAndApplyTranslations();
    });
}

function updateAllModels(models) {
    coreModelMap = models;
    allModels = models['Stable-Diffusion'];
    let selector = getRequiredElementById('current_model');
    let selectorVal = selector.value;
    selector.innerHTML = '';
    let emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.innerText = '';
    selector.appendChild(emptyOption);
    for (let model of allModels) {
        let option = document.createElement('option');
        let clean = cleanModelName(model);
        option.value = clean;
        option.innerText = clean;
        selector.appendChild(option);
    }
    selector.value = selectorVal;
    pickle2safetensor_load();
    modelDownloader.reloadFolders();
}

/** Set some element titles via JavaScript (to allow '\n'). */
function setTitles() {
    getRequiredElementById('alt_prompt_textbox').title = "Tell the AI what you want to see, then press Enter to submit.\nConsider 'a photo of a cat', or 'cartoonish drawing of an astronaut'";
    getRequiredElementById('alt_interrupt_button').title = "Interrupt current generation(s)\nRight-click for advanced options.";
    getRequiredElementById('alt_generate_button').title = "Start generating images\nRight-click for advanced options.";
    let oldGenerateButton = document.getElementById('generate_button');
    if (oldGenerateButton) {
        oldGenerateButton.title = getRequiredElementById('alt_generate_button').title;
        getRequiredElementById('interrupt_button').title = getRequiredElementById('alt_interrupt_button').title;
    }
}
setTitles();

function doFeatureInstaller(name, button_div_id, alt_confirm, callback = null, deleteButton = true) {
    if (!confirm(alt_confirm)) {
        return;
    }
    let buttonDiv = button_div_id ? document.getElementById(button_div_id) : null;
    if (buttonDiv) {
        buttonDiv.querySelector('button').disabled = true;
        buttonDiv.appendChild(createDiv('', null, 'Installing...'));
    }
    genericRequest('ComfyInstallFeatures', {'features': name}, data => {
        if (buttonDiv) {
            buttonDiv.appendChild(createDiv('', null, "Installed! Please wait while backends restart. If it doesn't work, you may need to restart Swarm."));
        }
        reviseStatusBar();
        setTimeout(() => {
            if (deleteButton && buttonDiv) {
                buttonDiv.remove();
            }
            hasAppliedFirstRun = false;
            reviseStatusBar();
            if (callback) {
                callback();
            }
        }, 8000);
    }, 0, (e) => {
        showError(e);
        if (buttonDiv) {
            buttonDiv.appendChild(createDiv('', null, 'Failed to install!'));
            buttonDiv.querySelector('button').disabled = false;
        }
    });
}

function installFeatureById(ids, buttonId = null, modalId = null) {
    let notice = '';
    for (let id of ids.split(',')) {
        let feature = comfy_features[id];
        if (!feature) {
            console.error(`Feature ID ${id} not found in comfy_features, can't install`);
            return;
        }
        notice += feature.notice + '\n';
    }
doFeatureInstaller(ids, buttonId, notice.trim(), () => {
        if (modalId) {
            hideModalById(modalId);
        }
    });
}

function installTensorRT() {
    doFeatureInstaller('comfyui_tensorrt', 'install_trt_button', `This will install TensorRT support developed by Comfy and NVIDIA.\nDo you wish to install?`, () => {
        getRequiredElementById('tensorrt_mustinstall').style.display = 'none';
        getRequiredElementById('tensorrt_modal_ready').style.display = '';
    });
}

function clearPromptImages() {
    let promptImageArea = getRequiredElementById('alt_prompt_image_area');
    promptImageArea.innerHTML = '';
    let clearButton = getRequiredElementById('alt_prompt_image_clear_button');
    clearButton.style.display = 'none';
    autoRevealRevision();
}

function hideRevisionInputs() {
    let revisionGroup = document.getElementById('input_group_imageprompting');
    let revisionToggler = document.getElementById('input_group_content_imageprompting_toggle');
    if (revisionGroup) {
        revisionToggler.checked = false;
        triggerChangeFor(revisionToggler);
        toggleGroupOpen(revisionGroup, false);
        revisionGroup.style.display = 'none';
    }
    genTabLayout.altPromptSizeHandle();
}

function showRevisionInputs(toggleOn = false) {
    let revisionGroup = document.getElementById('input_group_imageprompting');
    let revisionToggler = document.getElementById('input_group_content_imageprompting_toggle');
    if (revisionGroup) {
        toggleGroupOpen(revisionGroup, true);
        if (toggleOn) {
            revisionToggler.checked = true;
            triggerChangeFor(revisionToggler);
        }
        revisionGroup.style.display = '';
    }
}

revisionRevealerSources = [];

function autoRevealRevision() {
    let promptImageArea = getRequiredElementById('alt_prompt_image_area');
    if (promptImageArea.children.length > 0 || revisionRevealerSources.some(x => x())) {
        showRevisionInputs();
    }
    else {
        hideRevisionInputs();
    }
}

function imagePromptAddImage(file) {
    let clearButton = getRequiredElementById('alt_prompt_image_clear_button');
    let promptImageArea = getRequiredElementById('alt_prompt_image_area');
    let reader = new FileReader();
    reader.onload = (e) => {
        let data = e.target.result;
        let imageContainer = createDiv(null, 'alt-prompt-image-container');
        let imageRemoveButton = createSpan(null, 'alt-prompt-image-container-remove-button', '&times;');
        imageRemoveButton.addEventListener('click', (e) => {
            imageContainer.remove();
            autoRevealRevision();
            genTabLayout.altPromptSizeHandle();
        });
        imageRemoveButton.title = 'Remove this image';
        imageContainer.appendChild(imageRemoveButton);
        let imageObject = new Image();
        imageObject.src = data;
        imageObject.height = 128;
        imageObject.className = 'alt-prompt-image';
        imageObject.dataset.filedata = data;
        imageContainer.appendChild(imageObject);
        clearButton.style.display = '';
        showRevisionInputs(true);
        promptImageArea.appendChild(imageContainer);
        genTabLayout.altPromptSizeHandle();
    };
    reader.readAsDataURL(file);
}

function imagePromptInputHandler() {
    let dragArea = getRequiredElementById('alt_prompt_region');
    dragArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
    let clearButton = getRequiredElementById('alt_prompt_image_clear_button');
    clearButton.addEventListener('click', () => {
        clearPromptImages();
    });
    dragArea.addEventListener('drop', (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            e.preventDefault();
            e.stopPropagation();
            for (let file of e.dataTransfer.files) {
                if (file.type.startsWith('image/')) {
                    imagePromptAddImage(file);
                }
            }
        }
    });
}
imagePromptInputHandler();

function imagePromptImagePaste(e) {
    let items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let item of items) {
        if (item.kind === 'file') {
            let file = item.getAsFile();
            if (file.type.startsWith('image/')) {
                imagePromptAddImage(file);
            }
        }
    }
}

function openEmptyEditor() {
    let canvas = document.createElement('canvas');
    canvas.width = document.getElementById('input_width').value;
    canvas.height = document.getElementById('input_height').value;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let image = new Image();
    image.onload = () => {
        imageEditor.clearVars();
        imageEditor.setBaseImage(image);
        imageEditor.activate();
    };
    image.src = canvas.toDataURL();
}

function debugGenAPIDocs() {
    genericRequest('DebugGenDocs', { }, data => { });
}

let hashSubTabMapping = {
    'utilities_tab': 'utilitiestablist',
    'user_tab': 'usertablist',
    'server_tab': 'servertablist',
};

function clickFirstIn(listId) {
    const list = document.getElementById(listId);
    if (!list) return false;
    const first = list.querySelector('a.nav-link');
    if (first) { first.click(); return true; }
    return false;
}
function clickAnchorIn(listId, hrefId) {
    let list = document.getElementById(listId);
    if (!list) return false;
    let target = list.querySelector(`a[href='#${hrefId}']`);
    if (target) { target.click(); return true; }
    return false;
}

function applyWorkspaceRoute(hash) {
    // Supports routes like #Generate, #Simple, #Utilities, #Settings, #Settings/API-Keys, #Server, #Comfy (if present)
    if (!hash) return false;
    let parts = hash.replace(/^#/, '').split('/');
    let top = parts[0].toLowerCase();
    let sub = parts.length > 1 ? parts.slice(1).join('/') : '';
    function click(id) { let e = document.getElementById(id); if (e) e.click(); }
    switch (top) {
        case 'generate':
        case 'image':
        case 'text2image':
            click('text2imagetabbutton');
            return true;
        case 'simple':
            click('simpletabbutton');
            return true;
        case 'utilities':
            click('utilitiestabbutton');
            // Allow subroutes like #Utilities/CLIP-Tokenization or #Utilities/LoRA-Extractor
            setTimeout(() => {
                let subLower = sub.toLowerCase();
                let matched = false;
                if (subLower.includes('clip')) matched = clickAnchorIn('utilitiestablist', 'Utilities-CLIP-Token-Tab');
                else if (subLower.includes('safetensor') || subLower.includes('pickle')) matched = clickAnchorIn('utilitiestablist', 'Utilities-Pickle2Safetensor-Tab');
                else if (subLower.includes('lora')) matched = clickAnchorIn('utilitiestablist', 'Utilities-LoraExtractor-Tab');
                else if (subLower.includes('model') && subLower.includes('down')) matched = clickAnchorIn('utilitiestablist', 'Utilities-ModelDownloader-Tab');
                if (!matched) clickFirstIn('utilitiestablist');
            }, 1);
            return true;
        case 'settings':
            click('usersettingstabbutton');
            // Subroutes like #Settings/API-Keys, #Settings/User, #Settings/Layout
            setTimeout(() => {
                let subLower = sub.toLowerCase();
                let matched = false;
                if (subLower.includes('api')) matched = clickAnchorIn('usertablist', 'Param-Config-User');
                else if (subLower.includes('layout')) matched = clickAnchorIn('usertablist', 'Layout-Config-User');
                else if (subLower.includes('user')) matched = clickAnchorIn('usertablist', 'Settings-User');
                if (!matched) clickFirstIn('usertablist');
            }, 1);
            return true;
        case 'server':
            click('servertabbutton');
            return true;
        case 'comfy':
            // Try common comfy anchors injected by @WebServer.T2ITabHeader
            let comfy = document.querySelector("a[href*='Comfy']");
            if (comfy) comfy.click();
            else {
                // Fallback: click any anchor containing 'comfy' text
                let anchors = [...document.querySelectorAll('#toptablist a')];
                let found = anchors.find(a => a.textContent.toLowerCase().includes('comfy'));
                if (found) found.click();
            }
            return true;
        default:
            return false;
    }
}

function buildWorkspaceHash() {
    let tabList = getRequiredElementById('toptablist');
    let activeTop = tabList.querySelector('.active');
    let activeTopHref = activeTop ? activeTop.href.split('#')[1] : '';
    // Default to Generate
    let route = '#Generate';
    if (activeTopHref === 'Simple') {
        route = '#Simple';
        // Optional: include selected workflow path later if desired
    }
    else if (activeTopHref === 'utilities_tab') {
        route = '#Utilities';
        let sub = document.querySelector('#utilitiestablist .nav-link.active');
        if (sub) {
            let id = sub.getAttribute('href').substring(1);
            // Map known utilities to human-friendly names
            const map = {
                'Utilities-CLIP-Token-Tab': 'CLIP-Tokenization',
                'Utilities-Pickle2Safetensor-Tab': 'Pickle2Safetensors',
                'Utilities-LoraExtractor-Tab': 'LoRA-Extractor',
                'Utilities-ModelDownloader-Tab': 'Model-Downloader'
            };
            if (map[id]) route += `/${map[id]}`;
        }
    }
    else if (activeTopHref === 'user_tab') {
        route = '#Settings';
        let sub = document.querySelector('#usertablist .nav-link.active');
        if (sub) {
            let id = sub.getAttribute('href').substring(1);
            const map = {
                'Param-Config-User': 'API-Keys',
                'Settings-User': 'User',
                'Layout-Config-User': 'Layout'
            };
            if (map[id]) route += `/${map[id]}`;
        }
    }
    else if (activeTopHref === 'server_tab') {
        route = '#Server';
    }
    else if (activeTopHref === 'Text2Image') {
        route = '#Generate';
    }
    return route;
}

function normalizeLegacyHash() {
    if (!location.hash || !location.hash.includes(',')) return false;
    let split = location.hash.substring(1).split(',');
    // split[1] is the top tab id in legacy format
    let top = split[1] || '';
    let route = '#Generate';
    switch (top) {
        case 'Simple': route = '#Simple'; break;
        case 'utilities_tab': route = '#Utilities'; break;
        case 'user_tab': route = '#Settings'; break;
        case 'server_tab': route = '#Server'; break;
        case 'Text2Image': route = '#Generate'; break;
    }
    // Optionally map third part for sub-tabs if coming from legacy
    if (split.length > 2) {
        const sub = split[2];
        const utilMap = {
            'Utilities-CLIP-Token-Tab': 'CLIP-Tokenization',
            'Utilities-Pickle2Safetensor-Tab': 'Pickle2Safetensors',
            'Utilities-LoraExtractor-Tab': 'LoRA-Extractor',
            'Utilities-ModelDownloader-Tab': 'Model-Downloader'
        };
        const settingsMap = {
            'Param-Config-User': 'API-Keys',
            'Settings-User': 'User',
            'Layout-Config-User': 'Layout'
        };
        if (route === '#Utilities' && utilMap[sub]) route += `/${utilMap[sub]}`;
        if (route === '#Settings' && settingsMap[sub]) route += `/${settingsMap[sub]}`;
    }
    history.replaceState(null, null, route);
    return true;
}

function updateHash() {
    // Always push simplified workspace route
    const route = buildWorkspaceHash();
    history.pushState(null, null, route);
    autoTitle();
}

function loadHashHelper() {
    let tabList = getRequiredElementById('toptablist');
    let bottomTabList = getRequiredElementById('bottombartabcollection');
    let tabs = [... tabList.getElementsByTagName('a')];
    tabs = tabs.concat([... bottomTabList.getElementsByTagName('a')]);
    for (let subMapping of Object.values(hashSubTabMapping)) {
        tabs = tabs.concat([... getRequiredElementById(subMapping).getElementsByTagName('a')]);
    }
    if (location.hash) {
        if (normalizeLegacyHash()) {
            // replaced with workspace route; fall through to apply
        }
        if (applyWorkspaceRoute(location.hash)) {
            // handled as workspace route; also allow legacy triplet after a pipe (#Generate|Image-History,Text2Image,Sub)
            let pipeIdx = location.hash.indexOf('|');
            if (pipeIdx >= 0) {
                let legacy = location.hash.substring(pipeIdx + 1);
                if (legacy.startsWith('#')) legacy = legacy.substring(1);
                let split = legacy.split(',');
                // fall through to legacy handling below using temporary variable
                // emulate original split variable for next block
                var __legacy_split = split;
                split = __legacy_split;
            } else {
                // Workspace-only route: skip legacy parsing
                autoTitle();
                return;
            }
        }
        let split = location.hash.substring(1).split(',');
        let bottomTarget = bottomTabList.querySelector(`a[href='#${split[0]}']`);
        if (bottomTarget && bottomTarget.style.display != 'none') {
            bottomTarget.click();
        }
        let target = tabList.querySelector(`a[href='#${split[1]}']`);
        if (target) {
            target.click();
        }
        let subMapping = hashSubTabMapping[split[1]];
        if (subMapping && split.length > 2) {
            let subTabList = getRequiredElementById(subMapping);
            let subTarget = subTabList.querySelector(`a[href='#${split[2]}']`);
            if (subTarget) {
                subTarget.click();
            }
        }
        else if (split[1] == 'Simple' && split.length > 2) {
            let target = decodeURIComponent(split[2]);
            simpleTab.mustSelectTarget = target;
        }
        autoTitle();
    }
    for (let tab of tabs) {
        tab.addEventListener('click', (e) => {
            updateHash();
            updateWorkspaceButtons();
        });
    }
    window.addEventListener('hashchange', () => {
        // Normalize any legacy hash, apply route, and sync visuals
        if (normalizeLegacyHash()) {
            // normalized; continue with applied route
        }
        applyWorkspaceRoute(location.hash);
        updateWorkspaceButtons();
    });
    updateWorkspaceButtons();
}

function clearParamFilterInput() {
    let filter = getRequiredElementById('main_inputs_filter');
    let filterClearer = getRequiredElementById('clear_input_icon');
    if (filter.value.length > 0) {
        filter.value = '';
        filter.focus();
        hideUnsupportableParams();
    }
    filterClearer.style.display = 'none';
}

function updateWorkspaceButtons() {
    const map = {
        'Text2Image': 'ws_generate',
        'Simple': 'ws_simple',
        'utilities_tab': 'ws_utilities',
        'user_tab': 'ws_settings',
        'server_tab': 'ws_server'
    };
    // Determine active top tab by visible tab-pane with 'show active'
    let activePane = document.querySelector('.tab-content > .tab-pane.show.active');
    let activeId = activePane ? activePane.id : '';
    // Special case: Generate main content lives under Text2Image pane id
    if (activeId === 'Text2Image') activeId = 'Text2Image';
    // Map to workspace button
    let allBtns = ['ws_generate','ws_simple','ws_comfy','ws_utilities','ws_settings','ws_server'];
    allBtns.forEach(id => {
        let b = document.getElementById(id); if (!b) return; b.classList.remove('btn-primary'); b.classList.add('btn-outline-secondary');
    });
    let wsId = map[activeId];
    if (wsId) { let b = document.getElementById(wsId); if (b) { b.classList.add('btn-primary'); b.classList.remove('btn-outline-secondary'); } }

    // Build subnav mirroring current workspace's sub-tabs
    const subnavBar = document.getElementById('workspace_subnav_bar');
    const subnavList = document.getElementById('workspace_subnav_list');
    function copyLinks(fromListId) {
        let src = document.getElementById(fromListId);
        if (!src) { subnavBar.style.display = 'none'; return; }
        let links = [...src.querySelectorAll('.nav-link')];
        if (links.length === 0) { subnavBar.style.display = 'none'; return; }
        subnavList.innerHTML = links.map(a => {
            const href = a.getAttribute('href');
            const active = a.classList.contains('active') ? 'active' : '';
            return `<li class="nav-item" role="presentation"><a class="nav-link ${active}" href="${href}">${a.innerHTML}</a></li>`;
        }).join('');
        // Ensure clicking cloned link triggers original
        [...subnavList.querySelectorAll('a.nav-link')].forEach(clone => {
            clone.addEventListener('click', e => {
                e.preventDefault();
                const orig = document.querySelector(`ul#${fromListId} a.nav-link[href='${clone.getAttribute('href')}']`);
                if (orig) orig.click();
                // sync active state
                updateWorkspaceButtons();
            });
        });
        subnavBar.style.display = '';
    }
    if (activeId === 'Text2Image') {
        // Generate workspace: show center area sub-tabs list
        copyLinks('currentimagecollection');
    }
    else if (activeId === 'utilities_tab') {
        copyLinks('utilitiestablist');
    }
    else if (activeId === 'user_tab') {
        copyLinks('usertablist');
    }
    else if (activeId === 'server_tab') {
        copyLinks('servertablist');
    }
    else if (activeId === 'Simple') {
        // Simple has no sub-tabs; hide bar
        subnavBar.style.display = 'none';
    }
}

function genpageLoad() {
    getRequiredElementById('toptablist').addEventListener('shown.bs.tab', function (e) {
        let versionDisp = getRequiredElementById('version_display');
        if (e.target.id == 'maintab_comfyworkflow') {
            versionDisp.style.display = 'none';
        }
        else {
            versionDisp.style.display = '';
        }
        // When any top tab changes, ensure route reflects the new workspace
        const route = buildWorkspaceHash();
        history.replaceState(null, null, route);
        updateWorkspaceButtons();
    });
    window.imageEditor = new ImageEditor(getRequiredElementById('image_editor_input'), true, true, () => genTabLayout.reapplyPositions(), () => needsNewPreview());
    let editorSizebar = getRequiredElementById('image_editor_sizebar');
    window.imageEditor.onActivate = () => {
        editorSizebar.style.display = '';
    };
    window.imageEditor.onDeactivate = () => {
        editorSizebar.style.display = 'none';
    };
    window.imageEditor.tools['options'].optionButtons = [
        ... window.imageEditor.tools['options'].optionButtons,
        { key: 'Store Current Image To History', action: () => {
            let img = window.imageEditor.getFinalImageData();
            storeImageToHistoryWithCurrentParams(img);
        }},
        { key: 'Store Full Canvas To History', action: () => {
            let img = window.imageEditor.getMaximumImageData();
            storeImageToHistoryWithCurrentParams(img);
        }},
        { key: 'Auto Segment Image (SAM2)', action: () => {
            if (!currentBackendFeatureSet.includes('sam2')) {
let modal = new bootstrap.Modal(getRequiredElementById('sam2_installer'));
                modal.show();
            }
            else {
                let img = window.imageEditor.getFinalImageData();
                let genData = getGenInput();
                genData['controlnetimageinput'] = img;
                genData['controlnetstrength'] = 1;
                genData['controlnetpreprocessor'] = 'Segment Anything 2 Global Autosegment base_plus';
                genData['images'] = 1;
                genData['prompt'] = '';
                delete genData['batchsize'];
                genData['donotsave'] = true;
                genData['controlnetpreviewonly'] = true;
                makeWSRequestT2I('GenerateText2ImageWS', genData, data => {
                    if (!data.image) {
                        return;
                    }
                    let newImg = new Image();
                    newImg.onload = () => {
                        imageEditor.addImageLayer(newImg);
                    };
                    newImg.src = data.image;
                });
            }
        }}
    ];
    genTabLayout.init();
    reviseStatusBar();
    loadHashHelper();
    // Apply current hash on startup to ensure initial content matches route
    if (normalizeLegacyHash()) {}
    applyWorkspaceRoute(location.hash || '#Generate');
    updateWorkspaceButtons();
    getSession(() => {
        imageHistoryBrowser.navigate('');
        initialModelListLoad();
        genericRequest('ListT2IParams', {}, data => {
            updateAllModels(data.models);
            wildcardHelpers.newWildcardList(data.wildcards);
            [rawGenParamTypesFromServer, rawGroupMapFromServer] = buildParameterList(data.list, data.groups);
            gen_param_types = rawGenParamTypesFromServer;
            paramConfig.preInit();
            paramConfig.applyParamEdits(data.param_edits);
            paramConfig.loadUserParamConfigTab();
            autoRepersistParams();
            setInterval(autoRepersistParams, 60 * 60 * 1000); // Re-persist again hourly if UI left over
            genInputs();
            genToolsList();
            reviseStatusBar();
            getRequiredElementById('advanced_options_checkbox').checked = localStorage.getItem('display_advanced') == 'true';
            toggle_advanced();
            setCurrentModel();
            loadUserData(() => {
                if (permissions.hasPermission('view_backends_list')) {
                    loadBackendTypesMenu();
                }
                selectInitialPresetList();
            });
            for (let callback of sessionReadyCallbacks) {
                callback();
            }
            automaticWelcomeMessage();
            autoTitle();
            swarmHasLoaded = true;
        });
        reviseStatusInterval = setInterval(reviseStatusBar, 2000);
        window.resLoopInterval = setInterval(serverResourceLoop, 1000);
    });
}

```

**K:\.ai_local\SwarmUI\src\wwwroot\css\site.css**

```
:root {
    --range-height: 26px;
    --range-value-color: var(--bs-primary);
    --range-track-background: #161616;
    --range-thumb-color-hover: var(--bs-primary-bg-subtle);
    --range-thumb-width: 20px;
    --range-thumb-height: 10px;
    --range-track-height: 4px;
    --range-padding: calc((var(--range-height) - var(var(--range-track-height))) / 2);
    --range-track-color: #1d1d1d;
    --range-thumb-color: #4b4b4b;
    --toggle-thumb-active: var(--bs-primary);
    --toggle-thumb-hover: var(--bs-primary-bg-subtle);
    --toggle-thumb-active-hover: var(--bs-primary-bg-subtle);
    --font-monospace: 'Courier New', Courier, monospace;
    --red: #ff0000;
    --green: #00ff00;
    --yellow: #ffff00;
    --white: #ffffff;
    --black: #000000;
    --star: #ffff00;
    --gray: #808080;
    --darkgray: #505050;
    --transparentdarkred: rgba(100, 0, 0, 0.5);
    --status-bar-text-color: #000000;
    --status-bar-warn-color-start-end: #dddd55;
    --status-bar-warn-color-middle: #888800;
    --status-bar-error-color-start-end: #bb2020;
    --status-bar-error-color-middle: #880000;
    --status-bar-soft-color: #888800;
    --backend-errored: #ff0000;
    --backend-disabled: #ffaa00;
    --backend-running: #00aa33;
    --backend-idle: #688772;
    --backend-loading: #335500;
    --backend-waiting: #335500;
    --notice-pop: #005500;
    --toast-header: #303030;
    --toast-body: #444;
    --toggle-background: #ccc;
    --toggle-thumb-color: #4b4b4b;
    --model-img-border-color-hover: #ffffff;
    --model-block-menu-button-border-color-hover: black;
    --model-block-menu-button-color-hover: white;
}
.modal-content {
    background-color: var(--bs-body-bg) !important;
}
@font-face {
    /* Fallback font to force all OS's to render unicode glyphs properly. */
    font-family: "Unifont";
    src: url("/fonts/unifont-12.0.01.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
}
body {
    background-color: var(--bs-body-bg);
    color: var(--bs-body-color);
    font-size: 14px;
    --bs-font-sans-serif: Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", Unifont;
    --bs-body-font-family: var(--bs-font-sans-serif);
}

/* Consistent select styling (native) */
:root {
  --select-height: 2.25rem;
  --select-radius: 0.375rem;
  --select-border: 1px solid var(--bs-border-color);
  --select-border-focus: 1px solid var(--bs-primary);
  --select-shadow-focus: 0 0 0 0.2rem rgba(13,110,253,0.25);
  --select-padding-x: 0.75rem;
  --select-bg: var(--bs-body-bg);
  --select-color: var(--bs-body-color);
}

select,
.select {
  min-height: var(--select-height);
  border: var(--select-border);
  border-radius: var(--select-radius);
  padding-inline: var(--select-padding-x);
  background: var(--select-bg);
  color: var(--select-color);
}

/* Native select alignment */
select {
  height: var(--select-height);
}

/* Focus states */
select:focus {
  outline: none;
  border: var(--select-border-focus);
  box-shadow: var(--select-shadow-focus);
}

/* Disabled */
select:disabled {
  background: #f3f3f3;
  opacity: 0.75;
}
@keyframes status_glow-warn {
    0% {background-color: var(--status-bar-warn-color-start-end);}
    50% {background-color: var(--status-bar-warn-color-middle);}
    100% {background-color: var(--status-bar-warn-color-start-end);}
}
@keyframes status_glow-error {
    0% {background-color: var(--status-bar-error-color-start-end);}
    50% {background-color: var(--status-bar-error-color-middle);}
    100% {background-color: var(--status-bar-error-color-start-end);}
}
.password {
    -webkit-text-security: disc;
    text-security: disc;
}
.top-status-bar-wrapper {
    position: absolute;
    top: 0px;
    width: 100vw;
    height: 2rem;
    transition: opacity 0.25s;
    z-index: 0;
}
.top-status-bar-wrapper:hover {
    display: none;
    opacity: 0.5;
}
.top-status-bar {
    position: absolute;
    color: var(--status-bar-text-color);
    top: 0px;
    width: 100vw;
    z-index: 100;
    animation-duration: 5s;
    animation-iteration-count: infinite;
    padding-left: 1rem;
    opacity: 0.8;
}
.status-bar-warn {
    animation-name: status_glow-warn;
}
.status-bar-error {
    animation-name: status_glow-error;
}
.status-bar-soft {
    background-color: var(--status-bar-soft-color);
}
.auto-input {
    display: block;
    max-width: 50rem;
    width: 100%;
    overflow: hidden;
    align-items: center;
}
.auto-input-flex {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
}
.auto-input-flex-wide {
    flex-basis: 100% !important;
}
.auto-input-image-preview {
    width: fit-content;
    margin: auto;
}
.auto-input-image-remove-button {
    position: absolute;
    left: 0.5rem;
}
.auto-input-image-preview img {
    max-width: 50rem;
    max-height: 10rem;
    margin: auto;
}
.auto-checkbox {
    margin-left: 0.2rem;
}
.backend_add_button_container {
    margin: 0.5rem;
}
.backends_list {
    margin: 0.5rem;
}
.tab-hundred {
    height: 100%;
}
.tab-pane-vw {
    height: 100%;
    overflow: auto;
}
.backend-wrapper-spot {
    display: inline-block;
}
.backend-card {
    max-width: 55rem;
    border-radius: 0.5rem;
    margin: 0.5rem;
    padding: 1.5px;
}
.backend-errored {
    border: 1px solid var(--backend-errored);
}
.backend-disabled {
    border: 1px solid var(--backend-disabled);
}
.backend-running {
    border: 1px solid var(--backend-running);
}
.backend-idle {
    border: 1px solid var(--backend-idle);
}
.backend-loading {
    border: 1px solid var(--backend-loading);
}
.backend-waiting {
    border: 1px solid var(--backend-waiting);
}
.card {
    color: var(--bs-body-color);
}
.card-header {
    background-color: var(--bs-tertiary-bg);
}
.card-body {
    background-color: var(--bs-body-bg);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
.backend-errored .card-header {
    background-color: var(--bs-danger-bg-subtle);
}
.backend-errored .card-body {
    background-color: var(--bs-danger-bg-subtle);
}
.backend-card .card-header button {
    height: 1.8rem;
    width: 1.8rem;
    text-align: center;
    background-color: transparent;
    border-radius: 0.2rem;
    margin-left: 0.5rem;
    padding: 0.1rem;
    padding-top: -0.5rem;
    float: right;
}
.backend-edit-button {
    color: var(--green);
    border: 1px solid var(--green);
}
.backend-edit-button:hover {
    color: var(--black) !important;
    border: 1px solid var(--black) !important;
    background-color: var(--green) !important;
}
.backend-edit-button:disabled {
    color: var(--darkgray) !important;
    border: 1px solid var(--darkgray) !important;
    background-color: transparent !important;
}
.backend-delete-button {
    color: var(--red);
    border: 1px solid var(--red);
}
.backend-delete-button:hover {
    color: var(--black) !important;
    border: 1px solid var(--black) !important;
    background-color: var(--red) !important;
}
.backend-save-button {
    width: 3rem !important;
    color: var(--green);
    border: 1px solid var(--green);
}
.backend-save-button:hover {
    color: var(--black) !important;
    border: 1px solid var(--black) !important;
    background-color: var(--green) !important;
}
.backend-toggle-switch {
    float: none !important;
    vertical-align: middle !important;
}
.backend-title-editable {
    border: 1px solid var(--bs-border-color);
    border-radius: 0.5rem;
    background-color: var(--bs-body-bg);
    padding: 0.3rem;
    padding-bottom: 0.4rem;
}
.auto-slider-fade-contain {
    display: inline-block;
    width: calc(min(100%, 50rem) - 5rem - 2px);
}
.auto-fade-max-contain {
    width: calc(100% - 2px);
}
.auto-input-name {
    display: inline-block;
    text-align: center;
    font-weight: bold;
    margin-bottom: 1px;
    white-space: nowrap;
}
.auto-input-description {
    display: inline-block;
    font-size: 80%;
    color: var(--bs-secondary-color);
    margin-bottom: 0px;
    margin-left: 0.5rem;
    line-height: 0.7rem;
    height: 1rem;
    white-space: nowrap;
}
.auto-input-fade-lock {
    -webkit-mask-image: linear-gradient(to right, black 70%, transparent 100%);
    mask-image: linear-gradient(to right, black 70%, transparent 100%);
}
.auto-text {
    flex-grow: 10;
    vertical-align: middle;
    border-radius: 0.3rem;
    background-color: transparent;
}
.auto-input-prompt-tokencount {
    float: right;
    color: var(--bs-secondary-color);
}
.auto-text-block {
    width: 100%;
}
.auto-text-wide {
    width: 80%;
}
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
}
input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
}
input[type="range"] {
    /*
    -webkit-appearance: none;
    appearance: none;
    */
    cursor: pointer;
    outline: none;
    overflow: hidden;
    border-radius: 2px;
    background-color: transparent;
    height: 6px;
    width: 100%;
}
input[type="range"]::-webkit-slider-runnable-track, input[type="range"]::-moz-range-track {
    -webkit-appearance: none;
    appearance: none;
    height: 2px;
    border-radius: 2px;
    background: var(--bs-border-color);
}
input[type="range"]::-webkit-slider-thumb, input[type="range"]::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    width: 15px;
    background-color: var(--bs-body-color);
    border-radius: 2px;
    border: 1px solid var(--bs-primary);
    box-shadow: -407px 0 0 400px var(--bs-primary);
    margin-top: -4px;
}
input[type="checkbox"] {
    accent-color: var(--bs-primary);
}
input[type="text"]:focus, textarea:focus {
    outline: solid 1px var(--bs-primary);
    border-color: var(--bs-primary);
}
input[type="file"] {
    cursor: pointer;
}
.auto-slider-range-wrapper {
    display: contents;
}
.auto-slider-range {
    cursor: pointer;
    width: 90%;
    display: block;
    margin: auto;
    margin-bottom: 0.5rem;
}
.auto-slider-number {
    float: right;
    width: 4rem;
    border-radius: 0.5rem;
    margin-bottom: 0px;
    background-color: transparent;
    border-color: transparent;
    text-align: right;
}
.auto-number {
    border-radius: 0.5rem;
    margin-bottom: 0px;
    background-color: transparent;
    border-color: transparent;
    flex-grow: 10;
    width: 1rem;
}
.auto-number-seedbox {
    flex-grow: 10;
    width: 1rem;
}
.auto-number-small {
    border-radius: 0.5rem;
    margin-bottom: 0px;
    background-color: transparent;
    border-color: transparent;
    width: calc(max(5rem, 100% - 12rem));
}
.auto-dropdown {
    width: fit-content;
    border-radius: 0.5rem;
    margin-bottom: 0px;
    background-color: var(--bs-body-bg);
    border-color: transparent;
}
textarea, input, select {
    border-color: var(--bs-border-color);
    background-color: var(--bs-tertiary-bg);
}
@keyframes toast-flash {
    0% {background-color: transparent;}
    50% {background-color: var(--red);}
    100% {background-color: transparent;}
}
.center-toast {
    position: fixed;
    z-index: 1000;
    margin: auto;
    top: 3rem;
    left: 50%;
    transform: translate(-50%, 0);
    animation-name: toast-flash;
    animation-duration: 2s;
    border-radius: 6px;
}
.toast {
    background-color: var(--toast-body);
    color: var(--bs-body-color);
}
.toast-header {
    background-color: var(--toast-header);
    color: var(--bs-body-color);
}
.auto-input-qbutton {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(var(--bs-primary-rgb), 0.6);
    color: rgba(var(--bs-primary-rgb), 0.6);
}
.auto-input-qbutton:hover {
    background-color: var(--bs-primary);
    color: var(--bs-light) !important;
}
.sui-popover {
    background-color: var(--bs-tertiary-bg);
    color: var(--bs-body-color);
    border: 1px solid gray;
    border-radius: 0.5rem;
    padding: 0.5rem;
    visibility: hidden;
    opacity: 0;
    position: fixed;
    left: 0;
    top: 0;
    width: fit-content;
    z-index: 10000;
    transition: visibility 0s, opacity 0.3s linear;
    min-width: 10rem;
}
.sui-info-popover {
    max-width: 40rem;
}
.sui-popover-visible {
    visibility: visible;
    opacity: 1;
    transition: visibility 0s, opacity 0.3s linear;
}
.sui-popover-notransition {
    transition: none;
}
.slight-left-margin-block {
    display: block;
    margin-left: 0.5rem;
}
.auto-slider-toggle {
    position: relative;
}
.display-inline-block {
    display: inline-block !important;
    vertical-align: middle;
}
.auto-file {
    width: 100%;
}
.auto-file-label {
    position: relative;
    display: block;
}
.auto-file-input {
    display: none;
}
.input-group {
    width: 100%;
    border: 1px solid var(--bs-border-color);
    border-radius: 9px;
    margin-bottom: 0rem;
    margin-top: 1.2rem;
    max-width: 51rem;
    background-color: var(--bs-tertiary-bg);
}
.input-group-closed {
    border: none;
    background-color: transparent;
}
.input-group-open {
    margin-bottom: 2rem;
}
.input-group-content {
    display: flex;
    max-width: calc(100% - 6px);
    padding-left: 0.5rem;
    width: 100%;
    flex-wrap: wrap;
}
.input-group-content > div {
    padding: 5px;
    flex: 1 0 0;
    min-width: 17rem;
 }
.input-group-header {
    position: relative;
    display: block;
    width: 100%;
    left: 0.5rem;
    top: -0.7rem;
    height: 0.5rem;
}
.input-group-shrinkable {
    cursor: pointer;
}
.header-label-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    top: -1.2em;
    left: -1em;
    margin: 4px;
}
.header-label-spacer {
    flex-grow: 10;
}
.header-label-counter {
    font-size: 90%;
    color: var(--bs-secondary-color);
    font-family: var(--font-monospace);
}
.header-label-counter-advancedshine {
    color: var(--bs-body-color);
    box-shadow: 0 0 4px 1px var(--bs-primary);
    background-color: rgba(var(--bs-primary-rgb), 0.5);
}
.header-label-notoggle {
    width: 35px;
    margin-left: 1rem;
}
.form-check-input:checked {
    background-color: var(--bs-primary);
    border-color: none;
}
.basic-button {
    display: inline-block;
    background-color: var(--bs-secondary-bg);
    color: var(--bs-body-color);
    border: 1px solid var(--bs-border-color);
    font-weight: bold;
    border-radius: 0.5rem;
    margin-left: 0.1rem;
    margin-right: 0.1rem;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    cursor: pointer;
    text-decoration: none;
}
.small-button {
    font-size: 90%;
    padding-top: 0px;
    padding-bottom: 0px;
    padding-left: 4px;
    padding-right: 4px;
}
.basic-button.btn-primary {
    background-color: var(--bs-primary);
}
.basic-button:hover {
    background-color: var(--bs-primary-bg-subtle);
    color: var(--bs-emphasis-color);
}
.basic-button.btn-primary:hover {
    background-color: #0a58ca;
}
.basic-button:disabled {
    background-color: rgba(var(--bs-secondary-rgb), 0.4);
    color: rgba(var(--bs-body-color-rgb), 0.6);
}
.simpler-button-disable:disabled {
    background-color: rgba(var(--bs-secondary-rgb), 0.4);
}
.text_button {
    background-color: rgba(var(--bs-secondary-rgb), 0.5);
    color: var(--bs-body-color);
    text-decoration: underline;
    cursor: pointer;
    transition: all 0.5s;
}
.text_button:hover {
    color: var(--bs-emphasis-color);
    text-decoration: none;
    transition: all 0.5s;
}
.modal_text_extra {
    width: 100%;
    margin-bottom: 0.1rem;
    border-radius: 0.5rem;
    background-color: transparent;
}
.dropdown-menu {
    background-color: var(--bs-tertiary-bg);
    border-color: var(--bs-border-color);
    color: var(--bs-body-color);
}
.dropdown-divider {
    border-color: var(--bs-border-color);
}
.info-popover-button {
    cursor: pointer;
}
.toggler-overlay {
    position: relative;
    display: inline;
    width: 0;
    height: 0;
    vertical-align: top;
}
.toggler-overlay-part {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    z-index: 20;
}
.select2-container--bootstrap-5 .select2-selection {
    background-color: var(--bs-tertiary-bg);
    border-color: var(--bs-border-color);
    color: var(--bs-body-color);
}
.select2-container--bootstrap-5 .select2-selection--multiple .select2-selection__rendered .select2-selection__choice {
    color: var(--bs-body-color);
}
.select2-container--bootstrap-5 .select2-dropdown {
    background-color: var(--bs-tertiary-bg);
    border-color: var(--bs-border-color);
    color: var(--bs-body-color);
}
.select2-container--bootstrap-5 .select2-dropdown .select2-results__options .select2-results__option.select2-results__option--selected, .select2-container--bootstrap-5 .select2-dropdown .select2-results__options .select2-results__option[aria-selected="true"]:not(.select2-results__option--highlighted) {
    background-color: var(--bs-primary);
}
.select2-container--bootstrap-5 .select2-dropdown .select2-results__options .select2-results__option.select2-results__option--highlighted {
    background-color: var(--bs-primary-bg-subtle);
    color: var(--bs-emphasis-color);
}
.settings_submit_confirmer {
    display: none;
    position: fixed;
    z-index: 1000;
    width: 100vw;
    height: 6rem;
    background-color: var(--bs-tertiary-bg);
    text-align: right;
    left: 0;
    top: calc(100vh - 6rem);
    font-size: 200%;
    padding-top: 0.5rem;
    padding-right: 1rem;
}
.settings_submit_confirmer button {
    font-size: 120%;
    padding-left: 1rem;
    padding-right: 1rem;
}
.depth-number-input {
    width: 3rem;
}
.version-display {
    position: fixed;
    z-index: 1000;
    bottom: 0;
    right: 0;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    color: var(--bs-tertiary-color);
    background-color: var(--bs-tertiary-bg);
    border-top-left-radius: 0.25rem;
}
.small-window .version-display {
    display: none;
}
.toast-error-box .toast-body {
    white-space: pre-wrap;
}
.added-image-area {
    white-space: break-spaces;
    margin-bottom: 0.5rem;
    display: inline-block;
}
.disabled-input {
    opacity: 0.5;
}
.card-center-container {
    width: fit-content;
    margin: auto;
    margin-top: 1rem;
}
.spaced_util_table tr td, .spaced_util_table tr th {
    padding: 0.5rem;
    border: 1px solid var(--bs-border-color);
}
.hoverable-minor-hint-text {
    color: var(--bs-secondary-color);
    opacity: 0.5;
    font-size: 90%;
    transition: all 0.5s;
}
.hoverable-minor-hint-text:hover {
    color: var(--bs-body-color);
    opacity: 1;
}
.form-check-input {
    cursor: pointer;
}
.simple-table tr td, .simple-table tr th {
    padding: 0.4rem;
    border: 1px solid var(--bs-border-color);
    min-width: 85px;
}
.translate-block-sm {
    display: inline-block;
    width: 2.3rem;
    text-align: center;
}
.translate-block-sm2 {
    display: inline-block;
    width: 1.5rem;
    text-align: center;
}
.translate-img {
    height: 1rem;
    object-fit: contain;
    object-position: center;
    margin: auto;
    vertical-align: text-top;
}
.secretexperimental {
    display: none;
}
.loading-spinner {
    display: block;
    position: relative;
    width: 360px;
    height: 360px;
    margin: auto;
}
.loading-spinner div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 32px);
    height: calc(100% - 32px);
    margin: 16px;
    border: 16px solid var(--bs-primary);
    border-radius: 50%;
    /* animation: loading-spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite; */
    border-color: var(--bs-primary) transparent transparent transparent;
}
.loading-spinner .loadspin1 {
    animation-delay: -0.45s;
}
.loading-spinner .loadspin2 {
    animation-delay: -0.3s;
}
.loading-spinner .loadspin3 {
    animation-delay: -0.15s;
}
@keyframes loading-spinner {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.tag-text {
    --tag-color-percent: 80%;
    color: rgba(var(--bs-body-color-rgb), var(--tag-color-percent)) !important;
}
.tag-text-soft {
    --tag-color-percent: 90%;
    color: rgba(var(--bs-body-color-rgb), var(--tag-color-percent)) !important;
}
.tag-type-0 { --tag-color: #009be6; }
.tag-type-1 { --tag-color: #ff8a8b; }
.tag-type-2 { --tag-color: #009b9b; }
.tag-type-3 { --tag-color: #c797ff; }
.tag-type-4 { --tag-color: #35c64a; }
.tag-type-5 { --tag-color: #ead084; }
.tag-type-6 { --tag-color: #7c4444; }
.tag-type-7 { --tag-color: #3a753a; }
.tag-type-8 { --tag-color: #41419b; }
.tag-type-9 { --tag-color: #a03fa0; }
.parens {
    color: var(--bs-secondary-color);
}
.sui-popover-notice {
    visibility: visible;
    opacity: 1;
    font-size: 80%;
    min-width: 0;
    border-radius: 1rem;
    padding: 0.3rem;
    border: none;
}
.sui-popover-notice-fade-1s {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 1s, opacity 1s linear;
    width: fit-content;
}
.notice-pop-green {
    background-color: var(--notice-pop);
    color: var(--bs-body-color);
}
.drag_image_target_highlight {
    box-shadow: inset 0 0 8px 2px var(--bs-primary);
}
.modal-dialog {
    max-width: calc(max(500px, 50vw));
    width: fit-content;
}
.safe-html-only {
    display: inline;
}
.tab-no-scroll {
    overflow-x: hidden;
    overflow-y: auto;
}
.scroll-within-tab {
    overflow-x: auto;
    overflow-y: auto;
    max-width: 100vw;
    padding-bottom: 10rem;
}
.inline-block {
    display: inline-block;
}






/* All below: imported from modern.css, needs to be split into appropriate locations */




::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-track {
    background: transparent;
    transition: all 0.5s;
}
::-webkit-scrollbar-thumb {
    background: rgba(100, 100, 100, 0.5);
    border-radius: 20px;
    border: transparent;
    transition: all 0.5s;
}
::-webkit-scrollbar-track:hover {
    background: rgba(255, 255, 255, 0.05);
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 100, 100, 0.7);
}
textarea,
input,
select {
    color: var(--bs-body-color);
}
.input-group input[type="number"].auto-slider-number {
    padding: 0 4px;
}
.input-group input[type="number"],
.input-group .auto-text {
    padding: 0 10px;
    transition: background-color 0.2s;
    color: var(--bs-body-color);
}
.input-group input[type="number"]:hover,
.input-group input[type="number"]:focus {
    background: rgba(255, 255, 255, 0.05);
}
.input-group input[type="number"]:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.15);
}
.input-group .auto-dropdown {
    padding: 3px 8px;
    box-sizing: content-box;
    width: auto !important;
    max-width: calc(100% - 16px);
}
.auto-slider-box {
    display: flex;
    flex-wrap: wrap;
}
.auto-slider-box .auto-slider-number {
    margin-left: auto;
}
.auto-slider-range-wrapper {
    width: 100%;
}
.input-group .auto-slider-range-wrapper {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
input[type="range"]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    appearance: none;
}
input[type="range"]::-moz-range-track {
    -moz-appearance: none;
    appearance: none;
}
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
}
input[type="range"]::-moz-range-thumb {
    -moz-appearance: none;
    appearance: none;
}

```

**K:\.ai_local\SwarmUI\src\wwwroot\css\genpage.css**

```
/*
This file is part of SwarmUI, a WebUI for Stable Diffusion.

Copyright 2022-2024 Stability AI and the SwarmUI project authors.
All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
you may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/* Global structural refinements for consistent, modular UI */
:root {
    --sui-subnav-height: 38px;
}

body {
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    position: fixed;
    overflow: hidden;
}
.modal-body {
    white-space: normal;
}
.prompt-box {
    width: 100%;
    border-radius: 0.5rem;
}
.interrupt-button-none {
    background-color: rgba(var(--bs-danger-rgb), 0.2);
    opacity: 0.4;
}
.tab-content {
    white-space: normal;
}
/* Hide duplicated in-content subnav strips (they are mirrored into header subnav) */
.swarm-gen-tab-subnav {
    display: none !important;
}
.advanced_input_checkbox {
    cursor: pointer;
    width: calc(100% - 2rem);
    margin-left: 1rem;
    margin-right: 1rem;
    text-align: center;
    background-color: var(--background-soft);
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    position: relative;
    bottom: 2.25rem;
}
.advanced_input_checkbox_presets {
    bottom: 0rem;
}
.main_inputs_area_hidden {
    display: none;
    visibility: hidden;
}
.current_image {
    border: 1px solid var(--bs-border-color);
    width: 100%;
    height: 100%;
    overflow: auto;
    object-fit: contain;
}
.current-image-data {
    white-space: normal;
    font-size: 80%;
}
.current-image-img {
    max-width: 100%;
    max-height: calc(max(15rem, 100% - 5rem));
    object-fit: contain;
    object-position: top left;
}
.current_image_batch_core {
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
    white-space: normal;
}
.current-image-extras-wrapper {
    min-width: 20rem;
    vertical-align: top;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    max-height: 10rem;
}
.extras-wrapper-sideblock .current-image-data {
    text-align: left;
}
.extras-wrapper-sideblock .param_view_block {
    width: calc(100% - 10px);
}
.batch-gear-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 10;
}
.image-block {
    display: inline-block;
    cursor: pointer;
}
.image-block img, .img-block video {
    display: block;
    margin: auto;
}
.image-block-placeholder img {
    filter: blur(5px);
}
.current_image_placeholder img {
    filter: blur(10px);
}
.image-block-batch {
    width: calc(10rem + 2px);
    padding: 1px;
    display: inline-block;
    overflow: hidden;
}
.image-block-batch img, .image-block-batch video {
    max-height: 100%;
    width: 100%;
}
.image-block:hover {
    background-color: var(--bs-secondary-bg);
}
.image-block-starred {
    box-shadow: 0 0 1px 1px var(--star);
}
.image-block .loading-spinner-parent {
    width: 0;
    height: 0;
    top: -10rem;
    left: calc(50% - 5rem);
    position: relative;
}
.image-block .loading-spinner {
    position: absolute;
    width: 10rem;
    height: 10rem;
}
.image-block-failed {
    height: 0;
    width: 0;
    top: -5rem;
    left: calc(50% - 5rem);
    position: relative;
}
.image-block-failed::before, .image-block-failed::after {
    position: absolute;
    content: '';
    width: 10rem;
    height: 1rem;
    background-color: var(--bs-secondary-bg);
}
.image-block-failed::before {
    transform: rotate(45deg);
}
.image-block-failed::after {
    transform: rotate(-45deg);
}
.image-batch-0 {
    background-color: var(--batch-0);
}
.image-batch-1 {
    background-color: var(--batch-1);
}
.image-batch-folder {
    width: 6rem;
    height: 6rem;
}
.image-batch-folder img {
    height: 3.5rem;
}
.image-preview-text-small {
    font-size: 70%;
}
.image-preview-text-medium {
    font-size: 80%;
}
.image-preview-text-large {
    font-size: 90%;
}
.image-preview-text {
    font-family: var(--bs-font-monospace);
    min-width: 100%;
    max-width: 0;
}
.current_model_view {
    display: inline-block;
}
.model-block {
    height: 10rem;
    width: 30rem;
    margin: 0.2rem;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    vertical-align: top;
    position: relative;
    border: 1px solid var(--bs-border-color);
}
.model-block img {
    max-height: 9rem;
    width: 9rem;
    height: 9rem;
    display: inline-block;
    margin: 0.5rem;
    margin-bottom: 0px;
    vertical-align: top;
    cursor: pointer;
    object-fit: contain;
    background-color: var(--bs-tertiary-bg);
}
.model-descblock {
    width: 19.5rem;
    height: 10rem;
    overflow: hidden;
    display: inline-block;
    white-space: normal;
    word-break: normal;
    overflow-wrap: break-word;
    font-size: 80%;
}
.model-descblock:focus {
    overflow: auto;
}
.model-block img:hover {
    border: 2px solid var(--bs-primary);
}
.model-block-small {
    height: 8rem;
    width: 22rem;
    margin: 0.1rem;
}
.model-block-big {
    height: 15rem;
    width: 40rem;
}
.model-block-small .model-descblock {
    width: 14rem;
    height: 8rem;
}
.model-block-big .model-descblock {
    width: 25rem;
    height: 15rem;
    word-break: normal;
}
.model-block-small img {
    max-height: 7rem;
    width: 7rem;
    height: 7rem;
}
.model-block-big img {
    max-height: 14rem;
    width: 14rem;
    height: 14rem;
}
.model-block-menu-button {
    display: block;
    position: absolute;
    top: 0.1rem;
    right: 0.4rem;
    font-size: 120%;
    border: 1px solid transparent;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    border-radius: 0.2rem;
    opacity: 0.7;
    background-color: rgba(var(--bs-body-bg-rgb), 0.2);
    transition: background-color 0.2s ease-out;
}
.image-block:hover .model-block-menu-button {
    opacity: 1.0;
    background-color: rgba(var(--bs-body-bg-rgb), 0.5);
}
.model-block-menu-button:hover {
    opacity: 1.0;
    background-color: var(--bs-primary) !important;
    cursor: pointer;
    border: 1px solid var(--bs-border-color);
    color: var(--bs-emphasis-color);
}
.model-selected {
    border: 1px solid var(--bs-primary);
    background-color: var(--bs-secondary-bg);
}
.model-loaded {
    border: 1px solid rgba(var(--bs-primary-rgb), 0.5);
    background-color: rgba(var(--bs-secondary-bg-rgb), 0.5);
}
.model-unavailable {
    opacity: 0.3;
}
.model-remote {
    background-color: var(--bs-tertiary-bg);
}
.model-starred img {
    box-shadow: 0 0 3px 1px rgba(var(--star-rgb), 0.5);
}
.sui_popover_model {
    white-space: normal;
}
.sui_popover_model_button {
    display: block;
    width: 100%;
    cursor: pointer;
    padding-left: 3px;
    padding-right: 3px;
    color: var(--bs-body-color);
    text-decoration: none;
    min-height: 1.3rem;
    line-height: 1.3rem;
    margin-top: 0;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
}
.sui_popover_text_input {
    display: block;
    width: 100%;
    padding-left: 3px;
    padding-right: 3px;
    color: var(--bs-body-color);
    text-decoration: none;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    border-bottom: 1px solid var(--bs-border-color);
    height: 1.3rem;
}
.sui_popover_model_button_selected {
    background-color: rgba(var(--bs-primary-rgb), 0.5);
}
.sui_popover_model_button_add_all {
    padding-bottom: 0.1rem;
    border-bottom: 1px solid var(--bs-border-color);
    margin-bottom: 0.1rem;
}
.sui_popover_model_button:hover {
    background-color: var(--bs-primary);
}
.sui-popover-inline-block {
    white-space: nowrap;
    max-width: 100%;
    display: flex;
    align-items: baseline;
}
.sui-popover-inline-block input {
    flex-shrink: 1;
    flex-grow: 1;
}
.sui_popover_scrollable {
    max-height: 15rem;
    overflow-y: auto;
}
.sui_popover_scrollable_tall {
    max-height: calc(max(15rem, 45vh));
    overflow-y: auto;
}
.sui_popover_reverse {
    display: flex;
    flex-direction: column-reverse;
}
.model_filename {
    font-size: 80%;
    color: var(--bs-secondary-color);
}
.refresh-button {
    margin: 0.5rem;
    background-color: var(--button-background);
    color: var(--button-text);
    border-radius: 0.5rem;
    border: 1px solid var(--button-border);
    min-width: 2rem;
}
.refresh-button:hover {
    background-color: var(--button-background-hover);
    color: var(--button-foreground-hover);
}
.refresh-button:disabled {
    background-color: var(--button-background-disabled);
    color: var(--button-foreground-disabled);
}
.tool-container .tool {
    display: none;
}
.tool-container .tool-open {
    display: block !important;
}
.tool-container {
    border-radius: 1rem;
    margin-top: 0.5rem;
    width: 95%;
    margin-left: 2.5%;
    padding: 0.5rem;
    border: 1px solid var(--bs-border-color);
}
.tool-selector {
    margin-top: 0.5rem;
    width: 90%;
    margin-left: 5%;
}
.modal_error_bottom {
    color: var(--bs-danger);
}
.modal_success_bottom {
    color: var(--bs-success);
}
#add_preset_modal {
    max-height: calc(95vh - var(--bs-modal-margin));
    margin-top: var(--bs-modal-margin);
}
#add_preset_modal .modal-dialog {
    margin-top: 0;
    margin-bottom: 0;
    height: 100%;
}
#add_preset_modal .modal-content {
    height: 100%;
}
#add_preset_modal .modal-body {
    overflow-y: auto;
}
/* Workspace subnav (second header) */
#workspace_subnav_bar {
    position: sticky;
    top: 0;
    z-index: 1030; /* above content */
}
#workspace_subnav_list {
    display: block;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
}
#workspace_subnav_list .nav-link {
    padding: 0.25rem 0.5rem;
}
/* Ensure popovers layer above content */
.sui-popover, .sui-popover-notice {
    z-index: 1055;
}
.preset-block-selected {
    border: 1px solid var(--bs-primary);
    background-color: var(--bs-secondary-bg);
}
.preset-descblock {
    width: 20rem;
    word-wrap: normal;
    white-space: normal;
    word-break: normal;
}
.preset-in-list {
    display: inline-block;
    border: 1px solid var(--bs-border-color);
    padding-left: 0.5rem;
    border-radius: 1rem;
    border-right: none;
}
.lora-weight-input {
    width: 3rem;
}
.preset-remove-button {
    display: inline-block;
    color: var(--bs-body-color);
    font-weight: bold;
    border: 1px solid var(--bs-danger);
    border-radius: 0.5rem;
    margin-left: 0.2rem;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    cursor: pointer;
}
.preset-remove-button:hover {
    background-color: rgba(var(--bs-danger-rgb), 0.7);
}
.new_preset_image {
    align-items: center;
    text-align: center;
}
.new_preset_image img {
    max-width: 100%;
    max-height: 20rem;
}
.interrupt_line {
    display: block;
    width: 100%;
    white-space: normal;
}
.interrupt-line-part {
    display: inline-block;
}
.param_view_block {
    border-radius: 0.3rem;
    border: 1px solid var(--bs-border-color);
    display: inline-block;
    color: var(--bs-secondary-color);
    overflow: clip;
    text-overflow: ellipsis;
}
.param_view_block_model {
    background-color: rgba(var(--tag-color-rgb), 0.01);
}
.param_view {
    border-radius: 0.3rem;
    color: var(--bs-body-color);
}
.bottom-info-bar-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    border-bottom: 1px solid var(--light-border);
}
.bottom-info-bar-component {
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    border-left: 1px solid var(--light-border);
}
.num_jobs_span {
    vertical-align: middle;
}
.path-list-part {
    border-bottom: 1px dotted var(--bs-body-color);
    cursor: pointer;
    margin-left: 0.2rem;
    margin-right: 0.2rem;
}
.group-toggler-switch {
    margin-left: 1rem;
    display: inline-block;
    margin-bottom: 0;
}
.settings-container {
    padding-left: 1rem;
    padding-top: 1rem;
}
.settings-group {
    margin-top: 2rem;
    padding-bottom: 0.2rem;
    padding-left: 2rem;
}
.setting-looks-wrong {
    border: 1px  solid var(--bs-danger) !important;
    box-shadow: 0px 0px 1px 1px var(--bs-danger) !important;
}
.group-label {
    position: relative;
    left: -1rem;
    margin-bottom: 0.7rem;
}
.input-group-closed .input-group-header-activated {
    background-color: rgba(var(--bs-primary-rgb), 0.1);
    border-radius: 0.5rem;
}
.input-group-open .input-group-header-activated {
    background-image: linear-gradient(rgba(var(--bs-primary-rgb), 0.1), transparent);
    border-radius: 0.5rem;
}
.imageview_popup_modal_background {
    font-family: var(--bs-font-monospace);
    background-color: rgba(50, 50, 50, 0.7);
}
.imageview_modal_imagewrap {
    height: calc(min(100vw, 100vh - 7rem));
    max-width: 95vw;
    overflow: hidden;
}
.imageview_popup_modal_img {
    height: 100%;
    position: relative;
    margin: auto;
}
.imageview_popup_modal_undertext {
    background-color: var(--bs-body-bg);
    overflow-wrap: break-word;
    height: 7rem;
    overflow-y: auto;
    text-align: center;
}
.imageview_modal_inner_div {
    max-width: 95vw;
    overflow: hidden;
    margin: auto;
}
.browser-folder-tree-container {
    width: 15rem;
    display: inline-block;
    height: calc(max(10rem, 100%));
    overflow: auto;
    vertical-align: top;
}
.browser-folder-tree-splitter {
    width: 7px;
    height: calc(max(10rem, 100%));
    cursor: col-resize;
}
.browser-header-bar {
    width: calc(100% - 1rem);
    height: 2.5rem;
    display: block;
    overflow-x: auto;
    overflow-y: hidden;
    margin-left: 0.5rem;
}
.browser-header-count {
    color: var(--bs-secondary-color);
    font-size: 80%;
    margin-left: 0.5rem;
    opacity: 0.8;
}
.browser-fullcontent-container {
    margin-left: 0.2rem;
    display: inline-block;
    width: calc(100vw - 15rem - 2rem);
    height: calc(max(10rem, 100%));
    vertical-align: top;
    overflow: hidden;
    white-space: nowrap;
}
.browser-content-container {
    display: inline-block;
    width: 100%;
    height: calc(100% - 2rem);
    overflow: auto;
    vertical-align: top;
    padding-bottom: 3rem;
    white-space: normal;
}
.browser_container {
    display: block;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    background-color: var(--bs-tertiary-bg);
}
.browser-folder-tree-part {
    display: block;
    position: relative;
    width: fit-content;
    cursor: pointer;
}
.browser-folder-tree-part:hover {
    color: var(--bs-primary);
    text-decoration: underline;
}
.browser-folder-tree-part-selected {
    color: rgba(var(--bs-primary-rgb), 0.7);
}
.browser-folder-tree-part-symbol {
    position: relative;
    width: 0;
}
.browser-folder-tree-part-open .browser-folder-tree-part-symbol::before {
    content: "\02B9F";
    position: absolute;
    left: -16px;
    width: 0;
}
.browser-folder-tree-part-closed .browser-folder-tree-part-symbol::before {
    content: "\02B9E";
    position: absolute;
    left: -16px;
    width: 0;
}
.browser-details-list-entry {
    display: block;
    width: 98%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: auto;
    position: relative;
    cursor: pointer;
}
.browser-details-list-entry:hover {
    color: var(--bs-primary);
    text-decoration: underline;
}
.browser-details-list-entry-text {
    display: inline-block;
    width: 48%;
    height: 1.3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    vertical-align: top;
}
.browser-details-list-entry img {
    max-height: 1.25rem;
    max-width: 1.25rem;
    display: inline-block;
    vertical-align: top;
    margin-right: 0.2rem;
}
.browser-list-entry {
    display: inline-block;
    max-width: 20rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0.3rem;
    position: relative;
    cursor: pointer;
}
.browser-list-entry-text {
    display: inline-block;
    max-width: 17rem;
    padding-right: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    vertical-align: top;
}
.browser-list-entry-text:hover {
    color: var(--bs-primary);
    text-decoration: underline;
}
.browser-list-entry img {
    max-height: 1.25rem;
    max-width: 1.25rem;
    display: inline-block;
    vertical-align: top;
    margin-right: 0.2rem;
}
.browser-format-selector {
    margin-right: 0.5rem;
    border-radius: 0.2rem;
}
.alt_prompt_main_line {
    display: flex;
}
.alt_prompt_textbox {
    border-radius: 0.2rem;
    width: 100%;
    resize: none;
}
#alt_negativeprompt_textbox {
    margin-top: 6px;
}
.alt-negativeprompt-textbox-invalid {
    background-color: var(--bs-body-bg);
    border-color: var(--bs-body-bg);
}
.alt-negativeprompt-textbox-invalid::placeholder {
    color: rgba(var(--bs-body-color-rgb), 0.5);
}
.alt_prompt_textboxes {
    margin-left: 1rem;
    display: inline-block;
    flex-grow: 10;
}
.alt-text-tokencount-wrapper {
    position: relative;
    width: 0;
    height: 0;
    left: calc(100% - 7.2rem);
}
.alt-text-tokencount {
    position: relative;
    top: -1.5rem;
    left: 0;
}
.alt-text-add-button-wrapper {
    position: relative;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
}
.alt-text-add-button {
    position: relative;
    top: 0;
    left: -8px;
    padding: 0px 4px !important;
    border-radius: 1rem !important;
}
.small-window .alt-text-add-button {
    top: -45px;
    font-size: 1.5rem;
    height: 2.5rem;
}
.alt-prompt-buttons {
    vertical-align: top;
    padding-top: 0.1rem;
    padding-bottom: 0.2rem;
    height: 4rem;
    text-align: center;
    border-radius: 0.7rem;
    margin: 0;
}
.alt-prompt-buttons-wrapper {
    display: flex;
}
.small-window .alt-prompt-buttons-wrapper {
    position: absolute;
    top: -15px;
    right: 0;
}
.small-window .alt-prompt-buttons {
    height: 2.5rem;
}
.small-window .alt_prompt_textboxes {
    position: relative;
    width: 95vw;
    left: 0vw;
    padding: 0;
    margin: 0;
}
.alt-prompt-generate-button {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-right: none !important;
    margin-left: 2px;
}
.alt-prompt-center-button {
    border-radius: 0 !important;
}
.alt-interrupt {
    margin-left: 0px;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-left: none !important;
}
.alt_prompt_extra_area {
    width: 100%;
}
.alt-prompt-added-image-area {
    max-width: calc(100% - 7rem);
}
.alt-prompt-image-container {
    display: inline-block;
    position: relative;
    background-color: rgba(var(--bs-body-bg-rgb), 0.2);
    transition: background-color 0.2s ease-out;
}

.alt-prompt-image {
    max-height: 128px;
    margin-right: 1px;
}

.alt-prompt-image-container-remove-button {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(var(--bs-danger-rgb), 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
}

.alt-prompt-image-container:hover .alt-prompt-image-container-remove-button {
    opacity: 1.0;
    background-color: rgba(var(--bs-danger-rgb), 0.5);
    border: 1px solid var(--red);
}

.alt-prompt-image-container-remove-button:hover {
    opacity: 1.0;
    background-color: rgba(var(--red-rgb), 0.7) !important;
    border: 1px solid black;
    cursor: pointer;
}

.image-clear-button {
    vertical-align: middle;
    display: inline-block;
}
.param-edit-group-container {
    display: block;
    border-radius: 0.5rem;
    border: 1px solid var(--light-border);
    padding: 0.5rem;
}
.param-edit-container-for-group {
    display: block;
    margin-bottom: 0.5rem;
}
.param-edit-container {
    display: block;
    border-radius: 0.5rem;
    border: 1px solid color-mix(in srgb, var(--background) 70%, var(--light-border));
    padding: 0.2rem;
    margin-left: 1rem;
}
.param-edit-header {
    display: inline-block;
    font-weight: bold;
    margin-right: 0.5rem;
}
.param-edit-part {
    display: inline-block;
    margin-right: 1rem;
}
.param-edit-number {
    width: 3rem;
}
.param-edit-text {
    width: 20rem;
}
.clip-tokenization-input-box {
    margin-top: 1rem;
    width: 90%;
    margin-left: 1rem;
}
.clip-tokenization-block {
    border-radius: 0.5rem;
    display: inline-block;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    margin: 1px;
    background-color: color-mix(in srgb, var(--background) 70%, var(--yellow));
}
.clip-tokenization-word-tweak {
    background-color: color-mix(in srgb, var(--background) 70%, var(--green));
}
.clip-tokenization-wordbreak {
    font-size: 80%;
    color: var(--text-soft);
}
.clip-tokenization-weight {
    font-size: 70%;
    color: var(--text-soft);
    float: right;
    padding-top: 0.15rem;
    padding-left: 0.1rem;
}
.image-preview-progress-wrapper {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
}
.image-preview-progress-inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
}
.image-preview-progress-overall {
    position: absolute;
    z-index: 1;
    top: calc(10rem - 7px);
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--emphasis);
}
.image-preview-progress-current {
    position: absolute;
    z-index: 1;
    top: calc(10rem - 5px);
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--green);
}
.controlnet-preview-result img {
    max-width: 200px;
    max-height: 200px;
    margin-left: 2rem;
}
.wildcard_title {
    font-weight: bold;
    font-size: 150%;
}
.image_editor_input {
    vertical-align: top;
    height: 100%;
}
.image_editor_leftbar {
    margin: 0;
    display: inline-block;
    vertical-align: top;
    width: 52px;
    height: calc(100% - 52px);
}
.image_editor_rightbar {
    margin: 0;
    display: inline-block;
    vertical-align: top;
    width: 52px;
    height: calc(100% - 52px);
}
.image_editor_bottombar {
    margin: 0;
    height: 32px;
    display: block;
    width: 100%;
}
.image-editor-canvas {
    margin: 0;
    display: inline-block;
    vertical-align: top;
}
.image-editor-tool {
    margin: 6px;
    width: 32px;
    height: 32px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 32px 32px;
    background-color: var(--button-background);
    cursor: pointer;
    border: 1px solid var(--button-border);
    border-radius: 8px;
}
.image-editor-tool:hover {
    background-color: var(--button-background-hover);
}
.image-editor-tool-selected {
    background-color: var(--danger-button-background-hover);
}
.image-editor-tool-selected:hover {
    background-color: var(--danger-button-background-hover);
}
.image-editor-info-bubble-title {
    font-weight: bold;
}
.image-editor-info-bubble-description {
    max-width: 400px;
    white-space: normal;
}
.image-editor-tool-bottombar {
    padding-left: 52px;
    margin: 0;
    height: 32px;
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    font-size: 14px;
}
.image-editor-tool-block {
    display: flex;
    flex-grow: 2;
    align-items: baseline;
    border: 1px solid var(--light-border);
    height: 32px;
}
.image_editor_canvaslist {
    display: block;
    margin: 0;
    width: 52px;
}
.image_editor_layer_preview {
    display: block;
    width: 50px;
    height: 50px;
    border: 1px solid var(--light-border);
    margin-bottom: 5px;
    margin-top: 1px;
    cursor: pointer;
}
.image_editor_layer_preview canvas {
    width: 50px;
    height: 50px;
    object-fit: contain;
    object-position: center;
}
.image_editor_layer_preview-active {
    border: 2px solid var(--box-selected-border);
}
.image_editor_layer_preview-active canvas {
    width: 46px;
    height: 46px;
}
.image_editor_layer_preview:hover {
    border: 2px solid var(--box-selected-border-stronger);
}
.image_editor_layer_preview:hover canvas {
    width: 46px;
    height: 46px;
}
.image_editor_layer_info {
    position: relative;
    overflow: visible;
    width: 0;
    height: 0;
    top: -55px;
    margin: 0;
    padding: 0;
    font-size: 70%;
}
.image_editor_layer_info_sub {
    background-color: rgba(0, 0, 0, 0.6);
    width: fit-content;
}
.image_editor_newlayer_button {
    margin: auto;
    text-align: center;
    display: block;
    width: 80%;
    padding-top: 8px;
    padding-bottom: 8px;
    border-radius: 16px;
    margin-bottom: 5px;
    font-size: 9px;
}
.server_logs_container {
    display: block;
    width: 80vw;
    height: calc(90vh - 10rem);
    border: 1px solid var(--light-border);
    border-radius: 1rem;
    padding: 0.5rem;
    overflow: auto;
    font-family: var(--font-monospace);
    margin-left: auto;
    margin-right: auto;
}
.log_message {
    white-space: pre-wrap;
}
.log_message_0 {
    background-color: rgba(255, 255, 255, 0.01);
}
.log_message_1 {
    background-color: rgba(0, 0, 0, 0.01);
}
.lora_extractor_special {
    width: 100%;
    height: 10px;
    position: relative;
}
.lora_extractor_special .image-preview-progress-overall {
    top: 5px;
}
.lora_extractor_special .image-preview-progress-current {
    top: 3px;
}
.manage-users-left, .manage-users-right {
    display: inline-block;
    height: calc(100vh - 6rem);
    padding: 0.5rem;
    vertical-align: top;
    overflow-y: auto;
}
.manage-users-left {
    margin-left: 0.5rem;
    width: 20rem;
}
.manage-users-right {
    width: calc(100vw - 22rem - 6px);
}
.manage_user_leftbox_content {
    min-width: 1rem;
    min-height: 3rem;
    margin-bottom: 2rem;
}
.admin-user-manage-name {
    border-radius: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    margin: 0.5rem;
    display: block;
    background-color: var(--background-soft);
    cursor: pointer;
    transition: background-color 0.5s ease-out;
}
.admin-user-manage-name:hover {
    background-color: var(--emphasis);
}
.manage-users-left-header {
    display: flex;
}
.manage-users-left-title {
    font-size: 1.5rem;
    flex-grow: 1;
}
.admin-user-right-titlebar {
    display: inline;
    font-size: 1.5rem;
    margin: 1rem;
}
.admin-user-right-titlebar-name {
    border: 1px dashed var(--light-border);
    padding-left: 0.2rem;
    padding-right: 0.2rem;
}
.admin-user-manage-notice {
    display: inline;
}
.welcome_message {
    margin: auto;
    width: fit-content;
    height: fit-content;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    font-size: 150%;
    white-space: pre-wrap;
    text-align: center;
}
.welcome-message-wrapper {
    min-height: 8em;
    width: fit-content;
}
.button-starred-image {
    background-color: var(--star);
    color: black !important;
    box-shadow: 0 0 1px 1px var(--star);
    transition: all 0.5s ease-out;
    border: none;
}
.button-starred-image:hover {
    background-color: orange;
    color: black;
}
.main_inputs_filter {
    width: 100%;
    margin: auto;
    padding-right: 20px;
    margin-bottom: 0.2rem;
}
.card-collection-inline {
    display: block;
    width: fit-content;
    margin: auto;
    text-align: center;
}
.card-collection-inline .card {
    display: inline-block;
    margin: 0.2rem;
    vertical-align: top;
    text-align: left;
}
@media screen and (max-width:768px) {
    .input-sidebar {
        width: calc(16rem - 5px);
    }
}
.auto-symbol {
    color:var(--emphasis);
    margin-right: 0.25rem;
}
.simpletabmainview {
    overflow: hidden;
    height: calc(100% - 0.6rem);
}
.simpletabbrowserwrapper {
    width: 100vw;
    height: calc(100vh - 2rem);
}
.simple-wrapper-flex {
    width: 100%;
    height: calc(100vh - 2rem - 15rem);
    display: flex;
    justify-content: flex-start;
}
.simple-bottom-area {
    width: 100%;
    height: 15rem;
    display: block;
}
.simpleinputsidebar {
    padding-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 100%;
    min-width: 20rem;
}
.simpleinput-top-section {
    width: 100%;
    height: calc(100% - 5rem);
    overflow: auto;
}
.simpleinputsidebar .auto-input-prompt-tokencount {
    display: none;
}
.simple-gen-button-wrapper {
    display: block;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--light-border);
}
.simple-gen-button-wrapper .generate-button {
    display: block;
    width: 90%;
    margin: auto;
}
.simpleimagearea {
    flex-grow: 10;
    text-align: center;
    padding-top: 20px;
}
.simpleimagearea .loading-spinner {
    top: -60%;
}
.simpleimagearea img {
    max-width: 100%;
    height: calc(100vh - 20rem);
    object-fit: contain;
}
.simpletab-workflow-header {
    display: block;
    text-align: center;
    font-size: 150%;
    font-weight: bold;
}
.simpletabbrowserwrapper .image-preview-text,
.simpletabbrowserwrapper .model-descblock {
    font-size: 100%;
}
.simple-outer-wall {
    height: 100%;
    width: 5px;
    min-width: 5px;
    margin-left: 1rem;
    margin-right: 0;
    background-color: var(--light-border);
}
.simple-vertical-divider {
    height: 5px;
    width: 100%;
    margin: 0;
    background-color: var(--light-border);
}
.simpletab-progress-wrapper .image-preview-progress-inner {
    top: calc(-10rem + 5px);
}
.simple_current_image_batch {
    padding: 1rem;
    display: block;
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    height: 15rem;
    text-align: right;
    white-space: normal;
}
.simple_current_image_batch .image-block {
    margin-left: 0.5rem;
    height: 10rem;
}
.browser-section-loader {
    display: block;
    height: 40rem;
    width: 50%;
}
.model_downloader_metadatazone {
    width: 40rem;
    max-width: calc(100vw - 42rem);
    max-height: 20rem;
    padding: 1rem;
    border: 1px solid var(--light-border);
    border-radius: 0.5rem;
    overflow: auto;
    display: inline-block;
    vertical-align: top;
}
.model_downloader_imageside {
    display: inline-block;
    width: 20rem;
    vertical-align: top;
}
.model_downloader_imageside img {
    max-width: 100%;
    max-height: 20rem;
    object-fit: contain;
}
.model_downloader_imageselector {
    text-align: center;
}
.model-downloader-section-wrapper {
    display: block;
    width: fit-content;
    margin: auto;
}
.model-downloader-main-section {
    display: inline-block;
    width: 70rem;
    padding-right: 1rem;
    padding-left: 1rem;
    max-width: calc(100vw - 44rem);
}
.model-downloader-right-sidebar {
    display: inline-block;
    vertical-align: top;
    max-width: 42rem;
}
.active-model-download-card {
    display: inline-block;
    width: 20rem;
}
.active-model-download-card img {
    width: 10rem;
    margin-left: 5rem;
    max-height: 10rem;
    object-fit: contain;
}
.active-model-download-card .status-text {
    font-size: 80%;
}
.ext-danger-license {
    background-color: rgba(255, 0, 0, 0.03);
}
.input_filter_container {
    display: flex;
    position: relative;
}
.input_filter_container.bottom_filter {
    display: inline;
}
.input_filter_container.bottom_filter input {
    padding-right: 20px;
}
.clear_input_icon {
    position: absolute;
    right: 5px;
    top: 2px;
    cursor: pointer;
    display: none;
}
.clear_input_icon.bottom_filter {
    top: -1px;
}
.swap_aspectratio_button {
    position: absolute;
    font-size: 18px;
    padding: 0 5px !important;
}
.admin_perm_group {
    display: inline-block;
    border-radius: 0.5rem;
    padding: 0.5rem;
    border: 1px solid var(--light-border);
    margin: 1rem;
}
.prompt-copy-button {
    float: right;
}
.trigger-phrase-copy-button {
    display: inline-flex;
    align-items: center;
    font-size: 90%;
    height: 1.6em;
    padding-top: 0 !important;
}
.log-line-error {
    background-color: rgba(200, 0, 0, 1) !important;
}

.log-line-sub-error {
    background-color: rgba(255, 0, 0, 0.3);
}
.log-line-sub-warn {
    background-color: rgba(255, 255, 0, 0.3);
}
.log-line-sub-good {
    background-color: rgba(0, 255, 0, 0.3);
}
.log-line-sub-info {
    color: var(--bs-secondary-color);
}
.log-line-sub-info::before {
    color: var(--bs-secondary-color);
}
.log-line-sub-info::after {
    color: var(--bs-secondary-color);
}
.log-line-debug {
    display: none;
}
.log-line {
    white-space: pre-wrap;
    font-family: var(--font-monospace);
    font-size: 90%;
}
.log-line-content {
    display: inline;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.log-line-time {
    opacity: 0.7;
    padding-right: 0.5rem;
}
.log-line-level {
    font-weight: bold;
    padding-right: 0.5rem;
}
.log-line-message {
    display: inline;
    max-width: calc(100% - 10rem);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.log-line-error {
    background-color: rgba(200, 0, 0, 1) !important;
}

.log-line-sub-error {
    background-color: rgba(255, 0, 0, 0.3);
}
.log-line-sub-warn {
    background-color: rgba(255, 255, 0, 0.3);
}
.log-line-sub-good {
    background-color: rgba(0, 255, 0, 0.3);
}
.log-line-sub-info {
    color: var(--bs-secondary-color);
}
.log-line-sub-info::before {
    color: var(--bs-secondary-color);
}
.log-line-sub-info::after {
    color: var(--bs-secondary-color);
}
.log-line-debug {
    display: none;
}
.log-line {
    white-space: pre-wrap;
    font-family: var(--font-monospace);
    font-size: 90%;
}
.log-line-content {
    display: inline;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.log-line-time {
    opacity: 0.7;
    padding-right: 0.5rem;
}
.log-line-level {
    font-weight: bold;
    padding-right: 0.5rem;
}
.log-line-message {
    display: inline;
    max-width: calc(100% - 10rem);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.backend-list-entry-unavailable {
    opacity: 0.5;
    background-color: rgba(var(--bs-body-bg-rgb), 0.2);
}

.backend-list-entry-error {
    border-left: 5px solid var(--bs-danger);
    background-color: rgba(var(--bs-danger-rgb), 0.1);
}
.backend-list-entry-warning {
    border-left: 5px solid var(--bs-warning);
    background-color: rgba(var(--bs-warning-rgb), 0.1);
}
.backend-list-entry-info {
    border-left: 5px solid var(--bs-info);
    background-color: rgba(var(--bs-info-rgb), 0.1);
}
.backend-list-entry-good {
    border-left: 5px solid var(--bs-success);
}
.backend-list-entry-stale {
    border-left: 5px solid var(--bs-warning);
}
.backend-list-entry-waiting {
    border-left: 1px solid rgba(var(--bs-border-color-rgb), 0.3);
}
.backend-type-label {
    font-weight: bold;
    margin-left: 1rem;
}
.backend-type-label::after {
    content: ':';
}
.backend-log-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 10rem);
    overflow-y: auto;
    padding: 0.5rem;
}
.backend-log-line {
    display: flex;
    align-items: center;
    padding: 0.2rem;
    border-radius: 0.3rem;
    margin-bottom: 0.2rem;
}
.backend-log-line:hover {
    background-color: rgba(var(--bs-primary-rgb), 0.1);
}
.backend-log-level {
    width: 4rem;
    text-align: right;
    padding-right: 0.5rem;
    font-weight: bold;
}
.backend-log-message {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.backend-log-time {
    opacity: 0.7;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
.backend-log-error {
    color: var(--bs-danger);
}
.backend-log-warning {
    color: var(--bs-warning);
}
.backend-log-info {
    color: var(--bs-info);
}
.backend-log-success {
    color: var(--bs-success);
}
.backend-log-auto-scroll-button {
    position: absolute;
    right: 1rem;
    top: 0.5rem;
    background-color: rgba(var(--bs-body-bg-rgb), 0.5);
    border-radius: 0.5rem;
    padding: 0.2rem;
    cursor: pointer;
}
.backend-log-auto-scroll-button:hover {
    background-color: var(--bs-primary);
}
.image-history-jumper {
    width: 100%;
    height: 20px;
    border: 1px solid rgba(var(--light-border-rgb), 0.7);
    background-color: rgba(var(--background-rgb), 0.7);
    color: var(--text);
    border-radius: 5px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}
.wildcard-list-item {
    padding: 0.5rem;
    border-radius: 0.5rem;
    margin-bottom: 0.2rem;
}
.wildcard-list-item:hover {
    cursor: pointer;
    background-color: rgba(var(--yellow-rgb), 0.7);
}
.wildcard-list-item.selected {
    background-color: rgba(var(--green-rgb), 0.7);
}

#modal_presets_list {
    max-height: calc(90vh - 10rem);
    overflow-y: auto;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid var(--light-border);
    background-color: var(--background);
}
.modal-preset-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    margin-bottom: 0.2rem;
    cursor: pointer;
}
.modal-preset-item:hover {
    background-color: rgba(var(--bs-primary-rgb), 0.1);
}
.modal-preset-item.selected {
    background-color: rgba(var(--green-rgb), 0.7);
}
.modal-preset-item .preset-name {
    flex-grow: 1;
    margin-right: 0.5rem;
    font-weight: bold;
}
.modal-preset-item .preset-description {
    flex-grow: 2;
    margin-right: 0.5rem;
    color: var(--bs-secondary-color);
    font-size: 90%;
}
.modal-preset-item .preset-params {
    flex-grow: 1;
    margin-right: 0.5rem;
    color: var(--bs-secondary-color);
    font-size: 90%;
    text-align: right;
}
.modal-preset-item .preset-remove-button {
    color: var(--bs-danger);
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
}
.modal-preset-item .preset-remove-button:hover {
    color: rgba(var(--bs-danger-rgb), 0.7);
}
.modal-preset-item .preset-add-button {
    background-color: var(--bs-primary);
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 0.3rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
.modal-preset-item .preset-add-button:hover {
    background-color: rgba(var(--bs-primary-rgb), 0.8);
}
.modal-preset-item .preset-add-button.selected {
    background-color: rgba(var(--green-rgb), 0.7);
}
.modal-preset-item .preset-add-button.disabled {
    background-color: var(--bs-secondary-bg);
    color: var(--bs-secondary-color);
    cursor: not-allowed;
}
.modal-preset-item .preset-add-button.disabled:hover {
    background-color: var(--bs-secondary-bg);
}
.modal-preset-item .preset-duplicate-button {
    color: var(--bs-info);
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
}
.modal-preset-item .preset-duplicate-button:hover {
    color: rgba(var(--bs-info-rgb), 0.7);
}
.modal-preset-item .preset-export-button {
    color: var(--bs-success);
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
}
.modal-preset-item .preset-export-button:hover {
    color: rgba(var(--bs-success-rgb), 0.7);
}
.modal-preset-item .preset-import-button {
    color: var(--bs-warning);
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
}
.modal-preset-item .preset-import-button:hover {
    color: rgba(var(--bs-warning-rgb), 0.7);
}
.modal-preset-item .preset-download-button {
    color: var(--bs-danger);
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
}
.modal-preset-item .preset-download-button:hover {
    color: rgba(var(--bs-danger-rgb), 0.7);
}
.modal-preset-item .preset-upload-button {
    color: var(--bs-primary);
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
}
.modal-preset-item .preset-upload-button:hover {
    color: rgba(var(--bs-primary-rgb), 0.8);
}
.modal-preset-item .preset-info-button {
    color: var(--bs-secondary-color);
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
}
.modal-preset-item .preset-info-button:hover {
    color: rgba(var(--bs-secondary-color-rgb), 0.7);
}
.modal-preset-item .preset-params-button {
    color: var(--bs-secondary-color);
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
}
.modal-preset-item .preset-params-button:hover {
    color: rgba(var(--bs-secondary-color-rgb), 0.7);
}
.modal-preset-item .preset-advanced-button {
    color: var(--bs-secondary-color);
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
}
.modal-preset-item .preset-advanced-button:hover {
    color: rgba(var(--bs-secondary-color-rgb), 0.7);
}
.modal-preset-item .preset-label {
    display: inline-block;
    padding: 0.1rem 0.3rem;
    border-radius: 0.3rem;
    margin-right: 0.5rem;
    font-size: 80%;
    font-weight: normal;
    color: white;
}
.modal-preset-item .preset-label.tag-success {
    background-color: var(--bs-success);
}
.modal-preset-item .preset-label.tag-info {
    background-color: var(--bs-info);
}
.modal-preset-item .preset-label.tag-warning {
    background-color: var(--bs-warning);
}
.modal-preset-item .preset-label.tag-danger {
    background-color: var(--bs-danger);
}
.modal-preset-item .preset-label.tag-primary {
    background-color: var(--bs-primary);
}
.modal-preset-item .preset-label.tag-secondary {
    background-color: var(--bs-secondary);
}
.modal-preset-item .preset-label.tag-light {
    background-color: var(--light-border);
}
.modal-preset-item .preset-label.tag-dark {
    background-color: rgba(0, 0, 0, 0.7);
}
.modal-preset-item .preset-label.tag-pending {
    background-color: rgba(255, 255, 0, 0.7);
}
.modal-preset-item .preset-label.tag-processing {
    background-color: rgba(0, 255, 255, 0.7);
}
.modal-preset-item .preset-label.tag-completed {
    background-color: rgba(0, 255, 0, 0.7);
}
.modal-preset-item .preset-label.tag-failed {
    background-color: rgba(255, 0, 0, 0.7);
}
.modal-preset-item .preset-label.tag-canceled {
    background-color: rgba(128, 128, 128, 0.7);
}
.modal-preset-item .preset-label.tag-unknown {
    background-color: rgba(255, 255, 255, 0.7);
}
.modal-preset-item .preset-label.tag-default {
    background-color: rgba(0, 0, 0, 0.1);
}

```

**K:\.ai_local\SwarmUI\src\Core\Program.cs**

```
using FreneticUtilities.FreneticDataSyntax;
using FreneticUtilities.FreneticExtensions;
using FreneticUtilities.FreneticToolkit;
using Hardware.Info;
using LiteDB;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using SixLabors.ImageSharp;
using SwarmUI.Accounts;
using SwarmUI.Backends;
using SwarmUI.Text2Image;
using SwarmUI.Utils;
using SwarmUI.WebAPI;
using System.Collections;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Runtime.InteropServices;
using System.Runtime.Loader;

namespace SwarmUI.Core;

/// <summary>Class that handles the core entry-point access to the program, and initialization of program layers.</summary>
public class Program
{
    /// <summary>Central store of available backends.</summary>
    public static BackendHandler Backends; // TODO: better location for central values

    /// <summary>Central store of web sessions.</summary>
    public static SessionHandler Sessions;

    /// <summary>Central store of Text2Image models.</summary>
    public static Dictionary<string, T2IModelHandler> T2IModelSets = [];

    /// <summary>Main Stable-Diffusion model tracker.</summary>
    public static T2IModelHandler MainSDModels => T2IModelSets["Stable-Diffusion"];

    /// <summary>The manager for SwarmUI extensions.</summary>
    public static ExtensionsManager Extensions = new();

    /// <summary>Holder of server admin settings.</summary>
    public static Settings ServerSettings = new();

    private static readonly CancellationTokenSource GlobalCancelSource = new();

    /// <summary>If this is signalled, the program is cancelled.</summary>
    public static CancellationToken GlobalProgramCancel = GlobalCancelSource.Token;

    /// <summary>If enabled, settings will be locked to prevent user editing.</summary>
    public static bool LockSettings = false;

    /// <summary>Path to the settings file, as set by command line.</summary>
    public static string SettingsFilePath;

    /// <summary>Proxy (ngrok/cloudflared) instance, if loaded at all.</summary>
    public static PublicProxyHandler ProxyHandler;

    /// <summary>Central web server core.</summary>
    public static WebServer Web;

    /// <summary>User-requested launch mode (web, electron, none).</summary>
    public static string LaunchMode;

    /// <summary>Event triggered when a user wants to refresh the models list.</summary>
    public static Action ModelRefreshEvent;

    /// <summary>Event-action fired when the server wasn't generating for a while and is now starting to generate again.</summary>
    public static Action TickIsGeneratingEvent;

    /// <summary>Event-action fired once per second (approximately) while the server is *not* generating anything.</summary>
    public static Action TickNoGenerationsEvent;

    /// <summary>Event-action fired once per second (approximately) all the time.</summary>
    public static Action TickEvent;

    /// <summary>Event-action fired once per minute (approximately) all the time.</summary>
    public static Action SlowTickEvent;

    /// <summary>Event-action fired when the model paths have changed (eg via settings change).</summary>
    public static Action ModelPathsChangedEvent;

    /// <summary>General data directory root.</summary>
    public static string DataDir = "Data";

    /// <summary>If a version update is available, this is the message.</summary>
    public static string VersionUpdateMessage = null, VersionUpdateMessageShort = null;

    /// <summary>Date of the current git commit, if known.</summary>
    public static string CurrentGitDate = null;

    /// <summary>Primary execution entry point.</summary>
    public static void Main(string[] args)
    {
        SpecialTools.Internationalize(); // Fix for MS's broken localization
        BsonMapper.Global.EmptyStringToNull = false; // Fix for LiteDB's broken handling of empty strings
        ServicePointManager.DefaultConnectionLimit = 1000; // MS default limit is really low here
        Logs.Init($"=== SwarmUI v{Utilities.Version} Starting at {DateTimeOffset.Now:yyyy-MM-dd HH:mm:ss} ===");
        Utilities.LoadTimer timer = new();
        AssemblyLoadContext.Default.Unloading += (_) => Shutdown();
        AppDomain.CurrentDomain.ProcessExit += (_, _) => Shutdown();
        AppDomain.CurrentDomain.UnhandledException += (_, e) =>
        {
            Logs.Debug($"Unhandled exception: {e.ExceptionObject}");
        };
        List<Task> waitFor = [];
        //Utilities.CheckDotNet("8");
        Extensions.PrepExtensions();
        try
        {
            Logs.Init("Parsing command line...");
            ParseCommandLineArgs(args);
            if (GetCommandLineFlagAsBool("help", false))
            {
                PrintCommandLineHelp();
                return;
            }
            Logs.Init("Loading settings file...");
            DataDir = Utilities.CombinePathWithAbsolute(Environment.CurrentDirectory, GetCommandLineFlag("data_dir", "Data"));
            SettingsFilePath = GetCommandLineFlag("settings_file", $"{DataDir}/Settings.fds");
            LoadSettingsFile();
            RebuildDataDir();
            // TODO: Legacy format patch from Alpha 0.5! Remove this before 1.0.
            if (ServerSettings.DefaultUser.FileFormat.ImageFormat == "jpg")
            {
                ServerSettings.DefaultUser.FileFormat.ImageFormat = "JPG";
            }
            // TODO: Legacy patch from Beta 0.9.4.
            if (ServerSettings.IsInstalled && string.IsNullOrWhiteSpace(ServerSettings.InstallDate))
            {
                ServerSettings.InstallDate = "2024-12-01"; // (Technically earlier, but, well... who knows lol)
                ServerSettings.InstallVersion = "Beta";
            }
            if (!LockSettings)
            {
                Logs.Init("Re-saving settings file...");
                SaveSettingsFile();
            }
            Logs.Init("Applying command line settings...");
            ApplyCommandLineSettings();
            foreach (DictionaryEntry entry in Environment.GetEnvironmentVariables())
            {
                if ($"{entry.Key}".StartsWith("SWARM_"))
                {
                    Logs.Init($"EnvVar '{entry.Key}' set to '{entry.Value}'");
                }
            }
        }
        catch (SwarmReadableErrorException ex)
        {
            Logs.Error($"Command line arguments given are invalid: {ex.Message}");
            PrintCommandLineHelp();
            return;
        }
        if (ServerSettings.IsInstalled && ServerSettings.InstallDate != "2024-12-01")
        {
            DateTimeOffset date = DateTimeOffset.Parse(ServerSettings.InstallDate);
            TimeSpan offset = DateTimeOffset.Now - date;
            string timeAgo = offset.TotalDays < 60 ? $"{(int)offset.TotalDays} days" : $"{(int)(offset.TotalDays / 30)} months";
            Logs.Init($"SwarmUI was installed {ServerSettings.InstallDate} ({timeAgo} ago) with version {ServerSettings.InstallVersion}");
        }
        if (ServerSettings.ShowExperimentalFeatures)
        {
            Logs.Warning($"Experimental Features are enabled. Issue reports will not be accepted until you turn them off in Server Configuration.");
        }
        Logs.Init($"Swarm base path is: {Environment.CurrentDirectory}");
        Logs.Init($"Running on OS: {RuntimeInformation.OSDescription}");
        Logs.StartLogSaving();
        timer.Check("Initial settings load");
        if (ServerSettings.Maintenance.CheckForUpdates)
        {
            waitFor.Add(Utilities.RunCheckedTask(async () =>
            {
                await Utilities.RunGitProcess("fetch");
                string refs = await Utilities.RunGitProcess("tag --sort=-creatordate");
                string[] tags = [.. refs.Split('\n').Where(t => !string.IsNullOrWhiteSpace(t) && t.Contains('-') && Version.TryParse(t.Before('-'), out _)).Select(t => t.Trim()).OrderByDescending(t => Version.Parse(t.Before('-')))];
                Version local = Version.Parse(Utilities.Version);
                string[] newer = [.. tags.Where(t => Version.Parse(t.Before('-')) > local)];
                if (newer.Any())
                {
                    string url = $"{Utilities.RepoRoot}/releases/tag/{newer[0]}";
                    Logs.Warning($"A new version of SwarmUI is available: {newer[0]}! You are running version {Utilities.Version}, this is {newer.Length} release(s) behind. See release notes at {url}");
                    VersionUpdateMessageShort = $"Update available: {newer[0]} (you are running {Utilities.Version}, this is {newer.Length} release(s) behind):\nSee release notes at <a target=\"_blank\" href=\"{url}\">{url}</a>";
                    VersionUpdateMessage = $"{VersionUpdateMessageShort}\nThere is a button available to automatically apply the update on the <a href=\"#Settings-Server\" onclick=\"getRequiredElementById('servertabbutton').click();getRequiredElementById('serverinfotabbutton').click();\">Server Info Tab</a>.";
                }
                else if (tags.IsEmpty())
                {
                    Logs.Error($"Swarm failed to check for updates! Tag list empty?!");
                }
                else
                {
                    Logs.Init($"Swarm is up to date! You have version {Utilities.Version}, and {tags[0]} is the latest.");
                }
            }, "check for updates"));
        }
        waitFor.Add(Utilities.RunCheckedTask(async () =>
        {
            try
            {
                string showOutput = await Utilities.RunGitProcess("show --no-patch --format=%h^%ci^%s HEAD");
                string[] parts = showOutput.SplitFast('^', 2);
                DateTimeOffset date = DateTimeOffset.Parse(parts[1].Trim()).ToUniversalTime();
                CurrentGitDate = $"{date:yyyy-MM-dd HH:mm:ss}";
                TimeSpan relative = DateTimeOffset.UtcNow - date;
                string ago = $"{relative.Hours} hour{(relative.Hours == 1 ? "" : "s")} ago";
                if (relative.Hours > 48)
                {
                    ago = $"{relative.Days} day{(relative.Days == 1 ? "" : "s")} ago";
                }
                else if (relative.Hours == 0)
                {
                    ago = $"{relative.Minutes} minute{(relative.Minutes == 1 ? "" : "s")} ago";
                }
                Logs.Init($"Current git commit is [{parts[0]}: {parts[2]}], marked as date {CurrentGitDate} ({ago})");
            }
            catch (Exception ex)
            {
                Logs.Error($"Failed to get git commit date: {ex.ReadableString()}");
                CurrentGitDate = "Git failed to load";
            }
        }, "check current git commit"));
        waitFor.Add(Utilities.RunCheckedTask(async () =>
        {
            NvidiaUtil.NvidiaInfo[] gpuInfo = NvidiaUtil.QueryNvidia();
            SystemStatusMonitor.HardwareInfo.RefreshMemoryStatus();
            MemoryStatus memStatus = SystemStatusMonitor.HardwareInfo.MemoryStatus;
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                Logs.Init($"CPU Cores: {Environment.ProcessorCount} | RAM: {new MemoryNum((long)memStatus.TotalPhysical)} total, {new MemoryNum((long)memStatus.AvailablePhysical)} available, {new MemoryNum((long)memStatus.TotalPageFile)} total page file, {new MemoryNum((long)memStatus.AvailablePageFile)} available page file");
            }
            else if ((long)memStatus.TotalVirtual <= 0)
            {
                Logs.Init($"CPU Cores: {Environment.ProcessorCount} | RAM: {new MemoryNum((long)memStatus.TotalPhysical)} total, {new MemoryNum((long)memStatus.AvailablePhysical)} available, unknown virtual/swap");
            }
            else if ((long)memStatus.TotalVirtual < (long)memStatus.TotalPhysical)
            {
                Logs.Init($"CPU Cores: {Environment.ProcessorCount} | RAM: {new MemoryNum((long)memStatus.TotalPhysical)} total, {new MemoryNum((long)memStatus.AvailablePhysical)} available, {new MemoryNum((long)memStatus.TotalVirtual)} virtual, unknown swap");
            }
            else
            {
                Logs.Init($"CPU Cores: {Environment.ProcessorCount} | RAM: {new MemoryNum((long)memStatus.TotalPhysical)} total, {new MemoryNum((long)memStatus.AvailablePhysical)} available, {new MemoryNum((long)memStatus.TotalVirtual)} virtual, {new MemoryNum((long)memStatus.TotalVirtual - (long)memStatus.TotalPhysical)} swap");
            }
            if (gpuInfo is not null && gpuInfo.Length > 0)
            {
                JObject gpus = [];
                foreach (NvidiaUtil.NvidiaInfo gpu in gpuInfo)
                {
                    Logs.Init($"GPU {gpu.ID}: {gpu.GPUName} | Temp {gpu.Temperature}C | Util {gpu.UtilizationGPU}% GPU, {gpu.UtilizationMemory}% Memory | VRAM {gpu.TotalMemory} total, {gpu.FreeMemory} free, {gpu.UsedMemory} used");
                }
                if (gpuInfo.All(gpu => gpu.GPUName.Contains("NVIDIA GeForce RTX 50")))
                {
                    Utilities.PresumeNVidia50xx = true;
                    Utilities.PresumeNVidia40xx = true;
                    Utilities.PresumeNVidia30xx = true;
                    Logs.Init($"Will use GPU accelerations specific to NVIDIA GeForce RTX 50xx series and newer.");
                }
                else if (gpuInfo.All(gpu => gpu.GPUName.Contains("NVIDIA GeForce RTX 40")))
                {
                    Utilities.PresumeNVidia40xx = true;
                    Utilities.PresumeNVidia30xx = true;
                    Logs.Init($"Will use GPU accelerations specific to NVIDIA GeForce RTX 40xx series and newer.");
                }
                else if (gpuInfo.All(gpu => gpu.GPUName.Contains("NVIDIA GeForce RTX 30")))
                {
                    Utilities.PresumeNVidia30xx = true;
                    Logs.Init($"Will use GPU accelerations specific to NVIDIA GeForce RTX 30xx series and newer.");
                }
            }
        }, "load gpu info"));
        T2IModelClassSorter.Init();
        Extensions.RunOnAllExtensions(e => e.OnPreInit());
        timer.Check("Extension PreInit");
        Logs.Init("Prepping options...");
        BuildModelLists();
        CommonModels.RegisterCoreSet();
        T2IParamTypes.RegisterDefaults();
        Backends = new()
        {
            SaveFilePath = GetCommandLineFlag("backends_file", $"{DataDir}/Backends.fds")
        };
        Sessions = new();
        Web = new();
        timer.Check("Prep Options");
        Web.PreInit();
        timer.Check("Web PreInit");
        Extensions.RunOnAllExtensions(e => e.OnInit());
        Sessions.ApplyDefaultPermissions();
        timer.Check("Extensions Init");
        Utilities.PrepUtils();
        timer.Check("Prep Utils");
        LanguagesHelper.LoadAll();
        timer.Check("Languages load");
        Logs.Init("Loading models list...");
        RefreshAllModelSets();
        WildcardsHelper.Init();
        AutoCompleteListHelper.Init();
        UserSoundHelper.Init();
        timer.Check("Model listing");
        Logs.Init("Loading backends...");
        Backends.Load();
        timer.Check("Backends");
        Logs.Init("Prepping API...");
        BasicAPIFeatures.Register();
        foreach (string str in CommandLineFlags.Keys.Where(k => !CommandLineFlagsRead.Contains(k)))
        {
            Logs.Warning($"Unused command line flag '{str}'");
        }
        timer.Check("API");
        Logs.Init("Prepping webserver...");
        Web.Prep();
        timer.Check("Web prep");
        Logs.Init("Readying extensions for launch...");
        Extensions.RunOnAllExtensions(e => e.OnPreLaunch());
        timer.Check("Extensions pre-launch");
        Logs.Init("Launching server...");
        Permissions.FixOrdered();
        Web.Launch();
        timer.Check("Web launch");
        try
        {
            using CancellationTokenSource cancel = Utilities.TimedCancel(TimeSpan.FromSeconds(5));
            Task.WaitAll([.. waitFor], cancel.Token);
        }
        catch (Exception ex)
        {
            Logs.Debug($"Startup tasks took too long: {ex.ReadableString()}");
        }
        Task.Run(() =>
        {
            Thread.Sleep(500);
            try
            {
                switch (LaunchMode.Trim().ToLowerFast())
                {
                    case "web":
                        Logs.Init("Launch web browser...");
                        Process.Start(new ProcessStartInfo(WebServer.PageURL) { UseShellExecute = true });
                        break;
                    case "webinstall":
                        Logs.Init("Launch web browser to install page...");
                        Process.Start(new ProcessStartInfo(WebServer.PageURL + "/Install") { UseShellExecute = true });
                        break;
                    case "electron":
                        Logs.Init("Electron launch not yet implemented.");
                        // TODO: Electron.NET seems not to function properly, need to get it working.
                        break;
                }
            }
            catch (Exception ex)
            {
                Logs.Error($"Failed to launch mode '{LaunchMode}' (If this is a headless/server install, run with '--launch_mode none' as explained in the readme): {ex.ReadableString()}");
            }
        });
        Task.Run(async () =>
        {
            while (true)
            {
                await Task.Delay(TimeSpan.FromSeconds(10), GlobalProgramCancel);
                if (GlobalProgramCancel.IsCancellationRequested)
                {
                    return;
                }
                if (Backends.BackendsEdited)
                {
                    Backends.BackendsEdited = false;
                    Backends.Save();
                }
            }
        });
        if (Environment.CurrentDirectory.Contains(' '))
        {
            Logs.Warning($"Your folder path for SwarmUI contains a space. While Swarm itself can handle this fine, sometimes upstream dependencies misbehave around spaces. It is recommended you keep file paths very simple.");
        }
        Logs.Init($"SwarmUI v{Utilities.Version} - {ServerSettings.UserAuthorization.InstanceTitle} is now running.");
        WebhookManager.SendWebhook("Startup", ServerSettings.WebHooks.ServerStartWebhook, ServerSettings.WebHooks.ServerShutdownWebhook);
        if (Environment.CurrentDirectory.Contains("StableSwarmUI"))
        {
            Logs.Warning("You are running SwarmUI in a folder labeled 'StableSwarmUI', indicating you may have ran from an extremely outdated legacy version of SwarmUI (Swarm split from Stability in June 2024). You should probably reinstall fresh from https://github.com/mcmonkeyprojects/SwarmUI");
        }
        if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("HTTP_PROXY")))
        {
            Logs.Warning("You have the environment variable 'HTTP_PROXY' set. This may cause network issues. If Swarm cannot connect to its own backends, remove this env var.");
        }
        WebServer.WebApp.WaitForShutdown();
        Shutdown();
    }

    /// <summary>Build the main model list from settings. Called at init or on settings change.</summary>
    public static void BuildModelLists()
    {
        foreach (string key in T2IModelSets.Keys.ToList())
        {
            T2IModelSets[key].Shutdown();
        }
        T2IModelSets.Clear();
        try
        {
            string modelRoot = ServerSettings.Paths.ActualModelRoot;
            foreach (string path in ServerSettings.Paths.SDModelFolder.Split(';'))
            {
                Directory.CreateDirectory(Utilities.CombinePathWithAbsolute(modelRoot, path));
            }
            Directory.CreateDirectory($"{modelRoot}/upscale_models");
            Directory.CreateDirectory($"{modelRoot}/clip");
        }
        catch (IOException ex)
        {
            Logs.Error($"Failed to create directories for models. You may need to check your ModelRoot or SDModelFolder settings. {ex.Message}");
        }
        string[] roots = [.. ServerSettings.Paths.ModelRoot.Split(';').Where(p => !string.IsNullOrWhiteSpace(p))];
        int downloadRootId = Math.Abs(ServerSettings.Paths.DownloadToRootID) % roots.Length;
        void buildPathList(string folder, T2IModelHandler handler)
        {
            Dictionary<string, string> result = [];
            int rootCount = 0;
            foreach (string modelRoot in roots)
            {
                int sfCount = 0;
                string[] subfolders = [.. folder.Split(';').Where(p => !string.IsNullOrWhiteSpace(p))];
                if (subfolders.Length == 0)
                {
                    Logs.Error($"Model set {handler.ModelType} has no subfolders defined! You cannot set a path to empty.");
                    return;
                }
                if (rootCount == downloadRootId)
                {
                    handler.DownloadFolderPath = Utilities.CombinePathWithAbsolute(Environment.CurrentDirectory, modelRoot.Trim(), subfolders[0].Trim());
                }
                foreach (string subfolder in subfolders)
                {
                    string patched = Utilities.CombinePathWithAbsolute(Environment.CurrentDirectory, modelRoot.Trim(), subfolder.Trim());
                    if ((sfCount > 0 || rootCount > 0) && rootCount != downloadRootId && !Directory.Exists(patched))
                    {
                        continue;
                    }
                    result[patched] = patched;
                    sfCount++;
                }
                rootCount++;
            }
            handler.FolderPaths = [.. result.Keys];
        }
        Directory.CreateDirectory(ServerSettings.Paths.ActualModelRoot + "/tensorrt");
        Directory.CreateDirectory(ServerSettings.Paths.ActualModelRoot + "/diffusion_models");
        T2IModelSets["Stable-Diffusion"] = new() { ModelType = "Stable-Diffusion" };
        buildPathList(ServerSettings.Paths.SDModelFolder + ";tensorrt;diffusion_models;unet", T2IModelSets["Stable-Diffusion"]);
        T2IModelSets["VAE"] = new() { ModelType = "VAE" };
        buildPathList(ServerSettings.Paths.SDVAEFolder, T2IModelSets["VAE"]);
        T2IModelSets["LoRA"] = new() { ModelType = "LoRA" };
        buildPathList(ServerSettings.Paths.SDLoraFolder, T2IModelSets["LoRA"]);
        T2IModelSets["Embedding"] = new() { ModelType = "Embedding" };
        buildPathList(ServerSettings.Paths.SDEmbeddingFolder, T2IModelSets["Embedding"]);
        T2IModelSets["ControlNet"] = new() { ModelType = "ControlNet" };
        buildPathList(ServerSettings.Paths.SDControlNetsFolder, T2IModelSets["ControlNet"]);
        T2IModelSets["Clip"] = new() { ModelType = "Clip" };
        buildPathList(ServerSettings.Paths.SDClipFolder, T2IModelSets["Clip"]);
        T2IModelSets["ClipVision"] = new() { ModelType = "ClipVision" };
        buildPathList(ServerSettings.Paths.SDClipVisionFolder, T2IModelSets["ClipVision"]);
    }

    /// <summary>Rebuild <see cref="DataDir"/>.</summary>
    public static void RebuildDataDir()
    {
        DataDir = Utilities.CombinePathWithAbsolute(Environment.CurrentDirectory, GetCommandLineFlag("data_dir", ServerSettings.Paths.DataPath));
    }

    /// <summary>Overlapping lock to prevent model set reads during a model list refresh.</summary>
    public static ManyReadOneWriteLock RefreshLock = new(64);

    /// <summary>Refreshes all model sets from file source.</summary>
    public static void RefreshAllModelSets()
    {
        RebuildDataDir();
        foreach (T2IModelHandler handler in T2IModelSets.Values)
        {
            try
            {
                handler.Refresh();
            }
            catch (Exception ex)
            {
                Logs.Error($"Failed to load models for {handler.ModelType}: {ex.Message}");
            }
        }
    }

    private volatile static bool HasShutdown = false;

    /// <summary>Tell the server to shutdown and restart. This call is not blocking, other code will continue momentarily.</summary>
    public static void RequestRestart()
    {
        _ = Utilities.RunCheckedTask(() => Shutdown(42), "shutdown");
    }

    /// <summary>Main shutdown handler. Tells everything to stop.</summary>
    public static void Shutdown(int code = 0)
    {
        if (HasShutdown)
        {
            return;
        }
        HasShutdown = true;
        Task waitShutdown = WebhookManager.SendWebhook("Shutdown", ServerSettings.WebHooks.ServerShutdownWebhook, ServerSettings.WebHooks.ServerShutdownWebhookData);
        Task.WaitAny(waitShutdown, Task.Delay(TimeSpan.FromMinutes(2)));
        Environment.ExitCode = code;
        Logs.Info("Shutting down...");
        GlobalCancelSource.Cancel();
        Logs.Verbose("Shutdown webserver...");
        WebServer.WebApp?.StopAsync().Wait();
        Logs.Verbose("Shutdown backends...");
        Backends?.Shutdown();
        Logs.Verbose("Shutdown sessions...");
        Sessions?.Shutdown();
        Logs.Verbose("Shutdown proxy handler...");
        ProxyHandler?.Stop();
        Logs.Verbose("Shutdown model handlers...");
        foreach (T2IModelHandler handler in T2IModelSets.Values)
        {
            handler.Shutdown();
        }
        Logs.Verbose("Shutdown extensions...");
        Extensions.RunOnAllExtensions(e => e.OnShutdown());
        Extensions.Extensions.Clear();
        Logs.Verbose("Shutdown image metadata tracker...");
        ImageMetadataTracker.Shutdown();
        Logs.Info("All core shutdowns complete.");
        if (Logs.LogSaveThread is not null)
        {
            if (Logs.LogSaveThread.IsAlive)
            {
                Logs.LogSaveCompletion.WaitOne();
            }
            Logs.SaveLogsToFileOnce();
        }
        Logs.Info("Process should end now.");
    }

    #region settings
    /// <summary>Load the settings file.</summary>
    public static void LoadSettingsFile()
    {
        FDSSection section;
        try
        {
            section = FDSUtility.ReadFile(SettingsFilePath);
        }
        catch (FileNotFoundException)
        {
            Logs.Init("No settings file found.");
            return;
        }
        catch (Exception ex)
        {
            Logs.Error($"Error loading settings file: {ex.ReadableString()}");
            return;
        }
        // TODO: Legacy format patch from Beta 0.6! Remove this before 1.0.
        string legacyLogLevel = section.GetString("LogLevel", null);
        string newLogLevel = section.GetString("Logs.LogLevel", null);
        if (legacyLogLevel is not null && newLogLevel is null)
        {
            section.Set("Logs.LogLevel", legacyLogLevel);
        }
        // TODO: Legacy format patch from Beta 0.9!
        bool? modelPerFolder = section.GetBool("Paths.ModelMetadataPerFolder", null);
        if (modelPerFolder.HasValue)
        {
            section.Set("Metadata.ModelMetadataPerFolder", modelPerFolder.Value);
        }
        bool? imagePerFolder = section.GetBool("Paths.ImageMetadataPerFolder", null);
        if (imagePerFolder.HasValue)
        {
            section.Set("Metadata.ImageMetadataPerFolder", imagePerFolder.Value);
        }
        // TODO: Legacy format patch from beta 0.9.2!
        bool? autoCompleteEscapeParens = section.GetBool("DefaultUser.AutoCompleteEscapeParens", null);
        if (autoCompleteEscapeParens.HasValue)
        {
            section.Set("DefaultUser.AutoComplete.EscapeParens", autoCompleteEscapeParens.Value);
        }
        string autoCompleteSource = section.GetString("DefaultUser.AutoCompletionsSource", null);
        if (autoCompleteSource is not null)
        {
            section.Set("DefaultUser.AutoComplete.Source", autoCompleteSource);
        }
        string autoCompleteSuffix = section.GetString("DefaultUser.AutoCompleteSuffix", null);
        if (autoCompleteSuffix is not null)
        {
            section.Set("DefaultUser.AutoComplete.Suffix", autoCompleteSuffix);
        }
        bool? allowUnsafeOutpath = section.GetBool("DefaultUserRestriction.AllowUnsafeOutpaths", null);
        if (allowUnsafeOutpath.HasValue)
        {
            SessionHandler.PatchOwnerAllowUnsafe = allowUnsafeOutpath.Value;
        }
        int? maxT2i = section.GetInt("DefaultUserRestriction.MaxT2ISimultaneous", null);
        if (maxT2i.HasValue)
        {
            SessionHandler.PatchOwnerMaxT2I = maxT2i.Value;
        }
        int? maxDepth = section.GetInt("DefaultUserRestriction.MaxOutPathDepth", null);
        if (maxDepth.HasValue)
        {
            SessionHandler.PatchOwnerMaxDepth = maxDepth.Value;
        }
        // TODO: Legacy format patch from beta 0.9.4!
        bool? checkForUpdates = section.GetBool("CheckForUpdates", null);
        if (checkForUpdates.HasValue)
        {
            section.Set("Maintenance.CheckForUpdates", checkForUpdates.Value);
        }
        bool? autoPullDevUpdates = section.GetBool("AutoPullDevUpdates", null);
        if (autoPullDevUpdates.HasValue)
        {
            section.Set("Maintenance.AutoPullDevUpdates", autoPullDevUpdates.Value);
        }
        ServerSettings.Load(section);
    }

    /// <summary>Save the settings file.</summary>
    public static void SaveSettingsFile()
    {
        if (LockSettings)
        {
            return;
        }
        try
        {
            FDSUtility.SaveToFile(ServerSettings.Save(true), SettingsFilePath);
            bool hasAlwaysPullFile = File.Exists("./src/bin/always_pull");
            if (ServerSettings.Maintenance.AutoPullDevUpdates && !hasAlwaysPullFile)
            {
                File.WriteAllText("./src/bin/always_pull", "true");
            }
            else if (!ServerSettings.Maintenance.AutoPullDevUpdates && hasAlwaysPullFile)
            {
                File.Delete("./src/bin/always_pull");
            }
        }
        catch (Exception ex)
        {
            Logs.Error($"Error saving settings file: {ex.ReadableString()}");
            return;
        }
    }
    #endregion

    #region command-line pre-apply
    private static readonly int[] CommonlyUsedPorts = [21, 22, 80, 8080, 7860, 8188];
    /// <summary>Pre-applies settings choices from command line.</summary>
    public static void ApplyCommandLineSettings()
    {
        ReapplySettings();
        string environment = GetCommandLineFlag("environment", "production").ToLowerFast() switch
        {
            "dev" or "development" => "Development",
            "prod" or "production" => "Production",
            var mode => throw new SwarmUserErrorException($"aspweb_mode value of '{mode}' is not valid")
        };
        Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", environment);
        string host = GetCommandLineFlag("host", ServerSettings.Network.Host);
        int port = int.Parse(GetCommandLineFlag("port", $"{ServerSettings.Network.Port}"));
        if (CommonlyUsedPorts.Contains(port))
        {
            Logs.Warning($"Port {port} looks like a port commonly used by other programs. You may want to change it.");
        }
        if (ServerSettings.Network.PortCanChange)
        {
            int origPort = port;
            while (Utilities.IsPortTaken(port))
            {
                port++;
            }
            if (origPort != port)
            {
                Logs.Init($"Port {origPort} was taken, using {port} instead.");
            }
        }
        WebServer.SetHost(host, port);
        NetworkBackendUtils.NextPort = ServerSettings.Network.BackendStartingPort;
        if (ServerSettings.Network.BackendPortRandomize)
        {
            NetworkBackendUtils.NextPort += Random.Shared.Next(2000);
        }
        if (NetworkBackendUtils.NextPort < 1000)
        {
              Logs.Warning($"BackendStartingPort setting {NetworkBackendUtils.NextPort} is a low-range value (below 1000), which may cause it to conflict with the OS or other programs. You may want to change it.");
        }
        WebServer.LogLevel = Enum.Parse<LogLevel>(GetCommandLineFlag("asp_loglevel", "warning"), true);
        SessionHandler.LocalUserID = GetCommandLineFlag("user_id", SessionHandler.LocalUserID);
        LockSettings = GetCommandLineFlagAsBool("lock_settings", false);
        if (CommandLineFlags.ContainsKey("ngrok-path"))
        {
            ProxyHandler = new()
            {
                Name = "Ngrok",
                Path = GetCommandLineFlag("ngrok-path", null),
                Region = GetCommandLineFlag("proxy-region", null),
                BasicAuth = GetCommandLineFlag("ngrok-basic-auth", null),
                Args = GetCommandLineFlag("proxy-added-args", ".")[1..].Split(' ', StringSplitOptions.RemoveEmptyEntries)
            };
        }
        string cloudflared = ServerSettings.Network.CloudflaredPath;
        if (CommandLineFlags.ContainsKey("cloudflared-path") || !string.IsNullOrWhiteSpace(cloudflared))
        {
            ProxyHandler = new()
            {
                Name = "Cloudflare",
                Path = GetCommandLineFlag("cloudflared-path", cloudflared).Trim('"'),
                Region = GetCommandLineFlag("proxy-region", null),
                Args = GetCommandLineFlag("proxy-added-args", ".")[1..].Split(' ', StringSplitOptions.RemoveEmptyEntries)
            };
        }
        LaunchMode = GetCommandLineFlag("launch_mode", ServerSettings.LaunchMode);
    }

    /// <summary>Applies runtime-changable settings.</summary>
    public static void ReapplySettings()
    {
        Logs.MinimumLevel = Enum.Parse<Logs.LogLevel>(GetCommandLineFlag("loglevel", ServerSettings.Logs.LogLevel), true);
        Logs.RepeatTimestampAfter = TimeSpan.FromMinutes(ServerSettings.Logs.RepeatTimestampAfterMinutes);
    }
    #endregion

    #region command line
    /// <summary>Parses command line argument inputs and splits them into <see cref="CommandLineFlags"/> and <see cref="CommandLineValueFlags"/>.</summary>
    public static void ParseCommandLineArgs(string[] args)
    {
        for (int i = 0; i < args.Length; i++)
        {
            string arg = args[i];
            if (!arg.StartsWith("--"))
            {
                throw new SwarmUserErrorException($"Error: Unknown command line argument '{arg}'");
            }
            string key = arg[2..].ToLower();
            string value;
            int equalsCharIndex = key.IndexOf('=');
            if (equalsCharIndex != -1)
            {
                if (equalsCharIndex == 0 || equalsCharIndex == (key.Length - 1))
                {
                    throw new SwarmUserErrorException($"Error: Invalid commandline argument '{arg}'");
                }
                value = key[(equalsCharIndex + 1)..];
                key = key[..equalsCharIndex];
            }
            else
            {
                if (i + 1 < args.Length && !args[i + 1].StartsWith("--"))
                {
                    value = args[++i];
                }
                else
                {
                    value = "true";
                }
            }
            if (CommandLineFlags.ContainsKey(key))
            {
                throw new SwarmUserErrorException($"Error: Duplicate command line flag '{key}'");
            }
            CommandLineFlags[key] = value;
        }
    }

    /// <summary>Command line value-flags are contained here. Flags without value contain string 'true'. Don't read this directly, use <see cref="GetCommandLineFlag(string, string)"/>.</summary>
    public static Dictionary<string, string> CommandLineFlags = [];

    /// <summary>Helper to identify when command line flags go unused.</summary>
    public static HashSet<string> CommandLineFlagsRead = [];

    /// <summary>Get the command line flag for a given name, and default value.</summary>
    public static string GetCommandLineFlag(string key, string def)
    {
        CommandLineFlagsRead.Add(key);
        if (CommandLineFlags.TryGetValue(key, out string value))
        {
            return value;
        }
        if (key.Contains('_'))
        {
            return GetCommandLineFlag(key.Replace("_", ""), def);
        }
        return def;
    }

    /// <summary>Gets the command line flag for the given key as a boolean.</summary>
    public static bool GetCommandLineFlagAsBool(string key, bool def)
    {
        return GetCommandLineFlag(key, def.ToString()).ToLowerFast() switch
        {
            "true" or "yes" or "1" => true,
            "false" or "no" or "0" => false,
            var mode => throw new SwarmUserErrorException($"Command line flag '{key}' value of '{mode}' is not valid")
        };
    }

    /// <summary>Prints a CLI usage help message, for when CLI args were wrong.</summary>
    public static void PrintCommandLineHelp()
    {
        Console.WriteLine($"""
            SwarmUI v{Utilities.Version}

            Options:
              [--data_dir <path>] [--settings_file <path>] [--backends_file <path>] [--environment <Production/Development>]
              [--host <hostname>] [--port <port>] [--asp_loglevel <level>] [--loglevel <level>]
              [--user_id <username>] [--lock_settings <true/false>] [--ngrok-path <path>] [--cloudflared-path <path>]
              [--proxy-region <region>] [--ngrok-basic-auth <auth-info>] [--launch_mode <mode>] [--help <true/false>]

            Generally, CLI args are almost never used. When they are are, they usually fall into the following categories:
              - `settings_file`, `lock_settings`, `backends_file`, `loglevel` may be useful to advanced users will multiple instances.
              - `cloudflared-path` is useful for remote tunnel users (eg colab).
              - `host`, `port`, and `launch_mode` may be useful in developmental usages where you need to quickly or automatically change network paths.

            Additional documentation about the CLI args is available online: <https://github.com/mcmonkeyprojects/SwarmUI/blob/master/docs/Command%20Line%20Arguments.md> or in the `docs/` folder of this repo.

            Find more information about SwarmUI in the GitHub readme and docs folder:
              - Project Github: <https://github.com/mcmonkeyprojects/SwarmUI>
              - Documentation: <https://github.com/mcmonkeyprojects/SwarmUI/tree/master/docs>
              - Feature Announcements: <https://github.com/mcmonkeyprojects/SwarmUI/discussions/1>
              - License (MIT): <https://github.com/mcmonkeyprojects/SwarmUI/blob/master/LICENSE.txt>

            Join the Discord <https://discord.gg/q2y38cqjNw> to discuss the project, get support, see announcements, etc.
            """);
    }
    #endregion
}

```

**K:\.ai_local\SwarmUI\src\Core\WebServer.cs**

```
﻿using FreneticUtilities.FreneticExtensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;
using SwarmUI.Accounts;
using SwarmUI.Text2Image;
using SwarmUI.Utils;
using SwarmUI.WebAPI;
using System.IO;
using System.Net;

namespace SwarmUI.Core;

/// <summary>Core handler for the web-server (mid-layer & front-end).</summary>
public class WebServer
{
    /// <summary>Primary core ASP.NET <see cref="WebApplication"/> reference.</summary>
    public static WebApplication WebApp;

    /// <summary>The internal web host url base this webserver is using.</summary>
    public static string Host;

    /// <summary>The internal web host port this webserver is using.</summary>
    public static int Port;

    /// <summary>Changes the server host:port path.</summary>
    public static void SetHost(string host, int port)
    {
        Host = host;
        Port = port;
        Environment.SetEnvironmentVariable("ASPNETCORE_URLS", HostURL);
    }

    /// <summary>The internal web host url this webserver is using.</summary>
    public static string HostURL => $"http://{Host}:{Port}";

    /// <summary>A browsable page to this server.</summary>
    public static string PageURL => $"http://{(Host == "*" || Host == "0.0.0.0" ? "localhost" : Host)}:{Port}";

    /// <summary>Minimum ASP.NET Log Level.</summary>
    public static LogLevel LogLevel;

    /// <summary>Like a <see cref="Lazy{T}"/>, but lets you dynamically re-call the getter if you need to.</summary>
    public class LazyOrReusable<T>(Func<T> getter)
    {
        public Func<T> Getter = getter;

        public T Value;

        public T GetLazy()
        {
            if (Value is null)
            {
                lock (this)
                {
                    Value ??= Getter();
                }
            }
            return Value;
        }
    }

    /// <summary>Extra file content added by extensions.</summary>
    public Dictionary<string, LazyOrReusable<string>> ExtensionSharedFiles = [];

    /// <summary>Extra binary file content added by extensions.</summary>
    public Dictionary<string, LazyOrReusable<byte[]>> ExtensionAssets = [];

    /// <summary>Extra content for the page header. Automatically set based on extensions.</summary>
    public static HtmlString PageHeaderExtra = new("");

    /// <summary>Extra content for the page footer. Automatically set based on extensions.</summary>
    public static HtmlString PageFooterExtra = new("");

    /// <summary>Extra content for the Text2Image page's tab list. Automatically set based on extensions.</summary>
    public static HtmlString T2ITabHeader = new("");

    /// <summary>Extra content for the Text2Image page's tab bodies. Automatically set based on extensions.</summary>
    public static HtmlString T2ITabBody = new("");

    /// <summary>Set of registered Theme IDs.</summary>
    public Dictionary<string, ThemeData> RegisteredThemes = [];

    /// <summary>Data about a theme.</summary>
    /// <param name="ID">The registered theme ID.</param>
    /// <param name="Name">The clear name to display to users.</param>
    /// <param name="CSSPaths">The web request path for CSS files for this theme.</param>
    /// <param name="IsDark">True if the theme is dark, false if light.</param>
    public record class ThemeData(string ID, string Name, string[] CSSPaths, bool IsDark) { }

    /// <summary>Register a theme.</summary>
    public void RegisterTheme(ThemeData theme)
    {
        RegisteredThemes.Add(theme.ID, theme);
    }

    /// <summary>Register a theme from an extension.</summary>
    public void RegisterTheme(string id, string name, string extFile, Extension extension, bool isDark)
    {
        RegisterTheme(new(id, name, [$"ExtensionFile/{extension.ExtensionName}/{extFile}"], isDark));
    }

    /// <summary>Initial prep, called by <see cref="Program"/>, generally should not be touched externally.</summary>
    public void PreInit()
    {
        RegisteredThemes.Clear();
        RegisterTheme(new("modern_dark", "Modern Dark", ["css/themes/modern.css", "css/themes/modern_dark.css"], true));
        RegisterTheme(new("modern_light", "Modern Light", ["css/themes/modern.css", "css/themes/modern_light.css"], false));
        RegisterTheme(new("solarized", "Solarized Light", ["css/themes/modern.css", "css/themes/solarized.css"], false));
        RegisterTheme(new("dark_dreams", "Dark Dreams (Legacy)", ["css/themes/dark_dreams.css"], true));
        RegisterTheme(new("gravity_blue", "Gravity Blue (Legacy)", ["css/themes/gravity_blue.css"], true));
        RegisterTheme(new("cyber_swarm", "Cyber Swarm (Legacy)", ["css/themes/cyber_swarm.css"], true));
        RegisterTheme(new("punked", "Punked (Legacy)", ["css/themes/punked.css"], true));
        RegisterTheme(new("eyesear_white", "Eyesear White (Legacy)", ["css/themes/eyesear_white.css"], false));
        RegisterTheme(new("swarmpunk", "Swarm Punk", ["css/themes/modern.css", "css/themes/swarmpunk.css"], true));
        RegisterTheme(new("beweish", "Beweish", ["css/themes/modern.css", "css/themes/beweish.css"], true));
        RegisterTheme(new("custom-theme", "Synthwave", ["css/themes/custom-theme.css"], true));
        RegisterTheme(new("midnight-dystopia", "Midnight Dystopia", ["css/themes/midnight-dystopia.css"], true));
        RegisterTheme(new("cyber-noir", "Cyber Noir", ["css/themes/cyber-noir.css"], true));
        RegisterTheme(new("sentinel", "Sentinel", ["css/themes/sentinel.css"], true));
        RegisterTheme(new("terminal-shock", "Terminal Shock", ["css/themes/terminal-shock.css"], true));
    }

    /// <summary>Main prep, called by <see cref="Program"/>, generally should not be touched externally.</summary>
    public void Prep()
    {
        Utilities.LoadTimer timer = new();
        // I don't know who's to blame, probably half Microsoft half AWS, but if this is enabled (which it is by default on all profiles, even production?!),
        // it creates a persistent filewatcher which locks up hard. So, forcibly disable it. Which it should be disabled anyway. Obviously.
        Environment.SetEnvironmentVariable("ASPNETCORE_hostBuilder:reloadConfigOnChange", "false");
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions() { WebRootPath = "src/wwwroot" });
        builder.WebHost.ConfigureKestrel(options =>
        {
            options.Limits.MaxRequestHeadersTotalSize = 1024 * 1024;
            options.Limits.MaxRequestHeaderCount = 200;
        });
        timer.Check("[Web] WebApp builder prep");
        builder.Services.AddRazorPages();
        builder.Services.AddResponseCompression();
        builder.Logging.SetMinimumLevel(LogLevel);
        WebApp = builder.Build();
        WebApp.Use(async (context, next) =>
        {
            if (context.Request.Headers.Host.Any() && context.Request.Headers.Origin.Any())
            {
                string host = context.Request.Headers.Host[0].ToLowerFast();
                string origin = context.Request.Headers.Origin[0].ToLowerFast();
                Uri uri = new(origin);
                string originMain = uri.Authority.ToLowerFast();
                if (host != originMain)
                {
                    // TODO: Instate this check fully only after comfy's version is stable.
                    // Swarm doesn't technically need it (as we have session token checks) but still better to validate
                    /*
                    context.Response.StatusCode = 403;
                    await context.Response.WriteAsync("Forbidden");
                    return;
                    */
                }
            }
            if (!string.IsNullOrWhiteSpace(Program.ServerSettings.Network.AccessControlAllowOrigin))
            {
                context.Response.Headers.AccessControlAllowOrigin = Program.ServerSettings.Network.AccessControlAllowOrigin;
                if (context.Request.Method == "OPTIONS")
                {
                    context.Response.Headers.AccessControlAllowMethods = "*";
                    context.Response.Headers.AccessControlAllowHeaders = "*";
                    context.Response.Headers.AccessControlMaxAge = "3600";
                    context.Response.StatusCode = 204;
                    return;
                }
            }
            string authKey = Program.ServerSettings.Network.RequiredAuthorization;
            if (!string.IsNullOrWhiteSpace(authKey))
            {
                string authHeader = context.Request.Headers.Authorization.FirstOrDefault();
                if (authHeader != authKey)
                {
                    IPAddress addr = context.Connection.RemoteIpAddress;
                    string remoteIp = addr.ToString();
                    if (addr.IsIPv4MappedToIPv6)
                    {
                        remoteIp = addr.MapToIPv4().ToString();
                    }
                    if (!Program.ServerSettings.Network.AuthBypassIPs.SplitFast(',').Contains(remoteIp))
                    {
                        if (string.IsNullOrWhiteSpace(authHeader))
                        {
                            Logs.Debug($"Unauthorized request from {remoteIp} (no auth header)");
                        }
                        else
                        {
                            Logs.Debug($"Unauthorized request from {remoteIp} (auth header len {authHeader.Length}, expected {authKey.Length})");
                        }
                        context.Response.StatusCode = 401;
                        await context.Response.WriteAsync("Unauthorized");
                        return;
                    }
                }
            }
            await next();
        });
        WebApp.UseResponseCompression();
        timer.Check("[Web] WebApp build");
        if (WebApp.Environment.IsDevelopment())
        {
            Utilities.VaryID += ".DEV" + ((DateTimeOffset.UtcNow.ToUnixTimeSeconds() / 10L) % 1000000L);
            WebApp.UseDeveloperExceptionPage();
        }
        else
        {
            WebApp.UseExceptionHandler("/Error/Internal");
        }
        timer.Check("[Web] exception handler");
        if (Program.ProxyHandler is not null)
        {
            WebApp.Lifetime.ApplicationStarted.Register(Program.ProxyHandler.Start);
        }
        WebApp.Lifetime.ApplicationStopping.Register(() => Program.Shutdown());
        timer.Check("[Web] StartStop handler");
        WebApp.UseStaticFiles(new StaticFileOptions());
        timer.Check("[Web] static files");
        WebApp.Use(async (context, next) =>
        {
            string referrer = (context.Request.Headers.Referer.FirstOrDefault() ?? "").After("://").After('/').ToLowerFast();
            string path = context.Request.Path.Value.ToLowerFast();
            if (referrer.StartsWith("comfybackenddirect/") && !path.StartsWith("/comfybackenddirect/"))
            {
                Logs.Debug($"ComfyBackendDirect call via Referrer '{referrer}' was misrouted, rerouting to 'ComfyBackendDirect{context.Request.Path}'");
                context.Response.StatusCode = StatusCodes.Status307TemporaryRedirect;
                context.Response.Headers.Location = $"/ComfyBackendDirect{context.Request.Path}";
                return;
            }
            else if (path.StartsWith("/assets/"))
            {
                Logs.Debug($"ComfyBackendDirect assets call was misrouted and improperly referrered, rerouting to '{context.Request.Path}'");
                context.Response.StatusCode = StatusCodes.Status307TemporaryRedirect;
                context.Response.Headers.Location = $"/ComfyBackendDirect{context.Request.Path}";
                return;
            }
            if (Program.ServerSettings.Network.EnableSpecialDevForwarding)
            {
                if (path.StartsWith("/node_modules/") || path.StartsWith("/@") || path.StartsWith("/src/"))
                {
                    Logs.Debug($"ComfyBackendDirect node frontend call was misrouted and improperly referrered, rerouting to '{context.Request.Path}'");
                    context.Request.Path = $"/ComfyBackendDirect{context.Request.Path}";
                }
                else if ((path.EndsWith(".vue") || path.EndsWith(".ts")) && !path.StartsWith("/comfybackenddirect/"))
                {
                    Logs.Debug($"ComfyBackendDirect frontend related file ext call was misrouted and improperly referrered, rerouting to '{context.Request.Path}'");
                    context.Request.Path = $"/ComfyBackendDirect{context.Request.Path}";
                }
                else if (context.Request.Headers.SecWebSocketProtocol.FirstOrDefault() == "vite-hmr")
                {
                    Logs.Debug($"ComfyBackendDirect frontend related Vite HMR call was misrouted and improperly referrered, forwarding to '{context.Request.Path}'");
                    context.Request.Path = $"/ComfyBackendDirect{context.Request.Path}";
                }
            }
            await next();
        });
        WebApp.UseRouting();
        WebApp.UseWebSockets(new WebSocketOptions() { KeepAliveInterval = TimeSpan.FromSeconds(30) });
        WebApp.MapRazorPages();
        timer.Check("[Web] core use calls");
        WebApp.MapGet("/", () => Results.Redirect("Text2Image"));
        WebApp.Map("/API/{*Call}", API.HandleAsyncRequest);
        WebApp.MapGet("/Output/{*Path}", ViewOutput);
        WebApp.MapGet("/View/{*Path}", ViewOutput);
        WebApp.MapGet("/ViewSpecial/{*Path}", ViewSpecial);
        WebApp.MapGet("/ExtensionFile/{*f}", ViewExtensionScript);
        WebApp.MapGet("/Audio/{*f}", ViewAudio);
        timer.Check("[Web] core maps");
        WebApp.Use(async (context, next) =>
        {
            await next();
            if (context.Response.StatusCode == 404)
            {
                if (context.Response.HasStarted)
                {
                    return;
                }
                string path = context.Request.Path.Value.ToLowerFast();
                if (!path.StartsWith("/error/"))
                {
                    try
                    {
                        context.Response.Redirect("/Error/404");
                        return;
                    }
                    catch (Exception)
                    {
                        Logs.Debug($"Connection to {context.Request.Path} failed and cannot be repaired");
                    }
                    await next();
                }
            }
        });
        Logs.Init("Scan for web extensions...");
        GatherExtensionPageAdditions();
        timer.Check("[Web] end");
    }

    public void GatherExtensionPageAdditions()
    {
        StringBuilder scripts = new(), stylesheets = new(), tabHeader = new(), tabFooter = new();
        ExtensionSharedFiles.Clear();
        ExtensionAssets.Clear();
        Program.Extensions.RunOnAllExtensions(e =>
        {
            foreach (string script in e.ScriptFiles)
            {
                string fname = $"ExtensionFile/{e.ExtensionName}/{script}";
                ExtensionSharedFiles.Add(fname, new (() => File.ReadAllText($"{e.FilePath}{script}")));
                scripts.Append($"<script src=\"{fname}?vary={Utilities.VaryID}\"></script>\n");
            }
            foreach (string css in e.StyleSheetFiles)
            {
                string fname = $"ExtensionFile/{e.ExtensionName}/{css}";
                ExtensionSharedFiles.Add(fname, new (() => File.ReadAllText($"{e.FilePath}{css}")));
                stylesheets.Append($"<link rel=\"stylesheet\" href=\"{fname}?vary={Utilities.VaryID}\" />");
            }
            foreach (string file in e.OtherAssets)
            {
                string fname = $"ExtensionFile/{e.ExtensionName}/{file}";
                string toRead = $"{e.FilePath}{file}";
                ExtensionAssets.Add(fname, new(() => File.ReadAllBytes(toRead)));
            }
            if (Directory.Exists($"{e.FilePath}/Tabs/Text2Image/"))
            {
                foreach (string file in Directory.EnumerateFiles($"{e.FilePath}/Tabs/Text2Image/", "*.html"))
                {
                    string simpleName = file.AfterLast('/').BeforeLast('.');
                    string id = T2IParamTypes.CleanTypeName(simpleName);
                    string content = File.ReadAllText(file);
                    string perm = $"view_extension_tab_{id}";
                    if (!Permissions.Registered.ContainsKey(perm))
                    {
                        Permissions.Register(new(perm, $"View Extension Tab {simpleName}", $"Allows access to the {simpleName} extension tab on the main page.", PermissionDefault.USER, Permissions.GroupExtensionTabs));
                    }
                    tabHeader.Append($"<li class=\"nav-item\" role=\"presentation\" data-requiredpermission=\"{perm}\"><a class=\"nav-link translate\" id=\"maintab_{id}\" data-bs-toggle=\"tab\" href=\"#{id}\" aria-selected=\"false\" tabindex=\"-1\" role=\"tab\">{simpleName}</a></li>\n");
                    tabFooter.Append($"<div class=\"tab-pane tab-pane-vw\" id=\"{id}\" role=\"tabpanel\">\n{content}\n</div>\n");
                }
            }
        });
        PageHeaderExtra = new(stylesheets.ToString());
        PageFooterExtra = new(scripts.ToString());
        T2ITabHeader = new(tabHeader.ToString());
        T2ITabBody = new(tabFooter.ToString());
    }

    /// <summary>Called by <see cref="Program"/>, generally should not be touched externally.</summary>
    public void Launch(bool canRetry = true)
    {
        Logs.Init($"Starting webserver on {HostURL}");
        try
        {
            WebApp.Start();
        }
        catch (Exception ex)
        {
            Logs.Error($"Error starting webserver: {ex.ReadableString()}");
            if (canRetry && ex is InvalidOperationException && ex.Message.StartsWith("A path base can only be configured"))
            {
                Logs.Error("\n\n");
                Logs.Error("Your 'Host' value in settings is wrong. Will retry with 'localhost'.");
                Logs.Error("If this launches as intended, you need to update your 'Host' setting to be a proper value.");
                Logs.Error("\n\n");
                SetHost("localhost", Port);
                Prep();
                Launch(false);
            }
            else
            {
                throw;
            }
        }
    }

    /// <summary>Test the validity of a user-given file path. Returns (path, consoleError, userError).</summary>
    public static (string, string, string) CheckFilePath(string root, string path)
    {
        path = path.Replace('\\', '/').Replace("%20", " ");
        path = Utilities.FilePathForbidden.TrimToNonMatches(path);
        while (path.Contains(".."))
        {
            path = path.Replace("..", "");
        }
        root = root.Replace('\\', '/');
        path = $"{root}/{path.Trim()}";
        while (path.Contains("//"))
        {
            path = path.Replace("//", "/");
        }
        if (!Directory.GetParent(path).FullName.Replace('\\', '/').StartsWith(root))
        {
            return (null, $"Refusing dangerous access, got path '{path}' which resolves to '{Directory.GetParent(path)}' which does not obey expected root '{root}'",
                "Unacceptable path. If you are the server owner, check program console log.");
        }
        if (path.EndsWith('/'))
        {
            path = path[..^1];
        }
        return (path, null, null);
    }

    /// <summary>Web route for scripts from extensions.</summary>
    public async Task ViewExtensionScript(HttpContext context)
    {
        string requested = context.Request.Path.Value[1..];
        if (ExtensionSharedFiles.TryGetValue(requested, out LazyOrReusable<string> script))
        {
            context.Response.ContentType = Utilities.GuessContentType(requested);
            context.Response.StatusCode = 200;
#if DEBUG
            await context.Response.WriteAsync(script.Getter());
#else
            await context.Response.WriteAsync(script.GetLazy());
#endif
        }
        else if (ExtensionAssets.TryGetValue(requested, out LazyOrReusable<byte[]> data))
        {
            context.Response.ContentType = Utilities.GuessContentType(requested);
            context.Response.StatusCode = 200;
#if DEBUG
            await context.Response.Body.WriteAsync(data.Getter());
#else
            await context.Response.Body.WriteAsync(data.GetLazy());
#endif
        }
        else
        {
            context.Response.StatusCode = 404;
            Logs.Verbose($"Giving 404 for extension file request '{requested}'");
            await context.Response.WriteAsync("404, file not found.");
        }
        await context.Response.CompleteAsync();
    }

    /// <summary>Web route for audio files.</summary>
    public async Task ViewAudio(HttpContext context)
    {
        if (GetUserFor(context) is null)
        {
            await context.YieldJsonOutput(null, 400, Utilities.ErrorObj("invalid or unauthorized", "invalid_user"));
            return;
        }
        string path = context.Request.Path.ToString().After("/Audio/");
        path = Uri.UnescapeDataString(path).Replace('\\', '/');
        string root = Utilities.CombinePathWithAbsolute(Environment.CurrentDirectory, Program.DataDir, "Audio");
        (path, string consoleError, string userError) = CheckFilePath(root, path);
        if (consoleError is not null)
        {
            Logs.Error(consoleError);
            await context.YieldJsonOutput(null, 400, Utilities.ErrorObj(userError, "bad_path"));
            return;
        }
        byte[] data;
        try
        {
            data = await File.ReadAllBytesAsync(path);
        }
        catch (Exception ex)
        {
            if (ex is FileNotFoundException || ex is DirectoryNotFoundException || ex is PathTooLongException)
            {
                Logs.Verbose($"File-not-found error reading audio file '{path}': {ex.ReadableString()}");
                await context.YieldJsonOutput(null, 404, Utilities.ErrorObj("404, file not found", "file_not_found"));
            }
            else
            {
                Logs.Error($"Failed to read output file '{path}': {ex.ReadableString()}");
                await context.YieldJsonOutput(null, 500, Utilities.ErrorObj("Error reading file. If you are the server owner, check program console log.", "file_error"));
            }
            return;
        }
        context.Response.ContentType = Utilities.GuessContentType(path);
        context.Response.StatusCode = 200;
        context.Response.ContentLength = data.Length;
        await context.Response.Body.WriteAsync(data, Program.GlobalProgramCancel);
        await context.Response.CompleteAsync();
    }

    public static User GetUserFor(HttpContext context)
    {
        if (Program.ServerSettings.UserAuthorization.AuthorizationRequired)
        {
            return WebUtil.GetValidLogin(context);
        }
        string id = SessionHandler.LocalUserID;
        if (context.Request.Headers.TryGetValue("X-SWARM-USER_ID", out StringValues user_id))
        {
            id = user_id[0];
        }
        return id is null ? null : Program.Sessions.GetUser(id);
    }

    /// <summary>Web route for viewing output images.</summary>
    public async Task ViewOutput(HttpContext context)
    {
        string path = context.Request.Path.ToString();
        bool isExact = false;
        if (path.StartsWith("/View/"))
        {
            path = path.After("/View/");
            isExact = true;
        }
        else if (path.StartsWith("/Output/"))
        {
            path = path.After("/Output/");
        }
        else
        {
            await context.YieldJsonOutput(null, 400, Utilities.ErrorObj("view output path prefix does not make sense", "bad_path"));
            return;
        }
        path = Uri.UnescapeDataString(path).Replace('\\', '/');
        User user = GetUserFor(context);
        if (user is null)
        {
            await context.YieldJsonOutput(null, 400, Utilities.ErrorObj("invalid or unauthorized", "invalid_user"));
            return;
        }
        string root = Utilities.CombinePathWithAbsolute(Environment.CurrentDirectory, Program.ServerSettings.Paths.OutputPath);
        if (Program.ServerSettings.Paths.AppendUserNameToOutputPath)
        {
            if (isExact)
            {
                (string forUser, string newPath) = path.BeforeAndAfter('/');
                if (forUser != user.UserID && !user.HasPermission(Permissions.ViewOthersOutputs))
                {
                    await context.YieldJsonOutput(null, 400, Utilities.ErrorObj("unauthorized - you may not view other users' outputs", "unauthorized"));
                    return;
                }
                root = $"{root}/{forUser}";
                path = newPath;
            }
            else
            {
                root = $"{root}/{user.UserID}";
            }
        }
        (path, string consoleError, string userError) = CheckFilePath(root, path);
        if (consoleError is not null)
        {
            Logs.Error(consoleError);
            await context.YieldJsonOutput(null, 400, Utilities.ErrorObj(userError, "bad_path"));
            return;
        }
        byte[] data = null;
        string contentType = Utilities.GuessContentType(path);
        try
        {
            if (context.Request.Query.TryGetValue("preview", out StringValues previewToken) && $"{previewToken}" == "true" && user.Settings.ImageHistoryUsePreviews)
            {
                ImageMetadataTracker.ImagePreviewEntry entry = ImageMetadataTracker.GetOrCreatePreviewFor(path);
                if (entry is not null)
                {
                    data = entry.PreviewData;
                    contentType = "image/jpg";
                    if (entry.SimplifiedData is not null)
                    {
                        contentType = "image/webp";
                        if (!Program.ServerSettings.UI.AllowAnimatedPreviews || (context.Request.Query.TryGetValue("noanim", out StringValues noanimToken) && $"{noanimToken}" == "true"))
                        {
                            data = entry.SimplifiedData;
                            contentType = "image/jpg";
                        }
                    }
                }
            }
            string pathNorm = Path.GetFullPath(path);
            if (data is null && Session.StillSavingFiles.TryGetValue(pathNorm, out Task<byte[]> cacheData))
            {
                data = await cacheData;
            }
            data ??= await File.ReadAllBytesAsync(path);
        }
        catch (Exception ex)
        {
            if (ex is FileNotFoundException || ex is DirectoryNotFoundException || ex is PathTooLongException)
            {
                Logs.Verbose($"File-not-found error reading output file '{path}': {ex.ReadableString()}");
                await context.YieldJsonOutput(null, 404, Utilities.ErrorObj("404, file not found.", "file_not_found"));
            }
            else
            {
                Logs.Error($"Failed to read output file '{path}': {ex.ReadableString()}");
                await context.YieldJsonOutput(null, 500, Utilities.ErrorObj("Error reading file. If you are the server owner, check program console log.", "file_error"));
            }
            return;
        }
        context.Response.ContentType = contentType;
        context.Response.StatusCode = 200;
        context.Response.ContentLength = data.Length;
        if (contentType.StartsWith("application/") || contentType.StartsWith("text/"))
        {
            context.Response.Headers.CacheControl = "private, max-age=2";
        }
        else
        {
            context.Response.Headers.CacheControl = $"private, max-age={Program.ServerSettings.Network.OutputCacheSeconds}";
        }
        await context.Response.Body.WriteAsync(data, Program.GlobalProgramCancel);
        await context.Response.CompleteAsync();
    }

    /// <summary>Web route for viewing special images (eg model icons).</summary>
    public async Task ViewSpecial(HttpContext context)
    {
        string path = context.Request.Path.ToString();
        path = Uri.UnescapeDataString(path).Replace('\\', '/').Trim('/');
        while (path.Contains("//"))
        {
            path = path.Replace("//", "/");
        }
        (string subtype, string name) = path.After("ViewSpecial/").BeforeAndAfter('/');
        User user = GetUserFor(context);
        if (user is null)
        {
            await context.YieldJsonOutput(null, 400, Utilities.ErrorObj("invalid or unauthorized", "invalid_user"));
            return;
        }
        async Task yieldResult(string imageData)
        {
            Image img = Image.FromDataString(imageData);
            context.Response.ContentType = img.MimeType();
            context.Response.StatusCode = 200;
            context.Response.ContentLength = img.ImageData.Length;
            context.Response.Headers.CacheControl = $"private, max-age=2";
            await context.Response.Body.WriteAsync(img.ImageData, Program.GlobalProgramCancel);
            await context.Response.CompleteAsync();
        }
        if (!user.IsAllowedModel(name))
        {
            Logs.Verbose($"Not showing user '{user.UserID}' sub-type '{subtype}' model image '{name}': user restriction");
        }
        else
        {
            if (subtype == "Wildcards")
            {
                WildcardsHelper.Wildcard card = WildcardsHelper.GetWildcard(name);
                if (card is not null && card.Image.StartsWithFast("data:"))
                {
                    await yieldResult(card.Image);
                    return;
                }
            }
            if (Program.T2IModelSets.TryGetValue(subtype, out T2IModelHandler handler))
            {
                if (handler.Models.TryGetValue(name + ".safetensors", out T2IModel model) || handler.Models.TryGetValue(name, out model))
                {
                    if (model.Metadata?.PreviewImage?.StartsWithFast("data:") ?? false)
                    {
                        await yieldResult(model.Metadata.PreviewImage);
                        return;
                    }
                }
                else if (ModelsAPI.InternalExtraModels(subtype).TryGetValue(name + ".safetensors", out JObject remoteModel) || ModelsAPI.InternalExtraModels(subtype).TryGetValue(name, out remoteModel))
                {
                    if (remoteModel.TryGetValue("preview_image", out JToken previewImg) && previewImg.ToString().StartsWithFast("data:"))
                    {
                        await yieldResult(previewImg.ToString());
                        return;
                    }
                }
            }
            Logs.Verbose($"Not showing user '{user.UserID}' sub-type '{subtype}' model image '{name}': not found");
        }
        await context.YieldJsonOutput(null, 404, Utilities.ErrorObj("404, file not found.", "file_not_found"));
    }
}

```

Thanks — I scanned the repo to understand how the app is structured and how the core pages are built. Here’s a concise, code-informed review and concrete ways to improve UI/UX and the app overall.

What you have now

- Stack: ASP.NET Core Razor Pages (src/Pages), Bootstrap 5 via CDN, site-level JS in wwwroot/js, theming in wwwroot/css/themes, custom UI scripts under wwwroot/js/genpage.
- Entry/layout:
  - Pages/Shared/_Layout.cshtml provides the top navbar, a “Workspace” bar, an empty subnav strip, a status area, and global CSS/JS.
  - Text2Image.cshtml is the main screen with top-level tabs (Generate, Simple, Utilities, User, Server) and partials loaded via @await Html.PartialAsync.
- Theming: Several themes registered in WebServer.PreInit() and mapped to CSS in wwwroot/css/themes.
- JS: Heavy client logic in wwwroot/js/genpage/main.js and submodules (gentab, helpers, server). Much of the logic is global, event-driven, and controls status updates, installable features, tab behavior, and tools.
- Server: WebServer wires routes, static files, response compression, and razor pages. Security and proxy behaviors live here.

Strengths

- Clear separation of layout vs content: _Layout handles global shell while pages/partials provide content.
- Sensible modularity by feature area: genpage JS split by helpers, gentab, server, etc.
- Bootstrap 5 provides base responsive UI and interactive components.
- Themes are extensible and registered programmatically, making it easy to add more.

Key UI/UX opportunities
Prioritized quick wins (low risk, high impact)

1) Active state and navigation coherence

- Ensure top nav + workspace bar reflect the current tab consistently (visually and for screen readers).
  - Add active styles to the matching workspace buttons (ws_generate, etc.) when tabs change.
  - Populate the workspace_subnav_list with the current tab’s sub-tabs (you already have a strip reserved; mirror from in-page subnavs).
- Improve the navbar toggler icon visibility in dark mode. Bootstrap’s navbar-toggler-icon requires the appropriate .navbar-dark/.navbar-light or custom CSS variable to render clearly.

2) Status bar clarity and discoverability

- The status bar text is appended in the top header but can be subtle. Consider adding:
  - A small spinner when polling or when there are queued jobs.
  - A tooltip on hover to explain each count, or a click target opening a “Job details” modal.
  - Explicit aria-live polite region for users of screen readers to catch updates.

3) Error and success toasts

- You already have a toast container with “Error.” Add a “Success” toast and standardize usage across gen flows to give immediate, consistent feedback.

4) Loading states and disabled controls

- For long-running actions (install feature, refresh models, batch operations), show inline spinners and disable relevant buttons while the action is pending. You already do this in doFeatureInstaller; apply the same pattern to other heavy actions.

5) Model/preset discoverability

- In the model selector and preset browser:
  - Add a quick-search input with debounce to filter items by name/tags.
  - Add “starred” sorting/pin to top (you have starredModels already — surface it prominently).
  - Provide “last-used” and “recent” sections for fast recall.

6) Keyboard shortcuts and focus order

- Provide common shortcuts:
  - Enter to trigger Generate when focus is in prompt field.
  - Esc to close modals/popovers.
  - Alt+I to interrupt.
- After actions (save, install, apply), move focus to the most relevant next control to reduce pointer travel.

7) Persist basic UI state

- Persist active tab, chosen theme, and tool selections in localStorage and restore on reload. You’re already persisting note pad; extend it to active workspace and subnav.

Larger changes (incremental plan suggested)
8) Accessibility top-to-bottom pass

- Tabs and subnavs: Ensure aria-controls, aria-selected, role="tab", and role="tablist" are set and update on change (Bootstrap sets some, but verify).
- Add a “Skip to content” link and landmarks to the main content.
- Mark status updates with aria-live regions.

Example: add skip link in layout

```html
<a class="visually-hidden-focusable" href="#main">Skip to content</a>
```

Make main the target

```html path="/K:/.ai_local/SwarmUI/src/Pages/Shared/_Layout.cshtml" start=86 end=88
    <main id="main" role="main" class="container-fluid mt-3">
        @RenderBody()
    </main>
```

9) Performance and interactivity

- Defer non-critical scripts: move some genpage helpers to be loaded on demand per tab. main.js is quite large; consider splitting by tab and lazy-loading when a tab first activates.
- Throttle status polling adaptively: you already widen intervals based on activity; consider exponential backoff during idle.
- Virtualize large lists (history, models): use IntersectionObserver to lazy-render cards/images as they scroll into view.
- Preload critical assets:
  - Preload the primary theme CSS.
  - Preload fonts (Inter.woff2) and mark as display=swap.
- Consolidate CDN calls: You already have integrity on Bootstrap; add SRI to bootstrap-icons as well; add a local fallback if CDN fails.

10) Theming and design tokens

- Unify color and spacing tokens in :root and theme CSS. Many custom vars exist (e.g., status colors). Move “one-off” colors to semantic tokens and have themes override those, not individual components.
- Add a simple Theme Switcher in the header that persists and toggles data-bs-theme appropriately, and loads the theme CSS list (RegisteredThemes gives you the mapping).

11) Front-end architecture and typing

- Convert critical JS to ES modules with a namespace rather than globals. Even without a bundler, you can:
  - Use type-checking via JSDoc or small TypeScript compilation to wwwroot/js/dist.
  - Adopt an import map for library references or a minimal esbuild/Vite step only for JS (keeps Razor Pages but modernizes JS).
- Split main.js:
  - status.js: status bar polling and UI.
  - models.js: model list, filter, starred.
  - presets.js: sorting, apply, UI interactions.
  - tools.js: tool registration and overrides.
  - installer.js: feature installation flows.
This reduces coupling and makes “tab-only” lazy-loading straightforward.

12) Information architecture

- Flatten the mental model:
  - Workspace bar switches high-level domains (Generate/Simple/Comfy/Utilities/Settings/Server).
  - Subnav (header mirror) shows the currently active workspace’s subsections.
  - Ensure the on-page tab list matches these exactly and that URL hash fragments sync with selections so deep-links work consistently.

13) Internationalization

- You use translator.js; ensure:
  - All labels and placeholders have translation keys and default text.
  - Titles/tooltips also run through translate() and support newline tooltips (you already do).
  - Date/time/number formats respect locale.
- Add lang to html and allow user-selectable language with persistence.

```html path="/K:/.ai_local/SwarmUI/src/Pages/Shared/_Layout.cshtml" start=2 end=2
<html lang="en" data-bs-theme="dark">
```

Dynamically set lang based on user preference if available.

14) Security and headers

- CORS: You currently allow dynamic Access-Control-Allow-Origin if configured. Consider adding:
  - Content-Security-Policy with strict defaults (script-src 'self' cdn.jsdelivr.net; object-src 'none'; base-uri 'self'; frame-ancestors 'none').
  - Referrer-Policy, Strict-Transport-Security (when behind TLS), X-Content-Type-Options=nosniff.
- Auth: RequiredAuthorization compares the header string directly. Consider a more standard “Authorization: Bearer <token>” structure and short-lived tokens instead of static shared secrets. Rate-limit sensitive APIs.

15) Static assets caching

- You already version-query CSS/JS with vary=@Utilities.VaryID. Add long-lived cache headers on static files so browsers can cache aggressively.
- For images, add width/height attributes and use responsive img attributes (sizes/srcset) for better layout stability and LCP.

16) Server telemetry and UX feedback loop

- Add client-side timing for first interactive and job completion time, and log anonymized metrics (locally by default) so you can identify slow paths.
- Add a “Report Problem” button that prepopulates logs and key configuration details (without secrets) into a downloadable bundle.

Concrete code touchpoints

- Populate workspace subnav from the active tab set
  - Add small utility to read the on-page tablist for the active workspace and mirror anchors into #workspace_subnav_list, updating on tab change. Hide the in-content subnav strips (you already set display:none via .swarm-gen-tab-subnav).

- Improve aria-live status updates

```html
<div id="live_status" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>
```

In status updater:

```js
getRequiredElementById('live_status').textContent = translate(status.message);
```

- Add SRI and fallback for bootstrap-icons

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      integrity="{{computed_sri_hash}}"
      crossorigin="anonymous">
<noscript>
  <link rel="stylesheet" href="/css/bootstrap-icons.local.min.css">
</noscript>
```

- Defer/lazy-load non-critical scripts
  - Mark heavy scripts with defer and conditionally load helper bundles on tab activation:

```html
<script defer src="js/genpage/main.js?vary=@Utilities.VaryID"></script>
```

```js
function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src; s.defer = true;
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}
document.getElementById('servertabbutton')?.addEventListener('shown.bs.tab', async () => {
  await loadScriptOnce('js/genpage/server/servertab.js?vary=@Utilities.VaryID');
});
```

Suggested rollout plan

- Week 1: Quick wins
  - Active nav coherence (header/workspace/subnav).
  - Status bar polish and aria-live.
  - Success toast + standardize error toasts.
  - Persist active tab, theme, and tool selection.
  - Add keyboard shortcuts.

- Week 2–3: Performance and modular JS
  - Split main.js; lazy-load per tab; throttle polling more aggressively.
  - Virtualize heavy lists and lazy-load images.
  - Add preload hints for theme CSS and font(s).

- Week 3–4: Accessibility, theming, and security
  - Aria audit (tabs, roles, labels, focus order).
  - Theme token refactor and a persistent theme switcher.
  - Add CSP/referrer/HSTS headers (with a config flag).

- Ongoing: UX refinement
  - Model/preset discoverability: search, “starred,” “recent.”
  - Inline loading/disabled states for all heavy actions.
  - Optional: TypeScript or JSDoc-based typing and a light bundling pipeline.

Notable nits discovered in code

- site.css: --range-padding uses var(var(--range-track-height)) — likely a typo; should be var(--range-track-height). This can break custom range padding.
- _Layout.cshtml: Ensure the navbar-toggler-icon is visible in dark mode (it depends on CSS variables — consider adding .navbar-dark or CSS to set the icon color).
- main.js: Many globals and direct DOM queries in hot paths — refactor to memoize element lookups and isolate concerns to reduce reflow/repaint.

If you’d like, I can implement a first PR that:

- Fixes the CSS var typo and navbar toggler visibility.
- Adds a skip link, aria-live region, active workspace states, and success toast component.
- Introduces a tiny loader utility and lazy-load the server tab script.
