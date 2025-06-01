// --------------- 3. 聚类引擎 (clusteringEngine.ts) ---------------
import { PatientCluster, MedicalData, FamilyHistory, DeviceData, PatientID } from './models';
import { DataStorage } from './storageService';

// 定义相似度匹配器接口，便于扩展不同匹配策略
interface SimilarityMatcher {
  isSimilar(patientId: PatientID, data: MedicalData | FamilyHistory | DeviceData): boolean;
}

export class ExodusClusterEngine {
  // 相似度匹配器集合
  private matchers: SimilarityMatcher[] = [
    new DiagnosisMatcher(),
    new GeneticProfileMatcher(),
    new VitalPatternMatcher()
  ];

  // 触发数据聚类 - 专注于构建个性化数据集
  static buildPersonalizedCluster(patientId: PatientID): PatientCluster {
    // 1. 获取患者基础数据
    const { medical, family, device } = DataStorage.getPatientData(patientId);
    
    // 2. 从海量数据中筛选相关记录
    const engine = new ExodusClusterEngine();
    const relatedMedical = engine.findRelatedMedicalRecords(patientId, medical);
    const relatedFamily = engine.findRelatedFamilyHistory(patientId, family);
    const relatedDevices = engine.findRelatedDeviceData(patientId, device);
    
    // 3. 构建个性化集群
    return {
      patientId,
      medicalRecords: [...medical, ...relatedMedical],
      familyHistory: [...family, ...relatedFamily],
      deviceData: [...device, ...relatedDevices],
      // 风险分析将在后续阶段进行
      riskFactors: [],
      survivalProbability: undefined
    };
  }

  // 从全局存储中查找相关医疗记录
  private findRelatedMedicalRecords(patientId: PatientID, patientMedical: MedicalData[]): MedicalData[] {
    // 提取患者的关键医疗特征
    const primaryDiagnosis = this.getPrimaryDiagnosis(patientMedical);
    const treatmentPatterns = this.getTreatmentPatterns(patientMedical);
    
    // 从所有机构获取数据
    const allMedical = DataStorage.getAllMedicalData();
    
    // 筛选相关性高的记录
    return allMedical.filter(record => 
      record.patientId !== patientId && 
      this.matchers.some(matcher => matcher.isSimilar(patientId, record)) &&
      (record.diagnosis === primaryDiagnosis || 
       treatmentPatterns.includes(record.treatment))
    );
  }

  // 从全局存储中查找相关家族病史
  private findRelatedFamilyHistory(patientId: PatientID, patientFamily: FamilyHistory[]): FamilyHistory[] {
    const geneticMarkers = this.extractGeneticMarkers(patientFamily);
    const allFamily = DataStorage.getAllFamilyHistory();
    
    return allFamily.filter(record => 
      record.patientId !== patientId &&
      geneticMarkers.some(marker => 
        marker.condition === record.condition && 
        Math.abs(marker.ageAtDiagnosis - record.ageAtDiagnosis) <= 5
      )
    );
  }

  // 从全局存储中查找相关设备数据
  private findRelatedDeviceData(patientId: PatientID, patientDevices: DeviceData[]): DeviceData[] {
    const vitalPatterns = this.identifyVitalPatterns(patientDevices);
    const allDevices = DataStorage.getAllDeviceData();
    
    return allDevices.filter(record => 
      record.patientId !== patientId &&
      vitalPatterns.some(pattern => 
        pattern.deviceType === record.deviceType &&
        this.calculatePatternSimilarity(pattern, record) > 0.7
      )
    );
  }

  // ---- 核心分析方法 ----
  
  // 提取主要诊断
  private getPrimaryDiagnosis(medical: MedicalData[]): string {
    // 找到最近且最严重的诊断
    return medical.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]?.diagnosis || '';
  }

  // 提取治疗模式
  private getTreatmentPatterns(medical: MedicalData[]): string[] {
    const treatments = new Set<string>();
    medical.forEach(record => {
      if (record.treatment) {
        record.treatment.split(',').forEach(t => treatments.add(t.trim()));
      }
    });
    return Array.from(treatments);
  }

  // 提取遗传标记
  private extractGeneticMarkers(family: FamilyHistory[]): { condition: string; ageAtDiagnosis: number }[] {
    const markers = new Map<string, number>();
    
    family.forEach(record => {
      const key = record.condition;
      if (!markers.has(key) || record.ageAtDiagnosis < markers.get(key)!) {
        markers.set(key, record.ageAtDiagnosis);
      }
    });
    
    return Array.from(markers.entries()).map(([condition, age]) => ({
      condition,
      ageAtDiagnosis: age
    }));
  }

  // 识别生命体征模式
  private identifyVitalPatterns(devices: DeviceData[]): { deviceType: string; pattern: number[] }[] {
    const patterns: { deviceType: string; pattern: number[] }[] = [];
    
    devices.forEach(device => {
      if (device.readings.length > 3) {
        const values = device.readings.map(r => r.value);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const normalized = values.map(val => val / avg);
        patterns.push({ deviceType: device.deviceType, pattern: normalized });
      }
    });
    
    return patterns;
  }

  // 计算模式相似度
  private calculatePatternSimilarity(
    pattern: { deviceType: string; pattern: number[] },
    device: DeviceData
  ): number {
    if (pattern.deviceType !== device.deviceType) return 0;
    
    const values = device.readings.map(r => r.value);
    if (values.length !== pattern.pattern.length) return 0;
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const normalized = values.map(val => val / avg);
    
    // 计算余弦相似度
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    
    for (let i = 0; i < pattern.pattern.length; i++) {
      dotProduct += pattern.pattern[i] * normalized[i];
      magnitudeA += pattern.pattern[i] ** 2;
      magnitudeB += normalized[i] ** 2;
    }
    
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    
    return dotProduct / (magnitudeA * magnitudeB);
  }
}

// ===== 相似度匹配器实现 =====

// 基于诊断的匹配器
class DiagnosisMatcher implements SimilarityMatcher {
  isSimilar(patientId: PatientID, data: MedicalData): boolean {
    const patientData = DataStorage.getPatientData(patientId);
    const patientDiagnoses = patientData.medical.map(m => m.diagnosis);
    return patientDiagnoses.includes(data.diagnosis);
  }
}

// 基于遗传特征的匹配器
class GeneticProfileMatcher implements SimilarityMatcher {
  isSimilar(patientId: PatientID, data: FamilyHistory): boolean {
    const patientData = DataStorage.getPatientData(patientId);
    const patientConditions = patientData.family.map(f => f.condition);
    return patientConditions.includes(data.condition);
  }
}

// 基于生命体征模式的匹配器
class VitalPatternMatcher implements SimilarityMatcher {
  isSimilar(patientId: PatientID, data: DeviceData): boolean {
    // 实际实现会使用更复杂的模式匹配算法
    const patientData = DataStorage.getPatientData(patientId);
    const sameTypeDevices = patientData.device.filter(d => d.deviceType === data.deviceType);
    
    if (sameTypeDevices.length === 0) return false;
    
    // 简单检查是否有类似范围的读数
    const patientValues = sameTypeDevices.flatMap(d => d.readings.map(r => r.value));
    const min = Math.min(...patientValues);
    const max = Math.max(...patientValues);
    
    return data.readings.some(r => r.value >= min && r.value <= max);
  }
}