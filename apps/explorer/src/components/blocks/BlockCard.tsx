'use client';

import { DecodingText } from '@/components/common/DecodingText';
import { useRelativeTime } from '@/hooks/useRelativeTime';
import type { BlockData } from '@/types/block';
import { formatSize, formatZEC, getBlockReward } from '@/utils/formatters';
import { GlowingEffect } from '@workspace/ui/components/glowing-effect';
import Link from 'next/link';

interface BlockCardProps {
  block?: BlockData;
  isLoading?: boolean;
}

// Fixed column widths for consistent layout between loading and loaded states
const GRID_COLS_DESKTOP = 'md:grid-cols-[200px_1fr_80px_100px_70px]';

export function BlockCard({ block, isLoading = false }: BlockCardProps) {
  const relativeTime = useRelativeTime(block?.time);

  // Shared card wrapper classes
  const cardWrapperClass =
    'group relative rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-1 md:p-1.5 transition-all duration-300';
  const cardInnerClass =
    'relative overflow-hidden rounded-lg bg-[rgb(10,10,14)] px-4 py-2.5 shadow-[0_18px_36px_rgba(0,0,0,0.35)]';
  const gridClass = `grid ${GRID_COLS_DESKTOP} grid-cols-1 gap-3 md:gap-5 w-full items-center`;

  if (isLoading) {
    return (
      <div className={cardWrapperClass}>
        <div className={cardInnerClass}>
          <div className={gridClass}>
            {/* Block number + time */}
            <div className="flex flex-row justify-between items-center gap-2 md:flex-col md:items-start md:gap-1">
              <span className="text-lg font-bold text-accent font-mono whitespace-nowrap w-full">
                <span className="inline-block bg-[rgba(255,255,255,0.1)] rounded animate-pulse w-[140px] h-[1.5em]" />
              </span>
              <span className="text-xs text-[rgba(255,255,255,0.5)] font-mono whitespace-nowrap tabular-nums">
                <span className="inline-block bg-[rgba(255,255,255,0.1)] rounded animate-pulse w-[80px] h-[1em]" />
              </span>
            </div>

            {/* Hash */}
            <code className="text-xs font-mono text-[rgba(255,255,255,0.7)] overflow-hidden text-ellipsis md:whitespace-nowrap whitespace-normal break-all bg-[rgba(255,255,255,0.05)] py-1.5 px-3 rounded-md">
              <DecodingText text="" isLoading={true} />
            </code>

            {/* Stats columns - mobile: row, desktop: grid cells */}
            <div className="md:contents grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-0.5 whitespace-nowrap">
                <span className="field-label">Transactions</span>
                <span className="text-base font-semibold text-foreground font-mono">
                  <span className="inline-block bg-[rgba(255,255,255,0.1)] rounded animate-pulse w-[30px] h-[1.25em]" />
                </span>
              </div>

              <div className="flex flex-col gap-0.5 whitespace-nowrap">
                <span className="field-label">Reward</span>
                <span className="text-base font-semibold text-foreground font-mono">
                  <span className="inline-block bg-[rgba(255,255,255,0.1)] rounded animate-pulse w-[80px] h-[1.25em]" />
                </span>
              </div>

              <div className="flex flex-col gap-0.5 whitespace-nowrap">
                <span className="field-label">Size</span>
                <span className="text-base font-semibold text-foreground font-mono">
                  <span className="inline-block bg-[rgba(255,255,255,0.1)] rounded animate-pulse w-[50px] h-[1.25em]" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!block) {
    return null;
  }

  const totalTx = block.tx ? block.tx.length : 0;
  const reward = getBlockReward(block);

  return (
    <Link href={`/block/${block.hash}`} className={`${cardWrapperClass} block no-underline`}>
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
      <div
        className={`${cardInnerClass} transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]`}
      >
        <div className={`relative z-10 ${gridClass}`}>
          {/* Block number + time */}
          <div className="flex flex-row justify-between items-center gap-2 md:flex-col md:items-start md:gap-1">
            <span className="text-lg font-bold text-accent font-mono whitespace-nowrap">
              Block #{block.height.toLocaleString()}
            </span>
            <span className="text-xs text-[rgba(255,255,255,0.5)] font-mono whitespace-nowrap tabular-nums">
              {relativeTime}
            </span>
          </div>

          {/* Hash */}
          <code
            className="text-xs font-mono text-[rgba(255,255,255,0.7)] overflow-hidden text-ellipsis md:whitespace-nowrap whitespace-normal break-all bg-[rgba(255,255,255,0.05)] py-1.5 px-3 rounded-md"
            title={block.hash}
          >
            <DecodingText text={block.hash} decodeDuration={600} />
          </code>

          {/* Stats columns - mobile: row, desktop: grid cells */}
          <div className="md:contents grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Transactions</span>
              <span className="text-base font-semibold text-foreground font-mono">{totalTx}</span>
            </div>

            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Reward</span>
              <span className="text-base font-semibold text-foreground font-mono">
                {reward !== null ? `${formatZEC(reward)} ZEC` : 'N/A'}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Size</span>
              <span className="text-base font-semibold text-foreground font-mono">
                {formatSize(block.size)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
