# Proguard rules for KopiKitaCustomer
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.kopikita.customer.model.** { *; }
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
