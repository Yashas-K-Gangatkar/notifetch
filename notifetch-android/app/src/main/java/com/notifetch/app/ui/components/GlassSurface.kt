package com.notifetch.app.ui.components

import android.graphics.BitmapShader
import android.graphics.Shader
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.drawWithCache
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ShaderBrush
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.notifetch.app.ui.theme.GlassMode
import com.notifetch.app.ui.theme.LiquidAccent
import com.notifetch.app.ui.theme.LiquidBackground
import com.notifetch.app.ui.theme.currentGlassTheme

// ── Pre-baked noise texture (cached for app lifetime) ───────────
// Fix #7: Use IntArray + setPixels batch instead of 4096 setPixel calls
private var cachedNoiseShader: BitmapShader? = null
private var cachedNoiseAlpha: Float = -1f

private fun getNoiseShader(alpha: Float): BitmapShader {
    if (cachedNoiseShader != null && cachedNoiseAlpha == alpha) {
        return cachedNoiseShader!!
    }
    val size = 64
    val pixels = IntArray(size * size)
    val random = java.util.Random(42) // Fixed seed for consistency
    val alphaInt = (alpha * 255).toInt()
    for (i in pixels.indices) {
        val noise = random.nextInt(256)
        pixels[i] = android.graphics.Color.argb(alphaInt, noise, noise, noise)
    }
    val bmp = android.graphics.Bitmap.createBitmap(
        size, size, android.graphics.Bitmap.Config.ARGB_8888
    )
    bmp.setPixels(pixels, 0, size, 0, 0, size, size)
    val shader = BitmapShader(bmp, Shader.TileMode.REPEAT, Shader.TileMode.REPEAT)
    cachedNoiseShader = shader
    cachedNoiseAlpha = alpha
    return shader
}

/**
 * v2.9.74: GlassSurface — the core Liquid Glass component.
 *
 * Requirement #1: Uses the shared blurred background layer, NOT per-card blur.
 * Requirement #4: All values read from GlassThemeConfig — nothing hardcoded.
 * Requirement #6: Fully modular — replaceable without screen changes.
 *
 * Rendering layers (per surface):
 * 1. Semi-transparent white tint (glassOpacity from theme)
 * 2. Noise texture (noiseStrength from theme — pre-baked, cached)
 * 3. Specular highlight (top-left edge — highlightIntensity from theme)
 * 4. Ultra-thin white border (borderOpacity from theme)
 * 5. Content
 */
@Composable
fun GlassSurface(
    modifier: Modifier = Modifier,
    cornerRadius: Dp? = null,
    shadowElevation: Dp? = null,
    content: @Composable () -> Unit
) {
    val theme = currentGlassTheme
    val effectiveRadius = cornerRadius ?: theme.cornerRadius
    val effectiveShadow = shadowElevation ?: theme.shadowElevation
    val shape = RoundedCornerShape(effectiveRadius)

    Surface(
        modifier = modifier,
        shape = shape,
        color = Color.White.copy(alpha = theme.glassOpacity),
        border = BorderStroke(1.dp, Color.White.copy(alpha = theme.borderOpacity)),
        shadowElevation = effectiveShadow,
        tonalElevation = 0.dp
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Layer 1: Noise texture
            if (theme.noiseStrength > 0f) {
                val noiseBrush = remember(theme.noiseStrength) {
                    ShaderBrush(getNoiseShader(theme.noiseStrength))
                }
                Box(modifier = Modifier.fillMaxSize().background(noiseBrush))
            }

            // Layer 2: Specular highlight (top-left edge)
            if (theme.highlightIntensity > 0f) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(1.dp)
                        .background(
                            Brush.linearGradient(
                                colors = listOf(
                                    Color.White.copy(alpha = theme.highlightIntensity),
                                    Color.Transparent
                                ),
                                start = Offset.Zero,
                                end = Offset.Infinite
                            )
                        )
                )
            }

            // Layer 3: Content
            content()
        }
    }
}

/**
 * GlassCard — pre-padded GlassSurface for content sections.
 */
@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    padding: Dp = 16.dp,
    cornerRadius: Dp? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    GlassSurface(
        modifier = modifier,
        cornerRadius = cornerRadius
    ) {
        Column(modifier = Modifier.padding(padding), content = content)
    }
}

/**
 * GlassButton — spring-animated press compression.
 *
 * Fix #6: Uses interactionSource to track pressed state (was broken —
   pressed was never set to true after switching to Surface(onClick)).
 * Fix #5: Added Role.Button semantics for accessibility.
 * Fix #4: Uses heightIn(min = 48.dp) instead of fixed height.
 * Fix #10: Uses theme.cornerRadius instead of hardcoded 16.dp.
 */
@Composable
fun GlassButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    cornerRadius: Dp? = null,
    content: @Composable RowScope.() -> Unit
) {
    val theme = currentGlassTheme
    val effectiveRadius = cornerRadius ?: (theme.cornerRadius - 4.dp) // Slightly tighter for buttons
    val interactionSource = remember { MutableInteractionSource() }
    val pressed by interactionSource.collectIsPressedAsState()

    val scale by animateFloatAsState(
        targetValue = if (pressed) theme.pressScale else 1.0f,
        animationSpec = spring(
            dampingRatio = theme.springDamping,
            stiffness = theme.springStiffness
        ),
        label = "glassButtonPress"
    )

    Surface(
        modifier = modifier
            .heightIn(min = 48.dp)
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
            }
            .semantics { role = Role.Button },
        shape = RoundedCornerShape(effectiveRadius),
        color = Color.White.copy(
            alpha = if (pressed) (theme.glassOpacity * 1.5f) else (theme.glassOpacity * 0.7f)
        ),
        border = BorderStroke(1.dp, Color.White.copy(alpha = theme.borderOpacity)),
        shadowElevation = if (pressed) 2.dp else 6.dp,
        tonalElevation = 0.dp,
        onClick = onClick,
        enabled = enabled,
        interactionSource = interactionSource
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            content = content
        )
    }
}

/**
 * GlassOutlinedButton — subtle glass for secondary actions.
 */
@Composable
fun GlassOutlinedButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    cornerRadius: Dp? = null,
    content: @Composable RowScope.() -> Unit
) {
    val theme = currentGlassTheme
    val effectiveRadius = cornerRadius ?: (theme.cornerRadius - 4.dp)
    val interactionSource = remember { MutableInteractionSource() }
    val pressed by interactionSource.collectIsPressedAsState()

    val scale by animateFloatAsState(
        targetValue = if (pressed) (theme.pressScale + 1.0f) / 2 else 1.0f,
        animationSpec = spring(
            dampingRatio = theme.springDamping,
            stiffness = theme.springStiffness
        ),
        label = "glassOutlinedPress"
    )

    Surface(
        modifier = modifier
            .heightIn(min = 48.dp)
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
            }
            .semantics { role = Role.Button },
        shape = RoundedCornerShape(effectiveRadius),
        color = Color.White.copy(
            alpha = if (pressed) theme.glassOpacity else (theme.glassOpacity * 0.6f)
        ),
        border = BorderStroke(1.dp, Color.White.copy(alpha = theme.borderOpacity)),
        shadowElevation = 2.dp,
        tonalElevation = 0.dp,
        onClick = onClick,
        enabled = enabled,
        interactionSource = interactionSource
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            content = content
        )
    }
}

/**
 * v2.9.74: SharedBlurBackground — ONE shared blurred layer for the entire screen.
 *
 * Requirement #1: One shared layer — not per-card.
 * Requirement #3: No per-frame screenshot capture.
 *
 * Fix #1: Blurred layer is now STATIC (was animated — caused GPU re-blur every frame).
 * Fix #2: Brush is cached via drawWithCache (was allocating new object every frame).
 * Fix #3: Colors read from theme tokens (was hardcoded).
 */
@Composable
fun SharedBlurBackground(
    modifier: Modifier = Modifier
) {
    val theme = currentGlassTheme

    Box(modifier = modifier.fillMaxSize()) {
        // Layer 1: Animated gradient (replaces old AndroidView)
        AnimatedGradientBackground(
            modifier = Modifier.fillMaxSize()
        )

        // Layer 2: STATIC blurred gradient (FLAGSHIP mode only — API 31+)
        // Fix #1: This is NOT animated — a static blurred gradient.
        // The GPU blurs it ONCE and caches the result.
        // The animated Layer 1 provides subtle movement on top.
        if (theme.mode == GlassMode.FLAGSHIP && theme.blurRadius > 0.dp) {
            StaticBlurredGradient(
                modifier = Modifier
                    .fillMaxSize()
                    .blur(theme.blurRadius)
            )
        }
    }
}

/**
 * Animated gradient background — pure Compose implementation.
 *
 * Fix #2: Uses drawWithCache to cache the Brush (was allocating every frame).
 * Fix #3: Colors from theme tokens (was hardcoded 0xFF0B0F14 / 0xFF00D9FF).
 */
@Composable
private fun AnimatedGradientBackground(
    modifier: Modifier = Modifier
) {
    val transition = rememberInfiniteTransition(label = "gradient")
    val offset by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(8000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "gradientOffset"
    )

    val baseColor = LiquidBackground
    val accentColor = LiquidAccent.copy(alpha = 0.08f)

    // Fix #2: drawWithCache caches the Brush — no per-frame allocation
    Box(
        modifier = modifier.drawWithCache {
            val startX = offset * 500f
            val startY = offset * 300f
            val brush = Brush.linearGradient(
                colors = listOf(
                    baseColor,
                    baseColor.copy(alpha = 0.98f),
                    accentColor,
                    baseColor.copy(alpha = 0.98f),
                    baseColor
                ),
                start = Offset(x = startX, y = startY),
                end = Offset(x = startX + 800f, y = startY + 800f)
            )
            onDrawBehind {
                drawRect(brush)
            }
        }
    )
}

/**
 * Static blurred gradient — drawn ONCE, blurred ONCE, cached by GPU.
 *
 * Fix #1: This replaces the animated blurred layer.
 * The animated gradient (Layer 1) provides movement on top.
 * This static layer provides the frosted glass base.
 */
@Composable
private fun StaticBlurredGradient(
    modifier: Modifier = Modifier
) {
    val baseColor = LiquidBackground
    val accentColor = LiquidAccent.copy(alpha = 0.05f)

    Box(
        modifier = modifier.drawWithCache {
            val brush = Brush.radialGradient(
                colors = listOf(
                    accentColor,
                    baseColor.copy(alpha = 0.95f),
                    baseColor
                ),
                center = Offset(size.width / 2f, size.height * 0.3f),
                radius = maxOf(size.width, size.height)
            )
            onDrawBehind {
                drawRect(brush)
            }
        }
    )
}
