package com.notifetch.app.ui.screens

import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Gavel
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.PrivacyTip
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.compose.ui.platform.LocalContext
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.notifetch.app.data.repository.dataStore

/**
 * Consent Screen — shown on first launch BEFORE any data collection.
 *
 * Legal compliance:
 * - India DPDP Act 2023: Explicit, informed consent required before processing personal data
 * - EU GDPR Article 6(1)(a): Consent must be freely given, specific, informed, unambiguous
 * - Google Play Policy: Must clearly disclose what data is collected and why
 *
 * This screen ensures the user understands:
 * 1. What NotiFetch does (reads delivery partner notifications)
 * 2. What data is collected (notification title, text, order info only)
 * 3. What is NOT collected (banking, social media, personal messages)
 * 4. Their rights (delete data anytime, export data, revoke consent)
 * 5. Their responsibility (comply with delivery platform ToS)
 */
// NOTE: Consent prefs now stored in the unified DataStore (notifetch_prefs)
// instead of a separate consentDataStore (BUG #15 fix — DataStore consolidation)

@Composable
fun ConsentScreen(
    onConsentGranted: () -> Unit,
    onDeclined: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var consentDataCollection by remember { mutableStateOf(false) }
    var consentNoAffiliation by remember { mutableStateOf(false) }
    var consentUserResponsibility by remember { mutableStateOf(false) }
    var consentPrivacyPolicy by remember { mutableStateOf(false) }

    val allConsentsGiven = consentDataCollection && consentNoAffiliation &&
            consentUserResponsibility && consentPrivacyPolicy

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        // App icon
        Icon(
            imageVector = Icons.Default.NotificationsActive,
            contentDescription = "NotiFetch",
            modifier = Modifier.size(64.dp),
            tint = MaterialTheme.colorScheme.primary
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Before You Begin",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "NotiFetch needs your informed consent before collecting any data. Please read and accept each statement below.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Consent 1: Data Collection
        ConsentCard(
            icon = Icons.Default.Security,
            iconTint = MaterialTheme.colorScheme.primary,
            title = "Data Collection",
            description = "NotiFetch reads notifications from delivery partner/driver apps (like Swiggy Delivery, Zomato Delivery, Amazon Flex, etc.) using Android's NotificationListenerService API. We collect: notification title, text, order value, pickup/dropoff locations, and distance. We NEVER access banking, social media, personal messaging, or any other app notifications.",
            checked = consentDataCollection,
            onCheckedChange = { consentDataCollection = it }
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Consent 2: No Affiliation
        ConsentCard(
            icon = Icons.Default.Shield,
            iconTint = MaterialTheme.colorScheme.error,
            title = "No Affiliation",
            description = "NotiFetch is NOT affiliated with, endorsed by, or connected to any delivery platform (Swiggy, Zomato, Uber, DoorDash, Amazon, etc.). Platform names appear in the app for identification purposes only. You can customize any platform name to whatever you prefer.",
            checked = consentNoAffiliation,
            onCheckedChange = { consentNoAffiliation = it }
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Consent 3: User Responsibility
        ConsentCard(
            icon = Icons.Default.Gavel,
            iconTint = MaterialTheme.colorScheme.tertiary,
            title = "Your Responsibility",
            description = "You are solely responsible for complying with the terms of service of each delivery platform you use. NotiFetch is a personal notification management tool. We do not encourage or support any violation of platform terms. If a platform prohibits using third-party notification tools, you must decide whether to use NotiFetch for that platform.",
            checked = consentUserResponsibility,
            onCheckedChange = { consentUserResponsibility = it }
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Consent 4: Privacy Policy
        ConsentCard(
            icon = Icons.Default.PrivacyTip,
            iconTint = MaterialTheme.colorScheme.secondary,
            title = "Privacy Policy & Your Rights",
            description = "You have the right to delete all your data at any time, export your data, and revoke consent. Data is retained for 30 days and then automatically deleted. We follow India DPDP Act 2023 and EU GDPR standards. By continuing, you agree to our Privacy Policy and Terms of Service.",
            checked = consentPrivacyPolicy,
            onCheckedChange = { consentPrivacyPolicy = it },
            linkText = "Read Privacy Policy & Terms",
            onLinkClick = {
                val intent = android.content.Intent(
                    android.content.Intent.ACTION_VIEW,
                    android.net.Uri.parse("${com.notifetch.app.util.Constants.BASE_URL}privacy")
                )
                context.startActivity(intent)
            }
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Continue button
        Button(
            onClick = {
                // Persist consent to DataStore so it's not shown again
                scope.launch {
                    context.dataStore.edit { prefs ->
                        prefs[CONSENT_GRANTED_KEY] = true
                    }
                }
                onConsentGranted()
            },
            enabled = allConsentsGiven,
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = MaterialTheme.colorScheme.primary,
                disabledContainerColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
            )
        ) {
            Icon(
                imageVector = Icons.Default.CheckCircle,
                contentDescription = null,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.padding(horizontal = 8.dp))
            Text(
                text = "I Agree — Continue",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Decline button
        OutlinedButton(
            onClick = onDeclined,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text("Decline — Exit App")
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
private fun ConsentCard(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconTint: androidx.compose.ui.graphics.Color,
    title: String,
    description: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    linkText: String? = null,
    onLinkClick: (() -> Unit)? = null
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (checked)
                MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.15f)
            else
                MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.Top
        ) {
            Checkbox(
                checked = checked,
                onCheckedChange = onCheckedChange
            )
            Spacer(modifier = Modifier.width(8.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = iconTint,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                if (linkText != null && onLinkClick != null) {
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = linkText,
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.clickable { onLinkClick() }
                    )
                }
            }
        }
    }
}


private val CONSENT_GRANTED_KEY = booleanPreferencesKey("consent_granted")

/** Check if user has already granted consent (for skipping consent screen on relaunch) */
suspend fun hasConsented(context: Context): Boolean {
    return context.dataStore.data.map { it[CONSENT_GRANTED_KEY] == true }.first()
}

