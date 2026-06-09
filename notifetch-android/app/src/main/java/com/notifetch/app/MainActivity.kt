package com.notifetch.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.notifetch.app.notification.NotiFetchListenerService
import com.notifetch.app.ui.components.NotiFetchScaffold
import com.notifetch.app.ui.screens.ConsentScreen
import com.notifetch.app.ui.screens.HomeScreen
import com.notifetch.app.ui.screens.NotificationDetailScreen
import com.notifetch.app.ui.screens.PermissionScreen
import com.notifetch.app.ui.screens.ProfileScreen
import com.notifetch.app.ui.screens.SettingsScreen
import com.notifetch.app.ui.theme.NotiFetchTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            NotiFetchTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    NotiFetchAppContent()
                }
            }
        }
    }
}

@Composable
fun NotiFetchAppContent() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: "home"
    val context = LocalContext.current

    val showBottomBar = currentRoute in listOf("home", "settings", "profile")

    NotiFetchScaffold(
        currentRoute = currentRoute,
        onNavigate = { route ->
            navController.navigate(route) {
                popUpTo(navController.graph.startDestinationId) {
                    saveState = true
                }
                launchSingleTop = true
                restoreState = true
            }
        },
        showBottomBar = showBottomBar
    ) {
        NavHost(
            navController = navController,
            startDestination = "consent",
            modifier = Modifier.fillMaxSize()
        ) {
            // ── Consent screen (FIRST — shown before any data collection) ──
            composable("consent") {
                ConsentScreen(
                    onConsentGranted = {
                        // User gave informed consent — now check notification permission
                        val isEnabled = NotiFetchListenerService.isListenerEnabled(context)
                        if (isEnabled) {
                            navController.navigate("home") {
                                popUpTo("consent") { inclusive = true }
                            }
                        } else {
                            navController.navigate("permission") {
                                popUpTo("consent") { inclusive = true }
                            }
                        }
                    },
                    onDeclined = {
                        // User declined consent — close the app
                        // (Can't collect data without consent — DPDP Act & GDPR)
                        (context as? ComponentActivity)?.finish()
                    }
                )
            }

            // ── Permission screen (notification access) ──
            composable("permission") {
                PermissionScreen(
                    onPermissionGranted = {
                        navController.navigate("home") {
                            popUpTo("permission") { inclusive = true }
                        }
                    }
                )
            }

            // ── Main screens ──
            composable("home") {
                HomeScreen(
                    onNavigateToDetail = { id ->
                        navController.navigate("notification_detail/$id")
                    },
                    onNavigateToPermission = {
                        navController.navigate("permission") {
                            launchSingleTop = true
                        }
                    }
                )
            }

            composable(
                route = "notification_detail/{notificationId}",
                arguments = listOf(
                    navArgument("notificationId") { type = NavType.LongType }
                )
            ) {
                NotificationDetailScreen(
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable("settings") {
                SettingsScreen()
            }

            composable("profile") {
                ProfileScreen()
            }
        }
    }
}
