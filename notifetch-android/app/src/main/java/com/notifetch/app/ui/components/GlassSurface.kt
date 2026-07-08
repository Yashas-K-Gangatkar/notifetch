package com.notifetch.app.ui.components

import android.os.Build
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.notifetch.app.ui.theme.*

@Composable
fun GlassSurface(
    modifier: Modifier = Modifier,
    alpha: Float = GLASS_ALPHA_MEDIUM,
    cornerRadius: Dp = 24.dp,
    shadowElevation: Dp = 8.dp,
    content: @Composable () -> Unit
) {
    Surface(
        modifier = modifier.graphicsLayer {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                renderEffect = android.graphics.RenderEffect.createBlurEffect(
                    24f, 24f, android.graphics.Shader.TileMode.DECAL
                )
            }
            this.shadowElevation = shadowElevation.toPx()
        },
        shape = RoundedCornerShape(cornerRadius),
        color = GlassWhite.copy(alpha = alpha),
        border = BorderStroke(1.dp, GlassHighlight.copy(alpha = GLASS_BORDER_ALPHA)),
        shadowElevation = 0.dp,
        tonalElevation = 0.dp
    ) {
        content()
    }
}

@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    padding: Dp = 16.dp,
    alpha: Float = GLASS_ALPHA_MEDIUM,
    cornerRadius: Dp = 24.dp,
    content: @Composable ColumnScope.() -> Unit
) {
    GlassSurface(modifier = modifier, alpha = alpha, cornerRadius = cornerRadius) {
        Column(modifier = Modifier.padding(padding), content = content)
    }
}

@Composable
fun GlassButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    cornerRadius: Dp = 16.dp,
    content: @Composable RowScope.() -> Unit
) {
    var pressed by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(
        if (pressed) 0.96f else 1.0f,
        spring(dampingRatio = 0.6f, stiffness = 400f), label = "btn"
    )
    Surface(
        modifier = modifier.height(52.dp).graphicsLayer { scaleX = scale; scaleY = scale },
        shape = RoundedCornerShape(cornerRadius),
        color = GlassWhite.copy(alpha = if (pressed) GLASS_ALPHA_HIGH else GLASS_ALPHA_LOW),
        border = BorderStroke(1.dp, GlassHighlight.copy(alpha = GLASS_BORDER_ALPHA)),
        shadowElevation = if (pressed) 2.dp else 6.dp,
        tonalElevation = 0.dp
    ) {
        Row(
            modifier = Modifier.fillMaxSize().clip(RoundedCornerShape(cornerRadius))
                .then(if (enabled) Modifier.pointerInput(Unit) {
                    detectTapGestures(onPress = {
                        pressed = true
                        try { awaitRelease() } catch (_: Exception) {}
                        pressed = false
                        onClick()
                    })
                } else Modifier)
                .padding(horizontal = 20.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            content = content
        )
    }
}

@Composable
fun GlassOutlinedButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    cornerRadius: Dp = 16.dp,
    content: @Composable RowScope.() -> Unit
) {
    var pressed by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(
        if (pressed) 0.97f else 1.0f,
        spring(dampingRatio = 0.6f, stiffness = 400f), label = "obtn"
    )
    Surface(
        modifier = modifier.height(48.dp).graphicsLayer { scaleX = scale; scaleY = scale },
        shape = RoundedCornerShape(cornerRadius),
        color = GlassWhite.copy(alpha = if (pressed) GLASS_ALPHA_MEDIUM else GLASS_ALPHA_LOW),
        border = BorderStroke(1.dp, GlassHighlight.copy(alpha = GLASS_BORDER_ALPHA)),
        shadowElevation = 2.dp,
        tonalElevation = 0.dp
    ) {
        Row(
            modifier = Modifier.fillMaxSize().clip(RoundedCornerShape(cornerRadius))
                .then(if (enabled) Modifier.pointerInput(Unit) {
                    detectTapGestures(onPress = {
                        pressed = true
                        try { awaitRelease() } catch (_: Exception) {}
                        pressed = false
                        onClick()
                    })
                } else Modifier)
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            content = content
        )
    }
}
