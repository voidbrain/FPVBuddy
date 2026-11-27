import { createServer, type Server } from 'node:http';
import { Client } from '@modelcontextprotocol/client';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { afterEach, describe, expect, it } from 'vitest';
import { BatteryRegistry } from '../src/fpv-core/index.js';
import { createFpvBuddyMcpHandler } from './fpvbuddy-mcp.js';

describe('FPVBuddy MCP HTTP server', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server?.listening) await new Promise<void>((resolve) => server!.close(() => resolve()));
    server = undefined;
  });

  it('serves only read-only battery tools through the allowed host and origin', async () => {
    const registry = new BatteryRegistry(undefined, { createId: (prefix) => `${prefix}-fixture` });
    registry.register({
      id: 'battery-7',
      packNumber: 7,
      brand: 'Example',
      batteryType: 'LiPo',
      cellCount: 6,
      capacityMah: 1500,
      purchaseDate: '2026-01-01',
      initialResistanceMohm: [2, 2, 2, 2, 2, 2],
      recordedAt: '2026-01-01T00:00:00.000Z',
    });

    const handler = createFpvBuddyMcpHandler({ registry, allowedHost: 'quad.tailnet.ts.net' });
    server = createServer((request, response) => {
      if (request.url !== '/fpvbuddy/mcp') {
        response.writeHead(404).end();
        return;
      }
      void handler(request, response);
    });
    await new Promise<void>((resolve) => server!.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Test server did not bind a TCP port.');

    const endpoint = new URL(`http://127.0.0.1:${address.port}/fpvbuddy/mcp`);
    const allowedFetch: typeof fetch = (input, init) => {
      const headers = new Headers(init?.headers);
      headers.set('host', 'quad.tailnet.ts.net');
      headers.set('origin', 'https://quad.tailnet.ts.net');
      return fetch(input, { ...init, headers });
    };
    const transport = new StreamableHTTPClientTransport(endpoint, { fetch: allowedFetch });
    const client = new Client({ name: 'fpvbuddy-contract-test', version: '1.0.0' });

    try {
      await client.connect(transport);
      const { tools } = await client.listTools();
      expect(tools.map((tool) => tool.name).sort()).toEqual(['get_battery', 'list_batteries']);
      expect(tools.every((tool) => tool.annotations?.readOnlyHint === true)).toBe(true);

      const list = await client.callTool({ name: 'list_batteries', arguments: {} });
      expect(list.structuredContent).toMatchObject({ batteries: [{ id: 'battery-7', packNumber: 7 }] });

      const detail = await client.callTool({ name: 'get_battery', arguments: { batteryId: 'battery-7' } });
      expect(detail.structuredContent).toMatchObject({
        battery: { id: 'battery-7' },
        usageHistory: [],
        resistanceHistory: [{ valuesMohm: [2, 2, 2, 2, 2, 2] }],
        healthAdvice: [{ batteryId: 'battery-7' }],
      });
      expect(JSON.stringify(detail.structuredContent)).not.toContain('note');
    } finally {
      await client.close();
    }
  });

  it('rejects foreign or missing hosts and foreign or null origins before MCP dispatch', async () => {
    const handler = createFpvBuddyMcpHandler({ registry: new BatteryRegistry(), allowedHost: 'quad.tailnet.ts.net' });
    server = createServer((request, response) => void handler(request, response));
    await new Promise<void>((resolve) => server!.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Test server did not bind a TCP port.');
    const endpoint = `http://127.0.0.1:${address.port}/fpvbuddy/mcp`;
    const payload = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'test', version: '1' } } });

    for (const headers of [
      { 'content-type': 'application/json', host: 'attacker.example' },
      { 'content-type': 'application/json' },
      { 'content-type': 'application/json', host: 'quad.tailnet.ts.net', origin: 'https://attacker.example' },
      { 'content-type': 'application/json', host: 'quad.tailnet.ts.net', origin: 'null' },
    ]) {
      const response = await fetch(endpoint, { method: 'POST', headers, body: payload });
      expect(response.status).toBe(403);
    }
  });
});
