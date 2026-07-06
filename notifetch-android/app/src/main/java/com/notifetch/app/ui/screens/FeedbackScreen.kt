package com.notifetch.app.ui.screens

import android.content.Intent
import android.os.Build
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.BugReport
import androidx.compose.material.icons.filled.Feedback
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.notifetch.app.BuildConfig
import com.notifetch.app.notification.NotiFetchListenerService
import com.notifetch.app.ui.viewmodel.HomeViewModel
import kotlinx.coroutines.launch

/**
 * v2.9.16: In-App Feedback System
 *
 * Lets users send bug reports, feature requests, and general feedback
 * directly from the app. Auto-attaches device info + diagnostic data
 * so the founder can debug issues without back-and-forth emails.
 *
 * Submits via Android share sheet (email/WhatsApp/Telegram) — no backend needed.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeedbackScreen(
    onNavigateBack: () -> Unit,
    homeViewModel: HomeViewModel = hiltViewModel()
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var feedbackType by remember { mutableStateOf(FeedbackType.BUG) }
    var message by remember { mutableStateOf("") }
    var includeLogs by remember { mutableStateOf(true) }

    // Collect diagnostic info
    val diagnosticInfo = remember {
        buildString {
            appendLine("=== NotiFetch Diagnostic Info ===")
            appendLine("App Version: ${BuildConfig.VERSION_NAME} (${BuildConfig.VERSION_CODE})")
            appendLine("Device: ${Build.MANUFACTURER} ${Build.MODEL}")
            appendLine("Android: ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT})")
            appendLine("Build: ${Build.DISPLAY}")
            appendLine("Listener Enabled: ${NotiFetchListenerService.isListenerEnabled(context)}")
            appendLine("Battery Exempt: ${com.notifetch.app.util.BatteryOptimizationHelper.isExemptFromBatteryOptimization(context)}")
            appendLine("OEM: ${com.notifetch.app.util.BatteryOptimizationHelper.getOemDisplayName()}")
            appendLine("Is Aggressive OEM: ${com.notifetch.app.util.BatteryOptimizationHelper.isAggressiveOem()}")
            appendLine("=== End Diagnostic ===")
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        TopAppBar(
            title = { Text("Send Feedback") },
            navigationIcon = {
                IconButton(onClick = onNavigateBack) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Feedback type selector
            Text(
                "What kind of feedback?",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FeedbackTypeChip(
                    icon = Icons.Default.BugReport,
                    label = "Bug Report",
                    selected = feedbackType == FeedbackType.BUG,
                    onClick = { feedbackType = FeedbackType.BUG },
                    modifier = Modifier.weight(1f)
                )
                FeedbackTypeChip(
                    icon = Icons.Default.Lightbulb,
                    label = "Feature Request",
                    selected = feedbackType == FeedbackType.FEATURE,
                    onClick = { feedbackType = FeedbackType.FEATURE },
                    modifier = Modifier.weight(1f)
                )
                FeedbackTypeChip(
                    icon = Icons.Default.Feedback,
                    label = "General",
                    selected = feedbackType == FeedbackType.GENERAL,
                    onClick = { feedbackType = FeedbackType.GENERAL },
                    modifier = Modifier.weight(1f)
                )
            }

            // Message input
            OutlinedTextField(
                value = message,
                onValueChange = { message = it },
                label = {
                    Text(when (feedbackType) {
                        FeedbackType.BUG -> "Describe the bug (what happened, what you expected)"
                        FeedbackType.FEATURE -> "What feature would you like?"
                        FeedbackType.GENERAL -> "Your feedback"
                    })
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 120.dp),
                shape = RoundedCornerShape(12.dp),
                supportingText = {
                    Text("${message.length} characters")
                }
            )

            // Include logs toggle
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Checkbox(
                    checked = includeLogs,
                    onCheckedChange = { includeLogs = it }
                )
                Spacer(modifier = Modifier.width(4.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text("Include diagnostic info", style = MaterialTheme.typography.bodyMedium)
                    Text(
                        "Device model, Android version, app version, listener status — helps us debug faster",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Diagnostic preview (if enabled)
            if (includeLogs) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                    )
                ) {
                    Text(
                        text = diagnosticInfo,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.padding(12.dp),
                        fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                    )
                }
            }

            // Submit button
            Button(
                onClick = {
                    val subject = when (feedbackType) {
                        FeedbackType.BUG -> "[BUG] NotiFetch v${BuildConfig.VERSION_NAME}"
                        FeedbackType.FEATURE -> "[FEATURE REQUEST] NotiFetch v${BuildConfig.VERSION_NAME}"
                        FeedbackType.GENERAL -> "[FEEDBACK] NotiFetch v${BuildConfig.VERSION_NAME}"
                    }
                    val fullMessage = buildString {
                        appendLine(message)
                        appendLine()
                        if (includeLogs) {
                            appendLine(diagnosticInfo)
                        }
                    }

                    val intent = Intent(Intent.ACTION_SEND).apply {
                        type = "message/rfc822"
                        putExtra(Intent.EXTRA_EMAIL, arrayOf("yashask2006@gmail.com"))
                        putExtra(Intent.EXTRA_SUBJECT, subject)
                        putExtra(Intent.EXTRA_TEXT, fullMessage)
                    }
                    context.startActivity(Intent.createChooser(intent, "Send Feedback"))
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(12.dp),
                enabled = message.isNotBlank(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            ) {
                Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Send Feedback", fontWeight = FontWeight.SemiBold)
            }

            // v2.9.69: Send via WhatsApp — opens NotiFetch group DIRECTLY
            // Copies message to clipboard, then opens the group invite link.
            // WhatsApp opens the group (if user is a member), user pastes message.
            // This is the ONLY way to open a specific WhatsApp group from an app —
            // WhatsApp doesn't support deep-linking to groups with pre-filled text.
            OutlinedButton(
                onClick = {
                    val subject = when (feedbackType) {
                        FeedbackType.BUG -> "🐛 BUG"
                        FeedbackType.FEATURE -> "💡 FEATURE"
                        FeedbackType.GENERAL -> "📝 FEEDBACK"
                    }
                    val fullMessage = "$subject: $message\n\n$diagnosticInfo"

                    // Copy message to clipboard
                    val clipboard = context.getSystemService(android.content.Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
                    clipboard.setPrimaryClip(android.content.ClipData.newPlainText("NotiFetch Feedback", fullMessage))

                    // Show toast telling user to paste
                    android.widget.Toast.makeText(
                        context,
                        "Message copied! Paste it in the NotiFetch group.",
                        android.widget.Toast.LENGTH_LONG
                    ).show()

                    // Open the NotiFetch WhatsApp group directly
                    val groupIntent = Intent(Intent.ACTION_VIEW).apply {
                        data = android.net.Uri.parse("https://chat.whatsapp.com/IHYTQwoyu8hDiXg3MRgWko")
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    try {
                        context.startActivity(groupIntent)
                    } catch (_: Exception) {
                        android.widget.Toast.makeText(context, "Cannot open WhatsApp", android.widget.Toast.LENGTH_SHORT).show()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                shape = RoundedCornerShape(12.dp),
                enabled = message.isNotBlank()
            ) {
                Text("Send via WhatsApp")
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
private fun FeedbackTypeChip(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    FilterChip(
        selected = selected,
        onClick = onClick,
        label = { Text(label, style = MaterialTheme.typography.labelSmall) },
        leadingIcon = { Icon(icon, contentDescription = null, modifier = Modifier.size(16.dp)) },
        modifier = modifier
    )
}

enum class FeedbackType { BUG, FEATURE, GENERAL }
