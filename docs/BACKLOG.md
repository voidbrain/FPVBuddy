# FPVBuddy Backlog

Current work ledger, reviewed 26 November 2026 against main `a315ba8` ([PR #21](https://github.com/voidbrain/FPVBuddy/pull/21) merged on green CI; harness v10.21.4 reconciled, F-102). Rules: [docs/BACKLOG-RULES.md](BACKLOG-RULES.md).

## Lifecycle

| Signal | Status | Meaning |
|:---:|---|---|
| 🟡 | **Implemented** | Code & tests exist; awaiting CI or owner confirmation |
| 🔵 | **Closed** | Verified and closed |
| 🔴 | **Open** | Accepted work not yet started |

## Open & active items

---

### <a id="b-007"></a>[🐞 B-007](#top)

**Spec files are type-checked**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 0 h | — | — | 🤖 | — | — |

💻 **→** Next: B-007-T01 — Type-check app and core specs (Implemented; verification pending).

| | |
|---|---|
| **Issue** | `typecheck` (and CI's Type check) ran `tsconfig.app.json`, which excludes `*.spec.ts`, and the FPV core's own `tsconfig` excludes its specs, which Vitest runs without checking types: a wrong call in a spec ran unchecked. Found by the coordinator's dormant-checks sweep, 2026-11-26 (T5, proposal 9). |
| **Reproduce** | On `main` `6043323`: `package.json` `typecheck` names only `tsconfig.app.json`; `src/fpv-core/tsconfig.json` excludes `**/*.spec.ts`. |
| **Check** | `npm run typecheck` (now CI's Type check step) also runs `tsc -p tsconfig.spec.json --noEmit` (all `src/**/*.spec.ts`, core specs included) and `tsc -p src/fpv-core/tsconfig.spec.json` (the core and its specs under the core's stricter options); both pass. They found no error when added, so no test changed. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-007-t01"></a>B-007-T01 — Type-check app and core specs | 0.5 h | 0 h | 0 h | Implemented; verification pending |
| 🟢 Small | **Total** | 0.5 h | 0 h (0 of 1 steps recorded) | 0 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and PR history</summary>

[Full notes & evidence](work/records/B-007.md)

| Field | Value |
|---|---|
| PR / evidence | Pending |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-005"></a>[✨ F-005](#top)

**M1 — FPV battery core package**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 0 h | — | [F-009-T01](#f-009-t01), [F-010-T01](#f-010-t01), [F-010-T03](#f-010-t03), [F-010-T05](#f-010-t05), [F-012-T01](#f-012-t01), [F-013-T01](#f-013-t01), [F-014-T01](#f-014-t01), [F-015-T02](#f-015-t02), [F-017-T01](#f-017-t01) | 🤖 | — | — |

💻 **→** Next: F-005-T02 — Bring the battery core and its tests into the package (Implemented; verification pending).

| | |
|---|---|
| **Issue** | Roadmap milestone M1, agreed by the owner 2026-11-24 (F-004-T03, option A): FPVBuddy hosts the FPV battery-manager core (logging charge state and internal resistance) as a plain TypeScript package with its own tests, so other projects consume it instead of keeping their own copy. NERV is not one of them: NERV reaches FPVBuddy over MCP (owner decision 2026-11-26, nerv:F-101-T05 cancelled). |
| **Reproduce** | Run `npm run core:build && npm run core:test && npm run core:pack-check` to build, test, pack, and install `@fpvbuddy/fpv-core` (`src/fpv-core/`) into an isolated throwaway consumer; the public API is in [docs/architecture/fpv-core.md](architecture/fpv-core.md). |
| **Check** | The core builds and is tested in this repository's CI; its public API is documented; a consumer can install it without the FPVBuddy app ([roadmap M1](ROADMAP.md#milestones)). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | PRs |
|---|---|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-005-t02"></a>F-005-T02 — Bring the battery core and its tests into the package | 1.5 h | 0 h | 0 h | Implemented; verification pending | — | [F-005-T03](#f-005-t03), [F-005-T04](#f-005-t04), [F-009-T01](#f-009-t01), [F-010-T01](#f-010-t01), [F-010-T03](#f-010-t03), [F-012-T01](#f-012-t01), [F-013-T01](#f-013-t01), [F-014-T01](#f-014-t01), [F-015-T02](#f-015-t02), [F-017-T01](#f-017-t01) | [PR #17](https://github.com/voidbrain/FPVBuddy/pull/17) battery registry, portable storage adapter, resistance health evaluation and unit tests |
| 🟢 Small | <a id="f-005-t03"></a>F-005-T03 — Document the core's public API | 0.5 h | 0 h | 0 h | Implemented; verification pending | [F-005-T02](#f-005-t02) | [F-010-T05](#f-010-t05) | [PR #20](https://github.com/voidbrain/FPVBuddy/pull/20) public API reference in docs/architecture/fpv-core.md and README link |
| 🟢 Small | <a id="f-005-t04"></a>F-005-T04 — Install check without the FPVBuddy app | 1 h | 0 h | 0 h | Implemented; verification pending | [F-005-T02](#f-005-t02) | — | [PR #21](https://github.com/voidbrain/FPVBuddy/pull/21) standalone npm pack + throwaway consumer install check and Angular/app leak guard in CI |
| 🟢 Small | **Total** | 4 h | 0 h (0 of 4 steps recorded) | 0 h | 1 of 4 completed | | | |

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
| PR / evidence | Steps: F-005-T01: [PR #10](https://github.com/voidbrain/FPVBuddy/pull/10) package boundary · F-005-T02: [PR #17](https://github.com/voidbrain/FPVBuddy/pull/17) battery registry, portable storage adapter, resistance health evaluation and unit tests · F-005-T03: [PR #20](https://github.com/voidbrain/FPVBuddy/pull/20) public API reference in docs/architecture/fpv-core.md and README link · F-005-T04: [PR #21](https://github.com/voidbrain/FPVBuddy/pull/21) standalone npm pack + throwaway consumer install check and Angular/app leak guard in CI. [#10](https://github.com/voidbrain/FPVBuddy/pull/10); [#11](https://github.com/voidbrain/FPVBuddy/pull/11); [#17](https://github.com/voidbrain/FPVBuddy/pull/17) (F-005-T02); Test: `src/fpv-core/batteries.spec.ts`, `src/fpv-core/battery-health.spec.ts` (`2296425`), `scripts/check-core-pack.test.mjs` (`22170b3`); [#18](https://github.com/voidbrain/FPVBuddy/pull/18) (NERV reaches FPVBuddy over MCP); [#21](https://github.com/voidbrain/FPVBuddy/pull/21) (F-005-T04); Review: fresh-context research subagent on PR #21 diff, no blockers, 4 minors fixed (`9e26f8a`) |
| Opened | 2026-11-24 |
| Verification | F-005-T01: green CI on PR #10 (2026-11-25). Pending: F-005-T02 ([#17](https://github.com/voidbrain/FPVBuddy/pull/17)), F-005-T03 ([#20](https://github.com/voidbrain/FPVBuddy/pull/20)) and F-005-T04 CI ([#21](https://github.com/voidbrain/FPVBuddy/pull/21)) |
| Reviewed | 2026-11-26 |

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
### <a id="f-007"></a>[✨ F-007](#top)

**Upgrade Angular 21 → 22**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔹 P3 | 🟢 Small | 0.25 h agent + 0.25 h owner | — | [F-008-T01](#f-008-t01) | 🤖 | — | — |

💻 **→** Next: F-007-T02 — Run ng update to 22 and apply its migrations (Implemented; verification pending).

| | |
|---|---|
| **Issue** | FPVBuddy is on Angular 21 (`@angular/core` ^21.2.0, `@angular/cli` ^21.2.2, `angular-eslint` ^21.4.0, TypeScript ~5.9) while NERV `web/src` and Grover `apps/client` are on 22. The solution's Angular contract (coordinator [solution:F-012](https://github.com/voidbrain/coordinator/blob/main/docs/BACKLOG.md#f-012), F-012-T01) and the shared UI library 🧱 bricks (`@voidbrain/bricks`) target 22, so FPVBuddy cannot adopt bricks (F-008) until it upgrades. Owner approval 2026-11-25. |
| **Reproduce** | `package.json` on main: every `@angular/*` package and `angular-eslint` on 21. |
| **Check** | Every `@angular/*` package and `angular-eslint` on 22 through `ng update`, with its migrations applied; every other dependency checked against 22 (TypeScript, `@angular/build` with Vitest and jsdom, Tailwind 4 through PostCSS, `@runanywhere/web*`); `check:fast`, `npm test`, `core:test` and `npm run build` pass; CI green on the PR and on main after merge; the owner opens the installed app on the phone (camera, model load, batteries page). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who | PRs |
|---|---|---|---|---|---|---|---|:---:|---|
| 🟢 Small | <a id="f-007-t02"></a>F-007-T02 — Run ng update to 22 and apply its migrations | 0.5 h | 0 h | 0 h | Implemented; verification pending | — | [F-007-T03](#f-007-t03) | 🤖 | [PR #15](https://github.com/voidbrain/FPVBuddy/pull/15) Angular 22 upgrade and migrations |
| 🟢 Small | <a id="f-007-t03"></a>F-007-T03 — CI and offline build check on 22 | 0.5 h | 0 h | 0.25 h | Implemented; verification pending | [F-007-T02](#f-007-t02) | [F-007-T04](#f-007-t04), [F-008-T01](#f-008-t01) | 🤖 | [PR #15](https://github.com/voidbrain/FPVBuddy/pull/15) headless PWA/font verification, Angular 22 docs and T04 procedure |
| 🟢 Small | <a id="f-007-t04"></a>F-007-T04 — Owner: open the upgraded app on the phone | 0 h | 0 h | 0 h agent + 0.25 h owner | Planned | [F-007-T03](#f-007-t03) | — | ⏳ 🧑‍🔧 | — |
| 🟢 Small | **Total** | 1.25 h | 0 h (0 of 4 steps recorded) | 0.25 h agent + 0.25 h owner | 1 of 4 completed | | | | |

<details><summary>Done steps (1)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| 🟢 Small | <a id="f-007-t01"></a>F-007-T01 — Check every dependency against Angular 22 | 0.25 h | 0 h | Verified | [PR #15](https://github.com/voidbrain/FPVBuddy/pull/15) dependency compatibility matrix |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-007.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-007-T01: [PR #15](https://github.com/voidbrain/FPVBuddy/pull/15) dependency compatibility matrix · F-007-T02: [PR #15](https://github.com/voidbrain/FPVBuddy/pull/15) Angular 22 upgrade and migrations · F-007-T03: [PR #15](https://github.com/voidbrain/FPVBuddy/pull/15) headless PWA/font verification, Angular 22 docs and T04 procedure. [#12](https://github.com/voidbrain/FPVBuddy/pull/12) (record); [#15](https://github.com/voidbrain/FPVBuddy/pull/15) (F-007-T01..T03); Test: `src/app/app.spec.ts` (`5fa9116`, failed on Angular 21 before upgrade); Review: independent review on PR #15 2026-11-25 (Claude Opus 5.5): migrations, versions, deprecated APIs and the Eager→OnPush switch checked; every template binding reads a signal; the phone check (F-007-T04) still covers it |
| Opened | 2026-11-25 |
| Verification | Pending CI on PR #15, merge, and owner phone check (F-007-T04) |
| Reviewed | 2026-11-25 |

</details>

---
### <a id="f-008"></a>[✨ F-008](#top)

**Adopt 🧱 bricks**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟣 Very large | 12.5 h agent + 0.5 h owner | [F-007-T03](#f-007-t03) | [F-009-T03](#f-009-t03), [F-009-T04](#f-009-t04), [F-011-T04](#f-011-t04) | ⏳ | — | — |

💻 **→** Next: F-008-T01 — Check the bricks mapping against its first release (Planned).

| | |
|---|---|
| **Issue** | FPVBuddy styles every screen with Tailwind utilities over its own Material-3-like palette in `src/styles.css` `@theme`. The solution's shared Angular UI library 🧱 bricks (`voidbrain/bricks`, package `@voidbrain/bricks`: tokens primitive → semantic → component, themes base, plain and eva, foundations, components, patterns, genUI surfaces, a live-view helper) is being built (coordinator [solution:F-012](https://github.com/voidbrain/coordinator/blob/main/docs/BACKLOG.md#f-012)). Owner request 2026-11-25. Rules: FPVBuddy restyles by theme, never by overriding a bricks component; a component joins bricks only once a project needs it; one-offs stay here. The battery views (and a fleet view, which FPVBuddy does not have yet) are shared with NERV's FPV pack ([nerv:F-101](https://github.com/voidbrain/nerv/blob/main/docs/BACKLOG.md#f-101), whose battery core moves here in F-005; NERV reaches FPVBuddy over MCP (owner decision 2026-11-26, nerv:F-101-T05 cancelled)), so they were candidates for a bricks pattern or a later shared domain package; the owner decided on 2026-11-25 (F-008-T07) that they live in FPVBuddy and NERV's FPV pack views retire once the core moves (nerv:F-101-T04); NERV shows them over MCP (F-009). |
| **Reproduce** | `src/styles.css` defines `--color-*`, fonts and radii in a Tailwind `@theme`; `package.json` has no `@voidbrain/bricks`. |
| **Check** | Runs on Angular 22 (F-007); pins one `@voidbrain/bricks` release and takes its tokens with an FPVBuddy theme (today's dark palette, local fonts, offline PWA); each piece mapped below uses its bricks token, component or pattern with no local override; Tailwind utilities read bricks tokens; FPVBuddy-only pieces are listed in `docs/STYLE-GUIDE.md`; each generic piece bricks lacked is a merged bricks PR the app then uses; the owner's decision on the battery and fleet views is recorded; specs, build and CI pass; the owner's look on the phone. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who | PRs |
|---|---|---|---|---|---|---|---|:---:|---|
| 🟢 Small | <a id="f-008-t01"></a>F-008-T01 — Check the bricks mapping against its first release | 1 h | 0 h | 1 h | Planned | [F-007-T03](#f-007-t03) | [F-008-T02](#f-008-t02) | ⏳ 🤖 | — |
| 🟡 Medium | <a id="f-008-t02"></a>F-008-T02 — Pin @voidbrain/bricks and adopt its tokens with an FPVBuddy theme | 2.5 h | 0 h | 2.5 h | Planned | [F-008-T01](#f-008-t01) | [F-008-T03](#f-008-t03), [F-009-T03](#f-009-t03) | ⏳ 🤖 | — |
| 🟡 Medium | <a id="f-008-t03"></a>F-008-T03 — Primitives: buttons, input, filter toggles and badges | 2 h | 0 h | 2 h | Planned | [F-008-T02](#f-008-t02) | [F-008-T04](#f-008-t04) | ⏳ 🤖 | — |
| 🟡 Medium | <a id="f-008-t04"></a>F-008-T04 — Shell: header, panels and bottom navigation | 2 h | 0 h | 2 h | Planned | [F-008-T03](#f-008-t03) | [F-008-T05](#f-008-t05) | ⏳ 🤖 | — |
| 🟡 Medium | <a id="f-008-t05"></a>F-008-T05 — Batteries page: status rows, filters and empty state | 2 h | 0 h | 2 h | Planned | [F-008-T04](#f-008-t04) | [F-008-T06](#f-008-t06), [F-009-T04](#f-009-t04), [F-011-T04](#f-011-t04) | ⏳ 🤖 | — |
| 🟡 Medium | <a id="f-008-t06"></a>F-008-T06 — Contribute missing generic pieces to bricks | 3 h | 0 h | 3 h | Planned | [F-008-T05](#f-008-t05) | [F-008-T08](#f-008-t08) | ⏳ 🤖 | — |
| 🟢 Small | <a id="f-008-t08"></a>F-008-T08 — Owner: look at FPVBuddy on bricks on the phone | 0 h | 0 h | 0 h agent + 0.5 h owner | Planned | [F-008-T06](#f-008-t06) | — | ⏳ 🧑‍🔧 | — |
| 🟣 Very large | **Total** | 12.5 h | 0 h (0 of 8 steps recorded) | 12.5 h agent + 0.5 h owner | 1 of 8 completed | | | | |

<details><summary>Done steps (1)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| — | <a id="f-008-t07"></a>F-008-T07 — Owner: battery and fleet views as a bricks pattern or a shared domain package | 0 h | 0 h | Completed | [PR #13](https://github.com/voidbrain/FPVBuddy/pull/13) decision |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-008.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-008-T07: [PR #13](https://github.com/voidbrain/FPVBuddy/pull/13) decision. [#12](https://github.com/voidbrain/FPVBuddy/pull/12) (record); [#18](https://github.com/voidbrain/FPVBuddy/pull/18) (NERV reaches FPVBuddy over MCP) |
| Opened | 2026-11-25 |
| Verification | Pending |
| Reviewed | 2026-11-25 |

</details>

---
### <a id="f-009"></a>[✨ F-009](#top)

**Show FPVBuddy's batteries in NERV over MCP**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🔴 Large | 8 h agent + 0.5 h owner | [F-005-T02](#f-005-t02), [F-008-T02](#f-008-t02), [F-008-T05](#f-008-t05) | [F-011-T01](#f-011-t01), [F-011-T03](#f-011-t03), [F-011-T05](#f-011-t05), [F-012-T01](#f-012-t01), [F-013-T03](#f-013-t03), [F-014-T02](#f-014-t02), [F-016-T01](#f-016-t01), [F-016-T03](#f-016-t03), [F-017-T02](#f-017-t02) | ⏳ | — | — |

💻 **→** Next: F-009-T01 — Plan FPVBuddy's MCP server: where it runs, its data and tools (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-25 (F-008-T07; coordinator rule in `docs/DOMAINS.md`, "The rule for screens", [coordinator PR #50](https://github.com/voidbrain/coordinator/pull/50)): each project owns its own screens, built with 🧱 bricks, and NERV keeps no copies. NERV shows another project's data as (a) compact genUI surface cards in chat, from the project's MCP tools returning structured data with a surface type, rendered by the matching bricks surface component in NERV's theme, and (b) full screens through MCP Apps (a UI page the project's MCP server provides) or a link to the project's own page. FPVBuddy has no MCP server today. NERV's FPV pack views retire once the battery core moves ([nerv:F-101](https://github.com/voidbrain/nerv/blob/main/docs/BACKLOG.md#f-101), F-101-T04); that retirement and NERV's consumer side stay in NERV's backlog. |
| **Reproduce** | Search the repository for an MCP server or tool definitions: there are none. |
| **Check** | An MCP server in this repository exposes read-only battery tools on the F-005 core; chat tools return surface-typed data validated against the bricks genUI contract; NERV can open the full battery screen through an MCP Apps page or a link; specs, build and CI pass; the owner sees the card and the full screen in NERV. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who |
|---|---|---|---|---|---|---|---|:---:|
| 🟢 Small | <a id="f-009-t01"></a>F-009-T01 — Plan FPVBuddy's MCP server: where it runs, its data and tools | 1 h | 0 h | 1 h | Planned | [F-005-T02](#f-005-t02) | [F-009-T02](#f-009-t02), [F-016-T01](#f-016-t01) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-009-t02"></a>F-009-T02 — MCP server with read-only battery tools | 3 h | 0 h | 3 h | Planned | [F-009-T01](#f-009-t01) | [F-009-T03](#f-009-t03), [F-009-T04](#f-009-t04), [F-011-T01](#f-011-t01), [F-012-T01](#f-012-t01), [F-013-T03](#f-013-t03), [F-014-T02](#f-014-t02), [F-016-T03](#f-016-t03), [F-017-T02](#f-017-t02) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-009-t03"></a>F-009-T03 — Battery tools return surface-typed data for bricks surface cards | 2 h | 0 h | 2 h | Planned | [F-009-T02](#f-009-t02), [F-008-T02](#f-008-t02) | [F-009-T05](#f-009-t05), [F-011-T03](#f-011-t03) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-009-t04"></a>F-009-T04 — Full battery screen for NERV: MCP Apps page or link | 2 h | 0 h | 2 h | Planned | [F-009-T02](#f-009-t02), [F-008-T05](#f-008-t05) | [F-009-T05](#f-009-t05), [F-011-T05](#f-011-t05) | ⏳ 🤖 |
| 🟢 Small | <a id="f-009-t05"></a>F-009-T05 — Owner: see FPVBuddy's battery card and full screen in NERV | 0 h | 0 h | 0 h agent + 0.5 h owner | Planned | [F-009-T03](#f-009-t03), [F-009-T04](#f-009-t04) | — | ⏳ 🧑‍🔧 |
| 🔴 Large | **Total** | 8 h | 0 h (0 of 5 steps recorded) | 8 h agent + 0.5 h owner | 0 of 5 completed | | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-009.md)

| Field | Value |
|---|---|
| PR / evidence | [#13](https://github.com/voidbrain/FPVBuddy/pull/13) (record) |
| Opened | 2026-11-25 |
| Verification | Pending |
| Reviewed | 2026-11-25 |

</details>

---
### <a id="f-010"></a>[✨ F-010](#top)

**M2 core: fleet, spares and crashes**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟣 Very large | 9.5 h | [F-005-T02](#f-005-t02), [F-005-T03](#f-005-t03) | [F-011-T01](#f-011-t01), [F-011-T02](#f-011-t02), [F-011-T04](#f-011-t04), [F-011-T06](#f-011-t06), [F-012-T03](#f-012-t03), [F-017-T01](#f-017-t01) | ⏳ | — | — |

💻 **→** Next: F-010-T01 — Fleet and parts in the core (Planned).

| | |
|---|---|
| **Issue** | Owner request 2026-11-25. NERV's [nerv:F-101](https://github.com/voidbrain/nerv/blob/main/docs/BACKLOG.md#f-101) step F-101-T04 expects the FPV core that moves into this repository to cover batteries, fleet, spares, crashes and the crash-to-battery-damage link; FPVBuddy planned only batteries (F-005, and F-009 for its MCP tools). This record moves the rest of NERV's FPV pack core (fleet and parts, spares, crashes and the damage link, fleet import) into `@fpvbuddy/fpv-core` (`src/fpv-core`), with its tests, keeping behaviour identical. NERV reaches FPVBuddy over MCP (owner decision 2026-11-26, nerv:F-101-T05 cancelled): it never imports this core, and keeps its own version until its data and tools have moved (nerv:F-101-T07 … F-101-T11, in NERV's backlog), so the owner loses nothing in between. |
| **Reproduce** | `src/fpv-core` holds no drone, part, spare or crash code; in NERV it lives in `src/fleet.ts` (tables `drones`, `drone_parts`, `drone_models`, `drone_model_links`, `spares`, `drone_crashes`) and the battery-damage branch of `handleFleetChat`. |
| **Check** | The core's fleet, parts, drone models, spares, crashes, damage link and fleet import pass tests carried over or rewritten from NERV's, with invented data and no NERV imports; the public API document covers them; core build, tests and CI pass ([roadmap M2](ROADMAP.md#milestones)). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-010-t01"></a>F-010-T01 — Fleet and parts in the core | 2.5 h | 0 h | 2.5 h | Planned | [F-005-T02](#f-005-t02) | [F-010-T02](#f-010-t02), [F-010-T04](#f-010-t04), [F-011-T01](#f-011-t01) |
| 🟡 Medium | <a id="f-010-t02"></a>F-010-T02 — Spares and warehouse in the core | 2 h | 0 h | 2 h | Planned | [F-010-T01](#f-010-t01) | [F-010-T03](#f-010-t03), [F-010-T04](#f-010-t04), [F-011-T02](#f-011-t02), [F-012-T03](#f-012-t03) |
| 🟡 Medium | <a id="f-010-t03"></a>F-010-T03 — Crashes and the crash-to-battery-damage link in the core | 2.5 h | 0 h | 2.5 h | Planned | [F-010-T02](#f-010-t02), [F-005-T02](#f-005-t02) | [F-010-T05](#f-010-t05), [F-011-T02](#f-011-t02), [F-011-T04](#f-011-t04), [F-011-T06](#f-011-t06) |
| 🟡 Medium | <a id="f-010-t04"></a>F-010-T04 — Fleet import in the core | 2 h | 0 h | 2 h | Planned | [F-010-T01](#f-010-t01), [F-010-T02](#f-010-t02) | [F-010-T05](#f-010-t05), [F-017-T01](#f-017-t01) |
| 🟢 Small | <a id="f-010-t05"></a>F-010-T05 — Document the fleet, spares and crash API | 0.5 h | 0 h | 0.5 h | Planned | [F-010-T03](#f-010-t03), [F-010-T04](#f-010-t04), [F-005-T03](#f-005-t03) | — |
| 🟣 Very large | **Total** | 9.5 h | 0 h (0 of 5 steps recorded) | 9.5 h | 0 of 5 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-010.md)

| Field | Value |
|---|---|
| PR / evidence | [#14](https://github.com/voidbrain/FPVBuddy/pull/14) (record); [#18](https://github.com/voidbrain/FPVBuddy/pull/18) (NERV reaches FPVBuddy over MCP) |
| Opened | 2026-11-25 |
| Verification | Pending |
| Reviewed | 2026-11-25 |

</details>

---
### <a id="f-011"></a>[✨ F-011](#top)

**MCP tools for fleet, spares and crashes**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟣 Very large | 12 h agent + 0.5 h owner | [F-009-T02](#f-009-t02), [F-010-T01](#f-010-t01), [F-010-T02](#f-010-t02), [F-010-T03](#f-010-t03), [F-009-T03](#f-009-t03), [F-008-T05](#f-008-t05), [F-009-T04](#f-009-t04) | — | ⏳ | — | — |

💻 **→** Next: F-011-T01 — Read-only MCP tools: list drones and drone detail (Planned).

| | |
|---|---|
| **Issue** | Owner request 2026-11-25. Following the owner decision recorded in F-008-T07 (each project owns its screens, built with 🧱 bricks; NERV shows them as surface cards and full screens, never copies), FPVBuddy's MCP server (F-009) exposes the fleet, spares and crashes of the F-010 core: read-only tools first (list drones, drone detail, spares by category with new and used counts, the answer to "spare motors left", recent crashes), then a write tool to log a crash that NERV gates as an action needing approval. Each tool returns surface-typed data for bricks surface cards, and the drones and warehouse screens open in full through an MCP Apps page or a link, as F-009 does for batteries. This lets NERV's quick buttons "Show warehouse" and "Show drones" ([nerv:F-131](https://github.com/voidbrain/nerv/blob/main/docs/BACKLOG.md#f-131), NERV's backlog) work. |
| **Reproduce** | FPVBuddy has no MCP server, no fleet tools and no drones or warehouse screen. |
| **Check** | The MCP server lists the four read-only tools and the crash-log write tool, marked as a write; chat tools return surface-typed data validated against the bricks genUI contract; FPVBuddy's drones and warehouse screens open from NERV through an MCP Apps page or a link; specs, build and CI pass; the owner sees the cards and screens and logs a crash with approval in NERV. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who |
|---|---|---|---|---|---|---|---|:---:|
| 🟡 Medium | <a id="f-011-t01"></a>F-011-T01 — Read-only MCP tools: list drones and drone detail | 2 h | 0 h | 2 h | Planned | [F-009-T02](#f-009-t02), [F-010-T01](#f-010-t01) | [F-011-T02](#f-011-t02) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-011-t02"></a>F-011-T02 — Read-only MCP tools: spares by category and recent crashes | 1.5 h | 0 h | 1.5 h | Planned | [F-011-T01](#f-011-t01), [F-010-T02](#f-010-t02), [F-010-T03](#f-010-t03) | [F-011-T03](#f-011-t03), [F-011-T06](#f-011-t06) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-011-t03"></a>F-011-T03 — Fleet tools return surface-typed data for bricks surface cards | 2 h | 0 h | 2 h | Planned | [F-011-T02](#f-011-t02), [F-009-T03](#f-009-t03) | [F-011-T07](#f-011-t07) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-011-t04"></a>F-011-T04 — Drones and warehouse screens in FPVBuddy, built with bricks | 3 h | 0 h | 3 h | Planned | [F-010-T03](#f-010-t03), [F-008-T05](#f-008-t05) | [F-011-T05](#f-011-t05) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-011-t05"></a>F-011-T05 — Full drones and warehouse screens for NERV: MCP Apps page or link | 1.5 h | 0 h | 1.5 h | Planned | [F-011-T04](#f-011-t04), [F-009-T04](#f-009-t04) | [F-011-T07](#f-011-t07) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-011-t06"></a>F-011-T06 — Write tool: log a crash, gated as an action needing approval | 2 h | 0 h | 2 h | Planned | [F-011-T02](#f-011-t02), [F-010-T03](#f-010-t03) | [F-011-T07](#f-011-t07) | ⏳ 🤖 |
| 🟢 Small | <a id="f-011-t07"></a>F-011-T07 — Owner: see drones, warehouse and a logged crash in NERV | 0 h | 0 h | 0 h agent + 0.5 h owner | Planned | [F-011-T03](#f-011-t03), [F-011-T05](#f-011-t05), [F-011-T06](#f-011-t06) | — | ⏳ 🧑‍🔧 |
| 🟣 Very large | **Total** | 12 h | 0 h (0 of 7 steps recorded) | 12 h agent + 0.5 h owner | 0 of 7 completed | | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-011.md)

| Field | Value |
|---|---|
| PR / evidence | [#14](https://github.com/voidbrain/FPVBuddy/pull/14) (record) |
| Opened | 2026-11-25 |
| Verification | Pending |
| Reviewed | 2026-11-25 |

</details>

---
### <a id="f-012"></a>[✨ F-012](#top)

**MCP write tools for batteries and spares**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🔴 Large | 5 h | [F-009-T02](#f-009-t02), [F-005-T02](#f-005-t02), [F-010-T02](#f-010-t02) | [F-015-T05](#f-015-t05) | ⏳ | — | — |

💻 **→** Next: F-012-T01 — Write-tool base and charge-state write over MCP (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 (nerv:F-101, [nerv#792](https://github.com/voidbrain/nerv/pull/792)): NERV never imports `@fpvbuddy/fpv-core`; NERV reaches FPVBuddy over MCP (nerv:F-101-T05 cancelled), and its FPV data and tools move to FPVBuddy behind FPVBuddy's MCP server. NERV's chat writes battery charge state, internal resistance, charge cycles and spares today; once its FPV code goes (nerv:F-101-T11) those writes need FPVBuddy MCP tools, each one gated in NERV as an action needing the owner's approval. Read-only tools are F-009 and F-011; the crash write is F-011-T06. This record is the FPVBuddy side of nerv:F-101-T10 ("writes (charge state, resistance, crashes) go through FPVBuddy write tools gated as actions needing approval"). F-009 and F-011 carry adopted upfront plans, so the new tools are a record of their own. |
| **Reproduce** | List FPVBuddy's planned MCP tools (F-009, F-011): only F-011-T06 writes; nothing sets charge state, resistance, cycles or spares. |
| **Check** | FPVBuddy's MCP server exposes write tools for charge state, per-cell resistance, a charge cycle, spares in and spares out, each annotated as a write so NERV gates it with approval, each applying once under a retried request id; specs, build and CI pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-012-t01"></a>F-012-T01 — Write-tool base and charge-state write over MCP | 2 h | 0 h | 2 h | Planned | [F-009-T02](#f-009-t02), [F-005-T02](#f-005-t02) | [F-012-T02](#f-012-t02), [F-012-T03](#f-012-t03), [F-015-T05](#f-015-t05) |
| 🟡 Medium | <a id="f-012-t02"></a>F-012-T02 — Write tools: internal resistance and charge cycles | 1.5 h | 0 h | 1.5 h | Planned | [F-012-T01](#f-012-t01) | — |
| 🟡 Medium | <a id="f-012-t03"></a>F-012-T03 — Write tools: spares in and out | 1.5 h | 0 h | 1.5 h | Planned | [F-012-T01](#f-012-t01), [F-010-T02](#f-010-t02) | — |
| 🔴 Large | **Total** | 5 h | 0 h (0 of 3 steps recorded) | 5 h | 0 of 3 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-012.md)

| Field | Value |
|---|---|
| PR / evidence | [#18](https://github.com/voidbrain/FPVBuddy/pull/18) (record) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-013"></a>[✨ F-013](#top)

**Battery storage reminders as FPVBuddy alerts**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🔴 Large | 4.5 h | [F-005-T02](#f-005-t02), [F-009-T02](#f-009-t02) | — | ⏳ | — | — |

💻 **→** Next: F-013-T01 — Plan storage alerts against NERV's alert contract (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 (nerv:F-101, [nerv#792](https://github.com/voidbrain/nerv/pull/792)): NERV never imports `@fpvbuddy/fpv-core`; NERV reaches FPVBuddy over MCP (nerv:F-101-T05 cancelled), and its FPV data and tools move to FPVBuddy behind FPVBuddy's MCP server. NERV reminds the owner to put a charged battery into storage (`src/battery-storage-reminders.ts`: 21:00 the same day, then after 5 days, then daily at 21:00 until stored or retired). Once NERV's FPV code goes, FPVBuddy raises these as alerts and NERV delivers them through the alert contract it built for Grover ([nerv:F-122](https://github.com/voidbrain/nerv/blob/main/docs/BACKLOG.md#f-122): an MCP tool listing open alerts with `key`, `level`, `message` and `since`; NERV delivers each `(key, since)` episode once and a clear once). This record is the FPVBuddy side of nerv:F-101-T09. |
| **Reproduce** | FPVBuddy has no schedule for storage reminders and no alerts tool. |
| **Check** | The core computes open storage alerts with NERV's timing and wording; a read-only MCP tool lists them in nerv:F-122's shape, so each stage reaches the owner once and storing the battery clears it; specs, build and CI pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-013-t01"></a>F-013-T01 — Plan storage alerts against NERV's alert contract | 1 h | 0 h | 1 h | Planned | [F-005-T02](#f-005-t02) | [F-013-T02](#f-013-t02) |
| 🟡 Medium | <a id="f-013-t02"></a>F-013-T02 — Storage alert rules in the core | 2 h | 0 h | 2 h | Planned | [F-013-T01](#f-013-t01) | [F-013-T03](#f-013-t03) |
| 🟡 Medium | <a id="f-013-t03"></a>F-013-T03 — MCP alerts tool for storage alerts | 1.5 h | 0 h | 1.5 h | Planned | [F-013-T02](#f-013-t02), [F-009-T02](#f-009-t02) | — |
| 🔴 Large | **Total** | 4.5 h | 0 h (0 of 3 steps recorded) | 4.5 h | 0 of 3 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-013.md)

| Field | Value |
|---|---|
| PR / evidence | [#18](https://github.com/voidbrain/FPVBuddy/pull/18) (record) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-014"></a>[✨ F-014](#top)

**Blackbox report over MCP**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟡 Medium | 3 h | [F-005-T02](#f-005-t02), [F-009-T02](#f-009-t02) | — | ⏳ | — | — |

💻 **→** Next: F-014-T01 — Blackbox vibration analyzer in the core (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 (nerv:F-101, [nerv#792](https://github.com/voidbrain/nerv/pull/792)): NERV never imports `@fpvbuddy/fpv-core`; NERV reaches FPVBuddy over MCP (nerv:F-101-T05 cancelled), and its FPV data and tools move to FPVBuddy behind FPVBuddy's MCP server. NERV's `fpv.blackbox_report` analyzes a blackbox log for vibration (`src/blackbox.ts`, a pure analyzer that stores nothing). It moves to FPVBuddy as a stateless MCP tool. This record is the FPVBuddy side of nerv:F-101-T10 for that tool. |
| **Reproduce** | FPVBuddy has no blackbox analyzer and no tool for it. |
| **Check** | The core's analyzer matches NERV's on carried-over specs; a read-only MCP tool returns the report for a log under a stated size cap and keeps nothing; specs, build and CI pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-014-t01"></a>F-014-T01 — Blackbox vibration analyzer in the core | 2 h | 0 h | 2 h | Planned | [F-005-T02](#f-005-t02) | [F-014-T02](#f-014-t02) |
| 🟢 Small | <a id="f-014-t02"></a>F-014-T02 — MCP tool: blackbox report | 1 h | 0 h | 1 h | Planned | [F-014-T01](#f-014-t01), [F-009-T02](#f-009-t02) | — |
| 🟡 Medium | **Total** | 3 h | 0 h (0 of 2 steps recorded) | 3 h | 0 of 2 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-014.md)

| Field | Value |
|---|---|
| PR / evidence | [#18](https://github.com/voidbrain/FPVBuddy/pull/18) (record) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-015"></a>[✨ F-015](#top)

**Builds, manufacturer docs and wiring answers**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🔴 Large | 7 h | [F-005-T02](#f-005-t02), [F-012-T01](#f-012-t01) | — | ⏳ | — | — |

💻 **→** Next: F-015-T02 — Builds, components and wiring in the core (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 (nerv:F-101, [nerv#792](https://github.com/voidbrain/nerv/pull/792)): NERV never imports `@fpvbuddy/fpv-core`; NERV reaches FPVBuddy over MCP (nerv:F-101-T05 cancelled), and its FPV data and tools move to FPVBuddy behind FPVBuddy's MCP server. NERV's `fpv.import_build`, `fpv.add_doc` and `fpv.wiring_answer` keep FPV builds, their components and wiring, manufacturer docs and answer wiring questions (`src/fpv-builds.ts`, `src/diyfpv-build.ts`). nerv:F-101-T10 moves them to FPVBuddy. **Scope pending owner confirmation (2026-11-26):** this goes beyond batteries, fleet, spares and crashes (roadmap M1/M2), so F-015-T01 asks the owner first. |
| **Reproduce** | FPVBuddy has no builds, manufacturer docs or wiring answers. |
| **Check** | The owner's scope decision is recorded; within it, the core stores builds, components, wiring and manufacturer docs, imports a DIYFPV builder link and answers wiring questions with NERV's behaviour; MCP tools expose them, the writes gated as approvals in NERV; specs, build and CI pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who | PRs |
|---|---|---|---|---|---|---|---|:---:|---|
| 🟡 Medium | <a id="f-015-t02"></a>F-015-T02 — Builds, components and wiring in the core | 2 h | 0 h | 2 h | Planned | [F-005-T02](#f-005-t02) | [F-015-T03](#f-015-t03), [F-015-T04](#f-015-t04) | ⏳ 🤖 | — |
| 🟡 Medium | <a id="f-015-t03"></a>F-015-T03 — Manufacturer docs and wiring answers in the core | 1.5 h | 0 h | 1.5 h | Planned | [F-015-T02](#f-015-t02) | [F-015-T05](#f-015-t05) | ⏳ 🤖 | — |
| 🟡 Medium | <a id="f-015-t04"></a>F-015-T04 — DIYFPV build import in the core | 1.5 h | 0 h | 1.5 h | Planned | [F-015-T02](#f-015-t02) | [F-015-T05](#f-015-t05) | ⏳ 🤖 | — |
| 🟡 Medium | <a id="f-015-t05"></a>F-015-T05 — MCP tools: import build, add doc, wiring answer | 2 h | 0 h | 2 h | Planned | [F-015-T03](#f-015-t03), [F-015-T04](#f-015-t04), [F-012-T01](#f-012-t01) | — | ⏳ 🤖 | — |
| 🔴 Large | **Total** | 7 h | 0 h (0 of 5 steps recorded) | 7 h | 1 of 5 completed | | | | |

<details><summary>Done steps (1)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| — | <a id="f-015-t01"></a>F-015-T01 — Owner: confirm builds, manufacturer docs and wiring answers move to FPVBuddy | 0 h | 0 h | Completed | [PR #19](https://github.com/voidbrain/FPVBuddy/pull/19) |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-015.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-015-T01: [PR #19](https://github.com/voidbrain/FPVBuddy/pull/19). [#18](https://github.com/voidbrain/FPVBuddy/pull/18) (record) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-016"></a>[✨ F-016](#top)

**Backup of FPVBuddy's server data**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟡 Medium | 4 h agent + 0.75 h owner | [F-009-T01](#f-009-t01), [F-009-T02](#f-009-t02) | — | ⏳ | — | — |

💻 **→** Next: F-016-T01 — Plan FPVBuddy's data backup against NERV's (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 (nerv:F-101, [nerv#792](https://github.com/voidbrain/nerv/pull/792)): NERV never imports `@fpvbuddy/fpv-core`; NERV reaches FPVBuddy over MCP (nerv:F-101-T05 cancelled), and its FPV data and tools move to FPVBuddy behind FPVBuddy's MCP server. NERV's FPV data moves into FPVBuddy (nerv:F-101-T08), whose acceptance needs FPVBuddy's data to be at least as durable as NERV's store: a nightly integrity-checked snapshot (7 kept) and a replicated standby store on a second machine (NERV-01 to NERV-02), or a gap the owner accepts before the import. FPVBuddy is an offline PWA today; where its server and data live is F-009-T01. |
| **Reproduce** | FPVBuddy has no server-side store, snapshot or off-host copy. |
| **Check** | A backup plan as good as NERV's, or a recorded owner-accepted gap; with a plan, nightly snapshots pass an integrity check, are retained and copied off the host, and the owner restores one in a drill; specs, build and CI pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who |
|---|---|---|---|---|---|---|---|:---:|
| 🟢 Small | <a id="f-016-t01"></a>F-016-T01 — Plan FPVBuddy's data backup against NERV's | 1 h | 0 h | 1 h | Planned | [F-009-T01](#f-009-t01) | [F-016-T02](#f-016-t02) | ⏳ 🤖 |
| 🟢 Small | <a id="f-016-t02"></a>F-016-T02 — Owner: accept the backup plan or the recorded gap | 0 h | 0 h | 0 h agent + 0.25 h owner | Planned | [F-016-T01](#f-016-t01) | [F-016-T03](#f-016-t03) | ⏳ 🤔 |
| 🟡 Medium | <a id="f-016-t03"></a>F-016-T03 — Nightly snapshot and off-host copy of FPVBuddy's data | 3 h | 0 h | 3 h | Planned | [F-016-T02](#f-016-t02), [F-009-T02](#f-009-t02) | [F-016-T04](#f-016-t04) | ⏳ 🤖 |
| 🟢 Small | <a id="f-016-t04"></a>F-016-T04 — Owner: restore drill | 0 h | 0 h | 0 h agent + 0.5 h owner | Planned | [F-016-T03](#f-016-t03) | — | ⏳ 🧑‍🔧 |
| 🟡 Medium | **Total** | 4 h | 0 h (0 of 4 steps recorded) | 4 h agent + 0.75 h owner | 0 of 4 completed | | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-016.md)

| Field | Value |
|---|---|
| PR / evidence | [#18](https://github.com/voidbrain/FPVBuddy/pull/18) (record) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-017"></a>[✨ F-017](#top)

**Import NERV's FPV export**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🔴 Large | 6.5 h | [F-005-T02](#f-005-t02), [F-010-T04](#f-010-t04), [F-009-T02](#f-009-t02) | — | ⏳ | — | — |

💻 **→** Next: F-017-T01 — NERV export format and mapping into FPVBuddy (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 (nerv:F-101, [nerv#792](https://github.com/voidbrain/nerv/pull/792)): NERV never imports `@fpvbuddy/fpv-core`; NERV reaches FPVBuddy over MCP (nerv:F-101-T05 cancelled), and its FPV data and tools move to FPVBuddy behind FPVBuddy's MCP server. nerv:F-101-T08 moves batteries, resistance readings, cycles, fleet, spares, crashes with their battery-damage links, builds, manufacturer docs and photo links from NERV into FPVBuddy once, checked by per-table counts on both sides and a field-by-field sample. FPVBuddy needs the receiving end: a defined format, an import that runs once, and a report to compare. Owner data, the export file and the ID map never enter Git. |
| **Reproduce** | FPVBuddy has no import for NERV's data (the core's `one-more-battery` import covers batteries from that app only). |
| **Check** | A documented, validated export format; an import with a dry run, one transaction, a run-once guard and an ID map written outside the repository; a report of counts and a sample keyed by both ids; specs on invented data, build and CI pass. The real run and the comparison with NERV's counts are nerv:F-101-T08's. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-017-t01"></a>F-017-T01 — NERV export format and mapping into FPVBuddy | 2 h | 0 h | 2 h | Planned | [F-005-T02](#f-005-t02), [F-010-T04](#f-010-t04) | [F-017-T02](#f-017-t02) |
| 🟡 Medium | <a id="f-017-t02"></a>F-017-T02 — Import command with dry run, run-once guard and ID map | 3 h | 0 h | 3 h | Planned | [F-017-T01](#f-017-t01), [F-009-T02](#f-009-t02) | [F-017-T03](#f-017-t03) |
| 🟡 Medium | <a id="f-017-t03"></a>F-017-T03 — Import report: counts and a field-by-field sample | 1.5 h | 0 h | 1.5 h | Planned | [F-017-T02](#f-017-t02) | — |
| 🔴 Large | **Total** | 6.5 h | 0 h (0 of 3 steps recorded) | 6.5 h | 0 of 3 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-017.md)

| Field | Value |
|---|---|
| PR / evidence | [#18](https://github.com/voidbrain/FPVBuddy/pull/18) (record) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-018"></a>[✨ F-018](#top)

**Turn audit enforcement on**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 0 h | — | — | 🤖 | — | — |

💻 **→** Next: F-018-T01 — Turn audit.enforce on (Implemented; verification pending).

| | |
|---|---|
| **Issue** | A full audit baseline exists (docs/audits/2026-11-20-full.md; 2026-11-22-baseline.md has manifest kind full) but `audit.enforce` was off, so a due audit only warned. The 2026-11-26 cross-project audit (coordinator, docs/audits/2026-11-26-cross-project.md, proposal 17) proposes turning it on. |
| **Reproduce** | `.harness.json` had `"audit": {"days": 7, "enforce": false}`. |
| **Check** | `audit.enforce` is true and `npm run check:audits` and `npm run check:freshness` pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | PRs |
|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-018-t01"></a>F-018-T01 — Turn audit.enforce on | 0.25 h | 0 h | 0 h | Implemented; verification pending | [PR #24](https://github.com/voidbrain/FPVBuddy/pull/24) audit.enforce true |
| 🟢 Small | **Total** | 0.25 h | 0 h (0 of 1 steps recorded) | 0 h | 0 of 1 completed | |

<details>
<summary>Next action, estimates and PR history</summary>

[Full notes & evidence](work/records/F-018.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-018-T01: [PR #24](https://github.com/voidbrain/FPVBuddy/pull/24) audit.enforce true. [#24](https://github.com/voidbrain/FPVBuddy/pull/24) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-019"></a>[✨ F-019](#top)

**Turn on the dormant procedure settings: reviews, coverage enforcement, work usage, behaviour runner**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 1 h | — | — | 🤖 | — | — |

💻 **→** Next: F-019-T01 — Reviews, coverage enforcement, work usage and behaviour runner settings (Implemented; verification pending).

| | |
|---|---|
| **Issue** | The 2026-11-26 dormant-checks sweep (coordinator `docs/audits/2026-11-26-dormant-checks.md`, rows S1, S2, S3, S5) found no periodic reviews (`reviews` unset), coverage regressions that only warn (`coverage.enforce` unset), work-usage measurement off and no `behaviour.runner`. |
| **Reproduce** | `.harness.json` on `main` `6043323`: no `reviews`, no `coverage.enforce`, `workUsage.enabled: false`, `behaviour` `{times: 3}`. |
| **Check** | `.harness.json` sets `reviews` (token, architecture, skills at 30 days), `coverage.enforce: true`, `workUsage.enabled: true` and `behaviour.runner`; the first architecture review with its outside-landscape comparison is `docs/reviews/architecture/2026-11-26.md`; CI passes with enforcement on (or a real drop is fixed or recorded). First token and skills reviews: F-019-T03. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="f-019-t01"></a>F-019-T01 — Reviews, coverage enforcement, work usage and behaviour runner settings | 0.25 h | 0 h | 0 h | Implemented; verification pending |
| 🟢 Small | <a id="f-019-t02"></a>F-019-T02 — First architecture review with outside-landscape comparison | 0.5 h | 0 h | 0 h | Implemented; verification pending |
| 🟢 Small | <a id="f-019-t03"></a>F-019-T03 — First token and skills reviews | 1 h | 0 h | 1 h | Planned |
| 🟢 Small | **Total** | 1.75 h | 0 h (0 of 3 steps recorded) | 1 h | 0 of 3 completed |

<details>
<summary>Next action, estimates and PR history</summary>

[Full notes & evidence](work/records/F-019.md)

| Field | Value |
|---|---|
| PR / evidence | Pending |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
