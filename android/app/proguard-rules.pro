# ProGuard rules for SadikHub
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-dontwarn androidx.webkit.**
