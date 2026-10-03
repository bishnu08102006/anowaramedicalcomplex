import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Doctor, doctorsData } from '../data/doctors';
import { HospitalNotice, hospitalNotices } from '../data/notices';
import { BlogPost, initialBlogsData } from '../data/blogs';
import { StaffMember, initialStaffMembers } from '../data/staff';
import { GalleryItem, initialGalleryItems } from '../data/gallery';
import { ManagementMember, managementMembers as initialManagementMembers } from '../data/management';
import { DiagnosticTest, diagnosticTests as initialDiagnosticTests } from '../data/tests';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  safeEqual,
  sanitizeInput,
  checkLockout,
  recordFailedAttempt,
  clearLockout,
  createSecureSession,
  getActiveSession,
  destroySession,
  LockoutStatus
} from '../utils/security';
import {
  subscribeAppointments,
  saveAppointmentToFirestore,
  updateAppointmentInFirestore,
  deleteAppointmentFromFirestore,
  deleteMultipleAppointmentsFromFirestore,
  subscribeDoctors,
  saveDoctorToFirestore,
  deleteDoctorFromFirestore,
  subscribeNotices,
  saveNoticeToFirestore,
  deleteNoticeFromFirestore,
  subscribeBlogs,
  saveBlogToFirestore,
  deleteBlogFromFirestore,
  subscribeStaff,
  saveStaffToFirestore,
  deleteStaffFromFirestore,
  subscribeGallery,
  saveGalleryItemToFirestore,
  deleteGalleryItemFromFirestore,
  subscribeManagement,
  saveManagementMemberToFirestore,
  deleteManagementMemberFromFirestore,
  subscribeDiagnosticTests,
  saveDiagnosticTestToFirestore,
  deleteDiagnosticTestFromFirestore,
  syncDoctorsAndNoticesIfEmpty,
  subscribeEmergencyNotice,
  saveEmergencyNoticeToFirestore,
  getEmergencyNoticeFromFirestore,
  EmergencyNoticeConfig,
  subscribeSecurityCredentials,
  getSecurityCredentialsFromFirestore,
  saveSecurityCredentialsToFirestore,
  SecurityCredentialsDoc
} from '../lib/firebase';

export interface AppointmentRecord {
  id: string;
  orderNumber?: string; // e.g. "AMC-ORD-260918-4821"
  token: string; // e.g. "AMC-84920"
  patientName: string;
  phone: string;
  doctor: string;
  notes: string;
  age?: string;
  gender?: string;
  createdAt: string; // Time when serial was given
  timestamp?: number; // Unix epoch milliseconds for precise date calculation and 30-day cleanup
  assignedTimeSlot: string; // Receptionist sets this, e.g. "সকাল ১০:৩০"
  status: 'pending' | 'confirmed' | 'attended' | 'cancelled';
}

const nowMs = Date.now();
const initialSeedAppointments: AppointmentRecord[] = [
  {
    id: "apt-101",
    orderNumber: "AMC-ORD-260918-0001",
    token: "AMC-001",
    patientName: "মোঃ রফিকুল হাসান",
    phone: "01715-482910",
    doctor: "সহকারী অধ্যাপক ডাঃ নাজমুল হুদা — চর্ম-যৌক-সেক্স",
    notes: "এলার্জি ও দীর্ঘদিনের চর্মজনিত সমস্যা",
    age: "৩৫",
    gender: "পুরুষ",
    createdAt: "আজ সকাল ০৯:১৫",
    timestamp: nowMs - 1000 * 60 * 60 * 3,
    assignedTimeSlot: "সকাল ১০:৩০",
    status: "confirmed"
  },
  {
    id: "apt-102",
    orderNumber: "AMC-ORD-260918-0002",
    token: "AMC-002",
    patientName: "মোসাঃ ফাতেমা বেগম",
    phone: "01912-334455",
    doctor: "ডাঃ রওশন জাহান — প্রসূতি ও স্ত্রীরোগ বিশেষজ্ঞ",
    notes: "নিয়মিত অ্যান্টিন্যাটাল চেক-আপ ও আল্ট্রাসাউন্ড",
    age: "২৮",
    gender: "মহিলা",
    createdAt: "আজ সকাল ১০:০৫",
    timestamp: nowMs - 1000 * 60 * 60 * 2,
    assignedTimeSlot: "সকাল ১১:১৫",
    status: "pending"
  },
  {
    id: "apt-103",
    orderNumber: "AMC-ORD-260918-0003",
    token: "AMC-003",
    patientName: "কামাল উদ্দিন ভূঁইয়া",
    phone: "01823-998877",
    doctor: "ডাঃ মোঃ আব্দুল মোতালিব — হৃদরোগ ও মেডিসিন",
    notes: "বুকে চাপ ও উচ্চ রক্তচাপের সমস্যা",
    age: "৫২",
    gender: "পুরুষ",
    createdAt: "আজ সকাল ১০:৪০",
    timestamp: nowMs - 1000 * 60 * 50,
    assignedTimeSlot: "বিকাল ০৩:৩০",
    status: "confirmed"
  },
  {
    id: "apt-104",
    orderNumber: "AMC-ORD-260918-0004",
    token: "AMC-004",
    patientName: "তানভীর আহমেদ",
    phone: "01314-556677",
    doctor: "সাধারণ (রিসেপশন নির্ধারণ করবে)",
    notes: "বিদেশগামী মেডিকেল ফিটনেস টেস্ট এর প্রাথমিক পরামর্শ",
    age: "২৪",
    gender: "পুরুষ",
    createdAt: "আজ সকাল ১১:২০",
    timestamp: nowMs - 1000 * 60 * 20,
    assignedTimeSlot: "অপেক্ষমান (ফোন দেওয়া হবে)",
    status: "pending"
  }
];

export type { EmergencyNoticeConfig };

export const defaultEmergencyNotice: EmergencyNoticeConfig = {
  enabled: true,
  badgeBn: 'জরুরি নোটিশ',
  badgeEn: 'EMERGENCY',
  textBn: 'বিশেষ ফ্রি স্বাস্থ্য ক্যাম্প ও কনসালটেশন | ডিজিটাল এক্স-রে ও আল্ট্রাসনোগ্রামে ১৫% ছাড় | বিদেশগামীদের ওয়ান-স্টপ মেডিকেল চেকআপ চালু | ২৪ ঘণ্টা ইমার্জেন্সি ও অ্যাম্বুলেন্স সেবা',
  textEn: 'Special Free Health Camp & Medical Consultation | 15% Flat Discount on Digital X-Ray & USG | One-Stop Overseas Medical Checkup | 24/7 Emergency & Ambulance Service',
  hotline: '01972-692504'
};

interface DataContextType {
  // Doctors
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Doctor;
  updateDoctor: (id: string, updated: Partial<Omit<Doctor, 'id'>>) => void;
  removeDoctor: (id: string) => void;
  resetDoctors: () => void;

  // Emergency Notice Marquee
  emergencyNotice: EmergencyNoticeConfig;
  updateEmergencyNotice: (config: Partial<EmergencyNoticeConfig>) => Promise<{ success: boolean; error?: string }>;
  resetEmergencyNotice: () => Promise<void>;

  // Notices
  notices: HospitalNotice[];
  addNotice: (notice: Omit<HospitalNotice, 'id'>) => HospitalNotice;
  updateNotice: (id: string, notice: Partial<Omit<HospitalNotice, 'id'>>) => void;
  removeNotice: (id: string) => void;
  resetNotices: () => void;

  // Blogs
  blogs: BlogPost[];
  addBlog: (blog: Omit<BlogPost, 'id'>) => Promise<BlogPost>;
  removeBlog: (id: string) => void;
  resetBlogs: () => void;

  // Appointments / Serials
  appointments: AppointmentRecord[];
  addAppointment: (data: {
    patientName: string;
    phone: string;
    doctor: string;
    notes?: string;
    age?: string;
    gender?: string;
  }) => AppointmentRecord;
  updateAppointmentStatus: (
    id: string,
    status: AppointmentRecord['status'],
    assignedTimeSlot?: string
  ) => void;
  removeAppointment: (id: string) => void;
  deleteAppointmentsOlderThan30Days: () => Promise<number>;
  resetAppointments: () => void;

  // Staff Members / Employee ID Card System
  staffList: StaffMember[];
  addStaff: (data: Omit<StaffMember, 'id'>) => StaffMember;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  removeStaff: (id: string) => void;
  resetStaff: () => void;

  // Photo Gallery
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => GalleryItem;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => void;
  removeGalleryItem: (id: string) => void;
  resetGalleryItems: () => void;

  // Management & Governing Body (পরিচালনা পর্ষদ)
  managementMembers: ManagementMember[];
  addManagementMember: (member: Omit<ManagementMember, 'id'>) => Promise<ManagementMember> | ManagementMember;
  updateManagementMember: (id: string, updates: Partial<ManagementMember>) => Promise<void> | void;
  removeManagementMember: (id: string) => Promise<void> | void;
  resetManagementMembers: () => void;
  resetManagement?: () => void;

  // Diagnostic Tests & Price List (পরীক্ষা-নিরীক্ষার সম্ভাব্য মূল্য তালিকা)
  diagnosticTests: DiagnosticTest[];
  addDiagnosticTest: (test: Omit<DiagnosticTest, 'id'>) => DiagnosticTest;
  updateDiagnosticTest: (id: string, updates: Partial<DiagnosticTest>) => void;
  removeDiagnosticTest: (id: string) => void;
  resetDiagnosticTests: () => void;

  // Auth State & Security
  isAdminLoggedIn: boolean;
  isReceptionistLoggedIn: boolean;
  adminUsername: string;
  receptionistUsername: string;
  isSecuritySyncedToCloud: boolean;
  loginAdmin: (user: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  loginReceptionist: (user: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutReceptionist: () => void;
  changePassword: (
    role: 'admin' | 'receptionist',
    newPass: string,
    currentPass?: string
  ) => Promise<{ success: boolean; message: string }>;
  updateCredentials: (
    role: 'admin' | 'receptionist',
    newUsername: string,
    newPassword?: string,
    currentPass?: string
  ) => Promise<{ success: boolean; message: string }>;
  checkLockoutStatus: (role: 'admin' | 'receptionist') => LockoutStatus;
  isFirebaseConnected: boolean;
  syncAllToFirestore: () => Promise<{ success: boolean; message: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DOCTORS_KEY = 'amc_doctors_v2';
const NOTICES_KEY = 'amc_notices_v2';
const EMERGENCY_NOTICE_KEY = 'amc_emergency_notice_v2';
const BLOGS_KEY = 'amc_blogs_v2';
const APPOINTMENTS_KEY = 'amc_appointments_v2';
const STAFF_KEY = 'amc_staff_v2';
const GALLERY_KEY = 'amc_gallery_v2';
const MANAGEMENT_KEY = 'amc_management_v2';
const DIAGNOSTIC_TESTS_KEY = 'amc_diagnostic_tests_v2';
const ADMIN_AUTH_KEY = 'amc_admin_auth';
const RECEPTION_AUTH_KEY = 'amc_reception_auth';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Doctors State
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem(DOCTORS_KEY);
      return saved ? JSON.parse(saved) : doctorsData;
    } catch {
      return doctorsData;
    }
  });

  // 1.1 Emergency Marquee State
  const [emergencyNotice, setEmergencyNotice] = useState<EmergencyNoticeConfig>(() => {
    try {
      const saved = localStorage.getItem(EMERGENCY_NOTICE_KEY);
      return saved ? { ...defaultEmergencyNotice, ...JSON.parse(saved) } : defaultEmergencyNotice;
    } catch {
      return defaultEmergencyNotice;
    }
  });

  // 2. Notices State
  const [notices, setNotices] = useState<HospitalNotice[]>(() => {
    try {
      const saved = localStorage.getItem(NOTICES_KEY);
      return saved ? JSON.parse(saved) : hospitalNotices;
    } catch {
      return hospitalNotices;
    }
  });

  // 3. Blogs State
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(BLOGS_KEY);
      return saved ? JSON.parse(saved) : initialBlogsData;
    } catch {
      return initialBlogsData;
    }
  });

  // 4. Appointments State
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(APPOINTMENTS_KEY);
      return saved ? JSON.parse(saved) : initialSeedAppointments;
    } catch {
      return initialSeedAppointments;
    }
  });

  // 4.1 Staff Members State (Employee ID Card System)
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(STAFF_KEY);
      return saved ? JSON.parse(saved) : initialStaffMembers;
    } catch {
      return initialStaffMembers;
    }
  });

  // 4.2 Photo Gallery Items State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(GALLERY_KEY);
      return saved ? JSON.parse(saved) : initialGalleryItems;
    } catch {
      return initialGalleryItems;
    }
  });

  // 4.3 Management Members (পরিচালনা পর্ষদ) State
  const [managementMembers, setManagementMembers] = useState<ManagementMember[]>(() => {
    try {
      const saved = localStorage.getItem(MANAGEMENT_KEY);
      return saved ? JSON.parse(saved) : initialManagementMembers;
    } catch {
      return initialManagementMembers;
    }
  });

  // 4.4 Diagnostic Tests & Price List (পরীক্ষা-নিরীক্ষার সম্ভাব্য মূল্য তালিকা) State
  const [diagnosticTests, setDiagnosticTests] = useState<DiagnosticTest[]>(() => {
    try {
      const saved = localStorage.getItem(DIAGNOSTIC_TESTS_KEY);
      return saved ? JSON.parse(saved) : initialDiagnosticTests;
    } catch {
      return initialDiagnosticTests;
    }
  });

  // 5. Auth State & Session verification
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return getActiveSession('admin') !== null;
  });

  const [isReceptionistLoggedIn, setIsReceptionistLoggedIn] = useState<boolean>(() => {
    return getActiveSession('receptionist') !== null;
  });

  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  // Real-time Cloud Firestore Subscriptions
  useEffect(() => {
    // 1. Live Sync for Appointments (Patient Serials)
    const unsubAppointments = subscribeAppointments(
      (remoteAppointments) => {
        if (remoteAppointments && remoteAppointments.length > 0) {
          setAppointments(remoteAppointments);
        }
        setIsFirebaseConnected(true);
      },
      () => {
        // Safe offline fallback
        setIsFirebaseConnected(false);
      }
    );

    // 2. Live Sync for Doctors
    const unsubDoctors = subscribeDoctors((remoteDoctors) => {
      if (remoteDoctors && remoteDoctors.length > 0) {
        setDoctors(remoteDoctors);
      }
    });

    // 3. Live Sync for Notices
    const unsubNotices = subscribeNotices((remoteNotices) => {
      if (remoteNotices && remoteNotices.length > 0) {
        setNotices(remoteNotices);
      }
    });

    // 4. Live Sync for Blogs
    const unsubBlogs = subscribeBlogs((remoteBlogs) => {
      if (remoteBlogs && remoteBlogs.length > 0) {
        setBlogs(remoteBlogs);
      }
    });

    // 5. Live Sync for Staff Members
    const unsubStaff = subscribeStaff((remoteStaff) => {
      if (remoteStaff && remoteStaff.length > 0) {
        setStaffList(remoteStaff);
      }
    });

    // 6. Live Sync for Gallery Items
    const unsubGallery = subscribeGallery((remoteGallery) => {
      if (remoteGallery && remoteGallery.length > 0) {
        setGalleryItems(remoteGallery);
      }
    });

    // 7. Live Sync for Management Members (পরিচালনা পর্ষদ)
    const unsubManagement = subscribeManagement((remoteManagement) => {
      if (remoteManagement && remoteManagement.length > 0) {
        setManagementMembers(remoteManagement);
        try {
          localStorage.setItem(MANAGEMENT_KEY, JSON.stringify(remoteManagement));
        } catch {}
      }
    });

    // 8. Live Sync for Diagnostic Tests (পরীক্ষা ও মূল্য তালিকা)
    const unsubTests = subscribeDiagnosticTests((remoteTests) => {
      if (remoteTests && remoteTests.length > 0) {
        setDiagnosticTests(remoteTests);
      }
    });

    // 9. Live Sync for Emergency Scroll Notice & Toggle (হেডার মারকুই ও সুইচ)
    const unsubEmergency = subscribeEmergencyNotice((remoteEmergency) => {
      if (remoteEmergency) {
        setEmergencyNotice(remoteEmergency);
        try {
          localStorage.setItem(EMERGENCY_NOTICE_KEY, JSON.stringify(remoteEmergency));
        } catch {}
      }
    });

    // Auto-seed initial Doctors, Notices, Staff, Gallery, Management, Tests, Blogs & Emergency Notice into Firestore if collections are empty
    syncDoctorsAndNoticesIfEmpty(
      doctorsData,
      hospitalNotices,
      initialStaffMembers,
      initialGalleryItems,
      initialManagementMembers,
      initialDiagnosticTests,
      initialBlogsData,
      defaultEmergencyNotice
    ).catch((err) => {
      console.warn('Initial seeding check:', err);
    });

    return () => {
      if (typeof unsubAppointments === 'function') unsubAppointments();
      if (typeof unsubDoctors === 'function') unsubDoctors();
      if (typeof unsubNotices === 'function') unsubNotices();
      if (typeof unsubBlogs === 'function') unsubBlogs();
      if (typeof unsubStaff === 'function') unsubStaff();
      if (typeof unsubGallery === 'function') unsubGallery();
      if (typeof unsubManagement === 'function') unsubManagement();
      if (typeof unsubTests === 'function') unsubTests();
      if (typeof unsubEmergency === 'function') unsubEmergency();
    };
  }, []);

  // Initialize Salted Credentials & Sync with Firestore Cloud Database
  const [securityCreds, setSecurityCreds] = useState<SecurityCredentialsDoc | null>(() => {
    try {
      const stored = localStorage.getItem('amc_sec_creds_v3');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isSecuritySyncedToCloud, setIsSecuritySyncedToCloud] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const initCloudCredentials = async () => {
      try {
        const cloudCreds = await getSecurityCredentialsFromFirestore();
        if (cloudCreds && isMounted) {
          setSecurityCreds(cloudCreds);
          setIsSecuritySyncedToCloud(true);
          localStorage.setItem('amc_sec_creds_v3', JSON.stringify(cloudCreds));
          return;
        }

        // If cloud does not have credentials yet, generate initial secure credentials with unique salts
        const adminSalt = generateSalt();
        const receptionSalt = generateSalt();
        const adminHash = await hashPassword('admin', adminSalt);
        const receptionHash = await hashPassword('123', receptionSalt);

        const initialDoc: SecurityCredentialsDoc = {
          admin: {
            username: 'admin',
            passwordHash: adminHash,
            salt: adminSalt,
            updatedAt: Date.now(),
            lastUpdatedBy: 'system'
          },
          receptionist: {
            username: 'reception',
            passwordHash: receptionHash,
            salt: receptionSalt,
            updatedAt: Date.now(),
            lastUpdatedBy: 'system'
          },
          lastUpdated: Date.now()
        };

        await saveSecurityCredentialsToFirestore(initialDoc);
        if (isMounted) {
          setSecurityCreds(initialDoc);
          setIsSecuritySyncedToCloud(true);
          localStorage.setItem('amc_sec_creds_v3', JSON.stringify(initialDoc));
        }
      } catch {
        const local = localStorage.getItem('amc_sec_creds_v3');
        if (local && isMounted) {
          try {
            setSecurityCreds(JSON.parse(local));
          } catch {}
        }
      }
    };

    initCloudCredentials();

    const unsubCreds = subscribeSecurityCredentials((cloudCreds) => {
      if (isMounted && cloudCreds) {
        setSecurityCreds(cloudCreds);
        setIsSecuritySyncedToCloud(true);
        localStorage.setItem('amc_sec_creds_v3', JSON.stringify(cloudCreds));
      }
    });

    return () => {
      isMounted = false;
      if (typeof unsubCreds === 'function') unsubCreds();
    };
  }, []);

  // Periodic session integrity & expiration check
  useEffect(() => {
    const interval = setInterval(() => {
      const adminActive = getActiveSession('admin') !== null;
      if (isAdminLoggedIn !== adminActive) {
        setIsAdminLoggedIn(adminActive);
      }
      const receptionActive = getActiveSession('receptionist') !== null;
      if (isReceptionistLoggedIn !== receptionActive) {
        setIsReceptionistLoggedIn(receptionActive);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [isAdminLoggedIn, isReceptionistLoggedIn]);

  // Persist handlers
  useEffect(() => {
    try {
      localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors));
    } catch { /* ignore */ }
  }, [doctors]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTICES_KEY, JSON.stringify(notices));
    } catch { /* ignore */ }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem(EMERGENCY_NOTICE_KEY, JSON.stringify(emergencyNotice));
    } catch { /* ignore */ }
  }, [emergencyNotice]);

  const updateEmergencyNotice = async (config: Partial<EmergencyNoticeConfig>): Promise<{ success: boolean; error?: string }> => {
    const merged: EmergencyNoticeConfig = { ...emergencyNotice, ...config };
    setEmergencyNotice(merged);
    try {
      localStorage.setItem(EMERGENCY_NOTICE_KEY, JSON.stringify(merged));
      await saveEmergencyNoticeToFirestore(merged);
      return { success: true };
    } catch (err: any) {
      console.error('Failed to save emergency notice to Firestore:', err);
      return { success: false, error: err?.message || 'Server sync error' };
    }
  };

  const resetEmergencyNotice = async (): Promise<void> => {
    setEmergencyNotice(defaultEmergencyNotice);
    localStorage.removeItem(EMERGENCY_NOTICE_KEY);
    try {
      await saveEmergencyNoticeToFirestore(defaultEmergencyNotice);
    } catch (err) {
      console.warn('Failed to reset emergency notice in Firestore:', err);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
    } catch { /* ignore */ }
  }, [blogs]);

  useEffect(() => {
    try {
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    } catch { /* ignore */ }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STAFF_KEY, JSON.stringify(staffList));
    } catch { /* ignore */ }
  }, [staffList]);

  useEffect(() => {
    try {
      localStorage.setItem(GALLERY_KEY, JSON.stringify(galleryItems));
    } catch { /* ignore */ }
  }, [galleryItems]);

  useEffect(() => {
    try {
      localStorage.setItem(MANAGEMENT_KEY, JSON.stringify(managementMembers));
    } catch { /* ignore */ }
  }, [managementMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(DIAGNOSTIC_TESTS_KEY, JSON.stringify(diagnosticTests));
    } catch { /* ignore */ }
  }, [diagnosticTests]);

  // Doctors actions
  const addDoctor = (data: Omit<Doctor, 'id'>): Doctor => {
    const newDoc: Doctor = {
      ...data,
      id: `doc-${Date.now()}`
    };
    setDoctors(prev => [newDoc, ...prev]);
    saveDoctorToFirestore(newDoc).catch(err => {
      console.warn('Firestore doctor sync warning:', err);
    });
    return newDoc;
  };

  const updateDoctor = (id: string, updated: Partial<Omit<Doctor, 'id'>>) => {
    setDoctors(prev => prev.map(d => {
      if (d.id === id) {
        const merged = { ...d, ...updated };
        saveDoctorToFirestore(merged).catch(err => {
          console.warn('Firestore doctor update sync warning:', err);
        });
        return merged;
      }
      return d;
    }));
  };

  const removeDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    deleteDoctorFromFirestore(id).catch(err => {
      console.warn('Firestore doctor delete warning:', err);
    });
  };

  const resetDoctors = () => {
    setDoctors(doctorsData);
    localStorage.removeItem(DOCTORS_KEY);
  };

  // Notices actions
  const addNotice = (data: Omit<HospitalNotice, 'id'>): HospitalNotice => {
    const newNotice: HospitalNotice = {
      ...data,
      id: `notice-${Date.now()}`
    };
    setNotices(prev => [newNotice, ...prev]);
    saveNoticeToFirestore(newNotice).catch(err => {
      console.warn('Firestore notice sync warning:', err);
    });
    return newNotice;
  };

  const updateNotice = (id: string, updated: Partial<Omit<HospitalNotice, 'id'>>) => {
    setNotices(prev =>
      prev.map(n => {
        if (n.id === id) {
          const merged = { ...n, ...updated };
          saveNoticeToFirestore(merged).catch(err => {
            console.warn('Firestore notice update warning:', err);
          });
          return merged;
        }
        return n;
      })
    );
  };

  const removeNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    deleteNoticeFromFirestore(id).catch(err => {
      console.warn('Firestore notice delete warning:', err);
    });
  };

  const resetNotices = () => {
    setNotices(hospitalNotices);
    localStorage.removeItem(NOTICES_KEY);
  };

  // Blogs actions
  const addBlog = async (data: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    const newBlog: BlogPost = {
      ...data,
      id: `blog-${Date.now()}`
    };
    setBlogs(prev => [newBlog, ...prev]);
    try {
      await saveBlogToFirestore(newBlog);
    } catch (err) {
      console.warn('Firestore blog sync warning:', err);
      throw err;
    }
    return newBlog;
  };

  const removeBlog = (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
    deleteBlogFromFirestore(id).catch(err => {
      console.warn('Firestore blog delete warning:', err);
    });
  };

  const resetBlogs = () => {
    setBlogs(initialBlogsData);
    localStorage.removeItem(BLOGS_KEY);
  };

  // Appointments actions
  const addAppointment = (data: {
    patientName: string;
    phone: string;
    doctor: string;
    notes?: string;
    age?: string;
    gender?: string;
  }): AppointmentRecord => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = (hours % 12 || 12).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);
    const timeString = `${day}/${month}/${now.getFullYear()} ${formattedHour}:${minutes} ${ampm}`;

    // Calculate sequential serial token (pattern: 1, 2, 3...)
    let maxSerial = 0;
    appointments.forEach((apt) => {
      const match = apt.token.match(/(?:AMC-)?(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        // Exclude legacy 5-digit random numbers (> 5000)
        if (!isNaN(num) && num < 5000) {
          if (num > maxSerial) maxSerial = num;
        }
      }
    });
    const nextSerial = maxSerial > 0 ? maxSerial + 1 : (appointments.length > 0 ? appointments.length + 1 : 1);
    const token = `AMC-${nextSerial.toString().padStart(3, '0')}`;
    const orderNumber = `AMC-ORD-${year}${month}${day}-${nextSerial.toString().padStart(4, '0')}`;

    const newAppointment: AppointmentRecord = {
      id: `apt-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      orderNumber,
      token,
      patientName: data.patientName.trim(),
      phone: data.phone.trim(),
      doctor: data.doctor || 'সাধারণ (রিসেপশন নির্ধারণ করবে)',
      notes: data.notes?.trim() || '',
      age: data.age?.trim() || '',
      gender: data.gender || '',
      createdAt: timeString,
      timestamp: Date.now(),
      assignedTimeSlot: 'অপেক্ষমান (রিসেপশন ফোন দেবে)',
      status: 'pending'
    };

    setAppointments(prev => [newAppointment, ...prev]);
    saveAppointmentToFirestore(newAppointment).catch(err => {
      console.warn('Firestore appointment sync warning:', err);
    });
    return newAppointment;
  };

  const updateAppointmentStatus = (
    id: string,
    status: AppointmentRecord['status'],
    assignedTimeSlot?: string
  ) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === id) {
          const updated = {
            ...apt,
            status,
            assignedTimeSlot: assignedTimeSlot !== undefined ? assignedTimeSlot : apt.assignedTimeSlot
          };
          updateAppointmentInFirestore(id, {
            status,
            assignedTimeSlot: updated.assignedTimeSlot
          }).catch(err => {
            console.warn('Firestore appointment update warning:', err);
          });
          return updated;
        }
        return apt;
      })
    );
  };

  const removeAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    deleteAppointmentFromFirestore(id).catch(err => {
      console.warn('Firestore appointment delete warning:', err);
    });
  };

  const deleteAppointmentsOlderThan30Days = async (): Promise<number> => {
    const thirtyDaysAgoMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const toDelete = appointments.filter(apt => {
      if (apt.timestamp) {
        return apt.timestamp < thirtyDaysAgoMs;
      }
      const idTime = parseInt(apt.id.replace('apt-', ''), 10);
      if (!isNaN(idTime) && idTime > 1000000) {
        return idTime < thirtyDaysAgoMs;
      }
      return false;
    });

    if (toDelete.length === 0) return 0;

    const idsToDelete = toDelete.map(a => a.id);
    setAppointments(prev => prev.filter(a => !idsToDelete.includes(a.id)));

    try {
      await deleteMultipleAppointmentsFromFirestore(idsToDelete);
    } catch (err) {
      console.warn('Firestore bulk delete warning:', err);
    }

    return idsToDelete.length;
  };

  const resetAppointments = () => {
    setAppointments(initialSeedAppointments);
    localStorage.removeItem(APPOINTMENTS_KEY);
  };

  // Staff Members (Employee ID Card) actions
  const addStaff = (data: Omit<StaffMember, 'id'>): StaffMember => {
    const newStaff: StaffMember = {
      ...data,
      id: `staff-${Date.now()}`,
      createdAt: data.createdAt || Date.now()
    };
    setStaffList(prev => {
      const updated = [newStaff, ...prev];
      try {
        localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    saveStaffToFirestore(newStaff).catch(err => {
      console.warn('Firestore staff sync warning:', err);
    });
    return newStaff;
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaffList(prev => {
      const updated = prev.map(s => {
        if (s.id === id) {
          const merged = { ...s, ...updates, updatedAt: Date.now() };
          saveStaffToFirestore(merged).catch(err => {
            console.warn('Firestore staff update warning:', err);
          });
          return merged;
        }
        return s;
      });
      try {
        localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeStaff = (id: string) => {
    setStaffList(prev => {
      const updated = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    deleteStaffFromFirestore(id).catch(err => {
      console.warn('Firestore staff delete warning:', err);
    });
  };

  const resetStaff = () => {
    setStaffList(initialStaffMembers);
    localStorage.removeItem(STAFF_KEY);
  };

  // Photo Gallery actions
  const addGalleryItem = (data: Omit<GalleryItem, 'id'>): GalleryItem => {
    const newItem: GalleryItem = {
      ...data,
      id: `gal-${Date.now()}`,
      createdAt: data.createdAt || Date.now()
    };
    setGalleryItems(prev => [newItem, ...prev]);
    saveGalleryItemToFirestore(newItem).catch(err => {
      console.warn('Firestore gallery sync warning:', err);
    });
    return newItem;
  };

  const updateGalleryItem = (id: string, updates: Partial<GalleryItem>) => {
    setGalleryItems(prev =>
      prev.map(g => {
        if (g.id === id) {
          const merged = { ...g, ...updates };
          saveGalleryItemToFirestore(merged).catch(err => {
            console.warn('Firestore gallery update warning:', err);
          });
          return merged;
        }
        return g;
      })
    );
  };

  const removeGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(g => g.id !== id));
    deleteGalleryItemFromFirestore(id).catch(err => {
      console.warn('Firestore gallery delete warning:', err);
    });
  };

  const resetGalleryItems = () => {
    setGalleryItems(initialGalleryItems);
    localStorage.removeItem(GALLERY_KEY);
  };

  // Management Members (পরিচালনা পর্ষদ) actions
  const addManagementMember = async (data: Omit<ManagementMember, 'id'>): Promise<ManagementMember> => {
    const newMember: ManagementMember = {
      ...data,
      id: `mgmt-${Date.now()}`,
      createdAt: data.createdAt || Date.now()
    };
    
    // Update local state and localStorage immediately
    setManagementMembers(prev => {
      const updated = [...prev, newMember];
      try {
        localStorage.setItem(MANAGEMENT_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Save to Firestore Database
    try {
      await saveManagementMemberToFirestore(newMember);
    } catch (err) {
      console.warn('Firestore management sync warning:', err);
    }
    return newMember;
  };

  const updateManagementMember = async (id: string, updates: Partial<ManagementMember>): Promise<void> => {
    let targetMerged: ManagementMember | null = null;
    
    setManagementMembers(prev => {
      const updated = prev.map(m => {
        if (m.id === id) {
          const merged = { ...m, ...updates };
          targetMerged = merged;
          return merged;
        }
        return m;
      });
      try {
        localStorage.setItem(MANAGEMENT_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (targetMerged) {
      try {
        await saveManagementMemberToFirestore(targetMerged);
      } catch (err) {
        console.warn('Firestore management update warning:', err);
      }
    }
  };

  const removeManagementMember = async (id: string): Promise<void> => {
    setManagementMembers(prev => {
      const updated = prev.filter(m => m.id !== id);
      try {
        localStorage.setItem(MANAGEMENT_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await deleteManagementMemberFromFirestore(id);
    } catch (err) {
      console.warn('Firestore management delete warning:', err);
    }
  };

  const resetManagementMembers = () => {
    setManagementMembers(initialManagementMembers);
    try {
      localStorage.removeItem(MANAGEMENT_KEY);
    } catch {}
  };

  // Diagnostic Tests & Price List (পরীক্ষা-নিরীক্ষার সম্ভাব্য মূল্য তালিকা) actions
  const addDiagnosticTest = (data: Omit<DiagnosticTest, 'id'>): DiagnosticTest => {
    const newTest: DiagnosticTest = {
      ...data,
      id: `test-${Date.now()}`
    };
    setDiagnosticTests(prev => [newTest, ...prev]);
    saveDiagnosticTestToFirestore(newTest).catch(err => {
      console.warn('Firestore diagnostic test sync warning:', err);
    });
    return newTest;
  };

  const updateDiagnosticTest = (id: string, updates: Partial<DiagnosticTest>) => {
    setDiagnosticTests(prev =>
      prev.map(t => {
        if (t.id === id) {
          const merged = { ...t, ...updates };
          saveDiagnosticTestToFirestore(merged).catch(err => {
            console.warn('Firestore diagnostic test update warning:', err);
          });
          return merged;
        }
        return t;
      })
    );
  };

  const removeDiagnosticTest = (id: string) => {
    setDiagnosticTests(prev => prev.filter(t => t.id !== id));
    deleteDiagnosticTestFromFirestore(id).catch(err => {
      console.warn('Firestore diagnostic test delete warning:', err);
    });
  };

  const resetDiagnosticTests = () => {
    setDiagnosticTests(initialDiagnosticTests);
    localStorage.removeItem(DIAGNOSTIC_TESTS_KEY);
  };

  // Security & Auth actions
  const checkLockoutStatus = useCallback((role: 'admin' | 'receptionist'): LockoutStatus => {
    return checkLockout(role);
  }, []);

  const loginAdmin = async (user: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanUser = sanitizeInput(user).toLowerCase();
    const cleanPass = pass.trim();

    // Check lockout first
    const lock = checkLockout('admin');
    if (lock.isLocked) {
      return {
        success: false,
        error: `নিরাপত্তা সতর্কতা: অতিরিক্ত ভুল চেষ্টার কারণে অ্যাডমিন লগইন সাময়িকভাবে লক করা হয়েছে। আর ${lock.remainingSeconds} সেকেন্ড পর চেষ্টা করুন।`
      };
    }

    try {
      // 1. Get credentials: state -> cloud -> local cache
      let creds = securityCreds;
      if (!creds) {
        try {
          creds = await getSecurityCredentialsFromFirestore();
        } catch {}
      }
      if (!creds) {
        const stored = localStorage.getItem('amc_sec_creds_v3');
        if (stored) {
          try { creds = JSON.parse(stored); } catch {}
        }
      }

      let adminCred = creds?.admin;
      if (!adminCred) {
        const adminSalt = generateSalt();
        const hash = await hashPassword('admin', adminSalt);
        adminCred = { username: 'admin', passwordHash: hash, salt: adminSalt, updatedAt: Date.now() };
      }

      const expectedUser = adminCred.username.toLowerCase();
      const isUserValid = (cleanUser === expectedUser || cleanUser === 'administrator');
      const isPassValid = await verifyPassword(cleanPass, adminCred.passwordHash, adminCred.salt);

      if (isUserValid && isPassValid) {
        clearLockout('admin');
        createSecureSession('admin', cleanUser);
        setIsAdminLoggedIn(true);
        return { success: true };
      } else {
        const newLock = recordFailedAttempt('admin');
        if (newLock.isLocked) {
          return {
            success: false,
            error: `অ্যাকাউন্ট সাময়িকভাবে লক হয়েছে! ৪ বার ভুল পাসওয়ার্ড দেওয়ার কারণে পরবর্তী ৫ মিনিট লগইন নিষিদ্ধ।`
          };
        }
        return {
          success: false,
          error: `ভুল অ্যাডমিন ইউজারনেম বা পাসওয়ার্ড! আর মাত্র ${newLock.attemptsLeft} বার সুযোগ বাকি রয়েছে।`
        };
      }
    } catch {
      return { success: false, error: 'লগইন যাচাইকরণে ত্রুটি হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।' };
    }
  };

  const logoutAdmin = () => {
    destroySession('admin');
    setIsAdminLoggedIn(false);
  };

  const loginReceptionist = async (user: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanUser = sanitizeInput(user).toLowerCase();
    const cleanPass = pass.trim();

    // Check lockout first
    const lock = checkLockout('receptionist');
    if (lock.isLocked) {
      return {
        success: false,
        error: `নিরাপত্তা সতর্কতা: অতিরিক্ত ভুল চেষ্টার কারণে রিসেপশনিস্ট পোর্টাল লক রয়েছে। আর ${lock.remainingSeconds} সেকেন্ড পর চেষ্টা করুন।`
      };
    }

    try {
      let creds = securityCreds;
      if (!creds) {
        try {
          creds = await getSecurityCredentialsFromFirestore();
        } catch {}
      }
      if (!creds) {
        const stored = localStorage.getItem('amc_sec_creds_v3');
        if (stored) {
          try { creds = JSON.parse(stored); } catch {}
        }
      }

      let receptionCred = creds?.receptionist;
      if (!receptionCred) {
        const recSalt = generateSalt();
        const hash = await hashPassword('123', recSalt);
        receptionCred = { username: 'reception', passwordHash: hash, salt: recSalt, updatedAt: Date.now() };
      }

      const expectedUser = receptionCred.username.toLowerCase();
      const isUserValid = (cleanUser === expectedUser || cleanUser === 'receptionist');
      const isPassValid = await verifyPassword(cleanPass, receptionCred.passwordHash, receptionCred.salt);

      if (isUserValid && isPassValid) {
        clearLockout('receptionist');
        createSecureSession('receptionist', cleanUser);
        setIsReceptionistLoggedIn(true);
        return { success: true };
      } else {
        const newLock = recordFailedAttempt('receptionist');
        if (newLock.isLocked) {
          return {
            success: false,
            error: `রিসেপশন পোর্টাল সাময়িকভাবে লক হয়েছে! ৪ বার ভুল পাসওয়ার্ড দেওয়ার কারণে পরবর্তী ৫ মিনিট লগইন বন্ধ।`
          };
        }
        return {
          success: false,
          error: `ভুল ইউজারনেম বা পাসওয়ার্ড! আর মাত্র ${newLock.attemptsLeft} বার সুযোগ রয়েছে।`
        };
      }
    } catch {
      return { success: false, error: 'লগইন যাচাইকরণে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন।' };
    }
  };

  const logoutReceptionist = () => {
    destroySession('receptionist');
    setIsReceptionistLoggedIn(false);
  };

  /**
   * Super Admin Only: Update Username and/or Password directly in Cloud Firestore Database
   * Passwords are NEVER stored in plaintext. They are cryptographically hashed using Salted SHA-256 + Pepper.
   */
  const updateCredentials = async (
    role: 'admin' | 'receptionist',
    newUsername: string,
    newPassword?: string,
    currentPass?: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanUsername = sanitizeInput(newUsername).trim();
    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, message: 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে।' };
    }
    if (newPassword && newPassword.length < 5) {
      return { success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৫ অক্ষরের হতে হবে।' };
    }

    try {
      // 1. Fetch current database state
      let currentDoc = securityCreds;
      if (!currentDoc) {
        try {
          currentDoc = await getSecurityCredentialsFromFirestore();
        } catch {}
      }
      if (!currentDoc) {
        const stored = localStorage.getItem('amc_sec_creds_v3');
        if (stored) {
          try { currentDoc = JSON.parse(stored); } catch {}
        }
      }

      // If current password verification provided
      if (currentPass && currentDoc && currentDoc[role]) {
        const isCurrentValid = await verifyPassword(
          currentPass,
          currentDoc[role].passwordHash,
          currentDoc[role].salt
        );
        if (!isCurrentValid) {
          return { success: false, message: 'বর্তমান পাসওয়ার্ড সঠিক নয়।' };
        }
      }

      // 2. Compute cryptographic salt & irreversible hash (Hacker-Proof)
      let newHash = currentDoc?.[role]?.passwordHash;
      let newSalt = currentDoc?.[role]?.salt;

      if (newPassword) {
        newSalt = generateSalt();
        newHash = await hashPassword(newPassword, newSalt);
      } else if (!newHash || !newSalt) {
        newSalt = generateSalt();
        newHash = await hashPassword(role === 'admin' ? 'admin' : '123', newSalt);
      }

      const defaultAdminSalt = generateSalt();
      const defaultRecSalt = generateSalt();

      const updatedDoc: SecurityCredentialsDoc = {
        admin: currentDoc?.admin || {
          username: 'admin',
          passwordHash: await hashPassword('admin', defaultAdminSalt),
          salt: defaultAdminSalt,
          updatedAt: Date.now(),
          lastUpdatedBy: 'system'
        },
        receptionist: currentDoc?.receptionist || {
          username: 'reception',
          passwordHash: await hashPassword('123', defaultRecSalt),
          salt: defaultRecSalt,
          updatedAt: Date.now(),
          lastUpdatedBy: 'system'
        },
        lastUpdated: Date.now()
      };

      updatedDoc[role] = {
        username: cleanUsername,
        passwordHash: newHash!,
        salt: newSalt!,
        updatedAt: Date.now(),
        lastUpdatedBy: 'admin'
      };

      // 3. Save to Cloud Firestore Database
      await saveSecurityCredentialsToFirestore(updatedDoc);

      // 4. Save to local fallback cache & memory state
      localStorage.setItem('amc_sec_creds_v3', JSON.stringify(updatedDoc));
      setSecurityCreds(updatedDoc);
      setIsSecuritySyncedToCloud(true);

      const roleBn = role === 'admin' ? 'অ্যাডমিন' : 'রিসেপশনিস্ট';
      return {
        success: true,
        message: `${roleBn} এর ইউজারনেম ("${cleanUsername}")${newPassword ? ' ও নতুন পাসওয়ার্ড' : ''} সফলভাবে ক্লাউড ডেটাবেসে (SHA-256 সল্টেড হ্যাশ) সংরক্ষিত হয়েছে!`
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'ক্লাউড ডেটাবেসে সংরক্ষণ ব্যর্থ হয়েছে: ' + (err?.message || 'অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করুন')
      };
    }
  };

  const changePassword = async (
    role: 'admin' | 'receptionist',
    newPass: string,
    currentPass?: string
  ): Promise<{ success: boolean; message: string }> => {
    const currentUsername = securityCreds?.[role]?.username || (role === 'admin' ? 'admin' : 'reception');
    return updateCredentials(role, currentUsername, newPass, currentPass);
  };

  const syncAllToFirestore = async (): Promise<{ success: boolean; message: string }> => {
    try {
      // 0. Sync Emergency Scroll Notice & Toggle State
      await saveEmergencyNoticeToFirestore(emergencyNotice);

      // 1. Sync all Doctors
      for (const d of doctors) {
        await saveDoctorToFirestore(d);
      }
      // 2. Sync all Notices
      for (const n of notices) {
        await saveNoticeToFirestore(n);
      }
      // 3. Sync all Blogs
      for (const b of blogs) {
        await saveBlogToFirestore(b);
      }
      // 4. Sync all Staff Members
      for (const s of staffList) {
        await saveStaffToFirestore(s);
      }
      // 5. Sync all Gallery Items
      for (const g of galleryItems) {
        await saveGalleryItemToFirestore(g);
      }
      // 6. Sync all Management Members (পরিচালনা পর্ষদ)
      for (const m of managementMembers) {
        await saveManagementMemberToFirestore(m);
      }
      // 7. Sync all Diagnostic Tests (পরীক্ষা ও সম্ভাব্য মূল্য তালিকা)
      for (const t of diagnosticTests) {
        await saveDiagnosticTestToFirestore(t);
      }
      return {
        success: true,
        message: 'জরুরি স্ক্রল নোটিশ, ডাক্তার, নোটিশ বোর্ড, স্বাস্থ্য ব্লগ, কর্মকর্তা-কর্মচারী, ফটো গ্যালারি, পরিচালনা পর্ষদ ও ডায়াগনস্টিক টেস্টের সকল ডেটা সফলভাবে ফায়ারবেস ক্লাউডে সিঙ্ক ও সংরক্ষিত হয়েছে!'
      };
    } catch (err: any) {
      console.error('Error syncing all to Firestore:', err);
      return {
        success: false,
        message: 'ফায়ারবেসে ডেটা সিঙ্ক করতে ত্রুটি দেখা দিয়েছে।'
      };
    }
  };

  return (
    <DataContext.Provider
      value={{
        doctors,
        addDoctor,
        updateDoctor,
        removeDoctor,
        resetDoctors,
        emergencyNotice,
        updateEmergencyNotice,
        resetEmergencyNotice,
        notices,
        addNotice,
        updateNotice,
        removeNotice,
        resetNotices,
        blogs,
        addBlog,
        removeBlog,
        resetBlogs,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        removeAppointment,
        deleteAppointmentsOlderThan30Days,
        resetAppointments,
        staffList,
        addStaff,
        updateStaff,
        removeStaff,
        resetStaff,
        galleryItems,
        addGalleryItem,
        updateGalleryItem,
        removeGalleryItem,
        resetGalleryItems,
        managementMembers,
        addManagementMember,
        updateManagementMember,
        removeManagementMember,
        resetManagementMembers,
        resetManagement: resetManagementMembers,
        diagnosticTests,
        addDiagnosticTest,
        updateDiagnosticTest,
        removeDiagnosticTest,
        resetDiagnosticTests,
        isAdminLoggedIn,
        isReceptionistLoggedIn,
        loginAdmin,
        logoutAdmin,
        loginReceptionist,
        logoutReceptionist,
        adminUsername: securityCreds?.admin?.username || 'admin',
        receptionistUsername: securityCreds?.receptionist?.username || 'reception',
        isSecuritySyncedToCloud,
        updateCredentials,
        changePassword,
        checkLockoutStatus,
        isFirebaseConnected,
        syncAllToFirestore
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export type { HospitalNotice, DiagnosticTest };
export type NoticeItem = HospitalNotice;

