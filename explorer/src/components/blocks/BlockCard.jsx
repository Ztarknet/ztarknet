import React from 'react';
import { formatTime, formatSize, formatZEC, getBlockReward } from '@utils/formatters';

export function BlockCard({ block, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="block-card skeleton">
        <div className="block-info">
          <span className="block-height skeleton-text">Block #---</span>
          <span className="block-time skeleton-text">--- ago</span>
        </div>

        <code className="block-hash skeleton-text">
          ----------------------------------------------------------------
        </code>

        <div className="block-details">
          <div className="block-detail">
            <span className="block-detail-label">Transactions</span>
            <span className="block-detail-value skeleton-text">-</span>
          </div>

          <div className="block-detail">
            <span className="block-detail-label">Reward</span>
            <span className="block-detail-value skeleton-text zec-value">--- ZEC</span>
          </div>

          <div className="block-detail">
            <span className="block-detail-label">Size</span>
            <span className="block-detail-value skeleton-text size-value">--- B</span>
          </div>
        </div>
      </div>
    );
  }

  const totalTx = block.tx ? block.tx.length : 0;
  const reward = getBlockReward(block);

  return (
    <a
      href={`#/block/${block.hash}`}
      className={`block-card ${block.isNew ? 'new-block' : ''}`}
    >
      <div className="block-info">
        <span className="block-height">Block #{block.height.toLocaleString()}</span>
        <span className="block-time">{formatTime(block.time)}</span>
      </div>

      <code className="block-hash" title={block.hash}>
        {block.hash}
      </code>

      <div className="block-details">
        <div className="block-detail">
          <span className="block-detail-label">Transactions</span>
          <span className="block-detail-value">
            {totalTx}
          </span>
        </div>

        <div className="block-detail">
          <span className="block-detail-label">Reward</span>
          <span className="block-detail-value zec-value">
            {reward !== null ? `${formatZEC(reward)} ZEC` : 'N/A'}
          </span>
        </div>

        <div className="block-detail">
          <span className="block-detail-label">Size</span>
          <span className="block-detail-value size-value">
            {formatSize(block.size)}
          </span>
        </div>
      </div>
    </a>
  );
}
