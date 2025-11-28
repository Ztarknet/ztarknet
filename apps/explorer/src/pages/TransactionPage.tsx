import { HashDisplay } from '@components/common/HashDisplay';
import { StatCard } from '@components/common/StatCard';
import { TransactionDetails } from '@components/transactions/TransactionDetails';
import { useRevealOnScroll } from '@hooks/useRevealOnScroll';
import { type BlockData, getBlock, getRawTransaction } from '@services/rpc';
import { formatTime } from '@utils/formatters';
import { getTransactionKind } from '@utils/tx-parser';
import { type CSSProperties, useEffect, useState } from 'react';
import type { RpcTransaction, Transaction, TransactionKind } from '../types/transaction';

interface TransactionPageProps {
  txid: string;
}

export function TransactionPage({ txid }: TransactionPageProps) {
  const [tx, setTx] = useState<Transaction | null>(null);
  const [block, setBlock] = useState<BlockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useRevealOnScroll();

  useEffect(() => {
    async function fetchTransaction() {
      try {
        setLoading(true);
        setError(null);

        // Get transaction details
        const txData = await getRawTransaction(txid);
        setTx(txData);

        // Get block details if transaction is in a block
        if (typeof txData !== 'string' && txData.blockhash) {
          const blockData = await getBlock(txData.blockhash);
          setBlock(blockData);
        }

        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch transaction');
        }
        setLoading(false);
      }
    }

    fetchTransaction();
  }, [txid]);

  if (loading) {
    return (
      <div className="container-custom section-padding flex-1 w-full">
        <div className="mb-6 flex flex-row gap-3 w-full">
          <a
            href="#/"
            className="w-fit inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
          >
            ← Back to Blocks
          </a>
        </div>

        {/* Skeleton title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="skeleton-line skeleton-line-lg w-40" />
          <div className="skeleton-line w-20 h-6" />
        </div>

        {/* Skeleton hash */}
        <div className="skeleton-box p-4 mb-8">
          <div className="skeleton-line w-full" />
        </div>

        {/* Skeleton block info cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 min-h-40">
          <StatCard label="Block Height" value="---" description="Loading..." isLoading={true} />
          <StatCard label="Block Hash" value="--------------" description="" isLoading={true} />
          <StatCard label="Confirmations" value="---" description="Loading..." isLoading={true} />
        </div>

        {/* Skeleton transaction details title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="skeleton-line skeleton-line-lg w-56" />
        </div>

        {/* Skeleton transaction details */}
        <div className="skeleton-box p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="skeleton-line skeleton-line-sm w-16" />
              <div className="skeleton-box p-4">
                <div className="flex flex-col gap-3">
                  <div className="skeleton-line w-full" />
                  <div className="skeleton-line skeleton-line-sm w-24" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="skeleton-line skeleton-line-sm w-20" />
              <div className="skeleton-box p-4">
                <div className="flex flex-col gap-3">
                  <div className="skeleton-line w-full" />
                  <div className="skeleton-line skeleton-line-sm w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom section-padding flex-1 w-full">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Error: {error}
          <br />
          <a
            href="#/"
            className="w-fit inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.4)] text-foreground hover:border-accent hover:-translate-y-0.5 mt-5"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="container-custom section-padding flex-1 w-full">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Transaction not found
        </div>
      </div>
    );
  }

  const txKind = getTransactionKind(tx as RpcTransaction);

  const TX_KIND_STYLES: Record<TransactionKind, string> = {
    coinbase: 'bg-[#f5a623] text-[#0a0a0e]',
    tze: 'bg-[#16a085] text-white',
    standard: 'bg-accent text-background',
  };

  const valueStyle: CSSProperties = {
    fontSize: '1rem',
    wordBreak: 'break-all',
  };

  return (
    <div className="container-custom section-padding flex-1 w-full">
      <div className="mb-6 flex flex-row gap-3 w-full">
        <a
          href="#/"
          className="w-fit inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
        >
          ← Back to Blocks
        </a>
        {block && (
          <a
            href={`#/block/${block.hash}`}
            className="w-fit inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
          >
            View Block
          </a>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <h2 className="heading-section m-0">Transaction</h2>
        <span className={`badge font-bold ${TX_KIND_STYLES[txKind] || TX_KIND_STYLES.standard}`}>
          {txKind}
        </span>
      </div>
      <HashDisplay hash={tx.txid} />

      {/* Block info cards */}
      {block && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 min-h-40">
          <StatCard
            label="Block Height"
            value={block.height.toLocaleString()}
            description={formatTime(block.time)}
          />
          <StatCard
            label="Block Hash"
            value={block.hash}
            description=""
            renderAsCode={true}
            valueStyle={valueStyle}
          />
          <StatCard label="Confirmations" value={tx.confirmations || 0} description="Blocks" />
        </div>
      )}

      {/* Transaction Details */}
      <h2 className="heading-section mb-6">Transaction Details</h2>
      <TransactionDetails tx={tx as RpcTransaction} txKind={txKind} />
    </div>
  );
}
