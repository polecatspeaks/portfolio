'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Issue #17: scroll-settle motion. Adds .reveal-in once when the element
// enters the viewport - opacity + small translate only, plays exactly once,
// nothing loops or follows the cursor. prefers-reduced-motion is handled in
// globals.css (the .reveal styles are inert there), so users who asked for no
// motion get the content immediately with no JS dependency.
export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('reveal-in');
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('reveal-in');
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}
