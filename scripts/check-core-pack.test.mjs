import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { verifyCoreStandaloneInstall } from './check-core-pack.mjs';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REAL_CORE_DIR = join(REPO_ROOT, 'src', 'fpv-core');

function makeSyntheticPackage(files) {
  const pkgDir = mkdtempSync(join(tmpdir(), 'fpv-core-synth-'));
  for (const [relPath, content] of Object.entries(files)) {
    const fullPath = join(pkgDir, relPath);
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, content, 'utf8');
  }
  return pkgDir;
}

describe('standalone @fpvbuddy/fpv-core pack-and-install check (F-005-T04)', () => {
  it('packs src/fpv-core, installs it into an isolated consumer, and exercises its public API', () => {
    const result = verifyCoreStandaloneInstall(REAL_CORE_DIR, { buildCommand: true });
    assert.equal(result.packageName, '@fpvbuddy/fpv-core');
    assert.ok(result.packedFiles.some((f) => f === 'dist/index.js'));
    assert.ok(result.packedFiles.some((f) => f === 'dist/index.d.ts'));
  });

  it('fails when the packed package declares an Angular or app dependency', () => {
    const badPkgDir = makeSyntheticPackage({
      'package.json': JSON.stringify(
        {
          name: '@fpvbuddy/fpv-core',
          version: '0.0.0',
          type: 'module',
          exports: { '.': './dist/index.js' },
          files: ['dist'],
          dependencies: { '@angular/core': '^22.0.0' },
        },
        null,
        2,
      ),
      'dist/index.js': 'export const FPV_CORE_PACKAGE = "@fpvbuddy/fpv-core";\n',
    });
    try {
      assert.throws(
        () => verifyCoreStandaloneInstall(badPkgDir, { buildCommand: false }),
        /@angular\/core/i,
      );
    } finally {
      rmSync(badPkgDir, { recursive: true, force: true });
    }
  });

  it('fails when packed files import @angular/* or FPVBuddy app/worker paths', () => {
    const angularLeakDir = makeSyntheticPackage({
      'package.json': JSON.stringify(
        {
          name: '@fpvbuddy/fpv-core',
          version: '0.0.0',
          type: 'module',
          exports: { '.': './dist/index.js' },
          files: ['dist'],
        },
        null,
        2,
      ),
      'dist/index.js':
        'import { signal } from "@angular/core";\nexport const FPV_CORE_PACKAGE = String(signal);\n',
    });
    try {
      assert.throws(
        () => verifyCoreStandaloneInstall(angularLeakDir, { buildCommand: false }),
        /forbidden.*@angular/i,
      );
    } finally {
      rmSync(angularLeakDir, { recursive: true, force: true });
    }

    const appLeakDir = makeSyntheticPackage({
      'package.json': JSON.stringify(
        {
          name: '@fpvbuddy/fpv-core',
          version: '0.0.0',
          type: 'module',
          exports: { '.': './dist/index.js' },
          files: ['dist'],
        },
        null,
        2,
      ),
      'dist/index.js':
        'import { ModelService } from "../../app/services/model.service.js";\nexport { ModelService };\n',
    });
    try {
      assert.throws(
        () => verifyCoreStandaloneInstall(appLeakDir, { buildCommand: false }),
        /forbidden.*app/i,
      );
    } finally {
      rmSync(appLeakDir, { recursive: true, force: true });
    }
  });
});
