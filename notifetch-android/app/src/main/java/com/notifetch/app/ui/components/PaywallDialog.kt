package com.notifetch.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun PaywallDialog(
    featureName: String,
    onDismiss: () -> Unit,
    onUpgrade: (tier: String) -> Unit,
    isSignedIn: Boolean = false
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                "Unlock $featureName",
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    "$featureName is a premium feature. Upgrade to unlock it and more.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                // Pro Plan
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFFFFF8E1)
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp).fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Pro", fontWeight = FontWeight.Bold, color = Color(0xFFE65100))
                            Text("Unlimited notifications, earnings, auto-accept", style = MaterialTheme.typography.bodySmall)
                        }
                        FilledTonalButton(
                            onClick = { onUpgrade("pro") },
                            colors = ButtonDefaults.filledTonalButtonColors(
                                containerColor = Color(0xFFFF8F00),
                                contentColor = Color.White
                            )
                        ) {
                            Text("₹99/mo", fontWeight = FontWeight.Bold)
                        }
                    }
                }
                
                // Premium Plan
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFFFFECB3)
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp).fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Premium", fontWeight = FontWeight.Bold, color = Color(0xFFE65100))
                            Text("Everything in Pro + priority alerts, multi-device sync", style = MaterialTheme.typography.bodySmall)
                        }
                        FilledTonalButton(
                            onClick = { onUpgrade("premium") },
                            colors = ButtonDefaults.filledTonalButtonColors(
                                containerColor = Color(0xFFF57C00),
                                contentColor = Color.White
                            )
                        ) {
                            Text("₹199/mo", fontWeight = FontWeight.Bold)
                        }
                    }
                }

                if (!isSignedIn) {
                    Text(
                        "⚠ Sign in required to upgrade",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.error
                    )
                }
            }
        },
        confirmButton = {},
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Maybe Later") }
        }
    )
}
