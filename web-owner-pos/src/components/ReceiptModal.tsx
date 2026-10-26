'use client';

import React from 'react';
import { Order } from '@/types/database.types';
import { Printer, X, Check, Coffee } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  amountTendered?: number;
  changeAmount?: number;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  order,
  amountTendered,
  changeAmount,
}: ReceiptModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.created_at).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-warm-xl border border-kopi-border overflow-hidden my-auto animate-fadeIn">
        {/* Modal Controls (Not in thermal print) */}
        <div className="bg-kopi-espresso text-white px-4 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-kopi-amber" />
            <span className="font-serif font-bold text-sm">Struk Transaksi Kasir</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 text-white/80 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thermal Struk Container */}
        <div
          id="thermal-receipt"
          className="p-6 font-mono text-[13px] text-gray-900 bg-white"
        >
          {/* Header */}
          <div className="text-center pb-4 border-b border-dashed border-gray-400">
            <h2 className="font-serif font-extrabold text-xl tracking-wider text-black uppercase">
              KOPI KITA
            </h2>
            <p className="text-[11px] font-sans text-gray-600 uppercase tracking-widest mt-0.5">
              ROASTERY & SLOW BAR
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Jl. Jend. Sudirman No. 42, Senayan, Jakarta
            </p>
            <p className="text-[11px] text-gray-500">Telp: (021) 5890-2344</p>
          </div>

          {/* Transaction Metadata */}
          <div className="py-3 text-[11px] border-b border-dashed border-gray-400 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">No. Order:</span>
              <span className="font-bold text-black">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Waktu:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Kasir:</span>
              <span>{order.cashier_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pelanggan:</span>
              <span className="font-semibold">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tipe Layanan:</span>
              <span className="uppercase font-semibold">
                {order.order_type === 'dine_in' ? 'Dine In' : 'Take Away'}
              </span>
            </div>
          </div>

          {/* Itemized Lines */}
          <div className="py-3 border-b border-dashed border-gray-400 space-y-2">
            {order.items?.map((item, idx) => (
              <div key={idx} className="text-[12px]">
                <div className="flex justify-between font-semibold">
                  <span>
                    {item.quantity}x {item.product_name}
                  </span>
                  <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="text-[10px] text-gray-500 pl-4 flex gap-2">
                  <span>[{item.size}]</span>
                  <span>[{item.temperature}]</span>
                  <span>[{item.sugar_level}]</span>
                </div>
                {item.customization_notes && (
                  <div className="text-[10px] text-gray-500 italic pl-4">
                    * {item.customization_notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Calculation */}
          <div className="py-3 border-b border-dashed border-gray-400 space-y-1 text-[12px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>
                Rp{' '}
                {(order.total_amount + (order.discount_amount || 0)).toLocaleString('id-ID')}
              </span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Diskon Kupon:</span>
                <span>-Rp {order.discount_amount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-1 text-black">
              <span>TOTAL AKHIR:</span>
              <span>Rp {order.total_amount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="py-3 text-[11px] border-b border-dashed border-gray-400 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Metode Bayar:</span>
              <span className="font-bold uppercase text-black">
                {order.payment_method === 'qris' ? 'QRIS Dinamis (GPN)' : 'Tunai / Cash'}
              </span>
            </div>
            {order.payment_method === 'cash' && amountTendered && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tunai Diterima:</span>
                  <span>Rp {amountTendered.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">Kembalian:</span>
                  <span>Rp {(changeAmount || 0).toLocaleString('id-ID')}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Status:</span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3" /> LUNAS
              </span>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 text-center text-[10px] text-gray-500 space-y-1">
            <p className="italic">&quot;Setiap tegukan adalah cerita.&quot;</p>
            <p>Wifi: KopiKita_Guest | Pass: kopikitaseru</p>
            <p className="text-[9px] pt-1 text-gray-400">Powered by Kopi Kita Backoffice POS</p>
          </div>
        </div>

        {/* Modal Action Buttons (Screen only) */}
        <div className="bg-kopi-sand/30 p-4 border-t border-kopi-border flex items-center justify-end gap-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-kopi-espresso hover:bg-kopi-sand transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-kopi-espresso text-white text-xs font-semibold hover:bg-kopi-mocha transition-all flex items-center gap-2 shadow-warm active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Struk Fisik</span>
          </button>
        </div>
      </div>
    </div>
  );
}
