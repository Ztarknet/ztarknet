import React from 'react';
import { BlockCard } from '@components/blocks/BlockCard';

export function BlocksList({ blocks, loading, maxBlocks = 5 }) {
  if (loading) {
    return (
      <div className="blocks-container">
        {Array.from({ length: maxBlocks }).map((_, index) => (
          <BlockCard key={index} isLoading={true} />
        ))}
      </div>
    );
  }

  return (
    <div className="blocks-container">
      {blocks.map((block) => (
        <BlockCard key={block.hash} block={block} />
      ))}
    </div>
  );
}
