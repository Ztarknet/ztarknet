/**
 * Zindex API - Transaction Graph Module
 *
 * Functions for interacting with transaction graph endpoints.
 * Includes transactions, outputs, inputs, and graph traversal.
 */

import type { PaginationParams, TransactionGraphNode } from '../../types/zindex';
import { API_BASE, apiGet, withPaginationDefaults } from './zindex';

const TX_GRAPH_BASE = `${API_BASE}/tx-graph`;

// ==================== Transactions ====================

/**
 * Get a single transaction by txid
 */
export async function getTransaction(txid: string): Promise<TransactionGraphNode> {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<TransactionGraphNode>(`${TX_GRAPH_BASE}/transaction`, { txid });
}

/**
 * Get all transactions in a specific block
 */
export async function getTransactionsByBlock(
  block_height: number
): Promise<TransactionGraphNode[]> {
  if (block_height === undefined || block_height === null) {
    throw new Error('Block height is required');
  }
  return apiGet<TransactionGraphNode[]>(`${TX_GRAPH_BASE}/transactions/by-block`, { block_height });
}

interface TransactionsByTypeParams extends PaginationParams {
  type: string;
}

/**
 * Get transactions by type
 */
export async function getTransactionsByType(
  params: TransactionsByTypeParams
): Promise<TransactionGraphNode[]> {
  const { type, ...rest } = params;

  if (!type) {
    throw new Error('Transaction type is required (coinbase|tze|t2t|t2z|z2t|z2z)');
  }

  return apiGet<TransactionGraphNode[]>(`${TX_GRAPH_BASE}/transactions/by-type`, {
    type,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get recent transactions
 */
export async function getRecentTransactions(
  params: PaginationParams = {}
): Promise<TransactionGraphNode[]> {
  return apiGet<TransactionGraphNode[]>(
    `${TX_GRAPH_BASE}/transactions/recent`,
    withPaginationDefaults(params)
  );
}

// ==================== Outputs ====================

interface TransactionOutput {
  txid: string;
  vout: number;
  value: number;
  spent: boolean;
  spent_by_txid?: string;
}

/**
 * Get all outputs for a transaction
 */
export async function getTransactionOutputs(txid: string): Promise<TransactionOutput[]> {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<TransactionOutput[]>(`${TX_GRAPH_BASE}/outputs`, { txid });
}

interface OutputParams {
  txid: string;
  vout: number;
}

/**
 * Get a specific transaction output
 */
export async function getTransactionOutput(params: OutputParams): Promise<TransactionOutput> {
  const { txid, vout } = params;

  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  if (vout === undefined || vout === null) {
    throw new Error('Output index (vout) is required');
  }

  return apiGet<TransactionOutput>(`${TX_GRAPH_BASE}/outputs/output`, { txid, vout });
}

/**
 * Get unspent outputs for a transaction
 */
export async function getUnspentOutputs(txid: string): Promise<TransactionOutput[]> {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<TransactionOutput[]>(`${TX_GRAPH_BASE}/outputs/unspent`, { txid });
}

/**
 * Get transactions that spent outputs from a given transaction
 */
export async function getOutputSpenders(txid: string): Promise<TransactionOutput[]> {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<TransactionOutput[]>(`${TX_GRAPH_BASE}/outputs/spenders`, { txid });
}

// ==================== Inputs ====================

interface TransactionInput {
  txid: string;
  vin: number;
  prev_txid: string;
  prev_vout: number;
}

/**
 * Get all inputs for a transaction
 */
export async function getTransactionInputs(txid: string): Promise<TransactionInput[]> {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<TransactionInput[]>(`${TX_GRAPH_BASE}/inputs`, { txid });
}

interface InputParams {
  txid: string;
  vin: number;
}

/**
 * Get a specific transaction input
 */
export async function getTransactionInput(params: InputParams): Promise<TransactionInput> {
  const { txid, vin } = params;

  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  if (vin === undefined || vin === null) {
    throw new Error('Input index (vin) is required');
  }

  return apiGet<TransactionInput>(`${TX_GRAPH_BASE}/inputs/input`, { txid, vin });
}

/**
 * Get source transactions (where inputs came from)
 */
export async function getInputSources(txid: string): Promise<TransactionGraphNode[]> {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<TransactionGraphNode[]>(`${TX_GRAPH_BASE}/inputs/sources`, { txid });
}

// ==================== Graph ====================

interface GraphParams {
  txid: string;
  depth?: number;
}

interface TransactionGraph {
  root: TransactionGraphNode;
  nodes: TransactionGraphNode[];
  edges: Array<{ from: string; to: string }>;
}

/**
 * Get transaction graph (relationships between transactions)
 */
export async function getTransactionGraph(params: GraphParams): Promise<TransactionGraph> {
  const { txid, depth = 3 } = params;

  if (!txid) {
    throw new Error('Transaction ID is required');
  }

  return apiGet<TransactionGraph>(`${TX_GRAPH_BASE}/graph`, { txid, depth });
}
