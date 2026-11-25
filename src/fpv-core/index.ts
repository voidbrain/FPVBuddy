/**
 * Public entry point of the FPV core package.
 *
 * The package stays plain TypeScript: no Angular, no app code, no browser or Node globals,
 * so the FPVBuddy app, NERV and any other consumer can use it the same way.
 * The battery core arrives in F-005-T02; until then this file only fixes the package boundary.
 */

/** Name under which consumers import the core. */
export const FPV_CORE_PACKAGE = '@fpvbuddy/fpv-core';
