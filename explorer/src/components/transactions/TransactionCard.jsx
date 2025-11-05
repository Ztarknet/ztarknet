import React from 'react';
import { formatSize, formatZEC } from '@utils/formatters';
import { getTransactionKind, getTransactionStats } from '@utils/tx-parser';

export function TransactionCard({ tx, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="tx-card skeleton">
        <span className="tx-kind skeleton-text">---</span>
        <code className="tx-hash skeleton-text">
          ----------------------------------------------------------------
        </code>
        <div className="tx-detail">
          <span className="tx-detail-label">Inputs</span>
          <span className="tx-detail-value skeleton-text">-</span>
        </div>
        <div className="tx-detail">
          <span className="tx-detail-label">Outputs</span>
          <span className="tx-detail-value skeleton-text">-</span>
        </div>
        <div className="tx-detail">
          <span className="tx-detail-label">Total Output</span>
          <span className="tx-detail-value skeleton-text zec-value">--- ZEC</span>
        </div>
        <div className="tx-detail">
          <span className="tx-detail-label">Size</span>
          <span className="tx-detail-value skeleton-text size-value">--- B</span>
        </div>
      </div>
    );
  }

  const { numInputs, numOutputs, totalOutput } = getTransactionStats(tx);
  const txKind = getTransactionKind(tx);

  return (
    <div className="tx-card">
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
  );
}
