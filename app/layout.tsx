import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AutoSplash',
  description: 'Tu auto, siempre reluciente.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div
            className="w-full max-w-[430px] min-h-screen bg-white overflow-hidden relative md:rounded-[2.5rem] md:min-h-[820px] md:max-h-[820px]"
            style={{ boxShadow: '0 24px 64px rgba(0, 0, 0, 0.35)' }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
