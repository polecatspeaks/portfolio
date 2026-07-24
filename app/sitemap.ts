import type { MetadataRoute } from 'next';

// Issue #6: no sitemap.xml existed at all (confirmed 404 live before this fix).
// Lists exactly the 3 real routes this site has - never a fabricated/aspirational one.
// lastModified is intentionally omitted (it's optional per the sitemap spec/Next's
// MetadataRoute.Sitemap type): these are static marketing pages that don't change
// per-deploy, so `new Date()` at build time would produce a different, misleading
// "recently updated" timestamp on every single build regardless of whether content
// actually changed - the opposite of what lastmod is meant to signal to crawlers
// (round-1 adversarial review caught this).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://star-stack.io/' },
    { url: 'https://star-stack.io/experience' },
    { url: 'https://star-stack.io/projects' },
  ];
}
