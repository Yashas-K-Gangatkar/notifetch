package com.notifetch.app.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.PhotoLibrary
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
import androidx.compose.material3.OutlinedButton
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
import com.notifetch.app.util.ScanResult
import com.journeyapps.barcodescanner.ScanContract
import com.journeyapps.barcodescanner.ScanIntentResult
import com.journeyapps.barcodescanner.ScanOptions
import com.google.zxing.BinaryBitmap
import com.google.zxing.MultiFormatReader
import com.google.zxing.RGBLuminanceSource
import com.google.zxing.common.HybridBinarizer

/**
 * v2.9.85: QR Scanner Screen — Camera + Gallery
 *
 * Two ways to scan a referral QR code:
 * 1. Camera scan — open camera and point at another phone's screen
 * 2. Gallery scan — pick a QR image from gallery (WhatsApp/Instagram screenshots)
 *
 * When a valid referral code is scanned:
 * 1. Awards 7 days premium to the scanner (this user)
 * 2. Shows success dialog
 * 3. Returns to previous screen
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

    // Process a scanned referral code (from camera or gallery)
    fun processReferralCode(code: String?) {
        if (code == null) {
            scanResult = ScanResultState.Error(context.getString(R.string.referral_scan_error_invalid))
            return
        }
        val referralCode = ReferralManager.extractReferralCode(code)
        if (referralCode == null) {
            scanResult = ScanResultState.Error(context.getString(R.string.referral_scan_error_invalid))
            return
        }
        when (val recordResult = PremiumManager.recordScan(context, referralCode)) {
            is ScanResult.Success -> {
                scanResult = ScanResultState.Success(recordResult.daysAwarded)
            }
            is ScanResult.Error -> {
                scanResult = ScanResultState.Error(recordResult.message)
            }
        }
    }

    // QR scanner launcher using ZXing (camera)
    val scanLauncher = rememberLauncherForActivityResult(ScanContract()) { result: ScanIntentResult ->
        if (result.contents == null) {
            // User cancelled scan — don't navigate back, stay on screen
            return@rememberLauncherForActivityResult
        }
        processReferralCode(result.contents)
    }

    // Gallery image picker launcher
    val galleryLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri == null) return@rememberLauncherForActivityResult
        // Decode QR from image URI
        val scannedText = decodeQrFromUri(context, uri)
        processReferralCode(scannedText)
    }

    // Camera permission launcher
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasCameraPermission = granted
        if (granted) {
            val options = ScanOptions().apply {
                setDesiredBarcodeFormats(ScanOptions.QR_CODE)
                setPrompt("Scan a NotiFetch referral QR code")
                setBeepEnabled(true)
                setOrientationLocked(true)
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
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                modifier = Modifier.fillMaxWidth()
            ) {
                // Icon
                    Icon(
                        imageVector = Icons.Default.QrCodeScanner,
                        contentDescription = null,
                        modifier = Modifier.size(72.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    // Subtitle
                    Text(
                        text = stringResource(R.string.referral_scan_subtitle),
                        style = MaterialTheme.typography.bodyLarge,
                        textAlign = TextAlign.Center,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Spacer(modifier = Modifier.height(32.dp))

                    // Camera scan button
                    Button(
                        onClick = {
                            if (hasCameraPermission) {
                                val options = ScanOptions().apply {
                                    setDesiredBarcodeFormats(ScanOptions.QR_CODE)
                                    setPrompt("Scan a NotiFetch referral QR code")
                                    setBeepEnabled(true)
                                    setOrientationLocked(true)
                                    setBarcodeImageEnabled(false)
                                }
                                scanLauncher.launch(options)
                            } else {
                                permissionLauncher.launch(Manifest.permission.CAMERA)
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary
                        )
                    ) {
                        Icon(Icons.Default.QrCodeScanner, contentDescription = null, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(stringResource(R.string.referral_scan_camera_button))
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Gallery scan button
                    OutlinedButton(
                        onClick = { galleryLauncher.launch("image/*") },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.PhotoLibrary, contentDescription = null, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(stringResource(R.string.referral_scan_gallery_button))
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Help text
                    Text(
                        text = stringResource(R.string.referral_scan_help),
                        style = MaterialTheme.typography.bodySmall,
                        textAlign = TextAlign.Center,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
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

/**
 * Decode a QR code from an image URI (gallery).
 * Uses ZXing to read the QR code from the bitmap.
 */
private fun decodeQrFromUri(context: android.content.Context, uri: Uri): String? {
    return try {
        val bitmap = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            val source = ImageDecoder.createSource(context.contentResolver, uri)
            ImageDecoder.decodeBitmap(source) { decoder, _, _ ->
                decoder.setMutableRequired(true)
            }
        } else {
            @Suppress("DEPRECATION")
            MediaStore.Images.Media.getBitmap(context.contentResolver, uri)
        }
        decodeQrFromBitmap(bitmap)
    } catch (e: Exception) {
        null
    }
}

/**
 * Decode a QR code from a Bitmap.
 */
private fun decodeQrFromBitmap(bitmap: Bitmap): String? {
    return try {
        val width = bitmap.width
        val height = bitmap.height
        val pixels = IntArray(width * height)
        bitmap.getPixels(pixels, 0, width, 0, 0, width, height)

        val source = RGBLuminanceSource(width, height, pixels)
        val binaryBitmap = BinaryBitmap(HybridBinarizer(source))
        val reader = MultiFormatReader()
        val result = reader.decode(binaryBitmap)
        result.text
    } catch (e: Exception) {
        null
    }
}

sealed class ScanResultState {
    object Idle : ScanResultState()
    data class Success(val days: Long) : ScanResultState()
    data class Error(val message: String) : ScanResultState()
}
