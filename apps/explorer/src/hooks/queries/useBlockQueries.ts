'use client';

import { type BlockData, getBlock, getBlockCount, getBlockHash, getBlocks } from '@/services/rpc';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

/**
 * Hook to get the current chain height with automatic polling
 * Default: 30 seconds
 */
export function useChainHeight(pollInterval = 3000) {
  return useQuery({
    queryKey: ['chainHeight'],
    queryFn: getBlockCount,
    refetchInterval: pollInterval,
    staleTime: 5000,
  });
}

/**
 * Hook to get a single block by ID (hash or height)
 */
export function useBlock(blockId: string, verbosity = 2) {
  return useQuery({
    queryKey: ['block', blockId, verbosity],
    queryFn: async () => {
      let blockHash = blockId;

      // If blockId is a number (height), get the hash first
      if (/^\d+$/.test(blockId)) {
        blockHash = await getBlockHash(blockId);
      }

      return getBlock(blockHash, verbosity);
    },
    enabled: Boolean(blockId),
    staleTime: 60 * 1000, // Blocks don't change once confirmed
  });
}

/**
 * Hook to get recent blocks with automatic polling
 * Default: 30 seconds
 */
export function useRecentBlocks(initialCount = 7, pollInterval = 30000) {
  return useQuery({
    queryKey: ['recentBlocks', initialCount],
    queryFn: async () => {
      const blockCount = await getBlockCount();
      const startHeight = Math.max(0, blockCount - initialCount);
      const heights: number[] = [];

      for (let i = blockCount; i > startHeight; i--) {
        heights.push(i);
      }

      const blocks = await getBlocks(heights);
      return { blocks, chainHeight: blockCount };
    },
    refetchInterval: pollInterval,
    staleTime: 5000,
  });
}

/**
 * Hook for infinite loading of blocks (pagination)
 */
export function useInfiniteBlocks(pageSize = 7) {
  return useInfiniteQuery({
    queryKey: ['infiniteBlocks', pageSize],
    queryFn: async ({ pageParam }) => {
      const heights: number[] = [];
      const startHeight = pageParam;
      const endHeight = Math.max(1, startHeight - pageSize + 1);

      for (let i = startHeight; i >= endHeight; i--) {
        heights.push(i);
      }

      const blocks = await getBlocks(heights);
      return {
        blocks,
        nextCursor: endHeight > 1 ? endHeight - 1 : null,
      };
    },
    initialPageParam: 0, // Will be set after first query
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000,
  });
}

// Re-export types
export type { BlockData };
