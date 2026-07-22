Status: Current

# The ladder - the gate sequence, and what each gate exists to catch

Each gate catches a **different failure class** at the cheapest point that class is
catchable. Sending one gate's brief to another gate produces a spelling check.

```
design → design review → spec → spec review → plan → plan review
       → implementer + its reviewer (per car)
       → whole-branch gate → CI
```

**Right-size first.** The full ladder is for structural work - new subsystems, rewrites,
cross-boundary contracts. A coverage-class change takes one implementer and one reviewer.
Porting maximum ceremony onto every change is itself a process failure.

## The gates, and their distinct failure classes

| Gate | Attacks | The class it catches | Exemplar |
|---|---|---|---|
| **Design review** | the IDEAS, against the real code | Designs consuming data no code exposes; race conditions; retirement enumeration; lifecycle holes | `templates/design-briefs.md`, `worked-adversary-and-gate-briefs.md` §1 |
| **Spec review** | the DOCUMENT | Wrong citations; requirements readable two ways; phantom mechanisms; missing lifecycle | `worked-adversary-and-gate-briefs.md` §2 |
| **Plan review** | the SNIPPETS, against the dispatch tip | APIs that do not exist; interfaces that disagree between tasks; reds that would not fail for their stated reason | `worked-plan.md`, `worked-adversary-and-gate-briefs.md` §3 |
| **Per-implementer review** | one diff, plus the SENTENCE CHECK | A value crossing a process or serialization boundary that no single review scope owns | `worked-briefs.md` §2 |
| **Whole-branch gate** | the train as ONE diff | The class that lives **between** scopes - every car was reviewed alone | `worked-adversary-and-gate-briefs.md` §4 |
| **CI** | the shipped pipeline | "It works on my machine" | `templates/repo-policy-check-patterns.md` |

## The observability question is the highest-yield one

At design review, the killer dimension is: **does the code TODAY actually expose what this
design consumes?** Trace where each consumed value is built, hop by hop. A design consuming a
field no code populates is unscoped work in disguise.

## The sentence check

When a value crosses a process or serialization boundary, the reviewer traces the **full
production path** - every hop named with file:line, every hand-maintained mirror (DTO, wire
sample, snapshot, generated index) checked for the field - and states the trace in the
verdict.

*"Each file is correct" is a spelling check. The review is not complete until someone has read
the whole sentence.*

The same shape applies to user-facing documentation: prose → the command it names → the code
that runs → what a stranger observes.

## Why a whole-branch gate exists at all

Every implementer was reviewed alone. The gate is the **first reviewer to read the entire
train as one diff**, and the failure class it exists to catch is the one that lives between
scopes. It also replays contract arithmetic commit by commit against the actual diffs, and
states the train's headline invariant plainly.

It is the strongest reviewer tier available, because its failure surface is subtle coherence
rather than per-file correctness.

## Conductor rulings and the appeal path

When a reviewer and an implementer disagree, or an implementer honest-stops on a decision, the
**conductor issues a recorded ruling** - written into the plan or the fix-cycle message, with
its reasoning. Rejection appeals **upward**, never around, and the owner is final.

A ruling that adopts, modifies or overrules a reviewer finding **says so in writing**, and a
delta re-review still verifies the result.

## Where the human belongs

The loop is human-supervised, and that is a design choice rather than a gap. "Stop the train"
is an immune response no gate is watching for, and the arbiter above every gate is the owner.

The standing question, revisited as the process matures: **which owner interventions should
become gates, and which are permanently, properly human?**

One answer is already known: **adversarial review is blind to unquestioned premises.** A
reviewer rejects what is on the page and cannot reject the assumption that put it there. That
question has no gate, which is why the escalation path exists.
