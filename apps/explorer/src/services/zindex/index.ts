/**
 * Zindex API - Main Export
 *
 * Convenient exports for all Zindex API modules.
 */

// Re-export common utilities
export * from './zindex.js';

// Re-export all module functions
export * as blocks from './blocks.js';
export * as txGraph from './tx_graph.js';
export * as accounts from './accounts.js';
export * as tzeGraph from './tze_graph.js';
export * as starks from './starks.js';

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
} from './blocks.js';

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
  countOutputs,
  countInputs,
  // Transaction Graph - Graph
  getTransactionGraph,
} from './tx_graph.js';

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
  countAccounts,
  countAccountTransactions,
} from './accounts.js';

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
} from './tze_graph.js';

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
  // STARKS - Count
  countVerifiers,
  countStarkProofs,
  countFacts,
  // STARKS - Aggregations
  getSumProofSizesByVerifier,
} from './starks.js';
