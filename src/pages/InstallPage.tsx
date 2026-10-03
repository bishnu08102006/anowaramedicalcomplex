import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Apple, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  PlusSquare, 
  MoreVertical, 
  ArrowRight,
  Zap,
  Phone,
  Calendar
} from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { useLanguage } from '../context/LanguageContext';
import { PageId } from '../components/Header';

interface InstallPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: PageId) => void;
}

export const InstallPage: React.FC<InstallPageProps> = ({ onNavigateHome, onNavigate }) => {
  const { isBn } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<'android' | 'ios' | 'pc'>('android');

  useEffect(() => {
    // Detect if already installed (standalone mode)
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
        || (window.navigator as any).standalone 
        || document.referrer.includes('android-app://');
      setIsInstalled(!!isStandalone);
    };

    checkInstalled();

    // Auto detect user platform for default tab
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setSelectedDevice('ios');
    } else if (/android/i.test(userAgent)) {
      setSelectedDevice('android');
    } else {
      setSelectedDevice('pc');
    }

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallSuccess(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstallSuccess(true);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // If prompt isn't directly available (iOS or browser already handled), scroll to guide
      const guideEl = document.getElementById('device-install-guide');
      if (guideEl) {
        guideEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div id="install-page" className="min-h-screen bg-[#F8FAFB]">
      <PageBanner
        title={isBn ? "আপনার ডিভাইসে অ্যাপ ইনস্টল করুন" : "Install In Your Device"}
        subtitle={isBn 
          ? "ব্রাউজারের ঝামেলা ছাড়াই ফোন ও কম্পিউটারের হোমস্ক্রিনে ১-ক্লিকে আনোয়ারা মেডিকেল কমপ্লেক্স ব্যবহার করুন।" 
          : "Install the official hospital app on your phone, tablet, or desktop for instant 1-click access."}
        icon={Download}
        badge={isBn ? "অফিসিয়াল অ্যাপ ও পিডব্লিউএ" : "Official PWA App"}
        currentPageName={isBn ? "অ্যাপ ইনস্টল" : "Install App"}
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Installation Showcase Card */}
        <div className="bg-gradient-to-br from-[#0E3A53] via-[#0A2A3D] to-[#061B27] rounded-3xl p-6 sm:p-10 shadow-xl text-white mb-10 border border-white/10 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2D8FC1]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#C9973B]/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10">
            {/* Left: App Logo & Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              {/* App Icon Tile */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white p-2.5 shadow-2xl border-2 border-white/40 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 duration-300">
                  <img 
                    src="/hospital-logo.png" 
                    alt="আনোয়ারা মেডিকেল কমপ্লেক্স অফিসিয়াল অ্যাপ লোগো" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#F7EEDC] mb-2 border border-white/15">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9973B]" />
                  <span>{isBn ? "অফিসিয়াল হাসপাতাল অ্যাপ্লিকেশন" : "Official Hospital App"}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-1">
                  {isBn ? "আনোয়ারা মেডিকেল কমপ্লেক্স" : "Anowara Medical Complex"}
                </h2>
                <p className="text-sm text-[#2D8FC1] font-bold mb-3">
                  {isBn ? "পলাশ, নরসিংদী • ২৪/৭ স্বাস্থ্যসেবা পোর্টাল" : "Palash, Narsingdi • 24/7 Healthcare Portal"}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-white/80">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{isBn ? "নিরাপদ ও ভেরিফাইড" : "Safe & Verified"}</span>
                  </span>
                  <span>•</span>
                  <span>{isBn ? "সাইজ: < ১ MB (লাইটওয়েট)" : "Size: < 1 MB (Ultra-Light)"}</span>
                  <span>•</span>
                  <span className="text-[#C9973B] font-semibold">{isBn ? "প্লে স্টোর অ্যাকাউন্ট ছাড়াই" : "No App Store Needed"}</span>
                </div>
              </div>
            </div>

            {/* Right: Direct Install Action Button */}
            <div className="shrink-0 w-full md:w-auto flex flex-col items-center gap-3">
              {isInstalled || installSuccess ? (
                <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-5 text-center w-full sm:w-72">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    {isBn ? "অ্যাপ সফলভাবে ইনস্টল করা আছে!" : "App Successfully Installed!"}
                  </h4>
                  <p className="text-xs text-emerald-200 mt-1 mb-3">
                    {isBn ? "আপনার ডিভাইসের হোমস্ক্রিন বা অ্যাপ মেনু থেকে সরাসরি ওপেন করুন।" : "You can now open it directly from your home screen."}
                  </p>
                  <button
                    onClick={onNavigateHome}
                    className="w-full bg-white hover:bg-gray-100 text-[#0E3A53] font-bold text-xs py-2.5 rounded-xl shadow transition cursor-pointer"
                  >
                    {isBn ? "হোম পেজে যান" : "Go to Home"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 w-full sm:w-72">
                  <button
                    id="install-device-btn"
                    onClick={handleInstallClick}
                    className="w-full bg-[#C9973B] hover:bg-[#d8a547] text-[#0A2A3D] font-extrabold text-base sm:text-lg px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer group"
                  >
                    <Download className="w-6 h-6 group-hover:animate-bounce" />
                    <span>{isBn ? "ইনস্টল করুন (Install Now)" : "Install In Your Device"}</span>
                  </button>
                  <p className="text-[11px] text-white/70 text-center">
                    {isBn ? "ক্লিক করে ১ সেকেন্ডেই ফোনে বা কম্পিউটারে ইনস্টল করুন" : "Click to install directly on phone, tablet or PC"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Grid (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C9973B] flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#0E3A53] text-sm mb-1">
              {isBn ? "১-ক্লিকে তাৎক্ষণিক ওপেন" : "1-Click Instant Open"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {isBn ? "ব্রাউজারে লিঙ্ক খোঁজা বা টাইপ করার ঝামেলা নেই। হোম স্ক্রিনে অ্যাপ আইকনে ট্যাপ করলেই ওপেন হবে।" : "Open instantly from your home screen without typing web addresses."}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2D8FC1] flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#0E3A53] text-sm mb-1">
              {isBn ? "জরুরি হটলাইনে দ্রুত ডায়াল" : "Direct Emergency Dialing"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {isBn ? "অ্যাম্বুলেন্স ও রিসেপশনে মাত্র এক ক্লিকে ২৪ ঘণ্টা জরুরি কল করার সার্বক্ষণিক সুবিধা।" : "Instant access to 24/7 emergency ambulance & doctor appointment desk."}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#0E3A53] text-sm mb-1">
              {isBn ? "সহজে সিরিয়াল বুকিং ও স্লিপ" : "Fast Serial Slip Download"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {isBn ? "বিশেষজ্ঞ ডাক্তারদের চেম্বার শিডিউল দেখা এবং সরাসরি অ্যাপ থেকে সিরিয়াল স্লিপ ডাউনলোড করা যায়।" : "Check daily doctor visiting hours & save digital appointment slips easily."}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#0E3A53] text-sm mb-1">
              {isBn ? "কোনো মেমরি খরচ নেই" : "Zero Storage Burden"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {isBn ? "১ মেগাবাইটেরও কম সাইজ! ফোন স্লো হবে না এবং কোনো বাড়তি পারমিশন প্রয়োজন হয় না।" : "Ultra-lightweight PWA technology takes virtually zero device storage."}
            </p>
          </div>
        </div>

        {/* Step-by-Step Device Guide */}
        <div id="device-install-guide" className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#2D8FC1] uppercase tracking-wider block mb-1">
              {isBn ? "সহজ ইনস্টলেশন নির্দেশিকা" : "Simple Installation Guide"}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0E3A53]">
              {isBn ? "আপনার ডিভাইসে কীভাবে ইনস্টল করবেন?" : "How To Install On Your Device"}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {isBn ? "নিচের তালিকা থেকে আপনার ডিভাইস বা অপারেটিং সিস্টেম নির্বাচন করুন:" : "Select your platform below to view instructions:"}
            </p>
          </div>

          {/* Platform Switcher Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-gray-100 rounded-2xl gap-1">
              <button
                onClick={() => setSelectedDevice('android')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  selectedDevice === 'android'
                    ? 'bg-[#0E3A53] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Android (Chrome)</span>
              </button>

              <button
                onClick={() => setSelectedDevice('ios')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  selectedDevice === 'ios'
                    ? 'bg-[#0E3A53] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Apple className="w-4 h-4 text-gray-200" />
                <span>iPhone / iPad (Safari)</span>
              </button>

              <button
                onClick={() => setSelectedDevice('pc')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  selectedDevice === 'pc'
                    ? 'bg-[#0E3A53] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Monitor className="w-4 h-4 text-[#2D8FC1]" />
                <span>Computer / PC</span>
              </button>
            </div>
          </div>

          {/* Instructions Content */}
          <div className="max-w-2xl mx-auto">
            {selectedDevice === 'android' && (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-[#0E3A53] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    ১
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0E3A53] text-sm mb-1">
                      {isBn ? "উপরের 'ইনস্টল করুন' বাটনে চাপ দিন" : "Click the 'Install Now' button above"}
                    </h5>
                    <p className="text-xs text-gray-600">
                      {isBn 
                        ? "ব্রাউজারে একটি পপ-আপ আসবে, সেখানে 'Install' বা 'যোগ করুন' বাটনে ক্লিক করুন।" 
                        : "Click 'Install' on the browser confirmation prompt."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-[#0E3A53] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    ২
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0E3A53] text-sm mb-1 flex items-center gap-1.5">
                      <span>{isBn ? "বিকল্প পদ্ধতি: ব্রাউজার মেনু থেকে" : "Alternative: From Browser Menu"}</span>
                      <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
                    </h5>
                    <p className="text-xs text-gray-600">
                      {isBn 
                        ? "ক্রোম ব্রাউজারের উপরে ডানদিকের ৩টি ডট (⋮) মেনুতে ট্যাপ করুন এবং 'Install app' বা 'Add to Home screen' নির্বাচন করুন।" 
                        : "Tap the 3 dots (⋮) menu on Chrome and select 'Install app' or 'Add to Home screen'."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedDevice === 'ios' && (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-[#0E3A53] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    ১
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0E3A53] text-sm mb-1 flex items-center gap-1.5">
                      <span>{isBn ? "Safari ব্রাউজারে শেয়ার বাটন চাপুন" : "Tap Safari Share button"}</span>
                      <Share2 className="w-4 h-4 text-blue-600" />
                    </h5>
                    <p className="text-xs text-gray-600">
                      {isBn 
                        ? "iPhone বা iPad-এর Safari ব্রাউজারের নিচের মাঝখানের শেয়ার আইকনটিতে (Share Button) ট্যাপ করুন।" 
                        : "Tap the Share icon at the bottom of Safari browser."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-[#0E3A53] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    ২
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0E3A53] text-sm mb-1 flex items-center gap-1.5">
                      <span>{isBn ? "'Add to Home Screen' চাপুন" : "Select 'Add to Home Screen'"}</span>
                      <PlusSquare className="w-4 h-4 text-emerald-600" />
                    </h5>
                    <p className="text-xs text-gray-600">
                      {isBn 
                        ? "মেনু থেকে কিছুটা নিচে স্ক্রল করে 'Add to Home Screen' (হোম স্ক্রিনে যোগ করুন) নির্বাচন করে উপরে 'Add' বাটনে চাপ দিন।" 
                        : "Scroll down the share sheet and tap 'Add to Home Screen', then tap 'Add'."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedDevice === 'pc' && (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-[#0E3A53] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    ১
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0E3A53] text-sm mb-1">
                      {isBn ? "ব্রাউজারের অ্যাড্রেস বার লক্ষ্য করুন" : "Check Browser Address Bar"}
                    </h5>
                    <p className="text-xs text-gray-600">
                      {isBn 
                        ? "Chrome বা Edge ব্রাউজারের অ্যাড্রেস বারের একদম ডানদিকে ইনস্টল আইকন (⊕) দেখতে পাবেন। সেখানে ক্লিক করুন।" 
                        : "Click the Install icon (⊕) located at the far right of the address bar in Chrome or Edge."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-[#0E3A53] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    ২
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0E3A53] text-sm mb-1">
                      {isBn ? "'Install' এ ক্লিক করলেই ডেস্কটপ আইকন তৈরি হবে" : "Click 'Install' to create Desktop shortcut"}
                    </h5>
                    <p className="text-xs text-gray-600">
                      {isBn 
                        ? "ইনস্টল সম্পন্ন হলে আপনার কম্পিউটার ডেস্কটপ ও টাস্কবারে আনোয়ারা মেডিকেল কমপ্লেক্স এর অফিশিয়াল লোগোযুক্ত অ্যাপ উইন্ডো হিসেবে ওপেন হবে।" 
                        : "The app will launch in its own standalone window with official hospital logo on desktop and taskbar."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
