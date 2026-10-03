import React, { useState, useEffect, useMemo } from 'react';
import { Image as ImageIcon, Maximize2, X, ChevronLeft, ChevronRight, CheckCircle2, Search, Sparkles, Filter } from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { PageId } from '../components/Header';
import { GALLERY_CATEGORIES, GalleryItem } from '../data/gallery';

interface GalleryPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: PageId) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigateHome, onNavigate }) => {
  const { t, isBn } = useLanguage();
  const { galleryItems } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Compute category counts
  const categoryOptions = useMemo(() => {
    const list = [...GALLERY_CATEGORIES];
    // Also include any custom categories that might have been added by admin
    galleryItems.forEach(item => {
      if (item.category && !list.some(c => c.id === item.category)) {
        list.push({
          id: item.category,
          labelBn: item.categoryLabel || item.category,
          labelEn: item.categoryLabelEn || item.category
        });
      }
    });
    return list;
  }, [galleryItems]);

  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        (item.titleEn && item.titleEn.toLowerCase().includes(q)) ||
        item.desc.toLowerCase().includes(q) ||
        (item.descEn && item.descEn.toLowerCase().includes(q)) ||
        (item.categoryLabel && item.categoryLabel.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [galleryItems, selectedCategory, searchQuery]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeImageIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveImageIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, filteredItems.length]);

  const handlePrev = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
  };

  const handleNext = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
  };

  return (
    <div id="gallery-page" className="min-h-screen bg-[#F8FAFB]">
      <PageBanner
        title={t.gallery_page_title}
        subtitle={t.gallery_page_subtitle}
        icon={ImageIcon}
        badge={isBn ? "বাস্তব স্থিরচিত্র ও সুযোগ-সুবিধা" : "Hospital Campus Photo Gallery"}
        currentPageName={t.nav_gallery}
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Controls Bar: Search & Admin Link */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-sm mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "ছবি, ওটি, কেবিন বা বিভাগ খুঁজুন..." : "Search photos, cabins, OT, diagnostics..."}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9973B]" />
              {isBn ? `মোট ছবি: ${filteredItems.length} টি` : `Showing ${filteredItems.length} photos`}
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {categoryOptions.map((cat) => {
            const count = cat.id === 'all'
              ? galleryItems.length
              : galleryItems.filter(i => i.category === cat.id).length;
            
            // Only show category if it has items or is 'all'
            if (count === 0 && cat.id !== 'all') return null;

            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#0E3A53] text-white shadow'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <span>{isBn ? cat.labelBn : cat.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 mb-12">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-[#0E3A53] mb-1">
              {isBn ? "কোনো ছবি পাওয়া যায়নি" : "No photos found"}
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              {isBn 
                ? "অনুসন্ধান পরিবর্তন করুন অথবা ফিল্টার রিসেট করুন।" 
                : "Try adjusting your search query or reset the category filter."}
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-[#0E3A53] text-white text-xs font-semibold rounded-xl hover:bg-[#0A2A3D] transition cursor-pointer"
            >
              {isBn ? "সকল ছবি দেখুন" : "View All Photos"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/80 flex flex-col"
              >
                <div 
                  className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img
                    src={item.src}
                    alt={isBn ? item.title : (item.titleEn || item.title)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 bg-white/95 text-[#0E3A53] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                      <Maximize2 className="w-3.5 h-3.5 text-[#2D8FC1]" />
                      {t.gallery_zoom}
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 bg-[#0E3A53]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
                    {isBn ? (item.categoryLabel || item.category) : (item.categoryLabelEn || item.categoryLabel || item.category)}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#0E3A53] text-base mb-1.5 group-hover:text-[#2D8FC1] transition-colors leading-snug">
                      {isBn ? item.title : (item.titleEn || item.title)}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {isBn ? item.desc : (item.descEn || item.desc)}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="font-medium text-[#2D8FC1]">আনোয়ারা মেডিকেল কমপ্লেক্স</span>
                    <button
                      onClick={() => setActiveImageIndex(idx)}
                      className="text-gray-500 hover:text-[#0E3A53] font-semibold flex items-center gap-1 transition"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>{isBn ? "বড় ছবি" : "Zoom"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Lightbox Modal */}
        {activeImageIndex !== null && filteredItems[activeImageIndex] && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setActiveImageIndex(null)}
          >
            {/* Top Bar with counter & close */}
            <div 
              className="absolute top-4 left-4 right-4 flex items-center justify-between z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-semibold border border-white/15">
                <span>{activeImageIndex + 1} / {filteredItems.length}</span>
                <span className="mx-2 text-white/40">•</span>
                <span className="text-[#C9973B]">
                  {isBn 
                    ? (filteredItems[activeImageIndex].categoryLabel || filteredItems[activeImageIndex].category)
                    : (filteredItems[activeImageIndex].categoryLabelEn || filteredItems[activeImageIndex].categoryLabel || filteredItems[activeImageIndex].category)}
                </span>
              </div>

              <button
                onClick={() => setActiveImageIndex(null)}
                className="text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer border border-white/15"
                aria-label={t.gallery_close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/25 transition cursor-pointer z-20 border border-white/15"
              title={isBn ? "পূর্ববর্তী ছবি (← তীরচিহ্ন)" : "Previous (Left arrow)"}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/25 transition cursor-pointer z-20 border border-white/15"
              title={isBn ? "পরবর্তী ছবি (→ তীরচিহ্ন)" : "Next (Right arrow)"}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image & Caption Container */}
            <div 
              className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[70vh] sm:max-h-[75vh] overflow-hidden rounded-2xl flex items-center justify-center bg-black/40 shadow-2xl border border-white/10">
                <img
                  src={filteredItems[activeImageIndex].src}
                  alt={isBn ? filteredItems[activeImageIndex].title : (filteredItems[activeImageIndex].titleEn || filteredItems[activeImageIndex].title)}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] sm:max-h-[75vh] w-auto max-w-full object-contain"
                />
              </div>
              <div className="text-center text-white mt-4 max-w-2xl px-4">
                <h4 className="font-bold text-base sm:text-lg text-white font-display">
                  {isBn ? filteredItems[activeImageIndex].title : (filteredItems[activeImageIndex].titleEn || filteredItems[activeImageIndex].title)}
                </h4>
                <p className="text-xs sm:text-sm text-white/75 mt-1 leading-relaxed">
                  {isBn ? filteredItems[activeImageIndex].desc : (filteredItems[activeImageIndex].descEn || filteredItems[activeImageIndex].desc)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Callout */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
            <div>
              <h4 className="font-bold text-[#0E3A53] text-sm md:text-base">
                {isBn ? 'সরাসরি এসে হাসপাতাল ঘুরে দেখতে স্বাগতম' : 'You are welcome to visit our hospital campus in person'}
              </h4>
              <p className="text-xs text-gray-500">
                {isBn ? 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী (Plus Code: XJFQ+H2 Palash)' : 'WAPDA Sadar Road, Medical Morh, Palash, Narsingdi (Plus Code: XJFQ+H2 Palash)'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shrink-0 transition cursor-pointer"
          >
            {t.nav_contact}
          </button>
        </div>
      </div>
    </div>
  );
};
