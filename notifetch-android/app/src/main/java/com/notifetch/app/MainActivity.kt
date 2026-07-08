package com.notifetch.app

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.lifecycle.lifecycleScope
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.systemBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.notifetch.app.notification.KeepAliveService
import com.notifetch.app.notification.NotiFetchListenerService
import com.notifetch.app.ui.components.NotiFetchScaffold
import com.notifetch.app.ui.screens.ConsentScreen
import com.notifetch.app.ui.screens.EarningsDashboardScreen
import com.notifetch.app.ui.screens.EarningsScreen
import com.notifetch.app.ui.screens.FeedbackScreen
import com.notifetch.app.ui.screens.ListenerHealthCheckScreen
import com.notifetch.app.ui.screens.OnboardingScreen
import com.notifetch.app.ui.screens.PrivacyDashboardScreen
import com.notifetch.app.ui.screens.hasConsented
import com.notifetch.app.ui.screens.HomeScreen
import com.notifetch.app.ui.screens.NotificationDetailScreen
import com.notifetch.app.ui.screens.PermissionScreen
import com.notifetch.app.ui.screens.PlatformsScreen
import com.notifetch.app.ui.screens.PlatformCategoryScreen
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

    // v2.9.49: Animated gradient background reference for lifecycle management

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // v2.9.66: Start foreground service from MainActivity (foreground context).
        // v2.9.17 crashed because it started from onListenerConnected (background thread).
        if (NotiFetchListenerService.isListenerEnabled(this)) {
            KeepAliveService.start(this)
        }

        setContent {
            val activityContext = this@MainActivity
            var darkMode by remember { mutableStateOf(false) }
            var dynamicColor by remember { mutableStateOf(false) }
            // v2.9.68: Glass transparency — user-adjustable overlay alpha
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
                // v2.9.74: Liquid Glass architecture
                // GlassTheme provides centralized config to all glass components
                com.notifetch.app.ui.theme.GlassTheme {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .windowInsetsPadding(WindowInsets.systemBars)
                    ) {
                        // Layer 1+2: Shared blurred background (gradient + blurred copy)
                        com.notifetch.app.ui.components.SharedBlurBackground()

                        // Layer 3: Screen content (transparent — gradient shows through)
                        Surface(
                            modifier = Modifier.fillMaxSize(),
                            color = androidx.compose.ui.graphics.Color.Transparent
                        ) {
                            NotiFetchNavHost()
                        }
                    }
                }
            }
        }
    }

    override fun onPause() {
        super.onPause()
        // v2.9.74: Old gradient view removed — Compose handles animation
    }

    override fun onResume() {
        super.onResume()
        // v2.9.74: Old gradient view removed
    }
}

@Composable
fun NotiFetchNavHost() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: "home"
    val context = LocalContext.current
    var startDestination by remember { mutableStateOf<String?>(null) }
    val scope = androidx.compose.runtime.rememberCoroutineScope()
    var pendingDeepLinkNotificationId by remember { mutableStateOf<Long?>(null) }

    // v2.9.66: Handle deep link from smart alerts / widget taps
    LaunchedEffect(Unit) {
        val activity = context as? android.app.Activity
        activity?.intent?.let { intent ->
            if (intent.action == "OPEN_NOTIFICATION_DETAIL") {
                val id = if (intent.extras?.get("notificationId") is Long) {
                    intent.getLongExtra("notificationId", -1L)
                } else {
                    intent.getIntExtra("notificationId", -1).toLong()
                }
                if (id > 0) {
                    val consented = hasConsented(context)
                    val listenerEnabled = NotiFetchListenerService.isListenerEnabled(context)
                    if (consented && listenerEnabled) {
                        pendingDeepLinkNotificationId = id
                    }
                }
            }
        }
    }

    // Handle new intents (warm start from widget/smart alert tap)
    LaunchedEffect(Unit) {
        val activity = context as? androidx.activity.ComponentActivity
        activity?.addOnNewIntentListener { newIntent ->
            scope.launch {
                if (newIntent.action == "OPEN_NOTIFICATION_DETAIL") {
                    val id = if (newIntent.extras?.get("notificationId") is Long) {
                        newIntent.getLongExtra("notificationId", -1L)
                    } else {
                        newIntent.getIntExtra("notificationId", -1).toLong()
                    }
                    if (id > 0) {
                        val consented = hasConsented(context)
                        val listenerEnabled = NotiFetchListenerService.isListenerEnabled(context)
                        if (consented && listenerEnabled) {
                            pendingDeepLinkNotificationId = id
                        }
                    }
                }
            }
        }
    }

    // v2.9.18: Request POST_NOTIFICATIONS on Android 13+ (API 33+)
    // CRITICAL: Without this permission, the KeepAliveService foreground notification
    // doesn't show. Android 14+ then kills the foreground service after a grace period
    // (a few minutes). This causes the listener to die, and deep links stop working.
    // This was the root cause of "deep links work for minutes then stop" on Realme 14 Pro+.
    val notificationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { _ ->
        // Permission result doesn't block app usage. The foreground service
        // starts regardless, but its persistent notification may not show if denied.
        // On Android 14+, the service may be killed after a grace period if denied.
    }

    LaunchedEffect(Unit) {
        // Request POST_NOTIFICATIONS on Android 13+ BEFORE doing anything else
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(
                    context,
                    Manifest.permission.POST_NOTIFICATIONS
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }

        val consented = hasConsented(context)
        val listenerEnabled = NotiFetchListenerService.isListenerEnabled(context)
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

    // v2.9.66: Navigate to detail if we have a pending deep link
    LaunchedEffect(startDestination, pendingDeepLinkNotificationId) {
        val id = pendingDeepLinkNotificationId
        if (startDestination != null && id != null && id > 0) {
            if (startDestination in listOf("home", "earnings", "settings")) {
                navController.navigate("notification_detail/$id")
                pendingDeepLinkNotificationId = null
            }
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

            composable("onboarding") {
                OnboardingScreen(
                    onComplete = {
                        val activity = context as? androidx.activity.ComponentActivity
                        val ls = activity?.lifecycleScope ?: kotlinx.coroutines.MainScope()
                        ls.launch {
                            context.dataStore.edit { prefs ->
                                prefs[SettingsViewModel.ONBOARDING_COMPLETED_KEY] = true
                            }
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
                    }
                )
            }

            composable("permission") {
                PermissionScreen(
                    onPermissionGranted = {
                        KeepAliveService.start(context)
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
                    },
                    onNavigateToProfile = {
                        navController.navigate("profile")
                    }
                )
            }

            // v2.9.69: Profile screen (accessible from Home header tap)
            composable("profile") {
                com.notifetch.app.ui.screens.ProfileScreen(
                    onNavigateBack = { navController.popBackStack() }
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
                    },
                    onNavigateToFeedback = {
                        navController.navigate("feedback")
                    },
                    onNavigateToPlatforms = {
                        navController.navigate("platforms")
                    }
                )
            }

            // v2.9.68: Platforms 3-level hierarchy
            composable("platforms") {
                PlatformsScreen(
                    onNavigateBack = { navController.popBackStack() },
                    onCategoryClick = { category ->
                        navController.navigate("platform_category/$category")
                    }
                )
            }

            composable("platform_category/{category}") { backStackEntry ->
                val category = backStackEntry.arguments?.getString("category") ?: "other"
                PlatformCategoryScreen(
                    category = category,
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable("privacy") {
                PrivacyDashboardScreen(
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable("health-check") {
                ListenerHealthCheckScreen(
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable("feedback") {
                FeedbackScreen(
                    onNavigateBack = { navController.popBackStack() }
                )
            }
        }
    }
}
