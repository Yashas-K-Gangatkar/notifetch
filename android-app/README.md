# NotiFetch Android App

Native Android application for NotiFetch that captures delivery notifications from partner apps using `NotificationListenerService`.

## Features

- **Notification Capture**: Listens for notifications from 25+ delivery partner apps (Swiggy, Zomato, Amazon Flex, Dunzo, Porter, Zepto, Blinkit, Uber, Ola, Gojek, Rapido, and more)
- **Backend Forwarding**: Automatically forwards captured notifications to the NotiFetch web backend API
- **Local Storage**: Room database for offline-first notification storage
- **Native Dashboard**: RecyclerView-based notification list with filtering, search, and category chips
- **WebView Integration**: Loads the full NotiFetch web app (https://d2-liart-nine.vercel.app) for the complete experience
- **Permission Guide**: Clear UX for enabling the critical notification listener permission
- **Dark Theme**: Material Design 3 dark theme with amber (#f59e0b) accent color
- **Auto-Restart**: Boot receiver ensures the service reconnects after device restart

## Architecture

```
app/src/main/java/com/notifetch/app/
├── MainActivity.kt              - Main activity with WebView + Dashboard + Settings tabs
├── NotiFetchListenerService.kt  - Core NotificationListenerService
├── NotificationData.kt          - Data models, delivery partner registry
├── NotificationStorage.kt       - Room database, DAO, Repository
├── ApiClient.kt                 - HTTP client for backend communication
├── DashboardActivity.kt         - Full notification dashboard with filters
├── PermissionActivity.kt        - Notification access permission guide
├── NotificationAdapter.kt       - RecyclerView adapter for notification list
└── BootReceiver.kt              - Restarts service after device reboot
```

## Supported Delivery Platforms

| Platform | Package Name | Category |
|----------|-------------|----------|
| Swiggy Partner | `in.swiggy.partner` | Food |
| Swiggy Delivery | `in.swiggy.delivery` | Food |
| Zomato Delivery | `com.zomato.delivery` | Food |
| Amazon Flex | `com.amazon.flex` | Package |
| Dunzo | `com.dunzo.delivery` | Grocery |
| Porter | `com.porter.delivery` | Package |
| Zepto Rider | `in.zepto.rider` | Grocery |
| Blinkit Rider | `com.blinkit.rider` | Grocery |
| Uber Eats Partner | `in.ubereats.partner` | Food |
| Ola Partner | `com.ola.partner` | Ride |
| Gojek Driver | `in.gojek.driver` | Ride |
| Rapido Driver | `com.rapido.driver` | Ride |
| + 13 more | | |

## Prerequisites

- **Android Studio**: Hedgehog (2023.1.1) or later
- **JDK**: 17+
- **Android SDK**: compileSdk 35, targetSdk 35, minSdk 24
- **Kotlin**: 1.9.22

## Building

### Debug Build

```bash
cd android-app
./gradlew assembleDebug
```

The debug APK will be at `app/build/outputs/apk/debug/app-debug.apk`.

### Release Build

Release builds require signing configuration. Set these environment variables first:

```bash
export NOTIFETCH_STORE_PASSWORD="your_keystore_password"
export NOTIFETCH_KEY_PASSWORD="your_key_password"
```

Then build:

```bash
./gradlew assembleRelease
```

The release APK will be at `app/build/outputs/apk/release/app-release.apk`.

### Generating a Keystore (First Time Only)

If you don't have a keystore:

```bash
keytool -genkey -v -keystore keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias notifetch
```

Then update `app/build.gradle` to point `storeFile` to your keystore location.

## Installation

### From Android Studio

1. Open the `android-app` directory in Android Studio
2. Connect your Android device (or start an emulator)
3. Click **Run** → **Run 'app'**

### From APK

```bash
adb install app-debug.apk
```

### First Launch Setup

1. Open the app
2. You'll be prompted to enable **Notification Access**
3. Tap "Enable Notification Access" → opens Android Settings
4. Find **NotiFetch** in the list and enable it
5. Return to the app — you're all set!

## How It Works

1. **Notification Listener**: The `NotiFetchListenerService` extends `NotificationListenerService`, which is an Android system API that receives callbacks when any app posts a notification.

2. **Filtering**: Only notifications from known delivery partner packages are processed. All other notifications (WhatsApp, Gmail, etc.) are completely ignored.

3. **Parsing**: The service extracts the notification title, text, big text, sub-text, and other metadata from the `StatusBarNotification` extras.

4. **Local Storage**: Each captured notification is saved to a local Room database for offline access and history.

5. **Backend Forwarding**: Notifications are forwarded to `https://d2-liart-nine.vercel.app/api/notifications` via OkHttp. Failed forwards are retried automatically.

6. **In-App Notification**: A low-priority notification is shown to let the user know a delivery notification was captured.

## Permissions

| Permission | Purpose | Required |
|-----------|---------|----------|
| `INTERNET` | Forward notifications to backend | Yes |
| `ACCESS_NETWORK_STATE` | Check connectivity | Yes |
| `POST_NOTIFICATIONS` | Show in-app capture notifications (Android 13+) | Recommended |
| `BIND_NOTIFICATION_LISTENER_SERVICE` | Core: Listen for delivery notifications | **Critical** |
| `RECEIVE_BOOT_COMPLETED` | Reconnect service after reboot | Recommended |
| `FOREGROUND_SERVICE` | Future: Long-running monitoring | Optional |

## Digital Asset Links

The app is configured for Digital Asset Links verification with:
- **Package**: `com.notifetch.app`
- **Domain**: `d2-liart-nine.vercel.app`
- **Asset Statements**: Defined in `strings.xml`

The `assetlinks.json` file should be deployed at:
`https://d2-liart-nine.vercel.app/.well-known/assetlinks.json`

## Technology Stack

- **Language**: Kotlin
- **UI**: Material Design 3, ViewBinding
- **Database**: Room (SQLite)
- **Network**: OkHttp 4.12 + Gson
- **Async**: Kotlin Coroutines + Flow
- **WebView**: Android WebView with Chrome Custom Tabs support
- **Architecture**: MVVM-lite (Repository pattern)

## Troubleshooting

### "Notification Listener Disabled" message
- Go to **Settings** → **Apps** → **Special access** → **Notification access**
- Find **NotiFetch** and enable it
- If NotiFetch doesn't appear in the list, reinstall the app

### No notifications being captured
- Verify notification access is enabled (see above)
- Check that the delivery app is actually posting notifications
- Some delivery apps may use silent/background updates that don't generate notifications
- Check logcat with filter: `adb logcat -s NotiFetchListener`

### Backend forwarding failures
- Check internet connectivity
- Verify the backend URL is correct: `https://d2-liart-nine.vercel.app`
- Check logcat with filter: `adb logcat -s NotiFetchApiClient`
- Failed notifications are saved locally and retried automatically

### WebView not loading
- Check internet connectivity
- The web app at `https://d2-liart-nine.vercel.app` must be accessible
- Try clearing WebView data: Settings → Apps → NotiFetch → Storage → Clear

## License

Proprietary — NotiFetch
