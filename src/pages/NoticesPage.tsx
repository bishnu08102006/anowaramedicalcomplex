import React, { useState } from 'react';
import { Bell, AlertCircle, Tag, Info, Phone, Calendar } from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { PageId } from '../components/Header';

interface NoticesPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: PageId) => void;
}

export const NoticesPage: React.FC<NoticesPageProps> = ({ onNavigateHome }) => {
  const { t, isBn } = useLanguage();
  const { notices } = useData();
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'offer' | 'info'>('all');

  const filteredNotices = notices.filter((n) => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  return (
    <div id="notices-page" className="min-h-screen bg-[#F8FAFB]">
      <PageBanner
        title={t.notices_page_title}
        subtitle={t.notices_page_subtitle}
        icon={Bell}
        badge={isBn ? "অফিসিয়াল নোটিশ বোর্ড" : "Official Notice Board"}
        currentPageName={t.nav_notices}
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-2xl border border-gray-200 shadow-xs max-w-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#0E3A53] text-white shadow'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {t.notices_all}
            </button>
            <button
              onClick={() => setActiveTab('urgent')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'urgent'
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {t.notices_urgent}
            </button>
            <button
              onClick={() => setActiveTab('offer')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'offer'
                  ? 'bg-[#C9973B] text-white shadow'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {t.notices_offers}
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'info'
                  ? 'bg-[#2D8FC1] text-white shadow'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {t.notices_info}
            </button>
          </div>
        </div>

        {/* Notices Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredNotices.map((item) => {
            const title = isBn ? item.title : item.titleEn;
            const desc = isBn ? item.description : item.descriptionEn;
            const date = isBn ? item.date : item.dateEn;
            const badge = isBn ? item.badge : item.badgeEn;

            const isUrgent = item.type === 'urgent';
            const isOffer = item.type === 'offer';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border flex flex-col justify-between ${
                  isUrgent
                    ? 'border-rose-200 bg-rose-50/20'
                    : isOffer
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-gray-200/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full ${
                        isUrgent
                          ? 'bg-rose-100 text-rose-700'
                          : isOffer
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isUrgent ? (
                        <AlertCircle className="w-3 h-3" />
                      ) : isOffer ? (
                        <Tag className="w-3 h-3" />
                      ) : (
                        <Info className="w-3 h-3" />
                      )}
                      {badge}
                    </span>

                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{date}</span>
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#0E3A53] mb-2 leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 font-medium">
                      {isBn ? 'আনোয়ারা মেডিকেল কমপ্লেক্স কর্তৃপক্ষ' : 'Hospital Authority'}
                    </span>
                  </div>
                  <a
                    href="tel:01972692504"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#0E3A53] bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9973B]" />
                    <span>01972-692504</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Prompt */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-[#0E3A53] text-base">
              {isBn ? 'ফ্রি ক্যাম্প বা যেকোনো ছাড়ের সুবিধা গ্রহণ করতে কল করুন' : 'Call our helpdesk to avail free health camps or discounts'}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {isBn ? 'জরুরি হটলাইন সার্বক্ষণিক সচল রয়েছে' : 'Emergency phone hotlines are available 24 hours'}
            </p>
          </div>
          <a
            href="tel:01972692504"
            className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shrink-0 transition"
          >
            {t.call_now}
          </a>
        </div>
      </div>
    </div>
  );
};
