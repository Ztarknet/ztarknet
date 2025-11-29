import '@/app/globals.css';

import { Header } from '@/components/common/Header';
import { QueryProvider } from '@/providers/query-provider';
import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { FlickeringGridBackground } from './flickering-grid-background';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ztarknet Explorer',
  description: 'Explore blocks, transactions, and accounts on the Ztarknet blockchain',
  icons: {
    icon: '/ztarknet-logo.png',
  },
  openGraph: {
    title: 'Ztarknet Explorer',
    description: 'Explore blocks, transactions, and accounts on the Ztarknet blockchain',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        <QueryProvider>
          <FlickeringGridBackground />
          <div className="flex-1 flex flex-col min-h-screen">
            <Header />
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
