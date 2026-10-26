# KOPI KITA - Native Android Customer Application

A modern, high-performance, native Android application built in **100% Pure Java (Java 17 compatible)** using Google's **Material Design 3**, **MVVM (Model-View-ViewModel)** architecture with Android Architecture Components & LiveData, **ViewBinding**, and **Retrofit 2** connecting to Supabase PostgREST endpoints.

Part of the **KOPI KITA Roastery & Slow Bar** ecosystem alongside `web-owner-pos` (Backoffice POS & Barista Live Kanban) and `web-customer` (Mobile Web App).

---

## ☕ Key Specifications

- **Application Name**: KopiKitaCustomer (`KOPI KITA`)
- **Package Name**: `com.kopikita.customer`
- **Language**: **100% Pure Java** (Java 17 source & target compatibility, NO Kotlin, NO Jetpack Compose)
- **UI Architecture**: XML Layouts with ViewBinding
- **Design System**: Material Design 3 Earth-Tone "Skena" Theme (Dark Roast, Warm Mocha, Oat Milk Cream, Sage Green)
- **Target SDK**: 35 (Android 15)
- **Min SDK**: 24 (Android 7.0 Nougat - 95%+ device coverage)
- **Networking**: Retrofit 2.11.0 + Gson + OkHttp3 Logging Interceptor (Supabase PostgREST)
- **Offline Reliability**: Graceful fallback with seed menu & local order cache when offline or unconfigured

---

## 🎨 Visual Design System & Earth-Tone Palette

| Token | Hex Color | Usage |
|---|---|---|
| `colorPrimary` / `colorDarkRoast` | `#2B170B` | Deep espresso brand header, primary buttons |
| `colorSecondary` / `colorWarmMocha` | `#7A5C43` | Subtitles, category indicators, prices |
| `colorBackground` / `colorOatCream`| `#F8F5F0` | Warm oat milk canvas background |
| `colorSurface` / `colorWhite` | `#FFFFFF` | Card surfaces, modals, dialogs |
| `colorBorder` / `colorBeige` | `#E8DED1` | Subtle 1px warm borders & separators |
| `colorTextPrimary` | `#2B170B` | Headlines, product titles, bold text |
| `colorTextMuted` | `#8C7A6B` | Secondary notes, descriptions |
| `colorSuccess` / `colorSageGreen` | `#4F6D48` | Order paid status, completed steps, discount badge |

---

## 📁 Project Architecture & Directory Structure

```
android-customer/
├── build.gradle (Root Gradle file with AGP 8.5.2)
├── settings.gradle (Repositories & app module configuration)
├── gradle.properties (AndroidX, Jetifier, 2GB Gradle Heap)
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties (Gradle 8.7-bin)
└── app/
    ├── build.gradle (Module build file with ViewBinding & Java 17)
    ├── proguard-rules.pro
    └── src/
        └── main/
            ├── AndroidManifest.xml (INTERNET permissions, Activities)
            ├── java/com/kopikita/customer/
            │   ├── api/
            │   │   ├── SupabaseApiClient.java (Retrofit singleton with apikey & auth interceptors)
            │   │   └── SupabaseApiService.java (GET /products, POST /orders, POST /order_items)
            │   ├── model/
            │   │   ├── Product.java (Menu item model)
            │   │   ├── Order.java (Supabase order record)
            │   │   ├── OrderItem.java (Order line items)
            │   │   └── CartItem.java (Local customized cup in cart)
            │   ├── repository/
            │   │   └── CoffeeRepository.java (Data repository with offline seed fallback & local cache)
            │   ├── utils/
            │   │   ├── CartManager.java (Singleton cart state, promo codes, observer pattern)
            │   │   ├── Constants.java (Supabase URL, Anon Key, promo codes)
            │   │   └── RupiahFormatter.java (Currency formatting)
            │   ├── viewmodel/
            │   │   ├── HomeViewModel.java (Catalog state, category filtering, search, cart count)
            │   │   └── CartViewModel.java (Cart items, discount calculations, order submission)
            │   └── ui/
            │       ├── adapter/
            │       │   ├── ProductAdapter.java (2-column MaterialCardView Grid)
            │       │   ├── CategoryAdapter.java (Horizontal Pill category selector)
            │       │   └── CartAdapter.java (Cart list with +/- quantity steppers)
            │       ├── MainActivity.java (Catalog, search, promo claim, floating cart bar)
            │       ├── DetailActivity.java (Cup size 12oz/16oz, sugar %, ice level, notes)
            │       ├── CheckoutActivity.java (Order type, table/name, dynamic QRIS popup)
            │       └── OrderStatusActivity.java (3-step visual tracker & simulation)
            └── res/
                ├── drawable/ (ic_coffee_cup, bg_promo_banner, ic_qris_sample, etc.)
                ├── layout/ (activity_main, activity_detail, activity_checkout, activity_order_status, etc.)
                ├── values/ (colors.xml, strings.xml, themes.xml)
                └── xml/ (backup_rules.xml, data_extraction_rules.xml)
```

---

## 🚀 How to Open, Sync, and Run in Android Studio

1. **Launch Android Studio** (Ladybug, Koala, Hedgehog, or newer).
2. Choose **Open** (or `File` -> `Open`).
3. Navigate to and select folder:
   ```
   D:\. Pelajaran\KK\KIK\APK Prototipe\android-customer
   ```
4. Click **OK**. Android Studio will automatically recognize the Gradle build files.
5. Wait for **Gradle Sync** to finish. Android Studio will download dependencies (Retrofit, Material 3, Lifecycle) and generate the ViewBinding classes.
6. Connect an Android phone via USB debugging or start an Android Emulator (API 24 to 35).
7. Click the green **Run 'app'** button (`Shift + F10`).

---

## 🌐 Supabase REST API Configuration

To connect to your live Supabase database, update the values in:
`app/src/main/java/com/kopikita/customer/utils/Constants.java`

```java
public static final String SUPABASE_URL = "https://<PROJECT-REF>.supabase.co/rest/v1/";
public static final String SUPABASE_ANON_KEY = "<YOUR_SUPABASE_ANON_KEY>";
```

The database schema matches `web-owner-pos/supabase_schema.sql`. Orders placed via the Android app appear immediately in the owner's Barista Kanban board and POS transaction history.

---

## 💡 Promo Codes Supported

- **`SENJA30`**: 30% discount on entire cart.
- **`KOPIKITA5K`**: Rp 5.000 flat discount.
