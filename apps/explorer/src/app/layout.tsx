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
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  metadataBase: new URL('https://explorer.ztarknet.cash'),
  openGraph: {
    title: 'Ztarknet Explorer',
    description: 'Explore blocks, transactions, and accounts on the Ztarknet blockchain',
    type: 'website',
    siteName: 'Ztarknet Explorer',
    images: [
      {
        url: '/social.png',
        width: 1200,
        height: 630,
        alt: 'Ztarknet Explorer - Blockchain Explorer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ztarknet Explorer',
    description: 'Explore blocks, transactions, and accounts on the Ztarknet blockchain',
    images: ['/social.png'],
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
