'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/store';
import { createCustomerOrder } from '@/lib/supabase';
import { X, QrCode, CheckCircle, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const router = useRouter();
  const {
    cart,
    totalAmount,
    discount,
    orderType,
    customerName,
    tableNumber,
    clearCart,
    setIsCartOpen,
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const orderNumber = `KPK-${Date.now().toString().slice(-4)}`;

  const handlePaySuccess = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        order_number: orderNumber,
        customer_name: customerName,
        order_type: orderType,
        table_number: tableNumber,
        status: 'pesanan_masuk' as const,
        total_amount: totalAmount,
        discount_amount: discount,
        payment_method: 'qris' as const,
        payment_status: 'paid' as const,
        notes: `Order via Web Customer (${orderType === 'dine_in' ? `Meja ${tableNumber}` : 'Take Away'})`,
      };

      const itemsPayload = cart.map((it) => ({
        product_id: it.product.id,
        product_name: it.product.name,
        quantity: it.quantity,
        unit_price: it.unitPrice,
        subtotal: it.totalPrice,
        size: it.size,
        temperature: it.temperature,
        sugar_level: it.sugar_level,
        customization_notes: [
          it.ice_level,
          it.notes ? `Catatan: ${it.notes}` : null,
        ]
          .filter(Boolean)
          .join(', '),
      }));

      const created = await createCustomerOrder(orderPayload, itemsPayload);

      clearCart();
      setIsCartOpen(false);
      onClose();

      // Redirect directly to live tracking page
      router.push(`/order-status/${created.id}`);
    } catch (err) {
      console.error('Payment error:', err);
      alert('Gagal memproses pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-[420px] bg-white rounded-3card shadow-warm-xl border border-kopi-border overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-kopi-espresso text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-kopi-amber" />
            <div>
              <h3 className="font-serif font-bold text-base leading-tight">
                Pembayaran QRIS Dinamis
              </h3>
              <p className="text-[10px] text-kopi-sand/80">NMID: ID10203049281 • KOPI KITA</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 text-white/80 hover:text-white flex items-center justify-center text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 text-center space-y-4">
          <div>
            <span className="text-[11px] text-kopi-muted font-semibold uppercase tracking-wider block">
              Total Tagihan
            </span>
            <h2 className="font-serif text-2xl font-bold text-kopi-espresso mt-0.5">
              Rp {totalAmount.toLocaleString('id-ID')}
            </h2>
            <span className="inline-block mt-1 text-[11px] font-mono bg-kopi-sand/50 text-kopi-espresso px-2 py-0.5 rounded-md font-semibold">
              No. Order: #{orderNumber}
            </span>
          </div>

          {/* QR Code Container */}
          <div className="inline-block p-4 bg-white rounded-2card border-2 border-dashed border-kopi-border shadow-inner">
            <svg className="w-44 h-44 mx-auto" viewBox="0 0 200 200">
              {/* Corner finders */}
              <rect x="10" y="10" width="50" height="50" fill="#2B170B" rx="8" />
              <rect x="20" y="20" width="30" height="30" fill="#FFFFFF" rx="4" />
              <rect x="27" y="27" width="16" height="16" fill="#2B170B" rx="2" />

              <rect x="140" y="10" width="50" height="50" fill="#2B170B" rx="8" />
              <rect x="150" y="20" width="30" height="30" fill="#FFFFFF" rx="4" />
              <rect x="157" y="27" width="16" height="16" fill="#2B170B" rx="2" />

              <rect x="10" y="140" width="50" height="50" fill="#2B170B" rx="8" />
              <rect x="20" y="150" width="30" height="30" fill="#FFFFFF" rx="4" />
              <rect x="27" y="157" width="16" height="16" fill="#2B170B" rx="2" />

              {/* Data matrix patterns */}
              <rect x="70" y="15" width="15" height="15" fill="#2B170B" />
              <rect x="95" y="15" width="15" height="15" fill="#7A5C43" />
              <rect x="115" y="25" width="15" height="15" fill="#2B170B" />
              <rect x="70" y="45" width="25" height="15" fill="#2B170B" />
              <rect x="105" y="45" width="15" height="25" fill="#7A5C43" />

              {/* Center Coffee Icon */}
              <circle cx="100" cy="100" r="20" fill="#2B170B" />
              <circle cx="100" cy="100" r="16" fill="#F8F5F0" />
              <text x="100" y="104" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2B170B">
                ☕ KK
              </text>

              <rect x="70" y="145" width="20" height="20" fill="#2B170B" />
              <rect x="100" y="145" width="15" height="15" fill="#7A5C43" />
              <rect x="125" y="135" width="20" height="20" fill="#2B170B" />
              <rect x="150" y="145" width="35" height="15" fill="#7A5C43" />
              <rect x="165" y="165" width="20" height="20" fill="#2B170B" />
            </svg>
            <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-kopi-muted font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>GPN & QRIS Nasional Terverifikasi</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-left bg-kopi-sand/20 rounded-xl p-3 border border-kopi-border/70 text-[11px] text-kopi-muted space-y-1">
            <p className="font-semibold text-kopi-espresso">Instruksi Pembayaran:</p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Buka BCA, Mandiri, GoPay, OVO, ShopeePay, atau DANA</li>
              <li>Pilih menu <b>Scan QRIS</b> dan arahkan ke barcode di atas</li>
              <li>Periksa nominal dan selesaikan pembayaran</li>
            </ol>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 bg-kopi-canvas border-t border-kopi-border">
          <button
            type="button"
            onClick={handlePaySuccess}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2card bg-kopi-espresso hover:bg-kopi-mocha text-white text-xs font-bold transition-all shadow-warm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>
              {isSubmitting ? 'Memproses Pesanan...' : 'Simulasikan Pembayaran Berhasil'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
