// --------------- mainSystem.ts ---------------
import { AIBotOrchestrator } from './aiBotService';
import { runExodusSystem } from './exodusSystem';

// Initialize the AI-BOT system
const aiBotSystem = new AIBotOrchestrator();

// Register a patient's will
const patientId = 'patient_wallet_address';
const beneficiaries = [
  'child1_wallet_address',
  'child2_wallet_address'
];
const encryptedWillContent = `ENCRYPTED: To my beloved children, I leave...`;

aiBotSystem.registerPatientWill(patientId, beneficiaries, encryptedWillContent);

// Start monitoring patients
aiBotSystem.startMonitoring();

// Main health system execution (from Part 2)
const healthReport = runExodusSystem(patientId);

// Check blockchain status periodically
setInterval(() => {
  const status = aiBotSystem.getBlockchainStatus();
  console.log('\nBlockchain Status:');
  console.log(`- Blocks: ${status.chainLength}`);
  console.log(`- Valid: ${status.isValid}`);
  console.log(`- Pending wills: ${status.pendingWills}`);
}, 5 * 60 * 1000); // Every 5 minutes

// Simulate death after 10 seconds (for demonstration)
setTimeout(() => {
  aiBotSystem.simulateDeath(patientId);
}, 10000);