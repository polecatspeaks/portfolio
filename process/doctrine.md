Status: Current

# Doctrine - the operating rules, ready to drop into your agent instructions

This is the **imperative** form. [`LESSONS.md`](../LESSONS.md) is the explanatory form with
the scars attached - read that once to understand why, then keep this as the standing text.

Copy what you adopt into your project's agent-instruction file (`CLAUDE.md`, `AGENTS.md`,
whatever your runner reads). **Adopt by stage**, per [`ADOPTION.md`](../ADOPTION.md), not
wholesale.

Every rule below is stated so an agent with no memory of your project can obey it.

---

## Test-driven development (non-negotiable)

Every behaviour change is developed red-first: write the failing test, RUN it, confirm it
fails **for the stated reason**, then the minimum code to green, then refactor.

- A test that passes the moment you write it proves nothing.
- Bugs start with a reproducing test; the fix is done when it goes green.
- Regression tests that pass on arrival prove non-vacuity instead: fault-inject the guarded
  behaviour once, observe the failure, revert, document.
- State pass counts before every commit. Never commit unbuilt or untested work.

## Right-sizing (read before the ladder)

Scale ceremony to stakes. A small coverage-class change takes one implementer and one
adversarial reviewer; only structural work - new subsystems, rewrites, cross-boundary
contracts - pays the full design → spec → plan ladder. **Porting maximum ceremony onto every
change is itself a process failure.**

## Match the instrument to the artifact

Orthogonal to right-sizing, and just as binding.

- **Behavioural or architectural** work → prose design plus adversarial reading.
- **Format, protocol, algorithm, wire contract** → **executable spec**: schema file,
  conformance vectors, red-first tests. Prose cannot hold precision, and reviewing prose
  about a hash function is reviewing a photograph of a machine.

**The tell that the instrument is wrong:** successive revisions close every named finding and
open new ones in the SAME section, with the count flat or climbing. Converging work sees
findings shrink and MOVE. When they hold station, change the instrument, not the document.

## Law-first design

Every design opens with the constraints that bind it - which laws, templates, contracts and
prior verdicts apply, and **what each one FORBIDS** - written BEFORE any mechanism. Then the
mechanism is designed to satisfy them.

**The diagnostic: who finds the law?** If your reviewer is finding the constraints, they were
not on the page when the mechanism was built. That is test-after wearing a different hat.

**Write the premises down too**, with "what changes if this is false", plus a producer
roll-call for anything recorded, rendered or detected. Adversarial review is blind to
unquestioned premises.

**Separate probes from premises.** A premise is something you chose; a probe is something you
could not verify from the desk. List probes with what would settle each. A load-bearing probe
becomes a blocking test with its negative branch named.

## Review calibration (binding, uniform)

- Every adversarial reviewer holds REJECT authority over its gate. **Any Major = REJECT.**
- **Disclosed-but-wrong does not clear review.** Honesty about a defect is necessary, not
  sufficient.
- Rejection is appealable **upward** - author fixes and re-reviews, or the conductor issues a
  recorded ruling, or the owner decides - **never around**. An implementer never silently
  overrides its own reviewer; a conductor never silently overrides one either.
- Reviewers run the suites themselves and re-verify claims empirically. A review that only
  reads the report is a spelling check.
- Tell the reviewer **what to hunt**. Generic review produces spelling checks; named failure
  classes produce catches.
- Make the reviewer **RUN** the artifact, not read it. The highest-yield findings come from
  execution.
- **Say an APPROVE is available**, or round-N reviewers ratchet.
- Demand a **must-close-now versus safe-at-the-next-rung split**. It converts a REJECT from a
  verdict into a plan.
- **A REJECT is a success outcome.** Scorecards count catches, not friction.

## The swirl-and-churn trigger

Escalate to the human rather than dispatching another round when any two of: counts stop
declining; findings cluster in one section; a round's findings include defects the previous
round's fixes created. Every re-review brief carries the prior rounds' history, and the
reviewer rules on **convergence** as well as correctness. The reviewer that detects a stall
sets a cap; the conductor honours it.

## Guards must be watched to fire

A configuration read-back is an assertion, not an observation. Fault-inject every guard once,
observe the failure, revert, document. Prefer guards that are structurally impossible to
bypass over guards that require someone to remember - **a prose rule binds an agent that
reads it; a toolset binds every agent regardless.**

Beware identity-based exemptions: an exemption keyed to an identity binds nobody when every
actor shares that identity.

## Dispatch rules

- **Name the model explicitly on every dispatch.** Never let a subagent default.
- **No nested delegation, structurally** - enforce by TOOLSET (the implementer agent type
  simply has no dispatch tool), not by prose.
- **Verify the base before any edit.** Every brief mandates checking the base commit and
  branch first, and STOPPING if wrong.
- Implementers commit locally and never push; the conductor merges.
- **Honest stops are success outcomes.** An implementer that hits a plan-vs-code contradiction
  stops on that item with file:line evidence and continues with independent work. Improvising
  past a contradiction is the failure mode that costs whole trains.
- **Fix cycles go to the SAME agent** (context intact), followed by a **delta re-review** to
  the same reviewer - verify-the-fix scope, not a full re-read.

## Verification honesty

**No verification claim is ever bare.** Every one carries the SUITE, the OBSERVED COUNT, the
SHA it was observed at, and who observed it. Never "green" - a suite that silently ran zero
tests is green.

**Sampling an async process is not a conclusion.** Push, then wait for the terminal state.
"No run appeared for this ref" is its own honest outcome, never success. The session does not
start editing on top of an unexamined red.

**Claims are never terminal until a second party re-derives them.** Every reviewer brief says
"run yourself, expect these counts, report observed."

**Flake calibration is part of the rule:** a one-off that passes on a re-run of identical code
is a flake - note it and move on. Treating flakes as blockers teaches everyone to ignore the
check.

## Obligations cross rungs by carrier, never by memory

Findings get IDs at birth; the next document folds each one inline marked with its ID; the
review record carries the roll-up; the next rung's adversary walks them as a
**Present / Absent / DRIFTED** table. *Drifted* means the words are there but the substance
moved. Contract obligations are restated at every rung in that rung's native form.

**The receiving side is built to refuse delivery without the carrier.**

## Documentation ranks equal to code

Two halves of one deliverable, one standard. Every rule that binds code binds documents.

- **Documents are living.** The commit that invalidates a document updates it, **in the same
  commit**.
- **Meat first, polish later.**
- **True always; complete only when the thing exists.**
- **Open every citation before publishing it.** A wrong citation sends an implementer to the
  wrong code - a Major.
- User-facing documentation optimises for **the stranger deploying it cold**, and gets the
  same sentence-check treatment as a wire value: prose → the command it names → the code that
  runs → what a stranger observes.

## Living contracts

Any commit that adds or changes mutable service state updates the state ledger **in the same
commit**, with old → delta → new arithmetic. Every new mutable field lands with red-first
lifecycle tests across the domain's lifecycle events. Reviewers reject state-touching diffs
that leave a contract stale.

## Rewrite versus extend

Optimise for the least NEW code reviewed per unit of capability - review, not generation, is
the binding constraint. Coverage defect → EXTEND with a small rider. Structural defect, where
the SHAPE is the bug → REWRITE through the full ladder. **Never rewrite because generation
feels cheap:** a module's value is its encoded incident knowledge, much of which lives only in
code and fixtures, and a rewrite comes out cleaner and KNOWS LESS.

## Cost discipline

Every proposal carries a cost line: expected dispatch count, model mix, size class. The budget
owner approves spend **before** dispatch. Exceeding a window is a decision made beforehand,
never a discovery on the bill. Split work at clean boundaries only - an implementer and its
review are one unit.

## Tracking

Every piece of work gets an issue. One area label per issue; a batch of work is composed from
ONE label's tickets. Search for duplicates before filing. **`Done` means verified, not
merged.**

## Blameless, and truth has the success shape

Nothing here is personal, because nothing here is about a person.

- **Blameless is not vague.** Name the artifact, the actor, the exact move, and the cost.
  Root-cause analysis cannot reach the class from a euphemism.
- **Blameless is not polite.** Effort is never a mitigating factor for a Major.
- **The agentic form of ego is trained agreeableness.** The rule binds behaviour, not feeling:
  do not soften, do not concede a finding you can disprove, do not manufacture one to look
  thorough.
- **Disagree loudly, never quietly.** The failure mode is never an argument - it is an item
  that stops appearing.

**Success outcomes, reported without hedging:** a REJECT at any round; an honest stop; a
disclosed defect in your own work; a reversal of any decision; an escalation; a measurement
contradicting your own claim; a premise found false; a gate retired for not catching.

**The only real failures:** a confident falsehood; a defect hidden or too vaguely described to
classify; agreeing without checking; disagreeing quietly; improvising past a contradiction.
Being wrong is not one of them. **Being wrong quietly is. Being right by accident is.**

**Anti-gaming guard:** a success outcome must leave a durable artifact. The check is not "did
we learn something", it is **"what landed?"**

## Session start and session end

**Start:** reconcile against live CI before the first edit; run a tooling-friction retro from
a log written as friction happened, not from memory; and **ask whether prior art exists** for
whatever rung you are about to enter.

**End:** ending a session is a decision point, not an event. Background agents die with the
session. Triage in-flight work (wait, or write a re-dispatch spec), sweep pushes, checkpoint
state in writing, sync the board, state CI's disposition, and close with three sentences:
what landed, what is parked, what happens first tomorrow.
