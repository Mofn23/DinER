import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'DinER - Mobile Expense Tracker',
  description: 'Pixel-perfect, ultra-fast personal finance app.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DinER',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B0B0D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#000000] text-[#F5F5F7] antialiased">
        {/* Desktop Framed Container */}
        <div className="app-frame">
          {children}
        </div>
      </body>
    </html>
  );
}
