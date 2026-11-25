import { describe, expect, it } from 'vitest';
import { FPV_CORE_PACKAGE } from './index.js';

describe('fpv-core package boundary', () => {
  it('exports its public name from the entry point', () => {
    expect(FPV_CORE_PACKAGE).toBe('@fpvbuddy/fpv-core');
  });
});
