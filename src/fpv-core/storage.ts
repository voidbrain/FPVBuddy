export type BatteryChargeState = 'charged' | 'stored' | 'discharged';

export interface BatteryRecord {
  id: string;
  packNumber: number;
  series?: string;
  seriesColor?: string;
  label: string;
  brand: string;
  batteryType: string;
  cellCount: number;
  capacityMah: number;
  purchaseDate: string;
  currentState: BatteryChargeState;
  cycles: number;
  retiredAt?: string;
  createdAt: string;
}

export interface StoredBattery extends BatteryRecord {
  resistancePromptedRecordId?: string | null;
}

export interface BatteryUsageEntry {
  id: string;
  batteryId: string;
  state: BatteryChargeState;
  recordedAt: string;
}

export interface BatteryResistanceEntry {
  id: string;
  batteryId: string;
  valuesMohm: number[];
  cyclesAtRecord: number;
  recordedAt: string;
}

export interface BatteryNoteEntry {
  id: string;
  batteryId: string;
  note: string;
  recordedAt: string;
}

/**
 * Portable storage adapter for `BatteryRegistry`, allowing SQLite, IndexedDB, JSON-file,
 * or in-memory backends without pulling Node or browser globals into `@fpvbuddy/fpv-core`.
 */
export interface BatteryStorage {
  insertBattery(battery: StoredBattery): void;
  getBattery(id: string): StoredBattery | undefined;
  listBatteries(): StoredBattery[];
  updateBatteryState(id: string, state: BatteryChargeState, cycleIncrement: number): void;
  setResistancePromptedRecordId(id: string, recordId: string | null): void;
  insertUsage(entry: BatteryUsageEntry): void;
  listUsage(batteryId: string): BatteryUsageEntry[];
  insertResistance(entry: BatteryResistanceEntry): void;
  listResistance(batteryId: string): BatteryResistanceEntry[];
  insertNote(entry: BatteryNoteEntry): void;
  listNotes(batteryId: string): BatteryNoteEntry[];
}

function seriesTupleKey(packNumber: number, series?: string, seriesColor?: string): string {
  return JSON.stringify([
    packNumber,
    (series ?? '').toLowerCase(),
    (seriesColor ?? '').toLowerCase(),
  ]);
}

function cloneBattery(b: StoredBattery): StoredBattery {
  return {
    id: b.id,
    packNumber: b.packNumber,
    ...(b.series !== undefined ? { series: b.series } : {}),
    ...(b.seriesColor !== undefined ? { seriesColor: b.seriesColor } : {}),
    label: b.label,
    brand: b.brand,
    batteryType: b.batteryType,
    cellCount: b.cellCount,
    capacityMah: b.capacityMah,
    purchaseDate: b.purchaseDate,
    currentState: b.currentState,
    cycles: b.cycles,
    ...(b.retiredAt !== undefined ? { retiredAt: b.retiredAt } : {}),
    ...(b.resistancePromptedRecordId !== undefined
      ? { resistancePromptedRecordId: b.resistancePromptedRecordId }
      : {}),
    createdAt: b.createdAt,
  };
}

/** Reference in-memory `BatteryStorage` enforcing the unique and ordering invariants of `BatteryStorage`. */
export function createInMemoryBatteryStorage(): BatteryStorage {
  const batteries = new Map<string, StoredBattery>();
  const numberSeriesKeys = new Set<string>();
  const usages: Array<{ seq: number; entry: BatteryUsageEntry }> = [];
  const resistances: Array<{ seq: number; entry: BatteryResistanceEntry }> = [];
  const notes: Array<{ seq: number; entry: BatteryNoteEntry }> = [];
  let seq = 0;

  return {
    insertBattery(battery) {
      if (batteries.has(battery.id)) {
        throw new Error(`Battery id already exists: ${battery.id}`);
      }
      const key = seriesTupleKey(battery.packNumber, battery.series, battery.seriesColor);
      if (numberSeriesKeys.has(key)) {
        throw new Error(
          `Battery #${battery.packNumber} in series "${battery.seriesColor ?? battery.series ?? ''}" already exists.`,
        );
      }
      numberSeriesKeys.add(key);
      batteries.set(battery.id, cloneBattery(battery));
    },

    getBattery(id) {
      const found = batteries.get(id);
      return found ? cloneBattery(found) : undefined;
    },

    listBatteries() {
      return [...batteries.values()]
        .sort((a, b) => {
          if (a.packNumber !== b.packNumber) return a.packNumber - b.packNumber;
          const sa = a.seriesColor ?? a.series ?? '';
          const sb = b.seriesColor ?? b.series ?? '';
          return sa < sb ? -1 : sa > sb ? 1 : 0;
        })
        .map(cloneBattery);
    },

    updateBatteryState(id, state, cycleIncrement) {
      const existing = batteries.get(id);
      if (!existing) throw new Error(`Battery not found: ${id}`);
      existing.currentState = state;
      existing.cycles += cycleIncrement;
    },

    setResistancePromptedRecordId(id, recordId) {
      const existing = batteries.get(id);
      if (!existing) throw new Error(`Battery not found: ${id}`);
      existing.resistancePromptedRecordId = recordId;
    },

    insertUsage(entry) {
      usages.push({ seq: ++seq, entry: { ...entry } });
    },

    listUsage(batteryId) {
      return usages
        .filter((u) => u.entry.batteryId === batteryId)
        .sort((a, b) => a.entry.recordedAt.localeCompare(b.entry.recordedAt) || a.seq - b.seq)
        .map((u) => ({ ...u.entry }));
    },

    insertResistance(entry) {
      resistances.push({
        seq: ++seq,
        entry: { ...entry, valuesMohm: [...entry.valuesMohm] },
      });
    },

    listResistance(batteryId) {
      return resistances
        .filter((r) => r.entry.batteryId === batteryId)
        .sort((a, b) => a.entry.recordedAt.localeCompare(b.entry.recordedAt) || a.seq - b.seq)
        .map((r) => ({ ...r.entry, valuesMohm: [...r.entry.valuesMohm] }));
    },

    insertNote(entry) {
      notes.push({ seq: ++seq, entry: { ...entry } });
    },

    listNotes(batteryId) {
      return notes
        .filter((n) => n.entry.batteryId === batteryId)
        .sort((a, b) => a.entry.recordedAt.localeCompare(b.entry.recordedAt) || a.seq - b.seq)
        .map((n) => ({ ...n.entry }));
    },
  };
}
