import React from 'react';
import { Navigation, MapPin, Compass, ExternalLink, Eye } from 'lucide-react';

export const VirtualTour: React.FC = () => {
  return (
    <section className="py-14 md:py-20 bg-gray-50 border-t border-gray-200" id="virtual-tour">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#2D8FC1] uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1.5">
            <Compass className="w-3.5 h-3.5" /> ভার্চুয়াল ট্যুর ও অবস্থান
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
            হাসপাতাল প্রাঙ্গণ ৩৬০° স্ট্রিট ভিউতে দেখুন
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            নিচের ম্যাপটি ঘুরে দেখুন এবং পলাশ মেডিকেল মোড়ে আমাদের সুনির্দিষ্ট লোকেশন যাচাই করুন
          </p>
        </div>

        {/* Responsive Iframe Container */}
        <div className="relative w-full h-[360px] md:h-[460px] rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-slate-900">
          <iframe
            title="আনোয়ারা মেডিকেল কমপ্লেক্স ৩৬০° ভার্চুয়াল ভিউ"
            className="w-full h-full border-0"
            src="https://www.google.com/maps/embed?pb=!4v1700000000000!6m8!1m7!1sf5TlOQAMfzjcL9ux83-_DQ!2m2!1d23.950000!2d90.630000!3f124.44!4f0!5f0.7820865974627469"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Quick Direction Overlay Tag */}
          <div className="absolute bottom-4 left-4 right-4 md:right-auto bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-gray-200 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <span className="block text-xs font-bold text-gray-900">
                  ওয়াপদা সদর রোড, মেডিকেল মোড়
                </span>
                <span className="block text-[11px] text-gray-500">
                  পলাশ, নরসিংদী • Plus Code: XJFQ+H2 Palash
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://maps.app.goo.gl/ESVAyVjEDpS2585JA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#2D8FC1] hover:bg-[#23749D] text-white text-xs font-semibold px-3 py-2 rounded-xl transition shrink-0 shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>৩৬০° স্ট্রিট ভিউ</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=XJFQ%2BH2+Palash"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-semibold px-3 py-2 rounded-xl transition shrink-0 shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5 text-[#C9973B]" />
                <span>ডিরেকশন নিন</span>
                <ExternalLink className="w-3 h-3 text-[#C9973B]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
