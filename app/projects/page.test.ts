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
  expect(source).toMatch(/title:\s*['"]Projects · /);
  expect(source).toMatch(/openGraph:/);
  expect(source).toMatch(/canonical:\s*['"]\/projects['"]/);
});

test('projects SEO description names only projects that exist in the project data, and fits a search snippet (Law 3)', () => {
  const source: string = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  const m = source.match(/const PROJECTS_DESCRIPTION =\s*'([^']+)'/);
  expect(m).not.toBeNull();
  const description = m![1];
  expect(description.length).toBeLessThanOrEqual(160);
  const priv = require('../../data/private-projects.json');
  const featured = require('../../data/featured-repos.json');
  const repoNames = [...priv, ...featured].map((p: { repo: string }) => p.repo.split('/')[1]);
  for (const named of ['STAR', 'StarCar']) {
    expect(description).toContain(named);
    expect(repoNames).toContain(named);
  }
  const star = priv.find((p: { repo: string }) => p.repo === 'polecatspeaks/STAR');
  expect(star.story).toMatch(/sim-racing/);
  expect(star.story).toMatch(/live telemetry/);
  expect(star.story).toMatch(/AI strategy assistant/);
});

test('projects page uses next/image for private-project screenshots instead of raw <img> (issue #7)', () => {
  const source = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  expect(source).toMatch(/import Image from ['"]next\/image['"]/);
  expect(source).not.toMatch(/<img\b/);
  expect(source).toMatch(/<Image\b/);
});

test('screenshot Image elements declare explicit width and height (required by next/image, avoids CLS)', () => {
  const source = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  const imageBlockMatch = source.match(/<Image\b[\s\S]*?\/>/);
  expect(imageBlockMatch).not.toBeNull();
  expect(imageBlockMatch![0]).toMatch(/width=\{?\d+/);
  expect(imageBlockMatch![0]).toMatch(/height=\{?\d+/);
});
