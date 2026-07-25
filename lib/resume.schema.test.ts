import { validateResume } from './resume.schema';

const VALID = {
  name: 'Ada Example',
  tagline: 'I explain complicated systems in plain words.',
  summary: 'Software engineer.',
  contact: { email: 'me@example.com', links: ['https://github.com/polecatspeaks'] },
  workHistory: [
    {
      employer: 'Acme',
      title: 'Engineer',
      headline: 'Kept the things running',
      story: 'I did things, mostly on purpose.',
      start: '2020-01',
      end: null,
      bullets: ['Did things'],
    },
  ],
  skills: ['TypeScript'],
  capabilities: ['I explain what the things do.'],
  education: [{ institution: 'State U', program: 'CS', year: '2019' }],
};

test('a fully valid resume passes through unchanged', () => {
  expect(validateResume(VALID)).toEqual(VALID);
});

test('missing summary throws naming the field', () => {
  const { summary, ...rest } = VALID;
  expect(() => validateResume(rest)).toThrow(/summary/);
});

test('missing name throws naming the field (v2 direction: homepage h1 is the name, sourced from the resume per Law 3)', () => {
  const { name, ...rest } = VALID;
  expect(() => validateResume(rest)).toThrow(/name/);
});

test('missing tagline throws naming the field (v2 direction: plain-language register is resume content, not page copy)', () => {
  const { tagline, ...rest } = VALID;
  expect(() => validateResume(rest)).toThrow(/tagline/);
});

test('workHistory[].end accepts string OR null, rejects undefined', () => {
  const bad = { ...VALID, workHistory: [{ ...VALID.workHistory[0], end: undefined }] };
  expect(() => validateResume(bad)).toThrow(/end/);
});

test('missing workHistory[].story throws naming the field (v2.1: story-per-job is required resume content)', () => {
  const { story, ...job } = VALID.workHistory[0];
  const bad = { ...VALID, workHistory: [job] };
  expect(() => validateResume(bad)).toThrow(/story/);
});

test('missing workHistory[].headline throws naming the field', () => {
  const { headline, ...job } = VALID.workHistory[0];
  const bad = { ...VALID, workHistory: [job] };
  expect(() => validateResume(bad)).toThrow(/headline/);
});

test('empty capabilities array throws (v2.1: the plain-language toolkit must not silently vanish)', () => {
  const bad = { ...VALID, capabilities: [] };
  expect(() => validateResume(bad)).toThrow(/capabilities/);
});

test('non-array skills throws', () => {
  const bad = { ...VALID, skills: 'TypeScript' };
  expect(() => validateResume(bad)).toThrow(/skills/);
});
