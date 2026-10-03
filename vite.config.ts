import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  return {
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiApiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          doctors: path.resolve(__dirname, 'doctors.html'),
          appointment: path.resolve(__dirname, 'appointment.html'),
          diagnostics: path.resolve(__dirname, 'diagnostics.html'),
          services: path.resolve(__dirname, 'services.html'),
          management: path.resolve(__dirname, 'management.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          blog: path.resolve(__dirname, 'blog.html'),
          notices: path.resolve(__dirname, 'notices.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          verifyStaff: path.resolve(__dirname, 'verify-staff.html'),
          qrCodes: path.resolve(__dirname, 'qr-codes.html'),
          sitemap: path.resolve(__dirname, 'sitemap.html'),
          receptionist: path.resolve(__dirname, 'receptionist.html'),
          admin: path.resolve(__dirname, 'admin.html'),
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/public/**', '**/*.mp4', '**/*.webm', '**/*.avi', '**/dist/**']
      },
    },
  };
});
