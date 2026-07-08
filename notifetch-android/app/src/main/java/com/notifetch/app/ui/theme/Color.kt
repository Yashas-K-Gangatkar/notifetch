package com.notifetch.app.ui.theme

import androidx.compose.ui.graphics.Color

// ═══════════════════════════════════════════════════════════════
// v2.9.73: Liquid Glass Color System
// ═══════════════════════════════════════════════════════════════

// Primary backgrounds — deep dark with slight blue tint
val LiquidBackground = Color(0xFF0B0F14)
val LiquidSurface = Color(0xFF111820)
val LiquidSurfaceVariant = Color(0xFF1A2330)

// Glass colors — semi-transparent whites for frosted effect
val GlassWhite = Color(0xFFFFFFFF)
val GlassHighlight = Color(0xFFFFFFFF)

// Accent colors — vibrant, high-contrast
val LiquidAccent = Color(0xFF00D9FF)      // Cyan — primary accent
val LiquidAccentDim = Color(0xFF0099B8)   // Dimmed cyan
val LiquidSuccess = Color(0xFF22C55E)      // Green
val LiquidWarning = Color(0xFFF59E0B)      // Amber
val LiquidError = Color(0xFFEF4444)        // Red

// Text colors — high contrast for readability
val LiquidTextPrimary = Color(0xFFFFFFFF)
val LiquidTextSecondary = Color(0xFFB0BEC5)
val LiquidTextTertiary = Color(0xFF78909C)

// Glass opacity levels
const val GLASS_ALPHA_LOW = 0.08f      // Very subtle
const val GLASS_ALPHA_MEDIUM = 0.12f   // Default cards
const val GLASS_ALPHA_HIGH = 0.18f     // Prominent surfaces
const val GLASS_ALPHA_SOLID = 0.25f    // Dialogs/sheets

// Border opacity
const val GLASS_BORDER_ALPHA = 0.12f   // 10-15% white border

// Corner radius
const val GLASS_CORNER_RADIUS = 24     // dp

// Legacy colors kept for backward compat
val md_theme_light_primary = Color(0xFFFF5A1F)
val md_theme_light_onPrimary = Color(0xFFFFFFFF)
val md_theme_light_primaryContainer = Color(0xFFFFDBCF)
val md_theme_light_onPrimaryContainer = Color(0xFF3A0B00)
val md_theme_light_secondary = Color(0xFF77574B)
val md_theme_light_onSecondary = Color(0xFFFFFFFF)
val md_theme_light_secondaryContainer = Color(0xFFFFDBCF)
val md_theme_light_onSecondaryContainer = Color(0xFF2C150D)
val md_theme_light_tertiary = Color(0xFF6C5D2F)
val md_theme_light_onTertiary = Color(0xFFFFFFFF)
val md_theme_light_tertiaryContainer = Color(0xFFF6E0A6)
val md_theme_light_onTertiaryContainer = Color(0xFF221B00)
val md_theme_light_error = Color(0xFFBA1A1A)
val md_theme_light_onError = Color(0xFFFFFFFF)
val md_theme_light_errorContainer = Color(0xFFFFDAD6)
val md_theme_light_onErrorContainer = Color(0xFF410002)
val md_theme_light_background = Color(0xFFFFF8F5)
val md_theme_light_onBackground = Color(0xFF221A14)
val md_theme_light_surface = Color(0xFFFFF8F5)
val md_theme_light_onSurface = Color(0xFF221A14)
val md_theme_light_surfaceVariant = Color(0xFFF4DED3)
val md_theme_light_onSurfaceVariant = Color(0xFF52443B)
val md_theme_light_outline = Color(0xFF85746A)
val md_theme_light_outlineVariant = Color(0xFFD7C2B7)

val md_theme_dark_primary = Color(0xFFFFB59B)
val md_theme_dark_onPrimary = Color(0xFF5B1A02)
val md_theme_dark_primaryContainer = Color(0xFF832A0E)
val md_theme_dark_onPrimaryContainer = Color(0xFFFFDBCF)
val md_theme_dark_secondary = Color(0xFFE7B59C)
val md_theme_dark_onSecondary = Color(0xFF442A1E)
val md_theme_dark_secondaryContainer = Color(0xFF5D4032)
val md_theme_dark_onSecondaryContainer = Color(0xFFFFDBCF)
val md_theme_dark_tertiary = Color(0xFFD9C47D)
val md_theme_dark_onTertiary = Color(0xFF3A2F00)
val md_theme_dark_tertiaryContainer = Color(0xFF534613)
val md_theme_dark_onTertiaryContainer = Color(0xFFF6E0A6)
val md_theme_dark_error = Color(0xFFFFB4AB)
val md_theme_dark_onError = Color(0xFF690005)
val md_theme_dark_errorContainer = Color(0xFF93000A)
val md_theme_dark_onErrorContainer = Color(0xFFFFDAD6)
val md_theme_dark_background = Color(0xFF000000)
val md_theme_dark_onBackground = Color(0xFFFFFFFF)
val md_theme_dark_surface = Color(0xFF000000)
val md_theme_dark_onSurface = Color(0xFFFFFFFF)
val md_theme_dark_surfaceVariant = Color(0xFF1A1A1A)
val md_theme_dark_onSurfaceVariant = Color(0xFFCCCCCC)
val md_theme_dark_outline = Color(0xFF9F8B80)
val md_theme_dark_outlineVariant = Color(0xFF52443B)

// Brand gradient (kept for backward compat)
val BrandGradientStart = Color(0xFFFF5A1F)
val BrandGradientEnd = Color(0xFFFF8F00)


// v2.9.73: Platform color helper (kept from original)
fun getPlatformColor(platform: String, packageName: String): Color {
    return when {
        platform.contains("Swiggy", ignoreCase = true) -> Color(0xFFFC8019)
        platform.contains("Zomato", ignoreCase = true) -> Color(0xFFE23744)
        platform.contains("Domino", ignoreCase = true) -> Color(0xFF006491)
        platform.contains("Blinkit", ignoreCase = true) -> Color(0xFF0C831F)
        platform.contains("Zepto", ignoreCase = true) -> Color(0xFF8B5CF6)
        platform.contains("Uber", ignoreCase = true) -> Color(0xFF000000)
        platform.contains("Rapido", ignoreCase = true) -> Color(0xFFFFE000)
        platform.contains("Porter", ignoreCase = true) -> Color(0xFF1A237E)
        else -> Color(0xFFFF5A1F)
    }
}
