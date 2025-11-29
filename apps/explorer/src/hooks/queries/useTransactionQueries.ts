'use client';

import { getRawTransaction } from '@/services/rpc';
import { getRecentTransactions, getTransaction, getTransactionsByType } from '@/services/zindex';
import { useQuery } from '@tanstack/react-query';

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

// Re-export types
export type { TransactionData };
