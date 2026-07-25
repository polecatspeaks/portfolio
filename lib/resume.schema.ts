export type ResumeSchema = {
  name: string;
  tagline: string;
  summary: string;
  contact: { email: string; links: string[] };
  workHistory: Array<{
    employer: string;
    title: string;
    // v2.1 (issue #18): plain-register story-per-job. The headline leads, the
    // corporate title becomes metadata, the bullets become the receipts.
    headline: string;
    story: string;
    start: string;
    end: string | null;
    bullets: string[];
  }>;
  skills: string[];
  // v2.1 (issue #15): plain-language capability lines, derived strictly from
  // the skills/bullets above (Law 6 - simplify, never inflate).
  capabilities: string[];
  education: Array<{ institution: string; program: string; year: string }>;
};

function fail(path: string): never {
  throw new Error(`resume.json: ${path} is missing or the wrong type`);
}

export function validateResume(input: unknown): ResumeSchema {
  const r = input as Record<string, unknown>;
  if (typeof r?.name !== 'string') fail('name');
  if (typeof r?.tagline !== 'string') fail('tagline');
  if (typeof r?.summary !== 'string') fail('summary');
  const contact = r.contact as Record<string, unknown>;
  if (typeof contact?.email !== 'string') fail('contact.email');
  if (!Array.isArray(contact?.links) || !contact.links.every((l) => typeof l === 'string')) {
    fail('contact.links');
  }
  if (!Array.isArray(r.workHistory)) fail('workHistory');
  (r.workHistory as unknown[]).forEach((entry, i) => {
    const w = entry as Record<string, unknown>;
    if (typeof w?.employer !== 'string') fail(`workHistory[${i}].employer`);
    if (typeof w?.title !== 'string') fail(`workHistory[${i}].title`);
    if (typeof w?.headline !== 'string') fail(`workHistory[${i}].headline`);
    if (typeof w?.story !== 'string') fail(`workHistory[${i}].story`);
    if (typeof w?.start !== 'string') fail(`workHistory[${i}].start`);
    if (w?.end !== null && typeof w?.end !== 'string') fail(`workHistory[${i}].end`);
    if (!Array.isArray(w?.bullets) || !w.bullets.every((b) => typeof b === 'string')) {
      fail(`workHistory[${i}].bullets`);
    }
  });
  if (!Array.isArray(r.skills) || !r.skills.every((s) => typeof s === 'string')) fail('skills');
  if (
    !Array.isArray(r.capabilities) ||
    r.capabilities.length < 1 ||
    !r.capabilities.every((c) => typeof c === 'string')
  ) {
    fail('capabilities');
  }
  if (!Array.isArray(r.education)) fail('education');
  (r.education as unknown[]).forEach((entry, i) => {
    const e = entry as Record<string, unknown>;
    if (typeof e?.institution !== 'string') fail(`education[${i}].institution`);
    if (typeof e?.program !== 'string') fail(`education[${i}].program`);
    if (typeof e?.year !== 'string') fail(`education[${i}].year`);
  });
  return r as ResumeSchema;
}
