import React from 'react';
import { 
  Phone, 
  Calendar, 
  Stethoscope, 
  Activity, 
  Image as ImageIcon, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Truck, 
  AlertCircle,
  FileText,
  UserCheck,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { PageId } from '../components/Header';
import { doctorsData } from '../data/doctors';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onSelectDoctorForAppointment: (doctorName: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectDoctorForAppointment }) => {
  const { t, isBn } = useLanguage();
  const { notices, doctors } = useData();

  // Pick top 3 doctors for quick preview from dynamic state or fallback
  const featuredDoctors = (doctors && doctors.length > 0 ? doctors : doctorsData).slice(0, 3);
  // Pick the absolute latest notice from dynamic admin notices
  const latestNotice = notices && notices.length > 0 ? notices[0] : null;

  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);

  const homeFaqs = [
    {
      qBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সে (anowaramedicalcomplex.com) বিশেষজ্ঞ ডাক্তারের সিরিয়াল কিভাবে বুক করবেন?',
      qEn: 'How to book a specialist doctor appointment at Anowara Medical Complex?',
      aBn: 'আমাদের ওয়েবসাইটের "সিরিয়াল নিন" বাটনে ক্লিক করে রোগীর নাম ও মোবাইল নম্বর দিয়ে আপনার পছন্দের বিশেষজ্ঞ ডাক্তার নির্বাচন করুন। আপনি তাৎক্ষণিকভাবে একটি সিরিয়াল টোকেন কোড পাবেন। এছাড়া সরাসরি অ্যাম্বুলেন্স: 01972-692504, হটলাইন: 01712-692504 অথবা সিরিয়াল ডেস্ক: 01944-874304 নম্বরে কল দিয়েও সিরিয়াল নিশ্চিত করতে পারেন।',
      aEn: 'Click the "Book Serial" button on anowaramedicalcomplex.com, enter the patient name and phone number, and choose your preferred doctor. You will receive an instant appointment token. You can also call directly at 01712-692504.'
    },
    {
      qBn: 'আনোয়ারা মেডিকেল কমপ্লেক্স পলাশ, নরসিংদীতে ঠিক কোথায় অবস্থিত?',
      qEn: 'Where is Anoara Medical Complex located in Palash, Narsingdi?',
      aBn: 'আনোয়ারা মেডিকেল কমপ্লেক্স নরসিংদী জেলার পলাশ থানার ওয়াপদা সদর রোড, মেডিকেল মোড়ে অবস্থিত। পলাশ ওয়াপদা মোড় থেকে প্রধান সড়ক ধরে মাত্র ১০০ গজ সামনে এগোলেই হাতের কাছে হাসপাতাল ভবনটি দেখতে পাবেন।',
      aEn: 'Anoara Medical Complex is located at Wapda Sadar Road, Medical Morh, Palash, Narsingdi (Post code 1610), just 100 yards from Palash Wapda junction.'
    },
    {
      qBn: 'জরুরি সেবা, অ্যাম্বুলেন্স ও ফার্মেসি কি ২৪ ঘণ্টা চালু থাকে?',
      qEn: 'Are emergency, ambulance, and pharmacy services available 24/7?',
      aBn: 'হ্যাঁ, আনোয়ারা মেডিকেল কমপ্লেক্সে ২৪ ঘণ্টা ইমার্জেন্সি মেডিকেল অফিসার (EMO), সার্বক্ষণিক অক্সিজেন ও নেবুলাইজার সাপোর্ট, আধুনিক এসি অ্যাম্বুলেন্স এবং ইনডোর ফার্মেসি সেবা চালু থাকে।',
      aEn: 'Yes, our emergency medical unit, oxygen & nebulizer support, emergency ambulance, and hospital pharmacy operate 24 hours a day, 7 days a week.'
    },
    {
      qBn: 'ডিজিটাল এক্স-রে, ৪ডি আল্ট্রাসনোগ্রাম ও প্যাথলজি টেস্টের রিপোর্ট কখন ডেলিভারি দেওয়া হয়?',
      qEn: 'When are diagnostic test reports delivered?',
      aBn: 'ডিজিটাল এক্স-রে ও ইসিজি রিপোর্ট তাৎক্ষণিকভাবে প্রিন্ট করে দেওয়া হয়। সাধারণ রক্ত পরীক্ষা ও ইউরিন টেস্টের রিপোর্ট ২-৩ ঘণ্টার মধ্যে এবং কালার ডপলার ৪ডি আল্ট্রাসনোগ্রাম টেস্টের রিপোর্ট অভিজ্ঞ সনোলজিস্টের নিরীক্ষণের পর সেদিনই ডেলিভারি করা হয়।',
      aEn: 'Digital X-Ray and ECG reports are provided immediately. Blood and urine test reports are delivered within 2-3 hours, and 4D USG reports on the same day.'
    },
    {
      qBn: 'বিদেশগামীদের মেডিকেল চেক-আপ এর সুবিধা কি এখানে রয়েছে?',
      qEn: 'Is medical checkup available for overseas workers?',
      aBn: 'হ্যাঁ, আনোয়ারা মেডিকেল কমপ্লেক্স বিদেশগামী ভাই-বোনদের নির্ভুল রক্ত পরীক্ষা, এক্স-রে, শারীরিক চেক-আপ এবং দ্রুত রিপোর্ট প্রদানের বিশেষ সুবিধা দিয়ে থাকে।',
      aEn: 'Yes, we provide medical screenings, chest X-rays, pathology tests, and prompt physical fitness reports for overseas migrant workers.'
    }
  ];

  return (
    <div id="home-page" className="min-h-screen bg-[#F8FAFB]">
      {/* Hero Section */}
      <Hero onNavigate={onNavigate} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">


        {/* Feature Highlights Grid (6 Cards) */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#2D8FC1] uppercase tracking-wider block mb-1">
              {isBn ? 'আমাদের প্রধান সেবাসমূহ' : 'Hospital Core Modules'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0E3A53]">
              {isBn ? 'সবকিছু এক ছাদের নিচে' : 'Comprehensive Care Under One Roof'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              {isBn 
                ? 'পলাশে নির্ভরযোগ্য ডায়াগনস্টিক, বিশেষজ্ঞ চিকিৎসক ও ২৪ ঘণ্টা ইনডোর-আউটডোর স্বাস্থ্যসেবা।' 
                : 'Reliable digital diagnostics, specialist doctor chambers and 24/7 emergency medical care in Palash.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Doctors Schedule */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200/80 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E7F2F8] text-[#2D8FC1] flex items-center justify-center font-bold mb-4 group-hover:bg-[#0E3A53] group-hover:text-white transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#0E3A53] mb-2">{t.nav_doctors}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {isBn 
                    ? 'মেডিসিন, হৃদরোগ, গাইনি, অর্থোপেডিক, শিশু ও ডেন্টাল বিশেষজ্ঞ চিকিৎসকদের চেম্বার ও সময়সূচী।' 
                    : 'Chamber visiting schedules of senior medical specialists from Dhaka and Narsingdi.'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('doctors')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D8FC1] group-hover:text-[#0E3A53] transition cursor-pointer"
              >
                <span>{t.view_details}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Diagnostic Pricing */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200/80 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-4 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#0E3A53] mb-2">{t.nav_diagnostics}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {isBn 
                    ? 'সিবিসি, আল্ট্রাসাউন্ড, ডিজিটাল এক্স-রে, হরমোন ও কিডনি ফাংশন সহ ২০+ টেস্টের ফি ও ডেলিভারি সময়।' 
                    : 'Transparent pricing, fasting instructions and report turnaround times for 20+ laboratory tests.'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('diagnostics')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 transition cursor-pointer"
              >
                <span>{t.view_details}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: 24/7 Emergency & Ambulance */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200/80 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#0E3A53] mb-2">{t.emergency_24hr}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {isBn 
                    ? 'আকস্মিক ট্রমা, দুর্ঘটনা ও প্রসূতি রোগীর জন্য সার্বক্ষণিক মেডিকেল অফিসার ও নিজস্ব অ্যাম্বুলেন্স।' 
                    : 'Round-the-clock emergency medical officer, central oxygen, minor OT and on-demand ambulance.'}
                </p>
              </div>
              <a
                href="tel:01712692504"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{isBn ? 'হটলাইনে কল করুন' : 'Call Emergency Hotline'}</span>
              </a>
            </div>

            {/* Card 4: Clinical & Surgery Services */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200/80 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#0E3A53] mb-2">{t.nav_services}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {isBn 
                    ? 'আধুনিক অপারেশন থিয়েটার (OT), নরমাল ডেলিভারি, ল্যাপারোস্কোপিক সার্জারি ও ডেন্টাল কেয়ার।' 
                    : 'Modern sterile OT, normal delivery, laparoscopic surgery and comprehensive oral dental care.'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition cursor-pointer"
              >
                <span>{t.view_details}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 5: Hospital Facilities Gallery */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200/80 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C9973B] flex items-center justify-center font-bold mb-4 group-hover:bg-[#C9973B] group-hover:text-white transition-colors">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#0E3A53] mb-2">{t.nav_gallery}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {isBn 
                    ? 'আধুনিক অপারেশন থিয়েটার, ভিআইপি শীতাতপ নিয়ন্ত্রিত কেবিন ও ডেন্টাল ইউনিটের বাস্তব ছবি।' 
                    : 'Explore high-resolution photographs of our modular OT, AC cabins, dental studio and wards.'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('gallery')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9973B] hover:text-amber-700 transition cursor-pointer"
              >
                <span>{t.view_details}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 6: Online Serial Booking */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200/80 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0E3A53] flex items-center justify-center font-bold mb-4 group-hover:bg-[#0E3A53] group-hover:text-white transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#0E3A53] mb-2">{t.nav_appointment}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {isBn 
                    ? 'সহজ অনলাইন ফর্মের মাধ্যমে ডাক্তার ও পছন্দমতো সময় নির্ধারণ করে দ্রুত সিরিয়াল নিশ্চিত করুন।' 
                    : 'Book appointments online in seconds and receive your booking reference token code.'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('appointment')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E3A53] hover:text-[#2D8FC1] transition cursor-pointer"
              >
                <span>{t.hero_cta_serial}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Doctors Preview Section */}
        <div className="mb-14 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#2D8FC1] uppercase tracking-wider block mb-1">
                {isBn ? 'বিশেষজ্ঞ চিকিৎসক' : 'Specialist Consultants'}
              </span>
              <h2 className="font-display text-2xl font-bold text-[#0E3A53]">
                {isBn ? 'শীর্ষ চিকিৎসকদের চেম্বার' : 'Renowned Doctor Chambers'}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('doctors')}
              className="inline-flex items-center gap-2 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition self-start sm:self-auto cursor-pointer"
            >
              <span>{isBn ? 'সকল ডাক্তারদের তালিকা' : 'View Full Schedule'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#C9973B]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDoctors.map((doc) => {
              const name = isBn ? doc.name : doc.nameEn;
              const spec = isBn ? doc.specialty : doc.specialtyEn;
              const deg = isBn ? doc.degree : doc.degreeEn;
              const time = isBn ? doc.time : doc.timeEn;

              return (
                <div
                  key={doc.id}
                  className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/70 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-base text-[#0E3A53] mb-1">{name}</h3>
                    <p className="text-xs font-semibold text-[#2D8FC1] mb-2">{spec}</p>
                    <p className="text-xs text-gray-600 mb-4 line-clamp-2">{deg}</p>
                    <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-4">
                      <Clock className="w-3.5 h-3.5 text-[#C9973B]" />
                      <span>{time}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectDoctorForAppointment(`${name} (${spec})`)}
                    className="w-full bg-white hover:bg-[#0E3A53] hover:text-white text-[#0E3A53] border border-gray-200 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#C9973B]" />
                    <span>{t.book_serial}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* SEO & Frequently Asked Questions (Structured for Google Rich Snippets) */}
        <div className="mb-14 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2D8FC1] uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4 text-[#C9973B]" />
              <span>{isBn ? 'সাধারণ জিজ্ঞাসা ও স্বাস্থ্য নির্দেশিকা' : 'Patient FAQs & Hospital Information'}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0E3A53] mb-3">
              {isBn ? 'আনোয়ারা মেডিকেল কমপ্লেক্স সম্পর্কে প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী' : 'Frequently Asked Questions about Anoara Medical Complex'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isBn 
                ? 'পলাশ ও নরসিংদীবাসীর চিকিৎসা সেবা, ডাক্তারের সিরিয়াল গ্রহণ, ডায়াগনস্টিক টেস্ট এবং জরুরি সেবা সম্পর্কিত বিস্তারিত তথ্য।' 
                : 'Essential answers regarding specialist doctor serial bookings, diagnostic tests, 24/7 emergency response, and location directions.'}
            </p>
          </div>

          <div className="space-y-3">
            {homeFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen ? 'border-[#2D8FC1]/40 bg-[#F0F7FA]/60 shadow-xs' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-sm sm:text-base text-[#0E3A53]">
                      {isBn ? faq.qBn : faq.qEn}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#C9973B] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#2D8FC1]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-[#2D8FC1]/15 pt-3">
                      {isBn ? faq.aBn : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Location & Visiting Teaser */}
        <div className="bg-gradient-to-r from-[#0E3A53] to-[#0A2A3D] text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-block bg-white/10 text-[#C9973B] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              {isBn ? 'পলাশ মেডিকেল মোড়' : 'Palash Medical Morh'}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              {isBn ? 'আমাদের সরাসরি খুঁজে পেতে চান?' : 'Need Hospital Directions & Street Map?'}
            </h3>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-4">
              {t.brand_subtitle} — {isBn ? 'পলাশ ওয়াপদা মোড় থেকে মাত্র ১০০ গজ দূরত্বে প্রধান সড়কের পাশেই অবস্থিত।' : 'Conveniently situated only 100 yards from Palash WAPDA junction.'}
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-[#F7EEDC]">
              <MapPin className="w-4 h-4 text-[#C9973B] shrink-0" />
              <span>{isBn ? 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী' : 'Wapda Sadar Road, Medical Morh, Palash, Narsingdi'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto bg-[#C9973B] hover:bg-[#d8a547] text-[#0A2A3D] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow transition cursor-pointer"
            >
              {t.nav_contact}
            </button>
            <a
              href="tel:01712692504"
              className="w-full sm:w-auto text-center bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-white/20 transition"
            >
              01712-692504
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
