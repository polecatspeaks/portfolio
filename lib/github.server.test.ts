// Deviation from the plan's literal snippet, disclosed: the plan's test fixtures
// assume a single-entry data/featured-repos.json (every assertion below processes
// exactly one fetch response against exactly one declared repo). The real, owner-
// authored data/featured-repos.json now lists two real repos (StarCar and
// Project-Bootstrapping, per the owner's explicit instruction), which would break
// every assertion here since the mocked fetch would be invoked twice against a
// single mockResolvedValue. Mocking the data module - matching the same
// jest.doMock/virtual pattern already used in lib/resume.test.ts's second test -
// keeps this a true unit test of the loader logic, decoupled from production data
// content, rather than re-writing every fixture into an every-changes-when-data-
// changes 2-entry shape.
jest.mock('../data/featured-repos.json', () => [{ repo: 'polecatspeaks/Project-Bootstrapping' }], {
  virtual: true,
});

import { getFeaturedRepos } from './github.server';

const validBody = (overrides = {}) => ({
  full_name: 'polecatspeaks/Project-Bootstrapping',
  html_url: 'https://github.com/polecatspeaks/Project-Bootstrapping',
  description: 'A staged process kit.',
  language: 'Shell',
  topics: [],
  pushed_at: '2026-07-24T00:00:00Z',
  private: false,
  fork: false,
  archived: false,
  ...overrides,
});

beforeEach(() => {
  process.env.GITHUB_TOKEN = 'test-token';
});

test('a non-2xx response throws naming the repo and status', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) });
  await expect(getFeaturedRepos()).rejects.toThrow(/404/);
});

test('private: true throws and renders nothing for that entry', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => validBody({ private: true }) });
  await expect(getFeaturedRepos()).rejects.toThrow(/private/);
});

test('fork: true throws', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => validBody({ fork: true }) });
  await expect(getFeaturedRepos()).rejects.toThrow(/fork/);
});

test('archived: true throws', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => validBody({ archived: true }) });
  await expect(getFeaturedRepos()).rejects.toThrow(/archived/);
});

test('full_name case-difference-only is treated as a match (GitHub names are case-insensitive)', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => validBody({ full_name: 'PoleCatSpeaks/Project-Bootstrapping' }),
  });
  await expect(getFeaturedRepos()).resolves.toEqual([expect.any(Object)]);
});

test('full_name substantive mismatch throws', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => validBody({ full_name: 'someone-else/other-repo' }),
  });
  await expect(getFeaturedRepos()).rejects.toThrow(/full_name/);
});

test('a fully eligible repo resolves with only schema-validated fields', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => validBody() });
  const repos = await getFeaturedRepos();
  expect(repos[0].html_url).toBe('https://github.com/polecatspeaks/Project-Bootstrapping');
});

test('a PASS is reported to the console for each eligible repo checked (spec §3\'s observed-verification-reporting contract)', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => validBody() });
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  await getFeaturedRepos();
  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('PASS'));
  logSpy.mockRestore();
});
