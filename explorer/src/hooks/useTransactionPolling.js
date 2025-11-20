import { useState, useEffect, useRef, useCallback } from 'react';
import { getRecentTransactions, getTransactionsByType } from '@services/zindex';

export function useTransactionPolling(
  filter = 'all',
  initialCount = 10,
  pollInterval = 2000
) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Track the highest block height we've seen for detecting new transactions
  const highestBlockRef = useRef(0);
  const isInitializedRef = useRef(false);
  const currentOffsetRef = useRef(0);

  // Fetch transactions based on filter (can be 'all', single type, or comma-separated types)
  const fetchTransactions = useCallback(async (offset = 0, limit = initialCount) => {
    if (filter === 'all' || !filter) {
      return getRecentTransactions({ limit, offset });
    } else {
      // Filter can be a single type or comma-separated types (e.g., "tze,t2t,t2z")
      return getTransactionsByType({ type: filter, limit, offset });
    }
  }, [filter, initialCount]);

  // Initial fetch
  const initialFetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTransactions(0, initialCount);
      const txList = data || [];

      setTransactions(txList);
      currentOffsetRef.current = txList.length;

      // Track the highest block height
      if (txList.length > 0) {
        highestBlockRef.current = Math.max(...txList.map(tx => tx.block_height || 0));
      }

      isInitializedRef.current = true;
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, initialCount]);

  // Poll for new transactions - check if there are newer ones
  const pollForNewTransactions = useCallback(async () => {
    if (!isInitializedRef.current) return;

    try {
      // Fetch the latest transactions
      const data = await fetchTransactions(0, initialCount);
      const latestTxs = data || [];

      if (latestTxs.length === 0) return;

      // Find transactions that are newer than what we have
      const currentTxIds = new Set(transactions.map(tx => tx.txid));
      const newTxs = latestTxs.filter(tx => !currentTxIds.has(tx.txid));

      if (newTxs.length > 0) {
        // Prepend new transactions
        setTransactions(prev => [...newTxs, ...prev]);
        currentOffsetRef.current += newTxs.length;

        // Update highest block
        const newHighest = Math.max(...newTxs.map(tx => tx.block_height || 0));
        if (newHighest > highestBlockRef.current) {
          highestBlockRef.current = newHighest;
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error polling transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to poll transactions');
    }
  }, [fetchTransactions, initialCount, transactions]);

  // Load more older transactions (pagination)
  const loadMore = useCallback(async (count = 10) => {
    if (loadingMore) return;

    setLoadingMore(true);
    try {
      const olderTxs = await fetchTransactions(currentOffsetRef.current, count);
      const txList = olderTxs || [];

      if (txList.length > 0) {
        // Filter out any duplicates (in case of overlapping data)
        const currentTxIds = new Set(transactions.map(tx => tx.txid));
        const uniqueOlderTxs = txList.filter(tx => !currentTxIds.has(tx.txid));

        if (uniqueOlderTxs.length > 0) {
          setTransactions(prev => [...prev, ...uniqueOlderTxs]);
          currentOffsetRef.current += uniqueOlderTxs.length;
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error loading more transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load more transactions');
    } finally {
      setLoadingMore(false);
    }
  }, [fetchTransactions, loadingMore, transactions]);

  // Reset when filter changes
  useEffect(() => {
    isInitializedRef.current = false;
    highestBlockRef.current = 0;
    currentOffsetRef.current = 0;
    setTransactions([]);
    initialFetch();
  }, [filter, initialFetch]);

  // Polling for new transactions
  useEffect(() => {
    if (!isInitializedRef.current) return;

    const interval = setInterval(pollForNewTransactions, pollInterval);
    return () => clearInterval(interval);
  }, [pollForNewTransactions, pollInterval]);

  return { transactions, loading, loadingMore, error, loadMore };
}
