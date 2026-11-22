# FPVBuddy Backlog

> Last updated 2026-11-23 against main `e5b8fe9`. Rules: [docs/BACKLOG-RULES.md](BACKLOG-RULES.md).

## Lifecycle

| Signal | Status | Meaning |
|:---:|---|---|
| 🟡 | **Implemented** | Code & tests exist; awaiting CI or owner confirmation |
| 🔵 | **Closed** | Verified and closed |
| 🔴 | **Open** | Accepted work not yet started |
| ⚪ | **Proposed** | Needs owner decision or triage |

## Open & active items

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
| Reviewed | 2026-11-22 |

**Estimates:** `🟢 Small` — implementation complete on `harness/agent-harness`; only PR CI verification and merge remain.
**Next action / closure evidence:** 2026-11-22: Adopted `project-harness v10.2.0` (`core` + `angular`) on `harness/agent-harness`; `check:harness`, `check:backlog`, `check:rules`, `check:tooling`, `check:conventions`, `impact-map`, and `npm run build` pass. CI runs baseline-failing checks (`B-001`–`B-004`) with `continue-on-error: true` until fixed.

</details>

---

### B-001

**Unit test `App > should render title` fails on baseline**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔴 | 🔺 P1 | Open | 🟢 Small |

💻 **→ Human action required: No**<br />Next: update `src/app/app.spec.ts` or `src/app/app.html` so the title test matches shipped UI, and remove `continue-on-error` from `.github/workflows/ci.yml`.

| | |
|---|---|
| **Issue** | `npm test -- --watch=false` fails (1 failed, 1 passed) in `src/app/app.spec.ts:21`: `expect(compiled.querySelector('h1')?.textContent).toContain('Hello...')` receives `undefined`. |
| **Reproduce** | `npm test -- --watch=false` |
| **Check** | `npm test -- --watch=false` exits 0 with all specs passing and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | Baseline audit 2026-11-22 (`6b75548`) |
| Opened | 2026-11-22 |
| Verification | Pending fix |
| Reviewed | 2026-11-22 |

**Estimates:** `🟢 Small` — single test assertion/template update in `src/app/app.spec.ts` / `src/app/app.html` and removing `continue-on-error` in CI.
**Next action / closure evidence:** Fix `App > should render title` test against current UI and re-run `npm test -- --watch=false`.

</details>

---

### B-002

**Typecheck (`--noUnusedLocals`) fails with 7 unused symbols**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔴 | 🔶 P2 | Open | 🟢 Small |

💻 **→ Human action required: No**<br />Next: remove unused imports/interface in `src/app/pages/batteries/batteries.ts` and `src/app/shared/UI/llm-ui/llm-ui.ts`, and remove `continue-on-error` from `.github/workflows/ci.yml`.

| | |
|---|---|
| **Issue** | `npx tsc -p tsconfig.app.json --noEmit --noUnusedLocals --noUnusedParameters` reports 2 errors in `src/app/pages/batteries/batteries.ts` (`inject`, `signal`) and 5 errors in `src/app/shared/UI/llm-ui/llm-ui.ts` (`TextGeneration`, `ToolParameter`, `ToolValue`, `getStringArg`, `TextGenerationResult`). |
| **Reproduce** | `npm run typecheck` |
| **Check** | `npm run typecheck` exits 0 and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | Baseline audit 2026-11-22 (`6b75548`) |
| Opened | 2026-11-22 |
| Verification | Pending fix |
| Reviewed | 2026-11-22 |

**Estimates:** `🟢 Small` — remove 7 unused imports/types across 2 files and remove `continue-on-error` in CI.
**Next action / closure evidence:** Remove unused symbols and verify `npm run typecheck` passes.

</details>

---

### B-003

**Prettier formatting check fails on 20 source files**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

💻 **→ Human action required: No**<br />Next: merge PR once CI passes.

| | |
|---|---|
| **Issue** | `npm run format:check` fails on 20 files under `src/`. |
| **Reproduce** | `npm run format:check` |
| **Check** | `npm run format:check` exits 0 and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | Baseline audit 2026-11-22 (`6b75548`) |
| Opened | 2026-11-22 |
| Verification | Pending fix |
| Reviewed | 2026-11-22 |

**Estimates:** `🟢 Small` — mechanical `npm run format` PR with no behaviour changes.
**Next action / closure evidence:** Run `npm run format` in its own PR and remove `continue-on-error` in CI.

</details>

---

### B-004

**Resolve ESLint baseline findings across Angular templates and TypeScript**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔴 | 🔶 P2 | Open | 🟡 Medium |

💻 **→ Human action required: No**<br />Next: fix or suppress baseline `npm run lint` findings and remove `continue-on-error` from `.github/workflows/ci.yml`.

| | |
|---|---|
| **Issue** | ESLint (`angular-eslint` + `typescript-eslint`) was newly added during harness adoption; existing files have baseline lint findings. |
| **Reproduce** | `npm run lint` |
| **Check** | `npm run lint` exits 0 and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | Baseline audit 2026-11-22 (`6b75548`) |
| Opened | 2026-11-22 |
| Verification | Pending fix |
| Reviewed | 2026-11-22 |

**Estimates:** `🟡 Medium` — resolve or configure baseline ESLint/accessibility findings across existing components/templates.
**Next action / closure evidence:** Run `npm run lint`, fix findings, and remove `continue-on-error` in CI.

</details>

---

### B-005

**Review unused `react` and `@types/react` dependencies in `package.json`**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔴 | 🔹 P3 | Open | 🟢 Small |

🧑 **→ Human action required: Decision**<br />Decide whether `react` (`^19.2.4`) and `@types/react` (`^19.2.14`) are needed by `@runanywhere/*` or can be removed.

| | |
|---|---|
| **Issue** | `package.json` lists `react` and `@types/react` in an Angular v21 project. |
| **Reproduce** | Inspect `package.json` and search `src/` for `react`. |
| **Check** | Dependencies either documented in `docs/agents/areas.md` or removed cleanly with `npm run build` passing. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | Baseline audit 2026-11-22 (`6b75548`) |
| Opened | 2026-11-22 |
| Verification | Pending decision |
| Reviewed | 2026-11-22 |

**Estimates:** `🟢 Small` — one-line dependency cleanup once owner confirms.
**Next action / closure evidence:** Owner decides whether to remove `react` and `@types/react`.

</details>

---

### B-006

**Resolve 3 baseline `check:conventions` findings**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔴 | 🔶 P2 | Open | 🟢 Small |

💻 **→ Human action required: No**<br />Next: replace `CommonModule` in `src/app/pages/batteries/batteries.ts` and `any` in `src/app/shared/UI/vision-ui/vision-ui.ts:38`, and remove `continue-on-error` from `.github/workflows/ci.yml`.

| | |
|---|---|
| **Issue** | `npm run check:conventions` reports 3 baseline problems: `src/app/pages/batteries/batteries.ts:2,9` (`CommonModule`) and `src/app/shared/UI/vision-ui/vision-ui.ts:38` (`any`). |
| **Reproduce** | `npm run check:conventions` |
| **Check** | `npm run check:conventions` exits 0 and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | Baseline audit 2026-11-22 (`6b75548`) |
| Opened | 2026-11-22 |
| Verification | Pending fix |
| Reviewed | 2026-11-22 |

**Estimates:** `🟢 Small` — 2 small cleanups in `batteries.ts` and `vision-ui.ts`.
**Next action / closure evidence:** Fix the 3 findings and verify `npm run check:conventions` exits 0.

</details>

---
