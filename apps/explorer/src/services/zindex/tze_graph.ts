/**
 * Zindex API - TZE Graph Module
 *
 * Functions for interacting with Transparent Zcash Extension (TZE) graph endpoints.
 * Includes TZE inputs and outputs.
 */

import type { PaginationParams } from '../../types/zindex';
import { API_BASE, apiGet, withPaginationDefaults } from './zindex';

const TZE_GRAPH_BASE = `${API_BASE}/tze-graph`;

// ==================== TZE Inputs ====================

interface TZEInput {
  txid: string;
  vin: number;
  type: string;
  mode: string;
  prev_txid?: string;
  prev_vout?: number;
}

/**
 * Get all TZE inputs for a transaction
 */
export async function getTzeInputs(txid: string): Promise<TZEInput[]> {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<TZEInput[]>(`${TZE_GRAPH_BASE}/inputs`, { txid });
}

interface TZEInputParams {
  txid: string;
  vin: number;
}

/**
 * Get a specific TZE input
 */
export async function getTzeInput(params: TZEInputParams): Promise<TZEInput> {
  const { txid, vin } = params;

  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  if (vin === undefined || vin === null) {
    throw new Error('Input index (vin) is required');
  }

  return apiGet<TZEInput>(`${TZE_GRAPH_BASE}/inputs/input`, { txid, vin });
}

interface TZEInputsByTypeParams extends PaginationParams {
  type: 'demo' | 'stark_verify';
}

/**
 * Get TZE inputs by extension type
 */
export async function getTzeInputsByType(params: TZEInputsByTypeParams): Promise<TZEInput[]> {
  const { type, ...rest } = params;

  if (!type) {
    throw new Error('Extension type is required (demo|stark_verify)');
  }

  return apiGet<TZEInput[]>(`${TZE_GRAPH_BASE}/inputs/by-type`, {
    type,
    ...withPaginationDefaults(rest),
  });
}

interface TZEInputsByModeParams extends PaginationParams {
  mode: number | string;
}

/**
 * Get TZE inputs by mode
 */
export async function getTzeInputsByMode(params: TZEInputsByModeParams): Promise<TZEInput[]> {
  const { mode, ...rest } = params;

  if (mode === undefined || mode === null) {
    throw new Error('Extension mode is required (0 or 1)');
  }

  return apiGet<TZEInput[]>(`${TZE_GRAPH_BASE}/inputs/by-mode`, {
    mode: String(mode),
    ...withPaginationDefaults(rest),
  });
}

interface TZETypeAndModeParams extends PaginationParams {
  type: 'demo' | 'stark_verify';
  mode: string;
}

/**
 * Get TZE inputs by type and mode
 * @param params.mode - Extension mode string (open|close for demo, initialize|verify for stark_verify)
 */
export async function getTzeInputsByTypeAndMode(params: TZETypeAndModeParams): Promise<TZEInput[]> {
  const { type, mode, ...rest } = params;

  if (!type) {
    throw new Error('Extension type is required');
  }
  if (!mode) {
    throw new Error('Extension mode is required');
  }

  return apiGet<TZEInput[]>(`${TZE_GRAPH_BASE}/inputs/by-type-mode`, {
    type,
    mode,
    ...withPaginationDefaults(rest),
  });
}

interface PrevOutputParams {
  txid: string;
  vout: number;
}

/**
 * Get TZE inputs that spend a specific previous output
 */
export async function getTzeInputsByPrevOutput(params: PrevOutputParams): Promise<TZEInput[]> {
  const { txid, vout } = params;

  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  if (vout === undefined || vout === null) {
    throw new Error('Output index (vout) is required');
  }

  return apiGet<TZEInput[]>(`${TZE_GRAPH_BASE}/inputs/by-prev-output`, {
    prev_txid: txid,
    prev_vout: vout,
  });
}

// ==================== TZE Outputs ====================

interface TZEOutput {
  txid: string;
  vout: number;
  type: string;
  mode: string;
  value: number;
  spent: boolean;
  spent_by_txid?: string;
}

/**
 * Get all TZE outputs for a transaction
 */
export async function getTzeOutputs(txid: string): Promise<TZEOutput[]> {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs`, { txid });
}

interface TZEOutputParams {
  txid: string;
  vout: number;
}

/**
 * Get a specific TZE output
 */
export async function getTzeOutput(params: TZEOutputParams): Promise<TZEOutput> {
  const { txid, vout } = params;

  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  if (vout === undefined || vout === null) {
    throw new Error('Output index (vout) is required');
  }

  return apiGet<TZEOutput>(`${TZE_GRAPH_BASE}/outputs/output`, { txid, vout });
}

/**
 * Get unspent TZE outputs for a specific transaction
 */
export async function getUnspentTzeOutputs(txid: string): Promise<TZEOutput[]> {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/unspent`, { txid });
}

/**
 * Get all unspent TZE outputs in the system
 */
export async function getAllUnspentTzeOutputs(params: PaginationParams = {}): Promise<TZEOutput[]> {
  return apiGet<TZEOutput[]>(
    `${TZE_GRAPH_BASE}/outputs/all-unspent`,
    withPaginationDefaults(params)
  );
}

interface TZEOutputsByTypeParams extends PaginationParams {
  type: 'demo' | 'stark_verify';
}

/**
 * Get TZE outputs by extension type
 */
export async function getTzeOutputsByType(params: TZEOutputsByTypeParams): Promise<TZEOutput[]> {
  const { type, ...rest } = params;

  if (!type) {
    throw new Error('Extension type is required (demo|stark_verify)');
  }

  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/by-type`, {
    type,
    ...withPaginationDefaults(rest),
  });
}

interface TZEOutputsByModeParams extends PaginationParams {
  mode: number | string;
}

/**
 * Get TZE outputs by mode
 */
export async function getTzeOutputsByMode(params: TZEOutputsByModeParams): Promise<TZEOutput[]> {
  const { mode, ...rest } = params;

  if (mode === undefined || mode === null) {
    throw new Error('Extension mode is required (0 or 1)');
  }

  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/by-mode`, {
    mode: String(mode),
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get TZE outputs by type and mode
 * @param params.mode - Extension mode string (open|close for demo, initialize|verify for stark_verify)
 */
export async function getTzeOutputsByTypeAndMode(
  params: TZETypeAndModeParams
): Promise<TZEOutput[]> {
  const { type, mode, ...rest } = params;

  if (!type) {
    throw new Error('Extension type is required');
  }
  if (!mode) {
    throw new Error('Extension mode is required');
  }

  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/by-type-mode`, {
    type,
    mode,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get unspent TZE outputs by extension type
 */
export async function getUnspentTzeOutputsByType(
  params: TZEOutputsByTypeParams
): Promise<TZEOutput[]> {
  const { type, ...rest } = params;

  if (!type) {
    throw new Error('Extension type is required (demo|stark_verify)');
  }

  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/unspent-by-type`, {
    type,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get unspent TZE outputs by type and mode
 */
export async function getUnspentTzeOutputsByTypeAndMode(
  params: TZETypeAndModeParams
): Promise<TZEOutput[]> {
  const { type, mode, ...rest } = params;

  if (!type) {
    throw new Error('Extension type is required');
  }
  if (!mode) {
    throw new Error('Extension mode is required');
  }

  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/unspent-by-type-mode`, {
    type,
    mode,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get spent TZE outputs with pagination
 */
export async function getSpentTzeOutputs(params: PaginationParams = {}): Promise<TZEOutput[]> {
  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/spent`, withPaginationDefaults(params));
}

interface ValueRangeParams extends PaginationParams {
  min_value?: number;
}

/**
 * Get TZE outputs with value greater than or equal to minimum value
 */
export async function getTzeOutputsByValue(params: ValueRangeParams = {}): Promise<TZEOutput[]> {
  const { min_value = 0, ...rest } = params;

  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/by-value`, {
    min_value,
    ...withPaginationDefaults(rest),
  });
}
