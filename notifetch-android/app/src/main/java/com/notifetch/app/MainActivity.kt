package com.notifetch.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
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
                    NotiFetchApp()
                }
            }
        }
    }
}

@Composable
fun NotiFetchApp() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: "home"

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
            startDestination = "home",
            modifier = Modifier.fillMaxSize()
        ) {
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

            composable("permission") {
                PermissionScreen(
                    onPermissionGranted = {
                        navController.popBackStack()
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
