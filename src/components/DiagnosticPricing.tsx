import React, { useState, useMemo } from 'react';
import { Search, Stethoscope, Activity, FileCheck, Info, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

export const DiagnosticPricing: React.FC = () => {
  const { diagnosticTests } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'pathology' | 'imaging'>('all');

  const filteredTests = useMemo(() => {
    return diagnosticTests.filter(test => {
      const matchesCategory = activeCategory === 'all' || test.category === activeCategory;
      const q = searchTerm.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch = 
        test.name.toLowerCase().includes(q) ||
        (test.banglaName && test.banglaName.toLowerCase().includes(q)) ||
        test.price.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const pathologyCount = diagnosticTests.filter(t => t.category === 'pathology').length;
  const imagingCount = diagnosticTests.filter(t => t.category === 'imaging').length;

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-gray-200" id="pricing">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> ফি এবং চার্জ তালিকা
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-3">
            পরীক্ষা-নিরীক্ষার সম্ভাব্য মূল্য তালিকা
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            আধুনিক ডিজিটাল মেশিনে নির্ভুল প্যাথলজিক্যাল ও রেডিওলজিক্যাল টেস্ট। নিচের সার্চ বক্সে পরীক্ষার নাম দিয়ে খুব সহজেই ফি জেনে নিন।
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="max-w-xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              id="testSearchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="পরীক্ষার নাম দিয়ে খুঁজুন (যেমন: CBC, USG, X-Ray, Creatinine, ডেঙ্গু)..."
              className="w-full px-4 py-3 pl-11 text-sm text-gray-900 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-xs text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md"
              >
                মুছুন
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 sm:justify-center no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-[#0E3A53] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              সকল টেস্ট ({diagnosticTests.length})
            </button>
            <button
              onClick={() => setActiveCategory('pathology')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeCategory === 'pathology'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>রক্ত ও প্যাথলজি ({pathologyCount})</span>
            </button>
            <button
              onClick={() => setActiveCategory('imaging')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeCategory === 'imaging'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>ইমেজিং ও এক্স-রে ({imagingCount})</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Tests Results: Mobile Cards + Desktop Table */}
        <div className="mb-6">
          {/* Mobile View */}
          <div className="block sm:hidden space-y-2.5">
            {filteredTests.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 text-gray-500 text-sm">
                "{searchTerm}" নামে কোনো টেস্ট পাওয়া যায়নি।
              </div>
            ) : (
              filteredTests.map((test) => (
                <div key={test.id} className="bg-white rounded-xl p-3.5 border border-gray-200 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm">{test.name}</div>
                      {test.banglaName && (
                        <div className="text-xs text-gray-500 font-medium mt-0.5">{test.banglaName}</div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-lg font-bold text-sm">
                        {test.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-gray-100">
                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                      test.category === 'pathology' ? 'bg-blue-100/70 text-blue-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {test.category === 'pathology' ? 'প্যাথলজি' : 'ইমেজিং'}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 border border-gray-200/60 px-2 py-0.5 rounded-md">
                      <FileCheck className="w-3 h-3 text-emerald-600" />
                      {test.deliveryTime}
                    </span>
                    {test.fastingRequired && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                        <Info className="w-3 h-3 text-amber-600" /> খালি পেটে
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop/Tablet View */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-100/80 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3.5">পরীক্ষার নাম</th>
                    <th className="px-5 py-3.5">বিভাগ</th>
                    <th className="px-5 py-3.5">রিপোর্ট ডেলিভারি</th>
                    <th className="px-5 py-3.5 text-right">সম্ভাব্য ফি (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                        "{searchTerm}" নামে কোনো টেস্টের রেকর্ড পাওয়া যায়নি। বিস্তারিত জানতে রিসেপশনে কল করুন: 01972-692504।
                      </td>
                    </tr>
                  ) : (
                    filteredTests.map((test) => (
                      <tr key={test.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-gray-900 text-sm md:text-base">
                            {test.name}
                          </div>
                          {test.banglaName && (
                            <div className="text-xs text-gray-500 font-medium mt-0.5">
                              {test.banglaName}
                            </div>
                          )}
                          {test.fastingRequired && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mt-1">
                              <Info className="w-3 h-3" /> খালি পেটে প্রযোজ্য
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            test.category === 'pathology' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {test.category === 'pathology' ? 'প্যাথলজি' : 'রেডিওলজি ও ইমেজিং'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                            {test.deliveryTime}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-blue-600 text-sm md:text-base whitespace-nowrap">
                          {test.price}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Clarification Note */}
        <p className="text-center text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
          * উল্লিখিত ফি-সমূহ একটি আনুমানিক ধারণা। বিশেষ প্যাকেজ বা ডাক্তারের নির্দিষ্ট প্রেসক্রিপশনের উপর ভিত্তি করে চূড়ান্ত চার্জ কিছুটা পরিবর্তিত হতে পারে। সঠিক ফি ও সময়সূচীর জন্য রিসেপশনে সরাসরি কল করার অনুরোধ করা হচ্ছে।
        </p>
      </div>
    </section>
  );
};
