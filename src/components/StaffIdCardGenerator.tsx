import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  CreditCard, 
  Printer, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCw, 
  CheckCircle2, 
  QrCode, 
  Upload, 
  Image as ImageIcon, 
  ShieldCheck, 
  Phone, 
  Droplet, 
  Calendar, 
  Search, 
  ExternalLink, 
  X, 
  Layers, 
  Sparkles,
  UserCheck,
  Building2,
  AlertCircle,
  Copy,
  Check,
  Globe,
  Sliders,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Grid
} from 'lucide-react';
import QRCode from 'qrcode';
import { StaffMember } from '../data/staff';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { HospitalLogo } from './HospitalLogo';

// Official Hospital Logo URL provided by user
const OFFICIAL_HOSPITAL_LOGO_URL = 'https://i.postimg.cc/CKFmQGqw/Gemini-Generated-Image-iby2sziby2sziby2-removebg-preview.png';

// Preset professional avatars for convenience if user doesn't upload a photo
const PRESET_AVATARS = [
  { label: 'Dr. (Male)', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=700&q=80' },
  { label: 'Dr. (Female)', url: 'https://images.unsplash.com/photo-1594824813590-789a5b12cca4?auto=format&fit=crop&w=700&q=80' },
  { label: 'Nursing Superintendent', url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=700&q=80' },
  { label: 'Lab Technologist', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=700&q=80' },
  { label: 'Staff Nurse', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=80' },
  { label: 'Radiology Tech', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80' },
  { label: 'Receptionist / Executive', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80' },
];

export const StaffIdCardGenerator: React.FC = () => {
  const { isBn } = useLanguage();
  const { staffList, addStaff, updateStaff, removeStaff } = useData();

  // Selected staff for current preview
  const [selectedStaffId, setSelectedStaffId] = useState<string>(() => {
    return staffList.length > 0 ? staffList[0].id : '';
  });

  // Ensure selectedStaffId stays valid
  useEffect(() => {
    if (staffList.length > 0 && !staffList.some(s => s.id === selectedStaffId)) {
      setSelectedStaffId(staffList[0].id);
    }
  }, [staffList, selectedStaffId]);

  const currentStaff = staffList.find(s => s.id === selectedStaffId) || staffList[0];

  // Card display orientation: 'portrait' (standard lanyard badge) or 'landscape' (wallet CR80)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  // Card side view: 'side-by-side' | 'front' | 'back'
  const [viewSide, setViewSide] = useState<'side-by-side' | 'front' | 'back'>('side-by-side');

  // QR Code Generation Mode: 'web-url' (Direct Live Web Verification) or 'vcard' (Offline Phone Contact Card)
  const [qrMode, setQrMode] = useState<'web-url' | 'vcard'>('web-url');

  // Custom QR Code Base Origin (auto-detected from current window, but editable)
  const [customOrigin, setCustomOrigin] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://anowaramedicalcomplex.com';
  });

  // Dynamic QR Code data URL
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [rawQrPayload, setRawQrPayload] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  // Modals & View Controls
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  const [isVerifyPreviewOpen, setIsVerifyPreviewOpen] = useState(false);
  const [isBatchPrintMode, setIsBatchPrintMode] = useState(false);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast feedback
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Card Studio Canvas & Scaling Controls
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [canvasTheme, setCanvasTheme] = useState<'slate' | 'dark' | 'grid'>('grid');

  // Form State
  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    nameEn: '',
    designation: '',
    designationEn: '',
    department: '',
    departmentEn: '',
    bloodGroup: 'B+' as StaffMember['bloodGroup'],
    phone: '',
    emergencyContact: '01712-692504',
    email: '',
    joinDate: '01 Jan 2024',
    validUntil: '31 Dec 2028',
    photoUrl: PRESET_AVATARS[0].url,
    nationalId: '',
    address: 'Palash, Narsingdi',
    status: 'active' as StaffMember['status']
  });
  const [formError, setFormError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>(PRESET_AVATARS[0].url);

  // Compute the live verification URL
  const getVerificationUrl = (staff: StaffMember) => {
    const origin = customOrigin.replace(/\/+$/, '');
    return `${origin}/?verify=${encodeURIComponent(staff.staffId)}#verify-staff`;
  };

  // Generate dynamic QR code whenever currentStaff, qrMode or customOrigin changes
  useEffect(() => {
    if (!currentStaff) return;

    let payload = '';

    if (qrMode === 'web-url') {
      payload = getVerificationUrl(currentStaff);
    } else {
      // vCard Standard for instant mobile contact recognition without internet
      payload = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${currentStaff.nameEn || currentStaff.name}`,
        'ORG:Anowara Medical Complex',
        `TITLE:${currentStaff.designationEn || currentStaff.designation}`,
        `ROLE:${currentStaff.departmentEn || currentStaff.department}`,
        `TEL;TYPE=WORK,VOICE:${currentStaff.phone || '01712-692504'}`,
        `TEL;TYPE=EMERGENCY:${currentStaff.emergencyContact || '01712-692504'}`,
        `EMAIL:${currentStaff.email || 'info@anowaramedicalcomplex.com'}`,
        `NOTE:Staff ID: ${currentStaff.staffId} | Blood: ${currentStaff.bloodGroup} | Valid: ${currentStaff.validUntil}`,
        `URL:${getVerificationUrl(currentStaff)}`,
        'ADR;TYPE=WORK:;;Wapda Road Medical Mor;Palash;Narsingdi;1610;Bangladesh',
        'END:VCARD'
      ].join('\n');
    }

    setRawQrPayload(payload);

    QRCode.toDataURL(payload, {
      width: 400,
      margin: 1,
      color: {
        dark: '#0A2540',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
  }, [currentStaff, qrMode, customOrigin]);

  // Open modal to add new staff
  const handleOpenAddModal = () => {
    setEditingStaff(null);
    const nextNum = Math.floor(1008 + staffList.length * 3);
    const autoStaffId = `AMC-EMP-${nextNum}`;
    setFormData({
      staffId: autoStaffId,
      name: '',
      nameEn: '',
      designation: '',
      designationEn: '',
      department: 'General OPD & Healthcare',
      departmentEn: 'General OPD & Healthcare',
      bloodGroup: 'B+',
      phone: '01712-000000',
      emergencyContact: '01712-692504',
      email: '',
      joinDate: '01 Jan 2024',
      validUntil: '31 Dec 2028',
      photoUrl: PRESET_AVATARS[0].url,
      nationalId: '',
      address: 'Palash, Narsingdi',
      status: 'active'
    });
    setPhotoPreview(PRESET_AVATARS[0].url);
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Open modal to edit staff
  const handleOpenEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      staffId: staff.staffId,
      name: staff.name,
      nameEn: staff.nameEn || staff.name,
      designation: staff.designation,
      designationEn: staff.designationEn || staff.designation,
      department: staff.department,
      departmentEn: staff.departmentEn || staff.department,
      bloodGroup: staff.bloodGroup,
      phone: staff.phone,
      emergencyContact: staff.emergencyContact || '01712-692504',
      email: staff.email || '',
      joinDate: staff.joinDate,
      validUntil: staff.validUntil,
      photoUrl: staff.photoUrl,
      nationalId: staff.nationalId || '',
      address: staff.address || 'Palash, Narsingdi',
      status: staff.status
    });
    setPhotoPreview(staff.photoUrl);
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Photo file upload handler (FileReader -> DataURL)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setFormError('Image size must be less than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoPreview(result);
      setFormData(prev => ({ ...prev, photoUrl: result }));
      setFormError('');
    };
    reader.readAsDataURL(file);
  };

  // Save Staff (Add or Edit)
  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn.trim() && !formData.name.trim()) {
      setFormError('Staff English name is required for ID card.');
      return;
    }
    if (!formData.designationEn.trim() && !formData.designation.trim()) {
      setFormError('Designation is required.');
      return;
    }
    if (!formData.staffId.trim()) {
      setFormError('Staff ID is required.');
      return;
    }

    const englishName = formData.nameEn.trim() || formData.name.trim();
    const bengaliName = formData.name.trim() || formData.nameEn.trim();
    const englishDesig = formData.designationEn.trim() || formData.designation.trim();
    const bengaliDesig = formData.designation.trim() || formData.designationEn.trim();
    const englishDept = formData.departmentEn.trim() || formData.department.trim();
    const bengaliDept = formData.department.trim() || formData.departmentEn.trim();

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        staffId: formData.staffId.trim(),
        name: bengaliName,
        nameEn: englishName,
        designation: bengaliDesig,
        designationEn: englishDesig,
        department: bengaliDept,
        departmentEn: englishDept,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone.trim(),
        emergencyContact: formData.emergencyContact.trim(),
        email: formData.email.trim(),
        joinDate: formData.joinDate.trim(),
        validUntil: formData.validUntil.trim(),
        photoUrl: photoPreview,
        nationalId: formData.nationalId.trim(),
        address: formData.address.trim(),
        status: formData.status
      });
      setToastMessage(isBn ? `স্টাফ "${englishName}" এর তথ্য সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!` : `Staff "${englishName}" updated and saved successfully!`);
    } else {
      const newStaff = addStaff({
        staffId: formData.staffId.trim(),
        name: bengaliName,
        nameEn: englishName,
        designation: bengaliDesig,
        designationEn: englishDesig,
        department: bengaliDept,
        departmentEn: englishDept,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone.trim(),
        emergencyContact: formData.emergencyContact.trim(),
        email: formData.email.trim(),
        joinDate: formData.joinDate.trim(),
        validUntil: formData.validUntil.trim(),
        photoUrl: photoPreview,
        nationalId: formData.nationalId.trim(),
        address: formData.address.trim(),
        status: formData.status,
        createdAt: Date.now()
      });
      setSelectedStaffId(newStaff.id);
      setToastMessage(isBn ? `নতুন স্টাফ আইডি "${newStaff.staffId}" (${englishName}) সফলভাবে ডেটাবেজে যুক্ত হয়েছে!` : `Staff ID "${newStaff.staffId}" (${englishName}) created and saved!`);
    }

    setIsFormModalOpen(false);
  };

  // Robust Native Print Trigger
  const handlePrint = (isBatch: boolean = false) => {
    setIsBatchPrintMode(isBatch);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Filtered staff list
  const filteredStaff = staffList.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designationEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'all' || s.department.includes(deptFilter) || s.departmentEn.includes(deptFilter);
    return matchesSearch && matchesDept;
  });

  // Unique departments for filter
  const departments = Array.from(new Set(staffList.map(s => s.departmentEn || s.department)));

  // Copy Verification URL
  const copyVerificationLink = () => {
    if (!currentStaff) return;
    const url = getVerificationUrl(currentStaff);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Open verification page directly
  const openVerificationPage = () => {
    if (!currentStaff) return;
    const url = getVerificationUrl(currentStaff);
    window.open(url, '_blank');
  };

  // Active staff reference for printing
  const activeStaff = currentStaff || staffList[0];

  return (
    <div className="space-y-6">
      {/* Print Specific CSS Rules to guarantee exact colors, card layout & remove website UI */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media screen {
          #staff-id-print-portal {
            display: none !important;
            visibility: hidden !important;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
          }

          /* STRICT ISOLATION: Hide entire main website and all root containers */
          #root,
          body > *:not(#staff-id-print-portal) {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            top: -99999px !important;
            left: -99999px !important;
          }

          /* DISPLAY EXCLUSIVELY THE STAFF ID PRINT PORTAL */
          #staff-id-print-portal {
            display: block !important;
            visibility: visible !important;
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: #ffffff !important;
            opacity: 1 !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          .print-crop-box {
            position: relative !important;
            display: inline-block !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .print-crop-corner {
            position: absolute !important;
            color: #94a3b8 !important;
            font-family: monospace !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            line-height: 1 !important;
            user-select: none !important;
          }
          .print-crop-tl { top: -14px !important; left: -14px !important; }
          .print-crop-tr { top: -14px !important; right: -14px !important; }
          .print-crop-bl { bottom: -14px !important; left: -14px !important; }
          .print-crop-br { bottom: -14px !important; right: -14px !important; }
        }
      `}} />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0E3A53] to-[#2D8FC1] text-white flex items-center justify-center shadow-md shrink-0">
            <CreditCard className="w-6 h-6 text-[#C9973B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#0E3A53]">
                {isBn ? "কর্মকর্তা / কর্মচারী আইডি কার্ড জেনারেটর" : "Hospital Staff ID Card Generator"}
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-300">
                CR80 English
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {isBn 
                ? "অফিশিয়াল লোগো, হাই-কোয়ালিটি স্ক্যানেবল কিউআর কোড এবং আন্তর্জাতিক মানের ইংরেজি আইডি কার্ড" 
                : "Official hospital logo, live verifiable QR code & international CR80 English layout"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Orientation Switcher */}
          <div className="bg-gray-100 p-1 rounded-2xl flex items-center text-xs">
            <button
              onClick={() => setOrientation('portrait')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                orientation === 'portrait'
                  ? 'bg-white text-[#0E3A53] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Standard Hospital Lanyard Badge (Vertical)"
            >
              {isBn ? "ভার্টিক্যাল (ব্যাজ)" : "Vertical Badge"}
            </button>
            <button
              onClick={() => setOrientation('landscape')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                orientation === 'landscape'
                  ? 'bg-white text-[#0E3A53] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Standard Pocket / Wallet Card (Horizontal)"
            >
              {isBn ? "হরাইজন্টাল (কার্ড)" : "Horizontal Card"}
            </button>
          </div>

          {/* Add Staff Button */}
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C9973B]" />
            <span>{isBn ? "নতুন কর্মচারী যোগ করুন" : "Add New Staff"}</span>
          </button>

          {/* Print Current Card */}
          <button
            onClick={() => handlePrint(false)}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer"
            title="কার্ড প্রিন্ট করুন"
          >
            <Printer className="w-4 h-4" />
            <span>{isBn ? "কার্ড প্রিন্ট করুন" : "Print ID Card"}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Workspace: Interactive Card Visualizer & Quick Staff Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER: The Rendered CR80 Card Preview */}
        <div className="lg:col-span-8 space-y-4">
          {/* Card View Mode Selector & Studio Canvas Controls */}
          <div className="bg-white rounded-2xl p-3 border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* View Mode */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-500">{isBn ? "ভিউ:" : "View:"}</span>
                <div className="bg-gray-100 p-0.5 rounded-xl flex items-center text-xs">
                  <button
                    onClick={() => setViewSide('side-by-side')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      viewSide === 'side-by-side' ? 'bg-white text-[#0E3A53] shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    Dual (Front & Back)
                  </button>
                  <button
                    onClick={() => setViewSide('front')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      viewSide === 'front' ? 'bg-white text-[#0E3A53] shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setViewSide('back')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      viewSide === 'back' ? 'bg-white text-[#0E3A53] shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    Back
                  </button>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-xl text-xs">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.7, Number((prev - 0.1).toFixed(1))))}
                  className="p-1 rounded-lg text-gray-600 hover:text-black hover:bg-white transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="px-2 py-0.5 font-mono text-[11px] font-bold text-[#0E3A53] hover:bg-white rounded-lg transition cursor-pointer"
                  title="Reset Zoom to 100%"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(1.4, Number((prev + 0.1).toFixed(1))))}
                  className="p-1 rounded-lg text-gray-600 hover:text-black hover:bg-white transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Canvas Theme Switcher */}
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-xl text-xs">
                <button
                  onClick={() => setCanvasTheme('grid')}
                  className={`p-1 rounded-lg transition cursor-pointer ${
                    canvasTheme === 'grid' ? 'bg-white text-[#0E3A53] shadow-xs' : 'text-gray-500'
                  }`}
                  title="Studio Grid Canvas"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCanvasTheme('dark')}
                  className={`p-1 rounded-lg transition cursor-pointer ${
                    canvasTheme === 'dark' ? 'bg-white text-[#0E3A53] shadow-xs' : 'text-gray-500'
                  }`}
                  title="Dark High-Contrast Canvas"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCanvasTheme('slate')}
                  className={`p-1 rounded-lg transition cursor-pointer ${
                    canvasTheme === 'slate' ? 'bg-white text-[#0E3A53] shadow-xs' : 'text-gray-500'
                  }`}
                  title="Light Slate Canvas"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {/* Fullscreen Modal View */}
              <button
                onClick={() => setIsFullscreenModalOpen(true)}
                className="inline-flex items-center gap-1 text-gray-700 hover:text-[#0E3A53] bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-xl font-bold transition cursor-pointer"
                title="কার্ডটি বড় পর্দায় স্পষ্ট দেখতে ক্লিক করুন"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#0E3A53]" />
                <span className="hidden sm:inline">{isBn ? "বড় স্ক্রিন" : "Fullscreen"}</span>
              </button>

              {/* Test Scan / Open Link */}
              <button
                onClick={openVerificationPage}
                className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer"
                title="কিউআর কোড স্ক্যান করলে যে পেজটি খুলবে তা টেস্ট করুন"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Test QR Link</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={() => handleOpenEditModal(currentStaff)}
                className="inline-flex items-center gap-1 text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isBn ? "এডিট" : "Edit"}</span>
              </button>
            </div>
          </div>

          {/* CARD CONTAINER (High-resolution rendering in 100% English) */}
          <div 
            id="printable-id-card-area" 
            className={`relative rounded-3xl p-5 sm:p-8 border transition-all duration-300 min-h-[530px] flex items-center justify-center overflow-x-auto overflow-y-hidden shadow-inner ${
              canvasTheme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-white'
                : canvasTheme === 'grid'
                ? 'bg-[#f1f5f9] border-slate-300 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:16px_16px]'
                : 'bg-gradient-to-b from-slate-100 to-slate-200 border-slate-300'
            }`}
          >
            {/* Inner Transform & Scaling Wrapper */}
            <div 
              className="w-full flex flex-wrap items-center justify-center gap-6 sm:gap-10 transition-transform duration-200 ease-out"
              style={{
                transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined,
                transformOrigin: 'center center'
              }}
            >
              {/* FRONT SIDE CARD (100% ENGLISH) */}
              {(viewSide === 'side-by-side' || viewSide === 'front') && (
                <div className="flex flex-col items-center">
                  <span className={`text-[11px] font-bold mb-2 uppercase tracking-wider flex items-center gap-1 ${
                    canvasTheme === 'dark' ? 'text-slate-300' : 'text-gray-500'
                  }`}>
                    <span>Front Side</span>
                    <span className="text-[9px] font-mono opacity-80">(CR80 English)</span>
                  </span>
                  
                  {orientation === 'portrait' ? (
                    /* ================= PORTRAIT CR80 (2.125" x 3.375") ================= */
                  <div 
                    className="cr80-card w-[310px] h-[490px] bg-white rounded-[16px] shadow-2xl overflow-hidden border border-slate-300 flex flex-col relative select-none shrink-0"
                    style={{
                      boxShadow: '0 20px 40px -15px rgba(14, 58, 83, 0.25), 0 0 0 1px rgba(0,0,0,0.06)'
                    }}
                  >
                    {/* Header Banner with Official Anowara Medical Complex Logo */}
                    <div className="bg-gradient-to-r from-[#0A2540] via-[#0E3A53] to-[#0A2540] text-white pt-3.5 pb-2.5 px-3 text-center relative border-b-2 border-[#C9973B]">
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        {/* Official Hospital Logo with clean white circular background and crisp rendering */}
                        <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center border border-white/80 shrink-0 overflow-hidden">
                          <img
                            src={OFFICIAL_HOSPITAL_LOGO_URL}
                            alt="Anowara Medical Complex Logo"
                            crossOrigin="anonymous"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-left leading-tight">
                          <h3 className="font-black text-[13px] tracking-wide text-white uppercase font-sans">
                            ANOWARA MEDICAL COMPLEX
                          </h3>
                          <p className="text-[8.5px] text-emerald-300 font-bold uppercase tracking-wider">
                            Palash, Narsingdi
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-[8px] text-gray-200 font-medium tracking-tight">
                        Wapda Sadar Road, Medical Mor, Palash, Narsingdi
                      </p>

                      {/* Official English Badge Title */}
                      <div className="mt-1.5 inline-flex items-center gap-1 bg-[#C9973B] text-[#0A2540] text-[9px] font-black uppercase px-3 py-0.5 rounded-full shadow-xs tracking-wider">
                        <ShieldCheck className="w-3 h-3" />
                        <span>STAFF IDENTITY CARD</span>
                      </div>
                    </div>

                    {/* Staff Photograph Section */}
                    <div className="pt-3 pb-1 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-[#0E3A53] shadow-md bg-gray-100">
                          <img 
                            src={currentStaff?.photoUrl || PRESET_AVATARS[0].url} 
                            alt={currentStaff?.nameEn || currentStaff?.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        {/* Verified badge */}
                        <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white rounded-full p-1 shadow-md" title="Hospital Verified Staff">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Staff Info Body (Strictly English) */}
                    <div className="px-4 py-2 text-center flex-1 flex flex-col justify-between">
                      <div>
                        {/* Full English Name */}
                        <h4 className="font-black text-[15px] text-[#0A2540] leading-tight tracking-tight">
                          {currentStaff?.nameEn || currentStaff?.name}
                        </h4>

                        {/* English Designation */}
                        <div className="mt-1.5 inline-block bg-blue-50 text-[#0E3A53] border border-blue-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-bold">
                          {currentStaff?.designationEn || currentStaff?.designation}
                        </div>

                        {/* English Department */}
                        <p className="text-[10px] text-gray-600 font-semibold mt-1">
                          {currentStaff?.departmentEn || currentStaff?.department}
                        </p>
                      </div>

                      {/* Staff ID & Blood Group Grid */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-gray-200 rounded-xl p-2 my-1 text-left">
                        <div>
                          <span className="text-[7.5px] text-gray-400 uppercase font-bold block">STAFF ID NO</span>
                          <span className="text-[11px] font-black text-[#0A2540] font-mono">
                            {currentStaff?.staffId}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[7.5px] text-gray-400 uppercase font-bold block">BLOOD GROUP</span>
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-md">
                            <Droplet className="w-2.5 h-2.5 fill-red-600 text-red-600" />
                            {currentStaff?.bloodGroup}
                          </span>
                        </div>
                      </div>

                      {/* Validity and Signature */}
                      <div className="flex items-end justify-between pt-1 border-t border-gray-100 text-[9px] text-gray-500">
                        <div className="text-left leading-tight">
                          <span className="text-[7px] text-gray-400 block font-bold uppercase">VALID THRU</span>
                          <span className="font-bold text-[#0A2540] text-[9.5px]">{currentStaff?.validUntil}</span>
                        </div>
                        <div className="text-right leading-tight">
                          <div className="h-5 flex items-end justify-end"></div>
                          <span className="text-[6.5px] text-gray-400 block border-t border-gray-300 pt-0.5 font-bold uppercase">
                            Authorized Signatory
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Emergency Ribbon */}
                    <div className="bg-[#0A2540] text-white text-[8px] py-1 px-3 flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5 text-[#C9973B]" />
                        +880 1712-692504
                      </span>
                      <span className="text-emerald-300">anowaramedicalcomplex.com</span>
                    </div>
                  </div>
                ) : (
                  /* ================= LANDSCAPE CR80 (3.375" x 2.125") ================= */
                  <div 
                    className="cr80-card w-[450px] h-[284px] bg-white rounded-[16px] shadow-2xl overflow-hidden border border-slate-300 flex flex-col relative select-none shrink-0"
                    style={{
                      boxShadow: '0 20px 40px -15px rgba(14, 58, 83, 0.25), 0 0 0 1px rgba(0,0,0,0.06)'
                    }}
                  >
                    {/* Header with Official Logo */}
                    <div className="bg-gradient-to-r from-[#0A2540] via-[#0E3A53] to-[#0A2540] text-white py-2 px-3.5 flex items-center justify-between border-b-2 border-[#C9973B]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-sm shrink-0 overflow-hidden flex items-center justify-center">
                          <img
                            src={OFFICIAL_HOSPITAL_LOGO_URL}
                            alt="Anowara Medical Complex"
                            crossOrigin="anonymous"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-black text-[12px] uppercase text-white tracking-wide leading-tight">
                            ANOWARA MEDICAL COMPLEX
                          </h3>
                          <p className="text-[8px] text-emerald-300 font-bold uppercase tracking-wide leading-none">
                            Govt. Reg. Hospital • Palash, Narsingdi
                          </p>
                        </div>
                      </div>
                      <div className="bg-[#C9973B] text-[#0A2540] text-[8.5px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                        STAFF ID CARD
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-3.5 flex-1 flex items-center gap-3.5">
                      {/* Photo */}
                      <div className="relative shrink-0">
                        <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-[#0A2540] bg-gray-100 shadow-md">
                          <img 
                            src={currentStaff?.photoUrl || PRESET_AVATARS[0].url} 
                            alt={currentStaff?.nameEn || currentStaff?.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Details (Strictly English) */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-28 my-auto py-0.5">
                        <div className="pt-0.5">
                          <h4 className="font-black text-[15px] text-[#0A2540] leading-tight truncate">
                            {currentStaff?.nameEn || currentStaff?.name}
                          </h4>
                          <div className="mt-1 inline-block bg-blue-50 text-[#0E3A53] border border-blue-200/80 px-2 py-0.5 rounded text-[10.5px] font-bold">
                            {currentStaff?.designationEn || currentStaff?.designation}
                          </div>
                          <p className="text-[9.5px] text-gray-600 font-semibold truncate mt-0.5">
                            {currentStaff?.departmentEn || currentStaff?.department}
                          </p>
                        </div>

                        {/* ID, Blood, Validity */}
                        <div className="flex items-center gap-3 mt-1 pt-1.5 border-t border-gray-100 text-[10px]">
                          <div>
                            <span className="text-[7px] text-gray-400 uppercase font-bold block">STAFF ID</span>
                            <span className="font-mono font-black text-[#0A2540]">{currentStaff?.staffId}</span>
                          </div>
                          <div>
                            <span className="text-[7px] text-gray-400 uppercase font-bold block">BLOOD</span>
                            <span className="font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-[9.5px]">
                              {currentStaff?.bloodGroup}
                            </span>
                          </div>
                          <div className="ml-auto text-right">
                            <span className="text-[7px] text-gray-400 uppercase font-bold block">VALID THRU</span>
                            <span className="font-bold text-gray-800 text-[9.5px]">{currentStaff?.validUntil}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Ribbon */}
                    <div className="bg-[#0A2540] text-white text-[8px] py-1 px-3.5 flex items-center justify-between font-semibold">
                      <span>Emergency Hotline: 01712-692504</span>
                      <span className="text-emerald-300">Wapda Road, Palash, Narsingdi</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BACK SIDE CARD (ALL ENGLISH + HIGH CONTRAST QR CODE) */}
            {(viewSide === 'side-by-side' || viewSide === 'back') && (
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                  <span>Back Side</span>
                  <span className="text-[9px] text-emerald-600 font-bold">(Live QR & Terms)</span>
                </span>

                {orientation === 'portrait' ? (
                  /* ================= PORTRAIT CR80 BACK ================= */
                  <div 
                    className="cr80-card w-[310px] h-[490px] bg-white rounded-[16px] shadow-2xl overflow-hidden border border-slate-300 flex flex-col relative select-none shrink-0"
                    style={{
                      boxShadow: '0 20px 40px -15px rgba(14, 58, 83, 0.25), 0 0 0 1px rgba(0,0,0,0.06)'
                    }}
                  >
                    {/* Top Bar with Logo */}
                    <div className="bg-[#0A2540] text-white pt-3 pb-2 px-3 text-center border-b-2 border-[#C9973B]">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-xs flex items-center justify-center border border-white/60 shrink-0 overflow-hidden">
                          <img src={OFFICIAL_HOSPITAL_LOGO_URL} alt="Anowara Medical Complex Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
                        </div>
                        <h4 className="font-black text-[11px] uppercase tracking-wider text-white">
                          ANOWARA MEDICAL COMPLEX
                        </h4>
                      </div>
                      <p className="text-[8px] text-emerald-300 font-bold uppercase tracking-wide">
                        STAFF CREDENTIAL & VERIFICATION
                      </p>
                    </div>

                    {/* Terms & Instructions in Clean Formal English */}
                    <div className="px-3.5 py-2 text-[8.5px] text-gray-600 space-y-1 border-b border-gray-100">
                      <div className="flex items-start gap-1">
                        <span className="font-bold text-[#0A2540]">1.</span>
                        <p className="leading-tight">
                          This identity card is the exclusive property of Anowara Medical Complex and is non-transferable.
                        </p>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="font-bold text-[#0A2540]">2.</span>
                        <p className="leading-tight">
                          The bearer must visibly display this card during hospital duty and upon official request.
                        </p>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="font-bold text-[#0A2540]">3.</span>
                        <p className="leading-tight">
                          If found, please return to: Reception Desk, Wapda Sadar Road, Medical Mor, Palash, Narsingdi.
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Live QR Code Centerpiece */}
                    <div className="flex-1 flex flex-col items-center justify-center p-2 text-center bg-slate-50/80">
                      <div className="p-2 bg-white rounded-2xl border-2 border-dashed border-[#0E3A53]/30 shadow-xs flex flex-col items-center">
                        {qrCodeDataUrl ? (
                          <img 
                            src={qrCodeDataUrl} 
                            alt={`QR Code for ${currentStaff?.staffId}`} 
                            className="w-28 h-28 object-contain"
                          />
                        ) : (
                          <div className="w-28 h-28 bg-gray-100 flex items-center justify-center">
                            <QrCode className="w-8 h-8 text-gray-400 animate-pulse" />
                          </div>
                        )}
                        <span className="text-[8px] font-mono text-[#0A2540] font-black mt-1">
                          {currentStaff?.staffId}
                        </span>
                      </div>

                      <div className="mt-1.5">
                        <p className="text-[9px] font-black text-[#0A2540] flex items-center justify-center gap-1 uppercase tracking-wide">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Scan to Verify Credentials</span>
                        </p>
                        <p className="text-[7.5px] text-gray-500 font-medium">
                          Point any smartphone camera to view official live registry
                        </p>
                      </div>
                    </div>

                    {/* Emergency Contacts on Back (All English) */}
                    <div className="px-3.5 py-1.5 bg-white border-t border-gray-100 text-[8.5px] text-gray-700 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[7px] text-gray-400 uppercase font-bold block">EMERGENCY HOTLINE</span>
                        <span className="font-bold text-[#0A2540]">{currentStaff?.emergencyContact || '01712-692504'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[7px] text-gray-400 uppercase font-bold block">HOSPITAL REG / NID</span>
                        <span className="font-mono text-gray-700 font-bold">{currentStaff?.nationalId || 'AMC-REG-9812'}</span>
                      </div>
                    </div>

                    {/* Barcode Mock Ribbon at Bottom */}
                    <div className="bg-[#0A2540] text-white py-1 px-3 flex flex-col items-center justify-center">
                      <div className="w-full flex justify-between tracking-widest text-[6.5px] font-mono opacity-70 select-none overflow-hidden h-3">
                        ||||| | |||| ||| || ||||| | ||| |||| | |||| || ||||| ||| |||| | ||||| | |||| |||
                      </div>
                      <span className="text-[7px] text-emerald-300 font-mono mt-0.5 tracking-wider">
                        AMC-SECURITY-ENCRYPTED • HOSPITAL REGISTRY
                      </span>
                    </div>
                  </div>
                ) : (
                  /* ================= LANDSCAPE CR80 BACK ================= */
                  <div 
                    className="cr80-card w-[450px] h-[284px] bg-white rounded-[16px] shadow-2xl overflow-hidden border border-slate-300 flex flex-col relative select-none shrink-0"
                    style={{
                      boxShadow: '0 20px 40px -15px rgba(14, 58, 83, 0.25), 0 0 0 1px rgba(0,0,0,0.06)'
                    }}
                  >
                    {/* Top Bar */}
                    <div className="bg-[#0A2540] text-white py-1.5 px-4 flex items-center justify-between border-b-2 border-[#C9973B]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white p-0.5 shrink-0 overflow-hidden flex items-center justify-center">
                          <img src={OFFICIAL_HOSPITAL_LOGO_URL} alt="Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
                        </div>
                        <h4 className="font-black text-[10.5px] uppercase tracking-wider text-white">
                          ANOWARA MEDICAL COMPLEX • PALASH, NARSINGDI
                        </h4>
                      </div>
                      <span className="text-[9px] text-emerald-300 font-mono font-bold">
                        {currentStaff?.staffId}
                      </span>
                    </div>

                    {/* Content Body: Terms on Left, QR code on Right */}
                    <div className="p-3 flex-1 flex items-center gap-3">
                      {/* Left: Terms (All English) */}
                      <div className="flex-1 text-[8.5px] text-gray-600 space-y-1 pr-2 border-r border-gray-100">
                        <p className="leading-tight font-medium text-gray-700">
                          • This card is the property of <strong className="text-[#0A2540]">Anowara Medical Complex</strong> and is non-transferable.
                        </p>
                        <p className="leading-tight">
                          • If found, please return to hospital reception desk at Wapda Sadar Road, Medical Mor, Palash, Narsingdi.
                        </p>
                        <p className="leading-tight text-red-700 font-semibold">
                          • Emergency Hotline: 01712-692504 / 01944-874304
                        </p>
                        <div className="pt-1 flex items-center gap-3 text-[8px]">
                          <div>
                            <span className="text-gray-400 uppercase font-bold block text-[6.5px]">ISSUED</span>
                            <span className="font-bold text-gray-800">{currentStaff?.joinDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 uppercase font-bold block text-[6.5px]">EXPIRES</span>
                            <span className="font-bold text-emerald-700">{currentStaff?.validUntil}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 uppercase font-bold block text-[6.5px]">HOSPITAL REG</span>
                            <span className="font-mono text-gray-600">{currentStaff?.nationalId || 'AMC-REG'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Dynamic High-Contrast QR */}
                      <div className="w-32 flex flex-col items-center text-center shrink-0">
                        <div className="p-1.5 bg-white border border-gray-200 rounded-xl shadow-xs">
                          {qrCodeDataUrl ? (
                            <img src={qrCodeDataUrl} alt="Staff QR" className="w-20 h-20 object-contain" />
                          ) : (
                            <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
                              <QrCode className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <span className="text-[8px] font-black text-[#0A2540] mt-1 uppercase">Scan to Verify</span>
                        <span className="text-[7px] text-gray-400 font-mono">anowaramedicalcomplex.com</span>
                      </div>
                    </div>

                    {/* Bottom Ribbon */}
                    <div className="bg-[#0A2540] text-white py-1 px-4 flex items-center justify-between text-[7.5px] font-mono">
                      <span>OFFICIAL PERSONNEL REGISTRY</span>
                      <span className="text-emerald-300">WAPDA ROAD, MEDICAL MOR, PALASH</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>

          {/* Quick Actions & QR Code Diagnostics Bar */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-600">QR Code Mode:</span>
                <div className="bg-gray-100 p-0.5 rounded-xl flex items-center">
                  <button
                    onClick={() => setQrMode('web-url')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      qrMode === 'web-url' ? 'bg-[#0E3A53] text-white shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    Live Web Verification URL
                  </button>
                  <button
                    onClick={() => setQrMode('vcard')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      qrMode === 'vcard' ? 'bg-[#0E3A53] text-white shadow-xs' : 'text-gray-600'
                    }`}
                    title="Works on any phone camera without internet"
                  >
                    Digital vCard (Offline)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyVerificationLink}
                  className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Link Copied!" : "Copy URL"}</span>
                </button>

                <button
                  onClick={openVerificationPage}
                  className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-[#0E3A53] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#2D8FC1]" />
                  <span>Open Verification Portal</span>
                </button>
              </div>
            </div>

            {/* Verification Link Display */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-[11px] text-gray-400 font-bold shrink-0">Scanned QR Target:</span>
                <span className="font-mono text-[11px] text-[#0E3A53] truncate select-all">
                  {qrMode === 'web-url' ? getVerificationUrl(currentStaff) : 'vCard: Dr. Mohammad Rafiqul Islam / Anowara Medical Complex'}
                </span>
              </div>

              <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Active & Valid
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Staff Directory & Quick Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-[#0E3A53] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#2D8FC1]" />
                <span>{isBn ? `স্টাফ তালিকা (${staffList.length})` : `Hospital Staff List (${staffList.length})`}</span>
              </h3>

              <button
                onClick={() => handlePrint(true)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition cursor-pointer"
                title="সকল কর্মচারীর আইডি কার্ড একসাথে প্রিন্ট করুন"
              >
                {isBn ? "সব প্রিন্ট (Batch)" : "Batch Print All"}
              </button>
            </div>

            {/* Search and Filters */}
            <div className="py-3 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isBn ? "নাম বা পদবি দিয়ে খুঁজুন..." : "Search staff name, ID..."}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                />
              </div>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
              >
                <option value="all">{isBn ? "সব বিভাগ (All Departments)" : "All Departments"}</option>
                {departments.map((dept, i) => (
                  <option key={i} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Staff Card Items List */}
            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 pr-1">
              {filteredStaff.map((staff) => {
                const isSelected = staff.id === selectedStaffId;
                return (
                  <div
                    key={staff.id}
                    onClick={() => setSelectedStaffId(staff.id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'bg-blue-50/80 border-[#2D8FC1] shadow-xs' 
                        : 'bg-white border-gray-200/70 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={staff.photoUrl} 
                        alt={staff.nameEn || staff.name} 
                        className="w-10 h-12 rounded-lg object-cover object-top border border-gray-200 shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-[#0E3A53] bg-blue-100 px-1.5 py-0.2 rounded">
                            {staff.staffId}
                          </span>
                          <span className="text-[10px] font-bold text-red-600">
                            {staff.bloodGroup}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-[#0E3A53] truncate mt-0.5">
                          {staff.nameEn || staff.name}
                        </h4>
                        <p className="text-[10px] text-gray-500 truncate">
                          {staff.designationEn || staff.designation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(staff);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition cursor-pointer"
                        title="Edit Info"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {staffList.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStaffToDelete(staff);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredStaff.length === 0 && (
                <div className="text-center py-8 text-xs text-gray-400">
                  {isBn ? "কোনো স্টাফ পাওয়া যায়নি" : "No staff found"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. MODAL: ADD / EDIT STAFF MEMBER */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-gray-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0E3A53] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#2D8FC1]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0E3A53]">
                  {editingStaff ? "Edit Staff ID Card Details" : "Create New Staff ID Card"}
                </h3>
                <p className="text-xs text-gray-500">
                  {isBn 
                    ? "আইডি কার্ডটি সম্পূর্ণ ইংরেজিতে তৈরি হবে। অনুগ্রহ করে ইংরেজি বানান নিশ্চিত করুন।" 
                    : "The ID card is rendered in English. Please provide English credentials."}
                </p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveStaff} className="space-y-4 text-xs">
              {/* Photo Upload & Presets */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <label className="font-bold text-gray-700 block mb-2">
                  Staff Photograph (Passport / Badge Ratio)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-[#0E3A53] bg-white shadow-sm shrink-0">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold px-3 py-2 rounded-xl cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Custom Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload} 
                          className="hidden" 
                        />
                      </label>
                      <span className="text-[10px] text-gray-500">JPG/PNG &lt; 3MB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff ID & English Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Staff ID Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.staffId}
                    onChange={(e) => setFormData(prev => ({ ...prev, staffId: e.target.value }))}
                    placeholder="e.g. AMC-EMP-1008"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Full Name in English <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        nameEn: val,
                        name: prev.name || val 
                      }));
                    }}
                    placeholder="e.g. Dr. Mohammad Rafiqul Islam"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
              </div>

              {/* Full Name in Bengali */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  পুরো নাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="উদাঃ ডাঃ মোঃ রফিকুল ইসলাম"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D8FC1]"
                />
              </div>

              {/* English Designation & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Designation in English <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designationEn}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        designationEn: val,
                        designation: prev.designation || val 
                      }));
                    }}
                    placeholder="e.g. Senior Medical Officer"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Department in English
                  </label>
                  <input
                    type="text"
                    value={formData.departmentEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, departmentEn: e.target.value }))}
                    placeholder="e.g. General Surgery & OPD"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
              </div>

              {/* Bengali Designation */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  পদবি (বাংলা)
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="উদাঃ সিনিয়র মেডিকেল অফিসার"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D8FC1]"
                />
              </div>

              {/* Blood Group & Official Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData(prev => ({ ...prev, bloodGroup: e.target.value as StaffMember['bloodGroup'] }))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-black text-red-600 focus:ring-2 focus:ring-[#2D8FC1]"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Official Mobile / Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. 01712-692504"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
              </div>

              {/* Join Date & Validity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Join / Issue Date
                  </label>
                  <input
                    type="text"
                    value={formData.joinDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
                    placeholder="01 Jan 2024"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Valid Thru / Expiry Date
                  </label>
                  <input
                    type="text"
                    value={formData.validUntil}
                    onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                    placeholder="31 Dec 2028"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
              </div>

              {/* Emergency Contact & National ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Emergency Hotline
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    placeholder="01712-692504"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    National ID / License Reg
                  </label>
                  <input
                    type="text"
                    value={formData.nationalId}
                    onChange={(e) => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
                    placeholder="NID or BMDC Reg No."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E3A53] hover:bg-[#0A2A3D] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  {editingStaff ? "Save Changes" : "Save Staff & Generate ID"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: DELETE CONFIRMATION */}
      {isDeleteModalOpen && staffToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border border-gray-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-1">
              Delete Staff Record?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Are you sure you want to delete {staffToDelete.nameEn || staffToDelete.name} ({staffToDelete.staffId})?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setStaffToDelete(null);
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (staffToDelete) {
                    removeStaff(staffToDelete.id);
                    setToastMessage(isBn ? `স্টাফ "${staffToDelete.nameEn || staffToDelete.name}" এর রেকর্ড সফলভাবে মুছে ফেলা হয়েছে!` : `Staff record "${staffToDelete.nameEn || staffToDelete.name}" deleted!`);
                  }
                  setIsDeleteModalOpen(false);
                  setStaffToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DEDICATED PRINT PORTAL: Injected directly into document.body to guarantee 100% clean isolation */}
      {typeof document !== 'undefined' && createPortal(
        <div id="staff-id-print-portal">
          {isBatchPrintMode ? (
            /* BATCH PRINT: Multiple Cards per A4 page */
            <div className="p-4 grid grid-cols-2 gap-8 bg-white">
              {staffList.map((st) => (
                <div key={st.id} className="p-4 border border-dashed border-gray-300 rounded-2xl flex flex-col items-center gap-4 break-inside-avoid">
                  {/* Front */}
                  <div className="w-[300px] h-[480px] bg-white rounded-[16px] overflow-hidden border border-black flex flex-col relative select-none">
                    <div className="bg-[#0A2540] text-white pt-5 pb-3 px-3 text-center border-b-2 border-[#C9973B]">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-sm flex items-center justify-center overflow-hidden">
                          <img src={OFFICIAL_HOSPITAL_LOGO_URL} alt="Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-left leading-tight">
                          <h3 className="font-black text-[12px] uppercase text-white">ANOWARA MEDICAL COMPLEX</h3>
                          <p className="text-[8px] text-emerald-300 font-bold uppercase">Palash, Narsingdi</p>
                        </div>
                      </div>
                      <div className="mt-1 inline-block bg-[#C9973B] text-[#0A2540] text-[8.5px] font-black uppercase px-2.5 py-0.5 rounded-full">
                        STAFF IDENTITY CARD
                      </div>
                    </div>
                    <div className="pt-3 pb-1 flex flex-col items-center">
                      <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-[#0A2540] bg-gray-100 shadow-md">
                        <img src={st.photoUrl} alt={st.nameEn} className="w-full h-full object-cover object-top" />
                      </div>
                    </div>
                    <div className="px-4 py-2 text-center flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-[14px] text-[#0A2540] leading-tight">{st.nameEn || st.name}</h4>
                        <div className="mt-1 inline-block bg-blue-50 text-[#0E3A53] border border-blue-200 px-2 py-0.5 rounded text-[10.5px] font-bold">
                          {st.designationEn || st.designation}
                        </div>
                        <p className="text-[9.5px] text-gray-600 font-semibold mt-1">{st.departmentEn || st.department}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-gray-200 rounded-xl p-2 text-left">
                        <div>
                          <span className="text-[7px] text-gray-400 uppercase font-bold block">STAFF ID NO</span>
                          <span className="text-[10.5px] font-black text-[#0A2540] font-mono">{st.staffId}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[7px] text-gray-400 uppercase font-bold block">BLOOD GROUP</span>
                          <span className="text-[10.5px] font-black text-red-600">{st.bloodGroup}</span>
                        </div>
                      </div>
                      <div className="flex items-end justify-between pt-1 border-t border-gray-100 text-[8.5px] text-gray-500">
                        <div className="text-left">
                          <span className="text-[6.5px] text-gray-400 block font-bold uppercase">VALID THRU</span>
                          <span className="font-bold text-[#0A2540]">{st.validUntil}</span>
                        </div>
                        <div className="text-right">
                          <div className="h-3.5"></div>
                          <span className="text-[6px] text-gray-400 block border-t border-gray-300 pt-0.5 font-bold uppercase">Authorized Signatory</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#0A2540] text-white text-[7.5px] py-1 px-3 flex items-center justify-between font-semibold">
                      <span>Hotline: +880 1712-692504</span>
                      <span className="text-emerald-300">anowaramedicalcomplex.com</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* SINGLE CARD PRINT: Front and Back side-by-side with crop marks */
            <div className="w-full bg-white flex flex-col items-center justify-center min-h-[96vh] p-4 text-black">
              {/* Header Print Instruction */}
              <div className="text-center mb-6 border-b border-dashed border-gray-400 pb-2 w-full max-w-[680px]">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-[#0A2540]">
                  ANOWARA MEDICAL COMPLEX • OFFICIAL STAFF IDENTITY CARD
                </h2>
                <p className="text-[8.5px] text-gray-600 mt-0.5">
                  Standard CR-80 Specification (85.6mm × 54mm) • Cut along corner crop marks (+)
                </p>
              </div>

              {orientation === 'landscape' ? (
                /* LANDSCAPE ORIENTATION: FRONT & BACK STACKED VERTICALLY WITH FOLD/CUT LINE */
                <div className="flex flex-col items-center gap-6">
                  {/* Front Landscape Card */}
                  <div className="print-crop-box">
                    <span className="print-crop-corner print-crop-tl">+</span>
                    <span className="print-crop-corner print-crop-tr">+</span>
                    <span className="print-crop-corner print-crop-bl">+</span>
                    <span className="print-crop-corner print-crop-br">+</span>

                    <div className="w-[450px] h-[284px] bg-white rounded-[16px] overflow-hidden border border-black flex flex-col relative select-none">
                      <div className="bg-[#0A2540] text-white py-2 px-4 flex items-center justify-between border-b-2 border-[#C9973B]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-white p-0.5 shrink-0 overflow-hidden flex items-center justify-center">
                            <img src={OFFICIAL_HOSPITAL_LOGO_URL} alt="Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <h3 className="font-black text-[12px] uppercase tracking-wide text-white leading-tight">ANOWARA MEDICAL COMPLEX</h3>
                            <p className="text-[7.5px] text-emerald-300 font-bold uppercase">Palash, Narsingdi</p>
                          </div>
                        </div>
                        <span className="bg-[#C9973B] text-[#0A2540] text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full">
                          STAFF ID CARD
                        </span>
                      </div>

                      <div className="p-3.5 flex-1 flex items-center gap-3.5 bg-white">
                        <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-[#0A2540] bg-gray-100 shrink-0">
                          <img src={activeStaff.photoUrl} alt={activeStaff.nameEn} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between h-24 my-auto py-0.5">
                          <div className="pt-0.5">
                            <h4 className="font-black text-[13.5px] text-[#0A2540] leading-tight truncate uppercase">
                              {activeStaff.nameEn || activeStaff.name}
                            </h4>
                            <div className="mt-1 inline-block bg-blue-50 text-[#0E3A53] border border-blue-200 px-2 py-0.5 rounded text-[10.5px] font-bold">
                              {activeStaff.designationEn || activeStaff.designation}
                            </div>
                            <p className="text-[9.5px] text-gray-600 font-semibold mt-0.5 truncate">{activeStaff.departmentEn || activeStaff.department}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-gray-200 rounded-lg p-1.5 text-left">
                            <div>
                              <span className="text-[7px] text-gray-400 uppercase font-bold block">STAFF ID</span>
                              <span className="text-[10.5px] font-black text-[#0A2540] font-mono">{activeStaff.staffId}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[7px] text-gray-400 uppercase font-bold block">BLOOD</span>
                              <span className="text-[10.5px] font-black text-red-600">{activeStaff.bloodGroup}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#0A2540] text-white text-[8px] py-1 px-3.5 flex items-center justify-between font-semibold">
                        <span>Hotline: +880 1712-692504</span>
                        <span className="text-emerald-300">anowaramedicalcomplex.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Cut / Fold Divider */}
                  <div className="w-full max-w-[450px] text-center text-[8px] font-mono text-gray-400 tracking-wider">
                    ✂ - - - - - - - - - - - - - - - - - FOLD OR CUT HERE - - - - - - - - - - - - - - - - - ✂
                  </div>

                  {/* Back Landscape Card */}
                  <div className="print-crop-box">
                    <span className="print-crop-corner print-crop-tl">+</span>
                    <span className="print-crop-corner print-crop-tr">+</span>
                    <span className="print-crop-corner print-crop-bl">+</span>
                    <span className="print-crop-corner print-crop-br">+</span>

                    <div className="w-[450px] h-[284px] bg-white rounded-[16px] overflow-hidden border border-black flex flex-col relative select-none">
                      <div className="bg-[#0A2540] text-white py-2 px-4 flex items-center justify-between border-b-2 border-[#C9973B]">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white p-0.5 shrink-0 overflow-hidden flex items-center justify-center">
                            <img src={OFFICIAL_HOSPITAL_LOGO_URL} alt="Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
                          </div>
                          <h4 className="font-black text-[11px] uppercase tracking-wider text-white">
                            ANOWARA MEDICAL COMPLEX
                          </h4>
                        </div>
                        <span className="text-[9px] text-emerald-300 font-mono font-bold">
                          {activeStaff.staffId}
                        </span>
                      </div>

                      <div className="p-3.5 flex-1 flex items-center gap-3">
                        <div className="flex-1 text-[8.5px] text-gray-700 space-y-1.5 pr-2 border-r border-gray-200">
                          <p className="leading-tight font-medium">
                            1. This card remains the property of Anowara Medical Complex.
                          </p>
                          <p className="leading-tight">
                            2. Must be visibly displayed at all times while on hospital premises.
                          </p>
                          <p className="leading-tight">
                            3. If found, return to: Wapda Sadar Road, Medical Mor, Palash, Narsingdi.
                          </p>
                          <div className="pt-1 flex items-center gap-3 text-[8px] text-gray-600">
                            <div>
                              <span className="text-gray-400 uppercase font-bold block text-[6.5px]">VALID THRU</span>
                              <span className="font-bold text-[#0A2540]">{activeStaff.validUntil}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 uppercase font-bold block text-[6.5px]">REG NO</span>
                              <span className="font-mono text-gray-800">{activeStaff.nationalId || 'AMC-REG'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="w-28 flex flex-col items-center justify-center bg-slate-50 p-2 rounded-xl border border-gray-200">
                          {qrCodeDataUrl ? (
                            <img src={qrCodeDataUrl} alt="QR" className="w-20 h-20 object-contain" />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200" />
                          )}
                          <span className="text-[7.5px] font-mono text-[#0A2540] font-black mt-0.5">{activeStaff.staffId}</span>
                          <span className="text-[6.5px] font-bold text-emerald-700 uppercase">Scan to Verify</span>
                        </div>
                      </div>

                      <div className="bg-[#0A2540] text-white py-1 px-3.5 flex items-center justify-between text-[7px] font-mono">
                        <span>HOTLINE: {activeStaff.emergencyContact || '01712-692504'}</span>
                        <span className="text-emerald-300">AMC-SECURITY-ENCRYPTED</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* PORTRAIT ORIENTATION: FRONT & BACK SIDE-BY-SIDE */
                <div className="flex items-center justify-center gap-8">
                  {/* Front Portrait Card */}
                  <div className="print-crop-box">
                    <span className="print-crop-corner print-crop-tl">+</span>
                    <span className="print-crop-corner print-crop-tr">+</span>
                    <span className="print-crop-corner print-crop-bl">+</span>
                    <span className="print-crop-corner print-crop-br">+</span>

                    <div className="w-[305px] h-[485px] bg-white rounded-[16px] overflow-hidden border border-black flex flex-col relative select-none">
                      <div className="bg-[#0A2540] text-white pt-5 pb-3 px-3 text-center border-b-2 border-[#C9973B]">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-sm flex items-center justify-center overflow-hidden">
                            <img src={OFFICIAL_HOSPITAL_LOGO_URL} alt="Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
                          </div>
                          <div className="text-left leading-tight">
                            <h3 className="font-black text-[12px] uppercase text-white">ANOWARA MEDICAL COMPLEX</h3>
                            <p className="text-[8px] text-emerald-300 font-bold uppercase">Palash, Narsingdi</p>
                          </div>
                        </div>
                        <div className="mt-1 inline-block bg-[#C9973B] text-[#0A2540] text-[8.5px] font-black uppercase px-2.5 py-0.5 rounded-full">
                          STAFF IDENTITY CARD
                        </div>
                      </div>

                      <div className="pt-3 pb-1 flex flex-col items-center">
                        <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-[#0A2540] bg-gray-100 shadow-md">
                          <img src={activeStaff.photoUrl} alt={activeStaff.nameEn} className="w-full h-full object-cover object-top" />
                        </div>
                      </div>

                      <div className="px-4 py-2 text-center flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-black text-[14px] text-[#0A2540] leading-tight">{activeStaff.nameEn || activeStaff.name}</h4>
                          <div className="mt-1 inline-block bg-blue-50 text-[#0E3A53] border border-blue-200 px-2 py-0.5 rounded text-[10.5px] font-bold">
                            {activeStaff.designationEn || activeStaff.designation}
                          </div>
                          <p className="text-[9.5px] text-gray-600 font-semibold mt-1">{activeStaff.departmentEn || activeStaff.department}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-gray-200 rounded-xl p-2 text-left">
                          <div>
                            <span className="text-[7px] text-gray-400 uppercase font-bold block">STAFF ID NO</span>
                            <span className="text-[10.5px] font-black text-[#0A2540] font-mono">{activeStaff.staffId}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[7px] text-gray-400 uppercase font-bold block">BLOOD GROUP</span>
                            <span className="text-[10.5px] font-black text-red-600">{activeStaff.bloodGroup}</span>
                          </div>
                        </div>
                        <div className="flex items-end justify-between pt-1 border-t border-gray-100 text-[8.5px] text-gray-500">
                          <div className="text-left">
                            <span className="text-[6.5px] text-gray-400 block font-bold uppercase">VALID THRU</span>
                            <span className="font-bold text-[#0A2540]">{activeStaff.validUntil}</span>
                          </div>
                          <div className="text-right">
                            <div className="h-3.5"></div>
                            <span className="text-[6px] text-gray-400 block border-t border-gray-300 pt-0.5 font-bold uppercase">Authorized Signatory</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#0A2540] text-white text-[7.5px] py-1 px-3 flex items-center justify-between font-semibold">
                        <span>Hotline: +880 1712-692504</span>
                        <span className="text-emerald-300">anowaramedicalcomplex.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Back Portrait Card with QR */}
                  <div className="print-crop-box">
                    <span className="print-crop-corner print-crop-tl">+</span>
                    <span className="print-crop-corner print-crop-tr">+</span>
                    <span className="print-crop-corner print-crop-bl">+</span>
                    <span className="print-crop-corner print-crop-br">+</span>

                    <div className="w-[305px] h-[485px] bg-white rounded-[16px] overflow-hidden border border-black flex flex-col relative select-none">
                      <div className="bg-[#0A2540] text-white pt-5 pb-2.5 px-3 text-center border-b-2 border-[#C9973B]">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden">
                            <img src={OFFICIAL_HOSPITAL_LOGO_URL} alt="Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
                          </div>
                          <h4 className="font-black text-[11px] uppercase tracking-wider text-white">
                            ANOWARA MEDICAL COMPLEX
                          </h4>
                        </div>
                        <p className="text-[8px] text-emerald-300 font-bold uppercase tracking-wide">
                          STAFF CREDENTIAL & VERIFICATION
                        </p>
                      </div>

                      <div className="px-3.5 py-2 text-[8.5px] text-gray-600 space-y-1 border-b border-gray-100">
                        <p>1. This card remains the property of Anowara Medical Complex.</p>
                        <p>2. Must be displayed at all times while on hospital premises.</p>
                        <p>3. If found, please return to: Wapda Sadar Road, Medical Mor, Palash.</p>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center p-2 text-center bg-slate-50">
                        <div className="p-2 bg-white rounded-xl border border-gray-200 flex flex-col items-center">
                          {qrCodeDataUrl && <img src={qrCodeDataUrl} alt="QR" className="w-28 h-28 object-contain" />}
                          <span className="text-[8px] font-mono text-[#0A2540] font-black mt-1">{activeStaff.staffId}</span>
                        </div>
                        <p className="text-[8.5px] font-black text-[#0A2540] mt-1.5 uppercase">Scan to Verify Credentials</p>
                      </div>

                      <div className="px-3.5 py-1.5 bg-white border-t border-gray-100 text-[8px] text-gray-700 grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[6.5px] text-gray-400 uppercase font-bold block">HOTLINE</span>
                          <span className="font-bold text-[#0A2540]">{activeStaff.emergencyContact || '01712-692504'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[6.5px] text-gray-400 uppercase font-bold block">REG NO</span>
                          <span className="font-mono text-gray-700">{activeStaff.nationalId || 'AMC-REG'}</span>
                        </div>
                      </div>

                      <div className="bg-[#0A2540] text-white py-1 px-3 flex flex-col items-center justify-center">
                        <span className="text-[7px] text-emerald-300 font-mono tracking-wider">
                          AMC-SECURITY-ENCRYPTED • HOSPITAL REGISTRY
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>,
        document.body
      )}

      {/* FULLSCREEN / ENLARGED CARD INSPECTION MODAL */}
      {isFullscreenModalOpen && currentStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col p-3 sm:p-6 overflow-hidden animate-fadeIn">
          {/* Modal Top Header Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-4 flex flex-wrap items-center justify-between gap-3 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E3A53] to-[#2D8FC1] flex items-center justify-center text-[#C9973B] font-black shadow-md shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black flex items-center gap-2">
                  <span>{currentStaff.nameEn || currentStaff.name}</span>
                  <span className="text-xs bg-[#C9973B] text-[#0A2540] px-2 py-0.5 rounded-full font-bold">
                    {currentStaff.staffId}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {currentStaff.designationEn || currentStaff.designation} • {currentStaff.departmentEn || currentStaff.department}
                </p>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Orientation toggle */}
              <div className="bg-slate-800 p-0.5 rounded-xl flex items-center">
                <button
                  onClick={() => setOrientation('portrait')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    orientation === 'portrait' ? 'bg-[#0E3A53] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Portrait
                </button>
                <button
                  onClick={() => setOrientation('landscape')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    orientation === 'landscape' ? 'bg-[#0E3A53] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Landscape
                </button>
              </div>

              {/* View side */}
              <div className="bg-slate-800 p-0.5 rounded-xl flex items-center">
                <button
                  onClick={() => setViewSide('side-by-side')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    viewSide === 'side-by-side' ? 'bg-[#0E3A53] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dual Side
                </button>
                <button
                  onClick={() => setViewSide('front')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    viewSide === 'front' ? 'bg-[#0E3A53] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => setViewSide('back')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    viewSide === 'back' ? 'bg-[#0E3A53] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Back
                </button>
              </div>

              {/* Print current */}
              <button
                onClick={() => {
                  setIsFullscreenModalOpen(false);
                  setTimeout(() => handlePrint(false), 250);
                }}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Card</span>
              </button>

              {/* Close Modal */}
              <button
                onClick={() => setIsFullscreenModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Card Display Area (Extra spacious, high contrast) */}
          <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 flex flex-wrap items-center justify-center gap-8 overflow-y-auto shadow-2xl">
            {/* Front Card */}
            {(viewSide === 'side-by-side' || viewSide === 'front') && (
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest flex items-center gap-1">
                  <span>Front Side</span>
                  <span className="text-slate-500 font-mono">(CR80 Standard)</span>
                </span>
                <div className="scale-105 sm:scale-110 transition-transform origin-top">
                  {/* Portrait Card */}
                  {orientation === 'portrait' ? (
                    <div 
                      className="w-[310px] h-[490px] bg-white rounded-[16px] shadow-2xl overflow-hidden border border-slate-300 flex flex-col relative select-none shrink-0"
                    >
                      <div className="bg-gradient-to-r from-[#0A2540] via-[#0E3A53] to-[#0A2540] text-white pt-3.5 pb-2.5 px-3 text-center relative border-b-2 border-[#C9973B]">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center border border-white/80 shrink-0 overflow-hidden">
                            <img src={OFFICIAL_HOSPITAL_LOGO_URL} alt="Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
                          </div>
                          <div className="text-left leading-tight">
                            <h3 className="font-black text-[13px] tracking-wide text-white uppercase font-sans">
                              ANOWARA MEDICAL COMPLEX
                            </h3>
                            <p className="text-[8.5px] text-emerald-300 font-bold uppercase tracking-wider">Palash, Narsingdi</p>
                          </div>
                        </div>
                        <p className="text-[8px] text-gray-200 font-medium">Wapda Sadar Road, Medical Mor, Palash, Narsingdi</p>
                        <div className="mt-1.5 inline-flex items-center gap-1 bg-[#C9973B] text-[#0A2540] text-[9px] font-black uppercase px-3 py-0.5 rounded-full shadow-xs tracking-wider">
                          <ShieldCheck className="w-3 h-3" />
                          <span>STAFF IDENTITY CARD</span>
                        </div>
                      </div>

                      <div className="pt-3 pb-1 flex flex-col items-center justify-center relative">
                        <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-[#0A2540] shadow-md bg-gray-100 relative">
                          <img src={currentStaff.photoUrl} alt={currentStaff.nameEn} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="absolute top-2 right-4 bg-emerald-600 text-white text-[7.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>VERIFIED</span>
                        </div>
                      </div>

                      <div className="px-4 py-1.5 text-center flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-black text-[15px] text-[#0A2540] tracking-tight leading-tight uppercase font-sans">
                            {currentStaff.nameEn || currentStaff.name}
                          </h4>
                          <div className="mt-1 inline-block bg-[#0E3A53] text-white text-[11px] font-bold px-3 py-0.5 rounded-md shadow-2xs">
                            {currentStaff.designationEn || currentStaff.designation}
                          </div>
                          <p className="text-[10px] text-gray-600 font-semibold mt-1">
                            {currentStaff.departmentEn || currentStaff.department}
                          </p>
                        </div>

                        <div className="bg-slate-50 border border-gray-200/80 rounded-xl p-2 text-left grid grid-cols-2 gap-2 shadow-2xs">
                          <div>
                            <span className="text-[7.5px] text-gray-400 uppercase font-bold block">STAFF ID NO</span>
                            <span className="text-[11px] font-black text-[#0A2540] font-mono tracking-wider">{currentStaff.staffId}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[7.5px] text-gray-400 uppercase font-bold block">BLOOD GROUP</span>
                            <span className="text-[12px] font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                              {currentStaff.bloodGroup}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-end justify-between pt-1 border-t border-gray-100 text-[9px] text-gray-600">
                          <div className="text-left">
                            <span className="text-[7px] text-gray-400 block font-bold uppercase">VALID THRU</span>
                            <span className="font-bold text-[#0A2540]">{currentStaff.validUntil}</span>
                          </div>
                          <div className="text-right">
                            <div className="h-4"></div>
                            <span className="text-[6.5px] text-gray-400 block border-t border-gray-300 pt-0.5 font-bold uppercase">
                              Medical Director
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#0A2540] text-white text-[8px] py-1 px-3 flex items-center justify-between font-semibold">
                        <span>Emergency: 01712-692504</span>
                        <span className="text-emerald-300">anowaramedicalcomplex.com</span>
                      </div>
                    </div>
                  ) : (
                    /* Landscape Card */
                    <div 
                      className="w-[450px] h-[284px] bg-white rounded-[16px] shadow-2xl overflow-hidden border border-slate-300 flex flex-col relative select-none shrink-0"
                    >
                      <div className="bg-[#0A2540] text-white py-2 px-4 flex items-center justify-between border-b-2 border-[#C9973B]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-xs flex items-center justify-center overflow-hidden">
                            <img src={OFFICIAL_HOSPITAL_LOGO_URL} alt="Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <h3 className="font-black text-[12px] uppercase text-white tracking-wide">ANOWARA MEDICAL COMPLEX</h3>
                            <p className="text-[7.5px] text-emerald-300 font-bold uppercase">PALASH, NARSINGDI</p>
                          </div>
                        </div>
                        <span className="bg-[#C9973B] text-[#0A2540] text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full">
                          STAFF IDENTITY CARD
                        </span>
                      </div>

                      <div className="p-3.5 flex-1 flex items-center gap-4">
                        <div className="w-28 h-32 rounded-xl overflow-hidden border-2 border-[#0A2540] shadow-md bg-gray-100 shrink-0">
                          <img src={currentStaff.photoUrl} alt={currentStaff.nameEn} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-[16px] text-[#0A2540] uppercase">{currentStaff.nameEn || currentStaff.name}</h4>
                          <div className="mt-0.5 inline-block bg-[#0E3A53] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                            {currentStaff.designationEn || currentStaff.designation}
                          </div>
                          <p className="text-[10px] text-gray-600 font-semibold mt-1">{currentStaff.departmentEn || currentStaff.department}</p>
                          <div className="flex items-center gap-3 mt-2 pt-1.5 border-t border-gray-100 text-[10px]">
                            <div>
                              <span className="text-[7px] text-gray-400 uppercase font-bold block">STAFF ID</span>
                              <span className="font-mono font-black text-[#0A2540]">{currentStaff.staffId}</span>
                            </div>
                            <div>
                              <span className="text-[7px] text-gray-400 uppercase font-bold block">BLOOD</span>
                              <span className="font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-[9.5px]">
                                {currentStaff.bloodGroup}
                              </span>
                            </div>
                            <div className="ml-auto text-right">
                              <span className="text-[7px] text-gray-400 uppercase font-bold block">VALID THRU</span>
                              <span className="font-bold text-gray-800 text-[9.5px]">{currentStaff.validUntil}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#0A2540] text-white text-[8px] py-1 px-3.5 flex items-center justify-between font-semibold">
                        <span>Emergency Hotline: 01712-692504</span>
                        <span className="text-emerald-300">Wapda Road, Palash, Narsingdi</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Back Card */}
            {(viewSide === 'side-by-side' || viewSide === 'back') && (
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest flex items-center gap-1">
                  <span>Back Side</span>
                  <span className="text-emerald-400 font-mono">(Live QR & Verification)</span>
                </span>
                <div className="scale-105 sm:scale-110 transition-transform origin-top">
                  {orientation === 'portrait' ? (
                    <div 
                      className="w-[310px] h-[490px] bg-white rounded-[16px] shadow-2xl overflow-hidden border border-slate-300 flex flex-col relative select-none shrink-0"
                    >
                      <div className="bg-[#0A2540] text-white pt-3 pb-2 px-3 text-center border-b-2 border-[#C9973B]">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-xs flex items-center justify-center border border-white/60 shrink-0 overflow-hidden">
                            <img src={OFFICIAL_HOSPITAL_LOGO_URL} alt="Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
                          </div>
                          <h4 className="font-black text-[11px] uppercase tracking-wider text-white">ANOWARA MEDICAL COMPLEX</h4>
                        </div>
                        <p className="text-[8px] text-emerald-300 font-bold uppercase tracking-wide">STAFF CREDENTIAL & VERIFICATION</p>
                      </div>

                      <div className="px-3.5 py-2 text-[8.5px] text-gray-600 space-y-1 border-b border-gray-100">
                        <p className="leading-tight">• Property of Anowara Medical Complex. Non-transferable.</p>
                        <p className="leading-tight">• Return to reception desk at Wapda Sadar Road, Medical Mor, Palash, Narsingdi if found.</p>
                        <p className="leading-tight text-red-700 font-semibold">• 24/7 Hotline: 01712-692504 / 01944-874304</p>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-white to-slate-50">
                        <div className="p-2 bg-white rounded-2xl border-2 border-[#0A2540] shadow-md flex flex-col items-center">
                          {qrCodeDataUrl ? (
                            <img src={qrCodeDataUrl} alt="Staff QR" className="w-28 h-28 object-contain" />
                          ) : (
                            <div className="w-28 h-28 bg-gray-100 flex items-center justify-center">
                              <QrCode className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <span className="text-[8px] font-mono text-[#0A2540] font-black mt-1">{currentStaff.staffId}</span>
                        </div>
                        <p className="text-[9px] font-black text-[#0A2540] mt-1.5 uppercase">Scan to Verify Credentials</p>
                        <p className="text-[7.5px] text-gray-500">Point phone camera to verify registry record</p>
                      </div>

                      <div className="px-3.5 py-1.5 bg-white border-t border-gray-100 text-[8.5px] text-gray-700 grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[7px] text-gray-400 uppercase font-bold block">EMERGENCY HOTLINE</span>
                          <span className="font-bold text-[#0A2540]">{currentStaff.emergencyContact || '01712-692504'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[7px] text-gray-400 uppercase font-bold block">REG / NID NO</span>
                          <span className="font-mono text-gray-700 font-bold">{currentStaff.nationalId || 'AMC-REG-9812'}</span>
                        </div>
                      </div>

                      <div className="bg-[#0A2540] text-white py-1 px-3 flex flex-col items-center justify-center">
                        <span className="text-[7px] text-emerald-300 font-mono tracking-wider">
                          AMC-SECURITY-ENCRYPTED • OFFICIAL REGISTRY
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="w-[450px] h-[284px] bg-white rounded-[16px] shadow-2xl overflow-hidden border border-slate-300 flex flex-col relative select-none shrink-0"
                    >
                      <div className="bg-[#0A2540] text-white py-2 px-4 flex items-center justify-between border-b-2 border-[#C9973B]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden">
                            <img src={OFFICIAL_HOSPITAL_LOGO_URL} alt="Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
                          </div>
                          <h4 className="font-black text-[10.5px] uppercase tracking-wider text-white">ANOWARA MEDICAL COMPLEX</h4>
                        </div>
                        <span className="text-[9px] text-emerald-300 font-mono font-bold">{currentStaff.staffId}</span>
                      </div>

                      <div className="p-3 flex-1 flex items-center gap-3">
                        <div className="flex-1 text-[8.5px] text-gray-600 space-y-1 pr-2 border-r border-gray-100">
                          <p className="leading-tight">• Property of Anowara Medical Complex.</p>
                          <p className="leading-tight">• Return to Wapda Sadar Road, Medical Mor, Palash, Narsingdi if lost.</p>
                          <p className="leading-tight text-red-700 font-semibold">• Emergency Hotline: 01712-692504</p>
                          <div className="pt-1 flex items-center gap-3 text-[8px]">
                            <div>
                              <span className="text-gray-400 uppercase font-bold block text-[6.5px]">ISSUED</span>
                              <span className="font-bold text-gray-800">{currentStaff.joinDate}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 uppercase font-bold block text-[6.5px]">EXPIRES</span>
                              <span className="font-bold text-emerald-700">{currentStaff.validUntil}</span>
                            </div>
                          </div>
                        </div>

                        <div className="w-32 flex flex-col items-center text-center shrink-0">
                          <div className="p-1.5 bg-white border border-gray-200 rounded-xl shadow-xs">
                            {qrCodeDataUrl ? (
                              <img src={qrCodeDataUrl} alt="QR" className="w-20 h-20 object-contain" />
                            ) : (
                              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
                                <QrCode className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <span className="text-[8px] font-black text-[#0A2540] mt-1 uppercase">Scan to Verify</span>
                        </div>
                      </div>

                      <div className="bg-[#0A2540] text-white py-1 px-4 flex items-center justify-between text-[7.5px] font-mono">
                        <span>OFFICIAL PERSONNEL REGISTRY</span>
                        <span className="text-emerald-300">PALASH, NARSINGDI</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
