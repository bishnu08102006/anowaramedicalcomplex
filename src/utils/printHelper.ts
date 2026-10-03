/**
 * Bulletproof print and PDF download utility for Anowara Medical Complex
 * Handles direct printing via isolated iframe, new-window popup, and direct PDF downloading for all documents.
 */

export const isInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

/**
 * Print an element directly with zero page disruption using an isolated iframe.
 * Falls back seamlessly to popup window or window.print if iframe printing is restricted.
 */
export const printElement = (elementId: string, title?: string): boolean => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID '${elementId}' not found. Falling back to window.print()`);
    try {
      window.print();
      return true;
    } catch (e) {
      console.error('Direct print failed:', e);
      return false;
    }
  }

  const printTitle = title || 'Anowara Medical Complex - Document';
  const elementHtml = element.innerHTML;

  try {
    // Remove any previous print iframe
    const oldIframe = document.getElementById('__amc_print_iframe__');
    if (oldIframe) {
      oldIframe.remove();
    }

    // Create an isolated hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.id = '__amc_print_iframe__';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.zIndex = '-9999';
    iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      throw new Error('Cannot access iframe document');
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="bn">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${printTitle}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            * {
              box-sizing: border-box;
              font-family: 'Hind Siliguri', system-ui, -apple-system, sans-serif !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              background: #ffffff !important;
              color: #111827 !important;
              margin: 0 !important;
              padding: 10px !important;
              font-size: 13px;
              line-height: 1.5;
            }
            @page {
              margin: 8mm;
              size: auto;
            }
            @media print {
              body {
                padding: 0 !important;
              }
              .print\\:hidden, .no-print, .no-download-capture, [data-no-capture="true"] {
                display: none !important;
              }
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #d1d5db;
              padding: 6px 10px;
            }
            th {
              background-color: #f3f4f6;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body class="bg-white p-4 text-gray-900">
          <div class="max-w-4xl mx-auto">
            ${elementHtml}
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Trigger printing once content and styles have loaded
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          iframe.remove();
        }, 3000);
      } catch (err) {
        console.warn('Iframe print trigger failed, falling back to openPrintWindow:', err);
        iframe.remove();
        openPrintWindow(elementId, title);
      }
    }, 400);

    return true;
  } catch (err) {
    console.warn('Isolated iframe print setup failed, falling back to openPrintWindow:', err);
    return openPrintWindow(elementId, title);
  }
};

/**
 * Open printable content in a clean, new window with automatic print and manual controls.
 * This completely bypasses any iframe sandbox restrictions and guarantees visible buttons.
 */
export const openPrintWindow = (elementId: string, title?: string): boolean => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID '${elementId}' not found.`);
    return false;
  }

  const printTitle = title || 'Anowara Medical Complex - Official Document';
  
  try {
    const printWin = window.open('', '_blank', 'width=950,height=850,menubar=no,toolbar=no,location=no,status=no');
    if (!printWin) {
      alert('পপ-আপ উইন্ডোটি ব্লক করা হয়েছে। অনুগ্রহ করে ব্রাউজারের পপ-আপ এলাউ করুন অথবা সরাসরি PDF ডাউনলোড করুন।');
      return false;
    }

    const elementHtml = element.innerHTML;

    printWin.document.open();
    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="bn">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${printTitle}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <style>
            * {
              box-sizing: border-box;
              font-family: 'Hind Siliguri', system-ui, -apple-system, sans-serif !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              background: #ffffff !important;
              color: #111827 !important;
              margin: 0;
              padding: 20px;
              font-size: 14px;
              line-height: 1.5;
            }
            @page {
              margin: 8mm;
              size: auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #d1d5db;
              padding: 6px 10px;
            }
            th {
              background-color: #f3f4f6;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            /* ONLY hide controls when printing! */
            @media print {
              body {
                padding: 0 !important;
                margin: 0 !important;
              }
              .no-print, .print\\:hidden, .no-download-capture, [data-no-capture="true"] {
                display: none !important;
              }
            }
          </style>
        </head>
        <body class="bg-gray-50 p-4 sm:p-6 text-gray-900">
          {/* Top Control Bar with Visible Buttons */}
          <div class="no-print max-w-4xl mx-auto mb-6 p-4 bg-white rounded-2xl border border-gray-200 shadow-md flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">📄</span>
              <div>
                <strong class="text-sm text-gray-900 block">${printTitle}</strong>
                <span class="text-xs text-gray-500">আনোয়ারা মেডিকেল কমপ্লেক্স - অফিসিয়াল প্রিন্ট ভিউ</span>
              </div>
            </div>
            <div class="flex items-center gap-2.5">
              <button 
                id="popupDownloadPdfBtn"
                onclick="downloadAsPdf()" 
                style="background:#059669;color:#ffffff;padding:8px 18px;border-radius:10px;font-weight:700;font-size:13px;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 1px 3px rgba(0,0,0,0.1);"
              >
                <span>⬇️</span>
                <span>PDF ডাউনলোড</span>
              </button>
              <button 
                id="popupPrintBtn"
                onclick="window.print()" 
                style="background:#0E3A53;color:#ffffff;padding:8px 18px;border-radius:10px;font-weight:700;font-size:13px;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 1px 3px rgba(0,0,0,0.1);"
              >
                <span>🖨️</span>
                <span>প্রিন্ট করুন</span>
              </button>
              <button 
                onclick="window.close()" 
                style="background:#f3f4f6;color:#374151;padding:8px 14px;border-radius:10px;font-weight:600;font-size:13px;border:1px solid #d1d5db;cursor:pointer;display:inline-flex;align-items:center;gap:4px;"
              >
                <span>✖️</span>
                <span>বন্ধ করুন</span>
              </button>
            </div>
          </div>

          <div id="pdf-container" class="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xs border border-gray-200">
            ${elementHtml}
          </div>

          <script>
            function downloadAsPdf() {
              const el = document.getElementById('pdf-container');
              const opt = {
                margin: [8, 8, 8, 8],
                filename: '${printTitle.replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, '_')}.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
              };
              if (window.html2pdf) {
                window.html2pdf().set(opt).from(el).save();
              } else {
                window.print();
              }
            }

            window.onload = function() {
              setTimeout(function() {
                try {
                  window.focus();
                  window.print();
                } catch(e) {
                  console.error(e);
                }
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
    return true;
  } catch (err) {
    console.error('Failed to open print window:', err);
    try {
      window.print();
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Directly download an HTML element as a PDF document on the client-side.
 * Works seamlessly with Bangladeshi Bengali fonts and images.
 */
export const downloadElementAsPdf = async (
  elementId: string,
  filename?: string,
  onProgress?: (loading: boolean) => void
): Promise<boolean> => {
  if (onProgress) onProgress(true);

  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID '${elementId}' not found for PDF download. Falling back to direct print.`);
    if (onProgress) onProgress(false);
    return printElement(elementId, filename);
  }

  const sanitizedFilename = (filename || 'Anowara-Medical-Complex-Document')
    .replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, '_') + '.pdf';

  try {
    // Dynamically import html2pdf in browser environment
    const html2pdfModule: any = await import('html2pdf.js');
    const html2pdfFunc: any = html2pdfModule.default || html2pdfModule;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: sanitizedFilename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true,
        scrollY: 0,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    await html2pdfFunc().set(opt).from(element).save();
    if (onProgress) onProgress(false);
    return true;
  } catch (err) {
    console.warn('html2pdf.js dynamic export failed, falling back to print/window print:', err);
    if (onProgress) onProgress(false);
    // Fallback: trigger print dialog where users can select "Save as PDF"
    return printElement(elementId, filename);
  }
};
