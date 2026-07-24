const ENTRY = {
  repo: 'polecatspeaks/private-thing',
  title: 'A Private Thing',
  summary: 'Built a thing.',
  screenshots: ['/screenshots/private-thing-1.png'],
  date: '2026-01',
  lastVerifiedSha: 'a'.repeat(40),
};

jest.mock('../data/private-projects.json', () => [
  {
    repo: 'polecatspeaks/private-thing',
    title: 'A Private Thing',
    summary: 'Built a thing.',
    screenshots: ['/screenshots/private-thing-1.png'],
    date: '2026-01',
    lastVerifiedSha: 'a'.repeat(40),
  },
], { virtual: true });

jest.mock('./private-projects.schema', () => ({
  validatePrivateProjects: (input: unknown) => input,
}));

beforeEach(() => {
  process.env.GITHUB_TOKEN = 'test-token';
  jest.resetModules();
});

test('non-2xx on the repo call throws naming the repo', async () => {
  global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, status: 404 });
  const { getPrivateProjects } = require('./private-projects.server');
  await expect(getPrivateProjects()).rejects.toThrow(/private-thing/);
});

test('malformed default_branch throws', async () => {
  global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ default_branch: 123 }) });
  const { getPrivateProjects } = require('./private-projects.server');
  await expect(getPrivateProjects()).rejects.toThrow(/default_branch/);
});

test('non-2xx on the commit call throws', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ default_branch: 'main' }) })
    .mockResolvedValueOnce({ ok: false, status: 500 });
  const { getPrivateProjects } = require('./private-projects.server');
  await expect(getPrivateProjects()).rejects.toThrow(/private-thing/);
});

test('sha mismatch throws naming both SHAs', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ default_branch: 'main' }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ sha: 'b'.repeat(40) }) });
  const { getPrivateProjects } = require('./private-projects.server');
  await expect(getPrivateProjects()).rejects.toThrow(new RegExp(`${'a'.repeat(6)}.*${'b'.repeat(6)}`));
});

test('sha match resolves with the entry (page layer is responsible for field-narrowing)', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ default_branch: 'main' }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ sha: 'a'.repeat(40) }) });
  const { getPrivateProjects } = require('./private-projects.server');
  const result = await getPrivateProjects();
  expect(result[0].title).toBe('A Private Thing');
});

test('a PASS is reported to the console for each SHA-matched entry (spec §3\'s observed-verification-reporting contract)', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ default_branch: 'main' }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ sha: 'a'.repeat(40) }) });
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const { getPrivateProjects } = require('./private-projects.server');
  await getPrivateProjects();
  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('PASS'));
  logSpy.mockRestore();
});
