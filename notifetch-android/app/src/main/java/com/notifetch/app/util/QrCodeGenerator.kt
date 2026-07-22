package com.notifetch.app.util

import android.graphics.Bitmap
import android.graphics.Color
import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.qrcode.QRCodeWriter
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel

/**
 * v2.9.83: QR Code Generator
 *
 * Generates a QR code bitmap from any string.
 * Used to encode the referral link (notifetch.in/r/CODE) into a scannable QR.
 */
object QrCodeGenerator {

    /**
     * Generate a QR code bitmap from the given content.
     *
     * @param content The string to encode (e.g., "https://notifetch.in/r/NF-ABC123")
     * @param size Pixel size of the QR code (width = height)
     * @return Bitmap of the QR code, or null if generation failed
     */
    fun generateQrCode(content: String, size: Int = 512): Bitmap? {
        return try {
            val hints = mapOf(
                EncodeHintType.ERROR_CORRECTION to ErrorCorrectionLevel.M,
                EncodeHintType.MARGIN to 1,
                EncodeHintType.CHARACTER_SET to "UTF-8"
            )
            val bitMatrix = QRCodeWriter().encode(content, BarcodeFormat.QR_CODE, size, size, hints)
            val width = bitMatrix.width
            val height = bitMatrix.height
            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
            for (x in 0 until width) {
                for (y in 0 until height) {
                    bitmap.setPixel(x, y, if (bitMatrix.get(x, y)) Color.BLACK else Color.WHITE)
                }
            }
            bitmap
        } catch (e: Exception) {
            null
        }
    }

    /**
     * Generate a QR code for a referral code.
     * The QR encodes the referral link which can be scanned by another user.
     */
    fun generateReferralQrCode(referralCode: String, size: Int = 512): Bitmap? {
        // Encode as a special NotiFetch referral URL
        val content = "https://notifetch.in/r/$referralCode"
        return generateQrCode(content, size)
    }
}
