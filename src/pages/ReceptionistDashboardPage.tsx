import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Lock, 
  UserCheck, 
  Phone, 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Filter, 
  Eye, 
  EyeOff,
  Edit3, 
  X, 
  ChevronDown,
  ArrowUpDown,
  FileSpreadsheet,
  ShieldCheck,
  KeyRound,
  Stethoscope,
  Printer,
  Download,
  Loader2
} from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { useLanguage } from '../context/LanguageContext';
import { useData, AppointmentRecord } from '../context/DataContext';
import { AppointmentPrintSlip } from '../components/AppointmentPrintSlip';
import { SerialSchedulePrintModal } from '../components/SerialSchedulePrintModal';
import { PrintLetterhead } from '../components/PrintLetterhead';
import { downloadElementAsPdf, printElement } from '../utils/printHelper';

interface ReceptionistDashboardPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: any) => void;
}

export const ReceptionistDashboardPage: React.FC<ReceptionistDashboardPageProps> = ({
  onNavigateHome,
  onNavigate,
}) => {
  const { isBn } = useLanguage();
  const { 
    appointments, 
    addAppointment, 
    updateAppointmentStatus, 
    removeAppointment, 
    resetAppointments,
    doctors,
    isReceptionistLoggedIn, 
    loginReceptionist, 
    logoutReceptionist,
    changePassword,
    checkLockoutStatus,
    isFirebaseConnected,
    deleteAppointmentsOlderThan30Days
  } = useData();

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Check lockout periodically when login screen is shown
  useEffect(() => {
    if (isReceptionistLoggedIn) return;
    const lock = checkLockoutStatus('receptionist');
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
  }, [isReceptionistLoggedIn, checkLockoutStatus]);

  // Dashboard state with persistent reload retention
  const [searchQuery, setSearchQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'attended' | 'cancelled'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryStatus = params.get('status');
        if (queryStatus && ['all', 'pending', 'confirmed', 'attended', 'cancelled'].includes(queryStatus)) {
          return queryStatus as any;
        }
        const saved = localStorage.getItem('amc_receptionist_status_filter');
        if (saved && ['all', 'pending', 'confirmed', 'attended', 'cancelled'].includes(saved)) {
          return saved as any;
        }
      } catch {
        // Fallback cleanly
      }
    }
    return 'all';
  });

  const [timeRangeFilter, setTimeRangeFilter] = useState<'all' | 'today' | 'week' | 'month'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryRange = params.get('range');
        if (queryRange && ['all', 'today', 'week', 'month'].includes(queryRange)) {
          return queryRange as any;
        }
        const saved = localStorage.getItem('amc_receptionist_time_filter');
        if (saved && ['all', 'today', 'week', 'month'].includes(saved)) {
          return saved as any;
        }
      } catch {
        // Fallback cleanly
      }
    }
    return 'all';
  });

  // Keep receptionist filters persisted across reloads and sync to URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('amc_receptionist_status_filter', statusFilter);
        localStorage.setItem('amc_receptionist_time_filter', timeRangeFilter);
        const currentUrl = new URL(window.location.href);
        if (statusFilter !== 'all') {
          currentUrl.searchParams.set('status', statusFilter);
        } else {
          currentUrl.searchParams.delete('status');
        }
        if (timeRangeFilter !== 'all') {
          currentUrl.searchParams.set('range', timeRangeFilter);
        } else {
          currentUrl.searchParams.delete('range');
        }
        window.history.replaceState({}, '', currentUrl.toString());
      } catch (err) {
        console.warn('Could not persist receptionist filter state:', err);
      }
    }
  }, [statusFilter, timeRangeFilter]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmApt, setDeleteConfirmApt] = useState<AppointmentRecord | null>(null);
  const [printingAppointment, setPrintingAppointment] = useState<AppointmentRecord | null>(null);
  const [showSerialPrintModal, setShowSerialPrintModal] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);

  // Direct Print & PDF Download of all patient information and attendance checklist in this card
  const handleDownloadAllSerialsPdf = async () => {
    if (filteredAppointments.length === 0) {
      setToastMessage(isBn ? "প্রিন্ট বা ডাউনলোড করার মতো কোনো সিরিয়াল তথ্য নেই" : "No serial records to print or download");
      return;
    }
    const dateStr = new Date().toISOString().split('T')[0];
    const filterLabel = timeRangeFilter === 'today' ? 'আজকের' : timeRangeFilter === 'week' ? 'এই_সপ্তাহের' : timeRangeFilter === 'month' ? 'এই_মাসের' : 'সকল';
    const docTitle = `আনোয়ারা_মেডিকেল_কমপ্লেক্স_রোগী_সিরিয়াল_${filterLabel}_${dateStr}`;

    // 1. Immediately trigger isolated direct print of ONLY this card/table
    document.body.classList.add('amc-print-active');
    const printSuccess = printElement('receptionist-all-serials-pdf-content', docTitle);
    setTimeout(() => {
      document.body.classList.remove('amc-print-active');
    }, 4000);

    setToastMessage(isBn ? "প্রিন্ট উইন্ডো চালু হয়েছে! শুধুমাত্র নির্বাচিত সিরিয়াল ও উপস্থিতি তালিকা প্রিন্ট হচ্ছে।" : "Print window opened! Only serial & attendance roster is printing.");

    // 2. Also prepare and trigger PDF file download
    setIsDownloadingReport(true);
    try {
      await downloadElementAsPdf('receptionist-all-serials-pdf-content', docTitle, setIsDownloadingReport);
    } catch (err) {
      console.warn("PDF download error (print preview already opened):", err);
    } finally {
      setIsDownloadingReport(false);
    }
  };

  // Direct download all information in this card as real Excel (.xls) & CSV with Attendance Checkbox
  const handleDownloadAllSerialsExcel = () => {
    if (filteredAppointments.length === 0) {
      setToastMessage(isBn ? "ডাউনলোড করার মতো কোনো সিরিয়াল তথ্য নেই" : "No serial records to download");
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const filterLabel = timeRangeFilter === 'today' ? 'Today' : timeRangeFilter === 'week' ? 'This_Week' : timeRangeFilter === 'month' ? 'This_Month' : 'All';
    const filename = `Anowara_Medical_Complex_Serials_${filterLabel}_${dateStr}.xls`;

    // Native Microsoft Excel compatible workbook with UTF-8, formatting, and attendance column
    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Patient Serials</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <style>
            table { border-collapse: collapse; width: 100%; font-family: 'Hind Siliguri', Arial, sans-serif; font-size: 11pt; }
            th { background-color: #0E3A53; color: #ffffff; font-weight: bold; border: 1px solid #1B4B68; padding: 10px; text-align: left; }
            td { border: 1px solid #d1d5db; padding: 8px 10px; }
            .title { font-size: 16pt; font-weight: bold; color: #0E3A53; text-align: center; }
            .subtitle { font-size: 11pt; color: #4b5563; text-align: center; }
            .status-confirmed { background-color: #d1fae5; color: #065f46; font-weight: bold; }
            .status-pending { background-color: #fef3c7; color: #92400e; font-weight: bold; }
            .status-attended { background-color: #f3f4f6; color: #374151; font-weight: bold; }
          </style>
        </head>
        <body>
          <table>
            <tr>
              <td colspan="11" class="title">আনোয়ারা মেডিকেল কমপ্লেক্স (Anowara Medical Complex)</td>
            </tr>
            <tr>
              <td colspan="11" class="subtitle">দৈনিক রোগী সিরিয়াল ও উপস্থিতি শিট | পলাশ, নরসিংদী | তারিখ: ${dateStr} | মোট সিরিয়াল: ${filteredAppointments.length} জন</td>
            </tr>
            <tr><td colspan="11"></td></tr>
            <tr>
              <th style="width: 50px; text-align: center;">ক্রমিক</th>
              <th style="width: 100px;">টোকেন আইডি</th>
              <th style="width: 180px;">রোগীর নাম</th>
              <th style="width: 70px;">বয়স</th>
              <th style="width: 70px;">লিঙ্গ</th>
              <th style="width: 130px;">মোবাইল নম্বর</th>
              <th style="width: 200px;">নির্ধারিত ডাক্তার</th>
              <th style="width: 140px;">সিরিয়াল সময়</th>
              <th style="width: 100px; text-align: center;">বর্তমান অবস্থা</th>
              <th style="width: 160px; text-align: center;">উপস্থিতি (আসলো কি না)</th>
              <th style="width: 200px;">নোট / মন্তব্য</th>
            </tr>
            ${filteredAppointments.map((apt, index) => {
              const statusClass = apt.status === 'confirmed' ? 'status-confirmed' : apt.status === 'attended' ? 'status-attended' : 'status-pending';
              const statusLabel = apt.status === 'confirmed' ? (isBn ? 'নিশ্চিত' : 'Confirmed') : apt.status === 'attended' ? (isBn ? 'সম্পন্ন' : 'Attended') : (isBn ? 'অপেক্ষমান' : 'Pending');
              const attendanceLabel = apt.status === 'attended' ? 'উপস্থিত ছিল (Attended)' : '[  ] আসলো   [  ] আসেনি';
              return `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td style="font-weight: bold; mso-number-format:'\\@';">${apt.token || `TK-${apt.id.substring(0, 6)}`}</td>
                  <td style="font-weight: bold;">${apt.patientName || ''}</td>
                  <td>${apt.age || ''}</td>
                  <td>${apt.gender || ''}</td>
                  <td style="mso-number-format:'\\@';">${apt.phone || ''}</td>
                  <td>${apt.doctor || ''}</td>
                  <td>${apt.createdAt || ''}</td>
                  <td class="${statusClass}" style="text-align: center;">${statusLabel}</td>
                  <td style="text-align: center; font-weight: bold;">${attendanceLabel}</td>
                  <td>${apt.notes || ''}</td>
                </tr>
              `;
            }).join('')}
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

    setToastMessage(isBn ? "সকল তথ্য সরাসরি Excel (.xls) ফাইলে ডাউনলোড হয়েছে!" : "All records downloaded in Excel format!");
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // New serial form state
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    doctor: '',
    age: '',
    gender: 'পুরুষ',
    notes: '',
  });
  const [formError, setFormError] = useState('');

  // Time-period analysis (Today, This Week, This Month, and >30 Days)
  const timeStats = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const isToday = (apt: AppointmentRecord) => {
      if (apt.timestamp) return apt.timestamp >= startOfToday;
      if (apt.createdAt && (apt.createdAt.includes('আজ') || apt.createdAt.includes('Today'))) return true;
      const todayFormatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
      return apt.createdAt?.includes(todayFormatted) ?? false;
    };

    const isThisWeek = (apt: AppointmentRecord) => {
      if (apt.timestamp) return apt.timestamp >= sevenDaysAgo;
      return isToday(apt);
    };

    const isThisMonth = (apt: AppointmentRecord) => {
      if (apt.timestamp) return apt.timestamp >= startOfMonth;
      return isThisWeek(apt);
    };

    const isOlderThan30Days = (apt: AppointmentRecord) => {
      if (apt.timestamp) return apt.timestamp < thirtyDaysAgo;
      const idTime = parseInt(apt.id.replace('apt-', ''), 10);
      if (!isNaN(idTime) && idTime > 1000000000000) return idTime < thirtyDaysAgo;
      return false;
    };

    const todayApts = appointments.filter(isToday);
    const weekApts = appointments.filter(isThisWeek);
    const monthApts = appointments.filter(isThisMonth);
    const olderThan30DaysApts = appointments.filter(isOlderThan30Days);

    return {
      todayCount: todayApts.length,
      todayApts,
      weekCount: weekApts.length,
      weekApts,
      monthCount: monthApts.length,
      monthApts,
      olderThan30DaysCount: olderThan30DaysApts.length,
      isToday,
      isThisWeek,
      isThisMonth,
      isOlderThan30Days,
    };
  }, [appointments]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const name = apt.patientName.toLowerCase();
      const phone = apt.phone.toLowerCase();
      const token = apt.token.toLowerCase();
      const doctor = apt.doctor.toLowerCase();
      const orderNum = (apt.orderNumber || '').toLowerCase();
      const q = searchQuery.trim().toLowerCase();

      const matchesSearch = !q || name.includes(q) || phone.includes(q) || token.includes(q) || doctor.includes(q) || orderNum.includes(q);
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

      const matchesTime = 
        timeRangeFilter === 'all' ? true :
        timeRangeFilter === 'today' ? timeStats.isToday(apt) :
        timeRangeFilter === 'week' ? timeStats.isThisWeek(apt) :
        timeRangeFilter === 'month' ? timeStats.isThisMonth(apt) : true;

      return matchesSearch && matchesStatus && matchesTime;
    });
  }, [appointments, searchQuery, statusFilter, timeRangeFilter, timeStats]);

  // Statistics
  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const attended = appointments.filter(a => a.status === 'attended').length;
    return { total, pending, confirmed, attended };
  }, [appointments]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;
    setIsLoggingIn(true);
    setLoginError('');

    const res = await loginReceptionist(username, password);
    setIsLoggingIn(false);

    if (!res.success) {
      setLoginError(res.error || (isBn ? 'ভুল ইউজারনেম বা পাসওয়ার্ড!' : 'Invalid credentials'));
      const lock = checkLockoutStatus('receptionist');
      if (lock.isLocked) {
        setLockoutRemaining(lock.remainingSeconds);
      }
    } else {
      setLoginError('');
      setUsername('');
      setPassword('');
    }
  };

  const handleAddSerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name.trim() || !newPatient.phone.trim()) {
      setFormError(isBn ? 'রোগীর নাম ও মোবাইল নম্বর আবশ্যক।' : 'Name and phone are required.');
      return;
    }
    setFormError('');

    addAppointment({
      patientName: newPatient.name.trim(),
      phone: newPatient.phone.trim(),
      doctor: newPatient.doctor || (doctors[0]?.name ? `${doctors[0].name} (${doctors[0].specialty})` : 'সাধারণ'),
      age: newPatient.age.trim(),
      gender: newPatient.gender,
      notes: newPatient.notes.trim(),
    });

    setToastMessage(isBn ? `রোগী "${newPatient.name.trim()}" এর সিরিয়াল সফলভাবে যোগ করা হয়েছে!` : `Serial for "${newPatient.name.trim()}" added successfully!`);

    setNewPatient({
      name: '',
      phone: '',
      doctor: '',
      age: '',
      gender: 'পুরুষ',
      notes: '',
    });
    setIsAddModalOpen(false);
  };

  // If NOT logged in, show login screen
  if (!isReceptionistLoggedIn) {
    return (
      <div id="receptionist-login-page" className="min-h-screen bg-[#F8FAFB]">
        <PageBanner
          title={isBn ? "রিসেপশনিস্ট লগইন" : "Receptionist Portal Login"}
          subtitle={isBn ? "সিরিয়াল বুকিং ব্যবস্থাপনা ও রোগী তালিকা নিয়ন্ত্রণ প্যানেল" : "Hospital patient serial and queue management terminal"}
          icon={Lock}
          badge={isBn ? "রিসেপশন পোর্টাল" : "Reception Desk"}
          currentPageName={isBn ? "রিসেপশনিস্ট লগইন" : "Reception Login"}
          onNavigateHome={onNavigateHome}
        />

        <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm relative overflow-hidden">
            {/* Top Security Banner */}
            <div className="flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold py-1.5 px-3 rounded-full mb-5 mx-auto w-fit border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? "SHA-256 এনক্রিপশন ও ব্রুট-ফোর্স হ্যাক প্রোটেকশন সক্রিয়" : "SHA-256 Hashed & Brute-Force Protected"}</span>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-[#E7F2F8] text-[#2D8FC1] flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Users className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-center text-[#0E3A53] mb-1">
              {isBn ? "রিসেপশন ডেস্কে প্রবেশ করুন" : "Receptionist Sign In"}
            </h2>
            <p className="text-xs text-center text-gray-500 mb-5">
              {isBn ? "আপনার নির্ধারিত ইউজারনেম ও পাসওয়ার্ড ব্যবহার করুন" : "Authorized personnel credentials required"}
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
                  placeholder="reception"
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
                  <span>{isBn ? "ড্যাশবোর্ডে লগইন করুন" : "Access Dashboard"}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD VIEW
  return (
    <div id="receptionist-dashboard-page" className="min-h-screen bg-[#F8FAFB]">
      <PageBanner
        title={isBn ? "রিসেপশনিস্ট ড্যাশবোর্ড" : "Receptionist Dashboard"}
        subtitle={isBn 
          ? "রোগীদের দেওয়া সিরিয়ালের সময় ও তথ্য পর্যবেক্ষণ, যাচাই এবং নতুন সিরিয়াল এন্ট্রি প্যানেল" 
          : "Live serial tracking, patient contact log, time slot assignment & queue management"}
        icon={Users}
        badge={isBn ? "রিসেপশন ম্যানেজমেন্ট" : "Reception Queue"}
        currentPageName={isBn ? "রিসেপশনিস্ট ড্যাশবোর্ড" : "Reception Dashboard"}
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Top Control Bar: Receptionist info & Actions */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base text-[#0E3A53]">
                  {isBn ? "রিসেপশন টার্মিনাল সক্রিয়" : "Receptionist Terminal Active"}
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Online
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  isFirebaseConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {isFirebaseConnected 
                    ? (isBn ? "লাইভ ফায়ারবেস ডেটাবেজ" : "Live Firestore Sync")
                    : (isBn ? "ফায়ারবেস প্রস্তুত" : "Firebase Ready")}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {isBn ? "সিরিয়াল ও রোগী উপস্থিতি পর্যবেক্ষণ প্যানেল" : "Queue & patient tracking"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Bulk Delete >30 Days button */}
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer"
              title={isBn ? "৩০ দিনের পুরোনো সকল সিরিয়াল ডেটাবেজ থেকে মুছে ফেলুন" : "Delete serials older than 30 days from database"}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>{isBn ? `৩০ দিনের পুরাতন মুছুন (${timeStats.olderThan30DaysCount})` : `Delete >30 Days (${timeStats.olderThan30DaysCount})`}</span>
            </button>


            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? "অ্যাডমিন নিয়ন্ত্রিত পাসওয়ার্ড" : "Admin-Managed Password"}</span>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#2D8FC1] hover:bg-[#23749D] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? "নতুন সিরিয়াল যুক্ত করুন" : "Add Patient Serial"}</span>
            </button>
            <button
              onClick={logoutReceptionist}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isBn ? "লগআউট" : "Logout"}</span>
            </button>
          </div>
        </div>

        {/* Patient Count Period Statistics Cards (Today / This Week / This Month / Total) */}
        <div className="bg-gradient-to-r from-[#0E3A53] to-[#174D6C] rounded-3xl p-5 text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-white/15">
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2 text-white">
                <Calendar className="w-4 h-4 text-[#C9973B]" />
                <span>{isBn ? "রোগী ও সিরিয়াল পরিসংখ্যান (কে কে সিরিয়াল দিয়েছে দেখতে ক্লিক করুন)" : "Patient Serial Analytics & Period Breakdown"}</span>
              </h3>
              <p className="text-xs text-white/70">
                {isBn ? "আজ, এই সপ্তাহ বা এই মাসে কে কে সিরিয়াল দিয়েছেন তাদের তালিকা দেখতে নিচের কার্ডে ক্লিক করুন" : "Click any period card below to view detailed patient list for today, week, or month"}
              </p>
            </div>
            <span className="text-[11px] bg-white/10 px-3 py-1 rounded-full text-white/90 border border-white/20 self-start sm:self-auto">
              {isBn ? "লাইভ ডাটাবেজ আপডেট" : "Live Real-Time Sync"}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. TODAY'S PATIENTS */}
            <button
              onClick={() => setTimeRangeFilter(timeRangeFilter === 'today' ? 'all' : 'today')}
              className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                timeRangeFilter === 'today'
                  ? 'bg-white text-[#0E3A53] shadow-lg border-white ring-2 ring-[#C9973B]'
                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${timeRangeFilter === 'today' ? 'text-[#0E3A53]' : 'text-white/80'}`}>
                  {isBn ? "আজকের সিরিয়াল" : "Today's Serials"}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${timeRangeFilter === 'today' ? 'bg-[#0E3A53] text-white' : 'bg-[#C9973B] text-[#0A2A3D]'}`}>
                  {isBn ? "আজ" : "Today"}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${timeRangeFilter === 'today' ? 'text-[#0E3A53]' : 'text-white'}`}>
                  {timeStats.todayCount}
                </span>
                <span className={`text-xs ${timeRangeFilter === 'today' ? 'text-gray-600' : 'text-white/70'}`}>
                  {isBn ? "জন রোগী" : "patients"}
                </span>
              </div>
              <span className={`text-[10px] block mt-1 ${timeRangeFilter === 'today' ? 'text-[#2D8FC1] font-bold' : 'text-white/60'}`}>
                {timeRangeFilter === 'today' ? (isBn ? '✓ ফিল্টার সক্রিয়' : '✓ Active Filter') : (isBn ? 'তালিকা দেখতে ক্লিক করুন' : 'Click to filter')}
              </span>
            </button>

            {/* 2. THIS WEEK'S PATIENTS */}
            <button
              onClick={() => setTimeRangeFilter(timeRangeFilter === 'week' ? 'all' : 'week')}
              className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                timeRangeFilter === 'week'
                  ? 'bg-white text-[#0E3A53] shadow-lg border-white ring-2 ring-[#C9973B]'
                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${timeRangeFilter === 'week' ? 'text-[#0E3A53]' : 'text-white/80'}`}>
                  {isBn ? "এই সপ্তাহের সিরিয়াল" : "This Week's Serials"}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${timeRangeFilter === 'week' ? 'bg-[#0E3A53] text-white' : 'bg-white/20 text-white'}`}>
                  7 {isBn ? "দিন" : "Days"}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${timeRangeFilter === 'week' ? 'text-[#0E3A53]' : 'text-white'}`}>
                  {timeStats.weekCount}
                </span>
                <span className={`text-xs ${timeRangeFilter === 'week' ? 'text-gray-600' : 'text-white/70'}`}>
                  {isBn ? "জন রোগী" : "patients"}
                </span>
              </div>
              <span className={`text-[10px] block mt-1 ${timeRangeFilter === 'week' ? 'text-[#2D8FC1] font-bold' : 'text-white/60'}`}>
                {timeRangeFilter === 'week' ? (isBn ? '✓ ফিল্টার সক্রিয়' : '✓ Active Filter') : (isBn ? 'তালিকা দেখতে ক্লিক করুন' : 'Click to filter')}
              </span>
            </button>

            {/* 3. THIS MONTH'S PATIENTS */}
            <button
              onClick={() => setTimeRangeFilter(timeRangeFilter === 'month' ? 'all' : 'month')}
              className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                timeRangeFilter === 'month'
                  ? 'bg-white text-[#0E3A53] shadow-lg border-white ring-2 ring-[#C9973B]'
                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${timeRangeFilter === 'month' ? 'text-[#0E3A53]' : 'text-white/80'}`}>
                  {isBn ? "এই মাসের সিরিয়াল" : "This Month's Serials"}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${timeRangeFilter === 'month' ? 'bg-[#0E3A53] text-white' : 'bg-white/20 text-white'}`}>
                  {isBn ? "চলতি মাস" : "Month"}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${timeRangeFilter === 'month' ? 'text-[#0E3A53]' : 'text-white'}`}>
                  {timeStats.monthCount}
                </span>
                <span className={`text-xs ${timeRangeFilter === 'month' ? 'text-gray-600' : 'text-white/70'}`}>
                  {isBn ? "জন রোগী" : "patients"}
                </span>
              </div>
              <span className={`text-[10px] block mt-1 ${timeRangeFilter === 'month' ? 'text-[#2D8FC1] font-bold' : 'text-white/60'}`}>
                {timeRangeFilter === 'month' ? (isBn ? '✓ ফিল্টার সক্রিয়' : '✓ Active Filter') : (isBn ? 'তালিকা দেখতে ক্লিক করুন' : 'Click to filter')}
              </span>
            </button>

            {/* 4. TOTAL LIFETIME PATIENTS */}
            <button
              onClick={() => setTimeRangeFilter('all')}
              className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                timeRangeFilter === 'all'
                  ? 'bg-white text-[#0E3A53] shadow-lg border-white ring-2 ring-[#C9973B]'
                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${timeRangeFilter === 'all' ? 'text-[#0E3A53]' : 'text-white/80'}`}>
                  {isBn ? "মোট নিবন্ধিত সিরিয়াল" : "Total All-Time"}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${timeRangeFilter === 'all' ? 'bg-[#0E3A53] text-white' : 'bg-white/20 text-white'}`}>
                  {isBn ? "সর্বমোট" : "Total"}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${timeRangeFilter === 'all' ? 'text-[#0E3A53]' : 'text-white'}`}>
                  {appointments.length}
                </span>
                <span className={`text-xs ${timeRangeFilter === 'all' ? 'text-gray-600' : 'text-white/70'}`}>
                  {isBn ? "জন রোগী" : "records"}
                </span>
              </div>
              <span className={`text-[10px] block mt-1 ${timeRangeFilter === 'all' ? 'text-[#2D8FC1] font-bold' : 'text-white/60'}`}>
                {timeRangeFilter === 'all' ? (isBn ? '✓ সকল সিরিয়াল প্রদর্শিত' : '✓ Showing All') : (isBn ? 'সব দেখতে ক্লিক করুন' : 'View all')}
              </span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? "রোগীর নাম, ফোন নম্বর, টোকেন বা ডাক্তার দিয়ে খুঁজুন..." : "Search by patient name, phone, token..."}
                className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter pills - smooth scrolling on mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  statusFilter === 'all' ? 'bg-[#0E3A53] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isBn ? 'সকল' : 'All'} ({appointments.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isBn ? 'অপেক্ষমান' : 'Pending'} ({stats.pending})
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  statusFilter === 'confirmed' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isBn ? 'নিশ্চিতকৃত' : 'Confirmed'} ({stats.confirmed})
              </button>
              <button
                onClick={() => setStatusFilter('attended')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  statusFilter === 'attended' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isBn ? 'সম্পন্ন' : 'Attended'} ({stats.attended})
              </button>
            </div>
          </div>
        </div>

        {/* Serials Container - Responsive: Cards on Mobile, Table on Desktop */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-[#0E3A53] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#2D8FC1]" />
                <span>{isBn ? "সিরিয়াল তালিকা ও সময়সূচী" : "Active Patient Serial Queue"}</span>
              </h3>
              <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-2.5 py-1 rounded-full">
                {filteredAppointments.length} {isBn ? "টি সিরিয়াল" : "records"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* PRIMARY PRINT & DOWNLOAD BUTTON: Prints & downloads all information of this card */}
              <button
                id="download-all-div-info-btn"
                onClick={handleDownloadAllSerialsPdf}
                disabled={isDownloadingReport}
                className="inline-flex items-center gap-1.5 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 active:scale-95 border border-white/20"
                title={isBn ? "এই কার্ডের সকল রোগীর তথ্য ও উপস্থিতি চেকলিস্ট সরাসরি প্রিন্ট ও ডাউনলোড করুন" : "Print and download all patient serials & attendance checklist"}
              >
                {isDownloadingReport ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                ) : (
                  <Printer className="w-3.5 h-3.5 text-[#C9973B]" />
                )}
                <span>
                  {isDownloadingReport
                    ? (isBn ? "প্রস্তুত হচ্ছে..." : "Preparing...")
                    : (isBn ? "সকল তথ্য প্রিন্ট ও ডাউনলোড" : "Print & Download All Info")}
                </span>
              </button>

              {/* CSV / EXCEL DOWNLOAD BUTTON */}
              <button
                onClick={handleDownloadAllSerialsExcel}
                className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer active:scale-95 shadow-2xs"
                title={isBn ? "সকল তথ্য সরাসরি Excel (.xls) ফাইলে ডাউনলোড করুন" : "Download records directly in Excel (.xls) format"}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isBn ? "Excel স্প্রেডশীট" : "Excel Spreadsheet"}</span>
              </button>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">{isBn ? "কোনো সিরিয়াল পাওয়া যায়নি" : "No serials found"}</p>
              <p className="text-xs text-gray-400 mt-1">{isBn ? "অনুসন্ধান ফিল্টার পরিবর্তন করুন" : "Try changing search filter"}</p>
            </div>
          ) : (
            <>
              {/* MOBILE VIEW (Screen < md): Beautiful, Non-squished Cards */}
              <div className="block md:hidden divide-y divide-gray-100">
                {filteredAppointments.map((apt) => (
                  <div key={`mob-${apt.id}`} className="p-4 space-y-3 hover:bg-blue-50/20 transition">
                    {/* Header Row: Token + Status Select */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-[#0E3A53] text-white px-2.5 py-1 rounded-lg">
                          {apt.token}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {apt.createdAt}
                        </span>
                      </div>

                      {/* Status select for mobile */}
                      <select
                        value={apt.status}
                        onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as any)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : apt.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : apt.status === 'attended'
                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                            : 'bg-red-50 text-red-700 border-red-300'
                        }`}
                      >
                        <option value="pending">অপেক্ষমান (Pending)</option>
                        <option value="confirmed">নিশ্চিত (Confirmed)</option>
                        <option value="attended">সম্পন্ন (Attended)</option>
                        <option value="cancelled">বাতিল (Cancelled)</option>
                      </select>
                    </div>

                    {/* Patient Name & Details */}
                    <div>
                      <h4 className="text-sm font-bold text-[#0E3A53]">{apt.patientName}</h4>
                      {(apt.age || apt.gender) && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {apt.age ? `${apt.age} বছর` : ''} {apt.gender ? `• ${apt.gender}` : ''}
                        </p>
                      )}
                      {apt.notes && (
                        <p className="text-xs text-amber-900 bg-amber-50/80 border border-amber-200/60 rounded-xl p-2 mt-1.5 italic">
                          "{apt.notes}"
                        </p>
                      )}
                    </div>

                    {/* Doctor Info */}
                    <div className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-xl">
                      <Stethoscope className="w-4 h-4 text-[#2D8FC1] shrink-0" />
                      <span className="font-medium line-clamp-1">{apt.doctor}</span>
                    </div>

                    {/* Mobile Action Buttons: Call & Delete */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${apt.phone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{apt.phone}</span>
                      </a>
                      <button
                        onClick={() => setDeleteConfirmApt(apt)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                        title="সিরিয়াল বাতিল বা মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP VIEW (Screen >= md): Comprehensive Full Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100 text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">টোকেন</th>
                      <th className="py-3.5 px-4">রোগীর তথ্য</th>
                      <th className="py-3.5 px-4">মোবাইল নম্বর</th>
                      <th className="py-3.5 px-4">ডাক্তার</th>
                      <th className="py-3.5 px-4">সিরিয়াল দেওয়ার সময়</th>
                      <th className="py-3.5 px-4">স্ট্যাটাস</th>
                      <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-blue-50/30 transition">
                        {/* Token */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0E3A53]">
                          <span className="bg-[#E7F2F8] text-[#0E3A53] px-2 py-1 rounded-md border border-[#2D8FC1]/20">
                            {apt.token}
                          </span>
                        </td>

                        {/* Patient info */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#0E3A53] block text-xs sm:text-sm">
                            {apt.patientName}
                          </span>
                          {(apt.age || apt.gender) && (
                            <span className="text-[11px] text-gray-500">
                              {apt.age ? `${apt.age} বছর` : ''} {apt.gender ? `• ${apt.gender}` : ''}
                            </span>
                          )}
                          {apt.notes && (
                            <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 italic">
                              "{apt.notes}"
                            </p>
                          )}
                        </td>

                        {/* Phone */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <a
                            href={`tel:${apt.phone}`}
                            className="inline-flex items-center gap-1.5 font-semibold text-[#0E3A53] hover:text-[#2D8FC1] bg-gray-100 hover:bg-[#E7F2F8] px-2.5 py-1 rounded-lg transition"
                            title="সরাসরি কল দিন"
                          >
                            <Phone className="w-3 h-3 text-[#C9973B]" />
                            <span>{apt.phone}</span>
                          </a>
                        </td>

                        {/* Doctor */}
                        <td className="py-3.5 px-4 text-gray-700 max-w-[200px] truncate">
                          {apt.doctor}
                        </td>

                        {/* Booking Time */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {apt.createdAt}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={apt.status}
                            onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as any)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : apt.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : apt.status === 'attended'
                                ? 'bg-gray-100 text-gray-700 border-gray-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            <option value="pending">অপেক্ষমান (Pending)</option>
                            <option value="confirmed">নিশ্চিত (Confirmed)</option>
                            <option value="attended">সম্পন্ন (Attended)</option>
                            <option value="cancelled">বাতিল (Cancelled)</option>
                          </select>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Receptionist Print Slip Button */}
                            <button
                              type="button"
                              onClick={() => setPrintingAppointment(apt)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-[#0E3A53] hover:bg-blue-100 border border-blue-200 transition font-bold text-[11px] cursor-pointer"
                              title="অফিশিয়াল টোকেন ও স্লিপ প্রিন্ট করুন"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#2D8FC1]" />
                              <span>{isBn ? "প্রিন্ট" : "Print"}</span>
                            </button>

                            <a
                              href={`tel:${apt.phone}`}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                              title="রোগীকে কল করুন"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => setDeleteConfirmApt(apt)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                              title="সিরিয়াল মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL 1: Add New Serial */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-xl my-auto animate-fadeIn">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-bold text-base text-[#0E3A53] mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#2D8FC1]" />
              <span>{isBn ? "নতুন রোগীর সিরিয়াল এন্ট্রি" : "Add Patient Serial"}</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {isBn ? "সরাসরি চেম্বারে আসা বা ফোনে চাওয়া সিরিয়াল যুক্ত করুন" : "Direct walk-in or telephone serial registry"}
            </p>

            {formError && (
              <div className="mb-3 p-2.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSerial} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isBn ? "রোগীর পুরো নাম *" : "Patient Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  placeholder="যেমন: মোঃ কামরুল ইসলাম"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isBn ? "মোবাইল নম্বর *" : "Mobile Number *"}
                </label>
                <input
                  type="tel"
                  required
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "বয়স" : "Age"}
                  </label>
                  <input
                    type="text"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    placeholder="যেমন: ৩২"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "লিঙ্গ" : "Gender"}
                  </label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  >
                    <option value="পুরুষ">পুরুষ</option>
                    <option value="মহিলা">মহিলা</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isBn ? "কাঙ্ক্ষিত ডাক্তার" : "Doctor"}
                </label>
                <select
                  value={newPatient.doctor}
                  onChange={(e) => setNewPatient({ ...newPatient, doctor: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                >
                  <option value="">সাধারণ (যেকোনো বিশেষজ্ঞ)</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={`${d.name} (${d.specialty})`}>
                      {d.name} — {d.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isBn ? "সমস্যা বা নোট" : "Notes / Symptoms"}
                </label>
                <textarea
                  rows={2}
                  value={newPatient.notes}
                  onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })}
                  placeholder="যেমন: ২ দিন ধরে তীব্র পেটে ব্যথা..."
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold transition cursor-pointer"
                >
                  {isBn ? "সিরিয়াল নিশ্চিত করুন" : "Confirm Serial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE CONFIRMATION */}
      {deleteConfirmApt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-[#0E3A53] mb-1">
              {isBn ? "সিরিয়াল মুছে ফেলার নিশ্চিতকরণ" : "Confirm Serial Deletion"}
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              {isBn ? "আপনি কি নিশ্চিতভাবে নিম্নের রোগীর সিরিয়াল তালিকা থেকে মুছে ফেলতে চান?" : "Are you sure you want to permanently remove this serial?"}
            </p>
            <div className="bg-red-50/70 border border-red-200/70 rounded-xl p-3 mb-5 text-left text-xs">
              <p className="font-bold text-red-950">রোগী: {deleteConfirmApt.patientName}</p>
              <p className="text-gray-600 mt-1">টোকেন: <span className="font-mono font-bold text-red-800">{deleteConfirmApt.token}</span></p>
              <p className="text-gray-600">ফোন: {deleteConfirmApt.phone}</p>
              <p className="text-gray-600">ডাক্তার: {deleteConfirmApt.doctor}</p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmApt(null)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                {isBn ? "বাতিল করুন" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  removeAppointment(deleteConfirmApt.id);
                  setToastMessage(isBn ? `সিরিয়াল "${deleteConfirmApt.patientName}" সফলভাবে মুছে ফেলা হয়েছে!` : `Serial removed successfully!`);
                  setDeleteConfirmApt(null);
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition cursor-pointer shadow-md"
              >
                {isBn ? "হ্যাঁ, নিশ্চিত মুছুন" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Confirm 30-Day Bulk Delete */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-fadeIn text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="font-bold text-lg text-[#0E3A53] mb-2">
              {isBn ? "৩০ দিনের পুরাতন সিরিয়াল মুছবেন?" : "Delete Serials Older Than 30 Days?"}
            </h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              {isBn 
                ? `হাসপাতালের ডাটাবেজ থেকে ৩০ দিনের বেশি পুরোনো সর্বমোট ${timeStats.olderThan30DaysCount} টি সিরিয়াল রেকর্ড স্থায়ীভাবে মুছে ফেলা হবে। বর্তমান চলতি মাসের সিরিয়ালসমূহ নিরাপদ থাকবে।`
                : `A total of ${timeStats.olderThan30DaysCount} appointment records older than 30 days will be permanently removed from the hospital database.`}
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-left text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {isBn 
                  ? "একবার মুছে ফেলা হলে এই পুরাতন সিরিয়ালগুলো আর পুনরুদ্ধার করা যাবে না।" 
                  : "Once deleted, these old records cannot be recovered."}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={isBulkDeleting}
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                {isBn ? "বাতিল করুন" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={isBulkDeleting || timeStats.olderThan30DaysCount === 0}
                onClick={async () => {
                  setIsBulkDeleting(true);
                  try {
                    const count = await deleteAppointmentsOlderThan30Days();
                    setToastMessage(isBn ? `সফলভাবে ৩০ দিনের বেশি পুরোনো ${count} টি সিরিয়াল ডাটাবেজ থেকে মুছে ফেলা হয়েছে!` : `Successfully deleted ${count} serials older than 30 days!`);
                    setIsBulkDeleteModalOpen(false);
                  } catch (err) {
                    setToastMessage(isBn ? 'মুছতে সমস্যা হয়েছে, আবার চেষ্টা করুন।' : 'Failed to delete old records. Please retry.');
                  } finally {
                    setIsBulkDeleting(false);
                  }
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 rounded-xl transition cursor-pointer shadow-md"
              >
                {isBulkDeleting ? (isBn ? "মোছা হচ্ছে..." : "Deleting...") : (isBn ? `হ্যাঁ, মুছুন (${timeStats.olderThan30DaysCount})` : "Confirm Bulk Delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Receptionist Print Slip Modal */}
      {printingAppointment && (
        <AppointmentPrintSlip
          appointment={printingAppointment}
          onClose={() => setPrintingAppointment(null)}
          isBn={isBn}
        />
      )}

      {/* MODAL 5: Full Serial Schedule Print Modal */}
      {showSerialPrintModal && (
        <SerialSchedulePrintModal
          appointments={filteredAppointments}
          onClose={() => setShowSerialPrintModal(false)}
          isBn={isBn}
        />
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

      {/* OFF-SCREEN HIGH-FIDELITY REPORT CONTAINER FOR DIRECT PDF DOWNLOAD & ISOLATED PRINT */}
      <div 
        id="receptionist-print-wrapper"
        style={{ position: 'absolute', left: '-9999px', top: 0, width: '850px', background: '#ffffff', zIndex: -999 }} 
        aria-hidden="true"
      >
        <div id="receptionist-all-serials-pdf-content" className="p-8 bg-white text-gray-800 space-y-4">
          <PrintLetterhead
            documentTitle={
              timeRangeFilter === 'today'
                ? (isBn ? "দৈনিক রোগী সিরিয়াল ও উপস্থিতি নিরীক্ষণ শিট (আজকের সিরিয়াল)" : "Daily Patient Serial & Attendance Checklist (Today)")
                : timeRangeFilter === 'week'
                ? (isBn ? "সাপ্তাহিক রোগী সিরিয়াল ও উপস্থিতি নিরীক্ষণ শিট" : "Weekly Patient Serial & Attendance Checklist")
                : timeRangeFilter === 'month'
                ? (isBn ? "মাসিক রোগী সিরিয়াল ও উপস্থিতি নিরীক্ষণ শিট" : "Monthly Patient Serial & Attendance Checklist")
                : (isBn ? "রোগী সিরিয়াল বুকিং ও উপস্থিতি নিরীক্ষণ শিট (সর্বমোট)" : "Patient Serial & Attendance Checklist (All)")
            }
            documentSubtitle={
              isBn
                ? `হাসপাতাল রিসেপশন ডেস্ক কপি | মোট সিরিয়াল: ${filteredAppointments.length} জন | আনোয়ারা মেডিকেল কমপ্লেক্স`
                : `Hospital Reception Desk Copy | Total Patients: ${filteredAppointments.length}`
            }
            refNo={`AMC/SERIAL/${new Date().getFullYear()}/${timeRangeFilter.toUpperCase()}`}
            date={new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            isBn={isBn}
          />

          {/* Quick instructions for hospital staff */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl px-4 py-2 text-xs flex items-center justify-between">
            <span className="font-bold text-[#0E3A53]">
              {isBn ? "📋 নির্দেশনা: রোগী চেম্বারে আসার পর 'আসলো' বক্সে টিক দিন এবং অনুপস্থিত থাকলে 'আসেনি' বক্সে মার্ক করুন।" : "📋 Instructions: Tick 'Came' when patient arrives, or mark 'Not Came' if absent."}
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              {isBn ? `ফিল্টার: ${timeRangeFilter === 'today' ? 'আজকের সিরিয়াল' : timeRangeFilter === 'week' ? 'এই সপ্তাহ' : timeRangeFilter === 'month' ? 'চলতি মাস' : 'সকল'}` : `Filter: ${timeRangeFilter}`}
            </span>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-4 gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-center text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-semibold">{isBn ? "মোট তালিকাভুক্ত" : "Total"}</span>
              <span className="font-bold text-gray-900 text-sm">{filteredAppointments.length} জন</span>
            </div>
            <div>
              <span className="text-emerald-600 block text-[10px] uppercase font-semibold">{isBn ? "নিশ্চিতকৃত" : "Confirmed"}</span>
              <span className="font-bold text-emerald-700 text-sm">{filteredAppointments.filter(a => a.status === 'confirmed').length} জন</span>
            </div>
            <div>
              <span className="text-amber-600 block text-[10px] uppercase font-semibold">{isBn ? "অপেক্ষমান" : "Pending"}</span>
              <span className="font-bold text-amber-700 text-sm">{filteredAppointments.filter(a => a.status === 'pending').length} জন</span>
            </div>
            <div>
              <span className="text-blue-600 block text-[10px] uppercase font-semibold">{isBn ? "উপস্থিত / সম্পন্ন" : "Attended"}</span>
              <span className="font-bold text-blue-700 text-sm">{filteredAppointments.filter(a => a.status === 'attended').length} জন</span>
            </div>
          </div>

          {/* Serials Table with All Information & Attendance Verification Column */}
          <table className="w-full text-left border-collapse text-xs border border-gray-300">
            <thead>
              <tr className="bg-[#0E3A53] text-white font-bold text-[11px]">
                <th className="py-2.5 px-2 text-center w-8 border border-[#1B4B68]">#</th>
                <th className="py-2.5 px-2.5 border border-[#1B4B68] w-24">টোকেন নং</th>
                <th className="py-2.5 px-3 border border-[#1B4B68]">রোগীর নাম ও বিবরণ</th>
                <th className="py-2.5 px-2.5 border border-[#1B4B68] w-28">মোবাইল নম্বর</th>
                <th className="py-2.5 px-3 border border-[#1B4B68]">নির্ধারিত ডাক্তার</th>
                <th className="py-2.5 px-2 text-center border border-[#1B4B68] w-20">সময়</th>
                <th className="py-2.5 px-2 text-center border border-[#1B4B68] w-20">অবস্থা</th>
                <th className="py-2.5 px-2 text-center border border-[#1B4B68] bg-[#0A2A3D] text-[#C9973B] font-extrabold w-36">
                  উপস্থিতি চেকলিস্ট
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500 italic">
                    {isBn ? "কোনো সিরিয়াল তথ্য পাওয়া যায়নি" : "No serial records available"}
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt, index) => (
                  <tr key={`print-row-${apt.id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/80'}>
                    <td className="py-2 px-2 text-center font-bold text-gray-500 border border-gray-300">{index + 1}</td>
                    <td className="py-2 px-2.5 font-mono font-bold text-[#0E3A53] border border-gray-300">{apt.token}</td>
                    <td className="py-2 px-3 font-semibold text-gray-900 border border-gray-300">
                      <div className="font-bold text-xs">{apt.patientName}</div>
                      {(apt.age || apt.gender) && (
                        <span className="text-[10px] text-gray-600 font-normal">
                          {apt.age ? `${apt.age} বছর ` : ''}{apt.gender || ''}
                        </span>
                      )}
                      {apt.notes && (
                        <p className="text-[9.5px] text-gray-500 italic font-normal mt-0.5">সমস্যা: "{apt.notes}"</p>
                      )}
                    </td>
                    <td className="py-2 px-2.5 font-mono text-gray-800 border border-gray-300 font-semibold">{apt.phone}</td>
                    <td className="py-2 px-3 text-gray-800 border border-gray-300 font-medium">{apt.doctor}</td>
                    <td className="py-2 px-2 text-center text-gray-600 border border-gray-300 text-[10px]">{apt.createdAt}</td>
                    <td className="py-2 px-2 text-center border border-gray-300 font-bold text-[10px]">
                      <span className={`inline-block px-1.5 py-0.5 rounded ${
                        apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        apt.status === 'attended' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {apt.status === 'confirmed' ? 'নিশ্চিত' : apt.status === 'attended' ? 'সম্পন্ন' : 'অপেক্ষমান'}
                      </span>
                    </td>
                    {/* Attendance Verification Box for Physical Tick Off */}
                    <td className="py-2 px-2 text-center border border-gray-300 bg-amber-50/20">
                      <div className="flex items-center justify-center gap-1.5 text-[10.5px] font-bold">
                        <span className={`inline-flex items-center gap-1 border rounded px-1.5 py-0.5 ${
                          apt.status === 'attended' 
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                            : 'border-gray-400 bg-white text-gray-800'
                        }`}>
                          <span className={`w-3.5 h-3.5 border rounded-xs inline-flex items-center justify-center text-[10px] ${
                            apt.status === 'attended' ? 'border-emerald-700 bg-emerald-600 text-white font-black' : 'border-gray-500'
                          }`}>
                            {apt.status === 'attended' ? '✓' : ''}
                          </span>
                          <span>আসলো</span>
                        </span>
                        <span className="inline-flex items-center gap-1 border border-gray-300 rounded px-1.5 py-0.5 bg-white text-gray-500">
                          <span className="w-3.5 h-3.5 border border-gray-400 rounded-xs inline-block"></span>
                          <span>আসেনি</span>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Bottom Attendance Count for Staff Note */}
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-4 text-gray-700">
              <span className="font-bold text-[#0E3A53]">উপস্থিতি সারাংশ:</span>
              <span>মোট সিরিয়াল: <strong className="text-gray-900">{filteredAppointments.length} জন</strong></span>
              <span>উপস্থিত রোগী: <strong className="text-emerald-700">______ জন</strong></span>
              <span>অনুপস্থিত রোগী: <strong className="text-red-700">______ জন</strong></span>
            </div>
            <span className="text-[10px] text-gray-400">রিপোর্ট প্রিন্ট সময়: {new Date().toLocaleTimeString('bn-BD')}</span>
          </div>

          {/* Official Signatures & Seal */}
          <div className="mt-6 pt-5 border-t border-gray-300 flex justify-between items-end text-xs">
            <div className="text-center">
              <div className="w-32 border-b border-gray-500 mb-1"></div>
              <p className="font-bold text-gray-800">রিসেপশনিস্ট / সিরিয়াল ডেস্ক</p>
              <p className="text-[10px] text-gray-500">স্বাক্ষর ও তারিখ</p>
            </div>
            <div className="border border-dashed border-[#C9973B] rounded-xl px-5 py-2 text-center bg-amber-50">
              <span className="text-[11px] font-extrabold text-[#0E3A53] block">আনোয়ারা মেডিকেল কমপ্লেক্স</span>
              <span className="text-[9px] text-emerald-700 font-bold">✓ অফিসিয়াল রোগী সিরিয়াল ও উপস্থিতি তালিকা</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-gray-500 mb-1"></div>
              <p className="font-bold text-gray-800">ডাক্তার / চেম্বার ইনচার্জ</p>
              <p className="text-[10px] text-gray-500">অনুমোদন ও স্বাক্ষর</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
