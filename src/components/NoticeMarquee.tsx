import React, { useState } from 'react';
import { AlertCircle, Pause, Play, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

interface NoticeMarqueeProps {
  onNavigateToNotices?: () => void;
}

export const NoticeMarquee: React.FC<NoticeMarqueeProps> = ({ onNavigateToNotices }) => {
  const { t, isBn } = useLanguage();
  const { notices, emergencyNotice } = useData();
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (emergencyNotice && emergencyNotice.enabled === false) {
    return null;
  }

  const hotline = emergencyNotice?.hotline || '01712-692504';
  const prefix = isBn 
    ? (emergencyNotice?.badgeBn || t.marquee_prefix) 
    : (emergencyNotice?.badgeEn || 'EMERGENCY');

  const marqueeContent = emergencyNotice && (isBn ? emergencyNotice.textBn : emergencyNotice.textEn)
    ? (isBn ? emergencyNotice.textBn : emergencyNotice.textEn) + `  |  ${isBn ? 'হটলাইন: ' : 'Hotline: '}${hotline}`
    : (notices.length > 0
        ? notices.map(n => isBn ? `${n.badge}: ${n.title}` : `${n.badgeEn}: ${n.titleEn}`).join('  |  ') + `  |  ${isBn ? 'সিরিয়াল হটলাইন: ' : 'Serial Hotline: '}${hotline}`
        : t.marquee_text);

  const isFrozen = isPaused || isHovered;

  return (
    <div 
      id="emergency-notice-bar"
      className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs md:text-sm font-medium py-2 px-3 md:px-6 flex items-center justify-between overflow-hidden shadow-sm relative z-40 group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 md:gap-3 flex-1 overflow-hidden">
        <button
          onClick={onNavigateToNotices}
          className="bg-white text-red-600 font-bold px-2 py-0.5 rounded shrink-0 uppercase tracking-wider text-[10px] md:text-xs flex items-center gap-1 shadow-sm hover:bg-red-50 transition cursor-pointer"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {prefix}
        </button>
        
        <div 
          className="overflow-hidden whitespace-nowrap flex-1 cursor-pointer"
          onClick={() => {
            if (onNavigateToNotices) {
              onNavigateToNotices();
            } else {
              setIsPaused(!isPaused);
            }
          }}
          title={isBn ? "মাউস রাখলে নোটিশ আটকে থাকবে | ক্লিক করে সব নোটিশ দেখুন" : "Hover mouse to pause | Click to view full notice board"}
        >
          <div 
            className="inline-block transition-opacity"
            style={{
              animation: 'marqueeAnimation 60s linear infinite',
              animationPlayState: isFrozen ? 'paused' : 'running',
              paddingLeft: '100%',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              willChange: 'transform',
            }}
          >
            {marqueeContent}
          </div>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0 ml-3 pl-3 border-l border-white/20">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 text-[11px] flex items-center gap-1 cursor-pointer"
          aria-label={isFrozen ? (isBn ? "নোটিশ চালু করুন" : "Play notice") : (isBn ? "নোটিশ থামান" : "Pause notice")}
          title={isFrozen ? (isBn ? "চালু করুন" : "Play") : (isBn ? "পজ করুন" : "Pause")}
        >
          {isFrozen ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          <span className="hidden md:inline">{isFrozen ? (isBn ? 'থামানো' : 'Paused') : (isBn ? 'চলছে' : 'Running')}</span>
        </button>
        <a 
          href={`tel:${hotline.replace(/[^0-9]/g, '')}`}
          className="bg-white/20 hover:bg-white text-white hover:text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all"
        >
          <PhoneCall className="w-3 h-3" />
          <span>{hotline}</span>
        </a>
      </div>

      <style>{`
        @keyframes marqueeAnimation {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>
    </div>
  );
};
