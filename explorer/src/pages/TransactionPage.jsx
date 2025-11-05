import React, { useState, useEffect } from 'react';
import { getRawTransaction, getBlock } from '@services/rpc';
import { formatTime } from '@utils/formatters';
import { getTransactionKind } from '@utils/tx-parser';
import { TransactionDetails } from '@components/transactions/TransactionDetails';

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
        <code className="hash-display skeleton-text">
          ----------------------------------------------------------------
        </code>

        {/* Skeleton block info cards */}
        <div className="stats-grid" style={{ marginBottom: '48px' }}>
          <div className="stat-card skeleton">
            <span className="stat-label skeleton-text">Block Height</span>
            <div className="stat-value skeleton-text" style={{ fontSize: '1.8rem' }}>---</div>
            <div className="stat-description skeleton-text">Loading...</div>
          </div>

          <div className="stat-card skeleton">
            <span className="stat-label skeleton-text">Block Hash</span>
            <div className="stat-value skeleton-text" style={{ fontSize: '1.2rem' }}>--------------</div>
          </div>

          <div className="stat-card skeleton">
            <span className="stat-label skeleton-text">Block Time</span>
            <div className="stat-value skeleton-text" style={{ fontSize: '1.8rem' }}>---</div>
            <div className="stat-description skeleton-text">Loading...</div>
          </div>
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
      <code className="hash-display">{tx.txid}</code>

      {/* Block info cards */}
      {block && (
        <div className="stats-grid" style={{ marginBottom: '48px' }}>
          <div className="stat-card">
            <span className="stat-label">Block Height</span>
            <div className="stat-value" style={{ fontSize: '1.8rem' }}>{block.height.toLocaleString()}</div>
            <div className="stat-description">{formatTime(block.time)}</div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Block Hash</span>
            <code className="stat-value" style={{ fontSize: '1rem', wordBreak: 'break-all' }}>{block.hash}</code>
          </div>

          <div className="stat-card">
            <span className="stat-label">Confirmations</span>
            <div className="stat-value" style={{ fontSize: '1.8rem' }}>{tx.confirmations || 0}</div>
            <div className="stat-description">Blocks</div>
          </div>
        </div>
      )}

      {/* Transaction Details */}
      <h2 className="section-title">Transaction Details</h2>
      <TransactionDetails tx={tx} txKind={txKind} />
    </div>
  );
}
