'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/store';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  Sparkles,
  ShoppingBag,
  Utensils,
  ArrowRight,
  User,
  Coffee,
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToPayment: () => void;
}

export default function CartDrawer({ onProceedToPayment }: CartDrawerProps) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    totalAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    orderType,
    setOrderType,
    customerName,
    setCustomerName,
    tableNumber,
    setTableNumber,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const success = applyCoupon(inputCoupon);
    if (!success) {
      setCouponError('Kode kupon tidak valid. Coba: SENJA30');
    } else {
      setInputCoupon('');
    }
  };

  const handleCheckoutClick = () => {
    if (!customerName.trim()) {
      alert('Silakan masukkan nama pemesan terlebih dahulu.');
      return;
    }
    if (orderType === 'dine_in' && !tableNumber.trim()) {
      alert('Silakan masukkan nomor meja untuk layanan Dine In.');
      return;
    }
    onProceedToPayment();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[480px] bg-white rounded-t-3card shadow-warm-xl border-t border-kopi-border max-h-[92vh] flex flex-col animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-kopi-border flex items-center justify-between bg-kopi-canvas/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-kopi-mocha" />
            <h3 className="font-serif font-bold text-lg text-kopi-espresso">
              Keranjang Pesanan
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-red-600 font-semibold hover:underline mr-1"
              >
                Hapus Semua
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-white border border-kopi-border flex items-center justify-center text-kopi-espresso hover:bg-kopi-sand transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* 1. Order Type Switcher */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-kopi-mocha mb-1.5">
              Tipe Pesanan
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  orderType === 'dine_in'
                    ? 'border-kopi-espresso bg-kopi-sand/50 text-kopi-espresso ring-1 ring-kopi-espresso'
                    : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Dine In (Minum di Kafe)</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('take_away')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  orderType === 'take_away'
                    ? 'border-kopi-espresso bg-kopi-sand/50 text-kopi-espresso ring-1 ring-kopi-espresso'
                    : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pickup / Take Away</span>
              </button>
            </div>
          </div>

          {/* 2. Customer Name & Table Number */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-kopi-mocha mb-1">
                Nama Pemesan *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-kopi-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Nama kamu..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2 text-xs rounded-xl border border-kopi-border bg-kopi-canvas/40 focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-kopi-mocha mb-1">
                {orderType === 'dine_in' ? 'Nomor Meja *' : 'Catatan Pickup'}
              </label>
              <input
                type="text"
                placeholder={orderType === 'dine_in' ? 'Contoh: Meja 04' : 'Ambil jam 14:00'}
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-kopi-border bg-kopi-canvas/40 focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
              />
            </div>
          </div>

          {/* 3. Items List */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-kopi-mocha block">
              Menu yang Dipesan ({cart.length})
            </span>

            {cart.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2card border border-kopi-border/80 bg-kopi-canvas/30 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-kopi-espresso text-sm leading-tight">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] text-kopi-muted flex flex-wrap gap-1.5 mt-1">
                    <span className="px-1.5 py-0.5 rounded bg-white border border-kopi-border/70 font-medium">
                      {item.size}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white border border-kopi-border/70 font-medium">
                      {item.sugar_level}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white border border-kopi-border/70 font-medium">
                      {item.ice_level}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-[10px] text-amber-900 italic mt-1">* {item.notes}</p>
                  )}
                  <span className="text-kopi-mocha font-bold text-xs mt-1.5 block">
                    Rp {item.totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-1.5 shrink-0 self-center">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-kopi-border flex items-center justify-center hover:bg-kopi-sand transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 text-kopi-espresso" />
                  </button>
                  <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-kopi-border flex items-center justify-center hover:bg-kopi-sand transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-kopi-espresso" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="w-7 h-7 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="py-8 text-center text-kopi-muted">
                <Coffee className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Keranjangmu masih kosong.</p>
                <p className="text-[11px] text-kopi-muted/60 mt-0.5">
                  Yuk pilih kopi artisanal favoritmu dari menu!
                </p>
              </div>
            )}
          </div>

          {/* 4. Promo Coupon Section */}
          <div className="pt-2">
            <form onSubmit={handleApply} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-kopi-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Kode Promo (SENJA30)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 text-xs rounded-xl border border-kopi-border bg-kopi-canvas/40 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
                />
              </div>
              <button
                type="submit"
                disabled={!inputCoupon}
                className="px-3.5 py-2 rounded-xl bg-kopi-espresso text-white text-xs font-bold hover:bg-kopi-mocha transition-colors disabled:opacity-50"
              >
                Gunakan
              </button>
            </form>

            {couponError && (
              <p className="text-[11px] text-red-600 mt-1 pl-1">{couponError}</p>
            )}

            {couponCode && (
              <div className="mt-2 flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <span className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Kupon Aktif: {couponCode}
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-red-500 font-bold hover:underline"
                >
                  ✕ Hapus
                </button>
              </div>
            )}
          </div>

          {/* 5. Cost Breakdown */}
          <div className="p-3.5 rounded-2card bg-kopi-sand/30 border border-kopi-border space-y-1.5 text-xs">
            <div className="flex justify-between text-kopi-muted">
              <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} cup):</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Diskon Kupon Promo:</span>
                <span>-Rp {discount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-kopi-espresso pt-2 border-t border-kopi-border">
              <span>Total Pembayaran:</span>
              <span className="text-base">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Footer Checkout CTA */}
        <div className="p-4 bg-kopi-canvas border-t border-kopi-border">
          <button
            type="button"
            onClick={handleCheckoutClick}
            disabled={cart.length === 0}
            className="w-full py-3.5 px-4 rounded-2card bg-kopi-espresso hover:bg-kopi-mocha text-white text-sm font-bold transition-all shadow-warm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Lanjut Bayar (QRIS)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
