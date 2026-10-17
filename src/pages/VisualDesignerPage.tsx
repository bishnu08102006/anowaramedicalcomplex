import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Lock, 
  UserCheck, 
  LogOut, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Layout, 
  Sparkles, 
  Layers, 
  Image as ImageIcon, 
  FileCode, 
  Sliders, 
  Save, 
  RefreshCw, 
  Download, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Database
} from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { VisitingCardDesigner } from '../components/VisitingCardDesigner';
import { DoctorPadWorkspace } from '../components/DoctorPadWorkspace';
import { DoctorLeafletWorkspace } from '../components/DoctorLeafletWorkspace';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

interface VisualDesignerPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: any) => void;
}

export const VisualDesignerPage: React.FC<VisualDesignerPageProps> = ({
  onNavigateHome,
  onNavigate,
}) => {
  const { isBn } = useLanguage();
  const {
    isVisualDesignerLoggedIn,
    visualDesignerUsername,
    loginVisualDesigner,
    logoutVisualDesigner,
    updatePortalUserCredentials,
    portalUsers,
    checkLockoutStatus,
    isFirebaseConnected
  } = useData();

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Password / Credentials change state
  const [isCredModalOpen, setIsCredModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [credMessage, setCredMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingCreds, setIsSavingCreds] = useState(false);

  // Check lockout periodically
  useEffect(() => {
    if (isVisualDesignerLoggedIn) return;
    const lock = checkLockoutStatus('visual_designer');
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
  }, [isVisualDesignerLoggedIn, checkLockoutStatus]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError(isBn ? 'ইউজারনেম ও পাসওয়ার্ড দুটিই পূরণ করুন' : 'Please provide both username and password');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await loginVisualDesigner(username, password);
      if (!res.success) {
        setLoginError(res.error || (isBn ? 'ভুল ইউজারনেম বা পাসওয়ার্ড' : 'Invalid credentials'));
      }
    } catch {
      setLoginError(isBn ? 'লগইনে সমস্যা হয়েছে, আবার চেষ্টা করুন' : 'Login failed, please try again');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUpdateCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    setIsSavingCreds(true);
    setCredMessage(null);

    try {
      const res = await updatePortalUserCredentials('visual_designer', newUsername.trim(), newPassword.trim() || undefined);
      if (res.success) {
        setCredMessage({ type: 'success', text: res.message });
        setTimeout(() => {
          setIsCredModalOpen(false);
          setCredMessage(null);
          setNewPassword('');
        }, 1800);
      } else {
        setCredMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setCredMessage({ type: 'error', text: err?.message || 'Failed to update credentials' });
    } finally {
      setIsSavingCreds(false);
    }
  };

  // 1. RENDER LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isVisualDesignerLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F6F8F7] pb-16">
        <PageBanner
          titleBn="ভিজ্যুয়াল ডিজাইনার পোর্টাল"
          titleEn="Visual Designer Portal"
          subtitleBn="হাসপাতালের ভিজ্যুয়াল গ্রাফিক্স, ডিজাইন অ্যাসেটস ও ইন্টারফেস ওয়ার্কস্পেস"
          subtitleEn="Hospital visual graphics, branding assets & design studio"
          breadcrumbBn="ডিজাইনার লগইন"
          breadcrumbEn="Designer Login"
          onNavigateHome={onNavigateHome}
        />

        <div className="max-w-md mx-auto px-4 -mt-10 relative z-10">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 mx-auto flex items-center justify-center mb-4 border border-purple-100 shadow-inner">
              <Palette className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-center text-[#0E3A53] mb-1">
              {isBn ? "ডিজাইনার লগইন" : "Visual Designer Login"}
            </h2>
            <p className="text-xs text-center text-gray-500 mb-6">
              {isBn 
                ? "ক্রেডেনশিয়াল ফায়ারবেস ক্লাউড ডেটাবেজে সংরক্ষিত থাকে।" 
                : "Credentials securely verified via Firebase Cloud Database."}
            </p>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            {lockoutRemaining > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  {isBn 
                    ? `অ্যাকাউন্ট সাময়িকভাবে লক হয়েছে। আর ${lockoutRemaining} সেকেন্ড অপেক্ষা করুন।` 
                    : `Account locked. Please wait ${lockoutRemaining} seconds.`}
                </span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  {isBn ? "ইউজারনেম / আইডি" : "Username / ID"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="যেমন: designer"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                  />
                  <UserCheck className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  {isBn ? "পাসওয়ার্ড" : "Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
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
                className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold py-2.5 rounded-xl transition shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>{isBn ? "লগইন করুন" : "Secure Login"}</span>
              </button>
            </form>

            {/* Quick credentials hint for admin/dev */}
            <div className="mt-6 pt-4 border-t border-gray-100 bg-gray-50/80 -mx-6 -mb-6 p-4 rounded-b-3xl text-[11px] text-gray-500 flex items-start gap-2">
              <Database className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-700">ডিফল্ট ক্লাউড ক্রেডেনশিয়াল:</span>
                <p className="font-mono text-gray-600">ID: <span className="text-purple-700 font-bold">designer</span> | Pass: <span className="text-purple-700 font-bold">designer123</span></p>
                <p className="text-[10px] text-gray-400 mt-0.5">লগইন করার পর কন্ট্রোল প্যানেল থেকে আইডি বা পাসওয়ার্ড পরিবর্তন করা যাবে।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. RENDER AUTHENTICATED DASHBOARD & DEV CONTAINER
  return (
    <div className="min-h-screen bg-[#F6F8F7] pb-16">
      <PageBanner
        titleBn="ভিজ্যুয়াল ডিজাইনার ওয়ার্কস্পেস"
        titleEn="Visual Designer Studio"
        subtitleBn="হাসপাতালের ডিজিটাল ব্রান্ডিং, গ্রাফিক্স উপাদান ও ভিজ্যুয়াল লেআউট প্ল্যাটফর্ম"
        subtitleEn="Hospital branding assets, vector graphics & visual component studio"
        breadcrumbBn="ভিজ্যুয়াল ডিজাইনার"
        breadcrumbEn="Visual Designer"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 space-y-6">
        {/* Top Status & Controls Header Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-[#0E3A53]">
                  {isBn ? "ভিজ্যুয়াল ডিজাইনার পোর্টাল" : "Visual Designer Studio"}
                </h3>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                  {visualDesignerUsername}
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isBn ? "ফায়ারবেস ক্লাউড কানেক্টেড • লাইভ সিঙ্ক সক্রিয়" : "Firebase Cloud Connected • Real-time Sync"}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setNewUsername(visualDesignerUsername);
                setIsCredModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-600" />
              <span>{isBn ? "আইডি/পাসওয়ার্ড পরিবর্তন" : "Change Credentials"}</span>
            </button>

            <button
              onClick={logoutVisualDesigner}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isBn ? "লগআউট" : "Logout"}</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights / Design Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white p-5 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-purple-200 font-medium">
                {isBn ? "ভিজ্যুয়াল উপাদান" : "Visual Assets"}
              </span>
              <Layers className="w-4 h-4 text-purple-300" />
            </div>
            <div className="text-2xl font-black font-mono">100% Ready</div>
            <p className="text-[11px] text-purple-200 mt-1">
              {isBn ? "কাস্টম সিএসএস ও টেলউইন্ড সাপোর্ট সহ" : "Full Tailwind CSS & Web Components"}
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">
                {isBn ? "ডাটাবেজ স্ট্যাটাস" : "Database Sync"}
              </span>
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black font-mono text-[#0E3A53]">
              {isFirebaseConnected ? 'Active' : 'Offline Mode'}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              {isBn ? "ফায়ারবেস portal_users কালেকশন" : "Firebase portal_users collection"}
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">
                {isBn ? "ডেভ কোড কন্টেইনার" : "Dev Workspace"}
              </span>
              <FileCode className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black font-mono text-[#0E3A53]">Available</div>
            <p className="text-[11px] text-gray-500 mt-1">
              {isBn ? "নিচের ডেভ ডিভে সরাসরি কোড যোগ করুন" : "Insert your custom UI code inside below div"}
            </p>
          </div>
        </div>

        <VisitingCardDesigner />

        <section className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="px-5 pt-5">
            <h2 className="text-lg font-bold text-[#0E3A53]">
              {isBn ? 'ডাক্তার প্যাড জেনারেটর' : 'Doctor Pad Generator'}
            </h2>
          </div>
          <div className="p-3 sm:p-5">
            <DoctorPadWorkspace />
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="px-5 pt-5">
            <h2 className="text-lg font-bold text-[#0E3A53]">
              {isBn ? 'ডাক্তারের লিফলেট জেনারেটর' : 'Doctor Leaflet Generator'}
            </h2>
          </div>
          <div className="p-3 sm:p-5">
            <DoctorLeafletWorkspace />
          </div>
        </section>

        {/* Change Credentials Modal */}
        {isCredModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-200 animate-fadeIn">
              <h3 className="font-bold text-base text-[#0E3A53] mb-1 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-purple-600" />
                <span>{isBn ? "ডিজাইনার আইডি ও পাসওয়ার্ড পরিবর্তন" : "Update Designer Credentials"}</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                {isBn ? "পরিবর্তিত তথ্য সরাসরি ফায়ারবেস ক্লাউড ডেটাবেজে সংরক্ষিত হবে।" : "Updated info will sync to Firebase portal_users."}
              </p>

              {credMessage && (
                <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  credMessage.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {credMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{credMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateCreds} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "নতুন ইউজারনেম / আইডি" : "New Username"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {isBn ? "নতুন পাসওয়ার্ড (পরিবর্তন না করতে চাইলে খালি রাখুন)" : "New Password (leave empty to keep current)"}
                  </label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCredModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition cursor-pointer"
                  >
                    {isBn ? "বাতিল" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingCreds}
                    className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSavingCreds ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{isBn ? "সংরক্ষণ করুন" : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
