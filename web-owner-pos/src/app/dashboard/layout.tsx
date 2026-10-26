'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Store,
  LayoutGrid,
  Package,
  TrendingUp,
  LogOut,
  Bell,
  Coffee,
  Sparkles,
  RefreshCw,
  UserCheck,
  Menu,
  X,
} from 'lucide-react';
import { isSupabaseConfigured, store } from '@/lib/supabaseClient';
import { UserRole } from '@/types/database.types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole>('cashier');
  const [userName, setUserName] = useState('Kasir Sudirman');
  const [outlet, setOutlet] = useState('Sudirman Roastery Hub');
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simulatedNotification, setSimulatedNotification] = useState<string | null>(null);

  // Sync state & pending counts
  const syncState = async () => {
    const orders = await store.getOrders();
    const pending = orders.filter((o) => o.status === 'pesanan_masuk').length;
    setPendingOrdersCount(pending);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = (localStorage.getItem('kopikita_user_role') as UserRole) || 'cashier';
      const storedName = localStorage.getItem('kopikita_user_name') || 'Fajar (Kasir)';
      const storedOutlet = localStorage.getItem('kopikita_outlet') || 'Sudirman Roastery Hub';
      setUserRole(storedRole);
      setUserName(storedName);
      setOutlet(storedOutlet);
    }

    syncState();
    const unsubscribe = store.subscribe(() => {
      syncState();
    });

    const handleCustomEvent = () => syncState();
    window.addEventListener('kopikita_state_updated', handleCustomEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('kopikita_state_updated', handleCustomEvent);
    };
  }, []);

  const handleSimulateOrder = () => {
    const newOrder = store.simulateCustomerAppOrder();
    setSimulatedNotification(`Pesanan Baru Masuk! #${newOrder.order_number} (${newOrder.customer_name})`);

    // Play subtle audio alert via Web Audio API chime
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // Audio context might be restricted before interaction
    }

    setTimeout(() => {
      setSimulatedNotification(null);
    }, 4000);
  };

  const handleRoleSwitch = () => {
    const nextRole: UserRole = userRole === 'cashier' ? 'owner' : 'cashier';
    const nextName = nextRole === 'owner' ? 'Pak Hendra (Owner)' : 'Fajar (Kasir Shift 1)';
    setUserRole(nextRole);
    setUserName(nextName);
    localStorage.setItem('kopikita_user_role', nextRole);
    localStorage.setItem('kopikita_user_name', nextName);
  };

  const handleLogout = () => {
    localStorage.removeItem('kopikita_user_role');
    router.push('/login');
  };

  const navItems = [
    {
      name: 'POS Terminal Kasir',
      href: '/dashboard/pos',
      icon: Store,
      badge: null,
    },
    {
      name: 'Live Kitchen Kanban',
      href: '/dashboard/orders',
      icon: LayoutGrid,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
    },
    {
      name: 'Katalog & Stok Menu',
      href: '/dashboard/inventory',
      icon: Package,
      badge: null,
    },
    {
      name: 'Laporan Penjualan',
      href: '/dashboard/analytics',
      icon: TrendingUp,
      badge: userRole === 'owner' ? 'Owner' : null,
    },
  ];

  return (
    <div className="min-h-screen bg-kopi-cream flex flex-col md:flex-row text-kopi-espresso">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-kopi-espresso text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-warm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Coffee className="w-4 h-4 text-kopi-amber" />
          </div>
          <div>
            <span className="font-serif font-bold text-base tracking-wide">KOPI KITA</span>
            <span className="text-[10px] block text-kopi-sand/70 uppercase tracking-wider">
              {userRole === 'owner' ? 'Owner Portal' : 'POS Kasir'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSimulateOrder}
            title="Simulasikan Order Customer"
            className="p-1.5 rounded-lg bg-kopi-amber/20 text-kopi-amber hover:bg-kopi-amber/30 text-xs flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Persistent Desktop Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-kopi-espresso text-kopi-sand flex flex-col justify-between z-30 transition-transform duration-300 shadow-warm-xl ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="pb-5 mb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-kopi-amber to-kopi-mocha flex items-center justify-center text-white shadow-warm shrink-0">
                <Coffee className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="font-serif font-bold text-lg text-white tracking-wider truncate">
                  KOPI KITA
                </h2>
                <p className="text-[11px] font-sans text-kopi-sand/80 tracking-widest uppercase">
                  Roastery & Slow Bar
                </p>
              </div>
            </div>

            {/* Outlet Pill */}
            <div className="mt-3.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-kopi-sand/70 truncate">📍 {outlet}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-kopi-sand/40 px-3 block mb-2">
              Menu Utama
            </span>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-kopi-sand text-kopi-espresso font-semibold shadow-warm'
                      : 'text-kopi-sand/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-kopi-mocha' : 'text-kopi-sand/60 group-hover:text-white'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        typeof item.badge === 'number'
                          ? 'bg-kopi-amber text-white animate-pulse'
                          : 'bg-white/20 text-kopi-sand text-[10px]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Simulation Trigger for Realtime Kanban testing */}
          <div className="pt-4 border-t border-white/10 my-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-kopi-amber" />
                  Uji Order Realtime
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-kopi-sand/70 mb-2.5 leading-relaxed">
                Simulasikan pesanan masuk dari Android / Web customer ke Live Kanban.
              </p>
              <button
                type="button"
                onClick={handleSimulateOrder}
                className="w-full py-2 px-3 rounded-xl bg-kopi-amber hover:bg-amber-600 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>+ Pesanan Masuk Baru</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer: User profile & Role switcher */}
        <div className="p-4 bg-kopi-dark/70 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">{userName}</span>
              <span className="text-[11px] text-kopi-sand/70 capitalize flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-kopi-amber" />
                Role: {userRole}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRoleSwitch}
              title="Ganti Role Cepat"
              className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-kopi-sand transition-colors"
            >
              Ubah Role
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            {/* Backend Connectivity Status */}
            <div className="flex items-center gap-1.5" title={isSupabaseConfigured ? 'Terhubung ke Supabase' : 'Mode Offline / Local DB Ready'}>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className="text-[11px] text-kopi-sand/60">
                {isSupabaseConfigured ? 'Supabase Live' : 'Demo LocalDB'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-kopi-sand/70 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Floating Notification for simulated orders */}
        {simulatedNotification && (
          <div className="fixed top-4 right-4 z-50 bg-kopi-espresso text-white px-4 py-3 rounded-2xl shadow-warm-xl border border-kopi-amber/40 flex items-center gap-3 animate-bounce">
            <div className="w-8 h-8 rounded-full bg-kopi-amber flex items-center justify-center text-white">
              <Bell className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <p className="text-xs font-bold text-kopi-sand">{simulatedNotification}</p>
              <p className="text-[11px] text-white/70">Periksa kolom &apos;Pesanan Masuk&apos; pada Live Kanban</p>
            </div>
          </div>
        )}

        <div className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
