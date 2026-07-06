package com.notifetch.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.notifetch.app.data.local.PlatformConfig
import com.notifetch.app.ui.components.PlatformIcon
import com.notifetch.app.ui.viewmodel.SettingsViewModel
import com.notifetch.app.util.Constants

/**
 * v2.9.68: Platform Category screen — shows apps in a specific category.
 *
 * User flow: Settings → Platforms → Food → [Swiggy, Zomato, Domino's, ...]
 *
 * Each app has a toggle switch to enable/disable notification capture for that app.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlatformCategoryScreen(
    category: String,
    onNavigateBack: () -> Unit,
    viewModel: SettingsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val categoryName = Constants.getCategoryDisplayName(category)
    val categoryIcon = Constants.getCategoryIcon(category)

    // Filter platforms by the selected category
    val platforms = remember(uiState.platformConfigs, category) {
        uiState.platformConfigs.filter {
            Constants.getCategoryForPackage(it.packageName) == category
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        TopAppBar(
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(categoryIcon, style = MaterialTheme.typography.titleMedium)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(categoryName, fontWeight = FontWeight.Bold)
                }
            },
            navigationIcon = {
                IconButton(onClick = onNavigateBack) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(vertical = 16.dp)
        ) {
            items(platforms, key = { it.packageName }) { config ->
                PlatformToggleCard(
                    config = config,
                    onToggle = { enabled ->
                        viewModel.togglePlatform(config.packageName, enabled)
                    }
                )
            }
        }
    }
}

@Composable
private fun PlatformToggleCard(
    config: PlatformConfig,
    onToggle: (Boolean) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PlatformIcon(
                platform = config.resolvedDisplayName,
                color = androidx.compose.ui.graphics.Color(0xFFFFC107),
                packageName = config.packageName,
                size = 40.dp
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = config.resolvedDisplayName,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = config.packageName,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Switch(
                checked = config.isEnabled,
                onCheckedChange = onToggle
            )
        }
    }
}
