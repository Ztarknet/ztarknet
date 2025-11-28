import { getBlockCount, getBlocks } from '@services/rpc';
import { useCallback, useEffect, useRef, useState } from 'react';

interface BlockData {
  hash: string;
  height: number;
  time: number;
  size: number;
  confirmations: number;
  version: number;
  merkleroot: string;
  tx: string[] | unknown[];
}

export function useBlockPolling(initialBlocks = 7, pollInterval = 1000) {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [chainHeight, setChainHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Track the highest and lowest block heights we've loaded
  const highestLoadedRef = useRef(0);
  const lowestLoadedRef = useRef(Number.POSITIVE_INFINITY);
  const isInitializedRef = useRef(false);

  // Initial fetch - get the last N blocks
  const initialFetch = useCallback(async () => {
    try {
      const blockCount = await getBlockCount();
      setChainHeight(blockCount);

      const startHeight = Math.max(0, blockCount - initialBlocks);
      const heights = [];

      for (let i = blockCount; i > startHeight; i--) {
        heights.push(i);
      }

      const fetchedBlocks = await getBlocks(heights);

      setBlocks(fetchedBlocks);
      highestLoadedRef.current = blockCount;
      lowestLoadedRef.current = startHeight + 1;
      isInitializedRef.current = true;
      setLoading(false);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error fetching blocks:', err.message);
        setError(err.message);
      } else {
        console.error('Error fetching blocks:', err);
        setError('Failed to fetch blocks');
      }
      setLoading(false);
    }
  }, [initialBlocks]);

  // Poll for new blocks only - prepend to existing list
  const pollForNewBlocks = useCallback(async () => {
    if (!isInitializedRef.current) return;

    try {
      const blockCount = await getBlockCount();
      setChainHeight(blockCount);

      // If there are new blocks, fetch only those
      if (blockCount > highestLoadedRef.current) {
        const heights = [];
        for (let i = blockCount; i > highestLoadedRef.current; i--) {
          heights.push(i);
        }

        const newBlocks = await getBlocks(heights);

        // Prepend new blocks to existing blocks
        setBlocks((prevBlocks) => [...newBlocks, ...prevBlocks]);
        highestLoadedRef.current = blockCount;
      }

      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error polling blocks:', err.message);
        setError(err.message);
      } else {
        console.error('Error polling blocks:', err);
        setError('Failed to poll for blocks');
      }
    }
  }, []);

  // Load more older blocks (pagination)
  const loadMore = useCallback(
    async (count = 7) => {
      if (loadingMore || lowestLoadedRef.current <= 1) return;

      setLoadingMore(true);
      try {
        const endHeight = lowestLoadedRef.current - 1;
        const startHeight = Math.max(1, endHeight - count + 1);
        const heights = [];

        for (let i = endHeight; i >= startHeight; i--) {
          heights.push(i);
        }

        if (heights.length === 0) {
          setLoadingMore(false);
          return;
        }

        const olderBlocks = await getBlocks(heights);

        // Append older blocks to existing blocks
        setBlocks((prevBlocks) => [...prevBlocks, ...olderBlocks]);
        lowestLoadedRef.current = startHeight;
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error loading more blocks:', err.message);
          setError(err.message);
        } else {
          console.error('Error loading more blocks:', err);
          setError('Failed to load more blocks');
        }
      } finally {
        setLoadingMore(false);
      }
    },
    [loadingMore]
  );

  // Check if there are more blocks to load
  const hasMore = lowestLoadedRef.current > 1;

  // Initial fetch
  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  // Polling for new blocks
  useEffect(() => {
    const interval = setInterval(pollForNewBlocks, pollInterval);
    return () => clearInterval(interval);
  }, [pollForNewBlocks, pollInterval]);

  return { blocks, chainHeight, loading, loadingMore, error, loadMore, hasMore };
}

// Simple hook for just chain height (used by MainPage stats)
export function useChainHeight(pollInterval = 1000) {
  const [chainHeight, setChainHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeight() {
      try {
        const height = await getBlockCount();
        setChainHeight(height);
        setLoading(false);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching chain height:', err.message);
          setError(err.message);
        } else {
          console.error('Error fetching chain height:', err);
          setError('Failed to fetch chain height');
        }
        setLoading(false);
      }
    }

    fetchHeight();
    const interval = setInterval(fetchHeight, pollInterval);
    return () => clearInterval(interval);
  }, [pollInterval]);

  return { chainHeight, loading, error };
}
