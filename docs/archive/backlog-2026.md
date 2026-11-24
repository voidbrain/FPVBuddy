# FPVBuddy Backlog Archive — 2026

Closed records moved from [docs/BACKLOG.md](../BACKLOG.md).

---

### F-001

**Adopt project-harness v10.2.0 (`core` + `angular`)**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />Closed 2026-11-23 ([PR #1](https://github.com/voidbrain/FPVBuddy/pull/1) merged on green CI).

| | |
|---|---|
| **Issue** | Repository lacked the shared agent harness (`AGENTS.md`, backlog rules, lint/format CI enforcement, and freshness/conventions checks). |
| **Reproduce** | Inspect `main` at `6b75548`: no `.harness.json`, `docs/BACKLOG.md`, ESLint config, or `.github/workflows/ci.yml`. |
| **Check** | `npm run check:backlog`, `npm run check:rules`, `npm run check:tooling`, `npm run check:conventions`, `npm run check:freshness`, and CI pass. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | [PR #1](https://github.com/voidbrain/FPVBuddy/pull/1) |
| Opened | 2026-11-22 |
| Verification | `check:harness`, `check:backlog`, `check:rules`, `check:tooling`, `check:conventions`, `impact-map`, `npm run build` |
| Reviewed | 2026-11-23 |

**Estimates:** `🟢 Small` — implementation complete and merged in PR #1.
**Next action / closure evidence:** Closed 2026-11-23 ([PR #1](https://github.com/voidbrain/FPVBuddy/pull/1)).

</details>

---

### B-001

**Unit test `App > should render title` fails on baseline**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P1 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />Closed 2026-11-23 ([PR #3](https://github.com/voidbrain/FPVBuddy/pull/3) merged on green CI).

| | |
|---|---|
| **Issue** | `npm test -- --watch=false` fails (1 failed, 1 passed) in `src/app/app.spec.ts:21`: `expect(compiled.querySelector('h1')?.textContent).toContain('Hello...')` receives `undefined`. |
| **Reproduce** | `npm test -- --watch=false` |
| **Check** | `npm test -- --watch=false` exits 0 with all specs passing and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | [PR #3](https://github.com/voidbrain/FPVBuddy/pull/3) · Test: `src/app/app.spec.ts` (`npm test -- --watch=false`, failed on baseline before fix) · No review: single-line baseline spec alignment |
| Opened | 2026-11-22 |
| Verification | `npm test -- --watch=false` (2/2 passed) |
| Reviewed | 2026-11-23 |

**Estimates:** `🟢 Small` — updated `src/app/app.spec.ts` to assert `<router-outlet>` matching `src/app/app.html` and removed `continue-on-error` in CI.
**Next action / closure evidence:** Updated `src/app/app.spec.ts` and enabled strict CI check.

</details>

---

### B-002

**Typecheck (`--noUnusedLocals`) fails with 7 unused symbols**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />Closed 2026-11-23 ([PR #3](https://github.com/voidbrain/FPVBuddy/pull/3) merged on green CI).

| | |
|---|---|
| **Issue** | `npx tsc -p tsconfig.app.json --noEmit --noUnusedLocals --noUnusedParameters` reports 2 errors in `src/app/pages/batteries/batteries.ts` (`inject`, `signal`) and 5 errors in `src/app/shared/UI/llm-ui/llm-ui.ts` (`TextGeneration`, `ToolParameter`, `ToolValue`, `getStringArg`, `TextGenerationResult`). |
| **Reproduce** | `npm run typecheck` |
| **Check** | `npm run typecheck` exits 0 and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | [PR #3](https://github.com/voidbrain/FPVBuddy/pull/3) · No test: static `--noUnusedLocals` compiler cleanup only |
| Opened | 2026-11-22 |
| Verification | `npm run typecheck` passed (0 errors) |
| Reviewed | 2026-11-23 |

**Estimates:** `🟢 Small` — removed unused symbols and `continue-on-error` in CI.
**Next action / closure evidence:** Removed unused imports/types across `batteries.ts` and `llm-ui.ts`; `npm run typecheck` passes.

</details>

---

### B-003

**Prettier formatting check fails on 20 source files**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />Closed 2026-11-23 ([PR #2](https://github.com/voidbrain/FPVBuddy/pull/2) merged on green CI).

| | |
|---|---|
| **Issue** | `npm run format:check` fails on 20 files under `src/`. |
| **Reproduce** | `npm run format:check` |
| **Check** | `npm run format:check` exits 0 and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | [PR #2](https://github.com/voidbrain/FPVBuddy/pull/2) · No test: mechanical Prettier formatting only |
| Opened | 2026-11-22 |
| Verification | `npm run format:check` passed in PR #2 CI |
| Reviewed | 2026-11-23 |

**Estimates:** `🟢 Small` — mechanical `npm run format` PR merged in PR #2.
**Next action / closure evidence:** Closed 2026-11-23 ([PR #2](https://github.com/voidbrain/FPVBuddy/pull/2)).

</details>

---

### B-004

**Resolve ESLint baseline findings across Angular templates and TypeScript**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />Closed 2026-11-23 ([PR #3](https://github.com/voidbrain/FPVBuddy/pull/3) merged on green CI).

| | |
|---|---|
| **Issue** | ESLint (`angular-eslint` + `typescript-eslint`) was newly added during harness adoption; existing files have baseline lint findings. |
| **Reproduce** | `npm run lint` |
| **Check** | `npm run lint` exits 0 and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | [PR #3](https://github.com/voidbrain/FPVBuddy/pull/3) · No test: static ESLint rule cleanup only |
| Opened | 2026-11-22 |
| Verification | `npm run lint` passed (0 errors, 0 warnings) |
| Reviewed | 2026-11-23 |

**Estimates:** `🟢 Small` — resolved all 38 baseline findings and ignored vendored `public/wasm/**`.
**Next action / closure evidence:** Fixed signal `readonly`, `viewChild()`, `header.html` button label, `public/sw.js` globals, and removed `continue-on-error` in CI.

</details>

---

### B-005

**Review unused `react` and `@types/react` dependencies in `package.json`**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P3 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />Closed 2026-11-23: removed unused `react` and `@types/react` per owner decision.

| | |
|---|---|
| **Issue** | `package.json` lists `react` and `@types/react` in an Angular v21 project (neither `src/` nor `@runanywhere/web/package.json` references `react`). |
| **Reproduce** | Inspect `package.json` and search `src/` for `react`. |
| **Check** | Dependencies either documented in `docs/agents/areas.md` or removed cleanly with `npm run build` passing. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | Baseline audit 2026-11-22 (`6b75548`) |
| Opened | 2026-11-22 |
| Verification | CI build, typecheck, lint, test pending on PR |
| Reviewed | 2026-11-22 |

**Estimates:** `🟢 Small` — one-line dependency cleanup once owner confirms.
**Next action / closure evidence:** Removed `react` and `@types/react` from `package.json` and `package-lock.json` (`No test: dependency removal only`).

</details>

---

### B-006

**Resolve 3 baseline `check:conventions` findings**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />Closed 2026-11-23 ([PR #3](https://github.com/voidbrain/FPVBuddy/pull/3) merged on green CI).

| | |
|---|---|
| **Issue** | `npm run check:conventions` reports 3 baseline problems: `src/app/pages/batteries/batteries.ts:2,9` (`CommonModule`) and `src/app/shared/UI/vision-ui/vision-ui.ts:38` (`any`). |
| **Reproduce** | `npm run check:conventions` |
| **Check** | `npm run check:conventions` exits 0 and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | [PR #3](https://github.com/voidbrain/FPVBuddy/pull/3) · No test: static Angular convention cleanup only |
| Opened | 2026-11-22 |
| Verification | `npm run check:conventions` passed (25 files, 0 issues) |
| Reviewed | 2026-11-23 |

**Estimates:** `🟢 Small` — removed unused `CommonModule` in `batteries.ts` and replaced `any` with `CaptureHandle` in `vision-ui.ts`.
**Next action / closure evidence:** `npm run check:conventions` exits 0 and `continue-on-error` removed in CI.

</details>

---

## Closed 2026-11-24

### F-002

**Reconcile project-harness v10.3.0 → v10.9.0**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />Closed 2026-11-24: PR #6 merged 2026-11-24 on green CI (check job); independent design review clean; check-harness --strict matched v10.9.0.

| | |
|---|---|
| **Issue** | `.harness.json` named v10.3.0 while the template released v10.3.1–v10.9.0 (`check:freshness` listed 9 copied files to update and 8 adapted files to reconcile). |
| **Reproduce** | `npm run check:freshness` on `main` at `e8bbff6`. |
| **Check** | `check:freshness` reports no harness update; `check:fast`-equivalent checks (format, lint, typecheck, backlog, rules, rule-load, maintenance), tests and build pass; CI on the PR is green. |

<details>
<summary>Next action, estimates and evidence</summary>

| Field | Value |
|---|---|
| PR / evidence | [PR #6](https://github.com/voidbrain/FPVBuddy/pull/6) · No test: documentation and copied-tool reconcile, no app code · Review: independent design review (coordinator session, 2026-11-24), clean to land; minors fixed (`<!-- project -->` on AGENTS project lines, this Verification line, maintenance note) |
| Opened | 2026-11-24 |
| Verification | Script: check:freshness, check:backlog, check:rules, check:rule-load, check:tooling, check:audits, check:maintenance, check-harness --strict, format:check, lint, typecheck, check:conventions, tests 2/2, build (2026-11-24, local); CI: PR #6 `check` job passed (2026-11-24) |
| Reviewed | 2026-11-24 |

**Estimates:** No remaining effort.
**Next action / closure evidence:** Closed 2026-11-24: PR #6 merged 2026-11-24 on green CI (check job); independent design review clean; check-harness --strict matched v10.9.0. Copied from v10.9.0: `tools/{friction,check-rules,work-items}.mjs`, `docs/agents/{skills,skills-discovery,parallel-work,procedures,work-usage,work-usage-launch,claims,rule-review}.md`. Adapted (reconciled from the template diff): `AGENTS.md` (landing-queue safety line, lean procedures table, Documentation section moved to `docs/backlog/documentation.md` "Top-level documents" with this project's two bullets marked `<!-- project -->`), `docs/BACKLOG-RULES.md`, `docs/backlog/{closure,documentation,estimates,records,review}.md`, `docs/agents/pull-requests.md`; new `docs/backlog/{human-action,ledger-header}.md`. `docs/agents/maintenance-review.json` is re-recorded: `maintenance.mjs review` writes only the outcomes of the review it records (by design), so the v10.2.0 adoption and v10.3.0 reconcile outcomes stay in git history (commit `ece389c`), not in the new receipt. Skipped: the optional `work:close` and `work:pr` scripts (10.7.0, 10.9.0) because `workItems.enabled` is false.

</details>

---
