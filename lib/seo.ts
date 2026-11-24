import type { ResumeSchema } from './resume.schema';

// The one place the production origin is spelled out for absolute URLs in
// structured data (JSON-LD needs absolute URLs; metadataBase only covers
// Next's own <meta>/<link> tags).
export const SITE_URL = 'https://star-stack.io';

/**
 * Serialize a JSON-LD object for a <script type="application/ld+json"> tag.
 * `<` is escaped so a string value can never close the script element early.
 */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * schema.org Person + WebSite for the home page. Every field comes from the
 * resume (Law 3): name, the SEO job title, the public profile links, and the
 * skills list. No employer is stated - worksFor would be a claim the resume
 * doesn't currently back with an open-ended role.
 */
export function homeJsonLd(resume: ResumeSchema) {
  const person = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: resume.name,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/portrait.jpg`,
    jobTitle: resume.seo.jobTitle,
    description: resume.seo.homeDescription,
    sameAs: resume.contact.links,
    knowsAbout: resume.skills,
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: resume.name,
        publisher: { '@id': `${SITE_URL}/#person` },
      },
    ],
  };
}

export function blogPostingJsonLd(
  post: { slug: string; title: string; summary: string; date: string; tags: string[] },
  authorName: string
) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    url,
    mainEntityOfPage: url,
    keywords: post.tags,
    author: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: authorName, url: `${SITE_URL}/` },
  };
}

/**
 * The root link-preview card (app/opengraph-image.tsx). Next only applies a
 * file-based og image to routes that don't set their own `openGraph`; every
 * subpage here does, so each one lists this explicitly or it ships no image.
 */
export const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Christopher Mann - AI-Driven DevOps & MLOps Lead',
};
