import type { MetadataRoute } from 'next';

// Issue #6: no sitemap.xml existed at all (confirmed 404 live before this fix).
// Lists exactly the 3 real routes this site has - never a fabricated/aspirational one.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://star-stack.io/', lastModified: new Date() },
    { url: 'https://star-stack.io/experience', lastModified: new Date() },
    { url: 'https://star-stack.io/projects', lastModified: new Date() },
  ];
}
