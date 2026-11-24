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

### F-002

**Reconcile project-harness v10.3.0 → v10.9.0**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

💻 **→ Human action required: No**<br />Next: independent review of [PR #6](https://github.com/voidbrain/FPVBuddy/pull/6), then land it on green CI and close this record.

| | |
|---|---|
| **Issue** | `.harness.json` named v10.3.0 while the template released v10.3.1–v10.9.0 (`check:freshness` listed 9 copied files to update and 8 adapted files to reconcile). |
| **Reproduce** | `npm run check:freshness` on `main` at `e8bbff6`. |
| **Check** | `check:freshness` reports no harness update; `check:fast`-equivalent checks (format, lint, typecheck, backlog, rules, rule-load, maintenance), tests and build pass; CI on the PR is green. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | [PR #6](https://github.com/voidbrain/FPVBuddy/pull/6) · No test: documentation and copied-tool reconcile, no app code |
| Opened | 2026-11-24 |
| Verification | Local checks on the branch (see PR); CI pending |
| Reviewed | 2026-11-24 |

**Estimates:** `🟢 Small` — copied files from the tag, adapted files by three-way merge, AGENTS re-adapted from the leaner 10.5.0 template.
**Next action / closure evidence:** Copied from v10.9.0: `tools/{friction,check-rules,work-items}.mjs`, `docs/agents/{skills,skills-discovery,parallel-work,procedures,work-usage,work-usage-launch,claims,rule-review}.md`. Adapted (reconciled from the template diff): `AGENTS.md` (landing-queue safety line, lean procedures table, Documentation section moved to `docs/backlog/documentation.md` "Top-level documents" with this project's two bullets marked `<!-- project -->`), `docs/BACKLOG-RULES.md`, `docs/backlog/{closure,documentation,estimates,records,review}.md`, `docs/agents/pull-requests.md`; new `docs/backlog/{human-action,ledger-header}.md`. Skipped: the optional `work:close` and `work:pr` scripts (10.7.0, 10.9.0) because `workItems.enabled` is false.

</details>

---
