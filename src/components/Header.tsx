import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Menu, 
  X, 
  Calendar, 
  Clock, 
  Stethoscope, 
  FileText, 
  Image as ImageIcon, 
  MapPin, 
  Globe, 
  Home, 
  BookOpen, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Facebook,
  ChevronDown,
  Activity,
  Sparkles,
  QrCode,
  Layers,
  Download
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HospitalLogo } from './HospitalLogo';

export type PageId = 
  | 'home' 
  | 'doctors' 
  | 'diagnostics' 
  | 'services' 
  | 'management'
  | 'gallery' 
  | 'appointment' 
  | 'blog'
  | 'notices' 
  | 'contact'
  | 'admin'
  | 'receptionist'
  | 'verify-staff'
  | 'qr-codes'
  | 'sitemap'
  | 'install';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { setLanguage, t, isBn } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation links directly visible on PC
  const primaryNavLinks: { id: PageId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.nav_home, icon: Home },
    { id: 'doctors', label: isBn ? 'ডাক্তার' : t.nav_doctors, icon: Clock },
    { id: 'diagnostics', label: isBn ? 'পরীক্ষা ও ফি' : t.nav_diagnostics, icon: Activity },
    { id: 'services', label: t.nav_services, icon: Stethoscope },
    { id: 'gallery', label: t.nav_gallery, icon: ImageIcon },
  ];

  // Secondary links inside the sleek glass "More" dropdown
  const secondaryNavLinks: { id: PageId; label: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { 
      id: 'blog', 
      label: t.nav_blog, 
      subtitle: isBn ? 'স্বাস্থ্য পরামর্শ ও টিপস' : 'Health advice & articles',
      icon: BookOpen 
    },
    { 
      id: 'notices', 
      label: t.nav_notices, 
      subtitle: isBn ? 'বিজ্ঞপ্তি ও ক্যাম্প আপডেট' : 'Hospital announcements',
      icon: FileText 
    },
    { 
      id: 'management', 
      label: t.nav_management, 
      subtitle: isBn ? 'পরিচালনা পরিষদ' : 'Executive committee',
      icon: Building2 
    },
    { 
      id: 'contact', 
      label: t.nav_contact, 
      subtitle: isBn ? 'ঠিকানা, লোকেশন ও গুগল ম্যাপ' : 'Address, directions & phones',
      icon: MapPin 
    },
    { 
      id: 'verify-staff', 
      label: isBn ? 'স্টাফ আইডি কার্ড যাচাই' : 'Staff ID Verification', 
      subtitle: isBn ? 'ডিজিটাল কিউআর কোড যাচাই' : 'Digital QR card verify',
      icon: ShieldCheck 
    },
    { 
      id: 'qr-codes', 
      label: isBn ? 'জরুরি কিউআর কোড হাব' : 'Hospital QR Codes Hub', 
      subtitle: isBn ? 'সিরিয়াল, অ্যাম্বুলেন্স ও ম্যাপ QR' : 'Downloadable official QR codes',
      icon: QrCode 
    },
    { 
      id: 'install', 
      label: isBn ? 'ডিভাইসে অ্যাপ ইনস্টল' : 'Install In Your Device', 
      subtitle: isBn ? 'ফোন ও কম্পিউটারে ১-ক্লিক অ্যাপ' : '1-click app for phone & PC',
      icon: Download 
    },
    { 
      id: 'sitemap', 
      label: isBn ? 'সাইটম্যাপ ও ক্যাটাগরি' : 'Sitemap & Categories', 
      subtitle: isBn ? 'সকল পেজ ও ক্যাটাগরি ডিরেক্টরি' : 'Complete pages directory',
      icon: Layers 
    },
  ];

  const morePageIds: PageId[] = ['blog', 'notices', 'management', 'contact', 'verify-staff', 'qr-codes', 'install', 'sitemap', 'receptionist', 'admin'];
  const isMoreActive = morePageIds.includes(currentPage);

  const getHref = (pageId: PageId) => pageId === 'home' ? '/' : `/${pageId}`;

  const handleNavClick = (pageId: PageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="main-header"
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl supports-[backdrop-filter]:bg-white/85 ${
        scrolled 
          ? 'bg-white/95 border-b border-gray-200/80 shadow-[0_8px_30px_rgba(14,58,83,0.08)]' 
          : 'bg-white/85 border-b border-white/70 shadow-[0_4px_20px_rgba(14,58,83,0.04)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 xl:gap-3">
        {/* Brand Logo & Name */}
        <a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          id="brand-logo"
          className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer border-none bg-transparent p-0 shrink-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white/95 p-1 border border-emerald-600/30 shadow-xs backdrop-blur-md group-hover:border-emerald-600 group-hover:scale-105 transition-all shrink-0 flex items-center justify-center overflow-hidden my-auto">
            <HospitalLogo className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="block text-[14px] sm:text-[15.5px] font-extrabold text-[#0E3A53] tracking-tight group-hover:text-[#2D8FC1] transition-colors leading-tight whitespace-nowrap">
              {t.brand_title}
            </span>
            <span className="block text-[10px] sm:text-[11px] font-bold text-[#2D8FC1] leading-none mt-0.5 whitespace-nowrap">
              {t.brand_subtitle}
            </span>
          </div>
        </a>

        {/* Desktop Navigation (Compact, Glassmorphic & Anti-Overlap) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-semibold text-[#0E3A53] shrink-0">
          {primaryNavLinks.map((link) => {
            const isActive = currentPage === link.id;
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={getHref(link.id)}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id);
                }}
                className={`transition-all duration-200 py-1.5 px-2.5 xl:px-3 rounded-xl cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-[11.5px] xl:text-[12.5px] leading-tight font-semibold ${
                  isActive
                    ? 'text-white font-bold bg-[#0E3A53] shadow-xs shadow-[#0E3A53]/25 backdrop-blur-md'
                    : 'text-[#0E3A53] hover:text-[#2D8FC1] hover:bg-white/80 hover:shadow-2xs border border-transparent hover:border-gray-200/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C9973B]' : 'text-[#2D8FC1]'}`} />
                <span>{link.label}</span>
              </a>
            );
          })}

          {/* Prominent High-Visibility Appointment Glass CTA */}
          <a
            href="/appointment"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('appointment');
            }}
            className={`transition-all duration-200 py-1.5 px-3 rounded-xl cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-[11.5px] xl:text-[12.5px] font-bold shadow-xs active:scale-95 ${
              currentPage === 'appointment'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white ring-2 ring-emerald-400 shadow-md'
                : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white hover:shadow-md'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>{isBn ? 'সিরিয়াল বুকিং' : t.nav_appointment}</span>
          </a>

          {/* More Pages Glass Dropdown */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={`transition-all duration-200 py-1.5 px-2.5 xl:px-3 rounded-xl cursor-pointer whitespace-nowrap flex items-center gap-1 text-[11.5px] xl:text-[12.5px] font-semibold ${
                isMoreActive || moreMenuOpen
                  ? 'bg-[#0E3A53]/10 text-[#0E3A53] font-bold border border-[#0E3A53]/20 shadow-2xs'
                  : 'text-[#0E3A53] hover:text-[#2D8FC1] hover:bg-white/80 hover:shadow-2xs border border-transparent hover:border-gray-200/50'
              }`}
            >
              <span>{isBn ? 'আরও' : 'More'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180 text-[#2D8FC1]' : ''}`} />
            </button>

            {/* Dropdown Menu Box */}
            {moreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_12px_40px_rgba(14,58,83,0.18)] p-2 z-50 space-y-0.5 animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
                  {isBn ? 'অন্যান্য পেজসমূহ' : 'Other Pages'}
                </div>
                {secondaryNavLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <a
                      key={item.id}
                      href={getHref(item.id)}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.id);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#0E3A53] text-white font-bold'
                          : 'hover:bg-blue-50/60 text-[#0E3A53]'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-white/20 text-[#C9973B]' : 'bg-[#E7F2F8] text-[#2D8FC1]'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-bold leading-tight">{item.label}</span>
                        <span className={`block text-[10px] truncate ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                          {item.subtitle}
                        </span>
                      </div>
                    </a>
                  );
                })}

                {/* Management & Admin Portals */}
                <div className="border-t border-gray-100 pt-1.5 mt-1.5 space-y-1">
                  <a
                    href="/receptionist"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('receptionist');
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                      currentPage === 'receptionist'
                        ? 'bg-[#0E3A53] text-white font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#2D8FC1]" />
                    <span>{t.nav_receptionist}</span>
                  </a>
                  <a
                    href="/admin"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('admin');
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                      currentPage === 'admin'
                        ? 'bg-[#0E3A53] text-white font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9973B]" />
                    <span>{t.nav_admin}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Controls: Language Switcher, Hotline Button, Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Glass Language Toggle Switcher */}
          <div className="inline-flex items-center bg-white/70 backdrop-blur-md p-0.5 rounded-full border border-gray-200/80 shadow-2xs">
            <button
              onClick={() => setLanguage('bn')}
              id="lang-btn-bn"
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                isBn
                  ? 'bg-[#0E3A53] text-white shadow-xs'
                  : 'text-[#0E3A53] hover:text-[#2D8FC1]'
              }`}
              title="বাংলা ভাষায় দেখুন"
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              id="lang-btn-en"
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                !isBn
                  ? 'bg-[#0E3A53] text-white shadow-xs'
                  : 'text-[#0E3A53] hover:text-[#2D8FC1]'
              }`}
              title="Switch to English"
            >
              English
            </button>
          </div>

          {/* Hotline Action Button - Reception & Emergency */}
          <div className="hidden sm:flex items-center gap-1.5">
            <a
              id="header-call-btn"
              href="tel:01972692504"
              className="inline-flex items-center gap-1.5 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs hover:shadow active:scale-95 whitespace-nowrap border border-white/20 backdrop-blur-xs"
              title={isBn ? "রিসেপশন ও জরুরি: 01972-692504" : "Reception & Emergency: 01972-692504"}
            >
              <Phone className="w-3.5 h-3.5 text-[#C9973B]" />
              <span className="hidden xl:inline">{isBn ? 'জরুরি: 01972-692504' : '01972-692504'}</span>
              <span className="xl:hidden">01972-692504</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#0E3A53] hover:bg-white/80 rounded-xl lg:hidden transition-colors cursor-pointer border border-transparent hover:border-gray-200/60"
            aria-label={mobileMenuOpen ? t.menu_close : t.menu_open}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#0E3A53]" /> : <Menu className="w-5 h-5 text-[#0E3A53]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Glassmorphism & Crisp View) */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation" 
          className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-2xl px-4 py-3 space-y-2 text-[#0E3A53] font-medium shadow-2xl max-h-[82vh] overflow-y-auto animate-fadeIn"
        >
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between pb-2.5 mb-1.5 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#2D8FC1]" />
              {isBn ? 'ভাষা পরিবর্তন:' : 'Change Language:'}
            </span>
            <div className="inline-flex items-center bg-gray-100 p-0.5 rounded-full border border-gray-200">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  isBn ? 'bg-[#0E3A53] text-white shadow-xs' : 'text-[#0E3A53]'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  !isBn ? 'bg-[#0E3A53] text-white shadow-xs' : 'text-[#0E3A53]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Prominent Mobile Appointment Button */}
          <a
            href="/appointment"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('appointment');
            }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-center text-sm font-bold shadow-xs active:scale-95 transition cursor-pointer ${
              currentPage === 'appointment'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white ring-2 ring-emerald-400'
                : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-300" />
            <span>{isBn ? 'অনলাইন সিরিয়াল বুকিং করুন' : 'Book Online Serial'}</span>
          </a>

          {/* Primary Mobile Navigation Links */}
          <div className="grid grid-cols-1 gap-1 pt-1">
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <a
                  key={link.id}
                  href={getHref(link.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.id);
                  }}
                  className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl text-left text-xs sm:text-sm font-semibold cursor-pointer transition ${
                    isActive
                      ? 'bg-[#0E3A53] text-white font-bold shadow-xs'
                      : 'hover:bg-gray-50 text-[#0E3A53]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9973B]' : 'text-[#2D8FC1]'}`} />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Secondary Mobile Links */}
          <div className="border-t border-gray-100 pt-2 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-2">
              {isBn ? 'অন্যান্য বিভাগ' : 'Other Sections'}
            </span>
            {secondaryNavLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <a
                  key={item.id}
                  href={getHref(item.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl text-left text-xs font-semibold cursor-pointer transition ${
                    isActive
                      ? 'bg-[#0E3A53] text-white font-bold'
                      : 'hover:bg-gray-50 text-[#0E3A53]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9973B]' : 'text-[#2D8FC1]'}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Portals & Direct Hospital Hotlines */}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <a
                href="/receptionist"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('receptionist');
                }}
                className="flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-[#0E3A53] py-2 rounded-xl text-xs font-semibold border border-blue-100 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#2D8FC1]" />
                <span>{t.nav_receptionist}</span>
              </a>
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('admin');
                }}
                className="flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 py-2 rounded-xl text-xs font-semibold border border-amber-100 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9973B]" />
                <span>{t.nav_admin}</span>
              </a>
            </div>

            <a
              href="https://www.facebook.com/anowaramedicalcomplex01/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white py-2 rounded-xl font-semibold text-xs shadow-xs transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Facebook className="w-4 h-4 fill-current" />
              <span>{isBn ? 'অফিসিয়াল ফেসবুক পেজ' : 'Official Facebook Page'}</span>
            </a>

            {/* Reception + Emergency Call */}
            <a
              href="tel:01972692504"
              className="flex items-center justify-center gap-2 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Phone className="w-3.5 h-3.5 text-[#C9973B]" />
              <span>{isBn ? 'রিসেপশন ও জরুরি: 01972-692504' : 'Reception & Emergency: 01972-692504'}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

