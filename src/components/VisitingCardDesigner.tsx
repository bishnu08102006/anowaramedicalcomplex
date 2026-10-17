import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, RotateCcw } from 'lucide-react';
import { getVisualDesignerData, saveVisualDesignerData } from '../lib/firebase';

const FRONT_TEMPLATE_URL = 'https://i.postimg.cc/XvPWbjxq/4.png';
const BACK_TEMPLATE_URL = 'https://i.postimg.cc/L886F6Lc/DBEFFA.png';

const DEFAULTS = {
  name: 'MD. Nazmul Hossain Bhuiya Sohel',
  designation: 'Director',
  mobile: '+8801717-439696',
  email: 'shohel.media@gmail.com',
  nameSize: 45,
  designationSize: 36,
  emailSize: 30,
};

type CardInfo = typeof DEFAULTS;
type ImageStatus = 'loading' | 'ready' | 'error';

const isCardInfo = (value: unknown): value is CardInfo => {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<keyof CardInfo, unknown>;
  return typeof data.name === 'string'
    && typeof data.designation === 'string'
    && typeof data.mobile === 'string'
    && typeof data.email === 'string'
    && typeof data.nameSize === 'number'
    && typeof data.designationSize === 'number'
    && typeof data.emailSize === 'number';
};

export const VisitingCardDesigner: React.FC = () => {
  const [cardInfo, setCardInfo] = useState<CardInfo>({ ...DEFAULTS });
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);
  const [cloudState, setCloudState] = useState<'loading' | 'saving' | 'saved' | 'error'>('loading');
  const [frontStatus, setFrontStatus] = useState<ImageStatus>('loading');
  const [backStatus, setBackStatus] = useState<ImageStatus>('loading');
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [notice, setNotice] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frontImageRef = useRef<HTMLImageElement | null>(null);
  const backImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    getVisualDesignerData<unknown>('visiting-card')
      .then((saved) => {
        if (!isMounted) return;
        if (saved !== null && !isCardInfo(saved)) {
          throw new Error('Invalid saved visiting card data');
        }
        if (saved) setCardInfo(saved);
        setIsCloudLoaded(true);
        setCloudState('saved');
      })
      .catch((error) => {
        console.error('Could not load visiting card data from Firestore:', error);
        if (isMounted) setCloudState('error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isCloudLoaded) return;
    let isMounted = true;
    setCloudState('saving');
    const timer = window.setTimeout(() => {
      saveVisualDesignerData('visiting-card', cardInfo)
        .then(() => {
          if (isMounted) setCloudState('saved');
        })
        .catch((error) => {
          console.error('Could not save visiting card data to Firestore:', error);
          if (isMounted) setCloudState('error');
        });
    }, 500);
    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [cardInfo, isCloudLoaded]);

  useEffect(() => {
    let isMounted = true;
    const frontImage = new Image();
    const backImage = new Image();
    frontImage.crossOrigin = 'anonymous';
    backImage.crossOrigin = 'anonymous';

    frontImage.onload = () => {
      if (!isMounted) return;
      frontImageRef.current = frontImage;
      setFrontStatus('ready');
    };
    frontImage.onerror = () => isMounted && setFrontStatus('error');
    backImage.onload = () => {
      if (!isMounted) return;
      backImageRef.current = backImage;
      setBackStatus('ready');
    };
    backImage.onerror = () => isMounted && setBackStatus('error');

    frontImage.src = FRONT_TEMPLATE_URL;
    backImage.src = BACK_TEMPLATE_URL;

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const image = frontImageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (frontStatus !== 'ready' || !image || !canvas || !context) return;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const scaleX = canvas.width / 1050;
    const scaleY = canvas.height / 600;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
    context.fillStyle = '#e58e27';
    context.font = `bold ${cardInfo.nameSize * scaleY}px Inter, sans-serif`;
    context.fillText(cardInfo.name.trim() || DEFAULTS.name, 110 * scaleX, 132 * scaleY, 900 * scaleX);

    context.fillStyle = '#1e293b';
    context.font = `600 ${cardInfo.designationSize * scaleY}px Inter, sans-serif`;
    context.fillText(cardInfo.designation.trim() || DEFAULTS.designation, 110 * scaleX, 186 * scaleY, 450 * scaleX);

    context.font = `bold ${34 * scaleY}px Inter, sans-serif`;
    context.fillText(cardInfo.mobile.trim() || '+880', 615 * scaleX, 240 * scaleY, 400 * scaleX);

    context.fillStyle = '#9c1b1b';
    context.font = `bold ${cardInfo.emailSize * scaleY}px Inter, sans-serif`;
    context.fillText(cardInfo.email.trim() || 'email@example.com', 615 * scaleX, 300 * scaleY, 400 * scaleX);
  }, [cardInfo, frontStatus]);

  const updateField = <K extends keyof CardInfo>(field: K, value: CardInfo[K]) => {
    setCardInfo((current) => ({ ...current, [field]: value }));
  };

  const downloadImage = (side: 'front' | 'back') => {
    const image = side === 'front' ? frontImageRef.current : backImageRef.current;
    if (!image) {
      setNotice(side === 'front' ? 'ফ্রন্ট টেমপ্লেট এখনো প্রস্তুত নয়।' : 'ব্যাক টেমপ্লেট এখনো প্রস্তুত নয়।');
      return;
    }

    try {
      let dataUrl: string;
      if (side === 'front') {
        const canvas = canvasRef.current;
        if (!canvas) return;
        dataUrl = canvas.toDataURL('image/png');
      } else {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) return;
        context.drawImage(image, 0, 0);
        dataUrl = canvas.toDataURL('image/png');
      }

      const link = document.createElement('a');
      const safeName = cardInfo.name.trim().replace(/[^a-zA-Z0-9\s_-]/g, '').trim().replace(/\s+/g, '_');
      link.download = side === 'front'
        ? `${safeName || 'Visiting_Card'}_Anowara_Medical_Front.png`
        : 'Anowara_Medical_Back_Side.png';
      link.href = dataUrl;
      link.click();
      setNotice(side === 'front' ? 'ফ্রন্ট সাইড ডাউনলোড হয়েছে।' : 'ব্যাক সাইড ডাউনলোড হয়েছে।');
    } catch {
      setNotice('ডাউনলোড করা যায়নি। টেমপ্লেট ইমেজের CORS অনুমতি পরীক্ষা করুন।');
    }
  };

  const copyDetails = async () => {
    const text = `Name: ${cardInfo.name}\nRole: ${cardInfo.designation}\nPhone: ${cardInfo.mobile}\nEmail: ${cardInfo.email}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    setNotice('কার্ডের তথ্য ক্লিপবোর্ডে কপি হয়েছে।');
  };

  const resetCard = () => {
    setCardInfo({ ...DEFAULTS });
    setNotice('কার্ডের তথ্য রিসেট হয়েছে।');
  };

  const textInput = (field: 'name' | 'designation' | 'mobile' | 'email', label: string, type = 'text') => (
    <label className="block text-xs font-semibold text-gray-700">
      {label}
      <input
        type={type}
        value={cardInfo[field]}
        onChange={(event) => updateField(field, event.target.value)}
        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <header className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h4 className="font-bold text-[#0E3A53]">ভিজিটিং কার্ড ডিজাইনার</h4>
          <p className="mt-1 text-xs text-gray-500">তথ্য সম্পাদনা করুন, প্রিভিউ দেখুন এবং প্রিন্টের জন্য PNG ডাউনলোড করুন।</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${frontStatus === 'ready' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : frontStatus === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
            <span className={`h-2 w-2 rounded-full ${frontStatus === 'ready' ? 'bg-emerald-500' : frontStatus === 'error' ? 'bg-red-500' : 'animate-pulse bg-amber-500'}`} />
            {frontStatus === 'ready' ? 'টেমপ্লেট প্রস্তুত' : frontStatus === 'error' ? 'টেমপ্লেট লোড হয়নি' : 'টেমপ্লেট লোড হচ্ছে'}
          </span>
          <span role="status" className={`text-[11px] font-semibold ${cloudState === 'error' ? 'text-red-700' : cloudState === 'saved' ? 'text-emerald-700' : 'text-amber-700'}`}>
            {cloudState === 'error' ? 'সার্ভারে সেভ/লোড হয়নি' : cloudState === 'saved' ? 'সার্ভারে সেভ হয়েছে' : cloudState === 'saving' ? 'সার্ভারে সেভ হচ্ছে' : 'সার্ভার থেকে লোড হচ্ছে'}
          </span>
          <button type="button" onClick={resetCard} title="তথ্য রিসেট" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-4 border-b border-gray-100 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          {textInput('name', 'ব্যক্তির নাম')}
          {textInput('designation', 'পদবি')}
          {textInput('mobile', 'মোবাইল নম্বর', 'tel')}
          {textInput('email', 'ইমেইল ঠিকানা', 'email')}

          <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
            {([
              ['nameSize', 'নামের সাইজ', 30, 65],
              ['designationSize', 'পদবির সাইজ', 20, 50],
              ['emailSize', 'ইমেইলের সাইজ', 20, 45],
            ] as const).map(([field, label, min, max]) => (
              <label key={field} className="min-w-0 text-[11px] font-semibold text-gray-600">
                <span className="block min-h-8">{label}<span className="block text-emerald-700">{cardInfo[field]}px</span></span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={cardInfo[field]}
                  onChange={(event) => updateField(field, Number(event.target.value))}
                  className="w-full accent-emerald-700"
                  aria-label={label}
                />
              </label>
            ))}
          </div>

          <div className="grid gap-2 border-t border-gray-100 pt-4 sm:grid-cols-2">
            <button type="button" onClick={() => downloadImage('front')} disabled={frontStatus !== 'ready'} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
              <Download className="h-4 w-4" /> ফ্রন্ট PNG
            </button>
            <button type="button" onClick={() => downloadImage('back')} disabled={backStatus !== 'ready'} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0E3A53] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#092b3e] disabled:cursor-not-allowed disabled:opacity-50">
              <Download className="h-4 w-4" /> ব্যাক PNG
            </button>
            <button type="button" onClick={copyDetails} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 sm:col-span-2">
              <Copy className="h-4 w-4" /> তথ্য কপি করুন
            </button>
          </div>
        </div>

        <div className="min-w-0 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h5 className="text-sm font-bold text-[#0E3A53]">কার্ড প্রিভিউ</h5>
              <p className="mt-0.5 text-xs text-gray-500">লাইভ ডিজাইন · 300 DPI সোর্স ইমেজ</p>
            </div>
            <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1" role="group" aria-label="কার্ডের পাশ নির্বাচন">
              <button type="button" onClick={() => setActiveSide('front')} aria-pressed={activeSide === 'front'} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${activeSide === 'front' ? 'bg-white text-[#0E3A53] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>ফ্রন্ট</button>
              <button type="button" onClick={() => setActiveSide('back')} aria-pressed={activeSide === 'back'} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${activeSide === 'back' ? 'bg-white text-[#0E3A53] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>ব্যাক</button>
            </div>
          </div>

          <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%),linear-gradient(-45deg,#f3f4f6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f3f4f6_75%),linear-gradient(-45deg,transparent_75%,#f3f4f6_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-3 sm:p-5">
            {activeSide === 'front' && frontStatus === 'ready' && (
              <canvas ref={canvasRef} className="h-auto max-w-full rounded-md shadow-lg" aria-label="ভিজিটিং কার্ডের ফ্রন্ট প্রিভিউ" />
            )}
            {activeSide === 'back' && backStatus === 'ready' && (
              <img src={BACK_TEMPLATE_URL} alt="ভিজিটিং কার্ডের ব্যাক ডিজাইন" className="h-auto max-w-full rounded-md shadow-lg" />
            )}
            {((activeSide === 'front' && frontStatus !== 'ready') || (activeSide === 'back' && backStatus !== 'ready')) && (
              <p className={`max-w-sm text-center text-xs ${frontStatus === 'error' || backStatus === 'error' ? 'text-red-700' : 'text-gray-500'}`}>
                {(activeSide === 'front' ? frontStatus : backStatus) === 'error'
                  ? 'টেমপ্লেট ইমেজ লোড হয়নি। ইন্টারনেট সংযোগ বা ইমেজ সার্ভারের CORS অনুমতি পরীক্ষা করুন।'
                  : 'টেমপ্লেট ইমেজ লোড হচ্ছে...'}
              </p>
            )}
          </div>

          {notice && (
            <p role="status" className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-800">
              <Check className="h-4 w-4 shrink-0" /> {notice}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};