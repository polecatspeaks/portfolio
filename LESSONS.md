# Lessons, each with the scar that earned it

Status: Current

Every rule here was paid for. A rule without its scar is a Chesterton's fence awaiting
pruning, so the stories stay attached - and if you cannot imagine a scar happening to you,
that rule is a pruning candidate rather than a commandment.

Sources: a production multi-agent shop (tacit practice, transposed) and one founding session
that paid the tax in public. Where a lesson is untested outside its origin, it says so.

---

## 1. Rules travel; exemplars do not. Ship both.

A rule says what is forbidden. An exemplar shows what compliance looks like. Port only the
rules and the gap is invisible until work fails at whichever rung had no example to copy -
and then it looks like the worker's fault.

*Scar: a ladder named design as its first rung and gave it no artifact. Every rung that had
one ran clean; the design rung produced five REJECT rounds and twelve Majors on its first
outing. The failures were not randomly distributed - they landed exactly where the
scaffolding was missing, at the most upstream rung, so everything downstream inherited them.*

**Corollary - ASK BEFORE YOU BUILD.** Prior art usually exists somewhere and was simply not
ported. Asking costs one sentence.

*Scar: five review rounds and roughly half a million tokens were spent rediscovering
dispatch practice that was already written down elsewhere. Worse, the repo's own setup
document already said "port the ancestor's pattern" in two places - read in the first ten
minutes and parsed as "build later" rather than "prior art exists, ask for it."*

## 2. Match the instrument to the artifact

- **Behavioural or architectural** work - what should happen, who owns what, how failures
  surface. A reviewer can verify it by reading. Prose design is correct.
- **A format, protocol, algorithm or wire contract** - canonicalisation, identity, ordering,
  hashing, schema. **Prose cannot hold it.** Reviewing prose about a hash function is
  reviewing a photograph of a machine. Go straight to a schema file, conformance vectors and
  red-first tests.

**The tell that your instrument is wrong:** successive revisions close every named finding
and open new ones **in the same section**, with the count flat or climbing. Converging work
sees findings shrink *and move*. When they hold station, stop revising and change the
instrument - a gate that cannot resolve at the defect's scale will find different defects
forever, and each round will feel like progress.

*Scar: a distributed-identity protocol was specified in prose for four rounds. Majors ran
7 → 3 → 4 → 5. When a reviewer finally ordered a demonstration instead of more prose, the
author produced one whose sweep was an exact copy of its hook - so the printed proof was
`sha256(x) == sha256(x)`. A prose habit produces prose-shaped evidence even when explicitly
told to produce a test.*

## 3. Law-first, not law-check-after

Open every law, template and prior verdict that binds a design and write down **what each
FORBIDS** - before any mechanism exists. Then design to satisfy them.

This is the constitutional form of red-first. A test written after the code grades it; a test
written before it bounds it. Ending a design with a constitution check performed by the
*reviewer* is test-after wearing a different hat.

**The diagnostic: who finds the law?** In a law-first process the author hits the constraint
while writing and the reviewer finds nothing there.

*Scar: seven constraint violations across one document series - a hardcoded taxonomy a law
forbade by name, an unknown state the first law required, two copies of one schema, a
suppressed truth surface, a hold that could be set and never released. All seven were
findable by looking. All seven were found by the reviewer, none by the author.*

## 4. Write your premises down; adversarial review is blind to them

A reviewer rejects what is on the page. **It cannot reject the assumption that put it
there.** A premise nobody wrote down survives every round and will be the thing that was
actually wrong.

For each premise: **what would change if it were false?**

*Scar: one undeclared premise - "two different things write artifacts" - was invented in the
first revision to answer "what if a hook fails", survived four adversarial rounds unexamined,
and was worth roughly eight of twelve findings. It imported identity, canonicalisation,
dedup, clock ordering and dual storage. The requirement had been "detect missing artifacts",
and a detector does not need to be a writer. Removing it did not fix eight findings; it made
them stop existing. No gate caught it - a human pulling back did.*

**Add a producer roll-call.** For everything recorded, rendered or detected: what writes it,
what triggers the write, when it becomes durable, and what happens if two arrive. Premises
sections surface only *positive* premises - things you chose. The roll-call catches the
**absent** premise: the thing that must exist for the mechanism to work and that nobody
noticed was a choice.

## 5. Probes are not premises

- A **premise** is something you chose.
- A **probe** is something you could not check from the desk.

List probes explicitly with what would settle each. An unverifiable claim stated as fact in
the mechanism is a defect waiting for an implementer to hit. A load-bearing probe becomes a
**blocking test** with its negative branch named.

*Scar: a hook's behaviour under async dispatch spent five design revisions disguised as a
premise. It was always a probe. When it was finally tested it took ten minutes, confirmed the
mechanism, and simultaneously revealed that an unfiltered producer would write 74 artifacts
per session instead of 7.*

## 6. A guard is unproven until someone has WATCHED it fire

Fault-inject once, observe the failure, revert, document. A configuration read-back is an
assertion, not an observation.

*Scars, three, all from one session:*
- *Branch protection read back perfect - require-PR true, force-push blocked - and was
  completely decorative, because the exemption was keyed to an identity every actor shared.
  A deliberate probe push succeeded with exit 0.*
- *An integrity check on landed review verdicts passed a file whose header had been flipped
  from REJECT to APPROVE, because the hash covered the body and not the header - the text
  nobody skims was protected and the claim everyone reads was not.*
- *A "demonstration" of two producers computing the same identity compared a value to itself.*

**None of the three was found by reading. All three were found by injection.**

## 7. Verbatim by construction beats verbatim by discipline

Never hand-transcribe a dispatched agent's output into the record. Extract it mechanically
and hash it, so the claim is checkable rather than asserted.

*Scar: a conductor began hand-copying a review verdict **about its own work** into the repo -
a hand-maintained mirror at a process boundary, with the reviewed party doing the copying. A
softened phrase or a dropped finding would have been undetectable.*

**And normalisation is not curation.** Rewriting an operator's home directory to a portable
placeholder deletes nothing about the process and publishes nothing about the operator - it
is what a stranger needs. Three conditions keep the distinction honest: normalise **before**
hashing (afterwards is tampering), keep the rules mechanical and **declared in the artifact**,
and preserve the original somewhere. What would be curation - softening a finding, dropping a
Major - is untouched by any of it.

## 8. Absence-blindness

**A red never looked at is indistinguishable from no red.** An absence is invisible unless
something asserts completeness.

Two named sub-classes:

- **Sample-as-conclusion** - sampling an asynchronous process and treating the sample as its
  terminal state. Push, then *wait*. "No run appeared for this ref" is its own honest outcome,
  never success.
- **Unreconciled verification claims** - assertions nothing ever audits against reality.

**No verification claim is ever bare.** Every one carries: the SUITE, the OBSERVED COUNT, the
SHA it was observed at, and who observed it. Never "green" - a suite that silently ran zero
tests is green.

*Scar: a CI run failed - a dependency install flaked and every test was SKIPPED - and sat
unseen for an hour while the conductor said "CI green" a dozen times, having sampled with a
one-result query, caught an in-progress run, reported that, and never returned. Found only
because someone asked about a test count that could not be reproduced.*

Counters that assert completeness rather than instances: reflection-driven parity tests
(a new field is auto-enrolled, a dropped one is a build failure), a declared suite table
(a suite missing from the table is invisible to every aggregate run), and a session-start
baseline that bounds the blindness to one session.

## 9. Obligations cross rungs by CARRIER, never by memory

Anything not written into the next rung's input document does not exist there.

- Findings get **IDs at birth** and are folded **inline, marked with the ID** - not "review
  feedback was incorporated."
- The next rung's adversary walks them as a table: **Present / Absent / DRIFTED.** *Drifted*
  means the words are there but the substance moved - **the fold that looks folded** is the
  subtle failure the chain exists to catch.
- Contract obligations are restated at **every** rung in that rung's native form. Four
  restatements of one fact, and the redundancy is the point: any rung that drops it is caught
  by the neighbour that did not.

**The receiving side is built to refuse delivery without the carrier.** Template plus
adversary at every rung - never "remember harder."

*Scar: a disposition table and a contracts-touched section both existed at the design rung.
The spec template had neither. Nine documentation obligations and five adopted design
requirements evaporated at a single handoff.*

## 10. Know when to stop revising: the swirl-and-churn trigger

**The swirl is undetectable from inside it.** The author believes each round that the next
revision will close it - and a correct instruction does not help, because the state that needs
detecting is the state that disables detection.

So the trigger is mechanical. Escalate to the human rather than dispatching another round when
any two of:

1. Major counts stop declining across rounds.
2. Findings cluster in the same section across rounds.
3. A round's findings include defects **the previous round's own fixes created** - the
   sharpest signal, because it means the defect is being *relocated*, not resolved.

**Only the conductor holds the series**, so every re-review brief must carry the prior rounds'
counts and clustering, and the reviewer must rule on **convergence** as well as correctness.
The reviewer that detects a stall **sets a cap**; the conductor honours it.

*Scar: a design ran four rounds at 7, 3, 4, 5 Majors, clustered in one section, before a
reviewer holding the history set a cap that fired on the next round. Escalating earlier would
have wasted the gate; escalating never would have burned the owner's attention four rounds
later on a worse document. The trigger fires on evidence, not on difficulty.*

## 11. Blameless is not vague, and it is not polite

- **Not vague.** A blame-shaped shop writes "an error occurred." A blameless one writes "the
  conductor booked 23 output tokens by deduplicating on first-per-message-id." Precise
  attribution is *safer* without blame, and root-cause analysis cannot reach the class from a
  euphemism.
- **Not polite.** A reviewer who softens a finding to spare feelings has produced a spelling
  check. Effort is never a mitigating factor for a Major.
- **The agentic form of ego is not pride, it is trained agreeableness.** An agent has no
  status to defend and still gradients hard toward hedging, softening, and agreeing with
  whoever spoke last. The rule must bind behaviour, not feeling.
- **It cuts both ways.** Disagree with a reviewer loudly, with evidence, appealing upward.
  What is forbidden is disagreeing **quietly** - the failure mode is never an argument, it is
  an item that stops appearing.

## 12. Give truth a success shape (gradient shaping, not morale)

Agreeableness is a pull toward whatever shape reads as success. Code REJECT and reversal as
failures and that pull runs toward softening reviews and defending designs. **Invert the
coding and the same pull runs toward the truth.**

**Success outcomes, reported without hedging:** a REJECT at any round; an honest stop; a
disclosed defect in your own work; a reversal of any decision including the owner's; an
escalation; a measurement contradicting your own claim; a premise found false; a gate retired
for not catching anything.

**The only real failures:** a confident falsehood; a defect hidden or described too vaguely to
classify; agreeing without checking; conceding a finding you could have disproved; disagreeing
quietly; improvising past a contradiction. **Being wrong is not on that list. Being wrong
quietly is. Being right by accident is.**

**Anti-gaming guard, and it is load-bearing:** a success outcome must leave a **durable
artifact**. The check is not "did we learn something", it is **"what landed?"** Otherwise
"we don't fail, we learn" becomes the agreeable reading of a rule written to defeat
agreeableness.

## 13. Merge from a known-good state

A merge to the trunk is not a progress report, it is an **assertion** that this state is sound.
Merging something you already know is faulty publishes a claim you know is false. A long-lived
integration branch accumulating many commits is not debt - the question is never "how long
since we merged", it is "is there a state worth asserting yet."

## 14. Board columns are a truth surface

`Done` means **verified**, not merged. `In Review` means landed but awaiting the evidence that
makes it true in the world; closed-but-in-review is a normal state.

*Scar: "Done" drifting to mean "merged" makes the board a lying canary - the owner reads Done
as "I can rely on this" and reality disagrees at the worst moment.*

## 15. Documentation ranks equal to code

Not "documented code" - two halves of one deliverable held to one standard. In a shop where
the workforce evaporates nightly, the written system is the only system that survives.

- **Documents are living.** A document is true only at the moment of its commit. **The commit
  that invalidates a document updates it, in the same commit** - not a follow-up ticket.
- **Meat first, polish later.** Correctness and citation truth are expensive; formatting is
  cheap and can always come after.
- **True always; complete only when the thing exists.** A quickstart for software that cannot
  run is a lie with good intentions.
- **Open every citation before publishing it.** A wrong citation sends an implementer to the
  wrong code, which makes it a Major.

*Scar: a design claimed two scripts "call themselves the harness". A grep returned zero
occurrences in both files. The claim was inherited across six revisions because nobody opened
the file.*
