Status: Current

# Writing your constitution - a guide, deliberately not a template

**Do not copy someone else's laws.** This is the one artifact in this repo you must write
yourself, and the reason is mechanical rather than sentimental: **copied laws are ceremony;
derived laws bind.**

A law works when an agent can hit it while designing and know it forbids the thing they were
about to do. That only happens if the law names something *your* project must never do.
Someone else's laws will be about someone else's disasters, and yours will fail silently.

## The shape

- **Few.** Under ten. A law nobody can recall is not a constraint.
- **Ordered.** Earlier laws outrank later ones when they conflict, and they *will* conflict -
  say which wins before you need to know.
- **Each one a prohibition you can point at a real defect with.** If you cannot imagine the
  bug a law forbids, it is not a law, it is a preference.
- **Ratified before the code**, by whoever owns the project. Amendments go through them.

## How to derive them

Ask what this project would be **worse than useless** for doing. Not "what should it do well"
- what would make a user right to stop trusting it entirely?

Some starting questions, deliberately generic:

- What is the worst *confident falsehood* this system could tell? (Almost every project's
  first law is some form of "never assert what you cannot back", because a confident wrong
  answer is worse than a refusal.)
- Who **outranks** the software? What happens when they override it?
- What must never be **silently** dropped, hidden, or swallowed?
- What must the system be honest about **regarding itself** - staleness, degradation, its own
  failures?
- Where is the **single source of truth**, and what is forbidden from keeping a second copy?
- Who is the **stranger** you are building for, and what would make this undeployable by them?
- How does the project **learn** - what happens to an incident after it is fixed?

Write the answers as prohibitions, order them by which you would sacrifice last, and stop.

## What makes a law load-bearing rather than decorative

The test: **can it produce a REJECT?** A law that has never rejected anything is either
perfectly obeyed or unenforceable, and you cannot tell which from the inside.

So each law should be checkable at a gate. In practice that means every design review ends
with a constitution check - name each law the work implicates, one line of evidence that it is
honoured, or a finding where it is not.

**And the diagnostic that tells you the laws are working as a design instrument rather than a
grading rubric:** *who finds the law?* If the author hits constraints while writing and the
reviewer's constitution check comes back clean, the laws are bounding the work. If the
reviewer finds them all, the laws were not on the page when the mechanism was built.

## Compile a law into a mechanism wherever you can

The strongest form of a law is one that cannot be violated.

- A law that says "nothing is silently lost" becomes a type with no way to express absence, or
  a test asserting the set is complete rather than that known members work.
- A law that says "unknown renders as unknown" becomes a required state in a closed union.
- A law forbidding hardcoded taxonomies becomes vocabulary loaded as data, with unrecognised
  values rendered loudly by name.

*A structural impossibility beats a review rule; a review rule beats a procedure; a procedure
beats vigilance.* Every law you can compile downward should be.

## What NOT to put in a constitution

- **Implementation preferences.** Language, framework, style. Those go in your operating rules.
- **Anything you would amend under mild pressure.** If it bends, it was a guideline.
- **Aspirations.** "The system should be fast" forbids nothing.

## After it is ratified

Cite it by number in designs, and quote the clause you are designing against rather than
paraphrasing from memory. A constraint you paraphrase is a constraint you will satisfy from
memory.

When a law turns out to be wrong, **amend it in the open** - through the owner, with the
reasoning recorded. A quietly-ignored law is worse than no law, because everything downstream
still claims to obey it.
