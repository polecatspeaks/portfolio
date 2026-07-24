import 'server-only';
import { validatePrivateProjects, type PrivateProject } from './private-projects.schema';
import { assertGithubTokenConfigured } from './env';
import raw from '../data/private-projects.json';

const SHA_RE = /^[0-9a-f]{40}$/;

export async function getPrivateProjects(): Promise<PrivateProject[]> {
  assertGithubTokenConfigured();
  const entries = validatePrivateProjects(raw);
  for (const entry of entries) {
    const repoRes = await fetch(`https://api.github.com/repos/${entry.repo}`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    });
    if (!repoRes.ok) {
      throw new Error(`private project repo fetch failed: ${entry.repo} -> ${repoRes.status}`);
    }
    const repoBody = (await repoRes.json()) as { default_branch?: unknown };
    if (typeof repoBody.default_branch !== 'string' || !repoBody.default_branch) {
      throw new Error(`private project repo response missing default_branch: ${entry.repo}`);
    }
    const commitRes = await fetch(
      `https://api.github.com/repos/${entry.repo}/commits/${repoBody.default_branch}`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } },
    );
    if (!commitRes.ok) {
      throw new Error(`private project commit fetch failed: ${entry.repo} -> ${commitRes.status}`);
    }
    const commitBody = (await commitRes.json()) as { sha?: unknown };
    if (typeof commitBody.sha !== 'string' || !SHA_RE.test(commitBody.sha)) {
      throw new Error(`private project commit response has malformed sha: ${entry.repo}`);
    }
    if (commitBody.sha !== entry.lastVerifiedSha) {
      throw new Error(
        `private project ${entry.repo} HEAD moved: expected ${entry.lastVerifiedSha}, got ${commitBody.sha}`,
      );
    }
    // Round-3 plan-review fix: same spec §3 observed-verification-reporting
    // contract as Task B.1's loader - a PASS is logged for every SHA-matched entry,
    // so a successful build's own log names every private repo actually checked.
    console.log(`[build] private project SHA check: ${entry.repo} -> PASS`);
  }
  return entries;
}
