import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDate, loadPosts } from '../../lib/blog.server';
import { OG_IMAGE } from '../../lib/seo';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Dev notes on STAR, a sim-racing telemetry and AI race-strategy tool, and whatever else is on the workbench - progress updates and musings.',
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/blog/feed.xml' } },
  openGraph: {
    title: 'Blog · Christopher Mann',
    description: 'Dev notes on STAR, a sim-racing telemetry and AI race-strategy tool, and whatever else is on the workbench - progress updates and musings.',
    type: 'website',
    url: '/blog',
    images: [OG_IMAGE],
    siteName: 'Christopher Mann',
  },
};

// Constitution Law 3 (blog exception): posts are dated, first-person records
// of the day they were written, so the index always shows the date.
export default function BlogIndex() {
  const posts = loadPosts();
  return (
    <main id="main" className={styles.main}>
      <h1>Blog</h1>
      <p className={styles.lede}>
        Dev notes on STAR and whatever else is on the workbench. Progress updates and musings, dated as written.{' '}
        <a href="/blog/feed.xml">RSS feed</a>.
      </p>
      {posts.length === 0 ? (
        <p className={styles.empty}>No posts yet.</p>
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.slug} className={styles.item}>
              <p className={styles.meta}>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.draft ? <span className={styles.draft}> · draft</span> : null}
              </p>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className={styles.summary}>{post.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
