import React from 'react';
import { BlockCard } from '@components/blocks/BlockCard';

export function BlocksList({ blocks, loading, maxBlocks = 5 }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 mb-12 min-h-[400px]">
        {Array.from({ length: maxBlocks }).map((_, index) => (
          <BlockCard key={index} isLoading={true} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mb-12 min-h-[400px]">
      {blocks.map((block) => (
        <BlockCard key={block.hash} block={block} />
      ))}
    </div>
  );
}
