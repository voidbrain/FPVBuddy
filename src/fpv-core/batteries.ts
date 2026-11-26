import { evaluateBatteryHealth, type BatteryHealthReport } from './battery-health.js';
import {
  createInMemoryBatteryStorage,
  type BatteryChargeState,
  type BatteryNoteEntry,
  type BatteryRecord,
  type BatteryResistanceEntry,
  type BatteryStorage,
  type BatteryUsageEntry,
  type StoredBattery,
} from './storage.js';

export const RESISTANCE_CHECK_INTERVAL_DAYS = 90;
export const RESISTANCE_CHECK_INTERVAL_CYCLES = 30;

export interface DueResistanceCheck {
  battery: BatteryRecord;
  latestRecordId: string;
  lastRecordedAt: string;
  cyclesAtLastRecord: number;
  daysSinceLastCheck: number;
  cyclesSinceLastCheck: number;
  reasons: Array<'days' | 'cycles'>;
}

export interface DueResistancePrompt {
  check: DueResistanceCheck;
  message: string;
}

export interface RegisterBatteryInput {
  id?: string;
  packNumber: number;
  series?: string;
  seriesColor?: string;
  label?: string;
  brand: string;
  batteryType: string;
  cellCount: number;
  capacityMah: number;
  purchaseDate: string;
  initialResistanceMohm?: number[];
  allowPendingResistance?: boolean;
  initialState?: BatteryChargeState;
  recordedAt?: string;
}

/** Legacy standalone `one-more-battery` export shape. */
export interface OneMoreBatteryExport {
  brands?: Array<{ id: number; label: string; deleted?: number; enabled?: number }>;
  series?: Array<{ id: number; label: string; color?: string; deleted?: number; enabled?: number }>;
  batteryTypes?: Array<{ id: number; label: string; deleted?: number; enabled?: number }>;
  batteries: Array<{
    id: number;
    brandId: number;
    seriesId?: number;
    typeId: number;
    cellsNumber: number;
    date: string;
    label: string;
    mA: number;
    model?: string;
    deleted?: number;
    enabled?: number;
  }>;
  usageRecords?: Array<{
    id: number;
    idBattery: number;
    date: string;
    status: 1 | 2 | 3;
    deleted?: number;
    enabled?: number;
  }>;
  resistanceRecords?: Array<{
    id: number;
    idBattery: number;
    date: string;
    resistance_values: number[];
    deleted?: number;
    enabled?: number;
  }>;
}

export interface BatteryImportResult {
  importedBatteries: number;
  skippedDeleted: number;
  importedUsageRecords: number;
  importedResistanceRecords: number;
  batteries: BatteryRecord[];
}

export interface BatteryRegistryOptions {
  createId?: (prefix: string) => string;
}

let fallbackCounter = 0;

function defaultCreateId(prefix: string): string {
  const maybeCrypto = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (typeof maybeCrypto?.randomUUID === 'function') {
    return `${prefix}-${maybeCrypto.randomUUID()}`;
  }
  fallbackCounter += 1;
  const rand = Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, '0');
  return `${prefix}-${Date.now().toString(16)}-${fallbackCounter.toString(16)}-${rand}`;
}

function toPublicBattery(stored: StoredBattery): BatteryRecord {
  const { resistancePromptedRecordId: _prompted, ...publicRecord } = stored;
  return publicRecord;
}

function validateResistanceValues(values: readonly number[], cellCount: number): number[] {
  if (!Array.isArray(values) || values.length !== cellCount) {
    throw new Error(
      `Resistance record must supply exactly ${cellCount} per-cell value(s) in order (received ${Array.isArray(values) ? values.length : 0}).`,
    );
  }
  return values.map((v, idx) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) {
      throw new Error(
        `Invalid resistance value at cell ${idx + 1}: must be a positive finite number (mΩ).`,
      );
    }
    return Number(v.toFixed(3));
  });
}

export function parseResistanceValues(
  input: string | readonly number[],
  expectedCells?: number,
): number[] {
  const values =
    typeof input === 'string'
      ? input
          .replace(/m[oωΩ]/gi, ' ')
          .split(/[\s,;]+/)
          .map((t) => t.trim())
          .filter(Boolean)
          .map((t) => Number(t))
      : [...input];
  if (expectedCells !== undefined) {
    return validateResistanceValues(values, expectedCells);
  }
  if (values.length === 0) {
    throw new Error('At least one per-cell resistance value (mΩ) is required.');
  }
  return validateResistanceValues(values, values.length);
}

function parseChargeState(status: 1 | 2 | 3): BatteryChargeState {
  if (status === 1) return 'charged';
  if (status === 2) return 'stored';
  if (status === 3) return 'discharged';
  throw new Error(`Unsupported legacy BatteryStatus: ${String(status)}`);
}

function extractPackNumber(label: string, fallbackId: number): number {
  const match = /\b(\d+)\b/.exec(label);
  return match ? Number(match[1]) : fallbackId;
}

/**
 * Framework-free FPV battery registry and legacy `one-more-battery` importer backed by `BatteryStorage`.
 * Enforces per-cell resistance capture on registration and preserves usage, resistance and note history.
 */
export class BatteryRegistry {
  readonly storage: BatteryStorage;
  private readonly createId: (prefix: string) => string;

  constructor(storage?: BatteryStorage, options?: BatteryRegistryOptions) {
    this.storage = storage ?? createInMemoryBatteryStorage();
    this.createId = options?.createId ?? defaultCreateId;
  }

  register(input: RegisterBatteryInput): BatteryRecord {
    if (!Number.isInteger(input.packNumber) || input.packNumber < 1) {
      throw new Error('Battery packNumber must be a positive integer.');
    }
    if (!Number.isInteger(input.cellCount) || input.cellCount < 1 || input.cellCount > 12) {
      throw new Error('Battery cellCount must be an integer between 1 and 12.');
    }
    if (!Number.isInteger(input.capacityMah) || input.capacityMah < 50) {
      throw new Error('Battery capacityMah must be a positive integer (>= 50 mAh).');
    }
    if (!input.brand.trim() || !input.batteryType.trim() || !input.purchaseDate.trim()) {
      throw new Error('Battery brand, batteryType, and purchaseDate are required.');
    }

    const resistance =
      input.allowPendingResistance && input.initialResistanceMohm === undefined
        ? null
        : validateResistanceValues(input.initialResistanceMohm ?? [], input.cellCount);
    const id = input.id?.trim() || this.createId('bat');
    const series = input.series?.trim() || undefined;
    const seriesColor = input.seriesColor?.trim() || undefined;
    const label =
      input.label?.trim() ||
      [String(input.packNumber), seriesColor ?? series].filter(Boolean).join(' ');
    const currentState: BatteryChargeState = input.initialState ?? 'stored';
    const createdAt = input.recordedAt?.trim() || new Date().toISOString();

    this.storage.insertBattery({
      id,
      packNumber: input.packNumber,
      ...(series !== undefined ? { series } : {}),
      ...(seriesColor !== undefined ? { seriesColor } : {}),
      label,
      brand: input.brand.trim(),
      batteryType: input.batteryType.trim(),
      cellCount: input.cellCount,
      capacityMah: input.capacityMah,
      purchaseDate: input.purchaseDate.trim(),
      currentState,
      cycles: 0,
      resistancePromptedRecordId: null,
      createdAt,
    });

    if (resistance) {
      this.storage.insertResistance({
        id: this.createId('res'),
        batteryId: id,
        valuesMohm: resistance,
        cyclesAtRecord: 0,
        recordedAt: createdAt,
      });
    }

    return this.get(id)!;
  }

  get(id: string): BatteryRecord | undefined {
    const stored = this.storage.getBattery(id);
    return stored ? toPublicBattery(stored) : undefined;
  }

  list(): BatteryRecord[] {
    return this.storage.listBatteries().map(toPublicBattery);
  }

  findByNumberAndSeries(packNumber: number, seriesOrColor?: string): BatteryRecord[] {
    const q = seriesOrColor?.trim().toLowerCase();
    return this.list().filter((b) => {
      if (b.packNumber !== packNumber) return false;
      if (!q) return true;
      return b.series?.toLowerCase() === q || b.seriesColor?.toLowerCase() === q;
    });
  }

  addNote(
    batteryId: string,
    note: string,
    recordedAt = new Date().toISOString(),
  ): BatteryNoteEntry {
    const trimmed = note.trim();
    if (!trimmed || trimmed.length > 500) {
      throw new Error('Battery note must contain 1–500 characters.');
    }
    if (!Number.isFinite(Date.parse(recordedAt))) {
      throw new Error('recordedAt must be a valid timestamp.');
    }
    if (!this.get(batteryId)) throw new Error(`Battery not found: ${batteryId}`);
    const entry: BatteryNoteEntry = {
      id: this.createId('bnote'),
      batteryId,
      note: trimmed,
      recordedAt,
    };
    this.storage.insertNote(entry);
    return entry;
  }

  notes(batteryId: string): BatteryNoteEntry[] {
    if (!this.get(batteryId)) throw new Error(`Battery not found: ${batteryId}`);
    return this.storage.listNotes(batteryId);
  }

  recordState(
    batteryId: string,
    state: BatteryChargeState,
    recordedAt = new Date().toISOString(),
  ): BatteryRecord {
    const existing = this.get(batteryId);
    if (!existing) throw new Error(`Battery not found: ${batteryId}`);
    const cycleIncrement = existing.currentState === 'charged' && state === 'discharged' ? 1 : 0;

    this.storage.insertUsage({
      id: this.createId('use'),
      batteryId,
      state,
      recordedAt,
    });
    this.storage.updateBatteryState(batteryId, state, cycleIncrement);
    return this.get(batteryId)!;
  }

  recordResistance(
    batteryId: string,
    valuesMohm: string | readonly number[],
    recordedAt = new Date().toISOString(),
  ): BatteryResistanceEntry {
    const existing = this.get(batteryId);
    if (!existing) throw new Error(`Battery not found: ${batteryId}`);
    const validated = parseResistanceValues(valuesMohm, existing.cellCount);
    const entry: BatteryResistanceEntry = {
      id: this.createId('res'),
      batteryId,
      valuesMohm: validated,
      cyclesAtRecord: existing.cycles,
      recordedAt,
    };
    this.storage.insertResistance(entry);
    this.storage.setResistancePromptedRecordId(batteryId, null);
    return entry;
  }

  dueResistanceChecks(now = new Date()): DueResistanceCheck[] {
    const due: DueResistanceCheck[] = [];
    const nowMs = now.getTime();
    for (const battery of this.list()) {
      if (battery.retiredAt) continue;
      const history = this.storage.listResistance(battery.id);
      const latest = history.at(-1);
      if (!latest) continue;
      const lastMs = Date.parse(latest.recordedAt);
      const daysSinceLastCheck = Number.isFinite(lastMs)
        ? Math.max(0, Math.floor((nowMs - lastMs) / 86_400_000))
        : 0;
      const cyclesSinceLastCheck = Math.max(0, battery.cycles - latest.cyclesAtRecord);
      const reasons: Array<'days' | 'cycles'> = [];
      if (daysSinceLastCheck >= RESISTANCE_CHECK_INTERVAL_DAYS) reasons.push('days');
      if (cyclesSinceLastCheck >= RESISTANCE_CHECK_INTERVAL_CYCLES) reasons.push('cycles');
      if (reasons.length > 0) {
        due.push({
          battery,
          latestRecordId: latest.id,
          lastRecordedAt: latest.recordedAt,
          cyclesAtLastRecord: latest.cyclesAtRecord,
          daysSinceLastCheck,
          cyclesSinceLastCheck,
          reasons,
        });
      }
    }
    return due;
  }

  /**
   * Returns deduplicated due-resistance prompts not yet prompted for their latest resistance record,
   * marking each returned battery's `resistancePromptedRecordId` in storage.
   */
  claimDueResistancePrompts(now = new Date(), language: 'it' | 'en' = 'en'): DueResistancePrompt[] {
    const due = this.dueResistanceChecks(now);
    const claimed: DueResistancePrompt[] = [];
    for (const check of due) {
      const stored = this.storage.getBattery(check.battery.id);
      if (stored?.resistancePromptedRecordId === check.latestRecordId) continue;
      const message = formatDueResistancePrompt([check], language);
      this.storage.setResistancePromptedRecordId(check.battery.id, check.latestRecordId);
      claimed.push({ check, message });
    }
    return claimed;
  }

  usageHistory(batteryId: string): BatteryUsageEntry[] {
    return this.storage.listUsage(batteryId);
  }

  resistanceHistory(batteryId: string): BatteryResistanceEntry[] {
    return this.storage.listResistance(batteryId);
  }

  /** Evaluates per-cell resistance health advice for one or all active batteries. */
  healthAdvice(batteryId?: string, language: 'it' | 'en' = 'en'): BatteryHealthReport[] {
    const targets = batteryId
      ? [this.get(batteryId)].filter((b): b is BatteryRecord => Boolean(b))
      : this.list().filter((b) => !b.retiredAt);
    return targets.map((battery) =>
      evaluateBatteryHealth(battery, this.resistanceHistory(battery.id), { language }),
    );
  }

  importOneMoreBattery(payload: OneMoreBatteryExport): BatteryImportResult {
    if (!payload || !Array.isArray(payload.batteries)) {
      throw new Error('Invalid one-more-battery export: batteries array is required.');
    }
    const brands = new Map((payload.brands ?? []).map((b) => [b.id, b]));
    const seriesMap = new Map((payload.series ?? []).map((s) => [s.id, s]));
    const types = new Map((payload.batteryTypes ?? []).map((t) => [t.id, t]));

    let skippedDeleted = 0;
    let importedUsageRecords = 0;
    let importedResistanceRecords = 0;
    const imported: BatteryRecord[] = [];

    for (const legacy of payload.batteries) {
      if (legacy.deleted === 1 || legacy.enabled === 0) {
        skippedDeleted += 1;
        continue;
      }
      const resList = (payload.resistanceRecords ?? [])
        .filter((r) => r.idBattery === legacy.id && r.deleted !== 1 && r.enabled !== 0)
        .sort((a, b) => a.date.localeCompare(b.date));

      if (resList.length === 0) {
        throw new Error(
          `Imported battery "${legacy.label}" (id=${legacy.id}) requires at least one initial per-cell resistance record.`,
        );
      }

      const brandName = brands.get(legacy.brandId)?.label ?? 'Unknown';
      const typeName = types.get(legacy.typeId)?.label ?? 'LiPo';
      const seriesObj = legacy.seriesId !== undefined ? seriesMap.get(legacy.seriesId) : undefined;
      const packNumber = extractPackNumber(legacy.label, legacy.id);

      const firstRes = resList[0]!;
      const created = this.register({
        id: `omb-${legacy.id}`,
        packNumber,
        ...(seriesObj
          ? {
              series: seriesObj.label,
              ...(seriesObj.color ? { seriesColor: seriesObj.color } : {}),
            }
          : {}),
        label: legacy.label,
        brand: brandName,
        batteryType: typeName,
        cellCount: legacy.cellsNumber,
        capacityMah: legacy.mA,
        purchaseDate: legacy.date,
        initialResistanceMohm: firstRes.resistance_values,
        recordedAt: firstRes.date,
      });
      importedResistanceRecords += 1;

      for (const extraRes of resList.slice(1)) {
        this.recordResistance(created.id, extraRes.resistance_values, extraRes.date);
        importedResistanceRecords += 1;
      }

      const usages = (payload.usageRecords ?? [])
        .filter((u) => u.idBattery === legacy.id && u.deleted !== 1 && u.enabled !== 0)
        .sort((a, b) => a.date.localeCompare(b.date));
      for (const u of usages) {
        this.recordState(created.id, parseChargeState(u.status), u.date);
        importedUsageRecords += 1;
      }

      imported.push(this.get(created.id)!);
    }

    return {
      importedBatteries: imported.length,
      skippedDeleted,
      importedUsageRecords,
      importedResistanceRecords,
      batteries: imported,
    };
  }

  /**
   * Parses and applies an Italian or English chat phrase to set `charged`, `discharged` or `stored`
   * (or register a new battery), refusing to guess when a pack number matches multiple series.
   */
  applyChatPhrase(text: string, recordedAt = new Date().toISOString()): BatteryChatResult {
    const reg = parseBatteryRegisterPhrase(text);
    if (reg) {
      const created = this.register({
        packNumber: reg.packNumber,
        ...(reg.series ? { series: reg.series, seriesColor: reg.seriesColor ?? reg.series } : {}),
        brand: reg.brand,
        batteryType: reg.batteryType,
        cellCount: reg.cellCount,
        capacityMah: reg.capacityMah,
        purchaseDate: recordedAt.slice(0, 10),
        allowPendingResistance: true,
        recordedAt,
      });
      const series = created.series ? ` (${created.series})` : '';
      return {
        status: 'registered',
        language: reg.language,
        registered: created,
        message:
          reg.language === 'it'
            ? `Registrata batteria #${created.packNumber}${series} · ${created.batteryType} · ${created.capacityMah} mAh. Inserisci ${created.cellCount} valori di resistenza per cella in mΩ in ordine (es. 3.1, 3.2, ...).`
            : `Registered battery #${created.packNumber}${series} · ${created.batteryType} · ${created.capacityMah} mAh. Please enter ${created.cellCount} per-cell resistance values in mΩ in order (e.g. 3.1, 3.2, ...).`,
      };
    }

    const parsed = parseBatteryChatCommand(text);
    if (!parsed) {
      return {
        status: 'unrecognized',
        language: detectBatteryLanguage(text),
        message: 'Could not recognize a battery charge-state command.',
      };
    }

    const active = this.list().filter((b) => !b.retiredAt);
    const resolved: BatteryRecord[] = [];
    for (const num of parsed.packNumbers) {
      let candidates = active.filter((b) => b.packNumber === num);
      if (parsed.seriesQuery) {
        const want = normalizeColorToken(parsed.seriesQuery);
        candidates = candidates.filter(
          (b) =>
            (b.series && normalizeColorToken(b.series) === want) ||
            (b.seriesColor && normalizeColorToken(b.seriesColor) === want),
        );
      }
      if (candidates.length === 0) {
        return {
          status: 'not_found',
          language: parsed.language,
          message:
            parsed.language === 'it'
              ? `Batteria ${num}${parsed.seriesQuery ? ` (${parsed.seriesQuery})` : ''} non trovata.`
              : `Battery ${num}${parsed.seriesQuery ? ` (${parsed.seriesQuery})` : ''} not found.`,
        };
      }
      if (candidates.length > 1) {
        const seriesList = candidates.map((c) => c.series ?? c.seriesColor ?? c.label).join(', ');
        return {
          status: 'ambiguous',
          language: parsed.language,
          matches: candidates,
          message:
            parsed.language === 'it'
              ? `La batteria ${num} è ambigua (${seriesList}). Quale serie intendi?`
              : `Battery ${num} is ambiguous (${seriesList}). Which series do you mean?`,
        };
      }
      resolved.push(candidates[0]!);
    }

    const updated = resolved.map((b) => this.recordState(b.id, parsed.state, recordedAt));
    return {
      status: 'updated',
      language: parsed.language,
      state: parsed.state,
      updated,
      message: formatBatteryStateLines(updated, parsed.language),
    };
  }
}

export interface ParsedBatteryChatCommand {
  state: BatteryChargeState;
  packNumbers: number[];
  seriesQuery?: string;
  language: 'it' | 'en';
}

export interface BatteryChatResult {
  status: 'updated' | 'registered' | 'ambiguous' | 'not_found' | 'unrecognized';
  language: 'it' | 'en';
  state?: BatteryChargeState;
  updated?: BatteryRecord[];
  registered?: BatteryRecord;
  matches?: BatteryRecord[];
  message: string;
}

interface ParsedBatteryRegisterPhrase {
  packNumber: number;
  series?: string;
  seriesColor?: string;
  batteryType: string;
  cellCount: number;
  capacityMah: number;
  brand: string;
  language: 'it' | 'en';
}

function parseBatteryRegisterPhrase(text: string): ParsedBatteryRegisterPhrase | null {
  const trimmed = text.trim();
  const itMatch = /^(?:nuova|registra|aggiungi)\s+(?:la\s+)?batteria\s+(.+)$/i.exec(trimmed);
  const enMatch = /^(?:new|register|add)\s+battery\s+(.+)$/i.exec(trimmed);
  const body = (itMatch?.[1] ?? enMatch?.[1])?.trim();
  if (!body) return null;
  const language: 'it' | 'en' = itMatch ? 'it' : 'en';

  const numMatch = /^#?(\d+)\b(.*)$/.exec(body);
  if (!numMatch) return null;
  const packNumber = Number(numMatch[1]);
  if (!Number.isInteger(packNumber) || packNumber < 1) return null;

  let rest = numMatch[2]!.trim();
  const cellsMatch = /\b(\d{1,2})s\b/i.exec(rest);
  if (!cellsMatch) return null;
  const cellCount = Number(cellsMatch[1]);
  if (!Number.isInteger(cellCount) || cellCount < 1 || cellCount > 12) return null;

  const mahMatch = /\b(\d{2,5})\s*mah\b/i.exec(rest);
  if (!mahMatch) return null;
  const capacityMah = Number(mahMatch[1]);
  if (!Number.isInteger(capacityMah) || capacityMah < 50) return null;

  const chemMatch = /\b(lipo|lihv|li-?ion|life)\b/i.exec(rest);
  const chem = chemMatch
    ? chemMatch[1]!.toLowerCase() === 'lihv'
      ? 'LiHV'
      : chemMatch[1]!.toLowerCase() === 'life'
        ? 'LiFe'
        : chemMatch[1]!.toLowerCase().includes('ion')
          ? 'Li-Ion'
          : 'LiPo'
    : 'LiPo';
  const batteryType = `${chem} ${cellCount}S`;

  rest = rest
    .replace(cellsMatch[0], ' ')
    .replace(mahMatch[0], ' ')
    .replace(chemMatch?.[0] ?? '', ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const tokens = rest ? rest.split(' ').filter(Boolean) : [];
  const series = tokens[0]?.toLowerCase();
  const seriesColor = tokens[0] ? normalizeColorToken(tokens[0]) : undefined;
  const brand = tokens.slice(1).join(' ').trim() || 'Generic';

  return {
    packNumber,
    ...(series ? { series, seriesColor } : {}),
    batteryType,
    cellCount,
    capacityMah,
    brand,
    language,
  };
}

const COLOR_ALIASES: Record<string, string> = {
  blu: 'blue',
  blue: 'blue',
  rosso: 'red',
  rossa: 'red',
  rossi: 'red',
  rosse: 'red',
  red: 'red',
  giallo: 'yellow',
  gialla: 'yellow',
  gialli: 'yellow',
  gialle: 'yellow',
  yellow: 'yellow',
  verde: 'green',
  verdi: 'green',
  green: 'green',
  nero: 'black',
  nera: 'black',
  neri: 'black',
  nere: 'black',
  black: 'black',
  bianco: 'white',
  bianca: 'white',
  bianchi: 'white',
  bianche: 'white',
  white: 'white',
};

function normalizeColorToken(token: string): string {
  const lower = token.trim().toLowerCase();
  return COLOR_ALIASES[lower] ?? lower;
}

function detectBatteryLanguage(text: string): 'it' | 'en' {
  return /\b(carica(?:re|to|te|ti)?|scarica(?:re|to|te|ti)?|batteri[ae]|usat[aeio]|ripon[ei]|ripost[aeio]|conserva(?:re|to|te|ti)?|blu|ross[aeio]|giall[aeio]|verd[ei]|ner[aeio]|bianc[aeioh]+)\b/i.test(
    text,
  )
    ? 'it'
    : 'en';
}

export function parseBatteryChatCommand(text: string): ParsedBatteryChatCommand | undefined {
  const lower = text.trim().toLowerCase();
  let state: BatteryChargeState | undefined;
  if (
    /\b(storage|stor(?:e|ed)|ripon[ei]|ripost[aeio]|conserva(?:re|to|te|ti)?|immagazzina(?:re|to|te|ti)?)\b/.test(
      lower,
    )
  ) {
    state = 'stored';
  } else if (/\b(scarica(?:re|to|te|ti)?|usat[aeio]|discharged?|used)\b/.test(lower)) {
    state = 'discharged';
  } else if (/\b(carica(?:re|to|te|ti)?|charged?)\b/.test(lower)) {
    state = 'charged';
  }
  if (!state) return undefined;

  const packNumbers = Array.from(lower.matchAll(/\b(\d{1,4})\b/g), (m) => Number(m[1]));
  if (packNumbers.length === 0) return undefined;

  let seriesQuery: string | undefined;
  const seriesExplicit = /\b(?:serie|series)\s+([a-z0-9_-]+)/i.exec(lower);
  if (seriesExplicit) {
    seriesQuery = seriesExplicit[1];
  } else {
    for (const token of lower.split(/[^a-z0-9_-]+/)) {
      if (token in COLOR_ALIASES) {
        seriesQuery = token;
        break;
      }
    }
  }

  return {
    state,
    packNumbers: [...new Set(packNumbers)],
    ...(seriesQuery ? { seriesQuery } : {}),
    language: detectBatteryLanguage(text),
  };
}

export type BatteryStateSummaryRow = Pick<
  BatteryRecord,
  'packNumber' | 'series' | 'seriesColor' | 'currentState' | 'cycles'
>;

/** Recognizes Italian/English phrases asking for the full battery status list without a model call. */
export function parseBatteryStatusPhrase(text: string): 'it' | 'en' | null {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/^\/+/, '')
    .replace(/[?!.]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (
    normalized === 'stato batterie' ||
    normalized === 'stato delle batterie' ||
    normalized === 'lista batterie' ||
    normalized === 'elenco batterie' ||
    normalized === 'come sono le batterie'
  ) {
    return 'it';
  }
  if (
    normalized === 'battery status' ||
    normalized === 'batteries status' ||
    normalized === 'status of batteries' ||
    normalized === 'list batteries' ||
    normalized === 'battery list'
  ) {
    return 'en';
  }
  return null;
}

/** Formats battery charge states and cycle counts for chat and dashboard summaries. */
export function formatBatteryStateLines(
  batteries: readonly BatteryStateSummaryRow[],
  language: 'it' | 'en' = 'en',
): string {
  if (batteries.length === 0) {
    return language === 'it' ? 'Nessuna batteria registrata.' : 'No batteries registered.';
  }
  return batteries
    .map((b) => {
      const series = b.series ? ` (${b.series})` : b.seriesColor ? ` (${b.seriesColor})` : '';
      const cycleWord =
        language === 'it'
          ? b.cycles === 1
            ? 'ciclo'
            : 'cicli'
          : b.cycles === 1
            ? 'cycle'
            : 'cycles';
      return `#${b.packNumber}${series}: ${b.currentState} · ${b.cycles} ${cycleWord}`;
    })
    .join('\n');
}

/** Formats due per-cell resistance check prompts asking for ordered cell values in mΩ. */
export function formatDueResistancePrompt(
  checks: readonly DueResistanceCheck[],
  language: 'it' | 'en' = 'en',
): string {
  if (checks.length === 0) {
    return language === 'it'
      ? 'Nessun controllo resistenza dovuto.'
      : 'No battery resistance checks due.';
  }
  return checks
    .map((c) => {
      const series = c.battery.series
        ? ` (${c.battery.series})`
        : c.battery.seriesColor
          ? ` (${c.battery.seriesColor})`
          : '';
      const why =
        language === 'it'
          ? [
              c.reasons.includes('days') ? `${c.daysSinceLastCheck} giorni` : null,
              c.reasons.includes('cycles') ? `${c.cyclesSinceLastCheck} cicli` : null,
            ]
              .filter(Boolean)
              .join(' / ')
          : [
              c.reasons.includes('days') ? `${c.daysSinceLastCheck} days` : null,
              c.reasons.includes('cycles') ? `${c.cyclesSinceLastCheck} cycles` : null,
            ]
              .filter(Boolean)
              .join(' / ');
      return language === 'it'
        ? `Controllo resistenza dovuto per #${c.battery.packNumber}${series} (${c.battery.batteryType}, ${c.battery.cellCount} celle; ${why} dall'ultimo controllo). Inserisci ${c.battery.cellCount} valori in mΩ in ordine (es. 3.1, 3.2, ...).`
        : `Resistance check due for #${c.battery.packNumber}${series} (${c.battery.batteryType}, ${c.battery.cellCount} cells; ${why} since last check). Please enter ${c.battery.cellCount} per-cell values in mΩ in order (e.g. 3.1, 3.2, ...).`;
    })
    .join('\n');
}
