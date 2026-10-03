import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Bot, 
  User, 
  MapPin, 
  Phone, 
  Stethoscope, 
  Activity, 
  Loader2,
  ChevronDown,
  Calendar,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Doctor } from '../data/doctors';
import { DiagnosticTest } from '../data/tests';

/**
 * ------------------------------------------------------------------
 * GEMINI API CONFIGURATION PLACEHOLDERS
 * Replace these placeholder values with your Gemini API credentials if desired.
 * Note: The app automatically detects environment/runtime keys as well.
 * ------------------------------------------------------------------
 */
export const YOUR_GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
export const YOUR_GEMINI_KEY_NAME = "YOUR_KEY_NAME";

// Supported active Gemini flash models in order of priority
const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface HospitalAiChatbotProps {
  onNavigate?: (page: any) => void;
}

export const HospitalAiChatbot: React.FC<HospitalAiChatbotProps> = ({ onNavigate }) => {
  const { isBn } = useLanguage();
  const { doctors, diagnosticTests, notices } = useData();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcoming message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          role: 'model',
          text: isBn
            ? "আসসালামু আলাইকুম! আমি **আনোয়ারা মেডিকেল কমপ্লেক্স**-এর বুদ্ধিমান এআই সহকারী। 🏥✨\n\nআমি আপনাকে আন্তরিকভাবে সাহায্য করতে এখানে আছি। আপনি জানতে পারেন:\n• **বিশেষজ্ঞ ডাক্তারদের তালিকা, ভিজিটিং দিন ও সময়সূচি**\n• **রোগের ধরন অনুযায়ী কোন ডাক্তারের কাছে যাবেন**\n• **প্যাথলজি ও ডায়াগনস্টিক ল্যাব টেস্টের সঠিক ফি ও ডেলিভারি সময়**\n• **২৪ ঘণ্টা জরুরি সেবা, অ্যাম্বুলেন্স ও হটলাইন নম্বর**\n• **ওয়েবসাইটে অনলাইনে ডাক্তারের সিরিয়াল বুকিং ও নোটিশ ডাউনলোড**\n• **হাসপাতালের অবস্থান ও যোগাযোগের তথ্য**\n\nবলুন, আজ আপনাকে কীভাবে সহায়তা করতে পারি?"
            : "Hello and welcome to **Anowara Medical Complex**! 🏥✨\n\nI am your intelligent AI healthcare assistant. I can thoughtfully assist you with:\n• Specialist doctor visiting schedules and chamber info\n• Guidance on which specialist to consult based on your symptoms\n• Diagnostic lab test pricing, fasting guidelines, and turnaround times\n• 24/7 Emergency care, hospital ambulance, and hotlines\n• Website features (booking online serials, downloading notices in PDF)\n• Hospital location in Palash, Narsingdi\n\nHow may I help you today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isBn]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  // Construct comprehensive system instruction grounded strictly in hospital information & intelligent persona
  const buildSystemInstruction = (doctorList: Doctor[], testList: DiagnosticTest[]): string => {
    const doctorsSummary = (doctorList || []).map(d => 
      `- ${d.name} (${d.nameEn || ''}): ${d.specialty} | ডিগ্রি: ${d.degree || ''} | চেম্বার সময়: ${d.time || 'নির্ধারিত সময়ে'} | দিন: ${d.days ? d.days.join(', ') : 'নির্ধারিত দিনে'} | রুম: ${d.room || 'চেম্বার'} | সিরিয়াল নম্বর: ${d.phone || '01972-692504 / 01944-874304'}`
    ).join('\n');

    const testsSummary = (testList || []).slice(0, 60).map(t => 
      `- ${t.name} (${t.banglaName || ''}): ফি ${t.price} (${t.priceEn || ''}) | ক্যাটাগরি: ${t.category === 'pathology' ? 'প্যাথলজি ল্যাব' : 'রেডিওলজি/ইমেজিং'} | ডেলিভারি সময়: ${t.deliveryTime}${t.fastingRequired ? ' (খালি পেটে পরীক্ষা করা আবশ্যক)' : ' (স্বাভাবিক খাওয়ার পর করা যায়)'}`
    ).join('\n');

    return `You are the thoughtful, highly empathetic, and intelligent official AI Health Assistant for Anowara Medical Complex (আনোয়ারা মেডিকেল কমপ্লেক্স), located in Palash, Narsingdi, Bangladesh.

CORE PERSONALITY & INTELLIGENT THINKING RULES:
1. THINK BEFORE ANSWERING: Do NOT simply dump raw data. Act like a knowledgeable, caring hospital information consultant.
2. GREETINGS & CASUAL COURTESY: When someone says "Hello", "Hi", "হ্যালো", "হাই", "কেমন আছেন", "আসসালামু আলাইকুম", "শুভ সকাল", or "ধন্যবাদ", respond warmly, politely, and naturally like a caring human assistant, acknowledging their greeting and welcoming them to Anowara Medical Complex.
3. SYMPTOM REASONING: If a user describes physical symptoms (e.g., chest pain, baby fever, pregnancy checkup, joint pain, skin rash), explain what type of specialist they should see (e.g. Cardiologist for chest pain, Pediatrician for child fever, Gynecologist for maternity), suggest relevant doctors from our hospital list, provide their chamber schedule and phone numbers, and remind them that our Emergency Department is open 24 hours.
4. MEDICAL TEST PREPARATION & EDUCATION: When asked about a diagnostic test (e.g. CBC, Ultrasound, Creatinine, Lipid profile, ECG), explain simply why doctors order it, whether fasting is required, and give our hospital's exact fee and turnaround time.
5. WEBSITE NAVIGATION & FEATURES: Explain how patients can use our website:
   - How to book a serial online (go to the "সিরিয়াল বুকিং" / Appointment page and fill the form).
   - How to download doctor schedule lists or notices in PDF.
   - How to verify hospital staff ID card via QR code.
   - Where to find health blogs and announcements.
6. STRICT REFUSAL OF OUT-OF-SCOPE TOPICS:
   - If the user asks you to do something completely unrelated to hospital services or healthcare (e.g., "write python code", "solve math homework", "write a movie essay", "discuss political leaders", "generate creative AI stories/crypto/finance"), POLITELY REFUSE.
   - Refusal in Bengali: "দুঃখিত, আমি আনোয়ারা মেডিকেল কমপ্লেক্সের চিকিৎসা সেবা, বিশেষজ্ঞ ডাক্তারদের শিডিউল, টেস্টের ফি এবং হাসপাতালের তথ্যাবলী ও ওয়েবসাইট সহায়তার জন্য বিশেষভাবে নিয়োজিত। হাসপাতাল বা স্বাস্থ্য সম্পর্কিত যেকোনো তথ্যে আমি আপনাকে সাহায্য করতে প্রস্তুত।"
   - Refusal in English: "I apologize, but I am specifically dedicated to providing information and assistance regarding Anowara Medical Complex's healthcare services, doctors, diagnostic tests, and hospital facilities. How may I assist you with our hospital?"
7. LANGUAGE & TONE: Prefer standard, respectful Bengali (using আপনি/আপনার). If the user communicates in English, answer fluently and courteously in English.

HOSPITAL PROFILE & CONTACTS:
- Hospital Name: আনোয়ারা মেডিকেল কমপ্লেক্স (Anowara Medical Complex)
- Location & Address: ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী (WAPDA Sadar Road, Medical Mor, Palash, Narsingdi)
- Emergency / Reception Hotline (24/7): 01972-692504, 01944-874304
- Hospital Authority Hotline: 01712-692504
- Serial Booking Hotline: 01944-874304, 01972-692504
- Website: anowaramedicalcomplex.com
- Key Facilities:
  * ২৪ ঘণ্টা জরুরি বিভাগ (24/7 Emergency Care with on-duty MBBS medical officers)
  * ইনডোর ও আউটডোর সেবা (Inpatient Admission & OPD)
  * ২৪ ঘণ্টা নিজস্ব আধুনিক অ্যাম্বুলেন্স সেবা
  * আধুনিক ডিজিটাল প্যাথলজি ও বায়োকেমিস্ট্রি ল্যাব
  * ৪ডি কালার ডপলার আল্ট্রাসনোগ্রাম (4D USG)
  * ৫০০ এমএ ডিজিটাল এক্স-রে (High-Resolution Digital X-Ray)
  * ১২ চ্যানেল ডিজিটাল ইসিজি (12-Channel ECG)
  * অত্যাধুনিক মেজর ও মাইনর অপারেশন থিয়েটার (OT)
  * সার্বক্ষণিক ইন-হাউজ ফার্মেসি
  * অভিজ্ঞ বিশেষজ্ঞ কনসালট্যান্ট চেম্বার

DOCTORS & VISITING SCHEDULE:
${doctorsSummary}

DIAGNOSTIC TEST CHARGES & PREPARATION:
${testsSummary}`;
  };

  // Smart local reasoning fallback when network is offline or key missing
  const generateIntelligentLocalFallback = (promptText: string): string => {
    const text = promptText.toLowerCase().trim();

    // 1. Greetings & Courtesy
    if (/^(হাই|হ্যালো|hello|hi|helo|hey|কেমন আছেন|সালাম|আসসালামু|নমস্কার|good morning|good evening)/i.test(text)) {
      return "ওয়ালাইকুম আসসালাম! হ্যালো! আলহামদুলিল্লাহ, আমি ভালো আছি। আশা করি আপনিও সুস্থ ও ভালো আছেন। 🌸\n\n**আনোয়ারা মেডিকেল কমপ্লেক্স (পলাশ, নরসিংদী)**-এর পক্ষ থেকে আপনাকে উষ্ণ স্বাগতম!\n\nআজ আপনাকে কীভাবে সাহায্য করতে পারি? বিশেষজ্ঞ ডাক্তারের সময়সূচি, কোনো টেস্টের ফি, কিংবা জরুরি অ্যাম্বুলেন্স প্রয়োজন হলে জানান।";
    }

    if (text.includes('ধন্যবাদ') || text.includes('thank') || text.includes('shukriya')) {
      return "আপনাকেও আন্তরিক ধন্যবাদ! আপনার বা আপনার পরিবারের সুস্বাস্থ্যই আমাদের প্রধান লক্ষ্য। আনোয়ারা মেডিকেল কমপ্লেক্স সর্বদা আপনার পাশে আছে। প্রয়োজনে আবার জানাবেন।";
    }

    // 2. Out-of-Scope non-hospital tasks (code, homework, politics, non-medical AI generation)
    if (text.includes('কোড') || text.includes('code') || text.includes('python') || text.includes('javascript') || text.includes('অংক') || text.includes('math') || text.includes('রাজনীতি') || text.includes('কবিতা') || text.includes('গল্প') || text.includes('essay')) {
      return "দুঃখিত, আমি শুধুমাত্র **আনোয়ারা মেডিকেল কমপ্লেক্স**-এর চিকিৎসা সেবা, বিশেষজ্ঞ ডাক্তারদের শিডিউল, টেস্টের মূল্য তালিকা এবং হাসপাতালের ওয়েবসাইট সম্পর্কিত তথ্য সহায়তার জন্য বিশেষভাবে দায়িত্বপ্রাপ্ত।\n\nহাসপাতাল বা স্বাস্থ্য সম্পর্কিত যেকোনো তথ্যে আমি আপনাকে সাহায্য করতে প্রস্তুত।";
    }

    // 3. Symptoms & Doctor Recommendations
    if (text.includes('বুকে ব্যথা') || text.includes('হার্ট') || text.includes('heart') || text.includes('chest pain')) {
      return "বুকে ব্যথা একটি অত্যন্ত সংবেদনশীল লক্ষণ। এটি হলে কোনো অবহেলা না করে অবিলম্বে আমাদের হাসপাতালে আসুন।\n\n• **জরুরি বিভাগ:** আমাদের জরুরি বিভাগ ২৪ ঘণ্টা খোলা রয়েছে (হটলাইন: **01972-692504**)।\n• **বিশেষজ্ঞ চিকিৎসক:** আমাদের হৃদরোগ ও মেডিসিন কনসালট্যান্ট চেম্বার পরিচালনা করেন।\n• **পরীক্ষা:** তাৎক্ষণিক ১২-চ্যানেল ইসিজি (ECG) ও ট্রপোনিন-আই টেস্টের সুবিধা রয়েছে।\n\nঅবস্থা গুরুতর হলে অবিলম্বে হাসপাতালে আসার পরামর্শ দেওয়া হচ্ছে।";
    }

    if (text.includes('বাচ্চা') || text.includes('শিশু') || text.includes('baby') || text.includes('child') || text.includes('জ্বর')) {
      return "বাচ্চাদের অসুস্থতা বা জ্বরের ক্ষেত্রে আমাদের শিশু রোগ বিশেষজ্ঞ কনসালট্যান্টের সাথে পরামর্শ করতে পারেন।\n\n• **শিশু স্বাস্থ্য বিভাগ:** অভিজ্ঞ শিশু রোগ বিশেষজ্ঞ নিয়মিত চেম্বার করেন।\n• **জরুরি সেবা:** রাতে বা জরুরি সময়ে আমাদের জরুরি মেডিকেল অফিসার উপস্থিত থাকেন।\n• **সিরিয়াল বুকিং:** **01944-874304** বা **01972-692504** নম্বরে কল করে শিশু বিশেষজ্ঞের সিরিয়াল নিশ্চিত করতে পারেন।";
    }

    if (text.includes('গাইনী') || text.includes('মহিলা') || text.includes('প্রসূতি') || text.includes('pregnancy') || text.includes('gynae')) {
      return "আমাদের হাসপাতালে গাইনী ও প্রসূতি রোগের অভিজ্ঞ কনসালট্যান্ট চেম্বার পরিচালনা করেন এবং নিয়মিত নরমাল ডেলিভারি ও সিজারিয়ান অপারেশনের আধুনিক সুবিধা রয়েছে।\n\n• ৪ডি কালার ডপলার আল্ট্রাসনোগ্রাম (USG of Pregnancy Profile) প্রতিদিন বিশেষজ্ঞ সনোলজিস্ট দ্বারা সম্পন্ন করা হয়।\n• সিরিয়াল বুকিং হটলাইন: **01944-874304**।";
    }

    // 4. Doctor Schedules
    if (text.includes('ডাক্তার') || text.includes('doctor') || text.includes('শিডিউল') || text.includes('চেম্বার') || text.includes('তালিকা')) {
      const topDocs = doctors.slice(0, 5).map(d => `• **${d.name}** (${d.specialty})\n  ডিগ্রি: ${d.degree} | চেম্বার: ${d.time}`).join('\n\n');
      return `🏥 **আনোয়ারা মেডিকেল কমপ্লেক্সের বিশেষজ্ঞ চিকিৎসকবৃন্দ:**\n\n${topDocs}\n\nওয়েবসাইটের **ডাক্তার তালিকা** পেজে সকল বিশেষজ্ঞের পূর্ণ বিবরণ রয়েছে। সিরিয়াল বুকিংয়ের জন্য কল করুন: **01944-874304** অথবা **01972-692504**।`;
    }

    // 5. Test Prices & Diagnostics
    if (text.includes('টেস্ট') || text.includes('ফি') || text.includes('price') || text.includes('খরচ') || text.includes('ল্যাব') || text.includes('test')) {
      const topTests = diagnosticTests.slice(0, 7).map(t => `• **${t.name}** (${t.banglaName || ''}): ${t.price} (ডেলিভারি: ${t.deliveryTime})`).join('\n');
      return `🧪 **আনোয়ারা ডিজিটাল ডায়াগনস্টিক ল্যাব টেস্টের ফি:**\n\n${topTests}\n\nআমাদের ল্যাব প্রতিদিন সকাল ৮:০০ হতে রাত ১০:০০ পর্যন্ত খোলা থাকে। ওয়েবসাইটের **ডায়াগনস্টিক** পেজে সকল টেস্টের তালিকা রয়েছে।`;
    }

    // 6. Website Issues & Instructions
    if (text.includes('ওয়েবসাইট') || text.includes('website') || text.includes('সিরিয়াল বুকিং') || text.includes('নোটিশ') || text.includes('আইডি কার্ড') || text.includes('ভেরিফাই')) {
      return `💻 **ওয়েবসাইট ব্যবহারের নির্দেশনা:**\n\n• **সিরিয়াল বুকিং:** মেন্যুর "সিরিয়াল বুকিং" অপশনে গিয়ে ফর্ম পূরণ করলেই আমাদের রিসেপশন ডেস্ক আপনার সিরিয়াল নিশ্চিত করবে।\n• **নোটিশ ও সার্কুলার:** নোটিশ পেজ থেকে হাসপাতালের যেকোনো অফিসিয়াল সার্কুলার সরাসরি PDF আকারে ডাউনলোড ও প্রিন্ট করতে পারেন।\n• **স্টাফ ভেরিফিকেশন:** আইডি কার্ডের কিউআর কোড স্ক্যান করে বা আইডি নম্বর দিয়ে স্টাফ পরিচিতি যাচাই করা যায়।`;
    }

    // 7. Emergency & Ambulance
    if (text.includes('অ্যাম্বুলেন্স') || text.includes('জরুরি') || text.includes('হটলাইন') || text.includes('ফোন') || text.includes('emergency') || text.includes('phone') || text.includes('কল')) {
      return `🚑 **আনোয়ারা মেডিকেল কমপ্লেক্স জরুরি হটলাইন (২৪ ঘণ্টা চালু):**\n\n• **জরুরি ও অ্যাম্বুলেন্স:** **01972-692504**\n• **সিরিয়াল ও রিসেপশন:** **01944-874304**\n• **হাসপাতাল কর্তৃপক্ষ:** **01712-692504**\n\nআমাদের নিজস্ব সার্বক্ষণিক অ্যাম্বুলেন্স জরুরি রোগী আনা-নেওয়ার জন্য প্রস্তুত রয়েছে।`;
    }

    // 8. Location & Address
    if (text.includes('লোকেশন') || text.includes('ঠিকানা') || text.includes('কোথায়') || text.includes('location') || text.includes('address') || text.includes('নরসিংদী') || text.includes('পলাশ')) {
      return `📍 **হাসপাতালের অবস্থান ও ঠিকানা:**\n\n**আনোয়ারা মেডিকেল কমপ্লেক্স**\nওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী।\n\nপলাশ মেডিকেল মোড়ে নেমেই ওয়াপদা সদর রোডে আমাদের হাসপাতাল ভবন অবস্থিত। যে কোনো তথ্যে সরাসরি রিসেপশনে যোগাযোগ করতে পারেন: **01972-692504**।`;
    }

    // Default intelligent response
    return `আমি **আনোয়ারা মেডিকেল কমপ্লেক্স**-এর সহকারী। আপনার প্রশ্নটি পেয়েছি। হাসপাতাল সম্পর্কিত যেকোনো তথ্য—যেমন ডাক্তারদের তালিকা ও ভিজিটিং সময়, ডায়াগনস্টিক টেস্টের ফি, ২৪ ঘণ্টা অ্যাম্বুলেন্স সেবা বা লোকেশন—সম্পর্কে জানতে চাইলে অনুগ্রহ করে বিস্তারিত বলুন, আমি সাথে সাথে জানিয়ে দেব।`;
  };

  // Send message handler connecting to Gemini API with candidate model fallback
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    // Retrieve active API Key from environment or placeholder
    const effectiveApiKey =
      (import.meta.env.VITE_GEMINI_API_KEY as string) ||
      (YOUR_GEMINI_API_KEY && YOUR_GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY" ? YOUR_GEMINI_API_KEY : "");

    // Prepare system instruction
    const systemInstructionText = buildSystemInstruction(doctors, diagnosticTests);

    // Prepare conversation contents for Gemini API (user & model turns)
    const contentsPayload = newHistory
      .filter(m => m.id !== 'welcome-msg')
      .slice(-10)
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text
      }));

    let generatedText: string | null = null;

    // 1. Primary: Call secure server-side proxy route /api/chat (no CORS, no browser referrer restrictions)
    try {
      const serverResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: contentsPayload,
          systemInstruction: systemInstructionText,
          customKey: (YOUR_GEMINI_API_KEY && YOUR_GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY') ? YOUR_GEMINI_API_KEY : undefined
        })
      });

      if (serverResponse.ok) {
        const data = await serverResponse.json();
        if (data?.text && data.text.trim()) {
          generatedText = data.text.trim();
        }
      }
    } catch (serverErr) {
      console.warn('[Chatbot Client] Server /api/chat call notice:', serverErr);
    }

    // 2. Secondary client-side fallback if server route didn't return text and effectiveApiKey exists
    if (!generatedText && effectiveApiKey && effectiveApiKey !== 'YOUR_GEMINI_API_KEY') {
      for (const model of CANDIDATE_MODELS) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(effectiveApiKey)}`;
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemInstructionText }] },
              contents: contentsPayload.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
              })),
              generationConfig: { temperature: 0.35, maxOutputTokens: 800 }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim()) {
              generatedText = text.trim();
              break;
            }
          }
        } catch {
          // silently continue to next model or intelligent fallback
        }
      }
    }

    // 3. Guaranteed intelligent healthcare reasoning engine fallback
    if (!generatedText) {
      await new Promise(res => setTimeout(res, 350));
      generatedText = generateIntelligentLocalFallback(query);
    }

    const modelMessage: ChatMessage = {
      id: `model-${Date.now()}`,
      role: 'model',
      text: generatedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: isBn
          ? "চ্যাট রিসেট করা হয়েছে। আমি **আনোয়ারা মেডিকেল কমপ্লেক্স**-এর সহকারী। ডাক্তার, টেস্ট বা সেবা সম্পর্কে যেকোনো তথ্য জানতে চান?"
          : "Chat has been reset. How may I assist you with Anowara Medical Complex today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Quick Action Buttons
  const quickPrompts = [
    { label: isBn ? "🩺 ডাক্তারদের শিডিউল" : "🩺 Doctors Schedule", query: "ডাক্তারদের শিডিউল ও তালিকা দেখতে চাই" },
    { label: isBn ? "🧪 টেস্টের মূল্য তালিকা" : "🧪 Test Prices", query: "ডায়াগনস্টিক ল্যাব টেস্টের ফি কত?" },
    { label: isBn ? "🚑 জরুরি অ্যাম্বুলেন্স" : "🚑 Ambulance", query: "জরুরি অ্যাম্বুলেন্স ও রিসেপশন নম্বর কী?" },
    { label: isBn ? "📍 হাসপাতালের অবস্থান" : "📍 Location", query: "হাসপাতালের ঠিকানা ও অবস্থান কোথায়?" },
    { label: isBn ? "📅 সিরিয়াল বুকিং নিয়ম" : "📅 Serial Booking", query: "অনলাইনে কীভাবে ডাক্তারের সিরিয়াল বুকিং করব?" },
  ];

  return (
    <>
      {/* 1. FLOATING CHAT BUTTON (Bottom-Right Corner) */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="hospital-ai-chatbot-toggle-btn"
          aria-label={isBn ? "এআই সহকারী চ্যাটবট খুলুন" : "Open Hospital AI Chatbot"}
          className={`group relative flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
            isOpen 
              ? 'w-13 h-13 bg-[#0E3A53] text-white rotate-90 ring-4 ring-[#2D8FC1]/30' 
              : 'w-14 h-14 bg-gradient-to-tr from-[#0E3A53] via-[#154663] to-[#2D8FC1] text-white hover:scale-105 hover:shadow-cyan-900/30 ring-3 ring-white/60'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <>
              {/* Online Pulse Indicator */}
              <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>

              {/* Bot / Sparkle Icon */}
              <div className="flex items-center justify-center">
                <Bot className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                <Sparkles className="w-3 h-3 text-amber-300 absolute -bottom-0.5 -right-0.5 animate-pulse" />
              </div>
            </>
          )}

          {/* Floating Hover Tooltip */}
          {!isOpen && (
            <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-[#0E3A53] text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:inline-block border border-[#2D8FC1]/30">
              {isBn ? "হাসপাতাল এআই সহকারী" : "Hospital AI Support"}
            </span>
          )}
        </button>
      </div>

      {/* 2. MODERN SLEEK CHAT MODAL */}
      {isOpen && (
        <div 
          id="hospital-ai-chat-modal"
          className="fixed bottom-22 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[420px] h-[550px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden z-50 animate-fadeIn backdrop-blur-md"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0E3A53] via-[#12425e] to-[#1c5d82] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
                  <Bot className="w-5 h-5 text-cyan-200" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0E3A53]"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight flex items-center gap-1.5">
                  <span>{isBn ? "আনোয়ারা এআই সহকারী" : "Anowara AI Assistant"}</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[9px] font-bold">
                    Active AI
                  </span>
                </h3>
                <p className="text-[11px] text-cyan-100/80 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{isBn ? "অনলাইন • বুদ্ধিমান স্বাস্থ্য সহকারী" : "Online • Thoughtful Health Support"}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 relative z-10">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition cursor-pointer"
                title={isBn ? "চ্যাট রিসেট করুন" : "Reset Chat"}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition cursor-pointer"
                title={isBn ? "বন্ধ করুন" : "Close"}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Notice Tag */}
          <div className="bg-amber-50/90 border-b border-amber-200/60 px-3 py-1.5 text-[10.5px] text-amber-900 flex items-center justify-between shrink-0 font-medium">
            <span className="truncate">🏥 আনোয়ারা মেডিকেল কমপ্লেক্স ও চিকিৎসা তথ্য সহায়তায় প্রস্তুত</span>
            <span className="text-[#0E3A53] font-bold shrink-0 ml-1">পলাশ, নরসিংদী</span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/50 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-[#0E3A53] text-white flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                      <Bot className="w-4 h-4 text-cyan-300" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-[#0E3A53] text-white rounded-tr-xs'
                        : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-xs'
                    }`}
                  >
                    <p className="text-[12.5px] font-normal select-text">
                      {msg.text}
                    </p>
                    <span
                      className={`text-[9.5px] block mt-1 ${
                        isUser ? 'text-white/60 text-right' : 'text-gray-400 text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 text-xs mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <div className="w-7 h-7 rounded-xl bg-[#0E3A53] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-cyan-300" />
                </div>
                <div className="bg-white border border-gray-200 px-3.5 py-2.5 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#2D8FC1] animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-[#2D8FC1] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#2D8FC1] animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-gray-500 font-medium ml-1">তথ্য যাচাই করে ভাবছি...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          {messages.length <= 4 && !isLoading && (
            <div className="px-3 py-2 bg-white border-t border-gray-100 flex flex-wrap gap-1.5 shrink-0">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp.query)}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#0E3A53] hover:bg-blue-100 transition cursor-pointer border border-blue-100 active:scale-95"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-gray-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isBn ? "লক্ষণ, ডাক্তার, টেস্ট বা সেবা সম্পর্কে লিখুন..." : "Ask about symptoms, doctors, tests..."}
                disabled={isLoading}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2D8FC1] focus:bg-white focus:ring-1 focus:ring-[#2D8FC1] transition"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 rounded-2xl bg-[#0E3A53] hover:bg-[#0A2A3D] text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-all cursor-pointer shadow-md active:scale-95"
                title={isBn ? "পাঠান" : "Send"}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
            <div className="text-[10px] text-gray-400 text-center mt-1.5">
              <span>জরুরি সিরিয়াল বুকিং: 01944-874304 | অ্যাম্বুলেন্স: 01972-692504</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
