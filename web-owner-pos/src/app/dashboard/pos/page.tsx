'use client';

import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderType, PaymentMethod } from '@/types/database.types';
import { store, SEED_PRODUCTS } from '@/lib/supabaseClient';
import PosItemCard from '@/components/PosItemCard';
import ReceiptModal from '@/components/ReceiptModal';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  QrCode,
  Banknote,
  CheckCircle,
  Tag,
  Coffee,
  Utensils,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  User,
} from 'lucide-react';

const CATEGORIES = ['Semua Menu', 'Es Kopi', 'Hot Brew', 'Manual Brew', 'Non-Coffee', 'Artisan Bakery'];

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('Semua Menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [orderNotes, setOrderNotes] = useState('');

  // Discount & Coupons
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState<string | null>(null);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load products
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

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'Semua Menu' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Cart operations
  const handleAddToCart = (
    product: Product,
    options: {
      size: 'Regular' | 'Large';
      temperature: 'Ice' | 'Hot';
      sugar_level: 'Normal 100%' | 'Less Sugar 50%' | 'No Sugar 0%';
      notes?: string;
    }
  ) => {
    const extraPrice = options.size === 'Large' ? 4000 : 0;
    const unitPrice = product.price + extraPrice;

    // Check if duplicate item exists with same configurations
    const lineKey = `${product.id}-${options.size}-${options.temperature}-${options.sugar_level}-${options.notes || ''}`;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.id === lineKey);
      if (existingIdx >= 0) {
        const updated = [...prevCart];
        const currentQty = updated[existingIdx].quantity;
        updated[existingIdx].quantity = currentQty + 1;
        updated[existingIdx].totalPrice = (currentQty + 1) * unitPrice;
        return updated;
      } else {
        const newItem: CartItem = {
          id: lineKey,
          product,
          quantity: 1,
          size: options.size,
          temperature: options.temperature,
          sugar_level: options.sugar_level,
          notes: options.notes,
          unitPrice,
          totalPrice: unitPrice,
        };
        return [...prevCart, newItem];
      }
    });
  };

  const handleUpdateQty = (lineKey: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === lineKey) {
            const newQty = item.quantity + delta;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (lineKey: string) => {
    setCart((prev) => prev.filter((item) => item.id !== lineKey));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscountAmount(0);
    setCouponApplied(null);
    setCouponCode('');
  };

  // Calculations
  const subtotal = cart.reduce((acc, it) => acc + it.totalPrice, 0);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'SENJA30') {
      const disc = Math.round(subtotal * 0.3);
      setDiscountAmount(disc);
      setCouponApplied('SENJA30 (Diskon 30%)');
    } else if (code === 'KOPIKITA5K' || code === 'BARISTA5K') {
      const disc = Math.min(5000, subtotal);
      setDiscountAmount(disc);
      setCouponApplied(`${code} (-Rp 5.000)`);
    } else if (code === 'SKENA10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setCouponApplied('SKENA10 (Diskon 10%)');
    } else {
      alert('Kupon tidak valid! Coba gunakan kode: SENJA30 atau KOPIKITA5K');
    }
  };

  // Open Payment
  const handleOpenPayment = () => {
    if (cart.length === 0) return;
    setCashTendered(totalAmount);
    setShowPaymentModal(true);
  };

  // Confirm Checkout
  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    const randomOrderNumber = `KK-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalCustomerName = customerName.trim() || 'Pelanggan Walk-In';

    const orderPayload = {
      order_number: randomOrderNumber,
      customer_name: finalCustomerName,
      order_type: orderType,
      status: 'pesanan_masuk' as const,
      total_amount: totalAmount,
      discount_amount: discountAmount,
      payment_method: paymentMethod,
      payment_status: 'paid' as const,
      cashier_name: typeof window !== 'undefined' ? localStorage.getItem('kopikita_user_name') || 'Kasir 1' : 'Kasir 1',
      notes: orderNotes.trim() || null,
    };

    const itemsPayload = cart.map((it) => ({
      product_id: it.product.id,
      product_name: it.product.name,
      quantity: it.quantity,
      unit_price: it.unitPrice,
      subtotal: it.totalPrice,
      size: it.size,
      temperature: it.temperature,
      sugar_level: it.sugar_level,
      customization_notes: it.notes,
    }));

    try {
      const created = await store.createOrder(orderPayload, itemsPayload);
      setCompletedOrder(created);
      setShowPaymentModal(false);
      setShowReceiptModal(true);
      handleClearCart();
      setCustomerName('');
      setOrderNotes('');
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Gagal memproses pesanan.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-kopi-espresso tracking-tight">
            POS Terminal Kasir
          </h1>
          <p className="text-xs md:text-sm text-kopi-muted mt-0.5">
            Pencatatan Pesanan Kasir & Pembayaran Cepat QRIS / Tunai
          </p>
        </div>

        {/* Quick info badges */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-kopi-border text-xs font-semibold text-kopi-espresso shadow-warm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Shift Aktif: Sudirman Hub
          </span>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Catalog (7 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-white p-4 rounded-2xl border border-kopi-border shadow-warm space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-kopi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kopi, pour over, matcha, croissant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-kopi-border bg-kopi-cream/40 text-sm focus:outline-none focus:ring-1 focus:ring-kopi-espresso text-kopi-espresso placeholder:text-kopi-muted"
              />
            </div>

            {/* Categories Scrollable Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-kopi-espresso text-white shadow-warm'
                      : 'bg-kopi-sand/30 text-kopi-muted hover:bg-kopi-sand hover:text-kopi-espresso border border-kopi-border/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <PosItemCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-kopi-border text-kopi-muted">
              <Coffee className="w-12 h-12 mx-auto mb-2 opacity-30 text-kopi-mocha" />
              <p className="font-semibold text-base text-kopi-espresso">Produk tidak ditemukan</p>
              <p className="text-xs text-kopi-muted mt-1">Coba kata kunci pencarian atau kategori lain.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Cashier Cart & Summary (5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl border border-kopi-border shadow-warm-xl p-5 sticky top-6 flex flex-col justify-between min-h-[620px]">
          <div>
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-3 border-b border-kopi-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-kopi-mocha" />
                <h3 className="font-serif font-bold text-lg text-kopi-espresso">
                  Keranjang Kasir
                </h3>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Customer Details & Service Type */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-kopi-mocha mb-1">
                  Nama Pelanggan / Nomor Meja
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-kopi-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Contoh: Dimas (Meja 03)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-kopi-border bg-kopi-cream/30 focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
                  />
                </div>
              </div>

              {/* Service Type Switch */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    orderType === 'dine_in'
                      ? 'border-kopi-espresso bg-kopi-sand/50 text-kopi-espresso ring-1 ring-kopi-espresso'
                      : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Dine In (Di Sini)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('take_away')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    orderType === 'take_away'
                      ? 'border-kopi-espresso bg-kopi-sand/50 text-kopi-espresso ring-1 ring-kopi-espresso'
                      : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Take Away (Bungkus)</span>
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="mt-4 space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl border border-kopi-border/70 bg-kopi-sand/15 flex items-start justify-between gap-2 text-xs"
                >
                  <div className="flex-1">
                    <span className="font-bold text-kopi-espresso line-clamp-1">
                      {item.product.name}
                    </span>
                    <div className="text-[11px] text-kopi-muted flex flex-wrap gap-1 mt-0.5">
                      <span className="bg-white px-1.5 py-0.2 rounded border border-kopi-border/60">
                        {item.size}
                      </span>
                      <span className="bg-white px-1.5 py-0.2 rounded border border-kopi-border/60">
                        {item.temperature}
                      </span>
                      <span className="bg-white px-1.5 py-0.2 rounded border border-kopi-border/60">
                        {item.sugar_level}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-[10px] text-amber-800 italic mt-0.5">* {item.notes}</p>
                    )}
                    <span className="text-kopi-mocha font-semibold text-xs mt-1 block">
                      Rp {item.totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white border border-kopi-border flex items-center justify-center hover:bg-kopi-sand transition-colors"
                    >
                      <Minus className="w-3 h-3 text-kopi-espresso" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-kopi-border flex items-center justify-center hover:bg-kopi-sand transition-colors"
                    >
                      <Plus className="w-3 h-3 text-kopi-espresso" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Hapus Item"
                      className="w-6 h-6 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors ml-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="py-8 text-center text-kopi-muted/70">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Keranjang masih kosong.</p>
                  <p className="text-[11px] text-kopi-muted/50 mt-0.5">
                    Pilih menu di sebelah kiri untuk menambahkan pesanan.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Calculations & Pay Trigger */}
          <div className="mt-5 pt-4 border-t border-kopi-border space-y-3">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-kopi-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Kupon (SENJA30 / KOPIKITA5K)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-xs rounded-xl border border-kopi-border uppercase font-mono focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
                />
              </div>
              <button
                type="submit"
                disabled={!couponCode}
                className="px-3 py-1.5 rounded-xl bg-kopi-sand text-kopi-espresso text-xs font-semibold hover:bg-kopi-border transition-colors disabled:opacity-50"
              >
                Terapkan
              </button>
            </form>

            {couponApplied && (
              <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <span className="font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Kupon: {couponApplied}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCouponApplied(null);
                    setDiscountAmount(0);
                    setCouponCode('');
                  }}
                  className="text-red-500 font-bold hover:underline"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-kopi-muted">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} item):</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Potongan Diskon:</span>
                  <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-kopi-espresso pt-1.5 border-t border-kopi-border">
                <span>Total Tagihan:</span>
                <span className="text-lg">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handleOpenPayment}
              disabled={cart.length === 0}
              className="w-full py-3.5 px-4 rounded-2xl bg-kopi-espresso hover:bg-kopi-mocha text-white text-sm font-semibold transition-all shadow-warm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Bayar Pesanan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL PEMBAYARAN: QRIS & TUNAI */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-warm-xl border border-kopi-border overflow-hidden">
            {/* Header */}
            <div className="bg-kopi-espresso text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-kopi-sand/70 block">
                  Penyelesaian Pembayaran
                </span>
                <h3 className="font-serif text-xl font-bold">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white/80 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Payment Method Switch Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-kopi-sand/30 p-1.5 rounded-2xl border border-kopi-border">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'qris'
                      ? 'bg-kopi-espresso text-white shadow-warm'
                      : 'text-kopi-muted hover:text-kopi-espresso'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>QRIS Dinamis</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-kopi-espresso text-white shadow-warm'
                      : 'text-kopi-muted hover:text-kopi-espresso'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Tunai / Cash</span>
                </button>
              </div>

              {/* QRIS Tab Content */}
              {paymentMethod === 'qris' ? (
                <div className="text-center py-3 space-y-3">
                  <div className="inline-block p-4 bg-white rounded-2xl border-2 border-dashed border-kopi-border shadow-inner">
                    {/* SVG Realistic Dynamic QRIS Code */}
                    <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 200">
                      {/* Corner finders */}
                      <rect x="10" y="10" width="50" height="50" fill="#2B170B" rx="8" />
                      <rect x="20" y="20" width="30" height="30" fill="#FFFFFF" rx="4" />
                      <rect x="27" y="27" width="16" height="16" fill="#2B170B" rx="2" />

                      <rect x="140" y="10" width="50" height="50" fill="#2B170B" rx="8" />
                      <rect x="150" y="20" width="30" height="30" fill="#FFFFFF" rx="4" />
                      <rect x="157" y="27" width="16" height="16" fill="#2B170B" rx="2" />

                      <rect x="10" y="140" width="50" height="50" fill="#2B170B" rx="8" />
                      <rect x="20" y="150" width="30" height="30" fill="#FFFFFF" rx="4" />
                      <rect x="27" y="157" width="16" height="16" fill="#2B170B" rx="2" />

                      {/* Pattern Matrix */}
                      <rect x="70" y="15" width="15" height="15" fill="#2B170B" />
                      <rect x="95" y="15" width="15" height="15" fill="#7A5C43" />
                      <rect x="115" y="25" width="15" height="15" fill="#2B170B" />
                      <rect x="70" y="45" width="25" height="15" fill="#2B170B" />
                      <rect x="105" y="45" width="15" height="25" fill="#7A5C43" />

                      {/* Center Logo Accent */}
                      <circle cx="100" cy="100" r="22" fill="#2B170B" />
                      <circle cx="100" cy="100" r="18" fill="#F5EFEB" />
                      <text x="100" y="105" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2B170B">
                        ☕ KK
                      </text>

                      {/* Bottom patterns */}
                      <rect x="70" y="145" width="20" height="20" fill="#2B170B" />
                      <rect x="100" y="145" width="15" height="15" fill="#7A5C43" />
                      <rect x="125" y="135" width="20" height="20" fill="#2B170B" />
                      <rect x="150" y="145" width="35" height="15" fill="#7A5C43" />
                      <rect x="165" y="165" width="20" height="20" fill="#2B170B" />
                    </svg>
                    <p className="text-[11px] font-mono text-kopi-muted mt-2">
                      NMID: ID10203049281 • QRIS GPN
                    </p>
                  </div>
                  <p className="text-xs text-kopi-muted">
                    Pelanggan dapat memindai menggunakan BCA, Mandiri, GoPay, OVO, atau ShopeePay.
                  </p>
                </div>
              ) : (
                /* Cash Tab Content */
                <div className="py-2 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-1">
                      Uang Tunai Diterima (Rp)
                    </label>
                    <input
                      type="number"
                      value={cashTendered || ''}
                      onChange={(e) => setCashTendered(Number(e.target.value))}
                      className="w-full px-4 py-2.5 text-lg font-bold text-kopi-espresso rounded-xl border border-kopi-border bg-white focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div>
                    <span className="text-[11px] text-kopi-muted block mb-1.5">Pilihan Cepat:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setCashTendered(totalAmount)}
                        className="py-1.5 px-2 rounded-lg bg-kopi-sand/40 hover:bg-kopi-sand text-xs font-semibold text-kopi-espresso transition-colors"
                      >
                        Uang Pas
                      </button>
                      <button
                        type="button"
                        onClick={() => setCashTendered(50000)}
                        className="py-1.5 px-2 rounded-lg bg-kopi-sand/40 hover:bg-kopi-sand text-xs font-semibold text-kopi-espresso transition-colors"
                      >
                        Rp 50.000
                      </button>
                      <button
                        type="button"
                        onClick={() => setCashTendered(100000)}
                        className="py-1.5 px-2 rounded-lg bg-kopi-sand/40 hover:bg-kopi-sand text-xs font-semibold text-kopi-espresso transition-colors"
                      >
                        Rp 100.000
                      </button>
                    </div>
                  </div>

                  {/* Change Calculation */}
                  <div className="p-3.5 rounded-xl bg-kopi-sand/30 border border-kopi-border flex items-center justify-between">
                    <span className="text-xs text-kopi-muted font-medium">Uang Kembalian:</span>
                    <span
                      className={`text-base font-bold ${
                        cashTendered >= totalAmount ? 'text-kopi-sage' : 'text-red-600'
                      }`}
                    >
                      {cashTendered >= totalAmount
                        ? `Rp ${(cashTendered - totalAmount).toLocaleString('id-ID')}`
                        : 'Kurang Rp ' + (totalAmount - cashTendered).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-kopi-sand/30 border-t border-kopi-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-xs font-semibold text-kopi-espresso hover:bg-kopi-sand rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing || (paymentMethod === 'cash' && cashTendered < totalAmount)}
                className="px-5 py-2.5 rounded-xl bg-kopi-sage hover:bg-emerald-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-warm active:scale-95 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isProcessing ? 'Menyimpan...' : 'Konfirmasi & Cetak Struk'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        order={completedOrder}
        amountTendered={cashTendered}
        changeAmount={Math.max(0, cashTendered - (completedOrder?.total_amount || 0))}
      />
    </div>
  );
}
