/**
 * Zindex API - STARKS Module
 *
 * Functions for interacting with STARK-related endpoints.
 * Includes verifiers, STARK proofs, and Ztarknet facts.
 */

import type { PaginationParams, StarkProof, VerifierData, ZtarknetFact } from '../../types/zindex';
import { API_BASE, apiGet, withPaginationDefaults } from './zindex';

const STARKS_BASE = `${API_BASE}/starks`;

// ==================== Verifiers ====================

/**
 * Get a specific verifier by ID
 */
export async function getVerifier(verifier_id: string): Promise<VerifierData> {
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  return apiGet<VerifierData>(`${STARKS_BASE}/verifiers/verifier`, { verifier_id });
}

/**
 * Get a verifier by name
 */
export async function getVerifierByName(name: string): Promise<VerifierData> {
  if (!name) {
    throw new Error('Verifier name is required');
  }
  return apiGet<VerifierData>(`${STARKS_BASE}/verifiers/by-name`, { verifier_name: name });
}

/**
 * Get all verifiers with pagination
 */
export async function getAllVerifiers(params: PaginationParams = {}): Promise<VerifierData[]> {
  return apiGet<VerifierData[]>(`${STARKS_BASE}/verifiers`, withPaginationDefaults(params));
}

/**
 * Get verifiers sorted by balance
 */
export async function getVerifiersByBalance(
  params: PaginationParams = {}
): Promise<VerifierData[]> {
  return apiGet<VerifierData[]>(
    `${STARKS_BASE}/verifiers/by-balance`,
    withPaginationDefaults(params)
  );
}

// ==================== STARK Proofs ====================

interface StarkProofParams {
  verifier_id: string;
  txid: string;
}

/**
 * Get a specific STARK proof by verifier ID and transaction ID
 */
export async function getStarkProof(params: StarkProofParams): Promise<StarkProof> {
  const { verifier_id, txid } = params;
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<StarkProof>(`${STARKS_BASE}/proofs/proof`, { verifier_id, txid });
}

/**
 * Get all STARK proofs for a specific verifier
 */
export async function getStarkProofsByVerifier(
  verifier_id: string,
  params: PaginationParams = {}
): Promise<StarkProof[]> {
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  return apiGet<StarkProof[]>(`${STARKS_BASE}/proofs/by-verifier`, { verifier_id, ...params });
}

/**
 * Get all STARK proofs in a specific transaction
 */
export async function getStarkProofsByTransaction(txid: string): Promise<StarkProof[]> {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<StarkProof[]>(`${STARKS_BASE}/proofs/by-transaction`, { txid });
}

/**
 * Get all STARK proofs in a specific block
 */
export async function getStarkProofsByBlock(block_height: number): Promise<StarkProof[]> {
  if (block_height === undefined || block_height === null) {
    throw new Error('Block height is required');
  }
  return apiGet<StarkProof[]>(`${STARKS_BASE}/proofs/by-block`, { block_height });
}

/**
 * Get recent STARK proofs
 */
export async function getRecentStarkProofs(params: PaginationParams = {}): Promise<StarkProof[]> {
  return apiGet<StarkProof[]>(`${STARKS_BASE}/proofs/recent`, withPaginationDefaults(params));
}

interface ProofSizeParams extends PaginationParams {
  min_size?: number;
  max_size: number;
}

/**
 * Get STARK proofs within a size range
 */
export async function getStarkProofsBySize(params: ProofSizeParams): Promise<StarkProof[]> {
  const { min_size, max_size, ...rest } = params;

  if (max_size === undefined || max_size === null) {
    throw new Error('max_size is required');
  }

  return apiGet<StarkProof[]>(`${STARKS_BASE}/proofs/by-size`, {
    min_size: min_size ?? 0,
    max_size,
    ...withPaginationDefaults(rest),
  });
}

// ==================== Ztarknet Facts ====================

interface FactParams {
  verifier_id: string;
  txid: string;
}

/**
 * Get Ztarknet facts by verifier ID and transaction ID
 */
export async function getZtarknetFacts(params: FactParams): Promise<ZtarknetFact> {
  const { verifier_id, txid } = params;
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<ZtarknetFact>(`${STARKS_BASE}/facts/facts`, { verifier_id, txid });
}

/**
 * Get facts by verifier
 */
export async function getFactsByVerifier(
  verifier_id: string,
  params: PaginationParams = {}
): Promise<ZtarknetFact[]> {
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  return apiGet<ZtarknetFact[]>(`${STARKS_BASE}/facts/by-verifier`, { verifier_id, ...params });
}

/**
 * Get facts by transaction
 */
export async function getFactsByTransaction(txid: string): Promise<ZtarknetFact[]> {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet<ZtarknetFact[]>(`${STARKS_BASE}/facts/by-transaction`, { txid });
}

/**
 * Get facts by block
 */
export async function getFactsByBlock(block_height: number): Promise<ZtarknetFact[]> {
  if (block_height === undefined || block_height === null) {
    throw new Error('Block height is required');
  }
  return apiGet<ZtarknetFact[]>(`${STARKS_BASE}/facts/by-block`, { block_height });
}

/**
 * Get facts by state
 */
export async function getFactsByState(state_hash: string): Promise<ZtarknetFact[]> {
  if (!state_hash) {
    throw new Error('State hash is required');
  }
  return apiGet<ZtarknetFact[]>(`${STARKS_BASE}/facts/by-state`, { state_hash });
}

/**
 * Get facts by program hash
 */
export async function getFactsByProgramHash(program_hash: string): Promise<ZtarknetFact[]> {
  if (!program_hash) {
    throw new Error('Program hash is required');
  }
  return apiGet<ZtarknetFact[]>(`${STARKS_BASE}/facts/by-program-hash`, { program_hash });
}

/**
 * Get facts by inner program hash
 */
export async function getFactsByInnerProgramHash(
  inner_program_hash: string
): Promise<ZtarknetFact[]> {
  if (!inner_program_hash) {
    throw new Error('Inner program hash is required');
  }
  return apiGet<ZtarknetFact[]>(`${STARKS_BASE}/facts/by-inner-program-hash`, {
    inner_program_hash,
  });
}

/**
 * Get recent facts
 */
export async function getRecentFacts(params: PaginationParams = {}): Promise<ZtarknetFact[]> {
  return apiGet<ZtarknetFact[]>(`${STARKS_BASE}/facts/recent`, withPaginationDefaults(params));
}

interface StateTransitionParams {
  old_state: string;
  new_state: string;
}

interface StateTransition {
  old_state: string;
  new_state: string;
  transition_data: unknown;
}

/**
 * Get state transition information
 */
export async function getStateTransition(params: StateTransitionParams): Promise<StateTransition> {
  const { old_state, new_state } = params;

  if (!old_state) {
    throw new Error('old_state is required');
  }
  if (!new_state) {
    throw new Error('new_state is required');
  }

  return apiGet<StateTransition>(`${STARKS_BASE}/facts/state-transition`, { old_state, new_state });
}
