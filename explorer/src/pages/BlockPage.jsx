import React, { useState, useEffect } from 'react';
import { getBlockHash, getBlock } from '@services/rpc';
import { formatTime, formatSize, formatZEC, getBlockReward } from '@utils/formatters';
import { getTransactionKind, getTransactionStats } from '@utils/tx-parser';
import { TransactionCard } from '@components/transactions/TransactionCard';
import { TransactionIOView } from '@components/transactions/TransactionIOView';
import { TZEDetailsView } from '@components/transactions/TZEDetailsView';

export function BlockPage({ blockId }) {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTx, setExpandedTx] = useState(null);

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
      } catch (err) {
        console.error('Error fetching block:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchBlock();
  }, [blockId]);

  if (loading) {
    return (
      <div className="explorer-container">
        <div style={{ marginBottom: '24px' }}>
          <a href="#/" className="button ghost">← Back to Blocks</a>
        </div>

        <h2 className="section-title skeleton-text">Block #---</h2>
        <code className="hash-display skeleton-text">
          ----------------------------------------------------------------
        </code>

        {/* Skeleton stat cards */}
        <div className="stats-grid" style={{ marginBottom: '48px' }}>
          <div className="stat-card skeleton">
            <span className="stat-label skeleton-text">Block Height</span>
            <div className="stat-value skeleton-text" style={{ fontSize: '1.8rem' }}>---</div>
            <div className="stat-description skeleton-text">Loading...</div>
          </div>

          <div className="stat-card skeleton">
            <span className="stat-label skeleton-text">Block Reward</span>
            <div className="stat-value skeleton-text zec-value" style={{ fontSize: '1.8rem' }}>---</div>
            <div className="stat-description skeleton-text">ZEC</div>
          </div>

          <div className="stat-card skeleton">
            <span className="stat-label skeleton-text">Block Size</span>
            <div className="stat-value skeleton-text size-value" style={{ fontSize: '1.8rem' }}>---</div>
            <div className="stat-description skeleton-text">---</div>
          </div>
        </div>

        {/* Skeleton transactions */}
        <h2 className="section-title skeleton-text">- Transactions</h2>
        <div className="transactions-container">
          {Array.from({ length: 3 }).map((_, index) => (
            <TransactionCard key={index} tx={null} isLoading={true} />
          ))}
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

  if (!block) {
    return (
      <div className="explorer-container">
        <div className="error">Block not found</div>
      </div>
    );
  }

  const totalTx = block.tx ? block.tx.length : 0;
  const reward = getBlockReward(block);

  return (
    <div className="explorer-container">
      <div style={{ marginBottom: '24px' }}>
        <a href="#/" className="button ghost">← Back to Blocks</a>
      </div>

      <h2 className="section-title">Block #{block.height.toLocaleString()}</h2>
      <code className="hash-display">{block.hash}</code>

      {/* Block info cards */}
      <div className="stats-grid" style={{ marginBottom: '48px' }}>
        <div className="stat-card">
          <span className="stat-label">Block Height</span>
          <div className="stat-value" style={{ fontSize: '1.8rem' }}>{block.height.toLocaleString()}</div>
          <div className="stat-description">{formatTime(block.time)}</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Block Reward</span>
          <div className="stat-value zec-value" style={{ fontSize: '1.8rem' }}>{reward !== null ? formatZEC(reward) : 'N/A'}</div>
          <div className="stat-description">ZEC</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Block Size</span>
          <div className="stat-value size-value" style={{ fontSize: '1.8rem' }}>
            {block.size ? formatSize(block.size).split(' ')[0] : 'N/A'}
          </div>
          <div className="stat-description">{block.size ? formatSize(block.size).split(' ')[1] : ''}</div>
        </div>
      </div>

      {/* Transactions list */}
      <h2 className="section-title">{totalTx} Transaction{totalTx !== 1 ? 's' : ''}</h2>
      <div className="transactions-container">
        {block.tx && block.tx.map((tx, index) => {
          const { numInputs, numOutputs, totalOutput } = getTransactionStats(tx);
          const txKind = getTransactionKind(tx);
          const isExpanded = expandedTx === tx.txid;

          return (
            <div key={tx.txid || index} className="tx-card-wrapper">
              <div
                className="tx-card"
                onClick={() => setExpandedTx(isExpanded ? null : tx.txid)}
                style={{ cursor: 'pointer' }}
              >
                <span className="tx-kind" data-kind={txKind}>{txKind}</span>
                <code className="tx-hash" title={tx.txid}>{tx.txid}</code>
                <div className="tx-detail">
                  <span className="tx-detail-label">Inputs</span>
                  <span className="tx-detail-value">{numInputs}</span>
                </div>
                <div className="tx-detail">
                  <span className="tx-detail-label">Outputs</span>
                  <span className="tx-detail-value">{numOutputs}</span>
                </div>
                <div className="tx-detail">
                  <span className="tx-detail-label">Total Output</span>
                  <span className="tx-detail-value zec-value">{formatZEC(totalOutput)} ZEC</span>
                </div>
                <div className="tx-detail">
                  <span className="tx-detail-label">Size</span>
                  <span className="tx-detail-value size-value">{formatSize(tx.size)}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="tx-expanded">
                  <TransactionIOView tx={tx} />

                  {/* TZE Details - only show for TZE transactions */}
                  {txKind === 'tze' && <TZEDetailsView tx={tx} />}

                  {/* View Full Transaction Button */}
                  <div style={{ marginTop: '32px', textAlign: 'right' }}>
                    <a href={`#/tx/${tx.txid}`} className="button" style={{ display: 'inline-flex' }}>
                      View Full Transaction →
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
