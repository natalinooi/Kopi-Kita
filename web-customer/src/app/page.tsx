'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, getAvailableProducts, SEED_PRODUCTS } from '@/lib/supabase';
import { CartProvider } from '@/lib/store';
import HeroBanner from '@/components/HeroBanner';
import CategoryPills from '@/components/CategoryPills';
import ProductCard from '@/components/ProductCard';
import CupCustomizeModal from '@/components/CupCustomizeModal';
import CartDrawer from '@/components/CartDrawer';
import PaymentModal from '@/components/PaymentModal';
import BottomBar from '@/components/BottomBar';
import { Search, Coffee, MapPin, Clock } from 'lucide-react';

const CATEGORIES = [
  'Semua Menu',
  'Es Kopi',
  'Hot Brew',
  'Manual Brew',
  'Non-Coffee',
  'Artisan Bakery',
];

function HomeContent() {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('Semua Menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      const data = await getAvailableProducts();
      if (data && data.length > 0) {
        setProducts(data);
      }
    };
    fetchMenu();
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat =
      activeCategory === 'Semua Menu' ||
      p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col pb-28">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-kopi-canvas/90 backdrop-blur-md px-4 py-3 border-b border-kopi-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-kopi-espresso flex items-center justify-center text-white shadow-warm">
            <Coffee className="w-5 h-5 text-kopi-amber" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="font-serif font-extrabold text-base tracking-wider text-kopi-espresso">
                KOPI KITA
              </h1>
              <span className="text-[10px] font-bold text-kopi-sand bg-kopi-mocha px-1.5 py-0.2 rounded">
                ROASTERY
              </span>
            </div>
            <p className="text-[10px] text-kopi-mocha font-semibold flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-kopi-amber" /> Sudirman Roastery Hub
            </p>
          </div>
        </div>

        {/* Status / History Shortcut */}
        <Link
          href="/order-status/latest"
          className="text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-kopi-border bg-white text-kopi-espresso hover:bg-kopi-sand flex items-center gap-1 shadow-sm transition-colors"
        >
          <Clock className="w-3 h-3 text-kopi-amber" />
          <span>Status Pesanan</span>
        </Link>
      </header>

      {/* Hero Greeting & Search */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-[11px] font-medium text-kopi-muted">Selamat Datang di</span>
            <h2 className="font-serif text-xl font-bold text-kopi-espresso">
              Slow Bar & Roastery
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-kopi-sage flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Bar Buka
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-kopi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari es kopi aren, pour over, bakery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-kopi-border bg-white text-kopi-espresso placeholder:text-kopi-muted focus:outline-none focus:ring-1 focus:ring-kopi-espresso shadow-warm"
          />
        </div>
      </div>

      {/* Hero Curated Banner */}
      <HeroBanner />

      {/* Category Pills */}
      <CategoryPills
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* 2-Column Product Grid */}
      <section className="px-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-16 text-center text-kopi-muted bg-white rounded-card border border-kopi-border mt-3 p-4">
            <Coffee className="w-10 h-10 mx-auto mb-2 opacity-30 text-kopi-mocha" />
            <p className="font-serif font-bold text-sm text-kopi-espresso">Menu Tidak Ditemukan</p>
            <p className="text-[11px] text-kopi-muted mt-0.5">
              Coba gunakan kata kunci lain atau pilih kategori Semua Menu.
            </p>
          </div>
        )}
      </section>

      {/* Modals & Drawers */}
      <CupCustomizeModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        onProceedToPayment={() => setIsPaymentOpen(true)}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />

      {/* Sticky Bottom Summary Bar */}
      <BottomBar />
    </div>
  );
}

export default function HomePage() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
}
