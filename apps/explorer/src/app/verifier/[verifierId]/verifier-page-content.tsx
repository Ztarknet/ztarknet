'use client';

import { StatCard } from '@/components/common/StatCard';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { getRawTransaction } from '@/services/rpc';
import {
  countStarkProofs,
  getRecentFacts,
  getStarkProofsByVerifier,
  getSumProofSizesByVerifier,
  getVerifier,
  getVerifierByName,
} from '@/services/zindex/starks';
import type { RpcTransaction } from '@/types/transaction';
import type { StarkProof, VerifierData, ZtarknetFact } from '@/types/zindex';
import { formatZEC } from '@/utils/formatters';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 10;

interface VerifierPageContentProps {
  verifierId: string;
}

export function VerifierPageContent({ verifierId }: VerifierPageContentProps) {
  const [verifier, setVerifier] = useState<VerifierData | null>(null);
  const [proofs, setProofs] = useState<StarkProof[]>([]);
  const [latestFact, setLatestFact] = useState<ZtarknetFact | null>(null);
  const [transactions, setTransactions] = useState<RpcTransaction[]>([]);
  const [totalProofCount, setTotalProofCount] = useState<number>(0);
  const [totalProofSizeMB, setTotalProofSizeMB] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [loadingMoreProofs, setLoadingMoreProofs] = useState<boolean>(false);
  const [proofsOffset, setProofsOffset] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Track which transaction IDs we've already fetched to avoid refetching
  const fetchedTxIdsRef = useRef(new Set<string>());

  useRevealOnScroll();

  // Calculate if all proofs are loaded
  const allProofsLoaded = totalProofCount > 0 && proofs.length >= totalProofCount;
  // Total TZE count is proofs + 1 for init transaction
  const totalTzeCount = totalProofCount + 1;

  useEffect(() => {
    async function fetchVerifier() {
      try {
        setLoading(true);
        setError(null);

        // Reset state for new verifier
        fetchedTxIdsRef.current.clear();
        setTransactions([]);
        setProofs([]);
        setProofsOffset(0);

        // Determine if verifierId looks like a name (starts with "verifier_") or an ID
        const isName = verifierId.startsWith('verifier_');

        let verifierData: Awaited<ReturnType<typeof getVerifierByName>> | undefined;
        if (isName) {
          // Fetch by name first
          try {
            verifierData = await getVerifierByName(verifierId);
          } catch {
            // Fall back to ID if name fails
            verifierData = await getVerifier(verifierId);
          }
        } else {
          // Fetch by ID first
          try {
            verifierData = await getVerifier(verifierId);
          } catch {
            // Fall back to name if ID fails
            verifierData = await getVerifierByName(verifierId);
          }
        }

        if (!verifierData || !verifierData.verifier_id) {
          throw new Error(`Verifier not found: ${verifierId}`);
        }

        setVerifier(verifierData);

        // Fetch total proof count for this verifier first
        let proofCount = 0;
        try {
          const countData = await countStarkProofs({ verifier_id: verifierData.verifier_id });
          proofCount = countData?.count || 0;
          setTotalProofCount(proofCount);
        } catch (countError: unknown) {
          if (countError instanceof Error) {
            console.error('Error fetching proof count:', countError.message);
          } else {
            console.error('Error fetching proof count:', countError);
          }
          setTotalProofCount(0);
        }

        // Fetch initial page of proofs for this verifier
        try {
          const proofsData = await getStarkProofsByVerifier(verifierData.verifier_id, {
            limit: PAGE_SIZE,
            offset: 0,
          });
          setProofs(Array.isArray(proofsData) ? proofsData : []);
          setProofsOffset(PAGE_SIZE);
        } catch (proofsError: unknown) {
          if (proofsError instanceof Error) {
            console.error('Error fetching proofs:', proofsError.message);
          } else {
            console.error('Error fetching proofs:', proofsError);
          }
          setProofs([]);
        }

        // Fetch total proof sizes for this verifier
        try {
          const sumData = await getSumProofSizesByVerifier(verifierData.verifier_id);
          const totalBytes = sumData?.total_size || 0;
          setTotalProofSizeMB(totalBytes / (1024 * 1024));
        } catch (sumError: unknown) {
          if (sumError instanceof Error) {
            console.error('Error fetching proof sizes:', sumError.message);
          } else {
            console.error('Error fetching proof sizes:', sumError);
          }
          setTotalProofSizeMB(0);
        }

        // Fetch recent facts for this verifier (to get program hashes and state root)
        try {
          const factsData = await getRecentFacts({ limit: 1 });
          if (Array.isArray(factsData) && factsData.length > 0) {
            const firstFact = factsData[0];
            setLatestFact(firstFact ?? null);
          } else {
            setLatestFact(null);
          }
        } catch (factsError: unknown) {
          if (factsError instanceof Error) {
            console.error('Error fetching facts:', factsError.message);
          } else {
            console.error('Error fetching facts:', factsError);
          }
          setLatestFact(null);
        }

        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching verifier:', err.message);
          setError(err.message);
        } else {
          console.error('Error fetching verifier:', err);
          setError('Failed to load verifier data');
        }
        setLoading(false);
      }
    }

    fetchVerifier();
  }, [verifierId]);

  // Fetch transactions for each proof + init transaction
  useEffect(() => {
    async function fetchTransactions() {
      if (!verifier) {
        setLoadingTransactions(false);
        return;
      }

      try {
        setLoadingTransactions(true);

        // Parse verifier_id to get init transaction (format: <txid>:<output_idx>)
        const initTxId = verifier.verifier_id ? verifier.verifier_id.split(':')[0] : null;

        // Get unique transaction IDs from proofs
        const proofTxIds = proofs.map((proof: StarkProof) => proof.txid);

        // Combine init tx + proof txs (removing duplicates)
        const allTxIds = initTxId
          ? [...new Set([initTxId, ...proofTxIds])]
          : [...new Set(proofTxIds)];

        // Filter to only fetch txIds we haven't already fetched
        const txIdsToFetch = allTxIds.filter((txid) => !fetchedTxIdsRef.current.has(txid));

        if (txIdsToFetch.length === 0) {
          setLoadingTransactions(false);
          return;
        }

        // Fetch each transaction
        const txPromises = txIdsToFetch.map((txid: string) =>
          getRawTransaction(txid).catch((err: unknown) => {
            if (err instanceof Error) {
              console.error(`Error fetching transaction ${txid}:`, err.message);
            } else {
              console.error(`Error fetching transaction ${txid}:`, err);
            }
            return null;
          })
        );

        const txData = await Promise.all(txPromises);

        // Filter out null values and mark as fetched
        const validNewTxs = txData.filter((tx): tx is RpcTransaction => {
          if (tx !== null) {
            fetchedTxIdsRef.current.add(tx.txid);
            return true;
          }
          return false;
        });

        // Append new transactions to existing ones
        setTransactions((prev) => {
          const combined = [...prev, ...validNewTxs];

          // Sort by block height (most recent first), with init transaction at the bottom
          combined.sort((a: RpcTransaction, b: RpcTransaction) => {
            const aIsInit = a.txid === initTxId;
            const bIsInit = b.txid === initTxId;

            // If one is init and other isn't, init goes to bottom
            if (aIsInit && !bIsInit) return 1;
            if (!aIsInit && bIsInit) return -1;

            // Otherwise sort by block height (most recent first)
            return (b.height || 0) - (a.height || 0);
          });

          return combined;
        });

        setLoadingTransactions(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching transactions:', err.message);
        } else {
          console.error('Error fetching transactions:', err);
        }
        setLoadingTransactions(false);
      }
    }

    fetchTransactions();
  }, [verifier, proofs]);

  // Load more proofs function
  const loadMoreProofs = useCallback(async () => {
    if (!verifier || loadingMoreProofs || allProofsLoaded) return;

    try {
      setLoadingMoreProofs(true);

      const moreProofs = await getStarkProofsByVerifier(verifier.verifier_id, {
        limit: PAGE_SIZE,
        offset: proofsOffset,
      });

      if (Array.isArray(moreProofs) && moreProofs.length > 0) {
        // Append new proofs
        setProofs((prev) => [...prev, ...moreProofs]);
        setProofsOffset((prev) => prev + PAGE_SIZE);
      }

      setLoadingMoreProofs(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error loading more proofs:', err.message);
      } else {
        console.error('Error loading more proofs:', err);
      }
      setLoadingMoreProofs(false);
    }
  }, [verifier, loadingMoreProofs, allProofsLoaded, proofsOffset]);

  if (loading) {
    return (
      <div className="container-custom section-padding flex-1">
        <div className="mb-6 flex flex-row flex-wrap justify-between items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
          >
            ← Back to Blocks
          </Link>
        </div>

        <h2 className="heading-section mb-6 skeleton-text">Loading Verifier...</h2>

        {/* Skeleton program hashes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">
              OS Program Hash
            </span>
            <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block skeleton-text">
              Loading...
            </code>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">
              Bootloader Program Hash
            </span>
            <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block skeleton-text">
              Loading...
            </code>
          </div>
        </div>

        {/* Skeleton current state root */}
        <div className="mb-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">
              Current State Root
            </span>
            <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block skeleton-text">
              Loading...
            </code>
          </div>
        </div>

        {/* Skeleton stat cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 min-h-40">
          <StatCard label="Total Proofs" value="---" description="Loading..." isLoading={true} />
          <StatCard label="Total Proofs Sizes" value="---" description="MB" isLoading={true} />
          <StatCard label="Bridge Balance" value="---" description="ZEC" isLoading={true} />
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
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.4)] text-foreground hover:border-accent hover:-translate-y-0.5 mt-5"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!verifier) {
    return (
      <div className="container-custom section-padding flex-1">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Verifier not found
        </div>
      </div>
    );
  }

  // Get program hashes and state root from latest fact
  const osProgramHash = latestFact?.inner_program_hash || 'N/A';
  const bootloaderProgramHash = latestFact?.program_hash || 'N/A';
  const currentStateRoot = latestFact?.new_state || 'N/A';

  // Bridge balance from verifier API
  const bridgeBalance = verifier.bridge_balance_zatoshis
    ? formatZEC(verifier.bridge_balance_zatoshis)
    : '0.00';

  return (
    <div className="container-custom section-padding flex-1">
      <div className="mb-6 flex flex-row flex-wrap justify-between items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
        >
          ← Back to Blocks
        </Link>
      </div>

      {/* Verifier Name */}
      <h2 className="heading-section mb-6">
        {verifier.verifier_name || `Verifier ${verifier.verifier_id}`}
      </h2>

      {/* Verifier Statistics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 min-h-40">
        <StatCard
          label="Total TZE Txs"
          value={totalTzeCount.toLocaleString()}
          description="Verify + Initialize"
        />
        <StatCard label="Total Proofs Sizes" value={totalProofSizeMB.toFixed(2)} description="MB" />
        <StatCard label="Bridge Balance" value={bridgeBalance} description="ZEC" />
      </div>

      {/* Program Hashes Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">
            OS Program Hash
          </span>
          <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block">
            {osProgramHash}
          </code>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">
            Bootloader Program Hash
          </span>
          <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block">
            {bootloaderProgramHash}
          </code>
        </div>
      </div>

      {/* Current State Root - Full Width Row */}
      <div className="mb-12">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">
            Current State Root
          </span>
          <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block">
            {currentStateRoot}
          </code>
        </div>
      </div>

      {/* TZE Transactions List */}
      <h2 className="heading-section mb-6">
        {totalProofCount > 0 ? totalTzeCount : transactions.length} TZE Transaction
        {totalTzeCount !== 1 ? 's' : ''}
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

            {/* Load More Button */}
            {!allProofsLoaded && proofs.length > 0 && (
              <button
                type="button"
                onClick={loadMoreProofs}
                disabled={loadingMoreProofs}
                className="mt-4 px-6 py-3 rounded-xl border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] hover:bg-[rgba(255,137,70,0.1)] hover:border-[rgba(255,137,70,0.5)] transition-all duration-200 text-accent-strong font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMoreProofs ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-label="Loading">
                      <title>Loading</title>
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
                  'Load More TZE Transactions'
                )}
              </button>
            )}
          </>
        ) : (
          <div className="py-20 px-8 text-center bg-[rgba(8,8,12,0.9)] border border-[rgba(255,137,70,0.2)] rounded-2xl">
            <p className="text-xl text-muted font-mono m-0">
              No TZE transactions found for this verifier
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
