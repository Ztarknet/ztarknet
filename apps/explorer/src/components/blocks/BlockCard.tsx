import { formatSize, formatTime, formatZEC, getBlockReward } from '@utils/formatters';
import { GlowingEffect } from '@workspace/ui/components/glowing-effect';
import type { BlockData } from '../../types/block';

interface BlockCardProps {
  block?: BlockData;
  isLoading?: boolean;
}

export function BlockCard({ block, isLoading = false }: BlockCardProps) {
  if (isLoading) {
    return (
      <div className="group relative rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-1 md:p-1.5 transition-all duration-300">
        <div className="relative overflow-hidden rounded-lg bg-[rgb(10,10,14)] px-4 py-2.5 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
          <div className="grid md:grid-cols-[auto_minmax(200px,1fr)_repeat(3,auto)] grid-cols-1 gap-5 md:gap-5 gap-3 w-full">
            <div className="flex flex-row justify-between items-center gap-2">
              <span className="text-lg font-bold text-accent font-mono whitespace-nowrap skeleton-text">
                Block #---
              </span>
              <span className="text-xs text-[rgba(255,255,255,0.5)] font-mono whitespace-nowrap skeleton-text">
                --- ago
              </span>
            </div>

            <code className="text-xs font-mono text-[rgba(255,255,255,0.7)] overflow-hidden text-ellipsis md:whitespace-nowrap whitespace-normal break-all bg-[rgba(255,255,255,0.05)] py-1.5 px-3 rounded-md self-center skeleton-text">
              ----------------------------------------------------------------
            </code>

            <div className="md:contents grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-0.5 whitespace-nowrap">
                <span className="field-label">Transactions</span>
                <span className="text-base font-semibold text-foreground font-mono skeleton-text">
                  -
                </span>
              </div>

              <div className="flex flex-col gap-0.5 whitespace-nowrap">
                <span className="field-label">Reward</span>
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
    <a
      href={`#/block/${block.hash}`}
      className="group block no-underline relative rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-1 md:p-1.5 transition-all duration-300"
    >
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
      <div className="relative overflow-hidden rounded-lg bg-[rgb(10,10,14)] px-4 py-2.5 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
        <div className="relative z-10 grid md:grid-cols-[auto_minmax(200px,1fr)_repeat(3,auto)] grid-cols-1 gap-5 md:gap-5 gap-3 w-full">
          <div className="flex flex-row justify-between items-center gap-2">
            <span className="text-lg font-bold text-accent font-mono whitespace-nowrap">
              Block #{block.height.toLocaleString()}
            </span>
            <span className="text-xs text-[rgba(255,255,255,0.5)] font-mono whitespace-nowrap">
              {formatTime(block.time)}
            </span>
          </div>

          <code
            className="text-xs font-mono text-[rgba(255,255,255,0.7)] overflow-hidden text-ellipsis md:whitespace-nowrap whitespace-normal break-all bg-[rgba(255,255,255,0.05)] py-1.5 px-3 rounded-md self-center"
            title={block.hash}
          >
            {block.hash}
          </code>

          <div className="md:contents grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Transactions</span>
              <span className="text-base font-semibold text-foreground font-mono">{totalTx}</span>
            </div>

            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Reward</span>
              <span className="text-base font-semibold text-foreground font-mono min-w-24 inline-block text-left">
                {reward !== null ? `${formatZEC(reward)} ZEC` : 'N/A'}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <span className="field-label">Size</span>
              <span className="text-base font-semibold text-foreground font-mono min-w-16 inline-block text-left">
                {formatSize(block.size)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
