'use client';

import React from 'react';

interface CategoryPillsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function CategoryPills({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-kopi-espresso">
          Kategori Menu
        </span>
        <span className="text-[10px] uppercase tracking-widest text-kopi-mocha font-semibold">
          Pilihan Barista
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 shadow-sm ${
                isActive
                  ? 'bg-kopi-espresso text-white shadow-warm'
                  : 'bg-white text-kopi-mocha border border-kopi-border/80 hover:bg-kopi-sand/30'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
