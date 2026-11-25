# FPVBuddy Backlog

Current work ledger, reviewed 25 November 2026 against main `e15d5f7` ([PR #10](https://github.com/voidbrain/FPVBuddy/pull/10) merged on green CI; F-005-T01 closed). Rules: [docs/BACKLOG-RULES.md](BACKLOG-RULES.md).

## Lifecycle

| Signal | Status | Meaning |
|:---:|---|---|
| 🟡 | **Implemented** | Code & tests exist; awaiting CI or owner confirmation |
| 🔵 | **Closed** | Verified and closed |
| 🔴 | **Open** | Accepted work not yet started |

## Open & active items

---

### <a id="f-005"></a>[✨ F-005](#top)

**M1 — FPV battery core package**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟡 Medium | 3 h | — | — | 🤖 | — | — |

💻 **→** Next: F-005-T02 — Bring the battery core and its tests into the package (Planned).

| | |
|---|---|
| **Issue** | Roadmap milestone M1, agreed by the owner 2026-11-24 (F-004-T03, option A): FPVBuddy hosts the FPV battery-manager core (logging charge state and internal resistance) as a plain TypeScript package with its own tests, so other projects consume it instead of keeping their own copy. |
| **Reproduce** | Look for a battery-core package in this repository: there is none; the core exists only inside NERV today. |
| **Check** | The core builds and is tested in this repository's CI; its public API is documented; a consumer can install it without the FPVBuddy app ([roadmap M1](ROADMAP.md#milestones)). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | PRs |
|---|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-005-t02"></a>F-005-T02 — Bring the battery core and its tests into the package | 1.5 h | 0 h | 1.5 h | Planned | — | [F-005-T03](#f-005-t03), [F-005-T04](#f-005-t04) | — |
| 🟢 Small | <a id="f-005-t03"></a>F-005-T03 — Document the core's public API | 0.5 h | 0 h | 0.5 h | Planned | [F-005-T02](#f-005-t02) | — | — |
| 🟢 Small | <a id="f-005-t04"></a>F-005-T04 — Install check without the FPVBuddy app | 1 h | 0 h | 1 h | Planned | [F-005-T02](#f-005-t02) | — | — |
| 🟡 Medium | **Total** | 4 h | 0 h (0 of 4 steps recorded) | 3 h | 1 of 4 completed | | | |

<details><summary>Done steps (1)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| — | <a id="f-005-t01"></a>F-005-T01 — Package boundary for the FPV core | 1 h | 0 h | Completed | [PR #10](https://github.com/voidbrain/FPVBuddy/pull/10) package boundary |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-005.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-005-T01: [PR #10](https://github.com/voidbrain/FPVBuddy/pull/10) package boundary. [#10](https://github.com/voidbrain/FPVBuddy/pull/10); [#11](https://github.com/voidbrain/FPVBuddy/pull/11) |
| Opened | 2026-11-24 |
| Verification | F-005-T01: green CI on PR #10 (2026-11-25). Pending: package install check (F-005-T04) |
| Reviewed | 2026-11-25 |

</details>

---
### <a id="f-006"></a>[✨ F-006](#top)

**Reconcile project-harness v10.9.0 → v10.20.0**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 0 h | — | — | 🤖 | — | — |

💻 **→** Next: F-006-T01 — Reconcile harness files v10.9.0 -&gt; v10.20.0 (Implemented; verification pending).

| | |
|---|---|
| **Issue** | `.harness.json` named v10.9.0 while the template released v10.10.0–v10.20.0 (`check:freshness` listed 17 copied files to update and 6 adapted files to reconcile). Owner approved the reconcile on 2026-11-25. |
| **Reproduce** | Run `npm run check:freshness` on `main` at `e15d5f7`: it reports the harness template v10.20.0 and the files above. |
| **Check** | `check:freshness` reports no harness update; `check:fast`, tests and build pass; CI on the PR is green. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="f-006-t01"></a>F-006-T01 — Reconcile harness files v10.9.0 -&gt; v10.20.0 | 1 h | 0 h | 0 h | Implemented; verification pending |
| 🟢 Small | **Total** | 1 h | 0 h (0 of 1 steps recorded) | 0 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-006.md)

| Field | Value |
|---|---|
| PR / evidence | Pending PR; [#11](https://github.com/voidbrain/FPVBuddy/pull/11) |
| Opened | 2026-11-25 |
| Verification | Pending: CI on the PR |
| Reviewed | 2026-11-25 |

</details>

---
