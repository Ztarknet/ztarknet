import React, { useState, useEffect } from 'react';
import { getRawTransaction, getBlock } from '@services/rpc';
import { formatTime } from '@utils/formatters';
import { getTransactionKind } from '@utils/tx-parser';
import { TransactionDetails } from '@components/transactions/TransactionDetails';
import { HashDisplay } from '@components/common/HashDisplay';
import { StatCard } from '@components/common/StatCard';
import { useRevealOnScroll } from '@hooks/useRevealOnScroll';

export function TransactionPage({ txid }) {
  const [tx, setTx] = useState(null);
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        if (txData.blockhash) {
          const blockData = await getBlock(txData.blockhash);
          setBlock(blockData);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchTransaction();
  }, [txid]);

  if (loading) {
    return (
      <div className="max-w-container mx-auto md:px-8 px-4 pt-[120px] pb-[120px] flex-1">
        <div className="mb-6 flex flex-row gap-3">
          <a href="#/" className="w-fit inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5">← Back to Blocks</a>
        </div>

        <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight skeleton-text">Transaction</h2>
        <HashDisplay isLoading={true} />

        {/* Skeleton block info cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-12 min-h-[160px]">
          <StatCard label="Block Height" value="---" description="Loading..." isLoading={true} />
          <StatCard label="Block Hash" value="--------------" description="" isLoading={true} />
          <StatCard label="Block Time" value="---" description="Loading..." isLoading={true} />
        </div>

        <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight skeleton-text">Transaction Details</h2>
        <div className="p-6 bg-[rgba(8,8,12,0.9)] border border-[rgba(255,137,70,0.15)] rounded-xl mt-6 skeleton">
          <div className="skeleton-text">Loading transaction data...</div>
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
          <a href="#/" className="w-fit inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.4)] text-foreground hover:border-accent hover:-translate-y-0.5 mt-5">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="max-w-container mx-auto md:px-8 px-4 pt-[120px] pb-[120px] flex-1">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">Transaction not found</div>
      </div>
    );
  }

  const txKind = getTransactionKind(tx);

  const TX_KIND_STYLES = {
    coinbase: 'bg-[#f5a623] text-[#0a0a0e]',
    tze: 'bg-[#16a085] text-white',
    standard: 'bg-accent text-background'
  };

  return (
    <div className="max-w-container mx-auto px-8 pt-[120px] pb-[120px] flex-1">
      <div className="mb-6 flex flex-row gap-3">
        <a href="#/" className="w-fit inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5">← Back to Blocks</a>
        {block && (
          <a href={`#/block/${block.hash}`} className="w-fit inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5">
            View Block
          </a>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-[1.8rem] font-bold text-foreground tracking-tight m-0">Transaction</h2>
        <span className={`text-[0.65rem] font-mono uppercase tracking-wider font-bold whitespace-nowrap min-w-[80px] text-center inline-block py-1 px-2.5 rounded ${TX_KIND_STYLES[txKind] || TX_KIND_STYLES.standard}`}>
          {txKind}
        </span>
      </div>
      <HashDisplay hash={tx.txid} />

      {/* Block info cards */}
      {block && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-12 min-h-[160px]">
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
            valueStyle={{ fontSize: '1rem', wordBreak: 'break-all' }}
          />
          <StatCard
            label="Confirmations"
            value={tx.confirmations || 0}
            description="Blocks"
          />
        </div>
      )}

      {/* Transaction Details */}
      <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight">Transaction Details</h2>
      <TransactionDetails tx={tx} txKind={txKind} />
    </div>
  );
}
