# Writing a blog post

Status: Current

The blog lives at `/blog`. Posts are Markdown files in `content/blog/`, built into static
pages at deploy time (`lib/blog.server.ts`). Constitution Law 3 governs them: each post is
a dated, first-person record of the day it was written.

## Add a post

1. Create `content/blog/YYYY-MM-DD-short-title.md`. The date in the file name is the
   publish date and the only place the date is stated. The rest of the name becomes the
   URL: `2026-11-23-first-lap.md` is `/blog/first-lap`. Lowercase letters, digits and
   hyphens only.
2. Start the file with frontmatter:

   ```
   ---
   title: First lap
   summary: One sentence, shown on the index, in the RSS feed, and as the search/link-preview description (aim for 160 characters or fewer).
   tags: [star, lmu]
   draft: true
   ---
   ```

   `title` and `summary` are required. `tags` and `draft` are optional. Any other key is
   an error.
3. Write the body in Markdown. Use `##` and below for headings: the title is already the
   page's `#`. Raw HTML is shown as text, not rendered. Images go in `public/blog/` and are
   linked as `/blog/your-image.png` (the site's CSP only allows images from this site).
4. Open a PR. `draft: true` posts show on local dev and the PR's Vercel preview, never in
   production, so a post can be read on the preview first. Remove `draft: true` (or set it
   to `false`) before merging to publish it.

A broken post (bad file name, missing title, an `#` heading, and so on) fails the build with
an error naming the file, even when it is a draft.

## After publishing

A post is never rewritten to match later events; going out of date is expected. If a post
was wrong on the day it was written, add a dated note instead of editing the original text:

```
> **Correction (2026-12-01):** the fuel figure above was per stint, not per lap.
```

## Feed and sitemap

The RSS feed is `/blog/feed.xml` and every published post is in `/sitemap.xml`. Both are
generated from the same files; nothing else needs updating.
