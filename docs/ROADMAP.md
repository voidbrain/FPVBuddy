# FPVBuddy roadmap

Milestones this repository owns. Work inside a milestone is planned as backlog records with small steps ([docs/BACKLOG.md](BACKLOG.md)); a milestone only names the outcome and its acceptance.

## Proposed next milestone (owner to confirm)

> **Proposal, not agreed.** Drafted 2026-11-24 from FPVBuddy's open work and the NERV dependency below. No record is planned from it until the owner confirms or amends it ([F-004](BACKLOG.md), decision step F-004-T03). To decide, pick one option below and say it in the session (for example: "Roadmap: option A").

| Milestone | Records | Scope | Acceptance | Status |
|---|---|---|---|---|
| M1 — FPV battery core | F-004-T03 (decision), then records planned from it | FPVBuddy hosts the FPV battery-manager core (logging charge state and internal resistance) as a plain TypeScript package with its own tests, so other projects consume it instead of keeping their own copy. | The core builds and is tested in this repository's CI; its public API is documented; a consumer can install it without the FPVBuddy app. | Proposed |

**Why this milestone.** NERV's battery-manager sharing work (nerv F-101) plans to move the battery core into the FPVBuddy repository (its step F-101-T04), then have its FPV pack (F-101-T05) and dashboard (F-101-T06) use it. That work is NERV's and stays in NERV's backlog; FPVBuddy's part is to be a home that can receive the core: a package boundary, tests and CI. FPVBuddy has no other open product work today (its backlog holds only harness records).

**Options for the owner:**

- **A — Confirm M1 as written.** The agent plans FPVBuddy records for the package boundary, CI and API docs; waits on NERV are written in record text (`depends on nerv:F-101-T04`).
- **B — Amend M1** (for example a separate repository for the core instead of FPVBuddy, or a different scope). Say what changes; the agent updates this page and plans from the amended version.
- **C — Pick a different next milestone** (an FPVBuddy app feature). Name it; M1 is dropped or moved after it.

## Done

None yet.
