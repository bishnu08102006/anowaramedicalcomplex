import React, { useState, useMemo } from 'react';
import { Clock, Search, Calendar, Phone, Stethoscope, UserCheck } from 'lucide-react';
import { dayOrder, dayNamesMap, DayKey, Doctor } from '../data/doctors';
import { useData } from '../context/DataContext';

interface DoctorScheduleProps {
  onSelectDoctorForAppointment?: (doctorName: string) => void;
}

export const DoctorSchedule: React.FC<DoctorScheduleProps> = ({
  onSelectDoctorForAppointment,
}) => {
  const { doctors } = useData();

  // Map JavaScript getDay() (0 = Sunday = রবি) to DayKey
  const currentDayIndex = new Date().getDay();
  const defaultDay: DayKey = dayOrder[currentDayIndex] || 'শুক্র';

  const [activeDay, setActiveDay] = useState<DayKey>(defaultDay);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Extract unique specialties for filtering
  const specialties = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach(d => set.add(d.specialty));
    return Array.from(set);
  }, [doctors]);

  // Filter doctors by active day, search query, and specialty
  const displayedDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesDay = doc.days.includes(activeDay);
      const matchesQuery = searchQuery === '' ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.degree.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'all' || doc.specialty === selectedSpecialty;

      return matchesDay && matchesQuery && matchesSpecialty;
    });
  }, [doctors, activeDay, searchQuery, selectedSpecialty]);

  const handleBookDoctor = (doc: Doctor) => {
    if (onSelectDoctorForAppointment) {
      onSelectDoctorForAppointment(`${doc.name} (${doc.specialty})`);
    }
    const apptSection = document.getElementById('appointment');
    if (apptSection) {
      apptSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="doctors" className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
      {/* Header */}
      <div className="mb-10 md:mb-12 max-w-3xl">
        <span className="text-[#2D8FC1] font-bold text-sm tracking-wider uppercase flex items-center gap-1.5 mb-2">
          <Calendar className="w-4 h-4" /> সাপ্তাহিক সময়সূচী
        </span>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#0E3A53] font-bold mt-1 mb-4">
          ডাক্তারদের চেম্বার ও রোগী দেখার সময়
        </h2>
        <p className="text-[15px] md:text-base text-[#0E3A53]/75 leading-relaxed">
          সপ্তাহের যেকোনো দিন নির্বাচন করে দেখুন সেদিন কোন কোন বিশেষজ্ঞ ডাক্তার চেম্বারে বসবেন। সিরিয়াল নিশ্চিত করতে আগে থেকে কল অথবা নিচের অনলাইন ফর্ম পূরণ করার অনুরোধ করা হচ্ছে।
        </p>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-white/70 p-2 rounded-2xl border border-[#DDE6E9] shadow-sm">
        {dayOrder.map(day => {
          const isActive = activeDay === day;
          return (
            <button
              key={day}
              id={`day-tab-${day}`}
              onClick={() => setActiveDay(day)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#0E3A53] text-white shadow-md transform scale-[1.02]'
                  : 'bg-white text-[#0E3A53] hover:bg-[#E7F2F8] border border-[#DDE6E9]/60'
              }`}
            >
              <span>{dayNamesMap[day]}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C9973B]" />}
            </button>
          );
        })}
      </div>

      {/* Search & Specialty Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            id="doctor-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ডাক্তার বা স্পেশালিটির নাম লিখে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#DDE6E9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] text-[#0E3A53]"
          />
        </div>

        <div className="sm:w-64">
          <select
            id="doctor-specialty-filter"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-white border border-[#DDE6E9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] text-[#0E3A53] font-medium"
          >
            <option value="all">সকল বিভাগ (All Specialties)</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {displayedDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-[#DDE6E9] shadow-sm max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#E7F2F8] text-[#2D8FC1] flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#0E3A53] text-lg mb-1">
            {dayNamesMap[activeDay]} কোন বিশেষজ্ঞ চেম্বার নেই
          </h3>
          <p className="text-[#0E3A53]/60 text-sm leading-relaxed mb-5">
            তবে জরুরী প্রয়োজনে আমাদের ২৪ ঘণ্টা ইনডোর ও আউটডোর মেডিকেল অফিসার প্রস্তুত রয়েছেন।
          </p>
          <a
            href="tel:01972692504"
            className="inline-flex items-center gap-2 bg-[#0E3A53] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#0A2A3D] transition shadow"
          >
            <Phone className="w-3.5 h-3.5 text-[#C9973B]" />
            ২৪ ঘণ্টা জরুরী সেবায় কল করুন
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedDoctors.map((doc) => (
            <div
              key={doc.id}
              id={`doctor-card-${doc.id}`}
              className="doc-card bg-white rounded-2xl p-5 border border-[#DDE6E9]/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#2D8FC1] bg-[#E7F2F8] px-2.5 py-0.5 rounded-md">
                    {doc.specialty}
                  </span>
                  {doc.room && (
                    <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {doc.room}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-[#0E3A53] text-[16px] mb-1.5 leading-snug">
                  {doc.name}
                </h3>

                <p className="text-[#0E3A53]/65 text-xs leading-relaxed mb-4 min-h-[36px]">
                  {doc.degree}
                </p>

                {/* Visiting Hours Badge */}
                <div className="flex items-center gap-2 text-xs text-[#0E3A53] bg-[#E7F2F8] font-medium rounded-xl px-3.5 py-2 mb-4">
                  <Clock className="w-3.5 h-3.5 text-[#2D8FC1] shrink-0" />
                  <span>{doc.time}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBookDoctor(doc)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#C9973B]" />
                  <span>সিরিয়াল নিন</span>
                </button>

                <a
                  href="tel:01944874304"
                  title="সরাসরি কল করে সিরিয়াল নিন"
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 text-[#0E3A53] rounded-xl transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
