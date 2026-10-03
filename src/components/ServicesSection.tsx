import React from 'react';
import { Activity, ShieldCheck, HeartPulse, Check, PhoneCall, ArrowRight, Zap, Ambulance } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="bg-[#0E3A53] py-16 md:py-24 text-white relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#2D8FC1]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#C9973B]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="text-[#2D8FC1] font-bold text-sm tracking-wider uppercase flex items-center gap-1.5 mb-2">
            <Activity className="w-4 h-4" /> আমাদের চিকিৎসাসেবাসমূহ
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            উন্নত প্রযুক্তি ও অভিজ্ঞ চিকিৎসকের সমন্বয়
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed">
            পলাশ ও আশেপাশের অঞ্চলের মানুষের জন্য আধুনিক ডায়াগনস্টিক, বিশেষজ্ঞ কনসালটেশন, নিরাপদ সার্জারি ও সার্বক্ষণিক জরুরী সেবা।
          </p>
        </div>

        {/* 3 Services Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* 1. Diagnostic Services */}
          <div className="bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 rounded-3xl p-7 md:p-8 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-[#2D8FC1]/20 border border-[#2D8FC1]/30 flex items-center justify-center mb-6 text-[#2D8FC1] group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-xl mb-4 font-display">
                ডায়াগনস্টিক সার্ভিসেস
              </h3>
              <ul className="space-y-3.5 text-white/80 text-sm leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#2D8FC1] shrink-0 mt-0.5" />
                  <span>সম্পূর্ণ অটোমেটেড বায়োকেমিস্ট্রি ও হরমোন এনালাইজার</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#2D8FC1] shrink-0 mt-0.5" />
                  <span>৪ডি কালার ডপলার আল্ট্রাসনোগ্রাম</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#2D8FC1] shrink-0 mt-0.5" />
                  <span>উচ্চক্ষমতাসম্পন্ন ডিজিটাল এক্স-রে</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#2D8FC1] shrink-0 mt-0.5" />
                  <span>১২ চ্যানেল ডিজিটাল ই.সি.জি ও প্যাথলজি ল্যাব</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10">
              <a
                href="#pricing"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D8FC1] hover:text-white transition"
              >
                <span>সকল টেস্টের মূল্য তালিকা দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 2. Clinical & Surgery Services */}
          <div className="bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 rounded-3xl p-7 md:p-8 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-[#C9973B]/20 border border-[#C9973B]/30 flex items-center justify-center mb-6 text-[#C9973B] group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-xl mb-4 font-display">
                ক্লিনিক্যাল ও সার্জারি সেবা
              </h3>
              <ul className="space-y-3.5 text-white/80 text-sm leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#C9973B] shrink-0 mt-0.5" />
                  <span>নিরাপদ নরমাল ডেলিভারি ও আধুনিক সিজারিয়ান সেকশন</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#C9973B] shrink-0 mt-0.5" />
                  <span>পেইনলেস / ল্যাপারোস্কোপি সার্জারি (পেট না কেটে অপারেশন)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#C9973B] shrink-0 mt-0.5" />
                  <span>নাক-কান-গলার সব ধরনের জটিল অপারেশন</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#C9973B] shrink-0 mt-0.5" />
                  <span>আধুনিক ডেন্টাল চেয়ার, ফিজিওথেরাপি ও অর্থোপেডিক ইউনিট</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10">
              <a
                href="#doctors"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9973B] hover:text-white transition"
              >
                <span>বিশেষজ্ঞ সার্জনদের সময়সূচী</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 3. 24-Hour Emergency Service */}
          <div className="bg-[#AE3B2E] rounded-3xl p-7 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-xl">
            {/* Background decorative circles */}
            <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-black/10 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-13 h-13 rounded-2xl bg-white/20 flex items-center justify-center mb-6 text-white">
                <Zap className="w-6 h-6 fill-current" />
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
                <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                  সপ্তাহের ৭ দিন, দিনরাত ২৪ ঘণ্টা প্রস্তুত
                </span>
              </div>

              <h3 className="text-white font-bold text-2xl mb-4 font-display">
                ২৪ ঘণ্টা জরুরী সার্ভিস
              </h3>

              <ul className="space-y-3 text-white/95 text-sm leading-relaxed mb-6">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>২৪ ঘণ্টা ইনডোর ও আউটডোর ইমার্জেন্সি চিকিৎসা</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>সার্বক্ষণিক নিরবচ্ছিন্ন নিজস্ব বিদ্যুৎ ব্যবস্থা</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>জরুরী অক্সিজেন, নেবুলাইজার ও ইমার্জেন্সি মেডিসিন</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>বিদেশগামীদের দ্রুততম মেডিকেল চেক-আপ</span>
                </li>
              </ul>
            </div>

            <div className="relative z-10 pt-2">
              <a
                href="tel:01972692504"
                className="w-full inline-flex items-center justify-center gap-2.5 bg-white text-[#AE3B2E] hover:bg-white/90 font-bold text-sm px-5 py-3.5 rounded-full shadow-lg transition active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>জরুরী নম্বরে কল করুন →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
