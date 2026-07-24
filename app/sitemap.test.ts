test('app/sitemap.ts exports a default sitemap() function (issue #6)', () => {
  const source = require('fs').readFileSync(require.resolve('./sitemap.ts'), 'utf8');
  expect(source).toMatch(/export default function sitemap/);
});

test('app/sitemap.ts lists exactly the 3 real routes on the live custom domain, not fabricated ones', () => {
  const source = require('fs').readFileSync(require.resolve('./sitemap.ts'), 'utf8');
  expect(source).toMatch(/https:\/\/star-stack\.io\/['"`]/);
  expect(source).toMatch(/https:\/\/star-stack\.io\/experience/);
  expect(source).toMatch(/https:\/\/star-stack\.io\/projects/);
});

test('app/sitemap.ts does not use new Date() for lastModified (misleading per-build "recently updated" signal)', () => {
  const source = require('fs').readFileSync(require.resolve('./sitemap.ts'), 'utf8');
  expect(source).not.toMatch(/lastModified:\s*new Date\(\)/);
});
