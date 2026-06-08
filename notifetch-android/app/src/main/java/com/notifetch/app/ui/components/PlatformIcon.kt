package com.notifetch.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.notifetch.app.util.Constants

@Composable
fun PlatformIcon(
    platform: String,
    color: Color,
    modifier: Modifier = Modifier,
    size: Dp = 44.dp,
    packageName: String? = null
) {
    val initials = getPlatformInitials(platform, packageName)

    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .background(color),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = initials,
            color = Color.White,
            fontSize = if (size > 36.dp) 16.sp else 12.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )
    }
}

/**
 * Generate initials for a platform display name.
 *
 * Uses the resolved display name (which may be a user custom name).
 * If the user renamed "Swiggy Delivery" to "Z", the initials will be "Z".
 * If using the default "Swiggy Delivery", initials will be "SD".
 *
 * For known platforms with brand names, we have predefined 2-letter codes.
 * For custom names, we take the first letter of each word (up to 2 words).
 */
private fun getPlatformInitials(platform: String, packageName: String? = null): String {
    // If we have a packageName, check if the platform name matches a known default
    // If it does, use the predefined initials for that brand
    if (packageName != null) {
        val defaultName = Constants.PARTNER_PACKAGES[packageName]
        // If the display name matches the default (user hasn't renamed it),
        // use predefined brand initials
        if (defaultName != null && defaultName == platform) {
            return getBrandInitials(packageName)
        }
    }

    // For custom names or unknown platforms, generate from the display name
    val words = platform.trim().split(Regex("\\s+"))
    return when {
        words.isEmpty() || platform.isBlank() -> "?"
        words.size == 1 -> words[0].take(2).uppercase()
        else -> "${words[0].first()}${words[1].first()}".uppercase()
    }
}

/**
 * Predefined 2-letter initials for known platform brands.
 * These are based on the brand name, not the generic category name.
 */
private fun getBrandInitials(packageName: String): String {
    return when (packageName) {
        // Food Delivery
        "com.ubercab.driver" -> "UB"
        "com.doordash.driverapp" -> "DD"
        "com.grubhub.driver" -> "GH"
        "com.deliveroo.driverapp" -> "DR"
        "com.justeat.courier.uk" -> "JE"
        "com.takeaway.delivered4all" -> "TK"
        "com.lieferando.courier" -> "LF"
        "com.logistics.rider.foodpanda" -> "FP"
        "in.swiggy.deliveryapp" -> "SW"
        "com.zomato.delivery" -> "ZM"
        "br.com.ifood.driver.app" -> "IF"
        "com.rappi.storekeeper" -> "RP"
        "com.wolt.courierapp" -> "WL"
        "com.logistics.rider.glovo" -> "GV"
        "com.demaecan.DemaecanDriver" -> "DM"
        "com.logistics.rider.talabat" -> "TB"
        "com.menulog.courier" -> "ML"
        "com.sankuai.sailor.courier" -> "KT"

        // Grocery
        "com.instacart.shopper" -> "IC"
        "com.gopuff.godrive2.live" -> "GP"
        "app.blinkit.onboarding" -> "BK"
        "com.bigbasket.dapp.activity" -> "BB"
        "com.mercadoenvios.crowdsourcing" -> "ME"
        "com.mercadoenvios.driver" -> "MF"
        "au.com.woolworths.android.driver" -> "WG"
        "com.zepto.rider" -> "ZP"
        "com.flink.workforce" -> "FK"
        "com.shipt.shopper" -> "SH"

        // Package
        "com.amazon.flex.rabbit" -> "AF"
        "com.ups.genesispd" -> "UP"
        "com.dunzo.partner" -> "DZ"
        "com.lalamove.global.driver.sea" -> "LM"
        "global.dostavista.courier" -> "BZ"

        // Courier
        "com.postmates.android.courier" -> "PM"
        "com.roadie.drive.android.app" -> "RD"
        "com.stuart.courier" -> "ST"
        "com.quadx.riderapp" -> "GG"

        // Last-Mile
        "com.amazon.relay" -> "AR"
        "com.ekartkiranaonboarding" -> "EK"
        "com.ekart.logistics.app" -> "EF"
        "id.my.irsyadf.jobdriver" -> "JN"
        "com.aramex.ecourier" -> "AX"
        "co.ninjavan.swiftninja_global" -> "NV"

        // Ride
        "com.lyft.android.driver" -> "LY"
        "com.olacabs.oladriver" -> "OL"
        "com.grabtaxi.driver2" -> "GR"
        "com.careem.adma" -> "CR"
        "com.didiglobal.driver" -> "DI"
        "ee.mtakso.driver" -> "BT"

        // Other
        "com.theporter.android.driverapp" -> "PT"
        "com.rapido.rider" -> "RC"
        "in.shadowfax.gandalf" -> "SF"
        "com.gojek.partner" -> "GJ"
        "com.delhivery.delhiverypartner" -> "DL"
        "com.ecomexpress.oneBoarding" -> "EX"
        "com.xpressbees.unified_new_arch" -> "XB"
        "in.letstransport.supply" -> "LT"
        "net.blowhorn.driverapp" -> "BH"
        "com.driveu.partner" -> "DU"
        "app.yulu.android.partner" -> "YL"

        // Legacy
        "in.swiggy.partner" -> "SW"
        "com.zomato.deliverypartner" -> "ZM"
        "com.amazon.flex" -> "AF"
        "com.flipkart.logistics" -> "FK"

        else -> platform.take(2).uppercase()
    }
}
