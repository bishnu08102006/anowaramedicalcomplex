import React, { useState } from 'react';
import { Printer, Download, ExternalLink, X, Phone, MapPin, Calendar, User, ShieldCheck, CheckCircle2, Loader2, Award, Briefcase } from 'lucide-react';
import { StaffMember } from '../data/staff';
import { printElement, openPrintWindow, downloadElementAsPdf } from '../utils/printHelper';

interface StaffCardPrintModalProps {
  staff: StaffMember;
  onClose: () => void;
  isBn?: boolean;
}

export const StaffCardPrintModal: React.FC<StaffCardPrintModalProps> = ({
  staff,
  onClose,
  isBn = true,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const docTitle = `Staff-Verification-${staff.staffId}-${staff.nameEn || staff.name}`;

  const handlePrint = () => {
    printElement('printable-staff-card', docTitle);
  };

  const handleOpenWindow = () => {
    openPrintWindow('printable-staff-card', docTitle);
  };

  const handleDownloadPdf = async () => {
    await downloadElementAsPdf('printable-staff-card', docTitle, setIsDownloading);
  };

  const officialLogoUrl = 'https://i.postimg.cc/CKFmQGqw/Gemini-Generated-Image-iby2sziby2sziby2-removebg-preview.png';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto printable-modal-backdrop">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 printable-modal-content my-6">
        {/* Screen Action Header */}
        <div className="bg-[#0E3A53] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#C9973B]" />
            <span className="font-bold text-sm">
              {isBn ? "স্টাফ ভেরিফিকেশন কার্ড প্রিন্ট ও ডাউনলোড" : "Staff Verification Certificate"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Direct PDF Download */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              id="staffModalDownloadPdfBtn"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow disabled:opacity-50"
              title={isBn ? "সরাসরি PDF ফাইল ডাউনলোড করুন" : "Direct PDF Download"}
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isBn ? (isDownloading ? "ডাউনলোড..." : "PDF ডাউনলোড") : (isDownloading ? "Downloading..." : "Download PDF")}</span>
            </button>

            {/* Direct Print */}
            <button
              onClick={handlePrint}
              id="staffModalDirectPrintBtn"
              className="bg-[#2D8FC1] hover:bg-[#2378a5] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow"
              title={isBn ? "সরাসরি প্রিন্ট করুন" : "Direct Print"}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isBn ? "প্রিন্ট করুন" : "Print"}</span>
            </button>

            {/* Open in New Window */}
            <button
              onClick={handleOpenWindow}
              id="staffModalNewWindowBtn"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              title={isBn ? "নতুন উইন্ডোতে ওপেন ও প্রিন্ট" : "Open in New Window"}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isBn ? "নতুন উইন্ডো" : "New Window"}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Staff Card Content */}
        <div id="printable-staff-card" className="p-6 sm:p-8 space-y-6 text-gray-800 bg-white">
          {/* Hospital Header */}
          <div className="text-center pb-4 border-b-2 border-[#0E3A53]">
            <div className="flex items-center justify-center gap-3 mb-1">
              <img
                src={officialLogoUrl}
                alt="Anowara Medical Complex Logo"
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-contain shrink-0"
              />
              <div className="text-left">
                <h2 className="text-lg sm:text-xl font-bold text-[#0E3A53] leading-tight">
                  আনোয়ারা মেডিকেল কমপ্লেক্স
                </h2>
                <p className="text-xs font-semibold text-[#C9973B]">
                  ANOWARA MEDICAL COMPLEX & DIGITAL DIAGNOSTIC
                </p>
                <p className="text-[11px] text-gray-600">
                  ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী
                </p>
              </div>
            </div>
            <div className="mt-2 text-[11px] text-gray-600 flex flex-wrap justify-center gap-x-4 border-t border-gray-100 pt-1.5 font-medium">
              <span>রিসেপশন ও জরুরি: 01972-692504</span>
              <span>কর্তৃপক্ষ: 01712-692504</span>
              <span>ইমেইল: anowaramedicalcomplex11@gmail.com</span>
            </div>
          </div>

          {/* Certificate Title Banner */}
          <div className="bg-[#0E3A53] text-white py-1.5 px-4 rounded-lg flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <span>{isBn ? "কর্মকর্তা ও কর্মচারী পরিচয়পত্র / অফিসিয়াল ভেরিফিকেশন সনদ" : "OFFICIAL STAFF ID & VERIFICATION CERTIFICATE"}</span>
            <span className="text-emerald-400 font-mono">VERIFIED</span>
          </div>

          {/* Staff Photo & Primary Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={staff.photo}
                alt={staff.name}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white flex items-center gap-1 shadow">
                <ShieldCheck className="w-3 h-3" />
                <span>{isBn ? "ভেরিফাইড" : "VERIFIED"}</span>
              </span>
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="inline-block bg-[#0E3A53] text-[#C9973B] font-mono font-bold text-xs px-2.5 py-0.5 rounded-md mb-1.5">
                ID: {staff.staffId}
              </div>
              <h3 className="text-xl font-bold text-[#0E3A53] leading-tight">
                {isBn ? staff.name : (staff.nameEn || staff.name)}
              </h3>
              {staff.nameEn && isBn && (
                <p className="text-xs text-gray-500 font-medium">{staff.nameEn}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 bg-blue-50 text-[#0E3A53] text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-200">
                  <Award className="w-3.5 h-3.5 text-[#2D8FC1]" />
                  <span>{isBn ? staff.designation : (staff.designationEn || staff.designation)}</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-200">
                  <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isBn ? staff.department : (staff.departmentEn || staff.department)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-gray-200 rounded-2xl divide-y divide-gray-200 text-xs">
            <div className="p-3 bg-gray-50/80 font-bold text-gray-700 flex justify-between">
              <span>{isBn ? "কর্মকর্তা বিবরণ" : "Field"}</span>
              <span>{isBn ? "যাচাইকৃত তথ্য" : "Verified Record"}</span>
            </div>

            <div className="p-3 flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-[#2D8FC1]" />
                {isBn ? "পূর্ণ নাম:" : "Full Name:"}
              </span>
              <span className="font-bold text-gray-900">{isBn ? staff.name : (staff.nameEn || staff.name)}</span>
            </div>

            <div className="p-3 flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-[#2D8FC1]" />
                {isBn ? "যোগাযোগের ফোন নম্বর:" : "Mobile Contact:"}
              </span>
              <span className="font-semibold text-gray-800 font-mono">{staff.phone}</span>
            </div>

            <div className="p-3 flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#2D8FC1]" />
                {isBn ? "যোগদানের তারিখ:" : "Joining Date:"}
              </span>
              <span className="font-medium text-gray-800">{staff.joiningDate || "০১ জানুয়ারি, ২০২৩"}</span>
            </div>

            {staff.bloodGroup && (
              <div className="p-3 flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  {isBn ? "রক্তের গ্রুপ:" : "Blood Group:"}
                </span>
                <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {staff.bloodGroup}
                </span>
              </div>
            )}

            <div className="p-3 flex justify-between items-center">
              <span className="text-gray-600 font-medium">
                {isBn ? "বর্তমান অবস্থা:" : "Employment Status:"}
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? "অনুমোদিত ও সক্রিয় কর্মী" : "Approved & Active Staff"}</span>
              </span>
            </div>
          </div>

          {/* Official Signatures & Seal */}
          <div className="pt-6 border-t border-gray-200 flex justify-between items-end text-center text-xs">
            <div className="space-y-1">
              <div className="w-28 border-b-2 border-gray-400 mx-auto mb-1"></div>
              <p className="font-bold text-gray-800">{isBn ? "স্টাফের স্বাক্ষর" : "Staff Signature"}</p>
              <p className="text-[10px] text-gray-500">{staff.staffId}</p>
            </div>

            <div className="border border-dashed border-[#C9973B] rounded-xl px-4 py-2 bg-amber-50/50">
              <span className="text-[11px] font-bold text-[#0E3A53] block">
                {isBn ? "আনোয়ারা মেডিকেল কমপ্লেক্স" : "Anowara Medical Complex"}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                ✓ অফিশিয়াল ডিজিটাল সিলমোহর
              </span>
            </div>

            <div className="space-y-1">
              <div className="w-28 border-b-2 border-gray-400 mx-auto mb-1"></div>
              <p className="font-bold text-gray-800">{isBn ? "কর্তৃপক্ষের অনুমোদন" : "Authorized Seal"}</p>
              <p className="text-[10px] text-gray-500">{isBn ? "মেডিকেল ডিরেক্টর" : "Medical Director"}</p>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="bg-gray-50 rounded-xl p-3 text-[11px] text-gray-500 text-center border border-gray-200">
            {isBn
              ? "এই ডকুমেন্টটি আনোয়ারা মেডিকেল কমপ্লেক্সের সেন্ট্রাল ডাটাবেস দ্বারা যাচাইকৃত। যেকোনো তথ্যের জন্য সরাসরি রিসেপশনে যোগাযোগ করুন: 01972-692504"
              : "This document is verified by Anowara Medical Complex central database. For inquiry call: 01972-692504"}
          </div>
        </div>
      </div>
    </div>
  );
};
