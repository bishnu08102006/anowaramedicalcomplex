import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Search, Phone, UserCheck, ChevronRight } from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { DoctorPortrait } from '../components/DoctorPortrait';
import { dayOrder, dayNamesMap, dayNamesMapEn, DayKey } from '../data/doctors';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { PageId } from '../components/Header';

interface DoctorsPageProps {
  onSelectDoctorForAppointment: (doctorName: string) => void;
  onNavigateHome: () => void;
  onNavigate: (page: PageId) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  onSelectDoctorForAppointment,
  onNavigateHome,
  onNavigate,
}) => {
  const { t, isBn } = useLanguage();
  const { doctors } = useData();
  const [selectedDay, setSelectedDay] = useState<string>('সকল');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');

  // Extract unique specialties
  const specialties = Array.from(
    new Set(doctors.map((d) => (isBn ? d.specialty : d.specialtyEn)))
  );

  // Filter doctors
  const filteredDoctors = doctors.filter((doc) => {
    const docName = isBn ? doc.name : doc.nameEn;
    const docSpec = isBn ? doc.specialty : doc.specialtyEn;
    const docDeg = isBn ? doc.degree : doc.degreeEn;

    const matchesDay = selectedDay === 'সকল' || doc.days.includes(selectedDay);
    const matchesSearch =
      searchQuery.trim() === '' ||
      docName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docSpec.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docDeg.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === 'ALL' ||
      (isBn ? doc.specialty : doc.specialtyEn) === selectedSpecialty;

    return matchesDay && matchesSearch && matchesSpecialty;
  });

  return (
    <div id="doctors-page" className="min-h-screen bg-[#F8FAFB]">
      <PageBanner
        title={t.doc_page_title}
        subtitle={t.doc_page_subtitle}
        icon={Clock}
        badge={isBn ? "চেম্বার ও সময়সূচী" : "Chamber & Visiting Hours"}
        currentPageName={t.nav_doctors}
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls: Weekday Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#0E3A53] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2D8FC1]" />
                <span>{t.doc_select_day}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {isBn
                  ? 'নির্ধারিত দিনে কোন কোন বিশেষজ্ঞ চিকিৎসক উপস্থিত থাকবেন তা জানতে দিন নির্বাচন করুন'
                  : 'Select day of week to filter available consultants'}
              </p>
            </div>

            {/* Specialty Filter dropdown */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2">
                <label htmlFor="specialty-filter" className="text-xs font-semibold text-gray-600 shrink-0">
                  {isBn ? 'বিভাগ:' : 'Department:'}
                </label>
                <select
                  id="specialty-filter"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-800 text-xs sm:text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#2D8FC1] focus:outline-none"
                >
                  <option value="ALL">{t.doc_all_specialties}</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Weekday Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDay('সকল')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                selectedDay === 'সকল'
                  ? 'bg-[#0E3A53] text-white shadow'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isBn ? 'সকল দিন' : 'All Days'}
            </button>
            {dayOrder.map((dayKey) => {
              const isActive = selectedDay === dayKey;
              const displayName = isBn ? dayNamesMap[dayKey] : dayNamesMapEn[dayKey];
              return (
                <button
                  key={dayKey}
                  onClick={() => setSelectedDay(dayKey)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#2D8FC1] text-white shadow'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="mt-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.doc_search_placeholder}
              className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {t.clear}
              </button>
            )}
          </div>
        </div>

        {/* Doctor Cards Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const docName = isBn ? doc.name : doc.nameEn;
              const docSpec = isBn ? doc.specialty : doc.specialtyEn;
              const docDeg = isBn ? doc.degree : doc.degreeEn;
              const docTime = isBn ? doc.time : doc.timeEn;
              const docRoom = isBn ? doc.room : doc.roomEn;

              return (
                <div
                  key={doc.id}
                  id={doc.id}
                  className="overflow-hidden rounded-[1.4rem] bg-white shadow-[0_3px_16px_rgba(14,58,83,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(14,58,83,0.13)] border border-[#DDE6E9] flex flex-col justify-between group"
                >
                  <DoctorPortrait photo={doc.photo} name={docName} isBn={isBn} />
                  <div>
                    <div className="p-5 sm:p-6">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#C9973B]">
                            {isBn ? 'বিশেষজ্ঞ চিকিৎসক' : 'Consultant'}
                          </p>
                          <h3 className="font-display text-lg font-extrabold leading-snug text-[#0E3A53] group-hover:text-[#2D8FC1] transition-colors">
                            {docName}
                          </h3>
                        </div>
                        <span className="inline-block shrink-0 rounded-full border border-[#DDE6E9] bg-[#F8FAFB] px-2.5 py-1 text-[10px] font-semibold text-[#0E3A53]">
                          {docRoom || (isBn ? 'চেম্বার' : 'Chamber')}
                        </span>
                      </div>

                      <p className="mb-2 text-xs font-semibold leading-relaxed text-[#2D8FC1]">{docSpec}</p>
                      <p className="mb-5 min-h-10 text-xs leading-relaxed text-gray-600">{docDeg}</p>

                      <div className="mb-1 space-y-2 rounded-xl border border-[#E7EEF1] bg-[#F7FAFB] p-3.5 text-xs text-gray-700">
                        <div className="flex items-center gap-2 font-medium text-[#0E3A53]">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-[#C9973B]" />
                          <span>{docTime}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 text-[11px] text-gray-500">
                          <span className="font-semibold text-gray-700">{isBn ? 'দিন:' : 'Days:'}</span>
                          {doc.days.map((d) => (
                            <span
                              key={d}
                              className="rounded border border-gray-200 bg-white px-1.5 py-0.5 font-medium text-[#0E3A53]"
                            >
                              {isBn ? dayNamesMap[d as DayKey] || d : dayNamesMapEn[d as DayKey] || d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-[#EDF1F3] bg-[#FCFDFD] px-5 py-4 sm:px-6">
                    <button
                      onClick={() => onSelectDoctorForAppointment(`${docName} (${docSpec})`)}
                      className="flex-1 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white py-2.5 px-3 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#C9973B]" />
                      <span>{t.doc_book_btn}</span>
                    </button>
                    <a
                      href="tel:01944874304"
                      className="p-2.5 rounded-xl border border-gray-200 hover:bg-[#E7F2F8] text-[#0E3A53] transition flex items-center justify-center cursor-pointer"
                      title={isBn ? "সিরিয়াল ডেস্কে সরাসরি কল করুন (01944-874304)" : "Call serial desk directly (01944-874304)"}
                    >
                      <Phone className="w-4 h-4 text-[#2D8FC1]" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-200 max-w-xl mx-auto">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0E3A53] mb-1">{t.doc_no_doctors}</h3>
            <p className="text-xs text-gray-500 mb-6">{t.doc_no_doctors_sub}</p>
            <a
              href="tel:01972692504"
              className="inline-flex items-center gap-2 bg-[#0E3A53] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow"
            >
              <Phone className="w-4 h-4 text-[#C9973B]" />
              <span>{t.doc_emergency_call} (01972-692504)</span>
            </a>
          </div>
        )}

        {/* Quick related link */}
        <div className="mt-12 bg-gradient-to-r from-[#E7F2F8] to-white rounded-2xl p-6 border border-[#DDE6E9] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-[#0E3A53] text-sm md:text-base">
              {isBn ? 'ডাক্তারের পরামর্শের পাশাপাশি টেস্ট করাতে চান?' : 'Need diagnostic tests along with doctor consultation?'}
            </h4>
            <p className="text-xs text-gray-600 mt-0.5">
              {isBn ? 'আমাদের ডিজিটাল প্যাথলজি ও আল্ট্রাসাউন্ডের সম্ভাব্য মূল্য তালিকা যাচাই করুন।' : 'Check our estimated diagnostic tests price list and delivery turnaround times.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('diagnostics')}
            className="inline-flex items-center gap-2 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shrink-0 transition cursor-pointer"
          >
            <span>{t.nav_diagnostics}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#C9973B]" />
          </button>
        </div>
      </div>
    </div>
  );
};
