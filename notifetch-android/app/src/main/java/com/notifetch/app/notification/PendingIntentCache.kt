package com.notifetch.app.notification

import android.app.PendingIntent
import android.util.LruCache

/**
 * In-memory cache of PendingIntents from captured notifications.
 *
 * When a notification is captured by NotiFetchListenerService, its contentIntent
 * (PendingIntent) is cached here. When the user clicks "Open App" in NotiFetch,
 * we first try to send the cached PendingIntent — this opens the exact screen
 * the source app intended (e.g., a specific order, offer, or tracking page).
 *
 * Cache is lost when the app process is killed — in that case, we fall back to
 * getLaunchIntentForPackage() which opens the app's main screen.
 *
 * Keyed by package name (last notification's PendingIntent per app).
 * This is sufficient because users typically tap a notification shortly after
 * receiving it, while the process is still alive.
 */
object PendingIntentCache {
    // Cache up to 30 package -> PendingIntent mappings (LRU eviction)
    private val cache = LruCache<String, PendingIntent>(30)

    /**
     * Store the PendingIntent for a package.
     * Only stores non-null PendingIntents.
     */
    fun put(packageName: String, pendingIntent: PendingIntent?) {
        if (pendingIntent != null) {
            cache.put(packageName, pendingIntent)
        }
    }

    /**
     * Retrieve the cached PendingIntent for a package.
     * Returns null if not cached (app was killed, no notification captured yet).
     */
    fun get(packageName: String): PendingIntent? {
        return cache.get(packageName)
    }

    /**
     * Check if we have a cached PendingIntent for a package.
     */
    fun has(packageName: String): Boolean {
        return cache.get(packageName) != null
    }

    /**
     * Clear all cached PendingIntents (e.g., on service disconnect).
     */
    fun clear() {
        cache.evictAll()
    }
}
