'use client';

import React from 'react';
import { Order, OrderStatus } from '@/types/database.types';
import { Clock, Coffee, CheckCircle, ChevronRight, Printer, AlertCircle, ShoppingBag, Utensils } from 'lucide-react';

interface OrderKanbanCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onPrintReceipt?: (order: Order) => void;
}

export default function OrderKanbanCard({
  order,
  onUpdateStatus,
  onPrintReceipt,
}: OrderKanbanCardProps) {
  // Format relative time
  const getElapsedMinutes = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60));
    if (diff <= 0) return 'Baru saja';
    if (diff < 60) return `${diff}m lalu`;
    const hours = Math.floor(diff / 60);
    return `${hours}j ${diff % 60}m lalu`;
  };

  const getStatusBorder = () => {
    switch (order.status) {
      case 'pesanan_masuk':
        return 'border-l-4 border-l-kopi-mocha hover:border-kopi-mocha';
      case 'sedang_diseduh':
        return 'border-l-4 border-l-kopi-amber hover:border-kopi-amber animate-warm-pulse';
      case 'siap_diambil':
        return 'border-l-4 border-l-kopi-sage hover:border-kopi-sage';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl p-4 border border-kopi-border shadow-warm hover:shadow-warm-lg transition-all duration-200 flex flex-col justify-between ${getStatusBorder()}`}
    >
      <div>
        {/* Header: Order Number, Customer, Time */}
        <div className="flex items-start justify-between gap-2 mb-2.5 pb-2.5 border-b border-kopi-border/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-tight px-2 py-0.5 rounded-lg bg-kopi-espresso text-white">
                {order.order_number}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  order.order_type === 'dine_in'
                    ? 'bg-amber-100/80 text-amber-900'
                    : 'bg-emerald-100/80 text-emerald-900'
                }`}
              >
                {order.order_type === 'dine_in' ? (
                  <>
                    <Utensils className="w-3 h-3" /> Dine In
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3 h-3" /> Take Away
                  </>
                )}
              </span>
            </div>
            <h4 className="font-semibold text-kopi-espresso text-base mt-1.5 line-clamp-1">
              {order.customer_name}
            </h4>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-kopi-muted">
              <Clock className="w-3 h-3" />
              {getElapsedMinutes(order.created_at)}
            </span>
            <div className="text-[11px] font-medium text-kopi-sage mt-0.5 capitalize">
              {order.payment_method.toUpperCase()} • Lunas
            </div>
          </div>
        </div>

        {/* Order Items List */}
        <div className="space-y-2 mb-3">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-kopi-sand/20 rounded-xl p-2 text-xs border border-kopi-border/50"
              >
                <div className="flex items-baseline justify-between font-semibold text-kopi-espresso">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-kopi-espresso text-white inline-flex items-center justify-center text-[11px] font-mono">
                      {item.quantity}x
                    </span>
                    <span>{item.product_name}</span>
                  </span>
                  <span className="text-kopi-mocha font-medium">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-kopi-muted pl-6">
                  <span className="px-1.5 py-0.5 rounded bg-white border border-kopi-border/60">
                    {item.size}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-kopi-border/60">
                    {item.temperature}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-kopi-border/60">
                    {item.sugar_level}
                  </span>
                  {item.customization_notes && (
                    <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 font-medium">
                      ⚠️ {item.customization_notes}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-kopi-muted italic">Tidak ada rincian item.</p>
          )}

          {/* Customer / Cashier General Notes */}
          {order.notes && (
            <div className="bg-amber-50 text-amber-900 border border-amber-200/80 rounded-xl p-2 text-xs flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
              <p className="line-clamp-2">
                <span className="font-semibold">Catatan:</span> {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2.5 border-t border-kopi-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {onPrintReceipt && (
            <button
              type="button"
              onClick={() => onPrintReceipt(order)}
              title="Cetak Struk Barista"
              className="p-2 rounded-xl bg-kopi-sand/50 text-kopi-espresso hover:bg-kopi-border transition-colors text-xs flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-xs font-bold text-kopi-espresso pl-1">
            Rp {order.total_amount.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Dynamic Action by Status */}
        {order.status === 'pesanan_masuk' && (
          <button
            type="button"
            onClick={() => onUpdateStatus(order.id, 'sedang_diseduh')}
            className="px-3.5 py-2 rounded-xl bg-kopi-amber hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Mulai Seduh</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {order.status === 'sedang_diseduh' && (
          <button
            type="button"
            onClick={() => onUpdateStatus(order.id, 'siap_diambil')}
            className="px-3.5 py-2 rounded-xl bg-kopi-sage hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Siap Diambil</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {order.status === 'siap_diambil' && (
          <button
            type="button"
            onClick={() => onUpdateStatus(order.id, 'selesai')}
            className="px-3.5 py-2 rounded-xl bg-kopi-espresso hover:bg-kopi-mocha text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <CheckCircle className="w-3.5 h-3.5 text-kopi-sand" />
            <span>Selesaikan</span>
          </button>
        )}
      </div>
    </div>
  );
}
