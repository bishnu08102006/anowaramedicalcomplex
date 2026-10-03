import React from 'react';
import { Phone, Mail, MapPin, ArrowUpRight, ShieldCheck, Clock, ChevronRight, Facebook } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageId } from './Header';
import { HospitalLogo } from './HospitalLogo';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, isBn } = useLanguage();
  const currentYear = new Date().getFullYear();

  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-[#0A2A3D] text-white/80 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About & Address */}
        <div className="md:col-span-1 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-white p-1 border border-white/20 shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
              <HospitalLogo className="w-full h-full" />
            </div>
            <span className="font-display text-white text-xl font-bold">
              {t.brand_title}
            </span>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed mb-5 text-white/70">
            {t.footer_desc}
          </p>

          <button
            onClick={() => handleNav('contact')}
            className="text-xs inline-flex items-center gap-1.5 text-[#C9973B] hover:text-white transition font-medium cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>{t.contact_address_value} →</span>
          </button>

          {/* Official Facebook Page Button */}
          <div className="mt-4 pt-3.5 border-t border-white/10">
            <a
              href="https://www.facebook.com/anowaramedicalcomplex01/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Facebook className="w-4 h-4 fill-current" />
              <span>{isBn ? 'অফিসিয়াল ফেসবুক পেজ' : 'Official Facebook Page'}</span>
            </a>
          </div>
        </div>

        {/* Quick Page Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-xs tracking-wider uppercase border-b border-white/10 pb-2">
            {isBn ? 'ওয়েবসাইট পেজসমূহ' : 'Website Pages'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => handleNav('home')}
                className="hover:text-[#C9973B] transition cursor-pointer flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3 text-[#2D8FC1]" /> {t.nav_home}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('doctors')}
                className="hover:text-[#C9973B] transition cursor-pointer flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3 text-[#2D8FC1]" /> {t.nav_doctors}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('diagnostics')}
                className="hover:text-[#C9973B] transition cursor-pointer flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3 text-[#2D8FC1]" /> {t.nav_diagnostics}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('services')}
                className="hover:text-[#C9973B] transition cursor-pointer flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3 text-[#2D8FC1]" /> {t.nav_services}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('management')}
                className="hover:text-[#C9973B] transition cursor-pointer flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3 text-[#2D8FC1]" /> {t.nav_management}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('gallery')}
                className="hover:text-[#C9973B] transition cursor-pointer flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3 text-[#2D8FC1]" /> {t.nav_gallery}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('blog')}
                className="hover:text-[#C9973B] transition cursor-pointer flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3 text-[#2D8FC1]" /> {t.nav_blog}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('notices')}
                className="hover:text-[#C9973B] transition cursor-pointer flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3 text-[#2D8FC1]" /> {t.nav_notices}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('qr-codes')}
                className="hover:text-[#C9973B] transition cursor-pointer flex items-center gap-1 text-amber-300 font-semibold"
              >
                <ChevronRight className="w-3 h-3 text-[#C9973B]" /> {isBn ? 'জরুরি কিউআর কোড হাব' : 'Hospital QR Codes'}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('install')}
                className="hover:text-[#C9973B] transition cursor-pointer flex items-center gap-1 text-cyan-300 font-semibold"
              >
                <ChevronRight className="w-3 h-3 text-[#2D8FC1]" /> {isBn ? 'ডিভাইসে অ্যাপ ইনস্টল' : 'Install In Your Device'}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('sitemap')}
                className="hover:text-[#C9973B] transition cursor-pointer flex items-center gap-1 text-emerald-300"
              >
                <ChevronRight className="w-3 h-3 text-[#2D8FC1]" /> {isBn ? 'সাইটম্যাপ ও ক্যাটাগরি' : 'Sitemap & Categories'}
              </button>
            </li>
            <li className="pt-2 border-t border-white/10 mt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleNav('receptionist')}
                  className="hover:text-[#C9973B] transition cursor-pointer text-[11px] text-blue-300"
                >
                  {t.nav_receptionist}
                </button>
                <span className="text-white/30">•</span>
                <button
                  onClick={() => handleNav('admin')}
                  className="hover:text-[#C9973B] transition cursor-pointer text-[11px] text-amber-300"
                >
                  {t.nav_admin}
                </button>
                <span className="text-white/30">•</span>
                <button
                  onClick={() => handleNav('verify-staff')}
                  className="hover:text-[#C9973B] transition cursor-pointer text-[11px] text-emerald-300"
                >
                  {isBn ? "স্টাফ আইডি" : "Staff ID"}
                </button>

              </div>
            </li>
          </ul>
        </div>

        {/* Serial & Contact Phone Numbers */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-xs tracking-wider uppercase border-b border-white/10 pb-2 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#C9973B]" /> {t.contact_phone_title}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="tel:01972692504" className="hover:text-[#C9973B] transition flex items-center justify-between text-emerald-300 font-bold bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/15">
                <span className="text-white/90">{isBn ? 'রিসেপশন ও জরুরি:' : 'Reception & Emergency:'}</span>
                <span className="font-mono text-white">01972-692504</span>
              </a>
            </li>
            <li>
              <a href="tel:01712692504" className="hover:text-[#C9973B] transition flex items-center justify-between px-2.5 py-1 text-amber-200">
                <span className="text-white/80">{isBn ? 'হাসপাতাল কর্তৃপক্ষ:' : 'Hospital Authority:'}</span>
                <span className="font-mono font-semibold text-white">01712-692504</span>
              </a>
            </li>
            <li>
              <a href="tel:01944874304" className="hover:text-[#C9973B] transition flex items-center justify-between px-2.5 py-1">
                <span className="text-white/70">{isBn ? 'সিরিয়াল ডেস্ক:' : 'Serial Desk:'}</span>
                <span className="font-mono font-semibold text-white">01944-874304</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Email & 24/7 Status */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-xs tracking-wider uppercase border-b border-white/10 pb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#2D8FC1]" /> {t.contact_hours_title}
          </h4>
          <ul className="space-y-3 text-xs">
            <li>
              <a
                href="mailto:anowaramedicalcomplex11@gmail.com"
                className="hover:text-[#C9973B] transition break-all flex items-start gap-2"
              >
                <Mail className="w-4 h-4 text-[#2D8FC1] shrink-0 mt-0.5" />
                <span>anowaramedicalcomplex11@gmail.com</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/anowaramedicalcomplex01/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-[#1877F2] transition flex items-center gap-2 group"
              >
                <Facebook className="w-4 h-4 text-[#1877F2] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate">{isBn ? "ফেসবুক পেজ ফলো করুন" : "Follow on Facebook"}</span>
                <ArrowUpRight className="w-3 h-3 text-white/40 group-hover:text-[#1877F2]" />
              </a>
            </li>
            <li className="pt-2 flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#AE3B2E]" />
              </span>
              <span className="text-white font-medium text-xs">{t.emergency_24hr}</span>
            </li>
            <li className="pt-1">
              <button
                onClick={() => handleNav('appointment')}
                className="inline-flex items-center gap-1 text-xs text-[#2D8FC1] hover:underline cursor-pointer"
              >
                <span>{t.appt_page_title}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60 px-4">
        © {currentYear} <a href="https://anowaramedicalcomplex.com/" className="text-white hover:text-[#C9973B] font-semibold underline underline-offset-2">anowaramedicalcomplex.com</a> — {t.footer_rights}
      </div>

      {/* DIFE Trust Badge in Footer matching original */}
      <div className="border-t border-gray-700/60 pt-3 pb-3 px-4 text-center text-xs text-gray-300 bg-slate-950/60">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700 shadow-sm max-w-4xl mx-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-left text-[11px] sm:text-xs">
            {t.footer_dife_badge}
          </span>
        </div>
      </div>

      {/* Developer Credit Line (Very Small) */}
      <div className="border-t border-white/5 py-2.5 px-4 text-center bg-slate-950/90 text-[10px] sm:text-[11px] text-gray-400/75">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 max-w-4xl mx-auto">
          <span>Developed by: <span className="text-gray-300 font-medium">Bishnu Das</span></span>
          <span className="text-white/20 hidden sm:inline">•</span>
          <a
            href="mailto:bishnu29198@gmail.com"
            className="hover:text-[#2D8FC1] transition underline underline-offset-2"
          >
            bishnu29198@gmail.com
          </a>
          <span className="text-white/20 hidden sm:inline">•</span>
          <a
            href="https://wa.me/8801762371237"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 transition"
          >
            WhatsApp/Phone: <span className="text-gray-300">+8801762371237</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
