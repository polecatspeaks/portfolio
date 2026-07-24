test('projects page module renders repo.html_url as the href, not a hand-built URL', () => {
  const source = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  expect(source).toMatch(/href=\{repo\.html_url\}/);
  expect(source).not.toMatch(/href=\{`https:\/\/github\.com\//);
});

test('projects page module never destructures repo or lastVerifiedSha from a private entry', () => {
  const source = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  expect(source).not.toMatch(/project\.repo/);
  expect(source).not.toMatch(/lastVerifiedSha/);
});

test('projects page module declares force-static rendering explicitly, not implicitly', () => {
  const source = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  expect(source).toMatch(/export const dynamic = ['"]force-static['"]/);
});

test('projects page exports metadata with a real page title and Open Graph block (issue #3/#4)', () => {
  const source = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  expect(source).toMatch(/export const metadata/);
  expect(source).toMatch(/title:\s*['"]Projects['"]/);
  expect(source).toMatch(/openGraph:/);
});
