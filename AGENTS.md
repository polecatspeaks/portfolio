Status: Current

# Agent instructions - personal portfolio site

This project is a **solo, static personal portfolio site**, deployed to Vercel. It is
bootstrapped from `process/` and `templates/` in this repo (see `README.md` and
`ADOPTION.md`), but adoption is **staged by trigger** - do not apply the full ladder
ceremony to a project this size. Right-sizing is itself a rule, not a shortcut.

## Laws (binding)

Every law in `process/constitution.md` binds every change. Read it before writing
anything that touches site content, links, or deploys. In short: never state an
unverifiable credential (Law 1); every project link is either a real public repo or a
screenshot summary for private work (Law 2); the resume and my GitHub repos are the only
two sources of truth for content (Law 3); never break the live Vercel production build
(Law 4); no visitor data collection without an explicit amendment (Law 5); accuracy over
polish (Law 6).

## Currently active (Stage 0-1 of ADOPTION.md)

- **Right-sizing.** This is one person, one small static site. A content update, a copy
  fix, or a styling change does not need a design doc, a spec, a plan, or a reviewer car.
  Just make the change, verify it against the constitution, and commit.
- **Reserve the design → spec → plan ladder** (`process/the-ladder.md`) for genuinely
  structural work only - e.g., picking the framework/hosting architecture, or a rewrite
  of how content is sourced. If you're not sure it qualifies, it probably doesn't.
- **Documentation ranks equal to code.** If a change invalidates something written here,
  in the README, or in the constitution, fix it in the same commit - don't leave a
  stale doc behind.
- **Test what can break silently.** Any link, any build step, any data transform (e.g.
  pulling project data from GitHub) gets verified by actually running it - not read for
  plausibility. A link that "looks right" is not a checked link.
- **Verification honesty.** Don't claim "it works" or "it's live" without having
  actually loaded the deployed URL or run the build. State what you observed, not what
  you expect.
- **Session start:** before editing, check whether the live Vercel deployment is
  currently healthy (Law 4) - don't build on top of an unnoticed broken prod.
- **Session end:** say plainly what changed, what (if anything) is left half-done, and
  whether prod is known-good.
- **Live deploy mechanism (revised - manual promotion gate, reversing the earlier
  Task E.2 decision):** Vercel's Production Branch is no longer set to auto-promote
  every `main` push straight to Production. Every push/merge to `main` now builds a
  **Preview** deployment only, with its own preview URL - that preview URL is the
  place to actually load and check a change before it goes live. Going live requires
  an explicit, manual **"Promote to Production"** action in the Vercel dashboard.
  This restores the real red/green-style safety gate the original plan's
  Preview-then-promote design was after (the earlier "just let `main` deploy straight
  to prod, drop the extra step" simplification - recorded in the prior version of
  this section - is now itself superseded; kept simple is not the same as kept safest,
  and the owner decided the manual gate is worth the one extra click). `GITHUB_TOKEN`
  (a fine-grained PAT scoped to read-only Contents access on the private `STAR` repo)
  is set in Vercel Project Settings -> Environment Variables and required at build
  time - its absence fails the build closed (see `lib/env.ts`), which is by design,
  not a bug.
- **Live URL:** `https://star-stack.io/` (custom domain attached to the Vercel
  project, excluded from Vercel's Deployment Protection login wall - unlike the
  default `*.vercel.app` alias URLs, which now require a Vercel account login to
  view directly). Real content was verified live here as of the pre-manual-promotion
  workflow; re-verify after each future promotion, per the verification-honesty rule
  above - don't assume a promoted deploy matches what was checked on its preview URL
  without loading the actual live domain again.
- **Visual design direction:** `docs/design-direction.md` records the agreed dark,
  minimal, dev-tool-styled direction (colors, type, layout) for implementing CSS. It's
  a right-sized reference doc, not a ladder design doc - styling changes don't need
  the full ladder per the right-sizing rule above.

## Not yet adopted (wait for the trigger)

Per `ADOPTION.md`, do not install these until their trigger fires:

- Design/spec/plan templates, review briefs, car dispatch, whole-branch gates, verdict
  ledgers - triggers require multi-step structural work or multiple agents/cars, neither
  of which applies to a solo static site today.
- `scripts/Land-Verdict.ps1` / `Verify-Verdict.ps1` - these exist to durably land
  adversarial review verdicts from multi-agent dispatch sessions. Nothing to land until
  there's a reviewer dispatch.
- CI policy checks (`templates/repo-policy-check-patterns.md`, `DocPolicy.Tests.ps1`) -
  adopt at Stage 5, once there is a CI pipeline to check.
- `templates/worked-resume-packet.md` / friction-log retro - adopt at Stage 6, only if
  work starts spanning sessions in a way that has already caused lost context or a
  repeated mistake.

## Read once, adopt nothing yet

`LESSONS.md` - the scars behind every rule above. Worth rereading if a rule here starts
to feel like ceremony without a catch; that is the signal to prune it, per the
counter-organ in `ADOPTION.md`.
