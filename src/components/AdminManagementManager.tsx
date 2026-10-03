import React, { useState, useMemo, useRef } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Search, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  X, 
  Phone, 
  Mail, 
  Award, 
  RotateCcw,
  Quote,
  UserCheck,
  Briefcase,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { MANAGEMENT_CATEGORIES, ManagementMember } from '../data/management';

const ROLE_PRESETS = [
  { bn: 'চেয়ারম্যান ও প্রতিষ্ঠাতা', en: 'Chairman & Founder', cat: 'governing' },
  { bn: 'ব্যবস্থাপনা পরিচালক (MD)', en: 'Managing Director (MD)', cat: 'executive' },
  { bn: 'ভাইস-চেয়ারম্যান', en: 'Vice-Chairman', cat: 'governing' },
  { bn: 'পরিচালক (প্রশাসন)', en: 'Director (Administration)', cat: 'executive' },
  { bn: 'পরিচালক (অর্থ ও পরিকল্পনা)', en: 'Director (Finance & Planning)', cat: 'executive' },
  { bn: 'মেডিকেল সুপারিনটেনডেন্ট', en: 'Medical Superintendent', cat: 'medical_admin' },
  { bn: 'প্রধান কনসালটেন্ট ও পরিচালক', en: 'Chief Consultant & Director', cat: 'medical_admin' },
  { bn: 'উপদেষ্টা', en: 'Senior Advisor', cat: 'governing' },
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
];

export const AdminManagementManager: React.FC = () => {
  const { isBn } = useLanguage();
  const { 
    managementMembers, 
    addManagementMember, 
    updateManagementMember, 
    removeManagementMember, 
    resetManagement, 
    isFirebaseConnected 
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagementMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    role: '',
    roleEn: '',
    category: 'governing' as 'governing' | 'executive' | 'medical_admin',
    qualifications: '',
    qualificationsEn: '',
    bio: '',
    bioEn: '',
    phone: '01712-000000',
    email: '',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    message: '',
    messageEn: '',
    order: 1
  });

  // Filtered members
  const filteredMembers = useMemo(() => {
    return [...managementMembers]
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
      .filter(m => {
        const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        if (!q) return matchesCategory;

        return matchesCategory && (
          m.name.toLowerCase().includes(q) ||
          (m.nameEn && m.nameEn.toLowerCase().includes(q)) ||
          m.role.toLowerCase().includes(q) ||
          (m.roleEn && m.roleEn.toLowerCase().includes(q)) ||
          (m.qualifications && m.qualifications.toLowerCase().includes(q))
        );
      });
  }, [managementMembers, selectedCategory, searchQuery]);

  const openAddModal = () => {
    setEditingMemberId(null);
    setFormError('');
    setFormData({
      name: '',
      nameEn: '',
      role: '',
      roleEn: '',
      category: 'governing',
      qualifications: '',
      qualificationsEn: '',
      bio: '',
      bioEn: '',
      phone: '01712-692504',
      email: '',
      image: AVATAR_PRESETS[0],
      message: '',
      messageEn: '',
      order: managementMembers.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: ManagementMember) => {
    setEditingMemberId(member.id);
    setFormError('');
    setFormData({
      name: member.name,
      nameEn: member.nameEn || member.name,
      role: member.role,
      roleEn: member.roleEn || member.role,
      category: member.category,
      qualifications: member.qualifications || '',
      qualificationsEn: member.qualificationsEn || '',
      bio: member.bio || '',
      bioEn: member.bioEn || '',
      phone: member.phone || '',
      email: member.email || '',
      image: member.image || AVATAR_PRESETS[0],
      message: member.message || '',
      messageEn: member.messageEn || '',
      order: member.order ?? 99
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError(isBn ? 'অনুগ্রহ করে শুধুমাত্র ছবি ফাইল আপলোড করুন।' : 'Please upload an image file.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setFormError(isBn ? 'ছবির সাইজ ৪ মেগাবাইটের কম হতে হবে।' : 'Image size must be less than 4MB.');
      return;
    }

    setFormError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData(prev => ({ ...prev, image: event.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError(isBn ? 'সদস্যের নাম (বাংলা) দেওয়া আবশ্যক।' : 'Member name is required.');
      return;
    }

    if (!formData.role.trim()) {
      setFormError(isBn ? 'পদবি / দায়িত্ব (বাংলা) দেওয়া আবশ্যক।' : 'Designation/Role is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCatObj = MANAGEMENT_CATEGORIES.find(c => c.id === formData.category);
      const categoryLabel = selectedCatObj ? selectedCatObj.labelBn : 'পরিচালনা পর্ষদ';
      const categoryLabelEn = selectedCatObj ? selectedCatObj.labelEn : 'Governing Body';

      if (editingMemberId) {
        await updateManagementMember(editingMemberId, {
          name: formData.name.trim(),
          nameEn: formData.nameEn.trim() || formData.name.trim(),
          role: formData.role.trim(),
          roleEn: formData.roleEn.trim() || formData.role.trim(),
          category: formData.category,
          categoryLabel,
          categoryLabelEn,
          qualifications: formData.qualifications.trim(),
          qualificationsEn: formData.qualificationsEn.trim() || formData.qualifications.trim(),
          bio: formData.bio.trim(),
          bioEn: formData.bioEn.trim() || formData.bio.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          image: formData.image.trim() || AVATAR_PRESETS[0],
          message: formData.message.trim() || '',
          messageEn: formData.messageEn.trim() || '',
          order: Number(formData.order) || 99
        });
      } else {
        await addManagementMember({
          name: formData.name.trim(),
          nameEn: formData.nameEn.trim() || formData.name.trim(),
          role: formData.role.trim(),
          roleEn: formData.roleEn.trim() || formData.role.trim(),
          category: formData.category,
          categoryLabel,
          categoryLabelEn,
          qualifications: formData.qualifications.trim(),
          qualificationsEn: formData.qualificationsEn.trim() || formData.qualifications.trim(),
          bio: formData.bio.trim(),
          bioEn: formData.bioEn.trim() || formData.bio.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          image: formData.image.trim() || AVATAR_PRESETS[0],
          message: formData.message.trim() || '',
          messageEn: formData.messageEn.trim() || '',
          order: Number(formData.order) || (managementMembers.length + 1)
        });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || (isBn ? 'তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।' : 'Failed to save member.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeManagementMember(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-50 text-[#C9973B]">
                <Building2 className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-lg text-[#0E3A53]">
                {isBn ? "পরিচালনা পরিষদ ও গভর্নিং বডি ব্যবস্থাপনা" : "Governing Body & Management Council"}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {isFirebaseConnected ? (isBn ? "ডাটাবেস লাইভ" : "Firestore Live") : (isBn ? "লোকাল ক্যাশ" : "Local")}
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-2xl">
              {isBn 
                ? "হাসপাতালের পরিচালনা পর্ষদ, নির্বাহী পরিচালক এবং মেডিকেল প্রশাসনের সকল সদস্যদের তথ্য ও বাণী যোগ, এডিট ও ডিলিট করুন। প্রতিটি ডাটা সরাসরি ডাটাবেসে স্থায়ী হয়।"
                : "Manage hospital governing body, founders, and executive council members. All records are synchronized in real-time with Firestore."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openAddModal}
              className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? "নতুন সদস্য যোগ করুন" : "Add Member"}</span>
            </button>
            <button
              onClick={resetManagement}
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium px-3 py-2.5 rounded-xl border border-gray-200 transition cursor-pointer flex items-center gap-1"
              title={isBn ? "ডিফল্ট পরিচালনা পর্ষদে রিসেট করুন" : "Reset to default members"}
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden md:inline">{isBn ? "রিসেট" : "Reset"}</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {MANAGEMENT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0E3A53] text-white shadow-xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isBn ? cat.labelBn : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "সদস্যের নাম বা পদবি খুঁজুন..." : "Search member by name/role..."}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Members Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              {/* Member Top Bar */}
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={member.image || AVATAR_PRESETS[0]}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 shadow-xs shrink-0 bg-gray-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = AVATAR_PRESETS[0];
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      member.category === 'governing'
                        ? 'bg-amber-100 text-[#0E3A53]'
                        : member.category === 'executive'
                        ? 'bg-blue-100 text-[#0E3A53]'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isBn ? member.categoryLabel : (member.categoryLabelEn || member.categoryLabel)}
                    </span>
                    {member.order !== undefined && (
                      <span className="text-[10px] text-gray-400 font-mono">#{member.order}</span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#0E3A53] leading-tight truncate">
                    {isBn ? member.name : (member.nameEn || member.name)}
                  </h4>
                  <p className="text-[11px] font-semibold text-[#2D8FC1] truncate mt-0.5">
                    {isBn ? member.role : (member.roleEn || member.role)}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {isBn ? member.qualifications : (member.qualificationsEn || member.qualifications)}
                  </p>
                </div>
              </div>

              {/* Bio summary */}
              {member.bio && (
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3 bg-gray-50/70 p-2 rounded-xl">
                  {isBn ? member.bio : (member.bioEn || member.bio)}
                </p>
              )}

              {/* Special message quote if chairman or md */}
              {member.message && (
                <div className="mb-3 p-2 bg-amber-50/60 rounded-xl border-l-2 border-[#C9973B] text-[11px] text-gray-700 italic flex items-start gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-[#C9973B] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">"{isBn ? member.message : (member.messageEn || member.message)}"</span>
                </div>
              )}

              {/* Contact info */}
              <div className="space-y-1 text-xs text-gray-600 mb-3 pt-2 border-t border-gray-100">
                {member.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#2D8FC1]" />
                    <span>{member.phone}</span>
                  </div>
                )}
                {member.email && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-[#C9973B]" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(member)}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0E3A53] hover:bg-blue-100 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#2D8FC1]" />
                <span>{isBn ? "এডিট" : "Edit"}</span>
              </button>
              <button
                onClick={() => setDeleteTarget(member)}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isBn ? "মুছুন" : "Delete"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">
            {isBn ? "কোনো পরিচালনা পর্ষদ সদস্য পাওয়া যায়নি" : "No members found"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {isBn ? "নতুন সদস্য যোগ করতে উপরের 'নতুন সদস্য যোগ করুন' বাটনে ক্লিক করুন।" : "Click 'Add Member' to add board directors or founders."}
          </p>
        </div>
      )}

      {/* ADD / EDIT MEMBER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C9973B] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0E3A53]">
                    {editingMemberId 
                      ? (isBn ? "সদস্য তথ্য সম্পাদনা (Edit Member)" : "Edit Member Details")
                      : (isBn ? "পরিচালনা পর্ষদে নতুন সদস্য যোগ করুন" : "Add New Governing Member")}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {isBn ? "ডাটাবেসে স্থায়ীভাবে সেভ হবে এবং ওয়েবসাইটে দেখাবে" : "Saves to cloud database & public site"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Quick Role Suggestions */}
            <div className="mb-4 p-3 bg-gray-50 rounded-2xl border border-gray-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0E3A53] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9973B]" />
                <span>{isBn ? "সাধারণ পদবি নির্বাচন (দ্রুত পূরণ):" : "Quick Role Presets:"}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ROLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        role: preset.bn,
                        roleEn: preset.en,
                        category: preset.cat as any
                      }));
                    }}
                    className="text-[11px] bg-white hover:bg-amber-50 hover:text-[#C9973B] text-gray-700 px-2 py-1 rounded-lg border border-gray-200 transition cursor-pointer"
                  >
                    + {preset.bn}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Member Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "সদস্যের নাম (বাংলা) *" : "Name (Bengali) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: আলহাজ্ব মোঃ আনোয়ার হোসেন"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "সদস্যের নাম (English)" : "Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Alhaj Md. Anwar Hossain"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
              </div>

              {/* Role & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "ক্যাটাগরি পরিষদ *" : "Category *"}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  >
                    <option value="governing">{isBn ? "গভর্নিং বডি ও প্রতিষ্ঠাতা" : "Governing Body"}</option>
                    <option value="executive">{isBn ? "নির্বাহী পরিষদ" : "Executive Council"}</option>
                    <option value="medical_admin">{isBn ? "মেডিকেল প্রশাসন" : "Medical Administration"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "পদবি / দায়িত্ব (বাংলা) *" : "Designation (Bengali) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="যেমন: চেয়ারম্যান ও প্রতিষ্ঠাতা"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "পদবি (English)" : "Designation (English)"}
                  </label>
                  <input
                    type="text"
                    value={formData.roleEn}
                    onChange={(e) => setFormData({ ...formData, roleEn: e.target.value })}
                    placeholder="e.g. Chairman & Founder"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
              </div>

              {/* Qualifications & Degrees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "শিক্ষাগত যোগ্যতা ও পদমর্যাদা (বাংলা)" : "Qualifications (Bengali)"}
                  </label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    placeholder="যেমন: এম.এ (ঢাবি), বিশিষ্ট সমাজসেবক"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "শিক্ষাগত যোগ্যতা (English)" : "Qualifications (English)"}
                  </label>
                  <input
                    type="text"
                    value={formData.qualificationsEn}
                    onChange={(e) => setFormData({ ...formData, qualificationsEn: e.target.value })}
                    placeholder="e.g. M.A (Dhaka University)"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
              </div>

              {/* Phone, Email & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "মোবাইল নম্বর" : "Phone"}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01712-692504"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "ইমেইল এড্রেস" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="management@anowaramedical.com"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3 text-[#2D8FC1]" />
                    <span>{isBn ? "প্রদর্শন ক্রম (Order)" : "Display Order"}</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
              </div>

              {/* Photo Input & Preview */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isBn ? "সদস্যের ছবি (Image File / URL)" : "Photo File or URL"}
                </label>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... অথবা ডিভাইস থেকে আপলোড করুন"
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-amber-50 hover:bg-amber-100 text-[#0E3A53] text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <UploadCloud className="w-4 h-4 text-[#C9973B]" />
                    <span>{isBn ? "ছবি আপলোড" : "Upload File"}</span>
                  </button>
                </div>

                {/* Sample Avatar Choice */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-gray-500">{isBn ? "প্রিসেট ছবি:" : "Presets:"}</span>
                  <div className="flex items-center gap-1.5">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset })}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition cursor-pointer ${
                          formData.image === preset ? 'border-[#2D8FC1] scale-110' : 'border-gray-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "সদস্যের সংক্ষিপ্ত পরিচিতি (বাংলা)" : "Bio / Overview (Bengali)"}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="পলাশ ও নরসিংদীর চিকিৎসাসেবা উন্নয়নে অঙ্গীকারবদ্ধ..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "পরিচিতি (English)" : "Bio / Overview (English)"}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bioEn}
                    onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
                    placeholder="Committed to excellence in patient-centric healthcare..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
              </div>

              {/* Special Leadership Message (Quotes for Chairman / MD banner) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Quote className="w-3.5 h-3.5 text-[#C9973B]" />
                  <span>{isBn ? "বিশেষ পরিচালনা বার্তা / উক্তি (ঐচ্ছিক)" : "Executive Leadership Quote (Optional)"}</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={isBn ? "যেমন: আমাদের মূল লক্ষ্য কোনো বাণিজ্যিক লাভ নয়; বরং প্রতিটি রোগীর মুখে স্বস্তির হাসি ফোটানো..." : "Quote displayed in the executive message banner"}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{isBn ? "ডাটাবেসে সেভ হচ্ছে..." : "Saving..."}</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{isBn ? "ডাটাবেসে সেভ করুন" : "Save to Database"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#0E3A53] mb-1">
              {isBn ? "সদস্য মুছে ফেলতে চান?" : "Delete Member?"}
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              "{deleteTarget.name}" ({deleteTarget.role}) {isBn ? "ডাটাবেস ও পরিচালনা পর্ষদ থেকে স্থায়ীভাবে মুছে যাবে।" : "will be removed from Firestore and website."}
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                {isBn ? "না, রাখুন" : "Cancel"}
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-sm"
              >
                {isBn ? "হ্যাঁ, মুছুন" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
