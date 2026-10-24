# ARCHITECTURE.md

Only the structural facts that are expensive to get wrong. If the code already makes something obvious, leave it out.

## SHAPE

TODO: the main components and how they connect, in a few lines.

## OWNERSHIP

Where each responsibility lives. Check here before creating a new file or helper.

| Responsibility | Owner (path) |
|---|---|
| TODO: e.g. auth / permissions | TODO: path |
| TODO: e.g. persistence | TODO: path |

## BOUNDARIES

Do not change these without asking: structural decisions, external-service constraints, and data flows that matter for security, correctness, or cost.

- TODO: data flow or security boundary, and why it must stay this way
- TODO: external-service constraint, and why changing it is expensive
