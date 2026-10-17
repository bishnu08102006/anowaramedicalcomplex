import type { BlogPost } from '../data/blogs';
import type { Doctor } from '../data/doctors';
import type { ManagementMember } from '../data/management';
import type { HospitalNotice } from '../data/notices';
import type { DiagnosticTest } from '../data/tests';
import type { EmergencyNoticeConfig } from '../context/DataContext';

interface LocalAssistantData {
  doctors: Doctor[];
  diagnosticTests: DiagnosticTest[];
  notices: HospitalNotice[];
  blogs: BlogPost[];
  managementMembers: ManagementMember[];
  emergencyNotice: EmergencyNoticeConfig;
}

const BENGALI_DIGITS = '০১২৩৪৫৬৭৮৯';
const ENGLISH_DIGITS = '0123456789';

const normalize = (value: string) =>
  value
    .toLocaleLowerCase()
    .replace(/[০-৯]/g, (digit) => ENGLISH_DIGITS[BENGALI_DIGITS.indexOf(digit)])
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

const hasAny = (query: string, terms: string[]) =>
  terms.some((term) => {
    const normalizedTerm = normalize(term);
    if (/^[a-z0-9 ]+$/i.test(normalizedTerm)) {
      return ` ${query} `.includes(` ${normalizedTerm} `);
    }
    return query.includes(normalizedTerm);
  });

const isBanglish = (query: string) =>
  /\b(ki|koto|kothay|kivabe|kobe|chai|ase|ache|dorkar|korbo|pabo|dekhte|dekhao|bolen|janan|daktar|nam|naam|somoy|khola|bondho|dam|thikana|kothay|shomoy|koyta|lagbe|pabo|ase|ache)\b/i.test(query);

const STOP_WORDS = new Set([
  'doctor', 'doctors', 'daktar', 'test', 'tests', 'serial', 'schedule', 'chamber',
  'price', 'cost', 'fee', 'list', 'show', 'tell', 'please', 'what', 'when', 'where', 'diagnostic', 'laboratory',
  'the', 'for', 'and', 'with', 'how', 'much', 'my', 'is', 'of', 'in', 'on',
  'koto', 'taka', 'tk', 'kothay', 'kobe', 'boshen', 'ase', 'ache', 'er', 'ke', 'kon',
  'ডাক্তার', 'ডাক্তারদের', 'ডাক্তাররা', 'টেস্ট', 'পরীক্ষা', 'সিরিয়াল', 'সিরিয়াল',
  'শিডিউল', 'চেম্বার', 'তালিকা', 'দেখান', 'বলুন', 'কত', 'কোথায়', 'কোথায়', 'কখন',
]);

const isStopWord = (word: string) =>
  [...STOP_WORDS].some((stopWord) =>
    word === stopWord || (stopWord.length > 3 && word.startsWith(stopWord))
  );

const expandDoctorTerms = (words: string[]) => {
  const expanded = new Set(words);
  const aliases = [
    { terms: ['heart', 'cardiac', 'হৃদরোগ', 'হৃদ', 'hrit', 'হার্ট'], matches: ['cardiology', 'cardio', 'হৃদরোগ', 'হৃদ'] },
    { terms: ['gyne', 'gynae', 'gynecologist', 'গাইনি', 'স্ত্রী', 'প্রসূতি', 'pregnancy'], matches: ['gynaecology', 'gynecology', 'gynae', 'gyn', 'স্ত্রী', 'প্রসূতি'] },
    { terms: ['child', 'children', 'baby', 'শিশু', 'pediatrician', 'paediatrician'], matches: ['pediatrics', 'paediatrics', 'pediatric', 'paediatric', 'শিশু'] },
    { terms: ['bone', 'orthopedic', 'orthopaedic', 'হাড়', 'অর্থোপেডিক'], matches: ['orthopedics', 'orthopaedics', 'orthop', 'হাড়'] },
    { terms: ['skin', 'dermatologist', 'চর্ম', 'chormo'], matches: ['dermatology', 'skin', 'চর্ম', 'chormo'] },
    { terms: ['eye', 'eyes', 'চোখ', 'চক্ষু'], matches: ['ophthalmology', 'ophthalm', 'চক্ষু', 'চোখ'] },
    { terms: ['ear', 'nose', 'throat', 'ent', 'কান', 'নাক', 'গলা'], matches: ['ent', 'কান', 'নাক', 'গলা'] },
  ];
  aliases.forEach(({ terms, matches }) => {
    if (hasAny(words.join(' '), terms)) matches.forEach((term) => expanded.add(normalize(term)));
  });
  return [...expanded].filter((word) => word.length > 2 && !isStopWord(word));
};

const useBangla = (query: string, defaultBangla: boolean) => {
  if (/[\u0980-\u09ff]/.test(query) || isBanglish(query)) return true;
  if (/[a-z]/i.test(query)) return false;
  return defaultBangla;
};

const getDoctorDayNames = (doctor: Doctor, bangla: boolean) => {
  const dayTranslations: Record<string, string> = {
    'রবি': 'Sunday',
    'সোম': 'Monday',
    'মঙ্গল': 'Tuesday',
    'বুধ': 'Wednesday',
    'বৃহঃ': 'Thursday',
    'শুক্র': 'Friday',
    'শনি': 'Saturday',
  };
  return doctor.days
    .map((day) => (bangla ? day : dayTranslations[day] || day))
    .join(', ');
};

const getDoctorSearchTerms = (doctor: Doctor) => {
  const specialty = normalize(`${doctor.specialty} ${doctor.specialtyEn}`);
  const aliases = [
    { terms: ['skin', 'চর্ম', 'chormo', 'dermatology'], matches: ['skin', 'চর্ম', 'chormo', 'dermatology'] },
    { terms: ['heart', 'cardio', 'হৃদ', 'hrit', 'হার্ট'], matches: ['cardio', 'হৃদ', 'hrit'] },
    { terms: ['gynae', 'gyne', 'গাইনি', 'স্ত্রী', 'প্রসূতি', 'pregnan'], matches: ['gyn', 'স্ত্রী', 'প্রসূতি', 'গাইনি'] },
    { terms: ['child', 'baby', 'শিশু', 'pediatric', 'paediatric'], matches: ['pediatric', 'paediatric', 'শিশু'] },
    { terms: ['bone', 'orthop', 'হাড়', 'অর্থোপেডিক'], matches: ['orthop', 'হাড়', 'অর্থোপেডিক'] },
    { terms: ['eye', 'চোখ', 'ophthalm'], matches: ['eye', 'চক্ষু', 'ophthalm'] },
    { terms: ['ent', 'কান', 'নাক', 'গলা'], matches: ['কান', 'নাক', 'গলা', 'ent'] },
    { terms: ['medicine', 'মেডিসিন', 'general physician'], matches: ['medicine', 'মেডিসিন'] },
    { terms: ['surgery', 'সার্জারি', 'অপারেশন'], matches: ['surgery', 'সার্জারি'] },
  ];
  const mapped = aliases
    .filter(({ terms }) => hasAny(specialty, terms))
    .flatMap(({ matches }) => matches);
  return `${normalize(`${doctor.name} ${doctor.nameEn} ${doctor.specialty} ${doctor.specialtyEn}`)} ${mapped.join(' ')}`;
};

const DOCTOR_SPECIALTIES = [
  { query: ['heart', 'cardiac', 'cardiology', 'হৃদ', 'হৃদরোগ', 'hrit', 'হার্ট'], doctor: ['cardiology', 'cardio', 'হৃদরোগ'] },
  { query: ['gyne', 'gynae', 'gynaecology', 'gynecology', 'গাইনি', 'স্ত্রী', 'প্রসূতি', 'pregnancy'], doctor: ['gynaecology', 'gynecology', 'gyn', 'স্ত্রী', 'প্রসূতি', 'গাইনি'] },
  { query: ['child', 'children', 'baby', 'pediatric', 'paediatric', 'শিশু'], doctor: ['pediatric', 'paediatric', 'শিশু'] },
  { query: ['bone', 'orthopedic', 'orthopaedic', 'orthopedics', 'অর্থোপেডিক', 'হাড়'], doctor: ['orthop', 'অর্থোপেডিক', 'হাড়', 'হাড়'] },
  { query: ['skin', 'dermatology', 'dermatologist', 'চর্ম', 'chormo'], doctor: ['skin', 'dermatology', 'চর্ম', 'chormo'] },
  { query: ['eye', 'ophthalmology', 'ophthalmologist', 'চোখ', 'চক্ষু'], doctor: ['eye', 'ophthalm', 'চোখ', 'চক্ষু'] },
  { query: ['ent', 'ear', 'nose', 'throat', 'কান', 'নাক', 'গলা'], doctor: ['ent', 'কান', 'নাক', 'গলা'] },
  { query: ['medicine', 'physician', 'মেডিসিন'], doctor: ['medicine', 'মেডিসিন'] },
  { query: ['surgery', 'surgeon', 'সার্জারি', 'অপারেশন'], doctor: ['surgery', 'surgeon', 'সার্জারি'] },
];

export const findMatchingDoctors = (query: string, doctors: Doctor[]) => {
  const searchQuery = normalize(query);
  const matchingSpecialties = DOCTOR_SPECIALTIES.filter(({ query: terms }) =>
    hasAny(searchQuery, terms)
  );
  if (matchingSpecialties.length) {
    return doctors.filter((doctor) => {
      const searchable = normalize(`${doctor.name} ${doctor.nameEn} ${doctor.specialty} ${doctor.specialtyEn}`);
      const matched = matchingSpecialties.filter(({ doctor: terms }) =>
        terms.some((term) => searchable.includes(normalize(term)))
      );
      return matched.length > 0;
    });
  }

  const words = expandDoctorTerms(searchQuery.split(' '));
  if (!words.length) return doctors;
  const ranked = doctors
    .map((doctor) => {
      const searchable = `${getDoctorSearchTerms(doctor)} ${normalize(getDoctorDayNames(doctor, false))}`;
      const score = words.reduce((total, word) => total + (searchable.includes(word) ? 1 : 0), 0);
      return { doctor, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked.map(({ doctor }) => doctor);
};

const findMatchingTests = (query: string, tests: DiagnosticTest[]) => {
  const searchQuery = normalize(query);
  const words = searchQuery.split(' ').filter((word) => word.length > 2 && !isStopWord(word));
  if (!words.length) return tests;
  return tests
    .map((test) => {
      let searchable = normalize(`${test.name} ${test.banglaName || ''} ${test.category}`);
      const aliases = [
        { terms: ['sugar', 'glucose', 'শর্করা', 'sugar test'], matches: ['glucose', 'blood sugar', 'শর্করা', 'diabetes'] },
        { terms: ['xray', 'x ray', 'এক্সরে', 'এক্স রে'], matches: ['x ray', 'xray', 'এক্স রে'] },
        { terms: ['ultrasound', 'usg', 'আল্ট্রাসনোগ্রাম'], matches: ['ultrasound', 'usg', 'আল্ট্রাসনোগ্রাম'] },
        { terms: ['urine', 'প্রস্রাব', 'মূত্র'], matches: ['urine', 'প্রস্রাব', 'মূত্র'] },
      ];
      aliases.forEach(({ terms, matches }) => {
        if (hasAny(searchQuery, terms)) searchable += ` ${matches.join(' ')}`;
      });
      const score = words.reduce((total, word) => total + (searchable.includes(word) ? 1 : 0), 0);
      return { test, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ test }) => test);
};

export function answerHospitalQuestion(
  rawQuery: string,
  data: LocalAssistantData,
  defaultBangla: boolean,
): string {
  const query = normalize(rawQuery);
  const bangla = useBangla(rawQuery, defaultBangla);
  const labels = bangla
    ? {
        phone: 'যোগাযোগ',
        emergencyContact: 'জরুরি ও রিসেপশন (২৪ ঘণ্টা)',
        serial: 'সিরিয়াল ডেস্ক',
        authority: 'হাসপাতাল কর্তৃপক্ষ',
        appointment: 'অনলাইনে সিরিয়াল নিতে Appointment পেজে রোগীর নাম ও সচল ফোন নম্বর দিয়ে ফর্ম পূরণ করুন; জমা দেওয়ার পর টোকেনটি সংরক্ষণ করুন।',
        noDoctor: 'এই বিষয়ে মিল থাকা ডাক্তার তালিকায় খুঁজে পাইনি। ডাক্তারদের সম্পূর্ণ তালিকা দেখতে /doctors পেজ দেখুন বা সিরিয়াল ডেস্কে যোগাযোগ করুন।',
        noTest: 'এই নামে পরীক্ষা বা ফি তালিকায় খুঁজে পাইনি। Diagnostics পেজ দেখুন অথবা হাসপাতালে ফোন করে বর্তমান ফি নিশ্চিত করুন।',
        unknown: 'আমি এই সাইটের তথ্য থেকে ডাক্তার, পরীক্ষা, সিরিয়াল, যোগাযোগ, সেবা, নোটিশ ও ব্লগ সম্পর্কে সাহায্য করতে পারি। আরেকটু নির্দিষ্ট করে প্রশ্ন করুন, অথবা /contact পেজ দেখুন।',
        emergency: 'জরুরি ও রিসেপশন সেবা ২৪ ঘণ্টা চালু। জরুরি অবস্থায় 01972-692504 নম্বরে কল করুন বা দ্রুত সরাসরি হাসপাতালে যান।',
      }
    : {
        phone: 'Contact',
        emergencyContact: 'Emergency & reception (24/7)',
        serial: 'Serial desk',
        authority: 'Hospital authority',
        appointment: 'To book online, open the Appointment page, enter the patient name and a working phone number, submit the form, and keep the generated token.',
        noDoctor: 'I could not find a matching doctor in the current list. See /doctors for the full directory or contact the serial desk.',
        noTest: 'I could not find this test or fee in the current list. See /diagnostics or call the hospital to confirm the current price.',
        unknown: 'I can help with information on this website about doctors, tests, appointments, contacts, services, notices, and blogs. Please ask a more specific question or visit /contact.',
        emergency: 'Emergency and reception are open 24/7. For urgent help call 01972-692504 or go to the hospital immediately.',
      };

  if (hasAny(query, ['hello', 'hi', 'হ্যালো', 'আসসালামু', 'সালাম', 'good morning', 'good evening'])) {
    return bangla
      ? 'ওয়ালাইকুম আসসালাম! আনোয়ারা মেডিকেল কমপ্লেক্স সম্পর্কে কী জানতে চান? ডাক্তার, টেস্ট, সিরিয়াল বা যোগাযোগের তথ্য জিজ্ঞেস করতে পারেন।'
      : 'Hello! What would you like to know about Anowara Medical Complex? Ask about doctors, tests, appointments, or contact details.';
  }

  if (hasAny(query, ['emergency', 'ambulance', 'জরুরি', 'অ্যাম্বুলেন্স', 'ambulance number'])) {
    return `${labels.emergency}\n\n${labels.phone}:\n- ${labels.emergencyContact}: 01972-692504\n- ${labels.serial}: 01944-874304\n- ${labels.authority}: 01712-692504`;
  }

  if (hasAny(query, ['address', 'location', 'map', 'where', 'find us', 'reach us', 'kothay', 'ঠিকানা', 'কোথায়', 'কোথায়', 'লোকেশন', 'প্লাস কোড'])) {
    return bangla
      ? 'ঠিকানা: ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী। Google Maps Plus Code: XJFQ+H2 Palash। দিকনির্দেশনার জন্য /contact পেজ দেখুন।'
      : 'Address: WAPDA Sadar Road, Medical Mor, Palash, Narsingdi. Google Maps Plus Code: XJFQ+H2 Palash. Visit /contact for directions.';
  }

  if (hasAny(query, ['appointment', 'booking', 'serial', 'সিরিয়াল', 'সিরিয়াল', 'অ্যাপয়েন্টমেন্ট', 'বুকিং', 'token', 'টোকেন'])) {
    return `${labels.appointment}\n\n${labels.serial}: 01944-874304, 01972-692504`;
  }

  if (hasAny(query, ['phone', 'contact', 'number', 'যোগাযোগ', 'ফোন', 'নম্বর', 'হটলাইন'])) {
    return `${labels.phone}:\n- ${labels.emergencyContact}: 01972-692504\n- ${labels.serial}: 01944-874304\n- ${labels.authority}: 01712-692504\n- Email: anowaramedicalcomplex11@gmail.com`;
  }

  if (hasAny(query, ['hour', 'open', 'time', 'সময়', 'সময়', 'খোলা', 'কখন বন্ধ', 'lab'])) {
    return bangla
      ? 'ওপিডি ও জরুরি বিভাগ ২৪ ঘণ্টা চালু। ওয়েবসাইটে ডায়াগনস্টিক ল্যাবের সময় সকাল ৮টা–রাত ১০টা দেওয়া আছে। যাওয়ার আগে নির্দিষ্ট সেবা/ছুটির দিনের সময় 01972-692504 নম্বরে নিশ্চিত করুন।'
      : 'The OPD and emergency department are listed as open 24/7. The diagnostic lab is listed as open 8:00 AM–10:00 PM. Call 01972-692504 to confirm service or holiday hours before visiting.';
  }

  if (hasAny(query, ['doctor', 'daktar', 'ডাক্তার', 'বিশেষজ্ঞ', 'chamber', 'schedule', 'শিডিউল', 'চেম্বার'])) {
    const matches = findMatchingDoctors(query, data.doctors);
    if (matches.length === 0) return labels.noDoctor;
    const selected = matches.slice(0, 8);
    const doctorLines = selected.map((doctor) => {
      const name = bangla ? doctor.name : doctor.nameEn || doctor.name;
      const specialty = bangla ? doctor.specialty : doctor.specialtyEn || doctor.specialty;
      const time = bangla ? doctor.time : doctor.timeEn || doctor.time;
      const room = bangla ? doctor.room : doctor.roomEn || doctor.room;
      return `- ${name} — ${specialty}; ${getDoctorDayNames(doctor, bangla)}; ${time}${room ? `; ${room}` : ''}`;
    });
    return `${bangla ? 'ওয়েবসাইটের বর্তমান ডাক্তার তালিকা:' : 'Current doctor listings:'}\n${doctorLines.join('\n')}\n\n${bangla ? 'সময়সূচি পরিবর্তিত হতে পারে। সিরিয়ালের জন্য' : 'Schedules may change. For booking call'} 01944-874304.`;
  }

  if (hasAny(query, ['test', 'price', 'cost', 'fee', 'পরীক্ষা', 'টেস্ট', 'দাম', 'ফি', 'খরচ'])) {
    const matches = findMatchingTests(query, data.diagnosticTests);
    if (matches.length === 0) return labels.noTest;
    return `${bangla ? 'ওয়েবসাইটের বর্তমান টেস্ট তালিকা:' : 'Current test listings:'}\n${matches.slice(0, 10).map((test) => {
      const name = bangla ? test.banglaName || test.name : test.name;
      const price = bangla ? test.price : test.priceEn || test.price;
      const turnaround = bangla ? test.deliveryTime : test.deliveryTimeEn || test.deliveryTime;
      return `- ${name}: ${price}; ${bangla ? 'রিপোর্ট' : 'report'} ${turnaround}; ${test.fastingRequired ? (bangla ? 'খালি পেটে করতে হবে' : 'fasting required') : (bangla ? 'খালি পেটের দরকার নেই' : 'no fasting required')}`;
    }).join('\n')}\n\n${bangla ? 'ফি পরিবর্তিত হতে পারে; যাওয়ার আগে নিশ্চিত করুন।' : 'Fees may change; please confirm before visiting.'}`;
  }

  if (hasAny(query, ['notice', 'offer', 'campaign', 'নোটিশ', 'অফার', 'ছাড়', 'ছাড়'])) {
    const notices = data.notices.slice(0, 5);
    const emergencyText = data.emergencyNotice.enabled
      ? `${bangla ? data.emergencyNotice.textBn : data.emergencyNotice.textEn}\n`
      : '';
    if (!notices.length && !emergencyText) return bangla ? 'বর্তমানে কোনো নোটিশ তালিকাভুক্ত নেই।' : 'There are no notices currently listed.';
    const noticeText = notices.map((notice) =>
      `- ${bangla ? notice.title : notice.titleEn}: ${bangla ? notice.description : notice.descriptionEn}`
    ).join('\n');
    return `${bangla ? 'ওয়েবসাইটের নোটিশ:' : 'Website notices:'}\n${emergencyText}${noticeText}\n\n${bangla ? 'বিস্তারিত /notices পেজে দেখুন।' : 'See /notices for details.'}`;
  }

  if (hasAny(query, ['blog', 'article', 'health tip', 'ব্লগ', 'স্বাস্থ্য পরামর্শ', 'প্রবন্ধ'])) {
    const matches = data.blogs.slice(0, 5);
    if (!matches.length) return bangla ? 'বর্তমানে কোনো ব্লগ লেখা তালিকাভুক্ত নেই।' : 'There are no blog articles currently listed.';
    return `${bangla ? 'ওয়েবসাইটের স্বাস্থ্যবিষয়ক লেখা:' : 'Health articles on the website:'}\n${matches.map((blog) =>
      `- ${bangla ? blog.title : blog.titleEn}: ${bangla ? blog.summary : blog.summaryEn}`
    ).join('\n')}\n\n${bangla ? 'সম্পূর্ণ লেখা /blog পেজে দেখুন।' : 'Read the full articles at /blog.'}`;
  }

  if (hasAny(query, ['service', 'facility', 'সেবা', 'সুবিধা', 'চিকিৎসা'])) {
    return bangla
      ? 'ওয়েবসাইটে তালিকাভুক্ত সেবার মধ্যে ২৪ ঘণ্টা জরুরি বিভাগ, অ্যাম্বুলেন্স, ইনডোর/আউটডোর, বিশেষজ্ঞ ডাক্তার, প্যাথলজি, ৪ডি আল্ট্রাসনোগ্রাম, ডিজিটাল এক্স-রে, ইসিজি, অপারেশন থিয়েটার, মাতৃ ও শিশু সেবা রয়েছে। নির্দিষ্ট সেবা ও সময় জানতে /services পেজ দেখুন বা 01972-692504 নম্বরে কল করুন।'
      : 'Website-listed services include 24/7 emergency care, ambulance, inpatient/outpatient care, specialist doctors, pathology, 4D ultrasound, digital X-ray, ECG, operation theatre, and maternal and child care. See /services or call 01972-692504 to confirm a specific service and schedule.';
  }

  if (hasAny(query, ['management', 'chairman', 'founder', 'committee', 'পরিচালনা', 'চেয়ারম্যান', 'চেয়ারম্যান', 'প্রতিষ্ঠাতা', 'কর্তৃপক্ষ'])) {
    const words = query.split(' ').filter((word) => word.length > 2 && !isStopWord(word));
    const matches = data.managementMembers
      .map((member) => {
        const searchable = normalize(`${member.name} ${member.nameEn} ${member.role} ${member.roleEn} ${member.categoryLabel} ${member.categoryLabelEn}`);
        return { member, score: words.filter((word) => searchable.includes(word)).length };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    if (!matches.length) {
      return bangla
        ? 'পরিচালনা পর্ষদ ও কর্তৃপক্ষের প্রকাশিত তথ্য /management পেজে দেখুন।'
        : 'See the public leadership directory at /management.';
    }
    return `${bangla ? 'প্রকাশিত পরিচালনা পর্ষদের তথ্য:' : 'Public management information:'}\n${matches.map(({ member }) =>
      `- ${bangla ? member.name : member.nameEn}: ${bangla ? member.role : member.roleEn}`
    ).join('\n')}`;
  }

  if (hasAny(query, ['gallery', 'photo', 'picture', 'গ্যালারি', 'ছবি'])) {
    return bangla
      ? 'হাসপাতালের প্রকাশিত ছবি ও কার্যক্রম /gallery পেজে দেখতে পারবেন।'
      : 'See the hospital photo and activity gallery at /gallery.';
  }

  if (hasAny(query, ['qr', 'qr code', 'কিউআর', 'স্ক্যান'])) {
    return bangla
      ? 'হাসপাতালের QR কোড ও ডাউনলোড /qr-codes পেজে পাবেন। কর্মী পরিচয়পত্র যাচাই করতে /verify-staff পেজে QR স্ক্যান করুন।'
      : 'Find hospital QR codes and downloads at /qr-codes. To verify a staff ID, scan its QR code on /verify-staff.';
  }

  if (hasAny(query, ['staff verification', 'verify staff', 'কর্মী যাচাই', 'স্টাফ যাচাই'])) {
    return bangla
      ? 'কর্মী পরিচয়পত্র যাচাই করতে /verify-staff পেজে গিয়ে যাচাইকরণ আইডি লিখুন বা QR কোড স্ক্যান করুন।'
      : 'To verify a staff ID, visit /verify-staff and enter the verification ID or scan its QR code.';
  }

  if (hasAny(query, ['symptom', 'sick', 'medicine', 'treatment', 'রোগ', 'লক্ষণ', 'ওষুধ', 'চিকিৎসা'])) {
    return bangla
      ? 'এই স্থানীয় সহায়ক ব্যক্তিগত রোগ নির্ণয় বা ওষুধের পরামর্শ দিতে পারে না। ব্যক্তিগত সমস্যার জন্য চিকিৎসকের সঙ্গে যোগাযোগ করুন। জরুরি অবস্থায় 01972-692504 নম্বরে কল করুন বা সরাসরি হাসপাতালে যান।'
      : 'This local assistant cannot diagnose a condition or recommend medicine. Please consult a clinician for personal medical advice. For emergencies call 01972-692504 or go to the hospital.';
  }

  return labels.unknown;
}
