const fs = require('fs');
const path = require('path');

test('app/favicon.ico exists as a real static file, not just the dynamic /icon route (issue #5)', () => {
  const faviconPath = path.join(__dirname, 'favicon.ico');
  expect(fs.existsSync(faviconPath)).toBe(true);
  const stats = fs.statSync(faviconPath);
  expect(stats.size).toBeGreaterThan(0);
});

test('app/favicon.ico is real image data (PNG magic bytes), not an empty placeholder', () => {
  const buf = fs.readFileSync(path.join(__dirname, 'favicon.ico'));
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  expect(buf.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
});
