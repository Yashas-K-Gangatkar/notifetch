package com.notifetch.app.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = NotiFetchLightPrimary,
    onPrimary = NotiFetchLightOnPrimary,
    primaryContainer = NotiFetchLightPrimaryContainer,
    onPrimaryContainer = NotiFetchLightOnPrimaryContainer,
    secondary = NotiFetchLightSecondary,
    onSecondary = NotiFetchLightOnSecondary,
    secondaryContainer = NotiFetchLightSecondaryContainer,
    onSecondaryContainer = NotiFetchLightOnSecondaryContainer,
    tertiary = NotiFetchLightTertiary,
    onTertiary = NotiFetchLightOnTertiary,
    tertiaryContainer = NotiFetchLightTertiaryContainer,
    onTertiaryContainer = NotiFetchLightOnTertiaryContainer,
    background = NotiFetchLightBackground,
    onBackground = NotiFetchLightOnBackground,
    surface = NotiFetchLightSurface,
    onSurface = NotiFetchLightOnSurface,
    surfaceVariant = NotiFetchLightSurfaceVariant,
    onSurfaceVariant = NotiFetchLightOnSurfaceVariant,
    outline = NotiFetchLightOutline,
    outlineVariant = NotiFetchLightOutlineVariant,
    error = NotiFetchLightError,
    onError = NotiFetchLightOnError
)

private val DarkColorScheme = darkColorScheme(
    primary = NotiFetchDarkPrimary,
    onPrimary = NotiFetchDarkOnPrimary,
    primaryContainer = NotiFetchDarkPrimaryContainer,
    onPrimaryContainer = NotiFetchDarkOnPrimaryContainer,
    secondary = NotiFetchDarkSecondary,
    onSecondary = NotiFetchDarkOnSecondary,
    secondaryContainer = NotiFetchDarkSecondaryContainer,
    onSecondaryContainer = NotiFetchDarkOnSecondaryContainer,
    tertiary = NotiFetchDarkTertiary,
    onTertiary = NotiFetchDarkOnTertiary,
    tertiaryContainer = NotiFetchDarkTertiaryContainer,
    onTertiaryContainer = NotiFetchDarkOnTertiaryContainer,
    background = NotiFetchDarkBackground,
    onBackground = NotiFetchDarkOnBackground,
    surface = NotiFetchDarkSurface,
    onSurface = NotiFetchDarkOnSurface,
    surfaceVariant = NotiFetchDarkSurfaceVariant,
    onSurfaceVariant = NotiFetchDarkOnSurfaceVariant,
    outline = NotiFetchDarkOutline,
    outlineVariant = NotiFetchDarkOutlineVariant,
    error = NotiFetchDarkError,
    onError = NotiFetchDarkOnError
)

@Composable
fun NotiFetchTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = NotiFetchTypography,
        content = content
    )
}
