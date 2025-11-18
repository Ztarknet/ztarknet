import React, { useState, useEffect, useCallback } from 'react';
import { TransactionCard } from './TransactionCard';
import { getRecentTransactions, getTransactionsByType } from '@services/zindex';

const FILTER_TAGS = [
  { id: 'all', label: 'All', description: 'All transactions' },
  { id: 'tze', label: 'TZE', description: 'TZE transactions' },
  { id: 't2t', label: 'T2T', description: 'Transparent to Transparent' },
  { id: 't2z', label: 'T2Z', description: 'Transparent to Shielded' },
  { id: 'z2t', label: 'Z2T', description: 'Shielded to Transparent' },
  { id: 'z2z', label: 'Z2Z', description: 'Shielded to Shielded' },
  { id: 'coinbase', label: 'Coinbase', description: 'Coinbase transactions' },
] as const;

type FilterTagId = typeof FILTER_TAGS[number]['id'];

interface TransactionsListProps {
  chainHeight: number;
}

export function TransactionsList({ chainHeight }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Single selection - default to 'all'
  const [selectedFilter, setSelectedFilter] = useState<FilterTagId>('all');

  // Fetch transactions from the API
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      let data;

      if (selectedFilter === 'all') {
        // Fetch all recent transactions
        data = await getRecentTransactions({ limit: 10 });
      } else {
        // Fetch transactions by specific type
        data = await getTransactionsByType({ type: selectedFilter, limit: 10 });
      }

      setTransactions(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [selectedFilter]);

  // Re-fetch when chain height changes (new block) or filter changes
  useEffect(() => {
    if (chainHeight > 0) {
      fetchTransactions();
    }
  }, [chainHeight, fetchTransactions]);

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handle tag click - single selection only
  const handleTagClick = (tagId: FilterTagId) => {
    setSelectedFilter(tagId);
  };

  return (
    <div>
      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        {FILTER_TAGS.map(tag => {
          const isSelected = selectedFilter === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.id)}
              title={tag.description}
              className={`
                text-[0.7rem] font-mono uppercase tracking-wider font-bold
                px-3 py-1.5 rounded-lg
                transition-all duration-200
                border
                ${isSelected
                  ? 'bg-accent text-background border-accent shadow-[0_0_12px_rgba(255,107,26,0.4)]'
                  : 'bg-background/50 text-muted border-[rgba(255,137,70,0.2)] hover:border-accent/50 hover:text-foreground'
                }
                cursor-pointer select-none
              `}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Error: {error}
        </div>
      )}

      {/* Transactions List */}
      <div className="flex flex-col gap-3 min-h-[400px]">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 10 }).map((_, index) => (
            <TransactionCard key={index} tx={null} isLoading={true} />
          ))
        ) : transactions.length > 0 ? (
          // Display transactions
          transactions.map(tx => (
            <TransactionCard key={tx.txid} tx={tx} />
          ))
        ) : (
          // Empty state
          <div className="py-20 px-8 text-center bg-card-bg border border-[rgba(255,137,70,0.2)] rounded-2xl">
            <p className="text-xl text-muted font-mono m-0">
              No {selectedFilter !== 'all' ? selectedFilter : ''} transactions found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
