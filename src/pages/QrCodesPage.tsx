import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Phone, 
  MapPin, 
  Stethoscope, 
  FileText, 
  ShieldCheck, 
  Globe, 
  Ambulance, 
  Share2,
  CalendarCheck,
  Search,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageId } from '../components/Header';
import { SITE_DOMAIN } from '../data/seoData';

interface QrCodesPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: PageId) => void;
}

interface QrItem {
  id: string;
  titleBn: string;
  titleEn: string;
  categoryBn: string;
  categoryEn: string;
  descriptionBn: string;
  descriptionEn: string;
  qrPayload: string;
  actionType: 'url' | 'tel' | 'geo';
  targetPath?: PageId;
  badge: string;
  icon: any;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    badgeBg: string;
  };
}

export const QrCodesPage: React.FC<QrCodesPageProps> = ({ onNavigateHome, onNavigate }) => {
  const { isBn } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const qrList: QrItem[] = [
    {
      id: 'website',
      titleBn: 'অফিসিয়াল ওয়েবসাইট পোর্টাল',
      titleEn: 'Official Website Portal',
      categoryBn: 'প্রধান পোর্টাল',
      categoryEn: 'Main Portal',
      descriptionBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের মূল ওয়েবসাইট ব্রাউজ ও সকল তথ্য জানার জন্য এই কিউআর কোডটি স্ক্যান করুন।',
      descriptionEn: 'Scan to visit the official website portal of Anowara Medical Complex Palash, Narsingdi.',
      qrPayload: `${SITE_DOMAIN}/`,
      actionType: 'url',
      targetPath: 'home',
      badge: isBn ? 'সর্বজনীন' : 'Universal',
      icon: Globe,
      colorScheme: {
        bg: 'from-blue-50 to-indigo-50/50',
        border: 'border-blue-200',
        text: 'text-blue-900',
        accent: '#0E3A53',
        badgeBg: 'bg-blue-100 text-blue-800'
      }
    },
    {
      id: 'appointment',
      titleBn: 'অনলাইন ডাক্তার সিরিয়াল বুকিং',
      titleEn: 'Doctor Serial Booking & Token',
      categoryBn: 'রোগী সেবা',
      categoryEn: 'Patient Care',
      descriptionBn: 'পলাশ ও নরসিংদীতে বিশেষজ্ঞ চিকিৎসকদের চেম্বার সিরিয়াল টোকেন সরাসরি মোবাইল থেকে নিতে স্ক্যান করুন।',
      descriptionEn: 'Scan to book instant specialist doctor appointment token online without waiting in queue.',
      qrPayload: `${SITE_DOMAIN}/appointment`,
      actionType: 'url',
      targetPath: 'appointment',
      badge: isBn ? 'সিরিয়াল' : 'Appointment',
      icon: CalendarCheck,
      colorScheme: {
        bg: 'from-emerald-50 to-teal-50/50',
        border: 'border-emerald-200',
        text: 'text-emerald-950',
        accent: '#059669',
        badgeBg: 'bg-emerald-100 text-emerald-800'
      }
    },
    {
      id: 'emergency-call',
      titleBn: '২৪/৭ জরুরি হটলাইন ও অ্যাম্বুলেন্স',
      titleEn: '24/7 Emergency Ambulance Hotline',
      categoryBn: 'জরুরি সেবা',
      categoryEn: 'Emergency',
      descriptionBn: 'স্ক্যান করলেই সরাসরি কল চলে যাবে হাসপাতালের জরুরি হটলাইন ও অ্যাম্বুলেন্স কন্ট্রোল ডেস্কে (01712-692504)।',
      descriptionEn: 'Scan to instantly dial our 24/7 emergency care and ambulance service: +8801712-692504.',
      qrPayload: 'tel:01712692504',
      actionType: 'tel',
      badge: isBn ? '২৪ ঘণ্টা' : '24/7 Emergency',
      icon: Ambulance,
      colorScheme: {
        bg: 'from-rose-50 to-red-50/50',
        border: 'border-rose-200',
        text: 'text-rose-950',
        accent: '#AE3B2E',
        badgeBg: 'bg-red-100 text-red-800'
      }
    },
    {
      id: 'serial-desk-call',
      titleBn: 'সরাসরি সিরিয়াল ডেস্ক ফোন',
      titleEn: 'Direct Serial Desk Hotline',
      categoryBn: 'রোগী সেবা',
      categoryEn: 'Patient Care',
      descriptionBn: 'সিরিয়াল সংক্রান্ত যেকোনো জিজ্ঞাসা বা কনফার্মেশনের জন্য সরাসরি কল করুন 01944-874304 নম্বরে।',
      descriptionEn: 'Scan to directly call our dedicated doctor serial desk at +8801944-874304.',
      qrPayload: 'tel:01944874304',
      actionType: 'tel',
      badge: isBn ? 'সিরিয়াল কল' : 'Serial Call',
      icon: Phone,
      colorScheme: {
        bg: 'from-amber-50 to-orange-50/50',
        border: 'border-amber-200',
        text: 'text-amber-950',
        accent: '#C9973B',
        badgeBg: 'bg-amber-100 text-amber-900'
      }
    },
    {
      id: 'maps-location',
      titleBn: 'গুগল ম্যাপ লোকেশন ও দিকনির্দেশনা',
      titleEn: 'Google Maps Directions to Hospital',
      categoryBn: 'ঠিকানা ও রুট',
      categoryEn: 'Navigation',
      descriptionBn: 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদীতে হাসপাতালের সঠিক গুগল ম্যাপ জিপিএস লোকেশনে আসার জন্য স্ক্যান করুন।',
      descriptionEn: 'Scan to open exact Google Maps turn-by-turn navigation to Anowara Medical Complex, Palash.',
      qrPayload: 'https://maps.app.goo.gl/ESVAyVjEDpS2585JA',
      actionType: 'url',
      targetPath: 'contact',
      badge: isBn ? 'জিপিএস ম্যাপ' : 'GPS Navigation',
      icon: MapPin,
      colorScheme: {
        bg: 'from-cyan-50 to-sky-50/50',
        border: 'border-cyan-200',
        text: 'text-cyan-950',
        accent: '#0891b2',
        badgeBg: 'bg-cyan-100 text-cyan-800'
      }
    },
    {
      id: 'diagnostics-pricing',
      titleBn: 'প্যাথলজি ও টেস্টের সঠিক মূল্য তালিকা',
      titleEn: 'Diagnostic Test Pricing & Lab Charges',
      categoryBn: 'ডায়াগনস্টিক',
      categoryEn: 'Diagnostics',
      descriptionBn: 'ডিজিটাল এক্স-রে, ৪ডি আল্ট্রাসনোগ্রাম, রক্তের টেস্ট ও অন্যান্য পরীক্ষার নির্ধারিত সরকারি ও সাশ্রয়ী ফি দেখতে স্ক্যান করুন।',
      descriptionEn: 'Scan to view transparent official pricing list for digital X-Ray, 4D USG, pathology and blood tests.',
      qrPayload: `${SITE_DOMAIN}/diagnostics`,
      actionType: 'url',
      targetPath: 'diagnostics',
      badge: isBn ? 'মূল্য তালিকা' : 'Price List',
      icon: FileText,
      colorScheme: {
        bg: 'from-teal-50 to-emerald-50/50',
        border: 'border-teal-200',
        text: 'text-teal-950',
        accent: '#0d9488',
        badgeBg: 'bg-teal-100 text-teal-800'
      }
    },
    {
      id: 'doctors-list',
      titleBn: 'বিশেষজ্ঞ ডাক্তারদের তালিকা ও শিডিউল',
      titleEn: 'Specialist Doctors & Visiting Schedule',
      categoryBn: 'রোগী সেবা',
      categoryEn: 'Patient Care',
      descriptionBn: 'পলাশ ও নরসিংদীর প্রখ্যাত মেডিসিন, গাইনী, শিশু, অর্থোপেডিক ও হৃদরোগ বিশেষজ্ঞ চিকিৎসকদের ভিজিটিং সময়সূচি দেখতে স্ক্যান করুন।',
      descriptionEn: 'Scan to access full visiting schedules of all specialist doctors at Anowara Medical Complex.',
      qrPayload: `${SITE_DOMAIN}/doctors`,
      actionType: 'url',
      targetPath: 'doctors',
      badge: isBn ? 'ডাক্তার শিডিউল' : 'Doctor Schedule',
      icon: Stethoscope,
      colorScheme: {
        bg: 'from-blue-50 to-sky-50/50',
        border: 'border-blue-200',
        text: 'text-blue-950',
        accent: '#0284c7',
        badgeBg: 'bg-blue-100 text-blue-800'
      }
    },
    {
      id: 'verify-staff',
      titleBn: 'কর্মকর্তা-কর্মচারী ডিজিটাল আইডি কার্ড যাচাই',
      titleEn: 'Staff ID Credential Verification Portal',
      categoryBn: 'প্রশাসন ও ভেরিফিকেশন',
      categoryEn: 'Security',
      descriptionBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের যেকোনো কর্মকর্তা-কর্মচারীর আইডি কার্ড ও সত্যায়িত কিউআর কোড স্ক্যান করে ভেরিফাই করুন।',
      descriptionEn: 'Scan to authenticate official employee credentials and staff ID cards of Anowara Medical Complex.',
      qrPayload: `${SITE_DOMAIN}/verify-staff`,
      actionType: 'url',
      targetPath: 'verify-staff',
      badge: isBn ? 'ভেরিফিকেশন' : 'Credential Verify',
      icon: ShieldCheck,
      colorScheme: {
        bg: 'from-violet-50 to-purple-50/50',
        border: 'border-violet-200',
        text: 'text-violet-950',
        accent: '#7c3aed',
        badgeBg: 'bg-violet-100 text-violet-800'
      }
    }
  ];

  // Generate high-resolution QR data URLs on mount
  useEffect(() => {
    async function generateAll() {
      const generated: Record<string, string> = {};
      for (const item of qrList) {
        try {
          const url = await QRCode.toDataURL(item.qrPayload, {
            width: 500,
            margin: 2,
            color: {
              dark: '#0A2A3D',
              light: '#FFFFFF'
            },
            errorCorrectionLevel: 'H'
          });
          generated[item.id] = url;
        } catch (e) {
          console.error(`Failed to generate QR for ${item.id}:`, e);
        }
      }
      setQrImages(generated);
    }
    generateAll();
  }, []);

  const handleDownload = (item: QrItem) => {
    const dataUrl = qrImages[item.id];
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `AMC-QR-${item.id}-Palash.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = (item: QrItem) => {
    navigator.clipboard.writeText(item.qrPayload);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const categories = [
    { id: 'all', labelBn: 'সকল কিউআর কোড', labelEn: 'All QR Codes' },
    { id: 'রোগী সেবা', labelBn: 'রোগী সেবা ও সিরিয়াল', labelEn: 'Patient Services' },
    { id: 'জরুরি সেবা', labelBn: 'জরুরি ও হটলাইন', labelEn: 'Emergency' },
    { id: 'ডায়াগনস্টিক', labelBn: 'ডায়াগনস্টিক ও ল্যাব', labelEn: 'Diagnostics' },
    { id: 'ঠিকানা ও রুট', labelBn: 'লোকেশন ও রুট', labelEn: 'Location' },
    { id: 'প্রশাসন ও ভেরিফিকেশন', labelBn: 'ভেরিফিকেশন', labelEn: 'Verification' }
  ];

  const filteredQrList = activeCategory === 'all'
    ? qrList
    : qrList.filter(q => q.categoryBn === activeCategory);

  return (
    <div className="min-h-screen bg-[#F6F8F7] pb-24">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0E3A53] via-[#0A2A3D] to-[#061824] text-white pt-12 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2D8FC1_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[#C9973B] font-semibold text-xs sm:text-sm mb-4 shadow-sm">
            <QrCode className="w-4 h-4 text-[#C9973B]" />
            <span>{isBn ? 'ডিজিটাল কিউআর কোড ডিরেক্টরি' : 'Official Digital QR Code Directory'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            {isBn ? (
              <>
                আনোয়ারা মেডিকেল কমপ্লেক্স <br className="hidden sm:inline" />
                <span className="text-[#2D8FC1]">জরুরি কিউআর কোড হাব ও ডাউনলোড সেন্টার</span>
              </>
            ) : (
              <>
                Anowara Medical Complex <br className="hidden sm:inline" />
                <span className="text-[#2D8FC1]">Official QR Codes & Quick Access Hub</span>
              </>
            )}
          </h1>

          <p className="text-white/80 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            {isBn
              ? 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদীতে অবস্থিত আনোয়ারা মেডিকেল কমপ্লেক্সের সকল ডিজিটাল সেবার অফিসিয়াল কিউআর কোড। মোবাইল দিয়ে স্ক্যান করে মুহূর্তেই সিরিয়াল নিন, জরুরি হটলাইনে কল দিন বা গুগল ম্যাপের লোকেশন চালু করুন।'
              : 'Scan high-resolution QR codes to book specialist doctor serials, dial emergency hotlines, navigate via Google Maps, view test pricing, and verify official staff credentials.'}
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <span className="text-xl sm:text-2xl font-bold text-white block">৮টি</span>
              <span className="text-xs text-white/70">{isBn ? 'অফিসিয়াল কিউআর কোড' : 'Official QR Codes'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <span className="text-xl sm:text-2xl font-bold text-emerald-400 block">২৪/৭</span>
              <span className="text-xs text-white/70">{isBn ? 'অ্যাম্বুলেন্স হটলাইন' : 'Ambulance Hotline'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <span className="text-xl sm:text-2xl font-bold text-amber-300 block">HD</span>
              <span className="text-xs text-white/70">{isBn ? 'ডাউনলোডযোগ্য প্রিন্ট ফাইল' : 'High-Res Print Files'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <span className="text-xl sm:text-2xl font-bold text-sky-400 block">১০০%</span>
              <span className="text-xs text-white/70">{isBn ? 'যাচাইকৃত সত্যতা' : 'Verified Secure'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Category Tabs */}
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-lg border border-gray-200/80 mb-8 flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#0E3A53] text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {isBn ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

        {/* QR Code Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQrList.map((item) => {
            const Icon = item.icon;
            const dataUrl = qrImages[item.id];
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-gradient-to-b ${item.colorScheme.bg} to-white rounded-3xl p-6 border ${item.colorScheme.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Row: Icon & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-gray-200 flex items-center justify-center text-[#0E3A53]">
                      <Icon className="w-5 h-5 text-[#0E3A53]" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${item.colorScheme.badgeBg}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-lg sm:text-xl font-bold ${item.colorScheme.text} mb-2 leading-snug`}>
                    {isBn ? item.titleBn : item.titleEn}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-5">
                    {isBn ? item.descriptionBn : item.descriptionEn}
                  </p>

                  {/* QR Image Box */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-inner flex flex-col items-center justify-center mb-5 group">
                    {dataUrl ? (
                      <div className="relative">
                        <img
                          src={dataUrl}
                          alt={`${item.titleBn} QR Code`}
                          className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg transition-transform group-hover:scale-102"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-10 h-10 rounded-full bg-white/95 border border-[#0E3A53]/30 shadow-md flex items-center justify-center p-1">
                            <Icon className="w-5 h-5 text-[#0E3A53]" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0E3A53]" />
                      </div>
                    )}

                    <span className="text-[11px] font-mono text-gray-500 mt-2 truncate max-w-[220px] text-center">
                      {item.qrPayload.replace(/^https?:\/\//, '')}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-2 pt-2 border-t border-gray-200/60">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownload(item)}
                      disabled={!dataUrl}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white py-2 px-3 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isBn ? 'ডাউনলোড' : 'Download'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyLink(item)}
                      className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'লিংক কপি' : 'Copy')}</span>
                    </button>
                  </div>

                  {item.actionType === 'tel' ? (
                    <a
                      href={item.qrPayload}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{isBn ? 'সরাসরি কল দিন' : 'Call Now'}</span>
                    </a>
                  ) : item.targetPath ? (
                    <button
                      onClick={() => onNavigate(item.targetPath!)}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 text-[#0E3A53] border border-[#0E3A53]/30 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      <span>{isBn ? 'পেজটি দেখুন' : 'Visit Page'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <a
                      href={item.qrPayload}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 text-[#0E3A53] border border-[#0E3A53]/30 py-2 rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      <span>{isBn ? 'লিংক ওপেন করুন' : 'Open Link'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative Help Guide for Posters & Prescription Pads */}
        <section className="mt-14 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-gray-100 pb-6 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0E3A53] mb-1">
                {isBn ? 'প্রেসক্রিপশন প্যাড ও হাসপাতাল পোস্টারে কিউআর কোড ব্যবহার' : 'Using QR Codes on Prescription Pads & Posters'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                {isBn
                  ? 'এই কিউআর কোডগুলো হাই-রেজোলিউশন (৫০০x৫০০ পিক্সেল) ভেক্টর-স্পষ্টতায় তৈরি করা হয়েছে যাতে যে কোনো সাইজে প্রিন্ট করলেও সহজে মোবাইল ক্যামেরায় স্ক্যান হয়।'
                  : 'All QR codes are generated at 500x500 resolution with high error-correction levels suitable for professional printing.'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 bg-[#2D8FC1] hover:bg-[#23749D] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition shrink-0 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>{isBn ? 'হাসপাতাল লোকেশন দেখুন' : 'Hospital Location'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-gray-700">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
              <span className="font-bold text-[#0E3A53] block mb-1 text-sm">১. স্ক্যান করার নিয়ম</span>
              <span>যেকোনো স্মার্টফোনের ক্যামেরা ওপেন করে কিউআর কোডের সামনে ধরলেই লিংকটি প্রদর্শিত হবে। কোনো অতিরিক্ত অ্যাপের প্রয়োজন নেই।</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
              <span className="font-bold text-[#0E3A53] block mb-1 text-sm">২. জরুরি হটলাইন ডায়াল</span>
              <span>জরুরি অ্যাম্বুলেন্স কিউআর স্ক্যান করলে ফোনের ডায়ালারে স্বয়ংক্রিয়ভাবে ০১৭১২-৬৯২৫০৪ নম্বরটি চলে আসবে।</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
              <span className="font-bold text-[#0E3A53] block mb-1 text-sm">৩. গুগল ম্যাপস ডিরেকশন</span>
              <span>লোকেশন কিউআর স্ক্যান করলে গুগল ম্যাপস অ্যাপে ওয়াপদা সদর রোড, মেডিকেল মোড়ের সরাসরি পথ প্রদর্শন করবে।</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
