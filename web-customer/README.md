# KOPI KITA Web Order (Customer Mobile Web App / PWA)

Aplikasi pemesanan kopi berbasis web mobile-first (PWA-ready) yang dirancang untuk pelanggan coffee shop **KOPI KITA Roastery & Slow Bar**. Pelanggan dapat menelusuri katalog kopi artisanal, mengkustomisasi ukuran cup, tingkat gula aren, dan es batu secara visual, melakukan pembayaran QRIS dinamis, serta memantau status pesanan secara real-time.

---

## 🚀 Fitur Utama

1. **Halaman Beranda & Katalog Menu**:
   - Fetch real-time menu dari tabel Supabase `products` di mana `is_available = true` dan `stock_count > 0`.
   - Filter cepat kategori: *Semua Menu, Es Kopi, Hot Brew, Manual Brew, Non-Coffee, Artisan Bakery*.
   - **Hero Promo Banner**: Voucher bundling hemat 30% (`SENJA30`).

2. **Modal Customization (Bottom Sheet)**:
   - Visualisasi grafis cup kopi dinamis (ukuran dan volume cairan berubah mengikuti pilihan).
   - Ukuran cup: **Regular** (12 oz, +Rp 0) vs **Large** (16 oz, +Rp 4.000).
   - Pilihan tingkat manis: *Normal 100%, Less Sugar 50%, No Sugar 0%*.
   - Pilihan es batu: *Normal Ice, Less Ice, No Ice*.
   - Input catatan khusus barista.

3. **Keranjang Belanja (Cart Drawer)**:
   - Pilihan tipe pesanan: **Dine In** (dengan input nomor meja) vs **Take Away / Pickup**.
   - Input nama pemesan.
   - Klaim kupon diskon (contoh: `SENJA30` atau `KOPIKITA5K`).
   - Rincian kalkulasi: Subtotal, Diskon, dan Total Pembayaran.

4. **Pembayaran QRIS Dinamis (Payment Modal)**:
   - Barcode QRIS dinamis berstandar GPN.
   - Generate nomor pesanan unik format `#KPK-xxxx`.
   - Penyimpanan data pesanan ke tabel `orders` dan `order_items` di Supabase.

5. **Live Order Status Tracker (`/order-status/[id]`)**:
   - Pemantauan real-time status dapur:
     `Pesanan Diterima` ➔ `Sedang Diseduh Barista ☕` ➔ `Siap Diambil di Bar 🔔` ➔ `Pesanan Selesai`.
   - Terhubung langsung dengan Kitchen Display System (KDS) di Backoffice Kasir via Supabase Realtime (`.channel()`).
   - Efek selebrasi konfeti saat status pesanan berubah menjadi *Siap Diambil*.
   - Demo Helper: Tombol simulasi untuk menguji pergantian status secara instan.

---

## 🎨 Desain & Tema (Artisanal Skena Warm Brown)

- **Canvas Background**: `#F8F5F0` (Warm Oat Milk Cream)
- **Container**: Mobile-first centered viewport (max-width `480px`) pada desktop
- **Card Surfaces**: `#FFFFFF` dengan border `1px solid #E8DED1` dan `rounded-16px`
- **Primary CTA / Buttons**: `#2B170B` (Dark Roast)
- **Accents**: `#C4823F` (Warm Amber), `#4F6D48` (Sage Green), `#7A5C43` (Mocha)
- **Typography**: Editorial Serif (Playfair Display) untuk judul, Clean Sans-Serif (Inter) untuk navigasi dan harga

---

## 📂 Struktur Direktori

```text
src/
├── app/
│   ├── layout.tsx                     # Root layout dengan mobile container & Google Fonts
│   ├── page.tsx                       # Halaman utama & katalog menu
│   └── order-status/
│       └── [id]/
│           └── page.tsx               # Live Status Tracker pesanan pelanggan
├── components/
│   ├── BottomBar.tsx                  # Floating bar keranjang belanja
│   ├── CartDrawer.tsx                 # Drawer rincian belanja & pilihan Dine In/Pickup
│   ├── CategoryPills.tsx              # Filter kategori scroll horizontal
│   ├── CupCustomizeModal.tsx          # Bottom sheet kustomisasi cup & rasa
│   ├── HeroBanner.tsx                 # Banner promo diskon 30%
│   ├── PaymentModal.tsx               # Modal barcode QRIS & instruksi bayar
│   └── ProductCard.tsx                # Kartu produk menu dengan tombol '+'
├── lib/
│   ├── store.tsx                      # Context state management keranjang belanja
│   └── supabase.ts                    # Supabase JS client & fallback repository
└── types/
```

---

## 🛠️ Menjalankan Aplikasi

1. Buka terminal di folder project:
   ```bash
   cd "d:\. Pelajaran\KK\KIK\APK Prototipe\web-customer"
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```
   *(Atau jalankan port kustom jika berbarengan dengan POS Backoffice: `npx next dev -p 3001`)*

3. Buka di browser:
   [http://localhost:3000](http://localhost:3000) atau [http://localhost:3001](http://localhost:3001)

4. Konfigurasi Supabase (Opsional):
   Ubah kredensial di file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
