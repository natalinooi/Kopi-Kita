import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KOPI KITA - Owner & POS Backoffice',
  description: 'Sistem Kasir POS, Kitchen Display System (KDS) Live Kanban, dan Manajemen Stok untuk Coffee Shop Artisanal',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-kopi-cream text-kopi-espresso min-h-screen selection:bg-kopi-amber/20 selection:text-kopi-espresso font-sans">
        {children}
      </body>
    </html>
  );
}
