import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ztarknet — Starknet L2 anchored to Zcash',
  description:
    'Ztarknet is a cypherpunk proof-of-concept exploring a Starknet-style Layer 2 that settles on Zcash via a Transparent Zcash Extension (TZE) verifier for Circle STARK proofs.',
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
  keywords: [
    'Ztarknet',
    'Starknet',
    'Zcash',
    'Circle STARK',
    'Transparent Zcash Extension',
    'validity rollup',
    'Cairo',
    'Madara',
    'zero-knowledge proofs',
  ],
  authors: [{ name: 'Ztarknet contributors' }],
  creator: 'Ztarknet contributors',
  publisher: 'Ztarknet',
  robots: 'index, follow, max-image-preview:large',
  metadataBase: new URL('https://ztarknet.xyz'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ztarknet.xyz/',
    siteName: 'Ztarknet',
    title: 'Ztarknet — Starknet L2 anchored to Zcash',
    description:
      'Cypherpunk PoC bringing Starknet execution, Circle STARK proofs, and Zcash settlement together through a native TZE verifier.',
    images: [
      {
        url: '/social/og_image.png',
        width: 1200,
        height: 630,
        alt: 'Ztarknet - Starknet L2 anchored to Zcash',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ztarknet — Starknet L2 anchored to Zcash',
    description:
      'Explore the Starknet-on-Zcash PoC: Cairo execution, Circle STARK proofs, and a TZE verifier bringing programmable privacy to life.',
    images: ['/social/twitter_card_large.png'],
  },
  other: {
    'ai:summary':
      'Ztarknet is an experimental Starknet-style Layer 2 that executes Cairo, proves transitions with Circle STARKs, and settles roots on Zcash via a Transparent Zcash Extension verifier.',
    'ai:keywords':
      'Ztarknet, Starknet L2, Zcash rollup, Circle STARK verifier, Cairo execution, privacy-preserving scalability, zero-knowledge proofs',
    'ai:angles':
      'cypherpunk scalability, privacy-native rollups, Zcash programmability, Circle STARK verification on-chain',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ff6b1a" />
        <link rel="canonical" href="https://ztarknet.xyz/" />
        <link rel="stylesheet" href="https://use.typekit.net/ibz2aiz.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
