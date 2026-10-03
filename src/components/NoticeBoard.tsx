import React, { useState } from 'react';
import { Bell, Calendar, ChevronDown, ChevronUp, Sparkles, AlertTriangle, Info, PhoneCall } from 'lucide-react';
import { HospitalNotice } from '../data/notices';
import { useData } from '../context/DataContext';

export const NoticeBoard: React.FC = () => {
  const { notices } = useData();
  const [selectedType, setSelectedType] = useState<'all' | 'urgent' | 'offer' | 'info'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(notices[0]?.id || null);

  const filteredNotices = selectedType === 'all' 
    ? notices 
    : notices.filter(n => n.type === selectedType);

  const getTypeStyle = (type: HospitalNotice['type']) => {
    switch (type) {
      case 'urgent':
        return {
          badgeBg: 'bg-red-100 text-red-700 border-red-200',
          icon: <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />,
          border: 'border-l-4 border-red-500',
        };
      case 'offer':
        return {
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />,
          border: 'border-l-4 border-amber-500',
        };
      case 'info':
      default:
        return {
          badgeBg: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <Info className="w-4 h-4 text-blue-600 shrink-0" />,
          border: 'border-l-4 border-blue-500',
        };
    }
  };

  return (
    <section className="py-12 bg-slate-50 border-t border-b border-gray-200" id="notices">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Bell className="w-3.5 h-3.5" /> সর্বশেষ তথ্য ও নোটিশ
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
              হাসপাতাল নোটিশ বোর্ড
            </h2>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 text-xs font-medium self-start sm:self-auto shadow-sm">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedType === 'all' ? 'bg-[#0E3A53] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              সব নোটিশ
            </button>
            <button
              onClick={() => setSelectedType('urgent')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedType === 'urgent' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              জরুরি ক্যাম্প
            </button>
            <button
              onClick={() => setSelectedType('offer')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedType === 'offer' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              বিশেষ অফার
            </button>
          </div>
        </div>

        {/* Notices Cards List */}
        <div className="space-y-3.5">
          {filteredNotices.map((notice) => {
            const style = getTypeStyle(notice.type);
            const isExpanded = expandedId === notice.id;

            return (
              <div
                key={notice.id}
                id={`notice-item-${notice.id}`}
                className={`bg-white rounded-xl border border-gray-200/80 shadow-sm transition-all hover:shadow-md ${style.border}`}
              >
                <div 
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 p-2 rounded-lg bg-gray-50 border border-gray-100">
                      {style.icon}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${style.badgeBg}`}>
                          {notice.badge}
                        </span>
                        <h3 className="font-bold text-gray-900 text-base">
                          {notice.title}
                        </h3>
                      </div>
                      <p className={`text-xs md:text-sm text-gray-600 leading-relaxed ${isExpanded ? '' : 'line-clamp-2 md:line-clamp-1'}`}>
                        {notice.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {notice.date}
                    </span>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-700 p-1 rounded"
                      aria-label="বিস্তারিত দেখুন"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-slate-50/50 rounded-b-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs md:text-sm">
                    <p className="text-gray-700">
                      যেকোনো তথ্য বা সিরিয়ালের জন্য সরাসরি যোগাযোগ করুন আমাদের হেল্পডেস্কে।
                    </p>
                    <a
                      href="tel:01972692504"
                      className="inline-flex items-center gap-1.5 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white px-3.5 py-1.5 rounded-lg font-medium shrink-0 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#C9973B]" />
                      <span>কল করুন: 01972-692504</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
