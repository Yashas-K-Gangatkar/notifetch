# NotiFetch ProGuard Rules

# Retrofit
-keepattributes Signature
-keepattributes Exceptions
-keep class com.notifetch.app.data.remote.** { *; }
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}

# Moshi
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.squareup.moshi.** { *; }
-keep interface com.squareup.moshi.** { *; }
-keepclassmembers class com.notifetch.app.data.remote.** {
    <fields>;
}

# Room
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *

# Kotlin Coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

# Hilt
-dontwarn dagger.hilt.**

# Firebase
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# Razorpay
-keep class com.razorpay.** { *; }
-keep class proguard.annotation.** { *; }
-dontwarn proguard.annotation.**
-dontwarn com.google.android.apps.nbu.paisa.inapp.client.**
