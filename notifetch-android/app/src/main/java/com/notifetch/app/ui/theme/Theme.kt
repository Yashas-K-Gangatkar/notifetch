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

// v2.9.75: NotiFetch Design System v2 — dark-first, multi-layer
private val NotiFetchColorScheme = darkColorScheme(
    primary = Accent,
    onPrimary = Color.Black,
    primaryContainer = Accent.copy(alpha = 0.15f),
    onPrimaryContainer = Accent,
    secondary = Success,
    onSecondary = Color.Black,
    tertiary = Warning,
    onTertiary = Color.Black,
    error = Error,
    onError = Color.White,
    background = BackgroundPrimary,
    onBackground = TextPrimary,
    surface = BackgroundSecondary,
    onSurface = TextPrimary,
    surfaceVariant = BackgroundElevated,
    onSurfaceVariant = TextSecondary,
    outline = TextTertiary,
    outlineVariant = TextTertiary.copy(alpha = 0.3f)
)

@Composable
fun NotiFetchTheme(
    darkTheme: Boolean = true,  // Dark-first — always dark
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = NotiFetchColorScheme

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            // v2.9.75: Multi-layer background — deep graphite
            window.statusBarColor = BackgroundPrimary.toArgb()
            window.navigationBarColor = BackgroundPrimary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = NotiFetchTypography,
        content = content
    )
}
