# Reconciliation log 2026

## 2026-11-26 — main `a315ba8`

Header moved to main `a315ba8` (PRs #11 to #21 merged on green CI). Harness reconciled from v10.20.0 to v10.21.4 (F-102): six copied files byte-identical to the tag, pull-requests.md adapted, no forks.

## 2026-11-26 — main `8816987`

PRs #22 to #26 merged on green CI. #22: F-102 harness v10.21.4; #23: F-102 close (no other record); #24: F-009, F-014, F-018; #25: B-007, F-019; #26: F-020, F-021. F-005 closed in #30 (#10, #17, #20, #21 green).

## 2026-11-26 — main `e669f73`

PR #32 reconciles the harness to v10.24.1 (from 10.21.4); the owner authorised it in chat on 2026-11-26 ("ok to all") although the template backlog is not empty. CI pending at this entry.

## 2026-11-26 — harness v10.24.2

The cleanup PR reconciles the harness to v10.24.2 (from 10.24.1; project-harness B-129). The owner approved on 2026-11-26 ("yep") that coordinator-only harness files are not copied into ordinary projects: the copies of the solution dashboard, refresh and gaps pages are deleted and dropped from `.harness.json` `copied`; the procedures table and `solution-profile.md` name them as coordinator paths; AGENTS.md's solution-profile row no longer says "(refresh inside)". CI pending at this entry.
