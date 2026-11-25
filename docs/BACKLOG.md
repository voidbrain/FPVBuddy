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
### <a id="f-007"></a>[✨ F-007](#top)

**Upgrade Angular 21 → 22**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟡 Medium | 3 h agent + 0.25 h owner | — | [F-008-T01](#f-008-t01) | 🤖 | — | — |

💻 **→** Next: F-007-T01 — Check every dependency against Angular 22 (Planned).

| | |
|---|---|
| **Issue** | FPVBuddy is on Angular 21 (`@angular/core` ^21.2.0, `@angular/cli` ^21.2.2, `angular-eslint` ^21.4.0, TypeScript ~5.9) while NERV `web/src` and Grover `apps/client` are on 22. The solution's Angular contract (coordinator [solution:F-012](https://github.com/voidbrain/coordinator/blob/main/docs/BACKLOG.md#f-012), F-012-T01) and the shared UI library 🧱 bricks (`@voidbrain/bricks`) target 22, so FPVBuddy cannot adopt bricks (F-008) until it upgrades. Owner approval 2026-11-25. |
| **Reproduce** | `package.json` on main: every `@angular/*` package and `angular-eslint` on 21. |
| **Check** | Every `@angular/*` package and `angular-eslint` on 22 through `ng update`, with its migrations applied; every other dependency checked against 22 (TypeScript, `@angular/build` with Vitest and jsdom, Tailwind 4 through PostCSS, `@runanywhere/web*`); `check:fast`, `npm test`, `core:test` and `npm run build` pass; CI green on the PR and on main after merge; the owner opens the installed app on the phone (camera, model load, batteries page). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who |
|---|---|---|---|---|---|---|---|:---:|
| 🟢 Small | <a id="f-007-t01"></a>F-007-T01 — Check every dependency against Angular 22 | 0.5 h | 0 h | 0.5 h | Planned | — | [F-007-T02](#f-007-t02) | 🤖 |
| 🟡 Medium | <a id="f-007-t02"></a>F-007-T02 — Run ng update to 22 and apply its migrations | 1.5 h | 0 h | 1.5 h | Planned | [F-007-T01](#f-007-t01) | [F-007-T03](#f-007-t03) | ⏳ 🤖 |
| 🟢 Small | <a id="f-007-t03"></a>F-007-T03 — CI and offline build check on 22 | 1 h | 0 h | 1 h | Planned | [F-007-T02](#f-007-t02) | [F-007-T04](#f-007-t04), [F-008-T01](#f-008-t01) | ⏳ 🤖 |
| 🟢 Small | <a id="f-007-t04"></a>F-007-T04 — Owner: open the upgraded app on the phone | 0 h | 0 h | 0 h agent + 0.25 h owner | Planned | [F-007-T03](#f-007-t03) | — | ⏳ 🧑‍🔧 |
| 🟡 Medium | **Total** | 3 h | 0 h (0 of 4 steps recorded) | 3 h agent + 0.25 h owner | 0 of 4 completed | | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-007.md)

| Field | Value |
|---|---|
| PR / evidence | [#12](https://github.com/voidbrain/FPVBuddy/pull/12) (record) |
| Opened | 2026-11-25 |
| Verification | Pending |
| Reviewed | 2026-11-25 |

</details>

---
### <a id="f-008"></a>[✨ F-008](#top)

**Adopt 🧱 bricks**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟣 Very large | 13.5 h agent + 0.75 h owner | [F-007-T03](#f-007-t03), `nerv:F-130-T09` | — | ⏳ | — | — |

💻 **→** Next: F-008-T01 — Check the bricks mapping against its first release (Planned).

| | |
|---|---|
| **Issue** | FPVBuddy styles every screen with Tailwind utilities over its own Material-3-like palette in `src/styles.css` `@theme`. The solution's shared Angular UI library 🧱 bricks (`voidbrain/bricks`, package `@voidbrain/bricks`: tokens primitive → semantic → component, themes base, plain and eva, foundations, components, patterns, genUI surfaces, a live-view helper) is being built (coordinator [solution:F-012](https://github.com/voidbrain/coordinator/blob/main/docs/BACKLOG.md#f-012)). Owner request 2026-11-25. Rules: FPVBuddy restyles by theme, never by overriding a bricks component; a component joins bricks only once a project needs it; one-offs stay here. The battery views (and a fleet view, which FPVBuddy does not have yet) are shared with NERV's FPV pack ([nerv:F-101](https://github.com/voidbrain/nerv/blob/main/docs/BACKLOG.md#f-101), whose battery core moves here in F-005), so they are candidates for a bricks pattern or a later shared domain package. |
| **Reproduce** | `src/styles.css` defines `--color-*`, fonts and radii in a Tailwind `@theme`; `package.json` has no `@voidbrain/bricks`. |
| **Check** | Runs on Angular 22 (F-007); pins one `@voidbrain/bricks` release and takes its tokens with an FPVBuddy theme (today's dark palette, local fonts, offline PWA); each piece mapped below uses its bricks token, component or pattern with no local override; Tailwind utilities read bricks tokens; FPVBuddy-only pieces are listed in `docs/STYLE-GUIDE.md`; each generic piece bricks lacked is a merged bricks PR the app then uses; the owner's decision on the battery and fleet views is recorded; specs, build and CI pass; the owner's look on the phone. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who |
|---|---|---|---|---|---|---|---|:---:|
| 🟢 Small | <a id="f-008-t01"></a>F-008-T01 — Check the bricks mapping against its first release | 1 h | 0 h | 1 h | Planned | [F-007-T03](#f-007-t03) | [F-008-T02](#f-008-t02) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-008-t02"></a>F-008-T02 — Pin @voidbrain/bricks and adopt its tokens with an FPVBuddy theme | 2.5 h | 0 h | 2.5 h | Planned | [F-008-T01](#f-008-t01) | [F-008-T03](#f-008-t03) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-008-t03"></a>F-008-T03 — Primitives: buttons, input, filter toggles and badges | 2 h | 0 h | 2 h | Planned | [F-008-T02](#f-008-t02) | [F-008-T04](#f-008-t04) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-008-t04"></a>F-008-T04 — Shell: header, panels and bottom navigation | 2 h | 0 h | 2 h | Planned | [F-008-T03](#f-008-t03) | [F-008-T05](#f-008-t05) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-008-t05"></a>F-008-T05 — Batteries page: status rows, filters and empty state | 2 h | 0 h | 2 h | Planned | [F-008-T04](#f-008-t04) | [F-008-T06](#f-008-t06) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-008-t06"></a>F-008-T06 — Compare battery and fleet views with NERV; contribute missing generic pieces to bricks | 4 h | 0 h | 4 h | Planned | [F-008-T05](#f-008-t05), `nerv:F-130-T09` | [F-008-T07](#f-008-t07), [F-008-T08](#f-008-t08) | ⏳ 🤖 |
| 🟢 Small | <a id="f-008-t07"></a>F-008-T07 — Owner: battery and fleet views as a bricks pattern or a shared domain package | 0 h | 0 h | 0 h agent + 0.25 h owner | Planned | [F-008-T06](#f-008-t06) | — | ⏳ 🤔 |
| 🟢 Small | <a id="f-008-t08"></a>F-008-T08 — Owner: look at FPVBuddy on bricks on the phone | 0 h | 0 h | 0 h agent + 0.5 h owner | Planned | [F-008-T06](#f-008-t06) | — | ⏳ 🧑‍🔧 |
| 🟣 Very large | **Total** | 13.5 h | 0 h (0 of 8 steps recorded) | 13.5 h agent + 0.75 h owner | 0 of 8 completed | | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-008.md)

| Field | Value |
|---|---|
| PR / evidence | [#12](https://github.com/voidbrain/FPVBuddy/pull/12) (record) |
| Opened | 2026-11-25 |
| Verification | Pending |
| Reviewed | 2026-11-25 |

</details>

---
