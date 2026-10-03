import React from 'react';
import { 
  Stethoscope, 
  Activity, 
  Sparkles, 
  Clock, 
  HeartPulse, 
  Baby, 
  Eye, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight,
  Phone
} from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { useLanguage } from '../context/LanguageContext';
import { PageId } from '../components/Header';

interface ServicesPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: PageId) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigateHome, onNavigate }) => {
  const { t, isBn } = useLanguage();

  const diagnosticServices = [
    {
      title: isBn ? "৪ডি কালার ডপলার ও আল্ট্রাসনোগ্রাম" : "4D Color Doppler & Ultrasound",
      desc: isBn ? "অভিজ্ঞ সোনোলজিস্ট দ্বারা গর্ভবতী মায়েদের ৪ডি কালার ডপলার, পেটের সকল আল্ট্রাসনোগ্রাম নির্ভুলভাবে সম্পন্ন হয়।" : "Performed by senior clinical sonologists with high-resolution probes for maternal-fetal & whole abdomen scans.",
    },
    {
      title: isBn ? "সম্পূর্ণ স্বয়ংক্রিয় প্যাথলজি ও বায়োকেমিস্ট্রি" : "Fully Automated Pathology & Biochemistry",
      desc: isBn ? "জাপানি ও জার্মান টেকনোলজির অ্যানালাইজার দ্বারা সিবিসি, লিপিড প্রোফাইল, লিভার, কিডনি ও হরমোন টেস্টের দ্রুততম রিপোর্ট।" : "Equipped with Japanese & German automated analyzers for CBC, biochemistry, hormonal and liver-kidney profiling.",
    },
    {
      title: isBn ? "ডিজিটাল এক্স-রে (High Frequency)" : "High-Frequency Digital X-Ray",
      desc: isBn ? "বুক, মেরুদণ্ড, হাড় ও জয়েন্টের ন্যূনতম রেডিয়েশনে নিখুঁত ক্রিস্টাল ক্লিয়ার ডিজিটাল ফিল্ম ইমেজ।" : "Low radiation exposure high-resolution digital imaging for chest, spine, orthopaedics and skeletal diagnostics.",
    },
    {
      title: isBn ? "১২ চ্যানেল ডিজিটাল ইসিজি ও ইকোকার্ডিওগ্রাফি" : "12-Channel Digital ECG & Echo",
      desc: isBn ? "হৃদরোগীদের সঠিক রোগ নির্ণয়ে ২৪ ঘণ্টা জরুরি ইসিজি এবং বিশেষজ্ঞ দ্বারা কালার ডপলার ইকোকার্ডিওগ্রাফি।" : "Immediate round-the-clock 12-channel ECG readings and specialist 2D color echo evaluation for cardiac patients.",
    },
    {
      title: isBn ? "ভিডিও এন্ডোস্কোপি ও কোলনোস্কোপি" : "Video Endoscopy & Colonoscopy",
      desc: isBn ? "পরিপাকতন্ত্রের আলসার, রক্তক্ষরণ বা টিউমার নির্ণয়ে আন্তর্জাতিক মানের হাই-ডেফিনিশন ভিডিও এন্ডোস্কোপি সেবা।" : "High-definition endoscopic visualization of gastrointestinal tract, ulcers, and polyp screening.",
    },
    {
      title: isBn ? "বিদেশগামীদের ওয়ান-স্টপ মেডিকেল চেকআপ" : "One-Stop Migrant Medical Checkup",
      desc: isBn ? "মধ্যপ্রাচ্য ও ইউরোপগামী কর্মীদের সকল রুটিন ও স্পেশালাইজড মেডিকেল চেকআপ এবং অফিসিয়াল ফিটনেস রিপোর্ট।" : "Certified fast-track health clearance diagnostics for Middle East, Gulf and European travel authorization.",
    }
  ];

  const clinicalServices = [
    {
      title: isBn ? "আধুনিক অপারেশন থিয়েটার (OT)" : "State-of-the-Art Operation Theatre (OT)",
      desc: isBn ? "হেপা-ফিল্টার যুক্ত জীবাণুমুক্ত পরিবেশে জেনারেল সার্জারি, অর্থোপেডিক ও সিজারিয়ান ডেলিভারির সুব্যবস্থা।" : "HEPA-filtered sterile surgical suite for general surgery, trauma orthopaedics, and obstetric c-sections.",
    },
    {
      title: isBn ? "নরমাল ডেলিভারি ও প্রসূতি সেবা" : "Normal Delivery & Maternal Care",
      desc: isBn ? "অভিজ্ঞ মহিলা ডাক্তার ও নার্সদের সার্বক্ষণিক তত্ত্বাবধানে নিরাপদ নরমাল ডেলিভারি ইউনিট।" : "Safe natural delivery facility led by experienced female obstetricians and certified midwives 24/7.",
    },
    {
      title: isBn ? "ল্যাপারোস্কোপিক (লেজার) সার্জারি" : "Laparoscopic Minimally Invasive Surgery",
      desc: isBn ? "পেট না কেটে ছোট ছিদ্রের মাধ্যমে পিত্তথলির পাথর, অ্যাপেন্ডিক্স ও হার্নিয়ার আধুনিক অপারেশন।" : "Keyhole surgery for gallstones, appendicitis, and hernia ensuring faster recovery and minimal scarring.",
    },
    {
      title: isBn ? "আধুনিক ওরাল ও ডেন্টাল ইউনিট" : "Modern Oral & Dental Studio",
      desc: isBn ? "স্কেলিং, ফিলিং, রুট ক্যানেল ট্রিটমেন্ট (RCT), আঁকাবাঁকা দাঁত সোজা ও ডেন্টাল ইমপ্ল্যান্ট সেবা।" : "Ultrasonic scaling, light-cure filling, painless root canal treatment (RCT), extractions, and prosthetics.",
    },
    {
      title: isBn ? "ভিআইপি এসি কেবিন ও জেনারেল ওয়ার্ড" : "VIP AC Cabins & Hygienic Wards",
      desc: isBn ? "রোগী ও স্বজনদের সর্বোচ্চ আরামের জন্য আধুনিক সুযোগ-সুবিধা সম্বলিত নিরিবিলি এসি কেবিন।" : "Spacious air-conditioned private suites with nurse call stations and clean, well-ventilated general wards.",
    },
    {
      title: isBn ? "নবজাতক ও শিশু চিকিৎসা ইউনিট" : "Neonatal & Paediatric Care",
      desc: isBn ? "ফটোক্যাবিনেট, ইনফ্যান্ট ওয়ার্মার ও বিশেষজ্ঞ শিশু চিকিৎসকদের সার্বক্ষণিক পর্যবেক্ষণ সুবিধা।" : "Infant phototherapy, warmers, and expert paediatric consultants ensuring gentle care for newborns.",
    }
  ];

  const emergencyPoints = [
    isBn ? "২৪ ঘণ্টা ইনডোর-আউটডোর অভিজ্ঞ মেডিকেল অফিসার অন-কল" : "24/7 experienced Medical Officers and emergency nursing staff on active duty",
    isBn ? "সার্বক্ষণিক সেন্ট্রাল অক্সিজেন ও নেবুলাইজার সাপোর্ট" : "Continuous high-flow oxygen supply and emergency nebulization systems",
    isBn ? "আকস্মিক ট্রমা, সড়ক দুর্ঘটনা ও পোড়া রোগীর জরুরি প্রাথমিক চিকিৎসা" : "Acute trauma stabilization, emergency suturing, wound dressing and burn triage",
    isBn ? "পলাশ ও নরসিংদী সহ যেকোনো দূরত্বে সার্বক্ষণিক নিজস্ব অ্যাম্বুলেন্স সার্ভিস" : "Dedicated on-demand emergency ambulance service for Palash, Narsingdi & Dhaka transfers",
    isBn ? "জরুরি রক্ত পরীক্ষা ও ইনস্ট্যান্ট ইসিজি ডেলিভারি ব্যবস্থা" : "STAT emergency blood investigations, typing, and 15-minute ECG interpretation",
    isBn ? "নিরবচ্ছিন্ন বিদ্যুৎ সরবরাহে স্বয়ংক্রিয় জেনারেটর ব্যাকআপ" : "Uninterrupted heavy-duty automatic generator power backup for OT and critical wards",
  ];

  return (
    <div id="services-page" className="min-h-screen bg-[#F8FAFB]">
      <PageBanner
        title={t.services_page_title}
        subtitle={t.services_page_subtitle}
        icon={Stethoscope}
        badge={isBn ? "উন্নত চিকিৎসাসেবা" : "Advanced Healthcare"}
        currentPageName={t.nav_services}
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Hospital Service Hours Schedule: OPD-24h & LAB 8:00 AM to 10:00 PM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* OPD - 24h Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                    {isBn ? "বহির্বিভাগ ও জরুরি চিকিৎসা" : "Outpatient Department"}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#0E3A53] tracking-tight">
                  OPD — <span className="text-emerald-600">24h</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isBn ? "সার্বক্ষণিক দিনরাত ২৪ ঘণ্টা ডাক্তার সেবা ও প্রাথমিক চিকিৎসা" : "24/7 continuous outpatient care, emergency doctor & triage"}
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
                {isBn ? "২৪ ঘণ্টা চালু" : "24 Hours Open"}
              </span>
            </div>
          </div>

          {/* LAB - 8:00 AM to 10:00 PM Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#2D8FC1]/30 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#E7F2F8] text-[#2D8FC1] flex items-center justify-center shrink-0 border border-[#2D8FC1]/20">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2D8FC1] uppercase tracking-wide">
                    {isBn ? "ডায়াগনস্টিক ল্যাবরেটরি ও প্যাথলজি" : "Diagnostic Laboratory"}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#0E3A53] tracking-tight">
                  LAB — <span className="text-[#2D8FC1]">8:00 AM to 10:00 PM</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isBn ? "সকাল ৮:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত নমুনা সংগ্রহ ও পরীক্ষা" : "Blood & pathology sample collection 8:00 AM – 10:00 PM"}
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1 bg-[#E7F2F8] text-[#0E3A53] text-xs font-bold px-3 py-1.5 rounded-full border border-[#2D8FC1]/20">
                {isBn ? "৮:০০ AM - ১০:০০ PM" : "8:00 AM - 10:00 PM"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Emergency 24/7 Highlights */}
        <div className="bg-gradient-to-br from-[#0E3A53] via-[#0A2A3D] to-[#12425e] text-white rounded-3xl p-6 sm:p-10 shadow-lg mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                {t.services_emergency_badge}
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                <span>OPD 24h</span>
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
              {t.services_emergency_title}
            </h2>

            <p className="text-white/80 text-sm sm:text-base max-w-2xl mb-8 leading-relaxed">
              {isBn 
                ? 'আকস্মিক যেকোনো দুর্ঘটনায় বা আশঙ্কাজনক অবস্থায় দেরি না করে সরাসরি আমাদের জরুরি বিভাগে নিয়ে আসুন। আমাদের ইমার্জেন্সি টিম দিনরাত ২৪ ঘণ্টা প্রস্তুত।'
                : 'For any acute traumatic injury, breathing distress, or obstetric emergency, our 24-hour department provides immediate clinical intervention.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {emergencyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10 text-xs sm:text-sm text-white/95">
                  <CheckCircle2 className="w-4 h-4 text-[#C9973B] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="tel:01972692504"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-3 rounded-full shadow transition cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{isBn ? 'জরুরি ও রিসেপশন: 01972-692504' : 'Emergency & Reception: 01972-692504'}</span>
              </a>
              <a
                href="tel:01944874304"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3 rounded-full border border-white/25 transition cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#C9973B]" />
                <span>{isBn ? 'সিরিয়াল ডেস্ক: 01944-874304' : 'Serial Desk: 01944-874304'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical & Surgical Services */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#2D8FC1] uppercase tracking-wider block mb-1">
                {isBn ? 'আধুনিক চিকিৎসা ও সার্জারি' : 'Clinical & Surgical Excellence'}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0E3A53]">
                {t.services_surgery_title}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('doctors')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0E3A53] hover:text-[#2D8FC1] bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm transition cursor-pointer self-start sm:self-auto"
            >
              <span>{t.services_doctor_link}</span>
              <ChevronRight className="w-4 h-4 text-[#C9973B]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinicalServices.map((srv, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E7F2F8] text-[#2D8FC1] flex items-center justify-center font-bold mb-4">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#0E3A53] mb-2">{srv.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{srv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Diagnostic Laboratory Services */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#2D8FC1] uppercase tracking-wider">
                  {isBn ? 'নির্ভুল রিপোর্ট' : 'High Accuracy Diagnostics'}
                </span>
                <span className="inline-flex items-center gap-1 bg-[#E7F2F8] text-[#0E3A53] text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#2D8FC1]/20">
                  <Clock className="w-3 h-3 text-[#2D8FC1]" />
                  <span>LAB: 8:00 AM – 10:00 PM</span>
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0E3A53]">
                {t.services_diag_title}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('diagnostics')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-[#0E3A53] hover:bg-[#0A2A3D] px-4 py-2 rounded-xl shadow transition cursor-pointer self-start sm:self-auto"
            >
              <span>{t.services_pricing_link}</span>
              <ChevronRight className="w-4 h-4 text-[#C9973B]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagnosticServices.map((srv, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200/80"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#0E3A53] mb-2">{srv.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
