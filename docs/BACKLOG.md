# FPVBuddy Backlog

Current work ledger, reviewed 27 November 2026 against main `d3b1e44`. PR #40 merged on green CI (46007127894). #40 documents F-009-T01's host/data/tool plan and completes F-019-T03's token and skills reviews.

## Lifecycle

| Signal | Status | Meaning |
|:---:|---|---|
| 🟡 | **Implemented** | Code & tests exist; awaiting CI or owner confirmation |
| 🔵 | **Closed** | Verified and closed |
| 🔴 | **Open** | Accepted work not yet started |

## Open & active items

---

### <a id="f-007"></a>[✨ F-007](#top)

**Upgrade Angular 21 → 22**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔹 P3 | 🟢 Small | 0.25 h owner | — | — | — | 🧑‍🔧 | — |

🧑 **→** Next: [🧑‍🔧](acceptance/f-007-t04-phone-check.md) F-007-T04 — Owner: open the upgraded app on the phone (Planned).

| | |
|---|---|
| **Issue** | FPVBuddy is on Angular 21 (`@angular/core` ^21.2.0, `@angular/cli` ^21.2.2, `angular-eslint` ^21.4.0, TypeScript ~5.9) while NERV `web/src` and Grover `apps/client` are on 22. The solution's Angular contract (coordinator [solution:F-012](https://github.com/voidbrain/coordinator/blob/main/docs/BACKLOG.md#f-012), F-012-T01) and the shared UI library 🧱 bricks (`@voidbrain/bricks`) target 22, so FPVBuddy cannot adopt bricks (F-008) until it upgrades. Owner approval 2026-11-25. |
| **Reproduce** | `package.json` on main: every `@angular/*` package and `angular-eslint` on 21. |
| **Check** | Every `@angular/*` package and `angular-eslint` on 22 through `ng update`, with its migrations applied; every other dependency checked against 22 (TypeScript, `@angular/build` with Vitest and jsdom, Tailwind 4 through PostCSS, `@runanywhere/web*`); `check:fast`, `npm test`, `core:test` and `npm run build` pass; CI green on the PR and on main after merge; the owner opens the installed app on the phone (camera, model load, batteries page). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Who | PRs |
|---|---|---|---|---|---|:---:|---|
| 🟢 Small | <a id="f-007-t04"></a>F-007-T04 — Owner: open the upgraded app on the phone | 0 h | 0 h | 0 h agent + 0.25 h owner | Planned | [🧑‍🔧](acceptance/f-007-t04-phone-check.md) | — |
| 🟢 Small | **Total** | 1.25 h | 0 h (0 of 4 steps recorded) | 0.25 h owner | 3 of 4 completed | | |

<details><summary>Done steps (3)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| — | <a id="f-007-t01"></a>F-007-T01 — Check every dependency against Angular 22 | 0.25 h | 0 h | Completed | [PR #15](https://github.com/voidbrain/FPVBuddy/pull/15) dependency compatibility matrix |
| — | <a id="f-007-t02"></a>F-007-T02 — Run ng update to 22 and apply its migrations | 0.5 h | 0 h | Completed | [PR #15](https://github.com/voidbrain/FPVBuddy/pull/15) Angular 22 upgrade and migrations |
| — | <a id="f-007-t03"></a>F-007-T03 — CI and offline build check on 22 | 0.5 h | 0 h | Completed | [PR #15](https://github.com/voidbrain/FPVBuddy/pull/15) headless PWA/font verification, Angular 22 docs and T04 procedure |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-007.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-007-T01: [PR #15](https://github.com/voidbrain/FPVBuddy/pull/15) dependency compatibility matrix · F-007-T02: [PR #15](https://github.com/voidbrain/FPVBuddy/pull/15) Angular 22 upgrade and migrations · F-007-T03: [PR #15](https://github.com/voidbrain/FPVBuddy/pull/15) headless PWA/font verification, Angular 22 docs and T04 procedure. [#12](https://github.com/voidbrain/FPVBuddy/pull/12) (record); [#15](https://github.com/voidbrain/FPVBuddy/pull/15) (F-007-T01..T03, CI 45717571105 green); Test: `src/app/app.spec.ts` (`5fa9116`, failed on Angular 21 before upgrade); Review: independent review on PR #15 2026-11-25 (Claude Opus 5.5): migrations, versions, deprecated APIs and the Eager→OnPush switch checked; every template binding reads a signal; the phone check (F-007-T04) still covers it |
| Opened | 2026-11-25 |
| Verification | Unit/integration · 2026-11-27 · #15 CI 45717571105 (`check` job) and post-merge `main` runs green; Browser/accessibility · 2026-11-25 · headless Chromium `/batteries`, `/sw.js`, local woff2 fonts; Real-device · Pending (F-007-T04 owner phone check) |
| Reviewed | 2026-11-27 |

</details>

---
### <a id="f-008"></a>[✨ F-008](#top)

**Adopt 🧱 bricks**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟣 Very large | 12.5 h agent + 0.5 h owner | — | [F-009-T03](#f-009-t03), [F-009-T04](#f-009-t04), [F-011-T04](#f-011-t04), [F-025-T01](#f-025-t01) | 🤖 | — | — |

💻 **→** Next: F-008-T01 — Check the bricks mapping against its first release (Planned).

| | |
|---|---|
| **Issue** | FPVBuddy styles every screen with Tailwind utilities over its own Material-3-like palette in `src/styles.css` `@theme`. The solution's shared Angular UI library 🧱 bricks (`voidbrain/bricks`, package `@voidbrain/bricks`: tokens primitive → semantic → component, themes base, plain and eva, foundations, components, patterns, genUI surfaces, a live-view helper) is being built (coordinator [solution:F-012](https://github.com/voidbrain/coordinator/blob/main/docs/BACKLOG.md#f-012)). Owner request 2026-11-25. Rules: FPVBuddy restyles by theme, never by overriding a bricks component; a component joins bricks only once a project needs it; one-offs stay here. The battery views (and a fleet view, which FPVBuddy does not have yet) are shared with NERV's FPV pack ([nerv:F-101](https://github.com/voidbrain/nerv/blob/main/docs/BACKLOG.md#f-101), whose battery core moves here in F-005; NERV reaches FPVBuddy over MCP (owner decision 2026-11-26, nerv:F-101-T05 cancelled)), so they were candidates for a bricks pattern or a later shared domain package; the owner decided on 2026-11-25 (F-008-T07) that they live in FPVBuddy and NERV's FPV pack views retire once the core moves (nerv:F-101-T04); NERV shows them over MCP (F-009). |
| **Reproduce** | `src/styles.css` defines `--color-*`, fonts and radii in a Tailwind `@theme`; `package.json` has no `@voidbrain/bricks`. |
| **Check** | Runs on Angular 22 (F-007); pins one `@voidbrain/bricks` release and takes its tokens with an FPVBuddy theme (today's dark palette, local fonts, offline PWA); each piece mapped below uses its bricks token, component or pattern with no local override; Tailwind utilities read bricks tokens; FPVBuddy-only pieces are listed in `docs/STYLE-GUIDE.md`; each generic piece bricks lacked is a merged bricks PR the app then uses; the owner's decision on the battery and fleet views is recorded; specs, build and CI pass; the owner's look on the phone. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who | PRs |
|---|---|---|---|---|---|---|---|:---:|---|
| 🟢 Small | <a id="f-008-t01"></a>F-008-T01 — Check the bricks mapping against its first release | 1 h | 0 h | 1 h | Planned | — | [F-008-T02](#f-008-t02) | 🤖 | — |
| 🟡 Medium | <a id="f-008-t02"></a>F-008-T02 — Pin @voidbrain/bricks and adopt its tokens with an FPVBuddy theme | 2.5 h | 0 h | 2.5 h | Planned | [F-008-T01](#f-008-t01) | [F-008-T03](#f-008-t03), [F-009-T03](#f-009-t03), [F-025-T01](#f-025-t01) | ⏳ 🤖 | — |
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
| 🔴 Open | 🔹 P3 | 🔴 Large | 7 h agent + 0.5 h owner | [F-008-T02](#f-008-t02), [F-008-T05](#f-008-t05) | [F-011-T01](#f-011-t01), [F-011-T03](#f-011-t03), [F-011-T05](#f-011-t05), [F-012-T01](#f-012-t01), [F-013-T03](#f-013-t03), [F-014-T02](#f-014-t02), [F-016-T03](#f-016-t03), [F-017-T02](#f-017-t02), [F-022-T02](#f-022-t02), [F-024-T03](#f-024-t03) | 🤖 | — | — |

💻 **→** Next: F-009-T02 — MCP server with read-only battery tools (Implemented; verification pending).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-25 (F-008-T07; coordinator rule in `docs/DOMAINS.md`, "The rule for screens", [coordinator PR #50](https://github.com/voidbrain/coordinator/pull/50)): each project owns its own screens, built with 🧱 bricks, and NERV keeps no copies. NERV shows another project's data as (a) compact genUI surface cards in chat, from the project's MCP tools returning structured data with a surface type, rendered by the matching bricks surface component in NERV's theme, and (b) full screens through MCP Apps (a UI page the project's MCP server provides) or a link to the project's own page. FPVBuddy has no MCP server today. NERV's FPV pack views retire once the battery core moves ([nerv:F-101](https://github.com/voidbrain/nerv/blob/main/docs/BACKLOG.md#f-101), F-101-T04); that retirement and NERV's consumer side stay in NERV's backlog. |
| **Reproduce** | Search the repository for an MCP server or tool definitions: there are none. |
| **Check** | An MCP server in this repository exposes read-only battery tools on the F-005 core; chat tools return surface-typed data validated against the bricks genUI contract; NERV can open the full battery screen through an MCP Apps page or a link; specs, build and CI pass; the owner sees the card and the full screen in NERV. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who | PRs |
|---|---|---|---|---|---|---|---|:---:|---|
| 🟡 Medium | <a id="f-009-t02"></a>F-009-T02 — MCP server with read-only battery tools | 3 h | 0 h | 3 h | Implemented; verification pending | — | [F-009-T03](#f-009-t03), [F-009-T04](#f-009-t04), [F-011-T01](#f-011-t01), [F-012-T01](#f-012-t01), [F-013-T03](#f-013-t03), [F-014-T02](#f-014-t02), [F-016-T03](#f-016-t03), [F-017-T02](#f-017-t02), [F-022-T02](#f-022-t02), [F-024-T03](#f-024-t03) | 🤖 | — |
| 🟡 Medium | <a id="f-009-t03"></a>F-009-T03 — Battery tools return surface-typed data for bricks surface cards | 2 h | 0 h | 2 h | Planned | [F-009-T02](#f-009-t02), [F-008-T02](#f-008-t02) | [F-009-T05](#f-009-t05), [F-011-T03](#f-011-t03) | ⏳ 🤖 | — |
| 🟡 Medium | <a id="f-009-t04"></a>F-009-T04 — Full battery screen for NERV: MCP Apps page or link | 2 h | 0 h | 2 h | Planned | [F-009-T02](#f-009-t02), [F-008-T05](#f-008-t05) | [F-009-T05](#f-009-t05), [F-011-T05](#f-011-t05) | ⏳ 🤖 | — |
| 🟢 Small | <a id="f-009-t05"></a>F-009-T05 — Owner: see FPVBuddy's battery card and full screen in NERV | 0 h | 0 h | 0 h agent + 0.5 h owner | Planned | [F-009-T03](#f-009-t03), [F-009-T04](#f-009-t04) | — | ⏳ 🧑‍🔧 | — |
| 🔴 Large | **Total** | 8 h | 0 h (0 of 5 steps recorded) | 7 h agent + 0.5 h owner | 1 of 5 completed | | | | |

<details><summary>Done steps (1)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| 🟢 Small | <a id="f-009-t01"></a>F-009-T01 — Plan FPVBuddy's MCP server: where it runs, its data and tools | 1 h | 0 h | Verified | [PR #40](https://github.com/voidbrain/FPVBuddy/pull/40) |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-009.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-009-T01: [PR #40](https://github.com/voidbrain/FPVBuddy/pull/40). [#13](https://github.com/voidbrain/FPVBuddy/pull/13) (record); [#24](https://github.com/voidbrain/FPVBuddy/pull/24) (CI 45791229262 green); [#38](https://github.com/voidbrain/FPVBuddy/pull/38) (reconciled #22–#37 and added #24 review evidence); [#40](https://github.com/voidbrain/FPVBuddy/pull/40) (T01 plan; CI 46007127894 green); T02 implementation in [#41](https://github.com/voidbrain/FPVBuddy/pull/41). Review: fresh-context design review 2026-11-27, findings fixed in #41. |
| Opened | 2026-11-25 |
| Verification | Documentation · 2026-11-27 · #40 documents the T01 plan; T02 tools and tailnet service setup documented in [#41](https://github.com/voidbrain/FPVBuddy/pull/41) · Owner Mac and NERV client check pending |
| Reviewed | 2026-11-27 |

</details>

---
### <a id="f-010"></a>[✨ F-010](#top)

**M2 core: fleet, spares and crashes**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟣 Very large | 9.5 h | — | [F-011-T01](#f-011-t01), [F-011-T02](#f-011-t02), [F-011-T04](#f-011-t04), [F-011-T06](#f-011-t06), [F-012-T03](#f-012-t03), [F-017-T01](#f-017-t01), [F-024-T01](#f-024-t01), [F-024-T02](#f-024-t02) | 🤖 | — | — |

💻 **→** Next: F-010-T01 — Fleet and parts in the core (Planned).

| | |
|---|---|
| **Issue** | Owner request 2026-11-25. NERV's [nerv:F-101](https://github.com/voidbrain/nerv/blob/main/docs/BACKLOG.md#f-101) step F-101-T04 expects the FPV core that moves into this repository to cover batteries, fleet, spares, crashes and the crash-to-battery-damage link; FPVBuddy planned only batteries (F-005, and F-009 for its MCP tools). This record moves the rest of NERV's FPV pack core (fleet and parts, spares, crashes and the damage link, fleet import) into `@fpvbuddy/fpv-core` (`src/fpv-core`), with its tests, keeping behaviour identical. NERV reaches FPVBuddy over MCP (owner decision 2026-11-26, nerv:F-101-T05 cancelled): it never imports this core, and keeps its own version until its data and tools have moved (nerv:F-101-T07 … F-101-T11, in NERV's backlog), so the owner loses nothing in between. |
| **Reproduce** | `src/fpv-core` holds no drone, part, spare or crash code; in NERV it lives in `src/fleet.ts` (tables `drones`, `drone_parts`, `drone_models`, `drone_model_links`, `spares`, `drone_crashes`) and the battery-damage branch of `handleFleetChat`. |
| **Check** | The core's fleet, parts, drone models, spares, crashes, damage link and fleet import pass tests carried over or rewritten from NERV's, with invented data and no NERV imports; the public API document covers them; core build, tests and CI pass ([roadmap M2](ROADMAP.md#milestones)). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-010-t01"></a>F-010-T01 — Fleet and parts in the core | 2.5 h | 0 h | 2.5 h | Planned | — | [F-010-T02](#f-010-t02), [F-010-T04](#f-010-t04), [F-011-T01](#f-011-t01) |
| 🟡 Medium | <a id="f-010-t02"></a>F-010-T02 — Spares and warehouse in the core | 2 h | 0 h | 2 h | Planned | [F-010-T01](#f-010-t01) | [F-010-T03](#f-010-t03), [F-010-T04](#f-010-t04), [F-011-T02](#f-011-t02), [F-012-T03](#f-012-t03), [F-024-T02](#f-024-t02) |
| 🟡 Medium | <a id="f-010-t03"></a>F-010-T03 — Crashes and the crash-to-battery-damage link in the core | 2.5 h | 0 h | 2.5 h | Planned | [F-010-T02](#f-010-t02) | [F-010-T05](#f-010-t05), [F-011-T02](#f-011-t02), [F-011-T04](#f-011-t04), [F-011-T06](#f-011-t06), [F-024-T01](#f-024-t01) |
| 🟡 Medium | <a id="f-010-t04"></a>F-010-T04 — Fleet import in the core | 2 h | 0 h | 2 h | Planned | [F-010-T01](#f-010-t01), [F-010-T02](#f-010-t02) | [F-010-T05](#f-010-t05), [F-017-T01](#f-017-t01) |
| 🟢 Small | <a id="f-010-t05"></a>F-010-T05 — Document the fleet, spares and crash API | 0.5 h | 0 h | 0.5 h | Planned | [F-010-T03](#f-010-t03), [F-010-T04](#f-010-t04) | — |
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
| 🔴 Open | 🔹 P3 | 🟣 Very large | 12 h agent + 0.5 h owner | [F-009-T02](#f-009-t02), [F-010-T01](#f-010-t01), [F-010-T02](#f-010-t02), [F-010-T03](#f-010-t03), [F-009-T03](#f-009-t03), [F-008-T05](#f-008-t05), [F-009-T04](#f-009-t04) | [F-022-T03](#f-022-t03) | ⏳ | — | — |

💻 **→** Next: F-011-T01 — Read-only MCP tools: list drones and drone detail (Planned).

| | |
|---|---|
| **Issue** | Owner request 2026-11-25. Following the owner decision recorded in F-008-T07 (each project owns its screens, built with 🧱 bricks; NERV shows them as surface cards and full screens, never copies), FPVBuddy's MCP server (F-009) exposes the fleet, spares and crashes of the F-010 core: read-only tools first (list drones, drone detail, spares by category with new and used counts, the answer to "spare motors left", recent crashes), then a write tool to log a crash that NERV gates as an action needing approval. Each tool returns surface-typed data for bricks surface cards, and the drones and warehouse screens open in full through an MCP Apps page or a link, as F-009 does for batteries. This lets NERV's quick buttons "Show warehouse" and "Show drones" ([nerv:F-131](https://github.com/voidbrain/nerv/blob/main/docs/BACKLOG.md#f-131), NERV's backlog) work. |
| **Reproduce** | FPVBuddy has no MCP server, no fleet tools and no drones or warehouse screen. |
| **Check** | The MCP server lists the four read-only tools and the crash-log write tool, marked as a write; chat tools return surface-typed data validated against the bricks genUI contract; FPVBuddy's drones and warehouse screens open from NERV through an MCP Apps page or a link; specs, build and CI pass; the owner sees the cards and screens and logs a crash with approval in NERV. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who |
|---|---|---|---|---|---|---|---|:---:|
| 🟡 Medium | <a id="f-011-t01"></a>F-011-T01 — Read-only MCP tools: list drones and drone detail | 2 h | 0 h | 2 h | Planned | [F-009-T02](#f-009-t02), [F-010-T01](#f-010-t01) | [F-011-T02](#f-011-t02), [F-022-T03](#f-022-t03) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-011-t02"></a>F-011-T02 — Read-only MCP tools: spares by category and recent crashes | 1.5 h | 0 h | 1.5 h | Planned | [F-011-T01](#f-011-t01), [F-010-T02](#f-010-t02), [F-010-T03](#f-010-t03) | [F-011-T03](#f-011-t03), [F-011-T06](#f-011-t06) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-011-t03"></a>F-011-T03 — Fleet tools return surface-typed data for bricks surface cards | 2 h | 0 h | 2 h | Planned | [F-011-T02](#f-011-t02), [F-009-T03](#f-009-t03) | [F-011-T07](#f-011-t07) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-011-t04"></a>F-011-T04 — Drones and warehouse screens in FPVBuddy, built with bricks | 3 h | 0 h | 3 h | Planned | [F-010-T03](#f-010-t03), [F-008-T05](#f-008-t05) | [F-011-T05](#f-011-t05) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-011-t05"></a>F-011-T05 — Full drones and warehouse screens for NERV: MCP Apps page or link | 1.5 h | 0 h | 1.5 h | Planned | [F-011-T04](#f-011-t04), [F-009-T04](#f-009-t04) | [F-011-T07](#f-011-t07) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-011-t06"></a>F-011-T06 — Write tool: log a crash, gated as an action needing approval | 2 h | 0 h | 2 h | Planned | [F-011-T02](#f-011-t02), [F-010-T03](#f-010-t03) | [F-011-T07](#f-011-t07), [F-022-T03](#f-022-t03) | ⏳ 🤖 |
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
| 🔴 Open | 🔹 P3 | 🔴 Large | 5 h | [F-009-T02](#f-009-t02), [F-010-T02](#f-010-t02) | [F-015-T05](#f-015-t05), [F-022-T02](#f-022-t02), [F-022-T03](#f-022-t03) | ⏳ | — | — |

💻 **→** Next: F-012-T01 — Write-tool base and charge-state write over MCP (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 (nerv:F-101, [nerv#792](https://github.com/voidbrain/nerv/pull/792)): NERV never imports `@fpvbuddy/fpv-core`; NERV reaches FPVBuddy over MCP (nerv:F-101-T05 cancelled), and its FPV data and tools move to FPVBuddy behind FPVBuddy's MCP server. NERV's chat writes battery charge state, internal resistance, charge cycles and spares today; once its FPV code goes (nerv:F-101-T11) those writes need FPVBuddy MCP tools, each one gated in NERV as an action needing the owner's approval. Read-only tools are F-009 and F-011; the crash write is F-011-T06. This record is the FPVBuddy side of nerv:F-101-T10 ("writes (charge state, resistance, crashes) go through FPVBuddy write tools gated as actions needing approval"). F-009 and F-011 carry adopted upfront plans, so the new tools are a record of their own. |
| **Reproduce** | List FPVBuddy's planned MCP tools (F-009, F-011): only F-011-T06 writes; nothing sets charge state, resistance, cycles or spares. |
| **Check** | FPVBuddy's MCP server exposes write tools for charge state, per-cell resistance, a charge cycle, spares in and spares out, each annotated as a write so NERV gates it with approval, each applying once under a retried request id; specs, build and CI pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-012-t01"></a>F-012-T01 — Write-tool base and charge-state write over MCP | 2 h | 0 h | 2 h | Planned | [F-009-T02](#f-009-t02) | [F-012-T02](#f-012-t02), [F-012-T03](#f-012-t03), [F-015-T05](#f-015-t05), [F-022-T02](#f-022-t02) |
| 🟡 Medium | <a id="f-012-t02"></a>F-012-T02 — Write tools: internal resistance and charge cycles | 1.5 h | 0 h | 1.5 h | Planned | [F-012-T01](#f-012-t01) | — |
| 🟡 Medium | <a id="f-012-t03"></a>F-012-T03 — Write tools: spares in and out | 1.5 h | 0 h | 1.5 h | Planned | [F-012-T01](#f-012-t01), [F-010-T02](#f-010-t02) | [F-022-T03](#f-022-t03) |
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
| 🔴 Open | 🔹 P3 | 🔴 Large | 4.5 h | [F-009-T02](#f-009-t02) | [F-024-T01](#f-024-t01), [F-024-T02](#f-024-t02) | 🤖 | — | — |

💻 **→** Next: F-013-T01 — Plan storage alerts against NERV's alert contract (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 (nerv:F-101, [nerv#792](https://github.com/voidbrain/nerv/pull/792)): NERV never imports `@fpvbuddy/fpv-core`; NERV reaches FPVBuddy over MCP (nerv:F-101-T05 cancelled), and its FPV data and tools move to FPVBuddy behind FPVBuddy's MCP server. NERV reminds the owner to put a charged battery into storage (`src/battery-storage-reminders.ts`: 21:00 the same day, then after 5 days, then daily at 21:00 until stored or retired). Once NERV's FPV code goes, FPVBuddy raises these as alerts and NERV delivers them through the alert contract it built for Grover ([nerv:F-122](https://github.com/voidbrain/nerv/blob/main/docs/BACKLOG.md#f-122): an MCP tool listing open alerts with `key`, `level`, `message` and `since`; NERV delivers each `(key, since)` episode once and a clear once). This record is the FPVBuddy side of nerv:F-101-T09. |
| **Reproduce** | FPVBuddy has no schedule for storage reminders and no alerts tool. |
| **Check** | The core computes open storage alerts with NERV's timing and wording; a read-only MCP tool lists them in nerv:F-122's shape, so each stage reaches the owner once and storing the battery clears it; specs, build and CI pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-013-t01"></a>F-013-T01 — Plan storage alerts against NERV's alert contract | 1 h | 0 h | 1 h | Planned | — | [F-013-T02](#f-013-t02), [F-024-T01](#f-024-t01) |
| 🟡 Medium | <a id="f-013-t02"></a>F-013-T02 — Storage alert rules in the core | 2 h | 0 h | 2 h | Planned | [F-013-T01](#f-013-t01) | [F-013-T03](#f-013-t03), [F-024-T02](#f-024-t02) |
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
| 🔴 Open | 🔹 P3 | 🟡 Medium | 3 h | [F-009-T02](#f-009-t02) | — | 🤖 | — | — |

💻 **→** Next: F-014-T01 — Blackbox vibration analyzer in the core (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 (nerv:F-101, [nerv#792](https://github.com/voidbrain/nerv/pull/792)): NERV never imports `@fpvbuddy/fpv-core`; NERV reaches FPVBuddy over MCP (nerv:F-101-T05 cancelled), and its FPV data and tools move to FPVBuddy behind FPVBuddy's MCP server. NERV's `fpv.blackbox_report` analyzes a blackbox log for vibration (`src/blackbox.ts`, a pure analyzer that stores nothing). It moves to FPVBuddy as a stateless MCP tool. This record is the FPVBuddy side of nerv:F-101-T10 for that tool. |
| **Reproduce** | FPVBuddy has no blackbox analyzer and no tool for it. |
| **Check** | The core's analyzer matches NERV's on carried-over specs; a read-only MCP tool returns the report for a log under a stated size cap and keeps nothing; specs, build and CI pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-014-t01"></a>F-014-T01 — Blackbox vibration analyzer in the core | 2 h | 0 h | 2 h | Planned | — | [F-014-T02](#f-014-t02) |
| 🟢 Small | <a id="f-014-t02"></a>F-014-T02 — MCP tool: blackbox report | 1 h | 0 h | 1 h | Planned | [F-014-T01](#f-014-t01), [F-009-T02](#f-009-t02) | — |
| 🟡 Medium | **Total** | 3 h | 0 h (0 of 2 steps recorded) | 3 h | 0 of 2 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-014.md)

| Field | Value |
|---|---|
| PR / evidence | [#18](https://github.com/voidbrain/FPVBuddy/pull/18) (record); [#24](https://github.com/voidbrain/FPVBuddy/pull/24) (CI 45791229262 green) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-27 |

</details>

---
### <a id="f-015"></a>[✨ F-015](#top)

**Builds, manufacturer docs and wiring answers**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🔴 Large | 8 h | [F-012-T01](#f-012-t01), [F-022-T01](#f-022-t01) | — | 🤖 | — | — |

💻 **→** Next: F-015-T02 — Builds, components and wiring in the core (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 (nerv:F-101, [nerv#792](https://github.com/voidbrain/nerv/pull/792)): NERV never imports `@fpvbuddy/fpv-core`; NERV reaches FPVBuddy over MCP (nerv:F-101-T05 cancelled), and its FPV data and tools move to FPVBuddy behind FPVBuddy's MCP server. NERV's `fpv.import_build`, `fpv.add_doc` and `fpv.wiring_answer` keep FPV builds, their components and wiring, manufacturer docs and answer wiring questions (`src/fpv-builds.ts`, `src/diyfpv-build.ts`). nerv:F-101-T10 moves them to FPVBuddy. **Scope pending owner confirmation (2026-11-26):** this goes beyond batteries, fleet, spares and crashes (roadmap M1/M2), so F-015-T01 asks the owner first. |
| **Reproduce** | FPVBuddy has no builds, manufacturer docs or wiring answers. |
| **Check** | The owner's scope decision is recorded; within it, the core stores builds, components, wiring and manufacturer docs, imports a DIYFPV builder link and answers wiring questions with NERV's behaviour; MCP tools expose them, the writes gated as approvals in NERV; specs, build and CI pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who | PRs |
|---|---|---|---|---|---|---|---|:---:|---|
| 🟡 Medium | <a id="f-015-t02"></a>F-015-T02 — Builds, components and wiring in the core | 2 h | 0 h | 2 h | Planned | — | [F-015-T03](#f-015-t03), [F-015-T04](#f-015-t04) | 🤖 | — |
| 🟡 Medium | <a id="f-015-t03"></a>F-015-T03 — Manufacturer docs and wiring answers in the core | 1.5 h | 0 h | 1.5 h | Planned | [F-015-T02](#f-015-t02) | [F-015-T05](#f-015-t05), [F-015-T06](#f-015-t06) | ⏳ 🤖 | — |
| 🟡 Medium | <a id="f-015-t04"></a>F-015-T04 — DIYFPV build import in the core | 1.5 h | 0 h | 1.5 h | Planned | [F-015-T02](#f-015-t02) | [F-015-T05](#f-015-t05) | ⏳ 🤖 | — |
| 🟡 Medium | <a id="f-015-t05"></a>F-015-T05 — MCP tools: import build, add doc, wiring answer | 2 h | 0 h | 2 h | Planned | [F-015-T03](#f-015-t03), [F-015-T04](#f-015-t04), [F-012-T01](#f-012-t01) | — | ⏳ 🤖 | — |
| 🟢 Small | <a id="f-015-t06"></a>F-015-T06 — Wiring-answer cases from cited sources, Italian and English | 1 h | 0 h | 1 h | Planned | [F-015-T03](#f-015-t03), [F-022-T01](#f-022-t01) | — | ⏳ 🤖 | [PR #31](https://github.com/voidbrain/FPVBuddy/pull/31) plan |
| 🔴 Large | **Total** | 8 h | 0 h (0 of 6 steps recorded) | 8 h | 1 of 6 completed | | | | |

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
| PR / evidence | Steps: F-015-T01: [PR #19](https://github.com/voidbrain/FPVBuddy/pull/19) · F-015-T06: [PR #31](https://github.com/voidbrain/FPVBuddy/pull/31) plan. [#18](https://github.com/voidbrain/FPVBuddy/pull/18) (record); [#19](https://github.com/voidbrain/FPVBuddy/pull/19) (F-015-T01); [#31](https://github.com/voidbrain/FPVBuddy/pull/31) (F-015-T06, green CI) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-27 |

</details>

---
### <a id="f-016"></a>[✨ F-016](#top)

**Backup of FPVBuddy's server data**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟡 Medium | 4 h agent + 0.75 h owner | [F-009-T02](#f-009-t02) | — | 🤖 | — | — |

💻 **→** Next: F-016-T01 — Plan FPVBuddy's data backup against NERV's (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 (nerv:F-101, [nerv#792](https://github.com/voidbrain/nerv/pull/792)): NERV never imports `@fpvbuddy/fpv-core`; NERV reaches FPVBuddy over MCP (nerv:F-101-T05 cancelled), and its FPV data and tools move to FPVBuddy behind FPVBuddy's MCP server. NERV's FPV data moves into FPVBuddy (nerv:F-101-T08), whose acceptance needs FPVBuddy's data to be at least as durable as NERV's store: a nightly integrity-checked snapshot (7 kept) and a replicated standby store on a second machine (NERV-01 to NERV-02), or a gap the owner accepts before the import. FPVBuddy is an offline PWA today; where its server and data live is F-009-T01. |
| **Reproduce** | FPVBuddy has no server-side store, snapshot or off-host copy. |
| **Check** | A backup plan as good as NERV's, or a recorded owner-accepted gap; with a plan, nightly snapshots pass an integrity check, are retained and copied off the host, and the owner restores one in a drill; specs, build and CI pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who |
|---|---|---|---|---|---|---|---|:---:|
| 🟢 Small | <a id="f-016-t01"></a>F-016-T01 — Plan FPVBuddy's data backup against NERV's | 1 h | 0 h | 1 h | Planned | — | [F-016-T02](#f-016-t02) | 🤖 |
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
| 🔴 Open | 🔶 P2 | 🔴 Large | 6.5 h | [F-010-T04](#f-010-t04), [F-009-T02](#f-009-t02) | [F-024-T05](#f-024-t05) | ⏳ | — | — |

💻 **→** Next: F-017-T01 — NERV export format and mapping into FPVBuddy (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 (nerv:F-101, [nerv#792](https://github.com/voidbrain/nerv/pull/792)): NERV never imports `@fpvbuddy/fpv-core`; NERV reaches FPVBuddy over MCP (nerv:F-101-T05 cancelled), and its FPV data and tools move to FPVBuddy behind FPVBuddy's MCP server. nerv:F-101-T08 moves batteries, resistance readings, cycles, fleet, spares, crashes with their battery-damage links, builds, manufacturer docs and photo links from NERV into FPVBuddy once, checked by per-table counts on both sides and a field-by-field sample. FPVBuddy needs the receiving end: a defined format, an import that runs once, and a report to compare. Owner data, the export file and the ID map never enter Git. |
| **Reproduce** | FPVBuddy has no import for NERV's data (the core's `one-more-battery` import covers batteries from that app only). |
| **Check** | A documented, validated export format; an import with a dry run, one transaction, a run-once guard and an ID map written outside the repository; a report of counts and a sample keyed by both ids; specs on invented data, build and CI pass. The real run and the comparison with NERV's counts are nerv:F-101-T08's. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-017-t01"></a>F-017-T01 — NERV export format and mapping into FPVBuddy | 2 h | 0 h | 2 h | Planned | [F-010-T04](#f-010-t04) | [F-017-T02](#f-017-t02) |
| 🟡 Medium | <a id="f-017-t02"></a>F-017-T02 — Import command with dry run, run-once guard and ID map | 3 h | 0 h | 3 h | Planned | [F-017-T01](#f-017-t01), [F-009-T02](#f-009-t02) | [F-017-T03](#f-017-t03) |
| 🟡 Medium | <a id="f-017-t03"></a>F-017-T03 — Import report: counts and a field-by-field sample | 1.5 h | 0 h | 1.5 h | Planned | [F-017-T02](#f-017-t02) | [F-024-T05](#f-024-t05) |
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
### <a id="f-019"></a>[✨ F-019](#top)

**Turn on the dormant procedure settings: reviews, coverage enforcement, work usage, behaviour runner**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 0 h | — | — | — | — | — |

💻 **→** Next: all steps closed; verify and close the record.

| | |
|---|---|
| **Issue** | The 2026-11-26 dormant-checks sweep (coordinator `docs/audits/2026-11-26-dormant-checks.md`, rows S1, S2, S3, S5) found no periodic reviews (`reviews` unset), coverage regressions that only warn (`coverage.enforce` unset), work-usage measurement off and no `behaviour.runner`. |
| **Reproduce** | `.harness.json` on `main` `6043323`: no `reviews`, no `coverage.enforce`, `workUsage.enabled: false`, `behaviour` `{times: 3}`. |
| **Check** | `.harness.json` sets `reviews` (token, architecture, skills at 30 days), `coverage.enforce: true`, `workUsage.enabled: true` and `behaviour.runner`; the first architecture review with its outside-landscape comparison is `docs/reviews/architecture/2026-11-26.md`; CI passes with enforcement on (or a real drop is fixed or recorded). First token and skills reviews: F-019-T03. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | PRs |
|---|---|---|---|---|---|---|
| 🟢 Small | **Total** | 1.75 h | 0 h (0 of 3 steps recorded) | 0 h | 3 of 3 completed | |

<details><summary>Done steps (3)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| — | <a id="f-019-t01"></a>F-019-T01 — Reviews, coverage enforcement, work usage and behaviour runner settings | 0.25 h | 0 h | Completed | [PR #25](https://github.com/voidbrain/FPVBuddy/pull/25) |
| — | <a id="f-019-t02"></a>F-019-T02 — First architecture review with outside-landscape comparison | 0.5 h | 0 h | Completed | [PR #25](https://github.com/voidbrain/FPVBuddy/pull/25) |
| 🟢 Small | <a id="f-019-t03"></a>F-019-T03 — First token and skills reviews | 1 h | 0 h | Verified | [PR #40](https://github.com/voidbrain/FPVBuddy/pull/40) |

</details>

<details>
<summary>Next action, estimates and PR history</summary>

[Full notes & evidence](work/records/F-019.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-019-T01: [PR #25](https://github.com/voidbrain/FPVBuddy/pull/25) · F-019-T02: [PR #25](https://github.com/voidbrain/FPVBuddy/pull/25) · F-019-T03: [PR #40](https://github.com/voidbrain/FPVBuddy/pull/40). [#25](https://github.com/voidbrain/FPVBuddy/pull/25) (CI 45798003125 green); [#40](https://github.com/voidbrain/FPVBuddy/pull/40) (F-019-T03 reviews; CI 46007127894 green) |
| Opened | 2026-11-26 |
| Verification | Unit/integration · 2026-11-27 · F-019-T01 and F-019-T02 verified in #25 CI 45798003125 (coverage enforced, architecture review current); Documentation · 2026-11-27 · F-019-T03 review documents and #40 CI 46007127894 |
| Reviewed | 2026-11-27 |

</details>

---
### <a id="f-020"></a>[✨ F-020](#top)

**Axe accessibility pass per main route in the browser suite**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟡 Medium | 3.5 h | — | — | 🤖 | — | — |

💻 **→** Next: F-020-T01 — Axe pass per main route with a seeded-violation fixture (Planned).

| | |
|---|---|
| **Issue** | NERV, bricks and openbando run axe in browser tests; FPVBuddy has no accessibility check beyond contrast, so a missing label, a keyboard trap or a bad ARIA role would pass CI. There is no browser suite at all (tests run with `ng test`), so this step also adds the runner. Evidence: [NERV practices transfer report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md), inventory 13; class A item A10; missing practice M12. Owner decision 2026-11-26 in chat: "NERV practices inventory accept all" (all 22 proposals of the [report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md); this record is proposal 17). |
| **Reproduce** | Read the CI workflow and the test scripts of FPVBuddy: no axe run. Main routes: `/` and `batteries`. |
| **Check** | One axe pass per main route (`/` and `batteries`) fails on serious and critical violations and reports moderate ones, proved by a seeded-violation fixture that fails first (F-020-T01); CI runs it on every PR (F-020-T02). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | PRs |
|---|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-020-t01"></a>F-020-T01 — Axe pass per main route with a seeded-violation fixture | 2.5 h | 0 h | 2.5 h | Planned | — | [F-020-T02](#f-020-t02) | [PR #26](https://github.com/voidbrain/FPVBuddy/pull/26) plan |
| 🟢 Small | <a id="f-020-t02"></a>F-020-T02 — Run the axe pass in CI | 1 h | 0 h | 1 h | Planned | [F-020-T01](#f-020-t01) | — | [PR #26](https://github.com/voidbrain/FPVBuddy/pull/26) plan |
| 🟡 Medium | **Total** | 3.5 h | 0 h (0 of 2 steps recorded) | 3.5 h | 0 of 2 completed | | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-020.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-020-T01: [PR #26](https://github.com/voidbrain/FPVBuddy/pull/26) plan · F-020-T02: [PR #26](https://github.com/voidbrain/FPVBuddy/pull/26) plan. [#26](https://github.com/voidbrain/FPVBuddy/pull/26) (plan, green CI); [report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md); owner decision 2026-11-26 |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-27 |

</details>

---
### <a id="f-021"></a>[✨ F-021](#top)

**Roadmap status check**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 1 h | — | — | 🤖 | — | — |

💻 **→** Next: F-021-T01 — Roadmap status tool and CI check (Planned).

| | |
|---|---|
| **Issue** | FPVBuddy keeps `docs/ROADMAP.md` by hand; nerv generates milestone status from the records (`tools/roadmap-status.mjs`, BACKLOG-RULES "Roadmap"), so a milestone cannot say "done" while its steps are open. Evidence: [NERV practices transfer report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md), inventory 15; class B item B3. Owner decision 2026-11-26 in chat: "NERV practices inventory accept all" (all 22 proposals of the [report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md); this record is proposal 21). |
| **Reproduce** | Read `docs/ROADMAP.md` of FPVBuddy and compare each milestone's status with its records: nothing checks them. |
| **Check** | A roadmap status tool generates milestone status from the records and `--check` in `check:fast` and CI fails when `docs/ROADMAP.md` is stale (F-021-T01). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | PRs |
|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-021-t01"></a>F-021-T01 — Roadmap status tool and CI check | 1 h | 0 h | 1 h | Planned | [PR #26](https://github.com/voidbrain/FPVBuddy/pull/26) plan |
| 🟢 Small | **Total** | 1 h | 0 h (0 of 1 steps recorded) | 1 h | 0 of 1 completed | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-021.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-021-T01: [PR #26](https://github.com/voidbrain/FPVBuddy/pull/26) plan. [#26](https://github.com/voidbrain/FPVBuddy/pull/26) (plan, green CI); [report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md); owner decision 2026-11-26 |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-27 |

</details>

---
### <a id="f-022"></a>[✨ F-022](#top)

**Gauntlet pack for FPVBuddy's MCP tools (fpvbuddy-v1), Italian and English**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟡 Medium | 3 h | [F-009-T02](#f-009-t02), [F-012-T01](#f-012-t01), [F-011-T01](#f-011-t01), [F-011-T06](#f-011-t06), [F-012-T03](#f-012-t03) | [F-015-T06](#f-015-t06) | 🤖 | — | — |

💻 **→** Next: F-022-T01 — Pin gauntlet-protocol, validate in CI and record the skips (Planned).

| | |
|---|---|
| **Issue** | Once NERV's FPV tools move here, NERV's models call FPVBuddy's battery, fleet, spares and crash tools, several of them writes, and no case checks the tool, its arguments or the approval. The owner phrases are Italian ("carica le batterie 7 e 8 blu", nerv:F-008; "ho crashato Smoke, motore sinistro inferiore rotto … quanti ne sono rimasti di scorta (nuovi/usati)?", nerv:F-098); a spare count changes only when the phrase says a spare was used. Owner decision 2026-11-26 in chat: "ok to all" (accepts proposals 1 to 3 of the shared-asset review, solution:F-016-T05); same message: "nerv and all modules will need to work with Italian". |
| **Reproduce** | `ls evals/gauntlet` finds nothing; `grep gauntlet package.json` finds no pin. |
| **Check** | `evals/gauntlet/fpvbuddy-v1.json`, model layer, regression and holdout splits, Italian and English phrases, exact-json, invented batteries and drones; `gauntlet validate` in CI from a pinned devDependency; a test that every tool a case names is registered; the skips are recorded (storage reminders: deterministic; Blackbox report: deterministic analyzer; import of NERV's export F-017: no model); NERV runs the pack (nerv:F-120-T11). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | PRs |
|---|---|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-022-t01"></a>F-022-T01 — Pin gauntlet-protocol, validate in CI and record the skips | 0.5 h | 0 h | 0.5 h | Planned | — | [F-015-T06](#f-015-t06), [F-022-T02](#f-022-t02) | [PR #31](https://github.com/voidbrain/FPVBuddy/pull/31) plan |
| 🟡 Medium | <a id="f-022-t02"></a>F-022-T02 — Battery cases, Italian and English | 1.25 h | 0 h | 1.25 h | Planned | [F-022-T01](#f-022-t01), [F-009-T02](#f-009-t02), [F-012-T01](#f-012-t01) | [F-022-T03](#f-022-t03) | [PR #31](https://github.com/voidbrain/FPVBuddy/pull/31) plan |
| 🟡 Medium | <a id="f-022-t03"></a>F-022-T03 — Fleet, spares and crash cases, Italian and English | 1.25 h | 0 h | 1.25 h | Planned | [F-022-T02](#f-022-t02), [F-011-T01](#f-011-t01), [F-011-T06](#f-011-t06), [F-012-T03](#f-012-t03) | — | [PR #31](https://github.com/voidbrain/FPVBuddy/pull/31) plan |
| 🟡 Medium | **Total** | 3 h | 0 h (0 of 3 steps recorded) | 3 h | 0 of 3 completed | | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-022.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-022-T01: [PR #31](https://github.com/voidbrain/FPVBuddy/pull/31) plan · F-022-T02: [PR #31](https://github.com/voidbrain/FPVBuddy/pull/31) plan · F-022-T03: [PR #31](https://github.com/voidbrain/FPVBuddy/pull/31) plan. [#31](https://github.com/voidbrain/FPVBuddy/pull/31) (plan, green CI); [review page](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-shared-assets/gauntlet-fpvbuddy.md); owner decision 2026-11-26 |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-27 |

</details>

---
### <a id="f-023"></a>[✨ F-023](#top)

**Retire the on-device assistant and vision demo**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟡 Medium | 2.25 h | — | — | 🤖 | — | — |

💻 **→** Next: F-023-T02 — Remove the footer assistant and the vision demo from the UI (Planned).

| | |
|---|---|
| **Issue** | `src/app/shared/UI/llm-ui/llm-ui.ts` and `vision-ui/vision-ui.ts` put a 450M model (`lfm2-vl-450m-q4_0`) in the app footer on `main` with no record: an assistant that calls `chargeBattery`, `dischargeBattery` and `storeBattery` whose handlers only log, gated by an English-only keyword list (an Italian phrase such as "carica la batteria" is not let through), and a camera-frame description demo (`src/workers/vlm-worker.ts`). Neither has a Gauntlet case or a recorded skip. Options in plain words: [decision page](https://github.com/voidbrain/FPVBuddy/blob/main/docs/decisions/on-device-assistant.md). Owner decision 2026-11-26 in chat: "ok to all" (accepts proposals 1 to 3 of the shared-asset review, solution:F-016-T05); same message: "nerv and all modules will need to work with Italian". **Owner decision 2026-11-26 in chat: "A"** (retire the on-device assistant and the vision demo), with "vision capabilities ideally on nerv too" (nerv:F-142, Vision in chat). |
| **Reproduce** | Open the app, the footer assistant answers "carica la batteria" with nothing (keyword gate) and "charge the battery" with a logged call only. |
| **Check** | Decision A (2026-11-26) is carried out with no dead code: the footer assistant and vision demo components (F-023-T02), `model.service.ts`, `runanywhere.ts`, the VLM worker, the `@runanywhere/*` dependencies, the wasm asset, `build:worker` and any stored model state (F-023-T03) are gone; docs no longer describe them and a browser check shows the app working without them (F-023-T04). The inert scaffold controls from commit 6b75548 go too (owner 2026-11-26, "1 remove"): the footer Scan QR and camera buttons and the header battery-filter checkboxes, which have no handler or binding (F-023-T05). Italian: the removed assistant had an English-only gate; no Italian-facing model feature remains in FPVBuddy, and image understanding moves to NERV (nerv:F-142). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who | PRs |
|---|---|---|---|---|---|---|---|:---:|---|
| 🟢 Small | <a id="f-023-t02"></a>F-023-T02 — Remove the footer assistant and the vision demo from the UI | 0.5 h | 0 h | 0.5 h | Planned | — | [F-023-T03](#f-023-t03) | 🤖 | [PR #33](https://github.com/voidbrain/FPVBuddy/pull/33) decision A and removal plan |
| 🟢 Small | <a id="f-023-t05"></a>F-023-T05 — Remove the inert scaffold controls: actions-bar and batteries-filters | 0.5 h | 0 h | 0.5 h | Planned | — | — | 🤖 | [PR #34](https://github.com/voidbrain/FPVBuddy/pull/34) plan |
| 🟢 Small | <a id="f-023-t03"></a>F-023-T03 — Remove the model runtime, worker, dependencies and their state | 0.75 h | 0 h | 0.75 h | Planned | [F-023-T02](#f-023-t02) | [F-023-T04](#f-023-t04) | ⏳ 🤖 | [PR #33](https://github.com/voidbrain/FPVBuddy/pull/33) decision A and removal plan |
| 🟢 Small | <a id="f-023-t04"></a>F-023-T04 — Update the docs and check the app in the browser | 0.5 h | 0 h | 0.5 h | Planned | [F-023-T03](#f-023-t03) | — | ⏳ 🤖 | [PR #33](https://github.com/voidbrain/FPVBuddy/pull/33) decision A and removal plan |
| 🟡 Medium | **Total** | 2.25 h | 0 h (0 of 5 steps recorded) | 2.25 h | 1 of 5 completed | | | | |

<details><summary>Done steps (1)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| — | <a id="f-023-t01"></a>F-023-T01 — Owner decides: retire, make real, or keep as experiments | 0 h | 0 h | Completed | [PR #31](https://github.com/voidbrain/FPVBuddy/pull/31) plan; [PR #33](https://github.com/voidbrain/FPVBuddy/pull/33) decision A and removal plan |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-023.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-023-T01: [PR #31](https://github.com/voidbrain/FPVBuddy/pull/31) plan; [PR #33](https://github.com/voidbrain/FPVBuddy/pull/33) decision A and removal plan · F-023-T02: [PR #33](https://github.com/voidbrain/FPVBuddy/pull/33) decision A and removal plan · F-023-T03: [PR #33](https://github.com/voidbrain/FPVBuddy/pull/33) decision A and removal plan · F-023-T04: [PR #33](https://github.com/voidbrain/FPVBuddy/pull/33) decision A and removal plan · F-023-T05: [PR #34](https://github.com/voidbrain/FPVBuddy/pull/34) plan. [#31](https://github.com/voidbrain/FPVBuddy/pull/31) (plan, green CI); decision A and removal plan: [#33](https://github.com/voidbrain/FPVBuddy/pull/33) (green CI); scaffold removal plan (T05): [#34](https://github.com/voidbrain/FPVBuddy/pull/34) (green CI); [review page](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-shared-assets/gauntlet-fpvbuddy.md); owner decision 2026-11-26 |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-27 |

</details>

---
### <a id="f-024"></a>[✨ F-024](#top)

**fpv_preflight: a read-only pre-flight assessment over MCP**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🔴 Large | 5.5 h agent + 0.25 h owner | [F-010-T03](#f-010-t03), [F-013-T01](#f-013-t01), [F-010-T02](#f-010-t02), [F-013-T02](#f-013-t02), [F-009-T02](#f-009-t02), [F-017-T03](#f-017-t03) | — | ⏳ | — | — |

💻 **→** Next: F-024-T01 — Plan fpv&#95;preflight: rules, thresholds and the Italian-friendly output shape (Planned).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26 in chat: "y" to a pre-flight check (earlier: "pre flight check, ok", and the check must use the owner's real data). NERV is to prepare the owner's flight ("prepara il volo di sabato"): [nerv:F-146](https://github.com/voidbrain/nerv/blob/main/docs/work/records/F-146.md) is a skill that calls one FPVBuddy tool and adds the weather and reminders. FPVBuddy owns the FPV data and rules (nerv:F-101), so the assessment is FPVBuddy's: a deterministic, read-only `fpv_preflight` tool that says which batteries are ready, need a storage charge or have a check due, which drones are flagged after a crash or with a damaged part, and which spares are low. FPVBuddy has no separate repair record; the plan treats a damaged installed part or an unresolved crash as an open repair (F-024-T01 states it). Field names and descriptions come in Italian and English because the owner works in Italian. |
| **Reproduce** | List FPVBuddy's planned MCP tools (F-009, F-011, F-012, F-013): none answers "is the fleet ready to fly". |
| **Check** | `fpv_preflight` returns, from the F-005 and F-010 cores, the verdict per battery, drone and spare category with a reason, read-only, with Italian and English labels; specs on invented data cover each verdict and an empty fleet; the owner confirms the verdicts against the real fleet after the import (T01 … T05). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who |
|---|---|---|---|---|---|---|---|:---:|
| 🟢 Small | <a id="f-024-t01"></a>F-024-T01 — Plan fpv&#95;preflight: rules, thresholds and the Italian-friendly output shape | 1 h | 0 h | 1 h | Planned | [F-010-T03](#f-010-t03), [F-013-T01](#f-013-t01) | [F-024-T02](#f-024-t02) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-024-t02"></a>F-024-T02 — Pre-flight assessment in the core | 2 h | 0 h | 2 h | Planned | [F-024-T01](#f-024-t01), [F-010-T02](#f-010-t02), [F-013-T02](#f-013-t02) | [F-024-T03](#f-024-t03) | ⏳ 🤖 |
| 🟡 Medium | <a id="f-024-t03"></a>F-024-T03 — MCP tool fpv&#95;preflight, read-only | 1.5 h | 0 h | 1.5 h | Planned | [F-024-T02](#f-024-t02), [F-009-T02](#f-009-t02) | [F-024-T04](#f-024-t04), [F-024-T05](#f-024-t05) | ⏳ 🤖 |
| 🟢 Small | <a id="f-024-t04"></a>F-024-T04 — Document fpv&#95;preflight and add its Gauntlet case | 1 h | 0 h | 1 h | Planned | [F-024-T03](#f-024-t03) | — | ⏳ 🤖 |
| 🟢 Small | <a id="f-024-t05"></a>F-024-T05 — Owner: check fpv&#95;preflight against the real fleet after the import | 0 h | 0 h | 0 h agent + 0.25 h owner | Planned | [F-024-T03](#f-024-t03), [F-017-T03](#f-017-t03) | — | ⏳ 🧑‍🔧 |
| 🔴 Large | **Total** | 5.5 h | 0 h (0 of 5 steps recorded) | 5.5 h agent + 0.25 h owner | 0 of 5 completed | | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-024.md)

| Field | Value |
|---|---|
| PR / evidence | Plan: [#36](https://github.com/voidbrain/FPVBuddy/pull/36) (green CI) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-27 |

</details>

---
### <a id="f-025"></a>[✨ F-025](#top)

**Use the 🧱 bricks charts: battery resistance and cycles, flights**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟡 Medium | 2.5 h | [F-008-T02](#f-008-t02) | — | ⏳ | — | — |

💻 **→** Next: F-025-T01 — Per-cell internal resistance over cycles as a bricks line chart (Planned).

| | |
|---|---|
| **Issue** | Owner request 2026-11-26 (late evening): bricks plans shared chart components (line, bar, stacked bar, donut) in 🧱 bricks:F-014; FPVBuddy is a consumer and owns its adoption here. FPVBuddy keeps per-cell internal resistance history and charge cycles (`src/fpv-core/battery-health.ts`, `batteries.ts`) but shows them as numbers only. Waits on the bricks release with the charts (bricks:F-014-T07) and on FPVBuddy adopting bricks (F-008-T02). |
| **Reproduce** | The batteries page lists status and values; no chart shows resistance or cycles over time. |
| **Check** | A battery's per-cell internal resistance over its cycles is a bricks line chart on its detail view, with the retirement threshold as a band (F-025-T01); cycles per week (and flights per week once FPVBuddy records flights) show as a bricks bar chart (F-025-T02); both pass their tests and axe in light and dark. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | PRs |
|---|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-025-t01"></a>F-025-T01 — Per-cell internal resistance over cycles as a bricks line chart | 1.5 h | 0 h | 1.5 h | Planned | [F-008-T02](#f-008-t02) | [F-025-T02](#f-025-t02) | [PR #37](https://github.com/voidbrain/FPVBuddy/pull/37) plan |
| 🟢 Small | <a id="f-025-t02"></a>F-025-T02 — Cycles per week (and flights, once recorded) as a bricks bar chart | 1 h | 0 h | 1 h | Planned | [F-025-T01](#f-025-t01) | — | [PR #37](https://github.com/voidbrain/FPVBuddy/pull/37) plan |
| 🟡 Medium | **Total** | 2.5 h | 0 h (0 of 2 steps recorded) | 2.5 h | 0 of 2 completed | | | |

<details>
<summary>Next action, estimates and PR history</summary>

[Full notes & evidence](work/records/F-025.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-025-T01: [PR #37](https://github.com/voidbrain/FPVBuddy/pull/37) plan · F-025-T02: [PR #37](https://github.com/voidbrain/FPVBuddy/pull/37) plan. Plan: [#37](https://github.com/voidbrain/FPVBuddy/pull/37) (CI 45906439831 green); [#39](https://github.com/voidbrain/FPVBuddy/pull/39) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-27 |

</details>

---
