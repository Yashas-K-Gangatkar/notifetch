package com.notifetch.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DeliveryDining
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.Payments
import androidx.compose.material.icons.filled.ReceiptLong
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.FileDownload
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import android.content.Intent
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.notifetch.app.notification.NotiFetchListenerService
import com.notifetch.app.ui.components.NotificationCard
import com.notifetch.app.ui.components.SearchBar
import com.notifetch.app.ui.components.StatCard
import com.notifetch.app.ui.theme.BrandGradientEnd
import com.notifetch.app.ui.theme.BrandGradientStart
import com.notifetch.app.ui.theme.getPlatformColor
import com.notifetch.app.ui.viewmodel.HomeViewModel
import com.notifetch.app.util.Helpers
import com.notifetch.app.util.UserMode

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun HomeScreen(
    onNavigateToDetail: (Long) -> Unit,
    onNavigateToPermission: () -> Unit,
    viewModel: HomeViewModel = hiltViewModel()
) {
    // SINGLE uiState — no separate collectAsState calls
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    // Check notification listener status and navigate to permission if needed.
    // Uses a flag to prevent navigation loops (BUG #18 cleanup).
    var hasNavigatedToPermission by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        val isEnabled = NotiFetchListenerService.isListenerEnabled(context)
        viewModel.updateListenerEnabled(isEnabled)
        if (!isEnabled) {
            hasNavigatedToPermission = true
            onNavigateToPermission()
        }
    }

    // Re-check when screen resumes (user may have disabled listener externally)
    LaunchedEffect(uiState.isListenerEnabled) {
        if (!uiState.isListenerEnabled && !hasNavigatedToPermission) {
            hasNavigatedToPermission = true
            onNavigateToPermission()
        } else if (uiState.isListenerEnabled) {
            hasNavigatedToPermission = false
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // ── Gradient Top App Bar ──────────────────────────────────────────
        val gradientBrush = Brush.horizontalGradient(
            colors = listOf(BrandGradientStart, BrandGradientEnd)
        )

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(gradientBrush)
        ) {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.NotificationsActive,
                            contentDescription = null,
                            tint = Color.White
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "NotiFetch",
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                },
                actions = {
                    if (uiState.notifications.isNotEmpty()) {
                        IconButton(onClick = {
                            val csv = viewModel.exportNotificationsAsCsv()
                            val intent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/csv"
                                putExtra(Intent.EXTRA_TEXT, csv)
                                putExtra(Intent.EXTRA_SUBJECT, "NotiFetch ${uiState.userMode.name} Notifications Export")
                            }
                            context.startActivity(Intent.createChooser(intent, "Export Notifications"))
                        }) {
                            Icon(
                                imageVector = Icons.Default.FileDownload,
                                contentDescription = "Export",
                                tint = Color.White
                            )
                        }
                    }
                    if (uiState.unreadCount > 0) {
                        TextButton(onClick = { viewModel.markAllAsRead() }) {
                            Text("Mark all read", color = Color.White.copy(alpha = 0.9f))
                        }
                    }
                    IconButton(onClick = { viewModel.syncNow() }) {
                        val syncRotation by animateFloatAsState(
                            targetValue = if (uiState.isSyncing) 360f else 0f,
                            animationSpec = tween(
                                durationMillis = if (uiState.isSyncing) 800 else 0,
                                easing = LinearEasing
                            ),
                            label = "syncRotation"
                        )
                        Icon(
                            imageVector = Icons.Default.Sync,
                            contentDescription = "Sync",
                            tint = Color.White,
                            modifier = Modifier.graphicsLayer {
                                rotationZ = syncRotation
                            }
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.Transparent
                )
            )

            // Sync progress indicator under the app bar
            AnimatedVisibility(
                visible = uiState.isSyncing,
                enter = fadeIn() + expandVertically(),
                exit = fadeOut() + shrinkVertically()
            ) {
                LinearProgressIndicator(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(2.dp),
                    color = Color.White,
                    trackColor = Color.White.copy(alpha = 0.3f)
                )
            }
        }

        // ── Mode Toggle: Rider / Customer ──────────────────────────────────
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Rider Button
            Row(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(12.dp))
                    .background(
                        if (uiState.userMode == UserMode.RIDER) Brush.horizontalGradient(
                            colors = listOf(Color(0xFFFF8F00), Color(0xFFF57C00))
                        ) else Brush.horizontalGradient(
                            colors = listOf(Color(0xFF2A2A2A), Color(0xFF2A2A2A))
                        )
                    )
                    .clickable { viewModel.onUserModeChange(UserMode.RIDER) }
                    .padding(vertical = 12.dp, horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Icon(
                    imageVector = Icons.Default.DeliveryDining,
                    contentDescription = "Rider",
                    tint = if (uiState.userMode == UserMode.RIDER) Color.White else Color.Gray
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Rider",
                    fontWeight = FontWeight.Bold,
                    color = if (uiState.userMode == UserMode.RIDER) Color.White else Color.Gray
                )
            }

            // Customer Button
            Row(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(12.dp))
                    .background(
                        if (uiState.userMode == UserMode.CUSTOMER) Brush.horizontalGradient(
                            colors = listOf(Color(0xFF10B981), Color(0xFF059669))
                        ) else Brush.horizontalGradient(
                            colors = listOf(Color(0xFF2A2A2A), Color(0xFF2A2A2A))
                        )
                    )
                    .clickable { viewModel.onUserModeChange(UserMode.CUSTOMER) }
                    .padding(vertical = 12.dp, horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Icon(
                    imageVector = Icons.Default.ShoppingBag,
                    contentDescription = "Customer",
                    tint = if (uiState.userMode == UserMode.CUSTOMER) Color.White else Color.Gray
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Customer",
                    fontWeight = FontWeight.Bold,
                    color = if (uiState.userMode == UserMode.CUSTOMER) Color.White else Color.Gray
                )
            }
        }

        PullToRefreshBox(
            isRefreshing = uiState.isRefreshing,
            onRefresh = { viewModel.refresh() },
            modifier = Modifier.fillMaxSize()
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // ── Stats section ──────────────────────────────────────
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        StatCard(
                            title = if (uiState.userMode == UserMode.RIDER) "Today's Earnings" else "Today's Savings",
                            value = uiState.todayCount.toString(),
                            icon = Icons.Default.ReceiptLong,
                            subtitle = Helpers.formatCurrency(uiState.todayEarnings),
                            modifier = Modifier.weight(1f)
                        )
                        StatCard(
                            title = if (uiState.userMode == UserMode.RIDER) "Week Earnings" else "Week Savings",
                            value = Helpers.formatCurrency(uiState.weekEarnings),
                            icon = Icons.Default.Payments,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                // ── Unread count banner ────────────────────────────────
                if (uiState.unreadCount > 0) {
                    item {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f)
                            )
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 16.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(
                                    text = "${uiState.unreadCount} unread notification${if (uiState.unreadCount != 1) "s" else ""}",
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.Medium,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }

                // ── Search bar ─────────────────────────────────────────
                item {
                    SearchBar(
                        query = uiState.searchQuery,
                        onQueryChange = { viewModel.onSearchQueryChange(it) },
                        modifier = Modifier.padding(horizontal = 16.dp)
                    )
                }

                // ── Platform filter chips ──────────────────────────────
                item {
                    FlowRow(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 4.dp),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        FilterChip(
                            selected = uiState.selectedPlatform == null,
                            onClick = { viewModel.onPlatformFilterChange(null) },
                            label = { Text("All") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                                selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        )
                        uiState.platformStats.forEach { stat ->
                            val resolvedName = uiState.platformNameMap[stat.packageName]
                                ?: stat.platform
                            val chipColor = getPlatformColor(resolvedName, stat.packageName)
                            FilterChip(
                                selected = uiState.selectedPlatform == stat.packageName,
                                onClick = { viewModel.onPlatformFilterChange(stat.packageName) },
                                label = { Text("$resolvedName (${stat.count})") },
                                leadingIcon = {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .clip(RoundedCornerShape(2.dp))
                                            .background(chipColor)
                                    )
                                },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = chipColor.copy(alpha = 0.15f),
                                    selectedLabelColor = chipColor
                                )
                            )
                        }
                    }
                }

                // ── Notifications list ─────────────────────────────────
                if (uiState.notifications.isEmpty()) {
                    item {
                        AnimatedEmptyState(
                            icon = if (uiState.userMode == UserMode.RIDER) Icons.Default.DeliveryDining else Icons.Default.ShoppingBag,
                            title = if (uiState.userMode == UserMode.RIDER) "No deliveries yet" else "No orders yet",
                            subtitle = if (uiState.userMode == UserMode.RIDER)
                                "Notifications from delivery partner apps will appear here once captured"
                            else
                                "Notifications from customer apps will appear here once captured"
                        )
                    }
                } else {
                    items(
                        items = uiState.notifications,
                        key = { it.id }
                    ) { notification ->
                        val resolvedName = uiState.platformNameMap[notification.packageName]
                            ?: notification.platform
                        val notificationId = notification.id
                        val onClick = remember(notificationId) {
                            { id: Long ->
                                viewModel.markAsRead(id)
                                onNavigateToDetail(id)
                            }
                        }
                        NotificationCard(
                            notification = notification,
                            onClick = onClick,
                            displayPlatformName = resolvedName,
                            modifier = Modifier.padding(horizontal = 16.dp)
                        )
                    }

                    // Affiliation disclaimer at the bottom of notifications
                    item {
                        Text(
                            text = "NotiFetch is not affiliated with any delivery platform. Platform names are used for identification only.",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                            textAlign = TextAlign.Center,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 24.dp, vertical = 8.dp)
                        )
                    }
                }

                // Bottom spacer
                item { Spacer(modifier = Modifier.height(24.dp)) }
            }
        }
    }
}

/**
 * Animated empty state with a gentle floating animation on the icon.
 */
@Composable
private fun AnimatedEmptyState(
    icon: ImageVector,
    title: String,
    subtitle: String,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "emptyStateFloat")
    val floatOffset by infiniteTransition.animateFloat(
        initialValue = -8f,
        targetValue = 8f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "floatOffset"
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Floating icon with glow effect
        Box(
            modifier = Modifier
                .size(96.dp)
                .graphicsLayer { translationY = floatOffset },
            contentAlignment = Alignment.Center
        ) {
            // Glow background
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(
                        Brush.radialGradient(
                            colors = listOf(
                                MaterialTheme.colorScheme.primary.copy(alpha = 0.15f),
                                Color.Transparent
                            ),
                            center = Offset(40f, 40f),
                            radius = 80f
                        )
                    )
            )
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(56.dp),
                tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.6f)
            )
        }
        Spacer(modifier = Modifier.height(20.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = subtitle,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
            textAlign = TextAlign.Center
        )
    }
}
