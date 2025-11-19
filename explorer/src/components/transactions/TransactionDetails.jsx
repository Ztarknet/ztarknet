import React from 'react';
import { formatSize, formatZEC } from '@utils/formatters';
import { getTransactionStats } from '@utils/tx-parser';
import { TransactionIOView } from '@components/transactions/TransactionIOView';
import { TZEDetailsView } from '@components/transactions/TZEDetailsView';

export function TransactionDetails({ tx, txKind }) {
  const { totalOutput } = getTransactionStats(tx);

  return (
    <div className="p-8 border border-[rgba(255,137,70,0.15)] rounded-2xl mb-8 backdrop-blur-[10px]" style={{
      background: 'radial-gradient(circle at top left, rgba(255, 107, 26, 0.08), rgba(5, 5, 7, 0.95) 50%)'
    }}>
      <TransactionIOView tx={tx} />

      {/* Additional Transaction Info */}
      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <div>
          <div className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)] mb-2">Total Output</div>
          <div className="text-lg text-accent-strong font-semibold font-mono min-w-[120px] inline-block text-left">{formatZEC(totalOutput)} ZEC</div>
        </div>
        <div>
          <div className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)] mb-2">Size</div>
          <div className="text-lg text-foreground font-mono min-w-[60px] inline-block text-left">{formatSize(tx.size)}</div>
        </div>
        <div>
          <div className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)] mb-2">Version</div>
          <div className="text-lg text-foreground font-mono">{tx.version}</div>
        </div>
        {tx.locktime !== undefined && (
          <div>
            <div className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)] mb-2">Locktime</div>
            <div className="text-lg text-foreground font-mono">{tx.locktime}</div>
          </div>
        )}
      </div>

      {/* TZE Details - only show for TZE transactions */}
      {txKind === 'tze' && <TZEDetailsView tx={tx} />}
    </div>
  );
}
