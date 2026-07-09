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
import com.notifetch.app.ui.theme.*

// ── Pre-baked noise texture (cached for app lifetime) ───────────
private var cachedNoiseShader: BitmapShader? = null
private var cachedNoiseAlpha: Float = -1f

private fun getNoiseShader(alpha: Float): BitmapShader {
    if (cachedNoiseShader != null && cachedNoiseAlpha == alpha) {
        return cachedNoiseShader!!
    }
    val size = 64
    val pixels = IntArray(size * size)
    val random = java.util.Random(42)
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
 * v2.9.75: GlassSurface — expanded with all new tokens.
 *
 * Uses specific glass tokens: glassTint, glassBorderColor, glassHighlightColor,
 * glassShadowColor, glassNoiseStrength — not just opacity.
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
        color = theme.glassTint.copy(alpha = theme.glassOpacity),
        border = BorderStroke(1.dp, theme.glassBorderColor.copy(alpha = theme.borderOpacity)),
        shadowElevation = effectiveShadow,
        tonalElevation = 0.dp
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Layer 1: Noise texture
            if (theme.glassNoiseStrength > 0f) {
                val noiseBrush = remember(theme.glassNoiseStrength) {
                    ShaderBrush(getNoiseShader(theme.glassNoiseStrength))
                }
                Box(modifier = Modifier.fillMaxSize().background(noiseBrush))
            }

            // Layer 2: Specular highlight (top-left edge — light catching glass)
            if (theme.highlightIntensity > 0f) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(1.dp)
                        .background(
                            Brush.linearGradient(
                                colors = listOf(
                                    theme.glassHighlightColor.copy(alpha = theme.highlightIntensity),
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
 * Uses interactionSource for proper press detection + accessibility.
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
    val effectiveRadius = cornerRadius ?: CornerButton
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
        color = theme.glassTint.copy(
            alpha = if (pressed) (theme.glassOpacity * 1.5f) else (theme.glassOpacity * 0.7f)
        ),
        border = BorderStroke(1.dp, theme.glassBorderColor.copy(alpha = theme.borderOpacity)),
        shadowElevation = if (pressed) ElevationLow else ShadowGlass,
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
    val effectiveRadius = cornerRadius ?: CornerButton
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
        color = theme.glassTint.copy(
            alpha = if (pressed) theme.glassOpacity else (theme.glassOpacity * 0.6f)
        ),
        border = BorderStroke(1.dp, theme.glassBorderColor.copy(alpha = theme.borderOpacity)),
        shadowElevation = ElevationLow,
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
 * SharedBlurBackground — ONE shared blurred layer for the entire screen.
 *
 * Uses multiple background layers (BackgroundPrimary → BackgroundSecondary → AccentGlow)
 * for depth. Animated cyan glow drifts slowly.
 */
@Composable
fun SharedBlurBackground(
    modifier: Modifier = Modifier
) {
    val theme = currentGlassTheme

    Box(modifier = modifier.fillMaxSize()) {
        // Layer 1: Animated gradient with multiple background layers
        AnimatedGradientBackground(
            modifier = Modifier.fillMaxSize()
        )

        // Layer 2: STATIC blurred gradient (FLAGSHIP mode only — API 31+)
        if (theme.mode == GlassMode.FLAGSHIP && theme.blurRadius > 0.dp) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .blur(theme.blurRadius)
            ) {
                StaticBlurredGradient(
                    modifier = Modifier.fillMaxSize()
                )
            }
        }
    }
}

/**
 * Animated gradient background — pure Compose implementation.
 * Uses BackgroundPrimary → BackgroundSecondary → AccentGlow for depth.
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

    Box(
        modifier = modifier.drawWithCache {
            val startX = offset * 500f
            val startY = offset * 300f
            val brush = Brush.linearGradient(
                colors = listOf(
                    BackgroundPrimary,
                    BackgroundSecondary,
                    AccentGlow.copy(alpha = 0.08f),
                    BackgroundSecondary,
                    BackgroundPrimary
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
 */
@Composable
private fun StaticBlurredGradient(
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier.drawWithCache {
            val brush = Brush.radialGradient(
                colors = listOf(
                    AccentGlow.copy(alpha = 0.05f),
                    BackgroundSecondary.copy(alpha = 0.95f),
                    BackgroundPrimary
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
