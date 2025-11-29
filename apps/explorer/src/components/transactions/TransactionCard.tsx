'use client';

import type { Transaction, TransactionKind } from '@/types/transaction';
import { formatSize, formatZEC } from '@/utils/formatters';
import { getTransactionKind, getTransactionStats } from '@/utils/tx-parser';
import { GlowingEffect } from '@workspace/ui/components/glowing-effect';
import Link from 'next/link';

const TX_KIND_STYLES: Record<TransactionKind, string> = {
  coinbase: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  tze: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  standard: 'bg-accent/20 text-accent border-accent/30',
};

interface TransactionCardProps {
  tx?: Transaction;
  isLoading?: boolean;
}

export function TransactionCard({ tx, isLoading = false }: TransactionCardProps) {
  if (isLoading) {
    return (
      <div className="group relative rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-1 md:p-1.5 transition-all duration-300">
        <div className="relative overflow-hidden rounded-lg bg-[rgb(10,10,14)] px-4 py-2.5 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
          {/* Mobile/Tablet Layout - Below md breakpoint */}
          <div className="md:hidden flex flex-col gap-3 w-full">
            <span className="badge border bg-accent/20 text-accent border-accent/30 skeleton-text">
              ---
            </span>
            <code className="text-xs font-mono text-[rgba(255,255,255,0.7)] overflow-hidden text-ellipsis whitespace-normal break-all bg-[rgba(255,255,255,0.05)] py-1.5 px-3 rounded-md skeleton-text">
              ----------------------------------------------------------------
            </code>
            <div className="flex flex-row justify-between gap-3 overflow-x-auto">
              <div className="flex flex-col gap-0.5 whitespace-nowrap">
                <span className="field-label">Inputs</span>
                <span className="text-base font-semibold text-foreground font-mono skeleton-text">
                  -
                </span>
              </div>
              <div className="flex flex-col gap-0.5 whitespace-nowrap">
                <span className="field-label">Outputs</span>
                <span className="text-base font-semibold text-foreground font-mono skeleton-text">
                  -
                </span>
              </div>
              <div className="flex flex-col gap-0.5 whitespace-nowrap">
                <span className="field-label">Total Output</span>
                <span className="text-base font-semibold text-foreground font-mono skeleton-text min-w-24 inline-block text-left">
                  --- ZEC
                </span>
              </div>
              <div className="flex flex-col gap-0.5 whitespace-nowrap">
                <span className="field-label">Size</span>
                <span className="text-base font-semibold text-foreground font-mono skeleton-text min-w-16 inline-block text-left">
                  --- B
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Layout - md breakpoint and above */}
          <div className="hidden md:grid md:grid-cols-[auto_minmax(200px,1fr)_repeat(4,auto)] gap-5 items-center w-full">
            <span className="badge border bg-accent/20 text-accent border-accent/30 skeleton-text">
              ---
            </span>
            <code className="text-xs font-mono text-[rgba(255,255,255,0.7)] overflow-hidden text-ellipsis whitespace-nowrap bg-[rgba(255,255,255,0.05)] py-1.5 px-3 rounded-md skeleton-text">
              ----------------------------------------------------------------
            </code>
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Inputs</span>
              <span className="text-[0.95rem] font-semibold text-foreground font-mono skeleton-text">
                -
              </span>
            </div>
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Outputs</span>
              <span className="text-[0.95rem] font-semibold text-foreground font-mono skeleton-text">
                -
              </span>
            </div>
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Total Output</span>
              <span className="text-[0.95rem] font-semibold text-foreground font-mono skeleton-text min-w-[100px] inline-block text-left">
                --- ZEC
              </span>
            </div>
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Size</span>
              <span className="text-[0.95rem] font-semibold text-foreground font-mono skeleton-text min-w-[60px] inline-block text-left">
                --- B
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tx) {
    return null;
  }

  const { numInputs, numOutputs, totalOutput } = getTransactionStats(tx);
  const txKind = getTransactionKind(tx);

  return (
    <Link
      href={`/tx/${tx.txid}`}
      className="group block no-underline relative rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-1 md:p-1.5 transition-all duration-300"
    >
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
      <div className="relative overflow-hidden rounded-lg bg-[rgb(10,10,14)] px-4 py-2.5 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
        {/* Mobile/Tablet Layout - Below md breakpoint */}
        <div className="md:hidden flex flex-col gap-3 w-full relative z-10">
          <span className={`badge border ${TX_KIND_STYLES[txKind] || TX_KIND_STYLES.standard}`}>
            {txKind}
          </span>
          <code
            className="text-xs font-mono text-[rgba(255,255,255,0.7)] overflow-hidden text-ellipsis whitespace-normal break-all bg-[rgba(255,255,255,0.05)] py-1.5 px-3 rounded-md"
            title={tx.txid}
          >
            {tx.txid}
          </code>
          <div className="flex flex-row justify-between gap-3 overflow-x-auto">
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Inputs</span>
              <span className="text-base font-semibold text-foreground font-mono">{numInputs}</span>
            </div>
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Outputs</span>
              <span className="text-base font-semibold text-foreground font-mono">
                {numOutputs}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Total Output</span>
              <span className="text-base font-semibold text-foreground font-mono min-w-24 inline-block text-left">
                {formatZEC(totalOutput)} ZEC
              </span>
            </div>
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Size</span>
              <span className="text-base font-semibold text-foreground font-mono min-w-16 inline-block text-left">
                {formatSize(tx.size || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Layout - md breakpoint and above */}
        <div className="hidden md:grid md:grid-cols-[auto_minmax(200px,1fr)_repeat(4,auto)] gap-5 items-center w-full relative z-10">
          <span className={`badge border ${TX_KIND_STYLES[txKind] || TX_KIND_STYLES.standard}`}>
            {txKind}
          </span>
          <code
            className="text-xs font-mono text-[rgba(255,255,255,0.7)] overflow-hidden text-ellipsis whitespace-nowrap bg-[rgba(255,255,255,0.05)] py-1.5 px-3 rounded-md"
            title={tx.txid}
          >
            {tx.txid}
          </code>
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            <span className="field-label">Inputs</span>
            <span className="text-[0.95rem] font-semibold text-foreground font-mono">
              {numInputs}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            <span className="field-label">Outputs</span>
            <span className="text-[0.95rem] font-semibold text-foreground font-mono">
              {numOutputs}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            <span className="field-label">Total Output</span>
            <span className="text-[0.95rem] font-semibold text-foreground font-mono min-w-[100px] inline-block text-left">
              {formatZEC(totalOutput)} ZEC
            </span>
          </div>
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            <span className="field-label">Size</span>
            <span className="text-[0.95rem] font-semibold text-foreground font-mono min-w-[60px] inline-block text-left">
              {formatSize(tx.size || 0)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
