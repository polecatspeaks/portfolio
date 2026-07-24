import 'server-only';
import { validateGithubRepo, type GithubRepo } from './github.schema';
import featured from '../data/featured-repos.json';

export async function getFeaturedRepos(): Promise<GithubRepo[]> {
  const results: GithubRepo[] = [];
  for (const { repo } of featured as Array<{ repo: string }>) {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    });
    if (!response.ok) {
      throw new Error(`featured repo fetch failed: ${repo} -> ${response.status}`);
    }
    const body = validateGithubRepo(await response.json());
    if (body.full_name.toLowerCase() !== repo.toLowerCase()) {
      throw new Error(`featured repo full_name mismatch: expected ${repo}, got ${body.full_name}`);
    }
    if (body.private) throw new Error(`featured repo is private, not eligible: ${repo}`);
    if (body.fork) throw new Error(`featured repo is a fork, not eligible: ${repo}`);
    if (body.archived) throw new Error(`featured repo is archived, not eligible: ${repo}`);
    // Round-3 plan-review fix: spec §3 requires that the owner/agent "reports which
    // repos were checked ... and whether each passed or failed its respective gate -
    // not merely 'the build succeeded'." A thrown Error already makes a FAIL loud and
    // named (caught by the surrounding `npm run build`); this line makes the PASS case
    // equally observable in the same build log, rather than silent.
    console.log(`[build] featured repo check: ${repo} -> PASS`);
    results.push(body);
  }
  return results;
}
