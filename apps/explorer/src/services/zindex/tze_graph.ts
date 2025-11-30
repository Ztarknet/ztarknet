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
 * Get all TZE inputs with pagination
 */
export async function getTzeInputs(params: PaginationParams = {}): Promise<TZEInput[]> {
  return apiGet<TZEInput[]>(`${TZE_GRAPH_BASE}/inputs`, withPaginationDefaults(params));
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

/**
 * Get TZE inputs by extension type
 */
export async function getTzeInputsByType(type: string): Promise<TZEInput[]> {
  if (!type) {
    throw new Error('Extension type is required');
  }
  return apiGet<TZEInput[]>(`${TZE_GRAPH_BASE}/inputs/by-type`, { type });
}

/**
 * Get TZE inputs by mode
 */
export async function getTzeInputsByMode(mode: string): Promise<TZEInput[]> {
  if (!mode) {
    throw new Error('Extension mode is required');
  }
  return apiGet<TZEInput[]>(`${TZE_GRAPH_BASE}/inputs/by-mode`, { mode });
}

interface TZETypeAndModeParams {
  type: string;
  mode: string;
}

/**
 * Get TZE inputs by type and mode
 */
export async function getTzeInputsByTypeAndMode(params: TZETypeAndModeParams): Promise<TZEInput[]> {
  const { type, mode } = params;

  if (!type) {
    throw new Error('Extension type is required');
  }
  if (!mode) {
    throw new Error('Extension mode is required');
  }

  return apiGet<TZEInput[]>(`${TZE_GRAPH_BASE}/inputs/by-type-mode`, { type, mode });
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
 * Get all TZE outputs with pagination
 */
export async function getTzeOutputs(params: PaginationParams = {}): Promise<TZEOutput[]> {
  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs`, withPaginationDefaults(params));
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

/**
 * Get TZE outputs by extension type
 */
export async function getTzeOutputsByType(type: string): Promise<TZEOutput[]> {
  if (!type) {
    throw new Error('Extension type is required');
  }
  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/by-type`, { type });
}

/**
 * Get TZE outputs by mode
 */
export async function getTzeOutputsByMode(mode: string): Promise<TZEOutput[]> {
  if (!mode) {
    throw new Error('Extension mode is required');
  }
  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/by-mode`, { mode });
}

/**
 * Get TZE outputs by type and mode
 */
export async function getTzeOutputsByTypeAndMode(
  params: TZETypeAndModeParams
): Promise<TZEOutput[]> {
  const { type, mode } = params;

  if (!type) {
    throw new Error('Extension type is required');
  }
  if (!mode) {
    throw new Error('Extension mode is required');
  }

  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/by-type-mode`, { type, mode });
}

/**
 * Get unspent TZE outputs by extension type
 */
export async function getUnspentTzeOutputsByType(type: string): Promise<TZEOutput[]> {
  if (!type) {
    throw new Error('Extension type is required');
  }
  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/unspent-by-type`, { type });
}

/**
 * Get unspent TZE outputs by type and mode
 */
export async function getUnspentTzeOutputsByTypeAndMode(
  params: TZETypeAndModeParams
): Promise<TZEOutput[]> {
  const { type, mode } = params;

  if (!type) {
    throw new Error('Extension type is required');
  }
  if (!mode) {
    throw new Error('Extension mode is required');
  }

  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/unspent-by-type-mode`, { type, mode });
}

/**
 * Get spent TZE outputs with pagination
 */
export async function getSpentTzeOutputs(params: PaginationParams = {}): Promise<TZEOutput[]> {
  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/spent`, withPaginationDefaults(params));
}

interface ValueRangeParams {
  min_value: number;
  max_value: number;
}

/**
 * Get TZE outputs within a value range
 */
export async function getTzeOutputsByValue(params: ValueRangeParams): Promise<TZEOutput[]> {
  const { min_value, max_value } = params;

  if (min_value === undefined || min_value === null) {
    throw new Error('min_value is required');
  }
  if (max_value === undefined || max_value === null) {
    throw new Error('max_value is required');
  }

  return apiGet<TZEOutput[]>(`${TZE_GRAPH_BASE}/outputs/by-value`, { min_value, max_value });
}
