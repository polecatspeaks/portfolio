Status: Done

# Portfolio site: visual styling (spec)

Cargo: `docs/design-direction.md` (Status: Current - owner-approved directly in
conversation; right-sized per `AGENTS.md`, not run through a separate design-doc
review round, since it is a styling change to an already-shipped site, not new
architecture). Laws served: Law 4 (never break production - a styling change to a
static build is exactly the class of change that must not silently break the build or
strip real content), Law 6 (accuracy over polish - monospace/sans-serif distinction
below exists specifically to keep verified facts visually distinct from prose, not for
decoration).

Owner decisions locked in the design direction doc: dark theme only (no toggle, no
light mode, no system-preference switching); near-black background (`#0a0a0c`);
electric-blue accent (`#3b82f6`) used sparingly (links/active-state/tags only, never
decorative fills); Inter/Geist Sans for body/headings, JetBrains Mono/Geist Mono
reserved for verifiable data only (dates, tech tags, repo/SHA-adjacent text); card-based
list layout with border dividers, not shadows; Lucide icons if/when icons are needed
(none are needed for this train - no icon usage is planned in scope below, this is
recorded so a later change knows the intended library rather than picking one ad hoc).

## 1. The problem

The site (`app/layout.tsx`, `app/page.tsx`, `app/experience/page.tsx`,
`app/projects/page.tsx`) currently renders zero CSS - plain unstyled HTML. The
original architecture design's §7 deferred "design system/theming, i18n, CMS" as
out-of-scope; it did not address a plain CSS layer one way or the other, so this
spec is not completing a previously-deferred item, it is proposing new,
owner-approved scope. The owner has now approved a concrete visual direction and
wants it implemented, without regressing any existing behavior: real data still
renders, the build-time integrity gates (`assertGithubTokenConfigured`, the SHA-gate,
the secret-leak grep) still run and still fail closed exactly as before, and
`force-static` prerendering is preserved.

**New, owner-confirmed scope beyond pure CSS:** real site navigation. There is
currently no way for a visitor to reach `/experience` or `/projects` without typing
the URL directly. This was not part of the original `docs/design-direction.md`
(flagged by spec review round 1) - the owner was asked explicitly and confirmed
navigation should be added in this same train, so it is now in-scope, tested, and
reviewed like any other requirement below (not smuggled in as if pre-decided).

## 2. Architecture

**No new dependency.** Plain CSS via Next.js's built-in global stylesheet support
(`app/globals.css`, imported once from `app/layout.tsx`) plus CSS Modules
(`*.module.css`) for component-scoped styling where needed. No Tailwind, no
CSS-in-JS library - matches the existing "no CMS, minimal moving parts" precedent
already established for this codebase (original plan, Car A note on schema
validation), and keeps the dependency-review dimension trivially satisfied (zero new
`package.json` entries).

**Design tokens** (`app/globals.css`, `:root` custom properties - the single source of
truth every component reads from, never a hand-repeated hex value):

```css
:root {
  --bg: #0a0a0c;
  --surface: #141417;
  --border: #26262b;
  --text-primary: #ededf0;
  --text-secondary: #8b8b93;
  --accent: #3b82f6;
  --accent-hover: #60a5fa;
  --font-sans: 'Inter', 'Geist Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Geist Mono', ui-monospace, monospace;
}
```

Fonts are loaded via the system/web-safe fallback stack above with no external font
request in this train (no `next/font` Google Fonts fetch) - **stated as an explicit
scope boundary**, not an oversight: adding a font fetch is a separate, reviewable
decision (it changes the build's network surface, which Law 4/the secret-leak grep's
spirit cares about), and the fallback stack already renders legibly. Revisit only if
the owner explicitly asks for the exact named webfonts.

**Contrast requirement (testable, not just asserted):** `--accent` (`#3b82f6`) MUST
meet WCAG AA against every background it actually renders on. A pure function
(`lib/contrast.ts`, no DOM/browser dependency) computes the relative-luminance-based
contrast ratio between two hex colors per the WCAG 2.1 formula; a unit test
(`lib/contrast.test.ts`) asserts **both** real pairs used in this design meet `>=
4.5` (the AA threshold for normal-weight body-sized text, the stricter of the two
thresholds since accent renders inline in body copy, not exclusively large/bold UI
chrome):
- `--accent` (`#3b82f6`) on `--bg` (`#0a0a0c`) - used for links/active-nav-state
  outside cards.
- `--accent` (`#3b82f6`) on `--surface` (`#141417`) - used for tags/links rendered
  inside project/experience cards.

**If either computed ratio is below 4.5, the test fails and the accent hex (or the
specific background it's failing against) must be adjusted until both pass** - this is
the mechanism that makes the design doc's stated contrast requirement enforced, not
aspirational, and that catches a future edit to either `--accent`, `--bg`, or
`--surface` silently regressing either pairing (round-1 spec-review fix: the initial
draft tested only the `--bg` pairing, leaving the `--surface` pairing - which cards
actually use - unverified).

**Page structure changes (markup only, plus the newly-confirmed nav; no data/content
changes to existing pages):**

- `app/layout.tsx` - imports `app/globals.css`; renders a shared `<nav>` (a small
  Client Component, `app/components/SiteNav.tsx`, `'use client'` - required because
  active-route highlighting reads `usePathname()` from `next/navigation`, which is
  client-only; this does NOT affect `force-static` on `/projects`, since that
  directive controls the page's own data-fetching/render mode, not whether an
  unrelated child Client Component hydrates on the client - verified against Next.js's
  documented Client Component behavior) with links to `/`, `/experience`, `/projects`.
  The active link gets `var(--accent)` text color via a CSS Module class conditionally
  applied when `usePathname()` matches the link's `href`; all three links are always
  present in the server-rendered HTML regardless of route (only the active-state class
  differs at hydration), so the nav is real and crawlable without JS, not a
  client-only rendered list.
  **Test contract (round-2 spec-review fix - matches this repo's existing
  convention rather than inventing a new one):** `app/components/SiteNav.test.ts`
  reads `app/components/SiteNav.tsx`'s source via `fs.readFileSync` (the same
  static-source-assertion pattern already used by `app/page.test.ts` and
  `app/projects/page.test.ts` - no component-rendering library, no DOM test
  environment, no `next/navigation` mock; `jest.config.js`'s `testEnvironment:
  'node'` and the zero-new-`package.json`-entries constraint both stay true) and
  asserts the source text contains `href="/"`, `href="/experience"`, and
  `href="/projects"` as literal substrings. This is a real, currently-runnable
  contract under the existing Jest config - not one that requires new
  devDependencies, closing the round-2 finding that the initial fix named an
  unimplementable rendering-based test.
- `app/page.tsx`, `app/experience/page.tsx`, `app/projects/page.tsx` - existing content
  and data-fetching logic untouched; wrapped in styled containers/cards using CSS
  Modules; dates and repo/tag-like tokens get `var(--font-mono)` via a shared
  `.mono` class or CSS-module class - never inline `style=` attributes (matches the
  design direction's "no inline styles" standard).

**Non-goals (unchanged from the design direction doc and original architecture
design):** no theming system, no dark/light toggle, no i18n, no CMS, no icon library
wired up in this train (Lucide is named as the intended future choice only).

## 3. Contracts

- Every existing test in the current 39-test suite must still pass unmodified - a
  styling change must not require rewriting a content assertion (if a test starts
  failing because a CSS Module class changed some queried text, that is this spec
  being violated, not a test needing to "catch up").
- `npm run build` must remain clean and `/projects` must remain statically rendered
  (`○`, not `λ`) after the change - re-verified the same way the original plan verified
  it (a real build against the live GitHub API), since CSS Modules / global CSS
  imports are a new build input that could in principle affect the static/dynamic
  determination (it does not, per Next.js's documented behavior, but "documented" is
  not "verified" - this train verifies it for real, same discipline as the original
  plan).
- `scripts/check-no-secret-leak.mjs` must still run and still pass against the styled
  build output (no new build step bypasses it).
- The contrast unit test (`lib/contrast.test.ts`) is a hard gate: `npm test` fails if
  it fails, so a future edit to the accent color cannot regress accessibility silently.

## 4. Owner decisions requiring no further design input

Dark-only theme, exact hex values, exact font stack, card-vs-shadow layout choice,
mono-for-verifiable-data-only convention - all already fixed in
`docs/design-direction.md` and restated in §2 above; nothing here is left open for the
plan to invent.

## Spec-coverage table

| Design direction requirement | Spec section |
| ----------------------------- | -------------- |
| Color palette / tokens | §2 (globals.css tokens) |
| Typography (sans + mono split) | §2 (font tokens, mono-for-verifiable-data rule) |
| Layout (cards, borders, max-width) | §2 (page structure changes) |
| Contrast/accessibility | §2 (contrast requirement, both real color pairs), §3 (contract) |
| No theming/i18n/CMS | §2 (non-goals) |
| Existing behavior preserved (Law 4) | §3 (all three contracts) |
| Site navigation (owner-confirmed addition, not in original design direction) | §1, §2 (SiteNav + test contract) |

## §10 Review log

**Round 1 (spec review):** REQUEST CHANGES - 2 Major, 3 Minor findings:
1. Major: navigation was scope creep, presented as pre-decided when it wasn't in the
   design-direction cargo. **Fixed:** owner asked directly, confirmed navigation is
   in-scope; §1 now states this honestly as new, owner-confirmed scope rather than a
   deferred item being completed.
2. Major: the contrast hard gate only covered `--accent`/`--bg`, not the
   `--accent`/`--surface` pairing cards actually use. **Fixed:** §2's contrast
   requirement now tests both real pairs.
3. Minor: §1 mis-cited the original design's §7 as having deferred CSS generally (it
   only deferred theming/i18n/CMS). **Fixed:** §1 corrected.
4. Minor: no test contract existed for the new nav. **Fixed round 1, corrected round
   2:** the initial fix (`SiteNav.test.tsx` rendering the component with
   `usePathname()`) was not actually runnable under this repo's `testEnvironment:
   'node'` Jest config with no DOM/RTL/router-mock deps installed - round-2 review
   caught this as a new Major finding. Replaced with `SiteNav.test.ts`, a
   source-text assertion matching the existing convention (`page.test.ts` /
   `projects/page.test.ts`), which is actually runnable today with zero new
   dependencies.
5. Minor: active-nav-state mechanism (client vs. server, hydration/force-static
   interaction) was unspecified. **Fixed:** §2 now names the exact mechanism
   (`usePathname()` in a small Client Component) and states why it doesn't affect
   `force-static` on `/projects` - confirmed technically correct against real Next.js
   App Router semantics on round-2 review.

**Round 2 (spec review):** REQUEST CHANGES - 1 new Major finding (the round-1 fix for
finding #4 named an unimplementable test given this repo's actual Jest config/deps);
independently verified both contrast pairs' computed ratios (5.378:1, 4.999:1, both
pass) and the force-static/Client-Component reasoning as correct. **Fixed:** see
finding 4 above.

**Round 3 (spec review, final confirmation pass):** APPROVE - independently confirmed
the SiteNav test contract matches the real existing convention in `page.test.ts` /
`projects/page.test.ts`, confirmed zero new dependencies, confirmed no remaining
contradictions across the whole doc, confirmed Law 4/Law 6 compliance holds
throughout. Spec status promoted to Done.

