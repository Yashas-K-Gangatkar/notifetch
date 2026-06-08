package com.notifetch.app.ui.theme

import androidx.compose.ui.graphics.Color
import com.notifetch.app.util.Constants

// NotiFetch Brand Colors - Amber/Orange theme
val Amber50 = Color(0xFFFFF8E1)
val Amber100 = Color(0xFFFFECB3)
val Amber200 = Color(0xFFFFE082)
val Amber300 = Color(0xFFFFD54F)
val Amber400 = Color(0xFFFFCA28)
val Amber500 = Color(0xFFFFC107)
val Amber600 = Color(0xFFFFB300)
val Amber700 = Color(0xFFFFA000)
val Amber800 = Color(0xFFFF8F00)
val Amber900 = Color(0xFFFF6F00)

val Orange500 = Color(0xFFFF9800)
val Orange600 = Color(0xFFFB8C00)
val Orange700 = Color(0xFFF57C00)
val DeepOrange500 = Color(0xFFFF5722)
val DeepOrange600 = Color(0xFFF4511E)

// Light theme colors
val NotiFetchLightPrimary = Color(0xFFFF8F00)
val NotiFetchLightOnPrimary = Color(0xFFFFFFFF)
val NotiFetchLightPrimaryContainer = Color(0xFFFFE082)
val NotiFetchLightOnPrimaryContainer = Color(0xFF3E2500)
val NotiFetchLightSecondary = Color(0xFFF57C00)
val NotiFetchLightOnSecondary = Color(0xFFFFFFFF)
val NotiFetchLightSecondaryContainer = Color(0xFFFFDDB3)
val NotiFetchLightOnSecondaryContainer = Color(0xFF2E1500)
val NotiFetchLightTertiary = Color(0xFFD84315)
val NotiFetchLightOnTertiary = Color(0xFFFFFFFF)
val NotiFetchLightTertiaryContainer = Color(0xFFFFC4A8)
val NotiFetchLightOnTertiaryContainer = Color(0xFF3B0900)
val NotiFetchLightBackground = Color(0xFFFFFBF5)
val NotiFetchLightOnBackground = Color(0xFF1F1B16)
val NotiFetchLightSurface = Color(0xFFFFFBF5)
val NotiFetchLightOnSurface = Color(0xFF1F1B16)
val NotiFetchLightSurfaceVariant = Color(0xFFF0E6D8)
val NotiFetchLightOnSurfaceVariant = Color(0xFF504539)
val NotiFetchLightOutline = Color(0xFF827568)
val NotiFetchLightOutlineVariant = Color(0xFFD4C4B4)
val NotiFetchLightError = Color(0xFFBA1A1A)
val NotiFetchLightOnError = Color(0xFFFFFFFF)

// Dark theme colors
val NotiFetchDarkPrimary = Color(0xFFFFB300)
val NotiFetchDarkOnPrimary = Color(0xFF442B00)
val NotiFetchDarkPrimaryContainer = Color(0xFFFF8F00)
val NotiFetchDarkOnPrimaryContainer = Color(0xFFFFE082)
val NotiFetchDarkSecondary = Color(0xFFFFB870)
val NotiFetchDarkOnSecondary = Color(0xFF4B2800)
val NotiFetchDarkSecondaryContainer = Color(0xFF6B3B00)
val NotiFetchDarkOnSecondaryContainer = Color(0xFFFFDDB3)
val NotiFetchDarkTertiary = Color(0xFFFFB59A)
val NotiFetchDarkOnTertiary = Color(0xFF5F1500)
val NotiFetchDarkTertiaryContainer = Color(0xFF862200)
val NotiFetchDarkOnTertiaryContainer = Color(0xFFFFC4A8)
val NotiFetchDarkBackground = Color(0xFF1A1612)
val NotiFetchDarkOnBackground = Color(0xFFEDE0D4)
val NotiFetchDarkSurface = Color(0xFF1A1612)
val NotiFetchDarkOnSurface = Color(0xFFEDE0D4)
val NotiFetchDarkSurfaceVariant = Color(0xFF504539)
val NotiFetchDarkOnSurfaceVariant = Color(0xFFD4C4B4)
val NotiFetchDarkOutline = Color(0xFF9C8E80)
val NotiFetchDarkOutlineVariant = Color(0xFF504539)
val NotiFetchDarkError = Color(0xFFFFB4AB)
val NotiFetchDarkOnError = Color(0xFF690005)

/**
 * Get the brand color for a platform.
 *
 * IMPORTANT: This now resolves by PACKAGE NAME, not display name.
 * This ensures colors work correctly even when users customize platform names.
 *
 * @param platform The display name (may be customized by user)
 * @param packageName The Android package name (stable identifier)
 * @return The brand color for the platform
 */
fun getPlatformColor(platform: String, packageName: String? = null): Color {
    // Prefer package name lookup (most reliable — works regardless of user rename)
    if (packageName != null) {
        Constants.PLATFORM_COLORS[packageName]?.let { hex ->
            return parseHexColor(hex)
        }
    }

    // Fallback: try to match by display name (for backward compatibility)
    // This handles cases where packageName is not available
    Constants.PLATFORM_COLORS.entries.firstOrNull { (_, _) ->
        Constants.PARTNER_PACKAGES[packageName ?: ""] == platform
    }?.value?.let { hex ->
        return parseHexColor(hex)
    }

    // Last resort: try matching by display name against PARTNER_PACKAGES values
    for ((pkg, defaultName) in Constants.PARTNER_PACKAGES) {
        if (defaultName.equals(platform, ignoreCase = true)) {
            Constants.PLATFORM_COLORS[pkg]?.let { hex ->
                return parseHexColor(hex)
            }
        }
    }

    return Amber500
}

private fun parseHexColor(hex: String): Color {
    return try {
        Color(android.graphics.Color.parseColor(hex))
    } catch (e: Exception) {
        Amber500
    }
}
