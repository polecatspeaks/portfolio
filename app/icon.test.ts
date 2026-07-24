test('app/icon.tsx exports a size, contentType, and a default component (Next.js file-convention favicon, issue #5)', () => {
  const source = require('fs').readFileSync(require.resolve('./icon.tsx'), 'utf8');
  expect(source).toMatch(/export const size/);
  expect(source).toMatch(/export const contentType/);
  expect(source).toMatch(/export default function Icon/);
});

test('app/icon.tsx uses the real design-direction tokens, not fabricated colors', () => {
  const source = require('fs').readFileSync(require.resolve('./icon.tsx'), 'utf8');
  // docs/design-direction.md: --bg #0a0a0c, --accent #3b82f6
  expect(source).toMatch(/#0a0a0c/);
  expect(source).toMatch(/#3b82f6/);
});
