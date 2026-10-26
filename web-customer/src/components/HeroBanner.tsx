'use client';

import React from 'react';
import { Sparkles, ArrowRight, Coffee } from 'lucide-react';
import { useCart } from '@/lib/store';

export default function HeroBanner() {
  const { applyCoupon, setIsCartOpen } = useCart();

  const handleClaimPromo = () => {
    applyCoupon('SENJA30');
    setIsCartOpen(true);
  };

  return (
    <div className="relative overflow-hidden rounded-2card bg-gradient-to-br from-kopi-mocha via-kopi-espresso to-black text-white p-5 shadow-warm-lg my-2 mx-4">
      {/* Ambient Coffee Ring Background Pattern */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 opacity-15 pointer-events-none">
        <svg className="w-full h-full text-white" fill="none" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeDasharray="6 6" strokeWidth="2" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1.5" />
          <path d="M100 20v160M20 100h160" stroke="currentColor" strokeLinecap="round" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] tracking-wider uppercase font-bold text-kopi-sand">
            <Sparkles className="w-3 h-3 text-kopi-amber" />
            Promo Spesial Hari Ini
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold leading-snug pr-8 text-white">
          SENJA BUNDLE: Beli 2 Cup Hemat 30%
        </h3>
        <p className="text-xs text-kopi-sand/80 mt-1 line-clamp-1">
          Kombinasi artisanal pour over & iced aren latte segar.
        </p>

        <div className="flex items-center justify-between pt-3 mt-1">
          <button
            type="button"
            onClick={handleClaimPromo}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-kopi-canvas text-kopi-espresso text-xs font-bold shadow-sm transition-all active:scale-95 hover:bg-white"
          >
            <span>Klaim Kupon (SENJA30)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-end gap-1.5 text-white/80">
            <Coffee className="w-6 h-6 opacity-90" />
            <span className="text-[10px] font-mono tracking-tight text-kopi-sand/60">☕ Roastery</span>
          </div>
        </div>
      </div>
    </div>
  );
}
