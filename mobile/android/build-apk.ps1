$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$AppRoot = Join-Path $ProjectRoot "app"
$BuildRoot = Join-Path $AppRoot "build\manual"
$SdkRoot = "C:\Users\Kevin9isco7\AppData\Local\Android\Sdk"
$BuildTools = Join-Path $SdkRoot "build-tools\36.0.0"
$AndroidJar = Join-Path $SdkRoot "platforms\android-36\android.jar"
$Aapt2 = Join-Path $BuildTools "aapt2.exe"
$D8 = Join-Path $BuildTools "d8.bat"
$Zipalign = Join-Path $BuildTools "zipalign.exe"
$ApkSigner = Join-Path $BuildTools "apksigner.bat"
$Java8Home = "C:\Program Files (x86)\Java\jre1.8.0_251"
$JavacCommand = Get-Command javac.exe -ErrorAction SilentlyContinue
$Javac = if ($JavacCommand) { $JavacCommand.Source } else { "" }
$Keytool = Join-Path $Java8Home "bin\keytool.exe"
$Keystore = Join-Path $ProjectRoot "debug.keystore"

$CompiledResources = Join-Path $BuildRoot "compiled-resources.zip"
$GeneratedRoot = Join-Path $BuildRoot "generated"
$ClassesRoot = Join-Path $BuildRoot "classes"
$DexRoot = Join-Path $BuildRoot "dex"
$UnsignedApk = Join-Path $BuildRoot "campussphere-unsigned.apk"
$DexApk = Join-Path $BuildRoot "campussphere-dex.apk"
$AlignedApk = Join-Path $BuildRoot "campussphere-aligned.apk"
$OutputDir = Join-Path $AppRoot "build\outputs\apk\debug"
$OutputApk = Join-Path $OutputDir "campussphere-debug.apk"

Remove-Item $BuildRoot -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $BuildRoot, $GeneratedRoot, $ClassesRoot, $DexRoot, $OutputDir | Out-Null

if (!(Test-Path $Javac)) {
    throw "A JDK with javac.exe is required to build the APK. Install JDK 17+ and rerun this script."
}

function Invoke-AndroidTool {
    param(
        [Parameter(Mandatory = $true)][string]$Tool,
        [string[]]$Arguments
    )
    & $Tool @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed: $Tool $($Arguments -join ' ')"
    }
}

if (!(Test-Path $Keystore)) {
    Invoke-AndroidTool $Keytool @(
        "-genkeypair", "-v",
        "-keystore", $Keystore,
        "-storepass", "android",
        "-alias", "androiddebugkey",
        "-keypass", "android",
        "-keyalg", "RSA",
        "-keysize", "2048",
        "-validity", "10000",
        "-dname", "CN=Android Debug,O=Android,C=US"
    )
}

Invoke-AndroidTool $Aapt2 @("compile", "--dir", (Join-Path $AppRoot "src\main\res"), "-o", $CompiledResources)
Invoke-AndroidTool $Aapt2 @(
    "link",
    "-o", $UnsignedApk,
    "-I", $AndroidJar,
    "--manifest", (Join-Path $AppRoot "src\main\AndroidManifest.xml"),
    "--java", $GeneratedRoot,
    "--auto-add-overlay",
    $CompiledResources
)

$SourceFiles = @(
    (Join-Path $GeneratedRoot "com\campussphere\enterprise\R.java"),
    (Join-Path $AppRoot "src\main\java\com\campussphere\enterprise\MainActivity.java")
)

Invoke-AndroidTool $Javac @("-encoding", "UTF-8", "-source", "1.8", "-target", "1.8", "-bootclasspath", $AndroidJar, "-d", $ClassesRoot, $SourceFiles[0], $SourceFiles[1])
Invoke-AndroidTool $D8 @("--lib", $AndroidJar, "--min-api", "23", "--output", $DexRoot, $ClassesRoot)

Copy-Item $UnsignedApk $DexApk -Force
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($DexApk, [System.IO.Compression.ZipArchiveMode]::Update)
try {
    $existing = $zip.GetEntry("classes.dex")
    if ($existing) {
        $existing.Delete()
    }
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, (Join-Path $DexRoot "classes.dex"), "classes.dex") | Out-Null
} finally {
    $zip.Dispose()
}

Invoke-AndroidTool $Zipalign @("-f", "-p", "4", $DexApk, $AlignedApk)
Invoke-AndroidTool $ApkSigner @(
    "sign",
    "--ks", $Keystore,
    "--ks-pass", "pass:android",
    "--key-pass", "pass:android",
    "--out", $OutputApk,
    $AlignedApk
)

Invoke-AndroidTool $ApkSigner @("verify", $OutputApk)
Write-Host "APK built: $OutputApk"
