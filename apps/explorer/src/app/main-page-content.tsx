'use client';

import { BlocksList } from '@/components/blocks/BlocksList';
import { StatCard } from '@/components/common/StatCard';
import { TransactionsList } from '@/components/transactions/TransactionsList';
import { useChainHeight } from '@/hooks/queries';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { RPC_ENDPOINT } from '@/services/rpc';
import { GlowingEffect } from '@workspace/ui/components/glowing-effect';

const MAX_BLOCKS = 7;

export function MainPageContent() {
  const { data: chainHeight, isLoading: loading, error } = useChainHeight();
  useRevealOnScroll();

  return (
    <div className="container-custom section-padding flex-1">
      {error && (
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Error: {error instanceof Error ? error.message : 'Unknown error'}
          <br />
          Make sure the RPC endpoint is accessible.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 min-h-40">
        <StatCard
          label="Chain Height"
          value={chainHeight?.toLocaleString() ?? '---'}
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
        <h2 className="heading-section mb-6">Latest Blocks</h2>
        <BlocksList initialBlocks={MAX_BLOCKS} />
      </section>

      <section id="latest-transactions" className="mb-12">
        <h2 className="heading-section mb-6">Latest Transactions</h2>
        <TransactionsList />
      </section>

      <section id="developer-info">
        <div className="group relative rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-2 md:rounded-3xl md:p-3 transition-all duration-300">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(12,12,18,0.9)] to-[rgba(6,6,9,0.8)] p-6 md:p-8 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl mb-5 text-foreground font-bold">Developer Information</h2>

              <div className="mb-5">
                <span className="eyebrow mb-2">RPC Endpoint</span>
                <div className="text-base font-mono text-foreground break-all leading-relaxed">
                  <code className="bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded text-accent">
                    {RPC_ENDPOINT}
                  </code>
                </div>
              </div>

              <div className="mb-5">
                <span className="eyebrow mb-2">Default Miner Address</span>
                <div className="text-base text-[rgba(255,255,255,0.7)] break-all leading-relaxed">
                  Use the default mnemonic to claim coinbase rewards. This serves as a faucet for
                  developers testing on the network. All miners use the same coinbase address by
                  default, allowing you to claim rewards using the shared mnemonic phrase.
                </div>
              </div>

              <div className="mb-0">
                <span className="eyebrow mb-2">Network Type</span>
                <div className="text-base text-[rgba(255,255,255,0.7)] break-all leading-relaxed">
                  <code className="bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded text-accent">
                    regtest
                  </code>{' '}
                  - Regression test network for development
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
