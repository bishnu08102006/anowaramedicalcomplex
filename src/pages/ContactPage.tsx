import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink, ShieldCheck, CheckCircle2, Compass, Eye, Facebook, Maximize2, Layers, RotateCw, Ambulance } from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { useLanguage } from '../context/LanguageContext';
import { PageId } from '../components/Header';

interface ContactPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: PageId) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateHome, onNavigate }) => {
  const { t, isBn } = useLanguage();
  const [streetViewMode, setStreetViewMode] = useState<'interactive' | 'facade'>('interactive');

  return (
    <div id="contact-page" className="min-h-screen bg-[#F8FAFB]">
      <PageBanner
        title={t.contact_page_title}
        subtitle={t.contact_page_subtitle}
        icon={MapPin}
        badge={isBn ? "ঠিকানা ও অবস্থান" : "Location & Helpdesk"}
        currentPageName={t.nav_contact}
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Address Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E7F2F8] text-[#2D8FC1] flex items-center justify-center font-bold mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0E3A53] mb-2">{t.contact_address_title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-2">
                {t.contact_address_value}
              </p>
              <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono font-bold text-[#0E3A53]">
                <span className="text-gray-400 font-sans font-normal text-[11px]">Plus Code:</span>
                <span>XJFQ+H2 Palash</span>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=23.9738924,90.6375625"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D8FC1] hover:underline"
            >
              <span>{t.contact_directions_btn}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Hotlines Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C9973B] flex items-center justify-center font-bold mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0E3A53] mb-2">{t.contact_phone_title}</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                {/* 1. Reception & Emergency Hotline */}
                <div className="flex items-center justify-between bg-blue-50/80 p-2.5 rounded-xl border border-blue-200">
                  <div>
                    <span className="text-[10px] font-bold text-[#0E3A53] block uppercase">
                      {isBn ? 'রিসেপশন ও জরুরি (২৪ ঘণ্টা)' : 'Reception & Emergency (24/7)'}
                    </span>
                    <span className="font-bold text-[#0E3A53] font-mono text-sm">01972-692504</span>
                  </div>
                  <a href="tel:01972692504" className="text-xs font-bold text-white bg-[#0E3A53] hover:bg-[#0A2A3D] px-2.5 py-1 rounded-lg">
                    {t.call_now}
                  </a>
                </div>

                {/* 2. Hospital Authority */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div>
                    <span className="text-[10px] font-bold text-amber-900 block uppercase">
                      {isBn ? 'হাসপাতাল কর্তৃপক্ষ / প্রশাসন' : 'Hospital Authority'}
                    </span>
                    <span className="font-semibold text-amber-950 font-mono text-sm">01712-692504</span>
                  </div>
                  <a href="tel:01712692504" className="text-xs font-bold text-amber-800 hover:underline">
                    {t.call_now}
                  </a>
                </div>

                {/* 3. Serial Desk */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 block uppercase">
                      {isBn ? 'সিরিয়াল ডেস্ক (সকাল ৮টা - রাত ১০টা)' : 'Serial Desk'}
                    </span>
                    <span className="font-semibold text-emerald-950 font-mono text-sm">01944-874304</span>
                  </div>
                  <a href="tel:01944874304" className="text-xs font-bold text-emerald-700 hover:underline">
                    {t.call_now}
                  </a>
                </div>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 mt-4 block">
              {isBn ? 'জরুরি সিরিয়াল ও অ্যাম্বুলেন্স সেবা' : 'Emergency serial & ambulance service'}
            </span>
          </div>

          {/* Service Hours Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0E3A53] mb-2">{t.contact_hours_title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                {t.contact_hours_value}
              </p>
              <div className="pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500 block mb-1">{t.contact_email_title}:</span>
                <a
                  href="mailto:anowaramedicalcomplex11@gmail.com"
                  className="text-xs font-semibold text-[#0E3A53] hover:text-[#2D8FC1] break-all"
                >
                  anowaramedicalcomplex11@gmail.com
                </a>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'ইনডোর ও ওটি সার্বক্ষণিক খোলা' : 'Indoor & OT open 24/7'}</span>
            </div>
          </div>

          {/* Official Facebook Page Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-200/80 flex flex-col justify-between hover:shadow-md transition relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center font-bold mb-4">
                <Facebook className="w-6 h-6 fill-current" />
              </div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1877F2] uppercase tracking-wider">
                  {isBn ? 'অফিসিয়াল পেজ' : 'Official Page'}
                </span>
              </div>
              <h3 className="font-bold text-base text-[#0E3A53] mb-2">
                {isBn ? 'ফেসবুক পেজ' : 'Facebook Page'}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {isBn
                  ? 'হাসপাতালের নতুন নোটিশ, ডাক্তারদের শিডিউল ও জরুরি ঘোষণার জন্য আমাদের ফেসবুক পেজে যুক্ত থাকুন।'
                  : 'Follow our official Facebook page for daily doctor schedules, health updates & hospital announcements.'}
              </p>
            </div>
            <a
              href="https://www.facebook.com/anowaramedicalcomplex01/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition self-stretch text-center"
            >
              <Facebook className="w-4 h-4 fill-current" />
              <span>{isBn ? 'ফেসবুক পেজ ভিজিট করুন' : 'Visit Facebook'}</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* ========================================================
            SECTION 1: GOOGLE STREET VIEW 360° PREVIEW (Mape ar jaigai)
            ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-[#2D8FC1] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#2D8FC1] animate-spin-slow" />
                {isBn ? 'গুগল স্ট্রিট ভিউ প্রিভিউ (৩৬০° প্যানোরামা)' : 'Google Street View Preview (360° Panorama)'}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0E3A53]">
                {isBn ? 'আনোয়ারা মেডিকেল কমপ্লেক্স - ৩৬০° স্ট্রিট ভিউ' : 'Anowara Medical Complex - 360° Street View Tour'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {isBn
                  ? 'পলাশ ওয়াপদা সদর রোড ও হাসপাতাল প্রবেশদ্বারের ৩৬০° ভার্চুয়াল স্ট্রিট ভিউ সরাসরি দেখুন।'
                  : 'Experience the full 360° street view of hospital facade and Wapda Road directly.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Toggle view mode */}
              <div className="bg-gray-100 p-1 rounded-xl flex items-center text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setStreetViewMode('interactive')}
                  className={`px-3 py-1.5 rounded-lg transition ${streetViewMode === 'interactive' ? 'bg-[#0E3A53] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {isBn ? '৩৬০° স্ট্রিট ভিউ' : '360° Street View'}
                </button>
                <button
                  type="button"
                  onClick={() => setStreetViewMode('facade')}
                  className={`px-3 py-1.5 rounded-lg transition ${streetViewMode === 'facade' ? 'bg-[#0E3A53] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {isBn ? 'ভবন ফটোভিয়ু' : 'Facade Photo'}
                </button>
              </div>

              {/* Direct Fullscreen Street View Launcher */}
              <a
                href="https://maps.app.goo.gl/ESVAyVjEDpS2585JA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#2D8FC1] hover:bg-[#2479a5] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isBn ? 'গুগল ম্যাপে ৩৬০° খুলুন' : 'Open in Google Maps 360°'}</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
              </a>
            </div>
          </div>

          {/* Street View Preview Container */}
          <div className="w-full h-80 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative bg-slate-900">
            {/* Top Floating Badge with Location & Street View info */}
            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-gray-200 flex items-center gap-2.5 max-w-[90%] sm:max-w-none">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-[#2D8FC1] flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Google Street View Active
                </span>
                <span className="font-semibold text-xs text-[#0E3A53] truncate block">
                  Anowara Medical Complex • Palash Main Road
                </span>
              </div>
              <a
                href="https://maps.app.goo.gl/ESVAyVjEDpS2585JA"
                target="_blank"
                rel="noopener noreferrer"
                title="গুগল স্ট্রিট ভিউ পূর্ণ স্ক্রিনে ওপেন করুন"
                className="hidden sm:inline-flex ml-1 px-2.5 py-1 rounded-lg bg-[#0E3A53] hover:bg-[#2D8FC1] text-white text-[11px] font-semibold transition items-center gap-1"
              >
                <span>৩৬০° ফুল ভিউ</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Bottom Right Floating Helper Pill */}
            <div className="absolute bottom-3 right-3 z-10 bg-[#0A2540]/85 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-lg shadow flex items-center gap-2">
              <RotateCw className="w-3 h-3 text-[#C9973B]" />
              <span>{isBn ? '৩৬০° ঘুরিয়ে দেখুন' : 'Drag or click to look around 360°'}</span>
            </div>

            {streetViewMode === 'interactive' ? (
              /* Google Street View 360 Embed */
              <iframe
                title="Anowara Medical Complex Google Street View 360"
                src="https://maps.google.com/maps?q=&layer=c&cbll=23.9739754,90.6374176&cbp=11,88.33,,0,-5.18&output=svembed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            ) : (
              /* High-Resolution Photosphere & Facade View */
              <div className="relative w-full h-full">
                <img
                  src="/facade.jpg"
                  alt="Anowara Medical Complex Facade and Main Road"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-lg font-bold">আনোয়ারা মেডিকেল কমপ্লেক্স - ওয়াপদা রোড প্রবেশদ্বার</h3>
                  <p className="text-xs text-gray-200 mt-1 max-w-xl">
                    পলাশ ওয়াপদা মোড় থেকে ১০০ গজ পশ্চিমে প্রধান সড়কের পাশেই ৪-তলা আধুনিক হাসপাতাল কমপ্লেক্স।
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <a
                      href="https://maps.app.goo.gl/ESVAyVjEDpS2585JA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#2D8FC1] text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-[#2479a5] transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>গুগল ৩৬০° স্ট্রিট ভিউতে যান</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-2 flex-wrap">
              <span>
                {isBn ? 'পলাশ ওয়াপদা মোড় থেকে ১০০ গজ পশ্চিমে প্রধান সড়কের সাথেই আমাদের অবস্থান।' : 'Located 100 yards west of Palash WAPDA Morh on the main road.'}
              </span>
              <span className="inline-flex items-center gap-1 font-mono font-bold bg-[#E7F2F8] text-[#0E3A53] px-2.5 py-1 rounded-lg border border-blue-200">
                <Compass className="w-3 h-3 text-[#2D8FC1]" />
                Orientation: 88° E
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://maps.app.goo.gl/ESVAyVjEDpS2585JA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2D8FC1] hover:underline font-semibold flex items-center gap-1"
              >
                <span>{isBn ? "গুগল স্ট্রিট ভিউ ৩৬০° (Google Street View)" : "Google Street View 360°"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 2: GOOGLE MAPS WITH HOSPITAL SELECTED (Neca alada kora)
            ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {isBn ? 'গুগল ম্যাপে নির্বাচিত লোকেশন • Verified Google Maps Place' : 'Google Maps - Hospital Selected'}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0E3A53]">
                {isBn ? 'গুগল ম্যাপে আনোয়ারা মেডিকেল কমপ্লেক্স' : 'Anowara Medical Complex on Google Maps'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {isBn
                  ? 'ম্যাপে সরাসরি আনোয়ারা মেডিকেল কমপ্লেক্স পিন সিলেক্ট ও চিহ্নিত করা আছে। যেকোনো স্থান থেকে সরাসরি দিকনির্দেশনা (Directions) নিন।'
                  : 'Anowara Medical Complex is pinned and selected on the map. Get turn-by-turn driving & walking directions.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=23.9738924,90.6375625"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[#C9973B]" />
                <span>{isBn ? 'ডিরেকশন পান (Directions)' : 'Get Directions'}</span>
              </a>
              <a
                href="https://www.google.com/maps/place/Anowara+Medical+Complex/@23.9738924,90.6375625,17z/data=!3m1!4b1!4m6!3m5!1s0x37542d2721ef4105:0xe68f008774a13bd2!8m2!3d23.9738924!4d90.6375625"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#0E3A53] text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 transition cursor-pointer"
              >
                <span>{isBn ? 'পূর্ণ ম্যাপে দেখুন' : 'View Full Map'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </a>
            </div>
          </div>

          {/* Interactive Google Map with Anowara Medical Complex Selected */}
          <div className="w-full h-80 sm:h-96 md:h-[400px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative bg-gray-100">
            {/* Hospital Selected Pin Overlay Badge */}
            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-gray-200 flex items-center gap-2.5 max-w-[90%] sm:max-w-none">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 fill-red-600 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                  {isBn ? 'নির্বাচিত হাসপাতাল' : 'Selected Hospital'}
                </span>
                <span className="font-bold text-xs sm:text-sm text-[#0E3A53] block truncate">
                  আনোয়ারা মেডিকেল কমপ্লেক্স (Anowara Medical Complex)
                </span>
              </div>
              <span className="hidden sm:inline-flex font-mono text-[11px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                XJFQ+H2 Palash
              </span>
            </div>

            {/* Google Map Embed centered and pinned on Anowara Medical Complex */}
            <iframe
              title="Google Map with Anowara Medical Complex Selected"
              src="https://maps.google.com/maps?q=Anowara+Medical+Complex,+Palash,+Narsingdi&t=&z=16&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Hospital Quick Information & Instant Phone Actions Bar */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Reception & Emergency Hotline */}
            <div className="bg-[#0E3A53] text-white rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 text-[#C9973B] flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-white/80 block uppercase">রিসেপশন ও জরুরি</span>
                  <span className="font-bold font-mono text-sm text-white">01972-692504</span>
                </div>
              </div>
              <a
                href="tel:01972692504"
                className="px-3 py-1.5 bg-[#2D8FC1] hover:bg-[#23759F] text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                {t.call_now}
              </a>
            </div>

            {/* 2. Hospital Authority */}
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0E3A53] text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-900 block uppercase">হাসপাতাল কর্তৃপক্ষ</span>
                  <span className="font-bold font-mono text-sm text-amber-950">01712-692504</span>
                </div>
              </div>
              <a
                href="tel:01712692504"
                className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                {t.call_now}
              </a>
            </div>

            {/* 3. Serial Desk */}
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 block uppercase">সিরিয়াল ডেস্ক</span>
                  <span className="font-bold font-mono text-sm text-emerald-950">01944-874304</span>
                </div>
              </div>
              <a
                href="tel:01944874304"
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                {t.call_now}
              </a>
            </div>

            {/* 4. Navigation & Direction */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 block uppercase">ন্যাভিগেশন</span>
                  <span className="font-semibold text-xs text-emerald-950 truncate block max-w-[110px]">ওয়াপদা সদর রোড</span>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=23.9738924,90.6375625"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                {isBn ? 'দিকনির্দেশ' : 'Navigate'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
