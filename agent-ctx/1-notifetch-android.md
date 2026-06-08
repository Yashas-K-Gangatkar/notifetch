# Task: Create NotiFetch Android Project

## Summary
Created a complete native Android project for NotiFetch — a delivery driver notification aggregator app. The project uses `NotificationListenerService` to capture real-time notifications from 15+ delivery partner/driver apps and aggregates them in a unified dashboard.

## Project Location
`/home/z/my-project/notifetch-android/`

## Files Created (55 files total)

### Root Gradle Files
- `build.gradle.kts` — Project-level with AGP 8.7.3, Kotlin 2.0.21
- `settings.gradle.kts` — Project name "NotiFetch", includes :app
- `gradle.properties` — AndroidX, Jetifier, non-transitive R
- `gradle/wrapper/gradle-wrapper.properties` — Gradle 8.9
- `gradle/libs.versions.toml` — Version catalog with all dependencies

### App Module
- `app/build.gradle.kts` — All dependencies (Compose BOM, Room, Retrofit, Firebase BOM, Hilt, Navigation, Material 3, WorkManager, DataStore, Moshi)
- `app/proguard-rules.pro` — ProGuard rules for Retrofit, Room, Moshi, Firebase
- `app/google-services.json` — Placeholder Firebase config (replace with real one)
- `app/src/main/AndroidManifest.xml` — All permissions, NotificationListenerService, FCM service, main activity

### Kotlin Source Files

#### Core
- `NotiFetchApp.kt` — Application class with Hilt, notification channel creation, periodic sync scheduling
- `MainActivity.kt` — Single activity with Compose NavHost and bottom navigation

#### Notification Package (CORE)
- `notification/NotiFetchListenerService.kt` — THE CORE: Captures notifications from partner apps, filters by package, extracts data, saves to Room, queues for backend sync
- `notification/NotificationParser.kt` — Platform-specific regex parsing for order values, locations, distances, and categories

#### Data Layer
- `data/local/CapturedNotification.kt` — Room entity for captured notifications
- `data/local/PlatformConfig.kt` — Room entity for per-platform settings
- `data/local/NotificationDao.kt` — DAO with 20+ queries (insert, delete, filter, stats, sync tracking)
- `data/local/PlatformConfigDao.kt` — DAO for platform configuration
- `data/local/NotiFetchDatabase.kt` — Room database class
- `data/local/Converters.kt` — Type converters for Room
- `data/remote/NotiFetchApi.kt` — Retrofit API interface (POST notifications, batch, auth)
- `data/remote/NetworkModels.kt` — Moshi-annotated network models (NotificationPayload, ApiResponse, AuthPayload)
- `data/repository/NotificationRepository.kt` — Repository with local DB + remote API + sync logic
- `data/repository/AuthRepository.kt` — Firebase Anonymous Auth + DataStore token persistence

#### Dependency Injection
- `di/DatabaseModule.kt` — Hilt module for Room database and DAOs
- `di/NetworkModule.kt` — Hilt module for Retrofit, OkHttp, Moshi
- `di/FirebaseModule.kt` — Hilt module for FirebaseAuth

#### Firebase
- `firebase/NotiFetchMessagingService.kt` — FCM service for push notifications

#### Worker
- `worker/SyncWorker.kt` — WorkManager worker for periodic backend sync

#### UI Theme (Material 3)
- `ui/theme/Color.kt` — Complete color system with NotiFetch amber/orange brand colors + platform brand colors
- `ui/theme/Theme.kt` — Material 3 theme with light/dark mode support
- `ui/theme/Type.kt` — Typography scale

#### UI Components
- `ui/components/NotificationCard.kt` — Notification card with platform icon, category, info chips
- `ui/components/PlatformIcon.kt` — Platform-specific icon with brand color and initials
- `ui/components/StatCard.kt` — Statistics card for dashboard
- `ui/components/EmptyState.kt` — Empty state placeholder
- `ui/components/CategoryBadge.kt` — Category badge (New Order, Completed, Earnings, etc.)
- `ui/components/SearchBar.kt` — Search input field
- `ui/components/NotiFetchScaffold.kt` — Main scaffold with bottom navigation

#### UI Screens
- `ui/screens/HomeScreen.kt` — Dashboard with stats, notification feed, platform filters, search, pull-to-refresh
- `ui/screens/PermissionScreen.kt` — Step-by-step guide to enable notification access
- `ui/screens/NotificationDetailScreen.kt` — Full notification details with all extracted data
- `ui/screens/SettingsScreen.kt` — Per-platform toggle, dark mode, auto sync, listener status
- `ui/screens/ProfileScreen.kt` — Firebase auth, device info, connection status

#### ViewModels
- `ui/viewmodel/HomeViewModel.kt` — Dashboard state management with filtered notifications and stats
- `ui/viewmodel/SettingsViewModel.kt` — Settings state with platform configs
- `ui/viewmodel/ProfileViewModel.kt` — Auth state management
- `ui/viewmodel/NotificationDetailViewModel.kt` — Single notification state

#### Utilities
- `util/Constants.kt` — Partner packages map, platform sources, brand colors, all constants
- `util/Helpers.kt` — Formatting helpers, regex extractors, JSON serializer

### Resource Files
- `res/values/strings.xml` — Complete string resources
- `res/values/colors.xml` — Color resources
- `res/values/themes.xml` — Material 3 theme
- `res/drawable/ic_launcher_foreground.xml` — Bell icon vector
- `res/drawable/ic_launcher_background.xml` — Background vector
- `res/mipmap-anydpi-v26/ic_launcher.xml` — Adaptive icon
- `res/mipmap-anydpi-v26/ic_launcher_round.xml` — Round adaptive icon
- `res/xml/notification_listener_config.xml` — Partner package list

### Documentation
- `README.md` — Comprehensive documentation with setup, build, Play Store, architecture, and platform list

## Architecture Highlights
- NotificationListenerService captures from PARTNER/DRIVER apps only (not customer apps)
- Filters ongoing notifications (persistent "you are online" type)
- Platform-specific regex parsing for extracting order values, locations, distances
- Offline-first with Room DB, background sync via WorkManager
- Firebase Anonymous Auth for API authentication
- Material 3 with amber/orange NotiFetch brand colors + per-platform brand colors
