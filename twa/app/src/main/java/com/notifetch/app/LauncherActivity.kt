package com.notifetch.app

import android.net.Uri
import android.os.Bundle
import com.google.androidbrowserhelper.trusted.LauncherActivity

/**
 * Custom Launcher Activity for NotiFetch TWA.
 *
 * Extends the Trusted Web Activity LauncherActivity from the
 * androidbrowserhelper library. This activity launches the
 * NotiFetch web app in a Chrome Trusted Web Activity, hiding
 * the browser chrome for a native app experience.
 *
 * The Digital Asset Links verification at
 * https://d2-liart-nine.vercel.app/.well-known/assetlinks.json
 * must contain the correct SHA-256 fingerprint of this app's
 * signing certificate for the TWA to launch without browser UI.
 */
class LauncherActivity : LauncherActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun getLaunchingUrl(): Uri {
        return Uri.parse("https://d2-liart-nine.vercel.app")
    }
}
