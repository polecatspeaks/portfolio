import type { Metadata } from 'next';
import './globals.css';
import SiteNav from './components/SiteNav';

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
    <html lang="en">
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
