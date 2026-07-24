import { assertGithubTokenConfigured } from './env';

test('throws if GITHUB_TOKEN is absent', () => {
  delete process.env.GITHUB_TOKEN;
  expect(() => assertGithubTokenConfigured()).toThrow(/GITHUB_TOKEN/);
});

test('throws if NEXT_PUBLIC_GITHUB_TOKEN exists at all, regardless of value', () => {
  process.env.GITHUB_TOKEN = 'real-token';
  process.env.NEXT_PUBLIC_GITHUB_TOKEN = '';
  expect(() => assertGithubTokenConfigured()).toThrow(/NEXT_PUBLIC_GITHUB_TOKEN/);
});

test('passes when GITHUB_TOKEN is set and NEXT_PUBLIC_GITHUB_TOKEN is absent', () => {
  process.env.GITHUB_TOKEN = 'real-token';
  delete process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  expect(() => assertGithubTokenConfigured()).not.toThrow();
});
