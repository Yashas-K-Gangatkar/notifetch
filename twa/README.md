# NotiFetch TWA — Android Wrapper

This directory contains the **Trusted Web Activity (TWA)** Android wrapper project for NotiFetch. It wraps the NotiFetch progressive web app at [https://d2-liart-nine.vercel.app](https://d2-liart-nine.vercel.app) into a native Android application for Google Play Store distribution.

## What is a TWA?

A Trusted Web Activity (TWA) is a Chrome-powered mechanism that allows a web app to run inside an Android app without any browser UI (address bar, navigation buttons). The web content is rendered by Chrome, but the user experience is indistinguishable from a native application.

## Prerequisites

- **Android SDK** (API level 34+)
- **Java Development Kit (JDK)** 17+
- **Node.js** 18+ (for Bubblewrap CLI)
- **Google Chrome** (for testing on device)

## Project Structure

```
twa/
├── twa-manifest.json          # Bubblewrap project configuration
├── build.gradle               # Root Gradle build file
├── settings.gradle             # Gradle project settings
├── gradle.properties           # Gradle configuration properties
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties
├── keystore.jks               # Signing keystore (generated, NOT in VCS)
├── app/
│   ├── build.gradle            # App module Gradle build
│   ├── proguard-rules.pro      # ProGuard optimization rules
│   └── src/main/
│       ├── AndroidManifest.xml # App manifest with TWA configuration
│       ├── java/com/notifetch/app/
│       │   └── LauncherActivity.kt  # TWA launcher activity
│       └── res/
│           ├── drawable/
│           │   └── splash_screen.xml  # Splash screen layout
│           ├── mipmap-*/            # App icons (per density)
│           ├── values/
│           │   ├── strings.xml      # String resources
│           │   ├── colors.xml       # Color resources
│           │   └── styles.xml       # Theme styles
│           └── xml/
│               └── shortcuts.xml    # App shortcuts
└── README.md                   # This file
```

## Building

### Option 1: Using the build script (recommended)

```bash
# From the project root
./scripts/generate-signing-key.sh   # First time only
./scripts/build-twa.sh
```

### Option 2: Manual Gradle build

```bash
cd twa

# Debug build
./gradlew assembleDebug

# Release AAB (requires keystore)
export NOTIFETCH_STORE_PASSWORD=your_store_password
export NOTIFETCH_KEY_PASSWORD=your_key_password
./gradlew bundleRelease
```

The output AAB will be at `app/build/outputs/bundle/release/app-release.aab`.

## Signing

The release build requires a keystore at `twa/keystore.jks`. Generate it using:

```bash
./scripts/generate-signing-key.sh
```

Environment variables for signing:
- `NOTIFETCH_STORE_PASSWORD` — Keystore password
- `NOTIFETCH_KEY_PASSWORD` — Key password

## Digital Asset Links

The file `public/.well-known/assetlinks.json` must be deployed to the web app domain with the correct SHA-256 fingerprint of the signing key. See `public/.well-known/README.md` for details.

## Play Store Submission

1. Generate the release AAB: `./scripts/build-twa.sh`
2. Upload `app-release.aab` to the Google Play Console
3. Complete the store listing using `play-store/listing.md`
4. If using Google Play App Signing, update `assetlinks.json` with Google's key fingerprint
5. Roll out to production

## Troubleshooting

### TWA shows browser address bar
- Verify `assetlinks.json` is accessible at `https://d2-liart-nine.vercel.app/.well-known/assetlinks.json`
- Check that the SHA-256 fingerprint matches your signing key
- Use the [Statement List Tester](https://developers.google.com/digital-asset-links/tools/generator) to verify

### App crashes on launch
- Ensure Chrome is installed and up to date on the device
- Check that the web app URL is accessible
- Review logcat for specific error messages

### Icons not showing
- Ensure all mipmap density folders have the correct icon
- The icon should be a 512x512 PNG that scales down properly
