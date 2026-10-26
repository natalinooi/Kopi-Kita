'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, Profile } from '@/types/database.types';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';
import { Coffee, ShieldCheck, UserCheck, ArrowRight, Sparkles, Key } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('cashier');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [outlet, setOutlet] = useState('Sudirman Roastery Hub');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // If live Supabase auth is configured and user typed credentials
    if (isSupabaseConfigured && email && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.warn('Supabase auth failed:', error.message);
          setErrorMsg(error.message + '. Masuk dengan mode demo backoffice.');
        } else if (data?.user) {
          // fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const profileData = profile as unknown as Profile | null;
          const activeRole = (profileData?.role as UserRole) || role;
          localStorage.setItem('kopikita_user_role', activeRole);
          localStorage.setItem('kopikita_user_name', profileData?.full_name || email.split('@')[0]);
          localStorage.setItem('kopikita_outlet', profileData?.outlet_name || outlet);
          router.push('/dashboard/pos');
          return;
        }
      } catch (err) {
        console.warn('Auth error', err);
      }
    }

    // Default fast login (Demo & Backoffice immediate access)
    setTimeout(() => {
      localStorage.setItem('kopikita_user_role', role);
      localStorage.setItem(
        'kopikita_user_name',
        role === 'owner' ? 'Pak Hendra (Owner)' : 'Fajar (Kasir Shift 1)'
      );
      localStorage.setItem('kopikita_outlet', outlet);
      setLoading(false);
      router.push('/dashboard/pos');
    }, 400);
  };

  const handleQuickDemoLogin = (selectedRole: UserRole) => {
    localStorage.setItem('kopikita_user_role', selectedRole);
    localStorage.setItem(
      'kopikita_user_name',
      selectedRole === 'owner' ? 'Pak Hendra (Owner)' : 'Fajar (Kasir Shift 1)'
    );
    localStorage.setItem('kopikita_outlet', 'Sudirman Roastery Hub');
    router.push(selectedRole === 'owner' ? '/dashboard/analytics' : '/dashboard/pos');
  };

  return (
    <div className="min-h-screen bg-kopi-cream flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Ambient Roast Rings */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-kopi-mocha/10 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-kopi-mocha/10 pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-kopi-border shadow-warm-xl p-8 relative z-10">
        {/* Brand Logo & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-kopi-espresso text-kopi-sand shadow-warm mb-3">
            <Coffee className="w-8 h-8 text-kopi-amber" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-kopi-espresso tracking-tight">
            KOPI KITA
          </h1>
          <p className="text-xs uppercase tracking-widest text-kopi-mocha font-semibold mt-0.5">
            Owner & POS Backoffice
          </p>
          <p className="text-xs text-kopi-muted mt-2">
            Pusat Kendali POS Terminal, Kitchen Kanban & Inventori
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-kopi-sand/30 p-1.5 rounded-2xl mb-6 border border-kopi-border">
          <button
            type="button"
            onClick={() => setRole('cashier')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              role === 'cashier'
                ? 'bg-kopi-espresso text-white shadow-warm'
                : 'text-kopi-muted hover:text-kopi-espresso'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Kasir / Barista</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('owner')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              role === 'owner'
                ? 'bg-kopi-espresso text-white shadow-warm'
                : 'text-kopi-muted hover:text-kopi-espresso'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Owner / Manajemen</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-1">
              Outlet Roastery
            </label>
            <select
              value={outlet}
              onChange={(e) => setOutlet(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-kopi-border bg-white text-sm text-kopi-espresso focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
            >
              <option value="Sudirman Roastery Hub">Sudirman Roastery Hub (Pusat)</option>
              <option value="Senopati Slow Bar">Senopati Slow Bar</option>
              <option value="Bintaro Artisan Outpost">Bintaro Artisan Outpost</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-1">
              Email / ID Operator
            </label>
            <input
              type="text"
              placeholder={role === 'owner' ? 'owner@kopikita.id' : 'kasir1@kopikita.id'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-kopi-border bg-white text-sm text-kopi-espresso focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-kopi-mocha mb-1">
              PIN / Sandi Akses
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-kopi-border bg-white text-sm text-kopi-espresso focus:outline-none focus:ring-1 focus:ring-kopi-espresso"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-kopi-espresso hover:bg-kopi-mocha text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-warm active:scale-[0.98] disabled:opacity-70 mt-2"
          >
            {loading ? (
              <span>Memverifikasi Akses...</span>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-5 border-t border-kopi-border/70">
          <p className="text-[11px] text-center text-kopi-muted font-medium mb-2.5">
            ⚡ Akses Cepat Mode Prototipe:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('cashier')}
              className="py-2 px-3 rounded-xl border border-kopi-border bg-kopi-sand/20 hover:bg-kopi-sand text-xs font-semibold text-kopi-espresso flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-kopi-amber" />
              <span>Login Kasir</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner')}
              className="py-2 px-3 rounded-xl border border-kopi-border bg-kopi-sand/20 hover:bg-kopi-sand text-xs font-semibold text-kopi-espresso flex items-center justify-center gap-1.5 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-kopi-sage" />
              <span>Login Owner</span>
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-kopi-muted text-center mt-6">
        © 2026 KOPI KITA Roastery & Slow Bar • All Rights Reserved.
      </p>
    </div>
  );
}
