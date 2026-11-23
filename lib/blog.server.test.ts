import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  BlogPostError,
  formatDate,
  includeDrafts,
  loadPosts,
  parsePost,
} from './blog.server';

const post = (fm: string, body = 'Hello there.\n') => `---\n${fm}\n---\n${body}`;
const ok = 'title: First lap\nsummary: Getting STAR back on track.';

function tempBlog(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-test-'));
  for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), content);
  return dir;
}

const prod = { VERCEL_ENV: 'production' } as unknown as NodeJS.ProcessEnv;
const preview = { VERCEL_ENV: 'preview' } as unknown as NodeJS.ProcessEnv;

describe('parsePost', () => {
  test('takes date and slug from the file name, title and summary from frontmatter', () => {
    const p = parsePost('2026-11-23-first-lap.md', post(ok + '\ntags: [star, lmu]'));
    expect(p).toMatchObject({
      date: '2026-11-23',
      slug: 'first-lap',
      title: 'First lap',
      summary: 'Getting STAR back on track.',
      tags: ['star', 'lmu'],
      draft: false,
    });
    expect(p.html).toContain('<p>Hello there.</p>');
  });

  test('accepts quoted values, CRLF line endings and a BOM', () => {
    const src = '﻿' + post('title: "Quoted: title"\nsummary: \'Single\'').replace(/\n/g, '\r\n');
    const p = parsePost('2026-11-23-quoted.md', src);
    expect(p.title).toBe('Quoted: title');
    expect(p.summary).toBe('Single');
  });

  test.each([
    ['first-lap.md', /file name must look like/],
    ['2026-11-23-First-Lap.md', /file name must look like/],
    ['2026-02-30-bad-date.md', /not a real date/],
  ])('rejects bad file name %s', (file, msg) => {
    expect(() => parsePost(file, post(ok))).toThrow(msg);
  });

  test.each([
    ['missing title', post('summary: s'), /needs a title/],
    ['missing summary', post('title: t'), /needs a summary/],
    ['unknown key', post(ok + '\ndate: 2026-11-23'), /unknown frontmatter key "date"/],
    ['duplicate key', post(ok + '\ntitle: again'), /appears twice/],
    ['bad draft value', post(ok + '\ndraft: yes'), /draft must be true or false/],
    ['bad tags shape', post(ok + '\ntags: star, lmu'), /tags must be a list/],
    ['bad tag', post(ok + '\ntags: [No Hesi]'), /tag "no hesi"/],
    ['no frontmatter', 'Just text', /must start with a ---/],
    ['unclosed frontmatter', '---\ntitle: t\n', /not closed/],
    ['empty body', post(ok, '\n'), /has no body/],
    ['an H1 in the body', post(ok, '# Big heading\n'), /use ## for headings/],
  ])('rejects %s, naming the file', (_name, src, msg) => {
    let err: unknown;
    try {
      parsePost('2026-11-23-x.md', src);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(BlogPostError);
    expect((err as Error).message).toMatch(/^content\/blog\/2026-11-23-x\.md: /);
    expect((err as Error).message).toMatch(msg);
  });

  test('renders Markdown (headings, links, lists, code)', () => {
    const html = parsePost(
      '2026-11-23-md.md',
      post(ok, '## Pit wall\n\nSee [STAR](https://star-stack.io).\n\n- one\n- two\n\n`code`\n'),
    ).html;
    expect(html).toContain('<h2>Pit wall</h2>');
    expect(html).toContain('<a href="https://star-stack.io">STAR</a>');
    expect(html).toContain('<li>one</li>');
    expect(html).toContain('<code>code</code>');
  });

  test('shows raw HTML as text instead of rendering it', () => {
    const html = parsePost('2026-11-23-html.md', post(ok, 'Hi\n\n<script>alert(1)</script>\n\nand <b>inline</b>\n')).html;
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<b>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;b&gt;');
  });

  test('refuses javascript: link targets', () => {
    const html = parsePost('2026-11-23-js.md', post(ok, '[click](javascript:alert(1))\n')).html;
    expect(html).not.toContain('href="javascript:');
  });
});

describe('loadPosts', () => {
  test('returns newest first', () => {
    const dir = tempBlog({
      '2026-11-01-older.md': post(ok),
      '2026-11-20-newer.md': post(ok),
      '2026-11-10-middle.md': post(ok),
    });
    expect(loadPosts(dir, prod).map((p) => p.slug)).toEqual(['newer', 'middle', 'older']);
  });

  test('hides drafts in production only', () => {
    const dir = tempBlog({
      '2026-11-01-live.md': post(ok),
      '2026-11-02-wip.md': post(ok + '\ndraft: true'),
    });
    expect(loadPosts(dir, prod).map((p) => p.slug)).toEqual(['live']);
    expect(loadPosts(dir, preview).map((p) => p.slug)).toEqual(['wip', 'live']);
    expect(loadPosts(dir, {} as unknown as NodeJS.ProcessEnv).map((p) => p.slug)).toEqual(['wip', 'live']);
  });

  test('a broken draft still fails the build, even in production', () => {
    const dir = tempBlog({ '2026-11-02-wip.md': post('title: t\ndraft: true') });
    expect(() => loadPosts(dir, prod)).toThrow(/needs a summary/);
  });

  test('rejects two posts with the same slug', () => {
    const dir = tempBlog({ '2026-11-01-same.md': post(ok), '2026-11-02-same.md': post(ok) });
    expect(() => loadPosts(dir, prod)).toThrow(/same slug "same"/);
  });

  test('ignores non-Markdown files and returns [] when the folder is missing', () => {
    const dir = tempBlog({ '2026-11-01-a.md': post(ok), 'notes.txt': 'x' });
    expect(loadPosts(dir, prod)).toHaveLength(1);
    expect(loadPosts(path.join(dir, 'nope'), prod)).toEqual([]);
  });

  test('every real post in content/blog parses', () => {
    expect(() => loadPosts(undefined, preview)).not.toThrow();
  });
});

test('includeDrafts is false only for VERCEL_ENV=production', () => {
  expect(includeDrafts(prod)).toBe(false);
  expect(includeDrafts(preview)).toBe(true);
  expect(includeDrafts({} as unknown as NodeJS.ProcessEnv)).toBe(true);
});

test('formatDate writes the month out', () => {
  expect(formatDate('2026-11-03')).toBe('November 3, 2026');
});
