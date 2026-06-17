package com.notifetch.app.util

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings

/**
 * v2.9.11: Helper to detect + bypass battery optimization on OEM ROMs.
 *
 * THE PROBLEM:
 * Many Android OEMs (Xiaomi/MIUI, OPPO/ColorOS, Vivo/OriginOS, Samsung OneUI,
 * Huawei/EMUI, Realme) aggressively kill background services to save battery.
 * This silently breaks NotificationListenerService — the user thinks the app
 * stopped working, but Android just killed the listener.
 *
 * THE FIX:
 * 1. Detect if NotiFetch is on the battery optimization whitelist
 * 2. If not, prompt the user with a dialog explaining why we need it
 * 3. Take them directly to the system settings to whitelist NotiFetch
 *
 * OEM-specific intents are also handled — Xiaomi/OPPO/Vivo/Samsung/Realme
 * each have their own "auto-start" permission screens separate from the
 * standard Android battery optimization screen.
 */
object BatteryOptimizationHelper {

    /**
     * Check if NotiFetch is exempt from battery optimization.
     * Returns true if the app is on the whitelist (good state).
     */
    fun isExemptFromBatteryOptimization(context: Context): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return true
        val pm = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        return pm.isIgnoringBatteryOptimizations(context.packageName)
    }

    /**
     * Open the standard Android battery optimization screen for NotiFetch.
     * This works on stock Android + most OEMs.
     */
    fun requestBatteryOptimizationExemption(activity: Activity) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return
        try {
            val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                data = Uri.parse("package:${activity.packageName}")
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            activity.startActivity(intent)
        } catch (_: Exception) {
            // Fallback to general battery optimization list
            try {
                val intent = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                activity.startActivity(intent)
            } catch (_: Exception) {
                // Last resort: open app settings
                openAppSettings(activity)
            }
        }
    }

    /**
     * Open the OEM-specific auto-start permission screen.
     *
     * On Xiaomi/OPPO/Vivo/Samsung/Realme/ Huawei, even after the user grants
     * standard battery optimization exemption, the OEM may still kill the app
     * unless they ALSO enable "Auto-start" in the OEM-specific settings.
     *
     * We try a list of known OEM intents and fall back to the app details page.
     */
    fun openOemAutoStartSettings(activity: Activity): Boolean {
        val manufacturer = Build.MANUFACTURER.lowercase()

        val oemIntents = when {
            manufacturer.contains("xiaomi") || manufacturer.contains("redmi") -> listOf(
                Intent().setComponent(android.content.ComponentName(
                    "com.miui.securitycenter",
                    "com.miui.permcenter.autostart.AutoStartManagementActivity"
                ))
            )
            manufacturer.contains("realme") -> listOf(
                // Realme UI 7.0+ (newer ColorOS-based)
                Intent().setComponent(android.content.ComponentName(
                    "com.coloros.safecenter",
                    "com.coloros.safecenter.permission.startup.StartupAppListActivity"
                )),
                // Realme UI 6.0 (older ColorOS)
                Intent().setComponent(android.content.ComponentName(
                    "com.coloros.safecenter",
                    "com.coloros.safecenter.startupapp.StartupAppListActivity"
                )),
                // Realme GT / older Realme UI
                Intent().setComponent(android.content.ComponentName(
                    "com.realme.securitycheck",
                    "com.realme.securitycheck.ui.startup.StartupAppListActivity"
                )),
                // Fallback: Realme security center main page
                Intent().setComponent(android.content.ComponentName(
                    "com.coloros.safecenter",
                    "com.coloros.safecenter.MainActivity"
                ))
            )
            manufacturer.contains("oppo") -> listOf(
                Intent().setComponent(android.content.ComponentName(
                    "com.coloros.safecenter",
                    "com.coloros.safecenter.permission.startup.StartupAppListActivity"
                )),
                Intent().setComponent(android.content.ComponentName(
                    "com.coloros.safecenter",
                    "com.coloros.safecenter.startupapp.StartupAppListActivity"
                ))
            )
            manufacturer.contains("vivo") -> listOf(
                Intent().setComponent(android.content.ComponentName(
                    "com.vivo.permissionmanager",
                    "com.vivo.permissionmanager.activity.BgStartUpManagerActivity"
                )),
                Intent().setComponent(android.content.ComponentName(
                    "com.iqoo.secure",
                    "com.iqoo.secure.ui.phoneoptimize.AddWhiteListActivity"
                ))
            )
            manufacturer.contains("samsung") -> listOf(
                Intent().setComponent(android.content.ComponentName(
                    "com.samsung.android.lool",
                    "com.samsung.android.sm.ui.battery.BatteryActivity"
                ))
            )
            // Note: Realme is handled above with 4 fallback intents
            manufacturer.contains("huawei") || manufacturer.contains("honor") -> listOf(
                Intent().setComponent(android.content.ComponentName(
                    "com.huawei.systemmanager",
                    "com.huawei.systemmanager.startupmgr.ui.StartupNormalAppListActivity"
                ))
            )
            else -> emptyList()
        }

        for (intent in oemIntents) {
            try {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                activity.startActivity(intent)
                return true
            } catch (_: Exception) {
                // Try next intent
            }
        }

        // Fallback: open general app settings
        openAppSettings(activity)
        return false
    }

    /**
     * Check if the device manufacturer is known to aggressively kill background apps.
     * Used to decide whether to show the OEM auto-start dialog in addition to
     * the standard battery optimization dialog.
     */
    fun isAggressiveOem(): Boolean {
        val manufacturer = Build.MANUFACTURER.lowercase()
        return manufacturer.contains("xiaomi") ||
               manufacturer.contains("redmi") ||
               manufacturer.contains("oppo") ||
               manufacturer.contains("vivo") ||
               manufacturer.contains("iqoo") ||
               manufacturer.contains("samsung") ||
               manufacturer.contains("realme") ||
               manufacturer.contains("huawei") ||
               manufacturer.contains("honor") ||
               manufacturer.contains("oneplus") ||
               manufacturer.contains("meizu") ||
               manufacturer.contains("letv")
    }

    /**
     * Get the user-friendly name of the OEM for display in dialogs.
     */
    fun getOemDisplayName(): String {
        val manufacturer = Build.MANUFACTURER.lowercase()
        return when {
            manufacturer.contains("xiaomi") || manufacturer.contains("redmi") -> "MIUI (Xiaomi/Redmi)"
            manufacturer.contains("oppo") -> "ColorOS (OPPO)"
            manufacturer.contains("vivo") || manufacturer.contains("iqoo") -> "OriginOS (Vivo/iQOO)"
            manufacturer.contains("samsung") -> "One UI (Samsung)"
            manufacturer.contains("realme") -> "Realme UI"
            manufacturer.contains("huawei") || manufacturer.contains("honor") -> "EMUI/MagicOS (Huawei/Honor)"
            manufacturer.contains("oneplus") -> "OxygenOS (OnePlus)"
            else -> "your device"
        }
    }

    /**
     * v2.9.14: Detect specifically if this is a Realme device.
     * Realme UI (ColorOS-based) has 3 separate permissions that all need granting:
     *   1. Notification access (Android standard)
     *   2. Battery optimization exemption (Android standard)
     *   3. Auto-start (Realme-specific) — without this, listener dies in 1-2 minutes
     *   4. App battery saver = "No restriction" (Realme-specific)
     */
    fun isRealmeDevice(): Boolean {
        return Build.MANUFACTURER.lowercase().contains("realme") ||
               Build.BRAND.lowercase().contains("realme")
    }

    /**
     * v2.9.14: Open the Realme "App battery saver" settings for NotiFetch.
     * This is separate from the standard Android battery optimization.
     * Realme-specific path: Settings → Apps → NotiFetch → App battery saver
     */
    fun openRealmeAppBatterySaver(activity: Activity): Boolean {
        if (!isRealmeDevice()) return false
        // Try the Realme-specific app details page first
        try {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.parse("package:${activity.packageName}")
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            activity.startActivity(intent)
            return true
        } catch (_: Exception) {
            return false
        }
    }

    /**
     * v2.9.14: Open the standard Android "Ignore battery optimization" settings
     * (the global list, not app-specific). Useful as a fallback.
     */
    fun openBatteryOptimizationList(activity: Activity) {
        try {
            val intent = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            activity.startActivity(intent)
        } catch (_: Exception) {
            openAppSettings(activity)
        }
    }

    private fun openAppSettings(activity: Activity) {
        try {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.parse("package:${activity.packageName}")
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            activity.startActivity(intent)
        } catch (_: Exception) {
            // Give up
        }
    }
}
