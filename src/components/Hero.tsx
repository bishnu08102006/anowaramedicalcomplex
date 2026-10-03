import React from 'react';
import { Phone, Calendar, MapPin, CheckCircle2, ShieldCheck, Clock, Mail, Stethoscope, ChevronRight, Facebook } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageId } from './Header';

interface HeroProps {
  onNavigate: (page: PageId) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { t, isBn } = useLanguage();

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Background Video with Gradient Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/facade.jpg"
          className="w-full h-full object-cover object-center"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2A3D]/90 via-[#0E3A53]/80 to-[#0E3A53]/60" />
      </div>

      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24 lg:py-28">
        <div className="max-w-2xl">
          {/* Domain & Location Badge */}
          <div className="inline-flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 text-white text-xs sm:text-sm px-3.5 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-[#C9973B] animate-pulse" />
            <span className="font-semibold">{t.emergency_24hr}</span>
            <span className="text-white/40">|</span>
            <span className="text-emerald-300 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4" /> {isBn ? 'DIFE নিবন্ধিত' : 'DIFE Certified'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-2 tracking-tight">
            {t.brand_title}
          </h1>

          {/* Bilingual Brand Reference */}
          <p className="text-[#C9973B] text-sm sm:text-base font-bold tracking-wide mb-3">
            {isBn ? 'Anowara Medical Complex • পলাশ, নরসিংদী' : 'আনোয়ারা মেডিকেল কমপ্লেক্স • Palash, Narsingdi'}
          </p>

          {/* Subheading Highlight */}
          <p className="text-[#F7EEDC] text-base sm:text-lg lg:text-xl font-medium leading-relaxed mb-3 max-w-xl">
            {isBn ? 'বিদেশগামীদের মেডিকেল চেক-আপ এর একটি নির্ভরযোগ্য প্রতিষ্ঠান।' : 'A reliable center for overseas migrant health checkups & digital diagnostics.'}
          </p>

          {/* Description */}
          <p className="text-white/80 text-sm md:text-base mb-8 max-w-xl leading-relaxed">
            {t.hero_desc}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              id="hero-call-btn"
              href="tel:01944874304"
              className="inline-flex items-center gap-2.5 bg-[#C9973B] hover:bg-[#d8a547] text-[#0A2A3D] font-bold px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base cursor-pointer"
            >
              <Phone className="w-5 h-5 fill-current" />
              <span>{isBn ? 'সিরিয়ালের জন্য কল করুন' : 'Call for Serial'}</span>
            </a>

            <button
              id="hero-appointment-btn"
              onClick={() => onNavigate('appointment')}
              className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/40 text-white font-semibold px-6 py-3.5 rounded-full backdrop-blur-sm transition-all text-sm md:text-base cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-[#2D8FC1]" />
              <span>{t.hero_cta_serial}</span>
            </button>

            <button
              id="hero-doctor-btn"
              onClick={() => onNavigate('doctors')}
              className="inline-flex items-center gap-2 text-white/90 hover:text-[#C9973B] font-medium px-4 py-3.5 transition-colors text-sm md:text-base cursor-pointer"
            >
              <Stethoscope className="w-5 h-5 text-[#2D8FC1]" />
              <span>{t.nav_doctors}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-3 gap-3 text-white">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isBn ? 'আধুনিক প্যাথলজি' : 'Automated Pathology'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isBn ? 'ডিজিটাল এক্স-রে ও ৪ডি' : 'Digital X-Ray & 4D'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Clock className="w-4 h-4 text-[#C9973B] shrink-0" />
              <span>{isBn ? '২৪ ঘণ্টা ডাক্তার উপস্থিত' : '24/7 Doctors on Duty'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hotline Numbers Bar below Hero */}
      <div className="relative bg-[#0A2A3D] border-t border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-white/85 text-xs md:text-sm">
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2">
            <span className="font-semibold text-[#C9973B] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> {t.hero_hotline_title}
            </span>
            <a href="tel:01972692504" className="bg-[#2D8FC1]/80 hover:bg-[#2D8FC1] text-white font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition shadow-sm">
              <span>☎️ Reception & Emergency:</span>
              <span className="font-mono">01972-692504</span>
            </a>
            <span className="text-white/30 hidden sm:inline">•</span>
            <a href="tel:01712692504" className="hover:text-amber-300 font-medium flex items-center gap-1">
              <span>Hospital Authority:</span>
              <span className="font-mono font-semibold">01712-692504</span>
            </a>
            <span className="text-white/30 hidden sm:inline">•</span>
            <a href="tel:01944874304" className="hover:text-emerald-300 font-medium flex items-center gap-1">
              <span>Serial Desk:</span>
              <span className="font-mono font-semibold">01944-874304</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="mailto:anowaramedicalcomplex11@gmail.com" 
              className="hover:text-[#C9973B] flex items-center gap-1.5 font-medium break-all"
            >
              <Mail className="w-3.5 h-3.5 text-[#2D8FC1]" />
              <span>anowaramedicalcomplex11@gmail.com</span>
            </a>

            <a
              href="https://www.facebook.com/anowaramedicalcomplex01/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1877F2] text-white/90 hover:text-white flex items-center gap-1.5 font-semibold transition bg-white/10 hover:bg-[#1877F2] px-2.5 py-1 rounded-full border border-white/15"
              title="Official Facebook Page"
            >
              <Facebook className="w-3.5 h-3.5 fill-current text-[#1877F2] group-hover:text-white" />
              <span>{isBn ? "ফেসবুক পেজ" : "Facebook"}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
