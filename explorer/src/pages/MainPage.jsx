import React from 'react';
import { useChainHeight } from '@hooks/useBlockPolling';
import { useRevealOnScroll } from '@hooks/useRevealOnScroll';
import { RPC_ENDPOINT } from '@services/rpc';
import { StatCard } from '@components/common/StatCard';
import { BlocksList } from '@components/blocks/BlocksList';
import { TransactionsList } from '@components/transactions/TransactionsList.tsx';

const MAX_BLOCKS = 7;

export function MainPage() {
  const { chainHeight, loading, error } = useChainHeight();
  useRevealOnScroll();

  return (
    <div className="max-w-container mx-auto md:px-8 px-4 pt-[120px] pb-[120px] flex-1">
      {error && (
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Error: {error}
          <br />
          Make sure the RPC endpoint is accessible.
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-12 min-h-[160px]">
        <StatCard
          label="Chain Height"
          value={chainHeight.toLocaleString()}
          description="Total blocks mined"
          isLoading={loading}
        />
        <StatCard
          label="Network Upgrade"
          value="ZFuture"
          description="Latest protocol version"
          isLoading={loading}
        />
        <StatCard
          label="Transaction Version"
          value="V6"
          description="Current tx format"
          isLoading={loading}
        />
      </div>

      <section id="latest-blocks" className="mb-12">
        <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight">Latest Blocks</h2>
        <BlocksList initialBlocks={MAX_BLOCKS} />
      </section>

      <section id="latest-transactions" className="mb-12">
        <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight">Latest Transactions</h2>
        <TransactionsList />
      </section>

      <section id="developer-info">
        <div className="p-8 rounded-2xl border border-[rgba(255,137,70,0.3)] shadow-[0_20px_45px_rgba(0,0,0,0.35)]" style={{
          background: 'radial-gradient(circle at top left, rgba(255, 107, 26, 0.12), rgba(5, 5, 7, 0.95)), rgba(10, 10, 14, 0.9)'
        }}>
          <h2 className="text-[1.6rem] mb-5 text-foreground">Developer Information</h2>

          <div className="mb-5">
            <span className="block text-[0.85rem] font-mono uppercase tracking-widest text-[rgba(255,137,70,0.7)] mb-2">RPC Endpoint</span>
            <div className="text-base font-mono text-foreground break-all leading-relaxed">
              <code className="bg-black/40 px-2 py-0.5 rounded text-accent-strong">{RPC_ENDPOINT}</code>
            </div>
          </div>

          <div className="mb-5">
            <span className="block text-[0.85rem] font-mono uppercase tracking-widest text-[rgba(255,137,70,0.7)] mb-2">Default Miner Address</span>
            <div className="text-base font-mono text-foreground break-all leading-relaxed">
              Use the default mnemonic to claim coinbase rewards. This serves as a faucet for developers
              testing on the network. All miners use the same coinbase address by default, allowing you
              to claim rewards using the shared mnemonic phrase.
            </div>
          </div>

          <div className="mb-0">
            <span className="block text-[0.85rem] font-mono uppercase tracking-widest text-[rgba(255,137,70,0.7)] mb-2">Network Type</span>
            <div className="text-base font-mono text-foreground break-all leading-relaxed">
              <code className="bg-black/40 px-2 py-0.5 rounded text-accent-strong">regtest</code> - Regression test network for development
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
