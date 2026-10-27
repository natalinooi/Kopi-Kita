'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '@/types/database.types';
import { store, supabase, isSupabaseConfigured, SEED_ORDERS } from '@/lib/supabaseClient';
import OrderKanbanCard from '@/components/OrderKanbanCard';
import ReceiptModal from '@/components/ReceiptModal';
import {
  Coffee,
  Sparkles,
  Volume2,
  VolumeX,
  Filter,
  CheckCircle2,
  Clock,
  Flame,
  BellRing,
  Search,
} from 'lucide-react';

export default function KitchenKanbanPage() {
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'dine_in' | 'take_away'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Play Barista chime sound
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // Audio autoplay policy
    }
  }, [soundEnabled]);

  const loadOrders = async () => {
    const data = await store.getOrders();
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();

    // Subscribe to internal store updates
    const unsubStore = store.subscribe(() => {
      loadOrders();
    });

    // Supabase Realtime Subscription on public.orders & public.order_items
    let channel: ReturnType<typeof supabase.channel> | null = null;
    if (isSupabaseConfigured) {
      try {
        channel = supabase
          .channel('realtime:orders-kitchen')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'orders' },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                playChime();
                // Schedule follow-up reload to allow order_items to settle
                setTimeout(() => loadOrders(), 400);
              }
              loadOrders();
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'order_items' },
            () => {
              loadOrders();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime subscription setup failed:', err);
      }
    }

    // Polling fallback every 6 seconds to ensure kitchen screen always stays in sync
    const pollInterval = setInterval(() => {
      loadOrders();
    }, 6000);

    return () => {
      clearInterval(pollInterval);
      unsubStore();
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [soundEnabled, playChime]);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    await store.updateOrderStatus(orderId, nextStatus);
    loadOrders();
  };

  const handleSimulateNewOrder = () => {
    store.simulateCustomerAppOrder();
    playChime();
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesType = filterType === 'all' || o.order_type === filterType;
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items?.some((i) => i.product_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const pesananMasuk = filteredOrders.filter((o) => o.status === 'pesanan_masuk');
  const sedangDiseduh = filteredOrders.filter((o) => o.status === 'sedang_diseduh');
  const siapDiambil = filteredOrders.filter((o) => o.status === 'siap_diambil');
  const selesai = filteredOrders.filter((o) => o.status === 'selesai');

  return (
    <div className="space-y-6">
      {/* Top Header & Barista Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-kopi-espresso tracking-tight">
              Live Barista Kanban
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Kitchen Display (KDS)
            </span>
          </div>
          <p className="text-xs md:text-sm text-kopi-muted mt-0.5">
            Realtime Display System sinkron dengan Aplikasi Kasir POS & Mobile Customer
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Chime Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              soundEnabled
                ? 'bg-white border-kopi-border text-kopi-espresso shadow-warm'
                : 'bg-kopi-sand/30 border-kopi-border text-kopi-muted'
            }`}
            title={soundEnabled ? 'Suara Notifikasi Aktif' : 'Suara Di-Mute'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-kopi-amber" />
                <span>Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Muted</span>
              </>
            )}
          </button>

          {/* Simulate Button */}
          <button
            type="button"
            onClick={handleSimulateNewOrder}
            className="px-3.5 py-2 rounded-xl bg-kopi-espresso hover:bg-kopi-mocha text-white text-xs font-semibold flex items-center gap-1.5 shadow-warm transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-kopi-amber" />
            <span>+ Simulasi Order Masuk</span>
          </button>

          {/* Toggle History Completed */}
          <button
            type="button"
            onClick={() => setShowCompleted(!showCompleted)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showCompleted
                ? 'bg-kopi-sand border-kopi-espresso text-kopi-espresso'
                : 'bg-white border-kopi-border text-kopi-muted hover:text-kopi-espresso'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Selesai ({selesai.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-kopi-border shadow-warm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-kopi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari order # atau pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-kopi-border bg-kopi-cream/30 focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
          />
        </div>

        {/* Order Type Filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <span className="text-xs text-kopi-muted font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Layanan:
          </span>
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-kopi-espresso text-white'
                : 'bg-kopi-sand/30 text-kopi-muted hover:bg-kopi-sand'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setFilterType('dine_in')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              filterType === 'dine_in'
                ? 'bg-kopi-espresso text-white'
                : 'bg-kopi-sand/30 text-kopi-muted hover:bg-kopi-sand'
            }`}
          >
            Dine In
          </button>
          <button
            type="button"
            onClick={() => setFilterType('take_away')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              filterType === 'take_away'
                ? 'bg-kopi-espresso text-white'
                : 'bg-kopi-sand/30 text-kopi-muted hover:bg-kopi-sand'
            }`}
          >
            Take Away
          </button>
        </div>
      </div>

      {/* 3-COLUMN KANBAN BOARD */}
      {!showCompleted ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* COLUMN 1: Pesanan Masuk */}
          <div className="bg-kopi-sand/30 rounded-3xl p-4 border border-kopi-border flex flex-col min-h-[580px]">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-kopi-border">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-kopi-mocha" />
                <h3 className="font-serif font-bold text-base text-kopi-espresso">
                  Pesanan Masuk
                </h3>
              </div>
              <span className="w-6 h-6 rounded-full bg-kopi-mocha text-white text-xs font-bold flex items-center justify-center">
                {pesananMasuk.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {pesananMasuk.map((order) => (
                <OrderKanbanCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  onPrintReceipt={setReceiptOrder}
                />
              ))}

              {pesananMasuk.length === 0 && (
                <div className="h-48 flex flex-col items-center justify-center text-kopi-muted/60 text-center p-4">
                  <Clock className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-xs font-semibold">Tidak ada pesanan masuk</p>
                  <p className="text-[11px] mt-0.5">Semua antrean pesanan sudah diseduh.</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: Sedang Diseduh */}
          <div className="bg-amber-50/50 rounded-3xl p-4 border border-amber-200/80 flex flex-col min-h-[580px]">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-kopi-amber animate-ping" />
                <h3 className="font-serif font-bold text-base text-amber-950 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-kopi-amber" />
                  Sedang Diseduh
                </h3>
              </div>
              <span className="w-6 h-6 rounded-full bg-kopi-amber text-white text-xs font-bold flex items-center justify-center">
                {sedangDiseduh.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {sedangDiseduh.map((order) => (
                <OrderKanbanCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  onPrintReceipt={setReceiptOrder}
                />
              ))}

              {sedangDiseduh.length === 0 && (
                <div className="h-48 flex flex-col items-center justify-center text-amber-900/50 text-center p-4">
                  <Coffee className="w-8 h-8 mb-2 opacity-40 text-kopi-amber" />
                  <p className="text-xs font-semibold">Slow Bar sedang santai</p>
                  <p className="text-[11px] mt-0.5">Tekan &apos;Mulai Seduh&apos; pada kolom sebelah kiri.</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: Siap Diambil */}
          <div className="bg-emerald-50/50 rounded-3xl p-4 border border-emerald-200/80 flex flex-col min-h-[580px]">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-kopi-sage" />
                <h3 className="font-serif font-bold text-base text-emerald-950 flex items-center gap-1.5">
                  <BellRing className="w-4 h-4 text-kopi-sage" />
                  Siap Diambil
                </h3>
              </div>
              <span className="w-6 h-6 rounded-full bg-kopi-sage text-white text-xs font-bold flex items-center justify-center">
                {siapDiambil.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {siapDiambil.map((order) => (
                <OrderKanbanCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  onPrintReceipt={setReceiptOrder}
                />
              ))}

              {siapDiambil.length === 0 && (
                <div className="h-48 flex flex-col items-center justify-center text-emerald-900/50 text-center p-4">
                  <CheckCircle2 className="w-8 h-8 mb-2 opacity-40 text-kopi-sage" />
                  <p className="text-xs font-semibold">Tidak ada minuman yang menunggu</p>
                  <p className="text-[11px] mt-0.5">Minuman yang siap disajikan akan tampil di sini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* COMPLETED ORDERS ARCHIVE TAB */
        <div className="bg-white rounded-3xl border border-kopi-border p-6 shadow-warm">
          <div className="flex items-center justify-between pb-4 border-b border-kopi-border mb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-kopi-espresso">
                Riwayat Pesanan Selesai
              </h3>
              <p className="text-xs text-kopi-muted mt-0.5">
                Daftar transaksi yang telah disajikan ke pelanggan shift hari ini
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCompleted(false)}
              className="px-3.5 py-1.5 rounded-xl bg-kopi-espresso text-white text-xs font-semibold hover:bg-kopi-mocha transition-colors"
            >
              Kembali ke Live Kanban
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selesai.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl border border-kopi-border/70 bg-kopi-sand/15 flex flex-col justify-between text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-kopi-espresso bg-white px-2 py-0.5 rounded border border-kopi-border">
                    {order.order_number}
                  </span>
                  <span className="text-emerald-700 font-semibold">✓ Selesai & Lunas</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-kopi-espresso">{order.customer_name}</h4>
                  <p className="text-[11px] text-kopi-muted">
                    {order.items?.map((it) => `${it.quantity}x ${it.product_name}`).join(', ')}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-kopi-border/60">
                  <span className="font-bold text-kopi-espresso">
                    Rp {order.total_amount.toLocaleString('id-ID')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReceiptOrder(order)}
                    className="text-kopi-mocha hover:underline font-semibold"
                  >
                    Lihat Struk
                  </button>
                </div>
              </div>
            ))}

            {selesai.length === 0 && (
              <div className="col-span-full py-12 text-center text-kopi-muted">
                Belum ada pesanan yang ditandai selesai hari ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* REPRINT RECEIPT MODAL */}
      <ReceiptModal
        isOpen={Boolean(receiptOrder)}
        onClose={() => setReceiptOrder(null)}
        order={receiptOrder}
      />
    </div>
  );
}
