import featured from '../data/featured-repos.json';

// v2.1 (issue #19): the plain-register headline + story for each featured
// public repo live here, keyed by repo full_name. They stay in this repo's
// data (owner-authored, reviewed in PR) while the technical facts (description,
// language, URL) keep coming from the live GitHub API via github.server.ts -
// two registers, two sources, neither invented at render time.
export type FeaturedMeta = {
  repo: string;
  headline: string;
  story: string;
};

function fail(msg: string): never {
  throw new Error(`featured-repos.json: ${msg}`);
}

export function validateFeaturedMeta(input: unknown): FeaturedMeta[] {
  if (!Array.isArray(input)) fail('must be an array');
  return (input as unknown[]).map((entry, i) => {
    const e = entry as Record<string, unknown>;
    if (typeof e?.repo !== 'string') fail(`[${i}].repo missing or wrong type`);
    if (typeof e?.headline !== 'string') fail(`[${i}].headline missing or wrong type`);
    if (typeof e?.story !== 'string') fail(`[${i}].story missing or wrong type`);
    return e as FeaturedMeta;
  });
}

export function getFeaturedMeta(): Map<string, FeaturedMeta> {
  const entries = validateFeaturedMeta(featured);
  return new Map(entries.map((e) => [e.repo.toLowerCase(), e]));
}
