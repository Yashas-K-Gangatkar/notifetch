package com.notifetch.app.ui.theme

import androidx.compose.ui.graphics.Color
import com.notifetch.app.util.Constants

// Primary - Amber/Orange brand colors (matching web app)
val Amber500 = Color(0xFFF59E0B)
val Amber600 = Color(0xFFD97706)
val Orange500 = Color(0xFFF97316)
val Orange600 = Color(0xFFEA580C)

// Light Theme
val md_theme_light_primary = Amber600
val md_theme_light_onPrimary = Color.White
val md_theme_light_primaryContainer = Color(0xFFFED8AA)
val md_theme_light_onPrimaryContainer = Color(0xFF2A1500)
val md_theme_light_secondary = Color(0xFF715A41)
val md_theme_light_onSecondary = Color.White
val md_theme_light_secondaryContainer = Color(0xFFFBDDBC)
val md_theme_light_onSecondaryContainer = Color(0xFF271906)
val md_theme_light_tertiary = Color(0xFF55643C)
val md_theme_light_onTertiary = Color.White
val md_theme_light_tertiaryContainer = Color(0xFFD8EAB6)
val md_theme_light_onTertiaryContainer = Color(0xFF131F00)
val md_theme_light_error = Color(0xFFBA1A1A)
val md_theme_light_onError = Color.White
val md_theme_light_errorContainer = Color(0xFFFFDAD6)
val md_theme_light_onErrorContainer = Color(0xFF410002)
val md_theme_light_background = Color(0xFFFFFBFF)
val md_theme_light_onBackground = Color(0xFF1F1B16)
val md_theme_light_surface = Color(0xFFFFFBFF)
val md_theme_light_onSurface = Color(0xFF1F1B16)
val md_theme_light_surfaceVariant = Color(0xFFF2E0CF)
val md_theme_light_onSurfaceVariant = Color(0xFF51443A)
val md_theme_light_outline = Color(0xFF837469)
val md_theme_light_outlineVariant = Color(0xFFD5C3B4)

// Dark Theme
val md_theme_dark_primary = Amber500
val md_theme_dark_onPrimary = Color(0xFF442B00)
val md_theme_dark_primaryContainer = Color(0xFF614000)
val md_theme_dark_onPrimaryContainer = Color(0xFFFED8AA)
val md_theme_dark_secondary = Color(0xFFDEC1A1)
val md_theme_dark_onSecondary = Color(0xFF3E2D17)
val md_theme_dark_secondaryContainer = Color(0xFF57432C)
val md_theme_dark_onSecondaryContainer = Color(0xFFFBDDBC)
val md_theme_dark_tertiary = Color(0xFFBCCE9C)
val md_theme_dark_onTertiary = Color(0xFF273510)
val md_theme_dark_tertiaryContainer = Color(0xFF3E4C25)
val md_theme_dark_onTertiaryContainer = Color(0xFFD8EAB6)
val md_theme_dark_error = Color(0xFFFFB4AB)
val md_theme_dark_onError = Color(0xFF690005)
val md_theme_dark_errorContainer = Color(0xFF93000A)
val md_theme_dark_onErrorContainer = Color(0xFFFFDAD6)
val md_theme_dark_background = Color(0xFF1F1B16)
val md_theme_dark_onBackground = Color(0xFFEAE0D6)
val md_theme_dark_surface = Color(0xFF1F1B16)
val md_theme_dark_onSurface = Color(0xFFEAE0D6)
val md_theme_dark_surfaceVariant = Color(0xFF51443A)
val md_theme_dark_onSurfaceVariant = Color(0xFFD5C3B4)
val md_theme_dark_outline = Color(0xFF9D8E80)
val md_theme_dark_outlineVariant = Color(0xFF51443A)

// Brand gradient colors
val BrandGradientStart = Amber500
val BrandGradientEnd = Orange500

// Legacy aliases for backward compatibility with getPlatformColor fallback
val Amber50 = Color(0xFFFFF8E1)
val Amber100 = Color(0xFFFFECB3)

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
    // Primary lookup: by package name (most reliable — works regardless of user rename)
    if (packageName != null) {
        Constants.ALL_PLATFORM_COLORS[packageName]?.let { hex ->
            return parseHexColor(hex)
        }
    }

    // Fallback: match display name against ALL_PACKAGES values to find the
    // package name, then look up the color. This handles cases where packageName
    // is null but we still have the display name.
    for ((pkg, defaultName) in Constants.ALL_PACKAGES) {
        if (defaultName.equals(platform, ignoreCase = true)) {
            Constants.ALL_PLATFORM_COLORS[pkg]?.let { hex ->
                return parseHexColor(hex)
            }
        }
    }

    // Last resort: try matching platform display name directly (partial match)
    // This catches custom display names that might partially match default names
    Constants.ALL_PLATFORM_COLORS.entries.firstOrNull { (pkg, _) ->
        val defaultName = Constants.ALL_PACKAGES[pkg]
        defaultName != null && defaultName.contains(platform, ignoreCase = true)
    }?.value?.let { hex ->
        return parseHexColor(hex)
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
