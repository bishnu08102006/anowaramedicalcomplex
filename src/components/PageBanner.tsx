import React from 'react';
import { ChevronRight, Home, LucideIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PageBannerProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badge?: string;
  currentPageName: string;
  onNavigateHome: () => void;
}

export const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  currentPageName,
  onNavigateHome,
}) => {
  const { isBn } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-[#0E3A53] via-[#0A2A3D] to-[#134563] text-white py-12 md:py-16 relative overflow-hidden border-b border-white/10">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#2D8FC1]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-80 h-80 bg-[#C9973B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-white/70 mb-4">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 hover:text-[#C9973B] transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{isBn ? 'হোম' : 'Home'}</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-white/40" />
          <span className="text-white font-medium">{currentPageName}</span>
        </nav>

        {/* Badge & Title */}
        <div className="max-w-3xl">
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-[#C9973B] mb-3">
              <Icon className="w-3.5 h-3.5" />
              {badge}
            </span>
          )}

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
            {title}
          </h1>

          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
