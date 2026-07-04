package com.notifetch.app.notification

import android.app.PendingIntent
import android.util.LruCache

/**
 * v2.9.48: RESTORED PendingIntentCache.
 *
 * Was deleted in v2.9.35 as "dead code" — but it was actually critical.
 *
 * WHY IT'S NEEDED:
 * Most delivery apps (Swiggy, Zomato, etc.) have their order detail pages
 * as non-exported activities (android:exported="false"). Only the original
 * PendingIntent.send() can open these — it carries the original app's
 * identity and permissions.
 *
 * Intent.parseUri() + startActivity() CANNOT open non-exported activities.
 * It throws SecurityException, which we catch and fall through to the
 * home screen. That's why deep links never worked.
 *
 * The cache is in-memory (LRU, 30 items). It's lost when the app process
 * is killed — in that case, we fall back to Intent.parseUri() for exported
 * activities, then getLaunchIntentForPackage() for the main screen.
 */
object PendingIntentCache {
    private val cache = LruCache<String, PendingIntent>(30)

    fun put(packageName: String, pendingIntent: PendingIntent?) {
        if (pendingIntent != null) {
            cache.put(packageName, pendingIntent)
        }
    }

    fun get(packageName: String): PendingIntent? {
        return cache.get(packageName)
    }

    fun has(packageName: String): Boolean {
        return cache.get(packageName) != null
    }

    fun clear() {
        cache.evictAll()
    }
}
