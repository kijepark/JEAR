---
name: debugging
description: Diagnose unexplained bugs, failing tests, regressions, flaky behavior, and runtime incidents. Reproduce or observe the failure, test hypotheses, stop fixes without new evidence, and verify the original symptom under the same conditions. Not for routine feature work.
---

# Just Enough AI Debugging

Fix the real cause with the smallest safe change. Reduce guesses before increasing code.

Keep the repository's normal `AGENTS.md`, `PRODUCT.md`, `CURRENT.md`, and `ARCHITECTURE.md` rules active. This skill adds debugging behavior; it does not replace or duplicate project intent, architecture, Git safety, or approval boundaries.

## 1. Bind the failing system

Before editing, state one exact debugging question and the observable result that would close it.

Pin only the identity fields that can change the answer:

- repository / branch / HEAD / worktree
- environment: local / test / staging / production
- runtime host / process / PID
- deployed commit or artifact version
- feature flag / config / account / workspace when relevant

Do not debug an assumed process, environment, version, tenant, or checkout.

For a regression, identify a known-bad state and a known-good state when possible.

## 2. Reproduce, or bind decisive evidence

Prefer a deterministic reproduction before patching. Preserve the failing evidence and relevant runtime identity before any action that could erase or change them.

Do not reproduce by causing destructive data loss, external side effects, security exposure, billing impact, or production harm merely to obtain evidence. Use an existing observation, a safer environment, or the strongest non-destructive evidence instead, and follow the repository's approval boundaries.

If direct reproduction is not practical, bind the strongest observable evidence available: runtime output, logs, database state, request/response, trace, crash, recorded behavior, or another direct observation.

A user explanation, issue description, model explanation, code smell, or plausible theory is not proof of root cause.

Do not patch from narrative alone.

## 3. Decompose and reduce only when useful

If one report contains several observable behaviors, split them before diagnosing. Example:

```text
"The requested result is missing"
→ was the result produced?
→ was it stored?
→ did the API return it?
→ did the client request it?
→ did a stale cache hide it?
```

When the failing input, fixture, configuration, or sequence is large, reduce it toward the smallest case that still fails. Stop reducing when the next reduction would no longer help distinguish causes.

Do not create ceremony for a simple bug with one already-clear failing condition.

## 4. Keep a small hypothesis set

Maintain at most three live hypotheses unless evidence requires more.

For each hypothesis, track:

```text
SUPPORTS
CONTRADICTS
UNKNOWN
```

Treat a root cause proposed by the prompt as one hypothesis, not authority.

Delete a hypothesis when evidence rules it out. Do not keep dead theories in the active set.

## 5. Prefer discriminating evidence

Choose the cheapest test that can eliminate a hypothesis, not the test that merely produces more output. Before running it, state which result would count as `SUPPORTS` and which as `CONTRADICTS` for that hypothesis.

Prefer this escalation order when it can answer the question:

```text
code / Git history
→ existing deterministic test
→ read-only query / log / curl / state inspection
→ minimal reproduction
→ temporary trace or instrumentation
→ interactive debugger / runtime state inspection
→ external service or production observation
```

Observe before mutating whenever possible. Do not restart, reconnect, redeploy, clear state, or rewrite data merely to "see if it helps."

Escalate only when the cheaper surface cannot decide between the remaining hypotheses.

## 6. Use the technique that matches the failure

Use tools conditionally; do not run every technique on every bug.

### Regression with an unknown introduction point

Use Git history. If there is a deterministic good/bad predicate, consider `git bisect` or an equivalent binary search over revisions.

### Runtime-state or control-flow uncertainty

Use trace, targeted instrumentation, stack inspection, or an interactive debugger to observe actual branches and values instead of inferring them from source alone.

### Large failure-inducing input

Use delta reduction: remove parts of the input/config/sequence while preserving the failure until the relevant condition is small enough to reason about.

### Cross-process or cross-service symptom

Correlate one request or event across boundaries using an existing request ID, trace ID, correlation ID, timestamp, or equivalent identity. Add observability infrastructure only when the current task cannot otherwise be closed.

### Behavioral difference

Prefer differential evidence: compare known-good vs known-bad, or pre-fix vs post-fix behavior under the same condition.

## 7. Patch only a supported cause

Patch only after evidence supports a root cause strongly enough that the change follows from it.

The patch must be the smallest change that addresses that cause. `AGENTS.md` §2 and §3 apply unchanged while debugging.

If the evidence says the requested fix is actually a new feature, product decision, architecture change, migration, or security-boundary change, stop the debugging task. Open a new normal task instead of hiding that work inside the bug fix.

## 8. Make failed attempts produce information

A failed attempt is useful only if it adds evidence or rules something out.

Record, in task output or the repository's existing debugging worklog if one exists:

```text
ATTEMPT
HYPOTHESIS
EVIDENCE
RESULT
WHAT THIS RULED OUT
```

Do not create a new permanent worklog system just for this skill.

Apply the `AGENTS.md` §5 no-progress rule strictly. Two attempts without progress trigger a test that could falsify the current hypothesis; a failed test that rules out a hypothesis is progress, not another stalled attempt.

If that test brings no new evidence, abandon the current patch approach. Before proposing another fix, search official documentation and relevant developer discussions (such as GitHub Issues, Stack Overflow, or Reddit) for a different cause. Use sanitized symptoms, never private code, secrets, or sensitive logs in external queries. Treat community reports as leads, not proof: check any new hypothesis against local evidence before patching. If search is unavailable or yields no testable new lead, STOP and report; never repeat a guessed patch.

## 9. Prove the fix under the same condition

A green test alone does not close a bug.

Re-run the original failing condition, or the strongest bound reproduction of it, after the patch.

When practical, use counterfactual proof:

```text
pre-fix code + same reproduction  → FAIL
post-fix code + same reproduction → PASS
```

If a regression test is the primary proof of the fix, confirm that it fails against the pre-fix behavior when practical. A test that passes both before and after the patch may not prove the bug was fixed.

Then run the affected regression checks. For a decomposed bug, verify every behavior that was part of the original report.

Remove temporary diagnostic logs, probes, breakpoints, instrumentation, fixtures, flags, or scripts before closing unless they are intentionally retained as approved observability or regression protection. Re-run the relevant proof after cleanup if cleanup could change behavior.

## 10. Close on evidence, not confidence

For a non-trivial debugging task, the final report should make these facts recoverable without retelling the whole investigation:

```text
DEBUG_QUESTION
RUNTIME_IDENTITY          # relevant fields only
REPRODUCTION_OR_EVIDENCE
ROOT_CAUSE
PATCH
SAME_CONDITION_RECHECK
REGRESSION_CHECKS
REMAINING_UNKNOWN
STATUS
```

Use `NOT RUN`, `NOT REPRODUCED`, or `UNKNOWN` instead of guessing.

`CLOSED` requires the `AGENTS.md` §4 definition of done, plus:

- the root cause is supported by evidence, not only plausibility
- the patch targets that cause
- the original symptom no longer occurs under the same relevant condition
- temporary diagnostic artifacts are removed or intentionally retained

`AGENTS.md` §6 governs high-risk areas; treat a production-only failure the same way.

## Principle

> Good debugging removes wrong explanations before it adds code.
