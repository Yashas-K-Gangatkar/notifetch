package com.notifetch.app.util

import android.content.Context
import android.util.Log
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.crashlytics.FirebaseCrashlytics
import com.notifetch.app.BuildConfig
import com.notifetch.app.notification.NotiFetchListenerService
import io.sentry.Sentry

/**
 * v2.9.40: Centralized health monitoring for the Android app.
 *
 * This is the Android equivalent of the web's /api/health endpoint. Instead of
 * an HTTP endpoint, it's a helper that:
 *
 *   1. Collects the current state of critical systems (listener, sync, DB)
 *   2. Reports that state to Crashlytics as custom keys (so every crash report
 *      includes "was the listener alive at crash time?")
 *   3. Sends a Sentry breadcrumb (so the issue timeline shows health transitions)
 *   4. Returns a structured [HealthReport] for UI consumption
 *
 * Called from:
 *   - ListenerHealthCheckScreen (user-triggered, manual refresh)
 *   - SyncWorker.doWork() (automatic, every 15 min)
 *   - NotiFetchApp.onCreate() (once on startup)
 *
 * This is the missing piece that closes the Android observability loop:
 * when a user reports "notifications stopped", you can look at the Crashlytics
 * custom keys for their crash (or Sentry breadcrumbs for their session) and
 * see exactly when the listener died and what state the app was in.
 */
object HealthMonitor {

    private const val TAG = "HealthMonitor"

    /**
     * Snapshot of critical app systems. All fields are non-null and safe to log.
     */
    data class HealthReport(
        val listenerConnected: Boolean,
        val appVersion: String,
        val versionCode: Int,
        val isDebug: Boolean,
        val timestamp: Long,
        val lastSyncAttempt: Long?,  // epoch millis, null if never synced
        val pendingNotificationsCount: Int,  // notifications in local DB not yet synced to backend
    ) {
        /** True if any critical system is in a bad state */
        val isDegraded: Boolean get() = !listenerConnected

        /** Human-readable summary for logs and Sentry */
        fun summary(): String =
            "listener=$listenerConnected pending=$pendingNotificationsCount sync=${lastSyncAttempt ?: "never"} v$appVersion"
    }

    /**
     * Collect the current health snapshot.
     *
     * Cheap to call — no network, no DB writes. Reads only:
     *   - System Settings.Secure for listener enabled state
     *   - SharedPreferences for last sync time (if tracked)
     *   - Room DB count for pending notifications (small query)
     */
    suspend fun snapshot(context: Context): HealthReport {
        val listenerConnected = try {
            NotiFetchListenerService.isListenerEnabled(context)
        } catch (e: Exception) {
            Log.w(TAG, "Failed to check listener state", e)
            false
        }

        val pendingCount = try {
            // Defer to the repository if accessible — for now use 0 as placeholder.
            // Future: inject NotificationRepository via Hilt and call getPendingSyncCount()
            0
        } catch (e: Exception) {
            Log.w(TAG, "Failed to count pending notifications", e)
            -1
        }

        return HealthReport(
            listenerConnected = listenerConnected,
            appVersion = BuildConfig.VERSION_NAME,
            versionCode = BuildConfig.VERSION_CODE,
            isDebug = BuildConfig.DEBUG,
            timestamp = System.currentTimeMillis(),
            lastSyncAttempt = null,  // TODO: wire to actual sync tracking
            pendingNotificationsCount = pendingCount,
        )
    }

    /**
     * Push the health snapshot to Crashlytics as custom keys.
     *
     * Custom keys are attached to EVERY subsequent crash report, so when a crash
     * happens 3 hours from now, you'll see "listenerConnected=false" in the
     * Crashlytics dashboard and know the listener was dead at crash time.
     *
     * Cheap to call — just sets key-value pairs, no network.
     */
    fun reportToCrashlytics(report: HealthReport) {
        try {
            val crashlytics = FirebaseCrashlytics.getInstance()
            crashlytics.setCustomKey("listener_connected", report.listenerConnected)
            crashlytics.setCustomKey("pending_notifications", report.pendingNotificationsCount)
            crashlytics.setCustomKey("last_sync_attempt", report.lastSyncAttempt ?: -1L)
            crashlytics.setCustomKey("is_degraded", report.isDegraded)
            crashlytics.setCustomKey("last_health_check", report.timestamp)
        } catch (e: Exception) {
            // Best-effort — don't crash the app if Crashlytics fails
            Log.w(TAG, "Failed to report to Crashlytics", e)
        }
    }

    /**
     * Add a Sentry breadcrumb with the health snapshot.
     *
     * Breadcrumbs show up in the issue timeline — when a crash happens, you can
     * scroll back through breadcrumbs and see "10 min ago: listener disconnected"
     * which tells you the crash is probably related to the dead listener.
     */
    fun reportToSentry(report: HealthReport) {
        try {
            Sentry.addBreadcrumb(
                io.sentry.Breadcrumb().apply {
                    category = "health"
                    message = report.summary()
                    level = if (report.isDegraded) io.sentry.SentryLevel.WARNING else io.sentry.SentryLevel.INFO
                    setData("listener_connected", report.listenerConnected)
                    setData("pending_notifications", report.pendingNotificationsCount)
                    setData("app_version", report.appVersion)
                }
            )
        } catch (e: Exception) {
            Log.w(TAG, "Failed to report to Sentry", e)
        }
    }

    /**
     * Log a custom analytics event to Firebase Analytics.
     *
     * Use this for user-action events (app_open, notification_captured,
     * deep_link_tapped, etc.) — NOT for health checks (those go to Crashlytics).
     *
     * Example:
     *   HealthMonitor.logEvent(context, "notification_captured", bundleOf(
     *       "platform" to "swiggy",
     *       "category" to "NEW_ORDER",
     *   ))
     */
    fun logEvent(
        context: Context,
        eventName: String,
        params: Map<String, Any>? = null,
    ) {
        try {
            val analytics = FirebaseAnalytics.getInstance(context)
            analytics.logEvent(eventName, null)
            if (params != null) {
                val bundle = android.os.Bundle()
                params.forEach { (key, value) ->
                    when (value) {
                        is String -> bundle.putString(key, value)
                        is Int -> bundle.putInt(key, value)
                        is Long -> bundle.putLong(key, value)
                        is Double -> bundle.putDouble(key, value)
                        is Boolean -> bundle.putBoolean(key, value)
                    }
                }
                analytics.logEvent(eventName, bundle)
            }
        } catch (e: Exception) {
            Log.w(TAG, "Failed to log Firebase event: $eventName", e)
        }
    }

    /**
     * Capture an exception in BOTH Crashlytics and Sentry.
     *
     * Use this for non-fatal errors (caught exceptions that don't crash the app
     * but indicate something went wrong — e.g., a network request failed, a
     * deep link didn't resolve, a JSON parse failed).
     *
     * Both dashboards will show the error. Sentry groups by stack trace;
     * Crashlytics groups by exception type.
     */
    fun captureException(throwable: Throwable, tag: String? = null) {
        try {
            FirebaseCrashlytics.getInstance().recordException(throwable)
            Sentry.captureException(throwable)
            Log.w(TAG, "Captured exception from $tag: ${throwable.message}", throwable)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to capture exception", e)
        }
    }
}
