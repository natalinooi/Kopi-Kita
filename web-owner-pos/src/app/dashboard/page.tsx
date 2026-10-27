'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/pos');
  }, [router]);

  return (
    <div className="flex items-center justify-center p-12 text-kopi-muted text-sm">
      <div className="animate-pulse">Membuka POS Terminal Kasir...</div>
    </div>
  );
}
