import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

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
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-kopi-cream text-kopi-espresso min-h-screen selection:bg-kopi-amber/20 selection:text-kopi-espresso">
        {children}
      </body>
    </html>
  );
}
