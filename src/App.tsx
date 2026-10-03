import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { Header, PageId } from './components/Header';
import { NoticeMarquee } from './components/NoticeMarquee';
import { Footer } from './components/Footer';
import { FloatingEmergencyButton } from './components/FloatingEmergencyButton';
import { HospitalAiChatbot } from './components/HospitalAiChatbot';

// Dedicated Pages
import { HomePage } from './pages/HomePage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { NoticesPage } from './pages/NoticesPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { ManagementPage } from './pages/ManagementPage';
import { ReceptionistDashboardPage } from './pages/ReceptionistDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { StaffVerificationPage } from './pages/StaffVerificationPage';
import { QrCodesPage } from './pages/QrCodesPage';
import { SitemapPage } from './pages/SitemapPage';
import { InstallPage } from './pages/InstallPage';

function parseLocationToPage(): PageId {
  if (typeof window !== 'undefined') {
    const search = new URLSearchParams(window.location.search);
    if (search.has('verify') || search.has('staff') || search.has('staffId') || (search.has('id') && !search.has('page') && !search.has('blog'))) {
      return 'verify-staff';
    }

    // Check query params ?page=... or ?category=...
    const pageParam = (search.get('page') || search.get('category') || '').toLowerCase().trim().replace(/\.html$/, '');
    if (pageParam) {
      if (pageParam === 'qr' || pageParam === 'qrcode' || pageParam === 'qr-codes') return 'qr-codes';
      if (pageParam === 'sitemap' || pageParam === 'categories') return 'sitemap';
      if (pageParam === 'install' || pageParam === 'install-app' || pageParam === 'download' || pageParam === 'app') return 'install';
      if (['doctors', 'diagnostics', 'services', 'management', 'gallery', 'appointment', 'blog', 'notices', 'receptionist', 'admin', 'contact', 'verify-staff', 'install'].includes(pageParam)) {
        return pageParam as PageId;
      }
    }

    const fullHref = window.location.href.toLowerCase();
    if (fullHref.includes('verify-staff') || fullHref.includes('verify') || fullHref.includes('id-card')) {
      return 'verify-staff';
    }
    if (fullHref.includes('qr-codes') || fullHref.includes('qrcode')) {
      return 'qr-codes';
    }
    if (fullHref.includes('install-app') || fullHref.includes('/install') || fullHref.includes('install.html')) {
      return 'install';
    }
    if (fullHref.includes('sitemap') && !fullHref.includes('.xml')) {
      return 'sitemap';
    }

    // Check pathname first (clean multi-page URL: /doctors, /doctors.html, /appointment, etc.)
    const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase().trim();
    if (pathname) {
      const rawSeg = pathname.split('/')[0].split('?')[0].trim();
      const seg = rawSeg.replace(/\.html$/i, '').trim();
      switch (seg) {
        case 'doctors':
        case 'doctor':
          return 'doctors';
        case 'diagnostics':
        case 'diagnostic':
        case 'pricing':
          return 'diagnostics';
        case 'services':
        case 'service':
          return 'services';
        case 'management':
        case 'committee':
        case 'board':
        case 'governing':
        case 'leadership':
          return 'management';
        case 'gallery':
          return 'gallery';
        case 'appointment':
        case 'serial':
          return 'appointment';
        case 'blog':
        case 'blogs':
          return 'blog';
        case 'notices':
        case 'notice':
          return 'notices';
        case 'receptionist':
        case 'reception':
          return 'receptionist';
        case 'admin':
        case 'dashboard':
          return 'admin';
        case 'contact':
        case 'location':
          return 'contact';
        case 'verify-staff':
        case 'verify':
        case 'id-card':
          return 'verify-staff';
        case 'qr-codes':
        case 'qr':
        case 'qrcode':
          return 'qr-codes';
        case 'sitemap':
        case 'categories':
          return 'sitemap';
      }
    }

    // Fallback: Check hash if visited with legacy anchor e.g. #doctors
    const hash = (window.location.hash || '').replace(/^[#/]+/, '').toLowerCase().trim();
    const cleanHash = hash.split('?')[0].replace(/\.html$/i, '').trim();

    if (cleanHash) {
      switch (cleanHash) {
        case 'doctors':
        case 'doctor':
          return 'doctors';
        case 'diagnostics':
        case 'diagnostic':
        case 'pricing':
          return 'diagnostics';
        case 'services':
          return 'services';
        case 'management':
        case 'committee':
        case 'board':
        case 'governing':
        case 'leadership':
          return 'management';
        case 'gallery':
          return 'gallery';
        case 'appointment':
        case 'serial':
          return 'appointment';
        case 'blog':
        case 'blogs':
          return 'blog';
        case 'notices':
        case 'notice':
          return 'notices';
        case 'receptionist':
        case 'reception':
          return 'receptionist';
        case 'admin':
        case 'dashboard':
          return 'admin';
        case 'contact':
        case 'location':
          return 'contact';
        case 'verify-staff':
        case 'verify':
        case 'id-card':
          return 'verify-staff';
        case 'qr-codes':
        case 'qr':
        case 'qrcode':
          return 'qr-codes';
        case 'sitemap':
        case 'categories':
          return 'sitemap';
        case 'install':
        case 'install-app':
        case 'download':
        case 'app':
          return 'install';
      }
    }
  }

  return 'home';
}

const PAGE_SEO: Record<PageId, { titleBn: string; titleEn: string; descBn: string; descEn: string }> = {
  home: {
    titleBn: "আনোয়ারা মেডিকেল কমপ্লেক্স (Anowara Medical Complex) | পলাশ, নরসিংদী - anowaramedicalcomplex.com",
    titleEn: "Anowara Medical Complex | Palash, Narsingdi - anowaramedicalcomplex.com",
    descBn: "anowaramedicalcomplex.com - আনোয়ারা মেডিকেল কমপ্লেক্স, ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী। রিসেপশন ও জরুরি: 01972-692504, হাসপাতাল কর্তৃপক্ষ: 01712-692504, সিরিয়াল ডেস্ক: 01944-874304। ২৪ ঘণ্টা জরুরি সেবা ও ডিজিটাল ডায়াগনস্টিক ল্যাব।",
    descEn: "Anowara Medical Complex, Wapda Sadar Road, Palash, Narsingdi. Ambulance: 01972-692504, 24/7 emergency care, specialist doctor appointments, modern diagnostics."
  },
  doctors: {
    titleBn: "বিশেষজ্ঞ ডাক্তারদের তালিকা ও শিডিউল | আনোয়ারা মেডিকেল কমপ্লেক্স - anowaramedicalcomplex.com",
    titleEn: "Specialist Doctors & Visiting Schedule | Anowara Medical Complex",
    descBn: "পলাশ, নরসিংদীতে মেডিসিন, গাইনী, শিশু, হৃদরোগ, অর্থোপেডিক ও চর্মরোগের সেরা বিশেষজ্ঞ ডাক্তারদের চেম্বার ও শিডিউল।",
    descEn: "Find expert doctors in Palash, Narsingdi across Gynecology, Pediatrics, Cardiology, Medicine, and Orthopedics."
  },
  appointment: {
    titleBn: "অনলাইনে ডাক্তার সিরিয়াল নিন | আনোয়ারা মেডিকেল কমপ্লেক্স - anowaramedicalcomplex.com",
    titleEn: "Online Doctor Appointment & Serial | Anowara Medical Complex",
    descBn: "ঘরে বসেই সহজে আনোয়ারা মেডিকেল কমপ্লেক্সের বিশেষজ্ঞ চিকিৎসকদের সিরিয়াল সংগ্রহ করুন এবং সরাসরি কল দিন: 01944-874304 (সিরিয়াল ডেস্ক), 01972-692504 (রিসেপশন ও জরুরি)।",
    descEn: "Book your doctor serial token online easily at Anowara Medical Complex Palash, Narsingdi."
  },
  diagnostics: {
    titleBn: "প্যাথলজি ও ডায়াগনস্টিক টেস্টের মূল্য তালিকা | আনোয়ারা মেডিকেল কমপ্লেক্স",
    titleEn: "Diagnostics & Pathology Test Pricing | Anowara Medical Complex",
    descBn: "ডিজিটাল এক্স-রে, ৪ডি আল্ট্রাসনোগ্রাম, রক্তের সকল পরীক্ষা, ইসিজি ও ডায়াগনস্টিক টেস্টের সঠিক ফলাফল ও নির্ধারিত ফি তালিকা।",
    descEn: "Explore transparent test pricing for Digital X-Ray, 4D USG, Blood tests, and automated pathology at Anowara Medical Complex."
  },
  services: {
    titleBn: "হাসপাতালের সেবা ও সুবিধাসমূহ | আনোয়ারা মেডিকেল কমপ্লেক্স পলাশ",
    titleEn: "Hospital Medical Facilities & Services | Anowara Medical Complex",
    descBn: "২৪ ঘণ্টা জরুরি বিভাগ, নরমাল ডেলিভারি, আধুনিক ওটি, কেবিন, ওয়ার্ড, এসি অ্যাম্বুলেন্স (01972-692504) ও সার্বক্ষণিক ফার্মেসি সেবা।",
    descEn: "Discover our 24/7 Emergency, Normal Delivery Unit, Modern Operation Theaters, Cabins, and Ambulance services."
  },
  contact: {
    titleBn: "যোগাযোগ ও গুগল ম্যাপ ঠিকানা | আনোয়ারা মেডিকেল কমপ্লেক্স পলাশ, নরসিংদী",
    titleEn: "Contact & Location Directions | Anowara Medical Complex",
    descBn: "ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী। রিসেপশন ও জরুরি: 01972-692504, কর্তৃপক্ষ: 01712-692504, সিরিয়াল: 01944-874304। সরাসরি গুগল ম্যাপে অবস্থান দেখুন।",
    descEn: "Visit Anowara Medical Complex at Wapda Sadar Road, Medical Morh, Palash, Narsingdi. 24/7 emergency contacts."
  },
  notices: {
    titleBn: "হাসপাতালের নোটিশ ও ফ্রি মেডিকেল ক্যাম্প | আনোয়ারা মেডিকেল কমপ্লেক্স",
    titleEn: "Hospital Notices & Medical Announcements | Anowara Medical Complex",
    descBn: "আনোয়ারা মেডিকেল কমপ্লেক্সের সর্বশেষ জরুরি নোটিশ, বিশেষজ্ঞ চিকিৎসকদের বিশেষ ভিজিট ও ফ্রি স্বাস্থ্য ক্যাম্পের খবর।",
    descEn: "Latest hospital circulars, doctor schedule changes, and health camp notices from Anowara Medical Complex."
  },
  blog: {
    titleBn: "স্বাস্থ্য টিপস ও সচেতনতা ব্লগ | আনোয়ারা মেডিকেল কমপ্লেক্স",
    titleEn: "Health Tips & Medical Awareness Blog | Anowara Medical Complex",
    descBn: "সুস্থ থাকার নিয়ম, ডায়াবেটিস ও উচ্চ রক্তচাপ নিয়ন্ত্রণ, এবং গর্ভকালীন পরিচর্যার বিষয়ে বিশেষজ্ঞ চিকিৎসকদের পরামর্শ।",
    descEn: "Read healthcare tips, healthy lifestyle guides, and medical advice by specialist doctors."
  },
  gallery: {
    titleBn: "হাসপাতালের ফটো গ্যালারি ও পরিবেশ | আনোয়ারা মেডিকেল কমপ্লেক্স",
    titleEn: "Hospital Photo Gallery & Infrastructure | Anoara Medical Complex",
    descBn: "আনোয়ারা মেডিকেল কমপ্লেক্সের আধুনিক ওটি, ডেন্টাল ইউনিট, পেশেন্ট বেড ও ক্লিনিক্যাল পরিবেশের আলোকচিত্র।",
    descEn: "View verified interior and facility photos of Anoara Medical Complex in Palash, Narsingdi."
  },
  management: {
    titleBn: "পরিচালনা পর্ষদ ও প্রশাসনিক টিম | আনোয়ারা মেডিকেল কমপ্লেক্স",
    titleEn: "Governing Board & Management | Anoara Medical Complex",
    descBn: "আনোয়ারা মেডিকেল কমপ্লেক্সের সম্মানিত ম্যানেজিং ডিরেক্টর, চেয়ারম্যান ও পরিচালনা কমিটির পরিচিতি।",
    descEn: "Meet the governing board, managing director, and leadership team of Anoara Medical Complex."
  },
  receptionist: {
    titleBn: "রিসেপশন পোর্টাল | আনোয়ারা মেডিকেল কমপ্লেক্স",
    titleEn: "Reception Portal | Anoara Medical Complex",
    descBn: "রোগী সিরিয়াল রেজিস্ট্রি ও রিসেপশন ডেস্ক।",
    descEn: "Reception management desk for patient intake."
  },
  admin: {
    titleBn: "প্রশাসনিক প্যানেল | আনোয়ারা মেডিকেল কমপ্লেক্স",
    titleEn: "Admin Management Dashboard | Anoara Medical Complex",
    descBn: "হাসপাতাল ম্যানেজমেন্ট ও প্রশাসন কন্ট্রোল প্যানেল।",
    descEn: "Administrative management portal."
  },
  'verify-staff': {
    titleBn: "কর্মকর্তা / কর্মচারী পরিচয় যাচাইকরণ | আনোয়ারা মেডিকেল কমপ্লেক্স",
    titleEn: "Staff ID Credential Verification | Anoara Medical Complex",
    descBn: "আনোয়ারা মেডিকেল কমপ্লেক্সের কর্মকর্তা ও কর্মচারীদের অফিশিয়াল আইডি কার্ড সত্যতায়ন ও ভেরিফিকেশন পোর্টাল।",
    descEn: "Official staff credential verification and QR code registry for Anoara Medical Complex personnel."
  },
  'qr-codes': {
    titleBn: "জরুরি কিউআর কোড হাব ও ডাউনলোড সেন্টার (QR Codes) | আনোয়ারা মেডিকেল কমপ্লেক্স পলাশ",
    titleEn: "Official QR Codes & Access Hub | Anowara Medical Complex Palash",
    descBn: "ওয়েবসাইট, অনলাইন সিরিয়াল, জরুরি অ্যাম্বুলেন্স (01712-692504) ও গুগল ম্যাপ লোকেশনের হাই-রেজোলিউশন কিউআর কোড স্ক্যান ও ডাউনলোড করুন।",
    descEn: "Scan and download high-resolution QR codes for website, doctor appointment serials, ambulance hotline, and Google Maps directions."
  },
  sitemap: {
    titleBn: "ওয়েবসাইট সাইটম্যাপ ও ক্যাটাগরি ডিরেক্টরি | আনোয়ারা মেডিকেল কমপ্লেক্স পলাশ",
    titleEn: "Website Sitemap & Categories Directory | Anowara Medical Complex Palash",
    descBn: "আনোয়ারা মেডিকেল কমপ্লেক্সের সকল পেজ, বিশেষজ্ঞ ডাক্তারদের শিডিউল, টেস্ট ফি তালিকা, সেবা ও কিউআর কোডের পূর্ণাঙ্গ সাইটম্যাপ।",
    descEn: "Complete categorized site directory and page sitemap of Anowara Medical Complex Palash, Narsingdi."
  },
  install: {
    titleBn: "আপনার ডিভাইসে অ্যাপ ইনস্টল করুন (Install App) | আনোয়ারা মেডিকেল কমপ্লেক্স পলাশ",
    titleEn: "Install In Your Device (Official App) | Anowara Medical Complex Palash",
    descBn: "ব্রাউজারের ঝামেলা ছাড়াই ফোন বা কম্পিউটারের হোমস্ক্রিনে ১-ক্লিকে আনোয়ারা মেডিকেল কমপ্লেক্স অফিসিয়াল অ্যাপ ইনস্টল করুন।",
    descEn: "Install the official Anowara Medical Complex app on your phone, tablet, or desktop for instant 1-click access."
  }
};

function MainApp() {
  const { isBn } = useLanguage();
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    return parseLocationToPage();
  });
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<string>('');

  // Synchronize document SEO tags on navigation & language changes
  useEffect(() => {
    const seo = PAGE_SEO[currentPage] || PAGE_SEO.home;
    const title = isBn ? seo.titleBn : seo.titleEn;
    const desc = isBn ? seo.descBn : seo.descEn;
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const canonicalUrl = currentPage === 'home' 
        ? 'https://anowaramedicalcomplex.com/' 
        : `https://anowaramedicalcomplex.com/${currentPage}`;
      canonical.setAttribute('href', canonicalUrl);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      const canonicalUrl = currentPage === 'home' 
        ? 'https://anowaramedicalcomplex.com/' 
        : `https://anowaramedicalcomplex.com/${currentPage}`;
      ogUrl.setAttribute('content', canonicalUrl);
    }
  }, [currentPage, isBn]);

  // Cleanly upgrade any legacy hash links (#doctors -> /doctors) on first mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const clean = window.location.hash.replace(/^[#/]+/, '').split('?')[0].trim().toLowerCase();
      if (clean && clean !== 'home') {
        window.history.replaceState({}, '', `/${clean}`);
      }
    }
  }, []);

  // Sync with browser back/forward, popstate and hash changes
  useEffect(() => {
    const handleUrlChange = () => {
      const newPage = parseLocationToPage();
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    const targetPath = page === 'home' ? '/' : `/${page}`;
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
      if (window.location.hash) {
        window.history.replaceState({}, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDoctorForAppointment = (doctorName: string) => {
    setSelectedDoctorForBooking(doctorName);
    navigateTo('appointment');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F7] text-[#132A33] selection:bg-[#2D8FC1] selection:text-white">
      {/* 1. Top Emergency Notice Marquee */}
      <NoticeMarquee onNavigateToNotices={() => navigateTo('notices')} />

      {/* 2. Main Navigation Header with Language Switcher */}
      <Header currentPage={currentPage} onNavigate={navigateTo} />

      {/* 3. Dedicated Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectDoctorForAppointment={handleSelectDoctorForAppointment}
          />
        )}

        {currentPage === 'doctors' && (
          <DoctorsPage
            onSelectDoctorForAppointment={handleSelectDoctorForAppointment}
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'diagnostics' && (
          <DiagnosticsPage
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'management' && (
          <ManagementPage
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'appointment' && (
          <AppointmentPage
            initialDoctor={selectedDoctorForBooking}
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'blog' && (
          <BlogPage
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'notices' && (
          <NoticesPage
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'receptionist' && (
          <ReceptionistDashboardPage
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'verify-staff' && (
          <StaffVerificationPage
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {currentPage === 'qr-codes' && (
          <QrCodesPage
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'sitemap' && (
          <SitemapPage
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'install' && (
          <InstallPage
            onNavigateHome={() => navigateTo('home')}
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* 4. Global Footer with Language & Page Links */}
      <Footer onNavigate={navigateTo} />

      {/* 5. Floating Quick Action & Emergency Dial - Hidden on Admin and Receptionist dashboards so it does not block tables/filters */}
      {currentPage !== 'admin' && currentPage !== 'receptionist' && (
        <>
          <FloatingEmergencyButton onNavigate={navigateTo} />
          <HospitalAiChatbot onNavigate={navigateTo} />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </LanguageProvider>
  );
}
