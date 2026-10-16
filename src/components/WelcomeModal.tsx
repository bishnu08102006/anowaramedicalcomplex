import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Stethoscope, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HospitalLogo } from './HospitalLogo';

const services = [
  {
    bn: 'অভিজ্ঞ বিশেষজ্ঞ ডাক্তারদের দ্বারা কনসালটেশন',
    en: 'Consultations with experienced specialist doctors',
  },
  { bn: '২৪ ঘণ্টা জরুরী ও এম্বুলেন্স সার্ভিস', en: '24-hour emergency and ambulance service' },
  { bn: 'ইনডোর ও আউটডোর রোগীর চিকিৎসা সেবা', en: 'Inpatient and outpatient medical care' },
  { bn: '৪ডি কালার ডপলার ও আল্ট্রাসোনোগ্রাফি', en: '4D color Doppler and ultrasonography' },
  { bn: 'ডিজিটাল এক্স-রে ও ১২-চ্যানেল ইসিজি', en: 'Digital X-ray and 12-channel ECG' },
  { bn: 'সম্পূর্ণ অটোমেটেড প্যাথলজি ল্যাবরেটরি', en: 'Fully automated pathology laboratory' },
];

export const WelcomeModal: React.FC = () => {
  const { isBn } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-md sm:p-6"
          onClick={() => setIsOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-modal-title"
            className="relative my-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white text-slate-800 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={isBn ? 'বন্ধ করুন' : 'Close welcome popup'}
              className="absolute right-3.5 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md transition hover:scale-110 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col md:min-h-[440px] md:flex-row">
              <div className="flex w-full flex-col justify-between bg-[#1C733F] p-6 text-white md:w-5/12 md:p-8">
                <div className="flex flex-col items-center text-center">
                  <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-900/60 px-3.5 py-1 text-xs font-bold tracking-wide text-emerald-200">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    {isBn ? 'ওয়েবসাইটে আপনাকে স্বাগতম' : 'Welcome to our website'}
                  </span>

                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-white p-2.5 shadow-2xl">
                    <HospitalLogo className="h-full w-full" />
                  </div>

                  <h2
                    id="welcome-modal-title"
                    className="text-2xl font-extrabold leading-tight tracking-tight md:text-3xl"
                  >
                    {isBn ? 'আনোয়ারা মেডিকেল কমপ্লেক্স' : 'Anowara Medical Complex'}
                  </h2>

                  <div className="mt-4 w-full rounded-2xl border border-emerald-400/30 bg-emerald-950/40 p-3 shadow-inner">
                    <span className="block text-xl font-black leading-tight text-amber-300">
                      {isBn ? '২৪/৭ ঘন্টা' : '24/7'}
                    </span>
                    <span className="mt-0.5 block text-sm font-bold text-emerald-100">
                      {isBn ? 'জরুরী সেবা চালু আছে' : 'Emergency services available'}
                    </span>
                  </div>
                </div>

                <a
                  href="tel:01972692504"
                  className="mt-6 block rounded-2xl bg-amber-400 p-3.5 text-slate-900 shadow-xl transition hover:scale-[1.02] hover:bg-amber-300 active:scale-[0.98]"
                >
                  <span className="flex items-center justify-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-amber-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    <span className="text-left">
                      <span className="block text-[10px] font-black uppercase tracking-widest">
                        {isBn ? '২৪/৭ হটলাইন' : '24/7 Hotline'}
                      </span>
                      <span className="block text-lg font-black leading-none tracking-wider">
                        01972-692504
                      </span>
                    </span>
                  </span>
                </a>
              </div>

              <div className="relative flex w-full flex-col justify-between bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 p-6 md:w-7/12 md:p-8">
                <div>
                  <h3 className="mb-4 flex items-center gap-2 border-b border-emerald-100 pb-2 text-base font-extrabold text-[#1C733F]">
                    <Stethoscope className="h-5 w-5" />
                    {isBn ? 'আমাদের সেবাসমূহ:' : 'Our services:'}
                  </h3>

                  <ul className="space-y-3 text-sm font-semibold text-slate-700 md:text-base">
                    {services.map((service) => (
                      <li key={service.en} className="flex items-start gap-3">
                        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1C733F] shadow-sm" />
                        <span>{isBn ? service.bn : service.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-100/70 p-3.5 text-center shadow-sm">
                    <p className="text-xs font-bold leading-relaxed text-emerald-950 md:text-sm">
                      {isBn
                        ? 'এছাড়াও সকল প্রকার মানসম্মত চিকিৎসা সেবা ও সার্জারি কার্যক্রম পরিচালিত হচ্ছে।'
                        : 'Quality medical care and a wide range of surgical services are also available.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1 text-center text-xs font-bold text-slate-600 md:text-sm">
                    <MapPin className="h-4 w-4 shrink-0 text-[#C22727]" />
                    <span>
                      {isBn
                        ? 'ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী'
                        : 'Wapda Sadar Road, Medical Mor, Palash, Narsingdi'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
