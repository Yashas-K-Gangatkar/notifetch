# NotiFetch — Delivery Driver Notification Aggregator

NotiFetch is an Android app that uses `NotificationListenerService` to capture real-time notifications from delivery **partner/driver** apps (NOT customer apps), aggregates them in a unified dashboard, and syncs them to a backend server.

## Features

- 🔔 **Real-time notification capture** from 15+ delivery partner apps
- 📊 **Dashboard** with stats, platform filters, and search
- 🔄 **Automatic sync** to NotiFetch backend server
- 🔐 **Firebase Anonymous Auth** for secure API communication
- 💾 **Local Room database** for offline-first notification storage
- 🌙 **Material 3 theming** with dark/light mode
- 🔔 **Push notifications** via Firebase Cloud Messaging
- ⚙️ **Per-platform settings** to enable/disable monitoring

## How to Open in Android Studio

1. **Clone the repository** and open the project folder:
   ```bash
   git clone <repo-url>
   cd notifetch-android
   ```

2. **Open in Android Studio**:
   - Launch Android Studio
   - Select **File → Open**
   - Navigate to the `notifetch-android` directory and click **OK**
   - Wait for Gradle sync to complete

3. **Set up Firebase** (required for auth & push notifications):
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project (or use existing)
   - Add an Android app with package name `com.notifetch.app`
   - Download `google-services.json` and replace the placeholder at `app/google-services.json`
   - Enable **Anonymous Authentication** in Firebase Auth
   - Enable **Cloud Messaging** in Firebase

## How to Build from Command Line

### Debug Build
```bash
./gradlew assembleDebug
```
Output APK: `app/build/outputs/apk/debug/app-debug.apk`

### Release Build
```bash
./gradlew assembleRelease
```
Output APK: `app/build/outputs/apk/release/app-release.apk`

### Clean Build
```bash
./gradlew clean assembleDebug
```

## How to Generate Signed AAB for Play Store

1. **Create a keystore** (if you don't have one):
   ```bash
   keytool -genkey -v -keystore notifetch-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias notifetch
   ```

2. **Configure signing** — create `app/keystore.properties`:
   ```properties
   storeFile=../notifetch-release.jks
   storePassword=your_store_password
   keyAlias=notifetch
   keyPassword=your_key_password
   ```

3. **Build the AAB**:
   ```bash
   ./gradlew bundleRelease
   ```
   Output: `app/build/outputs/bundle/release/app-release.aab`

4. **Upload to Play Store**:
   - Go to [Google Play Console](https://play.google.com/console)
   - Create a new app or select existing
   - Navigate to **Production → Create new release**
   - Upload the `.aab` file

## How the NotificationListenerService Works

### Architecture

```
┌─────────────────────────┐
│  Delivery Partner Apps  │
│  (Swiggy, Zomato, etc.) │
└────────────┬────────────┘
             │ Notification
             ▼
┌─────────────────────────┐
│  NotificationListener   │
│  Service (Android OS)   │
└────────────┬────────────┘
             │ onNotificationPosted()
             ▼
┌─────────────────────────┐
│  NotiFetchListener      │
│  Service                │
│  ├─ Filter by package   │
│  ├─ Parse notification  │
│  ├─ Save to Room DB     │
│  └─ Queue for sync      │
└────────────┬────────────┘
             │
     ┌───────┴───────┐
     ▼               ▼
┌─────────┐   ┌──────────┐
│  Room   │   │  Backend  │
│  Local  │   │  API      │
│  DB     │   │  (Sync)   │
└─────────┘   └──────────┘
     │               │
     └───────┬───────┘
             ▼
┌─────────────────────────┐
│  Jetpack Compose UI     │
│  (Dashboard, Details)   │
└─────────────────────────┘
```

### Key Implementation Details

1. **`NotiFetchListenerService`** extends `NotificationListenerService` — an Android system service that receives callbacks whenever any app posts a notification.

2. **Package Filtering**: The service maintains a map of partner app package names. When `onNotificationPosted()` is called, it immediately returns if the notification's package isn't in the allowed list.

3. **Data Extraction**: From each `StatusBarNotification`, the service extracts:
   - `Notification.EXTRA_TITLE` — notification title
   - `Notification.EXTRA_TEXT` — notification body text
   - `Notification.EXTRA_BIG_TEXT` — expanded notification text
   - `Notification.EXTRA_SUB_TEXT` — sub-text
   - Full `extras` bundle serialized to JSON

4. **Platform-Specific Parsing**: `NotificationParser` applies regex patterns per platform to extract:
   - Order value (₹ amounts)
   - Pickup and drop-off locations
   - Distance information
   - Notification category (NEW_ORDER, COMPLETED, EARNINGS, etc.)

5. **Local Storage**: Parsed notifications are saved to a Room database with sync tracking (`isSynced` flag).

6. **Backend Sync**: A `WorkManager` periodic task syncs unsynced notifications to the NotiFetch backend API.

### User Permission Flow

The `NotificationListenerService` requires a special system permission that can only be granted through Android Settings:

1. App detects listener is not enabled
2. Shows `PermissionScreen` with step-by-step instructions
3. User taps "Open Notification Settings"
4. Android opens **Settings → Apps → Special App Access → Notification Access**
5. User finds "NotiFetch" and enables it
6. Service's `onListenerConnected()` is called
7. App returns to dashboard

### Privacy

- Only notifications from the configured partner packages are captured
- Ongoing notifications (e.g., "You are online") are filtered out
- All data is stored locally first, then optionally synced
- No personal messaging or social media notifications are accessed

## Supported Platform Packages

| Platform | Package Name | Source ID |
|----------|-------------|-----------|
| Swiggy Partner | `in.swiggy.partner` | `swiggy_partner` |
| Swiggy Delivery | `in.swiggy.deliveryapp` | `swiggy_delivery` |
| Zomato Delivery | `com.zomato.delivery` | `zomato_delivery` |
| Zomato Delivery Partner | `com.zomato.deliverypartner` | `zomato_delivery_partner` |
| Amazon Flex | `com.amazon.flex` | `amazon_flex` |
| Zepto Cafe Partner | `com.zepto.cafepartner` | `zepto_cafe_partner` |
| Blinkit Partner | `com.grofers.partnerapp` | `blinkit_partner` |
| BigBasket Partner | `com.bigbasket.partnerapp` | `bigbasket_partner` |
| Dunzo Partner | `com.dunzo.partner` | `dunzo_partner` |
| Porter Partner | `com.porter.porterpartner` | `porter_partner` |
| Rapido Captain | `com.rapido.captain` | `rapido_captain` |
| Ola Driver | `com.olacabs.driver` | `ola_driver` |
| Uber Driver | `com.ubercab.driver` | `uber_driver` |
| Flipkart Logistics | `com.flipkart.logistics` | `flipkart_logistics` |
| Shadowfax Partner | `com.shadowfax.partner` | `shadowfax_partner` |

## Backend API

**Base URL**: `https://d2-liart-nine.vercel.app/`

### POST `/api/notifications`
Send a single notification:
```json
{
  "source": "swiggy_partner",
  "platform": "Swiggy Partner",
  "title": "New Order Available!",
  "body": "Pick up from Koramangala, ₹45 delivery fee",
  "orderValue": 45,
  "pickupLocation": "Koramangala",
  "dropoffLocation": "Indiranagar",
  "distance": "3.2 km",
  "receivedAt": "2026-06-08T10:30:00Z",
  "packageName": "in.swiggy.partner"
}
```

### POST `/api/notifications/batch`
Send multiple notifications:
```json
{
  "notifications": [...],
  "deviceId": "device_unique_id"
}
```

## Tech Stack

- **Kotlin** with Jetpack Compose
- **Material 3** Design System
- **Hilt** for Dependency Injection
- **Room** for Local Database
- **Retrofit + Moshi** for Network
- **Firebase** Auth & Cloud Messaging
- **WorkManager** for Background Sync
- **DataStore** for Preferences
- **Navigation Compose** for Routing

## Project Structure

```
notifetch-android/
├── app/
│   ├── build.gradle.kts
│   ├── google-services.json
│   ├── proguard-rules.pro
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/notifetch/app/
│       │   ├── NotiFetchApp.kt
│       │   ├── MainActivity.kt
│       │   ├── data/
│       │   │   ├── local/ (Room entities, DAO, DB)
│       │   │   ├── remote/ (Retrofit API, models)
│       │   │   └── repository/ (Repositories)
│       │   ├── di/ (Hilt modules)
│       │   ├── firebase/ (FCM service)
│       │   ├── notification/
│       │   │   ├── NotiFetchListenerService.kt
│       │   │   └── NotificationParser.kt
│       │   ├── ui/
│       │   │   ├── components/ (Reusable composables)
│       │   │   ├── screens/ (Screen composables)
│       │   │   ├── theme/ (Material 3 theme)
│       │   │   └── viewmodel/ (ViewModels)
│       │   ├── util/ (Constants, Helpers)
│       │   └── worker/ (SyncWorker)
│       └── res/
│           ├── drawable/ (Launcher icon vectors)
│           ├── mipmap-anydpi-v26/ (Adaptive icons)
│           ├── values/ (strings, colors, themes)
│           └── xml/ (Notification listener config)
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
├── gradle/
│   ├── libs.versions.toml
│   └── wrapper/gradle-wrapper.properties
└── README.md
```

## License

Proprietary — All rights reserved.
