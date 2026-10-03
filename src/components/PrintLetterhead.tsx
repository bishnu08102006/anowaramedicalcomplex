import React from 'react';
import { HospitalLogo } from './HospitalLogo';

interface PrintLetterheadProps {
  documentTitle?: string;
  documentSubtitle?: string;
  refNo?: string;
  date?: string;
  isBn?: boolean;
  centered?: boolean;
  showDottedRefIfEmpty?: boolean;
  hideRefNo?: boolean;
}

export const PrintLetterhead: React.FC<PrintLetterheadProps> = ({
  documentTitle,
  documentSubtitle,
  refNo,
  date,
  isBn = true,
  centered = false,
  showDottedRefIfEmpty = false,
  hideRefNo = false,
}) => {
  const officialLogoUrl = 'https://i.postimg.cc/CKFmQGqw/Gemini-Generated-Image-iby2sziby2sziby2-removebg-preview.png';

  if (centered) {
    return (
      <div className="text-gray-900 pb-2 mb-3">
        {/* Centered Hospital Official Header */}
        <div className="flex flex-col items-center justify-center text-center">
          {/* Hospital Logo */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-1.5 flex items-center justify-center">
            <img
              src={officialLogoUrl}
              alt="Anowara Medical Complex Official Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-xs"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Hospital Name in English (Bold & Elegant) - ONLY Anowara Medical Complex */}
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0E3A53] uppercase leading-tight">
            Anowara Medical Complex
          </h1>

          {/* Hospital Name in Bangla - ONLY আনোয়ারা মেডিকেল কমপ্লেক্স */}
          <h2 className="text-sm sm:text-base font-bold text-gray-700 mt-0.5">
            আনোয়ারা মেডিকেল কমপ্লেক্স
          </h2>

          {/* Location & Contact Information */}
          <p className="text-[11px] sm:text-xs text-gray-600 mt-1 font-medium">
            ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-gray-700 mt-1 font-semibold">
            <span>📞 রিসেপশন: 01972-692504</span>
            <span>•</span>
            <span>📱 কর্তৃপক্ষ: 01712-692504</span>
            <span>•</span>
            <span>🌐 anowaramedicalcomplex.com</span>
          </div>
        </div>

        {/* Clean subtle separator under hospital letterhead contacts */}
        <div className="mt-3 border-b border-gray-300"></div>

        {/* Reference Number and Date Bar (NO dashed border above, no clutter) */}
        {((!hideRefNo && (refNo || showDottedRefIfEmpty)) || date) && (
          <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-gray-800">
            <div>
              {!hideRefNo && refNo ? (
                <span>স্মারক নং: <span className="font-mono font-bold text-[#0E3A53]">{refNo}</span></span>
              ) : !hideRefNo && showDottedRefIfEmpty ? (
                <span>স্মারক নং: ........................</span>
              ) : null}
            </div>
            <div className="ml-auto">
              {date ? (
                <span>তারিখ: <span className="font-bold text-gray-900">{date}</span></span>
              ) : (
                <span>তারিখ: ........................</span>
              )}
            </div>
          </div>
        )}

        {/* Document Title Bar - CLEAN with NO borders sandwiching it */}
        {documentTitle && (
          <div className="mt-3.5 mb-2 text-center">
            <div className="inline-block bg-[#0E3A53] text-white px-6 py-1.5 rounded-lg shadow-xs">
              <h2 className="text-sm sm:text-base font-black tracking-wider uppercase">
                {documentTitle}
              </h2>
            </div>
            {documentSubtitle && (
              <p className="text-xs text-gray-600 mt-1 font-medium">
                {documentSubtitle}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-gray-900 border-b-2 border-[#0E3A53] pb-3.5 mb-4">
      {/* Top Header with Official Logo and Names */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        {/* Left / Center: Logo & Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
            <img
              src={officialLogoUrl}
              alt="Anowara Medical Complex Official Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-xs"
              onError={(e) => {
                // Fallback to vector component if image blocked
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0E3A53] leading-none mb-1">
              আনোয়ারা মেডিকেল কমপ্লেক্স
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-gray-700 tracking-wider uppercase">
              Anowara Medical Complex
            </p>
            <p className="text-[11px] text-gray-600 mt-0.5">
              ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী | ওয়েবসাইট: anowaramedicalcomplex.com
            </p>
          </div>
        </div>

        {/* Right side: Working Hours & Quality seal */}
        <div className="hidden sm:block text-right shrink-0">
          <span className="inline-block bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md mb-1">
            ✓ সরকারি স্বাস্থ্য অধিদপ্তর অনুমোদিত
          </span>
          <p className="text-[10px] text-gray-500 font-semibold">
            OPD ২৪ ঘণ্টা | ল্যাব: প্রতিদিন সকাল ৮:০০ - রাত ১০:০০
          </p>
        </div>
      </div>

      {/* Official Hotlines bar: 1. Reception + Emergency, 2. Hospital Authority, 3. Serial Desk */}
      <div className="mt-2.5 pt-2 border-t border-dashed border-gray-300 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-sky-50 text-[#0E3A53] border border-sky-300 px-2.5 py-0.5 rounded text-[11px] font-bold">
            🏥 রিসেপশন ও জরুরি: 01972-692504
          </span>
          <span className="bg-amber-50 text-[#92400e] border border-amber-300 px-2.5 py-0.5 rounded text-[11px] font-bold">
            🏛️ হাসপাতাল কর্তৃপক্ষ: 01712-692504
          </span>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded text-[11px] font-bold">
            📋 সিরিয়াল ডেস্ক: 01944-874304
          </span>
        </div>

        {date && (
          <span className="text-[11px] text-gray-500 font-semibold">
            তারিখ: {date}
          </span>
        )}
      </div>

      {/* Optional Document Title Bar */}
      {documentTitle && (
        <div className="mt-3 pt-2 text-center border-t border-gray-100">
          <div className="inline-block bg-[#0E3A53] text-white px-5 py-1.5 rounded-lg shadow-xs">
            <h2 className="text-sm sm:text-base font-black tracking-wide">
              {documentTitle}
            </h2>
          </div>
          {documentSubtitle && (
            <p className="text-xs text-gray-600 mt-1 font-medium">
              {documentSubtitle}
            </p>
          )}
          {refNo && (
            <p className="text-[11px] text-gray-500 font-mono mt-0.5">
              স্মারক নং: {refNo}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
