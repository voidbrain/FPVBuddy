# Archived evidence 2026

## F-009

2026-11-26: cross-project audit proposal 8, accepted by the owner in chat 2026-11-26 ("accept all 17 proposals"): F-009-T03 validates surface data against the `@voidbrain/bricks` surface schemas (bricks:F-002-T02), not NERV's shared/surface.ts; a missing surface type stays a bricks proposal. PR [#24](https://github.com/voidbrain/FPVBuddy/pull/24).

2026-11-27: owner approved the MCP chain and chose the Mac beside NERV-01 for the server host. F-009-T01 documents `list_batteries` (summary) and `get_battery` (record, usage and resistance history, health advice) as read-only views over `BatteryRegistry`/`BatteryStorage`; notes and mutations stay out of the tool contract. The core currently has only its in-memory adapter, so real owner data waits for a durable backend and backup plan (F-016). F-009-T03/T04 remain dependent on bricks work; this repo will not change that dependency. PR #38 reconciled the prior backlog and added the fresh-context review evidence for #24. PR #40 documents T01's host, data and tool contract and completes F-019-T03's reviews; its CI (46007127894) is green.

2026-11-27: owner corrected F-009-T02 to a tailnet Streamable HTTP service over Tailscale Serve, protected by Host/Origin checks and installed as a macOS LaunchAgent. `docs/mcp-tools.md` contains install, start and consumer-check commands. The service uses a process-local in-memory core registry; durable owner data remains blocked on F-016.

2026-11-27: the owner's setup attempt failed before the service started: `mcp:build` was unavailable in the checkout used, the angle-bracket host placeholder was entered literally, and the Tailscale CLI was not available in that shell. PR #42 clarifies updating to #41 or later, Node 24, the MagicDNS hostname variable, and the macOS Tailscale CLI options. No Mac LaunchAgent, Serve route, or NERV connection is verified yet.
