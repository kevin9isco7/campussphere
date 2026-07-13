# CampusSphere Android APK

This Android project is a native WebView wrapper for the deployed CampusSphere web application.

It does not rebuild or replace the existing stack. The app loads:

`https://campussphere-sigma.vercel.app/`

The launcher icon is generated from `hhh.png` / Kevin Tech Studios branding.

## Build locally

Requirements:

- Android SDK installed at `C:\Users\Kevin9isco7\AppData\Local\Android\Sdk`
- JDK 17+ with `javac.exe` available on `PATH`

1. Copy `local.properties.example` to `local.properties`.
2. Confirm `sdk.dir` points to your Android SDK.
3. Run the Gradle build if your JDK 17+ is configured:

```powershell
C:\Users\Kevin9isco7\.gradle\wrapper\dists\gradle-9.1.0-all\7wzd0jkjit61aq2p43wpjgij9\gradle-9.1.0\bin\gradle.bat -p mobile\android assembleDebug
```

If Gradle cannot run because Java is too old, use the direct Android SDK build:

```powershell
powershell -ExecutionPolicy Bypass -File mobile\android\build-apk.ps1
```

The APK will be created at:

`mobile/android/app/build/outputs/apk/debug/campussphere-debug.apk`
