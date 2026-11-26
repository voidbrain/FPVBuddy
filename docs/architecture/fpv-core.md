# `@fpvbuddy/fpv-core` Public API

`@fpvbuddy/fpv-core` (`src/fpv-core/`) is FPVBuddy's framework-free TypeScript battery-management package. It contains zero Angular, application, browser, or Node globals so FPVBuddy's web app, local tools, MCP server, and standalone TypeScript consumers share identical validation, cycle-counting, and internal-resistance health logic.

## Build and test

From the repository root:

```bash
npm run core:build   # compiles src/fpv-core/ into src/fpv-core/dist/ (.js + .d.ts)
npm run core:test    # runs Vitest unit specs in src/fpv-core/
```

## Quick example

```ts
import {
  BatteryRegistry,
  buildBatteryDashboardCards,
  createInMemoryBatteryStorage,
} from '@fpvbuddy/fpv-core';

const registry = new BatteryRegistry(createInMemoryBatteryStorage());

// Register an invented 6S pack with its initial ordered per-cell resistance (mΩ)
const pack = registry.register({
  packNumber: 7,
  series: 'blu',
  seriesColor: 'blue',
  brand: 'VoltCraft',
  batteryType: 'LiPo 6S',
  cellCount: 6,
  capacityMah: 1300,
  purchaseDate: '2026-10-01',
  initialResistanceMohm: [2.1, 2.2, 2.0, 2.3, 2.1, 2.2],
  recordedAt: '2026-10-01T09:00:00.000Z',
});

// Log a flight cycle: cycles increment by 1 strictly on charged -> discharged
registry.recordState(pack.id, 'charged', '2026-10-05T10:00:00.000Z');
registry.recordState(pack.id, 'discharged', '2026-10-05T10:15:00.000Z');
registry.recordState(pack.id, 'stored', '2026-10-05T18:00:00.000Z');

// Record a later per-cell resistance check (array or delimited text)
registry.recordResistance(pack.id, '2.2, 2.3, 2.1, 2.4, 2.2, 2.3 mΩ', '2026-11-01T09:00:00.000Z');

// Evaluate cell health and build summary cards
const [health] = registry.healthAdvice(pack.id, 'en');
const cards = buildBatteryDashboardCards(registry, new Date('2026-11-02T12:00:00.000Z'));
console.log(health?.status, cards[0]?.cycles); // "healthy", 1
```

## Package identity and storage contract

- `FPV_CORE_PACKAGE`: `'@fpvbuddy/fpv-core'`.
- `createInMemoryBatteryStorage(): BatteryStorage`: reference in-memory adapter enforcing unique `(packNumber, lower(series), lower(seriesColor))` tuples, ascending `(packNumber, seriesColor ?? series)` pack order, and chronological `(recordedAt, insertionOrder)` history order.
- Custom persistence backends (IndexedDB, SQLite, JSON files) implement `BatteryStorage`:

| Method | Behaviour |
|---|---|
| `insertBattery(battery: StoredBattery): void` | Persists a new battery; throws if `id` or `(packNumber, lower(series), lower(seriesColor))` already exists. |
| `getBattery(id: string): StoredBattery \| undefined` | Returns a stored battery by ID or `undefined`. |
| `listBatteries(): StoredBattery[]` | Returns all stored batteries ordered by `packNumber` ascending, then `seriesColor ?? series ?? ''`. |
| `updateBatteryState(id, state, cycleIncrement): void` | Updates `currentState` and adds `cycleIncrement` to `cycles`; throws if `id` is missing. |
| `setResistancePromptedRecordId(id, recordId): void` | Stores or clears (`null`) the last resistance record ID for which a due-check prompt was claimed. |
| `insertUsage` / `listUsage(batteryId)` | Appends and lists `BatteryUsageEntry` rows ordered by `recordedAt` ascending. |
| `insertResistance` / `listResistance(batteryId)` | Appends and lists `BatteryResistanceEntry` rows ordered by `recordedAt` ascending. |
| `insertNote` / `listNotes(batteryId)` | Appends and lists `BatteryNoteEntry` rows ordered by `recordedAt` ascending. |

### Core record types

- `BatteryChargeState`: `'charged' | 'stored' | 'discharged'`.
- `BatteryRecord`: `{ id, packNumber, series?, seriesColor?, label, brand, batteryType, cellCount, capacityMah, purchaseDate, currentState, cycles, retiredAt?, createdAt }`.
- `StoredBattery`: `BatteryRecord & { resistancePromptedRecordId?: string | null }`.
- `BatteryUsageEntry`: `{ id, batteryId, state, recordedAt }`.
- `BatteryResistanceEntry`: `{ id, batteryId, valuesMohm: number[], cyclesAtRecord, recordedAt }`.
- `BatteryNoteEntry`: `{ id, batteryId, note, recordedAt }`.

## `BatteryRegistry`

`new BatteryRegistry(storage?: BatteryStorage, options?: BatteryRegistryOptions)` wraps `storage` (defaulting to `createInMemoryBatteryStorage()`) and optional `{ createId?: (prefix: string) => string }`.

| Method | Summary and validation errors |
|---|---|
| `register(input: RegisterBatteryInput): BatteryRecord` | Validates `packNumber >= 1`, integer `cellCount` in `1..12`, integer `capacityMah >= 50`, non-blank `brand`, `batteryType`, and `purchaseDate`, and `cellCount` positive finite `initialResistanceMohm` values (unless `allowPendingResistance: true` with `initialResistanceMohm === undefined`). Defaults `initialState` to `'stored'`. Throws `Error` on invalid input or duplicate pack/series. |
| `get(id: string)` / `list()` | Reads one or all `BatteryRecord` entries (stripping internal `resistancePromptedRecordId`). |
| `findByNumberAndSeries(packNumber, seriesOrColor?)` | Filters packs matching `packNumber` and optional case-insensitive `series` or `seriesColor`. |
| `recordState(batteryId, state, recordedAt?)` | Appends a `BatteryUsageEntry`, updates `currentState`, and increments `cycles` by `1` only when transitioning from `'charged'` to `'discharged'`. Throws if `batteryId` does not exist. |
| `recordResistance(batteryId, valuesMohm, recordedAt?)` | Validates `cellCount` positive finite mΩ readings (array or delimited string, rounded to 3 decimals), records `cyclesAtRecord`, and resets `resistancePromptedRecordId` to `null`. |
| `usageHistory(batteryId)` / `resistanceHistory(batteryId)` | Returns chronological usage or resistance history for `batteryId`. |
| `addNote(batteryId, note, recordedAt?)` / `notes(batteryId)` | Trims and stores a 1–500 character note with a valid timestamp on an existing battery, or lists its notes. |
| `dueResistanceChecks(now?: Date): DueResistanceCheck[]` | Flags non-retired packs whose latest resistance check is at least `RESISTANCE_CHECK_INTERVAL_DAYS` (`90`) days or `RESISTANCE_CHECK_INTERVAL_CYCLES` (`30`) cycles old (`reasons: Array<'days' \| 'cycles'>`). |
| `claimDueResistancePrompts(now?, language?): DueResistancePrompt[]` | Returns `{ check, message }` for each due battery not yet prompted for its `latestRecordId`, marking `resistancePromptedRecordId` so repeated calls do not duplicate prompts until a new resistance record is logged. |
| `healthAdvice(batteryId?, language?): BatteryHealthReport[]` | Evaluates `evaluateBatteryHealth` for one battery or all active (non-retired) batteries in `'en'` or `'it'`. |
| `importOneMoreBattery(payload: OneMoreBatteryExport): BatteryImportResult` | Imports active batteries, chronological resistance records (requiring at least one per imported pack), and usage transitions (`1 -> charged`, `2 -> stored`, `3 -> discharged`), skipping `deleted === 1` or `enabled === 0` entries. |
| `applyChatPhrase(text, recordedAt?): BatteryChatResult` | Parses Italian or English registration and state-change phrases; returns `status: 'ambiguous'` (without mutating state) when a pack number matches multiple active series. |

## Parsing, formatting, and health helpers

- `parseResistanceValues(input: string | readonly number[], expectedCells?: number): number[]` — strips `mΩ`/`mO` units, splits on whitespace/commas/semicolons, validates positive finite numbers (and exact `expectedCells` length when supplied), and rounds to 3 decimals.
- `parseBatteryChatCommand(text: string): ParsedBatteryChatCommand | undefined` — extracts target `BatteryChargeState`, unique pack numbers, optional series/colour alias, and `'it' | 'en'` language.
- `parseBatteryStatusPhrase(text: string): 'it' | 'en' | null` — matches standalone status-list queries (`"battery status"`, `"list batteries"`, `"stato batterie"`, `"lista batterie"`).
- `formatBatteryStateLines(batteries, language?)` and `formatDueResistancePrompt(checks, language?)` — human-readable English/Italian summaries.
- `evaluateBatteryHealth(battery, records, options?)`:
  - Returns `status: 'no_records'` when `records` is empty, `'healthy'` when all cells stay below thresholds, or the highest severity across cell findings (`'warning'`, `'strong_warning'`, `'retire'`).
  - Relative thresholds: `GROWTH_WARNING_PCT` (`50`), `GROWTH_STRONG_WARNING_PCT` (`100`) vs. the first recorded value of each cell; `PACK_SPREAD_WARNING_PCT` (`30`), `PACK_SPREAD_STRONG_WARNING_PCT` (`50`) vs. the median of the pack's other cells.
  - Retirement and model profiles: `matchBatteryModelProfile(battery)` matches `TATTU_RLINE_V6_1480_6S_PROFILE` (`agingWarningMohm: 4.5`, `strongWarningMohm: 7`, `retireMohm: 8`, `retireSpreadPct: 30`); otherwise `defaultRetirementMohm(battery)` returns `10` mΩ for `LiHV` packs and `12` mΩ for `LiPo` and other chemistries.
- `buildBatteryDashboardCards(registry, now?): BatteryDashboardCard[]` — returns one summary card per active battery with `currentState`, `cycles`, `lastResistance`, `resistanceDueAt`, `resistanceOverdue`, `resistanceDueReasons`, `storageReminderActive` (`currentState !== 'stored'`), and `healthStatus`.
