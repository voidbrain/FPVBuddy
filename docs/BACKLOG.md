# FPVBuddy Backlog

> Last updated 2026-11-23 against main `2cedf90`. Rules: [docs/BACKLOG-RULES.md](BACKLOG-RULES.md).

## Lifecycle

| Signal | Status | Meaning |
|:---:|---|---|
| 🟡 | **Implemented** | Code & tests exist; awaiting CI or owner confirmation |
| 🔵 | **Closed** | Verified and closed |
| 🔴 | **Open** | Accepted work not yet started |

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

**Estimates:** `🟢 Small` — implementation complete and merged in PR #1.
**Next action / closure evidence:** Closed 2026-11-23 ([PR #1](https://github.com/voidbrain/FPVBuddy/pull/1)).

</details>

---

### B-001

**Unit test `App > should render title` fails on baseline**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔺 P1 | Implemented | 🟢 Small |

💻 **→ Human action required: No**<br />Next: merge PR once CI passes.

| | |
|---|---|
| **Issue** | `npm test -- --watch=false` fails (1 failed, 1 passed) in `src/app/app.spec.ts:21`: `expect(compiled.querySelector('h1')?.textContent).toContain('Hello...')` receives `undefined`. |
| **Reproduce** | `npm test -- --watch=false` |
| **Check** | `npm test -- --watch=false` exits 0 with all specs passing and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | [PR #3](https://github.com/voidbrain/FPVBuddy/pull/3) |
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
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

💻 **→ Human action required: No**<br />Next: merge PR once CI passes.

| | |
|---|---|
| **Issue** | `npx tsc -p tsconfig.app.json --noEmit --noUnusedLocals --noUnusedParameters` reports 2 errors in `src/app/pages/batteries/batteries.ts` (`inject`, `signal`) and 5 errors in `src/app/shared/UI/llm-ui/llm-ui.ts` (`TextGeneration`, `ToolParameter`, `ToolValue`, `getStringArg`, `TextGenerationResult`). |
| **Reproduce** | `npm run typecheck` |
| **Check** | `npm run typecheck` exits 0 and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | [PR #3](https://github.com/voidbrain/FPVBuddy/pull/3) |
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
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

💻 **→ Human action required: No**<br />Next: merge PR once CI passes.

| | |
|---|---|
| **Issue** | ESLint (`angular-eslint` + `typescript-eslint`) was newly added during harness adoption; existing files have baseline lint findings. |
| **Reproduce** | `npm run lint` |
| **Check** | `npm run lint` exits 0 and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | [PR #3](https://github.com/voidbrain/FPVBuddy/pull/3) |
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
| 🔴 | 🔹 P3 | Open | 🟢 Small |

🧑 **→ Human action required: Decision**<br />Decide whether `react` (`^19.2.4`) and `@types/react` (`^19.2.14`) are needed by `@runanywhere/*` or can be removed.

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
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

💻 **→ Human action required: No**<br />Next: merge PR once CI passes.

| | |
|---|---|
| **Issue** | `npm run check:conventions` reports 3 baseline problems: `src/app/pages/batteries/batteries.ts:2,9` (`CommonModule`) and `src/app/shared/UI/vision-ui/vision-ui.ts:38` (`any`). |
| **Reproduce** | `npm run check:conventions` |
| **Check** | `npm run check:conventions` exits 0 and `continue-on-error` removed in CI. |

<details>
<summary>Next action, estimates and evidence</summary>

| | |
|---|---|
| PR / evidence | [PR #3](https://github.com/voidbrain/FPVBuddy/pull/3) |
| Opened | 2026-11-22 |
| Verification | `npm run check:conventions` passed (25 files, 0 issues) |
| Reviewed | 2026-11-23 |

**Estimates:** `🟢 Small` — removed unused `CommonModule` in `batteries.ts` and replaced `any` with `CaptureHandle` in `vision-ui.ts`.
**Next action / closure evidence:** `npm run check:conventions` exits 0 and `continue-on-error` removed in CI.

</details>

---
