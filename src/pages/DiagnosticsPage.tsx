import React, { useState } from 'react';
import { Stethoscope, Search, Clock, AlertCircle, Phone, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { PageId } from '../components/Header';

interface DiagnosticsPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: PageId) => void;
}

export const DiagnosticsPage: React.FC<DiagnosticsPageProps> = ({ onNavigateHome, onNavigate }) => {
  const { t, isBn } = useLanguage();
  const { diagnosticTests } = useData();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pathology' | 'imaging'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTests = diagnosticTests.filter((test) => {
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.banglaName && test.banglaName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="diagnostics-page" className="min-h-screen bg-[#F8FAFB]">
      <PageBanner
        title={t.test_page_title}
        subtitle={t.test_page_subtitle}
        icon={Activity}
        badge={isBn ? "ডিজিটাল ল্যাবরেটরি" : "Digital Laboratory"}
        currentPageName={t.nav_diagnostics}
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10">
        {/* Filter & Search Card */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-6 shadow-xs border border-gray-200/90 mb-5 sm:mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Category Tabs: Clean segmented grid on mobile, flex on desktop */}
            <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 p-1 bg-gray-100/90 rounded-xl">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  selectedCategory === 'all'
                    ? 'bg-[#0E3A53] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/70'
                }`}
              >
                <span>{t.test_tab_all}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {diagnosticTests.length}
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory('pathology')}
                className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  selectedCategory === 'pathology'
                    ? 'bg-[#2D8FC1] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/70'
                }`}
              >
                <Activity className="w-3.5 h-3.5 shrink-0 hidden xs:inline-block" />
                <span>{t.test_tab_pathology}</span>
              </button>

              <button
                onClick={() => setSelectedCategory('imaging')}
                className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  selectedCategory === 'imaging'
                    ? 'bg-[#2D8FC1] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/70'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 shrink-0 hidden xs:inline-block" />
                <span>{t.test_tab_imaging}</span>
              </button>
            </div>

            {/* Quick Action Buttons: Lab Hotline */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <a
                href="tel:01972692504"
                className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#0E3A53] bg-[#E7F2F8] px-3.5 py-2.5 rounded-xl border border-[#DDE6E9] hover:bg-[#d5e7f1] transition shrink-0 flex-1 sm:flex-initial"
              >
                <Phone className="w-3.5 h-3.5 text-[#2D8FC1]" />
                <span>{isBn ? 'ল্যাব ইনকোয়ারি: 01972-692504' : 'Lab Inquiry: 01972-692504'}</span>
              </a>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3 sm:mt-4 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.test_search_placeholder}
              className="w-full bg-gray-50 border border-gray-200 pl-10 pr-20 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 px-2.5 py-1 rounded-lg cursor-pointer transition font-medium"
              >
                {t.clear}
              </button>
            )}
          </div>

          {/* Active Result Count Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 pt-2.5 border-t border-gray-100 text-xs text-gray-500">
            <span className="font-medium">
              {isBn 
                ? `প্রদর্শিত হচ্ছে: ${filteredTests.length} টি পরীক্ষা`
                : `Showing: ${filteredTests.length} tests`}
              {searchQuery && (
                <span className="text-gray-400 ml-1 truncate max-w-[180px]">
                  ("{searchQuery}")
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Tests List / Table */}
        {filteredTests.length > 0 ? (
          <div className="mb-6">
            {/* MOBILE VIEW: Touch-optimized Responsive Cards (block md:hidden) */}
            <div className="block md:hidden space-y-3">
              {filteredTests.map((test) => {
                const rawPrice = isBn ? test.price : (test.priceEn || test.price);
                const priceFormatted = rawPrice.includes('৳') || rawPrice.includes('Tk') ? rawPrice : `৳ ${rawPrice}`;
                const deliveryDisplay = isBn ? test.deliveryTime : (test.deliveryTimeEn || test.deliveryTime);
                const isPathology = test.category === 'pathology';
                const categoryDisplay = isPathology
                  ? (isBn ? 'রক্ত ও প্যাথলজি' : 'Pathology')
                  : (isBn ? 'ইমেজিং ও এক্স-রে' : 'Imaging');

                return (
                  <div
                    key={test.id}
                    className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-2xs hover:border-[#2D8FC1]/70 transition-all flex flex-col justify-between gap-3"
                  >
                    {/* Top Row: Name and Price */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#0E3A53] text-[15px] leading-snug break-words">
                          {test.name}
                        </h4>
                        {test.banglaName && (
                          <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                            {test.banglaName}
                          </p>
                        )}
                      </div>

                      {/* Prominent Price Badge */}
                      <div className="text-right shrink-0">
                        <div className="inline-flex flex-col items-end">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-300/80 px-2.5 py-1 rounded-xl font-black text-sm font-display tracking-tight shadow-2xs">
                            {priceFormatted}
                          </span>
                          <span className="text-[9px] text-gray-400 font-medium mt-0.5 mr-0.5">
                            {isBn ? 'সম্ভাব্য ফি' : 'Standard Fee'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Row: Meta Information Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
                      {/* Category Tag */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${
                          isPathology
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-purple-50 text-purple-700 border border-purple-100'
                        }`}
                      >
                        {isPathology ? (
                          <Activity className="w-3 h-3 text-blue-600" />
                        ) : (
                          <Stethoscope className="w-3 h-3 text-purple-600" />
                        )}
                        <span>{categoryDisplay}</span>
                      </span>

                      {/* Delivery Time Tag */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200/80">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{deliveryDisplay}</span>
                      </span>

                      {/* Fasting Required Warning Tag */}
                      {test.fastingRequired && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{t.test_fasting_tag}</span>
                        </span>
                      )}
                    </div>

                    {/* Action footer on mobile */}
                    <div className="flex items-center gap-2 pt-2 border-t border-dashed border-gray-100 text-xs">
                      <a
                        href="tel:01712692504"
                        className="flex-1 py-1.5 px-3 rounded-lg bg-gray-50 hover:bg-[#E7F2F8] text-[#0E3A53] font-semibold flex items-center justify-center gap-1.5 border border-gray-200/70 transition"
                      >
                        <Phone className="w-3 h-3 text-[#2D8FC1]" />
                        <span>{isBn ? 'ল্যাবে কথা বলুন' : 'Call Lab'}</span>
                      </a>
                      <button
                        onClick={() => onNavigate('appointment')}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-[#0E3A53] hover:bg-[#144f72] text-white font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <span>{isBn ? 'সিরিয়াল বুকিং' : 'Book Serial'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP VIEW: High-density Table (hidden md:block) */}
            <div className="hidden md:block bg-white rounded-2xl shadow-xs border border-gray-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0E3A53] text-white text-xs uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-3.5 font-bold">{t.test_th_name}</th>
                      <th scope="col" className="px-6 py-3.5 font-bold">{t.test_th_category}</th>
                      <th scope="col" className="px-6 py-3.5 font-bold">{t.test_th_delivery}</th>
                      <th scope="col" className="px-6 py-3.5 font-bold text-right">{t.test_th_price}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTests.map((test) => {
                      const rawPrice = isBn ? test.price : (test.priceEn || test.price);
                      const priceDisplay = rawPrice.includes('৳') || rawPrice.includes('Tk') ? rawPrice : `৳ ${rawPrice}`;
                      const deliveryDisplay = isBn ? test.deliveryTime : (test.deliveryTimeEn || test.deliveryTime);
                      const categoryDisplay =
                        test.category === 'pathology'
                          ? (isBn ? 'প্যাথলজি ল্যাব' : 'Pathology')
                          : (isBn ? 'ইমেজিং ও এক্স-রে' : 'Imaging & USG');

                      return (
                        <tr key={test.id} className="hover:bg-gray-50/80 transition">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[#0E3A53]">{test.name}</div>
                            {test.banglaName && (
                              <div className="text-xs text-gray-500 mt-0.5">{test.banglaName}</div>
                            )}
                            {test.fastingRequired && (
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <AlertCircle className="w-3 h-3" />
                                {t.test_fasting_tag}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                test.category === 'pathology'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                  : 'bg-purple-50 text-purple-700 border border-purple-100'
                              }`}
                            >
                              {categoryDisplay}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>{deliveryDisplay}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-display font-bold text-[#0E3A53] text-sm md:text-base">
                              {priceDisplay}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 sm:p-10 text-center border border-gray-200 max-w-xl mx-auto mb-6 shadow-2xs">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-4">
              "{searchQuery}" {t.test_not_found}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="bg-[#0E3A53] hover:bg-[#144f72] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              {isBn ? 'সকল টেস্ট দেখুন' : 'View All Tests'}
            </button>
          </div>
        )}

        {/* Notice Footnote */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3 mb-5 sm:mb-6">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{t.test_disclaimer}</p>
        </div>

        {/* Quick related link to appointment */}
        <div className="bg-gradient-to-r from-[#E7F2F8] to-white rounded-2xl p-4 sm:p-6 border border-[#DDE6E9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-[#0E3A53] text-sm sm:text-base">
              {isBn ? 'টেস্টের পর বিশেষজ্ঞ ডাক্তারের পরামর্শ নিতে চান?' : 'Need doctor consultation after your medical test?'}
            </h4>
            <p className="text-xs text-gray-600 mt-0.5">
              {isBn ? 'আজই বিশেষজ্ঞ চিকিৎসকের চেম্বার সময়সূচী দেখুন বা অনলাইনে সিরিয়াল বুক করুন।' : 'Check our specialist doctor schedules or book a serial appointment online.'}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('doctors')}
              className="flex-1 sm:flex-initial bg-white border border-gray-300 hover:bg-gray-50 text-[#0E3A53] text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer text-center"
            >
              {t.nav_doctors}
            </button>
            <button
              onClick={() => onNavigate('appointment')}
              className="flex-1 sm:flex-initial bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer text-center"
            >
              {t.nav_appointment}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
