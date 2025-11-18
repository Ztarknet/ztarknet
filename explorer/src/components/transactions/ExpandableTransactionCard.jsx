import React, { useState } from 'react';
import { formatZEC, formatSize } from '@utils/formatters';
import { getTransactionKind, getTransactionStats } from '@utils/tx-parser';
import { TransactionIOView } from '@components/transactions/TransactionIOView';
import { TZEDetailsView } from '@components/transactions/TZEDetailsView';

const TX_KIND_STYLES = {
  coinbase: 'bg-[#f5a623] text-[#0a0a0e]',
  tze: 'bg-[#16a085] text-white',
  standard: 'bg-accent text-background'
};

export function ExpandableTransactionCard({ tx, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { numInputs, numOutputs, totalOutput } = getTransactionStats(tx);
  const txKind = getTransactionKind(tx);

  return (
    <div key={tx.txid || index} className="flex flex-col gap-0">
      <div
        className="py-3.5 px-5 bg-card-bg border border-[rgba(255,137,70,0.2)] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-[16px] transition-all duration-300 cursor-pointer hover:border-[rgba(255,137,70,0.4)] hover:translate-x-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Mobile/Tablet Layout - Below md breakpoint */}
        <div className="md:hidden flex flex-col gap-3">
          <span className={`text-[0.65rem] font-mono uppercase tracking-wider font-bold whitespace-nowrap min-w-[80px] text-center inline-block py-1 px-2.5 rounded ${TX_KIND_STYLES[txKind] || TX_KIND_STYLES.standard}`}>
            {txKind}
          </span>
          <code className="text-xs font-mono text-foreground overflow-hidden text-ellipsis whitespace-normal break-all bg-black/30 py-1.5 px-3 rounded-md" title={tx.txid}>
            {tx.txid}
          </code>
          <div className="flex flex-row justify-between gap-3 overflow-x-auto">
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Inputs</span>
              <span className="text-[0.95rem] font-semibold text-foreground font-mono">{numInputs}</span>
            </div>
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Outputs</span>
              <span className="text-[0.95rem] font-semibold text-foreground font-mono">{numOutputs}</span>
            </div>
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Total Output</span>
              <span className="text-[0.95rem] font-semibold text-foreground font-mono min-w-[100px] inline-block text-left">{formatZEC(totalOutput)} ZEC</span>
            </div>
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Size</span>
              <span className="text-[0.95rem] font-semibold text-foreground font-mono min-w-[60px] inline-block text-left">{formatSize(tx.size)}</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout - md breakpoint and above */}
        <div className="hidden md:grid md:grid-cols-[auto_minmax(250px,1fr)_repeat(4,auto)] gap-5 items-center">
          <span className={`text-[0.65rem] font-mono uppercase tracking-wider font-bold whitespace-nowrap min-w-[80px] text-center inline-block py-1 px-2.5 rounded ${TX_KIND_STYLES[txKind] || TX_KIND_STYLES.standard}`}>
            {txKind}
          </span>
          <code className="text-xs font-mono text-foreground overflow-hidden text-ellipsis whitespace-nowrap bg-black/30 py-1.5 px-3 rounded-md" title={tx.txid}>
            {tx.txid}
          </code>
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Inputs</span>
            <span className="text-[0.95rem] font-semibold text-foreground font-mono">{numInputs}</span>
          </div>
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Outputs</span>
            <span className="text-[0.95rem] font-semibold text-foreground font-mono">{numOutputs}</span>
          </div>
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Total Output</span>
            <span className="text-[0.95rem] font-semibold text-foreground font-mono min-w-[100px] inline-block text-left">{formatZEC(totalOutput)} ZEC</span>
          </div>
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Size</span>
            <span className="text-[0.95rem] font-semibold text-foreground font-mono min-w-[60px] inline-block text-left">{formatSize(tx.size)}</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 bg-[rgba(8,8,12,0.9)] border border-[rgba(255,137,70,0.15)] border-t-0 rounded-b-xl -mt-3">
          <TransactionIOView tx={tx} />

          {/* TZE Details - only show for TZE transactions */}
          {txKind === 'tze' && <TZEDetailsView tx={tx} />}

          {/* View Full Transaction Button */}
          <div className="mt-8 text-right">
            <a
              href={`#/tx/${tx.txid}`}
              className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.4)] text-foreground hover:border-accent hover:-translate-y-0.5"
            >
              View Full Transaction →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
