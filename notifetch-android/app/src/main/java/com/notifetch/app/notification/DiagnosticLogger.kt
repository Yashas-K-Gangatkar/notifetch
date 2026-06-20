package com.notifetch.app.notification

import android.content.Context
import android.util.Log
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * v2.9.19: Diagnostic Logger
 *
 * Logs EVERY notification received (tracked or not) to a file on disk.
 * This lets us see EXACTLY which package names are being received but
 * NOT matched by Constants.ALL_PACKAGES.
 *
 * The user can then view this log in the Health Check screen and send
 * it via the Feedback screen so we can add missing package names.
 */
object DiagnosticLogger {

    private const val TAG = "NotiFetchDiagnostic"
    private const val LOG_FILENAME = "notifetch_diagnostic.log"
    private const val MAX_LOG_SIZE = 500_000L // 500KB max

    fun logNotification(
        context: Context,
        packageName: String,
        title: String,
        isTracked: Boolean
    ) {
        try {
            val timestamp = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(Date())
            val status = if (isTracked) "TRACKED" else "UNTRACKED"
            val logLine = "$timestamp | $status | pkg=$packageName | title=${title.take(60)}\n"

            // Also log to logcat
            if (isTracked) {
                Log.d(TAG, "✅ $logLine")
            } else {
                Log.w(TAG, "❌ $logLine")
            }

            // Write to file
            val logFile = File(context.filesDir, LOG_FILENAME)
            if (logFile.exists() && logFile.length() > MAX_LOG_SIZE) {
                // Rotate: keep last half
                val lines = logFile.readLines()
                logFile.writeText(lines.takeLast(lines.size / 2).joinToString("\n") + "\n")
            }
            logFile.appendText(logLine)
        } catch (_: Exception) {
            // Logging should never crash the app
        }
    }

    /**
     * Read the diagnostic log for display in Health Check screen.
     * Returns the last N lines, most recent first.
     */
    fun getLogSummary(context: Context, maxLines: Int = 50): String {
        return try {
            val logFile = File(context.filesDir, LOG_FILENAME)
            if (!logFile.exists()) return "No diagnostic data yet."

            val lines = logFile.readLines()
            val recent = lines.takeLast(maxLines).reversed()

            val tracked = lines.count { it.contains("| TRACKED |") }
            val untracked = lines.count { it.contains("| UNTRACKED |") }

            buildString {
                appendLine("=== Diagnostic Summary ===")
                appendLine("Total notifications received: ${lines.size}")
                appendLine("Tracked (captured): $tracked")
                appendLine("Untracked (ignored): $untracked")
                appendLine()

                // List unique untracked package names
                val untrackedPackages = lines
                    .filter { it.contains("| UNTRACKED |") }
                    .map { extractPackage(it) }
                    .distinct()
                    .sorted()

                if (untrackedPackages.isNotEmpty()) {
                    appendLine("=== UNTRACKED Packages (NOT being captured) ===")
                    untrackedPackages.forEach { pkg ->
                        val count = lines.count { it.contains("| UNTRACKED |") && it.contains("pkg=$pkg") }
                        appendLine("  $pkg ($count notifications)")
                    }
                    appendLine()
                    appendLine("These apps are sending notifications but NotiFetch")
                    appendLine("doesn't recognize their package name.")
                    appendLine("Send this log via Feedback so we can add them.")
                } else {
                    appendLine("All received notifications were tracked. ✅")
                }

                appendLine()
                appendLine("=== Recent ${recent.size} notifications ===")
                recent.forEach { appendLine(it) }
            }
        } catch (e: Exception) {
            "Error reading log: ${e.message}"
        }
    }

    /**
     * Get list of untracked package names.
     */
    fun getUntrackedPackages(context: Context): List<String> {
        return try {
            val logFile = File(context.filesDir, LOG_FILENAME)
            if (!logFile.exists()) return emptyList()

            logFile.readLines()
                .filter { it.contains("| UNTRACKED |") }
                .map { extractPackage(it) }
                .distinct()
                .sorted()
        } catch (_: Exception) {
            emptyList()
        }
    }

    private fun extractPackage(logLine: String): String {
        val pkgStart = logLine.indexOf("pkg=")
        if (pkgStart == -1) return "unknown"
        val pkgEnd = logLine.indexOf(" |", pkgStart)
        return if (pkgEnd == -1) {
            logLine.substring(pkgStart + 4).trim()
        } else {
            logLine.substring(pkgStart + 4, pkgEnd).trim()
        }
    }

    /**
     * Clear the diagnostic log.
     */
    fun clearLog(context: Context) {
        try {
            val logFile = File(context.filesDir, LOG_FILENAME)
            logFile.delete()
        } catch (_: Exception) {}
    }
}
