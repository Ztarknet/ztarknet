// Block-related types for components

export interface ValuePool {
  id: string;
  valueDelta?: number;
}

export interface BlockData {
  hash: string;
  height: number;
  time: number;
  size: number;
  confirmations: number;
  version: number;
  merkleroot: string;
  tx: string[] | unknown[];
  valuePools?: ValuePool[];
}
