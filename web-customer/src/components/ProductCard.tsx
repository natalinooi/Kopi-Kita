'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/supabase';
import { Plus, Coffee } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <article
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-card p-3 border border-kopi-border shadow-warm hover:shadow-warm-lg transition-all duration-200 cursor-pointer active:scale-[0.98]"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-kopi-sand/30 mb-2.5">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 480px) 50vw, 200px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-kopi-mocha">
            <Coffee className="w-8 h-8 opacity-40" />
          </div>
        )}

        {/* Status Badge */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-kopi-espresso/80 text-white backdrop-blur-sm text-[10px] font-semibold tracking-wide shadow-sm">
          {product.category}
        </span>
      </div>

      {/* Info Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-serif font-bold text-sm text-kopi-espresso leading-snug line-clamp-1 group-hover:text-kopi-mocha transition-colors">
            {product.name}
          </h4>
          <p className="text-[11px] text-kopi-muted mt-0.5 line-clamp-2 leading-relaxed">
            {product.description || 'Artisanal roastery signature.'}
          </p>
        </div>

        {/* Price & Add '+' Button */}
        <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-kopi-border/60">
          <span className="font-sans font-bold text-xs text-kopi-espresso">
            Rp {product.price.toLocaleString('id-ID')}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            aria-label={`Tambah ${product.name}`}
            className="w-7 h-7 rounded-full bg-kopi-espresso text-white flex items-center justify-center shadow-sm hover:bg-kopi-mocha transition-transform active:scale-90"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
