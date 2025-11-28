import { HashDisplay } from '@components/common/HashDisplay';
import { StatCard } from '@components/common/StatCard';
import { ExpandableTransactionCard } from '@components/transactions/ExpandableTransactionCard';
import { TransactionCard } from '@components/transactions/TransactionCard';
import { useRevealOnScroll } from '@hooks/useRevealOnScroll';
import { type BlockData, getBlock, getBlockHash } from '@services/rpc';
import { formatSize, formatTime, formatZEC, getBlockReward } from '@utils/formatters';
import { useEffect, useState } from 'react';
import type { RpcTransaction } from '../types/transaction';

interface BlockPageProps {
  blockId: string;
}

export function BlockPage({ blockId }: BlockPageProps) {
  const [block, setBlock] = useState<BlockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useRevealOnScroll();

  useEffect(() => {
    async function fetchBlock() {
      try {
        setLoading(true);
        let blockHash = blockId;

        // If blockId is a number (height), get the hash first
        if (/^\d+$/.test(blockId)) {
          blockHash = await getBlockHash(blockId);
        }

        // Fetch block with verbosity 2 (includes transaction data)
        const blockData = await getBlock(blockHash, 2);
        setBlock(blockData);
        setLoading(false);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching block:', err.message);
          setError(err.message);
        } else {
          console.error('Error fetching block:', err);
          setError('Failed to fetch block');
        }
        setLoading(false);
      }
    }

    fetchBlock();
  }, [blockId]);

  if (loading) {
    return (
      <div className="max-w-container mx-auto md:px-8 px-4 pt-[120px] pb-[120px] flex-1">
        <div className="mb-6 flex flex-row flex-wrap justify-between items-center gap-3">
          <a
            href="#/"
            className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
          >
            ← Back to Blocks
          </a>
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

        <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight skeleton-text">
          Block #---
        </h2>
        <HashDisplay hash="" isLoading={true} />

        {/* Skeleton stat cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-12 min-h-[160px]">
          <StatCard label="Block Height" value="---" description="Loading..." isLoading={true} />
          <StatCard label="Block Reward" value="---" description="ZEC" isLoading={true} />
          <StatCard label="Block Size" value="---" description="---" isLoading={true} />
        </div>

        {/* Skeleton transactions */}
        <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight skeleton-text">
          - Transactions
        </h2>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }, (_, index: number) => ({
            skeletonId: `skeleton-${index}-${Date.now()}`,
          })).map((skeleton) => (
            <TransactionCard key={skeleton.skeletonId} tx={{} as RpcTransaction} isLoading={true} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-container mx-auto md:px-8 px-4 pt-[120px] pb-[120px] flex-1">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Error: {error}
          <br />
          <a
            href="#/"
            className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.4)] text-foreground hover:border-accent hover:-translate-y-0.5 mt-5"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!block) {
    return (
      <div className="max-w-container mx-auto md:px-8 px-4 pt-[120px] pb-[120px] flex-1">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Block not found
        </div>
      </div>
    );
  }

  const totalTx = block.tx ? block.tx.length : 0;
  const reward = getBlockReward(block);

  return (
    <div className="max-w-container mx-auto px-8 pt-[120px] pb-[120px] flex-1">
      <div className="mb-6 flex flex-row flex-wrap justify-between items-center gap-3">
        <a
          href="#/"
          className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
        >
          ← Back to Blocks
        </a>
        <div className="flex gap-3">
          <a
            href={`#/block/${block.height - 1}`}
            className={`inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5 ${
              block.height <= 0 ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            ← Previous Block
          </a>
          <a
            href={`#/block/${block.height + 1}`}
            className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
          >
            Next Block →
          </a>
        </div>
      </div>

      <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight">
        Block #{block.height.toLocaleString()}
      </h2>
      <HashDisplay hash={block.hash} />

      {/* Block info cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-12 min-h-[160px]">
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
          value={block.size ? formatSize(block.size).split(' ')[0] : 'N/A'}
          description={block.size ? formatSize(block.size).split(' ')[1] : ''}
        />
      </div>

      {/* Transactions list */}
      <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight">
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
