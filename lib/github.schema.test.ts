import { validateGithubRepo } from './github.schema';

const VALID = {
  full_name: 'polecatspeaks/Project-Bootstrapping',
  html_url: 'https://github.com/polecatspeaks/Project-Bootstrapping',
  description: 'A staged process kit.',
  language: 'Shell',
  topics: ['process'],
  pushed_at: '2026-07-24T00:00:00Z',
  private: false,
  fork: false,
  archived: false,
};

test('a fully valid repo response passes through unchanged', () => {
  expect(validateGithubRepo(VALID)).toEqual(VALID);
});

test('missing full_name throws naming the field', () => {
  const { full_name, ...rest } = VALID;
  expect(() => validateGithubRepo(rest)).toThrow(/full_name/);
});

test('description accepts string OR null (GitHub returns null, not absent, for none)', () => {
  expect(validateGithubRepo({ ...VALID, description: null }).description).toBeNull();
});

test('pushed_at accepts string OR null (GitHub returns null for a repo with no pushes yet)', () => {
  expect(validateGithubRepo({ ...VALID, pushed_at: null }).pushed_at).toBeNull();
});

test('private/fork/archived must be actual booleans, not truthy strings', () => {
  expect(() => validateGithubRepo({ ...VALID, private: 'false' })).toThrow(/private/);
});
