import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Bot, 
  User, 
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Doctor } from '../data/doctors';
import { DiagnosticTest } from '../data/tests';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const HospitalAiChatbot: React.FC = () => {
  const { isBn } = useLanguage();
  const { doctors, diagnosticTests } = useData();

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
            ? "আসসালামু আলাইকুম! আমি **আনোয়ারা মেডিকেল কমপ্লেক্স**-এর এআই সহকারী। 🏥✨\n\nহাসপাতাল, স্বাস্থ্য বা অন্য যেকোনো বিষয়ে বাংলায় বা ইংরেজিতে প্রশ্ন করুন—আমি সাহায্য করার চেষ্টা করব।\n\nডাক্তারদের সময়সূচি, টেস্টের ফি, জরুরি সেবা বা হাসপাতালের ঠিকানা সম্পর্কেও জানতে পারেন।"
            : "Hello and welcome to **Anowara Medical Complex**! 🏥✨\n\nAsk me anything in English or Bengali. I can help with general questions as well as doctors, test prices, emergency services, and hospital information.",
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

  // Ground hospital-specific answers in the live site data while allowing general questions.
  const buildSystemInstruction = (doctorList: Doctor[], testList: DiagnosticTest[]): string => {
    const doctorsSummary = (doctorList || []).map(d => 
      `- ${d.name} (${d.nameEn || ''}): ${d.specialty} | ডিগ্রি: ${d.degree || ''} | চেম্বার সময়: ${d.time || 'নির্ধারিত সময়ে'} | দিন: ${d.days ? d.days.join(', ') : 'নির্ধারিত দিনে'} | রুম: ${d.room || 'চেম্বার'} | সিরিয়াল নম্বর: ${d.phone || '01972-692504 / 01944-874304'}`
    ).join('\n');

    const testsSummary = (testList || []).slice(0, 60).map(t => 
      `- ${t.name} (${t.banglaName || ''}): ফি ${t.price} (${t.priceEn || ''}) | ক্যাটাগরি: ${t.category === 'pathology' ? 'প্যাথলজি ল্যাব' : 'রেডিওলজি/ইমেজিং'} | ডেলিভারি সময়: ${t.deliveryTime}${t.fastingRequired ? ' (খালি পেটে পরীক্ষা করা আবশ্যক)' : ' (স্বাভাবিক খাওয়ার পর করা যায়)'}`
    ).join('\n');

    return `You are the thoughtful, highly empathetic, and intelligent official AI Health Assistant for Anowara Medical Complex (আনোয়ারা মেডিকেল কমপ্লেক্স), located in Palash, Narsingdi, Bangladesh.

GENERAL ASSISTANT RULES:
1. Answer questions on any topic; do not refuse solely because a question is unrelated to the hospital. Be useful, accurate, respectful, and clear.
2. Understand Bengali and English, including mixed-language messages. Reply in the language the user used; if the user requests both languages, provide the answer in both.
3. For greetings and thanks, respond warmly and naturally.
4. For medical questions, give general educational information, do not claim to diagnose or replace a clinician, and advise urgent in-person care for emergency symptoms. Do not invent medical facts.
5. Use the hospital information below for hospital-specific questions. Do not invent doctors, schedules, test prices, or hospital policies; say when information is unavailable and provide the relevant contact number.
6. Explain how patients can use our website:
   - How to book a serial online (go to the "সিরিয়াল বুকিং" / Appointment page and fill the form).
   - How to download doctor schedule lists or notices in PDF.
   - How to verify hospital staff ID card via QR code.
   - Where to find health blogs and announcements.

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

DOCTORS & VISITING SCHEDULE (use only when known to answer hospital questions):
${doctorsSummary}

DIAGNOSTIC TEST CHARGES & PREPARATION (use only when known to answer hospital questions):
${testsSummary}`;
  };

  // Send chat messages through the server-side AI endpoint
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

    let generatedText: string;
    try {
      const serverResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: contentsPayload,
          systemInstruction: systemInstructionText
        })
      });

      const data = await serverResponse.json();
      if (!serverResponse.ok || typeof data?.text !== 'string' || !data.text.trim()) {
        throw new Error(data?.error || 'AI service did not return an answer');
      }
      generatedText = data.text.trim();
    } catch (error) {
      console.error('[Chatbot] Unable to get an AI response:', error);
      const isNotConfigured = error instanceof Error && error.message.includes('not configured');
      generatedText = isNotConfigured
        ? isBn
          ? 'এআই চ্যাট চালু করতে সার্ভারে একটি বৈধ Gemini API key সেট করতে হবে। সেটআপের জন্য ওয়েবসাইট কর্তৃপক্ষের সঙ্গে যোগাযোগ করুন।'
          : 'AI chat needs a valid Gemini API key on the server. Please contact the website administrator to enable it.'
        : isBn
          ? 'দুঃখিত, এই মুহূর্তে এআই সেবার সঙ্গে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে পরে আবার চেষ্টা করুন।'
          : 'Sorry, the AI service is unavailable right now. Please try again later.';
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
          ? "চ্যাট রিসেট করা হয়েছে। বাংলা বা ইংরেজিতে যেকোনো প্রশ্ন করুন—আমি সাহায্য করব।"
          : "Chat has been reset. Ask me anything in English or Bengali.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Quick Action Buttons
  const quickPrompts = [
    { label: isBn ? "🩺 ডাক্তারদের শিডিউল" : "🩺 Doctors Schedule", query: isBn ? "ডাক্তারদের শিডিউল ও তালিকা দেখতে চাই" : "Show me the doctors' schedules and list" },
    { label: isBn ? "🧪 টেস্টের মূল্য তালিকা" : "🧪 Test Prices", query: isBn ? "ডায়াগনস্টিক ল্যাব টেস্টের ফি কত?" : "What are the diagnostic test prices?" },
    { label: isBn ? "🚑 জরুরি অ্যাম্বুলেন্স" : "🚑 Ambulance", query: isBn ? "জরুরি অ্যাম্বুলেন্স ও রিসেপশন নম্বর কী?" : "What are the emergency and ambulance phone numbers?" },
    { label: isBn ? "📍 হাসপাতালের অবস্থান" : "📍 Location", query: isBn ? "হাসপাতালের ঠিকানা ও অবস্থান কোথায়?" : "Where is the hospital located?" },
    { label: isBn ? "📅 সিরিয়াল বুকিং নিয়ম" : "📅 Serial Booking", query: isBn ? "অনলাইনে কীভাবে ডাক্তারের সিরিয়াল বুকিং করব?" : "How do I book a doctor appointment online?" },
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
                    {isBn ? 'সক্রিয় এআই' : 'Active AI'}
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
            <span className="truncate">
              {isBn ? '🏥 আনোয়ারা মেডিকেল কমপ্লেক্স ও যেকোনো প্রশ্নে সহায়তায় প্রস্তুত' : '🏥 Ready to help with your questions and Anowara Medical Complex information'}
            </span>
            <span className="text-[#0E3A53] font-bold shrink-0 ml-1">
              {isBn ? 'পলাশ, নরসিংদী' : 'Palash, Narsingdi'}
            </span>
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
                  <span className="text-[11px] text-gray-500 font-medium ml-1">
                    {isBn ? 'তথ্য যাচাই করে ভাবছি...' : 'Thinking...'}
                  </span>
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
              <span>
                {isBn
                  ? 'জরুরি সিরিয়াল বুকিং: 01944-874304 | অ্যাম্বুলেন্স: 01972-692504'
                  : 'Appointments: 01944-874304 | Ambulance: 01972-692504'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
