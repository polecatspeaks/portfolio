import { validateResume } from './resume.schema';

const VALID = {
  summary: 'Software engineer.',
  contact: { email: 'me@example.com', links: ['https://github.com/polecatspeaks'] },
  workHistory: [
    { employer: 'Acme', title: 'Engineer', start: '2020-01', end: null, bullets: ['Did things'] },
  ],
  skills: ['TypeScript'],
  education: [{ institution: 'State U', program: 'CS', year: '2019' }],
};

test('a fully valid resume passes through unchanged', () => {
  expect(validateResume(VALID)).toEqual(VALID);
});

test('missing summary throws naming the field', () => {
  const { summary, ...rest } = VALID;
  expect(() => validateResume(rest)).toThrow(/summary/);
});

test('workHistory[].end accepts string OR null, rejects undefined', () => {
  const bad = { ...VALID, workHistory: [{ ...VALID.workHistory[0], end: undefined }] };
  expect(() => validateResume(bad)).toThrow(/end/);
});

test('non-array skills throws', () => {
  const bad = { ...VALID, skills: 'TypeScript' };
  expect(() => validateResume(bad)).toThrow(/skills/);
});
