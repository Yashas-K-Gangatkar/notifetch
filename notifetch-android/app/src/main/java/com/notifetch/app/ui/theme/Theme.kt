package com.notifetch.app.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.background
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// v2.9.73: Liquid Glass Color Schemes
private val LiquidGlassDarkScheme = darkColorScheme(
    primary = LiquidAccent,
    onPrimary = Color.Black,
    primaryContainer = LiquidAccent.copy(alpha = 0.15f),
    onPrimaryContainer = LiquidAccent,
    secondary = LiquidSuccess,
    onSecondary = Color.Black,
    tertiary = LiquidWarning,
    onTertiary = Color.Black,
    error = LiquidError,
    onError = Color.White,
    background = LiquidBackground,
    onBackground = LiquidTextPrimary,
    surface = LiquidSurface,
    onSurface = LiquidTextPrimary,
    surfaceVariant = LiquidSurfaceVariant,
    onSurfaceVariant = LiquidTextSecondary,
    outline = LiquidTextTertiary,
    outlineVariant = LiquidTextTertiary.copy(alpha = 0.3f)
)

private val LiquidGlassLightScheme = lightColorScheme(
    primary = LiquidAccent,
    onPrimary = Color.White,
    primaryContainer = LiquidAccent.copy(alpha = 0.1f),
    onPrimaryContainer = LiquidAccent,
    secondary = LiquidSuccess,
    onSecondary = Color.White,
    tertiary = LiquidWarning,
    onTertiary = Color.White,
    error = LiquidError,
    onError = Color.White,
    background = Color(0xFFF5F7FA),
    onBackground = Color(0xFF0B0F14),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF0B0F14),
    surfaceVariant = Color(0xFFE8ECEF),
    onSurfaceVariant = Color(0xFF5A6B7A),
    outline = Color(0xFFB0BEC5),
    outlineVariant = Color(0xFFD0D7DD)
)

@Composable
fun NotiFetchTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    // v2.9.73: Always use Liquid Glass scheme
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> LiquidGlassDarkScheme
        else -> LiquidGlassLightScheme
    }

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            // v2.9.73: Deep dark background
            window.statusBarColor = LiquidBackground.toArgb()
            window.navigationBarColor = LiquidBackground.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = NotiFetchTypography,
        content = content
    )
}
