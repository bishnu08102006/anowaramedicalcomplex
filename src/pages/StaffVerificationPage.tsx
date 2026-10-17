import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Search,
  AlertTriangle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { HospitalLogo } from '../components/HospitalLogo';

export const StaffVerificationPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { isBn } = useLanguage();
  const { staffList } = useData();

  // Extract ID from URL hash or search params
  const extractIdFromUrl = (): string => {
    try {
      const fullUrl = window.location.href;
      const urlObj = new URL(fullUrl);
      const queryId = urlObj.searchParams.get('id') || 
                      urlObj.searchParams.get('verify') || 
                      urlObj.searchParams.get('staff') || 
                      urlObj.searchParams.get('staffId');
      if (queryId) return queryId.trim();

      const hashParts = window.location.hash.split('?');
      if (hashParts.length > 1) {
        const hashParams = new URLSearchParams(hashParts[1]);
        const hashId = hashParams.get('id') || 
                       hashParams.get('verify') || 
                       hashParams.get('staff') || 
                       hashParams.get('staffId');
        if (hashId) return hashId.trim();
      }

      // Check if hash itself has an id e.g. #verify-staff/AMC-EMP-1001
      const slashParts = window.location.hash.split('/');
      if (slashParts.length > 1 && slashParts[1].startsWith('AMC-')) {
        return slashParts[1].trim();
      }
    } catch { /* ignore */ }
    return '';
  };

  const [lookupId, setLookupId] = useState<string>(extractIdFromUrl);
  const [searchInput, setSearchInput] = useState(lookupId);

  useEffect(() => {
    const handleUrlChange = () => {
      const newId = extractIdFromUrl();
      if (newId) {
        setLookupId(newId);
        setSearchInput(newId);
      }
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const verifiedStaff = staffList.find(
    (s) => s.staffId.toLowerCase() === lookupId.toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLookupId(searchInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-3 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Navigation back */}
        <div className="mb-4 flex items-center justify-between print:hidden">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E3A53] hover:text-[#2D8FC1] bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? "হোমপেজে ফিরে যান" : "Return to Homepage"}</span>
          </button>

          <span className="text-[11px] font-bold text-gray-500 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Hospital Registry
          </span>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden">
          {/* Official Top Banner */}
          <div className="bg-gradient-to-r from-[#0E3A53] via-[#134968] to-[#0E3A53] text-white p-6 sm:p-8 text-center relative border-b-4 border-[#C9973B]">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20">
                <HospitalLogo className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide">
              Anoara Medical Complex
            </h1>
            <p className="text-sm text-emerald-300 font-bold mt-0.5">
              আনোয়ারা মেডিকেল কমপ্লেক্স • পলাশ, নরসিংদী
            </p>
            <p className="text-xs text-gray-200 mt-1 max-w-md mx-auto">
              ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী | সরকার অনুমোদিত বেসরকারি হাসপাতাল
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 bg-[#C9973B] text-[#0E3A53] text-xs font-black uppercase px-4 py-1.5 rounded-full shadow-md">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Staff Credential Verification</span>
            </div>
          </div>

          {/* Search Bar for manual lookup if not found */}
          <div className="p-4 bg-slate-50 border-b border-gray-200">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={isBn ? "যাচাইয়ের আইডি নম্বর লিখুন" : "Enter verification ID"}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0"
              >
                {isBn ? "যাচাই করুন" : "Verify"}
              </button>
            </form>
          </div>

          {/* Staff Details or Not Found */}
          {verifiedStaff ? (
            <div id="staff-verified-card" className="p-6 sm:p-8 space-y-6 bg-white">
              {/* Verification record header */}
              <div className="pb-4 border-b-2 border-[#0E3A53] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <HospitalLogo className="w-12 h-12 shrink-0 drop-shadow-xs" />
                  <div>
                    <h3 className="font-bold text-[#0E3A53] text-base sm:text-lg">
                      {isBn ? 'আনোয়ারা মেডিকেল কমপ্লেক্স' : 'Anowara Medical Complex'}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {isBn ? 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী' : 'WAPDA Sadar Road, Medical Morh, Palash, Narsingdi'}
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-[#E7F2F8] text-[#0E3A53] text-xs font-bold px-3 py-1 rounded-full border border-[#2D8FC1]/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2D8FC1]" />
                  <span>{isBn ? 'অফিশিয়াল স্টাফ ভেরিফিকেশন' : 'Official Staff Verification'}</span>
                </div>
              </div>

              {/* Public verification only exposes the minimum details needed to confirm identity. */}
              <div className={`rounded-2xl border-2 p-4 flex items-center gap-3 ${
                verifiedStaff.status === 'active'
                  ? 'bg-emerald-50 border-emerald-500/50'
                  : 'bg-amber-50 border-amber-500/50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-md ${
                    verifiedStaff.status === 'active' ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}>
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm sm:text-base ${
                      verifiedStaff.status === 'active' ? 'text-emerald-950' : 'text-amber-950'
                    }`}>
                      {isBn ? 'স্টাফ পরিচয় যাচাই' : 'Staff identity verified'}
                    </h3>
                    <p className={`text-xs ${
                      verifiedStaff.status === 'active' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {isBn
                        ? 'স্টাফ আইডি ও পরিচয় আনোয়ারা মেডিকেল কমপ্লেক্সের রেকর্ডের সঙ্গে মিলে গেছে।'
                        : 'The staff ID and identity match Anowara Medical Complex records.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Staff Profile Main */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-gray-200">
                <div className="text-center space-y-3">
                  <h2 className="text-xl sm:text-2xl font-black text-[#0E3A53]">
                    {isBn ? verifiedStaff.nameBn : verifiedStaff.name}
                  </h2>

                  <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-xs">
                    <span className="bg-[#2D8FC1]/10 text-[#2D8FC1] font-bold px-3 py-1 rounded-lg">
                      {isBn ? verifiedStaff.designationBn : verifiedStaff.designation}
                    </span>
                    <span className="bg-gray-100 text-gray-700 font-semibold px-2.5 py-1 rounded-lg">
                      {isBn ? verifiedStaff.departmentBn : verifiedStaff.department}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl border p-3 text-center text-sm font-bold ${
                verifiedStaff.status === 'active'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}>
                {verifiedStaff.status === 'active'
                  ? (isBn ? 'বর্তমান অবস্থা: সক্রিয়' : 'Current status: Active')
                  : verifiedStaff.status === 'on_leave'
                    ? (isBn ? 'বর্তমান অবস্থা: ছুটিতে' : 'Current status: On leave')
                    : (isBn ? 'বর্তমান অবস্থা: কর্মরত নন' : 'Current status: No longer employed')}
              </div>

            </div>
          ) : (
            <div className="p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  {isBn ? "কোনো স্টাফ পাওয়া যায়নি" : "No Staff Member Found"}
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  {lookupId 
                    ? (isBn ? `"${lookupId}" আইডি সম্বলিত কোনো কর্মকর্তা বা কর্মচারীর রেকর্ড পাওয়া যায়নি। অনুগ্রহ করে সঠিক আইডি দিয়ে চেষ্টা করুন।` : `No record found for "${lookupId}".`)
                    : (isBn ? "অনুগ্রহ করে কিউআর কোড স্ক্যান করুন অথবা উপরে স্টাফ আইডি প্রদান করুন।" : "Please scan a staff ID QR code or enter an ID above.")}
                </p>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
