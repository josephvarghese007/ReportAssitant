import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { BottomNav } from '@/components/layout/BottomNav';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'BusTech Engineering · Bus PDI Road Test',
  description: 'Chassis Level-2 Pre-Delivery Inspection Road Test Tool',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'PDI Test' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    { color: '#2563eb' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased bg-slate-50 dark:bg-slate-900 min-h-screen`}>
        <ThemeProvider>
          <main className="pb-28">{children}</main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
