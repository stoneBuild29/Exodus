// --------------- 2. 存储服务 (storageService.ts) ---------------
import { MedicalData, FamilyHistory, DeviceData } from './models';

// 模拟不同医疗机构的BLESS端点
const medicalDataStore: Record<string, MedicalData[]> = {
  MayoClinic: [],
  PekingUnion: [],
  GermanHospital: []
};

const familyHistoryStore: FamilyHistory[] = [];
const deviceDataStore: DeviceData[] = [];

export const DataStorage = {
  // 添加医疗记录到对应机构端点
  addMedicalData(data: MedicalData): void {
    if (medicalDataStore[data.source]) {
      medicalDataStore[data.source].push(data);
    }
  },

  // 添加家族病史
  addFamilyHistory(data: FamilyHistory): void {
    familyHistoryStore.push(data);
  },

  // 添加设备数据
  addDeviceData(data: DeviceData): void {
    deviceDataStore.push(data);
  },

  // 获取患者所有相关数据
  getPatientData(patientId: PatientID): {
    medical: MedicalData[],
    family: FamilyHistory[],
    device: DeviceData[]
  } {
    const medical = Object.values(medicalDataStore)
      .flat()
      .filter(record => record.patientId === patientId);

    const family = familyHistoryStore
      .filter(record => record.patientId === patientId);

    const device = deviceDataStore
      .filter(record => record.patientId === patientId);

    return { medical, family, device };
  }
};

