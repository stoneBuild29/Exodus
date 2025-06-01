// --------------- 1. 数据模型定义 (models.ts) ---------------
export type PatientID = string;

// 基础医疗数据模型
export interface MedicalData {
  id: string;
  patientId: PatientID;
  source: 'MayoClinic' | 'PekingUnion' | 'GermanHospital';
  diagnosis: string;
  treatment: string;
  outcome: 'Recovered' | 'Chronic' | 'Deceased';
  date: Date;
}

// 家族健康史模型
export interface FamilyHistory {
  id: string;
  patientId: PatientID;
  condition: string;
  relation: 'Parent' | 'Sibling' | 'Grandparent';
  ageAtDiagnosis: number;
}

// 智能设备数据模型
export interface DeviceData {
  id: string;
  patientId: PatientID;
  deviceType: 'SmartWatch' | 'BloodPressure' | 'GlucoseMonitor';
  readings: {
    timestamp: Date;
    value: number;
    unit: string;
  }[];
}


// streamProcessor
export class DeviceStreamProcessor {
    private thresholds = {
      BloodPressure: { critical: 180, warning: 140 },
      GlucoseMonitor: { critical: 300, warning: 200 }
    };
    
    processReading(data: DeviceData) {
      data.readings.forEach(reading => {
        const threshold = this.thresholds[data.deviceType];
        if (reading.value > threshold.critical) {
          this.triggerAlert(data.patientId, 'CRITICAL');
        } else if (reading.value > threshold.warning) {
          this.triggerAlert(data.patientId, 'WARNING');
        }
      });
    }
    
    private triggerAlert(patientId: string, level: string) {
      // 推送预警到监控系统
    }
  }


  // 聚类后的患者档案
export interface PatientCluster {
  patientId: PatientID;
  medicalRecords: MedicalData[];
  familyHistory: FamilyHistory[];
  deviceData: DeviceData[];
  riskFactors: string[];
  survivalProbability?: number;
}