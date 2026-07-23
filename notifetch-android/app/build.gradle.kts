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
    compileSdk = 36

    defaultConfig {
        applicationId = "com.notifetch.app"
        minSdk = 24
        targetSdk = 36
        versionCode = 114
        versionName = "2.9.86"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        // BuildConfig fields — secrets read from local.properties (not hardcoded)
        buildConfigField("String", "BASE_URL", "\"https://www.notifetch.in/\"")
        buildConfigField("String", "GOOGLE_WEB_CLIENT_ID", "\"895827826409-4k5eqvhsve0n3504tk6lb62ijbkhsi7o.apps.googleusercontent.com\"")

        // v2.9.45: Sentry SDK REMOVED — was causing launch crash via
        // SentryInitProvider ContentProvider auto-init. Crashlytics handles
        // all Android crash reporting now (same as v2.9.34).
    }

    signingConfigs {
        create("release") {
            // Keystore resolution order:
            //   1. NOTIFETCH_KEYSTORE_PATH env var (absolute path to keystore)
            //   2. upload/keystore.jks + env vars (NOTIFETCH_STORE_PASSWORD / NOTIFETCH_KEY_ALIAS / NOTIFETCH_KEY_PASSWORD)
            //      — This is the ORIGINAL Play Store upload key (SHA-1 59:70:88:1E...).
            //      — Used by build-playstore.sh which sets the env vars automatically.
            //   3. notifetch-android/upload-keystore.jks + keystore.properties (auto-generated fallback for fresh listings)
            //   4. Falls back to debug signing (build succeeds but AAB is NOT Play-Store uploadable)
            val envKeystorePath = System.getenv("NOTIFETCH_KEYSTORE_PATH")
            val uploadKeystore = if (!envKeystorePath.isNullOrBlank()) {
                file(envKeystorePath)
            } else {
                file("${rootProject.projectDir}/../upload/keystore.jks")
            }
            val generatedKeystore = file("${rootProject.projectDir}/upload-keystore.jks")
            val keystoreProps = file("${rootProject.projectDir}/keystore.properties")

            val storeFileToUse = when {
                uploadKeystore.exists() -> uploadKeystore
                generatedKeystore.exists() -> generatedKeystore
                else -> null
            }

            if (storeFileToUse != null) {
                storeFile = storeFileToUse
                if (uploadKeystore.exists()) {
                    // Original Play Store upload key — credentials come from env vars
                    storePassword = System.getenv("NOTIFETCH_STORE_PASSWORD") ?: ""
                    keyAlias = System.getenv("NOTIFETCH_KEY_ALIAS") ?: ""
                    keyPassword = System.getenv("NOTIFETCH_KEY_PASSWORD") ?: ""
                } else if (keystoreProps.exists()) {
                    // Auto-generated fallback keystore — credentials from properties file
                    val props = Properties().apply { load(keystoreProps.inputStream()) }
                    storePassword = props.getProperty("storePassword", "")
                    keyAlias = props.getProperty("keyAlias", "")
                    keyPassword = props.getProperty("keyPassword", "")
                }
            }
        }
    }

    buildTypes {
        debug {
            isMinifyEnabled = false
            applicationIdSuffix = ".debug"
            buildConfigField("Boolean", "IS_DEBUG", "true")
        }
        release {
            // v2.9.48: R8 re-enabled (GitHub Actions CI handles it fine).
            isMinifyEnabled = false
            isShrinkResources = false  // v2.9.66 sandbox: R8 disabled (OOM), CI will re-enable
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            buildConfigField("Boolean", "IS_DEBUG", "false")
            ndk.debugSymbolLevel = "FULL"

            // Signing: use release keystore if available, otherwise fall back to debug
            // signing so local builds never hard-fail. The build-playstore.sh script
            // generates upload-keystore.jks automatically if none exists.
            val releaseSigning = signingConfigs.findByName("release")
            if (releaseSigning != null && releaseSigning.storeFile?.exists() == true
                && !releaseSigning.storePassword.isNullOrEmpty()) {
                signingConfig = releaseSigning
            } else {
                // Fall back to debug signing — AAB builds but is NOT Play Store uploadable
                signingConfig = signingConfigs.getByName("debug")
            }
        }
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // Core Android
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.lifecycle.process)
    implementation(libs.androidx.activity.compose)
    // v2.9.82: AppCompat for per-app language switching (AppCompatDelegate.setApplicationLocales)
    implementation("androidx.appcompat:appcompat:1.7.0")
    // v2.9.83: QR code generation + scanning
    implementation("com.google.zxing:core:3.5.3")
    implementation("com.journeyapps:zxing-android-embedded:4.3.0")

    // Compose
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    debugImplementation(libs.androidx.compose.ui.tooling)

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

    // DataStore
    implementation(libs.datastore.preferences)

    // Firebase
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.auth)
    implementation(libs.firebase.messaging)
    implementation(libs.firebase.analytics)
    implementation(libs.firebase.crashlytics)
    implementation(libs.firebase.crashlytics.ndk)


    // Google Auth
    implementation(libs.play.services.auth)

    // v2.9.59 SECURITY: Encrypted token storage (replaces plain DataStore for auth tokens)
    implementation(libs.androidx.security.crypto)

    // WorkManager
    implementation(libs.work.runtime.ktx)
    implementation(libs.hilt.work)
    ksp(libs.hilt.work.compiler)

    // Coroutines
    implementation(libs.kotlinx.coroutines.android)

    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
