'use client';

import { useEffect } from 'react';

/**
 * Adds .scrolled to #nav when the page is scrolled past 80px,
 * matching the nav frost behaviour from index.html.
 */
export default function NavScroll() {
  useEffect(() => {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return null;
}
