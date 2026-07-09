package com.notifetch.app.ui.theme

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * NotiFetch Design System v2.0 — "Clarity in Motion"
 *
 * Expanded with feedback: multiple background layers, glow colors,
 * glass-specific tokens, motion durations, shadow tokens, icon sizes,
 * animation curves.
 *
 * Brand Personality:
 *   Fast + Reliable + Intelligent + Minimal + Modern = PremiumTool
 */

// ═══════════════════════════════════════════════════════════════
// 1. BACKGROUND LAYERS (creates depth)
// ═══════════════════════════════════════════════════════════════

val BackgroundPrimary = Color(0xFF090B10)
val BackgroundSecondary = Color(0xFF10141B)
val BackgroundElevated = Color(0xFF161C25)

// Legacy compat
val LiquidBackground = BackgroundPrimary
val LiquidSurface = BackgroundSecondary
val LiquidSurfaceVariant = BackgroundElevated

// ═══════════════════════════════════════════════════════════════
// 2. ACCENT + GLOW COLORS
// ═══════════════════════════════════════════════════════════════

val Accent = Color(0xFF00D9FF)
val AccentDim = Color(0xFF0099B8)
val AccentGlow = Color(0xFF4DE7FF)
val AccentSoft = Color(0xFF8EF2FF)

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
// 3. TEXT HIERARCHY (WCAG AAA primary/secondary)
// ═══════════════════════════════════════════════════════════════

val TextPrimary = Color(0xFFFFFFFF)     // 19.3:1 contrast
val TextSecondary = Color(0xFFB0BEC5)   // 9.8:1 contrast
val TextTertiary = Color(0xFF78909C)    // 5.2:1 contrast
val TextDisabled = Color(0xFF455A64)    // 2.4:1 (disabled only)

// Legacy compat
val LiquidTextPrimary = TextPrimary
val LiquidTextSecondary = TextSecondary
val LiquidTextTertiary = TextTertiary

// ═══════════════════════════════════════════════════════════════
// 4. GLASS MATERIALS (specific tokens for each glass property)
// ═══════════════════════════════════════════════════════════════

val GlassTint = Color(0xFFFFFFFF)
val GlassBorder = Color(0xFFFFFFFF)
val GlassHighlight = Color(0xFFFFFFFF)
val GlassShadow = Color(0xFF000000)

// Glass opacity levels
const val GlassOpacityLow = 0.08f       // Background panels, chips
const val GlassOpacityMedium = 0.14f    // Cards, list items
const val GlassOpacityHigh = 0.20f      // Active, pressed, nav bar
const val GlassOpacitySolid = 0.28f     // Dialogs, sheets

// Border opacity
const val BorderOpacity = 0.20f         // Standard border
const val BorderOpacityHigh = 0.32f     // Premium border (your suggestion)

// Noise strength
const val GlassNoiseStrength = 0.04f    // FLAGSHIP only

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

val CornerXL = 28.dp    // Dialogs, sheets
val CornerCard = 22.dp  // Cards
val CornerButton = 16.dp // Buttons, chips
val CornerSmall = 12.dp // Small elements

val GLASS_CORNER_RADIUS = 22

// ═══════════════════════════════════════════════════════════════
// 6. BLUR RADII
// ═══════════════════════════════════════════════════════════════

val BlurStandard = 24.dp    // Cards, top bar
val BlurHigh = 32.dp        // Bottom nav
val BlurDialog = 40.dp      // Dialogs, sheets

// ═══════════════════════════════════════════════════════════════
// 7. SPACING SCALE
// ═══════════════════════════════════════════════════════════════

val SpaceXS = 4.dp
val SpaceS = 8.dp
val SpaceM = 16.dp
val SpaceL = 20.dp
val SpaceXL = 24.dp

// ═══════════════════════════════════════════════════════════════
// 8. ELEVATION + SHADOW TOKENS (separated per your feedback)
// ═══════════════════════════════════════════════════════════════

val ElevationLow = 2.dp
val ElevationMedium = 8.dp
val ElevationHigh = 12.dp

// Shadow presets (ambient + spot colors)
val ShadowSoft = 4.dp       // Cards at rest — soft ambient
val ShadowGlass = 8.dp      // Glass cards — soft with colored ambient
val ShadowFloating = 12.dp  // Nav bar, FAB — prominent float
val ShadowHero = 16.dp      // Dialogs — maximum elevation

// ═══════════════════════════════════════════════════════════════
// 9. ICON SIZING
// ═══════════════════════════════════════════════════════════════

val IconXS = 16.dp
val IconS = 20.dp
val IconM = 24.dp
val IconL = 32.dp

// ═══════════════════════════════════════════════════════════════
// 10. MOTION DURATIONS (not everything uses springs)
// ═══════════════════════════════════════════════════════════════

const val DurationFast = 120       // ms — button press, toggle
const val DurationNormal = 250     // ms — card appear, chip toggle
const val DurationSlow = 450       // ms — screen transition
const val DurationHero = 700       // ms — dialog, hero animation

// Spring config
const val PressScale = 0.96f
const val SpringDamping = 0.68f
const val SpringStiffness = 380f

// ═══════════════════════════════════════════════════════════════
// 11. ANIMATION CURVE TOKENS
// ═══════════════════════════════════════════════════════════════

// These map to Compose easing functions
// MotionStandard   → FastOutSlowInEasing (default, natural)
// MotionEmphasized → CubicBezier(0.2, 0.0, 0.0, 1.0) (energetic)
// MotionDecelerate  → LinearOutSlowInEasing (enters fast, slows down)
// MotionBounce      → Spring with low damping (playful)

// ═══════════════════════════════════════════════════════════════
// 12. TYPOGRAPHY SCALE
// ═══════════════════════════════════════════════════════════════

val FontDisplay = 48.sp    // Countdown numbers
val FontHeadline = 28.sp   // Today's count
val FontTitle = 20.sp      // Screen titles
val FontBodyLarge = 16.sp  // Notification titles
val FontBody = 14.sp       // Notification body
val FontCaption = 12.sp    // Timestamps, labels
val FontMicro = 10.sp      // Badges, chip labels

// ═══════════════════════════════════════════════════════════════
// 13. LEGACY COLORS (kept for backward compat during migration)
// ═══════════════════════════════════════════════════════════════

val md_theme_light_primary = Accent
val md_theme_light_onPrimary = Color(0xFF000000)
val md_theme_light_primaryContainer = Accent.copy(alpha = 0.15f)
val md_theme_light_onPrimaryContainer = Accent
val md_theme_light_secondary = Success
val md_theme_light_onSecondary = Color(0xFF000000)
val md_theme_light_secondaryContainer = Success.copy(alpha = 0.15f)
val md_theme_light_onSecondaryContainer = Success
val md_theme_light_tertiary = Warning
val md_theme_light_onTertiary = Color(0xFF000000)
val md_theme_light_tertiaryContainer = Warning.copy(alpha = 0.15f)
val md_theme_light_onTertiaryContainer = Warning
val md_theme_light_error = Error
val md_theme_light_onError = Color(0xFFFFFFFF)
val md_theme_light_errorContainer = Error.copy(alpha = 0.15f)
val md_theme_light_onErrorContainer = Error
val md_theme_light_background = BackgroundPrimary
val md_theme_light_onBackground = TextPrimary
val md_theme_light_surface = BackgroundSecondary
val md_theme_light_onSurface = TextPrimary
val md_theme_light_surfaceVariant = BackgroundElevated
val md_theme_light_onSurfaceVariant = TextSecondary
val md_theme_light_outline = TextTertiary
val md_theme_light_outlineVariant = TextTertiary.copy(alpha = 0.3f)

val md_theme_dark_primary = Accent
val md_theme_dark_onPrimary = Color(0xFF000000)
val md_theme_dark_primaryContainer = Accent.copy(alpha = 0.15f)
val md_theme_dark_onPrimaryContainer = Accent
val md_theme_dark_secondary = Success
val md_theme_dark_onSecondary = Color(0xFF000000)
val md_theme_dark_secondaryContainer = Success.copy(alpha = 0.15f)
val md_theme_dark_onSecondaryContainer = Success
val md_theme_dark_tertiary = Warning
val md_theme_dark_onTertiary = Color(0xFF000000)
val md_theme_dark_tertiaryContainer = Warning.copy(alpha = 0.15f)
val md_theme_dark_onTertiaryContainer = Warning
val md_theme_dark_error = Error
val md_theme_dark_onError = Color(0xFFFFFFFF)
val md_theme_dark_errorContainer = Error.copy(alpha = 0.15f)
val md_theme_dark_onErrorContainer = Error
val md_theme_dark_background = BackgroundPrimary
val md_theme_dark_onBackground = TextPrimary
val md_theme_dark_surface = BackgroundSecondary
val md_theme_dark_onSurface = TextPrimary
val md_theme_dark_surfaceVariant = BackgroundElevated
val md_theme_dark_onSurfaceVariant = TextSecondary
val md_theme_dark_outline = TextTertiary
val md_theme_dark_outlineVariant = TextTertiary.copy(alpha = 0.3f)

val BrandGradientStart = Accent
val BrandGradientEnd = AccentGlow

/**
 * Platform brand colors for identification (used in icon circles + card stripes only)
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
