import { PatientCluster } from './models';

// 推理因子类型
export type InferenceFactor = 
  | 'MedicalHistory'
  | 'FamilyHistory'
  | 'DevicePatterns'
  | 'PopulationModel';

// 推理因子权重配置
export interface InferenceWeights {
  MedicalHistory: number;
  FamilyHistory: number;
  DevicePatterns: number;
  PopulationModel: number;
}

// 推理结果
export interface InferenceResult {
  riskFactors: string[];
  survivalProbability: number;
  healthScore: number;
  criticalAlerts: string[];
  weightConfig: InferenceWeights;
  explanation: string;
}