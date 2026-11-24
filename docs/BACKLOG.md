# FPVBuddy Backlog

Current work ledger, reviewed 24 November 2026 against main `d435eda` ([PR #7](https://github.com/voidbrain/FPVBuddy/pull/7) merged on green CI; F-003 closed and archived). Rules: [docs/BACKLOG-RULES.md](BACKLOG-RULES.md).

## Lifecycle

| Signal | Status | Meaning |
|:---:|---|---|
| 🟡 | **Implemented** | Code & tests exist; awaiting CI or owner confirmation |
| 🔵 | **Closed** | Verified and closed |
| 🔴 | **Open** | Accepted work not yet started |

## Open & active items

---

### <a id="f-004"></a>[✨ F-004](#top)

**Owner follow-ups 2026-11-24: restored rules, push guard, roadmap, check:fast**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔶 P2 | 🟢 Small | 0.5 h agent + 0.25 h owner | — | — | 🤖 | — | — |

💻 **→** Next: F-004-T01 — Restore omitted AGENTS rules, add check:fast, install the push guard (Implemented; verification pending).

| | |
|---|---|
| **Issue** | Owner answered the F-002 open questions 2026-11-24 ("ok to all"): restore the template AGENTS rules left out at adoption, install the push guard, start a roadmap with a proposed next milestone, add a `check:fast` bundle. |
| **Reproduce** | `AGENTS.md` on `main` at `d435eda`: no "Testing the joins", no capability-assessment or solution-profile rows; `docs/ROADMAP.md` missing (`check:freshness` 🤔 owner-decision finding); no `check:fast` script; `check:freshness` reports the push guard not installed. |
| **Check** | The restored rules are in AGENTS and `docs/backlog/documentation.md`; `npm run check:fast` passes and AGENTS names it; `check:freshness` no longer reports the guard or the missing roadmap; the owner confirms or amends the proposed milestone in `docs/ROADMAP.md`. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who | PRs |
|---|---|---|---|---|---|---|---|:---:|---|
| 🟢 Small | <a id="f-004-t01"></a>F-004-T01 — Restore omitted AGENTS rules, add check:fast, install the push guard | 0.5 h | 0 h | 0 h | Implemented; verification pending | — | [F-004-T04](#f-004-t04) | 🤖 | [PR #8](https://github.com/voidbrain/FPVBuddy/pull/8) rules and check:fast |
| 🟢 Small | <a id="f-004-t02"></a>F-004-T02 — Draft the roadmap with a proposed next milestone | 0.5 h | 0 h | 0 h | Implemented; verification pending | — | [F-004-T04](#f-004-t04) | 🤖 | [PR #8](https://github.com/voidbrain/FPVBuddy/pull/8) roadmap draft |
| 🟢 Small | <a id="f-004-t04"></a>F-004-T04 — Independent review and landing of PR #8 | 0.5 h | 0 h | 0.5 h | Planned | [F-004-T01](#f-004-t01), [F-004-T02](#f-004-t02) | [F-004-T03](#f-004-t03) | ⏳ 🤖 | — |
| 🟢 Small | <a id="f-004-t03"></a>F-004-T03 — Owner confirms or amends milestone M1 | 0 h | 0 h | 0 h agent + 0.25 h owner | Planned | [F-004-T04](#f-004-t04) | — | ⏳ 🤔 | — |
| 🟢 Small | **Total** | 1.5 h | 0 h (0 of 4 steps recorded) | 0.5 h agent + 0.25 h owner | 0 of 4 completed | | | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-004.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-004-T01: [PR #8](https://github.com/voidbrain/FPVBuddy/pull/8) rules and check:fast · F-004-T02: [PR #8](https://github.com/voidbrain/FPVBuddy/pull/8) roadmap draft. [PR #8](https://github.com/voidbrain/FPVBuddy/pull/8) · No test: instructions, docs and a script alias only |
| Opened | 2026-11-24 |
| Verification | Script: check:fast, check:freshness (local, 2026-11-24); Pending: CI, owner decision on M1 |
| Reviewed | 2026-11-24 |

</details>

---
