export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  titleEn: string;
  category: 'building' | 'cabin' | 'ward' | 'dental' | 'ot' | 'diagnostic' | 'events' | string;
  categoryLabel: string;
  categoryLabelEn: string;
  desc: string;
  descEn: string;
  createdAt?: number;
}

export interface GalleryCategoryOption {
  id: string;
  labelBn: string;
  labelEn: string;
}

export const GALLERY_CATEGORIES: GalleryCategoryOption[] = [
  { id: 'all', labelBn: 'সকল ছবি', labelEn: 'All Photos' },
  { id: 'building', labelBn: 'ভবন ও রিসেপশন', labelEn: 'Building & Reception' },
  { id: 'cabin', labelBn: 'ভিআইপি কেবিন', labelEn: 'VIP Cabins' },
  { id: 'ward', labelBn: 'জেনারেল ওয়ার্ড', labelEn: 'General Ward' },
  { id: 'dental', labelBn: 'ডেন্টাল ইউনিট', labelEn: 'Dental Unit' },
  { id: 'ot', labelBn: 'অপারেশন থিয়েটার (OT)', labelEn: 'Operation Theatre' },
  { id: 'diagnostic', labelBn: 'ডায়াগনস্টিক ও ল্যাব', labelEn: 'Diagnostic & Lab' },
  { id: 'events', labelBn: 'ক্যাম্প ও বিশেষ আয়োজন', labelEn: 'Camps & Events' },
];

export const initialGalleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    src: "/facade.jpg",
    title: "হাসপাতাল প্রধান ভবন ও প্রবেশদ্বার",
    titleEn: "Hospital Main Facade & Reception Entrance",
    category: "building",
    categoryLabel: "ভবন ও রিসেপশন",
    categoryLabelEn: "Building & Reception",
    desc: "ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ — আধুনিক সুযোগ-সুবিধা সম্বলিত মাল্টি-স্টোরিড হাসপাতাল কমপ্লেক্স।",
    descEn: "Multi-storied hospital complex located at WAPDA Sadar Road, Medical Morh, Palash, Narsingdi.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30
  },
  {
    id: "gal-2",
    src: "/ot-room.jpg",
    title: "ডেন্টাল ওরাল সার্জারি ও স্পেশালাইজড ডেন্টাল ইউনিট",
    titleEn: "Specialized Dental Oral Surgery & Clinical Unit",
    category: "dental",
    categoryLabel: "ডেন্টাল ইউনিট",
    categoryLabelEn: "Dental Unit",
    desc: "অভিজ্ঞ ডেন্টাল সার্জনদের তত্ত্বাবধানে আধুনিক ডেন্টাল ইকুইপমেন্ট ও মুখগহ্বরের উন্নত সার্জিক্যাল চিকিৎসা ব্যবস্থা।",
    descEn: "Specialized dental oral care unit equipped for dental scaling, root canal, and minor oral surgery by expert dental surgeons.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 28
  },
  {
    id: "gal-3",
    src: "/cabin-room.jpg",
    title: "ভিআইপি শীতাতপ নিয়ন্ত্রিত (AC) কেবিন",
    titleEn: "Deluxe Air-Conditioned (AC) Cabin Room",
    category: "cabin",
    categoryLabel: "ভিআইপি কেবিন",
    categoryLabelEn: "VIP Cabins",
    desc: "রোগী ও স্বজনদের জন্য পরিচ্ছন্ন, নিরিবিলি পরিবেশ, এটাচড বাথরুম ও সার্বক্ষণিক নার্স কল বেল সুবিধা।",
    descEn: "Quiet, peaceful private patient suites with attached bathroom, companion sofa and 24/7 nurse-call system.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25
  },
  {
    id: "gal-4",
    src: "/dental-chair.jpg",
    title: "আধুনিক কম্পিউটারাইজড ডেন্টাল ইউনিট",
    titleEn: "Advanced Dental Studio & Chair",
    category: "dental",
    categoryLabel: "ডেন্টাল ইউনিট",
    categoryLabelEn: "Dental Unit",
    desc: "আল্ট্রাসনিক স্কেলার, লাইট কিউরিং ও আধুনিক স্বয়ংক্রিয় চেয়ারসহ অভিজ্ঞ ডেন্টাল সার্জনের চেম্বার।",
    descEn: "Equipped with ultrasonic scalers, light curing systems, and ergonomic multi-function dental chair.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20
  },
  {
    id: "gal-5",
    src: "/general-ward.jpg",
    title: "খোলামেলা ও পরিচ্ছন্ন জেনারেল ওয়ার্ড",
    titleEn: "Spacious & Clean Inpatient General Ward",
    category: "ward",
    categoryLabel: "জেনারেল ওয়ার্ড",
    categoryLabelEn: "General Ward",
    desc: "আলো-বাতাস সমৃদ্ধ প্রশস্ত সাধারণ ওয়ার্ড, প্রতিটি বেডে সেন্ট্রাল অক্সিজেন ও নেবুলাইজার সাপোর্ট পয়েন্ট।",
    descEn: "Well-ventilated general admission ward with dedicated bedside oxygen connections and hygiene protocols.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15
  },
  {
    id: "gal-6",
    src: "/patient-bed.jpg",
    title: "ইনডোর রোগীর সেবাকক্ষ ও পর্যবেক্ষণ বেড",
    titleEn: "Observation Bed & Inpatient Recovery",
    category: "ward",
    categoryLabel: "জেনারেল ওয়ার্ড",
    categoryLabelEn: "General Ward",
    desc: "জরুরি ভর্তি ও সার্জারির পর নিবিড় পর্যবেক্ষণের জন্য মানসম্মত আরামদায়ক বিশেষায়িত বেড।",
    descEn: "Dedicated post-operative observation beds with multiparameter patient monitors and 24-hour nursing.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10
  },
  {
    id: "gal-7",
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    title: "আধুনিক ডিজিটাল প্যাথলজি ও বায়োকেমিক্যাল ল্যাব",
    titleEn: "Modern Digital Pathology & Automated Lab",
    category: "diagnostic",
    categoryLabel: "ডায়াগনস্টিক ও ল্যাব",
    categoryLabelEn: "Diagnostic & Lab",
    desc: "সম্পূর্ণ অটোমেটেড বায়ো-অ্যানালাইজার ও নির্ভুল রিপোর্ট প্রদানের জন্য ডেডিকেটেড ল্যাবরেটরি।",
    descEn: "Fully automated biochemical analyzer ensuring rapid and accurate test results 24/7.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8
  },
  {
    id: "gal-8",
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    title: "২৪/৭ জরুরি বিভাগ ও রিসেপশন ডেস্ফ",
    titleEn: "24/7 Emergency & Patient Information Desk",
    category: "building",
    categoryLabel: "ভবন ও রিসেপশন",
    categoryLabelEn: "Building & Reception",
    desc: "সার্বক্ষণিক রোগী সেবা ও জরুরি প্রাথমিক চিকিৎসার জন্য প্রস্তুত অভ্যর্থনা কক্ষ।",
    descEn: "Round-the-clock emergency triage, registration, and patient counseling desk.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5
  },
  {
    id: "gal-9",
    src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    title: "বিশেষায়িত ডেন্টাল ট্রিটমেন্ট অ্যান্ড সার্জারি রুম",
    titleEn: "Specialized Dental Treatment Procedure Room",
    category: "dental",
    categoryLabel: "ডেন্টাল ইউনিট",
    categoryLabelEn: "Dental Unit",
    desc: "সম্পূর্ণ স্টেরিলাইজড পরিবেশে দাঁতের রুট ক্যানেল, স্কেলিং ও ফিলিং চিকিৎসা।",
    descEn: "Sterile operatory dedicated to root canals, dental scaling, extractions, and oral rehabilitation.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  }
];
