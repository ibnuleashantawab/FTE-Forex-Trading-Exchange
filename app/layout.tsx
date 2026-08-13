import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'FTE - Forex Trading Exchange Platform',
  description: 'Online investment and trading-performance management platform. Earn daily 0.60% trading profit, Level-1 referral generation bonus, and team volume milestone rewards.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-obsidian-950 text-gray-100 antialiased selection:bg-gold-500/30 selection:text-gold-200">
        <Navigation>{children}</Navigation>
      </body>
    </html>
  );
};
