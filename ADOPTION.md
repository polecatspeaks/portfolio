# Adoption - the staged path

Status: Current

**Do not install all of this.** An immune system that only adds gates goes autoimmune:
ritual, token cost, friction without catches. This repo's own doctrine says *start with the
right-sized subset and let incidents install the rest* - and a bootstrap kit that ignores
its own doctrine is the first thing you should distrust.

So adoption is **staged by trigger**. Each stage lists what to take, what it costs, and the
event that earns the next one.

The rule underneath all of it: **install an artifact just before the rung that needs it, and
never for a rung you have not yet run.** Building an artifact for a rung you have never run
is inventing prior art you do not have.

---

## Stage 0 - day one, before any code

**Trigger: you have a repo.**

| Take | Why now |
|---|---|
| `process/the-ladder.md` | The gate sequence. Everything else references it. |
| `process/doctrine.md` | Blameless framing, success outcomes, law-first, honest stops. These shape how every agent behaves from the first dispatch. |
| `process/the-healing-loop.md` | How the process repairs itself. Read once; it explains why the rest exists. |
| `process/constitution-guide.md` | **How to write your own.** Do not copy someone else's laws - derive yours from what your project must never do. |
| `LESSONS.md` | Read it. Adopt nothing from it yet. |

**Cost:** an afternoon of reading and one constitution you write yourself.

**Do NOT take yet:** templates for rungs you have not reached, contract files with nothing
to record, CI checks with nothing to check.

**Why the constitution is written and not copied:** the laws are the one thing that must be
yours. They encode what *your* project must never do. Copied laws are ceremony; derived laws
bind. The guide shows the shape - ordered, few, each one a prohibition you can point at a
real defect with.

---

## Stage 1 - the first design

**Trigger: you are about to write a design document.**

| Take | Why |
|---|---|
| `templates/design-doc.md` | Sections 0-2 (instrument check, constraints, premises) go **before** any mechanism. That ordering is the whole artifact. |
| `templates/design-briefs.md` | How to dispatch a design reviewer, a delta re-review, and a design author. |

**The three sections that do the work, and what each catches:**

- **§0 instrument check** - is this behavioural, or is it a format/protocol/algorithm? If the
  latter, prose cannot hold it and the document should not be written. *In the founding
  session this would have ended four review rounds before they started.*
- **§1 constraints** - which laws bind this and **what does each forbid**, written before the
  mechanism. *Seven constraint violations were found by reviewers and none by the author, in
  one document series. If the reviewer is finding the laws, they were not on the page when
  the mechanism was built.*
- **§2 premises** - what is assumed that no constraint forced, plus a **producer roll-call**
  for anything recorded, rendered or detected. *One undeclared premise survived four
  adversarial rounds and was worth eight of twelve findings.*

**Cost:** ~30 extra minutes per design, and the first one will feel like paperwork. It is
not: measure the finding *class*, not the count.

---

## Stage 2 - the first spec

**Trigger: a design passed its gate.**

| Take | Why |
|---|---|
| `templates/worked-spec.md` | Section inventory, incl. the retirement list, the mandatory lifecycle table, and the probe list. |
| `templates/worked-rung-carriers.md` | How findings and contract obligations survive the design→spec handoff. |

**Do not skip the carriers.** The first spec written from a passed design in the originating
project dropped **five adopted design requirements and nine documentation obligations** at a
single handoff, because the spec template had no fidelity table and no contracts-touched
section. The carrier doc exists specifically to kill that.

---

## Stage 3 - the first plan

**Trigger: a spec passed its gate.**

| Take | Why |
|---|---|
| `templates/worked-plan.md` | Task shape, binding amendment block, spec-coverage table, and the five-dimension plan review. |

**The dimension that matters most:** the plan adversary opens the real file for **every code
snippet** and confirms every API exists with that signature at the dispatch tip. A plan
whose snippets call nonexistent APIs becomes a compile wall a car hits mid-train.

---

## Stage 4 - the first train (cars actually writing code)

**Trigger: you are about to dispatch an implementer.**

| Take | Why |
|---|---|
| `agents/car.md` | No-delegation implementer/reviewer. **Enforced by toolset, not by prose** - remove the dispatch tool rather than writing a rule against it. |
| `templates/worked-briefs.md` | Implementer, reviewer, and fix-cycle prompts. |
| `templates/worked-adversary-and-gate-briefs.md` | The other gates, including the whole-branch gate. |
| `templates/worked-tickets-and-board.md` | Board column semantics. `Done` means **verified**, not merged. |

**Take the contract templates only when they have something to record:**
`templates/worked-ledger-and-gating.md` when your first mutable service state or first gated
surface lands - not before. An empty ledger is ceremony; a ledger with one honest row is a
contract.

---

## Stage 5 - the first CI

**Trigger: you have something to run.**

| Take | Why |
|---|---|
| `templates/repo-policy-check-patterns.md` | The Status-line gate and config-truth reconciliation. Graduates documentation truth from attention to mechanism. |
| `templates/worked-verification-reconciliation.md` | Falsifiable claims, paired observers, and the session-start CI baseline. |
| `hooks/session-start-ci-baseline.sh` | Bounds absence-blindness: an unexamined red surfaces at the next session at the latest. |
| `templates/ops-script-patterns.md` | Suite runner and watch-CI shapes. Port the patterns, not the syntax. |

**One rule with no trigger, adopt it immediately at stage 5:** a guard is unproven until
someone has **watched it fire**. Fault-inject every gate once, observe the failure, revert,
document. In the founding session a branch protection read back as perfect and was
completely decorative; a verdict integrity check passed a header flipped from REJECT to
APPROVE; a demonstration compared a value to itself. All three were caught by injection and
none by reading.

---

## Stage 6 - when the session-shape starts to hurt

**Trigger: you have lost work overnight, or repeated a mistake you already fixed.**

| Take | Why |
|---|---|
| `templates/worked-resume-packet.md` | The re-dispatch spec and the running working-state memory. |
| `hooks/session-start-retro.sh` + `templates/friction-log.md` | The tooling retro, and a log to retro *from*. A retro without a log is a memory test. |

---

## What to install NEVER by default

These are earned by an incident or they are ritual:

- **A gate for a failure class you have not experienced.** Every gate in this repo was
  installed by something going wrong. Import the ones whose failure you can see coming; leave
  the rest until they bite.
- **Doc linting, style checks, commit-message enforcement.** None of them caught anything in
  the originating project. Cheap to add later, expensive as day-one friction.
- **A contract file with no rows.**
- **A second reviewer tier before the first one has ever rejected anything.**

## The counter-organ: a scorecard, on a cadence

Whatever you install, **count its catches**. A gate that has caught nothing in a month is a
pruning candidate, and retiring it should be as deliberate as installing it was. Write that
down before you need it, while nobody is attached to any of the gates yet.

The measure of whether a gate is working is not that it fires; it is whether the *class* of
finding changes over time. Findings that shrink and move mean convergence. Findings that
hold station in the same section, round after round, mean the instrument cannot resolve at
the defect's scale - stop revising and change the instrument.
