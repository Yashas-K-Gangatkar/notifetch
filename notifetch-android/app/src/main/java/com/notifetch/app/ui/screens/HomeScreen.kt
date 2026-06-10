package com.notifetch.app.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.Payments
import androidx.compose.material.icons.filled.ReceiptLong
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.notifetch.app.notification.NotiFetchListenerService
import com.notifetch.app.ui.components.EmptyState
import com.notifetch.app.ui.components.NotificationCard
import com.notifetch.app.ui.components.SearchBar
import com.notifetch.app.ui.components.StatCard
import com.notifetch.app.ui.theme.getPlatformColor
import com.notifetch.app.ui.viewmodel.HomeViewModel
import com.notifetch.app.util.Helpers

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
    // Previously there were two LaunchedEffects watching isListenerEnabled which
    // could race — now consolidated into a single check.
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
        // Top App Bar
        TopAppBar(
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.NotificationsActive,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "NotiFetch",
                        fontWeight = FontWeight.Bold
                    )
                }
            },
            actions = {
                if (uiState.unreadCount > 0) {
                    TextButton(onClick = { viewModel.markAllAsRead() }) {
                        Text("Mark all read")
                    }
                }
                IconButton(onClick = { viewModel.syncNow() }) {
                    Icon(
                        imageVector = Icons.Default.Sync,
                        contentDescription = "Sync",
                        tint = if (uiState.isSyncing)
                            MaterialTheme.colorScheme.primary
                        else
                            MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        )

        PullToRefreshBox(
            isRefreshing = uiState.isRefreshing,
            onRefresh = { viewModel.refresh() },
            modifier = Modifier.fillMaxSize()
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Stats section
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        StatCard(
                            title = "Today",
                            value = uiState.todayCount.toString(),
                            icon = Icons.Default.ReceiptLong,
                            subtitle = Helpers.formatCurrency(uiState.todayEarnings),
                            modifier = Modifier.weight(1f)
                        )
                        StatCard(
                            title = "This Week",
                            value = Helpers.formatCurrency(uiState.weekEarnings),
                            icon = Icons.Default.Payments,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                // Unread count banner
                if (uiState.unreadCount > 0) {
                    item {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp),
                            shape = RoundedCornerShape(8.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
                            )
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.padding(end = 8.dp)
                                )
                                Text(
                                    text = "${uiState.unreadCount} unread notification${if (uiState.unreadCount != 1) "s" else ""}",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }

                // Search bar
                item {
                    SearchBar(
                        query = uiState.searchQuery,
                        onQueryChange = { viewModel.onSearchQueryChange(it) },
                        modifier = Modifier.padding(horizontal = 16.dp)
                    )
                }

                // Platform filter chips — use resolved display names
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
                            val resolvedName = stat.platform
                            FilterChip(
                                selected = uiState.selectedPlatform == stat.platform,
                                onClick = { viewModel.onPlatformFilterChange(stat.platform) },
                                label = { Text("$resolvedName (${stat.count})") },
                                leadingIcon = {
                                    Box(
                                        modifier = Modifier
                                            .width(8.dp)
                                            .height(8.dp)
                                            .clip(RoundedCornerShape(2.dp))
                                            .background(getPlatformColor(resolvedName))
                                    )
                                },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = getPlatformColor(resolvedName).copy(alpha = 0.15f),
                                    selectedLabelColor = getPlatformColor(resolvedName)
                                )
                            )
                        }
                    }
                }

                // Notifications list
                if (uiState.notifications.isEmpty()) {
                    item {
                        EmptyState(
                            icon = Icons.Default.NotificationsActive,
                            title = "No notifications yet",
                            subtitle = "Notifications from delivery partner apps will appear here once captured"
                        )
                    }
                } else {
                    items(
                        items = uiState.notifications,
                        key = { it.id }
                    ) { notification ->
                        // Resolve display name from the platformNameMap
                        val resolvedName = uiState.platformNameMap[notification.packageName]
                            ?: notification.platform
                        // Stable onClick lambda — remembered per notification ID
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
                }

                // Bottom spacer
                item { Spacer(modifier = Modifier.height(16.dp)) }
            }
        }
    }
}
