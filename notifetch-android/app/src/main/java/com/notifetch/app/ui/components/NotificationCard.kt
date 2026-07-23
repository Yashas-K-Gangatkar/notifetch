package com.notifetch.app.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.notifetch.app.data.local.CapturedNotification
import com.notifetch.app.ui.theme.getPlatformColor
import com.notifetch.app.util.Helpers

@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
@Composable
fun NotificationCard(
    notification: CapturedNotification,
    onClick: (Long) -> Unit,
    modifier: Modifier = Modifier,
    displayPlatformName: String? = null,
    onLongClick: ((String) -> Unit)? = null
) {
    val resolvedName = displayPlatformName ?: notification.platform
    val platformColor = getPlatformColor(resolvedName, notification.packageName)

    Card(
        modifier = modifier
            .fillMaxWidth()
            .shadow(
                elevation = if (notification.isRead) 1.dp else 4.dp,
                shape = RoundedCornerShape(16.dp),
                ambientColor = if (notification.isRead) Color.Transparent else platformColor.copy(alpha = 0.1f),
                spotColor = if (notification.isRead) Color.Transparent else platformColor.copy(alpha = 0.1f)
            )
            .combinedClickable(
                onClick = { onClick(notification.id) },
                onLongClick = { onLongClick?.invoke(notification.packageName ?: notification.source ?: "") }
            ),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        // Use IntrinsicSize.Min so the left border fills the full card height
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(IntrinsicSize.Min)
        ) {
            // ── Colored left border accent ─────────────────────────────
            Box(
                modifier = Modifier
                    .width(4.dp)
                    .fillMaxHeight()
                    .background(
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                platformColor,
                                platformColor.copy(alpha = 0.3f)
                            )
                        )
                    )
            )

            // ── Main content ───────────────────────────────────────────
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 12.dp, end = 16.dp, top = 14.dp, bottom = 14.dp),
                verticalAlignment = Alignment.Top
            ) {
                // Platform icon with rounded square background
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(platformColor.copy(alpha = 0.12f)),
                    contentAlignment = Alignment.Center
                ) {
                    PlatformIcon(
                        platform = resolvedName,
                        color = platformColor,
                        packageName = notification.packageName,
                        modifier = Modifier.size(44.dp)
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                // Content column
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                ) {
                    // Platform name chip + time
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Platform name chip
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(platformColor.copy(alpha = 0.12f))
                                .padding(horizontal = 8.dp, vertical = 3.dp)
                        ) {
                            Text(
                                text = resolvedName,
                                style = MaterialTheme.typography.labelSmall,
                                color = platformColor,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Text(
                            text = Helpers.formatTimeAgo(notification.receivedAt),
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Title
                    Text(
                        text = notification.title,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = if (notification.isRead) FontWeight.Normal else FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        color = if (notification.isRead)
                            MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        else
                            MaterialTheme.colorScheme.onSurface
                    )

                    // Body text
                    if (notification.body.isNotBlank()) {
                        Spacer(modifier = Modifier.height(3.dp))
                        Text(
                            text = notification.body,
                            style = MaterialTheme.typography.bodySmall,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    // Quick info row
                    if (notification.orderValue != null || notification.distance != null) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            if (notification.orderValue != null) {
                                InfoChip(
                                    text = Helpers.formatCurrency(notification.orderValue, notification.currency),
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                            if (notification.distance != null) {
                                InfoChip(
                                    text = notification.distance,
                                    color = MaterialTheme.colorScheme.tertiary
                                )
                            }
                            notification.category?.let {
                                CategoryBadge(category = it)
                            }
                        }
                    }
                }

                // ── Unread indicator with glow ──────────────────────────
                if (!notification.isRead) {
                    Spacer(modifier = Modifier.width(8.dp))
                    UnreadGlowDot(color = MaterialTheme.colorScheme.primary)
                }
            }
        }
    }
}

/**
 * A glowing unread indicator dot with a subtle pulsing animation.
 */
@Composable
private fun UnreadGlowDot(color: Color, modifier: Modifier = Modifier) {
    val infiniteTransition = rememberInfiniteTransition(label = "glowPulse")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1500, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glowAlpha"
    )

    Box(
        modifier = modifier.size(10.dp),
        contentAlignment = Alignment.Center
    ) {
        // Glow ring
        Box(
            modifier = Modifier
                .size(10.dp)
                .clip(CircleShape)
                .background(color.copy(alpha = glowAlpha * 0.3f))
        )
        // Core dot
        Box(
            modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(color)
        )
    }
}

@Composable
private fun InfoChip(
    text: String,
    color: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(color.copy(alpha = 0.10f))
            .padding(horizontal = 8.dp, vertical = 3.dp)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            color = color,
            fontWeight = FontWeight.SemiBold
        )
    }
}
