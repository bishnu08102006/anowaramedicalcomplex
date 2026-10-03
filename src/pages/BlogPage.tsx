import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  User, 
  Calendar, 
  Clock, 
  Tag, 
  ChevronRight, 
  X, 
  ArrowRight,
  Phone,
  Share2,
  Check
} from 'lucide-react';
import { PageBanner } from '../components/PageBanner';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { BlogPost } from '../data/blogs';

interface BlogPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: any) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  onNavigateHome,
  onNavigate,
}) => {
  const { isBn } = useLanguage();
  const { blogs } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    blogs.forEach((b) => {
      cats.add(isBn ? b.category : b.categoryEn);
    });
    return Array.from(cats);
  }, [blogs, isBn]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const title = (isBn ? b.title : b.titleEn).toLowerCase();
      const author = (isBn ? b.author : b.authorEn).toLowerCase();
      const category = (isBn ? b.category : b.categoryEn).toLowerCase();
      const summary = (isBn ? b.summary : b.summaryEn).toLowerCase();
      const tags = b.tags.join(' ').toLowerCase();
      const q = searchQuery.trim().toLowerCase();

      const matchesSearch = !q || title.includes(q) || author.includes(q) || summary.includes(q) || tags.includes(q);
      const matchesCat = selectedCategory === 'all' || (isBn ? b.category : b.categoryEn) === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [blogs, searchQuery, selectedCategory, isBn]);

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="blog-page" className="min-h-screen bg-[#F8FAFB]">
      <PageBanner
        title={isBn ? "স্বাস্থ্য ব্লগ ও চিকিৎসা পরামর্শ" : "Health Blog & Medical Insights"}
        subtitle={isBn 
          ? "আনোয়ারা মেডিকেল কমপ্লেক্সের বিশেষজ্ঞ চিকিৎসকদের স্বাস্থ্য সচেতনতামূলক তথ্য, বিদেশগামী প্রস্তুতি ও আধুনিক পরীক্ষা বিষয়ক নিয়মিত নিবন্ধ" 
          : "Authoritative healthcare guidelines, medical checkup tips, and clinical updates by senior physicians"}
        icon={BookOpen}
        badge={isBn ? "ব্লগ ও স্বাস্থ্যবার্তা" : "Health Journal"}
        currentPageName={isBn ? "ব্লগ" : "Blog"}
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? "ব্লগ বা বিষয় লিখে খুঁজুন..." : "Search articles by title or keyword..."}
                className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FC1] focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Article Count */}
            <span className="text-xs text-gray-500 font-medium shrink-0">
              {isBn 
                ? `মোট নিবন্ধ: ${filteredBlogs.length} টি` 
                : `Showing ${filteredBlogs.length} article(s)`}
            </span>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0E3A53] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isBn ? 'সকল বিভাগ' : 'All Categories'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0E3A53] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-sm max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 mb-1">
              {isBn ? 'কোনো ব্লগ নিবন্ধ খুঁজে পাওয়া যায়নি' : 'No articles found'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {isBn ? 'ভিন্ন শব্দ দিয়ে অনুসন্ধান করুন অথবা ফিল্টার পরিবর্তন করুন।' : 'Try a different keyword or reset categories.'}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="bg-[#0E3A53] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer"
            >
              {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredBlogs.map((article) => {
              const title = isBn ? article.title : article.titleEn;
              const author = isBn ? article.author : article.authorEn;
              const category = isBn ? article.category : article.categoryEn;
              const summary = isBn ? article.summary : article.summaryEn;
              const date = isBn ? article.date : article.dateEn;
              const readTime = isBn ? article.readTime : article.readTimeEn;

              return (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header tags: Category & ReadTime */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2D8FC1] bg-[#E7F2F8] px-2.5 py-1 rounded-full">
                        <Tag className="w-3 h-3" />
                        {category}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => setActiveArticle(article)}
                      className="text-lg sm:text-xl font-bold text-[#0E3A53] group-hover:text-[#2D8FC1] transition-colors leading-snug mb-2.5 cursor-pointer"
                    >
                      {title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {summary}
                    </p>
                  </div>

                  {/* Footer info: Author, Date & Read More */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#0E3A53] text-white flex items-center justify-center font-bold text-[10px]">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#0E3A53] text-[11px] sm:text-xs">
                          {author}
                        </span>
                        <span className="block text-[10px] text-gray-400">
                          {date}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveArticle(article)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#2D8FC1] group-hover:text-[#0E3A53] transition cursor-pointer"
                    >
                      <span>{isBn ? 'সম্পূর্ণ পড়ুন' : 'Read More'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Article category & time */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold text-[#2D8FC1] bg-[#E7F2F8] px-3 py-1 rounded-full">
                {isBn ? activeArticle.category : activeArticle.categoryEn}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {isBn ? activeArticle.date : activeArticle.dateEn}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {isBn ? activeArticle.readTime : activeArticle.readTimeEn}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-[#0E3A53] leading-snug mb-4">
              {isBn ? activeArticle.title : activeArticle.titleEn}
            </h2>

            {/* Author info */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0E3A53] text-white flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-xs sm:text-sm text-[#0E3A53]">
                    {isBn ? activeArticle.author : activeArticle.authorEn}
                  </span>
                  <span className="block text-[11px] text-gray-500">
                    {isBn ? 'আনোয়ারা মেডিকেল কমপ্লেক্স' : 'Anowara Medical Complex'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCopyShare}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-[#2D8FC1] text-xs flex items-center gap-1 cursor-pointer"
                title="লিঙ্ক কপি করুন"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'শেয়ার' : 'Share')}</span>
              </button>
            </div>

            {/* Article Content */}
            <div className="text-sm text-gray-700 leading-relaxed space-y-3 whitespace-pre-line">
              {isBn ? activeArticle.content : activeArticle.contentEn}
            </div>

            {/* Tags */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-gray-400 font-medium mr-1">{isBn ? 'ট্যাগস:' : 'Tags:'}</span>
              {activeArticle.tags.map((tag) => (
                <span key={tag} className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Hospital CTA in Modal */}
            <div className="mt-6 bg-[#E7F2F8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#2D8FC1]/30">
              <div>
                <h4 className="font-bold text-sm text-[#0E3A53]">
                  {isBn ? 'ডাক্তার অ্যাপয়েন্টমেন্ট বা টেস্টের জন্য যোগাযোগ' : 'Need Doctor Appointment or Medical Tests?'}
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  {isBn ? 'আমাদের অভিজ্ঞ কনসালটেন্টদের সাথে সাক্ষাৎ নিশ্চিত করতে এখনই সিরিয়াল নিন।' : 'Book serial online or contact our reception desk.'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    onNavigate('appointment');
                  }}
                  className="bg-[#0E3A53] hover:bg-[#0A2A3D] text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer"
                >
                  {isBn ? 'সিরিয়াল নিন' : 'Book Serial'}
                </button>
                <a
                  href="tel:01712692504"
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-[#0E3A53] text-xs font-bold px-3 py-2 rounded-full flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C9973B]" />
                  <span>{isBn ? 'কল' : 'Call'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
