'use client';

import { BlockCard } from '@/components/blocks/BlockCard';
import { useRecentBlocks } from '@/hooks/queries/useBlockQueries';

const PAGE_SIZE = 7;

interface BlocksListProps {
  initialBlocks?: number;
}

export function BlocksList({ initialBlocks = PAGE_SIZE }: BlocksListProps) {
  const { data, isLoading, error } = useRecentBlocks(initialBlocks);

  const blocks = data?.blocks ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 min-h-[400px]">
        {Array.from({ length: initialBlocks }, (_, index) => ({
          skeletonId: `skeleton-${index}-${Date.now()}`,
        })).map((skeleton) => (
          <BlockCard key={skeleton.skeletonId} isLoading={true} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono">
        Error loading blocks: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 min-h-[400px]">
      {blocks.map((block) => (
        <BlockCard key={block.hash} block={block} />
      ))}
    </div>
  );
}
