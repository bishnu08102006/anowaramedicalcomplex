export interface ManagementMember {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  category: 'governing' | 'executive' | 'medical_admin';
  categoryLabel: string;
  categoryLabelEn: string;
  qualifications: string;
  qualificationsEn: string;
  bio: string;
  bioEn: string;
  phone: string;
  email: string;
  image: string;
  message?: string;
  messageEn?: string;
  createdAt?: number;
  order?: number;
}

export const MANAGEMENT_CATEGORIES = [
  { id: 'all', labelBn: 'সকল সদস্য', labelEn: 'All Members' },
  { id: 'governing', labelBn: 'পরিচালনা পর্ষদ / গভর্নিং বডি', labelEn: 'Governing Body' },
  { id: 'executive', labelBn: 'নির্বাহী পরিষদ', labelEn: 'Executive Council' },
  { id: 'medical_admin', labelBn: 'মেডিকেল প্রশাসন ও প্রধানগণ', labelEn: 'Medical Administration' },
] as const;

export const managementMembers: ManagementMember[] = [
  {
    id: "gov-1",
    name: "আলহাজ্ব মোঃ আনোয়ার হোসেন",
    nameEn: "Alhaj Md. Anwar Hossain",
    role: "চেয়ারম্যান ও প্রতিষ্ঠাতা",
    roleEn: "Chairman & Founder",
    category: "governing",
    categoryLabel: "গভর্নিং বডি",
    categoryLabelEn: "Governing Body",
    qualifications: "এম.এ (ঢাকা বিশ্ববিদ্যালয়), বিশিষ্ট সমাজসেবক ও শিল্পোদ্যোক্তা",
    qualificationsEn: "M.A (Dhaka University), Eminent Philanthropist & Entrepreneur",
    bio: "পলাশ ও নরসিংদী অঞ্চলের সাধারণ মানুষের দোরগোড়ায় বিশ্বমানের ও সাশ্রয়ী চিকিৎসাসেবা পৌঁছে দেয়ার আজীবন ব্রত নিয়ে তিনি আনোয়ারা মেডিকেল কমপ্লেক্স প্রতিষ্ঠা করেন।",
    bioEn: "Founded Anowara Medical Complex with the lifelong mission to bring world-class, affordable healthcare to the doorsteps of people across Palash and Narsingdi.",
    phone: "01712-692504",
    email: "chairman@anowaramedical.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
    message: "আমাদের মূল লক্ষ্য কোনো বাণিজ্যিক লাভ নয়; বরং প্রতিটি রোগীর মুখে স্বস্তির হাসি ফোটানো এবং সৎ ও আন্তরিক সেবা নিশ্চিত করা।",
    messageEn: "Our prime mission is not commercial profit; it is to ensure honest, compassionate healthcare and bring relief to every patient."
  },
  {
    id: "exec-1",
    name: "ডাঃ মোঃ রফিকুল ইসলাম",
    nameEn: "Dr. Md. Rafiqul Islam",
    role: "ব্যবস্থাপনা পরিচালক (MD)",
    roleEn: "Managing Director (MD)",
    category: "executive",
    categoryLabel: "নির্বাহী পরিষদ",
    categoryLabelEn: "Executive Council",
    qualifications: "MBBS (DMC), MPH, M.Phil (Hospital Administration)",
    qualificationsEn: "MBBS (DMC), MPH, M.Phil (Hospital Administration)",
    bio: "২৫ বছরেরও বেশি সময় ধরে শীর্ষস্থানীয় স্বাস্থ্যসেবা প্রতিষ্ঠানে ক্লিনিক্যাল ও ব্যবস্থাপনা পরিচালনার অভিজ্ঞতাসম্পন্ন অভিজ্ঞ চিকিৎসক ও স্বাস্থ্য প্রশাসক।",
    bioEn: "Veteran physician and healthcare administrator with over 25 years of leadership experience in clinical excellence and modern hospital administration.",
    phone: "01712-692504",
    email: "md@anowaramedical.com",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=700&q=80",
    message: "আধুনিক ডিজিটাল ডায়াগনস্টিক এবং সার্বক্ষণিক আন্তরিক সেবা নিশ্চিত করতে আমাদের চিকিৎসক ও স্টাফ টিম প্রতিশ্রুতিবদ্ধ।",
    messageEn: "Our team of doctors and medical staff are wholeheartedly committed to accurate digital diagnosis and 24/7 care."
  },
  {
    id: "exec-2",
    name: "ডাঃ সেলিনা আক্তার",
    nameEn: "Dr. Selina Akhter",
    role: "পরিচালক (ক্লিনিক্যাল সার্ভিসেস)",
    roleEn: "Director (Clinical Services)",
    category: "executive",
    categoryLabel: "নির্বাহী পরিষদ",
    categoryLabelEn: "Executive Council",
    qualifications: "MBBS, BCS, MS (Obs & Gynae), কনসালটেন্ট",
    qualificationsEn: "MBBS, BCS, MS (Obs & Gynae), Senior Consultant",
    bio: "মা ও শিশু স্বাস্থ্য, নিরাপদ প্রসব এবং নারী স্বাস্থ্য ব্যবস্থাপনায় বিশেষ অবদান রেখে আসছেন। হাসপাতালের সব ক্লিনিক্যাল প্রোটোকল তাঁর নির্দেশনায় পরিচালিত হয়।",
    bioEn: "Leads maternal and child healthcare, safe delivery systems, and oversees all clinical quality protocols across inpatient and outpatient departments.",
    phone: "01944-874304",
    email: "clinical.director@anowaramedical.com",
    image: "https://images.unsplash.com/photo-1594824813590-789a5b12cca4?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "gov-2",
    name: "মোঃ দেলোয়ার হোসেন",
    nameEn: "Md. Delwar Hossain",
    role: "পরিচালক (অর্থ ও প্রশাসন)",
    roleEn: "Director (Finance & Administration)",
    category: "governing",
    categoryLabel: "গভর্নিং বডি",
    categoryLabelEn: "Governing Body",
    qualifications: "M.Com (Finance & Accounting, DU), FCA (Fellow)",
    qualificationsEn: "M.Com (Finance & Accounting, DU), FCA (Fellow)",
    bio: "হাসপাতালের আর্থিক স্বচ্ছতা, সরকারি অডিট ও নিয়ন্ত্রণ সংস্থা এবং প্রাতিষ্ঠানিক কমপ্লায়েন্স নিশ্চিতকরণে দায়িত্ব পালন করছেন।",
    bioEn: "Oversees financial governance, institutional audit compliance, and transparent fiscal stewardship for hospital sustainable growth.",
    phone: "01972-692504",
    email: "finance@anowaramedical.com",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "admin-1",
    name: "ব্রিগেডিয়ার জেনারেল (অবঃ) ডাঃ এ. কে. এম. মোস্তফা",
    nameEn: "Brig. Gen. (Retd.) Dr. A.K.M. Mostafa",
    role: "মেডিকেল সুপারিনটেনডেন্ট",
    roleEn: "Medical Superintendent",
    category: "medical_admin",
    categoryLabel: "মেডিকেল প্রশাসন",
    categoryLabelEn: "Medical Administration",
    qualifications: "MBBS, FCPS, M.H.A, প্রাক্তন কমান্ড্যান্ট সম্মিলিত সামরিক হাসপাতাল",
    qualificationsEn: "MBBS, FCPS, M.H.A, Ex-Commandant CMH",
    bio: "শৃঙ্খলা, আন্তর্জাতিক স্বাস্থ্য মানদণ্ড এবং আপসহীন চিকিৎসার গুণগত মান বজায় রাখতে হাসপাতালের দৈনন্দিন সার্বিক চিকিৎসাসেবা তদারকি করেন।",
    bioEn: "Brings extensive military healthcare leadership to guarantee patient safety, clinical protocol discipline, and emergency operational readiness.",
    phone: "01712-692504",
    email: "superintendent@anowaramedical.com",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "exec-3",
    name: "ইঞ্জিঃ কামরুল হাসান",
    nameEn: "Engr. Kamrul Hasan",
    role: "পরিচালক (অপারেশনস ও বায়োমেডিকেল টেকনোলজি)",
    roleEn: "Director (Operations & Biomedical Tech)",
    category: "executive",
    categoryLabel: "নির্বাহী পরিষদ",
    categoryLabelEn: "Executive Council",
    qualifications: "B.Sc Engg (EEE, BUET), M.Sc in Biomedical Engineering",
    qualificationsEn: "B.Sc Engg (EEE, BUET), M.Sc in Biomedical Engineering",
    bio: "হাসপাতালের অত্যাধুনিক ৪ডি আল্ট্রাসাউন্ড, ডিজিটাল এক্স-রে, অটোমেটেড বায়ো-অ্যানালাইজার ও আইটি ইনফাস্ট্রাকচার রক্ষণাবেক্ষণ ও আধুনিকায়নের নেতৃত্ব দিচ্ছেন।",
    bioEn: "Leads medical technology modernization, 4D USG calibration, automated analyzers, and secure hospital management information systems (HMIS).",
    phone: "01944-874304",
    email: "operations@anowaramedical.com",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "admin-2",
    name: "প্রফেসর ডাঃ এস. এম. মিজানুর রহমান",
    nameEn: "Prof. Dr. S.M. Mizanur Rahman",
    role: "প্রধান, প্যাথলজি ও ডায়াগনস্টিক উইং",
    roleEn: "Head of Pathology & Diagnostic Wing",
    category: "medical_admin",
    categoryLabel: "মেডিকেল প্রশাসন",
    categoryLabelEn: "Medical Administration",
    qualifications: "MBBS, M.Phil (Pathology), প্রাক্তন বিভাগীয় প্রধান",
    qualificationsEn: "MBBS, M.Phil (Pathology), Ex-Head of Dept",
    bio: "ডিজিটাল ল্যাবরেটরির টেস্টের নির্ভুলতা ও মাননিয়ন্ত্রণ (QC) নিশ্চিতকরণে সরাসরি তত্ত্বাবধান করেন।",
    bioEn: "Directly oversees diagnostic precision, automated haematology controls, and clinical pathology accuracy benchmarks.",
    phone: "01712-692504",
    email: "lab.director@anowaramedical.com",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "admin-3",
    name: "সিস্টার রেবেকা সুলতানা",
    nameEn: "Sister Rebeka Sultana",
    role: "নার্সিং সুপারিনটেনডেন্ট",
    roleEn: "Nursing Superintendent",
    category: "medical_admin",
    categoryLabel: "মেডিকেল প্রশাসন",
    categoryLabelEn: "Medical Administration",
    qualifications: "B.Sc in Nursing (BSN), Diploma in Critical Care Nursing",
    qualificationsEn: "B.Sc in Nursing (BSN), Diploma in Critical Care Nursing",
    bio: "হাসপাতালের সকল নার্স ও ওয়ার্ড বয়দের প্রশিক্ষণ, ইনডোর বেড কেয়ার এবং রোগীর প্রতি সহানুভূতিশীল সেবা দেখভালের দায়িত্বে নিয়োজিত।",
    bioEn: "Leads the registered nursing cadre, patient bed-side compassion protocols, post-operative care, and ward hygiene management.",
    phone: "01944-874304",
    email: "nursing@anowaramedical.com",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "gov-3",
    name: "ব্যারিস্টার কাজী মইনুল হক",
    nameEn: "Barrister Kazi Moinul Haque",
    role: "আইন উপদেষ্টা ও সদস্য, গভর্নিং বডি",
    roleEn: "Legal Advisor & Governing Board Member",
    category: "governing",
    categoryLabel: "গভর্নিং বডি",
    categoryLabelEn: "Governing Body",
    qualifications: "LL.B (Hons, London), Bar-at-Law (Lincoln's Inn, UK)",
    qualificationsEn: "LL.B (Hons, London), Bar-at-Law (Lincoln's Inn, UK)",
    bio: "হাসপাতালের স্বাস্থ্য নীতিমালা, রোগী সুরক্ষা অধিকার এবং সরকারি বিধিবিধান ও নিবন্ধন কমপ্লায়েন্স সংক্রান্ত আইনি পরামর্শ দিয়ে থাকেন।",
    bioEn: "Provides legal counsel on healthcare regulatory compliance, patient safety rights, and institutional healthcare standards.",
    phone: "01712-692504",
    email: "legal@anowaramedical.com",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=80",
  },
];
