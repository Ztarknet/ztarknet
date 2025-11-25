import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getVerifier, getVerifierByName, getStarkProofsByVerifier, getRecentFacts, countStarkProofs, getSumProofSizesByVerifier } from '@services/zindex/starks';
import { getRawTransaction } from '@services/rpc';
import { formatZEC } from '@utils/formatters';
import { HashDisplay } from '@components/common/HashDisplay';
import { StatCard } from '@components/common/StatCard';
import { TransactionCard } from '@components/transactions/TransactionCard';
import { useRevealOnScroll } from '@hooks/useRevealOnScroll';

const PAGE_SIZE = 10;

export function VerifierPage({ verifierId }) {
  const [verifier, setVerifier] = useState(null);
  const [proofs, setProofs] = useState([]);
  const [latestFact, setLatestFact] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [totalProofCount, setTotalProofCount] = useState(0);
  const [totalProofSizeMB, setTotalProofSizeMB] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingMoreProofs, setLoadingMoreProofs] = useState(false);
  const [proofsOffset, setProofsOffset] = useState(0);
  const [error, setError] = useState(null);

  // Track which transaction IDs we've already fetched to avoid refetching
  const fetchedTxIdsRef = useRef(new Set());

  useRevealOnScroll();

  // Calculate if all proofs are loaded (only true when we have the count AND loaded all)
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

        let verifierData;
        if (isName) {
          // Fetch by name first
          try {
            verifierData = await getVerifierByName(verifierId);
          } catch (e) {
            // Fall back to ID if name fails
            verifierData = await getVerifier(verifierId);
          }
        } else {
          // Fetch by ID first
          try {
            verifierData = await getVerifier(verifierId);
          } catch (e) {
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
        } catch (countError) {
          console.error('Error fetching proof count:', countError);
          setTotalProofCount(0);
        }

        // Fetch initial page of proofs for this verifier
        try {
          const proofsData = await getStarkProofsByVerifier(verifierData.verifier_id, {
            limit: PAGE_SIZE,
            offset: 0
          });
          setProofs(Array.isArray(proofsData) ? proofsData : []);
          setProofsOffset(PAGE_SIZE);
        } catch (proofsError) {
          console.error('Error fetching proofs:', proofsError);
          setProofs([]);
        }

        // Fetch total proof sizes for this verifier
        try {
          const sumData = await getSumProofSizesByVerifier(verifierData.verifier_id);
          // Convert bytes to MB
          const sizeMB = sumData?.total_proof_size ? (sumData.total_proof_size / (1024 * 1024)).toFixed(2) : '0.00';
          setTotalProofSizeMB(sizeMB);
        } catch (sumError) {
          console.error('Error fetching proof sizes:', sumError);
          setTotalProofSizeMB('0.00');
        }

        // Fetch recent facts for this verifier (to get program hashes and state root)
        try {
          const factsData = await getRecentFacts({ limit: 1 });
          if (Array.isArray(factsData) && factsData.length > 0) {
            setLatestFact(factsData[0]);
          } else {
            setLatestFact(null);
          }
        } catch (factsError) {
          console.error('Error fetching facts:', factsError);
          setLatestFact(null);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching verifier:', err);
        setError(err.message || 'Failed to load verifier data');
        setLoading(false);
      }
    }

    fetchVerifier();
  }, [verifierId]);

  // Helper to sort transactions with init at bottom
  const sortTransactions = useCallback((txs, initTxId) => {
    return [...txs].sort((a, b) => {
      const aIsInit = a.txid === initTxId;
      const bIsInit = b.txid === initTxId;

      // If one is init and other isn't, init goes to bottom
      if (aIsInit && !bIsInit) return 1;
      if (!aIsInit && bIsInit) return -1;

      // Otherwise sort by block height (most recent first)
      return (b.blockheight || 0) - (a.blockheight || 0);
    });
  }, []);

  // Fetch transactions for initial proofs only
  useEffect(() => {
    async function fetchInitialTransactions() {
      if (!verifier || proofs.length === 0) {
        return;
      }

      try {
        setLoadingTransactions(true);

        // Parse verifier_id to get init transaction (format: <txid>:<output_idx>)
        const initTxId = verifier.verifier_id ? verifier.verifier_id.split(':')[0] : null;

        // Get unique transaction IDs from proofs
        const proofTxIds = [...new Set(proofs.map(proof => proof.txid))];

        // Filter out txids we've already fetched
        const newTxIds = proofTxIds.filter(txid => !fetchedTxIdsRef.current.has(txid));

        if (newTxIds.length === 0) {
          setLoadingTransactions(false);
          return;
        }

        // Fetch each new transaction
        const txPromises = newTxIds.map(txid =>
          getRawTransaction(txid).catch(err => {
            console.error(`Error fetching transaction ${txid}:`, err);
            return null;
          })
        );

        const txData = await Promise.all(txPromises);

        // Filter out null values and track fetched txids
        const validTxs = txData.filter(tx => {
          if (tx !== null) {
            fetchedTxIdsRef.current.add(tx.txid);
            return true;
          }
          return false;
        });

        // Append to existing transactions and sort
        setTransactions(prev => sortTransactions([...prev, ...validTxs], initTxId));
        setLoadingTransactions(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setLoadingTransactions(false);
      }
    }

    fetchInitialTransactions();
  }, [verifier, proofs, sortTransactions]);

  // Add init transaction when all proofs are loaded
  useEffect(() => {
    async function addInitTransaction() {
      if (!verifier || !allProofsLoaded) return;

      const initTxId = verifier.verifier_id ? verifier.verifier_id.split(':')[0] : null;
      if (!initTxId || fetchedTxIdsRef.current.has(initTxId)) return;

      try {
        const initTx = await getRawTransaction(initTxId);
        if (initTx) {
          fetchedTxIdsRef.current.add(initTx.txid);
          setTransactions(prev => sortTransactions([...prev, initTx], initTxId));
        }
      } catch (err) {
        console.error('Error fetching init transaction:', err);
      }
    }

    addInitTransaction();
  }, [verifier, allProofsLoaded, sortTransactions]);

  // Load more proofs and their transactions
  async function loadMoreProofs() {
    if (!verifier || loadingMoreProofs || allProofsLoaded) return;

    try {
      setLoadingMoreProofs(true);

      const moreProofs = await getStarkProofsByVerifier(verifier.verifier_id, {
        limit: PAGE_SIZE,
        offset: proofsOffset
      });

      if (Array.isArray(moreProofs) && moreProofs.length > 0) {
        // Get unique new txids from the new proofs
        const newProofTxIds = [...new Set(moreProofs.map(proof => proof.txid))];
        const txIdsToFetch = newProofTxIds.filter(txid => !fetchedTxIdsRef.current.has(txid));

        // Fetch the new transactions
        if (txIdsToFetch.length > 0) {
          const txPromises = txIdsToFetch.map(txid =>
            getRawTransaction(txid).catch(err => {
              console.error(`Error fetching transaction ${txid}:`, err);
              return null;
            })
          );

          const txData = await Promise.all(txPromises);
          const validNewTxs = txData.filter(tx => {
            if (tx !== null) {
              fetchedTxIdsRef.current.add(tx.txid);
              return true;
            }
            return false;
          });

          const initTxId = verifier.verifier_id ? verifier.verifier_id.split(':')[0] : null;

          // Append new transactions and re-sort
          setTransactions(prev => sortTransactions([...prev, ...validNewTxs], initTxId));
        }

        setProofs(prev => [...prev, ...moreProofs]);
        setProofsOffset(prev => prev + PAGE_SIZE);
      }

      setLoadingMoreProofs(false);
    } catch (err) {
      console.error('Error loading more proofs:', err);
      setLoadingMoreProofs(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-container mx-auto md:px-8 px-4 pt-[120px] pb-[120px] flex-1">
        <div className="mb-6 flex flex-row flex-wrap justify-between items-center gap-3">
          <a href="#/" className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5">← Back to Blocks</a>
        </div>

        <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight skeleton-text">Loading Verifier...</h2>

        {/* Skeleton program hashes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">OS Program Hash</span>
            <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block skeleton-text">
              Loading...
            </code>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">Bootloader Program Hash</span>
            <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block skeleton-text">
              Loading...
            </code>
          </div>
        </div>

        {/* Skeleton current state root */}
        <div className="mb-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">Current State Root</span>
            <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block skeleton-text">
              Loading...
            </code>
          </div>
        </div>

        {/* Skeleton stat cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-12 min-h-[160px]">
          <StatCard label="Total Proofs" value="---" description="Loading..." isLoading={true} />
          <StatCard label="Total Proofs Sizes" value="---" description="MB" isLoading={true} />
          <StatCard label="Bridge Balance" value="---" description="ZEC" isLoading={true} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-container mx-auto md:px-8 px-4 pt-[120px] pb-[120px] flex-1">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Error: {error}
          <br />
          <a href="#/" className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.4)] text-foreground hover:border-accent hover:-translate-y-0.5 mt-5">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!verifier) {
    return (
      <div className="max-w-container mx-auto md:px-8 px-4 pt-[120px] pb-[120px] flex-1">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">Verifier not found</div>
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
    <div className="max-w-container mx-auto px-8 pt-[120px] pb-[120px] flex-1">
      <div className="mb-6 flex flex-row flex-wrap justify-between items-center gap-3">
        <a href="#/" className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5">← Back to Blocks</a>
      </div>

      {/* Verifier Name */}
      <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight">
        {verifier.verifier_name || `Verifier ${verifier.verifier_id}`}
      </h2>

      {/* Verifier Statistics Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-8 min-h-[160px]">
        <StatCard
          label="Total Proofs"
          value={totalProofCount.toLocaleString()}
          description="STARK Proofs Verified"
        />
        <StatCard
          label="Total Proofs Sizes"
          value={totalProofSizeMB}
          description="MB"
        />
        <StatCard
          label="Bridge Balance"
          value={bridgeBalance}
          description="ZEC"
        />
      </div>

      {/* Program Hashes Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">OS Program Hash</span>
          <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block">
            {osProgramHash}
          </code>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">Bootloader Program Hash</span>
          <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block">
            {bootloaderProgramHash}
          </code>
        </div>
      </div>

      {/* Current State Root - Full Width Row */}
      <div className="mb-12">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-2">Current State Root</span>
          <code className="font-mono text-sm text-foreground break-all bg-black/30 py-2.5 px-4 rounded-lg block">
            {currentStateRoot}
          </code>
        </div>
      </div>

      {/* TZE Transactions List */}
      <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight">
        {transactions.length} of {totalTzeCount} TZE Transaction{totalTzeCount !== 1 ? 's' : ''}
      </h2>
      <div className="flex flex-col gap-4">
        {loadingTransactions ? (
          // Loading skeletons
          Array.from({ length: Math.min(PAGE_SIZE, 3) }).map((_, index) => (
            <TransactionCard key={index} tx={null} isLoading={true} />
          ))
        ) : transactions.length > 0 ? (
          <>
            {transactions.map(tx => (
              <TransactionCard key={tx.txid} tx={tx} />
            ))}

            {/* Load More Button - only show if there are more proofs to load */}
            {!allProofsLoaded && (
              <button
                onClick={loadMoreProofs}
                disabled={loadingMoreProofs}
                className="mt-4 px-6 py-3 rounded-xl border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] hover:bg-[rgba(255,137,70,0.1)] hover:border-[rgba(255,137,70,0.5)] transition-all duration-200 text-accent-strong font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMoreProofs ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
