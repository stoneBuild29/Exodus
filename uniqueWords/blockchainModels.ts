// --------------- blockchainModels.ts ---------------
export type Address = string;
export type TransactionHash = string;
export type IPFSHash = string;

export interface Block {
  index: number;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface Will {
  owner: Address;
  beneficiaries: Address[];
  willContent: IPFSHash; // IPFS hash storing encrypted will content
  confirmationThreshold: number;
  confirmedBy: Address[];
  isDistributed: boolean;
  creationTimestamp: number;
}