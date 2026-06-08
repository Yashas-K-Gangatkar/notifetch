package com.notifetch.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun PlatformIcon(
    platform: String,
    color: Color,
    modifier: Modifier = Modifier,
    size: Dp = 44.dp
) {
    val initials = getPlatformInitials(platform)

    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .background(color),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = initials,
            color = Color.White,
            fontSize = if (size > 36.dp) 16.sp else 12.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )
    }
}

private fun getPlatformInitials(platform: String): String {
    return when {
        platform.contains("Swiggy", ignoreCase = true) -> "SW"
        platform.contains("Zomato", ignoreCase = true) -> "ZM"
        platform.contains("Amazon", ignoreCase = true) -> "AF"
        platform.contains("Zepto", ignoreCase = true) -> "ZP"
        platform.contains("Blinkit", ignoreCase = true) -> "BK"
        platform.contains("BigBasket", ignoreCase = true) -> "BB"
        platform.contains("Dunzo", ignoreCase = true) -> "DZ"
        platform.contains("Porter", ignoreCase = true) -> "PT"
        platform.contains("Rapido", ignoreCase = true) -> "RP"
        platform.contains("Ola", ignoreCase = true) -> "OL"
        platform.contains("Uber", ignoreCase = true) -> "UB"
        platform.contains("Flipkart", ignoreCase = true) -> "FK"
        platform.contains("Shadowfax", ignoreCase = true) -> "SF"
        else -> platform.take(2).uppercase()
    }
}
