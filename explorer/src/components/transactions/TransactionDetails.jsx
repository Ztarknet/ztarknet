import React from 'react';
import { formatSize, formatZEC } from '@utils/formatters';
import { getTransactionStats } from '@utils/tx-parser';
import { TransactionIOView } from '@components/transactions/TransactionIOView';
import { TZEDetailsView } from '@components/transactions/TZEDetailsView';

export function TransactionDetails({ tx, txKind }) {
  const { totalOutput } = getTransactionStats(tx);

  return (
    <div style={{
      padding: '32px',
      background: 'radial-gradient(circle at top left, rgba(255, 107, 26, 0.08), rgba(5, 5, 7, 0.95) 50%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 137, 70, 0.15)',
      borderRadius: '16px',
      marginBottom: '32px'
    }}>
      <TransactionIOView tx={tx} />

      {/* Additional Transaction Info */}
      <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div>
          <div className="tx-io-label" style={{ marginBottom: '8px' }}>Total Output</div>
          <div className="tx-io-value highlight zec-value" style={{ fontSize: '1.1rem' }}>{formatZEC(totalOutput)} ZEC</div>
        </div>
        <div>
          <div className="tx-io-label" style={{ marginBottom: '8px' }}>Size</div>
          <div className="tx-io-value size-value" style={{ fontSize: '1.1rem' }}>{formatSize(tx.size)}</div>
        </div>
        <div>
          <div className="tx-io-label" style={{ marginBottom: '8px' }}>Version</div>
          <div className="tx-io-value" style={{ fontSize: '1.1rem' }}>{tx.version}</div>
        </div>
        {tx.locktime !== undefined && (
          <div>
            <div className="tx-io-label" style={{ marginBottom: '8px' }}>Locktime</div>
            <div className="tx-io-value" style={{ fontSize: '1.1rem' }}>{tx.locktime}</div>
          </div>
        )}
      </div>

      {/* TZE Details - only show for TZE transactions */}
      {txKind === 'tze' && <TZEDetailsView tx={tx} />}
    </div>
  );
}
