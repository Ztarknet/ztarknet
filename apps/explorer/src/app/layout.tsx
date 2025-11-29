import '@/app/globals.css';

import { Footer } from '@/components/common/Footer';
import { Header } from '@/components/common/Header';
import { QueryProvider } from '@/providers/query-provider';
import type { Metadata } from 'next';
import { FlickeringGridBackground } from './flickering-grid-background';

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
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ibz2aiz.css" />
      </head>
      <body>
        <QueryProvider>
          <FlickeringGridBackground />
          <div className="flex-1 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
