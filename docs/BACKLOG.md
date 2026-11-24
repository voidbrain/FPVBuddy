# FPVBuddy Backlog

Current work ledger, reviewed 24 November 2026 against main `e8bbff6` ([PR #5](https://github.com/voidbrain/FPVBuddy/pull/5) merged on green CI; B-005 archived). Rules: [docs/BACKLOG-RULES.md](BACKLOG-RULES.md).

## Lifecycle

| Signal | Status | Meaning |
|:---:|---|---|
| 🟡 | **Implemented** | Code & tests exist; awaiting CI or owner confirmation |
| 🔵 | **Closed** | Verified and closed |
| 🔴 | **Open** | Accepted work not yet started |

## Open & active items

---

### <a id="f-002"></a>[✨ F-002](#top)

**Reconcile project-harness v10.3.0 → v10.9.0**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔶 P2 | 🟢 Small | 0.5 h | — | [F-003-T02](#f-003-t02) | 🤖 | — | — |

💻 **→** Next: F-002-T01 — Reconcile harness files v10.3.0 -&gt; v10.9.0 (Implemented; verification pending).

| | |
|---|---|
| **Issue** | `.harness.json` named v10.3.0 while the template released v10.3.1–v10.9.0 (`check:freshness` listed 9 copied files to update and 8 adapted files to reconcile). |
| **Reproduce** | `npm run check:freshness` on `main` at `e8bbff6`. |
| **Check** | `check:freshness` reports no harness update; `check:fast`-equivalent checks (format, lint, typecheck, backlog, rules, rule-load, maintenance), tests and build pass; CI on the PR is green. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | PRs |
|---|---|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-002-t01"></a>F-002-T01 — Reconcile harness files v10.3.0 -&gt; v10.9.0 | 1 h | 0 h | 0 h | Implemented; verification pending | — | [F-002-T02](#f-002-t02) | [PR #6](https://github.com/voidbrain/FPVBuddy/pull/6) reconcile |
| 🟢 Small | <a id="f-002-t02"></a>F-002-T02 — Independent review and landing of PR #6 | 0.5 h | 0 h | 0.5 h | Planned | [F-002-T01](#f-002-t01) | [F-003-T02](#f-003-t02) | — |
| 🟢 Small | **Total** | 1.5 h | 0 h (0 of 2 steps recorded) | 0.5 h | 0 of 2 completed | | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-002.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-002-T01: [PR #6](https://github.com/voidbrain/FPVBuddy/pull/6) reconcile. [PR #6](https://github.com/voidbrain/FPVBuddy/pull/6) · No test: documentation and copied-tool reconcile, no app code |
| Opened | 2026-11-24 |
| Verification | Local checks on the branch (see PR); CI pending |
| Reviewed | 2026-11-24 |

</details>

---
### <a id="f-003"></a>[✨ F-003](#top)

**Adopt source-owned records and upfront feature plans**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔶 P2 | 🟢 Small | 0.5 h | [F-002-T02](#f-002-t02) | — | 🤖 | — | — |

💻 **→** Next: F-003-T01 — Enable source-owned records and upfront feature plans (Implemented; verification pending).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-24: FPVBuddy plans its work in small steps like the other harnessed projects (`workItems.featurePlans`, task files under `docs/work/tasks` with `dependsOn`). |
| **Reproduce** | `.harness.json` on `main` at `e8bbff6`: `workItems.enabled` and `featurePlans` are false; `docs/BACKLOG.md` is edited by hand. |
| **Check** | `workItems.enabled` and `featurePlans` true; every open record has steps with estimates, actors and `dependsOn`; `npm run work:build` regenerates `docs/BACKLOG.md`; `check:work` and `check:backlog` pass; CI green. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | PRs |
|---|---|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-003-t01"></a>F-003-T01 — Enable source-owned records and upfront feature plans | 1 h | 0 h | 0 h | Implemented; verification pending | — | [F-003-T02](#f-003-t02) | [PR #7](https://github.com/voidbrain/FPVBuddy/pull/7) enable feature plans |
| 🟢 Small | <a id="f-003-t02"></a>F-003-T02 — Independent review and landing of PR #7 | 0.5 h | 0 h | 0.5 h | Planned | [F-003-T01](#f-003-t01), [F-002-T02](#f-002-t02) | — | — |
| 🟢 Small | **Total** | 1.5 h | 0 h (0 of 2 steps recorded) | 0.5 h | 0 of 2 completed | | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-003.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-003-T01: [PR #7](https://github.com/voidbrain/FPVBuddy/pull/7) enable feature plans. [PR #7](https://github.com/voidbrain/FPVBuddy/pull/7) · No test: backlog settings and generated views only |
| Opened | 2026-11-24 |
| Verification | Local checks on the branch (see PR); CI pending |
| Reviewed | 2026-11-24 |

</details>

---
