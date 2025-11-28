import { StatCard } from '@components/common/StatCard';
import { TransactionCard } from '@components/transactions/TransactionCard';
import { useRevealOnScroll } from '@hooks/useRevealOnScroll';
import { getRawTransaction } from '@services/rpc';
import {
  getRecentFacts,
  getStarkProofsByVerifier,
  getVerifier,
  getVerifierByName,
} from '@services/zindex/starks';
import { formatZEC } from '@utils/formatters';
import { useEffect, useState } from 'react';
import type { RpcTransaction } from '../types/transaction';
import type { StarkProof, VerifierData } from '../types/zindex';

interface VerifierPageProps {
  verifierId: string;
}

interface ZtarknetFact {
  inner_program_hash?: string;
  program_hash?: string;
  new_state?: string;
}

export function VerifierPage({ verifierId }: VerifierPageProps) {
  const [verifier, setVerifier] = useState<VerifierData | null>(null);
  const [proofs, setProofs] = useState<StarkProof[]>([]);
  const [latestFact, setLatestFact] = useState<ZtarknetFact | null>(null);
  const [transactions, setTransactions] = useState<RpcTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useRevealOnScroll();

  useEffect(() => {
    async function fetchVerifier() {
      try {
        setLoading(true);
        setError(null);

        // Determine if verifierId looks like a name (starts with "verifier_") or an ID
        const isName = verifierId.startsWith('verifier_');

        let verifierData: Awaited<ReturnType<typeof getVerifierByName>> | undefined;
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

        // Fetch proofs for this verifier
        try {
          const proofsData = await getStarkProofsByVerifier(verifierData.verifier_id);
          setProofs(Array.isArray(proofsData) ? proofsData : []);
        } catch (proofsError: unknown) {
          if (proofsError instanceof Error) {
            console.error('Error fetching proofs:', proofsError.message);
          } else {
            console.error('Error fetching proofs:', proofsError);
          }
          setProofs([]);
        }

        // Fetch recent facts for this verifier (to get program hashes and state root)
        try {
          const factsData = await getRecentFacts({ limit: 1 });
          if (Array.isArray(factsData) && factsData.length > 0) {
            setLatestFact(factsData[0]);
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

        if (allTxIds.length === 0) {
          setTransactions([]);
          setLoadingTransactions(false);
          return;
        }

        // Fetch each transaction
        const txPromises = allTxIds.map((txid: string) =>
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

        // Filter out null values
        const validTxs = txData.filter((tx): tx is RpcTransaction => tx !== null);

        // Sort by block height (most recent first), with init transaction at the bottom
        validTxs.sort((a: RpcTransaction, b: RpcTransaction) => {
          const aIsInit = a.txid === initTxId;
          const bIsInit = b.txid === initTxId;

          // If one is init and other isn't, init goes to bottom
          if (aIsInit && !bIsInit) return 1;
          if (!aIsInit && bIsInit) return -1;

          // Otherwise sort by block height (most recent first)
          return (b.height || 0) - (a.height || 0);
        });

        setTransactions(validTxs);
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

  if (loading) {
    return (
      <div className="max-w-container mx-auto md:px-8 px-4 pt-[120px] pb-[120px] flex-1">
        <div className="mb-6 flex flex-row flex-wrap justify-between items-center gap-3">
          <a
            href="#/"
            className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
          >
            ← Back to Blocks
          </a>
        </div>

        <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight skeleton-text">
          Loading Verifier...
        </h2>

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

  if (!verifier) {
    return (
      <div className="max-w-container mx-auto md:px-8 px-4 pt-[120px] pb-[120px] flex-1">
        <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-xl text-red-200 font-mono mb-6">
          Verifier not found
        </div>
      </div>
    );
  }

  // Calculate total proof size from TZE transactions
  const totalProofSizeMB = transactions
    .reduce((sum: number, tx: RpcTransaction) => {
      // Get size of TZE data from transaction
      let currentSum = sum;
      if (tx.vin) {
        for (const input of tx.vin) {
          if (input.scriptSig?.hex?.toLowerCase().startsWith('ff')) {
            // TZE input found, add its size
            currentSum += input.scriptSig.hex.length / 2 / (1024 * 1024); // Convert hex chars to bytes to MB
          }
        }
      }
      return currentSum;
    }, 0)
    .toFixed(2);

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
        <a
          href="#/"
          className="inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
        >
          ← Back to Blocks
        </a>
      </div>

      {/* Verifier Name */}
      <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight">
        {verifier.verifier_name || `Verifier ${verifier.verifier_id}`}
      </h2>

      {/* Verifier Statistics Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-8 min-h-[160px]">
        <StatCard
          label="Total Proofs"
          value={proofs.length.toLocaleString()}
          description="STARK Proofs Verified"
        />
        <StatCard label="Total Proofs Sizes" value={totalProofSizeMB} description="MB" />
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
      <h2 className="text-[1.8rem] font-bold mb-6 text-foreground tracking-tight">
        {transactions.length} TZE Transaction{transactions.length !== 1 ? 's' : ''}
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
          transactions.map((tx: RpcTransaction) => <TransactionCard key={tx.txid} tx={tx} />)
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
