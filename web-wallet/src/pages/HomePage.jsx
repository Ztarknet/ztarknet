import React from 'react';

export function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-8">
      <div className="max-w-container mx-auto w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
          Ztarknet Web Wallet
        </h1>
        <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto">
          Secure wallet for managing your Ztarknet accounts, sending funds, and interacting with the Ztarknet ecosystem.
        </p>
      </div>
    </main>
  );
}
