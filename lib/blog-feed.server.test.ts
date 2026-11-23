import { absolutizeUrls, buildFeed } from './blog-feed.server';
import type { Post } from './blog.server';

const post = (over: Partial<Post> = {}): Post => ({
  slug: 'first-lap',
  date: '2026-11-23',
  title: 'First lap',
  summary: 'Getting STAR back on track.',
  tags: ['star'],
  draft: false,
  html: '<p>Hello &amp; welcome</p>',
  ...over,
});

test('builds an RSS 2.0 channel with one item per post', () => {
  const xml = buildFeed([post(), post({ slug: 'second', date: '2026-11-20', title: 'Second' })]);
  expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  expect(xml).toContain('<rss version="2.0"');
  expect(xml.match(/<item>/g)).toHaveLength(2);
  expect(xml).toContain('<link>https://star-stack.io/blog/first-lap</link>');
  expect(xml).toContain('<guid isPermaLink="true">https://star-stack.io/blog/first-lap</guid>');
  expect(xml).toContain('<atom:link href="https://star-stack.io/blog/feed.xml" rel="self"');
  expect(xml).toContain('<category>star</category>');
});

test('dates are the post date at noon UTC, and lastBuildDate is the newest post (not build time)', () => {
  const xml = buildFeed([post()]);
  expect(xml).toContain('<pubDate>Mon, 23 Nov 2026 12:00:00 GMT</pubDate>');
  expect(xml).toContain('<lastBuildDate>Mon, 23 Nov 2026 12:00:00 GMT</lastBuildDate>');
});

test('escapes XML special characters in titles, summaries and content', () => {
  const xml = buildFeed([post({ title: 'Fuel & "pit" <laps>', summary: "Ruth's call" })]);
  expect(xml).toContain('<title>Fuel &amp; &quot;pit&quot; &lt;laps&gt;</title>');
  expect(xml).toContain('<description>Ruth&apos;s call</description>');
  expect(xml).toContain('<content:encoded>&lt;p&gt;Hello &amp;amp; welcome&lt;/p&gt;</content:encoded>');
});

test('relative links and images in the full content become absolute site URLs', () => {
  const xml = buildFeed([
    post({
      html: '<p><a href="/projects">p</a> <a href="#notes">n</a> <a href="other">o</a> <img src="/blog/lap.png" alt="lap"></p>',
    }),
  ]);
  expect(xml).toContain('href=&quot;https://star-stack.io/projects&quot;');
  expect(xml).toContain('href=&quot;https://star-stack.io/blog/first-lap#notes&quot;');
  expect(xml).toContain('href=&quot;https://star-stack.io/blog/other&quot;');
  expect(xml).toContain('src=&quot;https://star-stack.io/blog/lap.png&quot;');
});

test('absolute and non-http link targets are left alone', () => {
  const html = '<a href="https://example.com/x?a=1&amp;b=2">e</a> <a href="mailto:me@example.com">m</a>';
  expect(absolutizeUrls(html, 'https://star-stack.io/blog/first-lap')).toBe(html);
});

test('an empty blog is still a valid channel with no items and no lastBuildDate', () => {
  const xml = buildFeed([]);
  expect(xml).toContain('<channel>');
  expect(xml).not.toContain('<item>');
  expect(xml).not.toContain('lastBuildDate');
});
