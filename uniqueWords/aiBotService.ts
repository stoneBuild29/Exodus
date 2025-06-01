// --------------- aiBotService.ts ---------------
import { DeathVerificationBot } from './deathVerificationBot';
import { NakamotoChain } from './decentralizedChain';
import { Address } from './blockchainModels';
import { PatientCluster } from './models';

export class AIBotOrchestrator {
  private verificationBot: DeathVerificationBot;
  private monitoredPatients: Set<Address> = new Set();

  constructor() {
    const blockchain = new NakamotoChain();
    this.verificationBot = new DeathVerificationBot(blockchain);
  }

  public registerPatientWill(
    patientId: Address,
    beneficiaries: Address[],
    willContent: string
  ): void {
    this.verificationBot.registerWill(patientId, beneficiaries, willContent);
    this.monitoredPatients.add(patientId);
    console.log(`Patient ${patientId} registered and now being monitored`);
  }

  public startMonitoring(): void {
    setInterval(() => {
      this.monitoredPatients.forEach(patientId => {
        this.verificationBot.monitorPatient(patientId);
      });
    }, 60 * 60 * 1000); // Check every hour
    
    console.log('AI-BOT monitoring started');
  }

  public simulateDeath(patientId: Address): void {
    // Add a death record to trigger the system
    DataStorage.addMedicalData({
      id: `death_${Date.now()}`,
      patientId,
      source: 'Hospital',
      diagnosis: 'Confirmed Death',
      treatment: 'None',
      outcome: 'Deceased',
      date: new Date()
    });
    
    console.log(`Simulated death recorded for ${patientId}`);
  }

  public getBlockchainStatus(): any {
    const chain = this.verificationBot['chain']; // Accessing private member for demo
    return {
      chainLength: chain.getChain().length,
      isValid: chain.validateChain(),
      pendingWills: chain.getPendingWills().length
    };
  }
}