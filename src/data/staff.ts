export interface StaffMember {
  id: string;
  staffId: string;
  name: string;
  nameEn: string;
  designation: string;
  designationEn: string;
  department: string;
  departmentEn: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  emergencyContact?: string;
  email?: string;
  joinDate: string;
  validUntil: string;
  photoUrl: string;
  nationalId?: string;
  status: 'active' | 'on_leave' | 'resigned';
  address?: string;
  createdAt: number;
}

export const initialStaffMembers: StaffMember[] = [
  {
    id: "staff-101",
    staffId: "AMC-EMP-1001",
    name: "ডাঃ মোঃ রফিকুল ইসলাম",
    nameEn: "Dr. Md. Rafiqul Islam",
    designation: "ব্যবস্থাপনা পরিচালক ও চিফ কনসালটেন্ট",
    designationEn: "Managing Director & Chief Consultant",
    department: "মেডিকেল প্রশাসন ও ওপিডি",
    departmentEn: "Medical Administration & OPD",
    bloodGroup: "B+",
    phone: "01712-692504",
    emergencyContact: "01712-692504",
    email: "md@anowaramedical.com",
    joinDate: "01 Jan 2022",
    validUntil: "31 Dec 2028",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=700&q=80",
    nationalId: "1982671234509",
    status: "active",
    address: "পলাশ, নরসিংদী",
    createdAt: 1704067200000
  },
  {
    id: "staff-102",
    staffId: "AMC-EMP-1002",
    name: "ডাঃ সেলিনা আক্তার",
    nameEn: "Dr. Selina Akhter",
    designation: "পরিচালক (ক্লিনিক্যাল সার্ভিসেস) ও গাইনী বিশেষজ্ঞ",
    designationEn: "Director (Clinical) & Gynecologist",
    department: "প্রসূতি ও স্ত্রীরোগ বিভাগ",
    departmentEn: "Obstetrics & Gynecology",
    bloodGroup: "O+",
    phone: "01944-874304",
    emergencyContact: "01712-692504",
    email: "clinical.director@anowaramedical.com",
    joinDate: "15 Mar 2022",
    validUntil: "31 Dec 2028",
    photoUrl: "https://images.unsplash.com/photo-1594824813590-789a5b12cca4?auto=format&fit=crop&w=700&q=80",
    nationalId: "1985671239845",
    status: "active",
    address: "ঘোড়াশাল, নরসিংদী",
    createdAt: 1710460800000
  },
  {
    id: "staff-103",
    staffId: "AMC-EMP-1003",
    name: "সিস্টার রেবেকা সুলতানা",
    nameEn: "Sister Rebeka Sultana",
    designation: "নার্সিং সুপারিনটেনডেন্ট",
    designationEn: "Nursing Superintendent",
    department: "নার্সিং ও ইনডোর পেশেন্ট কেয়ার",
    departmentEn: "Nursing & Inpatient Care",
    bloodGroup: "A+",
    phone: "01712-445566",
    emergencyContact: "01712-692504",
    email: "nursing@anowaramedical.com",
    joinDate: "10 Jun 2022",
    validUntil: "31 Dec 2027",
    photoUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=700&q=80",
    nationalId: "1989671238491",
    status: "active",
    address: "মেডিকেল মোড়, পলাশ",
    createdAt: 1717977600000
  },
  {
    id: "staff-104",
    staffId: "AMC-EMP-1004",
    name: "মোহাম্মদ তারেক হোসেন",
    nameEn: "Mohammad Tareq Hossain",
    designation: "সিনিয়র মেডিকেল ল্যাব টেকনোলজিস্ট",
    designationEn: "Senior Medical Lab Technologist",
    department: "প্যাথলজি ও বায়োকেমিস্ট্রি ল্যাব",
    departmentEn: "Pathology & Clinical Lab",
    bloodGroup: "AB+",
    phone: "01819-223344",
    emergencyContact: "01712-692504",
    email: "lab.tareq@anowaramedical.com",
    joinDate: "01 Sep 2022",
    validUntil: "31 Dec 2027",
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=700&q=80",
    nationalId: "1991671238712",
    status: "active",
    address: "ওয়াপদা রোড, পলাশ",
    createdAt: 1725148800000
  },
  {
    id: "staff-105",
    staffId: "AMC-EMP-1005",
    name: "আফসানা মিমি",
    nameEn: "Afsana Mimi",
    designation: "সিনিয়র স্টাফ নার্স (ওটি ও জরুরি)",
    designationEn: "Senior Staff Nurse (OT & Emergency)",
    department: "অপারেশন থিয়েটার ও ইমার্জেন্সি",
    departmentEn: "Operation Theater & ER",
    bloodGroup: "B+",
    phone: "01911-334477",
    emergencyContact: "01712-692504",
    email: "mimi.nurse@anowaramedical.com",
    joinDate: "15 Jan 2023",
    validUntil: "31 Dec 2027",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=80",
    nationalId: "1994671234910",
    status: "active",
    address: "পলাশ বাসস্ট্যান্ড",
    createdAt: 1736899200000
  },
  {
    id: "staff-106",
    staffId: "AMC-EMP-1006",
    name: "মোঃ তানভীর হাসান",
    nameEn: "Md. Tanvir Hasan",
    designation: "রেডিওলজি ও ডিজিটাল এক্স-রে টেকনিশিয়ান",
    designationEn: "Radiology & Digital X-Ray Tech",
    department: "রেডিওলজি ও ইমেজিং উইং",
    departmentEn: "Radiology & Imaging Wing",
    bloodGroup: "O-",
    phone: "01612-998877",
    emergencyContact: "01712-692504",
    email: "xray@anowaramedical.com",
    joinDate: "01 Mar 2023",
    validUntil: "31 Dec 2027",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
    nationalId: "1992671239912",
    status: "active",
    address: "নরসিংদী সদর",
    createdAt: 1740787200000
  },
  {
    id: "staff-107",
    staffId: "AMC-EMP-1007",
    name: "মাহমুদা শারমিন",
    nameEn: "Mahmuda Sharmin",
    designation: "প্রধান রিসেপশনিস্ট ও কাস্টমার কেয়ার",
    designationEn: "Chief Receptionist & Patient Care",
    department: "ফ্রন্ট ডেস্ক ও রোগী সমন্বয়",
    departmentEn: "Front Desk & Patient Relations",
    bloodGroup: "A-",
    phone: "01715-778899",
    emergencyContact: "01712-692504",
    email: "reception@anowaramedical.com",
    joinDate: "01 May 2023",
    validUntil: "31 Dec 2027",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80",
    nationalId: "1995671230123",
    status: "active",
    address: "পলাশ বাজার রোড",
    createdAt: 1746057600000
  }
];
