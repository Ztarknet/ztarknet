import React, { useState, useEffect } from 'react';
import { getRawTransaction, getBlock } from '@services/rpc';
import { formatTime } from '@utils/formatters';
import { getTransactionKind } from '@utils/tx-parser';
import { TransactionDetails } from '@components/transactions/TransactionDetails';
import { HashDisplay } from '@components/common/HashDisplay';
import { StatCard } from '@components/common/StatCard';

export function TransactionPage({ txid }) {
  const [tx, setTx] = useState(null);
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="explorer-container">
        <div style={{ marginBottom: '24px' }}>
          <a href="#/" className="button ghost">← Back to Blocks</a>
        </div>

        <h2 className="section-title skeleton-text">Transaction</h2>
        <HashDisplay isLoading={true} />

        {/* Skeleton block info cards */}
        <div className="stats-grid" style={{ marginBottom: '48px' }}>
          <StatCard label="Block Height" value="---" description="Loading..." isLoading={true} />
          <StatCard label="Block Hash" value="--------------" description="" isLoading={true} />
          <StatCard label="Block Time" value="---" description="Loading..." isLoading={true} />
        </div>

        <h2 className="section-title skeleton-text">Transaction Details</h2>
        <div className="tx-expanded skeleton" style={{ marginTop: '24px' }}>
          <div className="skeleton-text">Loading transaction data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="explorer-container">
        <div className="error">
          Error: {error}
          <br />
          <a href="#/" className="button secondary" style={{ marginTop: '20px', display: 'inline-flex' }}>
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="explorer-container">
        <div className="error">Transaction not found</div>
      </div>
    );
  }

  const txKind = getTransactionKind(tx);

  return (
    <div className="explorer-container">
      <div style={{ marginBottom: '24px' }}>
        <a href="#/" className="button ghost">← Back to Blocks</a>
        {block && (
          <a href={`#/block/${block.hash}`} className="button ghost" style={{ marginLeft: '12px' }}>
            View Block
          </a>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Transaction</h2>
        <span className="tx-kind" data-kind={txKind}>{txKind}</span>
      </div>
      <HashDisplay hash={tx.txid} />

      {/* Block info cards */}
      {block && (
        <div className="stats-grid" style={{ marginBottom: '48px' }}>
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
      <h2 className="section-title">Transaction Details</h2>
      <TransactionDetails tx={tx} txKind={txKind} />
    </div>
  );
}
