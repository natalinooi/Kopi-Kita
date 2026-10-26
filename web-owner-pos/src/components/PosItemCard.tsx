'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/database.types';
import { Plus, Coffee, Sparkles } from 'lucide-react';

interface PosItemCardProps {
  product: Product;
  onAddToCart: (
    product: Product,
    options: {
      size: 'Regular' | 'Large';
      temperature: 'Ice' | 'Hot';
      sugar_level: 'Normal 100%' | 'Less Sugar 50%' | 'No Sugar 0%';
      notes?: string;
    }
  ) => void;
}

export default function PosItemCard({ product, onAddToCart }: PosItemCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [size, setSize] = useState<'Regular' | 'Large'>('Regular');
  const [temperature, setTemperature] = useState<'Ice' | 'Hot'>('Ice');
  const [sugar, setSugar] = useState<'Normal 100%' | 'Less Sugar 50%' | 'No Sugar 0%'>('Normal 100%');
  const [notes, setNotes] = useState('');

  const isAvailable = product.is_available && product.stock_count > 0;
  const extraPrice = size === 'Large' ? 4000 : 0;
  const currentTotal = product.price + extraPrice;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    onAddToCart(product, {
      size: 'Regular',
      temperature: product.category === 'Hot Brew' ? 'Hot' : 'Ice',
      sugar_level: 'Normal 100%',
    });
  };

  const handleConfirmCustomization = () => {
    onAddToCart(product, {
      size,
      temperature,
      sugar_level: sugar,
      notes: notes.trim() || undefined,
    });
    setShowModal(false);
    setNotes('');
    setSize('Regular');
  };

  return (
    <>
      <div
        onClick={() => isAvailable && setShowModal(true)}
        className={`group relative flex flex-col justify-between rounded-2xl bg-white border transition-all duration-200 overflow-hidden ${
          isAvailable
            ? 'border-kopi-border hover:border-kopi-mocha/40 hover:shadow-warm-lg cursor-pointer'
            : 'border-kopi-border/60 opacity-60 cursor-not-allowed bg-kopi-sand/20'
        }`}
      >
        {/* Product Image Banner */}
        <div className="relative w-full h-36 bg-kopi-sand/30 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-kopi-sand/50 text-kopi-mocha">
              <Coffee className="w-10 h-10 opacity-40" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-kopi-espresso/85 text-white backdrop-blur-sm shadow-sm">
              {product.category}
            </span>
          </div>

          {!isAvailable ? (
            <div className="absolute inset-0 bg-kopi-espresso/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-semibold tracking-wide uppercase shadow">
                Stok Habis
              </span>
            </div>
          ) : (
            <div className="absolute top-2.5 right-2.5">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/90 text-kopi-mocha shadow-sm backdrop-blur-sm">
                Sisa {product.stock_count}
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3.5 flex flex-col justify-between flex-1">
          <div>
            <h4 className="font-semibold text-kopi-espresso text-[15px] leading-snug line-clamp-1 group-hover:text-kopi-mocha transition-colors">
              {product.name}
            </h4>
            <p className="text-xs text-kopi-muted mt-1 line-clamp-2 leading-relaxed">
              {product.description || 'Racikan artisanal khas Kopi Kita Roastery.'}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-kopi-border/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-kopi-muted uppercase tracking-wider block">Harga</span>
              <span className="font-bold text-kopi-espresso text-base">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            </div>

            {isAvailable && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  title="Tambah Cepat (Regular)"
                  className="w-8 h-8 rounded-full bg-kopi-sand hover:bg-kopi-border text-kopi-espresso flex items-center justify-center transition-all active:scale-90"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                  title="Kustomisasi Cup"
                  className="px-2.5 py-1 text-xs font-medium rounded-full bg-kopi-espresso text-white hover:bg-kopi-mocha transition-all flex items-center gap-1 active:scale-95"
                >
                  <Sparkles className="w-3 h-3 text-kopi-amber" />
                  <span>Kustom</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Customizer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-warm-xl border border-kopi-border overflow-hidden">
            <div className="bg-kopi-espresso text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold">{product.name}</h3>
                <p className="text-xs text-kopi-sand/80">Kustomisasi Pesanan Pelanggan</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white/80 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Size Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-2">
                  Ukuran Cup
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSize('Regular')}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                      size === 'Regular'
                        ? 'border-kopi-espresso bg-kopi-sand/40 text-kopi-espresso font-semibold ring-1 ring-kopi-espresso'
                        : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                    }`}
                  >
                    Regular (350ml)
                    <span className="block text-xs text-kopi-muted font-normal mt-0.5">Standar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSize('Large')}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                      size === 'Large'
                        ? 'border-kopi-espresso bg-kopi-sand/40 text-kopi-espresso font-semibold ring-1 ring-kopi-espresso'
                        : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                    }`}
                  >
                    Large (500ml)
                    <span className="block text-xs text-kopi-amber font-semibold mt-0.5">+Rp 4.000</span>
                  </button>
                </div>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-2">
                  Suhu Penyajian
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTemperature('Ice')}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      temperature === 'Ice'
                        ? 'border-kopi-espresso bg-kopi-sand/40 text-kopi-espresso font-semibold ring-1 ring-kopi-espresso'
                        : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                    }`}
                  >
                    <span>🧊 Dingin (Iced)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemperature('Hot')}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      temperature === 'Hot'
                        ? 'border-kopi-espresso bg-kopi-sand/40 text-kopi-espresso font-semibold ring-1 ring-kopi-espresso'
                        : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                    }`}
                  >
                    <span>☕ Hangat (Hot)</span>
                  </button>
                </div>
              </div>

              {/* Sugar Level */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-2">
                  Tingkat Manis (Aren / Sugar)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Normal 100%', 'Less Sugar 50%', 'No Sugar 0%'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSugar(lvl)}
                      className={`py-2 px-2 rounded-xl border text-xs font-medium text-center transition-all ${
                        sugar === lvl
                          ? 'border-kopi-espresso bg-kopi-sand/40 text-kopi-espresso font-semibold ring-1 ring-kopi-espresso'
                          : 'border-kopi-border text-kopi-muted hover:border-kopi-mocha'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-1.5">
                  Catatan Khusus Barista (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pisah es batu, sedikit sirup aren..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-kopi-sand/20 border border-kopi-border rounded-xl focus:outline-none focus:ring-1 focus:ring-kopi-espresso text-kopi-espresso placeholder:text-kopi-muted/60"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-kopi-sand/30 border-t border-kopi-border flex items-center justify-between">
              <div>
                <span className="text-xs text-kopi-muted block">Total Item</span>
                <span className="text-lg font-bold text-kopi-espresso">
                  Rp {currentTotal.toLocaleString('id-ID')}
                </span>
              </div>
              <button
                type="button"
                onClick={handleConfirmCustomization}
                className="px-5 py-2.5 rounded-xl bg-kopi-espresso text-white text-sm font-semibold hover:bg-kopi-mocha transition-colors shadow-warm"
              >
                Masukkan Keranjang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
