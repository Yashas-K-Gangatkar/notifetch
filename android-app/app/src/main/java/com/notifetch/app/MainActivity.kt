package com.notifetch.app

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.webkit.CookieManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.snackbar.Snackbar
import com.notifetch.app.databinding.ActivityMainBinding
import kotlinx.coroutines.launch

/**
 * Main activity for NotiFetch.
 *
 * Contains:
 * - Bottom navigation with 3 tabs: WebView, Dashboard, Settings
 * - WebView that loads the NotiFetch web app (https://d2-liart-nine.vercel.app)
 * - Integration with DashboardActivity for captured notifications
 * - Permission check on startup
 * - Notification listener status monitoring
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var repository: NotificationRepository
    private lateinit var apiClient: ApiClient

    private var currentTab = R.id.nav_webview
    private var webViewCanGoBack = false

    // Broadcast receiver for notification listener state
    private val connectionReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            when (intent.action) {
                "com.notifetch.app.LISTENER_CONNECTED" -> {
                    updateListenerStatus()
                    Snackbar.make(
                        binding.root,
                        "✅ Notification listener connected",
                        Snackbar.LENGTH_SHORT
                    ).show()
                }
                "com.notifetch.app.LISTENER_DISCONNECTED" -> {
                    updateListenerStatus()
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        repository = NotificationRepository(
            NotiFetchDatabase.getDatabase(this).notificationDao()
        )
        apiClient = ApiClient(this)

        // Request POST_NOTIFICATIONS permission for Android 13+
        requestNotificationPermission()

        setupBottomNavigation()
        setupWebView()
        setupDashboardView()
        setupSettingsView()
        updateListenerStatus()

        // Handle intent extras (e.g., opening dashboard from notification tap)
        handleIntent(intent)

        // Register for listener state changes
        val filter = IntentFilter().apply {
            addAction("com.notifetch.app.LISTENER_CONNECTED")
            addAction("com.notifetch.app.LISTENER_DISCONNECTED")
        }
        registerReceiver(connectionReceiver, filter)

        // Check notification listener permission on first launch
        checkFirstLaunch()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            unregisterReceiver(connectionReceiver)
        } catch (e: Exception) {
            // Already unregistered
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == NOTIFICATION_PERMISSION_CODE) {
            if (grantResults.isEmpty() || grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Notifications won't be shown without permission", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun handleIntent(intent: Intent?) {
        intent?.let {
            if (it.getBooleanExtra("open_dashboard", false)) {
                binding.bottomNavigation.selectedItemId = R.id.nav_dashboard
            }
        }
    }

    private fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED
            ) {
                ActivityCompat.requestPermissionsResult(
                    this,
                    arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                    NOTIFICATION_PERMISSION_CODE
                )
            }
        }
    }

    private fun checkFirstLaunch() {
        val prefs = getSharedPreferences("notifetch_prefs", Context.MODE_PRIVATE)
        val isFirstLaunch = prefs.getBoolean("first_launch", true)

        if (isFirstLaunch) {
            prefs.edit().putBoolean("first_launch", false).apply()

            // Check if notification listener is enabled
            if (!PermissionActivity.isNotificationListenerEnabled(this)) {
                // Show permission guide
                MaterialAlertDialogBuilder(this)
                    .setTitle("Welcome to NotiFetch! 🚀")
                    .setMessage(
                        "NotiFetch captures delivery notifications from your delivery partner apps " +
                        "and shows them in one place.\n\n" +
                        "To work, NotiFetch needs permission to read notifications.\n\n" +
                        "Your data stays private — notifications are processed on your device " +
                        "and only shared with the NotiFetch backend with your consent."
                    )
                    .setPositiveButton("Enable Notification Access") { _, _ ->
                        startActivity(Intent(this, PermissionActivity::class.java))
                    }
                    .setNegativeButton("Later", null)
                    .setCancelable(false)
                    .show()
            }
        }
    }

    private fun setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_webview -> {
                    showWebViewTab()
                    true
                }
                R.id.nav_dashboard -> {
                    showDashboardTab()
                    true
                }
                R.id.nav_settings -> {
                    showSettingsTab()
                    true
                }
                else -> false
            }
        }
    }

    private fun setupWebView() {
        binding.webview.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            loadsImagesAutomatically = true
            mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_NEVER
            cacheMode = android.webkit.WebSettings.LOAD_DEFAULT
            userAgentString = userAgentString + " NotiFetch/2.0.0 (Android Native)"
        }

        // Enable cookies
        CookieManager.getInstance().setAcceptThirdPartyCookies(binding.webview, true)

        binding.webview.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {
                val url = request.url.toString()

                // Only allow NotiFetch domains
                if (url.startsWith("https://d2-liart-nine.vercel.app") ||
                    url.startsWith("https://notifetch.app")
                ) {
                    return false // Load in WebView
                }

                // Open external links in browser
                startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                return true
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                binding.webviewProgress.visibility = View.GONE
            }
        }

        binding.webview.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                if (newProgress < 100) {
                    binding.webviewProgress.visibility = View.VISIBLE
                    binding.webviewProgress.progress = newProgress
                } else {
                    binding.webviewProgress.visibility = View.GONE
                }
            }
        }

        // Load the NotiFetch web app
        binding.webview.loadUrl("https://d2-liart-nine.vercel.app")

        // Handle back press for WebView
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (currentTab == R.id.nav_webview && binding.webview.canGoBack()) {
                    binding.webview.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    private fun setupDashboardView() {
        // Quick stats
        lifecycleScope.launch {
            try {
                repository.totalCount.collect { count ->
                    binding.tvTotalCount.text = count.toString()
                }
            } catch (e: Exception) { /* ignore */ }
        }

        lifecycleScope.launch {
            try {
                repository.unreadCount.collect { count ->
                    binding.tvUnreadCountMain.text = "$count unread"
                }
            } catch (e: Exception) { /* ignore */ }
        }

        // Open full dashboard button
        binding.btnOpenDashboard.setOnClickListener {
            startActivity(Intent(this, DashboardActivity::class.java))
        }

        // Enable listener button
        binding.btnEnableListenerMain.setOnClickListener {
            if (PermissionActivity.isNotificationListenerEnabled(this)) {
                Toast.makeText(this, "Notification listener is already active", Toast.LENGTH_SHORT).show()
            } else {
                startActivity(Intent(this, PermissionActivity::class.java))
            }
        }
    }

    private fun setupSettingsView() {
        // Notification listener settings
        binding.btnOpenListenerSettings.setOnClickListener {
            PermissionActivity.openNotificationListenerSettings(this)
        }

        // Permission activity
        binding.btnOpenPermissionGuide.setOnClickListener {
            startActivity(Intent(this, PermissionActivity::class.java))
        }

        // Test notification
        binding.btnSendTestNotification.setOnClickListener {
            lifecycleScope.launch {
                val result = apiClient.sendTestNotification()
                if (result.success) {
                    Snackbar.make(binding.root, "✅ Test notification sent", Snackbar.LENGTH_SHORT).show()
                } else {
                    Snackbar.make(binding.root, "❌ Failed: ${result.error}", Snackbar.LENGTH_LONG).show()
                }
            }
        }

        // Retry failed notifications
        binding.btnRetryFailed.setOnClickListener {
            lifecycleScope.launch {
                apiClient.retryFailedNotifications(repository)
                Snackbar.make(binding.root, "Retry complete", Snackbar.LENGTH_SHORT).show()
            }
        }

        // Clear all data
        binding.btnClearAllData.setOnClickListener {
            MaterialAlertDialogBuilder(this)
                .setTitle("Clear All Data")
                .setMessage("Delete all captured notifications? This cannot be undone.")
                .setPositiveButton("Clear") { _, _ ->
                    lifecycleScope.launch {
                        repository.deleteAll()
                        Snackbar.make(binding.root, "All data cleared", Snackbar.LENGTH_SHORT).show()
                    }
                }
                .setNegativeButton("Cancel", null)
                .show()
        }

        // Open web app in browser
        binding.btnOpenInBrowser.setOnClickListener {
            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://d2-liart-nine.vercel.app")))
        }

        // App version
        try {
            val packageInfo = packageManager.getPackageInfo(packageName, 0)
            binding.tvAppVersion.text = "NotiFetch v${packageInfo.versionName}"
        } catch (e: Exception) {
            binding.tvAppVersion.text = "NotiFetch v2.0.0"
        }
    }

    private fun showWebViewTab() {
        currentTab = R.id.nav_webview
        binding.webviewContainer.visibility = View.VISIBLE
        binding.dashboardContainer.visibility = View.GONE
        binding.settingsContainer.visibility = View.GONE
    }

    private fun showDashboardTab() {
        currentTab = R.id.nav_dashboard
        binding.webviewContainer.visibility = View.GONE
        binding.dashboardContainer.visibility = View.VISIBLE
        binding.settingsContainer.visibility = View.GONE

        // Refresh stats
        setupDashboardView()
    }

    private fun showSettingsTab() {
        currentTab = R.id.nav_settings
        binding.webviewContainer.visibility = View.GONE
        binding.dashboardContainer.visibility = View.GONE
        binding.settingsContainer.visibility = View.VISIBLE

        // Update listener status
        updateListenerStatus()
    }

    private fun updateListenerStatus() {
        val isConnected = PermissionActivity.isNotificationListenerEnabled(this)
        if (isConnected) {
            binding.tvListenerStatusMain.text = "🟢 Notification Listener Active"
            binding.btnEnableListenerMain.visibility = View.GONE
        } else {
            binding.tvListenerStatusMain.text = "🔴 Notification Listener Disabled — Tap to enable"
            binding.btnEnableListenerMain.visibility = View.VISIBLE
        }
    }

    companion object {
        private const val TAG = "NotiFetchMainActivity"
        private const val NOTIFICATION_PERMISSION_CODE = 1001
    }
}
