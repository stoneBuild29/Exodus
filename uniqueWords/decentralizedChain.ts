// --------------- decentralizedChain.ts ---------------
import crypto from 'crypto';
import { Block, Will, Address, TransactionHash } from './blockchainModels';

export class NakamotoChain {
  private chain: Block[];
  private pendingTransactions: Will[] = [];
  private difficulty: number = 4;

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock(): Block {
    return {
      index: 0,
      timestamp: Date.now(),
      data: { message: "Genesis Block" },
      previousHash: "0",
      hash: this.calculateHash(0, "0", Date.now(), { message: "Genesis Block" }, 0),
      nonce: 0
    };
  }

  private calculateHash(
    index: number,
    previousHash: string,
    timestamp: number,
    data: any,
    nonce: number
  ): string {
    return crypto
      .createHash('sha256')
      .update(index + previousHash + timestamp + JSON.stringify(data) + nonce)
      .digest('hex');
  }

  private mineBlock(difficulty: number, block: Block): Block {
    const prefix = '0'.repeat(difficulty);
    
    while (!block.hash.startsWith(prefix)) {
      block.nonce++;
      block.hash = this.calculateHash(
        block.index,
        block.previousHash,
        block.timestamp,
        block.data,
        block.nonce
      );
    }
    
    return block;
  }

  public createWillTransaction(
    owner: Address,
    beneficiaries: Address[],
    willContent: string, // Encrypted content
    confirmationThreshold: number
  ): TransactionHash {
    // In a real implementation, we'd store the content on IPFS
    const willIPFSHash = `ipfs_${crypto.createHash('sha256').update(willContent).digest('hex')}`;
    
    const newWill: Will = {
      owner,
      beneficiaries,
      willContent: willIPFSHash,
      confirmationThreshold,
      confirmedBy: [],
      isDistributed: false,
      creationTimestamp: Date.now()
    };
    
    this.pendingTransactions.push(newWill);
    return `tx_${crypto.randomBytes(16).toString('hex')}`;
  }

  public confirmDeath(willOwner: Address, confirmer: Address): boolean {
    const willIndex = this.pendingTransactions.findIndex(
      tx => tx.owner === willOwner && !tx.isDistributed
    );
    
    if (willIndex === -1) return false;
    
    const will = this.pendingTransactions[willIndex];
    
    // Prevent duplicate confirmations
    if (will.confirmedBy.includes(confirmer)) return false;
    
    will.confirmedBy.push(confirmer);
    
    // Check if threshold reached
    if (will.confirmedBy.length >= will.confirmationThreshold) {
      this.distributeWill(will);
      return true;
    }
    
    return false;
  }

  private distributeWill(will: Will): void {
    will.isDistributed = true;
    
    // Create a new block with the will distribution
    const newBlock: Block = {
      index: this.chain.length,
      timestamp: Date.now(),
      data: will,
      previousHash: this.chain[this.chain.length - 1].hash,
      hash: '',
      nonce: 0
    };
    
    const minedBlock = this.mineBlock(this.difficulty, newBlock);
    this.chain.push(minedBlock);
    
    console.log(`Will distributed to beneficiaries: ${will.beneficiaries.join(', ')}`);
    console.log(`Block #${minedBlock.index} mined: ${minedBlock.hash}`);
  }

  public getChain(): Block[] {
    return this.chain;
  }

  public getPendingWills(): Will[] {
    return this.pendingTransactions.filter(tx => !tx.isDistributed);
  }

  public validateChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      // Verify block hash
      const calculatedHash = this.calculateHash(
        currentBlock.index,
        currentBlock.previousHash,
        currentBlock.timestamp,
        currentBlock.data,
        currentBlock.nonce
      );
      
      if (currentBlock.hash !== calculatedHash) return false;
      
      // Verify chain linkage
      if (currentBlock.previousHash !== previousBlock.hash) return false;
    }
    
    return true;
  }
}