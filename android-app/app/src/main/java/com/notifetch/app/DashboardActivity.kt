package com.notifetch.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.chip.Chip
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.notifetch.app.databinding.ActivityDashboardBinding
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

/**
 * Dashboard activity showing captured delivery notifications.
 *
 * Features:
 * - RecyclerView list of captured notifications
 * - Filter chips by source platform (Swiggy, Zomato, etc.)
 * - Filter by category (Food, Grocery, Package, Ride)
 * - Notification count badge
 * - Pull-to-refresh
 * - Mark all as read
 * - Clear all notifications
 * - Test notification button
 */
class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding
    private lateinit var repository: NotificationRepository
    private lateinit var apiClient: ApiClient
    private lateinit var adapter: NotificationAdapter

    private var currentFilter: String = "all"
    private var isFilterByCategory = false

    // Broadcast receiver for listener connection state changes
    private val connectionReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            updateListenerStatus()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        repository = NotificationRepository(
            NotiFetchDatabase.getDatabase(this).notificationDao()
        )
        apiClient = ApiClient(this)

        setupToolbar()
        setupRecyclerView()
        setupFilterChips()
        setupClickListeners()
        observeNotifications()
        updateListenerStatus()

        // Register for listener connection state changes
        val filter = IntentFilter().apply {
            addAction("com.notifetch.app.LISTENER_CONNECTED")
            addAction("com.notifetch.app.LISTENER_DISCONNECTED")
        }
        registerReceiver(connectionReceiver, filter)
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            unregisterReceiver(connectionReceiver)
        } catch (e: Exception) {
            // Already unregistered
        }
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Dashboard"
        binding.toolbar.setNavigationOnClickListener { onBackPressedDispatcher.onBackPressed() }
    }

    private fun setupRecyclerView() {
        adapter = NotificationAdapter(
            onItemClick = { notification -> onNotificationClick(notification) },
            onItemLongClick = { notification -> onNotificationLongClick(notification) },
        )

        binding.recyclerViewNotifications.layoutManager = LinearLayoutManager(this)
        binding.recyclerViewNotifications.adapter = adapter

        // Pull to refresh
        binding.swipeRefreshLayout.setOnRefreshListener {
            refreshNotifications()
        }
    }

    private fun setupFilterChips() {
        // Add "All" chip
        binding.chipGroupFilters.removeAllViews()
        val allChip = Chip(this).apply {
            text = "All"
            isCheckable = true
            isChecked = true
            id = View.generateViewId()
            setChipBackgroundColorResource(R.color.notifetch_dark_surface)
            setTextColor(getColor(R.color.notifetch_text_primary))
            setOnClickListener {
                currentFilter = "all"
                isFilterByCategory = false
                observeNotifications()
            }
        }
        binding.chipGroupFilters.addView(allChip)

        // Add category chips
        CategoryInfo.getAll().forEach { (key, detail) ->
            val chip = Chip(this).apply {
                text = detail.displayName
                isCheckable = true
                id = View.generateViewId()
                setChipBackgroundColorResource(R.color.notifetch_dark_surface)
                setTextColor(getColor(R.color.notifetch_text_primary))
                setOnClickListener {
                    currentFilter = key
                    isFilterByCategory = true
                    observeNotifications()
                }
            }
            binding.chipGroupFilters.addView(chip)
        }

        // Add source chips dynamically
        lifecycleScope.launch {
            try {
                val sources = repository.distinctSources.first()
                sources.forEach { source ->
                    val chip = Chip(this@DashboardActivity).apply {
                        text = source
                        isCheckable = true
                        id = View.generateViewId()
                        setChipBackgroundColorResource(R.color.notifetch_dark_surface)
                        setTextColor(getColor(R.color.notifetch_text_primary))
                        setOnClickListener {
                            currentFilter = source
                            isFilterByCategory = false
                            observeNotificationsBySource(source)
                        }
                    }
                    binding.chipGroupFilters.addView(chip)
                }
            } catch (e: Exception) {
                // Sources not available yet
            }
        }
    }

    private fun setupClickListeners() {
        binding.btnMarkAllRead.setOnClickListener {
            lifecycleScope.launch {
                repository.markAllAsRead()
                Toast.makeText(this@DashboardActivity, "All marked as read", Toast.LENGTH_SHORT).show()
            }
        }

        binding.btnClearAll.setOnClickListener {
            MaterialAlertDialogBuilder(this)
                .setTitle("Clear All Notifications")
                .setMessage("Are you sure you want to delete all captured notifications? This cannot be undone.")
                .setPositiveButton("Clear All") { _, _ ->
                    lifecycleScope.launch {
                        repository.deleteAll()
                        Toast.makeText(this@DashboardActivity, "All cleared", Toast.LENGTH_SHORT).show()
                    }
                }
                .setNegativeButton("Cancel", null)
                .show()
        }

        binding.btnTestNotification.setOnClickListener {
            lifecycleScope.launch {
                val result = apiClient.sendTestNotification()
                if (result.success) {
                    Toast.makeText(
                        this@DashboardActivity,
                        "Test notification sent to backend",
                        Toast.LENGTH_SHORT
                    ).show()
                } else {
                    Toast.makeText(
                        this@DashboardActivity,
                        "Failed: ${result.error}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
        }

        binding.btnEnableListener.setOnClickListener {
            PermissionActivity.openNotificationListenerSettings(this)
        }

        binding.fabRefresh.setOnClickListener {
            refreshNotifications()
        }
    }

    private fun observeNotifications() {
        // Cancel previous observations by re-collecting
        lifecycleScope.launch {
            try {
                when {
                    currentFilter == "all" -> repository.allNotifications
                    isFilterByCategory -> repository.getNotificationsByCategory(currentFilter)
                    else -> repository.allNotifications
                }.collect { notifications ->
                    updateNotificationList(notifications)
                }
            } catch (e: Exception) {
                // Handle error
            }
        }
    }

    private fun observeNotificationsBySource(source: String) {
        lifecycleScope.launch {
            try {
                repository.getNotificationsBySource(source).collect { notifications ->
                    updateNotificationList(notifications)
                }
            } catch (e: Exception) {
                // Handle error
            }
        }
    }

    private fun updateNotificationList(notifications: List<NotificationData>) {
        adapter.submitList(notifications)
        binding.swipeRefreshLayout.isRefreshing = false

        // Update count badge
        val unreadCount = notifications.count { !it.isRead }
        binding.tvNotificationCount.text = "${notifications.size} notifications"
        binding.tvUnreadCount.text = "$unreadCount unread"

        // Show empty state
        if (notifications.isEmpty()) {
            binding.recyclerViewNotifications.visibility = View.GONE
            binding.layoutEmptyState.visibility = View.VISIBLE
        } else {
            binding.recyclerViewNotifications.visibility = View.VISIBLE
            binding.layoutEmptyState.visibility = View.GONE
        }
    }

    private fun refreshNotifications() {
        binding.swipeRefreshLayout.isRefreshing = true

        lifecycleScope.launch {
            try {
                // Retry failed notifications
                apiClient.retryFailedNotifications(repository)
            } catch (e: Exception) {
                // Ignore
            }
            binding.swipeRefreshLayout.isRefreshing = false
        }
    }

    private fun onNotificationClick(notification: NotificationData) {
        // Mark as read
        lifecycleScope.launch {
            repository.markAsRead(notification.id)
        }

        // Show notification detail
        MaterialAlertDialogBuilder(this)
            .setTitle("${notification.source} — ${notification.title}")
            .setMessage("""
                ${notification.body}
                
                Source: ${notification.source}
                Package: ${notification.packageName}
                Category: ${notification.category}
                Time: ${java.text.SimpleDateFormat("MMM dd, yyyy HH:mm", java.util.Locale.getDefault())
                    .format(java.util.Date(notification.timestamp))}
                Forwarded: ${if (notification.isForwarded) "Yes" else "No"}
            """.trimIndent())
            .setPositiveButton("OK", null)
            .setNeutralButton("Delete") { _, _ ->
                lifecycleScope.launch {
                    repository.delete(notification.id)
                    Toast.makeText(this@DashboardActivity, "Deleted", Toast.LENGTH_SHORT).show()
                }
            }
            .show()
    }

    private fun onNotificationLongClick(notification: NotificationData) {
        MaterialAlertDialogBuilder(this)
            .setTitle(notification.title)
            .setItems(arrayOf("Mark as Read", "Delete", "Copy Text")) { _, which ->
                when (which) {
                    0 -> lifecycleScope.launch {
                        repository.markAsRead(notification.id)
                        Toast.makeText(this@DashboardActivity, "Marked as read", Toast.LENGTH_SHORT).show()
                    }
                    1 -> lifecycleScope.launch {
                        repository.delete(notification.id)
                        Toast.makeText(this@DashboardActivity, "Deleted", Toast.LENGTH_SHORT).show()
                    }
                    2 -> {
                        val clipboard = getSystemService(CLIPBOARD_SERVICE) as android.content.ClipboardManager
                        val clip = android.content.ClipData.newPlainText(
                            "Notification",
                            "${notification.title}\n${notification.body}"
                        )
                        clipboard.setPrimaryClip(clip)
                        Toast.makeText(this@DashboardActivity, "Copied to clipboard", Toast.LENGTH_SHORT).show()
                    }
                }
            }
            .show()
    }

    private fun updateListenerStatus() {
        val isConnected = PermissionActivity.isNotificationListenerEnabled(this)
        if (isConnected) {
            binding.tvListenerStatus.text = "🟢 Notification Listener Active"
            binding.btnEnableListener.visibility = View.GONE
        } else {
            binding.tvListenerStatus.text = "🔴 Notification Listener Disabled"
            binding.btnEnableListener.visibility = View.VISIBLE
        }
    }
}
