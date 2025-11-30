/**
 * Zindex API - Accounts Module
 *
 * Functions for interacting with account-related endpoints.
 * Includes accounts and account transaction history.
 */

import type { AccountData, PaginationParams, Transaction } from '../../types/zindex';
import { API_BASE, apiGet, withPaginationDefaults } from './zindex';

const ACCOUNTS_BASE = `${API_BASE}/accounts`;

// ==================== Accounts ====================

/**
 * Get all accounts with pagination
 */
export async function getAllAccounts(params: PaginationParams = {}): Promise<AccountData[]> {
  return apiGet<AccountData[]>(ACCOUNTS_BASE, withPaginationDefaults(params));
}

/**
 * Get a single account by address
 */
export async function getAccount(address: string): Promise<AccountData> {
  if (!address) {
    throw new Error('Account address is required');
  }
  return apiGet<AccountData>(`${ACCOUNTS_BASE}/account`, { address });
}

interface BalanceRangeParams extends PaginationParams {
  min_balance?: number;
  max_balance?: number;
}

/**
 * Get accounts within a balance range
 */
export async function getAccountsByBalanceRange(
  params: BalanceRangeParams = {}
): Promise<AccountData[]> {
  const { min_balance, max_balance, ...rest } = params;

  return apiGet<AccountData[]>(`${ACCOUNTS_BASE}/balance-range`, {
    min_balance,
    max_balance,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get top accounts by balance
 */
export async function getTopAccountsByBalance(
  params: PaginationParams = {}
): Promise<AccountData[]> {
  return apiGet<AccountData[]>(`${ACCOUNTS_BASE}/top-balance`, {
    limit: params.limit ?? 10,
  });
}

/**
 * Get recently active accounts
 */
export async function getRecentActiveAccounts(
  params: PaginationParams = {}
): Promise<AccountData[]> {
  return apiGet<AccountData[]>(`${ACCOUNTS_BASE}/recent-active`, {
    limit: params.limit ?? 10,
  });
}

// ==================== Account Transactions ====================

interface AccountTransactionsParams extends PaginationParams {
  address: string;
}

/**
 * Get all transactions for an account
 */
export async function getAccountTransactions(
  params: AccountTransactionsParams
): Promise<Transaction[]> {
  const { address, ...rest } = params;

  if (!address) {
    throw new Error('Account address is required');
  }

  return apiGet<Transaction[]>(`${ACCOUNTS_BASE}/transactions`, {
    address,
    ...withPaginationDefaults(rest),
  });
}

interface AccountTransactionsByTypeParams extends PaginationParams {
  address: string;
  type: string;
}

/**
 * Get account transactions by type
 */
export async function getAccountTransactionsByType(
  params: AccountTransactionsByTypeParams
): Promise<Transaction[]> {
  const { address, type, ...rest } = params;

  if (!address) {
    throw new Error('Account address is required');
  }
  if (!type) {
    throw new Error('Transaction type is required');
  }

  return apiGet<Transaction[]>(`${ACCOUNTS_BASE}/transactions/by-type`, {
    address,
    type,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get transactions where the account received funds
 */
export async function getAccountReceivingTransactions(
  params: AccountTransactionsParams
): Promise<Transaction[]> {
  const { address, ...rest } = params;

  if (!address) {
    throw new Error('Account address is required');
  }

  return apiGet<Transaction[]>(`${ACCOUNTS_BASE}/transactions/receiving`, {
    address,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get transactions where the account sent funds
 */
export async function getAccountSendingTransactions(
  params: AccountTransactionsParams
): Promise<Transaction[]> {
  const { address, ...rest } = params;

  if (!address) {
    throw new Error('Account address is required');
  }

  return apiGet<Transaction[]>(`${ACCOUNTS_BASE}/transactions/sending`, {
    address,
    ...withPaginationDefaults(rest),
  });
}

interface BlockRangeParams {
  address: string;
  from_height: number;
  to_height: number;
}

/**
 * Get account transactions within a block range
 */
export async function getAccountTransactionsByBlockRange(
  params: BlockRangeParams
): Promise<Transaction[]> {
  const { address, from_height, to_height } = params;

  if (!address) {
    throw new Error('Account address is required');
  }
  if (from_height === undefined || from_height === null) {
    throw new Error('from_height is required');
  }
  if (to_height === undefined || to_height === null) {
    throw new Error('to_height is required');
  }

  return apiGet<Transaction[]>(`${ACCOUNTS_BASE}/transactions/block-range`, {
    address,
    from_height,
    to_height,
  });
}

interface TransactionCount {
  count: number;
}

/**
 * Get transaction count for an account
 */
export async function getAccountTransactionCount(address: string): Promise<TransactionCount> {
  if (!address) {
    throw new Error('Account address is required');
  }
  return apiGet<TransactionCount>(`${ACCOUNTS_BASE}/transaction-count`, { address });
}

interface AccountTransactionParams {
  address: string;
  txid: string;
}

/**
 * Get a specific transaction for an account
 */
export async function getAccountTransaction(
  params: AccountTransactionParams
): Promise<Transaction> {
  const { address, txid } = params;

  if (!address) {
    throw new Error('Account address is required');
  }
  if (!txid) {
    throw new Error('Transaction ID is required');
  }

  return apiGet<Transaction>(`${ACCOUNTS_BASE}/transaction`, { address, txid });
}

/**
 * Get all accounts involved in a transaction
 */
export async function getTransactionAccounts(txid: string): Promise<AccountData[]> {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<AccountData[]>(`${ACCOUNTS_BASE}/tx-accounts`, { txid });
}
