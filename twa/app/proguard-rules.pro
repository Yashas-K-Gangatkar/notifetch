# Add project specific ProGuard rules here.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep TWA launcher activity
-keep class com.notifetch.app.** { *; }
