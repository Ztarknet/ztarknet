import React from 'react';
import { BlockCard } from '@components/blocks/BlockCard';
import { useBlockPolling } from '@hooks/useBlockPolling';

const PAGE_SIZE = 7;

export function BlocksList({ initialBlocks = PAGE_SIZE }) {
  const { blocks, loading, loadingMore, error, loadMore, hasMore } = useBlockPolling(initialBlocks);

  if (loading) {
    return (
      <div className="flex flex-col gap-3 min-h-[400px]">
        {Array.from({ length: initialBlocks }).map((_, index) => (
          <BlockCard key={index} isLoading={true} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono">
        Error loading blocks: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 min-h-[400px]">
      {blocks.map((block) => (
        <BlockCard key={block.hash} block={block} />
      ))}

      {hasMore && (
        <button
          onClick={() => loadMore(PAGE_SIZE)}
          disabled={loadingMore}
          className="mt-4 px-6 py-3 rounded-xl border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] hover:bg-[rgba(255,137,70,0.1)] hover:border-[rgba(255,137,70,0.5)] transition-all duration-200 text-accent-strong font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingMore ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
