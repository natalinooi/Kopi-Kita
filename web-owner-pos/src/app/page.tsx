'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has an active session role, otherwise default to pos or login
    const userRole = localStorage.getItem('kopikita_user_role');
    if (userRole) {
      router.replace('/dashboard/pos');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-kopi-cream flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-kopi-espresso text-kopi-sand mx-auto flex items-center justify-center shadow-warm animate-bounce">
          ☕
        </div>
        <h2 className="font-serif text-lg font-bold text-kopi-espresso">
          KOPI KITA - Owner & POS Backoffice
        </h2>
        <p className="text-xs text-kopi-muted">Memuat antarmuka sistem kasir & barista...</p>
      </div>
    </div>
  );
}
