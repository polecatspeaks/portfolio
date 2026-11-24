test('experience page exports metadata with a real page title and Open Graph block (issue #3/#4)', () => {
  const source = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  expect(source).toMatch(/export function generateMetadata/);
  expect(source).toMatch(/title:\s*['"]Experience/);
  expect(source).toMatch(/resume\.seo\.experienceDescription/);
  expect(source).toMatch(/canonical:\s*['"]\/experience['"]/);
  expect(source).toMatch(/openGraph:/);
});
