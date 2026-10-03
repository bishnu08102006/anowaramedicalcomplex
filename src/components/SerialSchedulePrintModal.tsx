import React, { useState, useMemo } from 'react';
import { Printer, Download, ExternalLink, X, MapPin, Calendar, Clock, Filter, CheckCircle2, User, Phone, Stethoscope, FileSpreadsheet, Loader2 } from 'lucide-react';
import { AppointmentRecord } from '../context/DataContext';
import { printElement, openPrintWindow, downloadElementAsPdf } from '../utils/printHelper';
import { PrintLetterhead } from './PrintLetterhead';

interface SerialSchedulePrintModalProps {
  appointments: AppointmentRecord[];
  onClose: () => void;
  isBn?: boolean;
}

export const SerialSchedulePrintModal: React.FC<SerialSchedulePrintModalProps> = ({
  appointments,
  onClose,
  isBn = true,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isDownloading, setIsDownloading] = useState(false);

  // Extract unique doctor names
  const doctorList = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach((apt) => {
      if (apt.doctor) set.add(apt.doctor);
    });
    return Array.from(set);
  }, [appointments]);

  // Filter appointments for print
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchDoc = selectedDoctor === 'all' || apt.doctor === selectedDoctor;
      const matchStatus = selectedStatus === 'all' || apt.status === selectedStatus;
      return matchDoc && matchStatus;
    });
  }, [appointments, selectedDoctor, selectedStatus]);

  const docTitle = 'Anowara-Medical-Complex-Serial-Schedule';

  const handlePrint = () => {
    printElement('printable-serial-schedule', 'Anowara Medical Complex - Serial Schedule');
  };

  const handleOpenWindow = () => {
    openPrintWindow('printable-serial-schedule', 'Anowara Medical Complex - Serial Schedule');
  };

  const handleDownloadPdf = async () => {
    await downloadElementAsPdf('printable-serial-schedule', docTitle, setIsDownloading);
  };

  const currentDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Summary counts
  const pendingCount = filteredAppointments.filter(a => a.status === 'pending').length;
  const confirmedCount = filteredAppointments.filter(a => a.status === 'confirmed').length;
  const attendedCount = filteredAppointments.filter(a => a.status === 'attended').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto printable-modal-backdrop">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 printable-modal-content my-6">
        {/* Screen Controls Bar - Hidden when printing */}
        <div className="bg-[#0E3A53] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#C9973B]">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base block">
                {isBn ? "সিরিয়াল তালিকা ও সময়সূচী প্রিন্ট ও ডাউনলোড" : "Serial Schedule & Queue Print & Download"}
              </span>
              <span className="text-xs text-white/70">
                {isBn 
                  ? `মোট ${filteredAppointments.length} জন রোগীর সিরিয়াল অন্তর্ভুক্ত` 
                  : `${filteredAppointments.length} patient serial records ready`}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Filter Selects */}
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="bg-[#0A2A3D] text-white text-xs border border-white/20 rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">{isBn ? "সকল ডাক্তার" : "All Doctors"}</option>
              {doctorList.map((doc) => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#0A2A3D] text-white text-xs border border-white/20 rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">{isBn ? "সকল স্ট্যাটাস" : "All Status"}</option>
              <option value="pending">{isBn ? "অপেক্ষমান" : "Pending"}</option>
              <option value="confirmed">{isBn ? "নিশ্চিতকৃত" : "Confirmed"}</option>
              <option value="attended">{isBn ? "সম্পন্ন" : "Attended"}</option>
            </select>

            {/* Direct PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              id="serialDownloadPdfBtn"
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
              id="serialDirectPrintBtn"
              className="bg-[#2D8FC1] hover:bg-[#2378a5] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow"
              title={isBn ? "সরাসরি প্রিন্ট করুন" : "Direct Print"}
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? "প্রিন্ট করুন" : "Print"}</span>
            </button>

            <button
              onClick={handleOpenWindow}
              id="serialNewWindowBtn"
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

        {/* Printable Paper Document */}
        <div id="printable-serial-schedule" className="p-6 sm:p-10 space-y-5 text-gray-800 bg-white">
          {/* Official Hospital Header with PNG Logo */}
          <PrintLetterhead
            documentTitle={isBn ? "দৈনিক সিরিয়াল বুকিং ও রোগী দেখার শিডিউল তালিকা" : "Daily Patient Serial Schedule & Consultation Queue"}
            documentSubtitle={isBn ? `মোট সিরিয়াল: ${filteredAppointments.length} জন | ডাক্তার: ${selectedDoctor === 'all' ? 'সকল' : selectedDoctor}` : `Total Serials: ${filteredAppointments.length}`}
            refNo={`AMC/SERIAL/${new Date().getFullYear()}/ROSTER`}
            date={`${currentDate} (${currentTime})`}
            isBn={isBn}
          />

          {/* Quick Roster Status Badge Summary */}
          <div className="grid grid-cols-4 gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 text-center text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-semibold">{isBn ? "মোট তালিকাভুক্ত" : "Total Queue"}</span>
              <span className="font-bold text-gray-900 text-sm">{filteredAppointments.length}</span>
            </div>
            <div>
              <span className="text-emerald-600 block text-[10px] uppercase font-semibold">{isBn ? "নিশ্চিতকৃত" : "Confirmed"}</span>
              <span className="font-bold text-emerald-700 text-sm">{confirmedCount}</span>
            </div>
            <div>
              <span className="text-amber-600 block text-[10px] uppercase font-semibold">{isBn ? "অপেক্ষমান" : "Pending"}</span>
              <span className="font-bold text-amber-700 text-sm">{pendingCount}</span>
            </div>
            <div>
              <span className="text-blue-600 block text-[10px] uppercase font-semibold">{isBn ? "সম্পন্ন" : "Attended"}</span>
              <span className="font-bold text-blue-700 text-sm">{attendedCount}</span>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0E3A53] text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3 text-center w-12 border-b border-r border-[#1B4B68]">#</th>
                  <th className="py-2.5 px-3 border-b border-r border-[#1B4B68]">{isBn ? "টোকেন আইডি" : "Token ID"}</th>
                  <th className="py-2.5 px-3.5 border-b border-r border-[#1B4B68]">{isBn ? "রোগীর নাম" : "Patient Name"}</th>
                  <th className="py-2.5 px-3 border-b border-r border-[#1B4B68]">{isBn ? "মোবাইল নম্বর" : "Mobile Phone"}</th>
                  <th className="py-2.5 px-3.5 border-b border-r border-[#1B4B68]">{isBn ? "নির্ধারিত ডাক্তার" : "Doctor"}</th>
                  <th className="py-2.5 px-3 text-center border-b border-r border-[#1B4B68]">{isBn ? "তারিখ ও শিফট" : "Date & Shift"}</th>
                  <th className="py-2.5 px-3 text-center border-b border-[#1B4B68]">{isBn ? "স্ট্যাটাস" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500 italic">
                      {isBn ? "কোনো সিরিয়াল পাওয়া যায়নি" : "No appointment records found for selected filters"}
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt, index) => {
                    const statusBg =
                      apt.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-800'
                        : apt.status === 'attended'
                        ? 'bg-blue-50 text-blue-800'
                        : 'bg-amber-50 text-amber-800';

                    const statusLabel =
                      apt.status === 'confirmed'
                        ? (isBn ? 'নিশ্চিত' : 'Confirmed')
                        : apt.status === 'attended'
                        ? (isBn ? 'সম্পন্ন' : 'Attended')
                        : (isBn ? 'অপেক্ষমান' : 'Pending');

                    return (
                      <tr key={apt.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="py-2 px-3 text-center font-bold text-gray-500 border-r border-gray-200">
                          {index + 1}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-[#0E3A53] border-r border-gray-200">
                          {apt.token || `TK-${apt.id.substring(0, 6)}`}
                        </td>
                        <td className="py-2 px-3.5 font-semibold text-gray-900 border-r border-gray-200">
                          {apt.name}
                        </td>
                        <td className="py-2 px-3 font-mono text-gray-700 border-r border-gray-200">
                          {apt.phone}
                        </td>
                        <td className="py-2 px-3.5 text-gray-800 border-r border-gray-200">
                          <span className="font-medium text-xs">{apt.doctor || (isBn ? 'সাধারণ' : 'General')}</span>
                        </td>
                        <td className="py-2 px-3 text-center text-gray-600 border-r border-gray-200">
                          <div>{apt.date}</div>
                          <span className="text-[10px] text-gray-400 capitalize">{apt.shift || 'General'}</span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${statusBg}`}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Official Seal and Signatures */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-8 text-center text-xs text-gray-700 pt-6">
              <div>
                <div className="w-20 h-20 border border-dashed border-gray-300 rounded-full mx-auto flex flex-col items-center justify-center text-[9px] text-gray-400 font-bold mb-2">
                  <span>হাসপাতাল</span>
                  <span>সিলমোহর</span>
                </div>
                <div className="border-t border-dashed border-gray-400 w-2/3 mx-auto mb-1"></div>
                <p className="font-bold">ডেস্ক ইনচার্জ / রিসিভশনিস্ট</p>
                <p className="text-[10px] text-gray-500">রোগী সিরিয়াল ব্যবস্থাপনা শাখা</p>
              </div>

              <div className="flex flex-col justify-end">
                <div className="border-t-2 border-gray-700 w-3/4 mx-auto mb-1"></div>
                <p className="font-bold text-gray-900">কর্তব্যরত মেডিকেল অফিসার / সুপারিনটেনডেন্ট</p>
                <p className="text-[10px] text-gray-500">আনোয়ারা মেডিকেল কমপ্লেক্স</p>
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
