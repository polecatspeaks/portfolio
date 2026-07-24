import { getResume } from './resume';

test('getResume returns a value that already passed validateResume', () => {
  const resume = getResume();
  expect(resume.summary).toEqual(expect.any(String));
  expect(resume.contact.links.length).toBeGreaterThanOrEqual(0);
});

test('getResume propagates a validation throw without swallowing it', () => {
  jest.doMock('../data/resume.json', () => ({ notResume: true }), { virtual: true });
  jest.resetModules();
  const { getResume: reloaded } = require('./resume');
  expect(() => reloaded()).toThrow();
});
