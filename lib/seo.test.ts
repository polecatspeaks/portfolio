import { blogPostingJsonLd, homeJsonLd, serializeJsonLd, SITE_URL } from './seo';
import { getResume } from './resume';

test('serializeJsonLd escapes < so a value cannot close the script tag', () => {
  const out = serializeJsonLd({ headline: '</script><script>alert(1)</script>' });
  expect(out).not.toContain('<');
  expect(JSON.parse(out).headline).toBe('</script><script>alert(1)</script>');
});

test('home JSON-LD Person is built only from real resume fields (Law 3)', () => {
  const resume = getResume();
  const graph = homeJsonLd(resume)['@graph'];
  const person = graph.find((n) => n['@type'] === 'Person') as Record<string, unknown>;
  expect(person.name).toBe(resume.name);
  expect(person.jobTitle).toBe(resume.seo.jobTitle);
  expect(person.sameAs).toEqual(resume.contact.links);
  expect(person.knowsAbout).toEqual(resume.skills);
  expect(person).not.toHaveProperty('email');
  expect(person).not.toHaveProperty('worksFor');
});

test('the SEO job title restates the resume summary headline, not a new claim', () => {
  const resume = getResume();
  expect(resume.summary.startsWith(resume.seo.jobTitle)).toBe(true);
});

test('Person image points at the real portrait file', () => {
  const person = homeJsonLd(getResume())['@graph'][0] as Record<string, unknown>;
  expect(person.image).toBe(`${SITE_URL}/portrait.jpg`);
  expect(require('fs').existsSync(require('path').join(process.cwd(), 'public', 'portrait.jpg'))).toBe(true);
});

test('BlogPosting uses absolute URLs and the post date', () => {
  const ld = blogPostingJsonLd(
    { slug: 'first-lap', title: 'First lap', summary: 's', date: '2026-11-23', tags: ['star'] },
    'Ada'
  );
  expect(ld.url).toBe(`${SITE_URL}/blog/first-lap`);
  expect(ld.datePublished).toBe('2026-11-23');
  expect(ld.author.name).toBe('Ada');
});

test('home description mentions STAR only because STAR is a real project in the project data (Laws 2 and 3)', () => {
  const { seo } = getResume();
  const priv = require('../data/private-projects.json') as Array<{ repo: string; story: string }>;
  const star = priv.find((p) => p.repo === 'polecatspeaks/STAR');
  expect(seo.homeDescription).toMatch(/STAR/);
  expect(star).toBeDefined();
  expect(star!.story).toMatch(/sim-racing/);
  expect(star!.story).toMatch(/AI strategy assistant/);
});
