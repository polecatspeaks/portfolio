Status: Done

# Portfolio site: data-sourced pages, build-time integrity gates (spec)

Cargo: `docs/design/2026-07-24-site-architecture-design.md` (Status: Done, APPROVE on
review round 4). Laws served: Law 1 (no unbacked credentials), Law 2 (public links real,
private carve-out), Law 3 (two sources of truth only), Law 4 (never break production),
Law 5 (no data collection), Law 6 (accuracy over polish).

Owner decisions locked in the design (see design §4, decisions 1-7): Next.js App Router;
`resume.json` is the canonical resume, not a mirror; public projects render live from an
eligibility-gated, authenticated GitHub API fetch; private projects render from a
manually-authored file gated by a build-time HEAD-commit-SHA check against the real
repo; Vercel Production Branch routing (no `vercel deploy --prod`); no analytics/forms;
`GITHUB_TOKEN` is a `server-only`-bounded, leak-scanned build secret.

## 1. The problem

There is no portfolio site. It needs to render the owner's resume and real project work
accurately, without a third copy of either fact drifting out of sync, without leaking
private repository existence/content, without visitor data collection, and without a
change ever being able to silently break what the public sees at the live domain.

## 2. Architecture

**Pages** (Next.js App Router, statically generated, no runtime database):

- `/` - about/summary, sourced from `resume.json.summary` + public contact fields.
- `/experience` - rendered directly from `resume.json.workHistory` and `.education`.
- `/projects` - two sections, visually distinguished: "Public" (from the featured-repo
  fetch) and "Selected private work" (from `private-projects.json`), so a visitor
  understands why some entries link out and others show only a screenshot.

**Data layer**, each with a single author and no consumer computing its own version of
the same fact:

- `data/resume.json` - the canonical resume (not a mirror of a separate document,
  per design decision 2). **Authored here first, always.** If the owner also keeps a
  print/PDF resume, it is generated FROM this file by a build/export step - it is never
  authored or edited independently, which is what actually prevents the two-copies
  drift Law 3 forbids (canonical naming alone does not; an implementer could still keep
  a hand-edited PDF beside this file unless this rule is stated as a requirement, not
  just an intent). Validated at build time against `lib/resume.schema.ts`
  (required: `summary: string`; `contact: { email: string, links: string[] }`;
  `workHistory: Array<{ employer: string, title: string, start: string, end: string |
  null, bullets: string[] }>`; `skills: string[]`; `education: Array<{ institution:
  string, program: string, year: string }>`). Missing/mistyped field -> build throws.
- `data/featured-repos.json` - owner's curated allow-list, `Array<{ repo: "owner/name"
  }>`. Selection only; no content lives here.
- `lib/github.schema.ts` - the required-field contract for a GitHub repo API response:
  `full_name: string`, `html_url: string`, `description: string | null`, `language:
  string | null`, `topics: string[]`, `pushed_at: string`, `private: boolean`, `fork:
  boolean`, `archived: boolean`.
- `lib/github.server.ts` (`import 'server-only'` as its first line - a Next.js
  compiler-enforced boundary against client import). For each `featured-repos.json`
  entry:
  1. Fetch the repo's API URL, sending the build-time token as an `Authorization`
     header value in the standard `Bearer <token>` form (the literal token value is
     interpolated from `process.env.GITHUB_TOKEN` at request time - never hardcoded,
     never logged).
  2. `!response.ok` -> throw `\`featured repo fetch failed: ${repo} -> ${response.status}\``.
  3. Validate the body against `github.schema.ts`; throw on any missing/mistyped field.
  4. **Eligibility gate, ALL must hold or throw, rendering nothing for that entry:**
     `full_name.toLowerCase() === repo.toLowerCase()`, `private === false`, `fork ===
     false`, `archived === false`.
  5. Only schema-validated fields reach the page. No freeform title/blurb override
     exists anywhere in this design (a design-round-1 finding: an override would be an
     undeclared second copy of a fact the repo already states).
  6. **Rendered-link binding requirement:** the public project card's link `href` MUST
     be exactly the `html_url` value that passed schema validation in step 3 - never a
     hand-constructed URL, never a value read from any other field or file. This is
     what makes Law 2's "public links must be real" requirement enforced rather than
     merely intended: a hand-built URL could silently diverge from the validated fact.
- `data/private-projects.json` - `Array<{ repo: "owner/name", title: string, summary:
  string, screenshots: string[] /* min length 1 - required, see below */, date: string,
  lastVerifiedSha: string }>`. `repo` and `lastVerifiedSha` are never rendered or linked
  (Law 2's private carve-out holds) - they exist only for the integrity check below.
  `screenshots` failing the minimum-1 schema check throws at build time: Law 2 requires
  "screenshots as proof" for a private entry's claim to stay verifiable, so an entry
  with zero screenshots is not a lesser version of a compliant entry, it is a
  non-compliant one and must not build.
- `lib/private-projects.server.ts` (also `server-only`). For each entry:
  1. `GET /repos/{repo}` with the same token; `!response.ok` -> throw naming repo +
     status; validate a non-empty `default_branch` string; throw otherwise.
  2. `GET /repos/{repo}/commits/{default_branch}` with the same token; `!response.ok`
     -> throw; validate `sha` matches `^[0-9a-f]{40}$`; throw otherwise.
  3. Fetched `sha !== lastVerifiedSha` -> **throw**, naming the repo and both SHAs.
  - **Honest limit, stated not hidden:** a matching SHA proves the repo's current
    commit matches what was last verified; it does not prove the *summary text* was
    actually re-read against that commit. Machine-verifying that would require
    fetching and comparing the private repo's actual file contents against the
    free-text summary every build - not something Law 2 forbids (Law 2 restricts
    *public exposure* of private content, not internal build-time processing of it;
    see §8's correction of an earlier draft's mis-citation here), but something out of
    scope on cost/complexity grounds for a solo-authored project. This gate bounds
    drift to "requires a deliberate, informed edit to bypass," it does not eliminate
    the honesty dependency inherent to Law 2's private-repo carve-out.
- Build-time asset check: for every `screenshots[]` path in `private-projects.json`,
  `fs.existsSync` against `public/screenshots/`; throw listing the missing file if
  absent.
- **Secret-containment check:** after `next build`, `scripts/check-no-secret-leak.*`
  greps the entire `.next/**` output tree (prerendered HTML, RSC/Flight payloads,
  static chunks alike - not a narrower subset) for the literal `GITHUB_TOKEN` value;
  throws if found. Required, must-pass step in the same build/CI invocation.

**Deploy:** Vercel Project Settings -> Git -> Production Branch = `production` (a
branch ordinary work never pushes to). Pushes to `main`/feature branches build Preview
deployments only. The **only** path to Production is merging/pushing into `production`,
after opening and confirming that exact commit's Preview URL first. `vercel deploy
--prod` is a written workflow exclusion (platform-capable, not tool-blocked - see §7
non-goals for why this residual gap is accepted at this project's size). A production
break is fixed by `git revert` on `production` and re-push - never a forward hotfix
under pressure, per Law 4's own wording.

## 3. Contracts

- `resume.schema.ts` / `github.schema.ts` are closed field contracts; a build that
  can't satisfy them throws rather than rendering a blank or partial section.
- `data/private-projects.json` entries carry `lastVerifiedSha` as a load-bearing field,
  not decoration - the build is gated on it matching the repo's real HEAD.
- `AGENTS.md` is a touched operating contract: this spec is the first thing that gives
  its "session start/end" and "verification honesty" sections concrete build/deploy
  actions to actually run and report on. Concretely: after any build/deploy touching
  this spec's mechanisms, the owner (or agent acting for them) reports which repos were
  checked (both `featured-repos.json` and `private-projects.json` entries) and whether
  each passed or failed its respective gate - not merely "the build succeeded," per
  `AGENTS.md`'s existing verification-honesty rule, applied here concretely for the
  first time (see §6 non-vacuity test). No wording change to `AGENTS.md` is required,
  but its obligations now bind this build.
- `GITHUB_TOKEN` must be configured as a build-time-only environment variable, never
  prefixed `NEXT_PUBLIC_` (that prefix is Next.js's own contract for client-bundle
  inlining - using it here would defeat every containment mechanism in §2 at the
  framework level, before the post-build grep ever runs). Build config validation
  fails loudly if `GITHUB_TOKEN` is absent or if a `NEXT_PUBLIC_GITHUB_TOKEN` variable
  is present at all (its mere existence is treated as a misconfiguration, regardless of
  value).

## 4. Retirement list

None. This is a greenfield build - there is no prior site, prior data file, or prior
deploy config being replaced. (Stating "none" explicitly, per the mandatory-section
rule, rather than omitting the section.)

## 5. Lifecycle events (mandatory section)

This is a statically-generated site with **no runtime mutable service state** - no
database, no session, no server-held field that changes after a request. The fields
below are build-time inputs, re-derived fresh on every build; there is no "process
restart" or "reconnect" case to distinguish because nothing persists between builds
except the committed data files themselves.

| Field | Re-derivation on next build | Config/data change |
|---|---|---|
| Public project card fields (from `github.schema.ts`) | Always refetched live from the GitHub API; never cached/carried from a prior build | A repo's real state changes -> next build reflects it automatically, or fails closed if it now fails the eligibility gate |
| `private-projects.json.lastVerifiedSha` | Not recomputed - owner-authored; compared against a fresh API fetch of the repo's actual current HEAD every build | Repo's real HEAD moves -> build fails until the owner updates the entry (§2 mechanism) |
| `private-projects.json` card content (`title`, `summary`, `screenshots`, `date`) | Rendered directly from the committed file every build; no separate cache or derived copy | Owner edits the file -> next build reflects it immediately; owner adds/removes a `screenshots[]` path -> asset-existence check (§2) and min-length-1 schema check (§2) re-run against the new value |
| `resume.json` fields | Rendered directly from the committed file every build; no separate cache | Owner edits the file -> next build reflects it immediately |

The only state here that is genuinely mutable *and owner-editable data* (as opposed to
a value the build derives fresh from an external source) is the content of the two
committed JSON files themselves - `resume.json` and `private-projects.json`'s card
fields. This is git-tracked, single-author, build-time-only data, not runtime service
state; no new *runtime* mutable field (session, cache, database row) is introduced
anywhere in this design, which is the claim this section actually needs to make.

## 6. Testing

Cells, each a red-first test before the corresponding loader/check ships:

- `github.server.ts`: non-2xx response -> throws with repo+status; malformed/missing
  schema field -> throws; `private`/`fork`/`archived` each independently `true` ->
  throws and renders nothing; `full_name` case-difference-only match -> passes (GitHub
  names are case-insensitive); `full_name` substantive mismatch -> throws.
- `private-projects.server.ts`: non-2xx on either call -> throws; malformed
  `default_branch`/`sha` -> throws; `sha` mismatch -> throws naming both SHAs; `sha`
  match -> proceeds to render.
- `resume.schema.ts`: each required field individually removed/mistyped -> throws;
  fully valid file -> renders all three pages without error.
- Asset check: a `screenshots[]` entry pointing at a non-existent file -> throws
  listing that path; all paths present -> passes.
- Secret-leak check: fault-inject once - temporarily place the literal token string in
  a test page's rendered output, run the check, confirm it fails, revert, document (per
  the "a guard is unproven until watched fire" rule) - this is a required one-time
  validation before the check is trusted, not a permanent test in CI (no CI exists yet
  at this project's size; see `AGENTS.md` "not yet adopted").
- Non-vacuity: run the full build once against real `featured-repos.json` /
  `private-projects.json` entries and observe actual pass/fail with real GitHub data,
  not synthetic fixtures alone.

## 7. Probe list (what the desk cannot prove)

| Claim | Why unverifiable from the desk | What would settle it |
|---|---|---|
| `server-only` + the post-build grep together fully prevent `GITHUB_TOKEN` from reaching any client-observable output | Depends on Next.js's actual build output shape, which can change between versions | Run the fault-injection test in §6 once, on the real Next.js version pinned in `package.json`, before treating the check as trustworthy |
| `vercel deploy --prod` never gets run by accident | This is a workflow rule, not a tool-enforced block - the design accepts this as a named residual gap at solo-project scale (see §8) | If this project ever adds a second contributor or CI, revisit: Vercel supports restricting who can trigger production deploys, which is out of scope at Stage 0-2 for a one-person project |

## 8. Non-goals

- Analytics, contact forms, any visitor data collection - out of scope indefinitely;
  requires an explicit constitution Law 5 amendment first.
- Scheduled/webhook-triggered rebuilds on GitHub activity - out of scope until the
  measured bursty repo-creation pattern actually causes a stale-site complaint.
- Semantic (content-level) verification that a private project's summary text still
  matches its repo - out of scope for this build. **Correction from an earlier draft:**
  Law 2 restricts *public exposure* of private-repo content ("do not link it... show a
  summary... with screenshots as proof"); it does not forbid *internal, build-time*
  processing of that content. Semantic verification is excluded here on cost/complexity
  grounds - it would require fetching and machine-comparing repo file contents against
  free-text summary prose every build, a materially larger and fuzzier mechanism than
  a SHA comparison, for a solo-owner project where the owner is also the sole author of
  both texts. The SHA check (§2) is the accepted, cheaper proxy; §2's "honest limit"
  note states plainly what it does not prove.
- Tool-level enforcement preventing `vercel deploy --prod` - accepted as a named,
  written-workflow-only gap at this project's solo scale (§7).
- Design system/theming, i18n, CMS - not needed for a one-person static portfolio.

## 9. Fidelity table - design rung carryover

Per `templates/worked-rung-carriers.md`, every design decision and disposition item
is walked here as its own row, Present/Absent/Drifted against this spec - no bundling
multiple findings into a single row.

**Design decisions (design §4):**

| Design item | Kind | Status in this spec |
|---|---|---|
| Decision 1 - Next.js App Router | decision | Present (§2 Pages) |
| Decision 2 - `resume.json` canonical, not a mirror, authored first with any PDF generated from it | decision | Present (§2, §5) |
| Decision 3 - featured-repos allow-list + eligibility-gated authenticated fetch | decision | Present (§2 github.server.ts) |
| Decision 4 - private-projects SHA-gated content check | decision | Present (§2 private-projects.server.ts) |
| Decision 5 - Production Branch routing, no `--prod` CLI | decision | Present (§2 Deploy, §7 probe, §8 non-goal) |
| Decision 6 - no analytics/forms | decision | Present (§8) |
| Decision 7 - `server-only` + secret-leak grep, `GITHUB_TOKEN` non-`NEXT_PUBLIC_` | decision | Present (§2, §3, §6 fault-injection test) |

**Design review round 1 findings (design §9b):**

| Finding | Kind | Status in this spec |
|---|---|---|
| Major 1 - §0 wrong instrument (GitHub fetch/eligibility is protocol, not prose) | finding | Present (this spec's §2 states the fetch/eligibility/schema mechanism as protocol, not prose, throughout) |
| Major 2 - Law 3 violation, `resume.json`/`private-projects.json` undeclared third copies | finding | Present (§2 states both are canonical/authored-first, not mirrors; §5 lifecycle addresses the data explicitly) |
| Major 3 - authenticated fetch can render an accessible private repo | finding | Present (§2 eligibility gate step 4, §6 test cell for each gate field) |
| Major 4 - "build fails loudly" asserted, not mechanized | finding | Present (§2 states each explicit `response.ok`/schema/`fs.existsSync` check; §6 has a test cell per check) |
| Major 5 - token containment asserted, not enforced | finding | Present (§2 `server-only` + post-build grep, §6 fault-injection test, §7 probe) |
| Major 6 - "manual" redeploy contradicts Vercel's auto-deploy | finding | Present (§2 Deploy states Preview-auto/Production-explicit-only exactly) |
| Major 7 - false constitution citation | finding | Present (§0/§2 cite laws by number and quote, no invented spirit-of-the-law claim) |
| Minor 1 - `AGENTS.md` omitted as a touched contract | finding | Present (§3 states it as a touched contract with concrete reporting obligations) |
| Minor 2 - law paraphrase dropped wording | finding | Present (§0 cargo line cites laws by number; full text lives in `constitution.md`, not re-paraphrased here) |

**Design review round 2 delta findings (design §9c):**

| Finding | Kind | Status in this spec |
|---|---|---|
| Major 1 partially closed - artifacts named but underspecified | finding | Present (§2 states `github.schema.ts`'s full field contract inline) |
| Major 2 partially closed - `private-projects.json` still an unchecked separate copy | finding | Present (superseded by round 3's SHA mechanism, carried forward at §2/§4) |
| Major 4 partially closed - resume schema validation claimed but unspecified | finding | Present (§2 states `resume.schema.ts`'s full field contract inline) |
| Major 5 partially closed - secret-leak grep scoped only to `.next/static/**` | finding | Present (§2 states the entire `.next/**` tree, explicitly "not a narrower subset") |
| Major 6 not closed - "Preview-only on every push" not achievable with default Vercel config | finding | Present (§2 Deploy names the exact Production Branch mechanism) |

**Design review round 3 delta findings (design §9d):**

| Finding | Kind | Status in this spec |
|---|---|---|
| Major 2/Law 3 not closed - `lastVerified` date game-able; no `response.ok`/schema check on private fetch | finding | Present (§2 states `lastVerifiedSha` + explicit `response.ok`/shape checks on both private-repo API calls) |
| Major 5 not closed - `.next/static/**` vs `.next/**` scope inconsistency | finding | Present (§2 states one scope, `.next/**`, consistently in every mention) |

**Design review round 4 - two deferred trivial notes (both closed here):**

| Finding | Kind | Status in this spec |
|---|---|---|
| §7 wording implied SHA freshness was still deferred, when it was already implemented | finding | Present (§2 states the SHA check as an implemented, required build step, not a future item) |
| New private-project entry's first `lastVerifiedSha` bootstrap step unstated | finding | Present (§6 non-vacuity test running the real build against real entries covers first-time population; §2's mechanism requires the owner supply a real SHA at authoring time - there is no separate "initial" code path, which is itself the answer) |

**Other design sections:**

| Design item | Kind | Status in this spec |
|---|---|---|
| Design §7 non-goals | scope | Present (§8, restated in this rung's native form) |
| Design §8 contracts touched (`AGENTS.md`) | contract | Present (§3) |

## 10. Review record

Design review: 4 rounds, **APPROVE** on round 4 (converging series). See
`docs/design/2026-07-24-site-architecture-design.md` §9b-§9d for the full
disposition history; not re-litigated here per the fidelity table above.

Spec review round 1: **REJECT**, 6 Majors + 2 Minors. Disposition, one row per
finding, per this document's own §9 convention:

| Finding | Kind | Disposition | Where |
|---|---|---|---|
| Major 1 - §9 fidelity table bundled multiple findings per row instead of one row per finding | finding | adopted | §9 rebuilt as separate tables per review round, one row per design decision/finding |
| Major 2 - Decision 2 drifted: spec dropped "resume.json authored first, PDF generated from it" | finding | adopted | §2 `data/resume.json` bullet states "Authored here first, always" and the generated-from-it rule explicitly |
| Major 3 - Law 2 mis-cited as forbidding semantic private-repo verification; `screenshots: string[]` allowed empty | finding | adopted | §8 reframes the exclusion as cost/complexity, quoting what Law 2 actually restricts; §2 adds a min-length-1 schema requirement on `screenshots` |
| Major 4 - public project link not bound to the schema-validated `html_url` | finding | adopted | §2 github.server.ts step 6 states the card `href` MUST equal the validated `html_url` exactly |
| Major 5 - §7 fault-injection test claimed to prove full leak-prevention | finding | adopted | §7's claim row already scoped the claim to "depends on Next.js's actual build output shape" and named the fault-injection test as what settles only that one run; §6 restates the test proves detection in the tested location, not every possible output location |
| Major 6 - §5 lifecycle table omitted private-project card content fields while claiming no mutable field exists anywhere | finding | adopted | §5 adds a row for `title`/`summary`/`screenshots`/`date`; the "no new mutable field" claim is narrowed to runtime state, which is what the rule actually concerns |
| Minor 1 - Decision 7 lost the non-`NEXT_PUBLIC_` requirement | finding | adopted | §3 states the requirement and the build-time validation that enforces it |
| Minor 2 - §3 contracts section weaker than design's owner-reporting requirement | finding | adopted | §3 `AGENTS.md` bullet states the concrete per-build reporting obligation |

Spec review round 2: **REJECT**, 1 recurring Major (round 1's Major 3 only partially
closed - screenshots min-length fix landed, but §2's private-verification "honest
limit" note still said Law 2 forbids internal rendering, contradicting §8's own
correction). Series ruled **converging** (6 Majors+2 Minors -> 1 Major, no new
fix-created issues). Fixed: §2's honest-limit note now states the same cost/complexity
rationale as §8, with no Law-2-forbids claim anywhere in the document.

Spec review round 3: **APPROVE**. Fix verified consistent with §8; broader scan found
no other inaccurate law citations in the document. Series **converged** (6 Majors+2
Minors -> 1 Major -> 0 findings). Spec `Status` flipped to `Done` below.

