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

3. **The resume and my actual GitHub repos are the only two sources of truth for what the
   site claims about me and my work.** The site is a *rendering* of them, never a third,
   independently-drifting copy. If the site claims something neither source supports,
   that's a defect. **One exception: the blog (`/blog`).** Each post is my own dated,
   first-person writing: a record of what I was doing and thinking on that date, not a
   standing claim about my skills or work. Posts still obey Law 1 (no credential the
   resume or repos can't back, and a plan is written as a plan, never as shipped work),
   Law 2 (a link is real or it isn't made) and Law 6 (accurate on the day it was written).
   A post going out of date later is not a defect, so it is never rewritten to match
   later events; if it was wrong on the day it was written, it gets a dated correction
   note.

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
| 2026-11-23 | 3 | Scoped the law to what the site claims about me and my work, and added the blog exception (dated first-person posts, still bound by Laws 1, 2 and 6; going out of date later is not a defect; a post wrong when written gets a dated correction note, never a rewrite) | A dev blog of progress updates and musings is a third kind of content that neither the resume nor the repos can be the source of. Without the exception, every post would be a Law 3 defect; without the limits, the blog would become the drifting third copy the law exists to stop. |
