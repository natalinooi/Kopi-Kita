# ☕ KOPI KITA - Roastery & Slow Bar Ecosystem

Eksosistem digital lengkap untuk coffee shop modern "KOPI KITA", mencakup tiga aplikasi terintegrasi dengan database **Supabase PostgREST Realtime**:

1. **`web-owner-pos`**: Backoffice, POS Kasir, Live Kanban Display Barista, Manajemen Menu/Stok, & Laporan Analytics (Next.js 14 App Router + Tailwind CSS).
2. **`web-customer`**: Web Order Pelanggan mobile-first PWA-ready dengan kustomisasi cup & QRIS payment (Next.js 14 App Router + Tailwind CSS).
3. **`android-customer`**: Aplikasi Native Android dalam **100% Pure Java 17** (MVVM, Retrofit 2, ViewBinding, Material Design 3, Target SDK 35).

---

## 🏗️ Arsitektur Sistem

```
                         ┌────────────────────────────────────────┐
                         │           SUPABASE DATABASE            │
                         │    (PostgREST + Realtime WebSocket)    │
                         └──────────────────┬─────────────────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               │                            │                            │
               ▼                            ▼                            ▼
     [ web-owner-pos ]              [ web-customer ]            [ android-customer ]
   • POS Kasir                    • Mobile Web Order           • Native Android App
   • Live Kanban Barista          • Cup Customizer             • 100% Pure Java 17
   • Manajemen Stok               • QRIS Payment               • MVVM + Retrofit 2
   • Laporan Penjualan            • Live Order Tracking        • Material Design 3
```

---

## 📁 Struktur Folder Repositori

```
Kopi-Kita/
├── web-owner-pos/          # Aplikasi Web Backoffice & POS Kasir (Next.js 14)
│   ├── src/
│   │   ├── app/            # App Router (/login, /dashboard/pos, /dashboard/orders, dll)
│   │   ├── components/     # UI Components (Sidebar, Live Kanban, POS Grid)
│   │   └── lib/            # Supabase Client & Realtime listeners
│   └── supabase_schema.sql # Database DDL, RLS, Realtime publication, & Seed data
│
├── web-customer/           # Aplikasi Web Order Pelanggan PWA (Next.js 14)
│   └── src/
│       ├── app/            # Katalog menu & Live status tracking
│       ├── components/     # Customizer modal, Cart drawer, QRIS dialog
│       └── lib/            # Cart store & Supabase client
│
├── android-customer/       # Aplikasi Native Android (Java 17, Target SDK 35)
│   └── app/src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/kopikita/customer/
│       │   ├── api/        # Retrofit singleton & PostgREST API Service
│       │   ├── model/      # Product, Order, OrderItem, CartItem
│       │   ├── repository/ # CoffeeRepository (Offline fallback & cache)
│       │   ├── viewmodel/  # HomeViewModel & CartViewModel (LiveData)
│       │   └── ui/         # MainActivity, DetailActivity, CheckoutActivity, OrderStatusActivity
│       └── res/            # Material 3 Earth-Tone Theme & XML Layouts
│
└── README.md
```

---

## 🎨 Tema & Palet Warna (Skena Earth-Tone)

| Nama Warna | Kode Hex | Penggunaan |
|---|---|---|
| **Dark Roast** | `#2B170B` | Brand utama, header, tombol primer |
| **Warm Mocha** | `#7A5C43` | Subtitle, badge, aksen hangat |
| **Oat Milk Cream** | `#F8F5F0` | Latar belakang canvas bersih |
| **Card Surface** | `#FFFFFF` | Permukaan kartu menu & dialog |
| **Border Beige** | `#E8DED1` | Garis batas tipis 1px & separator |
| **Sage Green** | `#4F6D48` | Status pesanan siap, kupon aktif, sukses |

---

## 🚀 Panduan Menjalankan Proyek

### 1. Menjalankan Web Kasir (`web-owner-pos`)
```bash
cd web-owner-pos
npm install
npm run dev
# Buka http://localhost:3000 di browser
```

### 2. Menjalankan Web Order Pelanggan (`web-customer`)
```bash
cd web-customer
npm install
npm run dev -- -p 3001
# Buka http://localhost:3001 di browser
```

### 3. Menjalankan Aplikasi Android (`android-customer`)
1. Buka **Android Studio**.
2. Pilih **Open** -> Arahkan ke folder `android-customer`.
3. Tunggu **Gradle Sync** selesai.
4. Klik tombol **Run 'app'** (`Shift + F10`) untuk menjalankan di HP atau Emulator.
5. Untuk membuat file installer `.apk`: Menu **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.

---

## 🌐 Deploy ke Vercel

Kedua web app di repo ini siap di-deploy langsung ke [Vercel](https://vercel.com):
- **Root Directory**: `web-owner-pos` atau `web-customer`
- **Framework Preset**: Next.js
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase kamu
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon Key / Publishable Key Supabase kamu
