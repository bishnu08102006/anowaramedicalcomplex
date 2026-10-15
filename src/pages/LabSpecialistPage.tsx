import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Database,
  Eye,
  EyeOff,
  FlaskConical,
  Lock,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { LabReportWorkspace } from '../components/LabReportWorkspace';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

interface LabSpecialistPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: any) => void;
}

export const LabSpecialistPage: React.FC<LabSpecialistPageProps> = ({ onNavigateHome }) => {
  const { isBn } = useLanguage();
  const { isLabSpecialistLoggedIn, loginLabSpecialist, checkLockoutStatus } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  useEffect(() => {
    if (isLabSpecialistLoggedIn) return;
    const lock = checkLockoutStatus('lab_specialist');
    setLockoutRemaining(lock.remainingSeconds);

    if (lock.remainingSeconds > 0) {
      const timer = setInterval(() => {
        setLockoutRemaining((previous) => {
          if (previous <= 1) {
            clearInterval(timer);
            return 0;
          }
          return previous - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLabSpecialistLoggedIn, checkLockoutStatus]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError(isBn ? 'ইউজারনেম ও পাসওয়ার্ড দুটিই পূরণ করুন' : 'Please provide both username and password');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');
    try {
      const result = await loginLabSpecialist(username, password);
      if (!result.success) {
        setLoginError(result.error || (isBn ? 'ভুল ইউজারনেম বা পাসওয়ার্ড' : 'Invalid credentials'));
      }
    } catch {
      setLoginError(isBn ? 'লগইনে সমস্যা হয়েছে, আবার চেষ্টা করুন' : 'Login failed, please try again');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLabSpecialistLoggedIn) return <LabReportWorkspace />;

  return (
    <div className="min-h-screen bg-[#F6F8F7] pb-16">
      <PageBanner
        titleBn="ল্যাব স্পেশালিস্ট পোর্টাল"
        titleEn="Lab Specialist Portal"
        subtitleBn="হাসপাতালের প্যাথলজি ল্যাব, ডায়াগনস্টিক রিপোর্ট ও নমুনা পরীক্ষা কন্ট্রোল হাব"
        subtitleEn="Pathology lab control desk, diagnostic reports & sample registry"
        breadcrumbBn="ল্যাব লগইন"
        breadcrumbEn="Lab Specialist Login"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-md mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 mx-auto flex items-center justify-center mb-4 border border-teal-100 shadow-inner">
            <FlaskConical className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-center text-[#0E3A53] mb-1">
            {isBn ? 'ল্যাব বিশেষজ্ঞ লগইন' : 'Lab Specialist Login'}
          </h2>
          <p className="text-xs text-center text-gray-500 mb-6">
            {isBn ? 'ক্রেডেনশিয়াল ফায়ারবেস ক্লাউড ডেটাবেজে সংরক্ষিত থাকে।' : 'Credentials securely verified via Firebase Cloud Database.'}
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
                {isBn ? 'ইউজারনেম / আইডি' : 'Username / ID'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="যেমন: labspecialist"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                />
                <UserCheck className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                {isBn ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
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
              className="w-full bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold py-2.5 rounded-xl transition shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{isBn ? 'লগইন করুন' : 'Secure Login'}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 bg-gray-50/80 -mx-6 -mb-6 p-4 rounded-b-3xl text-[11px] text-gray-500 flex items-start gap-2">
            <Database className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-700">ডিফল্ট ক্লাউড ক্রেডেনশিয়াল:</span>
              <p className="font-mono text-gray-600">ID: <span className="text-teal-700 font-bold">labspecialist</span> (or <span className="text-teal-700 font-bold">lab</span>) | Pass: <span className="text-teal-700 font-bold">lab123</span></p>
              <p className="text-[10px] text-gray-400 mt-0.5">লগইন করার পর কন্ট্রোল প্যানেল থেকে আইডি বা পাসওয়ার্ড পরিবর্তন করা যাবে।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
