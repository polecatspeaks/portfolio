Status: Done

# Visual styling - implementation plan

REQUIRED SUB-SKILL: subagent-driven development (one car per task group, adversarial
reviewer per car), per `ADOPTION.md` Stage 3/4 - continuing the same discipline the
original site-architecture train used, at the owner's explicit request for this
styling train too (not required by right-sizing, but not prohibited either).

Source of truth: `docs/spec/2026-07-24-visual-styling-spec.md` (Status: Done - 3
review rounds, APPROVE round 3). Design: `docs/design-direction.md`.

Base commit: `main`@`271848a` (11/11 original plan tasks done, Vercel live at
`https://star-stack.io/`, 39/39 tests passing, zero CSS anywhere in `app/`).

Cars re-read this plan and the live repo state at dispatch and STOP on mismatch.

> # BINDING AMENDMENT BLOCK (conductor-applied)
> [Empty at plan-writing.]

## Global constraints

- Red-first TDD per step: write the failing test before the implementation.
- No new npm dependency (spec §2) - plain CSS + CSS Modules only, both built into
  Next.js already; `lib/contrast.ts` and `SiteNav.test.ts` both use only Node
  built-ins / the existing Jest setup (`testEnvironment: 'node'`, no DOM).
- Every one of the current 39 tests must still pass unmodified after each car (spec
  §3) - a failing existing test because of a styling change is this plan being
  violated, not the test needing an update.
- `npm run build` must stay clean and `/projects` must still render with the static
  `○` marker (not dynamic `λ`) - re-verified with a real build against the live
  GitHub API (`$env:GITHUB_TOKEN = gh auth token`), same discipline as the original
  train.
- `scripts/check-no-secret-leak.mjs` must still pass against the styled build output.
- Cars never push directly to `main`; each car's final step is a feature-branch
  commit ready for the owner's merge step.
- Suite run at the end of every car: `npm test` (baseline stated per car) and
  `npm run build` clean.

## Car F - design tokens, contrast gate, navigation (Tasks F.1-F.2)

### Task F.1 - `lib/contrast.ts` (WCAG contrast calculator) + test

**Files:** Create `lib/contrast.ts`, `lib/contrast.test.ts`.

**Sentence-check:** WCAG 2.1's contrast ratio formula is public and stable:
relative luminance `L = 0.2126*R + 0.7152*G + 0.0722*B` (with each channel
gamma-corrected: `c <= 0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4`, `c` normalized to
0-1), ratio `= (L1 + 0.05) / (L2 + 0.05)` with `L1` the lighter of the two. This is
the real, current formula - not assumed.

- [ ] **Step 1 (red):** `lib/contrast.test.ts` asserts:
  - `contrastRatio('#3b82f6', '#0a0a0c')` returns a number `>= 4.5`.
  - `contrastRatio('#3b82f6', '#141417')` returns a number `>= 4.5`.
  - `contrastRatio('#ffffff', '#000000')` returns a number very close to `21` (the
    known maximum, a sanity check the formula implementation itself is correct, not
    just coincidentally passing the two real-color assertions above).
  Run `npm test` - RED: `lib/contrast.ts` doesn't exist yet.
- [ ] **Step 2 (green):** Implement `contrastRatio(hexA: string, hexB: string):
  number` per the formula above. No DOM dependency; pure function.

**Round-1 plan-review note (risk, accepted with mitigation):** this test's hex
literals (`'#3b82f6'`, `'#0a0a0c'`, `'#141417'`) are re-typed independently of the
`:root` tokens Task F.2 writes into `app/globals.css` - nothing derives one from the
other, so an edit to `globals.css` alone would not be caught by this test, weakening
the spec's "catches future silent regression" claim. Mitigation: Task F.1's test file
carries a comment stating these three literals MUST be kept identical to
`app/globals.css`'s `--accent`/`--bg`/`--surface` values, and Task F.2's step 2
re-states the same cross-reference in `globals.css` - so a human editing either file
sees the other's existence, even though the check itself is not automatically
derived (accepted as a real but small residual risk, not silently ignored).
- [ ] **Step 3:** `npm test` - confirm green, confirm count is 39 + 3 = 42.
- [ ] **Step 4: commit** `feat(styling): WCAG contrast calculator + real color-pair gate`

**Ledger:** Pure function, no mutable state.

### Task F.2 - `app/globals.css` tokens, `app/layout.tsx` wiring, `SiteNav`

**Files:** Create `app/globals.css`, `app/components/SiteNav.tsx`,
`app/components/SiteNav.test.ts`. Modify `app/layout.tsx`.

**Sentence-check:** Next.js App Router supports a global stylesheet imported once
from the root layout (`app/globals.css` imported in `app/layout.tsx`) - this is
Next's documented convention, not invented here. `usePathname()` from
`next/navigation` is a real, current Next.js 14 client hook; it requires the
importing component to have `'use client'` as its first line - verified against
Next's real, current Client Component contract.

- [ ] **Step 1 (red):** `app/components/SiteNav.test.ts` (source-text assertion,
  matching `app/page.test.ts`'s existing convention - `fs.readFileSync` the raw
  `.tsx` source, no rendering) asserts the source contains the literal substrings
  `'use client'`, `href="/"`, `href="/experience"`, `href="/projects"`, and
  `usePathname`. Run `npm test` - RED: `SiteNav.tsx` doesn't exist.
- [ ] **Step 2 (green):**
  - `app/globals.css`: the `:root` token block from spec §2, plus a minimal reset
    (`box-sizing: border-box`, `margin: 0` on `body`, `background: var(--bg)`,
    `color: var(--text-primary)`, `font-family: var(--font-sans)` on `body`).
  - `app/components/SiteNav.tsx`: `'use client'` component rendering `<nav>` with
    three `<a>` links (`/`, `/experience`, `/projects`), each always present in
    server-rendered HTML; active link gets a CSS-module class
    (`styles.active`, `color: var(--accent)`) applied when `usePathname() ===
    href` (exact match for `/`, since `/` is not a prefix-match case here - all
    three routes are top-level and mutually exclusive, so exact match is correct
    and simpler than a prefix check).
  - `app/layout.tsx`: import `./globals.css`; render `<SiteNav />` before
    `{children}` inside `<body>`.
- [ ] **Step 3:** `npm test` - confirm green, confirm count is 42 + 1 = 43 (existing
  39 + Task F.1's 3 + this task's 1 `SiteNav.test.ts`). Confirm `app/page.test.ts`,
  `app/experience` (no test file exists for it today - verified: only `page.test.ts`
  and `app/projects/page.test.ts` exist as content tests) and
  `app/projects/page.test.ts` all still pass unmodified (layout wraps content, does
  not alter it).
- [ ] **Step 4:** Real build (`$env:GITHUB_TOKEN = gh auth token; npm run build`) -
  confirm clean, confirm `/projects` still prints with `○` (static), confirm
  `scripts/check-no-secret-leak.mjs` still passes as part of the chained build script.
- [ ] **Step 5: commit** `feat(styling): design tokens, global stylesheet, site navigation`

**Ledger:** No mutable runtime state - `usePathname()` reads the current route at
render/hydration time only, nothing persisted.

## Car G - page-level styling (Tasks G.1-G.3)

### Task G.1 - `app/page.tsx` (home) styling

**Files:** Create `app/page.module.css`. Modify `app/page.tsx` (markup/className
additions only - the existing test in `app/page.test.ts` asserts on content
presence via source-text/rendered-output checks, not absence of classNames, so no
test file changes are needed here **unless** a review finds otherwise - stated as a
checkable claim, not an assumption, since Task G.1's step 1 re-reads
`app/page.test.ts` before touching `page.tsx` to confirm this).

- [ ] **Step 1:** Re-read `app/page.test.ts` in full; confirm no assertion depends on
  the exact DOM structure being replaced (only content/text assertions) - if false,
  STOP and escalate (this plan does not authorize changing what a passing test
  asserts).
- [ ] **Step 2:** Add `app/page.module.css` (card-style container, `max-width` per
  spec §2, `var(--font-mono)` applied to nothing here - `resume.skills` renders as
  full descriptive phrases (e.g. `"DevOps Engineering & Leadership"`), not short
  verifiable tags/facts like a date or a repo slug, so the mono-for-verifiable-data
  rule does not apply to it (round-1 plan-review note: stated explicitly as a
  reasoned exclusion, not a silent omission) - and `var(--accent)` on the contact
  links). Add corresponding `className={styles.x}` attributes to `app/page.tsx`'s
  existing JSX - no new elements, no content changes, no removed elements.
- [ ] **Step 3:** `npm test` - confirm still green at the same count as end of Car F
  (no new tests added this task, since content is unchanged - only presentation).
- [ ] **Step 4: commit** `feat(styling): style home page`

**Ledger:** No state change.

### Task G.2 - `app/experience/page.tsx` styling

**Files:** Create `app/experience/page.module.css`. Modify
`app/experience/page.tsx` (markup/className only).

- [ ] **Step 1:** Confirm no test file exists for this page today (verified: none
  does) - so there is no existing assertion to protect, but this plan still commits
  to Car-F/Global constraint's "39 tests still pass" bar being about the *other*
  tests, not an excuse to skip checking this page still renders its real content -
  re-read `resume.ts`'s consumers to confirm `job.start`/`job.end` and bullets are
  unchanged in the new markup by inspection before commit.
- [ ] **Step 2:** Add `app/experience/page.module.css` (card-per-job layout per
  spec §2; `var(--font-mono)` applied specifically to the `job.start - job.end`
  date line and the `ed.year` value - the two genuinely date/fact-shaped strings
  on this page, per spec §2's mono-for-verifiable-data rule). Add
  `className={styles.x}` to `app/experience/page.tsx`'s existing JSX only.
- [ ] **Step 3:** `npm test` - confirm still green, same count.
- [ ] **Step 4:** Real build spot-check: `npm run build` clean (full live-API build
  deferred to Task G.3's final build, to avoid running it twice in one car train -
  stated explicitly as a sequencing choice, not a skipped verification).
- [ ] **Step 5: commit** `feat(styling): style experience page`

**Ledger:** No state change.

### Task G.3 - `app/projects/page.tsx` styling + final full-suite/build verification

**Files:** Create `app/projects/page.module.css`. Modify
`app/projects/page.tsx` (markup/className only - `export const dynamic =
'force-static'` line untouched).

- [ ] **Step 1:** Re-read `app/projects/page.test.ts` in full; confirm no assertion
  depends on DOM structure being replaced (content/text only) - STOP if false.
- [ ] **Step 2:** Add `app/projects/page.module.css` (card-per-repo/project layout
  per spec §2, border divider between "Public" and "Selected private work"
  sections; `var(--font-mono)` applied to each private project's `date` field -
  the one verifiable/fact-shaped string on this page, matching the mono-for-data
  rule; public repo `full_name` also gets `var(--font-mono)`, since it's a real,
  schema-validated fact (a repo slug), not prose). Add `className={styles.x}` only.
- [ ] **Step 3:** `npm test` - confirm still green, same count as Car F's end (43).
- [ ] **Step 4 (full verification, real build against live GitHub API):**
  `$env:GITHUB_TOKEN = gh auth token; npm run build` - confirm clean; grep the
  build output for the `/projects` line and confirm the static `○` marker (not
  `λ`); confirm `scripts/check-no-secret-leak.mjs`'s chained step still passes;
  grep `.next/server/app/projects*` output for `lastVerifiedSha`/the private repo
  slug/SHA and confirm zero leakage, same check the original Car D review
  performed - re-run here since this task changes that route's rendered markup.
- [ ] **Step 5: commit** `feat(styling): style projects page, final build verification`

**Ledger:** No state change - `force-static` and the SHA-gate throw path are both
unchanged code paths, only their rendered markup differs.

## Spec-coverage table

| Spec requirement | Task |
| ------------------ | ------ |
| Design tokens (`globals.css`) | F.2 |
| Contrast gate (both real color pairs) | F.1 |
| Navigation + its test contract | F.2 |
| Home page styling | G.1 |
| Experience page styling (mono-for-dates) | G.2 |
| Projects page styling (mono-for-facts, force-static preserved, no leak) | G.3 |
| Existing 39 tests preserved throughout | Global constraints, every task's step 3 |

5 tasks (F.1-F.2, G.1-G.3). No mutable runtime state anywhere in this plan.

## §11 Review log

**Round 1 (plan review):** REQUEST CHANGES - 2 Minor findings:
1. Task G.1 asserted "no dates/tags exist on this page" without addressing
   `resume.skills` against the design direction's "tech-stack tags" mono callout.
   **Fixed:** Step 2 now states explicitly why skills are excluded (prose phrases,
   not short verifiable tags).
2. `lib/contrast.test.ts`'s hardcoded hex literals aren't derived from
   `app/globals.css`'s tokens, so an edit to one wouldn't be caught by the other,
   weakening the spec's "catches silent regression" claim. **Fixed:** Task F.1 now
   states this as an accepted, mitigated risk (cross-referencing comments in both
   files) rather than leaving it unaddressed.

Independently verified: baseline 39/39 test count, no existing `app/experience` test
file, source-text-assertion convention, RED-step legitimacy for F.1/F.2, spec-coverage
completeness, mono-target field names against real source, and running test-count
arithmetic (39→42→43) all confirmed correct on round 1.

**Round 2 (plan review, final confirmation pass):** APPROVE - both round-1 fixes
independently confirmed adequate (skills-exclusion reasoning checked against real
`data/resume.json`; hex-literal drift risk confirmed honestly documented, not
cosmetically reworded). No new contradictions. Plan status promoted to Done.
