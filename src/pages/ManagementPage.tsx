import React, { useState, useMemo } from 'react';
import { ShieldCheck, Mail, Phone, Building2, Search, CheckCircle2, ChevronRight, UserCheck } from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { MANAGEMENT_CATEGORIES } from '../data/management';
import { PageId } from '../components/Header';

interface ManagementPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: PageId) => void;
}

export const ManagementPage: React.FC<ManagementPageProps> = ({ onNavigateHome, onNavigate }) => {
  const { isBn } = useLanguage();
  const { managementMembers } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort members by order or creation time
  const sortedMembers = useMemo(() => {
    return [...managementMembers].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }, [managementMembers]);

  const filteredMembers = useMemo(() => {
    return sortedMembers.filter(member => {
      const matchesCategory = selectedCategory === 'all' || member.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch = 
        member.name.toLowerCase().includes(q) ||
        (member.nameEn && member.nameEn.toLowerCase().includes(q)) ||
        member.role.toLowerCase().includes(q) ||
        (member.roleEn && member.roleEn.toLowerCase().includes(q)) ||
        (member.qualifications && member.qualifications.toLowerCase().includes(q)) ||
        (member.qualificationsEn && member.qualificationsEn.toLowerCase().includes(q)) ||
        (member.bio && member.bio.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [sortedMembers, selectedCategory, searchQuery]);

  return (
    <div id="management-page" className="min-h-screen pb-16">
      {/* Page Header Banner */}
      <PageBanner
        title={isBn ? "হাসপাতাল ব্যবস্থাপনা ও পরিচালনা পরিষদ" : "Hospital Management & Governing Body"}
        subtitle={
          isBn
            ? "আনোয়ারা মেডিকেল কমপ্লেক্সের সততা, সেবামূলক দৃষ্টিভঙ্গি ও মানসম্পন্ন স্বাস্থ্যসেবা নিশ্চিতকরণে নিয়োজিত দক্ষ নেতৃত্ব"
            : "Visionary healthcare leadership ensuring clinical excellence, transparent administration, and patient-first compassionate care."
        }
        badge={isBn ? "ব্যবস্থাপনা ও পরিচালনা পরিষদ" : "Leadership & Governance"}
        icon={Building2}
        currentPageName={isBn ? "পরিচালনা পরিষদ" : "Management"}
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {MANAGEMENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0E3A53] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {isBn ? cat.labelBn : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? "নাম বা পদবি দিয়ে খুঁজুন..." : "Search by name or designation..."}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-gray-400 hover:text-gray-600 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredMembers.map((member) => {
            return (
              <div
                key={member.id}
                id={`member-${member.id}`}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  {/* Image and Role Tag */}
                  <div className="relative mb-4 overflow-hidden rounded-xl bg-gray-100 aspect-[4/3]">
                    <img
                      src={member.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-sm ${
                        member.category === 'governing'
                          ? 'bg-[#0E3A53] text-[#C9973B]'
                          : member.category === 'executive'
                          ? 'bg-[#2D8FC1] text-white'
                          : 'bg-emerald-700 text-white'
                      }`}>
                        {isBn ? member.categoryLabel : (member.categoryLabelEn || member.categoryLabel)}
                      </span>
                    </div>
                  </div>

                  {/* Member Name and Designation */}
                  <div className="mb-3">
                    <span className="text-[11px] font-bold text-[#2D8FC1] uppercase tracking-wide block mb-1">
                      {isBn ? member.role : (member.roleEn || member.role)}
                    </span>
                    <h3 className="font-display font-bold text-lg text-[#0E3A53] leading-tight">
                      {isBn ? member.name : (member.nameEn || member.name)}
                    </h3>
                    <p className="text-xs font-semibold text-gray-500 mt-1">
                      {isBn ? member.qualifications : (member.qualificationsEn || member.qualifications)}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {isBn ? member.bio : (member.bioEn || member.bio)}
                  </p>
                </div>

                {/* Contact and Direct Actions */}
                <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <a
                      href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                      className="inline-flex items-center gap-1.5 font-bold text-[#0E3A53] hover:text-[#2D8FC1] transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#2D8FC1]" />
                      <span>{member.phone}</span>
                    </a>
                    
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-1 text-gray-500 hover:text-[#0E3A53] transition text-[11px]"
                        title={member.email}
                      >
                        <Mail className="w-3 h-3 text-[#C9973B]" />
                        <span>ইমেইল</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 mb-12">
            <p className="text-gray-500 text-sm">
              {isBn ? "কোনো পরিচালনা পর্ষদ সদস্য পাওয়া যায়নি।" : "No management members found matching your search."}
            </p>
          </div>
        )}

        {/* Governance & Ethics Policy */}
        <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-200/90 mb-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#2D8FC1] uppercase tracking-wider block mb-1">
              {isBn ? "প্রশাসনিক নীতিমালা ও দায়বদ্ধতা" : "Governance, Quality & Compliance"}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0E3A53]">
              {isBn ? "রোগী কল্যাণ ও গুণগত মানের প্রাতিষ্ঠানিক সনদ" : "Our Institutional Commitment to Patient Care"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-gray-700">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2D8FC1] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#0E3A53] mb-1">
                  {isBn ? "সরকারি লাইসেন্স ও অনুমোদন" : "Govt Registered & Approved"}
                </h4>
                <p className="text-gray-500 leading-relaxed text-xs">
                  {isBn 
                    ? "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার (DIFE) ও স্বাস্থ্য অধিদপ্তর (DGHS) এর নির্ধারিত আইন ও কমপ্লায়েন্স মেনে পরিচালিত।"
                    : "Fully compliant with DGHS health standards and Ministry of Labour DIFE licensing mandates."}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#C9973B] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#0E3A53] mb-1">
                  {isBn ? "সার্বক্ষণিক কোয়ালিটি কন্ট্রোল" : "24/7 Quality Control"}
                </h4>
                <p className="text-gray-500 leading-relaxed text-xs">
                  {isBn 
                    ? "প্রতিটি ডায়াগনস্টিক রিপোর্ট ও ওষুধ প্রদানের ক্ষেত্রে মেডিকেল সুপারিনটেনডেন্ট ও বিশেষজ্ঞ চিকিৎসক দলের তদারকি।"
                    : "Direct clinical supervision and stringent medical audit on diagnostic accuracy and inpatient patient care."}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#0E3A53] mb-1">
                  {isBn ? "রোগী অভিযোগ ও পরামর্শ উইং" : "Patient Grievance & Feedback"}
                </h4>
                <p className="text-gray-500 leading-relaxed text-xs">
                  {isBn 
                    ? "চিকিৎসাসেবা বা স্টাফদের আচরণে যেকোনো অভিযোগ বা পরামর্শ সরাসরি নির্বাহী পরিচালকের টেবিলে সমাধানের ব্যবস্থা।"
                    : "Direct executive desk oversight for patient satisfaction, complaints, and ethical consultation."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500 text-center sm:text-left">
              {isBn 
                ? "ব্যবস্থাপনা কমিটির সাথে প্রাতিষ্ঠানিক যোগাযোগ বা কর্পোরেট টাই-আপের জন্য হটলাইনে যোগাযোগ করুন।"
                : "For corporate partnerships or official management inquiries, reach reception directly."}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('contact')}
                className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span>{isBn ? "যোগাযোগ ও ঠিকানা" : "Contact & Location"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

