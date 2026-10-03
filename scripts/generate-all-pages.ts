import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAGES_SEO, generateXmlSitemap, SITE_DOMAIN } from '../src/data/seoData';
import { injectSeoIntoHtml } from '../src/server/seoInjector';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');

// Crawlable semantic HTML fallbacks for each category page
function getCrawlableContentForPage(key: string, page: any): string {
  const commonHeader = `
    <header class="bg-[#0E3A53] text-white py-4 px-6 border-b border-gray-200">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <img src="/hospital-logo.svg" alt="আনোয়ারা মেডিকেল কমপ্লেক্স লোগো" class="w-10 h-10 object-contain" />
          <div>
            <h1 class="text-lg font-bold">আনোয়ারা মেডিকেল কমপ্লেক্স (Anowara Medical Complex)</h1>
            <p class="text-xs text-[#2D8FC1]">ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-xs">
          <a href="tel:01712692504" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-bold">
            জরুরি হটলাইন: 01712-692504
          </a>
          <a href="tel:01944874304" class="bg-[#2D8FC1] text-white px-3 py-1.5 rounded-lg font-semibold">
            সিরিয়াল: 01944-874304
          </a>
        </div>
      </div>
    </header>

    <nav class="bg-white border-b border-gray-200 py-2 px-6 text-xs text-gray-600">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
        <a href="/" class="hover:text-[#2D8FC1]">হোম (Home)</a>
        <span>/</span>
        <span class="text-[#0E3A53] font-bold">${page.categoryNameBn}</span>
      </div>
    </nav>
  `;

  const commonFooter = `
    <footer class="bg-[#0A2A3D] text-white/80 py-10 px-6 border-t border-white/10 mt-12 text-xs">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 class="text-sm font-bold text-white mb-2">আনোয়ারা মেডিকেল কমপ্লেক্স</h2>
          <p class="leading-relaxed text-gray-300">
            ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী। ২৪/৭ জরুরি চিকিৎসা, বিশেষজ্ঞ ডাক্তারদের চেম্বার, আধুনিক ডিজিটাল এক্স-রে ও প্যাথলজি ল্যাব।
          </p>
        </div>
        <div>
          <h3 class="text-sm font-bold text-white mb-2">জরুরি যোগাযোগ</h3>
          <ul class="space-y-1">
            <li>হটলাইন ও অ্যাম্বুলেন্স: <a href="tel:01712692504" class="text-white font-mono font-bold">01712-692504</a></li>
            <li>রিসেপশন: <a href="tel:01972692504" class="text-white font-mono">01972-692504</a></li>
            <li>ডাক্তার সিরিয়াল: <a href="tel:01944874304" class="text-white font-mono font-bold">01944-874304</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-bold text-white mb-2">গুরুত্বপূর্ণ ক্যাটাগরি</h3>
          <div class="flex flex-wrap gap-2">
            <a href="/doctors.html" class="underline hover:text-white">ডাক্তার তালিকা</a>
            <a href="/appointment.html" class="underline hover:text-white">সিরিয়াল বুকিং</a>
            <a href="/diagnostics.html" class="underline hover:text-white">টেস্ট ফি</a>
            <a href="/services.html" class="underline hover:text-white">জরুরি সেবা</a>
            <a href="/qr-codes.html" class="underline hover:text-white">কিউআর কোড</a>
            <a href="/sitemap.html" class="underline hover:text-white">সাইটম্যাপ</a>
          </div>
        </div>
      </div>
      <div class="text-center text-gray-400 mt-6 pt-4 border-t border-white/10">
        © ${new Date().getFullYear()} আনোয়ারা মেডিকেল কমপ্লেক্স (anowaramedicalcomplex.com) - পলাশ, নরসিংদী।
      </div>
    </footer>
  `;

  let bodyContent = '';

  switch (key) {
    case 'doctors':
      bodyContent = `
        <div class="max-w-5xl mx-auto px-6 py-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-[#0E3A53] mb-2">${page.titleBn}</h1>
          <p class="text-gray-600 mb-6">${page.descBn}</p>
          <div class="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 class="text-lg font-bold text-[#0E3A53] mb-4">বিশেষজ্ঞ ডাক্তারদের বিভাগ ও চেম্বার সময়সূচী:</h2>
            <ul class="space-y-4 text-sm text-gray-700">
              <li class="border-b pb-3">
                <strong class="text-base text-[#0E3A53]">মেডিসিন ও হৃদরোগ বিশেষজ্ঞ (Cardiology & Medicine)</strong><br />
                অভিজ্ঞ কনসালট্যান্ট, এমবিবিএস, বিসিএস, এফসিপিএস (মেডিসিন)। প্রতিদিন বিকাল ৩:০০ টা হতে রাত ৮:০০ টা।
              </li>
              <li class="border-b pb-3">
                <strong class="text-base text-[#0E3A53]">গাইনী ও প্রসূতি রোগ বিশেষজ্ঞ (Gynecology & Obstetrics)</strong><br />
                এমবিবিএস, ডিজিও, এফসিপিএস (গাইনী)। নরমাল ডেলিভারি ও সিজারিয়ান ওটি কেয়ার। প্রতি শনি, সোম ও বুধবার।
              </li>
              <li class="border-b pb-3">
                <strong class="text-base text-[#0E3A53]">নবজাতক ও শিশু বিশেষজ্ঞ (Pediatrics)</strong><br />
                এমবিবিএস, ডিসিএইচ, এমডি (শিশু)। শিশুর টিকাদান, পুষ্টি ও জরুরি চিকিৎসা। প্রতিদিন সকাল ৯:০০ টা হতে দুপুর ২:০০ টা।
              </li>
              <li class="border-b pb-3">
                <strong class="text-base text-[#0E3A53]">অর্থোপেডিক ও ট্রমা সার্জন (Orthopedics)</strong><br />
                হাড়ভাঙ্গা, বাতব্যথা ও জয়েন্ট বিশেষজ্ঞ সার্জন। প্রতি শুক্রবার ও রবিবার।
              </li>
            </ul>
            <div class="mt-6 flex flex-wrap gap-4">
              <a href="/appointment.html" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow">অনলাইনে সিরিয়াল নিন</a>
              <a href="tel:01944874304" class="bg-[#0E3A53] text-white font-bold px-5 py-2.5 rounded-xl">সিরিয়াল ডেস্ক: 01944-874304</a>
            </div>
          </div>
        </div>
      `;
      break;

    case 'appointment':
      bodyContent = `
        <div class="max-w-4xl mx-auto px-6 py-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-[#0E3A53] mb-2">${page.titleBn}</h1>
          <p class="text-gray-600 mb-6">${page.descBn}</p>
          <div class="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 class="text-lg font-bold text-[#0E3A53] mb-3">সহজ ৩ ধাপে সিরিয়াল বুকিং করুন:</h2>
            <ol class="list-decimal pl-5 space-y-2 text-sm text-gray-700 mb-6">
              <li>বিশেষজ্ঞ ডাক্তার নির্বাচন করুন</li>
              <li>রোগীর নাম, বয়স ও মোবাইল নম্বর পূরণ করুন</li>
              <li>ডিজিটাল সিরিয়াল টোকেন স্লিপ ডাউনলোড ও প্রিন্ট করুন</li>
            </ol>
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
              <p class="text-sm font-semibold text-blue-900">
                সরাসরি ফোনে সিরিয়াল নিতে ডায়াল করুন: <a href="tel:01944874304" class="underline font-mono font-bold text-[#0E3A53]">01944-874304</a> অথবা <a href="tel:01972692504" class="underline font-mono font-bold text-[#0E3A53]">01972-692504</a>
              </p>
            </div>
          </div>
        </div>
      `;
      break;

    case 'diagnostics':
      bodyContent = `
        <div class="max-w-5xl mx-auto px-6 py-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-[#0E3A53] mb-2">${page.titleBn}</h1>
          <p class="text-gray-600 mb-6">${page.descBn}</p>
          <div class="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 class="text-lg font-bold text-[#0E3A53] mb-4">প্রধান পরীক্ষা ও সরকারি/সাশ্রয়ী মূল্য তালিকা:</h2>
            <table class="w-full text-left text-sm border-collapse border border-gray-200">
              <thead>
                <tr class="bg-gray-100 text-[#0E3A53]">
                  <th class="p-3 border border-gray-200 font-bold">পরীক্ষার নাম</th>
                  <th class="p-3 border border-gray-200 font-bold">বিভাগ</th>
                  <th class="p-3 border border-gray-200 font-bold">রিপোর্ট ডেলিভারি</th>
                  <th class="p-3 border border-gray-200 font-bold">নির্ধারিত ফি</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="p-3 font-semibold">ডিজিটাল হাই-ফ্রিকোয়েন্সি এক্স-রে (Digital X-Ray)</td>
                  <td class="p-3">রেডিওলজি</td>
                  <td class="p-3">তাৎক্ষণিক (৩০ মিনিট)</td>
                  <td class="p-3 font-bold text-[#0E3A53]">৳৪০০ - ৳৮০০</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">৪ডি কালার ডপলার আল্ট্রাসনোগ্রাম (4D Color USG)</td>
                  <td class="p-3">আল্ট্রাসনোগ্রাফি</td>
                  <td class="p-3">তাৎক্ষণিক</td>
                  <td class="p-3 font-bold text-[#0E3A53]">৳১০০০ - ৳১৫০০</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">সিবিসি ও রক্তের রুটিন পরীক্ষা (Complete Blood Count)</td>
                  <td class="p-3">হেমাটোলজি</td>
                  <td class="p-3">২ ঘণ্টা</td>
                  <td class="p-3 font-bold text-[#0E3A53]">৳৩৫০</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">লিপিড প্রোফাইল (Lipid Profile)</td>
                  <td class="p-3">বায়োকেমিস্ট্রি</td>
                  <td class="p-3">৩ ঘণ্টা</td>
                  <td class="p-3 font-bold text-[#0E3A53]">৳৯০০</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">ডিজিটাল ইসিজি (12-Lead Digital ECG)</td>
                  <td class="p-3">কার্ডিওলজি</td>
                  <td class="p-3">তাৎক্ষণিক</td>
                  <td class="p-3 font-bold text-[#0E3A53]">৳৩০০</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
      break;

    case 'services':
      bodyContent = `
        <div class="max-w-5xl mx-auto px-6 py-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-[#0E3A53] mb-2">${page.titleBn}</h1>
          <p class="text-gray-600 mb-6">${page.descBn}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h2 class="text-lg font-bold text-[#0E3A53] mb-2">২৪ ঘণ্টা জরুরি চিকিৎসা ও ট্রমা কেয়ার</h2>
              <p class="text-sm text-gray-600">সার্বক্ষণিক অভিজ্ঞ মেডিকেল অফিসার, নার্সিং টিম ও জরুরি অক্সিজেন সুবিধা।</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h2 class="text-lg font-bold text-[#0E3A53] mb-2">নিজস্ব আধুনিক অ্যাম্বুলেন্স সার্ভিস</h2>
              <p class="text-sm text-gray-600">পলাশ, নরসিংদী ও ঢাকা মেডিকেল স্থানান্তরের জন্য সার্বক্ষণিক এসি অ্যাম্বুলেন্স: <a href="tel:01712692504" class="font-bold underline text-red-600">01712-692504</a></p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h2 class="text-lg font-bold text-[#0E3A53] mb-2">মডুলার অপারেশন থিয়েটার (OT)</h2>
              <p class="text-sm text-gray-600">হেপা ফিল্টার সম্বলিত জীবাণুমুক্ত আধুনিক ওটি কমপ্লেক্স ও অভিজ্ঞ অ্যানেস্থেশিওলজিস্ট।</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h2 class="text-lg font-bold text-[#0E3A53] mb-2">নরমাল ডেলিভারি ও প্রসূতি ইউনিট</h2>
              <p class="text-sm text-gray-600">মা ও নবজাতকের পরম সুরক্ষায় নিবেদিত প্রশিক্ষিত মিডওয়াইফ ও গাইনী সার্জন।</p>
            </div>
          </div>
        </div>
      `;
      break;

    case 'qr-codes':
      bodyContent = `
        <div class="max-w-5xl mx-auto px-6 py-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-[#0E3A53] mb-2">${page.titleBn}</h1>
          <p class="text-gray-600 mb-6">${page.descBn}</p>
          <div class="bg-white rounded-xl shadow p-6 border border-gray-200 mb-6">
            <h2 class="text-lg font-bold text-[#0E3A53] mb-3">জরুরি কিউআর কোড সূচি:</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="p-4 bg-gray-50 rounded-lg border">
                <strong>১. অফিসিয়াল ওয়েবসাইট কিউআর:</strong> anowaramedicalcomplex.com
              </div>
              <div class="p-4 bg-gray-50 rounded-lg border">
                <strong>২. অনলাইন সিরিয়াল কিউআর:</strong> anowaramedicalcomplex.com/appointment
              </div>
              <div class="p-4 bg-gray-50 rounded-lg border">
                <strong>৩. ২৪/৭ অ্যাম্বুলেন্স কল কিউআর:</strong> tel:01712692504
              </div>
              <div class="p-4 bg-gray-50 rounded-lg border">
                <strong>৪. গুগল ম্যাপ লোকেশন কিউআর:</strong> পলাশ মেডিকেল মোড় জিপিএস
              </div>
            </div>
            <p class="mt-4 text-xs text-gray-500">স্মার্টফোন ক্যামেরা দিয়ে সরাসরি স্ক্যান করে সেবাগুলো উপভোগ করুন।</p>
          </div>
        </div>
      `;
      break;

    case 'sitemap':
      bodyContent = `
        <div class="max-w-5xl mx-auto px-6 py-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-[#0E3A53] mb-2">${page.titleBn}</h1>
          <p class="text-gray-600 mb-6">${page.descBn}</p>
          <div class="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 class="text-lg font-bold text-[#0E3A53] mb-4">ক্যাটাগরি ও পেজ ডিরেক্টরি:</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <a href="/doctors.html" class="p-3 border rounded-lg hover:border-[#2D8FC1] block">
                <span class="font-bold text-[#0E3A53]">বিশেষজ্ঞ ডাক্তারদের তালিকা (/doctors)</span><br />
                <span class="text-xs text-gray-500">চেম্বার শিডিউল ও বিশেষজ্ঞ চিকিৎসকগণ</span>
              </a>
              <a href="/appointment.html" class="p-3 border rounded-lg hover:border-[#2D8FC1] block">
                <span class="font-bold text-[#0E3A53]">ডাক্তার সিরিয়াল বুকিং (/appointment)</span><br />
                <span class="text-xs text-gray-500">ডিজিটাল রোগী সিরিয়াল ও টোকেন</span>
              </a>
              <a href="/diagnostics.html" class="p-3 border rounded-lg hover:border-[#2D8FC1] block">
                <span class="font-bold text-[#0E3A53]">ডায়াগনস্টিক টেস্ট ফি তালিকা (/diagnostics)</span><br />
                <span class="text-xs text-gray-500">এক্স-রে, আল্ট্রাসনোগ্রাম ও প্যাথলজি ফি</span>
              </a>
              <a href="/services.html" class="p-3 border rounded-lg hover:border-[#2D8FC1] block">
                <span class="font-bold text-[#0E3A53]">হাসপাতাল সেবাসমূহ (/services)</span><br />
                <span class="text-xs text-gray-500">জরুরি বিভাগ, ওটি ও অ্যাম্বুলেন্স</span>
              </a>
              <a href="/qr-codes.html" class="p-3 border rounded-lg hover:border-[#2D8FC1] block">
                <span class="font-bold text-[#0E3A53]">জরুরি কিউআর কোড হাব (/qr-codes)</span><br />
                <span class="text-xs text-gray-500">ডাউনলোডযোগ্য কিউআর কোড ডিরেক্টরি</span>
              </a>
              <a href="/contact.html" class="p-3 border rounded-lg hover:border-[#2D8FC1] block">
                <span class="font-bold text-[#0E3A53]">যোগাযোগ ও লোকেশন (/contact)</span><br />
                <span class="text-xs text-gray-500">ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ</span>
              </a>
            </div>
          </div>
        </div>
      `;
      break;

    case 'contact':
      bodyContent = `
        <div class="max-w-5xl mx-auto px-6 py-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-[#0E3A53] mb-2">${page.titleBn}</h1>
          <p class="text-gray-600 mb-6">${page.descBn}</p>
          <div class="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 class="text-lg font-bold text-[#0E3A53] mb-3">হাসপাতালের সঠিক ঠিকানা ও যোগাযোগ:</h2>
            <p class="text-sm text-gray-700 leading-relaxed mb-4">
              ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী, বাংলাদেশ (পোস্ট কোড: ১৬১০)।<br />
              পলাশ ওয়াপদা মোড় হতে প্রধান সড়ক দিয়ে মাত্র ১০০ গজ সামনে এগোলেই হাতের ডানে আনোয়ারা মেডিকেল কমপ্লেক্স অবস্থিত।
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
              <div class="p-3 bg-red-50 text-red-900 rounded-lg border border-red-200">
                জরুরি হটলাইন ও অ্যাম্বুলেন্স: <br /><a href="tel:01712692504" class="text-base font-bold font-mono">01712-692504</a>
              </div>
              <div class="p-3 bg-blue-50 text-blue-900 rounded-lg border border-blue-200">
                রিসেপশন ডেস্ক: <br /><a href="tel:01972692504" class="text-base font-bold font-mono">01972-692504</a>
              </div>
              <div class="p-3 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200">
                ডাক্তার সিরিয়াল ডেস্ক: <br /><a href="tel:01944874304" class="text-base font-bold font-mono">01944-874304</a>
              </div>
            </div>
          </div>
        </div>
      `;
      break;

    default:
      bodyContent = `
        <div class="max-w-5xl mx-auto px-6 py-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-[#0E3A53] mb-2">${page.titleBn}</h1>
          <p class="text-gray-600 mb-6">${page.descBn}</p>
          <div class="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 class="text-lg font-bold text-[#0E3A53] mb-2">${page.categoryNameBn}</h2>
            <p class="text-sm text-gray-700 leading-relaxed">
              আনোয়ারা মেডিকেল কমপ্লেক্স (ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী)। ২৪ ঘণ্টা জরুরি চিকিৎসা, বিশেষজ্ঞ ডাক্তার ও ডিজিটাল ডায়াগনস্টিক। হটলাইন: ০১৭১২-৬৯২৫০৪।
            </p>
          </div>
        </div>
      `;
      break;
  }

  return `
    <div id="root">
      <div id="server-prerender-content">
        ${commonHeader}
        <main>
          ${bodyContent}
        </main>
        ${commonFooter}
      </div>
    </div>
  `;
}

function run() {
  const baseHtmlPath = path.join(rootDir, 'index.html');
  if (!fs.existsSync(baseHtmlPath)) {
    console.error('index.html not found!');
    return;
  }

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

  // 1. Process all pages
  for (const [key, cfg] of Object.entries(PAGES_SEO)) {
    let pageHtml = injectSeoIntoHtml(baseHtml, key);
    
    // Inject crawlable semantic body into <div id="root"></div> if not home
    if (key !== 'home') {
      const crawlableBody = getCrawlableContentForPage(key, cfg);
      pageHtml = pageHtml.replace('<div id="root"></div>', crawlableBody);
    }

    // Write physical root file: <key>.html
    if (key !== 'home') {
      const rootHtmlPath = path.join(rootDir, `${key}.html`);
      fs.writeFileSync(rootHtmlPath, pageHtml, 'utf-8');
      console.log(`✓ Created root physical HTML: ${key}.html`);

      // Also create subfolder <key>/index.html
      const subDir = path.join(rootDir, key);
      if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir, { recursive: true });
      }
      fs.writeFileSync(path.join(subDir, 'index.html'), pageHtml, 'utf-8');
      console.log(`✓ Created directory index HTML: ${key}/index.html`);
    }

    // If dist exists, also write to dist
    if (fs.existsSync(distDir)) {
      if (key === 'home') {
        fs.writeFileSync(path.join(distDir, 'index.html'), pageHtml, 'utf-8');
      } else {
        fs.writeFileSync(path.join(distDir, `${key}.html`), pageHtml, 'utf-8');
        const distSubDir = path.join(distDir, key);
        if (!fs.existsSync(distSubDir)) {
          fs.mkdirSync(distSubDir, { recursive: true });
        }
        fs.writeFileSync(path.join(distSubDir, 'index.html'), pageHtml, 'utf-8');
      }
    }
  }

  // 2. Generate XML sitemap
  const sitemapXml = generateXmlSitemap();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  }
  console.log('✓ Updated public/sitemap.xml');

  // 3. Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /receptionist

User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /receptionist

User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /receptionist

Host: https://anowaramedicalcomplex.com
Sitemap: https://anowaramedicalcomplex.com/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');
  }
  console.log('✓ Updated public/robots.txt');

  console.log('\nAll distinct HTML pages generated with rich crawlable content & SEO tags!');
}

run();
