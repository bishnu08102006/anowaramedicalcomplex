export interface HospitalNotice {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
  dateEn: string;
  type: 'urgent' | 'offer' | 'info';
  badge: string;
  badgeEn: string;
}

export const hospitalNotices: HospitalNotice[] = [
  {
    id: "notice-1",
    title: "বিশেষ ফ্রি স্বাস্থ্য ক্যাম্প ও কনসালটেশন",
    titleEn: "Special Free Health Camp & Consultation",
    description: "আগামী শুক্রবার সকাল ৯টা থেকে বিকেল ৪টা পর্যন্ত বিশেষজ্ঞ ডাক্তার দ্বারা ফ্রি রোগী দেখা হবে। ডায়াগনস্টিক টেস্টে পাচ্ছেন ২০% ছাড়! বিস্তারিত জানতে কল করুন: 01712-692504।",
    descriptionEn: "Free medical consultation by senior specialist doctors this upcoming Friday from 9:00 AM to 4:00 PM. Enjoy 20% flat discount on diagnostic tests! Inquiries: 01712-692504.",
    date: "২৫ আগস্ট, ২০২৬",
    dateEn: "25 August, 2026",
    type: "urgent",
    badge: "জরুরি ক্যাম্প",
    badgeEn: "Urgent Camp",
  },
  {
    id: "notice-2",
    title: "ডিজিটাল এক্স-রে ও আল্ট্রাসনোগ্রামে বিশেষ ১৫% ছাড়",
    titleEn: "15% Special Discount on Digital X-Ray & USG",
    description: "চলতি মাসজুড়ে পলাশ ও সংলগ্ন এলাকার রোগীদের জন্য সকল আল্ট্রাসনোগ্রাম ও ডিজিটাল এক্স-রে পরীক্ষায় ১৫% নিশ্চিত ছাড় প্রদান করা হচ্ছে।",
    descriptionEn: "Throughout this month, enjoy guaranteed 15% discount on all 4D Color Ultrasound and Digital X-Ray diagnostics for patients of Palash and surrounding areas.",
    date: "১৮ আগস্ট, ২০২৬",
    dateEn: "18 August, 2026",
    type: "offer",
    badge: "বিশেষ ছাড়",
    badgeEn: "Special Offer",
  },
  {
    id: "notice-3",
    title: "বিদেশগামীদের ওয়ান-স্টপ মেডিকেল চেকআপ সেবা চালু",
    titleEn: "One-Stop Overseas Medical Checkup Service Active",
    description: "মধ্যপ্রাচ্য (সৌদি আরব, কাতার, কুয়েত, ওমান, ইউএই) ও ইউরোপগামী ভাই-বোনদের জন্য আন্তর্জাতিক মানসম্পন্ন দ্রুততম মেডিকেল চেকআপ ও সত্যায়িত রিপোর্ট প্রদান করা হচ্ছে।",
    descriptionEn: "Fast-track, certified comprehensive medical checkup packages for migrant workers and travelers to Middle East (Saudi Arabia, Qatar, UAE, Kuwait, Oman) and Europe.",
    date: "১০ আগস্ট, ২০২৬",
    dateEn: "10 August, 2026",
    type: "info",
    badge: "বিদেশগামী সেবা",
    badgeEn: "Overseas Care",
  },
  {
    id: "notice-4",
    title: "২৪ ঘণ্টা সার্বক্ষণিক জরুরী সেবা ও অ্যাম্বুলেন্স সার্ভিস",
    titleEn: "24/7 Round-the-Clock Emergency & Ambulance Service",
    description: "যেকোনো আকস্মিক দুর্ঘটনা বা গুরুতর অসুস্থতায় আমাদের জরুরী বিভাগ সার্বক্ষণিক খোলা রয়েছে। অক্সিজেন, নেবুলাইজার ও সার্বক্ষণিক বিদ্যুৎ ব্যাকআপ সুবিধা বিদ্যমান।",
    descriptionEn: "Our 24-hour Emergency Department remains open day and night for acute illness, trauma and delivery emergencies. Continuous oxygen and power backup available.",
    date: "০১ আগস্ট, ২০২৬",
    dateEn: "01 August, 2026",
    type: "info",
    badge: "২৪/৭ সার্ভিস",
    badgeEn: "24/7 Service",
  },
];
