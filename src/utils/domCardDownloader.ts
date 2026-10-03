import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
 * Downloads any DOM element directly as high-res PDF or PNG
 * Automatically ignores elements with data-no-capture or no-download-capture
 */
export const downloadDivAsDocument = async (
  elementId: string,
  filename: string,
  format: 'pdf' | 'png' = 'pdf',
  onProgress?: (loading: boolean) => void
): Promise<boolean> => {
  if (onProgress) onProgress(true);

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found for download.`);
    if (onProgress) onProgress(false);
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      ignoreElements: (el) => {
        return (
          el.classList.contains('no-download-capture') ||
          el.getAttribute('data-no-capture') === 'true'
        );
      },
    });

    const sanitizedBase = filename.replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, '_');

    if (format === 'png') {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      triggerDownload(dataUrl, `${sanitizedBase}.png`);
    } else {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const maxW = pageWidth - margin * 2;
      const maxH = pageHeight - margin * 2;

      const imgWidth = maxW;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= maxH) {
        const yOffset = (pageHeight - imgHeight) / 2;
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', margin, yOffset, imgWidth, imgHeight);
      } else {
        const scaleFactor = maxH / imgHeight;
        const finalW = imgWidth * scaleFactor;
        const finalH = maxH;
        const xOffset = margin + (maxW - finalW) / 2;
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', xOffset, margin, finalW, finalH);
      }

      pdf.save(`${sanitizedBase}.pdf`);
    }

    if (onProgress) onProgress(false);
    return true;
  } catch (err) {
    console.error('Failed to capture and download element:', err);
    if (onProgress) onProgress(false);
    return false;
  }
};
