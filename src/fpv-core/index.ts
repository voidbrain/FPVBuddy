/**
 * Public entry point of the FPV core package.
 *
 * The package stays plain TypeScript: no Angular, no app code, no browser or Node globals,
 * so the FPVBuddy app and any other consumer can use it the same way.
 */

/** Name under which consumers import the core. */
export const FPV_CORE_PACKAGE = '@fpvbuddy/fpv-core';

export {
  createInMemoryBatteryStorage,
  type BatteryChargeState,
  type BatteryNoteEntry,
  type BatteryRecord,
  type BatteryResistanceEntry,
  type BatteryStorage,
  type BatteryUsageEntry,
  type StoredBattery,
} from './storage.js';

export {
  BatteryRegistry,
  RESISTANCE_CHECK_INTERVAL_CYCLES,
  RESISTANCE_CHECK_INTERVAL_DAYS,
  formatBatteryStateLines,
  formatDueResistancePrompt,
  parseBatteryChatCommand,
  parseBatteryStatusPhrase,
  parseResistanceValues,
  type BatteryChatResult,
  type BatteryImportResult,
  type BatteryRegistryOptions,
  type BatteryStateSummaryRow,
  type DueResistanceCheck,
  type DueResistancePrompt,
  type OneMoreBatteryExport,
  type ParsedBatteryChatCommand,
  type RegisterBatteryInput,
} from './batteries.js';

export {
  GROWTH_STRONG_WARNING_PCT,
  GROWTH_WARNING_PCT,
  PACK_SPREAD_STRONG_WARNING_PCT,
  PACK_SPREAD_WARNING_PCT,
  TATTU_RLINE_V6_1480_6S_PROFILE,
  buildBatteryDashboardCards,
  defaultRetirementMohm,
  evaluateBatteryHealth,
  matchBatteryModelProfile,
  type BatteryCellFinding,
  type BatteryDashboardCard,
  type BatteryHealthReport,
  type BatteryHealthSeverity,
  type BatteryModelProfile,
} from './battery-health.js';
