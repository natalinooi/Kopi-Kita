'use client';

import React, { useState } from 'react';
import { Product } from '@/types/database.types';
import { Check, X, Plus, Minus, Package } from 'lucide-react';

interface StockToggleProps {
  product: Product;
  onToggle: (id: string, isAvailable: boolean) => void;
  onUpdateStockCount?: (id: string, count: number) => void;
}

export default function StockToggle({
  product,
  onToggle,
  onUpdateStockCount,
}: StockToggleProps) {
  const [stockInput, setStockInput] = useState(product.stock_count);
  const [isEditing, setIsEditing] = useState(false);

  const handleToggle = () => {
    const nextState = !product.is_available;
    onToggle(product.id, nextState);
  };

  const handleStockChange = (delta: number) => {
    const newCount = Math.max(0, product.stock_count + delta);
    setStockInput(newCount);
    if (onUpdateStockCount) {
      onUpdateStockCount(product.id, newCount);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const parsed = Math.max(0, Number(stockInput) || 0);
    if (onUpdateStockCount) {
      onUpdateStockCount(product.id, parsed);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-kopi-border shadow-warm hover:shadow-warm-lg transition-all duration-200">
      <div className="flex items-center gap-3">
        {/* Toggle Switch */}
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            product.is_available ? 'bg-kopi-sage' : 'bg-gray-300'
          }`}
          role="switch"
          aria-checked={product.is_available}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[10px] ${
              product.is_available ? 'translate-x-5 text-kopi-sage' : 'translate-x-0 text-gray-400'
            }`}
          >
            {product.is_available ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
          </span>
        </button>

        {/* Status text */}
        <div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              product.is_available
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {product.is_available ? 'Tersedia di Menu' : 'Habis / Ditutup'}
          </span>
          <p className="text-[11px] text-kopi-muted mt-0.5">
            {product.is_available
              ? 'Tampil di POS & Web Customer'
              : 'Otomatis disembunyikan dari pemesanan'}
          </p>
        </div>
      </div>

      {/* Stock Quantity Controls */}
      <div className="flex items-center gap-2 self-end sm:self-auto bg-kopi-sand/30 px-3 py-1.5 rounded-xl border border-kopi-border/70">
        <Package className="w-4 h-4 text-kopi-muted" />
        <span className="text-xs text-kopi-muted font-medium">Stok Cup:</span>

        <button
          type="button"
          onClick={() => handleStockChange(-1)}
          disabled={product.stock_count <= 0}
          className="w-6 h-6 rounded-lg bg-white border border-kopi-border text-kopi-espresso flex items-center justify-center hover:bg-kopi-sand transition-colors disabled:opacity-40"
        >
          <Minus className="w-3 h-3" />
        </button>

        {isEditing ? (
          <input
            type="number"
            value={stockInput}
            onChange={(e) => setStockInput(Number(e.target.value))}
            onBlur={handleInputBlur}
            autoFocus
            className="w-12 text-center text-xs font-bold bg-white border border-kopi-espresso rounded-lg py-0.5 focus:outline-none"
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="w-10 text-center text-xs font-bold text-kopi-espresso cursor-pointer hover:underline"
            title="Klik untuk ubah cepat"
          >
            {product.stock_count}
          </span>
        )}

        <button
          type="button"
          onClick={() => handleStockChange(1)}
          className="w-6 h-6 rounded-lg bg-white border border-kopi-border text-kopi-espresso flex items-center justify-center hover:bg-kopi-sand transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
