import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import SiteNav from './components/SiteNav';
import SiteFooter from './components/SiteFooter';

// Issue #8: globals.css previously only *named* 'Inter'/'JetBrains Mono' in its
// font-family stacks with no actual font source behind them - every browser
// silently fell back to system-ui/monospace since neither font was ever loaded.
// next/font/google self-hosts these at build time (no runtime request to Google
// Fonts, so no extra third-party network waterfall/CSP change needed) and
// exposes them as CSS custom properties via `variable`.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });
// v2.1 display face (issue #12): the "old and comfy" half of the Raven Hotel
// reference; lawfulshenanigans.com headings already use it, so the owner's two
// sites read as siblings. Weights chosen for display use only - body stays Inter.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

// Issue #3/#4: every route inherits this unless it sets its own `metadata`/
// `generateMetadata` - the title template gives every page a real <title>
// ("Page Name · Christopher Mann") instead of the blank one a bare Next.js
// app produces with no metadata declared at all anywhere in the tree.
export const metadata: Metadata = {
  metadataBase: new URL('https://star-stack.io'),
  title: {
    default: 'Christopher Mann - Portfolio',
    template: '%s · Christopher Mann',
  },
  description: 'Personal portfolio and resume site for Christopher Mann - DevOps & MLOps engineering.',
};

// Mobile browser chrome matches the page background (WIG dark-mode rule);
// value mirrors --bg in globals.css.
export const viewport: Viewport = {
  themeColor: '#121009',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${cormorant.variable}`}>
      <body>
        {/* Scroll-settle motion (issue #17) starts content at opacity 0 and
            relies on the Reveal client component to fade it in. If JS is
            disabled or hydration fails, this fallback keeps every .reveal
            section fully visible - graceful degradation over vanishing pages. */}
        <noscript>
          <style>{`.reveal { opacity: 1; transform: none; }`}</style>
        </noscript>
        {/* Each page's <main> carries id="main" for this target. */}
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
