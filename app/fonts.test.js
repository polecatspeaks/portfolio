const fs = require('fs');
const path = require('path');

test('globals.css font tokens reference the real next/font CSS variables (issue #8), not just a bare family-name string with no actual font source', () => {
  const source = fs.readFileSync(path.join(__dirname, 'globals.css'), 'utf8');
  expect(source).toMatch(/--font-sans:\s*var\(--font-inter\)/);
  expect(source).toMatch(/--font-mono:\s*var\(--font-jetbrains-mono\)/);
});
