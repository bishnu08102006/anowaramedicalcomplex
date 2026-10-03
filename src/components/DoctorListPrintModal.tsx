import React, { useState } from 'react';
import { Printer, Download, ExternalLink, X, Calendar, Phone, Loader2 } from 'lucide-react';
import { Doctor } from '../data/doctors';
import { printElement, openPrintWindow, downloadElementAsPdf } from '../utils/printHelper';
import { PrintLetterhead } from './PrintLetterhead';

interface DoctorListPrintModalProps {
  doctors: Doctor[];
  onClose: () => void;
  isBn?: boolean;
}

export const DoctorListPrintModal: React.FC<DoctorListPrintModalProps> = ({
  doctors,
  onClose,
  isBn = true,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const docTitle = 'Anowara-Medical-Complex-Doctor-Schedule';

  const handlePrint = () => {
    printElement('printable-doctor-list', 'Anowara Medical Complex - Specialist Doctor Schedule');
  };

  const handleOpenWindow = () => {
    openPrintWindow('printable-doctor-list', 'Anowara Medical Complex - Specialist Doctor Schedule');
  };

  const handleDownloadPdf = async () => {
    await downloadElementAsPdf('printable-doctor-list', docTitle, setIsDownloading);
  };

  const currentDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto printable-modal-backdrop">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 printable-modal-content my-6">
        {/* Screen Top Bar */}
        <div className="bg-[#0E3A53] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#C9973B]" />
            <span className="font-bold text-base">
              {isBn ? "ডাক্তারদের শিডিউল ও ভিজিটিং তালিকা প্রিন্ট ও ডাউনলোড" : "Doctor Schedule Print & Download"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Direct PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              id="doctorListDownloadPdfBtn"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow disabled:opacity-50"
              title={isBn ? "সরাসরি PDF ফাইল ডাউনলোড করুন" : "Direct PDF Download"}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isBn ? (isDownloading ? "ডাউনলোড..." : "PDF ডাউনলোড") : (isDownloading ? "Downloading..." : "Download PDF")}</span>
            </button>

            {/* Direct Print Button */}
            <button
              onClick={handlePrint}
              id="modalDirectPrintBtn"
              className="bg-[#2D8FC1] hover:bg-[#2378a5] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow"
              title={isBn ? "সরাসরি ব্রাউজারে প্রিন্ট ডায়ালগ খুলুন" : "Direct Print"}
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? "প্রিন্ট করুন" : "Print"}</span>
            </button>

            <button
              onClick={handleOpenWindow}
              id="modalNewWindowBtn"
              className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              title={isBn ? "নতুন উইন্ডোতে ওপেন ও প্রিন্ট" : "Open in New Window"}
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

        {/* Printable Content */}
        <div id="printable-doctor-list" className="p-6 sm:p-10 space-y-6 text-gray-800 bg-white">
          {/* Official Hospital Letterhead with PNG Logo */}
          <PrintLetterhead
            documentTitle={isBn ? "বিশেষজ্ঞ চিকিৎসক ভিজিটিং রোস্টার ও সময়সূচী" : "Specialist Doctors Visiting Roster & Schedule"}
            documentSubtitle={isBn ? `মোট ${doctors.length} জন বিশেষজ্ঞ চিকিৎসক তালিকাভুক্ত` : `${doctors.length} Specialist Consultants Listed`}
            refNo={`AMC/DOC/${new Date().getFullYear()}/ROSTER-01`}
            date={currentDate}
            isBn={isBn}
          />

          {/* Doctors Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#0E3A53] text-white font-bold text-xs uppercase tracking-wider">
                  <th className="py-3 px-3 text-center w-12 border-b border-r border-[#1B4B68]">#</th>
                  <th className="py-3 px-4 border-b border-r border-[#1B4B68]">{isBn ? "চিকিৎসকের নাম ও পদবী" : "Doctor Name & Degree"}</th>
                  <th className="py-3 px-4 border-b border-r border-[#1B4B68]">{isBn ? "বিভাগ / বিশেষজ্ঞতা" : "Specialty"}</th>
                  <th className="py-3 px-4 border-b border-r border-[#1B4B68]">{isBn ? "ভিজিটিং দিন ও সময়" : "Visiting Days & Time"}</th>
                  <th className="py-3 px-4 text-center border-b border-[#1B4B68]">{isBn ? "রুম নং" : "Room"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {doctors.map((doc, idx) => (
                  <tr key={doc.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                    <td className="py-2.5 px-3 text-center text-gray-500 font-medium border-r border-gray-200">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-semibold text-gray-900 border-r border-gray-200">
                      <div>{isBn ? doc.name : (doc.nameEn || doc.name)}</div>
                      <div className="text-[11px] text-gray-500 font-normal">{isBn ? doc.degree : (doc.degreeEn || doc.degree)}</div>
                    </td>
                    <td className="py-2.5 px-4 text-gray-700 font-medium border-r border-gray-200">
                      {isBn ? doc.specialty : (doc.specialtyEn || doc.specialty)}
                    </td>
                    <td className="py-2.5 px-4 text-gray-600 border-r border-gray-200">
                      <div>{isBn ? doc.schedule : (doc.scheduleEn || doc.schedule)}</div>
                      <div className="text-[11px] text-gray-500">{isBn ? doc.time : (doc.timeEn || doc.time)}</div>
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-[#0E3A53]">
                      {doc.room}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official Signatures & Seal Block */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-8 text-center text-xs text-gray-700 pt-6">
              <div>
                <div className="w-20 h-20 border border-dashed border-gray-300 rounded-full mx-auto flex flex-col items-center justify-center text-[9px] text-gray-400 font-bold mb-2">
                  <span>হাসপাতাল</span>
                  <span>সিলমোহর</span>
                </div>
                <div className="border-t border-dashed border-gray-400 w-2/3 mx-auto mb-1"></div>
                <p className="font-bold">সিরিয়াল ডেস্ক ইনচার্জ</p>
                <p className="text-[10px] text-gray-500">আনোয়ারা মেডিকেল কমপ্লেক্স</p>
              </div>

              <div className="flex flex-col justify-end">
                <div className="border-t-2 border-gray-700 w-3/4 mx-auto mb-1"></div>
                <p className="font-bold text-gray-900">মেডিকেল সুপারিনটেনডেন্ট / পরিচালক</p>
                <p className="text-[10px] text-gray-500">কর্তৃপক্ষের আদেশক্রমে</p>
              </div>
            </div>

            <div className="mt-8 text-center text-[11px] text-gray-500 border-t border-gray-100 pt-2">
              <span>* আনোয়ারা মেডিকেল কমপ্লেক্স, ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী | রিসেপশন ও জরুরি: 01972-692504, কর্তৃপক্ষ: 01712-692504, সিরিয়াল ডেস্ক: 01944-874304</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
