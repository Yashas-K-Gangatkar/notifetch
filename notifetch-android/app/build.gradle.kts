plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt)
    alias(libs.plugins.ksp)
    alias(libs.plugins.google.services)
    alias(libs.plugins.crashlytics)
}

import java.util.Properties

// Read secrets from local.properties (gitignored) — never hardcode API keys
val localProps = Properties().apply {
    val file = rootProject.file("local.properties")
    if (file.exists()) load(file.inputStream())
}
val razorpayKey: String = localProps.getProperty("RAZORPAY_KEY", "rzp_test_YourTestKeyHere")

android {
    namespace = "com.notifetch.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.notifetch.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 23
        versionName = "2.7.0"