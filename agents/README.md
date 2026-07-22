Status: Current

# Agent definitions

Frontmatter-bearing files, read by your runner rather than by a human. They are deliberately
**out of scope** for the Status-line doc gate (`templates/repo-policy-check-patterns.md` §1) -
a `Status:` line would break the parse. That is scope, not a softened check.

## `car.md` - the implementer / adversarial reviewer

The single most important property is what is **absent**: it has no dispatch tool, so it
**cannot** spawn subagents. That is enforced by TOOLSET, not by prose.

*Scar: a reviewer once forked itself mid-review and the owner had to stop the work by hand.
A prose rule binds an agent that reads it; a toolset binds every agent regardless.*

Adapt the `tools:` list to your runner. Keep the removal.
