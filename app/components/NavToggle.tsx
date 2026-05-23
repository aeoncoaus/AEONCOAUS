'use client';

import { useEffect, useState } from 'react';

/**
 * Hamburger button + drawer toggling logic for #primary-nav.
 *
 * The button + the matching <ul id="primary-nav"> both live in the static
 * Nav server component. This client component just attaches handlers via
 * IDs after hydration — mirroring the vanilla JS in the original index.html.
 */
export default function NavToggle() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('primary-nav');
    const nav = document.getElementById('nav');
    if (!toggle || !links || !nav) return;

    const apply = (isOpen: boolean) => {
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      links.classList.toggle('is-open', isOpen);
      setOpen(isOpen);
    };

    const onToggleClick = () => apply(toggle.getAttribute('aria-expanded') !== 'true');
    const onLinksClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'A') apply(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        apply(false);
        toggle.focus();
      }
    };
    const onDocClick = (e: MouseEvent) => {
      if (
        toggle.getAttribute('aria-expanded') === 'true' &&
        !nav.contains(e.target as Node)
      ) {
        apply(false);
      }
    };
    const mql = window.matchMedia('(min-width: 969px)');
    const onMql = (e: MediaQueryListEvent) => { if (e.matches) apply(false); };

    toggle.addEventListener('click', onToggleClick);
    links.addEventListener('click', onLinksClick);
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onDocClick);
    mql.addEventListener('change', onMql);

    return () => {
      toggle.removeEventListener('click', onToggleClick);
      links.removeEventListener('click', onLinksClick);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onDocClick);
      mql.removeEventListener('change', onMql);
    };
  }, []);

  // Component renders nothing — it only wires up handlers. Keeping the
  // `open` state ensures React re-runs effects if internals ever need it.
  void open;
  return null;
}
