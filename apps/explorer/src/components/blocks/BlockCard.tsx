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
      <div
        className="py-3.5 px-5 border border-[rgba(255,137,70,0.2)] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-[16px] transition-all duration-300 opacity-100 grid md:grid-cols-[auto_minmax(200px,1fr)_repeat(3,auto)] grid-cols-1 gap-5 md:gap-5 gap-3 items-center no-underline cursor-pointer skeleton"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(255, 107, 26, 0.06), rgba(8, 8, 12, 0.9) 70%)',
        }}
      >
        <div className="flex flex-row justify-between items-center gap-2">
          <span className="text-lg font-bold text-accent font-mono whitespace-nowrap skeleton-text">
            Block #---
          </span>
          <span className="text-xs text-muted font-mono whitespace-nowrap skeleton-text">
            --- ago
          </span>
        </div>

        <code className="text-xs font-mono text-foreground overflow-hidden text-ellipsis md:whitespace-nowrap whitespace-normal break-all bg-black/30 py-1.5 px-3 rounded-md self-center skeleton-text">
          ----------------------------------------------------------------
        </code>

        <div className="md:contents grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">
              Transactions
            </span>
            <span className="text-[0.95rem] font-semibold text-foreground font-mono skeleton-text">
              -
            </span>
          </div>

          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">
              Reward
            </span>
            <span className="text-[0.95rem] font-semibold text-foreground font-mono skeleton-text min-w-[100px] inline-block text-left">
              --- ZEC
            </span>
          </div>

          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">
              Size
            </span>
            <span className="text-[0.95rem] font-semibold text-foreground font-mono skeleton-text min-w-[60px] inline-block text-left">
              --- B
            </span>
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
      className="reveal-on-scroll reveal-from-left relative py-3.5 px-5 border border-[rgba(255,137,70,0.2)] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-[16px] transition-all duration-300 opacity-100 grid md:grid-cols-[auto_minmax(200px,1fr)_repeat(3,auto)] grid-cols-1 gap-5 md:gap-5 gap-3 items-center no-underline cursor-pointer hover:translate-x-2 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(255,107,26,0.25),0_8px_24px_rgba(0,0,0,0.4)]"
      style={{
        background:
          'radial-gradient(circle at top right, rgba(255, 107, 26, 0.06), rgba(8, 8, 12, 0.9) 70%)',
      }}
    >
      <GlowingEffect proximity={64} spread={30} />
      <div className="flex flex-row justify-between items-center gap-2">
        <span className="text-lg font-bold text-accent font-mono whitespace-nowrap">
          Block #{block.height.toLocaleString()}
        </span>
        <span className="text-xs text-muted font-mono whitespace-nowrap">
          {formatTime(block.time)}
        </span>
      </div>

      <code
        className="text-xs font-mono text-foreground overflow-hidden text-ellipsis md:whitespace-nowrap whitespace-normal break-all bg-black/30 py-1.5 px-3 rounded-md self-center"
        title={block.hash}
      >
        {block.hash}
      </code>

      <div className="md:contents grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-0.5 whitespace-nowrap">
          <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">
            Transactions
          </span>
          <span className="text-[0.95rem] font-semibold text-foreground font-mono">{totalTx}</span>
        </div>

        <div className="flex flex-col gap-0.5 whitespace-nowrap">
          <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">
            Reward
          </span>
          <span className="text-[0.95rem] font-semibold text-foreground font-mono min-w-[100px] inline-block text-left">
            {reward !== null ? `${formatZEC(reward)} ZEC` : 'N/A'}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 whitespace-nowrap">
          <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">
            Size
          </span>
          <span className="text-[0.95rem] font-semibold text-foreground font-mono min-w-[60px] inline-block text-left">
            {formatSize(block.size)}
          </span>
        </div>
      </div>
    </a>
  );
}
