import { StatCard } from '@components/common/StatCard';
import { TransactionCard } from '@components/transactions/TransactionCard';
import { useRevealOnScroll } from '@hooks/useRevealOnScroll';
import { getRawTransaction } from '@services/rpc';
import {
  getAccount,
  getAccountTransactionCount,
  getAccountTransactions,
} from '@services/zindex/accounts';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import type { RpcTransaction } from '../types/transaction';
import type { AccountData, Transaction } from '../types/zindex';

interface BalanceHistoryPoint {
  index: number;
  balance: number;
  label?: string;
  txid?: string;
  blockHeight?: number;
}

interface BalanceChartProps {
  data: BalanceHistoryPoint[];
  isLoading?: boolean;
}

// Simple SVG Line Chart Component for Balance History
function BalanceChart({ data, isLoading = false }: BalanceChartProps) {
  if (isLoading || !data || data.length === 0) {
    return (
      <div className="w-full h-[300px] border border-[rgba(255,137,70,0.2)] rounded-2xl bg-[rgba(8,8,12,0.9)] flex items-center justify-center">
        <span className="text-muted font-mono text-sm">
          {isLoading ? 'Loading balance history...' : 'No balance history available'}
        </span>
      </div>
    );
  }

  const width = 800;
  const height = 250;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const balances = data.map((d: BalanceHistoryPoint) => d.balance);
  const maxBalance = Math.max(...balances);
  const minBalance = Math.min(...balances);
  const balanceRange = maxBalance - minBalance || 1;

  // Generate points
  const points = data.map((d: BalanceHistoryPoint, i: number) => {
    const x = padding.left + (i / (data.length - 1 || 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.balance - minBalance) / balanceRange) * chartHeight;
    return { x, y, ...d };
  });

  // Create SVG path
  const linePath = points
    .map((p: (typeof points)[0], i: number) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Create area path for gradient fill
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  return (
    <div className="w-full border border-[rgba(255,137,70,0.2)] rounded-2xl bg-[rgba(8,8,12,0.9)] p-6 overflow-hidden">
      <h3 className="text-sm font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-4">
        Balance Over Time
      </h3>
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[600px]"
          aria-label="Balance history chart"
          role="img"
        >
          <defs>
            <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 107, 26, 0.3)" />
              <stop offset="100%" stopColor="rgba(255, 107, 26, 0)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio: number) => (
            <line
              key={ratio}
              x1={padding.left}
              y1={padding.top + chartHeight * (1 - ratio)}
              x2={width - padding.right}
              y2={padding.top + chartHeight * (1 - ratio)}
              stroke="rgba(255, 137, 70, 0.1)"
              strokeDasharray="4,4"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 0.5, 1].map((ratio: number) => (
            <text
              key={ratio}
              x={padding.left - 10}
              y={padding.top + chartHeight * (1 - ratio)}
              textAnchor="end"
              alignmentBaseline="middle"
              className="fill-[rgba(255,137,70,0.64)]"
              fontSize="10"
              fontFamily="monospace"
            >
              {(minBalance + balanceRange * ratio).toFixed(2)}
            </text>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#balanceGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#ff6b1a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p: (typeof points)[0]) => (
            <circle
              key={`point-${p.x}-${p.y}`}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#ff6b1a"
              stroke="rgba(8, 8, 12, 0.9)"
              strokeWidth="2"
            />
          ))}

          {/* X-axis label */}
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            className="fill-[rgba(255,137,70,0.64)]"
            fontSize="10"
            fontFamily="monospace"
          >
            Transaction History
          </text>
        </svg>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

interface AccountPageProps {
  address: string;
}

export function AccountPage({ address }: AccountPageProps) {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [transactions, setTransactions] = useState<RpcTransaction[]>([]);
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistoryPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useRevealOnScroll();

  useEffect(() => {
    async function fetchAccount() {
      try {
        setLoading(true);
        setError(null);

        // Fetch account data
        let accountData: Awaited<ReturnType<typeof getAccount>> | undefined;
        try {
          accountData = await getAccount(address);
        } catch (e) {
          throw new Error(`Account not found: ${address}`);
        }

        if (!accountData) {
          throw new Error('Invalid account data received from API');
        }

        setAccount(accountData);

        // Fetch transaction count
        try {
          const countData = await getAccountTransactionCount(address);
          setTransactionCount(typeof countData === 'number' ? countData : countData?.count || 0);
        } catch (countError) {
          // Transaction count endpoint may not be available, default to 0
          setTransactionCount(0);
        }

        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching account:', err.message);
          setError(err.message);
        } else {
          console.error('Error fetching account:', err);
          setError('Failed to load account data');
        }
        setLoading(false);
      }
    }

    fetchAccount();
  }, [address]);

  // Calculate balance change for a transaction (from full RPC tx data)
  const calculateTxBalanceChange = useCallback((tx: RpcTransaction, accountAddress: string) => {
    let received = 0;
    const sent = 0;

    // Calculate received: sum of outputs going to this address
    if (tx.vout) {
      for (const output of tx.vout) {
        if (output.scriptPubKey?.addresses?.includes(accountAddress)) {
          received += output.value || 0;
        }
      }
    }

    // Calculate sent: sum of inputs from this address
    // Note: For coinbase txs, vin[0].coinbase exists and there's no address
    // For regular txs, we'd need to look up the previous tx output (complex)
    // For now, we can estimate sent by checking if any vin references this address
    // But since we don't have that data readily, we'll use a simpler approach:
    // If it's a 'send' type from zindex, the sent amount ≈ total input - change back

    // For simplicity, return the net change (received is in ZEC, convert to zatoshis)
    return {
      received: Math.round(received * 100000000),
      sent: Math.round(sent * 100000000),
    };
  }, []);

  // Calculate balance history from current balance going backwards
  const calculateBalanceHistory = useCallback(
    (
      currentBalance: number,
      fullTxList: RpcTransaction[],
      accountAddress: string
    ): BalanceHistoryPoint[] => {
      if (!fullTxList || fullTxList.length === 0) return [];

      // Sort transactions from newest to oldest (most recent first)
      const sortedTxs = [...fullTxList].sort(
        (a: RpcTransaction, b: RpcTransaction) => (b.height || 0) - (a.height || 0)
      );

      // Start from current balance and work backwards
      const history: BalanceHistoryPoint[] = [];
      let balance = currentBalance;

      // Add current balance as the rightmost point
      history.unshift({
        index: sortedTxs.length,
        balance: balance / 100000000, // Convert zatoshis to ZEC
        label: 'Current',
      });

      // Work backwards through transactions
      sortedTxs.forEach((tx: RpcTransaction, i: number) => {
        // Calculate balance change from full transaction data
        const { received, sent } = calculateTxBalanceChange(tx, accountAddress);

        // Reverse the transaction effect to get prior balance
        balance = balance - received + sent;

        history.unshift({
          index: sortedTxs.length - 1 - i,
          balance: balance / 100000000,
          txid: tx.txid,
          blockHeight: tx.height,
        });
      });

      return history;
    },
    [calculateTxBalanceChange]
  );

  // Fetch initial transactions for this account
  useEffect(() => {
    async function fetchTransactions() {
      if (!account) {
        setLoadingTransactions(false);
        return;
      }

      try {
        setLoadingTransactions(true);
        setOffset(0);

        // Fetch first page of account transactions from zindex
        const txData = await getAccountTransactions({ address, limit: PAGE_SIZE, offset: 0 });
        const txList: Transaction[] = Array.isArray(txData) ? txData : [];

        if (txList.length === 0) {
          setTransactions([]);
          setBalanceHistory([]);
          setHasMore(false);
          setLoadingTransactions(false);
          return;
        }

        // Check if there are more transactions (if we got a full page, assume there's more)
        setHasMore(txList.length === PAGE_SIZE);

        // Extract unique txids and fetch full transaction details
        const txids = [...new Set(txList.map((tx: Transaction) => tx.txid))];

        // Fetch each transaction's full details from RPC
        const txPromises = txids.map((txid: string) =>
          getRawTransaction(txid).catch((err: unknown) => {
            if (err instanceof Error) {
              console.error(`Error fetching transaction ${txid}:`, err.message);
            } else {
              console.error(`Error fetching transaction ${txid}:`, err);
            }
            return null;
          })
        );

        const fullTxData = await Promise.all(txPromises);

        // Filter out null values and sort by block height (most recent first)
        const validTxs = fullTxData.filter((tx): tx is RpcTransaction => tx !== null);
        validTxs.sort((a: RpcTransaction, b: RpcTransaction) => (b.height || 0) - (a.height || 0));

        setTransactions(validTxs);
        setOffset(PAGE_SIZE);

        // Calculate balance history from current balance going backwards
        // Use full transaction data from RPC (validTxs) not zindex summary (txList)
        const currentBalance = account.balance ?? account.balance_zatoshis ?? 0;
        const history = calculateBalanceHistory(currentBalance, validTxs, address);
        setBalanceHistory(history);

        setLoadingTransactions(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('[AccountPage] Error fetching transactions:', err.message);
        } else {
          console.error('[AccountPage] Error fetching transactions:', err);
        }
        setLoadingTransactions(false);
      }
    }

    fetchTransactions();
  }, [account, address, calculateBalanceHistory]);

  // Load more transactions
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      // Fetch next page
      const txData = await getAccountTransactions({ address, limit: PAGE_SIZE, offset });
      const txList: Transaction[] = Array.isArray(txData) ? txData : [];

      if (txList.length === 0) {
        setHasMore(false);
        setLoadingMore(false);
        return;
      }

      // Check if there are more transactions (if we got a full page, assume there's more)
      setHasMore(txList.length === PAGE_SIZE);

      // Extract unique txids and fetch full transaction details
      const txids = [...new Set(txList.map((tx: Transaction) => tx.txid))];

      const txPromises = txids.map((txid: string) =>
        getRawTransaction(txid).catch((err: unknown) => {
          if (err instanceof Error) {
            console.error(`Error fetching transaction ${txid}:`, err.message);
          } else {
            console.error(`Error fetching transaction ${txid}:`, err);
          }
          return null;
        })
      );

      const fullTxData = await Promise.all(txPromises);
      const validTxs = fullTxData.filter((tx): tx is RpcTransaction => tx !== null);
      validTxs.sort((a: RpcTransaction, b: RpcTransaction) => (b.height || 0) - (a.height || 0));

      // Append to existing transactions
      setTransactions((prev: RpcTransaction[]) => [...prev, ...validTxs]);
      setOffset((prev: number) => prev + PAGE_SIZE);

      setLoadingMore(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('[AccountPage] Error loading more transactions:', err.message);
      } else {
        console.error('[AccountPage] Error loading more transactions:', err);
      }
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom section-padding flex-1">
        <div className="mb-6 flex flex-row flex-wrap justify-between items-center gap-3">
          <a
            href="#/"
            className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
          >
            ← Back to Blocks
          </a>
        </div>

        <h2 className="heading-section mb-6 skeleton-text">Loading Account...</h2>

        {/* Skeleton address display */}
        <div className="mb-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">
              Address
            </span>
            <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block skeleton-text">
              Loading...
            </code>
          </div>
        </div>

        {/* Skeleton stat cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 min-h-40">
          <StatCard label="Created At" value="---" description="Loading..." isLoading={true} />
          <StatCard label="Account Balance" value="---" description="ZEC" isLoading={true} />
          <StatCard
            label="Total Transactions"
            value="---"
            description="Loading..."
            isLoading={true}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom section-padding flex-1">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Error: {error}
          <br />
          <a
            href="#/"
            className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.4)] text-foreground hover:border-accent hover:-translate-y-0.5 mt-5"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="container-custom section-padding flex-1">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Account not found
        </div>
      </div>
    );
  }

  // Format created at date
  const createdAt = account.first_seen_at
    ? new Date(account.first_seen_at).toLocaleString()
    : account.first_seen_height
      ? `Block #${account.first_seen_height}`
      : 'Unknown';

  // Format balance (convert from zatoshis to ZEC)
  const balanceZatoshis = account.balance ?? account.balance_zatoshis ?? 0;
  const balance = (balanceZatoshis / 100000000).toFixed(2);

  // Get transaction count
  const txCount = transactionCount;

  return (
    <div className="container-custom section-padding flex-1">
      <div className="mb-6 flex flex-row flex-wrap justify-between items-center gap-3">
        <a
          href="#/"
          className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
        >
          ← Back to Blocks
        </a>
      </div>

      {/* Account Title */}
      <h2 className="heading-section mb-6">Account</h2>

      {/* Address Display */}
      <div className="mb-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">
            Address
          </span>
          <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block">
            {address}
          </code>
        </div>
      </div>

      {/* Account Statistics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 min-h-40">
        <StatCard label="Created At" value={createdAt} description="First seen on chain" />
        <StatCard label="Account Balance" value={balance} description="ZEC" />
        <StatCard
          label="Total Transactions"
          value={txCount.toLocaleString()}
          description="Transactions involving this account"
        />
      </div>

      {/* Balance History Chart */}
      <div className="mb-12">
        <BalanceChart data={balanceHistory} isLoading={loadingTransactions} />
      </div>

      {/* Transactions List */}
      <h2 className="heading-section mb-6">
        {transactions.length}
        {txCount > transactions.length ? ` of ${txCount}` : ''} Transaction
        {transactions.length !== 1 ? 's' : ''}
      </h2>
      <div className="flex flex-col gap-4">
        {loadingTransactions ? (
          // Loading skeletons
          Array.from({ length: 3 }, (_, index: number) => ({
            skeletonId: `skeleton-${index}-${Date.now()}`,
          })).map((skeleton) => (
            <TransactionCard key={skeleton.skeletonId} tx={{} as RpcTransaction} isLoading={true} />
          ))
        ) : transactions.length > 0 ? (
          <>
            {transactions.map((tx: RpcTransaction) => (
              <TransactionCard key={tx.txid} tx={tx} />
            ))}

            {hasMore && (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="mt-4 px-6 py-3 rounded-xl border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] hover:bg-[rgba(255,137,70,0.1)] hover:border-[rgba(255,137,70,0.5)] transition-all duration-200 text-accent-strong font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      aria-label="Loading"
                      role="img"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'Load More Transactions'
                )}
              </button>
            )}
          </>
        ) : (
          <div className="py-20 px-8 text-center bg-[rgba(8,8,12,0.9)] border border-[rgba(255,137,70,0.2)] rounded-2xl">
            <p className="text-xl text-muted font-mono m-0">
              No transactions found for this account
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
