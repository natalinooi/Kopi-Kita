'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types/database.types';
import { store, SEED_PRODUCTS } from '@/lib/supabaseClient';
import StockToggle from '@/components/StockToggle';
import {
  Package,
  Search,
  Plus,
  Coffee,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const CATEGORIES = ['Semua Kategori', 'Es Kopi', 'Hot Brew', 'Manual Brew', 'Non-Coffee', 'Artisan Bakery'];

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'out_of_stock'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Es Kopi');
  const [newPrice, setNewPrice] = useState<number>(20000);
  const [newStock, setNewStock] = useState<number>(30);
  const [newDescription, setNewDescription] = useState('');

  const loadProducts = async () => {
    const data = await store.getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
    const unsub = store.subscribe(() => {
      loadProducts();
    });
    return () => unsub();
  }, []);

  const handleToggle = async (id: string, isAvailable: boolean) => {
    await store.toggleProductAvailability(id, isAvailable);
    loadProducts();
  };

  const handleStockCountChange = async (id: string, count: number) => {
    await store.updateProductStock(id, count);
    loadProducts();
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      price: newPrice,
      description: newDescription.trim() || null,
      image_url: '/images/06_explore_and_menu_catalog.jpg',
      is_available: newStock > 0,
      stock_count: newStock,
      created_at: new Date().toISOString(),
    };

    // save to store
    const currentProducts = await store.getProducts();
    const updated = [newProd, ...currentProducts];
    if (typeof window !== 'undefined') {
      localStorage.setItem('kopikita_products', JSON.stringify(updated));
    }
    await store.getProducts();
    loadProducts();

    // Reset Form
    setNewName('');
    setNewPrice(20000);
    setNewStock(30);
    setNewDescription('');
    setShowAddModal(false);
  };

  // Filter
  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'Semua Kategori' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAvail =
      filterAvailability === 'all'
        ? true
        : filterAvailability === 'available'
        ? p.is_available && p.stock_count > 0
        : !p.is_available || p.stock_count <= 0;

    return matchesCat && matchesSearch && matchesAvail;
  });

  // Metrics
  const totalItems = products.length;
  const availableItems = products.filter((p) => p.is_available && p.stock_count > 0).length;
  const outOfStockItems = totalItems - availableItems;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-kopi-espresso tracking-tight">
            Katalog & Manajemen Stok Menu
          </h1>
          <p className="text-xs md:text-sm text-kopi-muted mt-0.5">
            Kontrol Ketersediaan Menu Realtime Terintegrasi Kasir & Mobile Apps Customer
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-kopi-espresso hover:bg-kopi-mocha text-white text-xs font-semibold flex items-center gap-2 shadow-warm transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-kopi-amber" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-kopi-border shadow-warm flex items-center justify-between">
          <div>
            <span className="text-xs text-kopi-muted font-medium">Total Menu Terdaftar</span>
            <h3 className="font-serif text-2xl font-bold text-kopi-espresso mt-1">
              {totalItems} <span className="text-xs font-normal text-kopi-muted">Varian</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-kopi-sand/50 text-kopi-mocha flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-kopi-border shadow-warm flex items-center justify-between">
          <div>
            <span className="text-xs text-kopi-muted font-medium">Menu Aktif (Tersedia)</span>
            <h3 className="font-serif text-2xl font-bold text-kopi-sage mt-1">
              {availableItems}{' '}
              <span className="text-xs font-normal text-kopi-muted">Tampil di Apps</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-kopi-sage flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-kopi-border shadow-warm flex items-center justify-between">
          <div>
            <span className="text-xs text-kopi-muted font-medium">Habis / Disembunyikan</span>
            <h3 className="font-serif text-2xl font-bold text-red-600 mt-1">
              {outOfStockItems}{' '}
              <span className="text-xs font-normal text-kopi-muted">Sold Out</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-kopi-border shadow-warm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-kopi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama menu atau deskripsi rasa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-kopi-border bg-kopi-cream/30 focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
            />
          </div>

          {/* Availability Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setFilterAvailability('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterAvailability === 'all'
                  ? 'bg-kopi-espresso text-white'
                  : 'bg-kopi-sand/30 text-kopi-muted hover:bg-kopi-sand'
              }`}
            >
              Semua ({totalItems})
            </button>
            <button
              type="button"
              onClick={() => setFilterAvailability('available')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterAvailability === 'available'
                  ? 'bg-kopi-sage text-white'
                  : 'bg-kopi-sand/30 text-kopi-muted hover:bg-kopi-sand'
              }`}
            >
              Tersedia ({availableItems})
            </button>
            <button
              type="button"
              onClick={() => setFilterAvailability('out_of_stock')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterAvailability === 'out_of_stock'
                  ? 'bg-red-600 text-white'
                  : 'bg-kopi-sand/30 text-kopi-muted hover:bg-kopi-sand'
              }`}
            >
              Habis ({outOfStockItems})
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-kopi-border/60 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1 text-xs font-semibold whitespace-nowrap rounded-full transition-all ${
                selectedCategory === cat
                  ? 'bg-kopi-sand text-kopi-espresso font-bold border border-kopi-mocha'
                  : 'text-kopi-muted hover:text-kopi-espresso'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List with Stock Controls */}
      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-2xl border p-4 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              product.is_available && product.stock_count > 0
                ? 'border-kopi-border'
                : 'border-red-200 bg-red-50/20'
            }`}
          >
            {/* Product Meta Left */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-kopi-sand/40 shrink-0">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-kopi-mocha">
                    <Coffee className="w-6 h-6 opacity-40" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-kopi-sand text-kopi-espresso">
                    {product.category}
                  </span>
                  <h4 className="font-serif font-bold text-base text-kopi-espresso">
                    {product.name}
                  </h4>
                </div>
                <p className="text-xs text-kopi-muted mt-0.5 line-clamp-1 max-w-lg">
                  {product.description || 'Artisanal roastery signature.'}
                </p>
                <span className="text-xs font-bold text-kopi-mocha mt-1 block">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Toggle & Stepper Component */}
            <div className="w-full md:w-auto shrink-0">
              <StockToggle
                product={product}
                onToggle={handleToggle}
                onUpdateStockCount={handleStockCountChange}
              />
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-kopi-border text-kopi-muted">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-30 text-kopi-mocha" />
            <p className="font-semibold text-base text-kopi-espresso">Tidak ada menu yang sesuai</p>
            <p className="text-xs text-kopi-muted mt-0.5">Silakan reset filter pencarian Anda.</p>
          </div>
        )}
      </div>

      {/* MODAL TAMBAH MENU BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-warm-xl border border-kopi-border overflow-hidden">
            <div className="bg-kopi-espresso text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold">Tambah Menu Baru</h3>
                <p className="text-xs text-kopi-sand/80">Katalog Kopi Kita Roastery</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white/80 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-1">
                  Nama Menu
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Es Kopi Kelapa Bakar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-kopi-border focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-1">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-kopi-border bg-white focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
                  >
                    <option value="Es Kopi">Es Kopi</option>
                    <option value="Hot Brew">Hot Brew</option>
                    <option value="Manual Brew">Manual Brew</option>
                    <option value="Non-Coffee">Non-Coffee</option>
                    <option value="Artisan Bakery">Artisan Bakery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-1">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-kopi-border focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-1">
                  Stok Awal (Porsi / Cup)
                </label>
                <input
                  type="number"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-kopi-border focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-1">
                  Deskripsi & Tasting Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan rasa, origin biji kopi, atau komposisi..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-kopi-border focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
                />
              </div>

              <div className="pt-3 border-t border-kopi-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-kopi-espresso hover:bg-kopi-sand rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-kopi-espresso text-white text-xs font-semibold hover:bg-kopi-mocha transition-all shadow-warm"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
