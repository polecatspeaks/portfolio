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

test('root layout asks for the large X/Twitter preview card, and does NOT set a canonical every page would inherit (SEO pass)', () => {
  const source = require('fs').readFileSync(require.resolve('./layout.tsx'), 'utf8');
  expect(source).toMatch(/card:\s*['"]summary_large_image['"]/);
  expect(source).not.toMatch(/canonical:/);
});

test('every route has its own canonical URL (SEO pass)', () => {
  const fs = require('fs');
  const pages: Record<string, RegExp> = {
    './page.tsx': /canonical:\s*['"]\/['"]/,
    './experience/page.tsx': /canonical:\s*['"]\/experience['"]/,
    './projects/page.tsx': /canonical:\s*['"]\/projects['"]/,
    './blog/page.tsx': /canonical:\s*['"]\/blog['"]/,
    './blog/[slug]/page.tsx': /canonical:\s*`\/blog\/\$\{post\.slug\}`/,
  };
  for (const [file, pattern] of Object.entries(pages)) {
    expect(fs.readFileSync(require.resolve(file), 'utf8')).toMatch(pattern);
  }
});

test('every subpage that overrides openGraph re-attaches the share image (Next drops the inherited file-based one otherwise)', () => {
  const fs = require('fs');
  for (const file of ['./experience/page.tsx', './projects/page.tsx', './blog/page.tsx', './blog/[slug]/page.tsx']) {
    expect(fs.readFileSync(require.resolve(file), 'utf8')).toMatch(/images:\s*\[OG_IMAGE\]/);
  }
});

test('blog post og article:author is a profile URL, not a display name (ogp.me)', () => {
  const source = require('fs').readFileSync(require.resolve('./blog/[slug]/page.tsx'), 'utf8');
  expect(source).toMatch(/authors:\s*\[`\$\{SITE_URL\}\/`\]/);
});
