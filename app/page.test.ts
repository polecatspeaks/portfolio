import { getResume } from '../lib/resume';

jest.mock('../lib/resume');

test('home page module imports getResume, not the raw resume.json', () => {
  const source = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  expect(source).toMatch(/from ['"]\.\.\/lib\/resume['"]/);
  expect(source).not.toMatch(/resume\.json/);
});

test('home page renders public contact links, not just the email (round-4 plan-review fix: spec §2 requires "/" sourced from resume.json.summary + public contact fields, and contact.links is part of that field group)', () => {
  const source = require('fs').readFileSync(require.resolve('./page.tsx'), 'utf8');
  expect(source).toMatch(/resume\.contact\.links/);
});
