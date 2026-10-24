# AGENTS.md

How coding agents work in this repository.

Goal: **appropriate quality + zero known errors + minimum complexity.**

A known error means an observed failure within the supported current scope, not a deferred improvement, unsupported case, or future enhancement.

Scope is defined by `PRODUCT.md` and the exact task, not by what is convenient to exclude.
A violation of any applicable `NEVER` condition is always a known error.

Before starting a task, read `PRODUCT.md`, `CURRENT.md`, and `ARCHITECTURE.md`.

Project checks — run these, do not guess:

- test: `TODO: command`
- lint / typecheck: `TODO: command`

## 1. Sources of truth

- **What should be true** — `PRODUCT.md`, then `ARCHITECTURE.md`. Code that contradicts them is a bug to report, not a precedent.
- **What is implemented now** — the code and what it does when run. If `CURRENT.md` or any document disagrees with the code about what exists, the code wins; fix the document.
- **Tests** — evidence about behavior, not a source of intent. A test can be stale, but never change one just to make it pass.
- **What happened before** — Git history.
- **Chat** — the current request defines the task. Earlier "fixed" or "done" statements are claims, not facts.

## 2. One task = one verifiable question

- Before changing anything, state in one line the question and the result that will prove it. Then proceed; this is not a request for approval.
- No unrelated cleanup, refactor, redesign, or future-proofing. Mention a good idea outside the question in one line and leave it.
- When the question is answered, stop. Do not start the next task.

## 3. Search → Delete → Modify → Extend → Add

Before creating code, a file, a helper, an abstraction, or a document:

1. Search for an existing owner or equivalent behavior. `ARCHITECTURE.md` lists owners.
2. Can deleting something solve it?
3. Can the existing owner be modified, or minimally extended?
4. Only then add the smallest new thing. A new file needs a stated reason why no existing owner fits.

Never: a second implementation of something that exists; an abstraction or framework for a use case that does not exist yet; hardcoding to make a test pass.

When unsure: *if we do not make this change now, does the current task fail?* If not, do not make it.

## 4. Evidence before fix

An agent's statement — including yours — is not evidence. Evidence is what was observed: code read, test run, diff, runtime output, log, real behavior, or the official source for an external fact.

- Before fixing, confirm the problem exists in the current code and follow the actual call and data flow to the cause. A cause suggested in the request is a hypothesis; if the evidence contradicts it, report that instead of patching around it.
- Never report a check as passing unless you ran it in this task and saw the result. Otherwise write `NOT RUN`.
- A passing check is evidence only for what it actually exercised and could have failed on. When skips, filters, mocks or fixtures, a missing environment, or ignored errors could make success misleading, check them before calling it a pass.

Done means all of these:

- the requested outcome works — observed, not assumed
- every relevant NEVER in `PRODUCT.md` still holds
- the relevant checks ran and pass
- the diff contains nothing outside the question
- you know of nothing that still fails for this question

## 5. No progress → stop

Progress means at least one of:

- new evidence
- a test or runtime result that changed
- a code change made because of evidence, not another guess
- a decision that changes the blocker or the acceptance state

Repeating a search, restating a hypothesis, rewording an explanation, or another unsupported patch is not progress.

```text
no progress once            → do not repeat the same action
no progress twice in a row  → run one test that could prove the current hypothesis wrong
still nothing new           → STOP and report: what was tried, what the evidence shows, what is unknown
```

## 6. Ask a human only when it matters

Safe and reversible work: proceed without asking.

Stop and ask before:

- a destructive or irreversible operation (production data, migrations, deletes)
- changing security, authentication, permission, payment, or personal-data behavior that the task did not explicitly ask for
- anything that contradicts `PRODUCT.md` or a boundary in `ARCHITECTURE.md`

When a task does touch those areas, verify harder: look for the case where it fails open, and get runtime evidence rather than unit tests alone. Your own judgment does not close such a task: report it as needing verification independent of you — a human, or a separate review — and list what to check.

## 7. Keep documents and rules small

- Documents are not work logs. Attempts, failed hypotheses, and test counts belong in Git and task output.
- When the project's shared state, blocker, or next step changes, overwrite `CURRENT.md`. Replace; never append. Progress on a single branch belongs in that branch or its PR.
- One fact, one owner file. Reference it; do not copy it.
- Add a rule only for a failure that repeats or will stay true — not for a one-off incident, a dependency bug, a solved problem, or a guessed risk. If a rule is important, repeatedly broken, and cheap to check deterministically, make it a script or test instead of prose. Delete rules that stopped earning their place.
- Technical debt: fix it now only if it causes current cost (regressions, conflicting behavior, repeated wrong agent choices, security risk, unverifiable changes). Otherwise leave it. If forgetting it would cost later, add one line to `TECH-DEBT.md` — what, why deferred, revisit trigger — and create that file only then.
