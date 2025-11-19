import { useState, useEffect, useRef, useCallback } from 'react';
import { getBlockCount, getBlocks } from '@services/rpc';

export function useBlockPolling(initialBlocks = 7, pollInterval = 1000) {
  const [blocks, setBlocks] = useState([]);
  const [chainHeight, setChainHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Track the highest and lowest block heights we've loaded
  const highestLoadedRef = useRef(0);
  const lowestLoadedRef = useRef(Infinity);
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
    } catch (err) {
      console.error('Error fetching blocks:', err);
      setError(err.message);
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
        setBlocks(prevBlocks => [...newBlocks, ...prevBlocks]);
        highestLoadedRef.current = blockCount;
      }

      setError(null);
    } catch (err) {
      console.error('Error polling blocks:', err);
      setError(err.message);
    }
  }, []);

  // Load more older blocks (pagination)
  const loadMore = useCallback(async (count = 7) => {
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
      setBlocks(prevBlocks => [...prevBlocks, ...olderBlocks]);
      lowestLoadedRef.current = startHeight;
      setError(null);
    } catch (err) {
      console.error('Error loading more blocks:', err);
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore]);

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
  const [chainHeight, setChainHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHeight() {
      try {
        const height = await getBlockCount();
        setChainHeight(height);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching chain height:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchHeight();
    const interval = setInterval(fetchHeight, pollInterval);
    return () => clearInterval(interval);
  }, [pollInterval]);

  return { chainHeight, loading, error };
}
