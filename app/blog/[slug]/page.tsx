import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDate, getPost, loadPosts } from '../../../lib/blog.server';
import styles from '../blog.module.css';

// Every post is generated at build time; an unknown slug is a 404, never a
// runtime render.
export const dynamicParams = false;

export function generateStaticParams() {
  return loadPosts().map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { types: { 'application/rss+xml': '/blog/feed.xml' } },
    openGraph: {
      title: `${post.title} · Christopher Mann`,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <main id="main" className={styles.main}>
      <article>
        <p className={styles.meta}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.draft ? <span className={styles.draft}> · draft</span> : null}
          {post.tags.length > 0 ? <span> · {post.tags.join(', ')}</span> : null}
        </p>
        <h1>{post.title}</h1>
        {/* Rendered from the post's Markdown at build time; raw HTML in a
            post is escaped by the renderer (lib/blog.server.ts). */}
        <div className={styles.body} dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <p className={styles.back}>
        <Link href="/blog">← All posts</Link>
      </p>
    </main>
  );
}
