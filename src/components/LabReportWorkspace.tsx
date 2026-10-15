import React, { useEffect, useRef } from 'react';
import templateHtml from '../data/lab-report-system.html?raw';
import {
  LabGeneratedReport,
  LabPatientRecord,
  LabSelectedTest,
} from '../types/labReports';
import {
  saveLabPatientRecord,
  subscribeLabGeneratedReports,
  subscribeLabPatientRecords,
} from '../lib/firebase';

const iframeBridge = `
<script>
(() => {
  let updatingFromCloud = false;
  const observeSize = () => parent.postMessage({
    source: 'amc-lab-frame',
    type: 'resize',
    height: document.documentElement.scrollHeight
  }, '*');
  new ResizeObserver(observeSize).observe(document.documentElement);
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    originalSetItem.call(this, key, value);
    if (!updatingFromCloud && (key === 'amc_patients' || key === 'amc_generated_reports')) {
      parent.postMessage({ source: 'amc-lab-frame', type: 'local-data', key, value }, '*');
    }
  };

  addEventListener('message', ({ data }) => {
    if (data?.source !== 'amc-lab-host') return;
    if (data.type === 'hydrate') {
      updatingFromCloud = true;
      localStorage.setItem('amc_patients', JSON.stringify(data.patients || {}));
      localStorage.setItem('amc_generated_reports', JSON.stringify(data.reports || []));
      updatingFromCloud = false;
      if (typeof renderDashboard === 'function') renderDashboard();
      if (typeof renderPreview === 'function' && document.getElementById('studioView')?.classList.contains('active')) renderPreview();
    }
    if (data.type === 'save-result' && typeof showToast === 'function') {
      showToast(data.error ? 'Database save failed: ' + data.error : 'তথ্য ডাটাবেজে সংরক্ষিত হয়েছে।');
    }
  });
})();
</script>
`;

const frameDocument = templateHtml.replace(
  /<script>\s*'use strict';/,
  `${iframeBridge}<script>\n'use strict';`
);

type LegacyPatient = {
  pid: string;
  pname: string;
  age?: string;
  gender?: string;
  doctor?: string;
  regdate?: string;
  specimen?: string;
  status?: string;
  assistant?: string;
  technologist?: string;
  assistantDetail?: string;
  techDetail?: string;
  training?: string;
  reportedAt?: string;
  updatedAt?: string;
};

type LegacySelectedTest = {
  catalogId?: number;
  category?: string;
  name?: string;
  displayName?: string;
  rows?: Array<{ param?: string; method?: string; value?: string; ref?: string }>;
};

type LegacyPatientEntry = {
  patient?: LegacyPatient;
  selected?: LegacySelectedTest[];
  updatedAt?: string;
} & Partial<LegacyPatient>;

type LegacyGeneratedReport = {
  pid?: string;
  pname?: string;
  testName?: string;
  category?: string;
  generatedAt?: string;
};

const allowedStatuses = new Set(['Pending', 'In Progress', 'Final', 'Verified']);
const reportSignature = (report: LegacyGeneratedReport) =>
  `${report.pid || ''}|${report.testName || ''}|${report.generatedAt || ''}`;

const toLabSelectedTest = (test: LegacySelectedTest, index: number): LabSelectedTest => ({
  templateId: `legacy-${test.catalogId ?? index}`,
  name: test.displayName || test.name || 'Laboratory test',
  category: test.category || '',
  rows: (test.rows || []).map((row) => ({
    parameter: row.param || '',
    method: row.method || '',
    result: row.value || '',
    reference: row.ref || '',
  })),
});

const toLabPatient = (
  id: string,
  entry: LegacyPatientEntry,
  firestoreId?: string
): Omit<LabPatientRecord, 'updatedAt'> => {
  const patient = entry.patient || entry;
  const status = allowedStatuses.has(patient.status || '') ? patient.status as LabPatientRecord['status'] : 'Pending';
  return {
    id: firestoreId || id,
    patientId: patient.pid || id,
    patientName: patient.pname || '',
    age: patient.age || '',
    gender: patient.gender || '',
    referredBy: patient.doctor || '',
    registrationDate: patient.regdate || '',
    specimen: patient.specimen || '',
    status,
    labAssistant: patient.assistant || '',
    medicalTechnologist: patient.technologist || '',
    assistantQualification: patient.assistantDetail || '',
    technologistQualification: patient.techDetail || '',
    training: patient.training || '',
    selectedTests: (entry.selected || []).map(toLabSelectedTest),
  };
};

export const LabReportWorkspace: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const frameReadyRef = useRef(false);
  const recordsLoadedRef = useRef(false);
  const reportsLoadedRef = useRef(false);
  const recordsRef = useRef<LabPatientRecord[]>([]);
  const reportsRef = useRef<LabGeneratedReport[]>([]);
  const firebaseIdByPatientRef = useRef(new Map<string, string>());
  const lastSavedPatientRef = useRef(new Map<string, string>());
  const pendingPatientRef = useRef(new Map<string, string>());
  const knownReportSignaturesRef = useRef(new Set<string>());
  const pendingReportSignaturesRef = useRef(new Set<string>());
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const localPatientsRef = useRef<Record<string, LegacyPatientEntry>>({});

  const sendToFrame = (data: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage({ source: 'amc-lab-host', ...data }, '*');
  };

  const hydrateFrame = () => {
    if (!frameReadyRef.current || !recordsLoadedRef.current || !reportsLoadedRef.current) return;
    const patients: Record<string, LegacyPatientEntry> = {};
    recordsRef.current.forEach((record) => {
      firebaseIdByPatientRef.current.set(record.patientId, record.id);
      patients[record.patientId] = {
        patient: {
          pid: record.patientId,
          pname: record.patientName,
          age: record.age,
          gender: record.gender,
          doctor: record.referredBy,
          regdate: record.registrationDate,
          specimen: record.specimen,
          status: record.status,
          assistant: record.labAssistant,
          technologist: record.medicalTechnologist,
          assistantDetail: record.assistantQualification,
          techDetail: record.technologistQualification,
          training: record.training,
          updatedAt: record.updatedAt,
        },
        selected: record.selectedTests.map((test) => ({
          name: test.name,
          displayName: test.name,
          category: test.category,
          rows: test.rows.map((row) => ({
            param: row.parameter,
            method: row.method,
            value: row.result,
            ref: row.reference,
          })),
        })),
        updatedAt: record.updatedAt,
      };
      lastSavedPatientRef.current.set(
        record.patientId,
        JSON.stringify(toLabPatient(record.patientId, patients[record.patientId], record.id))
      );
    });
    localPatientsRef.current = patients;
    const legacyReports = reportsRef.current.map((report) => ({
      pid: report.patientId,
      pname: report.patientName,
      testName: report.testName,
      category: report.category,
      generatedAt: report.generatedAt,
    }));
    legacyReports.forEach((report) => knownReportSignaturesRef.current.add(reportSignature(report)));
    sendToFrame({ type: 'hydrate', patients, reports: legacyReports });
  };

  useEffect(() => {
    const unsubscribePatients = subscribeLabPatientRecords((records) => {
      recordsLoadedRef.current = true;
      recordsRef.current = records;
      records.forEach((record) => firebaseIdByPatientRef.current.set(record.patientId, record.id));
      hydrateFrame();
    }, (error) => {
      console.error('Could not load lab patient records:', error);
      recordsLoadedRef.current = true;
      sendToFrame({ type: 'save-result', error: error.message });
      hydrateFrame();
    });
    const unsubscribeReports = subscribeLabGeneratedReports((reports) => {
      reportsLoadedRef.current = true;
      reportsRef.current = reports;
      reports.forEach((report) => knownReportSignaturesRef.current.add(
        `${report.patientId}|${report.testName}|${report.generatedAt}`
      ));
      hydrateFrame();
    }, (error) => {
      console.error('Could not load generated lab reports:', error);
      reportsLoadedRef.current = true;
      sendToFrame({ type: 'save-result', error: error.message });
      hydrateFrame();
    });

    const handleFrameMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow || event.data?.source !== 'amc-lab-frame') return;
      if (event.data.type === 'resize' && typeof event.data.height === 'number') {
        if (iframeRef.current) iframeRef.current.style.height = `${Math.max(850, event.data.height)}px`;
        return;
      }
      if (event.data.type !== 'local-data') return;

      try {
        if (event.data.key === 'amc_patients') {
          const patients = JSON.parse(String(event.data.value || '{}')) as Record<string, LegacyPatientEntry>;
          localPatientsRef.current = patients;
          Object.entries(patients).forEach(([patientId, entry]) => {
            const record = toLabPatient(patientId, entry, firebaseIdByPatientRef.current.get(patientId));
            const signature = JSON.stringify(record);
            if (lastSavedPatientRef.current.get(patientId) === signature || pendingPatientRef.current.get(patientId) === signature) return;
            pendingPatientRef.current.set(patientId, signature);
            saveQueueRef.current = saveQueueRef.current.then(async () => {
              try {
                const firestoreId = await saveLabPatientRecord(record);
                firebaseIdByPatientRef.current.set(patientId, firestoreId);
                lastSavedPatientRef.current.set(patientId, signature);
                sendToFrame({ type: 'save-result' });
              } catch (error) {
                pendingPatientRef.current.delete(patientId);
                throw error;
              }
            }).catch((error: unknown) => {
              console.error('Could not sync lab patient record:', error);
              sendToFrame({
                type: 'save-result',
                error: error instanceof Error ? error.message : String(error),
              });
            }).finally(() => pendingPatientRef.current.delete(patientId));
          });
        }

        if (event.data.key === 'amc_generated_reports') {
          const allReports = JSON.parse(String(event.data.value || '[]')) as LegacyGeneratedReport[];
          const newReports = allReports.filter((report) => {
            const signature = reportSignature(report);
            if (!report.pid || !report.testName || !report.generatedAt) return false;
            if (knownReportSignaturesRef.current.has(signature) || pendingReportSignaturesRef.current.has(signature)) return false;
            pendingReportSignaturesRef.current.add(signature);
            return true;
          });
          newReports.forEach((report) => {
            const entry = localPatientsRef.current[report.pid || ''];
            if (!entry) {
              pendingReportSignaturesRef.current.delete(reportSignature(report));
              return;
            }
            const patient = toLabPatient(
              report.pid || '',
              entry,
              firebaseIdByPatientRef.current.get(report.pid || '')
            );
            const selectedTest = patient.selectedTests.find((test) => test.name === report.testName);
            if (!selectedTest) {
              pendingReportSignaturesRef.current.delete(reportSignature(report));
              return;
            }
            const reportData = {
              patientId: patient.patientId,
              patientName: report.pname || patient.patientName,
              testName: report.testName || selectedTest.name,
              category: report.category || selectedTest.category,
              registrationDate: patient.registrationDate,
              generatedAt: report.generatedAt || new Date().toISOString(),
              status: patient.status,
              patient: {
                patientId: patient.patientId,
                patientName: patient.patientName,
                age: patient.age,
                gender: patient.gender,
                referredBy: patient.referredBy,
                registrationDate: patient.registrationDate,
                specimen: patient.specimen,
                status: patient.status,
                labAssistant: patient.labAssistant,
                medicalTechnologist: patient.medicalTechnologist,
                assistantQualification: patient.assistantQualification,
                technologistQualification: patient.technologistQualification,
                training: patient.training,
              },
              test: selectedTest,
            };
            const signature = reportSignature(report);
            saveQueueRef.current = saveQueueRef.current.then(async () => {
              try {
                const firestoreId = await saveLabPatientRecord(patient, [reportData]);
                firebaseIdByPatientRef.current.set(patient.patientId, firestoreId);
                lastSavedPatientRef.current.set(patient.patientId, JSON.stringify(patient));
                knownReportSignaturesRef.current.add(signature);
                sendToFrame({ type: 'save-result' });
              } catch (error) {
                pendingReportSignaturesRef.current.delete(signature);
                throw error;
              }
            }).catch((error: unknown) => {
              console.error('Could not sync generated lab report:', error);
              sendToFrame({
                type: 'save-result',
                error: error instanceof Error ? error.message : String(error),
              });
            }).finally(() => pendingReportSignaturesRef.current.delete(signature));
          });
        }
      } catch (error) {
        console.error('Could not read lab report workspace data:', error);
        sendToFrame({
          type: 'save-result',
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };

    window.addEventListener('message', handleFrameMessage);
    return () => {
      window.removeEventListener('message', handleFrameMessage);
      unsubscribePatients();
      unsubscribeReports();
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Anowara Medical Complex Laboratory Report System"
      srcDoc={frameDocument}
      onLoad={() => {
        frameReadyRef.current = true;
        hydrateFrame();
      }}
      className="block h-[1100px] w-full border-0 bg-white"
      style={{ minHeight: 'min(1100px, calc(100vh - 160px))' }}
    />
  );
};
