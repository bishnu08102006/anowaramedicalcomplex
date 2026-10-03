import React, { useState } from 'react';
import { Printer, Download, ExternalLink, X, Phone, MapPin, Calendar, Clock, User, FileText, CheckCircle2, Shield, Loader2, Image as ImageIcon } from 'lucide-react';
import { AppointmentRecord } from '../context/DataContext';
import { printElement, openPrintWindow } from '../utils/printHelper';
import { downloadAppointmentSlip } from '../utils/appointmentSlipGenerator';

interface AppointmentPrintSlipProps {
  appointment: AppointmentRecord;
  onClose: () => void;
  isBn?: boolean;
}

export const AppointmentPrintSlip: React.FC<AppointmentPrintSlipProps> = ({
  appointment,
  onClose,
  isBn = true,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const docTitle = `AMC-Serial-Slip-${appointment.token || appointment.id.substring(0, 6)}`;

  const handlePrint = () => {
    printElement('printable-slip', docTitle);
  };

  const handleOpenWindow = () => {
    openPrintWindow('printable-slip', docTitle);
  };

  const handleDownload = async (format: 'pdf' | 'png' = 'pdf') => {
    setIsDownloading(true);
    await downloadAppointmentSlip(
      'printable-slip',
      {
        token: appointment.token || appointment.id.substring(0, 6),
        orderNumber: appointment.orderNumber,
        name: appointment.patientName,
        phone: appointment.phone,
        doctor: appointment.doctor,
        age: appointment.age,
        gender: appointment.gender,
        isBn,
      },
      format,
      setIsDownloading
    );
  };

  const officialLogoUrl = 'https://i.postimg.cc/CKFmQGqw/Gemini-Generated-Image-iby2sziby2sziby2-removebg-preview.png';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto printable-modal-backdrop">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 printable-modal-content">
        {/* Screen-only Action Header */}
        <div className="bg-[#0E3A53] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#C9973B]" />
            <span className="font-bold text-sm">
              {isBn ? "অ্যাপয়েন্টমেন্ট স্লিপ প্রিন্ট ও ডাউনলোড" : "Appointment Slip Preview"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Direct PDF Download */}
            <button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading}
              id="slipDownloadPdfBtn"
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

            {/* Direct Image (PNG) Download */}
            <button
              onClick={() => handleDownload('png')}
              disabled={isDownloading}
              id="slipDownloadPngBtn"
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title={isBn ? "ছবি হিসেবে ডাউনলোড করুন" : "Download as Image"}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#2D8FC1]" />
              <span>{isBn ? "ছবি" : "PNG"}</span>
            </button>

            {/* Direct Print */}
            <button
              onClick={handlePrint}
              id="slipDirectPrintBtn"
              className="bg-[#2D8FC1] hover:bg-[#2378a5] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow"
              title={isBn ? "সরাসরি প্রিন্ট করুন" : "Direct Print"}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isBn ? "প্রিন্ট" : "Print"}</span>
            </button>

            <button
              onClick={handleOpenWindow}
              id="slipNewWindowBtn"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              title={isBn ? "নতুন উইন্ডোতে ওপেন ও প্রিন্ট" : "Open in New Window"}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isBn ? "নতুন উইন্ডো" : "New Window"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div id="printable-slip" className="p-6 sm:p-8 space-y-6 text-gray-800 bg-white">
          {/* Hospital Header with Official Logo */}
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
              <span>হাসপাতাল কর্তৃপক্ষ: 01712-692504</span>
              <span>সিরিয়াল ডেস্ক: 01944-874304</span>
            </div>
          </div>

          {/* Title Banner */}
          <div className="bg-[#0E3A53] text-white py-1.5 px-4 rounded-lg flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <span>{isBn ? "রোগী অ্যাপয়েন্টমেন্ট ও সিরিয়াল টোকেন স্লিপ" : "OUTPATIENT APPOINTMENT TOKEN SLIP"}</span>
            <span className="text-[#C9973B] font-mono">ORIGINAL</span>
          </div>

          {/* Token Highlight Box */}
          <div className="bg-emerald-50 border-2 border-emerald-500/60 rounded-2xl p-4 text-center">
            <span className="text-xs uppercase font-bold text-emerald-800 block mb-1">
              {isBn ? "আপনার সিরিয়াল টোকেন নম্বর" : "Your Serial Token Number"}
            </span>
            <div className="font-mono font-extrabold text-2xl sm:text-3xl text-emerald-700 tracking-wider">
              {appointment.token || `AMC-${appointment.id.substring(0, 6)}`}
            </div>
            <span className="text-[11px] text-emerald-800 mt-1 inline-block font-medium">
              {isBn ? "হাসপাতালে উপস্থিতির সময় এই স্লিপটি বা টোকেন কোডটি প্রদর্শন করুন" : "Show this token at the reception desk"}
            </span>
          </div>

          {/* Appointment Details Grid */}
          <div className="border border-gray-200 rounded-2xl divide-y divide-gray-200 text-xs">
            <div className="p-3 bg-gray-50/80 font-bold text-gray-700 flex justify-between">
              <span>{isBn ? "বিবরণ" : "Field"}</span>
              <span>{isBn ? "তথ্য" : "Details"}</span>
            </div>

            <div className="p-3 flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-[#2D8FC1]" />
                {isBn ? "রোগীর নাম:" : "Patient Name:"}
              </span>
              <span className="font-bold text-gray-900 text-sm">{appointment.name}</span>
            </div>

            <div className="p-3 flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-[#2D8FC1]" />
                {isBn ? "মোবাইল নম্বর:" : "Phone:"}
              </span>
              <span className="font-semibold text-gray-800 font-mono">{appointment.phone}</span>
            </div>

            <div className="p-3 flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1.5 font-medium">
                <FileText className="w-3.5 h-3.5 text-[#2D8FC1]" />
                {isBn ? "পরামর্শক চিকিৎসক:" : "Consultant Doctor:"}
              </span>
              <span className="font-bold text-[#0E3A53] text-right">
                {appointment.doctor || (isBn ? "সাধারণ ও জরুরি মেডিকেল অফিসার" : "General Medical Officer")}
              </span>
            </div>

            <div className="p-3 flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#2D8FC1]" />
                {isBn ? "নির্ধারিত তারিখ:" : "Appointment Date:"}
              </span>
              <span className="font-semibold text-gray-800">{appointment.date}</span>
            </div>

            <div className="p-3 flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#2D8FC1]" />
                {isBn ? "শিফট / সময়:" : "Shift / Time:"}
              </span>
              <span className="font-semibold text-gray-800 capitalize">
                {appointment.shift === 'morning' ? (isBn ? 'সকাল (৯:০০ টা - ১:০০ টা)' : 'Morning (9:00 AM - 1:00 PM)') : 
                 appointment.shift === 'evening' ? (isBn ? 'বিকাল (৪:০০ টা - ৮:০০ টা)' : 'Evening (4:00 PM - 8:00 PM)') : 
                 (isBn ? 'জেনারেল সময়সূচী' : 'Standard Shift')}
              </span>
            </div>

            <div className="p-3 flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {isBn ? "সিরিয়াল স্ট্যাটাস:" : "Status:"}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                {appointment.status === 'confirmed' ? (isBn ? 'নিশ্চিতকৃত (Confirmed)' : 'Confirmed') : (isBn ? 'অপেক্ষমান (Pending)' : 'Pending')}
              </span>
            </div>
          </div>

          {/* Instructions for Patients */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1">
            <p className="font-bold text-gray-800 flex items-center gap-1.5 mb-1">
              <Shield className="w-3.5 h-3.5 text-[#2D8FC1]" />
              <span>{isBn ? "রোগীর জন্য জরুরি নির্দেশনা:" : "Important Patient Guidelines:"}</span>
            </p>
            <p>১. অনুগ্রহ করে উল্লেখিত সাক্ষাত সময়ের অন্তত ২০ মিনিট পূর্বে হাসপাতালে উপস্থিত হয়ে রিসেপশনে এই স্লিপটি বা টোকেন কোডটি প্রদর্শন করুন।</p>
            <p>২. পূর্বের কোনো প্রেসক্রিপশন বা টেস্ট রিপোর্ট থাকলে সাথে নিয়ে আসুন।</p>
            <p>৩. জরুরি প্রয়োজনে বা সিরিয়ালের সময় পরিবর্তনের জন্য আমাদের সিরিয়াল ডেস্কে সরাসরি কল দিন: 01944-874304।</p>
          </div>

          {/* Footer Signature & Verification */}
          <div className="pt-6 border-t border-dashed border-gray-300 flex items-end justify-between text-[11px] text-gray-500">
            <div>
              <p>কম্পিউটার জেনারেটেড ডিজিটাল স্লিপ</p>
              <p className="text-[10px] text-gray-400">anowaramedicalcomplex.com</p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-gray-400 mb-1"></div>
              <p className="font-semibold text-gray-700">রিসেপশন ডেস্ক স্বাক্ষর</p>
            </div>
          </div>
        </div>

        {/* Screen-only Print / Download / Close Buttons */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200 transition cursor-pointer"
          >
            {isBn ? "বন্ধ করুন" : "Close"}
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            disabled={isDownloading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isBn ? (isDownloading ? "ডাউনলোড হচ্ছে..." : "PDF ডাউনলোড করুন") : (isDownloading ? "Downloading..." : "Download PDF")}</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isBn ? "স্লিপ প্রিন্ট করুন" : "Print Slip"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
