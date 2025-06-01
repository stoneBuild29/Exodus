// --------------- 4. 主系统 (mainSystem.ts) ---------------
import { DataStorage } from './storageService';
import { ExodusClusterEngine } from './clusteringEngine';
import { MedicalData, FamilyHistory, DeviceData } from './models';

// 初始化数据
function seedData() {
  // 添加梅奥诊所数据
  DataStorage.addMedicalData({
    id: 'm1', patientId: 'p123',
    source: 'MayoClinic',
    diagnosis: 'Type 2 Diabetes',
    treatment: 'Metformin',
    outcome: 'Chronic',
    date: new Date('2022-03-15')
  });

  // 添加协和医院数据
  DataStorage.addMedicalData({
    id: 'p1', patientId: 'p123',
    source: 'PekingUnion',
    diagnosis: 'Hypertension',
    treatment: 'Lisinopril',
    outcome: 'Chronic',
    date: new Date('2023-01-20')
  });

  // 添加家族病史
  DataStorage.addFamilyHistory({
    id: 'f1', patientId: 'p123',
    condition: 'HeartDisease',
    relation: 'Parent',
    ageAtDiagnosis: 58
  });

  // 添加设备数据
  DataStorage.addDeviceData({
    id: 'd1', patientId: 'p123',
    deviceType: 'BloodPressure',
    readings: [
      { timestamp: new Date('2023-05-01'), value: 145, unit: 'mmHg' },
      { timestamp: new Date('2023-05-02'), value: 138, unit: 'mmHg' }
    ]
  });
}

// mainSystem.ts
export function runExodusSystem(patientId: string) {
    seedGlobalData(); // 初始化全局数据
    
    // 构建个性化集群
    const cluster = ExodusClusterEngine.buildPersonalizedCluster(patientId);
    
    console.log('===== 个性化数据集群构建完成 =====');
    console.log(`患者ID: ${cluster.patientId}`);
    console.log(`相关医疗记录: ${cluster.medicalRecords.length}条`);
    console.log(`相关家族史: ${cluster.familyHistory.length}条`);
    console.log(`相关设备数据模式: ${cluster.deviceData.length}组`);
    
    // 显示部分相关数据来源
    const sources = new Set<string>();
    cluster.medicalRecords.forEach(r => sources.add(r.source));
    console.log(`数据来源机构: ${Array.from(sources).join(', ')}`);
    
    // 后续步骤：将此集群传递给分析引擎进行风险评估
    // const analysis = RiskAnalyzer.analyzeCluster(cluster);
    
    return cluster;
  }

// 运行系统 (示例)
runExodusSystem('p123');