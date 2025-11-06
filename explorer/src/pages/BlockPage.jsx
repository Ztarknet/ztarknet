import React, { useState, useEffect } from 'react';
import { getBlockHash, getBlock } from '@services/rpc';
import { formatTime, formatSize, formatZEC, getBlockReward } from '@utils/formatters';
import { TransactionCard } from '@components/transactions/TransactionCard';
import { ExpandableTransactionCard } from '@components/transactions/ExpandableTransactionCard';
import { HashDisplay } from '@components/common/HashDisplay';
import { StatCard } from '@components/common/StatCard';

export function BlockPage({ blockId }) {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="#/" className="button ghost">← Back to Blocks</a>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="button ghost" disabled style={{ opacity: 0.5 }}>
              ← Previous Block
            </button>
            <button className="button ghost" disabled style={{ opacity: 0.5 }}>
              Next Block →
            </button>
          </div>
        </div>

        <h2 className="section-title skeleton-text">Block #---</h2>
        <HashDisplay isLoading={true} />

        {/* Skeleton stat cards */}
        <div className="stats-grid" style={{ marginBottom: '48px' }}>
          <StatCard label="Block Height" value="---" description="Loading..." isLoading={true} />
          <StatCard label="Block Reward" value="---" description="ZEC" isLoading={true} />
          <StatCard label="Block Size" value="---" description="---" isLoading={true} />
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
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="#/" className="button ghost">← Back to Blocks</a>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href={`#/block/${block.height - 1}`}
            className="button ghost"
            style={{ opacity: block.height <= 0 ? 0.5 : 1, pointerEvents: block.height <= 0 ? 'none' : 'auto' }}
          >
            ← Previous Block
          </a>
          <a href={`#/block/${block.height + 1}`} className="button ghost">
            Next Block →
          </a>
        </div>
      </div>

      <h2 className="section-title">Block #{block.height.toLocaleString()}</h2>
      <HashDisplay hash={block.hash} />

      {/* Block info cards */}
      <div className="stats-grid" style={{ marginBottom: '48px' }}>
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
      <h2 className="section-title">{totalTx} Transaction{totalTx !== 1 ? 's' : ''}</h2>
      <div className="transactions-container">
        {block.tx && block.tx.map((tx, index) => (
          <ExpandableTransactionCard key={tx.txid || index} tx={tx} index={index} />
        ))}
      </div>
    </div>
  );
}
