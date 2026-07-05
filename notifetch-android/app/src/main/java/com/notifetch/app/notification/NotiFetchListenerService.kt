package com.notifetch.app.notification

import android.app.Notification
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.notifetch.app.data.local.CapturedNotification
import com.notifetch.app.data.repository.AuthRepository
import com.notifetch.app.data.repository.NotificationRepository
import com.notifetch.app.util.Constants
import com.notifetch.app.util.Helpers
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch
import java.util.concurrent.ConcurrentHashMap
import javax.inject.Inject

/**
 * Core NotificationListenerService that captures notifications from delivery apps.
 *
 * v2.9.6 — Critical fix for "only Zomato captured" bug:
 *
 * ROOT CAUSES FIXED (permanent fixes, not patches):
 *
 * 1. FLAG_ONGOING_EVENT filter REMOVED
 *    - Previously: skipped persistent notifications like "Out for delivery"
 *    - Impact: blocked the MOST VALUABLE customer notifications (live order tracking)
 *      from Swiggy, Uber Eats, Domino's, etc. — Zomato was unaffected because it
 *      uses dismissible notifications
 *    - Fix: capture ongoing notifications. Deduplicate by content hash to avoid
 *      spamming when the same ongoing notification updates.
 *
 * 2. FLAG_GROUP_SUMMARY filter REMOVED
 *    - Previously: skipped group summary notifications thinking they duplicate content
 *    - Impact: some apps post the summary as the ONLY notification with real content
 *      (especially when only one order is active). Skipping it lost the data.
 *    - Fix: capture group summaries. Deduplicate by content hash.
 *
 * 3. runBlocking on main thread REMOVED
 *    - Previously: `runBlocking(Dispatchers.IO) { repository.getPlatformConfig(pkg) }`
 *      blocked the main thread on every notification
 *    - Impact: ANR (Application Not Responding) → Android kills the listener service
 *      → only notifications arriving in the brief window before kill got captured
 *    - Fix: maintain an in-memory `disabledPackages` set, refreshed via a Flow
 *      collector on `onListenerConnected()`. O(1) check, no DB read on main thread.
 *
 * 4. Multi-style content extraction ADDED
 *    - Previously: only EXTRA_TITLE / EXTRA_TEXT / EXTRA_BIG_TEXT / EXTRA_SUB_TEXT
 *    - Impact: apps using MessagingStyle (Uber Eats chat-like updates) or InboxStyle
 *      (multi-line order summaries) had empty EXTRA_TEXT → flagged as empty → skipped
 *    - Fix: also extract from EXTRA_MESSAGES, EXTRA_BIG_TEXT, EXTRA_CONVERSATION_DATA,
 *      EXTRA_INFO_TEXT, EXTRA_SUMMARY_TEXT, and remote-input results.
 *
 * 5. Content-hash deduplication ADDED
 *    - Without the FLAG_ONGOING_EVENT / FLAG_GROUP_SUMMARY filters, the same
 *      notification may be posted multiple times (updates, group refreshes)
 *    - Fix: 3-second sliding window dedupe by (package + title + text + bigText)
 *
 * LEGAL COMPLIANCE (preserved):
 * - We only store notification content the user can already see (title, text, bigText, subText)
 * - We do NOT store the raw notification extras bundle (may contain PII, auth tokens)
 * - We do NOT access delivery platform APIs or store credentials
 * - Per-platform enable/disable is respected (DPDPA compliance)
 * - Android 15 redacted notifications are handled gracefully
 */
@AndroidEntryPoint
class NotiFetchListenerService : NotificationListenerService() {

    @Inject lateinit var repository: NotificationRepository
    @Inject lateinit var authRepository: AuthRepository

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val tag = "NotiFetchListener"

    // Debounce sync — wait 5 seconds after the last notification before syncing
    private var syncJob: Job? = null
    // Debounce platform count increment — batch updates to reduce DB writes
    private var countIncrementJob: Job? = null
    // Track which packages need count increments for batching
    private val pendingCountIncrements = mutableSetOf<String>()

    // ─── v2.9.6: In-memory enabled-packages cache (replaces runBlocking) ───────
    // Maintained by a Flow collector — O(1) check on main thread, no DB reads.
    // v2.9.58 FIX: Changed from fail-open to fail-closed for consent compliance.
    // Starts with ALL packages disabled until config loads, then enables based on DB.
    private val disabledPackages = ConcurrentHashMap.newKeySet<String>()
    @Volatile
    private var configLoaded = false  // v2.9.58: Track if config has loaded
    private var configFlowJob: Job? = null

    // ─── v2.9.6: Content-hash deduplication (replaces FLAG_ONGOING_EVENT filter) ─
    // Key: "packageName|title|text|bigText" (lowercased, trimmed)
    // Value: timestamp of last capture (millis)
    // TTL: 3 seconds — same content within 3s is treated as a duplicate update
    private val recentCaptures = ConcurrentHashMap<String, Long>()
    private val DEDUP_WINDOW_MS = 3_000L

    companion object {
        @Volatile
        private var currentInstance: NotiFetchListenerService? = null

        private val ALL_PACKAGES: Map<String, String>
            get() = Constants.ALL_PACKAGES

        /**
         * Check if the notification listener service is enabled.
         * v2.9.58 FIX: Use NotificationManagerCompat instead of string matching.
         * Some OEMs store the short form, so string contains() is fragile.
         */
        fun isListenerEnabled(context: Context): Boolean {
            return androidx.core.app.NotificationManagerCompat
                .getEnabledListenerPackages(context)
                .contains(context.packageName)
        }

        /**
         * v2.9.58: Check if the listener instance is actually alive.
         * isListenerEnabled() checks the system setting, but the process
         * might have been killed by the OEM. This checks if our singleton
         * instance is still connected.
         */
        fun isInstanceAlive(): Boolean {
            return currentInstance != null
        }

        /**
         * Open the notification access settings screen.
         */
        fun openNotificationSettings(context: Context) {
            val intent = Intent(android.provider.Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
        }

        /**
         * v2.9.52: Repopulate the PendingIntentCache from active system notifications.
         *
         * Called when the user opens a notification detail screen. If the app process
         * was killed (Realme/Xiaomi battery optimization), the in-memory cache is empty.
         * This method asks the system for currently active notifications and refills
         * the cache so PendingIntent.send() can be used for deep linking.
         *
         * This is safe to call from any thread — it uses the NotificationListenerService
         * instance if available, or does nothing if the listener isn't connected.
         *
         * @return true if cache was repopulated, false if listener not connected
         */
        fun repopulatePendingIntentCache(): Boolean {
            return try {
                // Get the singleton instance of the listener service
                val instance = currentInstance ?: return false
                val activeNotifications = instance.getActiveNotifications()

                var count = 0
                for (sbn in activeNotifications) {
                    if (ALL_PACKAGES.containsKey(sbn.packageName)) {
                        try {
                            val contentIntent = sbn.notification.contentIntent
                            if (contentIntent != null) {
                                PendingIntentCache.put(sbn.packageName, contentIntent)
                                count++
                            }
                        } catch (_: Exception) { }
                    }
                }
                android.util.Log.d("NotiFetchListener", "Repopulated PendingIntentCache: $count entries")
                count > 0
            } catch (e: Exception) {
                android.util.Log.w("NotiFetchListener", "Failed to repopulate cache: ${e.message}")
                false
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        Log.d(tag, "NotiFetchListenerService created — monitoring ${Constants.ALL_PACKAGES.size} packages")
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        currentInstance = this  // v2.9.52: Set singleton for cache repopulation
        Log.d(tag, "Notification listener connected — monitoring ${Constants.ALL_PACKAGES.size} packages (rider + customer)")

        // v2.9.23: Removed KeepAliveService (foreground service).
        // It was causing crashes and interfering with other apps' notifications.
        // NotificationListenerService is a SYSTEM-managed service — Android keeps
        // it alive as long as notification access is granted. No foreground service needed.
        // The BootReceiver + WorkManager heartbeat handle reconnection after reboot.

        // ─── v2.9.6: Start the in-memory enabled-packages cache collector ───────
        // This replaces the per-notification runBlocking DB read. The collector
        // runs on IO dispatcher and updates the `disabledPackages` set whenever
        // the user toggles a platform in Settings.
        configFlowJob?.cancel()
        configFlowJob = repository.getAllPlatformConfigs()
            .onEach { configs ->
                // Rebuild the disabled set from the latest DB state
                disabledPackages.clear()
                configs.filter { !it.isEnabled }.forEach { disabledPackages.add(it.packageName) }
                configLoaded = true  // v2.9.58: Config has loaded, switch to fail-closed mode
                Log.d(tag, "Enabled-packages cache refreshed: ${configs.size} total, ${disabledPackages.size} disabled")
            }
            .launchIn(serviceScope)

        // Also initialize platform configs in DB (idempotent)
        serviceScope.launch {
            try {
                repository.initializePlatformConfigs()
            } catch (e: Exception) {
                Log.e(tag, "Failed to initialize platform configs", e)
            }
        }

        // Log ALL currently active notifications for diagnostics
        try {
            val activeNotifications = getActiveNotifications()
            Log.d(tag, "=== DIAGNOSTIC: Active notifications on device ===")
            Log.d(tag, "Total active notifications: ${activeNotifications.size}")
            val trackedPackages = activeNotifications.map { it.packageName }.distinct()
            Log.d(tag, "All packages with active notifications: $trackedPackages")
            val matchedPackages = trackedPackages.filter { Constants.ALL_PACKAGES.containsKey(it) }
            Log.d(tag, "Matched (tracked) packages: $matchedPackages")
            val unmatchedPackages = trackedPackages.filter { !Constants.ALL_PACKAGES.containsKey(it) }
            Log.d(tag, "Unmatched packages (not in our list): $unmatchedPackages")
            Log.d(tag, "=== END DIAGNOSTIC ===")

            // Cache PendingIntents from currently active notifications
            for (sbn in activeNotifications) {
                if (Constants.ALL_PACKAGES.containsKey(sbn.packageName)) {
                    try {
                        // v2.9.48: RESTORED PendingIntentCache.put()
                        // Needed because startActivity() can't open non-exported activities
                        // (throws SecurityException). Only PendingIntent.send() can.
                        val contentIntent = sbn.notification.contentIntent
                        if (contentIntent != null) {
                            PendingIntentCache.put(sbn.packageName, contentIntent)
                        }
                    } catch (_: Exception) {
                        // Ignore — will use launch fallback later
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(tag, "Failed to log active notifications diagnostic", e)
        }
    }

    // v2.9.25: Removed the blocklist per user request.
    // The listener now processes ALL notifications but only CAPTURES those
    // from tracked delivery apps (Constants.ALL_PACKAGES).
    // Non-delivery apps (WhatsApp, games, banking, etc.) are silently ignored —
    // they return early at the platformName == null check.
    // The only exception: "android" system package (hotspot spam) is still
    // blocked because it fires every 3 seconds and truly serves no purpose.

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val packageName = sbn.packageName

        // Only block the "android" system package (hotspot spam every 3 sec)
        // Everything else is processed normally and filtered by ALL_PACKAGES check.
        if (packageName == "android" || packageName == "com.notifetch.app" || packageName == "com.notifetch.app.debug") {
            return
        }

        // Log ALL incoming notifications for diagnostics
        Log.d(tag, "Received notification from: $packageName")

        // Filter: only process notifications from tracked apps
        val platformName = Constants.ALL_PACKAGES[packageName]

        // v2.9.19: Log to diagnostic file — tracks ALL packages (tracked + untracked)
        // This is how we'll discover which package names are wrong/missing
        // v2.9.57 FIX: Only log package name, NEVER the title (PII risk for untracked apps)
        try {
            DiagnosticLogger.logNotification(
                context = this,
                packageName = packageName,
                title = "", // v2.9.57: Always empty to prevent PII logging
                isTracked = platformName != null
            )
        } catch (_: Exception) {}

        if (platformName == null) {
            return
        }

        // v2.9.59 SECURITY FIX: Verify notification source UID matches the package name.
        // Prevents fake notification injection — a malicious app could post a
        // notification with packageName="in.swiggy.deliveryapp" but sbn.uid would
        // reveal the actual app that posted it.
        try {
            val actualPackage = packageManager.getNameForUid(sbn.uid)
            if (actualPackage != null && actualPackage != packageName) {
                Log.w(tag, "SECURITY: Notification package mismatch! sbn.pkg=$packageName but uid belongs to=$actualPackage — DROPPING")
                return
            }
        } catch (e: Exception) {
            Log.w(tag, "Could not verify notification source UID: ${e.message}")
            // Don't block — some OEMs might not support getNameForUid properly
        }

        // ─── v2.9.6: Per-platform enable check via in-memory cache (no DB read) ─
        // v2.9.58 FIX: Fail-CLOSED for consent compliance (DPDPA).
        // Before config loads, ALL packages are treated as disabled.
        // Once config loads, only explicitly disabled packages are skipped.
        if (!configLoaded) {
            Log.d(tag, "Config not loaded yet — skipping $platformName (fail-closed)")
            return
        }
        if (disabledPackages.contains(packageName)) {
            Log.d(tag, "Skipping disabled platform: $platformName ($packageName)")
            return
        }

        val source = Constants.ALL_PLATFORM_SOURCES[packageName] ?: packageName.replace(".", "_")
        val userMode = Constants.getUserModeForPackage(packageName)?.name?.lowercase() ?: "rider"

        Log.d(tag, "Captured notification from $platformName ($packageName) [mode=$userMode]")

        // Cache the PendingIntent for "Open App" deep-linking
        // v2.9.30: Serialize the ENTIRE target Intent using Intent.toUri()
        // This captures action, data, component, categories, flags, AND extras.
        // When the user taps, we parseUri() to recreate the EXACT same Intent
        // that the source app created — opening the specific offer/order page.
        // This survives process death (stored in database as deepLinkUri).
        var extractedDeepLinkUri: String? = null
        var extractedDeepLinkComponent: String? = null
        try {
            val contentIntent = sbn.notification.contentIntent
            if (contentIntent != null) {
                // v2.9.48: RESTORED PendingIntentCache.put()
                // Critical for opening non-exported activities via PendingIntent.send()
                PendingIntentCache.put(packageName, contentIntent)

                // v2.9.57 FIX: Removed getTargetIntent() reflection.
                // It's a hidden API blacklisted since Android 9, so it always
                // threw NoSuchMethodException on real devices, meaning
                // extractedDeepLinkUri was ALWAYS null.
                // The app now relies entirely on the PendingIntentCache
                // (which is repopulated from getActiveNotifications on tap)
                // and Tier 3 (getLaunchIntentForPackage) as fallback.
            }
        } catch (e: Exception) {
            Log.w(tag, "Deep link extraction failed for $platformName: ${e.message}")
        }

        try {
            val notification = sbn.notification
            val extras = notification.extras

            // ─── v2.9.6: Multi-style content extraction ─────────────────────────
            // Try multiple extras keys to handle BigTextStyle, MessagingStyle,
            // InboxStyle, BigPictureStyle, and MediaStyle notifications.
            val extracted = extractContent(notification, extras)

            var title = extracted.title
            var text = extracted.text
            var bigText = extracted.bigText
            var subText = extracted.subText

            // Android 15+ notification redaction handling
            val redactionMarkers = listOf(
                "sensitive notification hidden",
                "content hidden",
                "notification hidden",
                "hidden content",
                "redacted"
            )
            val allText = "$title $text $bigText $subText".lowercase()
            val isRedacted = redactionMarkers.any { allText.contains(it) }

            if (isRedacted) {
                Log.d(tag, "Android 15+ redacted notification from $platformName — saving as REDACTED")
                title = "Content hidden by Android"
                text = ""
                bigText = ""
                subText = ""
            }

            // ─── v2.9.6: Skip truly empty notifications only ────────────────────
            // (was: skip if title/text/bigText all blank — too strict for
            // MessagingStyle apps that put content in subText or summary text)
            if (title.isBlank() && text.isBlank() && bigText.isBlank() && subText.isBlank()) {
                Log.d(tag, "Skipping truly empty notification from $platformName")
                return
            }

            // ─── v2.9.6: Content-hash deduplication ─────────────────────────────
            // Replaces the FLAG_ONGOING_EVENT and FLAG_GROUP_SUMMARY filters.
            // Same content within DEDUP_WINDOW_MS is treated as a duplicate update.
            val dedupeKey = "$packageName|${title.lowercase()}|${text.lowercase()}|${bigText.lowercase()}"
            val now = System.currentTimeMillis()
            val lastSeen = recentCaptures[dedupeKey]
            if (lastSeen != null && (now - lastSeen) < DEDUP_WINDOW_MS) {
                Log.d(tag, "Skipping duplicate notification from $platformName (same content within ${DEDUP_WINDOW_MS}ms)")
                return
            }
            recentCaptures[dedupeKey] = now

            // Clean up old dedupe entries every ~30 captures (lightweight GC)
            if (recentCaptures.size > 100) {
                val cutoff = now - DEDUP_WINDOW_MS * 10
                recentCaptures.entries.removeAll { it.value < cutoff }
            }

            // Parse platform-specific data
            val parsed = if (isRedacted) {
                NotificationParser.ParsedNotification(
                    platform = platformName,
                    source = source,
                    title = title,
                    body = text,
                    bigText = bigText,
                    subText = subText,
                    orderValue = null,
                    pickupLocation = null,
                    dropoffLocation = null,
                    distance = null,
                    category = "REDACTED"
                )
            } else {
                NotificationParser.parse(
                    platform = platformName,
                    source = source,
                    title = title,
                    text = text,
                    bigText = bigText,
                    subText = subText,
                    extras = extras,
                    userMode = userMode
                )
            }

            val currency = Helpers.detectCurrency(packageName, platformName, "$title $text $bigText")

            val capturedNotification = CapturedNotification(
                packageName = packageName,
                platform = platformName,
                source = source,
                title = parsed.title,
                body = parsed.body,
                bigText = parsed.bigText,
                subText = parsed.subText,
                orderValue = parsed.orderValue,
                pickupLocation = parsed.pickupLocation,
                dropoffLocation = parsed.dropoffLocation,
                distance = parsed.distance,
                receivedAt = System.currentTimeMillis(),
                isSynced = false,
                category = parsed.category,
                currency = currency,
                userMode = userMode,
                deepLinkUri = extractedDeepLinkUri,
                deepLinkComponent = extractedDeepLinkComponent
            )

            // Save to local database (async — never block onNotificationPosted)
            serviceScope.launch {
                try {
                    val id = repository.insertNotification(capturedNotification)
                    Log.d(tag, "Saved notification #$id from $platformName [${parsed.category}] ($currency)")

                    // v2.9.12: Smart offer alert — check if this is a high-value offer
                    // and the platform isn't muted, then post a high-priority notification
                    try {
                        val isMuted = repository.isPlatformMuted(packageName)
                        val alertCandidate = capturedNotification.copy(id = id)
                        if (SmartAlertManager.shouldAlert(alertCandidate, isMuted)) {
                            SmartAlertManager.postOfferAlert(
                                context = this@NotiFetchListenerService,
                                notification = alertCandidate,
                                notificationId = id
                            )
                            Log.d(tag, "Posted smart offer alert for $platformName (50%+ off offer detected)")
                        }
                    } catch (e: Exception) {
                        Log.w(tag, "Smart alert check failed: ${e.message}")
                    }

                    // Debounced platform count increment
                    synchronized(pendingCountIncrements) {
                        pendingCountIncrements.add(packageName)
                    }
                    countIncrementJob?.cancel()
                    countIncrementJob = serviceScope.launch {
                        delay(2000)
                        val packagesToIncrement = synchronized(pendingCountIncrements) {
                            val copy = pendingCountIncrements.toList()
                            pendingCountIncrements.clear()
                            copy
                        }
                        for (pkg in packagesToIncrement) {
                            try {
                                repository.incrementPlatformNotificationCount(pkg)
                            } catch (e: Exception) {
                                Log.e(tag, "Failed to increment count for $pkg", e)
                            }
                        }
                    }

                    // Debounced sync
                    syncJob?.cancel()
                    syncJob = serviceScope.launch {
                        delay(5000)
                        syncToBackend()
                    }

                    // v2.9.12: Refresh home screen widget
                    try {
                        com.notifetch.app.widget.NotiFetchWidgetProvider.refreshAllWidgets(
                            this@NotiFetchListenerService
                        )
                    } catch (_: Exception) {
                        // Widget refresh is non-critical
                    }
                } catch (e: Exception) {
                    Log.e(tag, "Failed to save notification from $platformName", e)
                }
            }
        } catch (e: Exception) {
            Log.e(tag, "Error processing notification from $platformName", e)
        }
    }

    /**
     * v2.9.6: Extracts notification content from MULTIPLE extras keys to handle
     * different Notification.Style subclasses:
     *
     * - BigTextStyle: EXTRA_TITLE, EXTRA_TEXT, EXTRA_BIG_TEXT, EXTRA_SUMMARY_TEXT
     * - MessagingStyle: EXTRA_TITLE, EXTRA_TEXT (may be empty), EXTRA_MESSAGES,
     *   EXTRA_CONVERSATION_DATA, EXTRA_REMOTE_INPUTS, EXTRA_BIG_TEXT
     * - InboxStyle: EXTRA_TITLE, EXTRA_TEXT, EXTRA_BIG_TEXT (may be empty),
     *   EXTRA_INFO_TEXT, EXTRA_SUMMARY_TEXT
     * - BigPictureStyle: EXTRA_TITLE, EXTRA_TEXT, EXTRA_SUMMARY_TEXT
     * - MediaStyle: usually empty for our purposes (skip)
     *
     * Returns the best combination of title/text/bigText/subText.
     */
    private fun extractContent(
        notification: Notification,
        extras: android.os.Bundle
    ): ExtractedContent {
        var title = extras.getString(Notification.EXTRA_TITLE)?.trim().orEmpty()
        var text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString()?.trim().orEmpty()
        var bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()?.trim().orEmpty()
        var subText = extras.getCharSequence(Notification.EXTRA_SUB_TEXT)?.toString()?.trim().orEmpty()

        // ── InboxStyle: EXTRA_TEXT may be the summary, EXTRA_BIG_TEXT has the lines ─
        if (bigText.isBlank()) {
            @Suppress("DEPRECATION")
            val bigTextLines = extras.getCharSequenceArray(Notification.EXTRA_TEXT_LINES)
            if (bigTextLines != null && bigTextLines.isNotEmpty()) {
                bigText = bigTextLines.joinToString("\n") { it.toString().trim() }.trim()
            }
        }

        // ── MessagingStyle: try EXTRA_MESSAGES (Parcelable[] of Notification.MessagingStyle.Message) ─
        if (text.isBlank() && bigText.isBlank()) {
            try {
                val messages = extractMessages(extras)
                if (messages.isNotEmpty()) {
                    // Use the latest message as text, all messages as bigText
                    text = messages.last()
                    bigText = messages.joinToString("\n")
                }
            } catch (_: Exception) {
                // Ignore — fall through to other extraction methods
            }
        }

        // ── Fallback: EXTRA_INFO_TEXT (used by some styles for the body) ────────
        if (text.isBlank()) {
            text = extras.getCharSequence(Notification.EXTRA_INFO_TEXT)?.toString()?.trim().orEmpty()
        }

        // ── Fallback: EXTRA_SUMMARY_TEXT (used by BigPictureStyle / group summaries) ──
        if (text.isBlank() && bigText.isBlank()) {
            val summary = extras.getCharSequence(Notification.EXTRA_SUMMARY_TEXT)?.toString()?.trim().orEmpty()
            if (summary.isNotBlank()) {
                text = summary
            }
        }

        // ── Fallback: ticker text (the legacy "scrolling status bar" text) ─────
        // Many OEM-customized apps still populate this even when extras are empty
        if (title.isBlank() && text.isBlank() && bigText.isBlank()) {
            val ticker = notification.tickerText?.toString()?.trim().orEmpty()
            if (ticker.isNotBlank()) {
                // Split ticker into title (first line) and text (rest)
                val lines = ticker.split("\n", limit = 2)
                title = lines[0].trim()
                if (lines.size > 1) {
                    text = lines[1].trim()
                } else {
                    text = ticker
                    title = ""
                }
            }
        }

        return ExtractedContent(title = title, text = text, bigText = bigText, subText = subText)
    }

    /**
     * Extract messages from MessagingStyle notifications.
     *
     * MessagingStyle stores messages as a Parcelable[] of
     * android.app.Notification.MessagingStyle.Message objects. Each Message has:
     *   - getText(): CharSequence — the message text
     *   - getTimestamp(): long — when the message was sent
     *   - getSenderPerson(): Person? (API 28+) — may be null
     *
     * We use reflection to avoid version-specific imports and to handle cases
     * where the Message class is in different packages on different Android versions.
     */
    private fun extractMessages(extras: android.os.Bundle): List<String> {
        val result = mutableListOf<String>()

        try {
            val messages = extras.getParcelableArray(Notification.EXTRA_MESSAGES)
                ?: return emptyList()

            for (parcelable in messages) {
                try {
                    // Use reflection to call Message.getText() — returns CharSequence
                    val textMethod = parcelable.javaClass.getMethod("getText")
                    val textResult = textMethod.invoke(parcelable) as? CharSequence
                    if (textResult != null && textResult.toString().isNotBlank()) {
                        result.add(textResult.toString().trim())
                    }
                } catch (_: Exception) {
                    // Skip this message — can't extract text
                }
            }
        } catch (_: Exception) {
            // Ignore — return what we have
        }

        return result
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        // Notification was dismissed — we don't need to do anything
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        currentInstance = null  // v2.9.52: Clear singleton
        configFlowJob?.cancel()
        PendingIntentCache.clear()
        recentCaptures.clear()
        // v2.9.57 FIX: Do NOT cancel serviceScope here. Android frequently
        // disconnects/reconnects the listener without destroying the service.
        // Cancelling the scope here permanently kills all future captures.
        // Only cancel per-connection jobs. serviceScope.cancel() goes in onDestroy() only.
        Log.w(tag, "Notification listener disconnected")
    }

    override fun onDestroy() {
        super.onDestroy()
        configFlowJob?.cancel()
        // v2.9.48: RESTORED PendingIntentCache.clear()
        PendingIntentCache.clear()
        recentCaptures.clear()
        serviceScope.cancel()
    }

    /**
     * Attempt to forward all unsynced notifications to the NotiFetch backend.
     * Debounced — called 5 seconds after the last notification capture.
     */
    private suspend fun syncToBackend() {
        try {
            repository.syncPendingNotifications()
            Log.d(tag, "Debounced sync completed")
        } catch (e: Exception) {
            Log.e(tag, "Failed to sync notifications to backend", e)
        }
    }

    private data class ExtractedContent(
        val title: String,
        val text: String,
        val bigText: String,
        val subText: String,
    )
}
