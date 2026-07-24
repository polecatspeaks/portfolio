Status: Done

# Site architecture design - personal portfolio (Next.js on Vercel)

Owner: @polecatspeaks
Rung: design (`process/the-ladder.md`)
Review: 4 rounds, APPROVE on round 4 (converging series - 7 Majors -> 5 open items ->
2 blocking -> 0). Disposition tables in §9b-§9d.

## §0 - Instrument check

**Split document.** Page/data ownership, the public/private UX distinction, and deploy
shape are behavioural/architectural - prose is correct for those. But the
featured-repo eligibility check, the GitHub response projection, and the failure
semantics of the build-time fetch are a **protocol/schema concern**: exact field
contracts, a closed set of rejection conditions, and a validation boundary. Prose
cannot hold that precision (round-1 review, Major 1). The precision half is therefore
pushed to an executable artifact, described here as a pointer rather than specified in
prose:

- `lib/github.schema.ts` - the required-field contract for a GitHub repo API response
  (types below, §5).
- `lib/github.server.ts` - the loader, with `import 'server-only'` at the top (a
  structural, compiler-enforced guard, not a convention) and the eligibility check.
- A conformance test suite exercising every rejection branch named in §5/§6: 404,
  malformed body, `private: true`, `fork: true`, `archived: true`, `full_name`
  mismatch. Each is a red-first test before the loader ships.

The prose below states *what* each of those must do; the artifacts are what actually
enforces it, and neither exists as a substitute for the other.

## §1 - Constraints

| Source | What it forbids here (quoted, not paraphrased) | How this design satisfies it |
|---|---|---|
| `constitution.md` Law 1 | *"Never state a skill, experience, or credential that isn't backed by my resume or verifiable in my actual GitHub work."* | All bio/skills/experience content renders only from `data/resume.json`, which (per the Law 3 fix below) **is** the canonical digital resume, not a copy of one |
| `constitution.md` Law 2 | *"Every project link must point to real, currently reachable work. If the repo is public, link directly to it — a 404, a stale fork, or a link to the wrong repo is a defect, not a formatting nit. If the repo is private, do not link it; instead show a summary of the work with screenshots as proof, so the claim stays verifiable without exposing private code."* | Public projects link directly to the live GitHub repo URL, but only after the eligibility check (§5) confirms the fetched repo is actually public, non-fork, non-archived, and matches the listed identity exactly - closing the round-1 leak finding. Private projects never link a repo; they render only from `data/private-projects.json` |
| `constitution.md` Law 3 | *"The resume and my actual GitHub repos are the only two sources of truth. The site is a rendering of them, never a third, independently-drifting copy. If the site claims something neither source supports, that's a defect."* | `resume.json` is redefined as the resume itself (§4 decision 2) rather than a mirror of one. `private-projects.json` is tied to its real repo by an internal `repo` identity field and a build-time check comparing the recorded `lastVerifiedSha` to the repo's actual current HEAD commit, failing the build on any mismatch (§5). **Honest limit:** this bounds drift to "requires a deliberate, informed edit to bypass" - it cannot verify the *content* of the summary against the private repo without rendering that content, which Law 2 forbids; the residual honesty dependency is named, not hidden |
| `constitution.md` Law 4 | *"The live Vercel production deployment is what the public sees — never ship a change that breaks it. A broken production site outranks any in-progress work; revert before you debug forward."* | Vercel's **Production Branch** project setting is pointed at a dedicated branch (e.g. `production`) that ordinary work never pushes to; every push to `main` therefore builds a Preview deployment only. The only path to Production is merging into that branch after opening the corresponding Preview and confirming it; `vercel deploy --prod` (which would bypass the branch control) is explicitly excluded. A break is fixed by `git revert` on `production`, matching the law's own wording |
| `constitution.md` Law 5 | *"No visitor data is collected, silently or otherwise."* | No analytics, forms, or client-side tracking anywhere in this design; static generation only, with no server-side visitor logging added either (the "otherwise" the law names) |
| `constitution.md` Law 6 | *"Accuracy outranks polish."* | Build fails rather than rendering an unverifiable claim (§5/§6 mechanisms, no longer merely asserted); resume drift is named as an honest, undetected gap rather than a falsely-claimed catch |

## §2 - Premises

- **GitHub's public repo metadata (description, topics, language, pushed_at) is enough to
  render a public project card without hand-written copy.** If false: public project
  cards look thin or generic. **No override field exists** (round-1 review flagged the
  originally-proposed title/blurb override as a Law 3 violation - free-form prose beside
  a repo reference is still a second, driftable copy of a fact the repo itself already
  states). If a card reads too thin, the fix is improving the repo's own `description`
  and topics on GitHub - the single source - not adding site-only prose.
- **Rebuilds are triggered manually** (the owner pushes or clicks redeploy) - no scheduled
  cron and no GitHub webhook beyond Vercel's normal git-push-to-deploy. Chosen after
  checking real repo-creation cadence (see below): the pattern is bursty (years of
  dormancy, then multiple repos within a day), not a steady periodic rate, so a fixed
  schedule would either rebuild needlessly during dormancy or lag during a burst either
  way - manual trigger during an active burst is the simplest fit.
- **Not every public repo should appear.** Old scratch/toy repos (e.g. 2016-era
  infrastructure experiments) are not representative work. Only non-fork, non-archived
  repos are eligible, and the owner opts individual repos in via a small allow-list
  (`data/featured-repos.json`: list of `owner/name` strings) rather than showing every
  public repo unfiltered. This list is a *selection* of which real repos to show, not a
  second copy of their content (Law 3 still holds: content still comes live from the API).

## §2c - Probe list

| Claim | Why unverifiable from the desk | What would settle it |
|---|---|---|
| A build-time `GITHUB_TOKEN` never reaches the client bundle | Depends on actually building and inspecting output, not just intent | **No longer a bare probe.** §5 makes this a required, must-pass build step: `import 'server-only'` at the top of the loader module makes any accidental client import a Next.js compile error, and a post-build grep of the entire `.next/**` build output tree for the literal token value is a required build step, not an assumption |

## §3 - The problem

There is no portfolio site yet. The owner needs one, hosted on Vercel, that accurately
represents their resume and real project work, stays accurate over time without silently
drifting from either source, collects no visitor data, and can be redeployed without a
risk of breaking what the public sees.

## §4 - Decisions

| # | Decision | Reason | Constraint/premise driving it |
|---|---|---|---|
| 1 | Next.js (App Router), static export where possible | User's explicit choice; first-class Vercel support | User input |
| 2 | `data/resume.json` is the **canonical, primary** resume - authored/edited there first; if the owner also keeps a PDF/print resume, it is generated FROM this file, never authored independently | Makes Law 3 hold by construction: one editable source, not two documents kept in sync by discipline | Law 1, Law 3 (round-1 Major 2 fix) |
| 3 | Public projects: `data/featured-repos.json` (allow-list of `owner/name`) + authenticated GitHub REST API fetch at build time, gated by a hard eligibility check (exact identity match, `private: false`, `fork: false`, `archived: false`) before any field is rendered | Only real, current, reachable, actually-public repos shown; closes the round-1 private-repo-leak Major | Law 2 (public case), Law 3, §2 premise on curation |
| 4 | Private projects: `data/private-projects.json` (`repo: "owner/name"` [never rendered/linked], title, summary, screenshot paths, date, `lastVerifiedSha`), gated by a build-time content check: fetch the private repo's current HEAD commit SHA with the same `GITHUB_TOKEN` and **fail the build** if it doesn't match `lastVerifiedSha` | Cannot fetch/render private repo *content* without exposing it (Law 2 carve-out), but the repo's actual current commit SHA is checkable with the same token already in use; a SHA (unlike a self-reported date) cannot be silently advanced without deliberately looking it up | Law 2 (private case), Law 3 (round-3 fix: SHA replaces date to close the "date can be bumped without re-checking" gap) |
| 5 | Vercel project setting **Production Branch = `production`** (a branch ordinary work never pushes to); all work happens on `main`/feature branches, which build **Preview** deployments only. **Production is reached only by merging/pushing into `production`, after opening that commit's Preview URL and confirming it** - `vercel deploy --prod` is explicitly not used, since it bypasses the branch control entirely | Names the actual Vercel mechanism that makes "push to main never touches Production" true, and closes it against the CLI bypass round 3 found | §2 premise, Law 4 (round-3 fix) |
| 6 | No analytics, telemetry, or forms | Explicit user decision; static/informational only | Law 5 |
| 7 | GitHub loader (`lib/github.server.ts`) is a `server-only`-guarded module reading a non-`NEXT_PUBLIC_` `GITHUB_TOKEN`; a post-build step greps the client output for the token value | Removes the rate-limit risk (owner's Stage-1 decision) and closes the round-1 secret-containment Major - containment becomes a structural + tested guard, not an assertion | §2c probe, Law 4 |

## §5 - Mechanism

**Data layer (build-time only, no runtime database):**

- `data/resume.json` - the **canonical** resume (decision 2): contact info (public
  fields only), summary, work history, skills, education. Authored here first; any
  print/PDF copy is generated from this file, never the reverse.
- `lib/resume.schema.ts` - the required-field contract for `resume.json`: `summary:
  string`, `contact: { email: string, links: string[] }`, `workHistory: Array<{
  employer: string, title: string, start: string, end: string | null, bullets:
  string[] }>`, `skills: string[]`, `education: Array<{ institution: string, program:
  string, year: string }>`. Loaded and validated at build time before any page renders
  from it; a missing/mistyped field throws, closing the round-2 finding that this
  validation was claimed in §6 but never actually specified.
- `data/featured-repos.json` - array of `{ "repo": "owner/name" }`, the owner's
  curated allow-list.
- `lib/github.schema.ts` - the required-field contract for a repo API response:
  `full_name: string`, `html_url: string`, `description: string | null`,
  `language: string | null`, `topics: string[]`, `pushed_at: string`,
  `private: boolean`, `fork: boolean`, `archived: boolean`. A response missing or
  mistyping any of these fails validation.
- `lib/github.server.ts` - the loader, `import 'server-only'` as its first line (a
  Next.js compiler-enforced boundary: importing this module from client code is a
  build error, not a convention someone has to remember). For each `featured-repos.json`
  entry:
  1. `fetch(\`https://api.github.com/repos/${repo}\`, { headers: { Authorization: \`Bearer ${process.env.GITHUB_TOKEN}\` } })`.
  2. If `!response.ok`, **throw** `\`featured repo fetch failed: ${repo} -> ${response.status}\`` -
     aborting the build. `fetch` does not throw on 404/403/429 itself, so this check is
     mandatory, not implied.
  3. Parse the body and validate it against `github.schema.ts`; throw on any missing/
     mistyped field.
  4. **Eligibility gate, all must hold or throw** (this is the round-1 leak fix):
     `full_name.toLowerCase() === repo.toLowerCase()` (exact identity - GitHub repo
     names are case-insensitive), `private === false`, `fork === false`,
     `archived === false`. A repo failing any of these renders **nothing** - the build
     stops with the repo name and which check failed.
  5. Only fields present in the validated schema are passed to the page - no
     freeform override exists (§2 fix).
- `data/private-projects.json` - array of `{ repo: "owner/name", title, summary,
  screenshots: [path,...], date, lastVerifiedSha }`. `repo` and `lastVerifiedSha` are
  **never rendered or linked** (Law 2's private carve-out still holds) - they exist
  purely for the build-time content-check below.
- `lib/private-projects.server.ts` (also `server-only`) - for each entry:
  1. Fetch `GET https://api.github.com/repos/{repo}` with the same `GITHUB_TOKEN`
     (succeeds only if the token's owner has access). If `!response.ok`, **throw**
     naming the repo and status - the same explicit check the public loader makes,
     closing the round-3 finding that this call had no failure handling specified.
     Validate the body has a non-empty string `default_branch`; throw otherwise.
  2. Fetch `GET https://api.github.com/repos/{repo}/commits/{default_branch}` with the
     same token. If `!response.ok`, throw. Validate the body has a `sha` matching
     `^[0-9a-f]{40}$`; throw otherwise.
  3. **If the fetched `sha` !== the entry's `lastVerifiedSha`, throw** naming the repo
     and both SHAs - the build refuses to ship a summary that predates the repo's
     current commit.
  - **Why a commit SHA instead of a date:** round 3 correctly found that an
    owner-editable `lastVerified` *date* could be bumped without the summary actually
    being re-checked, and that a timestamp comparison doesn't prove the card matches
    the repo's content. A SHA is the repo's actual current identity, not a self-reported
    claim, and updating it requires deliberately looking up the new value - it cannot be
    silently advanced. **Honest residual limit, stated plainly rather than claimed
    away:** this still depends on the owner actually reading the repo when they update
    `lastVerifiedSha` and `summary` together; no mechanism here can verify the *content*
    of the summary against the private repo without fetching and rendering that private
    content, which Law 2 forbids outright. This bounds the drift to "requires a
    deliberate, informed edit to bypass" - it does not eliminate the honesty dependency
    Law 2's private carve-out inherently has.
- Build-time asset check: for every `screenshots[]` path in `private-projects.json`,
  `fs.existsSync` against `public/screenshots/`; throw listing the missing file if
  absent, rather than shipping a broken `<img>`.
- **Secret-containment check (closes the §2c probe):** after `next build`, a required
  build step (`scripts/check-no-secret-leak.*`, run in the same build/CI invocation)
  greps the **entire build output tree** (`.next/**` - prerendered HTML, RSC/Flight
  payloads, and static assets alike, not only `.next/static/**`) for the literal
  `GITHUB_TOKEN` value; the build fails if found. This is the single authoritative
  scope for this check (§2c cross-referenced to match, closing the round-3 finding
  that the two sections disagreed).

**Pages (Next.js App Router, statically generated):**

- `/` - summary/about, sourced from `resume.json.summary` + contact fields.
- `/experience` - rendered directly from `resume.json.workHistory` / `.education`.
- `/projects` - two sections: "Public" (from the validated, eligibility-gated
  featured-repos fetch) and "Selected private work" (from `private-projects.json`),
  visually distinguished so a visitor understands why some entries link out and
  others show only a screenshot.

**Deploy (decision 5):** In Vercel Project Settings -> Git, **Production Branch is set
to `production`**, a branch that ordinary work never pushes to directly. Pushes to
`main` (or any feature branch) build **Preview** deployments only - this is Vercel's own
branch-based routing, not a manual step anyone has to remember. **The only path to
Production is merging/pushing `main` into `production`.** `vercel deploy --prod` is
explicitly **not** used - round 3 correctly found it bypasses the Production Branch
control entirely and can ship an arbitrary local tree, defeating the whole point of the
branch gate. Before merging into `production`, the owner **must** open the Preview
deployment for that exact commit and confirm it looks correct - a required step, not
an assumption that "the owner has looked." If Production breaks anyway, the fix is
`git revert` on `production` and re-push, per Law 4's "revert before you debug
forward," never a hotfix pushed straight to `production` under pressure.

## §6 - Failure modes

| Failure | Behavior | Law honored |
|---|---|---|
| GitHub API unreachable/rate-limited/non-2xx at build time | Loader checks `response.ok` explicitly and throws with the repo name + status; no partial/stale project list ships | Law 6, Law 4 |
| API response malformed or missing a required field | `github.schema.ts` validation throws before the field is ever rendered | Law 6 |
| A listed repo is actually private, a fork, archived, or its `full_name` doesn't match the allow-list entry exactly | Eligibility gate throws and renders nothing for that entry - this is the round-1 leak fix, now a specified, testable check rather than an assumed `404` | Law 2, Law 3 |
| `resume.json` missing a required field | `lib/resume.schema.ts` validation throws before rendering, rather than shipping a blank section | Law 1, Law 6 |
| Owner edits the real private repo but `private-projects.json`'s `lastVerifiedSha` isn't updated | Build-time content check (`private-projects.server.ts`) fetches the repo's real current HEAD commit SHA and **fails the build** if it doesn't match `lastVerifiedSha` - a SHA can't be silently advanced the way a self-reported date could | Law 3, Law 6 |
| Owner edits a generated print/PDF resume directly instead of `resume.json` | Not machine-preventable; `resume.json` being the sole *authored* file (decision 2) removes the two-copies drift case, but does not stop someone from ignoring the workflow | Law 3 (partial - honest limitation) |
| Private project screenshot file missing | Build-time `fs.existsSync` check throws listing the missing file, rather than shipping a broken `<img>` | Law 6 |
| `GITHUB_TOKEN` value present anywhere in build output (static chunk, prerendered HTML, or RSC/Flight payload) | Post-build grep of the **entire `.next/**` output tree** throws if found; `server-only` import makes most such leaks a compile error before this check even runs | Law 4, Law 5 |

## §7 - Out of scope (deferred, with trigger)

- Analytics/contact form/any data collection - deferred indefinitely; requires an
  explicit constitution amendment to Law 5 first.
- Scheduled or webhook-triggered rebuilds on new GitHub activity - deferred until the
  bursty pattern actually causes a stale-site complaint; not installed speculatively.
- Automated staleness detection between `resume.json` and the real resume document -
  deferred to Stage 5/CI per `ADOPTION.md`, once there's a CI pipeline to host the
  check. (Note: `private-projects.json` HEAD-SHA freshness is already implemented in
  §5, not deferred - what remains deferred there is *semantic* content verification,
  i.e. confirming the summary text itself still matches the repo, which cannot be
  automated without rendering private content and so is out of scope permanently, not
  just until Stage 5.)
- The initial-population workflow for a brand-new `private-projects.json` entry
  (recording its first `lastVerifiedSha`) is not spelled out step-by-step here - it
  follows directly from §5's mechanism (look up the repo's current HEAD SHA and record
  it alongside a freshly-written summary) and is left to implementation.
- Design system/theming, i18n, CMS - not needed for a one-person static portfolio.

## §8 - Contracts touched

- `AGENTS.md` - this design introduces the first actual build/data-transform and the
  first live-production surface the "session start/end" and "verification honesty"
  sections of `AGENTS.md` already govern. No wording change is needed there, but the
  owner is the one obligated to actually run the eligibility/secret-leak checks and
  honestly report their observed output (repo names checked, pass/fail) before treating
  a build as verified - not just read the design and assume it self-enforces.
- No state ledger or gating matrix applies (static site, no mutable service state).

## §9 - Cost

Single owner, no dispatch/cars involved (right-sized per `AGENTS.md` - this is not a
multi-agent train). Implementation is one build pass plus self-review against this
design and the constitution.

## §9b - Disposition of round 1

| Prior item | Kind | Disposition | Where |
|---|---|---|---|
| Major 1 - §0 wrong instrument (GitHub fetch/eligibility is protocol, not prose) | finding | adopted | §0 (split document, executable artifacts named) |
| Major 2 - Law 3 violation, `resume.json`/`private-projects.json` are undeclared third copies | finding | adopted | §1 Law 3, §4 decisions 2 & 4, §5 |
| Major 3 - authenticated fetch can render an accessible private repo | finding | adopted | §5 eligibility gate, §6 |
| Major 4 - "build fails loudly" asserted, not mechanized | finding | adopted | §5 (explicit `response.ok`, schema validation, `fs.existsSync` checks) |
| Major 5 - token containment asserted, not enforced | finding | adopted | §5 (`server-only` import boundary + post-build grep), §2c |
| Major 6 - "manual" redeploy contradicts Vercel's auto-deploy | finding | adopted | §4 decision 5, §5 deploy mechanism (Preview auto, Production explicit-only) |
| Major 7 - false constitution citation ("unknown renders as unknown" spirit) | finding | adopted | §5/§6 rewritten to cite Law 6 plainly, no invented spirit-of-the-law claim |
| Minor 1 - §8 omitted `AGENTS.md` as a touched contract | finding | adopted | §8 |
| Minor 2 - Law 5 paraphrase dropped "or otherwise" | finding | adopted | §1 (all law quotes now verbatim, not paraphrased) |

## §9c - Disposition of round 2 (delta re-review)

Round 2 verdict was REJECT: Majors 1, 2, 4, 5 ruled PARTIALLY CLOSED and Major 6 ruled
NOT CLOSED, plus one new blocking finding and two non-blocking findings.

| Round-2 item | Kind | Disposition | Where |
|---|---|---|---|
| Major 1 partially closed - artifacts named but not specified in enough detail | finding | adopted | §5 now fully specifies `github.schema.ts`'s field contract inline (this doc is the design, not the code - the artifacts themselves are implementation, out of this rung's scope, but the contract they must satisfy is now stated in full) |
| Major 2 partially closed - `private-projects.json` still an unchecked separate copy | finding | adopted | §4 decision 4, §5: added `repo`/`lastVerified` fields and a build-time staleness check against the real repo's `pushed_at` via the same token - drift is now a build-blocking gate, not an admitted gap |
| Major 4 partially closed - resume schema validation claimed but never specified | finding | adopted | §5: added `lib/resume.schema.ts` with the full field contract |
| Major 5 partially closed - secret-leak grep scoped only to `.next/static/**` | finding | adopted | §5: check now scans the entire `.next/**` build output tree |
| Major 6 not closed - "Preview-only on every push" not achievable with default Vercel config | finding | adopted | §4 decision 5, §5: named the actual mechanism (Production Branch project setting pointed at a dedicated `production` branch) |
| New blocking - deploy model not implementable as written | finding | adopted | same fix as Major 6 above |
| Non-blocking - Law 2/Law 4 quotes elided with "..." instead of verbatim | finding | adopted | §1: both laws now quoted in full, no ellipsis |
| Non-blocking - private-project representation still conflicts with Law 3 | finding | adopted | same fix as Major 2 above |

## §9d - Disposition of round 3 (delta re-review)

Round 3 verdict was REJECT, but explicitly ruled the series **converging** (7 -> 5 open
items, no self-inflicted churn). Remaining/new items:

| Round-3 item | Kind | Disposition | Where |
|---|---|---|---|
| Major 2 / Law 3 not closed - `lastVerified` date is owner-editable and doesn't prove content match; private fetch had no `response.ok`/schema check | finding | adopted | §5: replaced date with `lastVerifiedSha` compared against the repo's actual HEAD commit; added explicit `response.ok` + body-shape checks on both private-repo API calls |
| Major 5 not closed - §2c still said `.next/static/**` while §5 said `.next/**` | finding | adopted | §2c: scope corrected to match §5 exactly |
| New blocking - `vercel deploy --prod` bypasses the Production Branch control entirely | finding | adopted | §4 decision 5, §5: CLI `--prod` path removed; the only path to Production is merging into `production`, with a required Preview check first |
| New blocking - private freshness gate could fail open on a non-2xx response | finding | adopted | §5: both private-repo API calls now throw on `!response.ok` and validate required fields before use, mirroring the public loader |
| Non-blocking - §2c/§5 scope conflict | finding | adopted | same fix as Major 5 above |

## §10 - Open questions for the owner (resolved)


1. **Minimum content bar for featured repos?** Resolved: no - manual curation via the
   allow-list is sufficient on its own; the owner chooses which repos represent them.
2. **Unauthenticated vs. authenticated GitHub API access?** Resolved: use a build-time
   `GITHUB_TOKEN` (Vercel encrypted env var, server/build-side only, never bundled to the
   client - see §2c) to remove the 60 req/hr rate-limit risk entirely, even though the
   featured-repo count is small. §5 mechanism updated accordingly.
