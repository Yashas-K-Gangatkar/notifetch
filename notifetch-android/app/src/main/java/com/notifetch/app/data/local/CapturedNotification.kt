package com.notifetch.app.data.local

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "captured_notifications",
    indices = [
        Index(value = ["packageName"]),
        Index(value = ["platform"]),
        Index(value = ["receivedAt"]),
        Index(value = ["isSynced"]),
        Index(value = ["userMode"])
    ]
)
data class CapturedNotification(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val packageName: String,
    val platform: String,
    val source: String,
    val title: String,
    val body: String,
    val bigText: String,
    val subText: String,
    val orderValue: Double?,
    val pickupLocation: String?,
    val dropoffLocation: String?,
    val distance: String?,
    // NOTE: extrasJson removed for legal compliance — storing raw notification
    // extras could contain PII, auth tokens, or data beyond what the user sees.
    // Only title, text, bigText, subText are stored (visible notification content).
    val receivedAt: Long,
    val isSynced: Boolean = false,
    val syncedAt: Long? = null,
    val isRead: Boolean = false,
    val category: String?,
    val currency: String = "INR", // Currency for order value
    val userMode: String = "rider", // "rider" or "customer" — which mode captured this

    // ─── v2.9.8: Deep link persistence ────────────────────────────────────────
    // When the source app posts a notification, it includes a contentIntent
    // (PendingIntent) that fires when the user taps the notification in the
    // status bar. That PendingIntent's target Intent usually deep-links to the
    // specific screen the notification is about (offer, order tracking, etc.).
    //
    // We extract the target Intent's data URI and component (package + class)
    // and store them here. When the user taps "Open App" in NotiFetch, we
    // try to launch this deep link FIRST, before falling back to the app's
    // main screen. This survives process death (the in-memory PendingIntentCache
    // does not).
    //
    // Privacy: We only store the URI string and component name — never the
    // extras bundle (which could contain PII/auth tokens).
    val deepLinkUri: String? = null,
    val deepLinkComponent: String? = null, // "packageName/className" if resolvable
)
