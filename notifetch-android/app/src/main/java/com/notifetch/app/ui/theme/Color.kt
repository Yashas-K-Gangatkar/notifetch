package com.notifetch.app.ui.theme

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * NotiFetch Design System v2.1 — Coral + Amber, Light + Dark mode
 *
 * No blue. No cyan. Coral (#FF5A1F) as primary, Amber (#F59E0B) as glow.
 * Full light mode support.
 */

// ═══════════════════════════════════════════════════════════════
// 1. ACCENT COLORS (Coral + Amber — no blue)
// ═══════════════════════════════════════════════════════════════

val Accent = Color(0xFFFF5A1F)           // Coral/Orange — primary
val AccentDim = Color(0xFFCC4A1A)        // Dimmed coral
val AccentGlow = Color(0xFFFF8A4D)       // Lighter coral for glow
val AccentSoft = Color(0xFFFFB088)       // Soft coral for subtle effects
val AmberGold = Color(0xFFF59E0B)        // Amber/Gold — secondary highlight

val Success = Color(0xFF34D399)
val Warning = Color(0xFFFBBF24)
val Error = Color(0xFFF87171)

// Legacy compat
val LiquidAccent = Accent
val LiquidAccentDim = AccentDim
val LiquidSuccess = Success
val LiquidWarning = Warning
val LiquidError = Error

// ═══════════════════════════════════════════════════════════════
// 2. DARK MODE COLORS
// ═══════════════════════════════════════════════════════════════

val DarkBackgroundPrimary = Color(0xFF0B0F14)
val DarkBackgroundSecondary = Color(0xFF10141B)
val DarkBackgroundElevated = Color(0xFF161C25)

val DarkTextPrimary = Color(0xFFFFFFFF)
val DarkTextSecondary = Color(0xFFB0BEC5)
val DarkTextTertiary = Color(0xFF78909C)
val DarkTextDisabled = Color(0xFF455A64)

// Legacy compat
val LiquidBackground = DarkBackgroundPrimary
val LiquidSurface = DarkBackgroundSecondary
val LiquidSurfaceVariant = DarkBackgroundElevated
val LiquidTextPrimary = DarkTextPrimary
val LiquidTextSecondary = DarkTextSecondary
val LiquidTextTertiary = DarkTextTertiary
val BackgroundPrimary = DarkBackgroundPrimary
val BackgroundSecondary = DarkBackgroundSecondary
val BackgroundElevated = DarkBackgroundElevated
val TextPrimary = DarkTextPrimary
val TextSecondary = DarkTextSecondary
val TextTertiary = DarkTextTertiary
val TextDisabled = DarkTextDisabled

// ═══════════════════════════════════════════════════════════════
// 3. LIGHT MODE COLORS (warm cream — not harsh white)
// ═══════════════════════════════════════════════════════════════

val LightBackgroundPrimary = Color(0xFFFAF8F5)      // Warm cream
val LightBackgroundSecondary = Color(0xFFFFFFFF)     // Pure white surface
val LightBackgroundElevated = Color(0xFFF5F2EE)     // Slightly darker cream

val LightTextPrimary = Color(0xFF1A1A1A)            // Near black
val LightTextSecondary = Color(0xFF5A5A5A)           // Medium gray
val LightTextTertiary = Color(0xFF8A8A8A)            // Light gray
val LightTextDisabled = Color(0xFFB0B0B0)            // Disabled gray

// ═══════════════════════════════════════════════════════════════
// 4. GLASS MATERIALS
// ═══════════════════════════════════════════════════════════════

val GlassTint = Color(0xFFFFFFFF)
val GlassBorder = Color(0xFFFFFFFF)
val GlassHighlight = Color(0xFFFFFFFF)
val GlassShadow = Color(0xFF000000)

// Dark mode glass
val DarkGlassTint = Color(0xFFFFFFFF)
val DarkGlassBorder = Color(0xFFFFFFFF)

// Light mode glass (dark tint — frosted dark glass on light bg)
val LightGlassTint = Color(0xFF1A1A1A)
val LightGlassBorder = Color(0xFF1A1A1A)

// Glass opacity levels
const val GlassOpacityLow = 0.06f
const val GlassOpacityMedium = 0.10f
const val GlassOpacityHigh = 0.16f
const val GlassOpacitySolid = 0.24f

// Border opacity
const val BorderOpacity = 0.15f
const val BorderOpacityHigh = 0.25f

// Noise strength
const val GlassNoiseStrength = 0.03f

// Legacy compat
val GlassWhite = GlassTint
val GLASS_ALPHA_LOW = GlassOpacityLow
val GLASS_ALPHA_MEDIUM = GlassOpacityMedium
val GLASS_ALPHA_HIGH = GlassOpacityHigh
val GLASS_ALPHA_SOLID = GlassOpacitySolid
val GLASS_BORDER_ALPHA = BorderOpacity

// ═══════════════════════════════════════════════════════════════
// 5. CORNER RADIUS
// ═══════════════════════════════════════════════════════════════

val CornerXL = 28.dp
val CornerCard = 22.dp
val CornerButton = 16.dp
val CornerSmall = 12.dp

val GLASS_CORNER_RADIUS = 22

// ═══════════════════════════════════════════════════════════════
// 6. BLUR RADII
// ═══════════════════════════════════════════════════════════════

val BlurStandard = 24.dp
val BlurHigh = 32.dp
val BlurDialog = 40.dp

// ═══════════════════════════════════════════════════════════════
// 7. SPACING SCALE
// ═══════════════════════════════════════════════════════════════

val SpaceXS = 4.dp
val SpaceS = 8.dp
val SpaceM = 16.dp
val SpaceL = 20.dp
val SpaceXL = 24.dp

// ═══════════════════════════════════════════════════════════════
// 8. ELEVATION + SHADOW TOKENS
// ═══════════════════════════════════════════════════════════════

val ElevationLow = 2.dp
val ElevationMedium = 8.dp
val ElevationHigh = 12.dp

val ShadowSoft = 4.dp
val ShadowGlass = 8.dp
val ShadowFloating = 12.dp
val ShadowHero = 16.dp

// ═══════════════════════════════════════════════════════════════
// 9. ICON SIZING
// ═══════════════════════════════════════════════════════════════

val IconXS = 16.dp
val IconS = 20.dp
val IconM = 24.dp
val IconL = 32.dp

// ═══════════════════════════════════════════════════════════════
// 10. MOTION
// ═══════════════════════════════════════════════════════════════

const val DurationFast = 120
const val DurationNormal = 250
const val DurationSlow = 450
const val DurationHero = 700

const val PressScale = 0.96f
const val SpringDamping = 0.68f
const val SpringStiffness = 380f

// ═══════════════════════════════════════════════════════════════
// 11. TYPOGRAPHY SCALE
// ═══════════════════════════════════════════════════════════════

val FontDisplay = 48.sp
val FontHeadline = 28.sp
val FontTitle = 20.sp
val FontBodyLarge = 16.sp
val FontBody = 14.sp
val FontCaption = 12.sp
val FontMicro = 10.sp

// ═══════════════════════════════════════════════════════════════
// 12. MATERIAL 3 COLOR SCHEMES
// ═══════════════════════════════════════════════════════════════

// Dark scheme
val md_theme_dark_primary = Accent
val md_theme_dark_onPrimary = Color(0xFFFFFFFF)
val md_theme_dark_primaryContainer = Accent.copy(alpha = 0.15f)
val md_theme_dark_onPrimaryContainer = AccentGlow
val md_theme_dark_secondary = AmberGold
val md_theme_dark_onSecondary = Color(0xFF000000)
val md_theme_dark_secondaryContainer = AmberGold.copy(alpha = 0.15f)
val md_theme_dark_onSecondaryContainer = AmberGold
val md_theme_dark_tertiary = Warning
val md_theme_dark_onTertiary = Color(0xFF000000)
val md_theme_dark_tertiaryContainer = Warning.copy(alpha = 0.15f)
val md_theme_dark_onTertiaryContainer = Warning
val md_theme_dark_error = Error
val md_theme_dark_onError = Color(0xFFFFFFFF)
val md_theme_dark_errorContainer = Error.copy(alpha = 0.15f)
val md_theme_dark_onErrorContainer = Error
val md_theme_dark_background = DarkBackgroundPrimary
val md_theme_dark_onBackground = DarkTextPrimary
val md_theme_dark_surface = DarkBackgroundSecondary
val md_theme_dark_onSurface = DarkTextPrimary
val md_theme_dark_surfaceVariant = DarkBackgroundElevated
val md_theme_dark_onSurfaceVariant = DarkTextSecondary
val md_theme_dark_outline = DarkTextTertiary
val md_theme_dark_outlineVariant = DarkTextTertiary.copy(alpha = 0.3f)

// Light scheme
val md_theme_light_primary = Accent
val md_theme_light_onPrimary = Color(0xFFFFFFFF)
val md_theme_light_primaryContainer = Accent.copy(alpha = 0.12f)
val md_theme_light_onPrimaryContainer = AccentDim
val md_theme_light_secondary = AmberGold
val md_theme_light_onSecondary = Color(0xFFFFFFFF)
val md_theme_light_secondaryContainer = AmberGold.copy(alpha = 0.12f)
val md_theme_light_onSecondaryContainer = Color(0xFF92700A)
val md_theme_light_tertiary = Warning
val md_theme_light_onTertiary = Color(0xFFFFFFFF)
val md_theme_light_tertiaryContainer = Warning.copy(alpha = 0.12f)
val md_theme_light_onTertiaryContainer = Color(0xFF6B5800)
val md_theme_light_error = Error
val md_theme_light_onError = Color(0xFFFFFFFF)
val md_theme_light_errorContainer = Error.copy(alpha = 0.12f)
val md_theme_light_onErrorContainer = Error
val md_theme_light_background = LightBackgroundPrimary
val md_theme_light_onBackground = LightTextPrimary
val md_theme_light_surface = LightBackgroundSecondary
val md_theme_light_onSurface = LightTextPrimary
val md_theme_light_surfaceVariant = LightBackgroundElevated
val md_theme_light_onSurfaceVariant = LightTextSecondary
val md_theme_light_outline = LightTextTertiary
val md_theme_light_outlineVariant = LightTextTertiary.copy(alpha = 0.3f)

// Legacy gradient compat
val BrandGradientStart = Accent
val BrandGradientEnd = AmberGold

/**
 * Platform brand colors for identification
 */
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
        else -> Accent
    }
}
