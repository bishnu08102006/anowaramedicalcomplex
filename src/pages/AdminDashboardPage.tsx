import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Stethoscope, 
  BookOpen, 
  Bell, 
  Plus, 
  Trash2, 
  LogOut, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  KeyRound,
  Eye,
  EyeOff,
  MapPin,
  Shield,
  RefreshCw,
  Unlock,
  Check,
  Edit,
  Pencil,
  Megaphone,
  Save,
  Radio,
  CreditCard,
  Image as ImageIcon,
  Building2,
  Activity,
  Database,
  Printer,
  Download,
  Loader2,
  FileSpreadsheet,
  Upload,
  Camera
} from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { StaffIdCardGenerator } from '../components/StaffIdCardGenerator';
import { AdminGalleryManager } from '../components/AdminGalleryManager';
import { AdminManagementManager } from '../components/AdminManagementManager';
import { AdminDiagnosticManager } from '../components/AdminDiagnosticManager';
import { DoctorListPrintModal } from '../components/DoctorListPrintModal';
import { CustomNoticeModal } from '../components/CustomNoticeModal';
import { NoticePrintModal } from '../components/NoticePrintModal';
import { PrintLetterhead } from '../components/PrintLetterhead';
import { downloadElementAsPdf, printElement } from '../utils/printHelper';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { evaluatePasswordStrength } from '../utils/security';
import { dayOrder } from '../data/doctors';

interface AdminDashboardPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: any) => void;
}

export type AdminTab = 'doctors' | 'management' | 'gallery' | 'tests' | 'staff-id' | 'blogs' | 'notices' | 'security';

const VALID_ADMIN_TABS: AdminTab[] = [
  'doctors',
  'management',
  'gallery',
  'tests',
  'staff-id',
  'blogs',
  'notices',
  'security'
];

const getStoredAdminTab = (): AdminTab => {
  if (typeof window !== 'undefined') {
    try {
      // 1. Check URL query parameters (e.g., ?tab=management)
      const searchParams = new URLSearchParams(window.location.search);
      const queryTab = searchParams.get('tab') as AdminTab;
      if (queryTab && VALID_ADMIN_TABS.includes(queryTab)) {
        return queryTab;
      }

      // 2. Check URL hash parameters (e.g., #admin?tab=management or #tab=management)
      const hash = window.location.hash;
      if (hash.includes('tab=')) {
        const hashQuery = hash.split('?')[1] || hash.split('&')[0];
        const hashParams = new URLSearchParams(hashQuery);
        const hashTab = hashParams.get('tab') as AdminTab;
        if (hashTab && VALID_ADMIN_TABS.includes(hashTab)) {
          return hashTab;
        }
      }

      // 3. Check persistent localStorage
      const savedTab = localStorage.getItem('amc_admin_active_tab') as AdminTab;
      if (savedTab && VALID_ADMIN_TABS.includes(savedTab)) {
        return savedTab;
      }
    } catch {
      // Fallback cleanly
    }
  }
  return 'doctors';
};

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateHome,
  onNavigate,
}) => {
  const { isBn } = useLanguage();
  const { 
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
    staffList,
    galleryItems,
    managementMembers,
    diagnosticTests,
    isAdminLoggedIn, 
    loginAdmin, 
    logoutAdmin,
    adminUsername,
    receptionistUsername,
    isSecuritySyncedToCloud,
    updateCredentials,
    changePassword,
    checkLockoutStatus,
    isFirebaseConnected,
    syncAllToFirestore
  } = useData();

  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Active Admin Tab - Stays persistently selected across reloads
  const [activeTab, setActiveTab] = useState<AdminTab>(() => getStoredAdminTab());

  // Synchronize activeTab to localStorage and URL query state across reloads & history changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('amc_admin_active_tab', activeTab);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('tab', activeTab);
        window.history.replaceState({}, '', currentUrl.toString());
      } catch (err) {
        console.warn('Could not persist active admin tab:', err);
      }
    }
  }, [activeTab]);

  // Sync if back/forward button is pressed or external hash/query changes
  useEffect(() => {
    const handlePopState = () => {
      const detected = getStoredAdminTab();
      if (detected !== activeTab) {
        setActiveTab(detected);
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [activeTab]);

  // Modal visibility states
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isPrintDoctorsModalOpen, setIsPrintDoctorsModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isCustomNoticeModalOpen, setIsCustomNoticeModalOpen] = useState(false);
  const [isNoticePrintModalOpen, setIsNoticePrintModalOpen] = useState(false);
  const [selectedPrintNotice, setSelectedPrintNotice] = useState<any>(null);
  const [downloadingNoticeId, setDownloadingNoticeId] = useState<string | number | null>(null);
  const [activeNoticeForPdf, setActiveNoticeForPdf] = useState<any>(null);

  // In-app Delete confirmation state (prevents iframe window.confirm blocking)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'doctor' | 'blog' | 'notice';
    id: string;
    name: string;
  } | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloadingDoctors, setIsDownloadingDoctors] = useState(false);

  // Direct isolated PDF download of a specific notice in official offline letterhead format
  const handleDirectDownloadNoticePdf = async (notice: any) => {
    setDownloadingNoticeId(notice.id);
    setActiveNoticeForPdf(notice);

    // Short tick to guarantee DOM element has received active notice data
    await new Promise((resolve) => setTimeout(resolve, 150));

    const cleanTitle = (notice.title || 'নোটিশ').slice(0, 30).replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, '_');
    const docTitle = `আনোয়ারা_মেডিকেল_কমপ্লেক্স_নোটিশ_${cleanTitle}_${notice.date || ''}`;

    try {
      await downloadElementAsPdf('admin-single-notice-printable', docTitle);
      setToastMessage(isBn ? `"${notice.title}" নোটিশটি অফলাইন অফিসিয়াল প্যাড ফরম্যাটে সরাসরি PDF ডাউনলোড হয়েছে!` : `"${notice.title}" downloaded as PDF in official letterhead format!`);
    } catch (err) {
      console.error("Notice PDF download failed:", err);
      // Fallback: open print modal
      setSelectedPrintNotice(notice);
      setIsNoticePrintModalOpen(true);
    } finally {
      setDownloadingNoticeId(null);
    }
  };

  // Direct isolated print & PDF download of Doctor Profiles and Schedules
  const handlePrintAndDownloadDoctors = async () => {
    const listToPrint = filteredDoctors.length > 0 ? filteredDoctors : doctors;
    if (listToPrint.length === 0) {
      setToastMessage(isBn ? "প্রিন্ট বা ডাউনলোড করার মতো কোনো ডাক্তারের তথ্য নেই" : "No doctor records to print or download");
      return;
    }
    const dateStr = new Date().toISOString().split('T')[0];
    const docTitle = `আনোয়ারা_মেডিকেল_কমপ্লেক্স_বিশেষজ্ঞ_ডাক্তারদের_প্রোফাইল_ও_শিডিউল_${dateStr}`;

    // 1. Immediately trigger isolated direct print of ONLY the doctor schedule
    document.body.classList.add('amc-print-doctors');
    printElement('admin-doctors-printable-content', docTitle);
    setTimeout(() => {
      document.body.classList.remove('amc-print-doctors');
    }, 4000);

    setToastMessage(isBn ? "প্রিন্ট উইন্ডো চালু হয়েছে! শুধুমাত্র বিশেষজ্ঞ ডাক্তারদের প্রোফাইল ও সময়সূচী প্রিন্ট হচ্ছে।" : "Print window opened! Only doctor profiles and schedules are printing.");

    // 2. Also generate and download high-quality PDF directly
    setIsDownloadingDoctors(true);
    try {
      await downloadElementAsPdf('admin-doctors-printable-content', docTitle, setIsDownloadingDoctors);
    } catch (err) {
      console.warn("Doctor PDF download notice:", err);
    } finally {
      setIsDownloadingDoctors(false);
    }
  };

  // Direct download all doctor information in this card as real Excel (.xls)
  const handleDownloadDoctorsExcel = () => {
    const listToExport = filteredDoctors.length > 0 ? filteredDoctors : doctors;
    if (listToExport.length === 0) {
      setToastMessage(isBn ? "ডাউনলোড করার মতো কোনো ডাক্তারের তথ্য নেই" : "No doctor records to download");
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Anowara_Medical_Complex_Doctors_${dateStr}.xls`;

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <style>
            table { border-collapse: collapse; width: 100%; font-family: 'Hind Siliguri', Arial, sans-serif; font-size: 11pt; }
            th { background-color: #0E3A53; color: #ffffff; font-weight: bold; border: 1px solid #1B4B68; padding: 10px; text-align: left; }
            td { border: 1px solid #d1d5db; padding: 8px 10px; }
            .title { font-size: 16pt; font-weight: bold; color: #0E3A53; text-align: center; }
            .subtitle { font-size: 11pt; color: #4b5563; text-align: center; }
          </style>
        </head>
        <body>
          <table>
            <tr><td colspan="7" class="title">আনোয়ারা মেডিকেল কমপ্লেক্স (Anowara Medical Complex)</td></tr>
            <tr><td colspan="7" class="subtitle">বিশেষজ্ঞ ডাক্তারদের প্রোফাইল ও চেম্বার সময়সূচী | পলাশ, নরসিংদী | তারিখ: ${dateStr} | মোট ডাক্তার: ${listToExport.length} জন</td></tr>
            <tr><td colspan="7"></td></tr>
            <tr>
              <th style="width: 50px; text-align: center;">ক্রমিক</th>
              <th style="width: 220px;">ডাক্তারের নাম</th>
              <th style="width: 220px;">পদবী ও ডিগ্রি</th>
              <th style="width: 180px;">বিভাগ ও বিশেষজ্ঞতা</th>
              <th style="width: 150px;">ভিজিটিং দিনসমূহ</th>
              <th style="width: 140px;">চেম্বার সময়</th>
              <th style="width: 100px; text-align: center;">রুম নং</th>
            </tr>
            ${listToExport.map((doc, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td style="font-weight: bold;">${doc.name || ''}</td>
                <td>${doc.degree || ''}</td>
                <td>${doc.specialty || ''}</td>
                <td>${doc.days && doc.days.length > 0 ? doc.days.join(', ') : 'নির্ধারিত দিনে'}</td>
                <td>${doc.time || ''}</td>
                <td style="text-align: center; font-weight: bold;">${doc.room || ''}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage(isBn ? "সকল ডাক্তারের তথ্য সরাসরি Excel (.xls) ফাইলে ডাউনলোড হয়েছে!" : "Doctor records downloaded in Excel format!");
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Form error messages
  const [doctorFormError, setDoctorFormError] = useState('');
  const [blogFormError, setBlogFormError] = useState('');
  const [noticeFormError, setNoticeFormError] = useState('');

  // Search states for tables
  const [doctorSearch, setDoctorSearch] = useState('');
  const [blogSearch, setBlogSearch] = useState('');
  const [noticeSearch, setNoticeSearch] = useState('');

  // Security Management State (Cloud Database Credentials)
  const [adminUserVal, setAdminUserVal] = useState(adminUsername || 'admin');
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminConfirmPass, setAdminConfirmPass] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);
  const [adminPassMsg, setAdminPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [recUserVal, setRecUserVal] = useState(receptionistUsername || 'reception');
  const [recNewPass, setRecNewPass] = useState('');
  const [showRecPass, setShowRecPass] = useState(false);
  const [isSavingRec, setIsSavingRec] = useState(false);
  const [recPassMsg, setRecPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync state when context credentials update
  useEffect(() => {
    if (adminUsername) setAdminUserVal(adminUsername);
  }, [adminUsername]);

  useEffect(() => {
    if (receptionistUsername) setRecUserVal(receptionistUsername);
  }, [receptionistUsername]);

  // Lockout check timer for login screen
  useEffect(() => {
    if (isAdminLoggedIn) return;
    const lock = checkLockoutStatus('admin');
    setLockoutRemaining(lock.remainingSeconds);

    if (lock.remainingSeconds > 0) {
      const timer = setInterval(() => {
        setLockoutRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isAdminLoggedIn, checkLockoutStatus]);

  // New Doctor form state
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [newDoc, setNewDoc] = useState({
    name: '',
    nameEn: '',
    specialty: '',
    specialtyEn: '',
    degree: '',
    degreeEn: '',
    time: '10:00 AM - 04:00 PM',
    timeEn: '10:00 AM - 04:00 PM',
    days: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ'],
    room: 'রুম নং ১০৫',
    roomEn: 'Room 105',
    photo: '',
  });

  const handleDoctorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setDoctorFormError(isBn ? 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে' : 'Image size must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress to max width/height 600px for optimal speed and database storage
        const canvas = document.createElement('canvas');
        const MAX_DIM = 600;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setNewDoc(prev => ({ ...prev, photo: compressedDataUrl }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddDoctorModal = () => {
    setEditingDoctorId(null);
    setNewDoc({
      name: '',
      nameEn: '',
      specialty: '',
      specialtyEn: '',
      degree: '',
      degreeEn: '',
      time: '10:00 AM - 04:00 PM',
      timeEn: '10:00 AM - 04:00 PM',
      days: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ'],
      room: 'রুম নং ১০৫',
      roomEn: 'Room 105',
      photo: '',
    });
    setDoctorFormError('');
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditDoctorModal = (doc: any) => {
    setEditingDoctorId(doc.id);
    setNewDoc({
      name: doc.name || '',
      nameEn: doc.nameEn || '',
      specialty: doc.specialty || '',
      specialtyEn: doc.specialtyEn || '',
      degree: doc.degree || '',
      degreeEn: doc.degreeEn || '',
      time: doc.time || '10:00 AM - 04:00 PM',
      timeEn: doc.timeEn || '10:00 AM - 04:00 PM',
      days: doc.days && doc.days.length ? doc.days : ['রবি', 'সোম'],
      room: doc.room || '',
      roomEn: doc.roomEn || '',
      photo: doc.photo || '',
    });
    setDoctorFormError('');
    setIsDoctorModalOpen(true);
  };

  // New Blog form state
  const [newBlog, setNewBlog] = useState({
    title: '',
    titleEn: '',
    author: 'ডাঃ বিশেষজ্ঞ কনসালটেন্ট',
    authorEn: 'Specialist Consultant',
    category: 'সাধারণ স্বাস্থ্য',
    categoryEn: 'General Health',
    summary: '',
    summaryEn: '',
    content: '',
    contentEn: '',
    readTime: '৪ মিনিট',
    readTimeEn: '4 min read',
    tags: 'স্বাস্থ্য, পরামর্শ, চিকিৎসা',
  });

  // New Notice form state
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [newNotice, setNewNotice] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    badge: 'জরুরি নোটিশ',
    badgeEn: 'Urgent Notice',
    type: 'urgent' as 'urgent' | 'offer' | 'info',
  });

  // Emergency Marquee Bar state
  const [emergencyDraft, setEmergencyDraft] = useState({
    enabled: emergencyNotice?.enabled ?? true,
    textBn: emergencyNotice?.textBn || '',
    textEn: emergencyNotice?.textEn || '',
    badgeBn: emergencyNotice?.badgeBn || 'জরুরি নোটিশ',
    badgeEn: emergencyNotice?.badgeEn || 'EMERGENCY',
    hotline: emergencyNotice?.hotline || '01712-692504',
  });
  const [isEmergencySaved, setIsEmergencySaved] = useState(false);
  const [isEmergencySaving, setIsEmergencySaving] = useState(false);
  const [isBlogSaving, setIsBlogSaving] = useState(false);
  const [isNoticeSaving, setIsNoticeSaving] = useState(false);

  useEffect(() => {
    if (emergencyNotice) {
      setEmergencyDraft({
        enabled: emergencyNotice.enabled,
        textBn: emergencyNotice.textBn,
        textEn: emergencyNotice.textEn,
        badgeBn: emergencyNotice.badgeBn,
        badgeEn: emergencyNotice.badgeEn,
        hotline: emergencyNotice.hotline,
      });
    }
  }, [emergencyNotice]);

  const handleSaveEmergencyNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmergencySaving(true);
    try {
      const res = await updateEmergencyNotice(emergencyDraft);
      if (res && res.success === false) {
        setToastMessage(isBn ? 'সার্ভারে সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Error saving to server. Please try again.');
      } else {
        setIsEmergencySaved(true);
        setToastMessage(isBn ? 'জরুরি স্ক্রল নোটিশ ও সুইচের স্ট্যাটাস সফলভাবে ক্লাউড সার্ভারে (ফায়ারবেস) সংরক্ষিত হয়েছে এবং লাইভ চলছে!' : 'Emergency scroll announcement & switch status saved to Firebase cloud server!');
        setTimeout(() => setIsEmergencySaved(false), 3500);
      }
    } catch (err) {
      setToastMessage(isBn ? 'সার্ভারে সংরক্ষণে ত্রুটি দেখা দিয়েছে।' : 'Error saving to server.');
    } finally {
      setIsEmergencySaving(false);
    }
  };

  const handleResetEmergencyNotice = async () => {
    try {
      await resetEmergencyNotice();
      setToastMessage(isBn ? 'জরুরি নোটিশ ডিফল্ট অবস্থায় ফিরিয়ে এনে ক্লাউড সার্ভারে আপডেট করা হয়েছে।' : 'Emergency notice reset to default on cloud server.');
    } catch (err) {
      setToastMessage(isBn ? 'রিসেট করতে ত্রুটি দেখা দিয়েছে।' : 'Error resetting.');
    }
  };

  const handleOpenAddNotice = () => {
    setEditingNoticeId(null);
    setNewNotice({
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      badge: 'জরুরি নোটিশ',
      badgeEn: 'Urgent Notice',
      type: 'urgent',
    });
    setNoticeFormError('');
    setIsNoticeModalOpen(true);
  };

  const handleOpenEditNotice = (notice: any) => {
    setEditingNoticeId(notice.id);
    setNewNotice({
      title: notice.title,
      titleEn: notice.titleEn || '',
      description: notice.description,
      descriptionEn: notice.descriptionEn || '',
      badge: notice.badge,
      badgeEn: notice.badgeEn || '',
      type: notice.type,
    });
    setNoticeFormError('');
    setIsNoticeModalOpen(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;
    setIsLoggingIn(true);
    setLoginError('');

    const res = await loginAdmin(username, password);
    setIsLoggingIn(false);

    if (!res.success) {
      setLoginError(res.error || (isBn ? 'ভুল ইউজারনেম বা পাসওয়ার্ড।' : 'Invalid credentials.'));
      const lock = checkLockoutStatus('admin');
      if (lock.isLocked) {
        setLockoutRemaining(lock.remainingSeconds);
      }
    } else {
      setLoginError('');
      setUsername('');
      setPassword('');
    }
  };

  // Add Doctor Handler
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name.trim() || !newDoc.specialty.trim()) {
      setDoctorFormError(isBn ? 'ডাক্তারের নাম ও বিশেষজ্ঞতা লিখুন' : 'Doctor name and specialty are required');
      return;
    }
    setDoctorFormError('');

    addDoctor({
      name: newDoc.name.trim(),
      nameEn: newDoc.nameEn.trim() || newDoc.name.trim(),
      specialty: newDoc.specialty.trim(),
      specialtyEn: newDoc.specialtyEn.trim() || newDoc.specialty.trim(),
      degree: newDoc.degree.trim() || 'MBBS',
      degreeEn: newDoc.degreeEn.trim() || 'MBBS',
      time: newDoc.time.trim(),
      timeEn: newDoc.timeEn.trim(),
      days: newDoc.days.length ? newDoc.days : ['রবি', 'সোম', 'মঙ্গল'],
      room: newDoc.room.trim(),
      roomEn: newDoc.roomEn.trim(),
    });

    setToastMessage(isBn ? `ডাঃ "${newDoc.name}" সফলভাবে যুক্ত হয়েছেন!` : `Dr. "${newDoc.name}" added successfully!`);

    setNewDoc({
      name: '',
      nameEn: '',
      specialty: '',
      specialtyEn: '',
      degree: '',
      degreeEn: '',
      time: '10:00 AM - 04:00 PM',
      timeEn: '10:00 AM - 04:00 PM',
      days: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ'],
      room: 'রুম নং ১০৫',
      roomEn: 'Room 105',
    });
    setIsDoctorModalOpen(false);
  };

  // Add Blog Handler
  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title.trim() || !newBlog.content.trim()) {
      setBlogFormError(isBn ? 'ব্লগের শিরোনাম ও বিস্তারিত বিবরণ আবশ্যক' : 'Title and content are required');
      return;
    }
    setBlogFormError('');
    setIsBlogSaving(true);

    try {
      const now = new Date();
      const monthsBn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
      const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateBn = `${now.getDate()} ${monthsBn[now.getMonth()]}, ${now.getFullYear()}`;
      const dateEn = `${monthsEn[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

      await addBlog({
        title: newBlog.title.trim(),
        titleEn: newBlog.titleEn.trim() || newBlog.title.trim(),
        author: newBlog.author.trim() || 'মেডিকেল স্পেশালিস্ট',
        authorEn: newBlog.authorEn.trim() || 'Medical Specialist',
        category: newBlog.category.trim() || 'সাধারণ স্বাস্থ্য',
        categoryEn: newBlog.categoryEn.trim() || 'General Health',
        summary: newBlog.summary.trim() || newBlog.content.slice(0, 90) + '...',
        summaryEn: newBlog.summaryEn.trim() || newBlog.summary.trim(),
        content: newBlog.content.trim(),
        contentEn: newBlog.contentEn.trim() || newBlog.content.trim(),
        date: dateBn,
        dateEn: dateEn,
        readTime: newBlog.readTime.trim() || '৪ মিনিট',
        readTimeEn: newBlog.readTimeEn.trim() || '4 min read',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        tags: newBlog.tags.split(',').map(t => t.trim()).filter(Boolean),
      });

      setToastMessage(isBn ? `ব্লগ "${newBlog.title}" সফলভাবে ক্লাউড সার্ভারে (ফায়ারবেস) সংরক্ষিত ও প্রকাশিত হয়েছে!` : `Blog published & saved to Firebase cloud server!`);

      setNewBlog({
        title: '',
        titleEn: '',
        author: 'ডাঃ বিশেষজ্ঞ কনসালটেন্ট',
        authorEn: 'Specialist Consultant',
        category: 'সাধারণ স্বাস্থ্য',
        categoryEn: 'General Health',
        summary: '',
        summaryEn: '',
        content: '',
        contentEn: '',
        readTime: '৪ মিনিট',
        readTimeEn: '4 min read',
        tags: 'স্বাস্থ্য, পরামর্শ, চিকিৎসা',
      });
      setIsBlogModalOpen(false);
    } catch (err) {
      setBlogFormError(isBn ? 'ক্লাউড সার্ভারে সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Failed to save blog to cloud server. Please try again.');
    } finally {
      setIsBlogSaving(false);
    }
  };

  // Add or Update Notice Handler
  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title.trim() || !newNotice.description.trim()) {
      setNoticeFormError(isBn ? 'নোটিশের শিরোনাম ও বিবরণ লিখুন' : 'Title and description are required');
      return;
    }
    setNoticeFormError('');
    setIsNoticeSaving(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const todayEn = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      if (editingNoticeId) {
        updateNotice(editingNoticeId, {
          title: newNotice.title.trim(),
          titleEn: newNotice.titleEn.trim() || newNotice.title.trim(),
          description: newNotice.description.trim(),
          descriptionEn: newNotice.descriptionEn.trim() || newNotice.description.trim(),
          badge: newNotice.badge.trim() || 'জরুরি নোটিশ',
          badgeEn: newNotice.badgeEn.trim() || 'Urgent Notice',
          type: newNotice.type,
        });
        setToastMessage(isBn ? `নোটিশ "${newNotice.title}" সফলভাবে ক্লাউড সার্ভারে আপডেট হয়েছে!` : `Notice updated successfully on cloud server!`);
      } else {
        addNotice({
          title: newNotice.title.trim(),
          titleEn: newNotice.titleEn.trim() || newNotice.title.trim(),
          description: newNotice.description.trim(),
          descriptionEn: newNotice.descriptionEn.trim() || newNotice.description.trim(),
          badge: newNotice.badge.trim() || 'জরুরি নোটিশ',
          badgeEn: newNotice.badgeEn.trim() || 'Urgent Notice',
          type: newNotice.type,
          date: today,
          dateEn: todayEn,
        });
        setToastMessage(isBn ? `নতুন নোটিশ সফলভাবে ক্লাউড সার্ভারে যুক্ত ও প্রকাশিত হয়েছে!` : `Notice published & saved to cloud server!`);
      }

      setEditingNoticeId(null);
      setNewNotice({
        title: '',
        titleEn: '',
        description: '',
        descriptionEn: '',
        badge: 'জরুরি নোটিশ',
        badgeEn: 'Urgent Notice',
        type: 'urgent',
      });
      setIsNoticeModalOpen(false);
    } catch (err) {
      setNoticeFormError(isBn ? 'ক্লাউড সার্ভারে সংরক্ষণ করতে সমস্যা হয়েছে।' : 'Error saving to server.');
    } finally {
      setIsNoticeSaving(false);
    }
  };

  // Change Admin Credentials (Username & Password) directly in Cloud Database
  const handleChangeAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassMsg(null);

    const cleanUser = adminUserVal.trim();
    if (!cleanUser || cleanUser.length < 3) {
      setAdminPassMsg({
        type: 'error',
        text: isBn ? 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে।' : 'Username must be at least 3 characters.'
      });
      return;
    }

    if (adminNewPass && adminNewPass.length < 5) {
      setAdminPassMsg({
        type: 'error',
        text: isBn ? 'নতুন পাসওয়ার্ড কমপক্ষে ৫ অক্ষরের হতে হবে।' : 'Password must be at least 5 characters.'
      });
      return;
    }

    if (adminNewPass && adminConfirmPass && adminNewPass !== adminConfirmPass) {
      setAdminPassMsg({
        type: 'error',
        text: isBn ? 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।' : 'New password and confirmation do not match.'
      });
      return;
    }

    setIsSavingAdmin(true);
    const res = await updateCredentials('admin', cleanUser, adminNewPass ? adminNewPass : undefined);
    setIsSavingAdmin(false);

    if (res.success) {
      setAdminPassMsg({ type: 'success', text: res.message });
      setToastMessage(isBn ? 'অ্যাডমিন ক্রেডেনশিয়াল সফলভাবে ক্লাউড ডেটাবেসে সংরক্ষিত হয়েছে!' : 'Admin credentials saved to cloud database!');
      setAdminNewPass('');
      setAdminConfirmPass('');
    } else {
      setAdminPassMsg({ type: 'error', text: res.message });
    }
  };

  // Reset Receptionist Credentials (Username & Password) by Admin directly in Cloud Database
  const handleResetReceptionCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecPassMsg(null);

    const cleanUser = recUserVal.trim();
    if (!cleanUser || cleanUser.length < 3) {
      setRecPassMsg({
        type: 'error',
        text: isBn ? 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে।' : 'Username must be at least 3 characters.'
      });
      return;
    }

    if (recNewPass && recNewPass.length < 5) {
      setRecPassMsg({
        type: 'error',
        text: isBn ? 'রিসেপশনিস্ট পাসওয়ার্ড কমপক্ষে ৫ অক্ষরের হতে হবে।' : 'Password must be at least 5 characters.'
      });
      return;
    }

    setIsSavingRec(true);
    const res = await updateCredentials('receptionist', cleanUser, recNewPass ? recNewPass : undefined);
    setIsSavingRec(false);

    if (res.success) {
      setRecPassMsg({ type: 'success', text: res.message });
      setToastMessage(isBn ? 'রিসেপশনিস্ট ক্রেডেনশিয়াল ক্লাউড ডেটাবেসে হালনাগাদ সম্পন্ন!' : 'Receptionist credentials updated in cloud database!');
      setRecNewPass('');
    } else {
      setRecPassMsg({ type: 'error', text: res.message });
    }
  };

  // Execute Deletion
  const executeDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'doctor') {
      removeDoctor(deleteTarget.id);
      setToastMessage(isBn ? `ডাঃ "${deleteTarget.name}" সফলভাবে তালিকা থেকে মুছে ফেলা হয়েছে!` : `Doctor removed successfully!`);
    } else if (deleteTarget.type === 'blog') {
      removeBlog(deleteTarget.id);
      setToastMessage(isBn ? `ব্লগ "${deleteTarget.name}" সফলভাবে মুছে ফেলা হয়েছে!` : `Blog removed successfully!`);
    } else if (deleteTarget.type === 'notice') {
      removeNotice(deleteTarget.id);
      setToastMessage(isBn ? `নোটিশ "${deleteTarget.name}" সফলভাবে মুছে ফেলা হয়েছে!` : `Notice removed successfully!`);
    }

    setDeleteTarget(null);
  };

  // Filtered Doctors
  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(doctorSearch.toLowerCase()) || 
    d.specialty.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  // Filtered Blogs
  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
    b.category.toLowerCase().includes(blogSearch.toLowerCase())
  );

  // Filtered Notices
  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(noticeSearch.toLowerCase())
  );

  // IF NOT LOGGED IN
  if (!isAdminLoggedIn) {
    return (
      <div id="admin-login-page" className="min-h-screen bg-[#F8FAFB]">
        <PageBanner
          title={isBn ? "অ্যাডমিন পোর্টাল লগইন" : "Admin Portal Sign In"}
          subtitle={isBn ? "হাসপাতালের ডাক্তার তালিকা, স্বাস্থ্য ব্লগ ও নোটিশ ব্যবস্থাপনা প্যানেল" : "Administrative management panel for doctors, health blogs and announcements"}
          icon={Lock}
          badge={isBn ? "অ্যাডমিন প্রবেশদ্বার" : "System Administration"}
          currentPageName={isBn ? "অ্যাডমিন লগইন" : "Admin Login"}
          onNavigateHome={onNavigateHome}
        />

        <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm relative overflow-hidden">
            {/* Security Guarantee Pill */}
            <div className="flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold py-1.5 px-3 rounded-full mb-5 mx-auto w-fit border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? "SHA-256 এনক্রিপশন ও ব্রুট-ফোর্স অ্যান্টি-হ্যাকিং সক্রিয়" : "SHA-256 Hashed & Brute-Force Protected"}</span>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-[#0E3A53] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <ShieldCheck className="w-6 h-6 text-[#C9973B]" />
            </div>

            <h2 className="text-xl font-bold text-center text-[#0E3A53] mb-1">
              {isBn ? "সুপার অ্যাডমিন লগইন" : "Super Admin Sign In"}
            </h2>
            <p className="text-xs text-center text-gray-500 mb-5">
              {isBn ? "হাসপাতাল পরিচালনা ও তথ্য হালনাগাদ প্যানেল" : "System management authorization"}
            </p>

            {/* Lockout Warning */}
            {lockoutRemaining > 0 && (
              <div className="mb-4 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-spin" />
                <div>
                  <p className="font-bold">{isBn ? "অ্যাকাউন্ট সাময়িকভাবে লক রয়েছে!" : "Account Temporarily Locked!"}</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {isBn ? `বারবার ভুল চেষ্টার কারণে নিরাপত্তা লক সক্রিয়। আর ${lockoutRemaining} সেকেন্ড পর পুনরায় চেষ্টা করতে পারবেন।` : `Security lockout active. Try again in ${lockoutRemaining}s.`}
                  </p>
                </div>
              </div>
            )}

            {loginError && lockoutRemaining === 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isBn ? "ইউজারনেম (Username)" : "Username"}
                </label>
                <input
                  type="text"
                  required
                  disabled={lockoutRemaining > 0}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white transition disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isBn ? "পাসওয়ার্ড (Password)" : "Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={lockoutRemaining > 0}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-gray-50 border border-gray-200 pl-3.5 pr-10 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white transition disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn || lockoutRemaining > 0}
                className="w-full bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold py-3 rounded-xl transition text-xs sm:text-sm shadow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>{isBn ? "যাচাই করা হচ্ছে..." : "Verifying..."}</span>
                  </>
                ) : (
                  <span>{isBn ? "অ্যাডমিন প্যানেলে প্রবেশ করুন" : "Sign In to Admin"}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN DASHBOARD VIEW
  return (
    <div id="admin-dashboard-page" className="min-h-screen bg-[#F8FAFB]">
      <PageBanner
        title={isBn ? "হাসপাতাল অ্যাডমিন ড্যাশবোর্ড" : "Hospital Administration Dashboard"}
        subtitle={isBn 
          ? "সহজে ডাক্তারদের তালিকা যোগ/বর্জন, ব্লগ লেখা ও অপসারণ, নোটিশ বোর্ড এবং নিরাপত্তা পরিচালনা প্যানেল" 
          : "Control center for doctor profiles, medical blogs, announcements and authentication security"}
        icon={ShieldCheck}
        badge={isBn ? "সুপার অ্যাডমিন" : "Super Admin"}
        currentPageName={isBn ? "অ্যাডমিন ড্যাশবোর্ড" : "Admin Dashboard"}
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Top Header Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0E3A53] text-[#C9973B] flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#0E3A53]">
                {isBn ? "আনোয়ারা মেডিকেল কমপ্লেক্স অ্যাডমিনিস্ট্রেশন" : "Anowara Medical Complex Management"}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <p className="text-xs text-gray-500">
                  {isBn ? "সকল পরিবর্তন ওয়েবসাইটে সাথে সাথে কার্যকর হবে" : "Live synchronization active"}
                </p>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium border ${
                  isFirebaseConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {isFirebaseConnected 
                    ? (isBn ? "ফায়ারবেস ক্লাউড ডেটাবেজ: কানেক্টেড" : "Firebase Cloud DB: Connected")
                    : (isBn ? "ফায়ারবেস ডেটাবেজ সিঙ্ক সক্রিয়" : "Firebase DB Sync Active")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={async () => {
                setIsSyncingCloud(true);
                const res = await syncAllToFirestore();
                setIsSyncingCloud(false);
                setSyncFeedback(res.message);
                setTimeout(() => setSyncFeedback(null), 4000);
              }}
              disabled={isSyncingCloud}
              className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer disabled:opacity-60"
              title="ফায়ারবেস ক্লাউডে ডাক্তার ও নোটিশের ডেটা সিঙ্ক করুন"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSyncingCloud ? 'animate-spin' : ''}`} />
              <span>{isSyncingCloud ? (isBn ? "সিঙ্ক হচ্ছে..." : "Syncing...") : (isBn ? "ফায়ারবেসে সব সিঙ্ক করুন" : "Sync All to Firebase")}</span>
            </button>

            <button
              onClick={() => onNavigate('receptionist')}
              className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0E3A53] hover:bg-blue-100 text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#2D8FC1]" />
              <span>{isBn ? "রিসেপশনিস্ট ড্যাশবোর্ড" : "Receptionist View"}</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
              <span>{isBn ? "লগআউট" : "Logout"}</span>
            </button>
          </div>
        </div>

        {syncFeedback && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
            <button onClick={() => setSyncFeedback(null)} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Overview metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2.5 sm:gap-3">
          <div 
            onClick={() => setActiveTab('doctors')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer ${
              activeTab === 'doctors' ? 'bg-blue-50/60 border-[#2D8FC1]' : 'bg-white border-gray-200/80 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500">{isBn ? "মোট ডাক্তার" : "Total Doctors"}</span>
              <Stethoscope className="w-3.5 h-3.5 text-[#2D8FC1]" />
            </div>
            <p className="text-xl font-bold text-[#0E3A53] mt-1">{doctors.length}</p>
            <span className="text-[10px] text-[#2D8FC1] font-semibold">{isBn ? "পরিচালনা করুন" : "Manage"}</span>
          </div>

          <div 
            onClick={() => setActiveTab('management')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer ${
              activeTab === 'management' ? 'bg-amber-50/70 border-[#C9973B]' : 'bg-white border-gray-200/80 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500">{isBn ? "পরিচালনা পরিষদ" : "Management"}</span>
              <Building2 className="w-3.5 h-3.5 text-[#C9973B]" />
            </div>
            <p className="text-xl font-bold text-[#0E3A53] mt-1">{managementMembers.length}</p>
            <span className="text-[10px] text-[#C9973B] font-semibold">{isBn ? "পর্ষদ তালিকা ও ডাটা →" : "Manage Board →"}</span>
          </div>

          <div 
            onClick={() => setActiveTab('tests')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer ${
              activeTab === 'tests' ? 'bg-cyan-50/70 border-cyan-500' : 'bg-white border-gray-200/80 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500">{isBn ? "পরীক্ষা ও ফি" : "Test Pricing"}</span>
              <Activity className="w-3.5 h-3.5 text-cyan-600" />
            </div>
            <p className="text-xl font-bold text-[#0E3A53] mt-1">{diagnosticTests.length}</p>
            <span className="text-[10px] text-cyan-600 font-semibold">{isBn ? "মূল্য তালিকা →" : "Manage Fees →"}</span>
          </div>

          <div 
            onClick={() => setActiveTab('gallery')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer ${
              activeTab === 'gallery' ? 'bg-blue-50/60 border-[#2D8FC1]' : 'bg-white border-gray-200/80 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500">{isBn ? "ফটো গ্যালারি" : "Photo Gallery"}</span>
              <ImageIcon className="w-3.5 h-3.5 text-[#2D8FC1]" />
            </div>
            <p className="text-xl font-bold text-[#0E3A53] mt-1">{galleryItems.length}</p>
            <span className="text-[10px] text-[#2D8FC1] font-semibold">{isBn ? "ছবি আপলোড ও লাইভ →" : "Photos Live →"}</span>
          </div>

          <div 
            onClick={() => setActiveTab('staff-id')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer ${
              activeTab === 'staff-id' ? 'bg-blue-50/60 border-[#2D8FC1]' : 'bg-white border-gray-200/80 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500">{isBn ? "আইডি কার্ড" : "Staff ID"}</span>
              <CreditCard className="w-3.5 h-3.5 text-[#C9973B]" />
            </div>
            <p className="text-xl font-bold text-[#0E3A53] mt-1">{staffList.length}</p>
            <span className="text-[10px] text-[#C9973B] font-semibold">{isBn ? "কিউআর ও প্রিন্ট →" : "QR & Print →"}</span>
          </div>

          <div 
            onClick={() => setActiveTab('blogs')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer ${
              activeTab === 'blogs' ? 'bg-blue-50/60 border-[#2D8FC1]' : 'bg-white border-gray-200/80 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500">{isBn ? "প্রকাশিত ব্লগ" : "Blogs"}</span>
              <BookOpen className="w-3.5 h-3.5 text-[#2D8FC1]" />
            </div>
            <p className="text-xl font-bold text-[#0E3A53] mt-1">{blogs.length}</p>
            <span className="text-[10px] text-[#2D8FC1] font-semibold">{isBn ? "পরিচালনা করুন" : "Manage"}</span>
          </div>

          <div 
            onClick={() => setActiveTab('notices')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer relative group ${
              activeTab === 'notices' ? 'bg-blue-50/60 border-[#2D8FC1]' : 'bg-white border-gray-200/80 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500">{isBn ? "সক্রিয় নোটিশ" : "Notices"}</span>
              <Bell className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-xl font-bold text-[#0E3A53]">{notices.length}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('notices');
                  setIsCustomNoticeModalOpen(true);
                }}
                className="text-[10px] bg-amber-500/15 hover:bg-amber-600 hover:text-white text-amber-800 font-bold px-2 py-0.5 rounded-md transition flex items-center gap-1 cursor-pointer"
                title={isBn ? "অফলাইন নোটিশ তৈরি ও PDF ডাউনলোড" : "Custom Printable Notice"}
              >
                <FileText className="w-2.5 h-2.5" />
                <span>{isBn ? "অফলাইন নোটিশ" : "Offline Notice"}</span>
              </button>
            </div>
            <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">{isBn ? "পরিচালনা ও প্যাড প্রিন্ট →" : "Manage & Pad Print →"}</span>
          </div>

          <div 
            onClick={() => setActiveTab('security')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer ${
              activeTab === 'security' ? 'bg-emerald-50/60 border-emerald-500' : 'bg-white border-gray-200/80 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500">{isBn ? "নিরাপত্তা" : "Security"}</span>
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-xl font-bold text-emerald-700 mt-1">SHA-256</p>
            <span className="text-[10px] text-emerald-600 font-semibold">{isBn ? "পাসওয়ার্ড ও লগইন →" : "Passwords →"}</span>
          </div>
        </div>

        {/* TAB 1: DOCTOR MANAGEMENT */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden animate-fadeIn">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-[#0E3A53]">
                  {isBn ? "ডাক্তারদের তালিকা ও সময়সূচী" : "Doctor Profiles & Schedules"}
                </h3>
                <p className="text-xs text-gray-500">
                  {isBn ? "এখানে নতুন ডাক্তার যোগ করতে পারেন অথবা অপ্রয়োজনীয় ডাক্তার বাদ দিতে পারেন।" : "Add or remove doctors from the public registry."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    placeholder={isBn ? "ডাক্তার খুঁজুন..." : "Search doctors..."}
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
                <button
                  id="admin-doctors-print-download-btn"
                  onClick={handlePrintAndDownloadDoctors}
                  disabled={isDownloadingDoctors}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition cursor-pointer shadow disabled:opacity-50 active:scale-95"
                  title={isBn ? "সকল বিশেষজ্ঞ ডাক্তারের তালিকা, চেম্বার শিডিউল ও তথ্য সরাসরি প্রিন্ট ও PDF ডাউনলোড করুন" : "Directly print and download full doctor list, schedules & profiles as PDF"}
                >
                  {isDownloadingDoctors ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  ) : (
                    <Printer className="w-4 h-4 text-[#C9973B]" />
                  )}
                  <span className="hidden sm:inline">
                    {isDownloadingDoctors 
                      ? (isBn ? "প্রস্তুত হচ্ছে..." : "Preparing...") 
                      : (isBn ? "ডাক্তার তালিকা প্রিন্ট ও PDF" : "Print & PDF Download")}
                  </span>
                  <span className="sm:hidden">
                    {isDownloadingDoctors ? (isBn ? "ডাউনলোড..." : "Downloading...") : (isBn ? "প্রিন্ট ও PDF" : "Print & PDF")}
                  </span>
                </button>
                <button
                  onClick={handleDownloadDoctorsExcel}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition cursor-pointer shadow-2xs active:scale-95"
                  title={isBn ? "ডাক্তারদের তথ্য সরাসরি Excel (.xls) ফাইলে ডাউনলোড করুন" : "Download doctor records directly in Excel (.xls)"}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">{isBn ? "Excel" : "Excel"}</span>
                </button>
                <button
                  onClick={() => setIsDoctorModalOpen(true)}
                  className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shrink-0 transition cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">{isBn ? "নতুন ডাক্তার যুক্ত করুন" : "Add Doctor"}</span>
                  <span className="sm:hidden">{isBn ? "যুক্ত করুন" : "Add"}</span>
                </button>
              </div>
            </div>

            {/* Mobile Cards for Doctors */}
            <div className="block md:hidden divide-y divide-gray-100">
              {filteredDoctors.map((doc) => (
                <div key={`doc-mob-${doc.id}`} className="p-4 space-y-2 hover:bg-gray-50/50 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#0E3A53]">{doc.name}</h4>
                      <p className="text-[11px] text-gray-400">{doc.nameEn}</p>
                    </div>
                    <button
                      onClick={() => setDeleteTarget({ type: 'doctor', id: doc.id, name: doc.name })}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer shrink-0"
                      title="ডাক্তার মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border border-blue-200/50">
                      {doc.specialty}
                    </span>
                    <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {doc.degree}
                    </span>
                    {doc.room && (
                      <span className="text-[11px] text-gray-600 flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
                        <MapPin className="w-3 h-3 text-[#2D8FC1]" />
                        {doc.room}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-600 flex items-center gap-1.5 bg-gray-50 p-2 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <div>
                      <span className="font-medium text-[#0E3A53]">{doc.time}</span>
                      <span className="text-[10px] text-gray-400 block">{doc.days.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table for Doctors */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">ডাক্তারের নাম ও পদবি</th>
                    <th className="py-3 px-4">বিশেষজ্ঞতা</th>
                    <th className="py-3 px-4">ডিগ্রি</th>
                    <th className="py-3 px-4">ভিজিটিং দিন ও সময়</th>
                    <th className="py-3 px-4">রুম</th>
                    <th className="py-3 px-4 text-right">মুছে ফেলুন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-bold text-[#0E3A53]">
                        {doc.name}
                        <span className="block text-[10px] text-gray-400 font-normal">{doc.nameEn}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-semibold text-[11px]">
                          {doc.specialty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">
                        {doc.degree}
                      </td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                        <span className="block font-medium">{doc.time}</span>
                        <span className="text-[10px] text-gray-400">{doc.days.join(', ')}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                        {doc.room || 'রুম ১০১'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setDeleteTarget({ type: 'doctor', id: doc.id, name: doc.name })}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                          title="ডাক্তার মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BLOG MANAGEMENT */}
        {activeTab === 'blogs' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden animate-fadeIn">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-[#0E3A53]">
                  {isBn ? "স্বাস্থ্য ব্লগ ও চিকিৎসা নিবন্ধ ব্যবস্থাপনা" : "Health Blogs & Articles"}
                </h3>
                <p className="text-xs text-gray-500">
                  {isBn ? "নতুন স্বাস্থ্য বিষয়ক ব্লগ লিখুন, যা সরাসরি ওয়েবসাইটের ব্লগ পেজে প্রকাশিত হবে।" : "Publish articles visible in the public Health Blog."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    placeholder={isBn ? "ব্লগ খুঁজুন..." : "Search blogs..."}
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
                <button
                  onClick={() => setIsBlogModalOpen(true)}
                  className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shrink-0 transition cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">{isBn ? "নতুন ব্লগ লিখুন" : "Write Blog"}</span>
                  <span className="sm:hidden">{isBn ? "লিখুন" : "Write"}</span>
                </button>
              </div>
            </div>

            {/* Mobile Cards for Blogs */}
            <div className="block md:hidden divide-y divide-gray-100">
              {filteredBlogs.map((blog) => (
                <div key={`blog-mob-${blog.id}`} className="p-4 space-y-2 hover:bg-gray-50/50 transition">
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[10px]">
                      {blog.category}
                    </span>
                    <button
                      onClick={() => setDeleteTarget({ type: 'blog', id: blog.id, name: blog.title })}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer shrink-0"
                      title="ব্লগ মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0E3A53]">{blog.title}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{blog.summary}</p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                    <span>{blog.author}</span>
                    <span>{blog.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table for Blogs */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">ব্লগের শিরোনাম</th>
                    <th className="py-3 px-4">বিভাগ</th>
                    <th className="py-3 px-4">লেখক / ডাক্তার</th>
                    <th className="py-3 px-4">প্রকাশের তারিখ</th>
                    <th className="py-3 px-4">পড়ার সময়</th>
                    <th className="py-3 px-4 text-right">মুছে ফেলুন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-bold text-[#0E3A53] max-w-[280px]">
                        <p className="line-clamp-1">{blog.title}</p>
                        <p className="text-[10px] text-gray-400 font-normal line-clamp-1">{blog.summary}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[11px]">
                          {blog.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                        {blog.author}
                      </td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                        {blog.date}
                      </td>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                        {blog.readTime}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setDeleteTarget({ type: 'blog', id: blog.id, name: blog.title })}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                          title="ব্লগ মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: NOTICE BOARD MANAGEMENT & EMERGENCY TICKER */}
        {activeTab === 'notices' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 📄 CUSTOM PRINTABLE OFFLINE NOTICE GENERATOR BANNER */}
            <div className="bg-gradient-to-r from-[#0E3A53] via-[#154663] to-[#0E3A53] rounded-3xl p-5 sm:p-6 text-white shadow-md border border-[#2D8FC1]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 text-[#C9973B]">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg text-white">
                      {isBn ? "কাস্টমাইজড প্রিন্টেবল নোটিশ ও অফলাইন প্যাড জেনারেটর" : "Custom Printable Notice & Offline Pad Generator"}
                    </h3>
                    <span className="bg-[#C9973B] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {isBn ? "নতুন ফিচার" : "NEW"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
                    {isBn
                      ? "হাসপাতালের যেকোনো নোটিশ (ছুটি, ডাক্তার অনুপস্থিতি, ক্যাম্প, প্রশাসনিক আদেশ) সরাসরি অফিসিয়াল প্যাড ও সিলমোহর সহ বাংলায় টাইপ করে এক ক্লিকে সরাসরি PDF ফরম্যাটে ডাউনলোড করুন এবং অফলাইনে প্রিন্ট করে নোটিশ বোর্ডে ঝুলিয়ে দিন।"
                      : "Generate official hospital notices on letterhead with logo, seal, and signature. Download directly as high-resolution PDF for offline printing."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setIsCustomNoticeModalOpen(true)}
                  id="adminOpenCustomNoticeBtn"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{isBn ? "কাস্টম নোটিশ তৈরি ও PDF ডাউনলোড" : "Create Notice & Download PDF"}</span>
                </button>
              </div>
            </div>

            {/* 🔴 EMERGENCY MARQUEE TICKER MANAGEMENT CARD */}
            <div className="bg-white rounded-3xl border-2 border-red-200/80 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                    <Megaphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white">
                        {isBn ? "লাইভ জরুরি স্ক্রল নোটিশ বার (হেডার মারকুই)" : "Live Emergency Header Ticker"}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        emergencyDraft.enabled ? 'bg-emerald-500 text-white' : 'bg-white/30 text-white'
                      }`}>
                        {emergencyDraft.enabled ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Disabled')}
                      </span>
                    </div>
                    <p className="text-xs text-red-100 mt-0.5">
                      {isBn 
                        ? "ওয়েবসাইটের একেবারে উপরে লাল বারে যে নোটিশটি স্ক্রল করে, তা এখান থেকে সরাসরি পরিবর্তন ও পরিচালনা করুন।" 
                        : "Directly manage the red emergency ticker scrolling at the very top of the website."}
                    </p>
                  </div>
                </div>

                {/* Status indicator / quick reset */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={handleResetEmergencyNotice}
                    className="text-xs bg-white/20 hover:bg-white text-white hover:text-red-700 px-3 py-1.5 rounded-xl font-medium transition cursor-pointer flex items-center gap-1"
                    title={isBn ? "ডিফল্ট টেক্সট রিস্টোর করুন" : "Reset to default"}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isBn ? "ডিফল্ট টেক্সট" : "Reset"}</span>
                  </button>
                </div>
              </div>

              {/* LIVE PREVIEW TICKER */}
              <div className="bg-gray-900 text-white px-4 py-2.5 flex items-center gap-3 overflow-hidden text-xs">
                <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[10px] shrink-0 tracking-wider">
                  {emergencyDraft.badgeBn || "জরুরি নোটিশ"}
                </span>
                <div className="overflow-hidden whitespace-nowrap flex-1 text-gray-200 text-[11px]">
                  <span className="font-medium text-amber-300">[{isBn ? "লাইভ প্রিভিউ" : "Live Preview"}]:</span>{" "}
                  {emergencyDraft.textBn || "কোনো জরুরি বার্তা প্রদান করা হয়নি।"}
                  {"  |  "}
                  <span className="text-rose-300">{isBn ? "হটলাইন:" : "Hotline:"} {emergencyDraft.hotline}</span>
                </div>
              </div>

              {/* EDIT FORM */}
              <form onSubmit={handleSaveEmergencyNotice} className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50/70 border border-red-200/80 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <Radio className={`w-4 h-4 ${emergencyDraft.enabled ? 'text-red-600 animate-pulse' : 'text-gray-400'}`} />
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {isBn ? "ওয়েবসাইটে জরুরি নোটিশ বার প্রদর্শন করুন" : "Display Emergency Ticker Bar on Website"}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {isBn ? "সুইচটি চালু/বন্ধ করলে সাথে সাথে ফায়ারবেস ক্লাউড সার্ভারে আপডেট সংরক্ষিত হবে।" : "Toggling instantly saves status to Firebase cloud database."}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emergencyDraft.enabled}
                      onChange={async (e) => {
                        const nextVal = e.target.checked;
                        const updated = { ...emergencyDraft, enabled: nextVal };
                        setEmergencyDraft(updated);
                        try {
                          await updateEmergencyNotice(updated);
                          setToastMessage(
                            nextVal
                              ? (isBn ? 'জরুরি নোটিশ প্রদর্শন সক্রিয় করা হয়েছে এবং ক্লাউড সার্ভারে সংরক্ষিত!' : 'Emergency ticker enabled & saved to cloud server!')
                              : (isBn ? 'জরুরি নোটিশ প্রদর্শন বন্ধ করা হয়েছে এবং ক্লাউড সার্ভারে সংরক্ষিত!' : 'Emergency ticker disabled & saved to cloud server!')
                          );
                        } catch (err) {
                          console.warn('Failed to update toggle on server:', err);
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bangla Text */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      {isBn ? "জরুরি নোটিশের বাংলা লেখা (যা লাল বারে স্ক্রল করবে) *" : "Emergency Notice Text (Bangla) *"}
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={emergencyDraft.textBn}
                      onChange={(e) => setEmergencyDraft({ ...emergencyDraft, textBn: e.target.value })}
                      placeholder="উদাঃ আল-মদিনা ক্লিনিকে ২৪ ঘণ্টা জরুরি সিজারিয়ান ও নরমাল ডেলিভারি সেবা চালু রয়েছে..."
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                    />
                  </div>

                  {/* English Text */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      {isBn ? "জরুরি নোটিশের ইংরেজি লেখা (ঐচ্ছিক)" : "Emergency Notice Text (English - Optional)"}
                    </label>
                    <textarea
                      rows={2}
                      value={emergencyDraft.textEn}
                      onChange={(e) => setEmergencyDraft({ ...emergencyDraft, textEn: e.target.value })}
                      placeholder="e.g. 24/7 Emergency maternity, caesarean and dental surgery services available..."
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                    />
                  </div>

                  {/* Hotline */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      {isBn ? "হটলাইন / মোবাইল নম্বর" : "Hotline / Phone Number"}
                    </label>
                    <input
                      type="text"
                      value={emergencyDraft.hotline}
                      onChange={(e) => setEmergencyDraft({ ...emergencyDraft, hotline: e.target.value })}
                      placeholder="01712-692504"
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition font-mono"
                    />
                  </div>

                  {/* Badge */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      {isBn ? "বামদিকের ব্যাজ লেবেল" : "Left Badge Label"}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={emergencyDraft.badgeBn}
                        onChange={(e) => setEmergencyDraft({ ...emergencyDraft, badgeBn: e.target.value })}
                        placeholder="জরুরি নোটিশ"
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                      />
                      <input
                        type="text"
                        value={emergencyDraft.badgeEn}
                        onChange={(e) => setEmergencyDraft({ ...emergencyDraft, badgeEn: e.target.value })}
                        placeholder="EMERGENCY"
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-gray-100">
                  <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-red-500" />
                    <span>{isBn ? "সংরক্ষণে চাপলে ফায়ারবেস ক্লাউড সার্ভারে সরাসরি সংরক্ষিত হবে ও লাইভ চলবে।" : "Saves directly to Firebase Cloud Firestore in real time."}</span>
                  </p>
                  <button
                    type="submit"
                    disabled={isEmergencySaving}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-60"
                  >
                    {isEmergencySaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isBn ? "সার্ভারে সংরক্ষিত হচ্ছে..." : "Saving to Server..."}</span>
                      </>
                    ) : isEmergencySaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>{isBn ? "সার্ভারে সংরক্ষিত হয়েছে!" : "Saved to Server!"}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isBn ? "সার্ভারে স্ক্রল নোটিশ ও সুইচের স্ট্যাটাস সংরক্ষণ করুন" : "Save Emergency Ticker to Server"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* NOTICE BOARD TABLE CARD */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-[#0E3A53]">
                    {isBn ? "নোটিশ বোর্ড ও সাধারণ ঘোষণা তালিকা" : "Notice Board List"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isBn ? "নোটিশ বোর্ডের নোটিশ যোগ, সম্পাদনা (Edit) বা মুছে ফেলুন।" : "Add, edit or delete regular announcements from the notice board."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={noticeSearch}
                      onChange={(e) => setNoticeSearch(e.target.value)}
                      placeholder={isBn ? "নোটিশ খুঁজুন..." : "Search notices..."}
                      className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                    />
                  </div>
                  <button
                    onClick={() => setIsCustomNoticeModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition cursor-pointer shadow"
                    title={isBn ? "কাস্টমাইজড অফলাইন নোটিশ প্যাড ও PDF ডাউনলোড" : "Custom Printable Notice"}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isBn ? "কাস্টম নোটিশ PDF" : "Custom Notice PDF"}</span>
                    <span className="sm:hidden">{isBn ? "প্যাড" : "Pad"}</span>
                  </button>
                  <button
                    onClick={handleOpenAddNotice}
                    className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shrink-0 transition cursor-pointer shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">{isBn ? "নতুন নোটিশ প্রকাশ করুন" : "Publish Notice"}</span>
                    <span className="sm:hidden">{isBn ? "নতুন" : "New"}</span>
                  </button>
                </div>
              </div>

              {/* Mobile Cards for Notices */}
              <div className="block md:hidden divide-y divide-gray-100">
                {filteredNotices.map((notice) => (
                  <div key={`notice-mob-${notice.id}`} className="p-4 space-y-2 hover:bg-gray-50/50 transition">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        notice.type === 'urgent' ? 'bg-red-100 text-red-700' :
                        notice.type === 'offer' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {notice.badge}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={downloadingNoticeId === notice.id}
                          onClick={() => handleDirectDownloadNoticePdf(notice)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer disabled:opacity-50"
                          title={isBn ? "অফলাইন অফিসিয়াল প্যাড ফরম্যাটে সরাসরি PDF ডাউনলোড করুন" : "Direct Download PDF in Official Letterhead Format"}
                        >
                          {downloadingNoticeId === notice.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEditNotice(notice)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                          title={isBn ? "নোটিশ সম্পাদনা করুন" : "Edit Notice"}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: 'notice', id: notice.id, name: notice.title })}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                          title={isBn ? "নোটিশ মুছে ফেলুন" : "Delete Notice"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#0E3A53]">{notice.title}</h4>
                    <p className="text-[11px] text-gray-500">{notice.description}</p>
                    <div className="text-[10px] text-gray-400 pt-1">
                      {notice.date}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table for Notices */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100 text-[11px]">
                    <tr>
                      <th className="py-3 px-4">লেবেল</th>
                      <th className="py-3 px-4">নোটিশের শিরোনাম ও বিবরণ</th>
                      <th className="py-3 px-4">ধরণ</th>
                      <th className="py-3 px-4">তারিখ</th>
                      <th className="py-3 px-4 text-right">কার্যক্রম (Action)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredNotices.map((notice) => (
                      <tr key={notice.id} className="hover:bg-gray-50/60 transition">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            notice.type === 'urgent' ? 'bg-red-100 text-red-700' :
                            notice.type === 'offer' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {notice.badge}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#0E3A53] block">{notice.title}</span>
                          <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{notice.description}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-600 uppercase font-mono text-[10px]">
                          {notice.type}
                        </td>
                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                          {notice.date}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              disabled={downloadingNoticeId === notice.id}
                              onClick={() => handleDirectDownloadNoticePdf(notice)}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer disabled:opacity-50"
                              title={isBn ? "অফলাইন অফিসিয়াল প্যাড ফরম্যাটে সরাসরি PDF ডাউনলোড করুন" : "Direct Download PDF in Official Letterhead Format"}
                            >
                              {downloadingNoticeId === notice.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleOpenEditNotice(notice)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                              title={isBn ? "নোটিশ সম্পাদনা করুন" : "Edit Notice"}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'notice', id: notice.id, name: notice.title })}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                              title={isBn ? "নোটিশ মুছে ফেলুন" : "Delete Notice"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & CREDENTIALS MANAGEMENT (DATABASE PERSISTED & HACKER PROOF) */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Database & Anti-Hacking Cloud Status Banner */}
            <div className="bg-gradient-to-r from-[#0E3A53] to-[#174F70] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-[#2D8FC1]/30">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#2D8FC1]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#C9973B]/20 border border-[#C9973B]/40 text-[#C9973B] flex items-center justify-center shrink-0 shadow-lg">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-white">
                        {isBn ? "ক্লাউড ডেটাবেস ক্রেডেনশিয়াল ও অ্যান্টি-হ্যাকিং প্রোটেকশন" : "Cloud Database Credentials & Anti-Hacking Security"}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {isSecuritySyncedToCloud ? (isBn ? "ক্লাউড ডেটাবেসে সংরক্ষিত" : "Firestore Live Synced") : (isBn ? "সিঙ্ক হচ্ছে..." : "Syncing...")}
                      </span>
                    </div>
                    <p className="text-xs text-blue-100/80 max-w-3xl leading-relaxed">
                      {isBn 
                        ? "সমস্ত ইউজারনেম ও পাসওয়ার্ড ক্লাউড ফায়ারবেস ডেটাবেসে স্থায়ীভাবে সংরক্ষিত। ব্রাউজার কনসোল বা সোর্সে কোনো পাসওয়ার্ড থাকে না। ক্রিপ্টোগ্রাফিক সল্টেড হ্যাশের কারণে হ্যাকারদের পক্ষে পাসওয়ার্ড বের করা অসম্ভব। শুধুমাত্র সুপার অ্যাডমিন এই প্যানেল থেকে ক্রেডেনশিয়াল পরিবর্তন করতে পারবেন।"
                        : "All credentials are permanently stored in Cloud Firestore. Zero plain-text in browser console or code. Irreversible salted cryptographic hashing prevents any hacker decryption. Only Super Admin can change credentials."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/10 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isBn ? "অ্যাডমিন এক্সক্লুসিভ অ্যাক্সেস" : "Admin Only Access"}</span>
                </div>
              </div>
            </div>

            {/* Security Guarantee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0E3A53]">{isBn ? "ক্লাউড ডেটাবেস সেভ" : "Firestore Cloud Storage"}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {isBn ? "ইউজারনেম ও পাসওয়ার্ড ফায়ারবেস ডেটাবেসে সুরক্ষিতভাবে জমা থাকে।" : "Credentials synced directly to persistent Cloud Firestore."}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2D8FC1] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0E3A53]">{isBn ? "অ্যান্টি-হ্যাক ক্রিপ্টোগ্রাফি" : "Salted SHA-256 Hash"}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {isBn ? "৪৮-হেক্স সল্ট ও পেপার দ্বারা ওয়ান-ওয়ে হ্যাশ করা। হ্যাকাররা রিভার্স করতে পারে না।" : "Irreversible salted cryptographic hashing with unique salt per user."}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0E3A53]">{isBn ? "কনসোল লিকেজ ব্লকড" : "Zero Console Leaks"}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {isBn ? "ব্রাউজার কনসোল (F12) বা সোর্স কোডে পাসওয়ার্ডের কোনো অস্তিত্ব নেই।" : "Zero sensitive data or plaintext credentials exposed to browser window/console."}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0E3A53]">{isBn ? "ব্রুট-ফোর্স লকআউট" : "Brute-Force Rate Limit"}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {isBn ? "পরপর ৪ বার ভুল পাসওয়ার্ড দিলে অ্যাকাউন্ট ৫ মিনিটের জন্য স্বয়ংক্রিয়ভাবে লক হয়।" : "4 failed attempts locks login for 5 minutes automatically."}
                  </p>
                </div>
              </div>
            </div>

            {/* Credentials Management Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. Super Admin Credentials Panel */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#0E3A53] text-white flex items-center justify-center font-bold shadow-md">
                      <KeyRound className="w-5 h-5 text-[#C9973B]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#0E3A53]">
                        {isBn ? "সুপার অ্যাডমিন ক্রেডেনশিয়াল" : "Super Admin Credentials"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {isBn ? "অ্যাডমিন ইউজারনেম ও পাসওয়ার্ড সরাসরি ডেটাবেসে পরিবর্তন করুন" : "Manage master admin login stored securely in database"}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                    <User className="w-3 h-3" />
                    <span>{adminUsername || 'admin'}</span>
                  </span>
                </div>

                {adminPassMsg && (
                  <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                    adminPassMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {adminPassMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />}
                    <span className="leading-relaxed">{adminPassMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangeAdminCredentials} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      {isBn ? "অ্যাডমিন ইউজারনেম (Username)" : "Admin Username"}
                    </label>
                    <input
                      type="text"
                      required
                      value={adminUserVal}
                      onChange={(e) => setAdminUserVal(e.target.value)}
                      placeholder="admin"
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white text-xs sm:text-sm font-medium"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      {isBn ? "বর্তমান অ্যাক্টিভ ইউজারনেম পরিবর্তন করতে পারেন।" : "You can change the admin username anytime."}
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      {isBn ? "নতুন পাসওয়ার্ড (New Password)" : "New Password"}
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPass ? 'text' : 'password'}
                        value={adminNewPass}
                        onChange={(e) => setAdminNewPass(e.target.value)}
                        placeholder={isBn ? "অপরিবর্তিত রাখতে খালি রাখুন (নতুবা কমপক্ষে ৫ অক্ষর)" : "Leave blank to keep unchanged (min 5 chars)"}
                        className="w-full bg-gray-50 border border-gray-200 pl-3.5 pr-10 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white text-xs sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPass(!showAdminPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {adminNewPass && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-gray-500">
                          {isBn ? "পাসওয়ার্ডের নিরাপত্তা মাত্রা:" : "Password Strength:"}
                        </span>
                        <span className={`text-[11px] font-bold ${
                          evaluatePasswordStrength(adminNewPass).score >= 4 
                            ? 'text-emerald-600' 
                            : evaluatePasswordStrength(adminNewPass).score >= 2 
                            ? 'text-amber-600' 
                            : 'text-red-500'
                        }`}>
                          {isBn ? evaluatePasswordStrength(adminNewPass).labelBn : evaluatePasswordStrength(adminNewPass).label}
                        </span>
                      </div>
                    )}
                  </div>

                  {adminNewPass && (
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        {isBn ? "পাসওয়ার্ড নিশ্চিতকরণ (Confirm Password)" : "Confirm Password"}
                      </label>
                      <input
                        type={showAdminPass ? 'text' : 'password'}
                        required={!!adminNewPass}
                        value={adminConfirmPass}
                        onChange={(e) => setAdminConfirmPass(e.target.value)}
                        placeholder="একই পাসওয়ার্ড পুনরায় লিখুন"
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white text-xs sm:text-sm"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSavingAdmin}
                    className="w-full bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold py-2.5 rounded-xl transition cursor-pointer shadow flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSavingAdmin ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>{isBn ? "ক্লাউড ডেটাবেসে সেভ হচ্ছে..." : "Saving to Database..."}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-[#C9973B]" />
                        <span>{isBn ? "ক্লাউড ডেটাবেসে অ্যাডমিন ক্রেডেনশিয়াল সেভ করুন" : "Save Admin Credentials to Database"}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* 2. Receptionist Credentials Panel (Admin Only Reset) */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2D8FC1] flex items-center justify-center font-bold shadow-md">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#0E3A53]">
                        {isBn ? "রিসেপশনিস্ট ক্রেডেনশিয়াল" : "Receptionist Credentials"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {isBn ? "রিসেপশন ডেস্কের ইউজারনেম ও পাসওয়ার্ড সরাসরি নির্ধারণ করুন" : "Set reception login username and password in database"}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#2D8FC1] border border-blue-200 shrink-0">
                    <User className="w-3 h-3" />
                    <span>{receptionistUsername || 'reception'}</span>
                  </span>
                </div>

                {recPassMsg && (
                  <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                    recPassMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {recPassMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />}
                    <span className="leading-relaxed">{recPassMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleResetReceptionCredentials} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      {isBn ? "রিসেপশনিস্ট ইউজারনেম (Username)" : "Receptionist Username"}
                    </label>
                    <input
                      type="text"
                      required
                      value={recUserVal}
                      onChange={(e) => setRecUserVal(e.target.value)}
                      placeholder="reception"
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white text-xs sm:text-sm font-medium"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      {isBn ? "রিসেপশন কর্মীদের লগইন ইউজারনেম পরিবর্তন করতে পারেন।" : "You can change reception login username."}
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      {isBn ? "রিসেপশনের নতুন পাসওয়ার্ড (New Password)" : "New Password"}
                    </label>
                    <div className="relative">
                      <input
                        type={showRecPass ? 'text' : 'password'}
                        value={recNewPass}
                        onChange={(e) => setRecNewPass(e.target.value)}
                        placeholder={isBn ? "অপরিবর্তিত রাখতে খালি রাখুন (নতুবা কমপক্ষে ৫ অক্ষর)" : "Leave blank to keep unchanged (min 5 chars)"}
                        className="w-full bg-gray-50 border border-gray-200 pl-3.5 pr-10 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white text-xs sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRecPass(!showRecPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showRecPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {recNewPass && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-gray-500">
                          {isBn ? "পাসওয়ার্ডের নিরাপত্তা মাত্রা:" : "Password Strength:"}
                        </span>
                        <span className={`text-[11px] font-bold ${
                          evaluatePasswordStrength(recNewPass).score >= 4 
                            ? 'text-emerald-600' 
                            : evaluatePasswordStrength(recNewPass).score >= 2 
                            ? 'text-amber-600' 
                            : 'text-red-500'
                        }`}>
                          {isBn ? evaluatePasswordStrength(recNewPass).labelBn : evaluatePasswordStrength(recNewPass).label}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingRec}
                    className="w-full bg-[#2D8FC1] hover:bg-[#23749D] text-white font-bold py-2.5 rounded-xl transition cursor-pointer shadow flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSavingRec ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>{isBn ? "ডেটাবেসে সেট হচ্ছে..." : "Setting in Database..."}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isBn ? "ক্লাউড ডেটাবেসে রিসেপশনিস্ট ক্রেডেনশিয়াল সেভ করুন" : "Save Receptionist Credentials to Database"}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MANAGEMENT / GOVERNING BODY */}
        {activeTab === 'management' && (
          <div className="animate-fadeIn">
            <AdminManagementManager />
          </div>
        )}

        {/* TAB: DIAGNOSTIC TESTS & PRICING */}
        {activeTab === 'tests' && (
          <div className="animate-fadeIn">
            <AdminDiagnosticManager />
          </div>
        )}

        {/* TAB: PHOTO GALLERY */}
        {activeTab === 'gallery' && (
          <div className="animate-fadeIn">
            <AdminGalleryManager />
          </div>
        )}

        {/* TAB: STAFF ID CARD GENERATOR & VERIFICATION */}
        {activeTab === 'staff-id' && (
          <div className="animate-fadeIn">
            <StaffIdCardGenerator />
          </div>
        )}
      </div>

      {/* MODAL 1: ADD DOCTOR */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-xl my-auto animate-fadeIn">
            <button
              onClick={() => setIsDoctorModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-bold text-base text-[#0E3A53] mb-1 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#2D8FC1]" />
              <span>{isBn ? "নতুন ডাক্তার যুক্ত করুন" : "Add Doctor"}</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {isBn ? "ডাক্তারের নাম, বিশেষত্ব ও ভিজিটিং সময়সূচী প্রদান করুন।" : "Enter doctor credentials and visiting hours."}
            </p>

            {doctorFormError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{doctorFormError}</span>
              </div>
            )}

            <form onSubmit={handleAddDoctor} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "ডাক্তারের নাম (বাংলা) *" : "Doctor Name (Bengali) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    placeholder="উদাঃ ডাঃ মোঃ কামরুল ইসলাম"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "ডাক্তারের নাম (ইংরেজি)" : "Doctor Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={newDoc.nameEn}
                    onChange={(e) => setNewDoc({ ...newDoc, nameEn: e.target.value })}
                    placeholder="Dr. Md. Kamrul Islam"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "বিশেষজ্ঞতা (বাংলা) *" : "Specialty *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newDoc.specialty}
                    onChange={(e) => setNewDoc({ ...newDoc, specialty: e.target.value })}
                    placeholder="উদাঃ মেডিসিন ও হৃদরোগ বিশেষজ্ঞ"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "ডিগ্রি ও পদবি" : "Degrees / Qualification"}
                  </label>
                  <input
                    type="text"
                    value={newDoc.degree}
                    onChange={(e) => setNewDoc({ ...newDoc, degree: e.target.value })}
                    placeholder="MBBS, BCS (Health), FCPS"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "ভিজিটিং সময়সূচী" : "Visiting Time"}
                  </label>
                  <input
                    type="text"
                    value={newDoc.time}
                    onChange={(e) => setNewDoc({ ...newDoc, time: e.target.value })}
                    placeholder="বিকাল ৪টা - রাত ৮টা"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "চেম্বার / রুম" : "Chamber / Room"}
                  </label>
                  <input
                    type="text"
                    value={newDoc.room}
                    onChange={(e) => setNewDoc({ ...newDoc, room: e.target.value })}
                    placeholder="রুম নং ১০২ (২য় তলা)"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold transition cursor-pointer"
                >
                  {isBn ? "ডাক্তার সংরক্ষণ করুন" : "Save Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD BLOG */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-xl my-auto animate-fadeIn">
            <button
              onClick={() => setIsBlogModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-bold text-base text-[#0E3A53] mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2D8FC1]" />
              <span>{isBn ? "নতুন স্বাস্থ্য ব্লগ প্রকাশ করুন" : "Publish Health Article"}</span>
            </h3>

            {blogFormError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{blogFormError}</span>
              </div>
            )}

            <form onSubmit={handleAddBlog} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isBn ? "ব্লগের শিরোনাম *" : "Article Title *"}
                </label>
                <input
                  type="text"
                  required
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  placeholder="উদাঃ হার্ট অ্যাটাকের লক্ষণ ও প্রাথমিক চিকিৎসা"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "বিভাগ (Category)" : "Category"}
                  </label>
                  <select
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  >
                    <option value="হৃদরোগ ও স্বাস্থ্য">হৃদরোগ ও স্বাস্থ্য</option>
                    <option value="শিশু স্বাস্থ্য">শিশু স্বাস্থ্য</option>
                    <option value="মহিলা ও প্রসূতি">মহিলা ও প্রসূতি</option>
                    <option value="সাধারণ পরামর্শ">সাধারণ পরামর্শ</option>
                    <option value="পুষ্টি ও খাদ্য">পুষ্টি ও খাদ্য</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "লেখক / ডাক্তারের নাম" : "Author Name"}
                  </label>
                  <input
                    type="text"
                    value={newBlog.author}
                    onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                    placeholder="ডাঃ মোহাম্মদ শফিক"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isBn ? "সংক্ষিপ্ত সারসংক্ষেপ (Summary)" : "Summary"}
                </label>
                <textarea
                  rows={2}
                  value={newBlog.summary}
                  onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })}
                  placeholder="ব্লগটির সংক্ষেপ বিবরণ যা কার্ডে প্রদর্শিত হবে..."
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isBn ? "ব্লগের বিস্তারিত লেখা *" : "Full Content *"}
                </label>
                <textarea
                  rows={5}
                  required
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  placeholder="সম্পূর্ণ ব্লগের লেখা এখানে লিখুন..."
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isBlogSaving}
                  className="px-5 py-2 rounded-xl bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold transition cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {isBlogSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{isBlogSaving ? (isBn ? "সার্ভারে সংরক্ষিত হচ্ছে..." : "Saving to Server...") : (isBn ? "ব্লগ প্রকাশ ও সার্ভারে সংরক্ষণ করুন" : "Publish & Save to Server")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NOTICE */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-xl my-auto animate-fadeIn">
            <button
              onClick={() => setIsNoticeModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-bold text-base text-[#0E3A53] mb-1 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <span>{editingNoticeId ? (isBn ? "নোটিশ সম্পাদনা করুন" : "Edit Notice") : (isBn ? "নতুন নোটিশ বা জরুরি ঘোষণা" : "Publish Notice")}</span>
            </h3>

            {noticeFormError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{noticeFormError}</span>
              </div>
            )}

            <form onSubmit={handleAddNotice} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isBn ? "নোটিশের শিরোনাম *" : "Notice Title *"}
                </label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="উদাঃ আগামী শুক্রবার বিশেষ ডায়াবেটিস ক্যাম্প"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "ধরণ (Type)" : "Type"}
                  </label>
                  <select
                    value={newNotice.type}
                    onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  >
                    <option value="urgent">জরুরি নোটিশ (Urgent)</option>
                    <option value="offer">বিশেষ অফার বা ক্যাম্প (Campaign)</option>
                    <option value="info">সাধারণ তথ্য (Information)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "ব্যাজ লেবেল" : "Badge Label"}
                  </label>
                  <input
                    type="text"
                    value={newNotice.badge}
                    onChange={(e) => setNewNotice({ ...newNotice, badge: e.target.value })}
                    placeholder="যেমন: জরুরি বা ৫০% ছাড়"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isBn ? "নোটিশের বিবরণ *" : "Notice Description *"}
                </label>
                <textarea
                  rows={3}
                  required
                  value={newNotice.description}
                  onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                  placeholder="ঘোষণাপত্র বা নোটিশের বিস্তারিত তথ্য..."
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsNoticeModalOpen(false);
                    setEditingNoticeId(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isNoticeSaving}
                  className="px-5 py-2 rounded-xl bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold transition cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {isNoticeSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>
                    {isNoticeSaving 
                      ? (isBn ? "সার্ভারে সংরক্ষিত হচ্ছে..." : "Saving to Server...") 
                      : editingNoticeId 
                        ? (isBn ? "আপডেট সংরক্ষণ করুন" : "Save Changes") 
                        : (isBn ? "নোটিশ প্রকাশ ও সংরক্ষণ করুন" : "Publish & Save Notice")}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-[#0E3A53] mb-1">
              {isBn ? "মুছে ফেলার নিশ্চিতকরণ" : "Confirm Deletion"}
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              {isBn ? "আপনি কি নিশ্চিতভাবে এই আইটেমটি স্থায়ীভাবে মুছে ফেলতে চান?" : "Are you sure you want to permanently remove this item?"}
            </p>
            <div className="bg-red-50/70 border border-red-200/70 rounded-xl p-3 mb-5 text-left text-xs">
              <p className="font-bold text-red-950 truncate">
                {deleteTarget.type === 'doctor' ? 'ডাক্তার: ' : deleteTarget.type === 'blog' ? 'ব্লগ: ' : 'নোটিশ: '}
                {deleteTarget.name}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                {isBn ? "বাতিল করুন" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition cursor-pointer shadow-md"
              >
                {isBn ? "হ্যাঁ, মুছুন" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING SUCCESS TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0E3A53] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border border-[#2D8FC1]/40 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="ml-3 p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DOCTOR LIST PRINT MODAL */}
      {isPrintDoctorsModalOpen && (
        <DoctorListPrintModal
          doctors={doctors}
          onClose={() => setIsPrintDoctorsModalOpen(false)}
          isBn={isBn}
        />
      )}

      {/* CUSTOM NOTICE LETTERHEAD & PDF DOWNLOAD MODAL */}
      {isCustomNoticeModalOpen && (
        <CustomNoticeModal
          onClose={() => setIsCustomNoticeModalOpen(false)}
          isBn={isBn}
        />
      )}

      {/* NOTICE BOARD CIRCULAR PRINT & PDF MODAL */}
      {isNoticePrintModalOpen && (
        <NoticePrintModal
          notices={notices}
          selectedNotice={selectedPrintNotice}
          onClose={() => {
            setIsNoticePrintModalOpen(false);
            setSelectedPrintNotice(null);
          }}
          isBn={isBn}
        />
      )}

      {/* OFF-SCREEN HIGH-FIDELITY DOCTORS REPORT CONTAINER FOR DIRECT PDF DOWNLOAD & ISOLATED PRINT */}
      <div 
        id="admin-doctors-print-wrapper"
        style={{ position: 'absolute', left: '-9999px', top: 0, width: '900px', background: '#ffffff', zIndex: -999 }} 
        aria-hidden="true"
      >
        <div id="admin-doctors-printable-content" className="p-8 bg-white text-gray-800 space-y-4">
          <PrintLetterhead
            documentTitle={isBn ? "বিশেষজ্ঞ চিকিৎসক প্রোফাইল ও চেম্বার সময়সূচী" : "Specialist Doctor Profiles & Chamber Visiting Schedules"}
            documentSubtitle={
              isBn
                ? `মোট তালিকাভুক্ত বিশেষজ্ঞ চিকিৎসক: ${filteredDoctors.length > 0 ? filteredDoctors.length : doctors.length} জন | আনোয়ারা মেডিকেল কমপ্লেক্স`
                : `Total Listed Specialist Consultants: ${filteredDoctors.length > 0 ? filteredDoctors.length : doctors.length} | Anowara Medical Complex`
            }
            refNo={`AMC/DOC/${new Date().getFullYear()}/ROSTER`}
            date={new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            isBn={isBn}
          />

          {/* Quick Notice & Information Bar */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl px-4 py-2.5 text-xs flex items-center justify-between">
            <span className="font-bold text-[#0E3A53]">
              {isBn 
                ? "🏥 আনোয়ারা মেডিকেল কমপ্লেক্স - ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী" 
                : "🏥 Anowara Medical Complex - WAPDA Sadar Road, Medical Mor, Palash, Narsingdi"}
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              {isBn ? "সিরিয়াল হটলাইন: 01972-692504, 01944-874304" : "Serial Hotline: 01972-692504"}
            </span>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-center text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-semibold">{isBn ? "মোট চিকিৎসক" : "Total Doctors"}</span>
              <span className="font-bold text-gray-900 text-sm">{(filteredDoctors.length > 0 ? filteredDoctors : doctors).length} জন</span>
            </div>
            <div>
              <span className="text-[#0E3A53] block text-[10px] uppercase font-semibold">{isBn ? "মেডিসিন ও হৃদরোগ" : "Medicine & Cardiology"}</span>
              <span className="font-bold text-[#0E3A53] text-sm">
                {(filteredDoctors.length > 0 ? filteredDoctors : doctors).filter(d => (d.specialty || '').includes('মেডিসিন') || (d.specialty || '').includes('হৃদরোগ')).length} জন
              </span>
            </div>
            <div>
              <span className="text-rose-600 block text-[10px] uppercase font-semibold">{isBn ? "গাইনী ও প্রসূতি" : "Gynecology"}</span>
              <span className="font-bold text-rose-700 text-sm">
                {(filteredDoctors.length > 0 ? filteredDoctors : doctors).filter(d => (d.specialty || '').includes('গাইনী') || (d.specialty || '').includes('প্রসূতি')).length} জন
              </span>
            </div>
            <div>
              <span className="text-emerald-600 block text-[10px] uppercase font-semibold">{isBn ? "অন্যান্য বিশেষত্ব" : "Other Specialists"}</span>
              <span className="font-bold text-emerald-700 text-sm">
                {(filteredDoctors.length > 0 ? filteredDoctors : doctors).filter(d => !(d.specialty || '').includes('মেডিসিন') && !(d.specialty || '').includes('হৃদরোগ') && !(d.specialty || '').includes('গাইনী') && !(d.specialty || '').includes('প্রসূতি')).length} জন
              </span>
            </div>
          </div>

          {/* Comprehensive Doctor Profiles & Visiting Schedule Table */}
          <div className="border border-gray-300 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0E3A53] text-white font-bold text-[11px]">
                  <th className="py-2.5 px-2 text-center w-8 border border-[#1B4B68]">#</th>
                  <th className="py-2.5 px-3 border border-[#1B4B68] w-52">
                    {isBn ? "চিকিৎসকের নাম ও পদবী" : "Doctor Name & Degree"}
                  </th>
                  <th className="py-2.5 px-3 border border-[#1B4B68] w-44">
                    {isBn ? "বিভাগ / বিশেষজ্ঞতা" : "Specialty"}
                  </th>
                  <th className="py-2.5 px-3 border border-[#1B4B68]">
                    {isBn ? "ভিজিটিং দিন ও চেম্বার সময়" : "Visiting Days & Time"}
                  </th>
                  <th className="py-2.5 px-2 text-center border border-[#1B4B68] w-24">
                    {isBn ? "চেম্বার / রুম" : "Room"}
                  </th>
                  <th className="py-2.5 px-2 text-center border border-[#1B4B68] w-28 bg-[#0A2A3D] text-[#C9973B]">
                    {isBn ? "সিরিয়াল বুকিং" : "Serial Booking"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(filteredDoctors.length > 0 ? filteredDoctors : doctors).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 italic">
                      {isBn ? "কোনো ডাক্তারের তথ্য পাওয়া যায়নি" : "No doctor records available"}
                    </td>
                  </tr>
                ) : (
                  (filteredDoctors.length > 0 ? filteredDoctors : doctors).map((doc, index) => (
                    <tr key={`print-doc-${doc.id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                      <td className="py-2.5 px-2 text-center font-bold text-gray-500 border border-gray-300">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3 border border-gray-300">
                        <div className="font-bold text-gray-900 text-xs">{doc.name}</div>
                        {doc.nameEn && <div className="text-[10px] text-gray-500 font-normal">{doc.nameEn}</div>}
                        <div className="text-[10px] text-blue-900 font-medium mt-0.5">{doc.degree}</div>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-gray-800 border border-gray-300">
                        <span className="inline-block px-1.5 py-0.5 bg-sky-50 text-[#0E3A53] rounded border border-sky-100 text-[10.5px]">
                          {doc.specialty}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-800 border border-gray-300">
                        <div className="font-semibold text-gray-900 text-[11px]">
                          <span className="text-amber-800 font-bold">দিন:</span> {doc.days && doc.days.length > 0 ? doc.days.join(', ') : 'নির্ধারিত দিনে'}
                        </div>
                        <div className="text-[10px] text-gray-600 mt-0.5">
                          <span className="text-emerald-700 font-medium">সময়:</span> {doc.time}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center border border-gray-300">
                        <span className="font-bold text-[#0E3A53] bg-amber-50 px-2 py-1 rounded border border-amber-200 text-[11px] inline-block">
                          {doc.room || 'চেম্বার'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center border border-gray-300 font-mono text-[10.5px] font-bold text-[#0E3A53]">
                        {doc.phone || '01972-692504'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Official Instructions & Seal */}
          <div className="mt-6 pt-5 border-t border-gray-300 flex justify-between items-end text-xs">
            <div className="text-center">
              <div className="w-32 border-b border-gray-500 mb-1"></div>
              <p className="font-bold text-gray-800">সিরিয়াল ও রিসেপশন ডেস্ক</p>
              <p className="text-[10px] text-gray-500">আনোয়ারা মেডিকেল কমপ্লেক্স</p>
            </div>
            <div className="border border-dashed border-[#C9973B] rounded-xl px-5 py-2 text-center bg-amber-50">
              <span className="text-[11px] font-extrabold text-[#0E3A53] block">আনোয়ারা মেডিকেল কমপ্লেক্স</span>
              <span className="text-[9px] text-emerald-700 font-bold">✓ অফিসিয়াল বিশেষজ্ঞ চিকিৎসক শিডিউল রোস্টার</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-gray-500 mb-1"></div>
              <p className="font-bold text-gray-800">মেডিকেল সুপারিনটেনডেন্ট / পরিচালক</p>
              <p className="text-[10px] text-gray-500">অনুমোদন ও সিলমোহর</p>
            </div>
          </div>
        </div>
      </div>

      {/* OFF-SCREEN HIGH-FIDELITY SINGLE NOTICE CONTAINER FOR DIRECT PDF DOWNLOAD IN OFFICIAL LETTERHEAD FORMAT */}
      <div 
        id="admin-single-notice-print-wrapper"
        style={{ position: 'absolute', left: '-9999px', top: 0, width: '850px', background: '#ffffff', zIndex: -999 }} 
        aria-hidden="true"
      >
        <div id="admin-single-notice-printable" className="p-10 bg-white text-gray-900 space-y-5 min-h-[950px] flex flex-col justify-between">
          {activeNoticeForPdf && (
            <>
              <div className="space-y-4">
                {/* Official Letterhead with Centered Logo, Header & Contacts */}
                <PrintLetterhead
                  documentTitle={activeNoticeForPdf.badge || (activeNoticeForPdf.type === 'urgent' ? (isBn ? 'জরুরি বিজ্ঞপ্তি' : 'Urgent Notice') : (isBn ? 'সাধারণ বিজ্ঞপ্তি' : 'Official Notice'))}
                  hideRefNo={true}
                  date={activeNoticeForPdf.date || new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                  isBn={isBn}
                  centered={true}
                />

                {/* Subject - Clean and uncluttered */}
                <div className="pt-2 pb-1 border-b border-gray-200">
                  <h3 className="font-extrabold text-[#0E3A53] text-base sm:text-lg leading-snug">
                    <span className="text-gray-600 font-medium">{isBn ? "বিষয়: " : "Subject: "}</span>
                    {isBn ? activeNoticeForPdf.title : (activeNoticeForPdf.titleEn || activeNoticeForPdf.title)}
                  </h3>
                </div>

                {/* Notice Body */}
                <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line text-justify min-h-[260px] font-sans pt-2">
                  {isBn ? activeNoticeForPdf.description : (activeNoticeForPdf.descriptionEn || activeNoticeForPdf.description)}
                </div>

                {/* Special Note if Badge is present */}
                {activeNoticeForPdf.badge && (
                  <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 text-xs text-gray-800 mt-4">
                    <span className="font-bold text-[#0E3A53]">{isBn ? "বিশেষ জ্ঞাতব্য / নির্দেশিকা: " : "Special Notice / Note: "}</span>
                    {isBn ? activeNoticeForPdf.badge : (activeNoticeForPdf.badgeEn || activeNoticeForPdf.badge)}
                  </div>
                )}
              </div>

              {/* Official Signatures Area: No seal, clean signature at bottom corner */}
              <div className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex items-end justify-between">
                  {/* Left: Publication Date info */}
                  <div className="text-left text-xs text-gray-500 space-y-1">
                    <p>{isBn ? "বিজ্ঞপ্তি প্রকাশের তারিখ: " : "Issue Date: "}<span className="font-semibold text-gray-700">{activeNoticeForPdf.date}</span></p>
                    <p className="text-[10px] text-gray-400">আনোয়ারা মেডিকেল কমপ্লেক্স নোটিশ বোর্ড</p>
                  </div>

                  {/* Right: Signature Area */}
                  <div className="flex flex-col items-center text-center">
                    <div className="h-14 flex items-end pb-1">
                      <span className="font-serif italic text-gray-400 text-sm tracking-widest">[অনুমোদিত স্বাক্ষর]</span>
                    </div>
                    <div className="border-t-2 border-gray-800 w-48 mx-auto mb-1.5"></div>
                    <p className="font-bold text-gray-900 text-xs">মেডিকেল সুপারিনটেনডেন্ট / পরিচালক</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">কর্তৃপক্ষের আদেশক্রমে</p>
                  </div>
                </div>

                {/* Hospital Footer Bar */}
                <div className="mt-8 text-center text-[10px] text-gray-500 border-t border-gray-200 pt-2.5 space-y-0.5">
                  <p className="font-semibold text-gray-700">
                    আনোয়ারা মেডিকেল কমপ্লেক্স | ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী
                  </p>
                  <p>
                    জরুরি ও রিসেপশন: 01972-692504 | কর্তৃপক্ষ: 01712-692504 | ওয়েবসাইট: anowaramedicalcomplex.com
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
