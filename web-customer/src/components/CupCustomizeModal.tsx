'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/supabase';
import { useCart } from '@/lib/store';
import { X } from 'lucide-react';

interface CupCustomizeModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function CupCustomizeModal({ product, onClose }: CupCustomizeModalProps) {
  const { addToCart, setIsCartOpen } = useCart();

  const [size, setSize] = useState<'Regular' | 'Large'>('Regular');
  const [sugar, setSugar] = useState<'Normal 100%' | 'Less Sugar 50%' | 'No Sugar 0%'>('Normal 100%');
  const [ice, setIce] = useState<'Normal Ice' | 'Less Ice' | 'No Ice'>('Normal Ice');
  const [notes, setNotes] = useState('');

  if (!product) return null;

  const extraPrice = size === 'Large' ? 4000 : 0;
  const currentTotal = product.price + extraPrice;

  const handleAddAndCheckout = () => {
    addToCart(product, {
      size,
      temperature: product.category === 'Hot Brew' ? 'Hot' : 'Ice',
      sugar_level: sugar,
      ice_level: ice,
      notes,
    });
    onClose();
    setIsCartOpen(true);
  };

  const handleAddOnly = () => {
    addToCart(product, {
      size,
      temperature: product.category === 'Hot Brew' ? 'Hot' : 'Ice',
      sugar_level: sugar,
      ice_level: ice,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-[480px] bg-white rounded-t-3card shadow-warm-xl border-t border-kopi-border max-h-[90vh] flex flex-col animate-slide-up overflow-hidden"
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-kopi-border flex items-center justify-between bg-kopi-canvas/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-kopi-mocha">
              Kustomisasi Minuman
            </span>
            <h3 className="font-serif font-bold text-lg text-kopi-espresso">
              {product.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-kopi-border flex items-center justify-center text-kopi-espresso hover:bg-kopi-sand transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Cup Visualization Widget */}
          <div className="bg-gradient-to-b from-kopi-sand/30 to-kopi-sand/60 rounded-2card p-4 border border-kopi-border flex items-center justify-around">
            {/* Visual Cup Graphic */}
            <div className="flex flex-col items-center">
              <div
                className={`transition-all duration-300 relative rounded-t-sm rounded-b-xl border-2 border-kopi-espresso flex flex-col justify-end overflow-hidden ${
                  size === 'Large'
                    ? 'w-16 h-28 bg-amber-950/20'
                    : 'w-14 h-20 bg-amber-950/20'
                }`}
              >
                {/* Coffee Liquid fill */}
                <div
                  className={`w-full bg-gradient-to-t from-kopi-espresso to-kopi-mocha/90 transition-all duration-500 ${
                    size === 'Large' ? 'h-20' : 'h-14'
                  }`}
                />
                {/* Ice cubes visualization */}
                {ice !== 'No Ice' && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-white/70 shadow-sm" />
                    {ice === 'Normal Ice' && <span className="w-2 h-2 rounded bg-white/70 shadow-sm" />}
                  </div>
                )}
                {/* Cup Straw */}
                <div className="absolute -top-3 right-3 w-1 h-8 bg-kopi-amber rounded-full rotate-12" />
              </div>
              <span className="text-[11px] font-bold text-kopi-espresso mt-2">
                {size === 'Large' ? '16 oz (Large)' : '12 oz (Regular)'}
              </span>
            </div>

            {/* Product Snapshot */}
            <div className="max-w-[180px]">
              <span className="text-[10px] font-semibold uppercase text-kopi-mocha block">
                {product.category}
              </span>
              <p className="font-serif text-sm font-bold text-kopi-espresso leading-snug">
                {product.name}
              </p>
              <p className="text-[11px] text-kopi-muted mt-1 line-clamp-2">
                {product.description || 'Pilihan biji kopi sangrai artisanal.'}
              </p>
              <span className="text-xs font-bold text-kopi-espresso mt-1.5 block">
                Rp {currentTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* 1. Cup Size Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-kopi-mocha mb-2">
              Ukuran Cup (Size)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSize('Regular')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                  size === 'Regular'
                    ? 'border-kopi-espresso bg-kopi-sand/50 text-kopi-espresso ring-1 ring-kopi-espresso'
                    : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                }`}
              >
                <span className="block font-bold">Regular (12 oz)</span>
                <span className="text-[11px] text-kopi-muted font-normal">Standar (+Rp 0)</span>
              </button>
              <button
                type="button"
                onClick={() => setSize('Large')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                  size === 'Large'
                    ? 'border-kopi-espresso bg-kopi-sand/50 text-kopi-espresso ring-1 ring-kopi-espresso'
                    : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                }`}
              >
                <span className="block font-bold">Large (16 oz)</span>
                <span className="text-[11px] text-kopi-amber font-bold">+Rp 4.000</span>
              </button>
            </div>
          </div>

          {/* 2. Sugar Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-kopi-mocha mb-2">
              Tingkat Gula Aren (Sweetness)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Normal 100%', 'Less Sugar 50%', 'No Sugar 0%'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSugar(lvl)}
                  className={`py-2 px-1 text-center text-xs font-semibold rounded-xl border transition-all ${
                    sugar === lvl
                      ? 'border-kopi-espresso bg-kopi-sand/50 text-kopi-espresso ring-1 ring-kopi-espresso'
                      : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Ice Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-kopi-mocha mb-2">
              Banyak Es Batu (Ice Level)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Normal Ice', 'Less Ice', 'No Ice'] as const).map((iceOpt) => (
                <button
                  key={iceOpt}
                  type="button"
                  onClick={() => setIce(iceOpt)}
                  className={`py-2 px-1 text-center text-xs font-semibold rounded-xl border transition-all ${
                    ice === iceOpt
                      ? 'border-kopi-espresso bg-kopi-sand/50 text-kopi-espresso ring-1 ring-kopi-espresso'
                      : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                  }`}
                >
                  {iceOpt}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-kopi-mocha mb-1.5">
              Catatan untuk Barista
            </label>
            <input
              type="text"
              placeholder="Contoh: Pisah es batu, ekstra sedotan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-kopi-border bg-kopi-canvas/50 focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
            />
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 bg-kopi-canvas border-t border-kopi-border flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddOnly}
            className="flex-1 py-3 px-3 rounded-2card border border-kopi-border bg-white text-kopi-espresso text-xs font-bold hover:bg-kopi-sand transition-colors active:scale-95"
          >
            + Masukkan Keranjang
          </button>
          <button
            type="button"
            onClick={handleAddAndCheckout}
            className="flex-1 py-3 px-3 rounded-2card bg-kopi-espresso text-white text-xs font-bold hover:bg-kopi-mocha transition-all shadow-warm flex items-center justify-center gap-1 active:scale-95"
          >
            <span>Pesan Sekarang</span>
            <span className="font-mono text-[11px] text-kopi-amber">
              (Rp {currentTotal.toLocaleString('id-ID')})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
