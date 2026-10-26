'use client';

import React, { useState, useEffect } from 'react';
import { Order } from '@/types/database.types';
import { store, SEED_ORDERS } from '@/lib/supabaseClient';
import {
  Coffee,
  QrCode,
  Banknote,
  DollarSign,
  Download,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month'>('today');
  const [userRole, setUserRole] = useState<'cashier' | 'owner'>('owner');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = (localStorage.getItem('kopikita_user_role') as 'cashier' | 'owner') || 'owner';
      setUserRole(role);
    }

    const loadData = async () => {
      const data = await store.getOrders();
      setOrders(data);
    };

    loadData();
    const unsub = store.subscribe(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  // Filter orders by status 'paid' or completed
  const paidOrders = orders.filter((o) => o.payment_status === 'paid');

  // Calculations
  const totalOmzet = paidOrders.reduce((acc, o) => acc + o.total_amount, 0);

  // Cups sold
  let totalCups = 0;
  const productSalesMap: Record<string, { name: string; cups: number; revenue: number }> = {};

  paidOrders.forEach((o) => {
    o.items?.forEach((item) => {
      totalCups += item.quantity;
      if (!productSalesMap[item.product_name]) {
        productSalesMap[item.product_name] = {
          name: item.product_name,
          cups: 0,
          revenue: 0,
        };
      }
      productSalesMap[item.product_name].cups += item.quantity;
      productSalesMap[item.product_name].revenue += item.subtotal;
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.cups - a.cups);

  // Payment Breakdown (QRIS vs Tunai)
  const qrisOrders = paidOrders.filter((o) => o.payment_method === 'qris');
  const cashOrders = paidOrders.filter((o) => o.payment_method === 'cash');

  const qrisRevenue = qrisOrders.reduce((acc, o) => acc + o.total_amount, 0);
  const cashRevenue = cashOrders.reduce((acc, o) => acc + o.total_amount, 0);

  const qrisPercent = totalOmzet > 0 ? Math.round((qrisRevenue / totalOmzet) * 100) : 0;
  const cashPercent = totalOmzet > 0 ? 100 - qrisPercent : 0;

  // Average Basket Size
  const avgBasket = paidOrders.length > 0 ? Math.round(totalOmzet / paidOrders.length) : 0;

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Order Number', 'Customer', 'Type', 'Status', 'Payment', 'Total (Rp)', 'Time'];
    const rows = paidOrders.map((o) => [
      o.order_number,
      `"${o.customer_name}"`,
      o.order_type,
      o.status,
      o.payment_method,
      o.total_amount,
      new Date(o.created_at).toLocaleString('id-ID'),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Omzet_KopiKita_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-kopi-espresso tracking-tight">
              Laporan Penjualan & Omzet Harian
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-kopi-sand text-kopi-espresso text-xs font-semibold flex items-center gap-1 border border-kopi-border">
              <ShieldCheck className="w-3.5 h-3.5 text-kopi-mocha" />
              {userRole === 'owner' ? 'Akses Pemilik (Owner)' : 'Ringkasan Kasir'}
            </span>
          </div>
          <p className="text-xs md:text-sm text-kopi-muted mt-0.5">
            Analisis Finansial, Performa Penjualan Cup, dan Rasio Transaksi QRIS vs Tunai
          </p>
        </div>

        {/* Date Filter & Export */}
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-xl border border-kopi-border shadow-warm flex">
            <button
              type="button"
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateFilter === 'today'
                  ? 'bg-kopi-espresso text-white'
                  : 'text-kopi-muted hover:text-kopi-espresso'
              }`}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateFilter === 'week'
                  ? 'bg-kopi-espresso text-white'
                  : 'text-kopi-muted hover:text-kopi-espresso'
              }`}
            >
              7 Hari
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateFilter === 'month'
                  ? 'bg-kopi-espresso text-white'
                  : 'text-kopi-muted hover:text-kopi-espresso'
              }`}
            >
              Bulan Ini
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-kopi-border text-kopi-espresso text-xs font-semibold flex items-center gap-1.5 shadow-warm hover:bg-kopi-sand transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-kopi-mocha" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omzet */}
        <div className="bg-white p-5 rounded-3xl border border-kopi-border shadow-warm flex flex-col justify-between">
          <div className="flex items-center justify-between text-kopi-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Omzet Bersih</span>
            <div className="w-9 h-9 rounded-xl bg-kopi-sand/50 text-kopi-espresso flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-kopi-mocha" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-kopi-espresso">
              Rp {totalOmzet.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% dari target shift harian
            </p>
          </div>
        </div>

        {/* Total Cup Terjual */}
        <div className="bg-white p-5 rounded-3xl border border-kopi-border shadow-warm flex flex-col justify-between">
          <div className="flex items-center justify-between text-kopi-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Jumlah Cup Terjual</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-kopi-amber" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-kopi-espresso">
              {totalCups} <span className="text-sm font-normal text-kopi-muted">Cups</span>
            </h3>
            <p className="text-[11px] text-kopi-muted mt-1">
              Dari {paidOrders.length} transaksi kasir aktif
            </p>
          </div>
        </div>

        {/* QRIS Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-kopi-border shadow-warm flex flex-col justify-between">
          <div className="flex items-center justify-between text-kopi-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Penerimaan QRIS</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-kopi-sage flex items-center justify-center">
              <QrCode className="w-5 h-5 text-kopi-sage" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-kopi-sage">
              Rp {qrisRevenue.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-kopi-muted mt-1">
              {qrisPercent}% dari total omzet ({qrisOrders.length} transaksi)
            </p>
          </div>
        </div>

        {/* Tunai / Cash Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-kopi-border shadow-warm flex flex-col justify-between">
          <div className="flex items-center justify-between text-kopi-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Penerimaan Tunai</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-blue-700" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-kopi-espresso">
              Rp {cashRevenue.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-kopi-muted mt-1">
              {cashPercent}% dari total omzet ({cashOrders.length} transaksi)
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown: QRIS vs Tunai & Hourly Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Breakdown Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-kopi-border shadow-warm flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-kopi-espresso">
              Rincian Pembayaran QRIS vs Tunai
            </h3>
            <p className="text-xs text-kopi-muted mt-0.5">
              Distribusi metode pelunasan pesanan pelanggan
            </p>

            {/* Visual Ratio Bar */}
            <div className="mt-6">
              <div className="h-6 w-full rounded-full bg-kopi-sand/50 overflow-hidden flex p-1">
                <div
                  style={{ width: `${qrisPercent}%` }}
                  className="bg-kopi-sage rounded-full h-full transition-all duration-500 shadow-sm"
                  title={`QRIS: ${qrisPercent}%`}
                />
                <div
                  style={{ width: `${cashPercent}%` }}
                  className="bg-kopi-amber rounded-full h-full ml-1 transition-all duration-500 shadow-sm"
                  title={`Tunai: ${cashPercent}%`}
                />
              </div>

              <div className="flex items-center justify-between text-xs mt-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-kopi-sage" />
                  <span className="font-semibold text-kopi-espresso">QRIS ({qrisPercent}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-kopi-amber" />
                  <span className="font-semibold text-kopi-espresso">Tunai ({cashPercent}%)</span>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="mt-6 space-y-3 pt-4 border-t border-kopi-border/70 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                <div className="flex items-center gap-2.5">
                  <QrCode className="w-4 h-4 text-kopi-sage" />
                  <div>
                    <span className="font-bold text-emerald-950 block">QRIS Dinamis GPN</span>
                    <span className="text-[11px] text-emerald-800">{qrisOrders.length} Transaksi Berhasil</span>
                  </div>
                </div>
                <span className="font-bold text-sm text-kopi-sage">
                  Rp {qrisRevenue.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/60">
                <div className="flex items-center gap-2.5">
                  <Banknote className="w-4 h-4 text-kopi-amber" />
                  <div>
                    <span className="font-bold text-amber-950 block">Tunai di Kasir (Cash)</span>
                    <span className="text-[11px] text-amber-800">{cashOrders.length} Transaksi Lunas</span>
                  </div>
                </div>
                <span className="font-bold text-sm text-kopi-amber">
                  Rp {cashRevenue.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-kopi-border/60 flex items-center justify-between text-xs text-kopi-muted">
            <span>Rata-rata Basket Belanja:</span>
            <span className="font-bold text-kopi-espresso">
              Rp {avgBasket.toLocaleString('id-ID')} / transaksi
            </span>
          </div>
        </div>

        {/* Top Selling Products (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-kopi-border shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-kopi-espresso">
                Menu Paling Laris (Top Sellers)
              </h3>
              <p className="text-xs text-kopi-muted mt-0.5">
                Varian kopi & bakery favorit pelanggan Kopi Kita
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-kopi-sand text-kopi-mocha">
              Diperbarui Realtime
            </span>
          </div>

          <div className="space-y-3">
            {topProducts.slice(0, 5).map((item, idx) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 rounded-2xl border border-kopi-border/70 hover:border-kopi-mocha/40 transition-colors bg-kopi-sand/10"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      idx === 0
                        ? 'bg-kopi-amber text-white shadow-sm'
                        : idx === 1
                        ? 'bg-kopi-sand text-kopi-espresso'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-kopi-espresso">{item.name}</h4>
                    <span className="text-[11px] text-kopi-muted">
                      Terjual {item.cups} cup hari ini
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-kopi-espresso block">
                    Rp {item.revenue.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-kopi-sage font-semibold uppercase">
                    Kontribusi Menu
                  </span>
                </div>
              </div>
            ))}

            {topProducts.length === 0 && (
              <div className="py-8 text-center text-kopi-muted text-xs">
                Belum ada transaksi menu hari ini.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hourly Rush Trends Simulator */}
      <div className="bg-white p-6 rounded-3xl border border-kopi-border shadow-warm">
        <h3 className="font-serif font-bold text-lg text-kopi-espresso mb-1">
          Pola Penjualan per Jam (Hourly Sales Velocity)
        </h3>
        <p className="text-xs text-kopi-muted mb-6">
          Memetakan waktu ramai (peak hours) untuk penjadwalan barista roastery
        </p>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 items-end h-44 pt-4 border-b border-kopi-border">
          {[
            { hour: '08:00', cups: 14, peak: false },
            { hour: '09:00', cups: 28, peak: true },
            { hour: '10:00', cups: 22, peak: false },
            { hour: '11:00', cups: 18, peak: false },
            { hour: '12:00', cups: 36, peak: true },
            { hour: '13:00', cups: 32, peak: true },
            { hour: '14:00', cups: 20, peak: false },
            { hour: '15:00', cups: 24, peak: false },
            { hour: '16:00', cups: 42, peak: true },
            { hour: '17:00', cups: 48, peak: true },
            { hour: '18:00', cups: 38, peak: true },
            { hour: '19:00', cups: 26, peak: false },
          ].map((bar) => {
            const heightPercent = Math.min(100, (bar.cups / 50) * 100);
            return (
              <div key={bar.hour} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-bold text-kopi-espresso opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.cups}
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    bar.peak
                      ? 'bg-kopi-espresso group-hover:bg-kopi-amber'
                      : 'bg-kopi-sand group-hover:bg-kopi-mocha'
                  }`}
                />
                <span className="text-[10px] text-kopi-muted truncate font-mono">
                  {bar.hour.slice(0, 2)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs text-kopi-muted mt-3">
          <span>Jam Buka: 08:00 WIB</span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-kopi-espresso inline-block" /> Jam Sibuk (Peak Rush)
            <span className="w-3 h-3 rounded bg-kopi-sand inline-block ml-2" /> Standar
          </span>
          <span>Tutup: 22:00 WIB</span>
        </div>
      </div>
    </div>
  );
}
