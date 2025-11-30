'use client';

import { HashDisplay } from '@/components/common/HashDisplay';
import { StatCard } from '@/components/common/StatCard';
import { ExpandableTransactionCard } from '@/components/transactions/ExpandableTransactionCard';
import { useBlock } from '@/hooks/queries';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import type { RpcTransaction } from '@/types/transaction';
import { formatSize, formatTime, formatZEC, getBlockReward } from '@/utils/formatters';
import Link from 'next/link';

interface BlockPageContentProps {
  blockId: string;
}

export function BlockPageContent({ blockId }: BlockPageContentProps) {
  const { data: block, isLoading: loading, error } = useBlock(blockId);
  useRevealOnScroll();

  if (loading) {
    return (
      <div className="container-custom section-padding flex-1 w-full">
        <div className="mb-6 flex flex-row flex-wrap justify-between items-center gap-3 w-full">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
          >
            ← Back to Blocks
          </Link>
          <div className="flex gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground opacity-50"
              disabled
            >
              ← Previous Block
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground opacity-50"
              disabled
            >
              Next Block →
            </button>
          </div>
        </div>

        {/* Skeleton title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="skeleton-line skeleton-line-lg w-48" />
        </div>

        {/* Skeleton hash */}
        <div className="skeleton-box p-4 mb-8">
          <div className="skeleton-line w-full" />
        </div>

        {/* Skeleton stat cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 min-h-40">
          <StatCard label="Block Height" value="---" description="Loading..." isLoading={true} />
          <StatCard label="Block Reward" value="---" description="ZEC" isLoading={true} />
          <StatCard label="Block Size" value="---" description="---" isLoading={true} />
        </div>

        {/* Skeleton transactions title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="skeleton-line skeleton-line-lg w-56" />
        </div>

        {/* Skeleton transactions */}
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="skeleton-box p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="skeleton-line w-20" />
                  <div className="skeleton-line flex-1" />
                </div>
                <div className="flex gap-6">
                  <div className="skeleton-line skeleton-line-sm w-16" />
                  <div className="skeleton-line skeleton-line-sm w-16" />
                  <div className="skeleton-line skeleton-line-sm w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom section-padding flex-1 w-full">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6 w-full">
          Error: {error instanceof Error ? error.message : 'Unknown error'}
          <br />
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.4)] text-foreground hover:border-accent hover:-translate-y-0.5 mt-5"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!block) {
    return (
      <div className="container-custom section-padding flex-1">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Block not found
        </div>
      </div>
    );
  }

  const totalTx = block.tx ? block.tx.length : 0;
  const reward = getBlockReward(block);

  return (
    <div className="container-custom section-padding flex-1 w-full">
      <div className="mb-6 flex flex-row flex-wrap justify-between items-center gap-3 w-full">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
        >
          ← Back to Blocks
        </Link>
        <div className="flex gap-3">
          <Link
            href={`/block/${block.height - 1}`}
            className={`inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5 ${
              block.height <= 0 ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            ← Previous Block
          </Link>
          <Link
            href={`/block/${block.height + 1}`}
            className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
          >
            Next Block →
          </Link>
        </div>
      </div>

      <h2 className="heading-section mb-6">Block #{block.height.toLocaleString()}</h2>
      <HashDisplay hash={block.hash} />

      {/* Block info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 min-h-40">
        <StatCard
          label="Block Height"
          value={block.height.toLocaleString()}
          description={formatTime(block.time)}
        />
        <StatCard
          label="Block Reward"
          value={reward !== null ? formatZEC(reward) : 'N/A'}
          description="ZEC"
        />
        <StatCard
          label="Block Size"
          value={block.size ? (formatSize(block.size).split(' ')[0] ?? 'N/A') : 'N/A'}
          description={block.size ? (formatSize(block.size).split(' ')[1] ?? '') : ''}
        />
      </div>

      {/* Transactions list */}
      <h2 className="heading-section mb-6">
        {totalTx} Transaction{totalTx !== 1 ? 's' : ''}
      </h2>
      <div className="flex flex-col gap-4">
        {block.tx?.map((tx: unknown, index: number) => {
          const transaction = tx as RpcTransaction;
          return (
            <ExpandableTransactionCard
              key={transaction.txid || index}
              tx={transaction}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}
