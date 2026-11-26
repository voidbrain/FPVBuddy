import { describe, expect, it } from 'vitest';
import {
  BatteryRegistry,
  GROWTH_STRONG_WARNING_PCT,
  GROWTH_WARNING_PCT,
  PACK_SPREAD_STRONG_WARNING_PCT,
  PACK_SPREAD_WARNING_PCT,
  TATTU_RLINE_V6_1480_6S_PROFILE,
  buildBatteryDashboardCards,
  defaultRetirementMohm,
  evaluateBatteryHealth,
  matchBatteryModelProfile,
  type BatteryRecord,
  type BatteryResistanceEntry,
} from './index.js';

function makeBattery(overrides: Partial<BatteryRecord> = {}): BatteryRecord {
  return {
    id: 'bat-1',
    packNumber: 7,
    series: 'blu',
    seriesColor: 'blue',
    label: 'Pack 7',
    brand: 'VoltCraft',
    batteryType: 'LiPo 6S',
    cellCount: 6,
    capacityMah: 1300,
    purchaseDate: '2026-01-10',
    currentState: 'stored',
    cycles: 12,
    createdAt: '2026-01-10T10:00:00Z',
    ...overrides,
  };
}

function makeRecord(
  valuesMohm: number[],
  recordedAt: string,
  id = 'res-1',
): BatteryResistanceEntry {
  return { id, batteryId: 'bat-1', valuesMohm, cyclesAtRecord: 0, recordedAt };
}

describe('fpv-core battery health and cards (F-005-T02)', () => {
  it('exports threshold constants, default retirement limits and model profile matching', () => {
    expect(GROWTH_WARNING_PCT).toBe(50);
    expect(GROWTH_STRONG_WARNING_PCT).toBe(100);
    expect(PACK_SPREAD_WARNING_PCT).toBe(30);
    expect(PACK_SPREAD_STRONG_WARNING_PCT).toBe(50);
    expect(defaultRetirementMohm(makeBattery({ batteryType: 'LiPo 6S' }))).toBe(12);
    expect(defaultRetirementMohm(makeBattery({ batteryType: 'LiHV 3S' }))).toBe(10);
    expect(matchBatteryModelProfile(makeBattery())).toBeUndefined();
    expect(
      matchBatteryModelProfile(
        makeBattery({
          brand: 'Tattu',
          label: 'R-Line V6 1480',
          batteryType: 'LiPo 6S 160C',
          cellCount: 6,
          capacityMah: 1480,
        }),
      ),
    ).toEqual(TATTU_RLINE_V6_1480_6S_PROFILE);
  });

  it('returns no_records without resistance history and healthy when cells stay within limits', () => {
    expect(evaluateBatteryHealth(makeBattery(), []).status).toBe('no_records');
    const first = makeRecord([2.0, 2.1, 2.0, 2.2, 2.1, 2.0], '2026-01-10T10:00:00Z', 'res-1');
    const latest = makeRecord([2.3, 2.4, 2.2, 2.5, 2.3, 2.2], '2026-04-10T10:00:00Z', 'res-2');
    const healthy = evaluateBatteryHealth(makeBattery(), [first, latest]);
    expect(healthy.status).toBe('healthy');
    expect(healthy.findings).toEqual([]);
  });

  it('evaluates growth vs first record, spread vs pack median, generic retirement and profile limits', () => {
    const battery = makeBattery();
    const first = makeRecord([2.0, 2.0, 2.0, 2.0, 2.0, 2.0], '2026-01-10T10:00:00Z', 'res-1');
    const latest = makeRecord([2.1, 3.0, 2.1, 2.1, 4.0, 2.1], '2026-04-10T10:00:00Z', 'res-2');
    const report = evaluateBatteryHealth(battery, [first, latest]);
    expect(report.status).toBe('strong_warning');
    expect(
      report.findings.find((f) => f.cellNumber === 2 && f.reason === 'growth_vs_first')?.severity,
    ).toBe('warning');
    expect(
      report.findings.find((f) => f.cellNumber === 5 && f.reason === 'growth_vs_first')?.severity,
    ).toBe('strong_warning');

    const spreadFirst = makeRecord([2.0, 2.0, 2.5, 2.0, 2.0, 2.0], '2026-01-10T10:00:00Z', 'res-1');
    const spreadLatest = makeRecord(
      [2.0, 2.0, 2.7, 2.0, 2.0, 2.0],
      '2026-02-10T10:00:00Z',
      'res-2',
    );
    const spreadReport = evaluateBatteryHealth(battery, [spreadFirst, spreadLatest]);
    expect(spreadReport.status).toBe('warning');
    expect(
      spreadReport.findings.find((f) => f.cellNumber === 3 && f.reason === 'spread_vs_pack')
        ?.severity,
    ).toBe('warning');

    const lipoRetire = evaluateBatteryHealth(makeBattery({ batteryType: 'LiPo 6S' }), [
      makeRecord([2, 2, 2, 2, 2, 12], '2026-01-10T10:00:00Z'),
    ]);
    expect(lipoRetire.status).toBe('retire');

    const tattu = makeBattery({
      brand: 'Tattu',
      label: 'R-Line V6 1480',
      batteryType: 'LiPo 6S 160C',
      cellCount: 6,
      capacityMah: 1480,
    });
    expect(
      evaluateBatteryHealth(tattu, [
        makeRecord([4.5, 4.4, 4.4, 4.4, 4.4, 4.4], '2026-01-10T10:00:00Z'),
      ]).status,
    ).toBe('warning');
    expect(
      evaluateBatteryHealth(tattu, [
        makeRecord([7.0, 6.8, 6.8, 6.8, 6.8, 6.8], '2026-01-10T10:00:00Z'),
      ]).status,
    ).toBe('strong_warning');
    expect(
      evaluateBatteryHealth(tattu, [
        makeRecord([8.0, 7.8, 7.8, 7.8, 7.8, 7.8], '2026-01-10T10:00:00Z'),
      ]).status,
    ).toBe('retire');
  });

  it('builds dashboard summary cards and Italian health lines from BatteryRegistry', () => {
    const registry = new BatteryRegistry();
    const created = registry.register({
      packNumber: 4,
      series: 'rossa',
      brand: 'VoltCraft',
      batteryType: 'LiPo 6S',
      cellCount: 6,
      capacityMah: 1300,
      purchaseDate: '2026-01-01',
      initialResistanceMohm: [2.0, 2.0, 2.0, 2.0, 2.0, 2.0],
      recordedAt: '2026-01-01T10:00:00Z',
    });
    registry.recordState(created.id, 'charged', '2026-01-02T10:00:00Z');
    registry.recordState(created.id, 'discharged', '2026-01-02T11:00:00Z');
    registry.recordResistance(created.id, [2.1, 2.1, 4.2, 2.1, 2.1, 2.1], '2026-02-01T10:00:00Z');

    const reports = registry.healthAdvice(created.id, 'it');
    expect(reports).toHaveLength(1);
    expect(reports[0]?.status).toBe('strong_warning');
    expect(reports[0]?.lines.some((l) => l.includes('#4 (rossa)') && l.includes('cella 3'))).toBe(
      true,
    );

    const cards = buildBatteryDashboardCards(registry, new Date('2026-03-01T10:00:00Z'));
    expect(cards).toHaveLength(1);
    expect(cards[0]?.packNumber).toBe(4);
    expect(cards[0]?.cycles).toBe(1);
    expect(cards[0]?.storageReminderActive).toBe(true);
    expect(cards[0]?.healthStatus).toBe('strong_warning');
    expect(cards[0]?.resistanceOverdue).toBe(false);
  });
});
