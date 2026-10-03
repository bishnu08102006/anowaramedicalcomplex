export interface BlogPost {
  id: string;
  title: string;
  titleEn: string;
  author: string;
  authorEn: string;
  category: string;
  categoryEn: string;
  date: string;
  dateEn: string;
  readTime: string;
  readTimeEn: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  tags: string[];
}

export const initialBlogsData: BlogPost[] = [
  {
    id: "blog-1",
    title: "বিদেশগামী কর্মীদের মেডিকেল চেক-আপ এর নিয়মাবলী ও প্রস্তুতি",
    titleEn: "Guidelines and Preparation for Overseas Migrant Medical Checkups",
    author: "ডাঃ মোঃ নাজমুল হুদা",
    authorEn: "Dr. Md. Nazmul Huda",
    category: "বিদেশগামী স্বাস্থ্য",
    categoryEn: "Overseas Health",
    date: "০৫ সেপ্টেম্বর, ২০২৬",
    dateEn: "05 September, 2026",
    readTime: "৪ মিনিট",
    readTimeEn: "4 min read",
    summary: "মধ্যপ্রাচ্য বা ইউরোপে যাওয়ার পূর্বে গামকা (GAMCA) ও DIFE অনুমোদিত মেডিকেল টেস্টের জন্য কী কী প্রস্তুতি নেওয়া জরুরি তা জেনে নিন।",
    summaryEn: "Learn about the vital preparation, fasting guidelines, and document requirements for overseas employment health certification.",
    content: `বিদেশগামী কর্মীদের জন্য সঠিক ও নির্ভরযোগ্য মেডিকেল চেক-আপ অত্যন্ত গুরুত্বপূর্ণ একটি ধাপ। আনোয়ারা মেডিকেল কমপ্লেক্স DIFE নিবন্ধিত একটি বিশ্বস্ত প্রতিষ্ঠান, যেখানে নির্ধারিত আন্তর্জাতিক প্রটোকল মেনে টেস্ট পরিচালনা করা হয়।

১. টেস্টের আগের রাতের প্রস্তুতি:
রক্তের বিভিন্ন টেস্ট যেমন সুগার, সিরাম ক্রিয়েটিনিন এবং লিপিড প্রোফাইলের জন্য টেস্টের আগের রাতে ৮-১০ ঘণ্টা সাধারণ পানি ছাড়া অন্য কিছু খাওয়া থেকে বিরত থাকুন। পর্যাপ্ত ঘুম নিশ্চিত করুন।

২. প্রয়োজনীয় কাগজপত্র:
মূল পাসপোর্ট, পাসপোর্টের ফটোকপি, সাম্প্রতিক পাসপোর্ট সাইজ রঙিন ছবি এবং ভিসার প্রাসঙ্গিক নথিপত্র সঙ্গে নিয়ে আসবেন।

৩. প্রধান পরীক্ষাগুলো:
বুকের ডিজিটাল এক্স-রে (টিবি ও ফুসফুস পরীক্ষা), রক্তের স্ক্রিনিং (এইচআইভি, হেপাটাইটিস বি ও সি, ম্যালেরিয়া ইত্যাদি), প্রস্রাবের ড্রাগ ও রুটিন টেস্ট এবং রক্তচাপ ও দৃষ্টিশক্তি পরীক্ষা।

কোনো ভুল রিপোর্ট যেন না আসে সেজন্য পরীক্ষার আগে ধূমপান ও অতিরিক্ত ক্যাফেইন পরিহার করার পরামর্শ দেওয়া হয়। আনোয়ারা মেডিকেল কমপ্লেক্সে আপনি পাবেন সম্পূর্ণ কম্পিউটারাইজড স্বচ্ছ রিপোর্ট।`,
    contentEn: `Medical examination is a decisive stage for citizens traveling abroad for work or residency. Anowara Medical Complex is a recognized diagnostic facility adhering to global health guidelines.

1. Pre-test Fasting:
Maintain 8-10 hours of fasting (only plain water permitted) prior to blood tests for accurate lipid, fasting sugar and renal profile assessments. Ensure proper rest the night before.

2. Essential Documentation:
Bring your original passport, passport photo copies, recent color photos, and job contract documents.

3. Standard Test Battery:
Digital chest X-ray for pulmonary clearance, viral screening (HIV, Hepatitis B & C), comprehensive urine drug & routine analysis, baseline blood pressure, and visual acuity.

Anowara Medical Complex guarantees fully automated, tamper-proof reporting with utmost precision.`,
    tags: ["মেডিকেল", "বিদেশগামী", "GAMCA", "চেকআপ"]
  },
  {
    id: "blog-2",
    title: "উচ্চ রক্তচাপ ও ডায়াবেটিস নিয়ন্ত্রণে দৈনন্দিন কিছু অভ্যাস",
    titleEn: "Daily Habits to Keep Hypertension & Diabetes in Control",
    author: "ডাঃ মোঃ আব্দুল মোতালিব (হৃদরোগ বিশেষজ্ঞ)",
    authorEn: "Dr. Md. Abdul Motalib (Cardiologist)",
    category: "হৃদরোগ ও মেডিসিন",
    categoryEn: "Cardiology & Medicine",
    date: "২৮ আগস্ট, ২০২৬",
    dateEn: "28 August, 2026",
    readTime: "৫ মিনিট",
    readTimeEn: "5 min read",
    summary: "নীরব ঘাতক উচ্চ রক্তচাপ ও অনিয়ন্ত্রিত ডায়াবেটিস থেকে হার্ট ও কিডনি সুরক্ষিত রাখতে নিয়মিত চেক-আপের বিকল্প নেই।",
    summaryEn: "Essential daily lifestyle tips, dietary control, and diagnostic monitoring to protect your heart and kidneys.",
    content: `বর্তমানে আমাদের সমাজে উচ্চ রক্তচাপ ও ডায়াবেটিসের প্রকোপ আশঙ্কাজনকভাবে বৃদ্ধি পাচ্ছে। অনেক সময় কোনো দৃশ্যমান উপসর্গ ছাড়াই এগুলো শরীরের গুরুত্বপূর্ণ অঙ্গসমূহ ক্ষতিগ্রস্ত করে ফেলে।

দৈনন্দিন করণীয়:
১. কাঁচা লবণ সম্পূর্ণ পরিহার করুন এবং রান্নায় তেলের পরিমাণ কমিয়ে আনুন।
২. প্রতিদিন কমপক্ষে ৩০-৪০ মিনিট মাঝারি গতিতে হাঁটাহাঁটি করুন।
৩. মিষ্টিজাতীয় খাবার, কোমল পানীয় ও প্রক্রিয়াজাত ফাস্টফুড বর্জন করুন।
৪. মানসিক চাপমুক্ত থাকার চেষ্টা করুন এবং ধূমপান পরিহার করুন।

কখন ডাক্তারের শরণাপন্ন হবেন:
মাথা ঘোরানো, বুক ধড়ফড় করা, ঘাড় ব্যথা বা অতিরিক্ত তৃষ্ণা পেলে অবিলম্বে রক্তচাপ ও রক্তের গ্লুকোজ পরীক্ষা করান। আনোয়ারা মেডিকেল কমপ্লেক্সে প্রতিদিন সকালে ডায়াবেটিক প্রোফাইল ও ইসিজি সুবিধা রয়েছে।`,
    contentEn: `Hypertension and diabetes are known as silent killers because they frequently cause structural organ damage without prominent early warnings.

Key Daily Habits:
1. Eliminate added table salt and restrict saturated fats in cooking.
2. Maintain at least 30-40 minutes of brisk physical activity daily.
3. Completely avoid refined carbohydrates, sugary beverages, and processed meals.
4. Manage chronic mental stress and abstain from tobacco products.

Periodic clinical monitoring of HbA1c, lipid profile, and serum creatinine at Anowara Medical Complex ensures early detection and long-term cardiac protection.`,
    tags: ["হৃদরোগ", "ডায়াবেটিস", "স্বাস্থ্য টিপস"]
  },
  {
    id: "blog-3",
    title: "গর্ভাবস্থায় নিয়মিত আল্ট্রাসনোগ্রাম ও অ্যান্টি-ন্যাটাল কেয়ার",
    titleEn: "Importance of Regular Ultrasound and Antenatal Care During Pregnancy",
    author: "ডাঃ রওশন জাহান (গাইনী বিশেষজ্ঞ)",
    authorEn: "Dr. Rowshan Jahan (Gynecologist)",
    category: "মাতৃ ও শিশু স্বাস্থ্য",
    categoryEn: "Maternal & Child Care",
    date: "১৫ আগস্ট, ২০২৬",
    dateEn: "15 August, 2026",
    readTime: "৪ মিনিট",
    readTimeEn: "4 min read",
    summary: "মা ও গর্ভস্থ সন্তানের সুস্থতা নিশ্চিতে গর্ভাবস্থায় কয়টি আল্ট্রাসাউন্ড প্রয়োজন এবং সাধারণ সতর্কতা কী কী।",
    summaryEn: "Understanding prenatal checkup schedules, 4D ultrasound scans, and essential maternal nutrition.",
    content: `একটি সুস্থ নবজাতকের জন্মের জন্য গর্ভাবস্থার প্রথম দিন থেকেই নিয়মিত পরিচর্যা ও বিশেষজ্ঞ চিকিৎসকের পরামর্শ নেওয়া আবশ্যক।

কখন আল্ট্রাসনোগ্রাম জরুরি:
১. প্রথম ট্রাইমেস্টার (৬-১০ সপ্তাহ): গর্ভধারণের সঠিক স্থান এবং বাচ্চার হৃদস্পন্দন নিশ্চিত করতে।
২. দ্বিতীয় ট্রাইমেস্টার (১৮-২২ সপ্তাহ): বাচ্চার শারীরিক গঠন ও কোনো জন্মগত ত্রুটি আছে কি না তা বিশদভাবে দেখার জন্য (অ্যানোমালি স্ক্যান)।
৩. তৃতীয় ট্রাইমেস্টার (৩২-৩৬ সপ্তাহ): বাচ্চার বৃদ্ধি, নাভির অবস্থান ও অ্যামনিওটিক ফ্লুইডের পরিমাণ যাচাই করতে।

আমাদের হাসপাতালে অত্যাধুনিক ৪ডি কালার ডপলার আল্ট্রাসনোগ্রাম মেশিনের মাধ্যমে অভিজ্ঞ সোনোলজিস্ট দ্বারা নিখুঁত রিপোর্ট প্রদান করা হয়। এছাড়া নরমাল ডেলিভারি ও জরুরি সিজারিয়ান সেকশনের জন্য রয়েছে সম্পূর্ণ নিরাপদ ওটি।`,
    contentEn: `Regular antenatal monitoring from early conception is critical for maternal well-being and fetal development.

Key Ultrasound Milestones:
1. First Trimester (6-10 weeks): Confirms gestational sac location, viability, and cardiac activity.
2. Second Trimester (18-22 weeks): Detailed structural anomaly scan for fetal organs and anatomy.
3. Third Trimester (32-36 weeks): Assesses fetal biometry, placenta location, and amniotic fluid volume.

Anowara Medical Complex features state-of-the-art 4D Doppler ultrasonography and full maternity support.`,
    tags: ["গাইনী", "আল্ট্রাসনোগ্রাম", "মাতৃস্বাস্থ্য"]
  },
  {
    id: "blog-4",
    title: "অটোমেটেড প্যাথলজি ও ডিজিটাল এক্স-রে: সঠিক রোগ নির্ণয়ের চাবিকাঠি",
    titleEn: "Automated Pathology & Digital X-Ray: Pillars of Accurate Diagnostics",
    author: "মেডিকেল টেকনোলজি বিভাগ",
    authorEn: "Department of Medical Technology",
    category: "ডায়াগনস্টিক তথ্য",
    categoryEn: "Diagnostic Technology",
    date: "০১ আগস্ট, ২০২৬",
    dateEn: "01 August, 2026",
    readTime: "৩ মিনিট",
    readTimeEn: "3 min read",
    summary: "কেন আধুনিক অটোমেটেড অ্যানালাইজারে টেস্ট করানো প্রয়োজন এবং ম্যানুয়াল পরীক্ষার চেয়ে ডিজিটাল রিপোর্টের শ্রেষ্ঠত্ব।",
    summaryEn: "Why automated hematology, biochemistry, and high-frequency digital radiography deliver reliable treatment guidance.",
    content: `চিকিৎসকের সঠিক ব্যবস্থাপত্র প্রদানের মূল ভিত্তি হলো নির্ভুল ডায়াগনস্টিক রিপোর্ট। আধুনিক প্রযুক্তির ছোঁয়ায় ল্যাবরেটরি মেডিসিনে এসেছে বৈপ্লবিক পরিবর্তন।

অটোমেটেড প্যাথলজির সুবিধাসমূহ:
- মানুষের হাতের অনিচ্ছাকৃত ত্রুটি (Human Error) শূন্যের কোঠায় নেমে আসে।
- রক্তকণিকার গণনা (CBC) ও রক্তের রাসায়নিক উপাদানের মান পাওয়া যায় অত্যন্ত দ্রুত ও নিখুঁতভাবে।
- ডিজিটাল এক্স-রেতে রেডিয়েশনের মাত্রা অনেক কম থাকে এবং টিস্যুর পরিষ্কার ইমেজ তৈরি হয়।

আনোয়ারা মেডিকেল কমপ্লেক্সে জাপান ও জার্মানির তৈরি শীর্ষ ব্র্যান্ডের অ্যানালাইজারে প্রতিটি টেস্ট কঠোর মাননিয়ন্ত্রণ বজায় রেখে সম্পন্ন করা হয়।`,
    contentEn: `Accurate diagnostic reports are the foundational backbone of modern clinical management. 

Benefits of Modern Automation:
- Minimizes subjective human error to virtually zero.
- Automated hematology counters and clinical chemistry systems deliver rapid, reproducible data.
- High-frequency digital radiography lowers radiation exposure while producing razor-sharp imaging.

Our diagnostics laboratory upholds strict quality control and calibrated reference standards.`,
    tags: ["প্যাথলজি", "এক্স-রে", "ল্যাবরেটরি"]
  }
];
