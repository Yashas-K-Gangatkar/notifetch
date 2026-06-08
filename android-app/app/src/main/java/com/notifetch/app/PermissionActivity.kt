package com.notifetch.app

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.notifetch.app.databinding.ActivityPermissionBinding

/**
 * Permission guide activity that helps the user enable notification access.
 *
 * This is the most critical permission for NotiFetch. Without it,
 * the app cannot capture delivery partner notifications.
 *
 * Flow:
 * 1. Check if notification listener is enabled
 * 2. If not, show an explanatory screen
 * 3. User clicks "Enable" → opens system notification access settings
 * 4. User returns → re-check and proceed or show again
 */
class PermissionActivity : AppCompatActivity() {

    private lateinit var binding: ActivityPermissionBinding

    companion object {
        /**
         * Check if the notification listener service is enabled.
         */
        fun isNotificationListenerEnabled(context: Context): Boolean {
            val componentName = ComponentName(context, NotiFetchListenerService::class.java)
            val enabledListeners = Settings.Secure.getString(
                context.contentResolver,
                "enabled_notification_listeners"
            ) ?: return false

            return enabledListeners.contains(componentName.flattenToString())
        }

        /**
         * Open the system notification access settings.
         */
        fun openNotificationListenerSettings(context: Context) {
            try {
                val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                context.startActivity(intent)
            } catch (e: Exception) {
                // Fallback for devices where the direct intent doesn't work
                try {
                    val intent = Intent(Settings.ACTION_SETTINGS).apply {
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    context.startActivity(intent)
                    Toast.makeText(
                        context,
                        "Please find 'Notification access' in Settings",
                        Toast.LENGTH_LONG
                    ).show()
                } catch (e2: Exception) {
                    Toast.makeText(
                        context,
                        "Unable to open Settings. Please enable notification access manually.",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPermissionBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupToolbar()
        setupViews()
        checkPermission()
    }

    override fun onResume() {
        super.onResume()
        checkPermission()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Notification Access"
        binding.toolbar.setNavigationOnClickListener { onBackPressedDispatcher.onBackPressed() }
    }

    private fun setupViews() {
        binding.btnEnableNotificationAccess.setOnClickListener {
            openNotificationListenerSettings(this)
        }

        binding.btnContinue.setOnClickListener {
            // Permission is granted, go to main activity
            val intent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            startActivity(intent)
            finish()
        }

        binding.btnSkip.setOnClickListener {
            // User chose to skip — limited functionality
            Toast.makeText(
                this,
                "NotiFetch needs notification access to capture delivery notifications",
                Toast.LENGTH_LONG
            ).show()
            finish()
        }
    }

    private fun checkPermission() {
        val isEnabled = isNotificationListenerEnabled(this)

        if (isEnabled) {
            binding.tvPermissionStatus.text = "✅ Notification Access Enabled"
            binding.tvPermissionStatus.setTextColor(getColor(R.color.notifetch_amber))
            binding.tvPermissionDescription.text = getString(R.string.permission_granted_description)
            binding.btnEnableNotificationAccess.isEnabled = false
            binding.btnEnableNotificationAccess.text = "✓ Already Enabled"
            binding.btnContinue.isEnabled = true
            binding.cardStatus.setCardBackgroundColor(getColor(R.color.notifetch_dark_surface))
        } else {
            binding.tvPermissionStatus.text = "❌ Notification Access Required"
            binding.tvPermissionStatus.setTextColor(getColor(R.color.notifetch_error))
            binding.tvPermissionDescription.text = getString(R.string.permission_description)
            binding.btnEnableNotificationAccess.isEnabled = true
            binding.btnEnableNotificationAccess.text = "Enable Notification Access"
            binding.btnContinue.isEnabled = false
            binding.cardStatus.setCardBackgroundColor(getColor(R.color.notifetch_dark_card))
        }
    }
}
