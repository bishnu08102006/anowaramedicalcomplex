import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Clock, 
  User, 
  ChevronRight,
  Info,
  Printer,
  Download,
  ShieldCheck,
  Loader2,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { AppointmentPrintSlip } from '../components/AppointmentPrintSlip';
import { HospitalLogo } from '../components/HospitalLogo';
import { useLanguage } from '../context/LanguageContext';
import { useData, AppointmentRecord } from '../context/DataContext';
import { downloadAppointmentSlip } from '../utils/appointmentSlipGenerator';

interface AppointmentPageProps {
  initialDoctor?: string;
  onNavigateHome: () => void;
  onNavigate: (page: any) => void;
}

export const AppointmentPage: React.FC<AppointmentPageProps> = ({
  initialDoctor,
  onNavigateHome,
  onNavigate,
}) => {
  const { t, isBn } = useLanguage();
  const { doctors, addAppointment } = useData();

  // Robust matcher function that matches any doctor by ID, Bangla name, English name, or combined string
  const findDoctorMatch = (input?: string) => {
    if (!input || !doctors || doctors.length === 0) return null;
    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();
    return doctors.find((d) => {
      const dNameLower = d.name.toLowerCase();
      const dNameEnLower = d.nameEn.toLowerCase();
      return (
        d.id.toLowerCase() === lower ||
        d.name === trimmed ||
        d.nameEn.toLowerCase() === lower ||
        `${d.name} (${d.specialty})` === trimmed ||
        `${d.name} — ${d.specialty}` === trimmed ||
        `${d.name} - ${d.specialty}` === trimmed ||
        `${d.nameEn} (${d.specialtyEn})`.toLowerCase() === lower ||
        lower.includes(dNameLower) ||
        dNameLower.includes(lower) ||
        lower.includes(dNameEnLower) ||
        dNameEnLower.includes(lower)
      );
    });
  };

  const getInitialDoctorValue = (init?: string) => {
    if (!init) return '';
    const match = findDoctorMatch(init);
    if (match) {
      const name = isBn ? match.name : match.nameEn;
      const spec = isBn ? match.specialty : match.specialtyEn;
      return `${name} (${spec})`;
    }
    return init;
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    doctor: getInitialDoctorValue(initialDoctor),
    age: '',
    gender: 'পুরুষ',
    notes: '',
  });

  const [submittedRecord, setSubmittedRecord] = useState<AppointmentRecord | null>(null);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);
  const [isPrintSlipOpen, setIsPrintSlipOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDownload = async (format: 'pdf' | 'png' = 'pdf') => {
    if (!submittedToken) return;
    setIsDownloading(true);
    setDownloadSuccess(false);

    const success = await downloadAppointmentSlip(
      'appointment-success-slip',
      {
        token: submittedToken,
        orderNumber: submittedRecord?.orderNumber,
        name: formData.name,
        phone: formData.phone,
        doctor: formData.doctor,
        age: formData.age,
        gender: formData.gender,
        isBn,
      },
      format,
      setIsDownloading
    );

    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }
  };

  useEffect(() => {
    if (initialDoctor) {
      const match = findDoctorMatch(initialDoctor);
      if (match) {
        const name = isBn ? match.name : match.nameEn;
        const spec = isBn ? match.specialty : match.specialtyEn;
        setFormData((prev) => ({ ...prev, doctor: `${name} (${spec})` }));
      } else {
        setFormData((prev) => ({ ...prev, doctor: initialDoctor }));
      }
    }
  }, [initialDoctor, isBn, doctors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে রোগীর নাম ও সচল মোবাইল নম্বর প্রদান করুন।' : 'Please enter patient name and valid contact number.');
      return;
    }
    if (formData.phone.trim().length < 11) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে ১১ ডিজিটের সঠিক মোবাইল নম্বর লিখুন।' : 'Please enter a valid 11-digit phone number.');
      return;
    }
    setErrorMsg('');

    const newRecord = addAppointment({
      patientName: formData.name.trim(),
      phone: formData.phone.trim(),
      doctor: formData.doctor || (isBn ? 'সাধারণ (রিসেপশন নির্ধারণ করবে)' : 'General (Assigned by Reception)'),
      age: formData.age.trim(),
      gender: formData.gender,
      notes: formData.notes.trim()
    });

    setSubmittedRecord(newRecord);
    setSubmittedToken(newRecord.token);
  };

  const handleCopy = () => {
    if (submittedToken) {
      navigator.clipboard.writeText(submittedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const resetForm = () => {
    setSubmittedRecord(null);
    setSubmittedToken(null);
    setIsPrintSlipOpen(false);
    setIsDownloading(false);
    setDownloadSuccess(false);
    setFormData({
      name: '',
      phone: '',
      doctor: '',
      age: '',
      gender: 'পুরুষ',
      notes: '',
    });
  };

  return (
    <div id="appointment-page" className="min-h-screen bg-[#F8FAFB]">
      <PageBanner
        title={t.appt_page_title}
        subtitle={t.appt_page_subtitle}
        icon={Calendar}
        badge={isBn ? "অনলাইন সিরিয়াল" : "Online Serial Desk"}
        currentPageName={t.nav_appointment}
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Info & Hotline Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Urgent Notice Card */}
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-amber-900 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-950 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{isBn ? 'রিসেপশন বিজ্ঞপ্তি' : 'Reception Protocol'}</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-900/90">
                {isBn 
                  ? 'রোগীর সিরিয়াল নম্বর ও নির্ধারিত সাক্ষাতের সময় রিসেপশন ডেস্ক থেকে ফোনে কল করে কনফার্ম করা হবে। সিরিয়াল সংক্রান্ত তথ্যের জন্য নিচের হটলাইনে যোগাযোগ করতে পারেন।'
                  : 'Your serial number and appointment slot will be assigned and confirmed directly over phone by our reception desk.'}
              </p>
            </div>

            {/* Direct Dial Hotline Card */}
            <div className="bg-[#0E3A53] text-white rounded-2xl p-5 sm:p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C9973B]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{t.appt_call_card_title}</h3>
                  <p className="text-[11px] text-white/70">{isBn ? 'সরাসরি রিসেপশন ডেস্ক' : 'Direct Reception Desk'}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <a
                  href="tel:01712692504"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition font-bold"
                >
                  <span className="flex items-center gap-1.5">
                    <span>☎️ জরুরি হটলাইন ও অ্যাম্বুলেন্স:</span>
                    <span className="font-mono text-[#C9973B]">01712-692504</span>
                  </span>
                  <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full">{t.call_now}</span>
                </a>
                <a
                  href="tel:01944874304"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    <span>📋 সিরিয়াল ডেস্ক:</span>
                    <span className="font-mono">01944-874304</span>
                  </span>
                  <span className="text-[#C9973B] text-[11px]">{t.call_now}</span>
                </a>
              </div>
            </div>

            {/* Email card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E7F2F8] text-[#2D8FC1] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500 font-medium">{isBn ? 'অফিসিয়াল ইমেইল' : 'Official Email'}</p>
                <p className="text-xs font-bold text-[#0E3A53] truncate">anowaramedicalcomplex11@gmail.com</p>
              </div>
            </div>

            {/* Address info */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#0E3A53] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 text-[#2D8FC1]" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#0E3A53] mb-1">{isBn ? 'কমপ্লেক্সের অবস্থান' : 'Location'}</p>
                <p className="text-gray-600 leading-relaxed">
                  {isBn ? 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী।' : 'WAPDA Sadar Road, Medical Morh, Palash, Narsingdi.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Form Card (8 cols) */}
          <div className="lg:col-span-8">
            <div id="appointment-success-slip" className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200/80 shadow-sm relative">
              {submittedToken ? (
                /* Success View */
                <div className="text-center py-4 animate-fadeIn">
                  {/* Official Slip Branding Header */}
                  <div className="pb-4 mb-6 border-b-2 border-[#0E3A53] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <div className="flex items-center gap-3">
                      <HospitalLogo className="w-13 h-13 sm:w-14 sm:h-14 shrink-0 drop-shadow-xs" />
                      <div>
                        <h4 className="font-bold text-[#0E3A53] text-base sm:text-lg">
                          {isBn ? 'আনোয়ারা মেডিকেল কমপ্লেক্স' : 'Anowara Medical Complex'}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {isBn ? 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী' : 'WAPDA Sadar Road, Medical Morh, Palash, Narsingdi'}
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-[#E7F2F8] text-[#0E3A53] text-xs font-bold px-3 py-1 rounded-full border border-[#2D8FC1]/30">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2D8FC1]" />
                      <span>{isBn ? 'কনফার্মড অনলাইন সিরিয়াল' : 'Confirmed Online Serial'}</span>
                    </div>
                  </div>

                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#0E3A53] mb-1.5">
                    {t.appt_success_title}
                  </h3>

                  <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto mb-6">
                    {t.appt_success_desc}
                  </p>

                  {/* Token & Order Number Box */}
                  <div className="bg-[#E7F2F8] border border-[#2D8FC1]/30 rounded-2xl p-5 max-w-md mx-auto mb-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-[#2D8FC1]/20">
                      <div>
                        <span className="text-xs text-gray-500 font-semibold block mb-0.5">
                          {t.appt_token_code}
                        </span>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <span className="text-2xl font-mono font-black text-[#0E3A53] tracking-wider">
                            {submittedToken}
                          </span>
                          <button
                            data-no-capture="true"
                            onClick={handleCopy}
                            className="no-download-capture p-1 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-[#2D8FC1] hover:border-[#2D8FC1] transition text-xs flex items-center gap-1 cursor-pointer"
                            title={isBn ? "টোকেন কপি করুন" : "Copy Token"}
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="text-[11px]">{copied ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'কপি' : 'Copy')}</span>
                          </button>
                        </div>
                      </div>

                      {submittedRecord?.orderNumber && (
                        <div className="text-center sm:text-right">
                          <span className="text-[11px] text-gray-500 font-semibold block">
                            {isBn ? 'অর্ডার ট্র্যাকিং নম্বর' : 'Order Number'}
                          </span>
                          <span className="font-mono text-xs font-bold text-gray-800 bg-white px-2 py-1 rounded-md border border-gray-200 inline-block">
                            {submittedRecord.orderNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Screenshot avoidance guidance & Direct Download button */}
                    <div data-no-capture="true" className="no-download-capture pt-3.5 text-center">
                      <p className="text-[11px] text-gray-600 mb-3">
                        {isBn 
                          ? '💡 বোতামে চাপ দিলে আপনার এই অফিশিয়াল সিরিয়াল স্লিপটি সরাসরি আপনার ডিভাইসে ডাউনলোড হয়ে যাবে।' 
                          : '💡 Click below to directly download this official appointment slip to your device.'}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {/* Direct PDF Download button */}
                        <button
                          onClick={() => handleDownload('pdf')}
                          disabled={isDownloading}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer disabled:opacity-60"
                          title={isBn ? "পিডিএফ স্লিপ ডাউনলোড করুন" : "Download PDF Slip"}
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
                              ? (isBn ? 'ডাউনলোড হচ্ছে...' : 'Downloading...')
                              : downloadSuccess
                              ? (isBn ? 'ডাউনলোড সম্পন্ন!' : 'Downloaded!')
                              : (isBn ? 'স্লিপ ডাউনলোড করুন (PDF)' : 'Download Slip (PDF)')}
                          </span>
                        </button>

                        {/* Direct Image (PNG) Download */}
                        <button
                          onClick={() => handleDownload('png')}
                          disabled={isDownloading}
                          className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-100 active:scale-95 text-[#0E3A53] font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-300 shadow-xs transition cursor-pointer disabled:opacity-60"
                          title={isBn ? "ছবি (PNG) হিসেবে ডাউনলোড করুন" : "Download as Image"}
                        >
                          <ImageIcon className="w-4 h-4 text-[#2D8FC1]" />
                          <span>{isBn ? 'ছবি ডাউনলোড' : 'Image (PNG)'}</span>
                        </button>

                        {/* Direct Print Modal */}
                        <button
                          onClick={() => setIsPrintSlipOpen(true)}
                          className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-100 active:scale-95 text-gray-700 font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-300 shadow-xs transition cursor-pointer"
                          title={isBn ? "প্রিন্ট বা প্রিভিউ দেখুন" : "Print or Preview"}
                        >
                          <Printer className="w-4 h-4 text-[#C9973B]" />
                          <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submitted summary */}
                  <div className="bg-gray-50 rounded-2xl p-5 max-w-md mx-auto mb-6 text-left text-xs space-y-2.5 border border-gray-200">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200/80">
                      <span className="text-gray-500 font-medium">{isBn ? 'রোগীর নাম:' : 'Patient Name:'}</span>
                      <span className="font-bold text-gray-900 text-sm">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200/80">
                      <span className="text-gray-500 font-medium">{isBn ? 'মোবাইল নম্বর:' : 'Phone:'}</span>
                      <span className="font-mono font-bold text-gray-900">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200/80">
                      <span className="text-gray-500 font-medium">{isBn ? 'ডাক্তার:' : 'Doctor:'}</span>
                      <span className="font-semibold text-gray-800 text-right">{formData.doctor || (isBn ? 'সাধারণ (রিসেপশন নির্ধারণ করবে)' : 'General (By Reception)')}</span>
                    </div>
                    {(formData.age || formData.gender) && (
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200/80">
                        <span className="text-gray-500 font-medium">{isBn ? 'বয়স ও লিঙ্গ:' : 'Age/Gender:'}</span>
                        <span className="font-semibold text-gray-800">{formData.age ? `${formData.age} বছর` : '-'} / {formData.gender || '-'}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-1 text-amber-800">
                      <span className="font-medium">{isBn ? 'সাক্ষাতের সময়:' : 'Appointment Time:'}</span>
                      <span className="font-bold text-right">{isBn ? 'রিসেপশন থেকে ফোনে জানিয়ে দেওয়া হবে' : 'Reception will confirm via phone'}</span>
                    </div>
                    <div className="pt-2 border-t border-dashed border-gray-300 text-[11px] text-gray-500 flex items-center justify-between">
                      <span>{isBn ? 'জরুরি হটলাইন:' : 'Hotline:'} 01712-692504</span>
                      <span>{isBn ? 'কাউন্টারে দেখান' : 'Show at counter'}</span>
                    </div>
                  </div>

                  <div data-no-capture="true" className="no-download-capture flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={resetForm}
                      className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer"
                    >
                      {t.appt_book_another}
                    </button>
                    <button
                      onClick={() => onNavigate('doctors')}
                      className="bg-gray-100 hover:bg-gray-200 text-[#0E3A53] px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer"
                    >
                      {t.nav_doctors}
                    </button>
                  </div>
                </div>
              ) : (
                /* Form View */
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#0E3A53]">
                      {isBn ? 'অনলাইন সিরিয়াল ফর্ম' : 'Online Serial Form'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {isBn ? 'তথ্য দিন, আমাদের রিসেপশন ডেস্ক থেকে দ্রুততম সময়ে আপনার সিরিয়াল নিশ্চিত করা হবে।' : 'Fill in the information below; our reception team will promptly call to confirm your serial and visiting time.'}
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Patient Name */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          {t.appt_name_label} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={isBn ? "উদাঃ মোঃ রফিকুল ইসলাম" : "e.g. John Doe"}
                          className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                        />
                      </div>

                      {/* Mobile Phone */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          {t.appt_phone_label} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="01712-XXXXXX"
                          className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Doctor Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        {t.appt_doctor_label}
                      </label>
                      <select
                        id="appointment-doctor-select"
                        value={formData.doctor}
                        onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white cursor-pointer font-medium text-gray-800"
                      >
                        <option value="">{t.appt_general_doc}</option>
                        {doctors.map((doc) => {
                          const name = isBn ? doc.name : doc.nameEn;
                          const spec = isBn ? doc.specialty : doc.specialtyEn;
                          const optionVal = `${name} (${spec})`;
                          return (
                            <option key={doc.id} value={optionVal}>
                              {name} — ({spec})
                            </option>
                          );
                        })}
                      </select>

                      {formData.doctor && (
                        <div className="mt-2.5 flex items-center justify-between p-2.5 bg-[#E7F2F8] border border-[#2D8FC1]/30 rounded-xl text-xs text-[#0E3A53]">
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircle2 className="w-4 h-4 text-[#2D8FC1] shrink-0" />
                            <span className="truncate">
                              {isBn ? 'বাছাইকৃত চিকিৎসক:' : 'Selected Doctor:'}{' '}
                              <strong>{formData.doctor}</strong>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, doctor: '' })}
                            className="text-[11px] font-semibold text-gray-500 hover:text-red-600 underline shrink-0 ml-2 cursor-pointer"
                          >
                            {isBn ? 'পরিবর্তন / রিসেট' : 'Clear'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Age & Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          {isBn ? 'রোগীর বয়স (ঐচ্ছিক)' : 'Patient Age (Optional)'}
                        </label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          placeholder={isBn ? "যেমন: ৩২" : "e.g. 32"}
                          className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          {isBn ? 'লিঙ্গ' : 'Gender'}
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white cursor-pointer"
                        >
                          <option value="পুরুষ">{isBn ? 'পুরুষ' : 'Male'}</option>
                          <option value="মহিলা">{isBn ? 'মহিলা' : 'Female'}</option>
                          <option value="অন্যান্য">{isBn ? 'অন্যান্য' : 'Other'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Informational Callout: Date and Time told from Reception */}
                    <div className="bg-[#E7F2F8] border border-[#2D8FC1]/30 rounded-xl p-3.5 text-xs text-[#0E3A53] flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-[#2D8FC1] shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="block text-[#0E3A53] font-bold mb-0.5">
                          {isBn ? 'সিরিয়ালের তারিখ ও সময় নির্ধারণ:' : 'Appointment Date & Time Allocation:'}
                        </strong>
                        <span>
                          {isBn 
                            ? 'ডাক্তারের ভিজিটিং সূচী অনুযায়ী আমাদের রিসেপশন টিম থেকে ফোনে যোগাযোগ করে আপনার সুবিধাজনক সময় ও সিরিয়াল নম্বর বরাদ্দ করা হবে।'
                            : 'Our reception desk will contact you via phone to assign and confirm the appropriate visiting time slot.'}
                        </span>
                      </div>
                    </div>

                    {/* Notes / Symptoms */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        {t.appt_notes_label}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder={isBn ? "সমস্যার লক্ষণ বা পূর্বে কোনো পরীক্ষা করা থাকলে লিখুন..." : "Describe symptoms or previous test history..."}
                        className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        id="submit-serial-page-btn"
                        className="w-full sm:w-auto bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold px-8 py-3.5 rounded-full transition shadow hover:shadow-md text-xs sm:text-sm active:scale-95 cursor-pointer"
                      >
                        {t.appt_submit_btn}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Appointment Slip Modal */}
      {isPrintSlipOpen && submittedRecord && (
        <AppointmentPrintSlip
          appointment={submittedRecord}
          onClose={() => setIsPrintSlipOpen(false)}
          isBn={isBn}
        />
      )}
    </div>
  );
};
