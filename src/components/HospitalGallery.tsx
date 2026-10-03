import React, { useState } from 'react';
import { Eye, X, ZoomIn, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { GalleryItem } from '../data/gallery';

interface HospitalGalleryProps {
  onNavigateGallery?: () => void;
}

export const HospitalGallery: React.FC<HospitalGalleryProps> = ({ onNavigateGallery }) => {
  const { galleryItems } = useData();
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  // Take the first 6 items for the homepage showcase
  const displayItems = galleryItems && galleryItems.length > 0 ? galleryItems.slice(0, 6) : [];

  return (
    <section id="gallery" className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-4">
        <div className="max-w-2xl">
          <span className="text-[#2D8FC1] font-bold text-sm tracking-wider uppercase flex items-center gap-1.5 mb-1.5">
            <ImageIcon className="w-4 h-4" /> ভেতরে ঘুরে দেখুন
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-[#0E3A53] font-bold mt-1 mb-3">
            আমাদের হাসপাতাল প্রাঙ্গণ ও সুযোগ-সুবিধা
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            আনোয়ারা মেডিকেল কমপ্লেক্সের আন্তর্জাতিক মানসম্পন্ন ওটি, আধুনিক কেবিন, জেনারেল ওয়ার্ড ও প্যাথলজি ইউনিট।
          </p>
        </div>

        {onNavigateGallery && (
          <button
            onClick={onNavigateGallery}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0E3A53] hover:text-[#2D8FC1] bg-gray-100 hover:bg-gray-200/80 px-4 py-2.5 rounded-xl transition self-start md:self-auto cursor-pointer"
          >
            <span>সম্পূর্ণ ফটো গ্যালারি দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Gallery Grid matching responsive bento layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {displayItems.map((item, idx) => {
          // Make first item stand out on medium/large screens if 5 or more items
          const isFeatured = idx === 0 && displayItems.length >= 4;
          const spanClass = isFeatured ? 'sm:col-span-2 sm:row-span-2 min-h-[320px] sm:min-h-[420px]' : 'min-h-[240px]';

          return (
            <div
              key={item.id || idx}
              onClick={() => setActivePhoto(item)}
              className={`gallery-item rounded-2xl relative group cursor-pointer shadow-sm border border-gray-200 overflow-hidden ${spanClass}`}
            >
              <img
                src={item.src}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Category pill */}
              <span className="absolute top-3.5 left-3.5 bg-[#0E3A53]/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
                {item.categoryLabel || item.category}
              </span>

              {/* Hover overlay with title and zoom icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6 text-white">
                <span className="inline-flex items-center gap-1 text-[11px] bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full w-fit mb-2">
                  <ZoomIn className="w-3 h-3 text-[#C9973B]" /> বড় করে দেখুন
                </span>
                <h4 className="font-bold text-sm md:text-lg text-white font-display leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-white/80 line-clamp-2 mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white p-2.5 rounded-full transition cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="p-5 md:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
              <div>
                <span className="text-[11px] text-[#C9973B] font-semibold uppercase tracking-wider block mb-0.5">
                  {activePhoto.categoryLabel || activePhoto.category}
                </span>
                <h3 className="text-lg md:text-xl font-bold font-display text-white">
                  {activePhoto.title}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {activePhoto.desc}
                </p>
              </div>
              <a
                href="#appointment"
                onClick={() => setActivePhoto(null)}
                className="bg-[#C9973B] hover:bg-[#d4a347] text-[#0E3A53] font-bold text-xs md:text-sm px-5 py-2.5 rounded-full self-start sm:self-auto transition shrink-0"
              >
                সিরিয়াল বুক করুন
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
