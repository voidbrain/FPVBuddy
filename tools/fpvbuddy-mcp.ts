import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import { toNodeHandler } from '@modelcontextprotocol/node';
import { z } from 'zod';
import { BatteryRegistry } from '../src/fpv-core/index.js';

export interface FpvBuddyMcpOptions {
  registry: BatteryRegistry;
  allowedHost: string;
}

function normalizedHost(value: string | string[] | undefined): string | undefined {
  if (typeof value !== 'string') return undefined;
  try {
    const parsed = new URL(`http://${value}`);
    if (parsed.username || parsed.password) return undefined;
    return parsed.hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

function reject(response: ServerResponse, status: number, message: string): void {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify({ error: message }));
}

export function isAllowedMcpRequest(hostHeader: string | string[] | undefined, origin: string | string[] | undefined, allowedHost: string): boolean {
  const host = normalizedHost(hostHeader);
  if (!host || host !== allowedHost.toLowerCase()) return false;

  if (origin === undefined) return true;
  if (typeof origin !== 'string') return false;
  try {
    const parsed = new URL(origin);
    return (
      !parsed.username &&
      !parsed.password &&
      parsed.protocol === 'https:' &&
      parsed.hostname.toLowerCase() === allowedHost.toLowerCase() &&
      parsed.port === ''
    );
  } catch {
    return false;
  }
}

function validRequest(request: IncomingMessage, allowedHost: string): boolean {
  return isAllowedMcpRequest(request.headers.host, request.headers.origin, allowedHost);
}

export function createFpvBuddyMcpHandler(options: FpvBuddyMcpOptions) {
  const allowedHost = options.allowedHost.trim().toLowerCase();
  if (!/^[a-z0-9.-]+$/.test(allowedHost) || allowedHost.startsWith('.') || allowedHost.endsWith('.')) {
    throw new Error('FPVBUDDY_MCP_HOST must be a DNS hostname without scheme, path, or port.');
  }

  const createServerInstance = () => {
    const server = new McpServer({ name: 'fpvbuddy', version: '1.0.0' });
    server.registerTool(
      'list_batteries',
      {
        title: 'List batteries',
        description: 'List FPVBuddy batteries with their identifying and current-status fields. Italiano: elenca le batterie FPVBuddy e il loro stato attuale.',
        inputSchema: z.object({}),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async () => ({
        content: [{ type: 'text', text: JSON.stringify({ batteries: options.registry.list() }) }],
        structuredContent: { batteries: options.registry.list() },
      }),
    );
    server.registerTool(
      'get_battery',
      {
        title: 'Get battery',
        description: 'Read one FPVBuddy battery, its usage and resistance history, and health advice. Italiano: leggi una batteria FPVBuddy, lo storico di utilizzo e resistenza e i consigli sullo stato.',
        inputSchema: { batteryId: z.string().min(1) },
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async ({ batteryId }) => {
        const battery = options.registry.get(batteryId);
        if (!battery) {
          return { content: [{ type: 'text', text: `Battery not found: ${batteryId}` }], isError: true };
        }
        const result = {
          battery,
          usageHistory: options.registry.usageHistory(batteryId),
          resistanceHistory: options.registry.resistanceHistory(batteryId),
          healthAdvice: options.registry.healthAdvice(batteryId),
        };
        return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
      },
    );
    return server;
  };

  const handler = toNodeHandler(createMcpHandler(() => createServerInstance(), { legacy: 'stateless' }));

  return (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    if (request.url !== '/fpvbuddy/mcp') {
      reject(response, 404, 'Not found');
      return Promise.resolve();
    }
    if (!validRequest(request, allowedHost)) {
      reject(response, 403, 'Host or Origin is not allowed');
      return Promise.resolve();
    }
    return handler(request, response);
  };
}

export function startFpvBuddyMcpServer(): void {
  const allowedHost = process.env['FPVBUDDY_MCP_HOST'];
  if (!allowedHost) throw new Error('Set FPVBUDDY_MCP_HOST to this Mac’s tailnet DNS name before starting.');
  const portValue = process.env['FPVBUDDY_MCP_PORT'] ?? '8787';
  const port = Number(portValue);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('FPVBUDDY_MCP_PORT must be a valid TCP port.');

  const handler = createFpvBuddyMcpHandler({ registry: new BatteryRegistry(), allowedHost });
  const server = createServer((request, response) => void handler(request, response));
  server.listen(port, '127.0.0.1', () => {
    process.stdout.write(`FPVBuddy MCP listening on 127.0.0.1:${port}/fpvbuddy/mcp for ${allowedHost}\n`);
  });
}

if (process.argv[1]?.endsWith('/fpvbuddy-mcp.js')) startFpvBuddyMcpServer();
