# FPVBuddy roadmap

Milestones this repository owns. Work inside a milestone is planned as backlog records with small steps ([docs/BACKLOG.md](BACKLOG.md)); a milestone only names the outcome and its acceptance.

## Milestones

| Milestone | Records | Scope | Acceptance | Status |
|---|---|---|---|---|
| M1 — FPV battery core | F-005 | FPVBuddy hosts the FPV battery-manager core (logging charge state and internal resistance) as a plain TypeScript package with its own tests, so other projects consume it instead of keeping their own copy. | The core builds and is tested in this repository's CI; its public API is documented; a consumer can install it without the FPVBuddy app. | Agreed 2026-11-24 |

**M1 context.** NERV's battery-manager sharing work (nerv F-101) moves the battery core into this repository (its step F-101-T04), then has its FPV pack and dashboard use it (F-101-T05, F-101-T06). That work is NERV's and stays in NERV's backlog; FPVBuddy's part is the package home, its tests, documentation and CI (F-005). The owner agreed M1 as proposed on 2026-11-24 (F-004-T03, option A of: confirm, amend, or pick a different milestone).

## Done

None yet.
