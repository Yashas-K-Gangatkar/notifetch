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
import com.notifetch.app.ui.screens.EarningsScreen
import com.notifetch.app.ui.screens.ListenerHealthCheckScreen
import com.notifetch.app.ui.screens.OnboardingScreen
import com.notifetch.app.ui.screens.PrivacyDashboardScreen
import com.notifetch.app.ui.screens.hasConsented
import com.notifetch.app.ui.screens.HomeScreen
import com.notifetch.app.ui.screens.NotificationDetailScreen
import com.notifetch.app.ui.screens.PermissionScreen
import com.notifetch.app.ui.screens.SettingsScreen
import com.notifetch.app.ui.theme.NotiFetchTheme
import com.notifetch.app.ui.viewmodel.SettingsViewModel
import com.notifetch.app.data.repository.dataStore
import dagger.hilt.android.AndroidEntryPoint
import androidx.datastore.preferences.core.edit
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val activityContext = this@MainActivity
            // FIX: Removed runBlocking on main thread (was causing ANR on slow devices).
            // Instead, default to false (light mode) and update asynchronously via LaunchedEffect.
            var darkMode by remember { mutableStateOf(false) }
            var dynamicColor by remember { mutableStateOf(false) }
            LaunchedEffect(Unit) {
                activityContext.dataStore.data.map { prefs ->
                    Pair(
                        prefs[SettingsViewModel.DARK_MODE_KEY] ?: false,
                        prefs[SettingsViewModel.DYNAMIC_COLOR_KEY] ?: false
                    )
                }.collect { (dm, dc) ->
                    darkMode = dm
                    dynamicColor = dc
                }
            }
            NotiFetchTheme(darkTheme = darkMode, dynamicColor = dynamicColor) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    NotiFetchNavHost()
                }
            }
        }
    }
}

@Composable
fun NotiFetchNavHost() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: "home"
    val context = LocalContext.current
    var startDestination by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        val consented = hasConsented(context)
        val listenerEnabled = NotiFetchListenerService.isListenerEnabled(context)
        // v2.9.11: Check if onboarding has been completed
        val onboardingCompleted = context.dataStore.data.map { prefs ->
            prefs[SettingsViewModel.ONBOARDING_COMPLETED_KEY] ?: false
        }.first()
        startDestination = when {
            !consented -> "consent"
            !onboardingCompleted -> "onboarding"
            !listenerEnabled -> "permission"
            else -> "home"
        }
    }

    if (startDestination == null) {
        return
    }

    val showBottomBar = currentRoute in listOf("home", "earnings", "settings")

    NotiFetchScaffold(
        currentRoute = currentRoute,
        onNavigate = { route ->
            navController.navigate(route) {
                popUpTo("home") {
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
            startDestination = startDestination!!,
            modifier = Modifier.fillMaxSize()
        ) {
            composable("consent") {
                ConsentScreen(
                    onConsentGranted = {
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
                        (context as? ComponentActivity)?.finish()
                    }
                )
            }

            // v2.9.11: Onboarding screen (shown once after consent)
            composable("onboarding") {
                OnboardingScreen(
                    onComplete = {
                        // Mark onboarding as completed (use rememberCoroutineScope pattern via context)
                        kotlinx.coroutines.MainScope().launch {
                            context.dataStore.edit { prefs ->
                                prefs[SettingsViewModel.ONBOARDING_COMPLETED_KEY] = true
                            }
                        }
                        // Navigate to permission (or home if already granted)
                        val isEnabled = NotiFetchListenerService.isListenerEnabled(context)
                        if (isEnabled) {
                            navController.navigate("home") {
                                popUpTo("onboarding") { inclusive = true }
                            }
                        } else {
                            navController.navigate("permission") {
                                popUpTo("onboarding") { inclusive = true }
                            }
                        }
                    }
                )
            }

            composable("permission") {
                PermissionScreen(
                    onPermissionGranted = {
                        navController.navigate("home") {
                            popUpTo("permission") { inclusive = true }
                        }
                    }
                )
            }

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

            composable("earnings") {
                EarningsScreen()
            }

            composable("settings") {
                SettingsScreen(
                    onNavigateToPrivacy = {
                        navController.navigate("privacy")
                    },
                    onNavigateToHealthCheck = {
                        navController.navigate("health-check")
                    }
                )
            }

            // v2.9.11: Privacy Dashboard
            composable("privacy") {
                PrivacyDashboardScreen(
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            // v2.9.14: Listener Health Check
            composable("health-check") {
                ListenerHealthCheckScreen(
                    onNavigateBack = { navController.popBackStack() }
                )
            }
        }
    }
}
