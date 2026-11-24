# FPVBuddy Backlog

Current work ledger, reviewed 24 November 2026 against main `065fa1d` ([PR #8](https://github.com/voidbrain/FPVBuddy/pull/8) merged on green CI; F-004 closed and archived). Rules: [docs/BACKLOG-RULES.md](BACKLOG-RULES.md).

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
| 🔴 Open | 🔶 P2 | 🟡 Medium | 4 h | — | — | 🤖 | — | — |

💻 **→** Next: F-005-T01 — Package boundary for the FPV core (Planned).

| | |
|---|---|
| **Issue** | Roadmap milestone M1, agreed by the owner 2026-11-24 (F-004-T03, option A): FPVBuddy hosts the FPV battery-manager core (logging charge state and internal resistance) as a plain TypeScript package with its own tests, so other projects consume it instead of keeping their own copy. |
| **Reproduce** | Look for a battery-core package in this repository: there is none; the core exists only inside NERV today. |
| **Check** | The core builds and is tested in this repository's CI; its public API is documented; a consumer can install it without the FPVBuddy app ([roadmap M1](ROADMAP.md#milestones)). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-005-t01"></a>F-005-T01 — Package boundary for the FPV core | 1 h | 0 h | 1 h | Planned | — | [F-005-T02](#f-005-t02) |
| 🟡 Medium | <a id="f-005-t02"></a>F-005-T02 — Bring the battery core and its tests into the package | 1.5 h | 0 h | 1.5 h | Planned | [F-005-T01](#f-005-t01) | [F-005-T03](#f-005-t03), [F-005-T04](#f-005-t04) |
| 🟢 Small | <a id="f-005-t03"></a>F-005-T03 — Document the core's public API | 0.5 h | 0 h | 0.5 h | Planned | [F-005-T02](#f-005-t02) | — |
| 🟢 Small | <a id="f-005-t04"></a>F-005-T04 — Install check without the FPVBuddy app | 1 h | 0 h | 1 h | Planned | [F-005-T02](#f-005-t02) | — |
| 🟡 Medium | **Total** | 4 h | 0 h (0 of 4 steps recorded) | 4 h | 0 of 4 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-005.md)

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-11-24 |
| Verification | Pending: CI, package install check |
| Reviewed | 2026-11-24 |

</details>

---
