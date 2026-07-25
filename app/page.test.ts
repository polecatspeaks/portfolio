import { getResume } from '../lib/resume';

jest.mock('../lib/resume');

test('home page module imports getResume, not the raw resume.json', () => {
  const source = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  expect(source).toMatch(/from ['"]\.\.\/lib\/resume['"]/);
  expect(source).not.toMatch(/resume\.json/);
});

test('home page renders public contact links, not just the email (round-4 plan-review fix: spec §2 requires "/" sourced from resume.json.summary + public contact fields; v2.1 issue #16 moved that rendering into the site-wide footer, which the root layout mounts on every page including "/" - a second "Find me" copy on the homepage body was owner-flagged as duplication and removed)', () => {
  const footerSource = require('fs').readFileSync(
    require.resolve('./components/SiteFooter.tsx'),
    'utf8'
  );
  expect(footerSource).toMatch(/resume\.contact\.links/);
  expect(footerSource).toMatch(/resume\.contact\.email/);
  const layoutSource = require('fs').readFileSync(require.resolve('./layout.tsx'), 'utf8');
  expect(layoutSource).toMatch(/<SiteFooter \/>/);
});

test('home page exports metadata deriving its description from the real resume summary, not a hardcoded string (issue #3/#4)', () => {
  const source = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  expect(source).toMatch(/generateMetadata/);
  expect(source).toMatch(/resume\.summary/);
  expect(source).toMatch(/openGraph:/);
});
