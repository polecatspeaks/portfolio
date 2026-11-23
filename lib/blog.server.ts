import 'server-only';
import MarkdownIt from 'markdown-it';
import fs from 'node:fs';
import path from 'node:path';

// Blog posts (constitution Law 3, blog exception): each post is a dated,
// first-person Markdown file in content/blog/. The date lives in the FILE NAME
// (YYYY-MM-DD-slug.md), not in frontmatter, so there is exactly one place a
// post's date can be stated and it can never disagree with itself.
//
// Everything here runs at build time only (static generation); nothing reads
// these files per request.

export const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

const FILE_PATTERN = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const ALLOWED_KEYS = new Set(['title', 'summary', 'tags', 'draft']);

export interface PostMeta {
  slug: string;
  /** Publish date, YYYY-MM-DD, taken from the file name. */
  date: string;
  title: string;
  summary: string;
  tags: string[];
  draft: boolean;
}

export interface Post extends PostMeta {
  /** Rendered HTML of the Markdown body. */
  html: string;
}

export class BlogPostError extends Error {
  constructor(file: string, message: string) {
    super(`content/blog/${file}: ${message}`);
    this.name = 'BlogPostError';
  }
}

function isRealDate(iso: string): boolean {
  const d = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
}

function unquote(value: string): string {
  const v = value.trim();
  if (v.length >= 2 && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))) {
    return v.slice(1, -1);
  }
  return v;
}

/**
 * Splits a post file into frontmatter fields and Markdown body. Supports the
 * small subset the posts need - `key: value` lines, and `tags: [a, b]` - and
 * rejects anything else loudly rather than guessing.
 */
export function parseFrontmatter(file: string, source: string): { fields: Record<string, string>; body: string } {
  const text = source.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  if (!text.startsWith('---\n')) {
    throw new BlogPostError(file, 'must start with a --- frontmatter block');
  }
  const end = text.indexOf('\n---\n', 4);
  const endAtEof = end === -1 && text.endsWith('\n---') ? text.length - 4 : -1;
  const close = end !== -1 ? end : endAtEof;
  if (close === -1) {
    throw new BlogPostError(file, 'frontmatter block is not closed with ---');
  }
  const fields: Record<string, string> = {};
  for (const line of text.slice(4, close).split('\n')) {
    if (line.trim() === '' || line.trim().startsWith('#')) continue;
    const m = /^([a-z]+):\s*(.*)$/.exec(line);
    if (!m) throw new BlogPostError(file, `cannot read frontmatter line: "${line}"`);
    const [, key, value] = m;
    if (!ALLOWED_KEYS.has(key)) {
      throw new BlogPostError(file, `unknown frontmatter key "${key}" (allowed: ${[...ALLOWED_KEYS].join(', ')})`);
    }
    if (key in fields) throw new BlogPostError(file, `frontmatter key "${key}" appears twice`);
    fields[key] = value;
  }
  const body = end !== -1 ? text.slice(end + 5) : '';
  return { fields, body };
}

function parseTags(file: string, raw: string | undefined): string[] {
  if (raw === undefined || raw.trim() === '') return [];
  const v = raw.trim();
  if (!v.startsWith('[') || !v.endsWith(']')) {
    throw new BlogPostError(file, 'tags must be a list like [star, lmu]');
  }
  const tags = v
    .slice(1, -1)
    .split(',')
    .map((t) => unquote(t).toLowerCase())
    .filter((t) => t !== '');
  for (const t of tags) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t)) {
      throw new BlogPostError(file, `tag "${t}" must be lowercase letters, digits and hyphens`);
    }
  }
  return tags;
}

// html: false - raw HTML in a post is shown as text, never rendered. Posts are
// Markdown only, so a stray <script> or <iframe> pasted into a draft cannot
// reach the live page (and the site's CSP would block most of it anyway).
// markdown-it also refuses javascript:/vbscript:/data: link targets by default.
const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });

export function renderMarkdown(file: string, body: string): string {
  const tokens = markdown.parse(body, {});
  if (tokens.some((t) => t.type === 'heading_open' && t.tag === 'h1')) {
    throw new BlogPostError(file, 'use ## for headings - the post title is already the page heading');
  }
  return markdown.renderer.render(tokens, markdown.options, {});
}

/** Parses one post file. Throws BlogPostError naming the file on any problem. */
export function parsePost(file: string, source: string): Post {
  const m = FILE_PATTERN.exec(file);
  if (!m) {
    throw new BlogPostError(file, 'file name must look like YYYY-MM-DD-some-title.md (lowercase, hyphens)');
  }
  const [, date, slug] = m;
  if (!isRealDate(date)) throw new BlogPostError(file, `"${date}" is not a real date`);

  const { fields, body } = parseFrontmatter(file, source);
  const title = unquote(fields.title ?? '');
  if (title === '') throw new BlogPostError(file, 'frontmatter needs a title');
  const summary = unquote(fields.summary ?? '');
  if (summary === '') throw new BlogPostError(file, 'frontmatter needs a summary (one sentence, used on the index and in RSS)');
  const draftRaw = (fields.draft ?? 'false').trim();
  if (draftRaw !== 'true' && draftRaw !== 'false') {
    throw new BlogPostError(file, 'draft must be true or false');
  }
  if (body.trim() === '') throw new BlogPostError(file, 'post has no body');

  return {
    slug,
    date,
    title,
    summary,
    tags: parseTags(file, fields.tags),
    draft: draftRaw === 'true',
    html: renderMarkdown(file, body),
  };
}

/**
 * Drafts are visible in local dev and Vercel previews, never in production,
 * so a post can be read on its PR's preview before it goes live.
 */
export function includeDrafts(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.VERCEL_ENV !== 'production';
}

/** All posts, newest first. Every .md file in the folder must be a valid post. */
export function loadPosts(dir: string = BLOG_DIR, env: NodeJS.ProcessEnv = process.env): Post[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const seen = new Map<string, string>();
  const posts = files.map((f) => {
    const post = parsePost(f, fs.readFileSync(path.join(dir, f), 'utf8'));
    const prior = seen.get(post.slug);
    if (prior) throw new BlogPostError(f, `uses the same slug "${post.slug}" as ${prior}`);
    seen.set(post.slug, f);
    return post;
  });
  const showDrafts = includeDrafts(env);
  return posts
    .filter((p) => showDrafts || !p.draft)
    .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));
}

export function getPost(slug: string, dir: string = BLOG_DIR, env: NodeJS.ProcessEnv = process.env): Post | undefined {
  return loadPosts(dir, env).find((p) => p.slug === slug);
}

/** "November 23, 2026" - month written out, so there is no day-month ambiguity. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
