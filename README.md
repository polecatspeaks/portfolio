# Project Bootstrapping

Status: Current

**The prior art a new agentic project needs on day one, so it does not pay the founding tax
twice.**

Clone it, submodule it, or drop it in wholesale. MIT.

## The problem this exists to kill

A heavily-gated agentic development process is mostly **rules**: red-first, adversarial
review at every rung, honest stops, ledgers, gates. Rules travel easily - they are a
document, you copy it.

**Exemplars do not travel, and rules without exemplars do not bind.**

In a human shop nobody notices, because the exemplars are ambient: you do not need a design
template when you can open last month's design and imitate it. Port only the rules into a
new project and the gap is invisible until work starts failing at whichever rung had no
example to copy.

Then it fails *there specifically*, and it looks like the worker's fault.

> **The founding session that produced this repo spent five adversarial review rounds and
> twelve Major findings on a single design document** - not because the design was hard, but
> because the design rung was the only rung in its ladder with no artifact. Every rung that
> had one (car brief, reviewer brief, state ledger, gating matrix) ran clean on the first
> try. The failures were not randomly distributed. They landed exactly where the scaffolding
> was missing, at the most upstream rung, so everything downstream inherited them.

That is the class: **failure due to a missing workflow artifact**, and its cheapest fix is
prior art someone already wrote.

## What is in here

| Directory | What it is |
|---|---|
| `process/` | The operating rules - the ladder, the laws, the doctrine. **Rules.** |
| `templates/` | Worked exemplars for every rung: design, spec, plan, briefs, contracts, ops. **Examples.** |
| `agents/` | Agent-type definitions, including the no-delegation implementer. |
| `hooks/` | Session-start hooks that make standing checks unforgettable. |
| `scripts/` | Verdict landing and verification, doc-policy checks. |
| `LESSONS.md` | Every lesson, with the scar that earned it. Read this before adopting anything. |
| `ADOPTION.md` | **Start here.** The staged path, and what NOT to install. |

## Read `ADOPTION.md` first, and take the staging seriously

This repo can hurt you. Dropping all of it into a young project installs ceremony that has
never caught anything there, and an immune system that only adds gates goes autoimmune:
ritual, token cost, friction without catches.

The doctrine in here says explicitly *"start with the right-sized subset, let incidents
install the rest."* **A bootstrap kit that ignores its own doctrine is the first thing you
should distrust.** So `ADOPTION.md` is staged by trigger: what to take on day one, what to
take the first time you write a design, a spec, a plan, a train - and what to leave until
something goes wrong.

## What this is not

- **Not a framework.** Nothing here executes your project. It is documents, briefs, and a
  handful of small scripts.
- **Not stack-specific.** The templates are language-agnostic. The few scripts are
  PowerShell and shell; port their *patterns*, not their syntax.
- **Not a substitute for your own incidents.** Every rule in `LESSONS.md` carries the scar
  that earned it, in someone else's shop. A rule whose scar you cannot imagine happening to
  you is a pruning candidate, not a commandment.
- **Not finished.** Rungs its authors have not yet run are marked honestly. Building an
  artifact for a rung you have never run is inventing prior art you do not have - which is
  the same failure this repo exists to prevent, one rung over.

## Provenance and honesty

The material here comes from two places: a production multi-agent shop whose practice was
tacit and had to be transposed, and a founding session that paid the tax in public and wrote
down what it cost. Every scar in `LESSONS.md` is real. Where a lesson has not yet been
tested outside its origin, it says so.

The originating project's review verdicts - including five consecutive REJECTs on one
document - are public. REJECTs are credentials here, not embarrassments: a gate that never
rejects is not a gate.
