package com.notifetch.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun CategoryBadge(
    category: String,
    modifier: Modifier = Modifier
) {
    val (label, color) = when (category) {
        "NEW_ORDER" -> "New Order" to Color(0xFF4CAF50)
        "ORDER_UPDATE" -> "Update" to Color(0xFF2196F3)
        "COMPLETED" -> "Completed" to Color(0xFF8BC34A)
        "CANCELLED" -> "Cancelled" to Color(0xFFF44336)
        "EARNINGS" -> "Earnings" to Color(0xFFFFC107)
        "AVAILABILITY" -> "Status" to Color(0xFF9C27B0)
        else -> category to Color(0xFF9E9E9E)
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(color.copy(alpha = 0.10f))
            .padding(horizontal = 8.dp, vertical = 3.dp)
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = color,
            fontWeight = FontWeight.SemiBold
        )
    }
}
