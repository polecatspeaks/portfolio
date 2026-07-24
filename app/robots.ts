import type { MetadataRoute } from 'next';

// Issue #6: no robots.txt existed at all (confirmed 404 live before this fix).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://star-stack.io/sitemap.xml',
  };
}
