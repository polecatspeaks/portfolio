import { validateFeaturedMeta } from './featured';
import featured from '../data/featured-repos.json';

const VALID = { repo: 'polecatspeaks/thing', headline: 'A thing', story: 'It does a thing.' };

test('a valid entry passes through unchanged', () => {
  expect(validateFeaturedMeta([VALID])).toEqual([VALID]);
});

test('missing headline throws naming the field', () => {
  const { headline, ...bad } = VALID;
  expect(() => validateFeaturedMeta([bad])).toThrow(/headline/);
});

test('missing story throws naming the field', () => {
  const { story, ...bad } = VALID;
  expect(() => validateFeaturedMeta([bad])).toThrow(/story/);
});

test('the real data file validates (build-time contract for the projects page)', () => {
  expect(() => validateFeaturedMeta(featured)).not.toThrow();
});
