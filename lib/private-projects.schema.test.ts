import * as fs from 'fs';
import { validatePrivateProjects } from './private-projects.schema';

jest.mock('fs');

const VALID_ENTRY = {
  repo: 'polecatspeaks/private-thing',
  title: 'A Private Thing',
  headline: 'A thing, but private',
  story: 'I built a thing. It works, which was the plan.',
  summary: 'Built a thing.',
  screenshots: ['/screenshots/private-thing-1.png'],
  date: '2026-01',
  lastVerifiedSha: 'a'.repeat(40),
};

beforeEach(() => {
  (fs.existsSync as jest.Mock).mockReturnValue(true);
});

test('a fully valid entry passes through unchanged', () => {
  expect(validatePrivateProjects([VALID_ENTRY])).toEqual([VALID_ENTRY]);
});

test('empty screenshots array throws (Law 2 proof requirement)', () => {
  const bad = { ...VALID_ENTRY, screenshots: [] };
  expect(() => validatePrivateProjects([bad])).toThrow(/screenshots/);
});

test('a screenshot path that does not exist on disk throws naming the path', () => {
  (fs.existsSync as jest.Mock).mockReturnValue(false);
  expect(() => validatePrivateProjects([VALID_ENTRY])).toThrow(/private-thing-1\.png/);
});

test('missing story throws naming the field (v2.1: two-register project cards)', () => {
  const { story, ...bad } = VALID_ENTRY;
  expect(() => validatePrivateProjects([bad])).toThrow(/story/);
});

test('missing headline throws naming the field (v2.1: two-register project cards)', () => {
  const { headline, ...bad } = VALID_ENTRY;
  expect(() => validatePrivateProjects([bad])).toThrow(/headline/);
});

test('lastVerifiedSha must look like a real 40-char hex sha', () => {
  const bad = { ...VALID_ENTRY, lastVerifiedSha: 'not-a-sha' };
  expect(() => validatePrivateProjects([bad])).toThrow(/lastVerifiedSha/);
});
