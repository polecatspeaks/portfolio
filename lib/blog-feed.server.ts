import 'server-only';
import type { Post } from './blog.server';

export const SITE_URL = 'https://star-stack.io';

function xml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RFC 822 date at 12:00 UTC, so the day never shifts in any reader's time zone. */
function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toUTCString();
}

/**
 * RSS 2.0. Each item carries the summary as <description> and the full post
 * as <content:encoded>. lastBuildDate is the newest post's date, not the build
 * time, so the feed does not claim an update on every deploy.
 */
export function buildFeed(posts: Post[]): string {
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      return [
        '    <item>',
        `      <title>${xml(p.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rfc822(p.date)}</pubDate>`,
        `      <description>${xml(p.summary)}</description>`,
        ...p.tags.map((t) => `      <category>${xml(t)}</category>`),
        `      <content:encoded>${xml(p.html)}</content:encoded>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    '    <title>Christopher Mann - Blog</title>',
    `    <link>${SITE_URL}/blog</link>`,
    '    <description>Dev notes on STAR and whatever else is on the workbench.</description>',
    '    <language>en-us</language>',
    `    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>`,
    ...(posts.length > 0 ? [`    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>`] : []),
    ...(items ? [items] : []),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
