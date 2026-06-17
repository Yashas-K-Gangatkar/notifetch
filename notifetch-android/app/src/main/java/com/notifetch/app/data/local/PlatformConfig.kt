package com.notifetch.app.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Per-platform configuration stored in Room database.
 *
 * Display name resolution logic:
 *   1. If customDisplayName is set (non-null) → use it
 *   2. Else → use displayName (the default brand name from Constants.PARTNER_PACKAGES)
 *
 * This "user choice" model allows users to customize platform names
 * while defaulting to real brand names for better UX and nominative fair use.
 */
@Entity(tableName = "platform_configs")
data class PlatformConfig(
    @PrimaryKey
    val packageName: String,
    val displayName: String,            // Default brand name (e.g., "Swiggy Delivery")
    val customDisplayName: String? = null,  // User's custom name (e.g., "Swiggy", "Z", "My Delivery App")
    val isEnabled: Boolean = true,
    val notificationCount: Int = 0,
    val lastNotificationAt: Long? = null,
    val userMode: String = "rider", // "rider" or "customer"
    // v2.9.12: Favorites/mute list
    val isFavorite: Boolean = false, // Starred platforms appear at top of Home
    val isMuted: Boolean = false    // Muted platforms don't trigger smart alerts
) {
    /**
     * Returns the display name the user sees.
     * Prioritizes custom name if set, otherwise falls back to default.
     */
    val resolvedDisplayName: String
        get() = customDisplayName ?: displayName
}
