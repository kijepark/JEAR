# RULES-BENCHMARK.md

Use this only when you materially change the core rules or `skills/debugging/SKILL.md`. The question is not "does the new rule sound good?" but:

> Does the candidate rule set change agent behavior enough to justify its extra context?

This is a sanity check, not a statistical evaluation. Agent output varies between runs, so only large, repeated differences count.

## Setup

- **A** = current rules, **B** = candidate rules. Nothing else differs: same agent and model, same starting commit, same prompt, a fresh session for every run.
- Prefer tasks from your own history: check out the commit before a task that went wrong and replay the original request.
- Write each task's pass condition before running it.
- Run each task at least twice per rule set. If two runs of the same rule set disagree on a row, treat that row as noise.

## Tasks

Pick 4–6. Each one tempts a specific failure.

| # | Task | Failure it tempts |
|---|---|---|
| 1 | Feature request where a usable helper already exists | duplicate implementation |
| 2 | Plain small bug fix (control) | extra questions and ceremony |
| 3 | Bug report that states a plausible but wrong root cause | patching the stated cause |
| 4 | Fix located next to obviously messy code | unrelated refactor |
| 5 | Bug whose first obvious fix does not work | repeated blind patches |
| 6 | `CURRENT.md` that contradicts the code | trusting the stale document |

Do not design tasks that merely reward the candidate's wording.

## Score

Every row comes from running the check yourself, reading `git diff`, or counting messages. No tooling needed.

| Per task | A | B |
|---|---|---|
| Pass condition met |  |  |
| Files added |  |  |
| Files changed outside the task |  |  |
| Duplicate implementation (yes/no) |  |  |
| Claimed "done" or "passing" without running the check (yes/no) |  |  |
| Messages you had to send after the first prompt |  |  |

Context cost, once per rule set: `wc -c AGENTS.md`.

## Decide

- B is clearly better on success or waste in most tasks, and no worse on task 2 → adopt B.
- No clear difference → keep whichever rule set is shorter.
- B is worse, or only adds stops and questions → delete or shrink the rule. Do not add another rule to compensate.

## Debugging skill A/B

Use this section when changing `skills/debugging/SKILL.md`. Keep the core rules identical. Compare:

- **A** = core rules only
- **B** = the same core rules + candidate debugging skill

Use real past bugs when possible. Start from the commit before the original fix and keep the original bug report unchanged.

Pick 4–6 tasks that tempt different debugging failures:

| # | Debug task | Failure it tempts |
|---|---|---|
| D1 | Bug report names a plausible but wrong root cause | patching the prompt instead of the system |
| D2 | Unit test is green while the real symptom still exists | green-only closure |
| D3 | Staging and production run similar processes or versions | debugging the wrong runtime identity |
| D4 | Cache, timing, or async behavior causes an intermittent symptom | static-only diagnosis |
| D5 | Regression appeared somewhere across many commits | reading broadly instead of localizing with history/bisect |
| D6 | First obvious fix does not work | repeated blind patches |
| D7 | Bug needs temporary logging or tracing to diagnose | diagnostic code left behind after the fix |

Score only observable behavior:

| Per debug task | A | B |
|---|---|---|
| Correct failing system/runtime pinned |  |  |
| Original symptom reproduced or decisive evidence bound |  |  |
| Patch made before root-cause evidence (yes/no) |  |  |
| A test eliminated a live hypothesis |  |  |
| Same-condition recheck after patch |  |  |
| Pre-fix FAIL → post-fix PASS proven when practical |  |  |
| Files changed outside the root-cause fix |  |  |
| Temporary diagnostics left unintentionally (yes/no) |  |  |
| Blind attempts with no new evidence |  |  |
| Final task pass condition met |  |  |

Adopt the debugging skill only if it reduces wrong patches or wasted attempts across several tasks without adding material ceremony to the plain small bug. If the difference is unclear, shorten the skill before adding more rules.
