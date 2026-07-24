Status: Current

# Constitution

The laws this project must never break. Ordered: earlier laws outrank later ones when
they conflict. See `constitution-guide.md` for how these were derived and how to amend
them — do not copy these into another project; derive that project's own.

Ratified by: @polecatspeaks (project owner).

---

1. **Never state a skill, experience, or credential that isn't backed by my resume or
   verifiable in my actual GitHub work.** No fabrication, no exaggeration, no
   "coming soon" claims presented as fact.

2. **Every project link must point to real, currently reachable work.** If the repo is
   public, link directly to it — a 404, a stale fork, or a link to the wrong repo is a
   defect, not a formatting nit. If the repo is private, do not link it; instead show a
   summary of the work with screenshots as proof, so the claim stays verifiable without
   exposing private code.

3. **The resume and my actual GitHub repos are the only two sources of truth.** The site
   is a *rendering* of them, never a third, independently-drifting copy. If the site
   claims something neither source supports, that's a defect.

4. **The live Vercel production deployment is what the public sees — never ship a change
   that breaks it.** A broken production site outranks any in-progress work; revert
   before you debug forward.

5. **No visitor data is collected, silently or otherwise.** The site is
   static/informational. Adding analytics, a contact form, or any tracking later
   requires amending this law explicitly — not quietly introducing it.

6. **Accuracy outranks polish.** An outdated fact is a defect; plain, correct prose is
   not.

---

## Amendments

When a law turns out to be wrong, amend it in the open, through the owner, with the
reasoning recorded here.

| Date | Law | Change | Reasoning |
|---|---|---|---|
| 2026-07-24 | 2 | Added the private-repo branch (summary + screenshots instead of a dead/inaccessible link) | Some project work lives in private repos; the original wording would have forced either exposing private code or leaving the claim unverifiable. |
