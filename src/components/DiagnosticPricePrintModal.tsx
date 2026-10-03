import React, { useState } from 'react';
import { Printer, Download, ExternalLink, X, Activity, Stethoscope, Search, CheckCircle2, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { DiagnosticTest } from '../data/tests';
import { printElement, openPrintWindow, downloadElementAsPdf } from '../utils/printHelper';
import { PrintLetterhead } from './PrintLetterhead';

interface DiagnosticPricePrintModalProps {
  tests: DiagnosticTest[];
  onClose: () => void;
  isBn?: boolean;
}

export const DiagnosticPricePrintModal: React.FC<DiagnosticPricePrintModalProps> = ({
  tests,
  onClose,
  isBn = true,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'pathology' | 'imaging'>('all');
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredTests = tests.filter((test) => {
    if (categoryFilter === 'all') return true;
    return test.category === categoryFilter;
  });

  const docTitle = 'Anowara-Medical-Complex-Diagnostic-Price-List';

  const handlePrint = () => {
    printElement('printable-diagnostic-price-list', 'Anowara Medical Complex - Diagnostic Price List');
  };

  const handleOpenWindow = () => {
    openPrintWindow('printable-diagnostic-price-list', 'Anowara Medical Complex - Diagnostic Price List');
  };

  const handleDownloadPdf = async () => {
    await downloadElementAsPdf('printable-diagnostic-price-list', docTitle, setIsDownloading);
  };

  const currentDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const pathologyCount = tests.filter(t => t.category === 'pathology').length;
  const imagingCount = tests.filter(t => t.category === 'imaging').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto printable-modal-backdrop">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 printable-modal-content my-6">
        {/* Screen Controls Bar - Hidden during print */}
        <div className="bg-[#0E3A53] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#C9973B]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base block">
                {isBn ? "ডায়াগনস্টিক টেস্ট ও ফি তালিকা প্রিন্ট ও ডাউনলোড" : "Diagnostic Price List Print & Download"}
              </span>
              <span className="text-xs text-white/70">
                {isBn ? `মোট ${filteredTests.length} টি পরীক্ষা তালিকাভুক্ত` : `${filteredTests.length} diagnostic tests`}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            <div className="bg-[#0A2A3D] p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  categoryFilter === 'all' ? 'bg-[#2D8FC1] text-white font-bold' : 'text-white hover:bg-white/10'
                }`}
              >
                {isBn ? 'সকল' : 'All'} ({tests.length})
              </button>
              <button
                onClick={() => setCategoryFilter('pathology')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  categoryFilter === 'pathology' ? 'bg-[#2D8FC1] text-white font-bold' : 'text-white hover:bg-white/10'
                }`}
              >
                {isBn ? 'প্যাথলজি' : 'Pathology'} ({pathologyCount})
              </button>
              <button
                onClick={() => setCategoryFilter('imaging')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  categoryFilter === 'imaging' ? 'bg-[#2D8FC1] text-white font-bold' : 'text-white hover:bg-white/10'
                }`}
              >
                {isBn ? 'এক্স-রে ও আল্ট্রা' : 'Imaging'} ({imagingCount})
              </button>
            </div>

            {/* Direct PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              id="diagnosticPriceDownloadPdfBtn"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow disabled:opacity-50"
              title={isBn ? "সরাসরি PDF ফাইল হিসেবে ডাউনলোড করুন" : "Direct PDF Download"}
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
              id="diagnosticPriceDirectPrintBtn"
              className="bg-[#2D8FC1] hover:bg-[#2378a5] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow"
              title={isBn ? "সরাসরি ব্রাউজারে প্রিন্ট ডায়ালগ খুলুন" : "Direct Print"}
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? "প্রিন্ট করুন" : "Print"}</span>
            </button>

            <button
              onClick={handleOpenWindow}
              id="diagnosticPriceNewWindowBtn"
              className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              title={isBn ? "নতুন উইন্ডোতে ওপেন করুন" : "Open in New Window"}
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

        {/* Printable Document Sheet */}
        <div id="printable-diagnostic-price-list" className="p-6 sm:p-10 space-y-6 text-gray-800 bg-white">
          {/* Official Hospital Letterhead with PNG Logo */}
          <PrintLetterhead
            documentTitle={isBn ? "ডিজিটাল ডায়াগনস্টিক ও প্যাথলজি টেস্ট মূল্য তালিকা" : "DIGITAL DIAGNOSTIC & PATHOLOGY TEST FEE CHART"}
            documentSubtitle={isBn ? "মানসম্মত আধুনিক প্যাথলজি ও কম্পিউটারাইজড রিপোর্ট ডেলিভারি" : "Accurate Automated Pathology & Imaging Services"}
            refNo={`AMC/DIAG/${new Date().getFullYear()}/${categoryFilter.toUpperCase()}`}
            date={currentDate}
            isBn={isBn}
          />

          {/* Quick Notice Banner */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs text-gray-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#2D8FC1] shrink-0 mt-0.5" />
            <p>
              {isBn
                ? "জরুরি রোগীদের জন্য ২৪ ঘণ্টা প্যাথলজি ও ডিজিটাল এক্স-রে সেবা সচল থাকে। টেস্ট রিপোর্ট প্রস্তুত হলে আপনার প্রদত্ত মোবাইল নম্বরে এসএমএস এর মাধ্যমে জানানো হয়।"
                : "24-hour pathology & digital X-ray services are active for emergency patients. SMS notification is sent upon report readiness."}
            </p>
          </div>

          {/* Table of Tests */}
          <div className="overflow-x-auto border border-gray-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#0E3A53] text-white font-bold text-xs uppercase tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12 border-b border-r border-[#1B4B68]">#</th>
                  <th className="py-3 px-4 border-b border-r border-[#1B4B68]">{isBn ? "পরীক্ষার নাম (Test Name)" : "Test Name"}</th>
                  <th className="py-3 px-3.5 text-center w-28 border-b border-r border-[#1B4B68]">{isBn ? "বিভাগ" : "Department"}</th>
                  <th className="py-3 px-4 text-center w-36 border-b border-r border-[#1B4B68]">{isBn ? "রিপোর্ট প্রাপ্তি" : "Delivery Time"}</th>
                  <th className="py-3 px-4 text-right w-32 border-b border-[#1B4B68]">{isBn ? "নির্ধারিত ফি" : "Fee (BDT)"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredTests.map((test, index) => {
                  const rawPrice = isBn ? test.price : (test.priceEn || test.price);
                  const priceFormatted = rawPrice.includes('৳') || rawPrice.includes('Tk') ? rawPrice : `৳ ${rawPrice}`;
                  const deliveryDisplay = isBn ? test.deliveryTime : (test.deliveryTimeEn || test.deliveryTime);
                  const isPathology = test.category === 'pathology';

                  return (
                    <tr key={test.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                      <td className="py-2.5 px-3.5 text-center text-gray-500 font-medium border-r border-gray-200">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-gray-900 border-r border-gray-200">
                        <div>{isBn ? test.name : (test.nameEn || test.name)}</div>
                        {isBn && test.nameEn && test.nameEn !== test.name && (
                          <div className="text-[11px] text-gray-500 font-normal">{test.nameEn}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5 text-center border-r border-gray-200">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          isPathology ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-[#2D8FC1]'
                        }`}>
                          {isPathology ? (isBn ? 'প্যাথলজি' : 'Pathology') : (isBn ? 'ইমেজিং' : 'Imaging')}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center text-gray-600 text-xs border-r border-gray-200">
                        {deliveryDisplay}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-[#0E3A53] text-sm">
                        {priceFormatted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Official Seal and Signature Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-8 text-center text-xs text-gray-700 pt-6">
              <div>
                <div className="w-20 h-20 border border-dashed border-gray-300 rounded-full mx-auto flex flex-col items-center justify-center text-[9px] text-gray-400 font-bold mb-2">
                  <span>হাসপাতাল</span>
                  <span>সিলমোহর</span>
                </div>
                <div className="border-t border-dashed border-gray-400 w-2/3 mx-auto mb-1"></div>
                <p className="font-bold">ল্যাব ইনচার্জ / প্রধান বায়োকেমিস্ট</p>
                <p className="text-[10px] text-gray-500">ডিজিটাল ডায়াগনস্টিক বিভাগ</p>
              </div>

              <div className="flex flex-col justify-end">
                <div className="border-t-2 border-gray-700 w-3/4 mx-auto mb-1"></div>
                <p className="font-bold text-gray-900">মেডিকেল সুপারিনটেনডেন্ট / পরিচালক</p>
                <p className="text-[10px] text-gray-500">কর্তৃপক্ষের অনুমোদনক্রমে</p>
              </div>
            </div>

            <div className="mt-8 text-center text-[11px] text-gray-500 border-t border-gray-100 pt-2">
              <span>* টেস্ট রিপোর্ট ও অনুসন্ধানে যোগাযোগ: রিসেপশন ও জরুরি: 01972-692504, কর্তৃপক্ষ: 01712-692504, সিরিয়াল ডেস্ক: 01944-874304 | জরুরি রোগী অগ্রাধিকার প্রাপ্ত।</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
