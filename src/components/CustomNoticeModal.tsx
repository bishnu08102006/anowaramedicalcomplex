import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  ExternalLink, 
  X, 
  FileText, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Building, 
  ShieldCheck, 
  Loader2,
  Stamp,
  Calendar,
  Hash,
  UserCheck
} from 'lucide-react';
import { PrintLetterhead } from './PrintLetterhead';
import { printElement, openPrintWindow, downloadElementAsPdf } from '../utils/printHelper';

interface CustomNoticeModalProps {
  onClose: () => void;
  isBn?: boolean;
}

interface NoticeTemplate {
  name: string;
  type: string;
  subject: string;
  body: string;
  notes: string;
  signatory: string;
}

export const CustomNoticeModal: React.FC<CustomNoticeModalProps> = ({ onClose, isBn = true }) => {
  const currentDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const templates: NoticeTemplate[] = [
    {
      name: 'সাধারণ নোটিশ / বিজ্ঞপ্তি',
      type: 'সাধারণ বিজ্ঞপ্তি',
      subject: 'হাসপাতালের বহির্বিভাগ (OPD) ও নিয়মিত স্বাস্থ্যসেবা পরিচালনা সংক্রান্ত সাধারণ বিজ্ঞপ্তি',
      body: `সর্বসাধারণের সদয় অবগতির জন্য জানানো যাচ্ছে যে, আনোয়ারা মেডিকেল কমপ্লেক্সের সকল বিশেষজ্ঞ চিকিৎসকের চেম্বার ও ল্যাব সেবা যথারীতি পরিচালিত হচ্ছে।

জরুরি বিভাগ (Emergency), ইনডোর রোগী ভর্তি এবং ২৪ ঘণ্টা অ্যাম্বুলেন্স সেবা সার্বক্ষণিক চালু রয়েছে। যে কোনো তথ্যের জন্য আমাদের হটলাইনে যোগাযোগ করার অনুরোধ করা হলো।`,
      notes: 'জরুরি হটলাইন: 01972-692504 | 01712-692504',
      signatory: 'হাসপাতাল কর্তৃপক্ষ\nআনোয়ারা মেডিকেল কমপ্লেক্স',
    },
    {
      name: 'ছুটি ও সেবা সংক্রান্ত বিজ্ঞপ্তি',
      type: 'জরুরি বিজ্ঞপ্তি',
      subject: 'পবিত্র ঈদুল ফিতর উপলক্ষে হাসপাতাল বহির্বিভাগ (OPD) ও ল্যাব সেবা সংক্রান্ত নোটিশ',
      body: `সর্বসাধারণের অবগতির জন্য জানানো যাচ্ছে যে, পবিত্র ঈদুল ফিতর উপলক্ষে আগামী [তারিখ] হতে [তারিখ] পর্যন্ত আমাদের হাসপাতালের নিয়মিত বিশেষজ্ঞ কনসালট্যান্ট চেম্বার কার্যক্রম সীমিত থাকবে।

তবে রোগীদের জরুরি চিকিৎসা সেবার স্বার্থে হাসপাতালের জরুরি বিভাগ (Emergency), ইনডোর রোগী ভর্তি এবং ২৪ ঘণ্টা অ্যাম্বুলেন্স সেবা যথারীতি চালু থাকবে। ডিজিটাল প্যাথলজি ল্যাব প্রতিদিন সকাল ৮:০০ টা হতে রাত ১০:০০ টা পর্যন্ত খোলা থাকবে।

জরুরি প্রয়োজনে আমাদের হটলাইনে যোগাযোগ করার জন্য অনুরোধ করা যাচ্ছে।`,
      notes: 'জরুরি হটলাইন: 01972-692504 | 01712-692504',
      signatory: 'মেডিকেল ডিরেক্টর\nআনোয়ারা মেডিকেল কমপ্লেক্স, পলাশ, নরসিংদী',
    },
    {
      name: 'ডাক্তার চেম্বার / শিডিউল পরিবর্তন',
      type: 'বিশেষ নোটিশ',
      subject: 'বিশেষজ্ঞ কনসালট্যান্ট চিকিৎসকের চেম্বার সময়সূচি পরিবর্তন সংক্রান্ত বিজ্ঞপ্তি',
      body: `সম্মানিত সেবাগ্রহীতাদের সদয় অবগতির জন্য জানানো যাচ্ছে যে, আমাদের হাসপাতালের সম্মানিত কনসালট্যান্ট [ডাক্তারের নাম ও পদবী] অনিবার্য কারণবশত আগামী [তারিখ] চেম্বারে উপস্থিত থাকতে পারবেন না।

উক্ত ডাক্তারের পরবর্তী চেম্বার আগামী [পরবর্তী দিন ও তারিখ]-এ যথারীতি অনুষ্ঠিত হবে। পূর্বে সিরিয়াল প্রদানকারী রোগীদের সুবিধাজনক সময়ে সিরিয়াল পুনঃনির্ধারণ করে দেওয়া হচ্ছে।

সাময়িক এই অসুবিধার জন্য হাসপাতাল কর্তৃপক্ষ আন্তরিকভাবে দুঃখ প্রকাশ করছে।`,
      notes: 'সিরিয়াল পুনঃনির্ধারণের জন্য হটলাইন: 01944-874304',
      signatory: 'প্রশাসনিক কর্মকর্তা\nআনোয়ারা মেডিকেল কমপ্লেক্স',
    },
    {
      name: 'ফ্রি মেডিকেল ক্যাম্প ও টেস্ট ছাড়',
      type: 'জনস্বার্থে নোটিশ',
      subject: 'ডায়াবেটিস ও হৃদরোগ সচেতনতায় বিশেষ ফ্রি স্বাস্থ্য ক্যাম্প ও ল্যাব টেস্ট ছাড়',
      body: `আনোয়ারা মেডিকেল কমপ্লেক্সের পক্ষ থেকে সাধারণ মানুষের স্বাস্থ্য সুরক্ষায় আগামী [তারিখ] সকাল ৯:০০ টা হতে বিকাল ৪:০০ টা পর্যন্ত এক বিশেষ স্বাস্থ্য ক্যাম্প পরিচালিত হবে।

ক্যাম্পের বিশেষ সুবিধাসমূহ:
১. সম্পূর্ণ বিনামূল্যে ব্লাড সুগার (RBS) ও ব্লাড প্রেশার পরিমাপ।
২. অভিজ্ঞ এমবিবিএস ডাক্তার দ্বারা বিনামূল্যে প্রাথমিক চিকিৎসা পরামর্শ।
৩. সকল প্যাথলজি টেস্ট এবং ডিজিটাল এক্স-রে তে বিশেষ ২৫% ছাড়।

আগ্রহী রোগীদের নির্ধারিত তারিখে যথাসময়ে হাসপাতালে উপস্থিত হয়ে সেবা গ্রহণের জন্য আমন্ত্রণ জানানো হচ্ছে।`,
      notes: 'রেজিস্ট্রেশন ও তথ্যের জন্য যোগাযোগ: 01972-692504',
      signatory: 'ব্যবস্থাপনা পরিচালক\nআনোয়ারা মেডিকেল কমপ্লেক্স',
    },
    {
      name: 'হাসপাতাল নিয়মাবলী ও দর্শনার্থী প্রবেশ',
      type: 'প্রশাসনিক আদেশ',
      subject: 'হাসপাতাল প্রাঙ্গণে শৃঙ্খলা রক্ষা ও দর্শনার্থী প্রবেশ সংক্রান্ত নির্দেশিকা',
      body: `হাসপাতালে ভর্তি রোগীদের সুস্থ ও সংক্রমণমুক্ত পরিবেশ বজায় রাখার লক্ষ্যে সকল দর্শনার্থী এবং রোগীর স্বজনদের প্রতি নিম্নোক্ত নির্দেশনা মেনে চলার অনুরোধ করা হচ্ছে:

১. ভর্তি রোগীর সাথে সার্বক্ষণিক সর্বোচ্চ ১ জন সহযোগী উপস্থিত থাকতে পারবেন।
২. বহিরাগত দর্শনার্থীদের জন্য বিকাল ৫:০০ টা হতে সন্ধ্যা ৭:০০ টা পর্যন্ত ভিজিটিং আওয়ার নির্ধারিত।
৩. হাসপাতাল চত্বরে ধূমপান সম্পূর্ণ নিষিদ্ধ।
৪. হাসপাতালের অভ্যন্তরে উচ্চস্বরে কথা বলা বা মোবাইল স্পিকারে বাজানো হতে বিরত থাকুন।

কর্তৃপক্ষের এই মানবিক পদক্ষেপে আপনাদের সার্বিক সহযোগিতা একান্ত কাম্য।`,
      notes: 'শৃঙ্খলা বিভাগ: আনোয়ারা মেডিকেল কমপ্লেক্স',
      signatory: 'হাসপাতাল কর্তৃপক্ষ\nআনোয়ারা মেডিকেল কমপ্লেক্স',
    }
  ];

  const [noticeType, setNoticeType] = useState('সাধারণ বিজ্ঞপ্তি');
  const [memoMode, setMemoMode] = useState<'none' | 'dots' | 'custom'>('none');
  const [memoNo, setMemoNo] = useState('');
  const [date, setDate] = useState(currentDate);
  const [subject, setSubject] = useState('হাসপাতালের বহির্বিভাগ (OPD) ও স্বাস্থ্যসেবা পরিচালনা সংক্রান্ত');
  const [body, setBody] = useState(`সর্বসাধারণের সদয় অবগতির জন্য জানানো যাচ্ছে যে, আনোয়ারা মেডিকেল কমপ্লেক্সের বহির্বিভাগ ও বিশেষজ্ঞ কনসালট্যান্ট সেবা নিয়মিতভাবে প্রদান করা হচ্ছে।

জরুরি বিভাগ (Emergency), ইনডোর রোগী ভর্তি এবং ২৪ ঘণ্টা অ্যাম্বুলেন্স সেবা সার্বক্ষণিক সচল রয়েছে।

প্রয়োজনীয় নির্দেশনা বা ঘোষণা এখানে টাইপ করার পর সরাসরি PDF ডাউনলোড করে অফলাইনে নোটিশ বোর্ডে প্রদর্শন করা যাবে।`);
  const [notes, setNotes] = useState('জরুরি প্রয়োজনে যোগাযোগ: 01972-692504 / 01712-692504');
  const [signatory, setSignatory] = useState('মেডিকেল ডিরেক্টর / প্রশাসনিক কর্তৃপক্ষ\nআনোয়ারা মেডিকেল কমপ্লেক্স');
  const [showSeal, setShowSeal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const applyTemplate = (tpl: NoticeTemplate) => {
    setNoticeType(tpl.type);
    setSubject(tpl.subject);
    setBody(tpl.body);
    setNotes(tpl.notes);
    setSignatory(tpl.signatory);
  };

  const docTitle = `আনোয়ারা_মেডিকেল_কমপ্লেক্স_${noticeType.replace(/\s+/g, '_')}${memoMode === 'custom' && memoNo ? '_' + memoNo.replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, '_') : ''}`;

  const handlePrint = () => {
    printElement('printable-custom-notice', docTitle);
  };

  const handleOpenWindow = () => {
    openPrintWindow('printable-custom-notice', docTitle);
  };

  const handleDownloadPdf = async () => {
    await downloadElementAsPdf('printable-custom-notice', docTitle, setIsDownloading);
  };

  const signatoryPresets = [
    { label: 'মেডিকেল ডিরেক্টর', text: 'মেডিকেল ডিরেক্টর\nআনোয়ারা মেডিকেল কমপ্লেক্স' },
    { label: 'হাসপাতাল কর্তৃপক্ষ', text: 'হাসপাতাল কর্তৃপক্ষ\nআনোয়ারা মেডিকেল কমপ্লেক্স' },
    { label: 'ব্যবস্থাপনা পরিচালক', text: 'ব্যবস্থাপনা পরিচালক\nআনোয়ারা মেডিকেল কমপ্লেক্স' },
    { label: 'প্রশাসনিক কর্মকর্তা', text: 'প্রশাসনিক কর্মকর্তা\nআনোয়ারা মেডিকেল কমপ্লেক্স' },
    { label: 'আরএমও (RMO)', text: 'আবাসিক মেডিকেল অফিসার (RMO)\nআনোয়ারা মেডিকেল কমপ্লেক্স' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto printable-modal-backdrop">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 printable-modal-content my-4 flex flex-col max-h-[94vh]">
        {/* Modal Screen Controls Header */}
        <div className="bg-[#0E3A53] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#C9973B] border border-white/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base block">
                  {isBn ? "কাস্টমাইজড অফিসিয়াল নোটিশ প্যাড ও PDF ডাউনলোড" : "Custom Official Notice Letterhead Generator"}
                </span>
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  PDF Export
                </span>
              </div>
              <span className="text-xs text-white/70">
                {isBn
                  ? "আনোয়ারা মেডিকেল কমপ্লেক্সের অফিসিয়াল প্যাড, লোগো ও সিলমোহর সহ অফলাইন নোটিশ প্রস্তুত করুন"
                  : "Prepare official hospital notices with logo, address & seal for offline printing"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Direct PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              id="customNoticeDownloadPdfBtn"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50"
              title={isBn ? "সরাসরি PDF ফাইল হিসেবে ডিভাইসে ডাউনলোড করুন" : "Direct PDF Download"}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isBn ? "PDF প্রস্তুত হচ্ছে..." : "Generating PDF..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isBn ? "সরাসরি PDF ডাউনলোড করুন" : "Download PDF"}</span>
                </>
              )}
            </button>

            {/* Direct Print Button */}
            <button
              onClick={handlePrint}
              id="customNoticeDirectPrintBtn"
              className="bg-[#2D8FC1] hover:bg-[#2378a5] text-white text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow"
              title={isBn ? "সরাসরি প্রিন্ট উইন্ডো ওপেন করুন" : "Print Notice"}
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? "প্রিন্ট করুন" : "Print"}</span>
            </button>

            <button
              onClick={handleOpenWindow}
              id="customNoticeNewWindowBtn"
              className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              title={isBn ? "নতুন ব্রাউজার উইন্ডোতে দেখুন" : "Open in New Window"}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBn ? "নতুন উইন্ডো" : "New Window"}</span>
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

        {/* Notice Workspace Grid: Left Editor + Right Real-time Preview */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* LEFT: Editor Controls (Hidden during print) */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-gray-50 border-r border-gray-200 space-y-4 overflow-y-auto max-h-[85vh] print:hidden">
            {/* Quick Templates */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9973B]" />
                <span>তৈরিকৃত রেডিমেড ফরম্যাট নির্বাচন করুন:</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {templates.map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(tpl)}
                    className="text-left p-2 rounded-xl border border-gray-200 bg-gray-50/60 hover:border-[#2D8FC1] hover:bg-blue-50/70 text-[11px] font-semibold text-gray-800 transition cursor-pointer truncate"
                    title={tpl.name}
                  >
                    📝 {tpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Notice Metadata Fields */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-700 font-bold flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[#2D8FC1]" />
                      <span>বিজ্ঞপ্তির ধরন / শিরোনাম:</span>
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {['সাধারণ বিজ্ঞপ্তি', 'জরুরি বিজ্ঞপ্তি', 'বিশেষ নোটিশ', 'ছুটি সংক্রান্ত নোটিশ'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setNoticeType(tag)}
                          className={`text-[9.5px] px-1.5 py-0.5 rounded transition cursor-pointer ${
                            noticeType === tag
                              ? 'bg-[#0E3A53] text-white font-bold'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={noticeType}
                    onChange={(e) => setNoticeType(e.target.value)}
                    placeholder="উদাঃ সাধারণ বিজ্ঞপ্তি"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#2D8FC1] focus:bg-white font-semibold text-gray-800"
                  />
                </div>

                {/* Memo / Smarok No Configuration */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-gray-700 font-bold flex items-center gap-1">
                      <Hash className="w-3 h-3 text-[#2D8FC1]" />
                      <span>স্মারক নম্বর (ঐচ্ছিক):</span>
                    </label>
                    <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setMemoMode('none')}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                          memoMode === 'none'
                            ? 'bg-white text-[#0E3A53] shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        বাদ দিন (ব্ল্যাঙ্ক)
                      </button>
                      <button
                        type="button"
                        onClick={() => setMemoMode('dots')}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                          memoMode === 'dots'
                            ? 'bg-white text-[#0E3A53] shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        হাতে লেখার লাইন
                      </button>
                      <button
                        type="button"
                        onClick={() => setMemoMode('custom')}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                          memoMode === 'custom'
                            ? 'bg-white text-[#0E3A53] shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        টাইপ করুন
                      </button>
                    </div>
                  </div>

                  {memoMode === 'custom' && (
                    <input
                      type="text"
                      value={memoNo}
                      onChange={(e) => setMemoNo(e.target.value)}
                      placeholder="উদাঃ AMC/NOT/2026/04"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#2D8FC1] focus:bg-white"
                    />
                  )}
                  {memoMode === 'dots' && (
                    <p className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
                      ✍️ নোটিশে <span className="font-mono text-gray-700">"স্মারক নং: ........................"</span> থাকবে যাতে হাসপাতাল কর্তৃপক্ষ কলম দিয়ে হাতে লিখতে পারেন।
                    </p>
                  )}
                  {memoMode === 'none' && (
                    <p className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
                      ✓ স্মারক নং ব্ল্যাঙ্ক রাখা হয়েছে, নোটিশে কোনো স্মারক নম্বর প্রদর্শন করা হবে না।
                    </p>
                  )}
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-gray-700 font-bold mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#2D8FC1]" />
                  <span>বিজ্ঞপ্তি প্রকাশের তারিখ:</span>
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#2D8FC1] focus:bg-white"
                />
              </div>

              <div className="text-xs">
                <label className="block text-gray-700 font-bold mb-1">
                  নোটিশের মূল বিষয় (Subject) *:
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="বিজ্ঞপ্তির মূল বিষয় লিখুন..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:border-[#2D8FC1] focus:bg-white"
                />
              </div>
            </div>

            {/* Body */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs text-xs">
              <label className="block text-gray-700 font-bold mb-1">
                নোটিশের বিস্তারিত বিবরণ (Body) *:
              </label>
              <textarea
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="এখানে বিস্তারিত বাংলায় নোটিশের বিষয়বস্তু লিখুন..."
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#2D8FC1] focus:bg-white leading-relaxed font-sans"
              />
            </div>

            {/* Notes */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs text-xs">
              <label className="block text-gray-700 font-bold mb-1">
                জরুরি যোগাযোগ / বিশেষ দ্রষ্টব্য (ঐচ্ছিক):
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="উদাঃ জরুরি হটলাইন: 01972-692504"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#2D8FC1] focus:bg-white"
              />
            </div>

            {/* Signatory & Seal */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <label className="block text-gray-700 font-bold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#2D8FC1]" />
                  <span>স্বাক্ষরকারী কর্তৃপক্ষ ও পদবী:</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="toggleSeal"
                    checked={showSeal}
                    onChange={(e) => setShowSeal(e.target.checked)}
                    className="rounded text-[#0E3A53] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="toggleSeal" className="text-[11px] text-gray-600 font-semibold cursor-pointer">
                    সিলমোহর প্রদর্শন
                  </label>
                </div>
              </div>

              {/* Signatory Presets */}
              <div className="flex flex-wrap gap-1">
                {signatoryPresets.map((sp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSignatory(sp.text)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 hover:bg-[#0E3A53] hover:text-white text-gray-700 transition cursor-pointer"
                  >
                    {sp.label}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={signatory}
                onChange={(e) => setSignatory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#2D8FC1] focus:bg-white"
              />
            </div>

            {/* Reset & Feedback */}
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setNoticeType('সাধারণ বিজ্ঞপ্তি');
                  setMemoMode('none');
                  setMemoNo('');
                  setSubject('হাসপাতালের বহির্বিভাগ (OPD) ও স্বাস্থ্যসেবা পরিচালনা সংক্রান্ত');
                  setBody(`সর্বসাধারণের সদয় অবগতির জন্য জানানো যাচ্ছে যে, আনোয়ারা মেডিকেল কমপ্লেক্সের বহির্বিভাগ ও বিশেষজ্ঞ কনসালট্যান্ট সেবা নিয়মিতভাবে প্রদান করা হচ্ছে।

জরুরি বিভাগ (Emergency), ইনডোর রোগী ভর্তি এবং ২৪ ঘণ্টা অ্যাম্বুলেন্স সেবা সার্বক্ষণিক সচল রয়েছে।

প্রয়োজনীয় নির্দেশনা বা ঘোষণা এখানে টাইপ করার পর সরাসরি PDF ডাউনলোড করে অফলাইনে নোটিশ বোর্ডে প্রদর্শন করা যাবে।`);
                  setNotes('জরুরি প্রয়োজনে যোগাযোগ: 01972-692504 / 01712-692504');
                  setSignatory('মেডিকেল ডিরেক্টর / প্রশাসনিক কর্তৃপক্ষ\nআনোয়ারা মেডিকেল কমপ্লেক্স');
                  setShowSeal(false);
                }}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ডিফল্ট রিসেট</span>
              </button>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>লাইভ প্রিভিউ ও PDF প্রস্তুত</span>
              </span>
            </div>
          </div>

          {/* RIGHT: Live Printable Hospital Letterhead Preview */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 bg-gray-200/60 overflow-y-auto flex items-start justify-center">
            <div
              id="printable-custom-notice"
              className="bg-white w-full max-w-2xl p-8 sm:p-12 shadow-xl rounded-2xl border border-gray-300 text-gray-900 space-y-6 min-h-[750px] flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Official Letterhead: Centered Logo + Anowara Medical Complex + Details */}
                <PrintLetterhead
                  documentTitle={noticeType}
                  refNo={memoMode === 'custom' ? memoNo : undefined}
                  showDottedRefIfEmpty={memoMode === 'dots'}
                  hideRefNo={memoMode === 'none'}
                  date={date}
                  isBn={isBn}
                  centered={true}
                />

                {/* Subject - Clean and uncluttered, no heavy lines around notice title */}
                <div className="pt-1 pb-1">
                  <h3 className="font-extrabold text-[#0E3A53] text-sm sm:text-base leading-snug">
                    <span className="text-gray-600 font-medium">বিষয়: </span>
                    {subject}
                  </h3>
                </div>

                {/* Notice Body */}
                <div className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line text-justify min-h-[220px] font-sans">
                  {body}
                </div>

                {/* Notes */}
                {notes && (
                  <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 text-xs text-gray-800">
                    <span className="font-bold text-[#0E3A53]">বিশেষ দ্রষ্টব্য: </span>
                    {notes}
                  </div>
                )}
              </div>

              {/* Signatures Area: Option for stamp or clean signature at bottom corner */}
              <div className="mt-10 pt-5 border-t border-gray-200">
                <div className="flex items-end justify-between">
                  {/* Left: Release Date imprint (NO নথি নং) */}
                  <div className="text-left text-xs text-gray-500">
                    {showSeal ? (
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#1e40af] p-1 flex flex-col items-center justify-center text-[#1e40af] select-none transform -rotate-3 mb-2 bg-blue-50/20">
                        <div className="w-full h-full rounded-full border border-[#1e40af] flex flex-col items-center justify-center p-1 text-[8px] font-bold leading-tight uppercase text-center">
                          <span className="tracking-tighter font-extrabold text-[8.5px]">আনোয়ারা মেডিকেল কমপ্লেক্স</span>
                          <span className="text-[7.5px] text-[#C9973B] font-bold my-0.5">★ পলাশ, নরসিংদী ★</span>
                          <span className="text-[7px] text-gray-600">স্থাপিত: ২০২৪</span>
                          <span className="text-[7.5px] font-black text-emerald-800">✓ অনুমোদিত</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-500 space-y-1">
                        <p>বিজ্ঞপ্তি প্রকাশের তারিখ: <span className="font-semibold text-gray-700">{date}</span></p>
                      </div>
                    )}
                  </div>

                  {/* Right: Signature Area */}
                  <div className="flex flex-col items-center text-center">
                    <div className="h-14 flex items-end pb-1">
                      <span className="font-serif italic text-gray-400 text-sm tracking-widest">[অনুমোদিত স্বাক্ষর]</span>
                    </div>
                    <div className="border-t-2 border-gray-800 w-48 mx-auto mb-1.5"></div>
                    <p className="font-bold text-gray-900 whitespace-pre-line text-xs">{signatory}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">কর্তৃপক্ষের আদেশক্রমে</p>
                  </div>
                </div>

                {/* Footer details banner */}
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
      </div>
    </div>
  );
};
