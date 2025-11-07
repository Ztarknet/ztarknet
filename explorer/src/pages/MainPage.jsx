import React from 'react';
import { useBlockPolling } from '@hooks/useBlockPolling';
import { RPC_ENDPOINT } from '@services/rpc';
import { StatCard } from '@components/common/StatCard';
import { BlocksList } from '@components/blocks/BlocksList';

const MAX_BLOCKS = 5;

export function MainPage() {
  const { blocks, chainHeight, loading, error } = useBlockPolling(MAX_BLOCKS);

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
        <StatCard
          label="Chain Height"
          value={chainHeight.toLocaleString()}
          description="Total blocks mined"
          isLoading={loading}
        />
        <StatCard
          label="Network Upgrade"
          value="ZFuture"
          description="Latest protocol version"
          isLoading={loading}
        />
        <StatCard
          label="Transaction Version"
          value="V6"
          description="Current tx format"
          isLoading={loading}
        />
      </div>

      <h2 className="section-title">Latest Blocks</h2>
      <BlocksList blocks={blocks} loading={loading} maxBlocks={MAX_BLOCKS} />

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
