import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SiteNav from './components/SiteNav';

// Issue #8: globals.css previously only *named* 'Inter'/'JetBrains Mono' in its
// font-family stacks with no actual font source behind them - every browser
// silently fell back to system-ui/monospace since neither font was ever loaded.
// next/font/google self-hosts these at build time (no runtime request to Google
// Fonts, so no extra third-party network waterfall/CSP change needed) and
// exposes them as CSS custom properties via `variable`.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
