import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Printer, 
  Download, 
  Search, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Stethoscope,
  Activity,
  Layers,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { PrintLetterhead } from '../components/PrintLetterhead';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { printElement, downloadElementAsPdf } from '../utils/printHelper';

interface ReceiptGeneratorPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: any) => void;
}

export const ReceiptGeneratorPage: React.FC<ReceiptGeneratorPageProps> = ({
  onNavigateHome,
  onNavigate,
}) => {
  const { isBn } = useLanguage();
  const { appointments, diagnosticTests, doctors } = useData();
  // Receipt builder state
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('পুরুষ');
  const [referringDoctor, setReferringDoctor] = useState('');
  const [receiptNumber, setReceiptNumber] = useState(() => `AMC-REC-${Date.now().toString().slice(-6)}`);
  const [receiptDate, setReceiptDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Selected tests for this receipt
  const [selectedTests, setSelectedTests] = useState<Array<{ id: string; name: string; price: number }>>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [testSearch, setTestSearch] = useState('');

  // Quick patient selector from recent appointments
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');

  const handleSelectAppointment = (aptId: string) => {
    setSelectedAppointmentId(aptId);
    const apt = appointments.find(a => a.id === aptId);
    if (apt) {
      setPatientName(apt.patientName);
      setPatientPhone(apt.phone);
      if (apt.age) setPatientAge(apt.age);
      if (apt.gender) setPatientGender(apt.gender);
      if (apt.doctor) setReferringDoctor(apt.doctor);
    }
  };

  const handleAddTest = (test: any) => {
    // Parse numeric price from "৳ ৫০০" or string
    const numPrice = parseInt(test.price.replace(/[^\d]/g, ''), 10) || 500;
    if (!selectedTests.some(t => t.id === test.id)) {
      setSelectedTests([...selectedTests, { id: test.id, name: test.name, price: numPrice }]);
    }
  };

  const handleRemoveTest = (testId: string) => {
    setSelectedTests(selectedTests.filter(t => t.id !== testId));
  };

  // Calculations
  const subtotal = useMemo(() => {
    return selectedTests.reduce((sum, t) => sum + t.price, 0);
  }, [selectedTests]);

  const netTotal = Math.max(0, subtotal - (discountAmount || 0));
  const dueAmount = Math.max(0, netTotal - (paidAmount || 0));

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handlePrintReceipt = () => {
    printElement('printable-hospital-money-receipt', `মানি_রিসিট_${receiptNumber}`);
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await downloadElementAsPdf('printable-hospital-money-receipt', `মানি_রিসিট_${receiptNumber}`, setIsDownloadingPdf);
    } catch (err) {
      console.warn('PDF download warning:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const filteredTests = useMemo(() => {
    if (!testSearch.trim()) return diagnosticTests.slice(0, 8);
    const q = testSearch.toLowerCase().trim();
    return diagnosticTests.filter(t => 
      t.name.toLowerCase().includes(q) || 
      (t.banglaName && t.banglaName.toLowerCase().includes(q))
    ).slice(0, 15);
  }, [diagnosticTests, testSearch]);

  return (
    <div className="min-h-screen bg-[#F6F8F7] pb-16">
      <PageBanner
        titleBn="রোগী মানি রিসিট ও পরীক্ষা ফি জেনারেটর"
        titleEn="Patient Money Receipt & Test Fee Generator"
        subtitleBn="রোগীদের ডায়াগনস্টিক পরীক্ষা ও সেবা ফি এর অফিসিয়াল ডিজিটাল মানি রিসিট প্রস্তুত করুন"
        subtitleEn="Generate official branded diagnostic & service payment receipts with printable layout"
        breadcrumbBn="রিসিট জেনারেটর"
        breadcrumbEn="Receipt Generator"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 space-y-6">
        {/* Navigation Bar Back to Receptionist Dashboard */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('receptionist')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isBn ? "রিসেপশন ড্যাশবোর্ডে ফিরুন" : "Back to Receptionist"}</span>
            </button>
            <div className="hidden sm:block h-5 w-px bg-gray-200" />
            <span className="text-xs text-gray-500 font-medium">
              {isBn ? "সিরিয়াল প্রাপ্ত রোগীদের সরাসরি রিসিট প্রদান" : "Direct receipt for booked patients"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('billing-system')}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 shadow-md shadow-amber-900/15 cursor-pointer"
            >
              <span>{isBn ? "বিলিং সিস্টেম খুলুন" : "Open Billing System"}</span>
            </button>
            <button
              onClick={handlePrintReceipt}
              className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBn ? "প্রিন্ট রিসিট" : "Print Receipt"}</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isBn ? "PDF ডাউনলোড" : "Download PDF"}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Left Controls & Right Printable Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Receipt Form (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Patient Quick Selector */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200/80 space-y-3.5">
              <h4 className="font-bold text-sm text-[#0E3A53] flex items-center gap-2">
                <User className="w-4 h-4 text-[#2D8FC1]" />
                <span>{isBn ? "রোগীর তথ্য ও বুকিং নির্বাচন" : "Patient Information"}</span>
              </h4>

                  {appointments.length > 0 && (
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    {isBn ? "বুকিং করা রোগী থেকে বাছাই করুন:" : "Quick select from today's patients:"}
                  </label>
                  <select
                    value={selectedAppointmentId}
                    onChange={(e) => handleSelectAppointment(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  >
                    <option value="">-- {isBn ? "তালিকা থেকে রোগী নির্বাচন করুন" : "Select patient from list"} --</option>
                    {appointments.slice(0, 30).map((apt) => (
                      <option key={apt.id} value={apt.id}>
                        {apt.patientName} ({apt.phone}) - {apt.doctor} [{apt.token || apt.assignedTimeSlot}]
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">{isBn ? "রোগীর নাম *" : "Patient Name *"}</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="যেমন: মোঃ জসিম উদ্দিন"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">{isBn ? "মোবাইল নম্বর" : "Mobile Phone"}</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">{isBn ? "বয়স" : "Age"}</label>
                  <input
                    type="text"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="৩৫ বছর"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">{isBn ? "লিঙ্গ" : "Gender"}</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  >
                    <option value="পুরুষ">পুরুষ (Male)</option>
                    <option value="মহিলা">মহিলা (Female)</option>
                    <option value="অন্যান্য">অন্যান্য (Other)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">{isBn ? "রিসিট নং" : "Receipt No"}</label>
                  <input
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">{isBn ? "রেফারেল ডাক্তার" : "Referred By Doctor"}</label>
                  <input
                    type="text"
                    value={referringDoctor}
                    onChange={(e) => setReferringDoctor(e.target.value)}
                    placeholder="যেমন: ডা. মোঃ রফিকুল ইসলাম"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Diagnostic Tests Selector */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#0E3A53] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? "পরীক্ষা-নিরীক্ষা ও টেস্ট ফি নির্বাচন" : "Add Diagnostic Tests"}</span>
                </h4>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {selectedTests.length} টি যুক্ত
                </span>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                  placeholder={isBn ? "টেস্টের নাম দিয়ে খুঁজুন (যেমন: CBC, USG, X-Ray)..." : "Search tests..."}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-xl">
                {filteredTests.map((test) => {
                  const isAdded = selectedTests.some(t => t.id === test.id);
                  return (
                    <div key={test.id} className="p-2.5 flex items-center justify-between gap-2 hover:bg-gray-50 text-xs transition">
                      <div>
                        <p className="font-bold text-gray-800 text-[11px]">{test.name}</p>
                        <p className="text-[10px] text-gray-400">{test.banglaName || test.category}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-gray-700 text-xs">{test.price}</span>
                        <button
                          type="button"
                          onClick={() => isAdded ? handleRemoveTest(test.id) : handleAddTest(test)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                            isAdded 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {isAdded ? (isBn ? 'বাদ' : 'Remove') : (isBn ? '+ যোগ' : '+ Add')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Math Input */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-1">{isBn ? "ডিসকাউন্ট / ছাড় (৳)" : "Discount (BDT)"}</label>
                  <input
                    type="number"
                    min="0"
                    value={discountAmount || ''}
                    onChange={(e) => setDiscountAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    placeholder="০"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-red-600 focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-1">{isBn ? "জমা / প্রাপ্ত টাকা (৳)" : "Paid Amount (BDT)"}</label>
                  <input
                    type="number"
                    min="0"
                    value={paidAmount || ''}
                    onChange={(e) => setPaidAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    placeholder="০"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-[#2D8FC1]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Official Money Receipt Live Preview (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-[#C9973B]" />
                  <span>{isBn ? "লাইভ মানি রিসিট প্রিন্ট প্রিভিউ" : "Official Receipt Preview"}</span>
                </span>
                <span className="text-[11px] font-mono text-gray-400">
                  A4 / Slip Format
                </span>
              </div>

              {/* PRINTABLE ELEMENT CONTAINER */}
              <div 
                id="printable-hospital-money-receipt" 
                className="bg-white p-6 border-2 border-gray-200 rounded-2xl shadow-xs text-gray-900 space-y-4"
              >
                {/* 1. Hospital Header */}
                <PrintLetterhead />

                {/* 2. Receipt Title Banner */}
                <div className="text-center py-1.5 bg-[#0E3A53] text-white rounded-lg">
                  <h3 className="font-bold text-xs uppercase tracking-wider">
                    {isBn ? "মানি রিসিট ও পরীক্ষা ফি স্লিপ" : "MONEY RECEIPT & DIAGNOSTIC BILL"}
                  </h3>
                </div>

                {/* 3. Patient Meta Details */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] bg-gray-50 p-3 rounded-xl border border-gray-200/60 font-sans">
                  <div>
                    <span className="text-gray-500">রিসিট নম্বর: </span>
                    <span className="font-mono font-bold text-gray-900">{receiptNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500">তারিখ: </span>
                    <span className="font-mono text-gray-900">{receiptDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">রোগীর নাম: </span>
                    <span className="font-bold text-gray-900">{patientName || '...........................................'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500">মোবাইল: </span>
                    <span className="font-mono text-gray-900">{patientPhone || '...........................'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">বয়স ও লিঙ্গ: </span>
                    <span className="text-gray-900">{patientAge ? `${patientAge}, ` : ''}{patientGender}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500">রেফারেল: </span>
                    <span className="text-gray-900">{referringDoctor || 'হাসপাতাল বহির্বিভাগ'}</span>
                  </div>
                </div>

                {/* 4. Table of Diagnostic Tests & Fees */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-200">
                      <tr>
                        <th className="py-1.5 px-3 w-10">ক্র.নং</th>
                        <th className="py-1.5 px-3">পরীক্ষা / সেবার বিবরণ</th>
                        <th className="py-1.5 px-3 text-right">মূল্য (টাকা)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedTests.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-gray-400">
                            বামপাশের তালিকা থেকে পরীক্ষা যোগ করুন
                          </td>
                        </tr>
                      ) : (
                        selectedTests.map((t, idx) => (
                          <tr key={`rec-test-${t.id}`}>
                            <td className="py-1.5 px-3 font-mono text-gray-500">{idx + 1}</td>
                            <td className="py-1.5 px-3 font-medium text-gray-800">{t.name}</td>
                            <td className="py-1.5 px-3 font-mono font-bold text-right text-gray-900">৳ {t.price}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot className="border-t-2 border-gray-300 font-bold bg-gray-50/80">
                      <tr>
                        <td colSpan={2} className="py-1 px-3 text-right text-gray-600">মোট মূল্য (Subtotal):</td>
                        <td className="py-1 px-3 font-mono text-right text-gray-900">৳ {subtotal}</td>
                      </tr>
                      {discountAmount > 0 && (
                        <tr>
                          <td colSpan={2} className="py-1 px-3 text-right text-red-600">ছাড় (Discount):</td>
                          <td className="py-1 px-3 font-mono text-right text-red-600">- ৳ {discountAmount}</td>
                        </tr>
                      )}
                      <tr className="bg-gray-100/80">
                        <td colSpan={2} className="py-1.5 px-3 text-right text-[#0E3A53]">সর্বমোট প্রদেয় (Net Payable):</td>
                        <td className="py-1.5 px-3 font-mono text-right text-[#0E3A53] text-xs">৳ {netTotal}</td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="py-1 px-3 text-right text-emerald-700">জমা (Paid):</td>
                        <td className="py-1 px-3 font-mono text-right text-emerald-700">৳ {paidAmount}</td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="py-1 px-3 text-right text-amber-700">বকেয়া (Due):</td>
                        <td className="py-1 px-3 font-mono text-right text-amber-700">৳ {dueAmount}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* 5. Signatures & Footer Note */}
                <div className="pt-8 grid grid-cols-2 text-[10px] text-gray-500">
                  <div>
                    <div className="border-t border-gray-400 w-32 text-center pt-1 text-gray-700">
                      গ্রহীতার স্বাক্ষর
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="border-t border-gray-400 w-36 text-center pt-1 text-gray-700 font-medium">
                      আদায়কারীর স্বাক্ষর ও সিল
                    </div>
                  </div>
                </div>

                <div className="text-center text-[9px] text-gray-400 border-t border-gray-100 pt-2">
                  * কম্পিউটার জেনারেটেড রিসিট। যেকোনো অনুসন্ধানে হটলাইন: ০১৯৭২-৬৯২৫০৪ বা ০১৯৪৪-৮৭৪৩০৪ এ যোগাযোগ করুন।
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            USER DEV CODE CONTAINER / WORKSPACE FOR RECEIPT GENERATOR
            The user can directly inject or mount their custom HTML / React / JS code here
            ========================================================================= */}
        <div className="bg-white rounded-3xl border-2 border-amber-200/80 shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-sm sm:text-base text-[#0E3A53]">
                {isBn ? "রিসিট জেনারেটর ডেভ কন্টেইনার ও কাস্টম ওয়ার্কস্পেস" : "Receipt Generator Dev Workspace"}
              </h4>
            </div>
            <span className="text-[11px] bg-amber-50 text-amber-800 px-3 py-1 rounded-full font-mono font-semibold border border-amber-200">
              #receipt-generator-dev-workspace
            </span>
          </div>

          <p className="text-xs text-gray-600">
            {isBn 
              ? "এই সেকশনের নিচে আপনার ডেভ কোড (HTML/JSX উপাদান) সরাসরি যোগ করতে পারবেন। সমস্ত প্যারেন্ট সিএসএস ও রেসপনসিভ লেআউট কনফিগার করা আছে।"
              : "You can place all your functional receipt calculation components and custom HTML in the dedicated dev container below."}
          </p>

          {/* DEDICATED DEV DIV: Targeted for user's custom functional development */}
          <div 
            id="amc-receipt-generator-dev-container" 
            className="min-h-[380px] rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/30 p-6 relative"
          >
            {/* User Dev Placeholder Area */}
            <div className="flex flex-col items-center justify-center text-center py-10 px-4 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-white text-amber-600 flex items-center justify-center shadow-sm border border-amber-100">
                <Receipt className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-[#0E3A53]">
                {isBn ? "রিসিট জেনারেটর ডেভ কন্টেইনার প্রস্তুত" : "Receipt Generator Dev Container Ready"}
              </h4>
              <p className="text-xs text-gray-500 max-w-lg">
                {isBn 
                  ? "আপনি যে ফাংশনাল কোডগুলো যোগ করতে চান, তা এই `amc-receipt-generator-dev-container` ডিভের মধ্যে সংযুক্ত করুন। রিসেপশন ডেস্ক ও ডাক্তার সিরিয়াল ডেটাবেজ ইতিমধ্যেই সংযুক্ত রয়েছে।"
                  : "All patient serials and test fees are wired up with live real-time sync. You can insert your custom receipt calculator and generator code here."}
              </p>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <span className="px-3 py-1 bg-white text-gray-700 text-[11px] rounded-xl border border-gray-200 font-medium">
                  🧾 Thermal Paper Slip
                </span>
                <span className="px-3 py-1 bg-white text-gray-700 text-[11px] rounded-xl border border-gray-200 font-medium">
                  💰 Daily Cash Summary
                </span>
                <span className="px-3 py-1 bg-white text-gray-700 text-[11px] rounded-xl border border-gray-200 font-medium">
                  📊 Revenue Breakdown
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
