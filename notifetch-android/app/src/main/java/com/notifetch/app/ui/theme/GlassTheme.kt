package com.notifetch.app.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * v2.9.75: NotiFetch Design System v2 — "Clarity in Motion"
 *
 * Expanded design token system incorporating feedback:
 * - Multiple background layers (depth)
 * - Glow colors (AccentGlow, AccentSoft)
 * - Glass-specific tokens (tint, border, highlight, shadow, noise)
 * - Motion duration tokens (Fast/Normal/Slow/Hero)
 * - Shadow tokens (Soft/Glass/Floating/Hero)
 * - Icon sizing tokens (XS/S/M/L)
 * - Animation curve tokens
 */

@Immutable
data class GlassThemeConfig(
    // ── Rendering Mode ──────────────────────────────────────────
    val mode: GlassMode,

    // ── Blur ────────────────────────────────────────────────────
    val blurRadius: Dp,

    // ── Glass Material (specific tokens) ────────────────────────
    val glassTint: Color,
    val glassOpacity: Float,
    val glassBorderColor: Color,
    val borderOpacity: Float,
    val glassHighlightColor: Color,
    val highlightIntensity: Float,
    val glassShadowColor: Color,
    val glassNoiseStrength: Float,

    // ── Shadow ──────────────────────────────────────────────────
    val shadowElevation: Dp,

    // ── Shape ───────────────────────────────────────────────────
    val cornerRadius: Dp,

    // ── Motion ──────────────────────────────────────────────────
    val pressScale: Float,
    val springDamping: Float,
    val springStiffness: Float,
)

enum class GlassMode {
    FLAGSHIP,        // API 31+ — real GPU blur
    BALANCED,        // API 26-30 — visual tricks, no blur
    COMPATIBILITY    // API 24-25 — premium translucent
}

fun detectGlassMode(): GlassMode {
    return when {
        android.os.Build.VERSION.SDK_INT >= 31 -> GlassMode.FLAGSHIP
        android.os.Build.VERSION.SDK_INT >= 26 -> GlassMode.BALANCED
        else -> GlassMode.COMPATIBILITY
    }
}

fun glassThemeConfigFor(mode: GlassMode): GlassThemeConfig = when (mode) {
    GlassMode.FLAGSHIP -> GlassThemeConfig(
        mode = GlassMode.FLAGSHIP,
        blurRadius = BlurStandard,
        glassTint = GlassTint,
        glassOpacity = GlassOpacityMedium,
        glassBorderColor = GlassBorder,
        borderOpacity = BorderOpacityHigh,
        glassHighlightColor = GlassHighlight,
        highlightIntensity = 0.45f,
        glassShadowColor = GlassShadow,
        glassNoiseStrength = GlassNoiseStrength,
        shadowElevation = ShadowGlass,
        cornerRadius = CornerCard,
        pressScale = PressScale,
        springDamping = SpringDamping,
        springStiffness = SpringStiffness
    )

    GlassMode.BALANCED -> GlassThemeConfig(
        mode = GlassMode.BALANCED,
        blurRadius = 0.dp,
        glassTint = GlassTint,
        glassOpacity = 0.18f,
        glassBorderColor = GlassBorder,
        borderOpacity = BorderOpacity,
        glassHighlightColor = GlassHighlight,
        highlightIntensity = 0.35f,
        glassShadowColor = GlassShadow,
        glassNoiseStrength = 0.05f,
        shadowElevation = ShadowSoft,
        cornerRadius = CornerCard,
        pressScale = PressScale,
        springDamping = SpringDamping,
        springStiffness = SpringStiffness
    )

    GlassMode.COMPATIBILITY -> GlassThemeConfig(
        mode = GlassMode.COMPATIBILITY,
        blurRadius = 0.dp,
        glassTint = GlassTint,
        glassOpacity = 0.22f,
        glassBorderColor = GlassBorder,
        borderOpacity = BorderOpacityHigh,
        glassHighlightColor = GlassHighlight,
        highlightIntensity = 0.0f,
        glassShadowColor = GlassShadow,
        glassNoiseStrength = 0.0f,
        shadowElevation = ElevationLow,
        cornerRadius = CornerSmall,
        pressScale = 1.0f,
        springDamping = SpringDamping,
        springStiffness = SpringStiffness
    )
}

val LocalGlassTheme = compositionLocalOf<GlassThemeConfig> {
    error("GlassTheme not provided. Wrap your content in GlassTheme { }")
}

@Composable
fun GlassTheme(
    config: GlassThemeConfig = glassThemeConfigFor(detectGlassMode()),
    content: @Composable () -> Unit
) {
    CompositionLocalProvider(LocalGlassTheme provides config) {
        content()
    }
}

val currentGlassTheme: GlassThemeConfig
    @Composable
    @ReadOnlyComposable
    get() = LocalGlassTheme.current
