test('experience page exports metadata with a real page title and Open Graph block (issue #3/#4)', () => {
  const source = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  expect(source).toMatch(/export const metadata/);
  expect(source).toMatch(/title:\s*['"]Experience['"]/);
  expect(source).toMatch(/openGraph:/);
});
