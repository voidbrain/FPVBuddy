import { describe, expect, it } from 'vitest';
import {
  BatteryRegistry,
  RESISTANCE_CHECK_INTERVAL_CYCLES,
  RESISTANCE_CHECK_INTERVAL_DAYS,
  createInMemoryBatteryStorage,
  formatBatteryStateLines,
  formatDueResistancePrompt,
  parseBatteryChatCommand,
  parseBatteryStatusPhrase,
  parseResistanceValues,
  type OneMoreBatteryExport,
} from './index.js';

describe('fpv-core battery registry and logs (F-005-T02)', () => {
  it('exposes check intervals and per-cell resistance parsing', () => {
    expect(RESISTANCE_CHECK_INTERVAL_DAYS).toBe(90);
    expect(RESISTANCE_CHECK_INTERVAL_CYCLES).toBe(30);
    expect(parseResistanceValues('3.1, 3.25mΩ; 3.0 mO', 3)).toEqual([3.1, 3.25, 3]);
    expect(() => parseResistanceValues('', undefined)).toThrow(/At least one/);
    expect(() => parseResistanceValues([3.1, -1], 2)).toThrow(/positive finite/);
  });

  it('registers batteries, requires per-cell resistance unless pending, counts cycles on charged -> discharged, and stores notes', () => {
    const storage = createInMemoryBatteryStorage();
    const registry = new BatteryRegistry(storage);

    expect(() =>
      registry.register({
        packNumber: 7,
        series: 'blu',
        seriesColor: 'blu',
        brand: 'VoltCraft',
        batteryType: 'LiPo 6S',
        cellCount: 6,
        capacityMah: 1300,
        purchaseDate: '2026-10-01',
        initialResistanceMohm: [3.1, 3.2],
      }),
    ).toThrow(/exactly 6 per-cell value/);

    const bat7 = registry.register({
      packNumber: 7,
      series: 'blu',
      seriesColor: 'blu',
      brand: 'VoltCraft',
      batteryType: 'LiPo 6S',
      cellCount: 6,
      capacityMah: 1300,
      purchaseDate: '2026-10-01',
      initialResistanceMohm: [3.1, 3.2, 3.0, 3.3, 3.1, 3.2],
      recordedAt: '2026-10-01T09:00:00.000Z',
    });

    expect(bat7.packNumber).toBe(7);
    expect(bat7.seriesColor).toBe('blu');
    expect(bat7.currentState).toBe('stored');
    expect(bat7.cycles).toBe(0);

    // Duplicate packNumber + series + seriesColor is rejected just like a unique index
    expect(() =>
      registry.register({
        packNumber: 7,
        series: 'BLU',
        seriesColor: 'BLU',
        brand: 'VoltCraft',
        batteryType: 'LiPo 6S',
        cellCount: 6,
        capacityMah: 1300,
        purchaseDate: '2026-10-02',
        initialResistanceMohm: [3.1, 3.2, 3.0, 3.3, 3.1, 3.2],
      }),
    ).toThrow(/already exists/);

    registry.recordState(bat7.id, 'charged', '2026-11-10T10:00:00.000Z');
    const afterFlight = registry.recordState(bat7.id, 'discharged', '2026-11-10T12:00:00.000Z');
    expect(afterFlight.cycles).toBe(1);
    expect(afterFlight.currentState).toBe('discharged');

    const storedAgain = registry.recordState(bat7.id, 'stored', '2026-11-10T19:00:00.000Z');
    expect(storedAgain.cycles).toBe(1);
    expect(registry.usageHistory(bat7.id)).toHaveLength(3);
    expect(registry.findByNumberAndSeries(7, 'blu')).toHaveLength(1);
    expect(registry.resistanceHistory(bat7.id)).toHaveLength(1);

    const note = registry.addNote(
      bat7.id,
      '  Minor heatshrink scuff after gate touch  ',
      '2026-11-11T08:00:00.000Z',
    );
    expect(note.note).toBe('Minor heatshrink scuff after gate touch');
    expect(registry.notes(bat7.id)).toHaveLength(1);
  });

  it('imports invented one-more-battery exports with usage and resistance history and skips deleted packs', () => {
    const registry = new BatteryRegistry();
    const fixture: OneMoreBatteryExport = {
      brands: [{ id: 1, label: 'AeroPack', deleted: 0, enabled: 1 }],
      series: [
        { id: 10, label: 'red', color: 'red', deleted: 0, enabled: 1 },
        { id: 11, label: 'yellow', color: 'yellow', deleted: 0, enabled: 1 },
      ],
      batteryTypes: [
        { id: 1, label: 'LiPo 6S', deleted: 0, enabled: 1 },
        { id: 2, label: 'LiHV 3S', deleted: 0, enabled: 1 },
      ],
      batteries: [
        {
          id: 101,
          brandId: 1,
          seriesId: 10,
          typeId: 1,
          cellsNumber: 6,
          date: '2026-08-15',
          label: 'Pack 4 red',
          mA: 1500,
          deleted: 0,
          enabled: 1,
        },
        {
          id: 102,
          brandId: 1,
          seriesId: 11,
          typeId: 2,
          cellsNumber: 3,
          date: '2026-09-01',
          label: 'Pack 2 yellow',
          mA: 650,
          deleted: 0,
          enabled: 1,
        },
        {
          id: 103,
          brandId: 1,
          seriesId: 10,
          typeId: 1,
          cellsNumber: 6,
          date: '2025-01-01',
          label: 'Pack 99 retired',
          mA: 1300,
          deleted: 1,
          enabled: 0,
        },
      ],
      usageRecords: [
        {
          id: 1,
          idBattery: 101,
          date: '2026-08-16T09:00:00.000Z',
          status: 1,
          deleted: 0,
          enabled: 1,
        },
        {
          id: 2,
          idBattery: 101,
          date: '2026-08-16T11:00:00.000Z',
          status: 3,
          deleted: 0,
          enabled: 1,
        },
        {
          id: 3,
          idBattery: 101,
          date: '2026-08-16T20:00:00.000Z',
          status: 2,
          deleted: 0,
          enabled: 1,
        },
        {
          id: 4,
          idBattery: 102,
          date: '2026-09-02T08:00:00.000Z',
          status: 1,
          deleted: 0,
          enabled: 1,
        },
      ],
      resistanceRecords: [
        {
          id: 1,
          idBattery: 101,
          date: '2026-08-15T10:00:00.000Z',
          resistance_values: [3.0, 3.1, 3.0, 3.2, 3.1, 3.0],
          deleted: 0,
          enabled: 1,
        },
        {
          id: 2,
          idBattery: 101,
          date: '2026-09-15T10:00:00.000Z',
          resistance_values: [3.2, 3.3, 3.1, 3.4, 3.2, 3.1],
          deleted: 0,
          enabled: 1,
        },
        {
          id: 3,
          idBattery: 102,
          date: '2026-09-01T10:00:00.000Z',
          resistance_values: [4.0, 4.2, 4.1],
          deleted: 0,
          enabled: 1,
        },
      ],
    };

    const summary = registry.importOneMoreBattery(fixture);
    expect(summary.importedBatteries).toBe(2);
    expect(summary.skippedDeleted).toBe(1);
    expect(summary.importedUsageRecords).toBe(4);
    expect(summary.importedResistanceRecords).toBe(3);

    const pack4 = registry.get('omb-101');
    expect(pack4?.packNumber).toBe(4);
    expect(pack4?.seriesColor).toBe('red');
    expect(pack4?.currentState).toBe('stored');
    expect(pack4?.cycles).toBe(1);
    expect(registry.resistanceHistory('omb-101')).toHaveLength(2);
    expect(registry.usageHistory('omb-101')).toHaveLength(3);

    const pack2 = registry.get('omb-102');
    expect(pack2?.batteryType).toBe('LiHV 3S');
    expect(pack2?.currentState).toBe('charged');
  });

  it('parses Italian and English state/register/status phrases and refuses ambiguous pack numbers', () => {
    const registry = new BatteryRegistry();
    const b7blu = registry.register({
      packNumber: 7,
      series: 'Blu',
      seriesColor: 'blu',
      brand: 'AeroPack',
      batteryType: 'LiPo 6S',
      cellCount: 6,
      capacityMah: 1300,
      purchaseDate: '2026-10-01',
      initialResistanceMohm: [5.0, 5.1, 5.0, 5.2, 5.1, 5.0],
    });
    const b8blu = registry.register({
      packNumber: 8,
      series: 'Blu',
      seriesColor: 'blu',
      brand: 'AeroPack',
      batteryType: 'LiPo 6S',
      cellCount: 6,
      capacityMah: 1300,
      purchaseDate: '2026-10-01',
      initialResistanceMohm: [5.0, 5.1, 5.0, 5.2, 5.1, 5.0],
    });
    const b7red = registry.register({
      packNumber: 7,
      series: 'Red',
      seriesColor: 'red',
      brand: 'VoltCraft',
      batteryType: 'LiPo 6S',
      cellCount: 6,
      capacityMah: 1300,
      purchaseDate: '2026-10-01',
      initialResistanceMohm: [4.8, 4.9, 4.8, 4.9, 5.0, 4.8],
    });

    const ambiguous = registry.applyChatPhrase('carica la batteria 7');
    expect(ambiguous.status).toBe('ambiguous');
    expect(ambiguous.matches).toHaveLength(2);
    expect(registry.get(b7blu.id)?.currentState).toBe('stored');
    expect(registry.get(b7red.id)?.currentState).toBe('stored');

    const charged = registry.applyChatPhrase(
      'carica le batterie 7 e 8 blu',
      '2026-11-15T10:00:00Z',
    );
    expect(charged.status).toBe('updated');
    expect(charged.state).toBe('charged');

    const used = registry.applyChatPhrase('batteries 7 and 8 blue used', '2026-11-15T12:00:00Z');
    expect(used.status).toBe('updated');
    expect(used.state).toBe('discharged');
    expect(registry.get(b7blu.id)?.cycles).toBe(1);
    expect(registry.get(b8blu.id)?.cycles).toBe(1);
    expect(used.message).toMatch(/#7 \(Blu\): discharged · 1 cycle/);

    const regIt = registry.applyChatPhrase(
      'nuova batteria 9 blu LiPo 6S 1300 mAh',
      '2026-11-20T10:00:00Z',
    );
    expect(regIt.status).toBe('registered');
    expect(regIt.registered?.packNumber).toBe(9);

    expect(parseBatteryChatCommand('store battery 7 red')?.state).toBe('stored');
    expect(parseBatteryStatusPhrase('stato batterie')).toBe('it');
    expect(parseBatteryStatusPhrase('battery status?')).toBe('en');
    expect(parseBatteryStatusPhrase('hello')).toBeNull();
    expect(formatBatteryStateLines([], 'en')).toBe('No batteries registered.');
  });

  it('flags due resistance checks after 90 days or 30 cycles and deduplicates prompts until recorded', () => {
    const registry = new BatteryRegistry();
    const lipo = registry.register({
      packNumber: 1,
      series: 'Alpha',
      brand: 'VoltCraft',
      batteryType: 'LiPo 6S',
      cellCount: 6,
      capacityMah: 1480,
      purchaseDate: '2026-08-01',
      initialResistanceMohm: [2.1, 2.2, 2.0, 2.3, 2.1, 2.2],
      recordedAt: '2026-08-01T10:00:00Z',
    });
    const lihv = registry.register({
      packNumber: 2,
      series: 'Beta',
      brand: 'SkyCell',
      batteryType: 'LiHV 3S',
      cellCount: 3,
      capacityMah: 550,
      purchaseDate: '2026-11-01',
      initialResistanceMohm: [3, 3.4, 4.1],
      recordedAt: '2026-11-01T10:00:00Z',
    });

    for (let i = 0; i < 30; i += 1) {
      registry.recordState(lihv.id, 'charged', `2026-11-03T10:${String(i).padStart(2, '0')}:00Z`);
      registry.recordState(
        lihv.id,
        'discharged',
        `2026-11-03T11:${String(i).padStart(2, '0')}:00Z`,
      );
    }

    const due = registry.dueResistanceChecks(new Date('2026-11-05T12:00:00Z'));
    expect(due).toHaveLength(2);
    expect(due[0]?.reasons).toEqual(['days']);
    expect(due[1]?.reasons).toEqual(['cycles']);

    const prompt = formatDueResistancePrompt(due, 'en');
    expect(prompt).toMatch(/#1 \(Alpha\).*6 per-cell values in mΩ in order/);
    expect(prompt).toMatch(/#2 \(Beta\).*3 per-cell values in mΩ in order/);

    const firstPrompts = registry.claimDueResistancePrompts(new Date('2026-11-05T12:00:00Z'), 'en');
    expect(firstPrompts).toHaveLength(2);
    const repeatPrompts = registry.claimDueResistancePrompts(
      new Date('2026-11-05T12:05:00Z'),
      'en',
    );
    expect(repeatPrompts).toHaveLength(0);

    registry.recordResistance(lipo.id, [2.2, 2.3, 2.1, 2.4, 2.2, 2.3], '2026-11-05T12:10:00Z');
    registry.recordResistance(lihv.id, [3.2, 3.6, 4.3], '2026-11-05T12:10:00Z');
    expect(registry.dueResistanceChecks(new Date('2026-11-05T12:15:00Z'))).toHaveLength(0);
  });
});
