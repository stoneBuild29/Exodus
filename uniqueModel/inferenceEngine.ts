// --------------- inferenceEngine.ts ---------------
import { PatientCluster } from './models';
import { InferenceFactor, InferenceWeights, InferenceResult } from './inferenceModels';

class PopulationModelService {
  static getSurvivalProbability(diagnosis: string, age: number, gender: string): number {
    const baseProbabilities: Record<string, number> = {
      'Diabetes': 0.92,
      'HeartDisease': 0.78,
      'Cancer': 0.65,
      'Hypertension': 0.95
    };
    const ageFactor = Math.max(0, 1 - (age - 40) * 0.01);
    return (baseProbabilities[diagnosis] || 0.85) * ageFactor;
  }
}

export class PersonalizedInferenceEngine {
  static infer(cluster: PatientCluster): InferenceResult {
    const weights = this.calculatePersonalizedWeights(cluster);
    const medicalScore = this.analyzeMedicalHistory(cluster, weights.MedicalHistory);
    const familyScore = this.analyzeFamilyHistory(cluster, weights.FamilyHistory);
    const deviceScore = this.analyzeDevicePatterns(cluster, weights.DevicePatterns);
    const populationScore = this.analyzePopulationModel(cluster, weights.PopulationModel);
    
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const aggregatedScore = (
      medicalScore * weights.MedicalHistory +
      familyScore * weights.FamilyHistory +
      deviceScore * weights.DevicePatterns +
      populationScore * weights.PopulationModel
    ) / totalWeight;
    
    return {
      riskFactors: this.detectRiskFactors(cluster),
      survivalProbability: this.calculateSurvivalProbability(aggregatedScore),
      healthScore: aggregatedScore,
      criticalAlerts: this.checkCriticalAlerts(cluster),
      weightConfig: weights,
      explanation: this.generateExplanation(cluster, weights)
    };
  }

  private static calculatePersonalizedWeights(cluster: PatientCluster): InferenceWeights {
    const weights: InferenceWeights = {
      MedicalHistory: 0.3,
      FamilyHistory: 0.2,
      DevicePatterns: 0.3,
      PopulationModel: 0.2
    };
    
    if (cluster.medicalRecords.length > 5) weights.MedicalHistory += 0.1;
    if (cluster.familyHistory.length > 2) weights.FamilyHistory += 0.1;
    if (cluster.deviceData.some(d => d.readings.length > 10)) weights.DevicePatterns += 0.15;
    
    const age = this.estimateAge(cluster);
    if (age > 60) weights.PopulationModel += 0.1;
    
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    Object.keys(weights).forEach(key => {
      weights[key as InferenceFactor] /= total;
    });
    
    return weights;
  }

  private static analyzeMedicalHistory(cluster: PatientCluster, weight: number): number {
    const records = cluster.medicalRecords;
    const recoveryRate = records.filter(r => r.outcome === 'Recovered').length / records.length;
    const uniqueTreatments = new Set(records.map(r => r.treatment)).size;
    const treatmentScore = Math.min(1, uniqueTreatments * 0.2);
    
    const now = new Date();
    const recentWeight = records
      .map(r => {
        const daysAgo = (now.getTime() - new Date(r.date).getTime()) / (86400000);
        return Math.max(0, 1 - daysAgo/365);
      })
      .reduce((sum, w) => sum + w, 0) / records.length;
    
    return (recoveryRate * 0.6 + treatmentScore * 0.3 + recentWeight * 0.1) * weight;
  }

  private static analyzeFamilyHistory(cluster: PatientCluster, weight: number): number {
    if (cluster.familyHistory.length === 0) return 0.8 * weight;
    
    const geneticConditions = ['Diabetes', 'HeartDisease', 'Cancer'];
    const earlyOnsetCount = cluster.familyHistory
      .filter(f => geneticConditions.includes(f.condition) && f.ageAtDiagnosis < 50)
      .length;
    
    return Math.max(0.4, 1 - earlyOnsetCount * 0.15) * weight;
  }

  private static analyzeDevicePatterns(cluster: PatientCluster, weight: number): number {
    let score = 1.0;
    
    cluster.deviceData.forEach(device => {
      const readings = device.readings.map(r => r.value);
      const avg = readings.reduce((sum, val) => sum + val, 0) / readings.length;
      
      switch (device.deviceType) {
        case 'BloodPressure':
          if (avg > 140) score *= 0.8;
          if (avg > 160) score *= 0.7;
          break;
        case 'GlucoseMonitor':
          if (avg > 180) score *= 0.85;
          if (avg > 220) score *= 0.6;
          break;
        case 'SmartWatch':
          const hrVariability = this.calculateHRV(readings);
          if (hrVariability < 20) score *= 0.9;
          break;
      }
    });
    
    return score * weight;
  }

  private static analyzePopulationModel(cluster: PatientCluster, weight: number): number {
    const primaryDiagnosis = this.getPrimaryDiagnosis(cluster.medicalRecords);
    const age = this.estimateAge(cluster);
    return PopulationModelService.getSurvivalProbability(
      primaryDiagnosis, age, 'unknown'
    ) * weight;
  }

  private static detectRiskFactors(cluster: PatientCluster): string[] {
    const factors: string[] = [];
    
    if (cluster.medicalRecords.filter(r => r.outcome === 'Chronic').length > 1) {
      factors.push('MultipleChronicConditions');
    }
    
    if (cluster.familyHistory.some(f => 
      f.condition === 'Cancer' && f.ageAtDiagnosis < 45)) {
      factors.push('EarlyOnsetCancerRisk');
    }
    
    if (cluster.deviceData.some(d => 
      d.deviceType === 'BloodPressure' && 
      d.readings.some(r => r.value > 180))) {
      factors.push('HypertensiveCrisisRisk');
    }
    
    return factors;
  }

  private static checkCriticalAlerts(cluster: PatientCluster): string[] {
    const alerts: string[] = [];
    
    cluster.deviceData.forEach(device => {
      device.readings.forEach(reading => {
        if (device.deviceType === 'BloodPressure' && reading.value > 180) {
          alerts.push(`Critical hypertension: ${reading.value} mmHg (${reading.timestamp.toLocaleDateString()})`);
        }
        if (device.deviceType === 'GlucoseMonitor' && reading.value > 300) {
          alerts.push(`Dangerous hyperglycemia: ${reading.value} mg/dL (${reading.timestamp.toLocaleDateString()})`);
        }
      });
    });
    
    return alerts;
  }

  private static calculateSurvivalProbability(aggregatedScore: number): number {
    return parseFloat((1 / (1 + Math.exp(-3 * (aggregatedScore - 0.7))).toFixed(2));
  }

  private static generateExplanation(cluster: PatientCluster, weights: InferenceWeights): string {
    const primaryDiagnosis = this.getPrimaryDiagnosis(cluster.medicalRecords);
    const age = this.estimateAge(cluster);
    
    return `Analysis of your health profile (${primaryDiagnosis}, estimated age ${age}):
• Medical history weight: ${(weights.MedicalHistory * 100).toFixed(0)}% (${cluster.medicalRecords.length} records)
• Family history weight: ${(weights.FamilyHistory * 100).toFixed(0)}% (${cluster.familyHistory.length} entries)
• Device data weight: ${(weights.DevicePatterns * 100).toFixed(0)}% (${cluster.deviceData.length} datasets)
• Population model weight: ${(weights.PopulationModel * 100).toFixed(0)}%`;
  }

  private static estimateAge(cluster: PatientCluster): number {
    const firstRecord = cluster.medicalRecords.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )[0];
    return firstRecord ? (new Date().getFullYear() - new Date(firstRecord.date).getFullYear() + 30) : 50;
  }

  private static getPrimaryDiagnosis(medical: MedicalData[]): string {
    return medical[0]?.diagnosis || 'UnknownCondition';
  }

  private static calculateHRV(heartRates: number[]): number {
    if (heartRates.length < 2) return 0;
    const diffs = heartRates.slice(1).map((val, i) => Math.abs(val - heartRates[i]));
    return diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;
  }
}