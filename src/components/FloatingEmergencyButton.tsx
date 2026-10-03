import React, { useState, useEffect } from 'react';
import { Phone, Calendar, ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageId } from './Header';

interface FloatingEmergencyButtonProps {
  onNavigate: (page: PageId) => void;
}

export const FloatingEmergencyButton: React.FC<FloatingEmergencyButtonProps> = ({ onNavigate }) => {
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

  return (
    <div className="fixed bottom-22 right-5 z-40 flex flex-col items-end gap-2.5">
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

      {/* Reception & Emergency Floating Call Button - Compact & Sleek */}
      <a
        id="floating-call-btn"
        href="tel:01972692504"
        className="flex items-center gap-1.5 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white px-2.5 py-1.5 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer text-[11px] sm:text-xs font-bold border border-white/20"
        title={isBn ? "রিসেপশন ও জরুরি: 01972-692504" : "Reception & Emergency: 01972-692504"}
      >
        <Phone className="w-3 h-3 text-[#C9973B] fill-current" />
        <span className="tracking-tight">
          {isBn ? 'জরুরি: 01972-692504' : 'Emergency: 01972-692504'}
        </span>
      </a>
    </div>
  );
};
