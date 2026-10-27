'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CustomerOrder, OrderStatus, getOrderById, supabase, isSupabaseConfigured } from '@/lib/supabase';
import confetti from 'canvas-confetti';
import {
  Coffee,
  Clock,
  BellRing,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Utensils,
  Receipt,
} from 'lucide-react';

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  {
    key: 'pesanan_masuk',
    label: 'Pesanan Diterima',
    desc: 'Kasir & barista telah menerima tiket pesananmu.',
  },
  {
    key: 'sedang_diseduh',
    label: 'Sedang Diseduh',
    desc: 'Barista sedang meracik biji kopi sangrai artisanal pilihanmu.',
  },
  {
    key: 'siap_diambil',
    label: 'Siap Diambil di Bar',
    desc: 'Silakan ambil minuman segarmu di pick-up counter!',
  },
  {
    key: 'selesai',
    label: 'Pesanan Selesai',
    desc: 'Terima kasih telah berkunjung ke KOPI KITA!',
  },
];

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = (params?.id as string) || '';

  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch order and setup realtime
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchOrder = async () => {
      let found = await getOrderById(orderId);
      if (!found && orderId === 'latest') {
        found = await getOrderById('latest');
      }
      setOrder(found);
      setLoading(false);

      if (found?.status === 'siap_diambil') {
        triggerConfetti();
      }

      // Setup Realtime if not yet set up and we have a valid order UUID
      if (isSupabaseConfigured && found?.id && !channel) {
        try {
          channel = supabase
            .channel(`customer-order-${found.id}`)
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders',
                filter: `id=eq.${found.id}`,
              },
              (payload) => {
                if (payload.new) {
                  const nextStatus = payload.new.status as OrderStatus;
                  setOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
                  if (nextStatus === 'siap_diambil') {
                    triggerConfetti();
                  }
                }
              }
            )
            .subscribe();
        } catch (err) {
          console.warn('Realtime channel error:', err);
        }
      }
    };

    fetchOrder();

    // Polling interval every 5s to guarantee status sync even if websocket drops
    const pollInterval = setInterval(() => {
      fetchOrder();
    }, 5000);

    // Local storage cross-tab update listener
    const handleStorageUpdate = () => {
      fetchOrder();
    };
    window.addEventListener('kopikita_state_updated', handleStorageUpdate);

    return () => {
      clearInterval(pollInterval);
      if (channel) supabase.removeChannel(channel);
      window.removeEventListener('kopikita_state_updated', handleStorageUpdate);
    };
  }, [orderId]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2B170B', '#C4823F', '#4F6D48', '#E8DED1'],
      });
    } catch {
      // ignore
    }
  };

  // Helper to simulate status progression for testing
  const handleSimulateNextStatus = () => {
    if (!order) return;
    let nextStatus: OrderStatus = 'pesanan_masuk';
    if (order.status === 'pesanan_masuk') nextStatus = 'sedang_diseduh';
    else if (order.status === 'sedang_diseduh') nextStatus = 'siap_diambil';
    else if (order.status === 'siap_diambil') nextStatus = 'selesai';
    else nextStatus = 'pesanan_masuk';

    const updated = { ...order, status: nextStatus, updated_at: new Date().toISOString() };
    setOrder(updated);

    if (typeof window !== 'undefined') {
      const stored: CustomerOrder[] = JSON.parse(localStorage.getItem('kopikita_orders') || '[]');
      const replaced = stored.map((o) => (o.id === order.id ? updated : o));
      localStorage.setItem('kopikita_orders', JSON.stringify(replaced));
      window.dispatchEvent(new CustomEvent('kopikita_state_updated'));
    }

    if (nextStatus === 'siap_diambil') {
      triggerConfetti();
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pesanan_masuk':
        return 0;
      case 'sedang_diseduh':
        return 1;
      case 'siap_diambil':
        return 2;
      case 'selesai':
        return 3;
      default:
        return 0;
    }
  };

  const activeStepIdx = order ? getStepIndex(order.status) : 0;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-kopi-espresso flex items-center justify-center text-white animate-bounce shadow-warm mb-3">
          <Coffee className="w-6 h-6 text-kopi-amber" />
        </div>
        <h3 className="font-serif font-bold text-base text-kopi-espresso">
          Memuat Status Pesanan...
        </h3>
        <p className="text-xs text-kopi-muted mt-1">Menghubungkan ke Kitchen Roastery</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-kopi-sand flex items-center justify-center text-kopi-mocha mb-3">
          <Receipt className="w-6 h-6 opacity-60" />
        </div>
        <h3 className="font-serif font-bold text-lg text-kopi-espresso">
          Pesanan Belum Ditemukan
        </h3>
        <p className="text-xs text-kopi-muted mt-1 max-w-xs">
          Belum ada riwayat pesanan aktif pada sesi ini. Silakan pesan kopi terlebih dahulu.
        </p>
        <Link
          href="/"
          className="mt-5 px-5 py-2.5 rounded-xl bg-kopi-espresso text-white text-xs font-bold shadow-warm hover:bg-kopi-mocha transition-all"
        >
          Lihat Menu Kopi
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-kopi-canvas/90 backdrop-blur-md px-4 py-3.5 border-b border-kopi-border/70 flex items-center justify-between">
        <Link
          href="/"
          className="w-8 h-8 rounded-full bg-white border border-kopi-border flex items-center justify-center text-kopi-espresso hover:bg-kopi-sand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-kopi-mocha block">
            Status Langsung (Live Tracker)
          </span>
          <h2 className="font-serif font-bold text-sm text-kopi-espresso">
            Pesanan #{order.order_number}
          </h2>
        </div>
        <div className="w-8" />
      </header>

      <div className="p-4 space-y-4">
        {/* Realtime Alert Card */}
        <div
          className={`p-5 rounded-3card border text-white shadow-warm-lg transition-all duration-300 relative overflow-hidden ${
            order.status === 'siap_diambil'
              ? 'bg-gradient-to-br from-kopi-sage via-emerald-800 to-kopi-espresso border-emerald-400'
              : order.status === 'sedang_diseduh'
              ? 'bg-gradient-to-br from-kopi-amber via-amber-800 to-kopi-espresso border-amber-300'
              : 'bg-gradient-to-br from-kopi-espresso via-kopi-mocha to-stone-900 border-white/10'
          }`}
        >
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-kopi-sand">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Realtime Kitchen Sync
              </span>

              <h3 className="font-serif text-xl font-extrabold mt-2 leading-tight">
                {order.status === 'siap_diambil'
                  ? 'Minuman Siap Diambil! 🔔'
                  : order.status === 'sedang_diseduh'
                  ? 'Sedang Diseduh Barista ☕'
                  : 'Pesanan Telah Diterima ✓'}
              </h3>

              <p className="text-xs text-kopi-sand/90 mt-1 leading-relaxed">
                {STATUS_STEPS[activeStepIdx]?.desc}
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-sm">
              {order.status === 'siap_diambil' ? (
                <BellRing className="w-6 h-6 text-white animate-bounce" />
              ) : order.status === 'sedang_diseduh' ? (
                <Coffee className="w-6 h-6 text-kopi-amber animate-pulse" />
              ) : (
                <Clock className="w-6 h-6 text-kopi-sand" />
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-kopi-sand/80">
            <span>Estimasi Saji: 3 - 5 Menit</span>
            <span className="font-mono font-bold text-white">#{order.order_number}</span>
          </div>
        </div>

        {/* 4-Step Interactive Progress Stepper */}
        <div className="bg-white rounded-2card p-5 border border-kopi-border shadow-warm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-kopi-mocha mb-4">
            Tahapan Pengerjaan Pesanan
          </h4>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-kopi-border">
            {STATUS_STEPS.map((step, idx) => {
              const isPast = idx < activeStepIdx;
              const isCurrent = idx === activeStepIdx;
              return (
                <div key={step.key} className="relative flex items-start gap-3">
                  {/* Step Dot */}
                  <span
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                      isPast
                        ? 'bg-kopi-sage border-kopi-sage text-white'
                        : isCurrent
                        ? 'bg-kopi-espresso border-kopi-amber text-white ring-4 ring-kopi-amber/20'
                        : 'bg-white border-kopi-border text-kopi-muted'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </span>

                  <div>
                    <h5
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-kopi-espresso font-serif text-sm'
                          : isPast
                          ? 'text-kopi-sage'
                          : 'text-kopi-muted'
                      }`}
                    >
                      {step.label}
                    </h5>
                    <p className="text-[11px] text-kopi-muted mt-0.5 leading-snug">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-2card p-5 border border-kopi-border shadow-warm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-kopi-border">
            <div>
              <span className="text-[10px] uppercase font-bold text-kopi-muted tracking-wider">
                Pemesan
              </span>
              <h4 className="font-bold text-sm text-kopi-espresso">{order.customer_name}</h4>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-kopi-muted tracking-wider">
                Layanan
              </span>
              <div className="text-xs font-bold text-kopi-espresso flex items-center justify-end gap-1">
                {order.order_type === 'dine_in' ? (
                  <>
                    <Utensils className="w-3.5 h-3.5 text-kopi-mocha" />
                    <span>Dine In ({order.table_number || 'Meja'})</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-kopi-mocha" />
                    <span>Take Away</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-kopi-mocha block">
              Rincian Menu
            </span>

            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between text-xs py-1 border-b border-kopi-border/50 last:border-0"
              >
                <div>
                  <span className="font-bold text-kopi-espresso">
                    {item.quantity}x {item.product_name}
                  </span>
                  <div className="text-[10px] text-kopi-muted">
                    {item.size} • {item.temperature} • {item.sugar_level}
                  </div>
                  {item.customization_notes && (
                    <div className="text-[10px] text-amber-800 italic">
                      * {item.customization_notes}
                    </div>
                  )}
                </div>
                <span className="font-bold text-kopi-mocha">
                  Rp {item.subtotal.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          {/* Total & Payment */}
          <div className="pt-2 border-t border-kopi-border space-y-1 text-xs">
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Diskon Promo:</span>
                <span>-Rp {order.discount_amount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-kopi-espresso pt-1">
              <span>Total Lunas (QRIS):</span>
              <span className="text-base">Rp {order.total_amount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Demo Simulator Helper Bar */}
        <div className="p-4 rounded-2card bg-kopi-sand/30 border border-kopi-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-kopi-espresso flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-kopi-amber" />
              Simulasi Kitchen KDS
            </span>
            <span className="text-[10px] bg-kopi-mocha/20 text-kopi-mocha px-2 py-0.5 rounded font-semibold">
              Demo Helper
            </span>
          </div>
          <p className="text-[11px] text-kopi-muted">
            Tekan tombol di bawah untuk menyimulasikan barista memperbarui status seduh pesanan ini:
          </p>
          <button
            type="button"
            onClick={handleSimulateNextStatus}
            className="w-full py-2.5 px-3 rounded-xl bg-kopi-espresso hover:bg-kopi-mocha text-white text-xs font-bold transition-all shadow-warm flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Majukan Status Pesanan ➔</span>
          </button>
        </div>

        {/* Back to Home Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="w-full py-3 px-4 rounded-2card border border-kopi-border bg-white text-kopi-espresso text-xs font-bold hover:bg-kopi-sand transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Pesan Minuman Lain</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
