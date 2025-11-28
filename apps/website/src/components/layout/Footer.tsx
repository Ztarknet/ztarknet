import Link from 'next/link';
import React from 'react';

export function Footer() {
  return (
    <footer className="py-12 px-8 pb-20 bg-[#020204] border-t border-[rgba(255,137,70,0.18)]">
      <div className="max-w-container mx-auto flex items-center justify-between gap-4 text-[rgba(204,204,216,0.75)] text-base">
        <p>
          Built by cypherpunks, for cypherpunks.
          <span className="ml-1.5">🛡️🐺</span>
        </p>
        <Link
          href="mailto:ztarknet@proton.me"
          className="text-[rgba(255,137,70,0.75)] font-mono hover:text-[var(--accent)] transition-colors"
        >
          ztarknet@proton.me
        </Link>
      </div>
    </footer>
  );
}
