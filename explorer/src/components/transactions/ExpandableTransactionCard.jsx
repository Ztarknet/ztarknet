import React, { useState } from 'react';
import { formatZEC, formatSize } from '@utils/formatters';
import { getTransactionKind, getTransactionStats } from '@utils/tx-parser';
import { TransactionIOView } from '@components/transactions/TransactionIOView';
import { TZEDetailsView } from '@components/transactions/TZEDetailsView';

export function ExpandableTransactionCard({ tx, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { numInputs, numOutputs, totalOutput } = getTransactionStats(tx);
  const txKind = getTransactionKind(tx);

  return (
    <div key={tx.txid || index} className="tx-card-wrapper">
      <div
        className="tx-card"
        onClick={() => setIsExpanded(!isExpanded)}
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
}
