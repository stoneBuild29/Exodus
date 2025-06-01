// --------------- deathVerificationBot.ts ---------------
import { Address } from './blockchainModels';
import { PatientCluster } from './models';
import { DataStorage } from './storageService';
import { NakamotoChain } from './decentralizedChain';

export class DeathVerificationBot {
  private chain: NakamotoChain;
  private verificationThreshold: number = 3; // Min confirmations needed
  private knownVerifiers: Address[] = [
    'verifier_hospital',
    'verifier_coroner',
    'verifier_government',
    'verifier_family'
  ];

  constructor(chain: NakamotoChain) {
    this.chain = chain;
  }

  public registerWill(
    patientId: Address,
    beneficiaries: Address[],
    willContent: string
  ): void {
    this.chain.createWillTransaction(
      patientId,
      beneficiaries,
      willContent,
      this.verificationThreshold
    );
    console.log(`Will registered for ${patientId}`);
  }

  public async monitorPatient(patientId: Address): Promise<void> {
    // Check existing medical records
    const { medical } = DataStorage.getPatientData(patientId);
    const deathRecord = medical.find(r => r.outcome === 'Deceased');
    
    if (deathRecord) {
      console.log(`Death record found for ${patientId}. Verifying...`);
      await this.verifyDeath(patientId);
      return;
    }
    
    // Check device inactivity
    const { device } = DataStorage.getPatientData(patientId);
    const isInactive = this.checkDeviceInactivity(device);
    
    if (isInactive) {
      console.log(`Device inactivity detected for ${patientId}. Verifying...`);
      await this.verifyDeath(patientId);
    }
  }

  private async verifyDeath(patientId: Address): Promise<void> {
    // Request verifications from known sources
    const verifications = await Promise.all(
      this.knownVerifiers.map(verifier => 
        this.requestVerification(verifier, patientId)
    );
    
    // Count successful verifications
    const successfulVerifications = verifications.filter(Boolean).length;
    
    if (successfulVerifications >= this.verificationThreshold) {
      console.log(`Death confirmed for ${patientId}. Distributing will...`);
      this.triggerWillDistribution(patientId);
    } else {
      console.log(`Insufficient verifications for ${patientId}`);
    }
  }

  private async requestVerification(
    verifier: Address,
    patientId: Address
  ): Promise<boolean> {
    // In a real implementation, this would be an API call to the verifier service
    console.log(`Requesting death verification from ${verifier} for ${patientId}`);
    
    // Simulate different response times and success rates
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
    
    // Verifiers have different reliability
    const successRates: Record<Address, number> = {
      'verifier_hospital': 0.95,
      'verifier_coroner': 0.99,
      'verifier_government': 0.85,
      'verifier_family': 0.75
    };
    
    const isSuccessful = Math.random() < (successRates[verifier] || 0.8);
    
    if (isSuccessful) {
      this.chain.confirmDeath(patientId, verifier);
    }
    
    return isSuccessful;
  }

  private triggerWillDistribution(patientId: Address): void {
    // This would be handled by the blockchain when threshold is reached
    // We just need to ensure all confirmations are recorded
    console.log(`Will distribution triggered for ${patientId}`);
  }

  private checkDeviceInactivity(devices: any[]): boolean {
    const now = Date.now();
    const maxInactivity = 72 * 60 * 60 * 1000; // 72 hours
    
    return devices.every(device => {
      const latestReading = device.readings
        .map((r: any) => new Date(r.timestamp).getTime())
        .sort((a: number, b: number) => b - a)[0];
      
      return (now - latestReading) > maxInactivity;
    });
  }
}