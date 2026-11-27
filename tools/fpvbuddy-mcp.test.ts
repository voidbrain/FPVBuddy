import { createServer, type Server } from 'node:http';
import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/client';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { BatteryRegistry } from '../src/fpv-core/index.js';
import { createFpvBuddyMcpHandler, isAllowedMcpRequest } from './fpvbuddy-mcp.js';

describe('FPVBuddy MCP HTTP server', () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (server?.listening) await new Promise<void>((resolve, reject) => server!.close((error) => error ? reject(error) : resolve()));
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

    const handler = createFpvBuddyMcpHandler({ registry, allowedHost: '127.0.0.1' });
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
      headers.set('origin', 'https://127.0.0.1');
      return fetch(input, { ...init, headers });
    };
    const transport = new StreamableHTTPClientTransport(endpoint, { fetch: allowedFetch });
    const client = new Client({ name: 'fpvbuddy-contract-test', version: '1.0.0' });

    try {
      await client.connect(transport);
      const { tools } = await client.listTools();
      assert.deepEqual(tools.map((tool) => tool.name).sort(), ['get_battery', 'list_batteries']);
      assert.ok(tools.every((tool) => tool.annotations?.readOnlyHint === true));

      const list = await client.callTool({ name: 'list_batteries', arguments: {} });
      assert.deepEqual(list.structuredContent, { batteries: [registry.get('battery-7')] });

      const detail = await client.callTool({ name: 'get_battery', arguments: { batteryId: 'battery-7' } });
      assert.deepEqual(detail.structuredContent, {
        battery: registry.get('battery-7'),
        usageHistory: [],
        resistanceHistory: registry.resistanceHistory('battery-7'),
        healthAdvice: registry.healthAdvice('battery-7'),
      });
      assert.equal(JSON.stringify(detail.structuredContent).includes('note'), false);
    } finally {
      await client.close();
    }
  });

  it('rejects foreign or missing hosts and foreign or null origins before MCP dispatch', async () => {
    assert.equal(isAllowedMcpRequest(undefined, undefined, '127.0.0.1'), false);
    assert.equal(isAllowedMcpRequest('attacker.example', undefined, '127.0.0.1'), false);
    assert.equal(isAllowedMcpRequest('attacker@127.0.0.1', undefined, '127.0.0.1'), false);
    assert.equal(isAllowedMcpRequest('127.0.0.1:8787', 'https://attacker.example', '127.0.0.1'), false);
    assert.equal(isAllowedMcpRequest('127.0.0.1:8787', 'https://attacker@127.0.0.1', '127.0.0.1'), false);
    assert.equal(isAllowedMcpRequest('127.0.0.1:8787', 'null', '127.0.0.1'), false);
    const handler = createFpvBuddyMcpHandler({ registry: new BatteryRegistry(), allowedHost: '127.0.0.1' });
    server = createServer((request, response) => void handler(request, response));
    await new Promise<void>((resolve) => server!.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Test server did not bind a TCP port.');
    const endpoint = `http://127.0.0.1:${address.port}/fpvbuddy/mcp`;
    const response = await fetch(endpoint, { headers: { origin: 'https://attacker.example' } });
    assert.equal(response.status, 403);
  });

  it('accepts the Tailscale Serve mount path forwarded to the local service', async () => {
    const handler = createFpvBuddyMcpHandler({ registry: new BatteryRegistry(), allowedHost: '127.0.0.1' });
    server = createServer((request, response) => void handler(request, response));
    await new Promise<void>((resolve) => server!.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Test server did not bind a TCP port.');

    const response = await fetch(`http://127.0.0.1:${address.port}/mcp`);
    assert.equal(response.status, 405);
  });
});
