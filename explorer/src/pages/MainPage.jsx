import React from 'react';
import { useBlockPolling } from '@hooks/useBlockPolling';
import { formatTime, formatSize, formatZEC, getBlockReward } from '@utils/formatters';
import { RPC_ENDPOINT } from '@services/rpc';

const MAX_BLOCKS = 5;

export function MainPage() {
  const { blocks, chainHeight, loading, error } = useBlockPolling();

  return (
    <div className="explorer-container">
      {error && (
        <div className="error">
          Error: {error}
          <br />
          Make sure the RPC endpoint is accessible.
        </div>
      )}

      <div className="stats-grid">
        {loading ? (
          <>
            <div className="stat-card skeleton">
              <span className="stat-label skeleton-text">Chain Height</span>
              <div className="stat-value skeleton-text">Loading...</div>
              <div className="stat-description skeleton-text">Total blocks mined</div>
            </div>
            <div className="stat-card skeleton">
              <span className="stat-label skeleton-text">Network Upgrade</span>
              <div className="stat-value skeleton-text">Loading...</div>
              <div className="stat-description skeleton-text">Latest protocol version</div>
            </div>
            <div className="stat-card skeleton">
              <span className="stat-label skeleton-text">Transaction Version</span>
              <div className="stat-value skeleton-text">Loading...</div>
              <div className="stat-description skeleton-text">Current tx format</div>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <span className="stat-label">Chain Height</span>
              <div className="stat-value">{chainHeight.toLocaleString()}</div>
              <div className="stat-description">Total blocks mined</div>
            </div>

            <div className="stat-card">
              <span className="stat-label">Network Upgrade</span>
              <div className="stat-value">ZFuture</div>
              <div className="stat-description">Latest protocol version</div>
            </div>

            <div className="stat-card">
              <span className="stat-label">Transaction Version</span>
              <div className="stat-value">V6</div>
              <div className="stat-description">Current tx format</div>
            </div>
          </>
        )}
      </div>

      <h2 className="section-title">Latest Blocks</h2>
      <div className="blocks-container">
        {loading ? (
          // Show skeleton placeholders during loading
          Array.from({ length: MAX_BLOCKS }).map((_, index) => (
            <div key={index} className="block-card skeleton">
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
          ))
        ) : (
          blocks.map((block, index) => {
            const totalTx = block.tx ? block.tx.length : 0;
            const reward = getBlockReward(block);

            return (
              <a
                key={block.hash}
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
          })
        )}
      </div>

      <div className="developer-info">
        <h2>Developer Information</h2>

        <div className="info-item">
          <span className="info-label">RPC Endpoint</span>
          <div className="info-value">
            <code>{RPC_ENDPOINT}</code>
          </div>
        </div>

        <div className="info-item">
          <span className="info-label">Default Miner Address</span>
          <div className="info-value">
            Use the default mnemonic to claim coinbase rewards. This serves as a faucet for developers
            testing on the network. All miners use the same coinbase address by default, allowing you
            to claim rewards using the shared mnemonic phrase.
          </div>
        </div>

        <div className="info-item">
          <span className="info-label">Network Type</span>
          <div className="info-value">
            <code>regtest</code> - Regression test network for development
          </div>
        </div>
      </div>
    </div>
  );
}
