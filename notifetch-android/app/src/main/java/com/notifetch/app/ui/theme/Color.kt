package com.notifetch.app.ui.theme

import androidx.compose.ui.graphics.Color

// NotiFetch Brand Colors - Amber/Orange theme
val Amber50 = Color(0xFFFFF8E1)
val Amber100 = Color(0xFFFFECB3)
val Amber200 = Color(0xFFFFE082)
val Amber300 = Color(0xFFFFD54F)
val Amber400 = Color(0xFFFFCA28)
val Amber500 = Color(0xFFFFC107)
val Amber600 = Color(0xFFFFB300)
val Amber700 = Color(0xFFFFA000)
val Amber800 = Color(0xFFFF8F00)
val Amber900 = Color(0xFFFF6F00)

val Orange500 = Color(0xFFFF9800)
val Orange600 = Color(0xFFFB8C00)
val Orange700 = Color(0xFFF57C00)
val DeepOrange500 = Color(0xFFFF5722)
val DeepOrange600 = Color(0xFFF4511E)

// Light theme colors
val NotiFetchLightPrimary = Color(0xFFFF8F00)       // Amber800
val NotiFetchLightOnPrimary = Color(0xFFFFFFFF)
val NotiFetchLightPrimaryContainer = Color(0xFFFFE082) // Amber200
val NotiFetchLightOnPrimaryContainer = Color(0xFF3E2500)
val NotiFetchLightSecondary = Color(0xFFF57C00)      // Orange700
val NotiFetchLightOnSecondary = Color(0xFFFFFFFF)
val NotiFetchLightSecondaryContainer = Color(0xFFFFDDB3)
val NotiFetchLightOnSecondaryContainer = Color(0xFF2E1500)
val NotiFetchLightTertiary = Color(0xFFD84315)       // DeepOrange
val NotiFetchLightOnTertiary = Color(0xFFFFFFFF)
val NotiFetchLightTertiaryContainer = Color(0xFFFFC4A8)
val NotiFetchLightOnTertiaryContainer = Color(0xFF3B0900)
val NotiFetchLightBackground = Color(0xFFFFFBF5)
val NotiFetchLightOnBackground = Color(0xFF1F1B16)
val NotiFetchLightSurface = Color(0xFFFFFBF5)
val NotiFetchLightOnSurface = Color(0xFF1F1B16)
val NotiFetchLightSurfaceVariant = Color(0xFFF0E6D8)
val NotiFetchLightOnSurfaceVariant = Color(0xFF504539)
val NotiFetchLightOutline = Color(0xFF827568)
val NotiFetchLightOutlineVariant = Color(0xFFD4C4B4)
val NotiFetchLightError = Color(0xFFBA1A1A)
val NotiFetchLightOnError = Color(0xFFFFFFFF)

// Dark theme colors
val NotiFetchDarkPrimary = Color(0xFFFFB300)         // Amber600
val NotiFetchDarkOnPrimary = Color(0xFF442B00)
val NotiFetchDarkPrimaryContainer = Color(0xFFFF8F00) // Amber800
val NotiFetchDarkOnPrimaryContainer = Color(0xFFFFE082)
val NotiFetchDarkSecondary = Color(0xFFFFB870)
val NotiFetchDarkOnSecondary = Color(0xFF4B2800)
val NotiFetchDarkSecondaryContainer = Color(0xFF6B3B00)
val NotiFetchDarkOnSecondaryContainer = Color(0xFFFFDDB3)
val NotiFetchDarkTertiary = Color(0xFFFFB59A)
val NotiFetchDarkOnTertiary = Color(0xFF5F1500)
val NotiFetchDarkTertiaryContainer = Color(0xFF862200)
val NotiFetchDarkOnTertiaryContainer = Color(0xFFFFC4A8)
val NotiFetchDarkBackground = Color(0xFF1A1612)
val NotiFetchDarkOnBackground = Color(0xFFEDE0D4)
val NotiFetchDarkSurface = Color(0xFF1A1612)
val NotiFetchDarkOnSurface = Color(0xFFEDE0D4)
val NotiFetchDarkSurfaceVariant = Color(0xFF504539)
val NotiFetchDarkOnSurfaceVariant = Color(0xFFD4C4B4)
val NotiFetchDarkOutline = Color(0xFF9C8E80)
val NotiFetchDarkOutlineVariant = Color(0xFF504539)
val NotiFetchDarkError = Color(0xFFFFB4AB)
val NotiFetchDarkOnError = Color(0xFF690005)

// Platform brand colors
val SwiggyOrange = Color(0xFFFC8019)
val ZomatoRed = Color(0xFFE23744)
val AmazonOrange = Color(0xFFFF9900)
val ZeptoPurple = Color(0xFF8B008B)
val BlinkitYellow = Color(0xFFF8E71C)
val BigBasketGreen = Color(0xFF84C225)
val DunzoGreen = Color(0xFF00D290)
val PorterBlue = Color(0xFF2E5BFF)
val RapidoYellow = Color(0xFFFFCC00)
val OlaGreen = Color(0xFF36B37E)
val UberBlack = Color(0xFF000000)
val FlipkartBlue = Color(0xFF2874F0)
val ShadowfaxOrange = Color(0xFFFF6B35)

fun getPlatformColor(platform: String): Color {
    return when {
        platform.contains("Swiggy", ignoreCase = true) -> SwiggyOrange
        platform.contains("Zomato", ignoreCase = true) -> ZomatoRed
        platform.contains("Amazon", ignoreCase = true) -> AmazonOrange
        platform.contains("Zepto", ignoreCase = true) -> ZeptoPurple
        platform.contains("Blinkit", ignoreCase = true) -> BlinkitYellow
        platform.contains("BigBasket", ignoreCase = true) -> BigBasketGreen
        platform.contains("Dunzo", ignoreCase = true) -> DunzoGreen
        platform.contains("Porter", ignoreCase = true) -> PorterBlue
        platform.contains("Rapido", ignoreCase = true) -> RapidoYellow
        platform.contains("Ola", ignoreCase = true) -> OlaGreen
        platform.contains("Uber", ignoreCase = true) -> UberBlack
        platform.contains("Flipkart", ignoreCase = true) -> FlipkartBlue
        platform.contains("Shadowfax", ignoreCase = true) -> ShadowfaxOrange
        else -> Amber500
    }
}
