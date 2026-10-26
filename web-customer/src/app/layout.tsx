import type { Metadata, Viewport } from 'next';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#2B170B',
};

export const metadata: Metadata = {
  title: 'KOPI KITA - Artisanal Web Order',
  description: 'Pesan kopi artisanal, pour over & bakery langsung tanpa antre di KOPI KITA Roastery & Slow Bar',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.svg',
    apple: '/images/12_logo_kopi_kita.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-kopi-sand/50 text-kopi-espresso flex justify-center selection:bg-kopi-amber/20">
        {/* Mobile Viewport Container (max-width 480px centered on desktop) */}
        <div className="w-full max-w-[480px] min-h-screen bg-kopi-canvas relative shadow-warm-xl border-x border-kopi-border/60 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
