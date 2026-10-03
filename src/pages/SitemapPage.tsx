import React from 'react';
import { 
  FileCode, 
  ChevronRight, 
  ExternalLink, 
  Stethoscope, 
  CalendarCheck, 
  FileText, 
  Ambulance, 
  Building2, 
  Image, 
  BookOpen, 
  Bell, 
  MapPin, 
  ShieldCheck, 
  QrCode, 
  Globe, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageId } from '../components/Header';
import { PAGES_SEO, SITE_DOMAIN } from '../data/seoData';

interface SitemapPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: PageId) => void;
}

interface CategoryGroup {
  id: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  icon: any;
  items: {
    pageId: PageId;
    titleBn: string;
    titleEn: string;
    path: string;
    htmlPath: string;
    descBn: string;
    descEn: string;
    priority: string;
    changefreq: string;
    badge: string;
  }[];
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigateHome, onNavigate }) => {
  const { isBn } = useLanguage();

  const categoryGroups: CategoryGroup[] = [
    {
      id: 'clinical',
      nameBn: 'ক্যাটাগরি ১: ক্লিনিক্যাল ও ডাক্তার সেবা',
      nameEn: 'Category 1: Clinical & Specialist Doctors',
      descriptionBn: 'বিশেষজ্ঞ চিকিৎসকদের চেম্বার শিডিউল এবং অনলাইন সিরিয়াল বুকিং পোর্টাল।',
      descriptionEn: 'Specialist doctors, chamber visiting times, and digital appointment tokens.',
      icon: Stethoscope,
      items: [
        {
          pageId: 'doctors',
          titleBn: 'বিশেষজ্ঞ ডাক্তারদের তালিকা ও শিডিউল',
          titleEn: 'Specialist Doctors & Visiting Schedule',
          path: '/doctors',
          htmlPath: '/doctors.html',
          descBn: 'পলাশ ও নরসিংদীতে মেডিসিন, হৃদরোগ, গাইনী, শিশু, অর্থোপেডিক চিকিৎসকদের ভিজিটিং সময়সূচি।',
          descEn: 'Directory of experienced specialist doctors and outpatient clinic schedules.',
          priority: '0.95',
          changefreq: 'দৈনিক (Daily)',
          badge: isBn ? 'ডাক্তার' : 'Doctors'
        },
        {
          pageId: 'appointment',
          titleBn: 'অনলাইন ডাক্তার সিরিয়াল বুকিং ও টোকেন',
          titleEn: 'Online Doctor Appointment Booking',
          path: '/appointment',
          htmlPath: '/appointment.html',
          descBn: 'ঘরে বসেই মাত্র ১ মিনিটে পছন্দের ডাক্তারের অনলাইন সিরিয়াল টোকেন সংগ্রহ ও ডাউনলোড।',
          descEn: 'Book instant specialist doctor serial token online and receive printable slip.',
          priority: '0.95',
          changefreq: 'দৈনিক (Daily)',
          badge: isBn ? 'সিরিয়াল' : 'Appointment'
        }
      ]
    },
    {
      id: 'diagnostics',
      nameBn: 'ক্যাটাগরি ২: ডায়াগনস্টিক ও ল্যাবরেটরি টেস্ট',
      nameEn: 'Category 2: Diagnostics & Pathology Pricing',
      descriptionBn: 'আধুনিক ডিজিটাল ইমেজিং এবং রক্ত-হরমোন পরীক্ষার তালিকা ও স্বচ্ছ মূল্য।',
      descriptionEn: 'Digital high-frequency X-Ray, 4D USG, automated pathology test charges.',
      icon: FileText,
      items: [
        {
          pageId: 'diagnostics',
          titleBn: 'প্যাথলজি ও টেস্টের সঠিক মূল্য তালিকা',
          titleEn: 'Diagnostic Test Price List',
          path: '/diagnostics',
          htmlPath: '/diagnostics.html',
          descBn: 'ডিজিটাল এক্স-রে, ৪ডি আল্ট্রাসনোগ্রাম, রক্তের সকল পরীক্ষা ও প্যাথলজি ফি তালিকা।',
          descEn: 'Transparent official pricing list for digital X-Ray, 4D USG, pathology and blood tests.',
          priority: '0.90',
          changefreq: 'সাপ্তাহিক (Weekly)',
          badge: isBn ? 'টেস্ট ফি' : 'Pricing'
        }
      ]
    },
    {
      id: 'emergency-hospital',
      nameBn: 'ক্যাটাগরি ৩: সার্বক্ষণিক হাসপাতাল ও জরুরি সেবা',
      nameEn: 'Category 3: Hospital & Emergency Care',
      descriptionBn: '২৪ ঘণ্টা জরুরি বিভাগ, আধুনিক ওটি, ইনডোর বেড ও নিজস্ব অ্যাম্বুলেন্স।',
      descriptionEn: '24/7 Emergency room, operation theaters, patient cabins, and ambulance service.',
      icon: Ambulance,
      items: [
        {
          pageId: 'services',
          titleBn: 'হাসপাতালের সেবাসমূহ - ২৪ ঘণ্টা জরুরি সেবা ও ওটি',
          titleEn: 'Hospital Facilities & 24/7 Emergency Care',
          path: '/services',
          htmlPath: '/services.html',
          descBn: 'সার্বক্ষণিক জরুরি বিভাগ, মডুলার ওটি, নরমাল ডেলিভারি সেন্টার, ভিআইপি কেবিন ও অ্যাম্বুলেন্স।',
          descEn: 'Round-the-clock emergency, ambulance, modular OT, normal delivery, and VIP cabins.',
          priority: '0.85',
          changefreq: 'সাপ্তাহিক (Weekly)',
          badge: isBn ? 'জরুরি সেবা' : 'Services'
        }
      ]
    },
    {
      id: 'digital-qr',
      nameBn: 'ক্যাটাগরি ৪: ডিজিটাল কিউআর কোড ও নিরাপত্তা ভেরিফিকেশন',
      nameEn: 'Category 4: Digital QR Codes & Verification',
      descriptionBn: 'মোবাইল স্ক্যানেবল ডিজিটাল কিউআর কোড এবং কর্মকর্তা-কর্মচারী আইডি সত্যতায়ন।',
      descriptionEn: 'Scannable QR codes directory, ambulance hotlines, and staff credential authentication.',
      icon: QrCode,
      items: [
        {
          pageId: 'qr-codes',
          titleBn: 'জরুরি কিউআর কোড হাব ও ডাউনলোড সেন্টার',
          titleEn: 'Official QR Codes & Access Hub',
          path: '/qr-codes',
          htmlPath: '/qr-codes.html',
          descBn: 'ওয়েবসাইট, ডাক্তার সিরিয়াল, জরুরি অ্যাম্বুলেন্স ও গুগল ম্যাপের হাই-রেজোলিউশন কিউআর কোড।',
          descEn: 'High-resolution downloadable QR codes for website, serial desk, hotlines, and maps.',
          priority: '0.90',
          changefreq: 'সাপ্তাহিক (Weekly)',
          badge: isBn ? 'কিউআর কোড' : 'QR Codes'
        },
        {
          pageId: 'verify-staff',
          titleBn: 'কর্মকর্তা-কর্মচারী ডিজিটাল আইডি কার্ড যাচাইকরণ',
          titleEn: 'Staff ID Credential Verification Registry',
          path: '/verify-staff',
          htmlPath: '/verify-staff.html',
          descBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের চিকিৎসক ও কর্মীদের ডিজিটাল কিউআর সত্যতায়ন পোর্টাল।',
          descEn: 'Official digital credential verification portal and QR code authentication registry.',
          priority: '0.85',
          changefreq: 'সাপ্তাহিক (Weekly)',
          badge: isBn ? 'আইডি যাচাই' : 'Staff ID'
        }
      ]
    },
    {
      id: 'hospital-info',
      nameBn: 'ক্যাটাগরি ৫: হাসপাতাল পরিচিতি ও প্রশাসন',
      nameEn: 'Category 5: Hospital Administration & Gallery',
      descriptionBn: 'পরিচালনা পর্ষদ, ফটো গ্যালারি, নোটিশ বোর্ড এবং সচেতনতামূলক স্বাস্থ্য ব্লগ।',
      descriptionEn: 'Governing board, photo gallery, public notice board, and doctor health tips.',
      icon: Building2,
      items: [
        {
          pageId: 'management',
          titleBn: 'পরিচালনা পর্ষদ ও প্রশাসনিক টিম',
          titleEn: 'Governing Board & Leadership Team',
          path: '/management',
          htmlPath: '/management.html',
          descBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের সম্মানিত ম্যানেজিং ডিরেক্টর, চেয়ারম্যান ও পরিচালনা পরিষদ।',
          descEn: 'Meet the governing board, managing director, clinical directors, and administrative leadership.',
          priority: '0.80',
          changefreq: 'মাসিক (Monthly)',
          badge: isBn ? 'পরিচালনা পরিষদ' : 'Management'
        },
        {
          pageId: 'gallery',
          titleBn: 'ফটো গ্যালারি ও ক্লিনিক্যাল অবকাঠামো',
          titleEn: 'Photo Gallery & Hospital Infrastructure',
          path: '/gallery',
          htmlPath: '/gallery.html',
          descBn: 'হাসপাতালের বহির্বিভাগ, রিসেপশন লাউঞ্জ, আধুনিক ওটি ও শীতাতপ নিয়ন্ত্রিত কেবিন রুমের ছবি।',
          descEn: 'Verified interior and clinical facility photos of Anowara Medical Complex.',
          priority: '0.75',
          changefreq: 'সাপ্তাহিক (Weekly)',
          badge: isBn ? 'গ্যালারি' : 'Gallery'
        },
        {
          pageId: 'blog',
          titleBn: 'স্বাস্থ্য ব্লগ ও বিশেষজ্ঞ চিকিৎসা পরামর্শ',
          titleEn: 'Health Blog & Wellness Articles',
          path: '/blog',
          htmlPath: '/blog.html',
          descBn: 'হৃদরোগ, গর্ভকালীন যত্ন, শিশুর পুষ্টি ও ডায়াবেটিস নিয়ন্ত্রণে চিকিৎসকদের নিয়মিত পরামর্শ।',
          descEn: 'Educational healthcare blog authored by specialist doctors for community health awareness.',
          priority: '0.80',
          changefreq: 'সাপ্তাহিক (Weekly)',
          badge: isBn ? 'স্বাস্থ্য ব্লগ' : 'Health Blog'
        },
        {
          pageId: 'notices',
          titleBn: 'অফিসিয়াল নোটিশ বোর্ড ও জরুরি বিজ্ঞপ্তি',
          titleEn: 'Official Notice Board & Circulars',
          path: '/notices',
          htmlPath: '/notices.html',
          descBn: 'সর্বশেষ প্রশাসনিক বিজ্ঞপ্তি, বিনামূল্যে ফ্রি মেডিকেল ক্যাম্প ও ছুটির সময়সূচী।',
          descEn: 'Official circulars, public health notices, specialist visiting announcements, and camps.',
          priority: '0.80',
          changefreq: 'সাপ্তাহিক (Weekly)',
          badge: isBn ? 'নোটিশ' : 'Notices'
        }
      ]
    },
    {
      id: 'contact-location',
      nameBn: 'ক্যাটাগরি ৬: ঠিকানা ও গুগল ম্যাপ ডিরেকশন',
      nameEn: 'Category 6: Contact & Navigation',
      descriptionBn: 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদীতে সঠিক অবস্থান ও যোগাযোগের উপায়।',
      descriptionEn: 'Direct physical address, hotline numbers, and interactive Google Maps direction.',
      icon: MapPin,
      items: [
        {
          pageId: 'contact',
          titleBn: 'ঠিকানা, লোকেশন ও গুগল ম্যাপ দিকনির্দেশনা',
          titleEn: 'Location, Contact & Google Maps Directions',
          path: '/contact',
          htmlPath: '/contact.html',
          descBn: 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী। সার্বক্ষণিক হটলাইন: 01712-692504।',
          descEn: 'Contact Anowara Medical Complex. Address: WAPDA Sadar Road, Medical Mor, Palash, Narsingdi.',
          priority: '0.85',
          changefreq: 'মাসিক (Monthly)',
          badge: isBn ? 'ঠিকানা ও ফোন' : 'Contact'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6F8F7] pb-24">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#0E3A53] via-[#0A2A3D] to-[#061824] text-white pt-12 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2D8FC1_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[#C9973B] font-semibold text-xs sm:text-sm mb-4 shadow-sm">
            <Layers className="w-4 h-4 text-[#C9973B]" />
            <span>{isBn ? 'পূর্ণাঙ্গ ওয়েবসাইট সাইটম্যাপ ও ক্যাটাগরি' : 'Website Sitemap & Categories'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            {isBn ? (
              <>
                আনোয়ারা মেডিকেল কমপ্লেক্স <br className="hidden sm:inline" />
                <span className="text-[#2D8FC1]">ওয়েবসাইট সাইটম্যাপ ও ক্যাটাগরি ডিরেক্টরি</span>
              </>
            ) : (
              <>
                Anowara Medical Complex <br className="hidden sm:inline" />
                <span className="text-[#2D8FC1]">Website Sitemap & Categories Directory</span>
              </>
            )}
          </h1>

          <p className="text-white/80 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
            {isBn
              ? 'গুগল সার্চ ইঞ্জিন এবং ব্যবহারকারীদের জন্য আনোয়ারা মেডিকেল কমপ্লেক্সের সকল পেজ, ক্যাটাগরি, বিশেষজ্ঞ ডাক্তারদের তালিকা, ডায়াগনস্টিক টেস্ট ফি, জরুরি সেবা ও কিউআর কোডের সম্পূর্ণ সূচি।'
              : 'Complete structural sitemap and categorized page index for users and search engine crawlers (Google, Bing, Yahoo).'}
          </p>

          {/* Quick links to XML Sitemap & Robots.txt */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition"
            >
              <FileCode className="w-4 h-4" />
              <span>{isBn ? 'XML সাইটম্যাপ দেখুন (sitemap.xml)' : 'View XML Sitemap'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition"
            >
              <span>{isBn ? 'Robots.txt ফাইল' : 'Robots.txt File'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Category Groups */}
        {categoryGroups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <div
              key={group.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#0E3A53]/10 text-[#0E3A53] flex items-center justify-center">
                  <GroupIcon className="w-5 h-5 text-[#0E3A53]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0E3A53]">
                    {isBn ? group.nameBn : group.nameEn}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {isBn ? group.descriptionBn : group.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Items in this category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {group.items.map((item) => (
                  <div
                    key={item.pageId}
                    className="p-4 sm:p-5 rounded-2xl border border-gray-200/80 bg-gray-50/60 hover:bg-white hover:border-[#2D8FC1]/50 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {item.badge}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                          <span>Priority: {item.priority}</span>
                          <span>•</span>
                          <span>{item.changefreq}</span>
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#0E3A53] mb-1">
                        {isBn ? item.titleBn : item.titleEn}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4">
                        {isBn ? item.descBn : item.descEn}
                      </p>
                    </div>

                    {/* URL Links */}
                    <div className="pt-3 border-t border-gray-200/60 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={item.path}
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(item.pageId);
                          }}
                          className="text-xs font-mono text-[#2D8FC1] hover:underline font-semibold"
                        >
                          {item.path}
                        </a>
                        <span className="text-gray-300">|</span>
                        <a
                          href={item.htmlPath}
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(item.pageId);
                          }}
                          className="text-[11px] font-mono text-gray-500 hover:text-[#0E3A53] hover:underline"
                        >
                          {item.htmlPath}
                        </a>
                      </div>

                      <button
                        onClick={() => onNavigate(item.pageId)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0E3A53] hover:text-[#2D8FC1] cursor-pointer"
                      >
                        <span>{isBn ? 'পেজে যান' : 'Go to Page'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* SEO Information & Google Search Guidelines */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-3xl p-6 sm:p-8 border border-emerald-200/70">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-emerald-950 mb-1">
                {isBn ? 'গুগল সার্চ ও এসইও অপ্টিমাইজেশন (Google Search Engine Ready)' : 'Optimized for Google Search & Indexing'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-900/80 leading-relaxed mb-4">
                {isBn
                  ? 'এই সাইটম্যাপের প্রতিটি পৃষ্ঠা স্বতন্ত্র এইচটিএমএল নথি হিসেবে পরিবেশিত হয় এবং এতে Schema.org Structured Data (Hospital, SiteNavigationElement, Breadcrumbs, FAQs), OpenGraph মেটা ট্যাগ ও ভৌগোলিক স্থানাঙ্ক (Geo Coordinates: 23.973892, 90.637563) অন্তর্ভুক্ত রয়েছে।'
                  : 'Every single page listed above is rendered as a distinct multi-page HTML document with complete Schema.org JSON-LD structured data, responsive OpenGraph social cards, and verified geo-location coordinates.'}
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-emerald-800">
                <span className="bg-white/80 px-3 py-1 rounded-lg border border-emerald-200">✓ Google Search Console Ready</span>
                <span className="bg-white/80 px-3 py-1 rounded-lg border border-emerald-200">✓ Distinct Multi-Page HTML</span>
                <span className="bg-white/80 px-3 py-1 rounded-lg border border-emerald-200">✓ Schema.org Hospital Graph</span>
                <span className="bg-white/80 px-3 py-1 rounded-lg border border-emerald-200">✓ 100% Crawlable Bengali & English Content</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
