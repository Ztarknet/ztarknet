'use client';

import { BlockCard } from '@/components/blocks/BlockCard';
import { useRecentBlocks } from '@/hooks/queries/useBlockQueries';
import { type BlockData, getBlocks } from '@/services/rpc';
import { useCallback, useRef, useState } from 'react';

const PAGE_SIZE = 7;

interface BlocksListProps {
  initialBlocks?: number;
}

export function BlocksList({ initialBlocks = PAGE_SIZE }: BlocksListProps) {
  const { data, isLoading, error } = useRecentBlocks(initialBlocks);
  const [additionalBlocks, setAdditionalBlocks] = useState<BlockData[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const lowestLoadedRef = useRef<number | null>(null);

  const blocks = data?.blocks ?? [];

  // Track the lowest block height from initial data
  if (blocks.length > 0 && lowestLoadedRef.current === null) {
    const heights = blocks.map((b) => b.height);
    lowestLoadedRef.current = Math.min(...heights);
  }

  const hasMore = lowestLoadedRef.current !== null && lowestLoadedRef.current > 1;

  const loadMore = useCallback(async () => {
    if (loadingMore || !lowestLoadedRef.current || lowestLoadedRef.current <= 1) return;

    setLoadingMore(true);
    try {
      const endHeight = lowestLoadedRef.current - 1;
      const startHeight = Math.max(1, endHeight - PAGE_SIZE + 1);
      const heights: number[] = [];

      for (let i = endHeight; i >= startHeight; i--) {
        heights.push(i);
      }

      if (heights.length === 0) {
        setLoadingMore(false);
        return;
      }

      const olderBlocks = await getBlocks(heights);
      setAdditionalBlocks((prev) => [...prev, ...olderBlocks]);
      lowestLoadedRef.current = startHeight;
    } catch (err) {
      console.error('Error loading more blocks:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore]);

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

  const allBlocks = [...blocks, ...additionalBlocks];

  return (
    <div className="flex flex-col gap-3 min-h-[400px]">
      {allBlocks.map((block) => (
        <BlockCard key={block.hash} block={block} />
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="mt-4 px-6 py-3 rounded-xl border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] hover:bg-[rgba(255,137,70,0.1)] hover:border-[rgba(255,137,70,0.5)] transition-all duration-200 text-accent-strong font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingMore ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Loading"
              >
                <title>Loading</title>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </span>
          ) : (
            'Load More Blocks'
          )}
        </button>
      )}
    </div>
  );
}
