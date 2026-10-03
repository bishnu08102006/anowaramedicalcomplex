import React, { useState, useEffect } from 'react';
import { Phone, Mail, Calendar, CheckCircle2, AlertCircle, Copy, Check, Info, Printer } from 'lucide-react';
import { useData, AppointmentRecord } from '../context/DataContext';
import { AppointmentPrintSlip } from './AppointmentPrintSlip';

interface AppointmentSectionProps {
  preselectedDoctor?: string;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  preselectedDoctor,
}) => {
  const { doctors, addAppointment } = useData();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(preselectedDoctor || 'সাধারণ (রিসেপশন নির্ধারণ করবে)');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('পুরুষ');
  const [notes, setNotes] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<AppointmentRecord | null>(null);
  const [isPrintSlipOpen, setIsPrintSlipOpen] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (preselectedDoctor) {
      setSelectedDoctor(preselectedDoctor);
    }
  }, [preselectedDoctor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার পুরো নাম লিখুন');
      return;
    }
    if (!phone.trim() || phone.length < 11) {
      setErrorMsg('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর (যেমন: 01712XXXXXX) লিখুন');
      return;
    }

    setErrorMsg('');
    const newRecord = addAppointment({
      patientName: name.trim(),
      phone: phone.trim(),
      doctor: selectedDoctor,
      notes: notes.trim(),
      age: age.trim(),
      gender
    });

    setSubmittedRecord(newRecord);
    setBookingId(newRecord.token);
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setSelectedDoctor('সাধারণ (রিসেপশন নির্ধারণ করবে)');
    setAge('');
    setGender('পুরুষ');
    setNotes('');
    setSubmittedRecord(null);
    setIsPrintSlipOpen(false);
    setSubmitted(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="appointment" className="bg-[#E7F2F8] py-14 md:py-20 border-t border-b border-[#DDE6E9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-8 items-start">
        {/* Left Info Column */}
        <div className="lg:col-span-2">
          <span className="text-[#2D8FC1] font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-1.5 mb-2">
            <Calendar className="w-4 h-4" /> অ্যাপয়েন্টমেন্ট ও সিরিয়াল
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#0E3A53] font-bold mt-1 mb-3">
            সিরিয়াল বুক করুন
          </h2>
          <p className="text-[#0E3A53]/80 text-sm leading-relaxed mb-6">
            নিচের সহজ ফর্মটি পূরণ করে পাঠান। সিরিয়ালের নির্দিষ্ট তারিখ ও সময় রিসেপশন ডেস্ক থেকে ফোনে যোগাযোগ করে জানিয়ে দেওয়া হবে। জরুরি প্রয়োজনে সরাসরি নিচের নম্বরে কল করুন।
          </p>

          <div className="space-y-3">
            {/* 1. Reception & Emergency Hotline */}
            <a
              href="tel:01972692504"
              className="flex items-center justify-between bg-[#0E3A53] text-white rounded-2xl p-3.5 shadow-sm hover:bg-[#0A2A3D] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 text-[#C9973B] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-white/80 uppercase tracking-wider">
                    রিসেপশন ও জরুরি (২৪ ঘণ্টা)
                  </span>
                  <span className="block text-sm sm:text-base font-bold text-white font-mono">
                    01972-692504
                  </span>
                </div>
              </div>
              <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full font-bold">কল করুন</span>
            </a>

            {/* 2. Hospital Authority */}
            <a
              href="tel:01712692504"
              className="flex items-center justify-between bg-amber-50/70 border border-amber-200 rounded-2xl p-3 shadow-xs hover:bg-amber-100/70 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0E3A53] text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                    হাসপাতাল কর্তৃপক্ষ
                  </span>
                  <span className="block text-xs sm:text-sm font-bold text-amber-950 font-mono">
                    01712-692504
                  </span>
                </div>
              </div>
              <span className="text-amber-800 text-xs font-semibold">কল করুন</span>
            </a>

            {/* 3. Serial Desk */}
            <a
              href="tel:01944874304"
              className="flex items-center justify-between bg-white rounded-2xl p-3.5 border border-[#DDE6E9] shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-emerald-800/80 uppercase tracking-wider">
                    সিরিয়াল ডেস্ক
                  </span>
                  <span className="block text-sm sm:text-base font-bold text-emerald-900 font-mono">
                    01944-874304
                  </span>
                </div>
              </div>
              <span className="text-emerald-700 text-xs font-semibold">কল করুন</span>
            </a>

            {/* Email Contact Card */}
            <a
              href="mailto:anowaramedicalcomplex11@gmail.com"
              className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-[#DDE6E9] shadow-xs text-xs text-gray-700"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0E3A53] text-[#2D8FC1] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <span className="font-semibold text-gray-800 truncate">anowaramedicalcomplex11@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Right Form / Confirmation Column */}
        <div className="lg:col-span-3">
          {submitted ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DDE6E9] shadow-md text-center animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-[#0E3A53] mb-1.5">
                সিরিয়ালের অনুরোধ সফল হয়েছে!
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-5 max-w-md mx-auto">
                ধন্যবাদ, <strong>{name}</strong>। আপনার সিরিয়াল রিকোয়েস্ট আমাদের রিসেপশনে জমা হয়েছে। রিসেপশনিস্ট খুব শীঘ্রই (<strong className="text-[#0E3A53]">{phone}</strong>) নম্বরে ফোন করে আপনার সিরিয়াল ও সময় নিশ্চিত করবেন।
              </p>

              {/* Token & Order Code Box */}
              <div className="bg-[#E7F2F8] border border-[#2D8FC1]/30 rounded-2xl p-4 max-w-md mx-auto mb-5 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#2D8FC1]/20">
                  <div className="text-left">
                    <span className="block text-[10px] text-[#0E3A53]/70 font-bold uppercase">
                      টোকেন কোড
                    </span>
                    <span className="text-xl font-mono font-black text-[#0E3A53]">
                      {bookingId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-white border border-[#DDE6E9] hover:bg-gray-50 text-[#0E3A53] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    title="কোড কপি করুন"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
                  </button>
                </div>

                {submittedRecord?.orderNumber && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-semibold">অর্ডার নম্বর:</span>
                    <span className="font-mono font-bold text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {submittedRecord.orderNumber}
                    </span>
                  </div>
                )}

                {/* Print button so user doesn't need screenshot */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPrintSlipOpen(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>স্লিপ প্রিন্ট করুন (Print Slip)</span>
                  </button>
                  <p className="text-[10px] text-gray-500 mt-1">
                    * স্ক্রিনশট নেওয়ার দরকার নেই, সরাসরি স্লিপ প্রিন্ট বা ডাউনলোড করুন
                  </p>
                </div>
              </div>

              {/* Details summary */}
              <div className="bg-gray-50 rounded-2xl p-4 text-left text-xs max-w-sm mx-auto mb-5 space-y-1.5 border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-500">রোগীর নাম:</span>
                  <span className="font-semibold text-gray-800">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ফোন নম্বর:</span>
                  <span className="font-semibold text-gray-800">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">নির্বাচিত ডাক্তার:</span>
                  <span className="font-semibold text-gray-800 text-right max-w-[200px] truncate">{selectedDoctor}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200 text-amber-700">
                  <span>তারিখ ও সময়:</span>
                  <span className="font-semibold">রিসেপশন থেকে ফোনে জানানো হবে</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition cursor-pointer"
                >
                  নতুন আরেকটি সিরিয়াল দিন
                </button>
                <a
                  href="tel:01972692504"
                  className="inline-flex items-center gap-1.5 bg-[#C9973B] text-[#0A2A3D] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition"
                >
                  <Phone className="w-3.5 h-3.5" /> রিসেপশনে এখনই কল করুন
                </a>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-5 sm:p-7 border border-[#DDE6E9] shadow-sm relative"
            >
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#0E3A53] mb-1">
                    রোগীর পুরো নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="নাম লিখুন"
                    className="w-full rounded-xl border border-[#DDE6E9] px-3.5 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#2D8FC1] focus:outline-none"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#0E3A53] mb-1">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-xl border border-[#DDE6E9] px-3.5 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#2D8FC1] focus:outline-none"
                  />
                </div>

                {/* Doctor Selection */}
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-semibold text-[#0E3A53] mb-1">
                    ডাক্তার বা বিভাগ নির্বাচন করুন
                  </label>
                  <select
                    id="apptDoctorSelect"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full rounded-xl border border-[#DDE6E9] px-3.5 py-2.5 text-xs sm:text-sm text-[#0E3A53] bg-white focus:ring-2 focus:ring-[#2D8FC1] focus:outline-none cursor-pointer"
                  >
                    <option value="সাধারণ (রিসেপশন নির্ধারণ করবে)">
                      সাধারণ (রিসেপশন নির্ধারণ করবে)
                    </option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={`${doc.name} — ${doc.specialty}`}>
                        {doc.name} — ({doc.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Age & Gender */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#0E3A53] mb-1">
                    বয়স (ঐচ্ছিক)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="যেমন: ৩২"
                    className="w-full rounded-xl border border-[#DDE6E9] px-3.5 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#2D8FC1] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#0E3A53] mb-1">
                    লিঙ্গ
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-xl border border-[#DDE6E9] px-3.5 py-2.5 text-xs sm:text-sm text-[#0E3A53] bg-white focus:ring-2 focus:ring-[#2D8FC1] focus:outline-none cursor-pointer"
                  >
                    <option value="পুরুষ">পুরুষ</option>
                    <option value="মহিলা">মহিলা</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>

                {/* Notice that Date & Time will be told from reception */}
                <div className="sm:col-span-2 bg-[#F0F7FA] border border-[#2D8FC1]/30 rounded-xl p-3 text-xs text-[#0E3A53] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#2D8FC1] shrink-0" />
                  <span>
                    <strong>তারিখ ও সময়:</strong> ফর্ম পাঠানোর পর আমাদের রিসেপশন ডেস্ক থেকে ফোনে সরাসরি সিরিয়াল নম্বর ও সময় জানিয়ে দেওয়া হবে।
                  </span>
                </div>

                {/* Notes / Symptoms */}
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-semibold text-[#0E3A53] mb-1">
                    শারীরিক সমস্যা বা মন্তব্য (ঐচ্ছিক)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="আপনার শারীরিক সমস্যার লক্ষণ সংক্ষেপে লিখুন..."
                    className="w-full rounded-xl border border-[#DDE6E9] px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#2D8FC1] focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <button
                  type="submit"
                  id="submit-appointment-btn"
                  className="w-full sm:w-auto bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold px-7 py-3 rounded-full transition-all text-xs sm:text-sm shadow-md active:scale-95 cursor-pointer"
                >
                  সিরিয়ালের অনুরোধ পাঠান
                </button>
                <p className="text-[11px] text-[#0E3A53]/70">
                  * রিসেপশন ডেস্ক থেকে দ্রুত ফোন করে সময় কনফার্ম করা হবে।
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {isPrintSlipOpen && submittedRecord && (
        <AppointmentPrintSlip
          appointment={submittedRecord}
          onClose={() => setIsPrintSlipOpen(false)}
          isBn={true}
        />
      )}
    </section>
  );
};
