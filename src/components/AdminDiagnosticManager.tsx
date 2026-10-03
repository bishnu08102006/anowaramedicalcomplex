import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Plus, 
  Trash2, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  X, 
  RotateCcw,
  Stethoscope,
  Clock,
  Coins,
  AlertTriangle,
  UploadCloud,
  Printer,
  Download,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { DiagnosticTest } from '../data/tests';
import { DiagnosticPricePrintModal } from './DiagnosticPricePrintModal';
import { PrintLetterhead } from './PrintLetterhead';
import { downloadElementAsPdf, printElement } from '../utils/printHelper';

export const AdminDiagnosticManager: React.FC = () => {
  const { isBn } = useLanguage();
  const { 
    diagnosticTests, 
    addDiagnosticTest, 
    updateDiagnosticTest, 
    removeDiagnosticTest, 
    resetDiagnosticTests, 
    isFirebaseConnected 
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pathology' | 'imaging'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DiagnosticTest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    banglaName: string;
    category: 'pathology' | 'imaging';
    price: string;
    priceEn: string;
    deliveryTime: string;
    deliveryTimeEn: string;
    fastingRequired: boolean;
  }>({
    name: '',
    banglaName: '',
    category: 'pathology',
    price: '৳ ৫০০',
    priceEn: 'BDT 500',
    deliveryTime: '২ ঘণ্টা',
    deliveryTimeEn: '2 Hours',
    fastingRequired: false
  });

  // Filtered tests
  const filteredTests = useMemo(() => {
    return diagnosticTests.filter(test => {
      const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      return matchesCategory && (
        test.name.toLowerCase().includes(q) ||
        (test.banglaName && test.banglaName.toLowerCase().includes(q)) ||
        test.price.toLowerCase().includes(q) ||
        (test.priceEn && test.priceEn.toLowerCase().includes(q))
      );
    });
  }, [diagnosticTests, searchQuery, selectedCategory]);

  const pathologyCount = diagnosticTests.filter(t => t.category === 'pathology').length;
  const imagingCount = diagnosticTests.filter(t => t.category === 'imaging').length;
  const fastingCount = diagnosticTests.filter(t => t.fastingRequired).length;

  const [isDownloadingTests, setIsDownloadingTests] = useState(false);

  // Direct download all diagnostic tests in this div as PDF and trigger isolated print window
  const handleDirectDownloadAndPrintPriceList = async () => {
    const listToExport = filteredTests.length > 0 ? filteredTests : diagnosticTests;
    if (listToExport.length === 0) {
      showFeedback(isBn ? 'ডাউনলোড বা প্রিন্ট করার মতো কোনো টেস্ট তালিকা নেই' : 'No tests to download or print');
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const categoryLabel = selectedCategory === 'pathology' ? 'প্যাথলজি' : selectedCategory === 'imaging' ? 'ইমেজিং' : 'সকল';
    const docTitle = `আনোয়ারা_মেডিকেল_কমপ্লেক্স_ডায়াগনস্টিক_টেস্ট_ও_মূল্য_তালিকা_${categoryLabel}_${dateStr}`;

    // 1. Immediately trigger isolated direct print of ONLY the diagnostic test price list
    document.body.classList.add('amc-print-tests');
    printElement('admin-diagnostic-tests-printable-content', docTitle);
    setTimeout(() => {
      document.body.classList.remove('amc-print-tests');
    }, 4000);

    showFeedback(isBn ? "প্রিন্ট উইন্ডো চালু হয়েছে এবং PDF ফাইল ডাউনলোড হচ্ছে!" : "Print window opened and downloading PDF file!");

    // 2. Also directly download as PDF file
    setIsDownloadingTests(true);
    try {
      await downloadElementAsPdf('admin-diagnostic-tests-printable-content', docTitle, setIsDownloadingTests);
    } catch (err) {
      console.warn("Test PDF download notice:", err);
    } finally {
      setIsDownloadingTests(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTestId(null);
    setFormData({
      name: '',
      banglaName: '',
      category: 'pathology',
      price: '৳ ৫০০',
      priceEn: 'BDT 500',
      deliveryTime: '২ ঘণ্টা',
      deliveryTimeEn: '2 Hours',
      fastingRequired: false
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (test: DiagnosticTest) => {
    setEditingTestId(test.id);
    setFormData({
      name: test.name,
      banglaName: test.banglaName || '',
      category: test.category,
      price: test.price,
      priceEn: test.priceEn || '',
      deliveryTime: test.deliveryTime,
      deliveryTimeEn: test.deliveryTimeEn || '',
      fastingRequired: !!test.fastingRequired
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError(isBn ? 'পরীক্ষার ইংরেজি নাম আবশ্যক!' : 'Test name (English) is required!');
      return;
    }
    if (!formData.price.trim()) {
      setFormError(isBn ? 'পরীক্ষার ফি/মূল্য আবশ্যক!' : 'Test fee/price is required!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTestId) {
        updateDiagnosticTest(editingTestId, {
          name: formData.name.trim(),
          banglaName: formData.banglaName.trim() || undefined,
          category: formData.category,
          price: formData.price.trim(),
          priceEn: formData.priceEn.trim() || undefined,
          deliveryTime: formData.deliveryTime.trim() || '২ ঘণ্টা',
          deliveryTimeEn: formData.deliveryTimeEn.trim() || undefined,
          fastingRequired: formData.fastingRequired
        });
        showFeedback(isBn ? 'পরীক্ষার তথ্য ও মূল্য সফলভাবে আপডেট করা হয়েছে!' : 'Diagnostic test updated successfully!');
      } else {
        addDiagnosticTest({
          name: formData.name.trim(),
          banglaName: formData.banglaName.trim() || undefined,
          category: formData.category,
          price: formData.price.trim(),
          priceEn: formData.priceEn.trim() || undefined,
          deliveryTime: formData.deliveryTime.trim() || '২ ঘণ্টা',
          deliveryTimeEn: formData.deliveryTimeEn.trim() || undefined,
          fastingRequired: formData.fastingRequired
        });
        showFeedback(isBn ? 'নতুন পরীক্ষা সফলভাবে তালিকায় যোগ করা হয়েছে!' : 'New diagnostic test added successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'সংরক্ষণে ত্রুটি দেখা দিয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    removeDiagnosticTest(deleteTarget.id);
    showFeedback(isBn ? `"${deleteTarget.name}" তালিকা থেকে সফলভাবে মুছে ফেলা হয়েছে!` : `"${deleteTarget.name}" removed successfully!`);
    setDeleteTarget(null);
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Top Banner with Stats */}
      <div className="bg-gradient-to-r from-[#0E3A53] to-[#174e6f] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-6 h-6 text-cyan-300" />
              <h2 className="text-2xl font-bold font-display">
                {isBn ? 'পরীক্ষা-নিরীক্ষা ও সম্ভাব্য মূল্য তালিকা ব্যবস্থাপনা' : 'Diagnostic Tests & Pricing Management'}
              </h2>
            </div>
            <p className="text-cyan-100 text-sm max-w-2xl">
              {isBn 
                ? 'হাসপাতালের সকল ল্যাব ও রেডিওলজিক্যাল পরীক্ষার নাম, ফি এবং রিপোর্ট ডেলিভারির সময় পরিবর্তন বা যোগ করুন। ডেটা স্বয়ংক্রিয়ভাবে ক্লাউড ডেটাবেসে সংরক্ষিত হয়।'
                : 'Manage all pathological & radiological lab tests, fees, and turnaround times. Real-time sync with Cloud Firestore.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDirectDownloadAndPrintPriceList}
              disabled={isDownloadingTests}
              id="adminPrintTestsBannerBtn"
              className="bg-white/20 hover:bg-white/30 text-white px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/25 shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              title={isBn ? "হাসপাতালের সকল ডায়াগনস্টিক পরীক্ষার মূল্য তালিকা সরাসরি PDF ডাউনলোড ও প্রিন্ট করুন" : "Directly download as PDF and print diagnostic test tariff list"}
            >
              {isDownloadingTests ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <Download className="w-4 h-4 text-amber-300" />
              )}
              <span>
                {isDownloadingTests
                  ? (isBn ? 'ডাউনলোড হচ্ছে...' : 'Downloading...')
                  : (isBn ? 'মূল্য তালিকা ডাউনলোড/প্রিন্ট' : 'Download / Print List')}
              </span>
            </button>
            <button
              onClick={handleOpenAddModal}
              id="adminAddTestBtn"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'নতুন টেস্ট যোগ করুন' : 'Add New Test'}</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm(isBn ? 'আপনি কি নিশ্চিত যে টেস্ট তালিকা ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?' : 'Reset tests to default data?')) {
                  resetDiagnosticTests();
                  showFeedback(isBn ? 'টেস্ট তালিকা ডিফল্ট অবস্থায় রিসেট হয়েছে!' : 'Tests reset to default!');
                }
              }}
              title={isBn ? 'ডিফল্ট ডেটায় রিসেট করুন' : 'Reset to Default'}
              className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 rounded-xl p-3">
            <span className="text-xs text-cyan-200 block">{isBn ? 'মোট পরীক্ষা' : 'Total Tests'}</span>
            <span className="text-xl font-bold text-white">{diagnosticTests.length} টি</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <span className="text-xs text-cyan-200 block">{isBn ? 'প্যাথলজি ও রক্ত' : 'Pathology Tests'}</span>
            <span className="text-xl font-bold text-cyan-300">{pathologyCount} টি</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <span className="text-xs text-cyan-200 block">{isBn ? 'ইমেজিং ও এক্স-রে' : 'Imaging Tests'}</span>
            <span className="text-xl font-bold text-yellow-300">{imagingCount} টি</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <span className="text-xs text-cyan-200 block">{isBn ? 'খালি পেট প্রযোজ্য' : 'Fasting Needed'}</span>
            <span className="text-xl font-bold text-emerald-300">{fastingCount} টি</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? "টেস্টের নাম বা ফি দিয়ে সার্চ করুন..." : "Search test by name or fee..."}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E3A53] focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#0E3A53] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isBn ? `সকল (${diagnosticTests.length})` : `All (${diagnosticTests.length})`}
          </button>
          <button
            onClick={() => setSelectedCategory('pathology')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
              selectedCategory === 'pathology'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>{isBn ? `রক্ত ও প্যাথলজি (${pathologyCount})` : `Pathology (${pathologyCount})`}</span>
          </button>
          <button
            onClick={() => setSelectedCategory('imaging')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
              selectedCategory === 'imaging'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Stethoscope className="w-3 h-3" />
            <span>{isBn ? `ইমেজিং ও এক্স-রে (${imagingCount})` : `Imaging (${imagingCount})`}</span>
          </button>

          <button
            onClick={handleDirectDownloadAndPrintPriceList}
            disabled={isDownloadingTests}
            id="adminPrintTestsFilterBtn"
            className="inline-flex items-center gap-1.5 bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer shadow-xs whitespace-nowrap shrink-0 ml-auto md:ml-2 disabled:opacity-50 active:scale-95"
            title={isBn ? "হাসপাতালের সকল ডায়াগনস্টিক পরীক্ষার মূল্য তালিকা সরাসরি PDF ডাউনলোড ও প্রিন্ট করুন" : "Directly download as PDF and print diagnostic test tariff list"}
          >
            {isDownloadingTests ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
            ) : (
              <Printer className="w-3.5 h-3.5 text-[#C9973B]" />
            )}
            <span>
              {isDownloadingTests
                ? (isBn ? "ডাউনলোড হচ্ছে..." : "Downloading...")
                : (isBn ? "মূল্য তালিকা প্রিন্ট ও PDF" : "Print & PDF Tariff")}
            </span>
          </button>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50/80 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">{isBn ? 'পরীক্ষার নাম' : 'Test Name'}</th>
                <th className="px-5 py-3.5">{isBn ? 'বিভাগ' : 'Category'}</th>
                <th className="px-5 py-3.5">{isBn ? 'রিপোর্ট ডেলিভারি' : 'Delivery Time'}</th>
                <th className="px-5 py-3.5">{isBn ? 'খালি পেট' : 'Fasting'}</th>
                <th className="px-5 py-3.5 text-right">{isBn ? 'সম্ভাব্য ফি' : 'Fee / Price'}</th>
                <th className="px-5 py-3.5 text-center">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    <Activity className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="font-medium text-gray-600">
                      {isBn ? 'কোনো পরীক্ষা পাওয়া যায়নি।' : 'No diagnostic tests found.'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {isBn ? 'নতুন টেস্ট যোগ করতে উপরের বাটনে ক্লিক করুন।' : 'Click the button above to add a new test.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-gray-900">{test.name}</div>
                      {test.banglaName && (
                        <div className="text-xs text-gray-500">{test.banglaName}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {test.category === 'pathology' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <Activity className="w-3 h-3" />
                          {isBn ? 'রক্ত ও প্যাথলজি' : 'Pathology'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          <Stethoscope className="w-3 h-3" />
                          {isBn ? 'ইমেজিং ও এক্স-রে' : 'Imaging'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{isBn ? test.deliveryTime : (test.deliveryTimeEn || test.deliveryTime)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {test.fastingRequired ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3" />
                          {isBn ? 'খালি পেট প্রয়োজন' : 'Fasting Required'}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {isBn ? 'প্রয়োজন নেই' : 'Not Required'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="font-bold text-gray-900 text-base">
                        {isBn ? test.price : (test.priceEn || test.price)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(test)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title={isBn ? 'সম্পাদনা করুন' : 'Edit'}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(test)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#0E3A53] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-300" />
                <h3 className="font-bold text-lg font-display">
                  {editingTestId 
                    ? (isBn ? 'পরীক্ষার তথ্য ও মূল্য পরিবর্তন' : 'Edit Diagnostic Test & Fee') 
                    : (isBn ? 'নতুন পরীক্ষা ও মূল্য তালিকা যোগ করুন' : 'Add New Diagnostic Test')}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* English Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isBn ? 'পরীক্ষার নাম (ইংরেজি) *' : 'Test Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. CBC (Complete Blood Count) or USG of Whole Abdomen"
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E3A53]"
                  />
                </div>

                {/* Bangla Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isBn ? 'পরীক্ষার নাম (বাংলা)' : 'Test Name (Bengali)'}
                  </label>
                  <input
                    type="text"
                    value={formData.banglaName}
                    onChange={(e) => setFormData({ ...formData, banglaName: e.target.value })}
                    placeholder="যেমন: সম্পূর্ণ রক্ত গণনা পরীক্ষা / কিডনি ফাংশন টেস্ট"
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E3A53]"
                  />
                </div>

                {/* Category */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isBn ? 'টেস্টের বিভাগ *' : 'Category *'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, category: 'pathology' })}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                        formData.category === 'pathology'
                          ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span>{isBn ? 'রক্ত ও প্যাথলজি' : 'Pathology'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, category: 'imaging' })}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                        formData.category === 'imaging'
                          ? 'border-slate-800 bg-slate-100 text-slate-900 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4 text-slate-800" />
                      <span>{isBn ? 'ইমেজিং ও এক্স-রে' : 'Imaging'}</span>
                    </button>
                  </div>
                </div>

                {/* Price Bangla */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isBn ? 'ফি / মূল্য (বাংলা) *' : 'Fee / Price (Bengali) *'}
                  </label>
                  <div className="relative">
                    <Coins className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="যেমন: ৳ ৪০০"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E3A53]"
                    />
                  </div>
                </div>

                {/* Price English */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isBn ? 'ফি / মূল্য (ইংরেজি)' : 'Fee / Price (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.priceEn}
                    onChange={(e) => setFormData({ ...formData, priceEn: e.target.value })}
                    placeholder="e.g. BDT 400"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E3A53]"
                  />
                </div>

                {/* Delivery Time Bangla */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isBn ? 'রিপোর্ট প্রদানের সময় (বাংলা)' : 'Report Time (Bengali)'}
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    placeholder="যেমন: ২ ঘণ্টা / জরুরি ৩০ মিনিট"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E3A53]"
                  />
                </div>

                {/* Delivery Time English */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isBn ? 'রিপোর্ট প্রদানের সময় (ইংরেজি)' : 'Report Time (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryTimeEn}
                    onChange={(e) => setFormData({ ...formData, deliveryTimeEn: e.target.value })}
                    placeholder="e.g. 2 Hours"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E3A53]"
                  />
                </div>

                {/* Fasting Required Toggle */}
                <div className="sm:col-span-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.fastingRequired}
                      onChange={(e) => setFormData({ ...formData, fastingRequired: e.target.checked })}
                      className="w-4 h-4 text-[#0E3A53] rounded focus:ring-[#0E3A53]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-gray-800 block">
                        {isBn ? 'খালি পেটে আসা আবশ্যক (Fasting Required)' : 'Fasting Required for this test'}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {isBn ? 'চিহ্নিত করলে রোগীকে খালি পেটে আসার নির্দেশনা প্রদর্শিত হবে।' : 'Check if patient needs 8-12 hours fasting before test.'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm bg-[#0E3A53] hover:bg-[#144f72] text-white font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>{isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
                  ) : (
                    <span>{editingTestId ? (isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes') : (isBn ? 'টেস্ট যুক্ত করুন' : 'Add Test')}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Avoids window.confirm in iframe) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg mb-2">
              {isBn ? 'টেস্টটি মুছে ফেলতে চান?' : 'Delete Test?'}
            </h4>
            <p className="text-gray-600 text-xs mb-6">
              {isBn 
                ? `আপনি কি নিশ্চিত যে "${deleteTarget.name}" পরীক্ষাটি তালিকা ও ডেটাবেস থেকে মুছে ফেলতে চান?` 
                : `Are you sure you want to delete "${deleteTarget.name}" from database?`}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-sm transition-colors"
              >
                {isBn ? 'হ্যাঁ, মুছুন' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostic Price List Print Modal */}
      {showPrintModal && (
        <DiagnosticPricePrintModal
          tests={diagnosticTests}
          onClose={() => setShowPrintModal(false)}
          isBn={isBn}
        />
      )}

      {/* OFF-SCREEN HIGH-FIDELITY TEST PRICE LIST CONTAINER FOR DIRECT PDF DOWNLOAD & ISOLATED PRINT */}
      <div 
        id="admin-tests-print-wrapper"
        style={{ position: 'absolute', left: '-9999px', top: 0, width: '900px', background: '#ffffff', zIndex: -999 }} 
        aria-hidden="true"
      >
        <div id="admin-diagnostic-tests-printable-content" className="p-8 bg-white text-gray-800 space-y-4">
          <PrintLetterhead
            documentTitle={
              selectedCategory === 'pathology'
                ? (isBn ? "প্যাথলজি ও ল্যাবরেটরি টেস্ট মূল্য তালিকা" : "Pathology & Laboratory Test Tariff Chart")
                : selectedCategory === 'imaging'
                ? (isBn ? "রেডিওলজি ও ডিজিটাল ইমেজিং টেস্ট মূল্য তালিকা" : "Radiology & Digital Imaging Test Tariff Chart")
                : (isBn ? "ডিজিটাল ডায়াগনস্টিক ও প্যাথলজি টেস্ট সম্ভাব্য মূল্য তালিকা" : "Digital Diagnostic & Pathology Test Price List")
            }
            documentSubtitle={
              isBn
                ? `হাসপাতাল ডায়াগনস্টিক ও প্যাথলজি বিভাগ | মোট টেস্ট: ${(filteredTests.length > 0 ? filteredTests : diagnosticTests).length} টি | আনোয়ারা মেডিকেল কমপ্লেক্স`
                : `Diagnostic & Pathology Division | Total Tests: ${(filteredTests.length > 0 ? filteredTests : diagnosticTests).length} | Anowara Medical Complex`
            }
            refNo={`AMC/TEST/${new Date().getFullYear()}/${selectedCategory.toUpperCase()}`}
            date={new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            isBn={isBn}
          />

          {/* Quick Notice Banner */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl px-4 py-2.5 text-xs flex items-center justify-between">
            <span className="font-bold text-[#0E3A53]">
              {isBn 
                ? "🏥 আনোয়ারা মেডিকেল কমপ্লেক্স - ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী" 
                : "🏥 Anowara Medical Complex - WAPDA Sadar Road, Medical Mor, Palash, Narsingdi"}
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              {isBn ? "ল্যাব হটলাইন: 01972-692504, 01944-874304" : "Lab Hotline: 01972-692504"}
            </span>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-center text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-semibold">{isBn ? "মোট তালিকাভুক্ত টেস্ট" : "Total Tests"}</span>
              <span className="font-bold text-gray-900 text-sm">{(filteredTests.length > 0 ? filteredTests : diagnosticTests).length} টি</span>
            </div>
            <div>
              <span className="text-blue-600 block text-[10px] uppercase font-semibold">{isBn ? "রক্ত ও প্যাথলজি" : "Pathology"}</span>
              <span className="font-bold text-blue-700 text-sm">{pathologyCount} টি</span>
            </div>
            <div>
              <span className="text-purple-600 block text-[10px] uppercase font-semibold">{isBn ? "ইমেজিং ও এক্স-রে" : "Imaging"}</span>
              <span className="font-bold text-purple-700 text-sm">{imagingCount} টি</span>
            </div>
            <div>
              <span className="text-emerald-600 block text-[10px] uppercase font-semibold">{isBn ? "রিপোর্ট ডেলিভারি" : "Delivery"}</span>
              <span className="font-bold text-emerald-700 text-sm">{isBn ? "একই দিনে / দ্রুত" : "Same Day / Fast"}</span>
            </div>
          </div>

          {/* Tests Table */}
          <div className="border border-gray-300 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0E3A53] text-white font-bold text-[11px]">
                  <th className="py-2.5 px-2 text-center w-8 border border-[#1B4B68]">#</th>
                  <th className="py-2.5 px-3 border border-[#1B4B68]">{isBn ? "পরীক্ষার নাম ও বিবরণ" : "Test Name & Description"}</th>
                  <th className="py-2.5 px-3 border border-[#1B4B68] w-40">{isBn ? "বিভাগ" : "Category"}</th>
                  <th className="py-2.5 px-3 border border-[#1B4B68] w-36 text-center">{isBn ? "রিপোর্ট ডেলিভারি" : "Delivery Time"}</th>
                  <th className="py-2.5 px-3 border border-[#1B4B68] w-32 text-center">{isBn ? "প্রস্তুতি / খালি পেট" : "Fasting Required"}</th>
                  <th className="py-2.5 px-3 border border-[#1B4B68] w-28 text-right bg-[#0A2A3D] text-[#C9973B] font-extrabold">{isBn ? "সম্ভাব্য ফি" : "Price / Fee"}</th>
                </tr>
              </thead>
              <tbody>
                {(filteredTests.length > 0 ? filteredTests : diagnosticTests).map((test, index) => (
                  <tr key={`print-test-${test.id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                    <td className="py-2 px-2 text-center font-bold text-gray-500 border border-gray-300">{index + 1}</td>
                    <td className="py-2 px-3 border border-gray-300">
                      <div className="font-bold text-gray-900 text-xs">{test.name}</div>
                      {test.banglaName && (
                        <div className="text-[10px] text-gray-600 font-normal">{test.banglaName}</div>
                      )}
                    </td>
                    <td className="py-2 px-3 border border-gray-300">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        test.category === 'pathology' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {test.category === 'pathology' ? (isBn ? 'রক্ত ও প্যাথলজি' : 'Pathology') : (isBn ? 'ইমেজিং ও এক্স-রে' : 'Imaging')}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center border border-gray-300 font-medium text-gray-700 text-[11px]">
                      {test.deliveryTime}
                    </td>
                    <td className="py-2 px-3 text-center border border-gray-300 text-[10.5px]">
                      {test.fastingRequired ? (
                        <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {isBn ? 'খালি পেট প্রয়োজন' : 'Fasting Required'}
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          {isBn ? 'প্রয়োজন নেই' : 'Not Required'}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-[#0E3A53] border border-gray-300 text-xs">
                      {test.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official Instructions & Seal */}
          <div className="mt-6 pt-5 border-t border-gray-300 flex justify-between items-end text-xs">
            <div className="text-center">
              <div className="w-32 border-b border-gray-500 mb-1"></div>
              <p className="font-bold text-gray-800">ল্যাব টেকনোলজিস্ট / ইনচার্জ</p>
              <p className="text-[10px] text-gray-500">প্যাথলজি ও রেডিওলজি</p>
            </div>
            <div className="border border-dashed border-[#C9973B] rounded-xl px-5 py-2 text-center bg-amber-50">
              <span className="text-[11px] font-extrabold text-[#0E3A53] block">আনোয়ারা মেডিকেল কমপ্লেক্স</span>
              <span className="text-[9px] text-emerald-700 font-bold">✓ অফিসিয়াল ডায়াগনস্টিক ও প্যাথলজি মূল্য তালিকা</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-gray-500 mb-1"></div>
              <p className="font-bold text-gray-800">মেডিকেল সুপারিনটেনডেন্ট / পরিচালক</p>
              <p className="text-[10px] text-gray-500">অনুমোদন ও সিলমোহর</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
