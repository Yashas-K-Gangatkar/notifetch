package com.notifetch.app.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import com.notifetch.app.R
import com.notifetch.app.util.PremiumManager
import com.notifetch.app.util.ReferralManager
import com.journeyapps.barcodescanner.ScanContract
import com.journeyapps.barcodescanner.ScanIntentResult
import com.journeyapps.barcodescanner.ScanOptions

/**
 * v2.9.83: QR Scanner Screen
 *
 * Opens the camera and scans for a NotiFetch referral QR code.
 * When a valid referral code is scanned:
 * 1. Awards 7 days premium to the scanner (this user)
 * 2. Shows success dialog
 * 3. Returns to previous screen
 *
 * Error cases:
 * - Scanning own code → error
 * - Already scanned this code → error
 * - Invalid QR (not a NotiFetch referral) → error
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QrScannerScreen(
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) ==
                    PackageManager.PERMISSION_GRANTED
        )
    }
    var scanResult by remember { mutableStateOf<ScanResultState>(ScanResultState.Idle) }

    // QR scanner launcher using ZXing
    val scanLauncher = rememberLauncherForActivityResult(ScanContract()) { result: ScanIntentResult ->
        if (result.contents == null) {
            // User cancelled scan
            onNavigateBack()
            return@rememberLauncherForActivityResult
        }
        // Extract referral code from scanned content
        val scannedContent = result.contents
        val referralCode = ReferralManager.extractReferralCode(scannedContent)
        if (referralCode == null) {
            scanResult = ScanResultState.Error(context.getString(R.string.referral_scan_error_invalid))
            return@rememberLauncherForActivityResult
        }
        // Record the scan and award premium days
        when (val recordResult = PremiumManager.recordScan(context, referralCode)) {
            is com.notifetch.app.util.ScanResult.Success -> {
                scanResult = ScanResultState.Success(recordResult.daysAwarded)
            }
            is com.notifetch.app.util.ScanResult.Error -> {
                scanResult = ScanResultState.Error(recordResult.message)
            }
        }
    }

    // Camera permission launcher
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasCameraPermission = granted
        if (granted) {
            // Start scanning immediately after permission granted
            val options = ScanOptions().apply {
                setDesiredBarcodeFormats(ScanOptions.QR_CODE)
                setPrompt("Scan a NotiFetch referral QR code")
                setBeepEnabled(true)
                setOrientationLocked(false)
                setBarcodeImageEnabled(false)
            }
            scanLauncher.launch(options)
        }
    }

    // Launch scanner automatically when screen opens if permission already granted
    LaunchedEffect(hasCameraPermission) {
        if (hasCameraPermission && scanResult is ScanResultState.Idle) {
            val options = ScanOptions().apply {
                setDesiredBarcodeFormats(ScanOptions.QR_CODE)
                setPrompt("Scan a NotiFetch referral QR code")
                setBeepEnabled(true)
                setOrientationLocked(false)
                setBarcodeImageEnabled(false)
            }
            scanLauncher.launch(options)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.referral_scan_qr)) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            contentAlignment = Alignment.Center
        ) {
            if (!hasCameraPermission) {
                // Permission request UI
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.QrCodeScanner,
                        contentDescription = null,
                        modifier = Modifier.size(80.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = stringResource(R.string.referral_scan_camera_permission),
                        style = MaterialTheme.typography.bodyLarge,
                        textAlign = TextAlign.Center,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Button(
                        onClick = { permissionLauncher.launch(Manifest.permission.CAMERA) },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary
                        )
                    ) {
                        Text(stringResource(R.string.referral_scan_grant_permission))
                    }
                }
            } else {
                // Waiting for scan
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = stringResource(R.string.referral_scan_subtitle),
                        style = MaterialTheme.typography.bodyLarge,
                        textAlign = TextAlign.Center,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }

    // Success dialog
    if (scanResult is ScanResultState.Success) {
        val days = (scanResult as ScanResultState.Success).days
        AlertDialog(
            onDismissRequest = onNavigateBack,
            title = { Text(stringResource(R.string.referral_scan_success_title)) },
            text = {
                Text(stringResource(R.string.referral_scan_success_msg, days.toInt()))
            },
            confirmButton = {
                Button(onClick = onNavigateBack) {
                    Text(stringResource(R.string.referral_scan_done))
                }
            }
        )
    }

    // Error dialog
    if (scanResult is ScanResultState.Error) {
        val message = (scanResult as ScanResultState.Error).message
        AlertDialog(
            onDismissRequest = { scanResult = ScanResultState.Idle },
            title = { Text("Error") },
            text = { Text(message) },
            confirmButton = {
                Button(onClick = { scanResult = ScanResultState.Idle }) {
                    Text(stringResource(R.string.referral_scan_cancel))
                }
            }
        )
    }
}

sealed class ScanResultState {
    object Idle : ScanResultState()
    data class Success(val days: Long) : ScanResultState()
    data class Error(val message: String) : ScanResultState()
}
