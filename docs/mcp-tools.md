# FPVBuddy MCP service

The MCP endpoint exposes read-only battery data through Streamable HTTP. It listens only on `127.0.0.1:8787`; Tailscale Serve publishes it over HTTPS to the tailnet. Do not use Tailscale Funnel or bind the Node server to a LAN interface. The service rejects a missing or foreign `Host`, and rejects a present `Origin` unless it is exactly the configured `https://<tailnet-host>` origin. Non-browser MCP clients may omit `Origin`.

## Install on the Mac

Run these commands in the FPVBuddy checkout on the Mac that currently sits beside NERV-01. The checkout must include merged PR #41; a checkout from before it has no `mcp:build` script. Check it out on `main` and fast-forward before installing dependencies. Stop if the worktree has local changes rather than switching or pulling over them.

```sh
cd ~/Projects/FPVBuddy/FPVBuddy
git status --short --branch
```

Expected: the status is clean. If there are changes, stop and preserve them before proceeding. Then update the checkout:

```sh
git switch main
git pull --ff-only origin main
git log -1 --oneline
```

Expected: the log includes PR #41 or a later main commit. Confirm the Node version separately:

```sh
node --version
```

Expected: version 24. Use Node 24 for this project. If `nvm` is installed and Node 24 is available, run `nvm use 24` before continuing. Confirm the checkout has the MCP scripts:

```sh
npm run | grep -E 'mcp:(build|test)'
```

Expected: `mcp:build` and `mcp:test` are listed. If they are absent, stop; the checkout is stale or this is not the FPVBuddy repository.

Tailscale must be running and this Mac must already be signed into the intended tailnet. Check the CLI before continuing:

```sh
TS_CLI="$(command -v tailscale || true)"
if [ -z "$TS_CLI" ]; then
  TS_CLI="/Applications/Tailscale.app/Contents/MacOS/Tailscale"
fi
test -x "$TS_CLI"
"$TS_CLI" status
```

Expected: status shows this Mac's MagicDNS name. For the standalone macOS app, enable CLI integration in Tailscale Settings if `test -x` fails. The App Store app uses the bundled CLI path shown above; if neither CLI path exists, install and sign in to Tailscale before continuing.

Set `FPV_HOST` to the exact MagicDNS hostname shown by `tailscale status`; replace the example value itself and do not type angle-bracket placeholders. Then build and install:

```sh
export FPV_HOST="fpv-mac.example-tailnet.ts.net"
npm ci
npm run mcp:build
FPVBUDDY_MCP_HOST="$FPV_HOST" node tools/install-mcp-service.mjs
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/com.voidbrain.fpvbuddy-mcp.plist"
launchctl kickstart -k "gui/$(id -u)/com.voidbrain.fpvbuddy-mcp"
"$TS_CLI" serve --bg --https=443 --set-path=/fpvbuddy 127.0.0.1:8787
```

Expected results: `npm ci` completes (it may print existing dependency warnings); `npm run mcp:build` exits successfully; the installer prints the LaunchAgent plist path; `launchctl list | grep com.voidbrain.fpvbuddy-mcp` shows the service; `"$TS_CLI" serve status` shows HTTPS for `/fpvbuddy` proxying to `127.0.0.1:8787`; and `curl -i "https://${FPV_HOST}/fpvbuddy/mcp"` returns an MCP method response (a GET without an MCP session may return `405`, which confirms the HTTPS route reached the MCP endpoint). If `mcp:build` is missing, or neither Tailscale CLI path is available, stop and fix that prerequisite before running launchctl or Serve commands. `serve --bg` persists the Serve configuration across reboot. Tailscale Serve terminates HTTPS and restricts access to the tailnet; tailnet ACL policy still governs which devices can connect.

The Node service is a LaunchAgent with `RunAtLoad` and `KeepAlive`, so it restarts for the logged-in user. Logs are written to `~/Library/Logs/fpvbuddy-mcp.log` and `~/Library/Logs/fpvbuddy-mcp-error.log`. After rebuilding, restart it with:

```sh
launchctl kickstart -k "gui/$(id -u)/com.voidbrain.fpvbuddy-mcp"
```

To move the service to another base later, install the same checkout there, set that host's `FPVBUDDY_MCP_HOST`, install and start its LaunchAgent, configure its Tailscale Serve path, then update the consumer URL. The tool names and schemas remain unchanged.

## NERV client setup and owner check

On the NERV Mac, set `FPV_HOST` to the same exact MagicDNS hostname and add the tailnet URL:

```sh
export FPV_HOST="fpv-mac.example-tailnet.ts.net"
nerv tools add fpvbuddy "https://${FPV_HOST}/fpvbuddy/mcp"
nerv tools grant fpvbuddy/list_batteries --effect read
nerv tools grant fpvbuddy/get_battery --effect read
nerv tools
```

Expected results: the first command confirms the endpoint was added; each grant confirms only the named read tool; the final `nerv tools` listing shows `list_batteries` and `get_battery`, with no write tools. Call `list_batteries` and expect an empty battery list until FPVBuddy connects this service to durable storage. For the later owner-data check, expect battery summaries; call `get_battery` with an existing battery ID and expect its record, usage history, resistance history and health advice, with notes omitted.

## Tools

| Tool | Input | Output | Access |
|---|---|---|---|
| `list_batteries` | none | Battery records with identifiers and current status | Read-only |
| `get_battery` | `batteryId` | One battery, usage history, resistance history and health advice | Read-only |

The service currently creates the core's in-memory `BatteryRegistry` at process start. It demonstrates the read-only MCP contract and returns an empty list in the installed service until the durable storage adapter and backup plan are implemented. Do not enter real battery data into this in-memory service; records disappear when the process restarts. See [the F-016 storage work](BACKLOG.md#f-016).

References: [MCP Streamable HTTP transport specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports#streamable-http), [Tailscale Serve CLI](https://tailscale.com/docs/reference/tailscale-cli/serve) (including the `--set-path` mount and local proxy target), and [Apple launchd jobs](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html).
