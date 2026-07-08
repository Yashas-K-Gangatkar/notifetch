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
 * v2.9.74: GlassTheme — Centralized Liquid Glass configuration.
 *
 * Requirement #4: No component should hardcode glass values.
 * Every GlassSurface, GlassCard, GlassButton reads from this config.
 *
 * Three rendering modes auto-detect based on API level:
 * - FLAGSHIP (API 31+): Real GPU blur, specular highlights, noise
 * - BALANCED (API 26-30): Visual tricks (noise + specular, no blur)
 * - COMPATIBILITY (API 24-25): Premium translucent, minimal effects
 */
@Immutable
data class GlassThemeConfig(
    // ── Rendering Mode ──────────────────────────────────────────
    val mode: GlassMode,

    // ── Blur ────────────────────────────────────────────────────
    val blurRadius: Dp,              // Gaussian blur radius (0.dp if unavailable)

    // ── Transparency ────────────────────────────────────────────
    val glassOpacity: Float,         // Background tint (0.08 - 0.25)
    val borderOpacity: Float,        // White border (0.10 - 0.15)

    // ── Visual Effects ──────────────────────────────────────────
    val noiseStrength: Float,        // Noise texture alpha (0.0 - 0.06)
    val highlightIntensity: Float,   // Specular highlight (0.0 - 0.45)
    val shadowElevation: Dp,         // Ambient shadow depth (0 - 12.dp)

    // ── Shape ───────────────────────────────────────────────────
    val cornerRadius: Dp,            // Rounded corner radius (16 - 28.dp)

    // ── Motion ──────────────────────────────────────────────────
    val pressScale: Float,           // Button press compression (0.94 - 1.0)
    val springDamping: Float,        // Spring damping ratio (0.5 - 0.8)
    val springStiffness: Float,      // Spring stiffness (300 - 500)
)

enum class GlassMode {
    FLAGSHIP,        // API 31+ — real GPU blur
    BALANCED,        // API 26-30 — visual tricks, no blur
    COMPATIBILITY    // API 24-25 — premium translucent
}

/**
 * Auto-detect the best glass mode for the current device.
 */
fun detectGlassMode(): GlassMode {
    return when {
        android.os.Build.VERSION.SDK_INT >= 31 -> GlassMode.FLAGSHIP
        android.os.Build.VERSION.SDK_INT >= 26 -> GlassMode.BALANCED
        else -> GlassMode.COMPATIBILITY
    }
}

/**
 * Create a GlassThemeConfig for the given mode.
 * These are the benchmarked defaults — optimized for the performance targets:
 * - <3x overdraw
 * - 60 FPS mid-range, 90-120 FPS flagship
 * - <1% battery per hour
 */
fun glassThemeConfigFor(mode: GlassMode): GlassThemeConfig = when (mode) {
    GlassMode.FLAGSHIP -> GlassThemeConfig(
        mode = GlassMode.FLAGSHIP,
        blurRadius = 24.dp,
        glassOpacity = 0.12f,
        borderOpacity = 0.12f,
        noiseStrength = 0.04f,
        highlightIntensity = 0.45f,
        shadowElevation = 8.dp,
        cornerRadius = 24.dp,
        pressScale = 0.96f,
        springDamping = 0.6f,
        springStiffness = 400f
    )

    GlassMode.BALANCED -> GlassThemeConfig(
        mode = GlassMode.BALANCED,
        blurRadius = 0.dp,           // No GPU blur on API <31
        glassOpacity = 0.18f,        // Heavier tint to compensate
        borderOpacity = 0.12f,
        noiseStrength = 0.05f,       // Slightly stronger noise
        highlightIntensity = 0.35f,  // Slightly dimmer highlight
        shadowElevation = 4.dp,
        cornerRadius = 24.dp,
        pressScale = 0.97f,
        springDamping = 0.6f,
        springStiffness = 400f
    )

    GlassMode.COMPATIBILITY -> GlassThemeConfig(
        mode = GlassMode.COMPATIBILITY,
        blurRadius = 0.dp,
        glassOpacity = 0.22f,        // Heaviest tint
        borderOpacity = 0.15f,
        noiseStrength = 0.0f,        // No noise on old GPUs
        highlightIntensity = 0.0f,   // No highlight on old GPUs
        shadowElevation = 2.dp,
        cornerRadius = 20.dp,        // Slightly less rounded
        pressScale = 1.0f,           // No press animation on old devices
        springDamping = 0.6f,
        springStiffness = 400f
    )
}

// ── CompositionLocal ────────────────────────────────────────────
// Requirement #6: Glass rendering must be replaceable without rewriting screens.
// Screens read glass config from CompositionLocal, never hardcode values.

val LocalGlassTheme = compositionLocalOf<GlassThemeConfig> {
    error("GlassTheme not provided. Wrap your content in GlassTheme { }")
}

/**
 * GlassTheme provider — wraps the app and provides glass configuration.
 *
 * Usage:
 * ```
 * GlassTheme {
 *     NotiFetchTheme {
 *         // screens
 *     }
 * }
 * ```
 *
 * To replace glass rendering: provide a different GlassThemeConfig.
 * No screen code needs to change.
 */
@Composable
fun GlassTheme(
    config: GlassThemeConfig = glassThemeConfigFor(detectGlassMode()),
    content: @Composable () -> Unit
) {
    CompositionLocalProvider(LocalGlassTheme provides config) {
        content()
    }
}

/**
 * Access the current glass theme config.
 */
val currentGlassTheme: GlassThemeConfig
    @Composable
    @ReadOnlyComposable
    get() = LocalGlassTheme.current
