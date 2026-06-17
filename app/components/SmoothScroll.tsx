'use client';

import { useEffect } from 'react';

/**
 * Page-level scripts: smooth-scroll for same-page hash links, and the
 * IntersectionObserver-driven "reveal on scroll" for cards and stats.
 *
 * Equivalent to the bottom <script> block in index.html.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reveal on scroll
    const targets = document.querySelectorAll('.product-card, .science-stat, .blog-card');
    let io: IntersectionObserver | null = null;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('in-view'));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              window.setTimeout(() => entry.target.classList.add('in-view'), i * 100);
              io?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
      );
      targets.forEach((el) => io!.observe(el));
    }

    // Smooth scroll for same-page hash anchors (respects reduced motion)
    const nav = document.getElementById('nav');
    const anchorHandlers: Array<{ a: HTMLAnchorElement; fn: (e: Event) => void }> = [];
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
      const fn = (e: Event) => {
        const href = anchor.getAttribute('href') || '';
        if (href === '#' || anchor.classList.contains('disabled')) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navH = nav?.offsetHeight ?? 0;
        const top =
          (target as HTMLElement).getBoundingClientRect().top + window.pageYOffset - navH - 20;
        window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      };
      anchor.addEventListener('click', fn);
      anchorHandlers.push({ a: anchor, fn });
    });

    return () => {
      io?.disconnect();
      anchorHandlers.forEach(({ a, fn }) => a.removeEventListener('click', fn));
    };
  }, []);

  return null;
}
