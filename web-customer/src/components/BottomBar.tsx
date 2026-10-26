'use client';

import React from 'react';
import { useCart } from '@/lib/store';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function BottomBar() {
  const { totalItems, totalAmount, setIsCartOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <aside className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-3 z-40 bg-gradient-to-t from-kopi-canvas via-kopi-canvas/90 to-transparent pointer-events-none">
      <div className="bg-kopi-espresso text-white rounded-2card p-3.5 shadow-warm-xl border border-white/10 flex items-center justify-between pointer-events-auto transition-transform active:scale-[0.99] animate-slide-up">
        {/* Left Side: Summary */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-kopi-amber flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {totalItems}x
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-kopi-sand/70 block">
              Total Keranjang
            </span>
            <span className="font-serif font-bold text-base text-white">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Right Side: Button */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-white text-kopi-espresso font-sans text-xs font-bold hover:bg-kopi-sand transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <ShoppingBag className="w-4 h-4 text-kopi-mocha" />
          <span>Lihat Keranjang</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
