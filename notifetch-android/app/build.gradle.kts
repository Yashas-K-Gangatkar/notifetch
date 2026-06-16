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

android {
    namespace = "com.notifetch.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.notifetch.app"
        minSdk = 24
        targetSdk = 35
<<<<<<< HEAD
        versionCode = 26
        versionName = "2.9.0"
=======
        versionCode = 27
        versionName = "2.9.1"
>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        // BuildConfig fields — secrets read from local.properties (not hardcoded)
        buildConfigField("String", "BASE_URL", "\"https://www.notifetch.in/\"")
        buildConfigField("String", "GOOGLE_WEB_CLIENT_ID", "\"895827826409-4k5eqvhsve0n3504tk6lb62ijbkhsi7o.apps.googleusercontent.com\"")
    }

    signingConfigs {
        create("release") {
<<<<<<< HEAD
            val keystoreFile = file("keystore.jks")
            storeFile = if (keystoreFile.exists()) keystoreFile else file("debug.keystore")
            storePassword = System.getenv("NOTIFETCH_STORE_PASSWORD") ?: "android"
            keyAlias = System.getenv("NOTIFETCH_KEY_ALIAS") ?: "notifetch"
            keyPassword = System.getenv("NOTIFETCH_KEY_PASSWORD") ?: "android"
=======
            storeFile = file("${rootProject.projectDir}/../upload/keystore.jks")
            storePassword = System.getenv("NOTIFETCH_STORE_PASSWORD") ?: ""
            keyAlias = System.getenv("NOTIFETCH_KEY_ALIAS") ?: ""
            keyPassword = System.getenv("NOTIFETCH_KEY_PASSWORD") ?: ""
>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)
        }
    }

    buildTypes {
<<<<<<< HEAD
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            signingConfig = signingConfigs.getByName("release")
=======
        debug {
            isMinifyEnabled = false
            buildConfigField("Boolean", "IS_DEBUG", "true")
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
<<<<<<< HEAD
            ndk.debugSymbolLevel = "FULL"
        }
        debug {
            isMinifyEnabled = false
            applicationIdSuffix = ".debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
=======
            buildConfigField("Boolean", "IS_DEBUG", "false")

            // Signing config — read keystore details from environment variables
            signingConfig = signingConfigs.getByName("release")
        }
>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

<<<<<<< HEAD
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.15"
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
=======
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = "11"
>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)
    }
}

dependencies {
<<<<<<< HEAD
    // AndroidX Core
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.activity.compose)

    // Compose BOM
=======
    // Core Android
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)

    // Compose
>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
<<<<<<< HEAD
    debugImplementation(libs.androidx.compose.ui.tooling)
=======
>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)

    // Navigation
    implementation(libs.androidx.navigation.compose)

    // Hilt
    implementation(libs.hilt.android)
    ksp(libs.hilt.android.compiler)
    implementation(libs.hilt.navigation.compose)

    // Room
    implementation(libs.room.runtime)
    implementation(libs.room.ktx)
    ksp(libs.room.compiler)

    // Retrofit + OkHttp + Moshi
    implementation(libs.retrofit)
    implementation(libs.retrofit.converter.moshi)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)
    implementation(libs.moshi)
    implementation(libs.moshi.kotlin)

<<<<<<< HEAD
=======
    // DataStore
    implementation(libs.datastore.preferences)

>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)
    // Firebase
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.auth)
    implementation(libs.firebase.messaging)
    implementation(libs.firebase.analytics)
    implementation(libs.firebase.crashlytics)
<<<<<<< HEAD
    implementation(libs.firebase.crashlytics.ndk)

    // Google Sign-In
=======

    // Google Auth
>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)
    implementation(libs.play.services.auth)

    // WorkManager
    implementation(libs.work.runtime.ktx)
    implementation(libs.hilt.work)
    ksp(libs.hilt.work.compiler)

<<<<<<< HEAD
    // DataStore
    implementation(libs.datastore.preferences)

    // Coroutines
    implementation(libs.kotlinx.coroutines.android)

=======
    // Coroutines
    implementation(libs.kotlinx.coroutines.android)

    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation("androidx.compose.ui:ui-test-manifest")
>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)
}
