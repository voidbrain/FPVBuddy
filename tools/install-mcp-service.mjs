import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const host = process.env['FPVBUDDY_MCP_HOST']?.trim().toLowerCase();
if (!host || !/^[a-z0-9.-]+$/.test(host) || host.startsWith('.') || host.endsWith('.')) {
  throw new Error('Set FPVBUDDY_MCP_HOST to this Mac’s tailnet DNS name, without scheme or path.');
}

const repository = resolve(fileURLToPath(new URL('..', import.meta.url)));
const node = process.execPath;
const program = join(repository, 'dist/mcp/tools/fpvbuddy-mcp.js');
const label = 'com.voidbrain.fpvbuddy-mcp';
const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>${label}</string>
  <key>ProgramArguments</key><array><string>${escapeXml(node)}</string><string>${escapeXml(program)}</string></array>
  <key>WorkingDirectory</key><string>${escapeXml(repository)}</string>
  <key>EnvironmentVariables</key><dict><key>FPVBUDDY_MCP_HOST</key><string>${escapeXml(host)}</string><key>FPVBUDDY_MCP_PORT</key><string>8787</string></dict>
  <key>RunAtLoad</key><true/><key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>${escapeXml(join(homedir(), 'Library/Logs/fpvbuddy-mcp.log'))}</string>
  <key>StandardErrorPath</key><string>${escapeXml(join(homedir(), 'Library/Logs/fpvbuddy-mcp-error.log'))}</string>
</dict></plist>
`;
const launchAgents = join(homedir(), 'Library/LaunchAgents');
await mkdir(launchAgents, { recursive: true });
const target = join(launchAgents, `${label}.plist`);
await writeFile(target, plist, { mode: 0o600 });
process.stdout.write(`Wrote ${target}\n`);
