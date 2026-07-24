test('root layout exports Next.js metadata with a title template so every page gets a real <title>', () => {
  const source = require('fs').readFileSync(require.resolve('./layout.tsx'), 'utf8');
  expect(source).toMatch(/export const metadata/);
  expect(source).toMatch(/title:\s*\{/);
  expect(source).toMatch(/default:/);
  expect(source).toMatch(/template:/);
});

test('root layout metadata includes a description and metadataBase for correct absolute Open Graph URLs', () => {
  const source = require('fs').readFileSync(require.resolve('./layout.tsx'), 'utf8');
  expect(source).toMatch(/description:/);
  expect(source).toMatch(/metadataBase:/);
  expect(source).toMatch(/star-stack\.io/);
});
