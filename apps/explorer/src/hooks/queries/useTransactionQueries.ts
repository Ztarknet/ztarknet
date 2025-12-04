'use client';

import { getRawTransaction } from '@/services/rpc';
import {
  countStarkProofs,
  countTransactions,
  getRecentTransactions,
  getTransaction,
  getTransactionsByType,
} from '@/services/zindex';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

interface TransactionData {
  txid: string;
  block_height?: number;
  [key: string]: unknown;
}

/**
 * Hook to get a single transaction by txid from RPC
 * verbosity: 1 returns decoded transaction
 */
export function useTransaction(txid: string, verbosity = 1) {
  return useQuery({
    queryKey: ['transaction', txid, verbosity],
    queryFn: () => getRawTransaction(txid, verbosity),
    enabled: Boolean(txid),
    staleTime: 60 * 1000, // Transactions don't change once confirmed
  });
}

/**
 * Hook to get a single transaction from Zindex
 */
export function useZindexTransaction(txid: string) {
  return useQuery({
    queryKey: ['zindexTransaction', txid],
    queryFn: () => getTransaction(txid),
    enabled: Boolean(txid),
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to get recent transactions with polling
 * Default: 30 seconds
 */
export function useRecentTransactions(filter = 'all', count = 10, pollInterval = 3000) {
  return useQuery<TransactionData[]>({
    queryKey: ['recentTransactions', filter, count],
    queryFn: async () => {
      if (filter === 'all') {
        return getRecentTransactions({ limit: count, offset: 0 }) as Promise<TransactionData[]>;
      }
      return getTransactionsByType({ type: filter, limit: count, offset: 0 }) as Promise<
        TransactionData[]
      >;
    },
    refetchInterval: pollInterval,
    staleTime: 1000,
  });
}

/**
 * Hook to get total transaction count
 * Default: 30 seconds polling
 */
export function useTransactionCount(pollInterval = 30000) {
  return useQuery({
    queryKey: ['transactionCount'],
    queryFn: async () => {
      const result = await countTransactions();
      return result?.count ?? 0;
    },
    refetchInterval: pollInterval,
    staleTime: 10000,
  });
}

/**
 * Hook to get total STARK proofs count
 * Default: 30 seconds polling
 */
export function useStarkProofsCount(pollInterval = 30000) {
  return useQuery({
    queryKey: ['starkProofsCount'],
    queryFn: async () => {
      const result = await countStarkProofs();
      return result?.count ?? 0;
    },
    refetchInterval: pollInterval,
    staleTime: 10000,
  });
}

/**
 * Hook for infinite loading of transactions (pagination)
 */
export function useInfiniteTransactions(filter = 'all', pageSize = 10) {
  return useInfiniteQuery({
    queryKey: ['infiniteTransactions', filter, pageSize],
    queryFn: async ({ pageParam = 0 }) => {
      const fetchFn =
        filter === 'all'
          ? () => getRecentTransactions({ limit: pageSize, offset: pageParam })
          : () => getTransactionsByType({ type: filter, limit: pageSize, offset: pageParam });

      const transactions = (await fetchFn()) as TransactionData[];
      return {
        transactions,
        nextOffset: transactions.length === pageSize ? pageParam + pageSize : null,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    refetchInterval: 3000,
    staleTime: 1000,
  });
}

// Re-export types
export type { TransactionData };
