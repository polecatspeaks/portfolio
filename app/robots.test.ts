test('app/robots.ts exports a default robots() function (issue #6)', () => {
  const source = require('fs').readFileSync(require.resolve('./robots.ts'), 'utf8');
  expect(source).toMatch(/export default function robots/);
});

test('app/robots.ts allows all crawlers and points at the real sitemap on the live custom domain', () => {
  const source = require('fs').readFileSync(require.resolve('./robots.ts'), 'utf8');
  expect(source).toMatch(/allow:\s*['"]\/['"]/);
  expect(source).toMatch(/https:\/\/star-stack\.io\/sitemap\.xml/);
});
