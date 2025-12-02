/**
 * Zindex API - Main Export
 *
 * Convenient exports for all Zindex API modules.
 */

// Re-export common utilities
export * from './zindex';

// Re-export all module functions
export * as blocks from './blocks';
export * as txGraph from './tx_graph';
export * as accounts from './accounts';
export * as tzeGraph from './tze_graph';
export * as starks from './starks';

// Individual named exports for convenience
export {
  // Blocks
  getAllBlocks,
  getBlockByHeight,
  getBlockByHash,
  getBlocksByHeightRange,
  getBlocksByTimestampRange,
  getRecentBlocks,
  getBlockCount,
  getLatestBlock,
} from './blocks';

export {
  // Transaction Graph - Transactions
  getTransaction,
  getTransactionsByBlock,
  getTransactionsByType,
  getRecentTransactions,
  // Transaction Graph - Outputs
  getTransactionOutputs,
  getTransactionOutput,
  getUnspentOutputs,
  getOutputSpenders,
  // Transaction Graph - Inputs
  getTransactionInputs,
  getTransactionInput,
  getInputSources,
  // Transaction Graph - Count
  countTransactions,
  // Transaction Graph - Graph
  getTransactionGraph,
} from './tx_graph';

export {
  // Accounts
  getAllAccounts,
  getAccount,
  getAccountsByBalanceRange,
  getTopAccountsByBalance,
  getRecentActiveAccounts,
  // Account Transactions
  getAccountTransactions,
  getAccountTransactionsByType,
  getAccountReceivingTransactions,
  getAccountSendingTransactions,
  getAccountTransactionsByBlockRange,
  getAccountTransactionCount,
  getAccountTransaction,
  getTransactionAccounts,
  // Accounts - Count
  // countAccounts, // TODO: Add when migrating latest upstream changes
  // countAccountTransactions,
} from './accounts';

export {
  // TZE Inputs
  getTzeInputs,
  getTzeInput,
  getTzeInputsByType,
  getTzeInputsByMode,
  getTzeInputsByTypeAndMode,
  getTzeInputsByPrevOutput,
  // TZE Outputs
  getTzeOutputs,
  getTzeOutput,
  getUnspentTzeOutputs,
  getAllUnspentTzeOutputs,
  getTzeOutputsByType,
  getTzeOutputsByMode,
  getTzeOutputsByTypeAndMode,
  getUnspentTzeOutputsByType,
  getUnspentTzeOutputsByTypeAndMode,
  getSpentTzeOutputs,
  getTzeOutputsByValue,
} from './tze_graph';

export {
  // Verifiers
  getVerifier,
  getVerifierByName,
  getAllVerifiers,
  getVerifiersByBalance,
  // STARK Proofs
  getStarkProof,
  getStarkProofsByVerifier,
  getStarkProofsByTransaction,
  getStarkProofsByBlock,
  getRecentStarkProofs,
  getStarkProofsBySize,
  countStarkProofs,
  getSumProofSizesByVerifier,
  // Ztarknet Facts
  getZtarknetFacts,
  getFactsByVerifier,
  getFactsByTransaction,
  getFactsByBlock,
  getFactsByState,
  getFactsByProgramHash,
  getFactsByInnerProgramHash,
  getRecentFacts,
  getStateTransition,
} from './starks';
