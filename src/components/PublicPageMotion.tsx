import { useEffect, type FC } from 'react';

interface PublicPageMotionProps {
  page: string;
}

const DASHBOARD_PAGES = new Set([
  'admin',
  'receptionist',
  'visual-designer',
  'lab-specialist',
  'receipt-generator',
  'billing-system',
]);

export const PublicPageMotion: FC<PublicPageMotionProps> = ({ page }) => {
  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;

    const isPublicPage = !DASHBOARD_PAGES.has(page);
    main.classList.toggle('public-page-motion', isPublicPage);
    if (!isPublicPage) return;

    const targets = main.querySelectorAll<HTMLElement>(
      'section, article, [class*="grid"] > [class*="rounded-"]'
    );
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((target) => target.classList.add('amc-reveal-visible'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('amc-reveal-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('amc-reveal-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
    );

    targets.forEach((target, index) => {
      target.classList.add('amc-reveal');
      target.style.setProperty('--amc-reveal-delay', `${Math.min(index % 4, 3) * 75}ms`);
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [page]);

  return null;
};
