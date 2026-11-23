import { buildFeed } from '../../../lib/blog-feed.server';
import { loadPosts } from '../../../lib/blog.server';

// RSS 2.0 feed for the blog, generated once at build time.
export const dynamic = 'force-static';

export function GET() {
  return new Response(buildFeed(loadPosts()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
