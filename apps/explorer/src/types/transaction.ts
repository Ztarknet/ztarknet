// Transaction types for the explorer

export interface ScriptSig {
  hex: string;
  asm?: string;
}

export interface ScriptPubKey {
  hex: string;
  asm?: string;
  type?: string;
  addresses?: string[];
}

export interface TransactionInput {
  txid?: string;
  vout?: number;
  scriptSig?: ScriptSig;
  coinbase?: string;
  sequence?: number;
}

export interface TransactionOutput {
  value: number;
  n: number;
  scriptPubKey?: ScriptPubKey;
}

// Export aliases for common use
export type Vin = TransactionInput;
export type Vout = TransactionOutput;

export interface Transaction {
  txid: string;
  hash?: string;
  version?: number;
  size?: number;
  vsize?: number;
  weight?: number;
  locktime?: number;
  vin?: TransactionInput[];
  vout?: TransactionOutput[];
  hex?: string;
  blockhash?: string;
  confirmations?: number;
  time?: number;
  blocktime?: number;
  height?: number;

  // Zindex API format fields
  type?: 'coinbase' | 'tze' | 't2t' | 't2z' | 'z2t' | 'z2z' | string;
  total_output?: number;
  input_count?: number;
  output_count?: number;
  // Legacy field names (for backwards compatibility)
  num_inputs?: number | string;
  num_outputs?: number | string;
}

// Export aliases for RPC and Zindex formats
export type RpcTransaction = Transaction;
export type ZindexTransaction = Transaction;

export interface TransactionStats {
  numInputs: number | string;
  numOutputs: number | string;
  totalOutput: number;
}

export type TransactionKind = 'coinbase' | 'tze' | 'standard';

export interface TzeData {
  tzeId: number;
  payload: string;
  payloadLen: number;
  isInput: boolean;
}

export interface StarkVerifyPrecondition {
  root: string;
  osProgramHash: string;
  bootloaderProgramHash: string;
}

export interface StarkVerifyWitness {
  withPedersen: boolean;
  proofFormat: string;
  proofData: string;
  proofSizeMB: string;
}

export interface CompactSizeResult {
  value: number;
  offset: number;
}
