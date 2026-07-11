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
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
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
 * v2.9.76: GlassSurface — Coral + Amber, light + dark mode.
 *
 * In dark mode: white glass tint (frosted white on dark bg)
 * In light mode: dark glass tint (frosted dark on light bg)
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
    val isDark = isSystemInDarkTheme()

    // v2.9.76: Light mode uses dark tint, dark mode uses white tint
    val tint = if (isDark) Color.White else Color.Black
    val borderColor = if (isDark) Color.White else Color.Black

    Surface(
        modifier = modifier,
        shape = shape,
        color = tint.copy(alpha = if (isDark) theme.glassOpacity else theme.glassOpacity * 0.6f),
        border = BorderStroke(1.dp, borderColor.copy(alpha = theme.borderOpacity)),
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

            // Layer 2: Specular highlight (top-left edge)
            if (theme.highlightIntensity > 0f) {
                val highlightColor = if (isDark) Color.White else Color.White
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(1.dp)
                        .background(
                            Brush.linearGradient(
                                colors = listOf(
                                    highlightColor.copy(alpha = theme.highlightIntensity),
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
    val isDark = isSystemInDarkTheme()
    val tint = if (isDark) Color.White else Color.Black
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
        color = tint.copy(
            alpha = if (pressed) (theme.glassOpacity * 1.5f) else (theme.glassOpacity * 0.7f)
        ),
        border = BorderStroke(1.dp, tint.copy(alpha = theme.borderOpacity)),
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
    val isDark = isSystemInDarkTheme()
    val tint = if (isDark) Color.White else Color.Black
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
        color = tint.copy(
            alpha = if (pressed) theme.glassOpacity else (theme.glassOpacity * 0.6f)
        ),
        border = BorderStroke(1.dp, tint.copy(alpha = theme.borderOpacity)),
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
 * v2.9.76: SharedBlurBackground — Coral + Amber glow.
 *
 * Dark mode: deep graphite with coral glow
 * Light mode: warm cream with coral glow
 */
@Composable
fun SharedBlurBackground(
    modifier: Modifier = Modifier
) {
    val theme = currentGlassTheme
    val isDark = isSystemInDarkTheme()

    Box(modifier = modifier.fillMaxSize()) {
        // Layer 1: Animated gradient
        AnimatedGradientBackground(
            modifier = Modifier.fillMaxSize(),
            isDark = isDark
        )

        // Layer 2: STATIC blurred gradient (FLAGSHIP mode only)
        if (theme.mode == GlassMode.FLAGSHIP && theme.blurRadius > 0.dp) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .blur(theme.blurRadius)
            ) {
                StaticBlurredGradient(
                    modifier = Modifier.fillMaxSize(),
                    isDark = isDark
                )
            }
        }
    }
}

/**
 * Animated gradient background — Coral + Amber glow.
 * Dark mode: deep graphite + coral glow
 * Light mode: warm cream + coral glow
 */
@Composable
private fun AnimatedGradientBackground(
    modifier: Modifier = Modifier,
    isDark: Boolean = true
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

    val baseColor = if (isDark) DarkBackgroundPrimary else LightBackgroundPrimary
    val midColor = if (isDark) DarkBackgroundSecondary else LightBackgroundSecondary
    val glowColor = AccentGlow.copy(alpha = if (isDark) 0.08f else 0.06f)
    val amberGlow = AmberGold.copy(alpha = if (isDark) 0.04f else 0.03f)

    Box(
        modifier = modifier.drawWithCache {
            val startX = offset * 500f
            val startY = offset * 300f
            val brush = Brush.linearGradient(
                colors = listOf(
                    baseColor,
                    midColor,
                    glowColor,
                    amberGlow,
                    midColor,
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
 */
@Composable
private fun StaticBlurredGradient(
    modifier: Modifier = Modifier,
    isDark: Boolean = true
) {
    val baseColor = if (isDark) DarkBackgroundPrimary else LightBackgroundPrimary
    val midColor = if (isDark) DarkBackgroundSecondary else LightBackgroundSecondary
    val glowColor = AccentGlow.copy(alpha = if (isDark) 0.05f else 0.04f)

    Box(
        modifier = modifier.drawWithCache {
            val brush = Brush.radialGradient(
                colors = listOf(
                    glowColor,
                    midColor.copy(alpha = 0.95f),
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
