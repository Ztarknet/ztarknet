import { FlickeringGrid } from '@workspace/ui/components/flickering-grid';
import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ztarknet — Starknet L2 anchored to Zcash',
  description:
    'Ztarknet is a cypherpunk proof-of-concept exploring a Starknet-style Layer 2 that settles on Zcash via a Transparent Zcash Extension (TZE) verifier for Circle STARK proofs.',
  icons: {
    icon: '/ztarknet-logo.png',
    apple: '/ztarknet-logo.png',
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
        url: 'https://raw.githubusercontent.com/AbdelStark/ztarknet/main/misc/img/ztarknet-logo.png',
        width: 1200,
        height: 630,
        alt: 'Ztarknet logo on a dark neon background',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ztarknet — Starknet L2 anchored to Zcash',
    description:
      'Explore the Starknet-on-Zcash PoC: Cairo execution, Circle STARK proofs, and a TZE verifier bringing programmable privacy to life.',
    images: [
      'https://raw.githubusercontent.com/AbdelStark/ztarknet/main/misc/img/ztarknet-logo.png',
    ],
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
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="theme-color" content="#ff6b1a" />
        <link rel="canonical" href="https://ztarknet.xyz/" />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <FlickeringGrid
          className="fixed top-0 left-0 w-full h-[100vh] z-[-2] pointer-events-none [mask-image:linear-gradient(to_bottom,white_0%,white_50%,transparent_100%)]"
          squareSize={4}
          gridGap={6}
          color="#ff6b1a"
          maxOpacity={0.2}
          flickerChance={0.1}
        />
        {children}
      </body>
    </html>
  );
}
