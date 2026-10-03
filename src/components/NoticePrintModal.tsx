import React, { useState } from 'react';
import { Printer, Download, ExternalLink, X, Bell, Calendar, MapPin, AlertCircle, Tag, Info, ShieldCheck, Loader2 } from 'lucide-react';
import { NoticeItem } from '../context/DataContext';
import { printElement, openPrintWindow, downloadElementAsPdf } from '../utils/printHelper';
import { PrintLetterhead } from './PrintLetterhead';

interface NoticePrintModalProps {
  notices: NoticeItem[];
  selectedNotice?: NoticeItem | null;
  onClose: () => void;
  isBn?: boolean;
}

export const NoticePrintModal: React.FC<NoticePrintModalProps> = ({
  notices,
  selectedNotice,
  onClose,
  isBn = true,
}) => {
  const isSingle = !!selectedNotice;
  const displayNotices = selectedNotice ? [selectedNotice] : notices;
  const [isDownloading, setIsDownloading] = useState(false);

  const docTitle = isSingle 
    ? (isBn ? `Notice-${selectedNotice?.id}-${selectedNotice?.title.substring(0, 25)}` : `Notice-${selectedNotice?.id}`) 
    : 'AMC-Notices-Board-Circular';

  const handlePrint = () => {
    printElement('printable-notice-content', docTitle);
  };

  const handleOpenWindow = () => {
    openPrintWindow('printable-notice-content', docTitle);
  };

  const handleDownloadPdf = async () => {
    await downloadElementAsPdf('printable-notice-content', docTitle, setIsDownloading);
  };

  const currentDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const refNumber = isSingle 
    ? `AMC/NOT/${new Date().getFullYear()}/${selectedNotice?.id}` 
    : `AMC/NOT/${new Date().getFullYear()}/BOARD-CIRCULAR`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto printable-modal-backdrop">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 printable-modal-content my-6">
        {/* Screen Controls Bar */}
        <div className="bg-[#0E3A53] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#C9973B]">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base block">
                {isSingle 
                  ? (isBn ? "অফিসিয়াল নোটিশ প্রিন্ট ও ডাউনলোড প্রিভিউ" : "Official Notice Print & Download Preview") 
                  : (isBn ? "নোটিশ বোর্ড পূর্ণাঙ্গ বিজ্ঞপ্তি প্রিন্ট ও ডাউনলোড প্রিভিউ" : "All Notices Circular Print & Download Preview")}
              </span>
              <span className="text-xs text-white/70">
                {isSingle ? (isBn ? selectedNotice.title : selectedNotice.titleEn) : (isBn ? `মোট ${notices.length} টি নোটিশ প্রস্তুত` : `${notices.length} active notices`)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              id="noticeDownloadPdfBtn"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shadow disabled:opacity-50"
              title={isBn ? "সরাসরি PDF ফাইল হিসেবে ডাউনলোড করুন" : "Direct PDF Download"}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isBn ? (isDownloading ? "ডাউনলোড হচ্ছে..." : "PDF ডাউনলোড") : (isDownloading ? "Downloading..." : "Download PDF")}</span>
            </button>

            {/* Direct Print Button */}
            <button
              onClick={handlePrint}
              id="noticeDirectPrintBtn"
              className="bg-[#2D8FC1] hover:bg-[#2378a5] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shadow"
              title={isBn ? "সরাসরি প্রিন্ট ডায়ালগ খুলুন" : "Direct Print"}
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? "প্রিন্ট করুন" : "Print"}</span>
            </button>

            {/* Open in New Window */}
            <button
              onClick={handleOpenWindow}
              id="noticeNewWindowBtn"
              className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              title={isBn ? "নতুন ট্যাবে উইন্ডো ওপেন করুন" : "Open in New Window"}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isBn ? "নতুন উইন্ডো" : "New Window"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-notice-content" className="p-8 sm:p-12 space-y-6 text-gray-800 bg-white min-h-[750px] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Official Hospital Letterhead with Centered PNG Logo */}
            <PrintLetterhead
              documentTitle={isSingle 
                ? (selectedNotice?.badge || (selectedNotice?.type === 'urgent' ? (isBn ? 'জরুরি বিজ্ঞপ্তি' : 'Urgent Notice') : (isBn ? 'সাধারণ বিজ্ঞপ্তি' : 'Official Notice')))
                : (isBn ? "সার্বিক নোটিশ বোর্ড সার্কুলার" : "OFFICIAL NOTICE BOARD BULLETIN")}
              hideRefNo={true}
              date={isSingle ? selectedNotice?.date : currentDate}
              isBn={isBn}
              centered={true}
            />

            {/* Notices Content */}
            {isSingle && selectedNotice ? (
              <div className="space-y-4 pt-1">
                {/* Subject - Clean and uncluttered */}
                <div className="pt-2 pb-1 border-b border-gray-200">
                  <h3 className="font-extrabold text-[#0E3A53] text-base sm:text-lg leading-snug">
                    <span className="text-gray-600 font-medium">{isBn ? "বিষয়: " : "Subject: "}</span>
                    {isBn ? selectedNotice.title : selectedNotice.titleEn}
                  </h3>
                </div>

                {/* Notice Body */}
                <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line text-justify min-h-[220px] font-sans pt-2">
                  {isBn ? selectedNotice.description : selectedNotice.descriptionEn}
                </div>

                {/* Badge Note */}
                {selectedNotice.badge && (
                  <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 text-xs text-gray-800 mt-4">
                    <span className="font-bold text-[#0E3A53]">{isBn ? "বিশেষ জ্ঞাতব্য / নির্দেশিকা: " : "Special Notice / Note: "}</span>
                    {isBn ? selectedNotice.badge : selectedNotice.badgeEn}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5 pt-1">
                {displayNotices.map((notice, idx) => {
                  const title = isBn ? notice.title : notice.titleEn;
                  const desc = isBn ? notice.description : notice.descriptionEn;
                  const date = isBn ? notice.date : notice.dateEn;
                  const badge = isBn ? notice.badge : notice.badgeEn;
                  return (
                    <div key={notice.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/40">
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-gray-200">
                        <span className="text-xs font-bold text-[#0E3A53]">{idx + 1}. {badge}</span>
                        <span className="text-xs text-gray-500 font-medium">তারিখ: {date}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
                      <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{desc}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Signatures Area: No seal, clean signature at bottom corner */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex items-end justify-between">
              {/* Left: Publication Date info */}
              <div className="text-left text-[11px] text-gray-500 space-y-1">
                <p>{isBn ? "বিজ্ঞপ্তি প্রকাশের তারিখ: " : "Issue Date: "}<span className="font-semibold text-gray-700">{isSingle ? selectedNotice?.date : currentDate}</span></p>
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

            <div className="mt-8 text-center text-[10px] text-gray-500 border-t border-gray-200 pt-2.5 space-y-0.5">
              <p className="font-semibold text-gray-700">
                আনোয়ারা মেডিকেল কমপ্লেক্স | ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী
              </p>
              <p>
                জরুরি ও রিসেপশন: 01972-692504 | কর্তৃপক্ষ: 01712-692504 | ওয়েবসাইট: anowaramedicalcomplex.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
