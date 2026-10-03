import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  getDoc,
  query,
  orderBy,
  writeBatch,
  Firestore
} from 'firebase/firestore';
import { AppointmentRecord } from '../context/DataContext';
import { Doctor } from '../data/doctors';
import { HospitalNotice } from '../data/notices';
import { BlogPost } from '../data/blogs';
import { StaffMember } from '../data/staff';
import { GalleryItem } from '../data/gallery';
import { ManagementMember } from '../data/management';
import { DiagnosticTest } from '../data/tests';

// Web app's Firebase configuration provided by Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAsA19l8YSdlYgqL4uhSulo1bJTTnTzuW0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "anoara-medical-complex.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "anoara-medical-complex",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "anoara-medical-complex.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "690520500985",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:690520500985:web:7086d5d8bf68834ed7d028",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-R7P4BKRCRL"
};

// Initialize Firebase App safely (prevent multiple initialization)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore Database
export const db: Firestore = getFirestore(app);

/**
 * Recursively strips undefined values from an object or array so Firestore setDoc/updateDoc/addDoc never fails
 */
export function cleanForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map(item => cleanForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        cleaned[key] = cleanForFirestore(val);
      }
    }
    return cleaned as unknown as T;
  }
  return data;
}

/* =========================================================================
   APPOINTMENTS / PATIENT SERIAL HELPERS (REAL-TIME SYNC)
   ========================================================================= */
const APPOINTMENTS_COLLECTION = 'appointments';

export const subscribeAppointments = (
  onUpdate: (appointments: AppointmentRecord[]) => void,
  onError?: (err: Error) => void
) => {
  try {
    const colRef = collection(db, APPOINTMENTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const records: AppointmentRecord[] = [];
        snapshot.forEach((docSnap) => {
          records.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<AppointmentRecord, 'id'>)
          });
        });
        // Sort descending by timestamp or id
        records.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        onUpdate(records);
      },
      (error) => {
        console.warn('Firestore appointment subscription warning:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    console.warn('Failed to subscribe to appointments:', error.message);
    if (onError) onError(error);
    return () => {};
  }
};

export const saveAppointmentToFirestore = async (appointment: AppointmentRecord): Promise<string> => {
  try {
    const colRef = collection(db, APPOINTMENTS_COLLECTION);
    const docRef = doc(colRef, appointment.id);
    const { id, ...data } = appointment;
    await setDoc(docRef, cleanForFirestore(data), { merge: true });
    return docRef.id;
  } catch (error) {
    console.error('Error saving appointment to Firestore:', error);
    throw error;
  }
};

export const updateAppointmentInFirestore = async (
  id: string, 
  updates: Partial<AppointmentRecord>
): Promise<void> => {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    const cleanUpdates = { ...updates };
    delete (cleanUpdates as any).id;
    await updateDoc(docRef, cleanForFirestore(cleanUpdates));
  } catch (error) {
    console.error('Error updating appointment in Firestore:', error);
    throw error;
  }
};

export const deleteAppointmentFromFirestore = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting appointment from Firestore:', error);
    throw error;
  }
};

export const deleteMultipleAppointmentsFromFirestore = async (ids: string[]): Promise<void> => {
  if (!ids.length) return;
  try {
    const batch = writeBatch(db);
    for (const id of ids) {
      const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
      batch.delete(docRef);
    }
    await batch.commit();
  } catch (error) {
    console.warn('Batch delete failed, falling back to individual deletes:', error);
    await Promise.allSettled(ids.map(id => deleteDoc(doc(db, APPOINTMENTS_COLLECTION, id))));
  }
};

/* =========================================================================
   DOCTORS ROSTER & SCHEDULE HELPERS
   ========================================================================= */
const DOCTORS_COLLECTION = 'doctors';

export const subscribeDoctors = (
  onUpdate: (doctors: Doctor[]) => void,
  onError?: (err: Error) => void
) => {
  try {
    const colRef = collection(db, DOCTORS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Doctor[] = [];
          snapshot.forEach((docSnap) => {
            list.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<Doctor, 'id'>)
            });
          });
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore doctors subscription warning:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    if (onError) onError(error);
    return () => {};
  }
};

export const saveDoctorToFirestore = async (doctor: Doctor): Promise<void> => {
  try {
    const docRef = doc(db, DOCTORS_COLLECTION, doctor.id);
    const { id, ...data } = doctor;
    const cleanData = cleanForFirestore({
      ...data,
      id: doctor.id,
      updatedAt: Date.now()
    });
    await setDoc(docRef, cleanData, { merge: true });
  } catch (error) {
    console.error('Error saving doctor to Firestore:', error);
    throw error;
  }
};

export const deleteDoctorFromFirestore = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, DOCTORS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting doctor from Firestore:', error);
    throw error;
  }
};

/* =========================================================================
   HOSPITAL NOTICES HELPERS
   ========================================================================= */
const NOTICES_COLLECTION = 'notices';

export const subscribeNotices = (
  onUpdate: (notices: HospitalNotice[]) => void,
  onError?: (err: Error) => void
) => {
  try {
    const colRef = collection(db, NOTICES_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: HospitalNotice[] = [];
          snapshot.forEach((docSnap) => {
            // Ignore the emergency header ticker document from the general notice board list
            if (docSnap.id === 'emergency-header-ticker' || docSnap.data().type === 'emergency_ticker') {
              return;
            }
            list.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<HospitalNotice, 'id'>)
            });
          });
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore notices subscription warning:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    if (onError) onError(error);
    return () => {};
  }
};

export const saveNoticeToFirestore = async (notice: HospitalNotice): Promise<void> => {
  try {
    const docRef = doc(db, NOTICES_COLLECTION, notice.id);
    const { id, ...data } = notice;
    const cleanData = cleanForFirestore({
      ...data,
      id: notice.id,
      updatedAt: Date.now()
    });
    await setDoc(docRef, cleanData, { merge: true });
  } catch (error) {
    console.error('Error saving notice to Firestore:', error);
    throw error;
  }
};

export const deleteNoticeFromFirestore = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, NOTICES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting notice from Firestore:', error);
    throw error;
  }
};

/* =========================================================================
   HEALTH BLOGS HELPERS
   ========================================================================= */
const BLOGS_COLLECTION = 'blogs';

export const subscribeBlogs = (
  onUpdate: (blogs: BlogPost[]) => void,
  onError?: (err: Error) => void
) => {
  try {
    const colRef = collection(db, BLOGS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: BlogPost[] = [];
          snapshot.forEach((docSnap) => {
            list.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<BlogPost, 'id'>)
            });
          });
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore blogs subscription warning:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    if (onError) onError(error);
    return () => {};
  }
};

export const saveBlogToFirestore = async (blog: BlogPost): Promise<void> => {
  try {
    const docRef = doc(db, BLOGS_COLLECTION, blog.id);
    const { id, ...data } = blog;
    const cleanData = cleanForFirestore({
      ...data,
      id: blog.id,
      updatedAt: Date.now()
    });
    await setDoc(docRef, cleanData, { merge: true });
  } catch (error) {
    console.error('Error saving blog to Firestore:', error);
    throw error;
  }
};

export const deleteBlogFromFirestore = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, BLOGS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting blog from Firestore:', error);
    throw error;
  }
};

/* =========================================================================
   STAFF MEMBERS / EMPLOYEE ID CARD HELPERS
   ========================================================================= */
const STAFF_COLLECTION = 'staff_members';

export const subscribeStaff = (
  onUpdate: (staff: StaffMember[]) => void,
  onError?: (err: Error) => void
) => {
  try {
    const colRef = collection(db, STAFF_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: StaffMember[] = [];
          snapshot.forEach((docSnap) => {
            list.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<StaffMember, 'id'>)
            });
          });
          // Sort by creation time or staffId
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore staff subscription warning:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    if (onError) onError(error);
    return () => {};
  }
};

export const saveStaffToFirestore = async (staff: StaffMember): Promise<void> => {
  try {
    const docRef = doc(db, STAFF_COLLECTION, staff.id);
    const { id, ...data } = staff;
    const cleanData = cleanForFirestore({
      ...data,
      id: staff.id,
      updatedAt: Date.now()
    });
    await setDoc(docRef, cleanData, { merge: true });
  } catch (error) {
    console.error('Error saving staff to Firestore:', error);
    throw error;
  }
};

export const deleteStaffFromFirestore = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, STAFF_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting staff from Firestore:', error);
    throw error;
  }
};

/* =========================================================================
   HOSPITAL PHOTO GALLERY HELPERS
   ========================================================================= */
const GALLERY_COLLECTION = 'gallery_items';

export const subscribeGallery = (
  onUpdate: (items: GalleryItem[]) => void,
  onError?: (err: Error) => void
) => {
  try {
    const colRef = collection(db, GALLERY_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: GalleryItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<GalleryItem, 'id'>)
            });
          });
          // Sort by creation time desc
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore gallery subscription warning:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    if (onError) onError(error);
    return () => {};
  }
};

export const saveGalleryItemToFirestore = async (item: GalleryItem): Promise<void> => {
  try {
    const docRef = doc(db, GALLERY_COLLECTION, item.id);
    const { id, ...data } = item;
    const cleanData = cleanForFirestore({
      ...data,
      id: item.id,
      updatedAt: Date.now()
    });
    await setDoc(docRef, cleanData, { merge: true });
  } catch (error) {
    console.error('Error saving gallery item to Firestore:', error);
    throw error;
  }
};

export const deleteGalleryItemFromFirestore = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, GALLERY_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting gallery item from Firestore:', error);
    throw error;
  }
};

/* =========================================================================
   MANAGEMENT MEMBERS / GOVERNING BODY (পরিচালনা পর্ষদ) HELPERS
   ========================================================================= */
const MANAGEMENT_COLLECTION = 'management_members';

export const subscribeManagement = (
  onUpdate: (members: ManagementMember[]) => void,
  onError?: (err: Error) => void
) => {
  try {
    const colRef = collection(db, MANAGEMENT_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ManagementMember[] = [];
          snapshot.forEach((docSnap) => {
            list.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<ManagementMember, 'id'>)
            });
          });
          // Sort by order or creation
          list.sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) {
              return a.order - b.order;
            }
            return (a.order !== undefined ? -1 : 1);
          });
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore management subscription warning:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    if (onError) onError(error);
    return () => {};
  }
};

export const saveManagementMemberToFirestore = async (member: ManagementMember): Promise<void> => {
  try {
    const docRef = doc(db, MANAGEMENT_COLLECTION, member.id);
    const { id, ...data } = member;
    const cleanData = cleanForFirestore({
      ...data,
      id: member.id,
      updatedAt: Date.now()
    });
    await setDoc(docRef, cleanData, { merge: true });
    console.log(`[Firestore] Management member ${member.id} successfully saved to Firestore!`);
  } catch (error) {
    console.error('Error saving management member to Firestore:', error);
    throw error;
  }
};

export const deleteManagementMemberFromFirestore = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, MANAGEMENT_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting management member from Firestore:', error);
    throw error;
  }
};

/* =========================================================================
   DIAGNOSTIC TESTS & PRICING HELPERS (REAL-TIME SYNC)
   ========================================================================= */
const DIAGNOSTIC_TESTS_COLLECTION = 'diagnostic_tests';

export const subscribeDiagnosticTests = (
  onUpdate: (tests: DiagnosticTest[]) => void,
  onError?: (err: Error) => void
) => {
  try {
    const colRef = collection(db, DIAGNOSTIC_TESTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: DiagnosticTest[] = [];
        snapshot.forEach((docSnap) => {
          list.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<DiagnosticTest, 'id'>)
          });
        });
        if (list.length > 0) {
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore diagnostic tests subscription error:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    console.warn('Failed to subscribe to diagnostic tests:', error.message);
    if (onError) onError(error);
    return () => {};
  }
};

export const saveDiagnosticTestToFirestore = async (test: DiagnosticTest): Promise<void> => {
  try {
    const docRef = doc(db, DIAGNOSTIC_TESTS_COLLECTION, test.id);
    const { id, ...data } = test;
    const cleanData = cleanForFirestore({
      ...data,
      id: test.id,
      updatedAt: Date.now()
    });
    await setDoc(docRef, cleanData, { merge: true });
  } catch (error) {
    console.error('Error saving diagnostic test to Firestore:', error);
    throw error;
  }
};

export const deleteDiagnosticTestFromFirestore = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, DIAGNOSTIC_TESTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting diagnostic test from Firestore:', error);
    throw error;
  }
};

/* =========================================================================
   EMERGENCY NOTICE / HEADER MARQUEE TICKER HELPERS (REAL-TIME CLOUD FIRESTORE)
   Stored directly in 'notices/emergency-header-ticker' and 'emergency_ticker/live_ticker'
   ========================================================================= */
export const SETTINGS_COLLECTION = 'site_settings';
export const EMERGENCY_NOTICE_DOC_ID = 'emergency_notice';
export const EMERGENCY_TICKER_NOTICE_DOC_ID = 'emergency-header-ticker';
export const EMERGENCY_TICKER_COLLECTION = 'emergency_ticker';

export interface EmergencyNoticeConfig {
  enabled: boolean;
  textBn: string;
  textEn: string;
  badgeBn: string;
  badgeEn: string;
  hotline: string;
  updatedAt?: number;
}

export const subscribeEmergencyNotice = (
  onUpdate: (config: EmergencyNoticeConfig) => void,
  onError?: (err: Error) => void
) => {
  try {
    // Primary subscription to the document in 'notices' collection (as viewed in Firebase Console)
    const docRef = doc(db, NOTICES_COLLECTION, EMERGENCY_TICKER_NOTICE_DOC_ID);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const isEnabled = 
            data.displayEmergencyTickerBarOnWebsite !== undefined ? Boolean(data.displayEmergencyTickerBarOnWebsite) :
            data['Display Emergency Ticker Bar on Website'] !== undefined ? Boolean(data['Display Emergency Ticker Bar on Website']) :
            data.enabled !== undefined ? Boolean(data.enabled) :
            data.displayEmergencyTickerBar !== undefined ? Boolean(data.displayEmergencyTickerBar) : true;

          onUpdate({
            enabled: isEnabled,
            textBn: data.liveEmergencyHeaderTicker ?? data['Live Emergency Header Ticker'] ?? data.textBn ?? '',
            textEn: data.liveEmergencyHeaderTickerEn ?? data['Live Emergency Header Ticker (English)'] ?? data.textEn ?? '',
            badgeBn: data.badgeBn || 'জরুরি নোটিশ',
            badgeEn: data.badgeEn || 'EMERGENCY',
            hotline: data.hotline || '01972-692504',
            updatedAt: data.updatedAt,
          });
        }
      },
      (error) => {
        console.warn('Firestore emergency notice subscription warning:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    if (onError) onError(error);
    return () => {};
  }
};

export const getEmergencyNoticeFromFirestore = async (): Promise<EmergencyNoticeConfig | null> => {
  try {
    // Try from notices collection first
    const docRef = doc(db, NOTICES_COLLECTION, EMERGENCY_TICKER_NOTICE_DOC_ID);
    let docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // Fallback to site_settings
      const settingsRef = doc(db, SETTINGS_COLLECTION, EMERGENCY_NOTICE_DOC_ID);
      docSnap = await getDoc(settingsRef);
    }

    if (docSnap.exists()) {
      const data = docSnap.data();
      const isEnabled = 
        data.displayEmergencyTickerBarOnWebsite !== undefined ? Boolean(data.displayEmergencyTickerBarOnWebsite) :
        data['Display Emergency Ticker Bar on Website'] !== undefined ? Boolean(data['Display Emergency Ticker Bar on Website']) :
        data.enabled !== undefined ? Boolean(data.enabled) :
        data.displayEmergencyTickerBar !== undefined ? Boolean(data.displayEmergencyTickerBar) : true;

      return {
        enabled: isEnabled,
        textBn: data.liveEmergencyHeaderTicker ?? data['Live Emergency Header Ticker'] ?? data.textBn ?? '',
        textEn: data.liveEmergencyHeaderTickerEn ?? data['Live Emergency Header Ticker (English)'] ?? data.textEn ?? '',
        badgeBn: data.badgeBn || 'জরুরি নোটিশ',
        badgeEn: data.badgeEn || 'EMERGENCY',
        hotline: data.hotline || '01972-692504',
        updatedAt: data.updatedAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting emergency notice from Firestore:', error);
    return null;
  }
};

export const saveEmergencyNoticeToFirestore = async (
  config: EmergencyNoticeConfig
): Promise<void> => {
  const timestamp = Date.now();
  const dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

  // Complete payload containing both explicit UI names and standard keys
  const rawPayload = {
    id: EMERGENCY_TICKER_NOTICE_DOC_ID,

    // Keys explicitly matching user's requested field names in Firestore console
    'Live Emergency Header Ticker': config.textBn,
    'Live Emergency Header Ticker (English)': config.textEn,
    'Display Emergency Ticker Bar on Website': config.enabled,

    // Code accessible aliases
    liveEmergencyHeaderTicker: config.textBn,
    liveEmergencyHeaderTickerEn: config.textEn,
    displayEmergencyTickerBarOnWebsite: config.enabled,
    displayEmergencyTickerBar: config.enabled,

    // Standard properties
    enabled: config.enabled,
    textBn: config.textBn,
    textEn: config.textEn,
    badgeBn: config.badgeBn || 'জরুরি নোটিশ',
    badgeEn: config.badgeEn || 'EMERGENCY',
    hotline: config.hotline || '01972-692504',
    title: 'Live Emergency Header Ticker',
    titleEn: 'Live Emergency Header Ticker',
    description: config.textBn,
    descriptionEn: config.textEn,
    badge: config.badgeBn || 'জরুরি নোটিশ',
    type: 'emergency_ticker',
    updatedAt: timestamp,
    lastUpdated: dateString,
  };

  const payload = cleanForFirestore(rawPayload);

  try {
    // 1. Save directly into 'notices' collection as 'emergency-header-ticker' (Visible right inside notices in Firestore console)
    const noticeDocRef = doc(db, NOTICES_COLLECTION, EMERGENCY_TICKER_NOTICE_DOC_ID);
    await setDoc(noticeDocRef, payload, { merge: true });

    // 2. Also save into dedicated 'emergency_ticker' collection
    const emTickerDocRef = doc(db, EMERGENCY_TICKER_COLLECTION, 'live_ticker');
    await setDoc(emTickerDocRef, payload, { merge: true });

    // 3. Also save into 'site_settings' collection
    const settingsDocRef = doc(db, SETTINGS_COLLECTION, EMERGENCY_NOTICE_DOC_ID);
    await setDoc(settingsDocRef, payload, { merge: true });
  } catch (error) {
    console.error('Error saving emergency notice to Firestore:', error);
    throw error;
  }
};

/* =========================================================================
   AUTO-SEED / INITIAL SYNC FOR DOCTORS, NOTICES, STAFF, GALLERY, MANAGEMENT, TESTS, BLOGS & EMERGENCY NOTICE
   ========================================================================= */
export const syncDoctorsAndNoticesIfEmpty = async (
  defaultDoctors: Doctor[],
  defaultNotices: HospitalNotice[],
  defaultStaff?: StaffMember[],
  defaultGallery?: GalleryItem[],
  defaultManagement?: ManagementMember[],
  defaultTests?: DiagnosticTest[],
  defaultBlogs?: BlogPost[],
  defaultEmergencyNotice?: EmergencyNoticeConfig
): Promise<void> => {
  try {
    // 1. Check and seed Doctors
    const docCol = collection(db, DOCTORS_COLLECTION);
    const docSnap = await getDocs(docCol);
    if (docSnap.empty && defaultDoctors.length > 0) {
      console.log('Seeding initial doctors to Firestore...');
      for (const doctor of defaultDoctors) {
        await saveDoctorToFirestore(doctor);
      }
    }

    // 2. Check and seed Notices
    const noticeCol = collection(db, NOTICES_COLLECTION);
    const noticeSnap = await getDocs(noticeCol);
    if (noticeSnap.empty && defaultNotices.length > 0) {
      console.log('Seeding initial notices to Firestore...');
      for (const notice of defaultNotices) {
        await saveNoticeToFirestore(notice);
      }
    }

    // 3. Check and seed Staff
    if (defaultStaff && defaultStaff.length > 0) {
      const staffCol = collection(db, STAFF_COLLECTION);
      const staffSnap = await getDocs(staffCol);
      if (staffSnap.empty) {
        console.log('Seeding initial staff to Firestore...');
        for (const s of defaultStaff) {
          await saveStaffToFirestore(s);
        }
      }
    }

    // 4. Check and seed Gallery
    if (defaultGallery && defaultGallery.length > 0) {
      const galCol = collection(db, GALLERY_COLLECTION);
      const galSnap = await getDocs(galCol);
      if (galSnap.empty) {
        console.log('Seeding initial gallery items to Firestore...');
        for (const g of defaultGallery) {
          await saveGalleryItemToFirestore(g);
        }
      }
    }

    // 5. Check and seed Management
    if (defaultManagement && defaultManagement.length > 0) {
      const mgmtCol = collection(db, MANAGEMENT_COLLECTION);
      const mgmtSnap = await getDocs(mgmtCol);
      if (mgmtSnap.empty) {
        console.log('Seeding initial management members to Firestore...');
        for (const m of defaultManagement) {
          await saveManagementMemberToFirestore(m);
        }
      }
    }

    // 6. Check and seed Diagnostic Tests
    if (defaultTests && defaultTests.length > 0) {
      const testCol = collection(db, DIAGNOSTIC_TESTS_COLLECTION);
      const testSnap = await getDocs(testCol);
      if (testSnap.empty) {
        console.log('Seeding initial diagnostic tests to Firestore...');
        for (const t of defaultTests) {
          await saveDiagnosticTestToFirestore(t);
        }
      }
    }

    // 7. Check and seed Blogs
    if (defaultBlogs && defaultBlogs.length > 0) {
      const blogCol = collection(db, BLOGS_COLLECTION);
      const blogSnap = await getDocs(blogCol);
      if (blogSnap.empty) {
        console.log('Seeding initial blogs to Firestore...');
        for (const b of defaultBlogs) {
          await saveBlogToFirestore(b);
        }
      }
    }

    // 8. Check and seed Emergency Scroll Notice & Toggle State in 'notices' and 'emergency_ticker'
    if (defaultEmergencyNotice) {
      const emNoticeDocRef = doc(db, NOTICES_COLLECTION, EMERGENCY_TICKER_NOTICE_DOC_ID);
      const emNoticeDocSnap = await getDoc(emNoticeDocRef);
      if (!emNoticeDocSnap.exists()) {
        console.log('Seeding initial emergency header ticker into notices collection in Firestore...');
        await saveEmergencyNoticeToFirestore(defaultEmergencyNotice);
      }
    }
  } catch (err) {
    console.warn('Initial data seeding notice:', err);
  }
};

/* =========================================================================
   SECURITY & AUTH CREDENTIALS (SALTED SHA-256 HASHES ONLY - ZERO PLAINTEXT)
   Stored in Firestore Cloud Database 'security_settings/credentials'
   ========================================================================= */
export const SECURITY_COLLECTION = 'security_settings';
export const CREDENTIALS_DOC_ID = 'credentials';

export interface StoredRoleCredential {
  username: string;
  passwordHash: string; // Irreversible Salted SHA-256
  salt: string;         // Unique cryptographic salt
  updatedAt: number;
  lastUpdatedBy?: string;
}

export interface SecurityCredentialsDoc {
  admin: StoredRoleCredential;
  receptionist: StoredRoleCredential;
  lastUpdated: number;
}

export const subscribeSecurityCredentials = (
  onUpdate: (creds: SecurityCredentialsDoc) => void,
  onError?: (err: Error) => void
) => {
  try {
    const docRef = doc(db, SECURITY_COLLECTION, CREDENTIALS_DOC_ID);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SecurityCredentialsDoc;
          onUpdate(data);
        }
      },
      (error) => {
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    if (onError) onError(error);
    return () => {};
  }
};

export const getSecurityCredentialsFromFirestore = async (): Promise<SecurityCredentialsDoc | null> => {
  try {
    const docRef = doc(db, SECURITY_COLLECTION, CREDENTIALS_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SecurityCredentialsDoc;
    }
    return null;
  } catch {
    return null;
  }
};

export const saveSecurityCredentialsToFirestore = async (
  creds: SecurityCredentialsDoc
): Promise<void> => {
  try {
    const docRef = doc(db, SECURITY_COLLECTION, CREDENTIALS_DOC_ID);
    await setDoc(docRef, creds, { merge: true });
  } catch (error) {
    throw error;
  }
};
