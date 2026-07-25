import * as fs from 'fs';
import * as path from 'path';

export type PrivateProject = {
  repo: string;
  title: string;
  // v2.1 (issue #19): plain-register headline + story; summary stays as the
  // technical register underneath.
  headline: string;
  story: string;
  summary: string;
  screenshots: string[];
  date: string;
  lastVerifiedSha: string;
};

function fail(msg: string): never {
  throw new Error(`private-projects.json: ${msg}`);
}

const SHA_RE = /^[0-9a-f]{40}$/;

export function validatePrivateProjects(input: unknown): PrivateProject[] {
  if (!Array.isArray(input)) fail('must be an array');
  return (input as unknown[]).map((entry, i) => {
    const e = entry as Record<string, unknown>;
    if (typeof e?.repo !== 'string') fail(`[${i}].repo missing or wrong type`);
    if (typeof e?.title !== 'string') fail(`[${i}].title missing or wrong type`);
    if (typeof e?.headline !== 'string') fail(`[${i}].headline missing or wrong type`);
    if (typeof e?.story !== 'string') fail(`[${i}].story missing or wrong type`);
    if (typeof e?.summary !== 'string') fail(`[${i}].summary missing or wrong type`);
    if (!Array.isArray(e?.screenshots) || e.screenshots.length < 1) {
      fail(`[${i}].screenshots must be a non-empty array (Law 2 proof requirement)`);
    }
    for (const shot of e.screenshots as string[]) {
      const onDisk = path.join(process.cwd(), 'public', shot.replace(/^\//, ''));
      if (!fs.existsSync(onDisk)) fail(`[${i}].screenshots path does not exist: ${shot}`);
    }
    if (typeof e?.date !== 'string') fail(`[${i}].date missing or wrong type`);
    if (typeof e?.lastVerifiedSha !== 'string' || !SHA_RE.test(e.lastVerifiedSha)) {
      fail(`[${i}].lastVerifiedSha missing or not a 40-char hex sha`);
    }
    return e as PrivateProject;
  });
}
