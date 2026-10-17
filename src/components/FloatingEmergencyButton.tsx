import React, { useState, useEffect } from 'react';
import { Phone, Calendar, ArrowUp, Maximize2, Minimize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageId } from './Header';

interface FloatingEmergencyButtonProps {
  onNavigate: (page: PageId) => void;
  isMinimized: boolean;
  onToggleMinimized: () => void;
}

export const FloatingEmergencyButton: React.FC<FloatingEmergencyButtonProps> = ({
  onNavigate,
  isMinimized,
  onToggleMinimized,
}) => {
  const { t, isBn } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={onToggleMinimized}
          aria-label={isBn ? 'ভাসমান বাটনগুলো দেখান' : 'Show floating buttons'}
          title={isBn ? 'ভাসমান বাটনগুলো দেখান' : 'Show floating buttons'}
          className="w-12 h-12 rounded-full bg-[#0E3A53] text-white shadow-xl border border-white/30 flex items-center justify-center hover:bg-[#164c68] transition-colors cursor-pointer"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-22 right-5 z-40 flex flex-col items-end gap-2.5">
      <button
        type="button"
        onClick={onToggleMinimized}
        aria-label={isBn ? 'ভাসমান বাটনগুলো ছোট করুন' : 'Minimize floating buttons'}
        title={isBn ? 'ভাসমান বাটনগুলো ছোট করুন' : 'Minimize floating buttons'}
        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#0E3A53] shadow-md border border-gray-200 flex items-center justify-center hover:bg-[#0E3A53] hover:text-white transition-colors cursor-pointer"
      >
        <Minimize2 className="w-4 h-4" />
      </button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label={isBn ? "উপরে যান" : "Scroll to top"}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[#0E3A53] shadow-md border border-gray-200 flex items-center justify-center hover:bg-[#0E3A53] hover:text-white transition-all transform hover:-translate-y-1 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Appointment Quick Button */}
      <button
        onClick={() => {
          onNavigate('appointment');
          scrollToTop();
        }}
        className="hidden sm:inline-flex items-center gap-2 bg-white text-[#0E3A53] hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-full shadow-lg text-xs font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer"
      >
        <Calendar className="w-4 h-4 text-[#2D8FC1]" />
        <span>{t.book_serial}</span>
      </button>

      {/* WhatsApp contact button */}
      <a
        id="floating-whatsapp-btn"
        href="https://wa.me/8801712692504"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBD5A] text-white px-2.5 py-1.5 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer text-[11px] sm:text-xs font-bold border border-white/30"
        title={isBn ? "হোয়াটসঅ্যাপে যোগাযোগ করুন: +8801712692504" : "Chat on WhatsApp: +8801712692504"}
      >
        <Phone className="w-3 h-3 text-white fill-current" />
        <span className="tracking-tight">
          WhatsApp
        </span>
      </a>
    </div>
  );
};
