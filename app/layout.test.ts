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

test('root layout loads real Inter and JetBrains Mono fonts via next/font/google (issue #8), not just CSS font-family names with no source', () => {
  const source = require('fs').readFileSync(require.resolve('./layout.tsx'), 'utf8');
  expect(source).toMatch(/from ['"]next\/font\/google['"]/);
  expect(source).toMatch(/Inter\(/);
  expect(source).toMatch(/JetBrains_Mono\(/);
});

test('root layout applies the generated font CSS variables to the html or body element', () => {
  const source = require('fs').readFileSync(require.resolve('./layout.tsx'), 'utf8');
  expect(source).toMatch(/variable:\s*['"]--font-inter['"]/);
  expect(source).toMatch(/variable:\s*['"]--font-jetbrains-mono['"]/);
  expect(source).toMatch(/\.variable/);
});
