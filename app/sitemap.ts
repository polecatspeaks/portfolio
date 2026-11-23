import type { MetadataRoute } from 'next';
import { loadPosts } from '../lib/blog.server';

// Issue #6: no sitemap.xml existed at all (confirmed 404 live before this fix).
// Lists exactly the real routes this site has - never a fabricated/aspirational one.
// lastModified is intentionally omitted for the static pages (it's optional per the
// sitemap spec/Next's MetadataRoute.Sitemap type): they don't change per-deploy, so
// `new Date()` at build time would produce a different, misleading "recently updated"
// timestamp on every single build regardless of whether content actually changed - the
// opposite of what lastmod is meant to signal to crawlers (round-1 adversarial review
// caught this). Blog posts DO carry lastModified: their publish date from the file name,
// a real date, and posts are never rewritten after publishing (Law 3).
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = loadPosts();
  return [
    { url: 'https://star-stack.io/' },
    { url: 'https://star-stack.io/experience' },
    { url: 'https://star-stack.io/projects' },
    { url: 'https://star-stack.io/blog' },
    ...posts.map((post) => ({
      url: `https://star-stack.io/blog/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
