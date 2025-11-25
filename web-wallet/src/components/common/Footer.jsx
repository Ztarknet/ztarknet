import React from 'react';

export function Footer() {
  return (
    <footer className="shrink-0 mt-auto pt-4 pb-4 px-4 bg-[#020204] border-t border-[rgba(255,137,70,0.18)]">
      <div className="max-w-container mx-auto flex items-center justify-between gap-4 text-[rgba(204,204,216,0.75)] text-[0.95rem]">
        <p>
          Built by cypherpunks, for cypherpunks.
          <span className="ml-1.5">🛡️🐺</span>
        </p>
        <a href="mailto:ztarknet@proton.me" className="text-[rgba(255,137,70,0.75)] font-mono">
          ztarknet@proton.me
        </a>
      </div>
    </footer>
  );
}
