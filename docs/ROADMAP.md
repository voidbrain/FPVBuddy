# FPVBuddy roadmap

Milestones this repository owns. Work inside a milestone is planned as backlog records with small steps ([docs/BACKLOG.md](BACKLOG.md)); a milestone only names the outcome and its acceptance.

## Milestones

| Milestone | Records | Scope | Acceptance | Status |
|---|---|---|---|---|
| M1 — FPV battery core | F-005 | FPVBuddy hosts the FPV battery-manager core (logging charge state and internal resistance) as a plain TypeScript package with its own tests, so other projects consume it instead of keeping their own copy. | The core builds and is tested in this repository's CI; its public API is documented; a consumer can install it without the FPVBuddy app. | Agreed 2026-11-24 |
| M2 — FPV fleet, spares and crashes core | F-010, F-011 | The FPV core also covers fleet and parts, spares, crashes with the crash-to-battery-damage link, and fleet import, moved from NERV's FPV pack with behaviour unchanged; FPVBuddy's MCP server exposes them to NERV. | The core's fleet, spares, crash and import operations are tested in this repository's CI and documented; the MCP tools return surface-typed data and open the drones and warehouse screens from NERV. | Agreed 2026-11-25 |

**M1 context.** NERV's battery-manager sharing work (nerv F-101) moves the battery core into this repository (its step F-101-T04), then has its FPV pack and dashboard use it (F-101-T05, F-101-T06). That work is NERV's and stays in NERV's backlog; FPVBuddy's part is the package home, its tests, documentation and CI (F-005). The owner agreed M1 as proposed on 2026-11-24 (F-004-T03, option A of: confirm, amend, or pick a different milestone).

**M2 context.** NERV's F-101-T04 expects the core to cover batteries, fleet, spares, crashes and the crash-to-battery-damage link; M1 covers batteries only. The owner asked for M2 on 2026-11-25. NERV keeps its own version until FPVBuddy's is live (nerv:F-101-T07, NERV's backlog).

## Done

None yet.
