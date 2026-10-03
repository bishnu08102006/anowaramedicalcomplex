export interface PageSeoConfig {
  path: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  keywordsBn: string;
  keywordsEn: string;
  ogType?: string;
  priority: string;
  changefreq: string;
  categoryNameBn: string;
  categoryNameEn: string;
}

export const SITE_DOMAIN = 'https://anowaramedicalcomplex.com';

export const PAGES_SEO: Record<string, PageSeoConfig> = {
  home: {
    path: '/',
    titleBn: 'আনোয়ারা মেডিকেল কমপ্লেক্স (Anowara Medical Complex) | পলাশ, নরসিংদী - anowaramedicalcomplex.com',
    titleEn: 'Anowara Medical Complex | Palash, Narsingdi - Official Hospital Website',
    descBn: 'anowaramedicalcomplex.com - আনোয়ারা মেডিকেল কমপ্লেক্স (পলাশ, নরসিংদী)। ২৪/৭ জরুরি চিকিৎসা, বিশেষজ্ঞ ডাক্তারদের সিরিয়াল, আধুনিক ডিজিটাল এক্স-রে, ৪ডি আল্ট্রাসনোগ্রাম ও প্যাথলজি ল্যাব। হটলাইন: 01972-692504, 01944-874304।',
    descEn: 'Official website of Anowara Medical Complex in Palash, Narsingdi. 24/7 emergency care, specialist doctors, digital X-Ray, 4D USG, pathology lab & ambulance services.',
    keywordsBn: 'আনোয়ারা মেডিকেল কমপ্লেক্স, আনোয়ারা হাসপাতাল পলাশ, পলাশ নরসিংদী হাসপাতাল, পলাশ মেডিকেল নরসিংদী, ঘোড়াশাল পলাশ ক্লিনিক, ২৪ ঘন্টা জরুরি চিকিৎসা পলাশ, অ্যাম্বুলেন্স নরসিংদী, anowaramedicalcomplex.com',
    keywordsEn: 'Anowara Medical Complex, Anowara Hospital Palash, Palash Narsingdi Hospital, doctor serial Palash, best clinic Narsingdi, 24/7 emergency hospital Palash, diagnostic center Palash',
    priority: '1.0',
    changefreq: 'daily',
    categoryNameBn: 'হোম ও সার্বিক পরিচিতি',
    categoryNameEn: 'Home & Overview'
  },
  doctors: {
    path: '/doctors',
    titleBn: 'বিশেষজ্ঞ ডাক্তারদের তালিকা ও চেম্বার শিডিউল | আনোয়ারা মেডিকেল কমপ্লেক্স, পলাশ, নরসিংদী',
    titleEn: 'Specialist Doctors & Visiting Schedule | Anowara Medical Complex, Palash',
    descBn: 'পলাশ ও নরসিংদীতে মেডিসিন, হৃদরোগ, গাইনী ও প্রসূতি, শিশু, অর্থোপেডিক, নাক-কান-গলা ও চর্মরোগের শীর্ষ বিশেষজ্ঞ চিকিৎসকদের ভিজিটিং দিন ও চেম্বার সময়সূচী। সিরিয়াল: 01944-874304।',
    descEn: 'Complete directory of specialist doctors and chamber visiting schedules at Anowara Medical Complex, Palash, Narsingdi. Book serial via 01944-874304.',
    keywordsBn: 'বিশেষজ্ঞ ডাক্তার পলাশ, ডাক্তার চেম্বার শিডিউল নরসিংদী, গাইনী ডাক্তার পলাশ, শিশু বিশেষজ্ঞ নরসিংদী, মেডিসিন বিশেষজ্ঞ পলাশ, অর্থোপেডিক ডাক্তার নরসিংদী, হৃদরোগ বিশেষজ্ঞ পলাশ',
    keywordsEn: 'specialist doctors Palash, doctor schedule Narsingdi, gynecologist Palash, pediatrician Narsingdi, cardiologist Palash, doctor appointment schedule Narsingdi',
    priority: '0.95',
    changefreq: 'daily',
    categoryNameBn: 'বিশেষজ্ঞ ডাক্তার ও শিডিউল',
    categoryNameEn: 'Specialist Doctors'
  },
  appointment: {
    path: '/appointment',
    titleBn: 'অনলাইনে বিশেষজ্ঞ ডাক্তার সিরিয়াল বুকিং ও টোকেন | আনোয়ারা মেডিকেল কমপ্লেক্স',
    titleEn: 'Online Doctor Serial Booking & Patient Token | Anowara Medical Complex',
    descBn: 'ঘরে বসেই সহজে আনোয়ারা মেডিকেল কমপ্লেক্সের বিশেষজ্ঞ চিকিৎসকদের সিরিয়াল সংগ্রহ করুন। সরাসরি সিরিয়াল ডেস্ক: 01944-874304, জরুরি ও রিসেপশন: 01972-692504। ডিজিটাল টোকেন স্লিপ প্রিন্ট করুন।',
    descEn: 'Book specialist doctor serial tokens online easily at Anowara Medical Complex Palash, Narsingdi. Direct serial desk: 01944-874304. Instant digital appointment token.',
    keywordsBn: 'ডাক্তার সিরিয়াল পলাশ, অনলাইন সিরিয়াল বুকিং নরসিংদী, ডাক্তার টোকেন পলাশ, আনোয়ারা মেডিকেল সিরিয়াল ফোন নম্বর, সিরিয়াল ডেস্ক পলাশ নরসিংদী',
    keywordsEn: 'doctor serial booking Palash, online doctor appointment Narsingdi, patient token booking Palash, Anowara medical appointment number',
    priority: '0.95',
    changefreq: 'daily',
    categoryNameBn: 'ডাক্তার সিরিয়াল ও বুকিং',
    categoryNameEn: 'Doctor Serial Booking'
  },
  diagnostics: {
    path: '/diagnostics',
    titleBn: 'প্যাথলজি ও ডায়াগনস্টিক পরীক্ষার মূল্য তালিকা | আনোয়ারা মেডিকেল কমপ্লেক্স',
    titleEn: 'Diagnostic Tests & Pathology Pricing List | Anowara Medical Complex',
    descBn: 'ডিজিটাল হাই-ফ্রিকোয়েন্সি এক্স-রে, ৪ডি কালার ডপলার আল্ট্রাসনোগ্রাম, ইসিজি, সিবিসি, লিপিড প্রোফাইল ও রক্ত-প্রস্রাব পরীক্ষার সম্পূর্ণ তালিকা ও নির্ধারিত সরকারি/সাশ্রয়ী মূল্য তালিকা।',
    descEn: 'Transparent pricing list for digital X-Ray, 4D color doppler ultrasonography, ECG, automated pathology tests, and hormone assays at Anowara Medical Complex.',
    keywordsBn: 'ডায়াগনস্টিক টেস্ট ফি পলাশ, এক্স-রে খরচ নরসিংদী, আল্ট্রাসনোগ্রাম খরচ পলাশ, রক্তের টেস্ট প্রাইস নরসিংদী, প্যাথলজি ল্যাব পলাশ, ইসিজি টেস্ট ফি পলাশ নরসিংদী',
    keywordsEn: 'diagnostic test price Palash, X-Ray cost Narsingdi, ultrasound USG price Palash, pathology lab test fees Narsingdi, ECG cost Palash',
    priority: '0.90',
    changefreq: 'weekly',
    categoryNameBn: 'পরীক্ষা ও টেস্ট ফি তালিকা',
    categoryNameEn: 'Diagnostic Test Pricing'
  },
  services: {
    path: '/services',
    titleBn: 'হাসপাতালের সেবাসমূহ - ২৪ ঘণ্টা জরুরি বিভাগ, ওটি ও অ্যাম্বুলেন্স | আনোয়ারা মেডিকেল',
    titleEn: 'Clinical & Emergency Services - 24/7 Care & Ambulance | Anowara Medical',
    descBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের সার্বক্ষণিক জরুরি বিভাগ, নিজস্ব আধুনিক অ্যাম্বুলেন্স, মডুলার অপারেশন থিয়েটার, নরমাল ডেলিভারি সেন্টার, ভিআইপি কেবিন ও ডেডিকেটেড ফার্মেসি সেবা।',
    descEn: 'Comprehensive hospital services at Anowara Medical Complex: 24/7 emergency unit, round-the-clock ambulance, modular OT, normal delivery, VIP cabins, and pharmacy.',
    keywordsBn: 'হাসপাতাল সেবা পলাশ, অ্যাম্বুলেন্স সার্ভিস পলাশ নরসিংদী, জরুরি বিভাগ পলাশ, নরমাল ডেলিভারি ক্লিনিক নরসিংদী, অপারেশন থিয়েটার পলাশ, কেবিন ভাড়া পলাশ হাসপাতাল',
    keywordsEn: 'hospital services Palash, ambulance service Narsingdi, emergency medical care Palash, modular operation theatre Narsingdi, maternity clinic Palash',
    priority: '0.85',
    changefreq: 'weekly',
    categoryNameBn: 'হাসপাতালের সেবাসমূহ',
    categoryNameEn: 'Hospital Services'
  },
  management: {
    path: '/management',
    titleBn: 'পরিচালনা পর্ষদ ও প্রশাসনিক টিম | আনোয়ারা মেডিকেল কমপ্লেক্স, পলাশ, নরসিংদী',
    titleEn: 'Governing Board & Leadership Team | Anowara Medical Complex',
    descBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের সম্মানিত ম্যানেজিং ডিরেক্টর, চেয়ারম্যান, বোর্ড অফ ডিরেক্টরস এবং প্রশাসনিক কর্মকর্তাদের পরিচিতি ও বাণী। সেবার ব্রতে নিবেদিত পরিচালনা পরিষদ।',
    descEn: 'Meet the governing board, managing director, clinical directors, and administrative leadership of Anowara Medical Complex Palash, Narsingdi.',
    keywordsBn: 'পরিচালনা পরিষদ আনোয়ারা মেডিকেল, হাসপাতাল পরিচালক পলাশ, ম্যানেজিং ডিরেক্টর আনোয়ারা মেডিকেল নরসিংদী, গভর্নিং বডি পলাশ ক্লিনিক',
    keywordsEn: 'governing board Anowara Medical, hospital director Palash Narsingdi, managing director Anowara Medical Complex',
    priority: '0.80',
    changefreq: 'monthly',
    categoryNameBn: 'পরিচালনা পর্ষদ ও প্রশাসন',
    categoryNameEn: 'Governing Board & Management'
  },
  gallery: {
    path: '/gallery',
    titleBn: 'ফটো গ্যালারি ও ক্লিনিক্যাল অবকাঠামো | আনোয়ারা মেডিকেল কমপ্লেক্স, পলাশ',
    titleEn: 'Photo Gallery & Hospital Infrastructure | Anowara Medical Complex',
    descBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের আধুনিক বহির্বিভাগ, রিসেপশন লাউঞ্জ, আল্ট্রাসনোগ্রাম ও এক্স-রে রুম, শীতাতপ নিয়ন্ত্রিত ভিআইপি কেবিন ও স্বাস্থ্যসম্মত ওটি কমপ্লেক্সের স্থিরচিত্র।',
    descEn: 'Verified photo gallery of Anowara Medical Complex featuring our modern reception, consultation chambers, diagnostic imaging labs, and patient inpatient cabins.',
    keywordsBn: 'আনোয়ারা মেডিকেল ছবি, হাসপাতাল ফটো গ্যালারি পলাশ, ক্লিনিক ছবি নরসিংদী, ওটি ছবি পলাশ হাসপাতাল, কেবিন রুম পলাশ',
    keywordsEn: 'Anowara medical photos, hospital interior pictures Palash, diagnostic lab photo Narsingdi, clinic building Palash',
    priority: '0.75',
    changefreq: 'weekly',
    categoryNameBn: 'ফটো গ্যালারি',
    categoryNameEn: 'Photo Gallery'
  },
  blog: {
    path: '/blog',
    titleBn: 'স্বাস্থ্য ব্লগ ও বিশেষজ্ঞ চিকিৎসা পরামর্শ | আনোয়ারা মেডিকেল কমপ্লেক্স',
    titleEn: 'Health Blog, Wellness Tips & Medical Articles | Anowara Medical Complex',
    descBn: 'হৃদরোগ প্রতিরোধ, গর্ভকালীন যত্ন, শিশুর পুষ্টি, ডায়াবেটিস নিয়ন্ত্রণ ও মৌসুমী রোগ প্রতিরোধে বিশেষজ্ঞ চিকিৎসকদের রচিত স্বাস্থ্য সচেতনতামূলক তথ্য ও নিয়মিত ব্লগ।',
    descEn: 'Educational healthcare blog authored by specialist doctors covering maternal health, pediatrics, diabetes management, cardiac care, and preventive health.',
    keywordsBn: 'স্বাস্থ্য ব্লগ বাংলা, চিকিৎসা পরামর্শ পলাশ, গর্ভকালীন যত্ন টিপস, ডায়াবেটিস সচেতনতা নরসিংদী, শিশু স্বাস্থ্য পরামর্শ, স্বাস্থ্য টিপস বাংলা',
    keywordsEn: 'health blog Bengali, medical articles Bangladesh, pregnancy care advice, diabetes diet tips, specialist doctor advice Palash',
    priority: '0.80',
    changefreq: 'weekly',
    categoryNameBn: 'স্বাস্থ্য ব্লগ ও পরামর্শ',
    categoryNameEn: 'Health Blog & Articles'
  },
  notices: {
    path: '/notices',
    titleBn: 'নোটিশ বোর্ড ও জরুরি প্রশাসনিক বিজ্ঞপ্তি | আনোয়ারা মেডিকেল কমপ্লেক্স',
    titleEn: 'Official Notice Board & Circulars | Anowara Medical Complex',
    descBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের সর্বশেষ প্রশাসনিক বিজ্ঞপ্তি, বিনামূল্যে মেডিকেল ক্যাম্প, ছুটির সময়সূচী ও জরুরি স্বাস্থ্য নির্দেশনা। অফিসিয়াল প্যাড ফরম্যাটে প্রিন্ট ও ডাউনলোড সুবিধা।',
    descEn: 'Official circulars, public health notices, specialist visiting announcements, and community health camps from Anowara Medical Complex, Palash.',
    keywordsBn: 'হাসপাতাল নোটিশ পলাশ, ফ্রি মেডিকেল ক্যাম্প নরসিংদী, আনোয়ারা মেডিকেল বিজ্ঞপ্তি, অফিসিয়াল নোটিশ বোর্ড পলাশ',
    keywordsEn: 'hospital notice board Palash, free medical camp Narsingdi, circulars Anowara Medical Complex',
    priority: '0.80',
    changefreq: 'weekly',
    categoryNameBn: 'নোটিশ ও বিজ্ঞপ্তি',
    categoryNameEn: 'Notices & Circulars'
  },
  contact: {
    path: '/contact',
    titleBn: 'ঠিকানা, লোকেশন ও গুগল ম্যাপ দিকনির্দেশনা | আনোয়ারা মেডিকেল কমপ্লেক্স, পলাশ, নরসিংদী',
    titleEn: 'Location, Contact & Google Maps Directions | Anowara Medical Complex',
    descBn: 'ঠিকানা: ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী। সার্বক্ষণিক জরুরি হটলাইন: 01972-692504, সিরিয়াল ডেস্ক: 01944-874304। গুগল ম্যাপে সরাসরি লোকেশন দেখে আসুন।',
    descEn: 'Contact Anowara Medical Complex. Address: WAPDA Sadar Road, Medical Mor, Palash, Narsingdi. Emergency Hotline: 01972-692504, Serial: 01944-874304. Interactive Google Maps.',
    keywordsBn: 'আনোয়ারা মেডিকেল কমপ্লেক্স ঠিকানা, পলাশ হাসপাতাল ফোন নম্বর, মেডিকেল মোড় পলাশ নরসিংদী, ঘোড়াশাল পলাশ ডাক্তার ফোন নাম্বার, জরুরি হটলাইন পলাশ',
    keywordsEn: 'Anowara Medical Complex address, Palash hospital contact number, Medical Mor Palash Narsingdi, hospital directions Palash',
    priority: '0.85',
    changefreq: 'monthly',
    categoryNameBn: 'যোগাযোগ ও গুগল ম্যাপ',
    categoryNameEn: 'Contact & Directions'
  },
  'verify-staff': {
    path: '/verify-staff',
    titleBn: 'কর্মকর্তা / কর্মচারী পরিচয় যাচাইকরণ ও ডিজিটাল কিউআর কোড | আনোয়ারা মেডিকেল কমপ্লেক্স',
    titleEn: 'Staff Credential Verification & Digital QR Registry | Anowara Medical Complex',
    descBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের চিকিৎসক, নার্স, ল্যাব টেকনোলজিস্ট ও প্রশাসনিক কর্মকর্তাদের অফিশিয়াল আইডি কার্ড সত্যতায়ন ও ডিজিটাল কিউআর কোড ভেরিফিকেশন পোর্টাল।',
    descEn: 'Official digital credential verification portal and QR code authentication registry for healthcare personnel and staff of Anowara Medical Complex Palash, Narsingdi.',
    keywordsBn: 'স্টাফ আইডি ভেরিফিকেশন পলাশ, আনোয়ারা মেডিকেল আইডি কার্ড যাচাই, কিউআর কোড স্ক্যানার হাসপাতাল নরসিংদী, কর্মচারী পরিচয়পত্র যাচাই পলাশ, স্টাফ ভেরিফিকেশন',
    keywordsEn: 'staff ID verification Palash, digital credential verification Narsingdi, QR code ID card verify Anowara Medical, employee verification Palash',
    priority: '0.85',
    changefreq: 'weekly',
    categoryNameBn: 'স্টাফ আইডি ও কিউআর যাচাই',
    categoryNameEn: 'Staff Credential Verification'
  },
  'qr-codes': {
    path: '/qr-codes',
    titleBn: 'জরুরি কিউআর কোড হাব ও ডাউনলোড সেন্টার (QR Codes) | আনোয়ারা মেডিকেল কমপ্লেক্স, পলাশ',
    titleEn: 'Hospital Official QR Codes & Quick Access Hub | Anowara Medical Complex Palash',
    descBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের অফিসিয়াল ওয়েবসাইট, অনলাইন সিরিয়াল বুকিং, ২৪ ঘণ্টা অ্যাম্বুলেন্স কল, গুগল ম্যাপ লোকেশন ও টেস্ট ফি তালিকার হাই-রেজোলিউশন কিউআর কোড স্ক্যান ও ডাউনলোড করুন।',
    descEn: 'Official QR Code directory for Anowara Medical Complex Palash, Narsingdi: Website QR, doctor serial QR, 24/7 ambulance hotline QR, Google Maps directions QR, and diagnostic pricing QR.',
    keywordsBn: 'কিউআর কোড পলাশ হাসপাতাল, ডাক্তার সিরিয়াল কিউআর কোড, অ্যাম্বুলেন্স কিউআর কোড পলাশ, গুগল ম্যাপ লোকেশন কিউআর নরসিংদী, আনোয়ারা মেডিকেল কিউআর, QR Code Palash Hospital, hospital QR code Bangladesh',
    keywordsEn: 'hospital QR code Palash, doctor serial QR code, emergency ambulance QR code Narsingdi, Google Maps QR code hospital Palash, Anowara medical QR code download',
    priority: '0.90',
    changefreq: 'weekly',
    categoryNameBn: 'কিউআর কোড হাব ও ডাউনলোড',
    categoryNameEn: 'Hospital QR Codes Hub'
  },
  sitemap: {
    path: '/sitemap',
    titleBn: 'ওয়েবসাইট সাইটম্যাপ ও ক্যাটাগরি ডিরেক্টরি | আনোয়ারা মেডিকেল কমপ্লেক্স, পলাশ, নরসিংদী',
    titleEn: 'Website Sitemap, Categories & Page Directory | Anowara Medical Complex',
    descBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের সকল ক্যাটাগরি, বিশেষজ্ঞ ডাক্তার, ডায়াগনস্টিক টেস্ট ফি, জরুরি সেবা, নোটিশ, কিউআর কোড ও গুগল সার্চ ইঞ্জিনের জন্য পূর্ণাঙ্গ সাইটম্যাপ ডিরেক্টরি।',
    descEn: 'Complete categorized sitemap and page directory of Anowara Medical Complex Palash, Narsingdi. Explore doctors, diagnostics, 24/7 emergency services, and QR codes.',
    keywordsBn: 'সাইটম্যাপ পলাশ হাসপাতাল, আনোয়ারা মেডিকেল ক্যাটাগরি তালিকা, হাসপাতাল পেজ ডিরেক্টরি পলাশ নরসিংদী, সীতাম্যাপ বাংলা, anowaramedicalcomplex sitemap',
    keywordsEn: 'website sitemap Anowara Medical Complex, hospital categories directory Palash Narsingdi, doctor list sitemap, diagnostic pricing sitemap',
    priority: '0.85',
    changefreq: 'weekly',
    categoryNameBn: 'সাইটম্যাপ ও ক্যাটাগরি',
    categoryNameEn: 'Sitemap & Categories'
  },
  receptionist: {
    path: '/receptionist',
    titleBn: 'রিসেপশন পোর্টাল ও সিরিয়াল রেজিস্ট্রি | আনোয়ারা মেডিকেল কমপ্লেক্স',
    titleEn: 'Receptionist Desk Portal | Anowara Medical Complex',
    descBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের রিসেপশন ডেস্ক, লাইভ সিরিয়াল কিউ পর্যবেক্ষণ ও রোগী নিবন্ধন পোর্টাল।',
    descEn: 'Authorized receptionist desk and patient serial queue registry at Anowara Medical Complex.',
    keywordsBn: 'রিসেপশন ড্যাশবোর্ড পলাশ, রোগী সিরিয়াল রেজিস্ট্রি',
    keywordsEn: 'receptionist desk portal, patient serial queue',
    priority: '0.2',
    changefreq: 'daily',
    categoryNameBn: 'রিসেপশন ডেস্ক',
    categoryNameEn: 'Reception Desk'
  },
  admin: {
    path: '/admin',
    titleBn: 'প্রশাসনিক কন্ট্রোল প্যানেল | আনোয়ারা মেডিকেল কমপ্লেক্স',
    titleEn: 'Administrative Dashboard | Anowara Medical Complex',
    descBn: 'আনোয়ারা মেডিকেল কমপ্লেক্সের সেন্ট্রাল অ্যাডমিন ড্যাশবোর্ড - ডাক্তার, পরীক্ষা ফি, স্টাফ আইডি ও নোটিশ পরিচালনা।',
    descEn: 'Central administrative management portal of Anowara Medical Complex.',
    keywordsBn: 'অ্যাডমিন ড্যাশবোর্ড আনোয়ারা মেডিকেল',
    keywordsEn: 'hospital administrative panel',
    priority: '0.2',
    changefreq: 'daily',
    categoryNameBn: 'প্রশাসনিক প্যানেল',
    categoryNameEn: 'Admin Panel'
  }
};

/**
 * Generate comprehensive Schema.org JSON-LD for any page
 */
export function generatePageJsonLd(pageId: string): string {
  const page = PAGES_SEO[pageId] || PAGES_SEO.home;
  const canonicalUrl = `${SITE_DOMAIN}${page.path === '/' ? '' : page.path}`;

  // Hospital structured data
  const hospitalSchema = {
    '@type': 'Hospital',
    '@id': `${SITE_DOMAIN}/#hospital`,
    name: 'আনোয়ারা মেডিকেল কমপ্লেক্স (Anowara Medical Complex)',
    alternateName: [
      'Anowara Medical Complex',
      'Anowara Hospital Palash',
      'আনোয়ারা হাসপাতাল পলাশ',
      'পলাশ হাসপাতাল নরসিংদী',
      'আনোয়ারা মেডিকেল কমপ্লেক্স'
    ],
    url: SITE_DOMAIN,
    logo: `${SITE_DOMAIN}/hospital-logo.svg`,
    image: [
      `${SITE_DOMAIN}/facade.jpg`,
      `${SITE_DOMAIN}/hospital-logo.jpg`
    ],
    description: page.descBn,
    telephone: '+8801972-692504',
    priceRange: '৳৳',
    currenciesAccepted: 'BDT',
    paymentAccepted: 'Cash, bKash, Nagad',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ওয়াপদা সদর রোড, মেডিকেল মোড়',
      addressLocality: 'পলাশ',
      addressRegion: 'নরসিংদী',
      postalCode: '1610',
      addressCountry: 'BD'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.973892,
      longitude: 90.637563
    },
    hasMap: 'https://maps.app.goo.gl/ESVAyVjEDpS2585JA',
    sameAs: [
      'https://www.facebook.com/anowaramedicalcomplex01/'
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+8801972-692504',
        contactType: 'emergency',
        name: 'Emergency Hotline & Ambulance',
        areaServed: 'BD',
        availableLanguage: ['Bengali', 'English']
      },
      {
        '@type': 'ContactPoint',
        telephone: '+8801944-874304',
        contactType: 'appointments',
        name: 'Doctor Serial Desk',
        areaServed: 'BD',
        availableLanguage: ['Bengali', 'English']
      }
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        opens: '00:00',
        closes: '23:59'
      }
    ],
    medicalSpecialty: [
      'Cardiovascular',
      'Gynecologic',
      'Pediatric',
      'Dermatologic',
      'Orthopedic',
      'Gastroenterologic',
      'Neurologic',
      'Urologic',
      'Dental'
    ]
  };

  // Google Sitelinks Navigation Schema (Enables Category Links in Google Search)
  const sitelinksSchema = {
    '@type': 'ItemList',
    '@id': `${SITE_DOMAIN}/#sitelinks`,
    name: 'Anowara Medical Complex Website Categories',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'বিশেষজ্ঞ ডাক্তারদের তালিকা (Specialist Doctors)',
        description: 'পলাশ ও নরসিংদীর অভিজ্ঞ চিকিৎসকদের চেম্বার ও ভিজিটিং শিডিউল',
        url: `${SITE_DOMAIN}/doctors`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'অনলাইনে সিরিয়াল বুকিং (Doctor Serial Booking)',
        description: 'ঘরে বসেই সহজে বিশেষজ্ঞ ডাক্তারের সিরিয়াল সংগ্রহ করুন',
        url: `${SITE_DOMAIN}/appointment`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'পরীক্ষা ও টেস্ট ফি তালিকা (Diagnostic Test Pricing)',
        description: 'ডিজিটাল এক্স-রে, ৪ডি আল্ট্রাসনোগ্রাম ও প্যাথলজি টেস্ট মূল্য',
        url: `${SITE_DOMAIN}/diagnostics`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'হাসপাতালের সেবাসমূহ (Clinical Services)',
        description: '২৪/৭ জরুরি বিভাগ, আধুনিক ওটি, অ্যাম্বুলেন্স ও ভিআইপি কেবিন',
        url: `${SITE_DOMAIN}/services`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 5,
        name: 'পরিচালনা পর্ষদ (Governing Board)',
        description: 'আনোয়ারা মেডিকেল কমপ্লেক্সের সম্মানিত পরিচালনা কমিটি',
        url: `${SITE_DOMAIN}/management`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 6,
        name: 'স্টাফ আইডি কার্ড যাচাইকরণ (Staff ID QR Verify)',
        description: 'কর্মকর্তা-কর্মচারীদের ডিজিটাল কিউআর কোড ও পরিচয়পত্র সত্যতায়ন',
        url: `${SITE_DOMAIN}/verify-staff`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 7,
        name: 'জরুরি কিউআর কোড হাব (QR Codes Hub)',
        description: 'ওয়েবসাইট, ডাক্তার সিরিয়াল, অ্যাম্বুলেন্স ও লোকেশন কিউআর কোড ডাউনলোড',
        url: `${SITE_DOMAIN}/qr-codes`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 8,
        name: 'সাইটম্যাপ ও ক্যাটাগরি ডিরেক্টরি (Sitemap)',
        description: 'আনোয়ারা মেডিকেল কমপ্লেক্সের সকল পেজ ও ক্যাটাগরি তালিকা',
        url: `${SITE_DOMAIN}/sitemap`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 9,
        name: 'জরুরি যোগাযোগ ও গুগল ম্যাপ (Contact & Map)',
        description: 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী',
        url: `${SITE_DOMAIN}/contact`
      }
    ]
  };

  // WebPage Schema
  const webpageSchema = {
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: page.titleBn,
    description: page.descBn,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_DOMAIN}/#website`,
      url: SITE_DOMAIN,
      name: 'Anowara Medical Complex',
      alternateName: 'আনোয়ারা মেডিকেল কমপ্লেক্স'
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'হোম',
          item: `${SITE_DOMAIN}/`
        },
        ...(page.path !== '/' ? [
          {
            '@type': 'ListItem',
            position: 2,
            name: page.categoryNameBn,
            item: canonicalUrl
          }
        ] : [])
      ]
    }
  };

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      hospitalSchema,
      sitelinksSchema,
      webpageSchema
    ]
  }, null, 2);
}

/**
 * Generate valid XML Sitemap for Google Search Console & Web Crawlers
 */
export function generateXmlSitemap(): string {
  const publicPages = Object.entries(PAGES_SEO).filter(([key]) => key !== 'admin' && key !== 'receptionist');
  const now = new Date().toISOString().split('T')[0];

  const urlsXml = publicPages.flatMap(([key, cfg]) => {
    const cleanLoc = `${SITE_DOMAIN}${cfg.path === '/' ? '/' : cfg.path}`;
    const cleanEntry = `  <url>
    <loc>${cleanLoc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${cfg.changefreq}</changefreq>
    <priority>${cfg.priority}</priority>
  </url>`;

    // If it's not the root homepage, also list the .html canonical variant for static engine indexing
    if (key !== 'home') {
      const htmlLoc = `${SITE_DOMAIN}/${key}.html`;
      const htmlEntry = `  <url>
    <loc>${htmlLoc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${cfg.changefreq}</changefreq>
    <priority>${(Number(cfg.priority) * 0.95).toFixed(2)}</priority>
  </url>`;
      return [cleanEntry, htmlEntry];
    }
    return [cleanEntry];
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}
