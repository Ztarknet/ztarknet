/**
 * Zindex API - Accounts Module
 *
 * Functions for interacting with account-related endpoints.
 * Includes accounts and account transaction history.
 */

import { API_BASE, apiGet, withPaginationDefaults } from './zindex.js';

const ACCOUNTS_BASE = `${API_BASE}/accounts`;

// ==================== Accounts ====================

/**
 * Get all accounts with pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of accounts to return
 * @param {number} [params.offset=0] - Number of accounts to skip
 * @returns {Promise<Object>} Paginated accounts data
 */
export async function getAllAccounts(params = {}) {
  return apiGet(ACCOUNTS_BASE, withPaginationDefaults(params));
}

/**
 * Get a single account by address
 * @param {string} address - Account address
 * @returns {Promise<Object>} Account data
 */
export async function getAccount(address) {
  if (!address) {
    throw new Error('Account address is required');
  }
  return apiGet(`${ACCOUNTS_BASE}/account`, { address });
}

/**
 * Get accounts within a balance range
 * @param {Object} params - Query parameters
 * @param {number} [params.min_balance] - Minimum balance (optional)
 * @param {number} [params.max_balance] - Maximum balance (optional)
 * @param {number} [params.limit=10] - Maximum number of accounts to return
 * @param {number} [params.offset=0] - Number of accounts to skip
 * @returns {Promise<Object>} Accounts in the specified balance range
 */
export async function getAccountsByBalanceRange(params = {}) {
  const { min_balance, max_balance, ...rest } = params;

  return apiGet(`${ACCOUNTS_BASE}/balance-range`, {
    min_balance,
    max_balance,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get top accounts by balance
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of accounts to return
 * @returns {Promise<Object>} Top accounts by balance
 */
export async function getTopAccountsByBalance(params = {}) {
  return apiGet(`${ACCOUNTS_BASE}/top-balances`, {
    limit: params.limit ?? 10,
  });
}

/**
 * Get recently active accounts
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of accounts to return
 * @returns {Promise<Object>} Recently active accounts
 */
export async function getRecentActiveAccounts(params = {}) {
  return apiGet(`${ACCOUNTS_BASE}/recent-active`, {
    limit: params.limit ?? 10,
  });
}

// ==================== Account Transactions ====================

/**
 * Get all transactions for an account
 * @param {Object} params - Query parameters
 * @param {string} params.address - Account address
 * @param {number} [params.limit=10] - Maximum number of transactions to return
 * @param {number} [params.offset=0] - Number of transactions to skip
 * @returns {Promise<Object>} Account transactions
 */
export async function getAccountTransactions(params) {
  const { address, ...rest } = params || {};

  if (!address) {
    throw new Error('Account address is required');
  }

  return apiGet(`${ACCOUNTS_BASE}/transactions`, {
    address,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get account transactions by type
 * @param {Object} params - Query parameters
 * @param {string} params.address - Account address
 * @param {string} params.type - Transaction type (receive|send)
 * @param {number} [params.limit=10] - Maximum number of transactions to return
 * @param {number} [params.offset=0] - Number of transactions to skip
 * @returns {Promise<Object>} Account transactions of the specified type
 */
export async function getAccountTransactionsByType(params) {
  const { address, type, ...rest } = params || {};

  if (!address) {
    throw new Error('Account address is required');
  }
  if (!type) {
    throw new Error('Transaction type is required (receive|send)');
  }

  return apiGet(`${ACCOUNTS_BASE}/transactions/type`, {
    address,
    type,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get transactions where the account received funds
 * @param {Object} params - Query parameters
 * @param {string} params.address - Account address
 * @param {number} [params.limit=10] - Maximum number of transactions to return
 * @param {number} [params.offset=0] - Number of transactions to skip
 * @returns {Promise<Object>} Receiving transactions
 */
export async function getAccountReceivingTransactions(params) {
  const { address, ...rest } = params || {};

  if (!address) {
    throw new Error('Account address is required');
  }

  return apiGet(`${ACCOUNTS_BASE}/transactions/receiving`, {
    address,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get transactions where the account sent funds
 * @param {Object} params - Query parameters
 * @param {string} params.address - Account address
 * @param {number} [params.limit=10] - Maximum number of transactions to return
 * @param {number} [params.offset=0] - Number of transactions to skip
 * @returns {Promise<Object>} Sending transactions
 */
export async function getAccountSendingTransactions(params) {
  const { address, ...rest } = params || {};

  if (!address) {
    throw new Error('Account address is required');
  }

  return apiGet(`${ACCOUNTS_BASE}/transactions/sending`, {
    address,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get account transactions within a block range
 * @param {Object} params - Query parameters
 * @param {string} params.address - Account address
 * @param {number} params.from_block - Starting block height
 * @param {number} params.to_block - Ending block height
 * @param {number} [params.limit=10] - Maximum number of transactions to return
 * @param {number} [params.offset=0] - Number of transactions to skip
 * @returns {Promise<Object>} Account transactions in the block range
 */
export async function getAccountTransactionsByBlockRange(params) {
  const { address, from_block, to_block, ...rest } = params || {};

  if (!address) {
    throw new Error('Account address is required');
  }
  if (from_block === undefined || from_block === null) {
    throw new Error('from_block is required');
  }
  if (to_block === undefined || to_block === null) {
    throw new Error('to_block is required');
  }

  return apiGet(`${ACCOUNTS_BASE}/transactions/block-range`, {
    address,
    from_block,
    to_block,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get transaction count for an account
 * @param {string} address - Account address
 * @returns {Promise<Object>} Transaction count
 */
export async function getAccountTransactionCount(address) {
  if (!address) {
    throw new Error('Account address is required');
  }
  return apiGet(`${ACCOUNTS_BASE}/transactions/count`, { address });
}

/**
 * Get a specific transaction for an account
 * @param {Object} params - Query parameters
 * @param {string} params.address - Account address
 * @param {string} params.txid - Transaction ID
 * @returns {Promise<Object>} Transaction data
 */
export async function getAccountTransaction(params) {
  const { address, txid } = params || {};

  if (!address) {
    throw new Error('Account address is required');
  }
  if (!txid) {
    throw new Error('Transaction ID is required');
  }

  return apiGet(`${ACCOUNTS_BASE}/transactions/transaction`, { address, txid });
}

/**
 * Get all accounts involved in a transaction
 * @param {string} txid - Transaction ID
 * @returns {Promise<Object>} Accounts involved in the transaction
 */
export async function getTransactionAccounts(txid) {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${ACCOUNTS_BASE}/transactions/by-txid`, { txid });
}

// ==================== Count ====================

/**
 * Count total accounts
 * @returns {Promise<Object>} Account count
 */
export async function countAccounts() {
  return apiGet(`${ACCOUNTS_BASE}/count`);
}

/**
 * Count account transactions with optional filters
 * @param {Object} params - Query parameters
 * @param {string} [params.address] - Filter by account address
 * @param {string} [params.type] - Filter by transaction type (send|receive)
 * @returns {Promise<Object>} Account transaction count
 */
export async function countAccountTransactions(params = {}) {
  return apiGet(`${ACCOUNTS_BASE}/transactions/total-count`, params);
}
