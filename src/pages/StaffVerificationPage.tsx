import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Droplet, 
  Calendar, 
  Phone, 
  MapPin, 
  Download,
  ArrowLeft, 
  Search, 
  Building2, 
  AlertTriangle,
  CreditCard,
  Loader2,
  Check
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { HospitalLogo } from '../components/HospitalLogo';
import { StaffCardPrintModal } from '../components/StaffCardPrintModal';
import { printElement, downloadElementAsPdf } from '../utils/printHelper';

export const StaffVerificationPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { isBn } = useLanguage();
  const { staffList } = useData();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

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

  const handlePrint = () => {
    if (!verifiedStaff) return;
    const docTitle = `Staff-Verification-${verifiedStaff.staffId}-${verifiedStaff.nameEn || verifiedStaff.name}`;
    printElement('staff-verified-card', docTitle);
    setIsPrintModalOpen(true);
  };

  const handleDownload = async () => {
    if (!verifiedStaff) return;
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      const docTitle = `Staff-Verification-${verifiedStaff.staffId}-${verifiedStaff.nameEn || verifiedStaff.name}`;
      const success = await downloadElementAsPdf('staff-verified-card', docTitle, setIsDownloading);
      if (success) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      } else {
        setIsPrintModalOpen(true);
      }
    } catch (e) {
      console.warn('Direct PDF download error, opening modal:', e);
      setIsPrintModalOpen(true);
    } finally {
      setIsDownloading(false);
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
                  placeholder={isBn ? "স্টাফ আইডি দিয়ে যাচাই করুন (যেমনঃ AMC-EMP-1001)..." : "Enter Staff ID (e.g. AMC-EMP-1001)..."}
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
              {/* Slip Header with Hospital Logo for the downloaded document */}
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

              {/* Authenticity Verified Badge */}
              <div className="bg-emerald-50 border-2 border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-emerald-950">
                      অফিশিয়াল বৈধ কর্মকর্তা / কর্মচারী (Authentic Staff)
                    </h3>
                    <p className="text-xs text-emerald-700">
                      এই পরিচয়পত্রটি আনোয়ারা মেডিকেল কমপ্লেক্সের সেন্ট্রাল এইচআর ডাটাবেজ কর্তৃক সরাসরি যাচাইকৃত ও সক্রিয়।
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Verification Code</span>
                  <span className="font-mono text-xs font-bold text-emerald-900">VERIFIED-SECURE</span>
                </div>
              </div>

              {/* Staff Profile Main */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-gray-200">
                <img
                  src={verifiedStaff.photo}
                  alt={verifiedStaff.name}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-lg shrink-0"
                />

                <div className="text-center sm:text-left space-y-2 flex-1">
                  <div className="inline-flex items-center gap-1.5 bg-[#0E3A53] text-white text-[11px] font-mono font-bold px-3 py-1 rounded-lg">
                    <span>ID:</span>
                    <span className="text-[#C9973B]">{verifiedStaff.staffId}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-[#0E3A53]">
                    {isBn ? verifiedStaff.nameBn : verifiedStaff.name}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    {verifiedStaff.name}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                    <span className="bg-[#2D8FC1]/10 text-[#2D8FC1] font-bold px-3 py-1 rounded-lg">
                      {isBn ? verifiedStaff.designationBn : verifiedStaff.designation}
                    </span>
                    <span className="bg-gray-100 text-gray-700 font-semibold px-2.5 py-1 rounded-lg">
                      {isBn ? verifiedStaff.departmentBn : verifiedStaff.department}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Credential Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Blood Group</span>
                  <span className="font-bold text-sm text-rose-600 flex items-center gap-1 mt-1">
                    <Droplet className="w-3.5 h-3.5 fill-rose-500" />
                    {verifiedStaff.bloodGroup}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Current Status</span>
                  <span className="font-bold text-xs text-emerald-600 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Active Duty
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Valid Until</span>
                  <span className="font-bold text-xs text-gray-800 mt-1 block">
                    {verifiedStaff.validUntil}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Join Date</span>
                  <span className="font-semibold text-xs text-gray-700 mt-1 block">
                    {verifiedStaff.joinDate}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Official Phone</span>
                  <span className="font-semibold text-xs text-[#0E3A53] mt-1 block">
                    {verifiedStaff.phone}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">{isBn ? "রিসেপশন ও হটলাইন" : "Hospital Hotline"}</span>
                  <span className="font-bold text-xs text-emerald-700 mt-1 block">
                    01972-692504 / 01712-692504
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div 
                className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden no-download-capture"
                data-no-capture="true"
              >
                <a
                  href="tel:01972692504"
                  className="inline-flex items-center gap-1.5 text-[#0E3A53] font-bold bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl border border-blue-200 transition"
                >
                  <Phone className="w-4 h-4 text-[#2D8FC1]" />
                  <span>{isBn ? "রিসেপশনে কল করুন: 01972-692504" : "Call Reception: 01972-692504"}</span>
                </a>

                <div className="flex items-center gap-2">
                  {/* PDF Download / Save Button */}
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow disabled:opacity-50 active:scale-95"
                    title={isBn ? "PDF ডাউনলোড বা সেভ করুন" : "Download or Save as PDF"}
                  >
                    {isDownloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : downloadSuccess ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>
                      {isDownloading 
                        ? (isBn ? "ডাউনলোড হচ্ছে..." : "Downloading...") 
                        : downloadSuccess 
                        ? (isBn ? "ডাউনলোড সম্পন্ন!" : "Downloaded!") 
                        : (isBn ? "PDF ডাউনলোড / সেভ" : "Download / Save PDF")}
                    </span>
                  </button>
                </div>
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

              {/* Sample Staff quick buttons */}
              <div className="pt-2">
                <span className="text-[11px] text-gray-400 block mb-2 font-semibold uppercase">যাচাইয়ের নমুনা আইডি:</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {staffList.slice(0, 4).map((s) => (
                    <button
                      key={s.staffId}
                      onClick={() => {
                        setLookupId(s.staffId);
                        setSearchInput(s.staffId);
                      }}
                      className="text-xs bg-gray-100 hover:bg-[#0E3A53] hover:text-white px-3 py-1.5 rounded-lg transition font-mono font-medium text-gray-700 cursor-pointer"
                    >
                      {s.staffId}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Staff Card Print & Download Modal */}
      {isPrintModalOpen && verifiedStaff && (
        <StaffCardPrintModal
          staff={verifiedStaff}
          onClose={() => setIsPrintModalOpen(false)}
          isBn={isBn}
        />
      )}
    </div>
  );
};
