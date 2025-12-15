import '@/app/globals.css';

import { Footer } from '@/components/common/Footer';
import { Header } from '@/components/common/Header';
import { QueryProvider } from '@/providers/query-provider';
import { ZtarknetProvider } from '@/providers/ztarknet-provider';
import type { Metadata } from 'next';
import { FlickeringGridBackground } from './flickering-grid-background';

export const metadata: Metadata = {
  title: 'Ztarknet Wallet',
  description:
    'Deploy Ztarknet accounts/wallets, manage and send funds, and interact with Ztarknet',
  icons: {
    icon: [
      { url: '/social/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/social/favicon_hq.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/social/apple_touch_icon.png',
    other: [
      { rel: 'icon', url: '/social/android_chrome.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  metadataBase: new URL('https://wallet.ztarknet.cash'),
  openGraph: {
    title: 'Ztarknet Wallet',
    description:
      'Deploy Ztarknet accounts/wallets, manage and send funds, and interact with Ztarknet',
    type: 'website',
    siteName: 'Ztarknet Wallet',
    images: [
      {
        url: '/social/og_image.png',
        width: 1200,
        height: 630,
        alt: 'Ztarknet Wallet - Secure Web Wallet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ztarknet Wallet',
    description:
      'Deploy Ztarknet accounts/wallets, manage and send funds, and interact with Ztarknet',
    images: ['/social/twitter_card_large.png'],
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
          <ZtarknetProvider>
            <FlickeringGridBackground />
            <div className="flex-1 flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 pt-24">{children}</main>
              <Footer />
            </div>
          </ZtarknetProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
