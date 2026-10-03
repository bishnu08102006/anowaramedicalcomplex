import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'bn' | 'en';

export interface Translations {
  // Navigation
  nav_home: string;
  nav_doctors: string;
  nav_diagnostics: string;
  nav_services: string;
  nav_gallery: string;
  nav_blog: string;
  nav_appointment: string;
  nav_notices: string;
  nav_contact: string;
  nav_management: string;
  nav_receptionist: string;
  nav_admin: string;
  nav_install: string;
  
  // Header
  brand_title: string;
  brand_subtitle: string;
  call_direct: string;
  menu_open: string;
  menu_close: string;
  hotline_label: string;

  // Common
  search_placeholder: string;
  clear: string;
  book_serial: string;
  call_now: string;
  emergency_24hr: string;
  view_details: string;
  home_breadcrumb: string;

  // Marquee
  marquee_prefix: string;
  marquee_text: string;

  // Hero
  hero_badge: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_desc: string;
  hero_cta_serial: string;
  hero_cta_doctor: string;
  hero_cta_tests: string;
  hero_stat_doctors: string;
  hero_stat_doctors_sub: string;
  hero_stat_emergency: string;
  hero_stat_emergency_sub: string;
  hero_stat_lab: string;
  hero_stat_lab_sub: string;
  hero_hotline_title: string;

  // Doctor Schedule
  doc_page_title: string;
  doc_page_subtitle: string;
  doc_select_day: string;
  doc_all_specialties: string;
  doc_search_placeholder: string;
  doc_visiting_hours: string;
  doc_book_btn: string;
  doc_no_doctors: string;
  doc_no_doctors_sub: string;
  doc_emergency_call: string;

  // Diagnostics & Pricing
  test_page_title: string;
  test_page_subtitle: string;
  test_search_placeholder: string;
  test_tab_all: string;
  test_tab_pathology: string;
  test_tab_imaging: string;
  test_th_name: string;
  test_th_category: string;
  test_th_delivery: string;
  test_th_price: string;
  test_fasting_tag: string;
  test_disclaimer: string;
  test_not_found: string;

  // Services
  services_page_title: string;
  services_page_subtitle: string;
  services_diag_title: string;
  services_surgery_title: string;
  services_emergency_title: string;
  services_emergency_badge: string;
  services_pricing_link: string;
  services_doctor_link: string;

  // Gallery
  gallery_page_title: string;
  gallery_page_subtitle: string;
  gallery_zoom: string;
  gallery_close: string;

  // Appointment
  appt_page_title: string;
  appt_page_subtitle: string;
  appt_info_desc: string;
  appt_call_card_title: string;
  appt_email_card_title: string;
  appt_notice_urgent: string;
  appt_name_label: string;
  appt_phone_label: string;
  appt_doctor_label: string;
  appt_date_label: string;
  appt_time_label: string;
  appt_notes_label: string;
  appt_submit_btn: string;
  appt_success_title: string;
  appt_success_desc: string;
  appt_token_code: string;
  appt_copy_code: string;
  appt_copied: string;
  appt_book_another: string;
  appt_general_doc: string;

  // Notices
  notices_page_title: string;
  notices_page_subtitle: string;
  notices_all: string;
  notices_urgent: string;
  notices_offers: string;
  notices_info: string;

  // Contact
  contact_page_title: string;
  contact_page_subtitle: string;
  contact_address_title: string;
  contact_address_value: string;
  contact_phone_title: string;
  contact_email_title: string;
  contact_directions_btn: string;
  contact_tour_title: string;
  contact_tour_subtitle: string;
  contact_hours_title: string;
  contact_hours_value: string;

  // Footer
  footer_desc: string;
  footer_dife_badge: string;
  footer_rights: string;
}

const translations: Record<Language, Translations> = {
  bn: {
    // Navigation
    nav_home: 'হোম',
    nav_doctors: 'ডাক্তার সময়সূচী',
    nav_diagnostics: 'পরীক্ষা ও ফি',
    nav_services: 'সেবাসমূহ',
    nav_gallery: 'গ্যালারি',
    nav_blog: 'ব্লগ ও স্বাস্থ্যবার্তা',
    nav_appointment: 'সিরিয়াল বুকিং',
    nav_notices: 'নোটিশ বোর্ড',
    nav_contact: 'যোগাযোগ ও লোকেশন',
    nav_management: 'পরিচালনা পরিষদ',
    nav_receptionist: 'রিসেপশনিস্ট লগইন',
    nav_admin: 'অ্যাডমিন লগইন',
    nav_install: 'ডিভাইসে অ্যাপ ইনস্টল করুন',

    // Header
    brand_title: 'আনোয়ারা মেডিকেল কমপ্লেক্স',
    brand_subtitle: 'পলাশ, নরসিংদী',
    call_direct: 'সরাসরি কল করুন',
    menu_open: 'মেনু খুলুন',
    menu_close: 'মেনু বন্ধ করুন',
    hotline_label: 'জরুরী হটলাইন:',

    // Common
    search_placeholder: 'অনুসন্ধান করুন...',
    clear: 'মুছুন',
    book_serial: 'সিরিয়াল নিন',
    call_now: 'কল করুন',
    emergency_24hr: '২৪ ঘণ্টা জরুরী সেবা',
    view_details: 'বিস্তারিত দেখুন',
    home_breadcrumb: 'হোম',

    // Marquee
    marquee_prefix: 'জরুরি নোটিশ:',
    marquee_text: 'আগামী শুক্রবার বিশেষ ফ্রি স্বাস্থ্য ক্যাম্প ও বিশেষজ্ঞ কনসালটেশন অনুষ্ঠিত হবে | সকল ডিজিটাল টেস্টে ২০% ছাড়! | বিদেশগামীদের ওয়ান-স্টপ মেডিকেল চেকআপ চালু রয়েছে | রিসেপশন: 01972-692504 | সিরিয়াল: 01944-874304',

    // Hero
    hero_badge: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার (DIFE) নিবন্ধিত ডায়াগনস্টিক ও ক্লিনিক',
    hero_title_1: 'পলাশে আধুনিক চিকিৎসাসেবা ও',
    hero_title_2: 'নির্ভুল ডিজিটাল ডায়াগনস্টিক',
    hero_desc: 'অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকবৃন্দ, সার্বক্ষণিক ২৪ ঘণ্টা ইনডোর-আউটডোর জরুরী চিকিৎসা, অত্যাধুনিক ৪ডি কালার ডপলার ও স্বয়ংক্রিয় প্যাথলজি ল্যাব এখন আপনার হাতের নাগালে।',
    hero_cta_serial: 'অনলাইনে সিরিয়াল নিন',
    hero_cta_doctor: 'ডাক্তার সময়সূচী',
    hero_cta_tests: 'পরীক্ষা ও টেস্ট ফি',
    hero_stat_doctors: '৩০+ বিশেষজ্ঞ',
    hero_stat_doctors_sub: 'মেডিসিন, গাইনি, শিশু ও সার্জারি',
    hero_stat_emergency: '২৪/৭ ইমার্জেন্সি',
    hero_stat_emergency_sub: 'সার্বক্ষণিক ইনডোর ও অক্সিজেন',
    hero_stat_lab: 'ডিজিটাল ল্যাব',
    hero_stat_lab_sub: '১০০% স্বয়ংক্রিয় প্যাথলজি',
    hero_hotline_title: 'জরুরী সিরিয়াল ও অ্যাম্বুলেন্স সার্ভিস:',

    // Doctor Schedule
    doc_page_title: 'বিশেষজ্ঞ ডাক্তারদের সময়সূচী',
    doc_page_subtitle: 'পলাশ আনোয়ারা মেডিকেল কমপ্লেক্সে ঢাকা ও নরসিংদীর শীর্ষ বিশেষজ্ঞ চিকিৎসকদের চেম্বার ও রোগী দেখার দিনক্ষণ',
    doc_select_day: 'দিন নির্ধারণ করুন:',
    doc_all_specialties: 'সকল বিভাগ (All Specialties)',
    doc_search_placeholder: 'ডাক্তার বা স্পেশালিটির নাম লিখে খুঁজুন...',
    doc_visiting_hours: 'রোগী দেখার সময়:',
    doc_book_btn: 'সিরিয়াল বুক করুন',
    doc_no_doctors: 'আজকের দিনে কোনো পূর্বনির্ধারিত বিশেষজ্ঞ চেম্বার নেই',
    doc_no_doctors_sub: 'তবে আমাদের ইনডোর ও আউটডোর ইমার্জেন্সি মেডিকেল অফিসার সার্বক্ষণিক ২৪ ঘণ্টা রোগী দেখছেন।',
    doc_emergency_call: '২৪ ঘণ্টা জরুরি সেবায় কল করুন',

    // Diagnostics & Pricing
    test_page_title: 'পরীক্ষা-নিরীক্ষার সম্ভাব্য মূল্য তালিকা',
    test_page_subtitle: 'আধুনিক স্বয়ংক্রিয় ল্যাবরেটরিতে নির্ভুল প্যাথলজিক্যাল, বায়োকেমিক্যাল ও ইমেজিং টেস্টের ফি তালিকা',
    test_search_placeholder: 'পরীক্ষার নাম দিয়ে খুঁজুন (যেমন: CBC, USG, X-Ray, Creatinine, ডেঙ্গু)...',
    test_tab_all: 'সকল টেস্ট',
    test_tab_pathology: 'রক্ত ও প্যাথলজি ল্যাব',
    test_tab_imaging: 'আল্ট্রাসনো ও এক্স-রে',
    test_th_name: 'পরীক্ষার নাম',
    test_th_category: 'বিভাগ',
    test_th_delivery: 'রিপোর্ট ডেলিভারি সময়',
    test_th_price: 'সম্ভাব্য ফি',
    test_fasting_tag: 'খালি পেটে প্রযোজ্য',
    test_disclaimer: '* উল্লিখিত ফি-সমূহ একটি আনুমানিক ধারণা। প্যাকেজ বা চিকিৎসকের নির্দিষ্ট প্রেসক্রিপশনের প্রেক্ষিতে চার্জ কিছুটা পরিবর্তিত হতে পারে।',
    test_not_found: 'নামে কোনো টেস্টের তথ্য পাওয়া যায়নি। সরাসরি রিসেপশনে কল করুন: 01972-692504।',

    // Services
    services_page_title: 'আমাদের চিকিৎসাসেবাসমূহ',
    services_page_subtitle: 'পলাশ ও আশেপাশের অঞ্চলের মানুষের উন্নত স্বাস্থ্যসেবায় প্রতিশ্রুতিবদ্ধ আনোয়ারা মেডিকেল কমপ্লেক্স',
    services_diag_title: 'ডায়াগনস্টিক সার্ভিসেস',
    services_surgery_title: 'ক্লিনিক্যাল ও সার্জারি সেবা',
    services_emergency_title: '২৪ ঘণ্টা জরুরী সার্ভিস',
    services_emergency_badge: 'সপ্তাহের ৭ দিন দিনরাত ২৪ ঘণ্টা সচল',
    services_pricing_link: 'সকল টেস্টের মূল্য তালিকা দেখুন',
    services_doctor_link: 'বিশেষজ্ঞ সার্জনদের সময়সূচী দেখুন',

    // Gallery
    gallery_page_title: 'হাসপাতাল প্রাঙ্গণ ও অবকাঠামো গ্যালারি',
    gallery_page_subtitle: 'আন্তর্জাতিক মানসম্পন্ন অপারেশন থিয়েটার, ভিআইপি কেবিন ও পরিচ্ছন্ন পরিবেশের বাস্তব ছবিসমূহ',
    gallery_zoom: 'বড় করে দেখুন',
    gallery_close: 'বন্ধ করুন',

    // Appointment
    appt_page_title: 'অনলাইন সিরিয়াল ও অ্যাপয়েন্টমেন্ট বুকিং',
    appt_page_subtitle: 'বাসায় বসেই পছন্দের বিশেষজ্ঞ ডাক্তারের অ্যাপয়েন্টমেন্ট ও সিরিয়াল বুক করুন মুহূর্তেই',
    appt_info_desc: 'ফর্মটি পূরণ করে সাবমিট করুন, আমাদের রিসেপশন ডেস্ক থেকে দ্রুততম সময়ে ফোনে কল করে আপনার সিরিয়াল ও সময় নিশ্চিত করা হবে।',
    appt_call_card_title: 'সিরিয়ালের জন্য কল করুন',
    appt_email_card_title: 'ইমেইল করুন',
    appt_notice_urgent: 'জরুরি নোটিশ: দুর্ঘটনা বা আকস্মিক আশঙ্কাজনক রোগীর ক্ষেত্রে আগাম সিরিয়াল না নিয়ে সরাসরি আমাদের জরুরি বিভাগে চলে আসুন।',
    appt_name_label: 'রোগীর পুরো নাম',
    appt_phone_label: 'মোবাইল নম্বর',
    appt_doctor_label: 'পছন্দের ডাক্তার / বিভাগ নির্বাচন করুন',
    appt_date_label: 'পছন্দের তারিখ',
    appt_time_label: 'পছন্দের সময়',
    appt_notes_label: 'সমস্যার সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)',
    appt_submit_btn: 'সিরিয়ালের অনুরোধ পাঠান',
    appt_success_title: 'সিরিয়ালের অনুরোধ সফল হয়েছে!',
    appt_success_desc: 'আপনার সিরিয়াল রিকোয়েস্ট রিসেপশনে পৌঁছেছে। রিসেপশনিস্ট খুব শীঘ্রই ফোনে যোগাযোগ করবেন।',
    appt_token_code: 'বুকিং রেফারেন্স টোকেন কোড',
    appt_copy_code: 'কোড কপি করুন',
    appt_copied: 'কপি হয়েছে!',
    appt_book_another: 'নতুন আরেকটি সিরিয়াল বুক করুন',
    appt_general_doc: 'সাধারণ (রিসেপশন নির্ধারণ করবে)',

    // Notices
    notices_page_title: 'হাসপাতাল নোটিশ বোর্ড ও আপডেট',
    notices_page_subtitle: 'বিশেষ ফ্রি স্বাস্থ্য ক্যাম্প, টেস্টে ছাড় ও মেডিকেল ক্যাম্পেইনের সর্বশেষ তথ্য',
    notices_all: 'সকল নোটিশ',
    notices_urgent: 'জরুরি নোটিশ',
    notices_offers: 'বিশেষ ছাড়',
    notices_info: 'সাধারণ তথ্য',

    // Contact
    contact_page_title: 'যোগাযোগ ও ভার্চুয়াল অবস্থান',
    contact_page_subtitle: 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী — সহজেই আমাদের হাসপাতালে পৌঁছাতে ডিরেকশন ও ম্যাপ দেখুন',
    contact_address_title: 'হাসপাতালের ঠিকানা',
    contact_address_value: 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী, ঢাকা বিভাগ',
    contact_phone_title: 'সিরিয়াল ও জরুরি নম্বরসমূহ',
    contact_email_title: 'অফিসিয়াল ইমেইল',
    contact_directions_btn: 'গুগল ম্যাপে ডিরেকশন নিন',
    contact_tour_title: 'হাসপাতাল প্রাঙ্গণ ৩৬০° স্ট্রিট ভিউ',
    contact_tour_subtitle: 'পলাশ মেডিকেল মোড়ে আমাদের অবস্থান ৩৬০ ডিগ্রি ভিউতে ঘুরে দেখুন',
    contact_hours_title: 'সেবা প্রদানের সময়সূচী',
    contact_hours_value: 'জরুরী বিভাগ: ২৪ ঘণ্টা সার্বক্ষণিক | ওপিডি ও ল্যাব: সকাল ৮টা - রাত ১০টা',

    // Footer
    footer_desc: 'বিদেশগামীদের মেডিকেল চেক-আপ এর একটি নির্ভরযোগ্য প্রতিষ্ঠান — ডিজিটাল ডায়াগনস্টিক, বিশেষজ্ঞ চিকিৎসা ও ২৪ ঘণ্টা জরুরী স্বাস্থ্যসেবা।',
    footer_dife_badge: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার (DIFE) নিবন্ধিত ডায়াগনস্টিক সেন্টার | লাইসেন্স ও রেজিঃ নং: ৬৮-৬৩-২-০২৩-০০০১',
    footer_rights: 'আনোয়ারা মেডিকেল কমপ্লেক্স, পলাশ, নরসিংদী। সর্বস্বত্ব সংরক্ষিত।',
  },
  en: {
    // Navigation
    nav_home: 'Home',
    nav_doctors: 'Doctor Schedule',
    nav_diagnostics: 'Tests & Fees',
    nav_services: 'Services',
    nav_gallery: 'Gallery',
    nav_blog: 'Blog & Health Tips',
    nav_appointment: 'Appointment',
    nav_notices: 'Notice Board',
    nav_contact: 'Contact & Map',
    nav_management: 'Management',
    nav_receptionist: 'Receptionist Login',
    nav_admin: 'Admin Login',
    nav_install: 'Install In Your Device',

    // Header
    brand_title: 'Anowara Medical Complex',
    brand_subtitle: 'Palash, Narsingdi',
    call_direct: 'Call Direct',
    menu_open: 'Open Menu',
    menu_close: 'Close Menu',
    hotline_label: 'Emergency Hotline:',

    // Common
    search_placeholder: 'Search here...',
    clear: 'Clear',
    book_serial: 'Book Serial',
    call_now: 'Call Now',
    emergency_24hr: '24/7 Emergency Care',
    view_details: 'View Details',
    home_breadcrumb: 'Home',

    // Marquee
    marquee_prefix: 'Urgent Notice:',
    marquee_text: 'Special Free Health Camp next Friday | 20% flat discount on all digital tests | One-Stop Overseas Medical Checkups active | Reception: 01972-692504 | Serial: 01944-874304',

    // Hero
    hero_badge: 'Govt. of Bangladesh (DIFE) Registered Diagnostic & Clinic',
    hero_title_1: 'Modern Healthcare & Precise',
    hero_title_2: 'Digital Diagnostics in Palash',
    hero_desc: 'Experienced medical specialists, 24/7 round-the-clock emergency indoor care, state-of-the-art 4D Color Doppler and automated pathology testing right at your service.',
    hero_cta_serial: 'Book Appointment Online',
    hero_cta_doctor: 'Doctor Schedule',
    hero_cta_tests: 'Test Prices & Fees',
    hero_stat_doctors: '30+ Specialists',
    hero_stat_doctors_sub: 'Medicine, Gynae, Paediatrics, Surgery',
    hero_stat_emergency: '24/7 Emergency',
    hero_stat_emergency_sub: 'Indoor admission & round-the-clock oxygen',
    hero_stat_lab: 'Digital Labs',
    hero_stat_lab_sub: '100% automated pathology analysers',
    hero_hotline_title: 'Direct Serial Hotline & Ambulance:',

    // Doctor Schedule
    doc_page_title: 'Specialist Doctor Chamber Schedule',
    doc_page_subtitle: 'Chamber schedules, visiting hours and consultation days of renowned specialists from Dhaka & Narsingdi at Anowara Medical Complex',
    doc_select_day: 'Select Day of Week:',
    doc_all_specialties: 'All Specialties',
    doc_search_placeholder: 'Search by doctor or specialty name...',
    doc_visiting_hours: 'Visiting Hours:',
    doc_book_btn: 'Book Serial',
    doc_no_doctors: 'No scheduled consultant chambers on this day',
    doc_no_doctors_sub: 'However, our 24-hour Medical Officers are on active duty for urgent care and general consultations.',
    doc_emergency_call: 'Call 24-Hour Emergency',

    // Diagnostics & Pricing
    test_page_title: 'Diagnostic Tests & Fee Schedule',
    test_page_subtitle: 'Estimated pricing for automated pathology, biochemistry, 4D USG and digital radiology examinations',
    test_search_placeholder: 'Search test name (e.g., CBC, USG, X-Ray, Creatinine, Dengue)...',
    test_tab_all: 'All Tests',
    test_tab_pathology: 'Blood & Pathology',
    test_tab_imaging: 'USG & Digital X-Ray',
    test_th_name: 'Test Name',
    test_th_category: 'Category',
    test_th_delivery: 'Report Delivery Time',
    test_th_price: 'Estimated Fee',
    test_fasting_tag: 'Fasting Required',
    test_disclaimer: '* Stated fees are approximate. Package discounts or specific doctor prescriptions may adjust the final bill. Inquire at reception for exact details.',
    test_not_found: 'No tests found matching your query. Contact reception directly: 01972-692504.',

    // Services
    services_page_title: 'Our Comprehensive Medical Services',
    services_page_subtitle: 'Committed to superior healthcare for Palash and surrounding communities with compassionate attention',
    services_diag_title: 'Diagnostic Services',
    services_surgery_title: 'Clinical & Surgical Care',
    services_emergency_title: '24-Hour Emergency Unit',
    services_emergency_badge: 'Operational 24 Hours, 7 Days a Week',
    services_pricing_link: 'Explore Diagnostic Price List',
    services_doctor_link: 'View Specialist Surgeons Schedule',

    // Gallery
    gallery_page_title: 'Hospital Campus & Facilities Gallery',
    gallery_page_subtitle: 'Explore our state-of-the-art Operation Theatres, VIP AC Cabins, Dental Studio, and hygienic General Wards',
    gallery_zoom: 'Click to Enlarge',
    gallery_close: 'Close',

    // Appointment
    appt_page_title: 'Online Serial & Appointment Booking',
    appt_page_subtitle: 'Book your serial for top medical specialists from the convenience of your home',
    appt_info_desc: 'Fill out this form and our reception desk will contact you via phone shortly to confirm your token and exact visiting time slot.',
    appt_call_card_title: 'Call for Direct Serial',
    appt_email_card_title: 'Official Email',
    appt_notice_urgent: 'Emergency Notice: For trauma cases or acute respiratory distress, please arrive directly at our 24/7 Emergency Department without waiting for serials.',
    appt_name_label: 'Patient Full Name',
    appt_phone_label: 'Contact Mobile Number',
    appt_doctor_label: 'Select Doctor or Department',
    appt_date_label: 'Preferred Date',
    appt_time_label: 'Preferred Time',
    appt_notes_label: 'Brief Symptom Description (Optional)',
    appt_submit_btn: 'Submit Appointment Request',
    appt_success_title: 'Appointment Request Submitted!',
    appt_success_desc: 'Thank you! Your serial request has reached our reception desk. Our team will call you shortly to confirm.',
    appt_token_code: 'Booking Reference Token',
    appt_copy_code: 'Copy Code',
    appt_copied: 'Copied!',
    appt_book_another: 'Book Another Serial',
    appt_general_doc: 'General (Reception will assign)',

    // Notices
    notices_page_title: 'Hospital Notice Board & Announcements',
    notices_page_subtitle: 'Stay updated on free medical camps, discounted diagnostic checkups, and operational notices',
    notices_all: 'All Notices',
    notices_urgent: 'Urgent Notices',
    notices_offers: 'Special Offers',
    notices_info: 'General Info',

    // Contact
    contact_page_title: 'Contact Us & Hospital Location',
    contact_page_subtitle: 'WAPDA Sadar Road, Medical Morh, Palash, Narsingdi — view map, get directions and reach our helpdesk',
    contact_address_title: 'Hospital Address',
    contact_address_value: 'WAPDA Sadar Road, Medical Morh, Palash, Narsingdi, Dhaka Division',
    contact_phone_title: 'Serial & Emergency Numbers',
    contact_email_title: 'Official Email',
    contact_directions_btn: 'Get Directions on Google Maps',
    contact_tour_title: '360° Street View & Campus Tour',
    contact_tour_subtitle: 'Take a virtual 360-degree tour of our hospital entrance at Palash Medical Morh',
    contact_hours_title: 'Service Hours',
    contact_hours_value: 'Emergency Department: 24/7 Non-stop | OPD & Labs: 8:00 AM - 10:00 PM',

    // Footer
    footer_desc: 'A reliable medical examination center for overseas travelers — offering digital diagnostics, specialist healthcare, and 24-hour emergency support.',
    footer_dife_badge: 'Govt. of Bangladesh (DIFE) Registered Diagnostic Center | License & Reg: 68-63-2-023-0001',
    footer_rights: 'Anowara Medical Complex, Palash, Narsingdi. All rights reserved.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isBn: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('amc_lang');
    return saved === 'bn' ? 'bn' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('amc_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
        isBn: language === 'bn',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
