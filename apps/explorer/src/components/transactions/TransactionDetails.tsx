'use client';

import { TZEDetailsView } from '@/components/transactions/TZEDetailsView';
import { TransactionIOView } from '@/components/transactions/TransactionIOView';
import type { Transaction, TransactionKind } from '@/types/transaction';
import { formatSize, formatZEC } from '@/utils/formatters';
import { getTransactionStats } from '@/utils/tx-parser';
import { GlowingEffect } from '@workspace/ui/components/glowing-effect';

interface TransactionDetailsProps {
  tx: Transaction;
  txKind: TransactionKind;
}

export function TransactionDetails({ tx, txKind }: TransactionDetailsProps) {
  const { totalOutput } = getTransactionStats(tx);

  return (
    <div className="group relative rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-2 md:rounded-3xl md:p-3 transition-all duration-300 mb-8">
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(12,12,18,0.9)] to-[rgba(6,6,9,0.8)] p-6 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

        <div className="relative z-10">
          <TransactionIOView tx={tx} />

          {/* Additional Transaction Info */}
          <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <div>
              <div className="field-label mb-2">Total Output</div>
              <div className="text-lg text-accent font-semibold font-mono">
                {formatZEC(totalOutput)} ZEC
              </div>
            </div>
            <div>
              <div className="field-label mb-2">Size</div>
              <div className="text-lg text-foreground font-mono">{formatSize(tx.size || 0)}</div>
            </div>
            <div>
              <div className="field-label mb-2">Version</div>
              <div className="text-lg text-foreground font-mono">{tx.version}</div>
            </div>
            {tx.locktime !== undefined && (
              <div>
                <div className="field-label mb-2">Locktime</div>
                <div className="text-lg text-foreground font-mono">{tx.locktime}</div>
              </div>
            )}
          </div>

          {/* TZE Details - only show for TZE transactions */}
          {txKind === 'tze' && <TZEDetailsView tx={tx} />}
        </div>
      </div>
    </div>
  );
}
