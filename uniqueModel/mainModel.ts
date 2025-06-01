// --------------- mainSystem.ts ---------------
import { PatientCluster } from './models';
import { ExodusClusterEngine } from './clusteringEngine';
import { PersonalizedInferenceEngine, InferenceResult } from './inferenceEngine';
import { DataStorage, MedicalData, FamilyHistory, DeviceData } from './storageService';

function seedGlobalData() {
  DataStorage.addMedicalData({
    id: 'm1', patientId: 'p123',
    source: 'MayoClinic',
    diagnosis: 'Type 2 Diabetes',
    treatment: 'Metformin',
    outcome: 'Chronic',
    date: new Date('2022-03-15')
  });

  DataStorage.addMedicalData({
    id: 'p1', patientId: 'p123',
    source: 'PekingUnion',
    diagnosis: 'Hypertension',
    treatment: 'Lisinopril',
    outcome: 'Chronic',
    date: new Date('2023-01-20')
  });

  DataStorage.addFamilyHistory({
    id: 'f1', patientId: 'p123',
    condition: 'HeartDisease',
    relation: 'Parent',
    ageAtDiagnosis: 58
  });

  DataStorage.addDeviceData({
    id: 'd1', patientId: 'p123',
    deviceType: 'BloodPressure',
    readings: [
      { timestamp: new Date('2023-05-01'), value: 145, unit: 'mmHg' },
      { timestamp: new Date('2023-05-02'), value: 138, unit: 'mmHg' }
    ]
  });
}

export function runExodusSystem(patientId: string): InferenceResult {
  seedGlobalData();
  const cluster = ExodusClusterEngine.buildPersonalizedCluster(patientId);
  
  console.log('===== Personalized Data Cluster =====');
  console.log(`Patient ID: ${cluster.patientId}`);
  console.log(`Related medical records: ${cluster.medicalRecords.length}`);
  console.log(`Related family history: ${cluster.familyHistory.length}`);
  console.log(`Related device patterns: ${cluster.deviceData.length}`);
  
  const result = PersonalizedInferenceEngine.infer(cluster);
  
  console.log('\n===== Health Inference Results =====');
  console.log(`Survival probability: ${(result.survivalProbability * 100).toFixed(1)}%`);
  console.log(`Health score: ${(result.healthScore * 100).toFixed(0)}/100`);
  console.log(`Risk factors: ${result.riskFactors.join(', ') || 'No significant risks'}`);
  
  if (result.criticalAlerts.length > 0) {
    console.log('\n⚠️ CRITICAL ALERTS:');
    result.criticalAlerts.forEach(alert => console.log(`  • ${alert}`));
  }
  
  console.log('\nWeight configuration:');
  console.log(`  Medical history: ${(result.weightConfig.MedicalHistory * 100).toFixed(0)}%`);
  console.log(`  Family history: ${(result.weightConfig.FamilyHistory * 100).toFixed(0)}%`);
  console.log(`  Device data: ${(result.weightConfig.DevicePatterns * 100).toFixed(0)}%`);
  console.log(`  Population model: ${(result.weightConfig.PopulationModel * 100).toFixed(0)}%`);
  
  console.log(`\n${result.explanation}`);
  
  return result;
}

runExodusSystem('p123');