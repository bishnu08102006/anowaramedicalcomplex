export interface LabTestResult {
  parameter: string;
  method: string;
  result: string;
  reference: string;
}

export interface LabSelectedTest {
  templateId: string;
  name: string;
  category: string;
  rows: LabTestResult[];
}

export interface LabPatientRecord {
  id: string;
  patientId: string;
  patientName: string;
  age: string;
  gender: string;
  referredBy: string;
  registrationDate: string;
  specimen: string;
  status: 'Pending' | 'In Progress' | 'Final' | 'Verified';
  labAssistant: string;
  medicalTechnologist: string;
  assistantQualification: string;
  technologistQualification: string;
  training: string;
  selectedTests: LabSelectedTest[];
  updatedAt: string;
}

export interface LabGeneratedReport {
  id: string;
  patientRecordId: string;
  patientId: string;
  patientName: string;
  testName: string;
  category: string;
  registrationDate: string;
  generatedAt: string;
  status: LabPatientRecord['status'];
  patient: Omit<LabPatientRecord, 'id' | 'updatedAt' | 'selectedTests'>;
  test: LabSelectedTest;
}
