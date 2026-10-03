import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export interface SlipData {
  token: string;
  orderNumber?: string;
  name: string;
  phone: string;
  doctor?: string;
  age?: string;
  gender?: string;
  date?: string;
  isBn?: boolean;
}

/**
 * Trigger browser file download from Blob or DataURL
 */
const triggerDownload = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }, 300);
};

/**
 * Fallback direct Canvas generator for 100% reliability in restricted sandboxes
 */
export const generateCanvasSlip = async (data: SlipData): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  const width = 800;
  const height = 1100;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas 2D context not available');

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Outer border with medical brand color
  ctx.strokeStyle = '#0E3A53';
  ctx.lineWidth = 12;
  ctx.strokeRect(16, 16, width - 32, height - 32);

  // Inner subtle border
  ctx.strokeStyle = '#2D8FC1';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // Header banner background
  ctx.fillStyle = '#0E3A53';
  ctx.fillRect(32, 32, width - 64, 130);

  // Hospital Name
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = 'bold 30px "Hind Siliguri", sans-serif, system-ui';
  ctx.fillText('আনোয়ারা মেডিকেল কমপ্লেক্স', width / 2, 80);

  ctx.fillStyle = '#C9973B';
  ctx.font = 'bold 16px sans-serif, system-ui';
  ctx.fillText('ANOWARA MEDICAL COMPLEX & DIAGNOSTIC', width / 2, 108);

  ctx.fillStyle = '#E7F2F8';
  ctx.font = '14px "Hind Siliguri", sans-serif, system-ui';
  ctx.fillText('ওয়াপদা সদর রোড, মেডিকেল মোড়, পলাশ, নরসিংদী | ☎️ 01712-692504, 01944-874304', width / 2, 138);

  // Slip Title Badge
  ctx.fillStyle = '#E7F2F8';
  ctx.fillRect(160, 185, width - 320, 48);
  ctx.strokeStyle = '#2D8FC1';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(160, 185, width - 320, 48);

  ctx.fillStyle = '#0E3A53';
  ctx.font = 'bold 20px "Hind Siliguri", sans-serif, system-ui';
  ctx.fillText('অনলাইন সিরিয়াল কনফার্মেশন স্লিপ', width / 2, 216);

  // Token Box (High Visibility)
  ctx.fillStyle = '#F8FAFB';
  ctx.fillRect(80, 260, width - 160, 150);
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 260, width - 160, 150);

  // Token Label
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 16px "Hind Siliguri", sans-serif, system-ui';
  ctx.fillText('আপনার সিরিয়াল টোকেন কোড (TOKEN CODE)', width / 2, 295);

  // Token Code Number
  ctx.fillStyle = '#0E3A53';
  ctx.font = 'bold 44px monospace, sans-serif';
  ctx.fillText(data.token, width / 2, 350);

  // Order Tracking Number
  if (data.orderNumber) {
    ctx.fillStyle = '#2D8FC1';
    ctx.font = 'bold 15px monospace, sans-serif';
    ctx.fillText(`অর্ডার ট্র্যাকিং নং: ${data.orderNumber}`, width / 2, 385);
  }

  // Patient Information Table
  const tableY = 445;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(80, tableY, width - 160, 290);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(80, tableY, width - 160, 290);

  // Table header
  ctx.fillStyle = '#0E3A53';
  ctx.fillRect(80, tableY, width - 160, 42);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px "Hind Siliguri", sans-serif, system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('রোগীর তথ্য ও বুকিং বিবরণী (Patient & Booking Details)', 100, tableY + 27);

  const rows = [
    { label: 'রোগীর নাম (Patient Name)', value: data.name },
    { label: 'মোবাইল নম্বর (Phone)', value: data.phone },
    { label: 'নির্ধারিত ডাক্তার (Doctor)', value: data.doctor || 'সাধারণ বহির্বিভাগ (General)' },
    { label: 'বয়স ও লিঙ্গ (Age/Gender)', value: `${data.age ? data.age + ' বছর' : '-'} / ${data.gender || '-'}` },
    { label: 'সাক্ষাতের সময় (Visiting Slot)', value: 'রিসেপশন থেকে ফোনে নিশ্চিত করা হবে' },
  ];

  let currentY = tableY + 42;
  rows.forEach((row, i) => {
    // Zebra striping
    if (i % 2 === 0) {
      ctx.fillStyle = '#F8FAFB';
      ctx.fillRect(80, currentY, width - 160, 48);
    }
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, currentY + 48);
    ctx.lineTo(width - 80, currentY + 48);
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 14px "Hind Siliguri", sans-serif, system-ui';
    ctx.fillText(row.label, 100, currentY + 30);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 15px "Hind Siliguri", sans-serif, system-ui';
    ctx.fillText(row.value, 360, currentY + 30);

    currentY += 48;
  });

  // QR Code Generation
  try {
    const qrDataText = `ANOWARA MEDICAL COMPLEX | Token: ${data.token} | Order: ${data.orderNumber || 'N/A'} | Patient: ${data.name} | Phone: ${data.phone}`;
    const qrDataUrl = await QRCode.toDataURL(qrDataText, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0E3A53',
        light: '#FFFFFF'
      }
    });

    const qrImg = new Image();
    await new Promise((resolve) => {
      qrImg.onload = resolve;
      qrImg.src = qrDataUrl;
    });

    ctx.drawImage(qrImg, 90, 760, 130, 130);
  } catch (err) {
    console.warn('QR code generation failed, continuing without QR:', err);
  }

  // Instructions next to QR Code
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0E3A53';
  ctx.font = 'bold 16px "Hind Siliguri", sans-serif, system-ui';
  ctx.fillText('গুরুত্বপূর্ণ নির্দেশনাবলী:', 240, 785);

  ctx.fillStyle = '#334155';
  ctx.font = '13px "Hind Siliguri", sans-serif, system-ui';
  ctx.fillText('১. আপনার দেওয়া মোবাইল নম্বরটি সচল রাখুন; রিসেপশন ডেস্ক থেকে শীঘ্রই ফোন করা হবে।', 240, 815);
  ctx.fillText('২. হাসপাতালে আসার সময় এই ডাউনলোডকৃত স্লিপ বা টোকেন নম্বরটি কাউন্টারে প্রদর্শন করুন।', 240, 840);
  ctx.fillText('৩. যেকোনো প্রয়োজনে আমাদের হটলাইনে ফোন করুন: 01712-692504 অথবা 01944-874304', 240, 865);
  ctx.fillText(`৪. স্লিপ তৈরির তারিখ ও সময়: ${new Date().toLocaleString('bn-BD')}`, 240, 890);

  // Footer note
  ctx.fillStyle = '#0E3A53';
  ctx.fillRect(32, height - 85, width - 64, 50);

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = 'bold 14px "Hind Siliguri", sans-serif, system-ui';
  ctx.fillText('আনোয়ারা মেডিকেল কমপ্লেক্স ও ডায়াগনস্টিক সেন্টার — আপনার সুস্থতাই আমাদের অঙ্গীকার', width / 2, height - 54);

  return canvas;
};

/**
 * Capture a specific DOM element and download as PDF or PNG.
 * Automatically falls back to the canvas generator if the element capture fails.
 */
export const downloadAppointmentSlip = async (
  elementId: string,
  data: SlipData,
  format: 'pdf' | 'png' = 'pdf',
  onProgress?: (loading: boolean) => void
): Promise<boolean> => {
  if (onProgress) onProgress(true);

  const filename = `AMC-Serial-Slip-${data.token || 'Confirmed'}.${format}`;

  try {
    const targetElement = document.getElementById(elementId);
    let canvas: HTMLCanvasElement | null = null;

    if (targetElement) {
      try {
        // Temporarily prepare element for crisp capture
        canvas = await html2canvas(targetElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FFFFFF',
          logging: false,
          ignoreElements: (el) => {
            return (
              el.classList.contains('no-download-capture') ||
              el.getAttribute('data-no-capture') === 'true'
            );
          },
        });
      } catch (captureErr) {
        console.warn('html2canvas capture had an issue, using fallback canvas slip:', captureErr);
      }
    }

    // Fallback if element capture didn't produce canvas
    if (!canvas) {
      canvas = await generateCanvasSlip(data);
    }

    if (format === 'png') {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      triggerDownload(dataUrl, filename);
    } else {
      // PDF format
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Fit to A4 with margins
      const margin = 10;
      const maxW = pageWidth - margin * 2;
      const maxH = pageHeight - margin * 2;

      const imgWidth = maxW;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const yOffset = imgHeight < maxH ? (pageHeight - imgHeight) / 2 : margin;

      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', margin, yOffset, imgWidth, Math.min(imgHeight, maxH));
      pdf.save(filename);
    }

    if (onProgress) onProgress(false);
    return true;
  } catch (error) {
    console.error('Download slip error, trying direct canvas fallback:', error);
    try {
      const fallbackCanvas = await generateCanvasSlip(data);
      if (format === 'png') {
        const dataUrl = fallbackCanvas.toDataURL('image/png', 1.0);
        triggerDownload(dataUrl, filename);
      } else {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const imgHeight = (fallbackCanvas.height * imgWidth) / fallbackCanvas.width;
        pdf.addImage(fallbackCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 10, 10, imgWidth, imgHeight);
        pdf.save(filename);
      }
      if (onProgress) onProgress(false);
      return true;
    } catch (finalErr) {
      console.error('Final fallback also failed:', finalErr);
      if (onProgress) onProgress(false);
      alert('স্লিপ ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে স্ক্রিনশট নিন অথবা হটলাইনে যোগাযোগ করুন।');
      return false;
    }
  }
};
