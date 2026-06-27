package com.notifetch.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import androidx.hilt.work.HiltWorkerFactory
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import androidx.work.Configuration
import androidx.work.WorkManager
import com.google.firebase.crashlytics.FirebaseCrashlytics
import com.google.firebase.analytics.FirebaseAnalytics
import com.notifetch.app.data.repository.dataStore
import com.notifetch.app.notification.ScreenOnReceiver
import com.notifetch.app.util.Constants
import com.notifetch.app.ui.viewmodel.SettingsViewModel
import com.notifetch.app.worker.SyncWorker
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch

@HiltAndroidApp
class NotiFetchApp : Application(), Configuration.Provider {

    @Inject lateinit var workerFactory: HiltWorkerFactory

    private val appScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override val workManagerConfiguration: Configuration
        get() = Configuration.Builder()
            .setWorkerFactory(workerFactory)
            .build()

    override fun onCreate() {
        super.onCreate()
        initCrashlytics()
        initSentry()
        createNotificationChannels()
        schedulePeriodicSyncIfEnabled()
        setupForegroundListenerWatchdog()
        registerScreenOnReceiver()
    }

    private fun initCrashlytics() {
        val crashlytics = FirebaseCrashlytics.getInstance()
        // Enable Crashlytics collection (respects user preferences in release)
        crashlytics.setCrashlyticsCollectionEnabled(!BuildConfig.DEBUG)
        // Log app version for crash reports
        crashlytics.setCustomKey("app_version", BuildConfig.VERSION_NAME)
        crashlytics.setCustomKey("version_code", BuildConfig.VERSION_CODE)
        // v2.9.40: Tag Crashlytics with platform so web errors can be filtered out
        crashlytics.setCustomKey("platform", "android")
    }

    /**
     * v2.9.40: Initialize Sentry Android SDK.
     *
     * Sentry provides:
     *   - Crash reporting (overlaps with Crashlytics — both run, Sentry is the
     *     primary dashboard going forward since it unifies with web)
     *   - Non-fatal error reporting (Crashlytics catches only crashes)
     *   - ANR (Application Not Responding) detection
     *   - Performance monitoring (slow API calls, frozen frames)
     *   - Session replay (visual recording of user actions before crash)
     *
     * Uses the same DSN as the web app — Sentry auto-tags errors with
     * platform=android so you can filter by platform in the dashboard.
     */
    private fun initSentry() {
        try {
            io.sentry.android.core.SentryAndroid.init(this) { options ->
                options.dsn = BuildConfig.SENTRY_DSN
                // Enable in release builds, disable in debug (devs don't need telemetry)
                options.isEnableAutoSessionTracking = !BuildConfig.DEBUG
                options.isEnableNdk = true  // Catch native crashes (NDK errors)
                options.isEnableActivityLifecycleBreadcrumbs = true
                options.isEnableAppLifecycleBreadcrumbs = true
                options.isEnableSystemEventBreadcrumbs = true
                options.isEnableUserInteractionBreadcrumbs = true
                // 10% sample rate for performance transactions (high volume otherwise)
                options.tracesSampleRate = if (BuildConfig.DEBUG) 1.0 else 0.1
                // Attach a screenshot on crash (Sentry Pro feature, free tier ignores)
                options.isAttachScreenshot = false
                // Attach view hierarchy on crash (helps debug Compose UI issues)
                options.isAttachViewHierarchy = true
                options.release = "notifetch-android@${BuildConfig.VERSION_NAME}"
                options.environment = if (BuildConfig.DEBUG) "debug" else "production"
                // Tag all events with platform=android for filtering in dashboard
                options.tags["platform"] = "android"
                options.tags["app_version"] = BuildConfig.VERSION_NAME
            }
            android.util.Log.d("NotiFetchApp", "Sentry initialized (DSN: ${BuildConfig.SENTRY_DSN.take(30)}...)")
        } catch (e: Exception) {
            // Don't crash the app if Sentry fails to init — observability is best-effort
            android.util.Log.e("NotiFetchApp", "Sentry init failed", e)
            FirebaseCrashlytics.getInstance().recordException(e)
        }
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                Constants.NOTIFICATION_CHANNEL_ID,
                Constants.NOTIFICATION_CHANNEL_NAME,
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "NotiFetch background sync service"
                setShowBadge(false)
            }

            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }

    /**
     * Schedule periodic sync only if the user hasn't disabled it (BUG #7/16 fix).
     * Reads the sync_enabled preference from DataStore.
     */
    private fun schedulePeriodicSyncIfEnabled() {
        val workManager = WorkManager.getInstance(this)
        appScope.launch {
            val syncEnabled = try {
                dataStore.data.map { prefs ->
                    prefs[SettingsViewModel.SYNC_ENABLED_KEY] ?: true
                }.first()
            } catch (_: Exception) { true } // Default to enabled if read fails

            if (syncEnabled) {
                val intervalMinutes = try {
                    dataStore.data.map { prefs ->
                        prefs[SettingsViewModel.SYNC_INTERVAL_KEY] ?: 15L
                    }.first()
                } catch (_: Exception) { Constants.SYNC_INTERVAL_MINUTES }

                SettingsViewModel.scheduleSyncWork(workManager, intervalMinutes)
            }
        }
    }

    /**
     * v2.9.35: Watch app foreground transitions and fire an immediate listener
     * health check every time NotiFetch comes to the foreground.
     *
     * Why: On Realme/Oppo/Vivo/Xiaomi, the periodic SyncWorker (every 15 min)
     * is often delayed by 30-60 min when the app is in the background. When the
     * user opens NotiFetch, that's a strong signal they care about missing
     * notifications — so we kick a one-shot rebind check immediately.
     *
     * Uses ProcessLifecycleOwner which tracks the entire app process lifecycle
     * (not any specific Activity), so ON_RESUME fires once when the app comes
     * to the foreground regardless of which Activity is on top.
     */
    private fun setupForegroundListenerWatchdog() {
        ProcessLifecycleOwner.get().lifecycle.addObserver(object : DefaultLifecycleObserver {
            override fun onResume(owner: LifecycleOwner) {
                SyncWorker.checkListenerHealthNow(this@NotiFetchApp)
            }
        })
    }

    /**
     * v2.9.35: Register a runtime receiver for ACTION_SCREEN_ON.
     *
     * Why: Android 8+ (API 26+) blocks manifest-registered receivers for most
     * implicit broadcasts, including ACTION_SCREEN_ON. We MUST register at
     * runtime for the receiver to fire.
     *
     * When the screen turns on, fire [SyncWorker.checkListenerHealthNow] —
     * this catches the case where the user has NotiFetch in the background
     * and never brings it to the foreground, but does turn on their screen
     * to check other apps. Screen-on is the cheapest "user is back" signal.
     *
     * The receiver lives for the lifetime of the application process. If the
     * process is killed, the receiver is gone — but the process restart will
     * re-register it in onCreate().
     */
    private fun registerScreenOnReceiver() {
        val filter = IntentFilter(Intent.ACTION_SCREEN_ON)
        try {
            registerReceiver(ScreenOnReceiver(), filter)
        } catch (e: Exception) {
            // Some heavily-modified ROMs (e.g., older MIUI) may reject runtime
            // receiver registration for SCREEN_ON. Don't crash — the periodic
            // SyncWorker and the foreground watchdog still cover the main case.
            com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance()
                .recordException(RuntimeException("ScreenOnReceiver registration failed", e))
        }
    }
}
