import React, { useState, useMemo, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Search, 
  ExternalLink, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  X, 
  Layers, 
  RotateCcw,
  Tag,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { GALLERY_CATEGORIES, GalleryItem } from '../data/gallery';

const SAMPLE_PHOTO_PRESETS = [
  {
    title: 'হাসপাতাল প্রধান ভবন ও রিসেপশন',
    titleEn: 'Hospital Main Reception & Lobby',
    category: 'building',
    src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    desc: 'আধুনিক ওয়েটিং লাউঞ্জ ও ২৪ ঘণ্টা রিসেপশন ডেস্ক।',
    descEn: 'Modern waiting lounge with 24/7 reception desk.'
  },
  {
    title: 'আধুনিক অপারেশন থিয়েটার (OT)',
    titleEn: 'Modern Operation Theatre Complex',
    category: 'ot',
    src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    desc: 'হেপা ফিল্টার ও অত্যাধুনিক অ্যানেস্থেশিয়া মেশিন সম্বলিত মডুলার ওটি।',
    descEn: 'Modular OT with HEPA filtration and advanced surgical workstations.'
  },
  {
    title: 'ডিজিটাল আল্ট্রাসনোগ্রাম ও ডায়াগনস্টিক ল্যাব',
    titleEn: 'Digital Ultrasound & Diagnostic Lab',
    category: 'diagnostic',
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    desc: 'জাপানি প্রযুক্তির ফোর-ডি কালার ডপলার আল্ট্রাসনোগ্রাম।',
    descEn: 'Japanese 4D color doppler ultrasonography and hematology analyzer.'
  },
  {
    title: 'ভিআইপি এসি কেবিন রুম',
    titleEn: 'Deluxe AC Patient Cabin',
    category: 'cabin',
    src: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    desc: 'সংযুক্ত ওয়াশরুম, টিভি ও এটেনডেন্ট বেডসহ আরামদায়ক কেবিন।',
    descEn: 'Spacious air-conditioned cabin with attached washroom and guest couch.'
  },
  {
    title: '২৪ ঘণ্টা জরুরি বিভাগ ও ট্রমা কেয়ার',
    titleEn: '24/7 Emergency & Trauma Unit',
    category: 'ward',
    src: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    desc: 'জরুরি রোগীদের প্রাথমিক চিকিৎসা ও ট্রমা সাপোর্ট।',
    descEn: 'Round-the-clock emergency triage and life support care.'
  },
  {
    title: 'ফ্রি মেডিকেল ও ডায়াবেটিস স্ক্রিনিং ক্যাম্প',
    titleEn: 'Free Medical & Health Screening Camp',
    category: 'events',
    src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    desc: 'পলাশের সাধারণ রোগীদের জন্য সামাজিক ফ্রি ক্যাম্প ও স্বাস্থ্য সচেতনতা।',
    descEn: 'Community health awareness and free screening clinic.'
  }
];

export const AdminGalleryManager: React.FC = () => {
  const { isBn } = useLanguage();
  const { 
    galleryItems, 
    addGalleryItem, 
    removeGalleryItem, 
    resetGallery, 
    isFirebaseConnected 
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New item form state
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    category: 'building',
    src: '',
    desc: '',
    descEn: '',
  });

  // Filtered gallery items
  const filteredItems = useMemo(() => {
    return galleryItems.filter(item => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesSearch = 
        item.title.toLowerCase().includes(q) ||
        (item.titleEn && item.titleEn.toLowerCase().includes(q)) ||
        (item.desc && item.desc.toLowerCase().includes(q)) ||
        (item.categoryLabel && item.categoryLabel.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [galleryItems, selectedCategory, searchQuery]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError(isBn ? 'অনুগ্রহ করে শুধুমাত্র ছবি ফাইল আপলোড করুন (JPG, PNG, WebP)।' : 'Please upload an image file (JPG, PNG, WebP).');
      return;
    }

    // Limit to 4MB
    if (file.size > 4 * 1024 * 1024) {
      setFormError(isBn ? 'ছবির সাইজ ৪ মেগাবাইটের কম হতে হবে।' : 'Image size must be less than 4MB.');
      return;
    }

    setFormError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData(prev => ({ ...prev, src: event.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle submit new photo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError(isBn ? 'ছবির শিরোনাম (বাংলা) দেওয়া আবশ্যক।' : 'Photo title is required.');
      return;
    }

    if (!formData.src.trim()) {
      setFormError(isBn ? 'ছবির লিংক দিন অথবা আপনার ডিভাইস থেকে ছবি আপলোড করুন।' : 'Please provide an image URL or upload an image file.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCatObj = GALLERY_CATEGORIES.find(c => c.id === formData.category);
      const categoryLabel = selectedCatObj ? selectedCatObj.labelBn : 'সাধারণ';
      const categoryLabelEn = selectedCatObj ? selectedCatObj.labelEn : 'General';

      await addGalleryItem({
        title: formData.title.trim(),
        titleEn: formData.titleEn.trim() || formData.title.trim(),
        category: formData.category,
        categoryLabel,
        categoryLabelEn,
        src: formData.src.trim(),
        desc: formData.desc.trim(),
        descEn: formData.descEn.trim() || formData.desc.trim(),
        createdAt: Date.now()
      });

      // Reset form and close modal
      setFormData({
        title: '',
        titleEn: '',
        category: 'building',
        src: '',
        desc: '',
        descEn: '',
      });
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || (isBn ? 'ছবি যোগ করতে ব্যর্থ হয়েছে।' : 'Failed to save photo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeGalleryItem(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyPreset = (preset: typeof SAMPLE_PHOTO_PRESETS[0]) => {
    setFormData({
      title: preset.title,
      titleEn: preset.titleEn,
      category: preset.category,
      src: preset.src,
      desc: preset.desc,
      descEn: preset.descEn
    });
    setFormError('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-blue-50 text-[#2D8FC1]">
                <ImageIcon className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-lg text-[#0E3A53]">
                {isBn ? "হাসপাতাল ফটো গ্যালারি ব্যবস্থাপনা" : "Hospital Photo Gallery Management"}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {isFirebaseConnected ? (isBn ? "ডাটাবেস লাইভ" : "Firestore Live") : (isBn ? "লোকাল ক্যাশ" : "Local")}
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-2xl">
              {isBn 
                ? "এখানে নতুন ফটো যোগ করুন, ক্যাটাগরি নির্ধারণ করুন অথবা অপ্রয়োজনীয় ছবি মুছে ফেলুন। সব ছবি রিয়েল-টাইমে ডাটাবেসে সেভ হয়ে ওয়েবসাইটে প্রদর্শিত হবে।"
                : "Add new hospital photos, categorize them, and delete outdated images. All images automatically sync with the cloud database."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? "নতুন ছবি যোগ করুন" : "Add Photo"}</span>
            </button>
            <button
              onClick={resetGallery}
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium px-3 py-2.5 rounded-xl border border-gray-200 transition cursor-pointer flex items-center gap-1"
              title={isBn ? "ডিফল্ট ছবি তালিকায় রিসেট করুন" : "Reset to default photos"}
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden md:inline">{isBn ? "রিসেট" : "Reset"}</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {GALLERY_CATEGORIES.map(cat => (
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
              placeholder={isBn ? "ছবি খুঁজুন..." : "Search photos..."}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
              <img 
                src={item.src} 
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback image if broken
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                  {isBn ? item.categoryLabel : (item.categoryLabelEn || item.categoryLabel)}
                </span>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setPreviewImage(item.src)}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition cursor-pointer"
                  title="বড় করে দেখুন"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-xs transition cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#0E3A53] line-clamp-1 leading-snug">
                  {isBn ? item.title : (item.titleEn || item.title)}
                </h4>
                {item.desc && (
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {isBn ? item.desc : (item.descEn || item.desc)}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active'}</span>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                >
                  {isBn ? "মুছে ফেলুন" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">
            {isBn ? "কোনো ছবি পাওয়া যায়নি" : "No photos found"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {isBn ? "নতুন ছবি যুক্ত করতে উপরের বাটনে ক্লিক করুন।" : "Click 'Add Photo' to upload hospital images."}
          </p>
        </div>
      )}

      {/* ADD PHOTO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2D8FC1] flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0E3A53]">
                    {isBn ? "গ্যালারিতে নতুন ছবি যোগ করুন" : "Add New Gallery Photo"}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {isBn ? "ডাটাবেসে স্বয়ংক্রিয়ভাবে সেভ হবে" : "Automatically persists to Firestore database"}
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

            {/* Quick Sample Presets */}
            <div className="mb-5 p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0E3A53] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9973B]" />
                <span>{isBn ? "দ্রুত মেডিকেল ফটো প্রিসেট পছন্দ করুন (১-ক্লিক):" : "Instant Sample Photo Presets (1-Click):"}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-[11px] bg-white hover:bg-blue-50 hover:text-[#2D8FC1] text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200 transition cursor-pointer shadow-xs"
                  >
                    + {isBn ? preset.title.split(' ')[0] : preset.titleEn.split(' ')[0]} ({isBn ? preset.title : preset.titleEn})
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "ছবির শিরোনাম (বাংলা) *" : "Title (Bengali) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="যেমন: অত্যাধুনিক অপারেশন থিয়েটার"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "ছবির শিরোনাম (English)" : "Title (English)"}
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g. Modern Operation Theatre"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isBn ? "ক্যাটাগরি নির্বাচন করুন *" : "Category *"}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                >
                  {GALLERY_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.labelBn} ({cat.labelEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Input Options */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isBn ? "ছবি আপলোড বা লিংক দিন *" : "Image File or URL *"}
                </label>
                
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="url"
                    value={formData.src}
                    onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                    placeholder="https://i.postimg.cc/... অথবা যেকোনো ছবির লিঙ্ক"
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
                    className="bg-blue-50 hover:bg-blue-100 text-[#0E3A53] text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <UploadCloud className="w-4 h-4 text-[#2D8FC1]" />
                    <span>{isBn ? "ডিভাইস থেকে ফাইল বাছুন" : "Upload File"}</span>
                  </button>
                </div>

                {/* Live Preview Box */}
                {formData.src && (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 mt-2">
                    <img
                      src={formData.src}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, src: '' })}
                      className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white hover:bg-red-600 transition"
                      title="মুছুন"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "সংক্ষিপ্ত বিবরণ (বাংলা)" : "Description (Bengali)"}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    placeholder="যেমন: রোগীর স্বাচ্ছন্দ্য নিশ্চিতকরণে সার্বক্ষণিক সেবার ব্যবস্থা..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? "সংক্ষিপ্ত বিবরণ (English)" : "Description (English)"}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descEn}
                    onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                    placeholder="e.g. Equipped with 24/7 emergency medical staff..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
                  />
                </div>
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

      {/* LIGHTBOX PREVIEW */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl">
            <img 
              src={previewImage} 
              alt="Enlarged view" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white"
            >
              <X className="w-5 h-5" />
            </button>
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
              {isBn ? "ছবি মুছে ফেলতে চান?" : "Delete Photo?"}
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              "{deleteTarget.title}" {isBn ? "ডাটাবেস ও ওয়েবসাইট থেকে স্থায়ীভাবে মুছে যাবে।" : "will be permanently removed from Firestore and website."}
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
