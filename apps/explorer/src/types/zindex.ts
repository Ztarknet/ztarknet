// Zindex API types

export interface ZindexResponse<T> {
  result: 'success' | 'error';
  data?: T;
  error?: string;
}

export interface PaginationParams
  extends Record<string, string | number | boolean | undefined | null> {
  limit?: number;
  offset?: number;
}

export interface QueryParams extends Record<string, string | number | boolean | undefined | null> {
  limit?: number;
  offset?: number;
  min_balance?: number;
  max_balance?: number;
  address?: string;
  verifier_id?: string;
  txid?: string;
  block_height?: number;
  state_hash?: string;
  program_hash?: string;
  inner_program_hash?: string;
  type?: string;
  mode?: string;
}

export interface AccountData {
  address: string;
  balance: number;
  balance_zatoshis: number;
  first_seen_at: number;
  first_seen_height: number;
  count: number;
  min_balance?: number;
  max_balance?: number;
}

export interface VerifierData {
  verifier_id: string;
  verifier_name: string;
  inner_program_hash: string;
  program_hash: string;
  new_state: string;
  bridge_balance_zatoshis: number;
  vin?: unknown[];
  txid?: string;
}

export interface StarkProof {
  verifier_id: string;
  txid: string;
  block_height: number;
  state_hash: string;
  program_hash: string;
  inner_program_hash: string;
}

export interface BlockSummary {
  hash: string;
  height: number;
  time: number;
  size: number;
  tx?: Transaction[];
}

export interface Transaction {
  txid: string;
  type?: string;
  height?: number;
  time?: number;
  confirmations?: number;
  hash?: string;
  total_output?: number;
  num_inputs?: number | string;
  num_outputs?: number | string;
}

export interface TZETransaction {
  txid: string;
  type: string;
  mode?: string;
}

export interface TZEGraphNode {
  txid: string;
  type: string;
  mode?: string;
}

export interface TransactionGraphNode {
  txid: string;
  type?: string;
}

export interface ZtarknetFact {
  inner_program_hash?: string;
  program_hash?: string;
  new_state?: string;
}
