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
import { answerHospitalQuestion } from '../utils/localHospitalAssistant';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface HospitalAiChatbotProps {
  isMinimized?: boolean;
}

export const HospitalAiChatbot: React.FC<HospitalAiChatbotProps> = ({ isMinimized = false }) => {
  const { isBn } = useLanguage();
  const { doctors, diagnosticTests, notices, blogs, managementMembers, emergencyNotice } = useData();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMinimized) setIsOpen(false);
  }, [isMinimized]);

  // Initialize welcoming message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          role: 'model',
          text: isBn
            ? "আসসালামু আলাইকুম! আমি **আনোয়ারা মেডিকেল কমপ্লেক্স**-এর সহকারী। 🏥✨\n\nডাক্তার ও চেম্বারের সময়, টেস্টের ফি, সিরিয়াল বুকিং, জরুরি যোগাযোগ, সেবা, নোটিশ ও স্বাস্থ্যবিষয়ক লেখা সম্পর্কে বাংলায় বা English-এ প্রশ্ন করুন।"
            : "Welcome to **Anowara Medical Complex**! 🏥✨\n\nAsk in English or Bengali about doctors and schedules, test prices, appointments, emergency contacts, services, notices, or health articles.",
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

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((previous) => [...previous, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const generatedText = answerHospitalQuestion(query, {
      doctors,
      diagnosticTests,
      notices,
      blogs,
      managementMembers,
      emergencyNotice,
    }, isBn);

    const modelMessage: ChatMessage = {
      id: `model-${Date.now()}`,
      role: 'model',
      text: generatedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((previous) => [...previous, modelMessage]);
    setIsLoading(false);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: isBn
          ? "চ্যাট রিসেট করা হয়েছে। ডাক্তার, টেস্ট, সিরিয়াল, যোগাযোগ বা হাসপাতালের সেবা সম্পর্কে জিজ্ঞেস করুন।"
          : "Chat reset. Ask about doctors, tests, appointments, contacts, or hospital services.",
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

  if (isMinimized) return null;

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
                    {isBn ? 'স্থানীয় সহায়ক' : 'Local Guide'}
                  </span>
                </h3>
                <p className="text-[11px] text-cyan-100/80 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{isBn ? "সাইটের তথ্য সহায়তা • বাংলা / English" : "Website information • বাংলা / English"}</span>
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
              {isBn ? '🏥 হাসপাতাল ও ওয়েবসাইটের তথ্য জানতে লিখুন' : '🏥 Ask about hospital and website information'}
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
                placeholder={isBn ? "ডাক্তার, টেস্ট, সিরিয়াল বা সেবা সম্পর্কে লিখুন..." : "Ask about doctors, tests, appointments..."}
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
