import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const FORBIDDEN_DEP_PATTERNS = [
  /^@angular\//i,
  /^@runanywhere\//i,
  /^rxjs$/i,
  /^tailwind/i,
  /^@tailwindcss\//i,
];

const FORBIDDEN_CODE_PATTERNS = [
  {
    regex: /(?:from|import)\s*\(?\s*['"]@angular\//,
    reason: 'forbidden @angular/* import in packed core output',
  },
  {
    regex: /@angular\//,
    reason: 'forbidden @angular/* reference in packed core output',
  },
  {
    regex: /(?:from|import)\s*\(?\s*['"][^'"]*(?:\/|^)(?:app|workers)\//,
    reason: 'forbidden FPVBuddy app/workers import in packed core output',
  },
];

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

const CONSUMER_SMOKE_SCRIPT = `
import assert from 'node:assert/strict';
import {
  FPV_CORE_PACKAGE,
  BatteryRegistry,
  createInMemoryBatteryStorage,
  evaluateBatteryHealth,
  buildBatteryDashboardCards,
} from '@fpvbuddy/fpv-core';

assert.equal(FPV_CORE_PACKAGE, '@fpvbuddy/fpv-core');
const registry = new BatteryRegistry(createInMemoryBatteryStorage());
const pack = registry.register({
  packNumber: 3,
  series: 'alpha',
  brand: 'VoltCraft',
  batteryType: 'LiPo 6S',
  cellCount: 6,
  capacityMah: 1300,
  purchaseDate: '2026-10-01',
  initialResistanceMohm: [2.1, 2.2, 2.0, 2.3, 2.1, 2.2],
  recordedAt: '2026-10-01T10:00:00.000Z',
});
registry.recordState(pack.id, 'charged', '2026-10-02T09:00:00.000Z');
const discharged = registry.recordState(pack.id, 'discharged', '2026-10-02T09:10:00.000Z');
assert.equal(discharged.cycles, 1);

const report = evaluateBatteryHealth(discharged, registry.resistanceHistory(pack.id));
assert.equal(report.status, 'healthy');

const cards = buildBatteryDashboardCards(registry, new Date('2026-10-03T12:00:00.000Z'));
assert.equal(cards.length, 1);
assert.equal(cards[0].cycles, 1);
`;

export function verifyCoreStandaloneInstall(coreDir, options = {}) {
  const { buildCommand = true } = options;
  const workDir = mkdtempSync(join(tmpdir(), 'fpv-core-install-check-'));
  const packDir = join(workDir, 'pack');
  const inspectDir = join(workDir, 'inspect');
  const consumerDir = join(workDir, 'consumer');

  try {
    if (buildCommand) {
      execFileSync('npm', ['run', 'build'], {
        cwd: coreDir,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    }

    execFileSync('node', ['-e', 'import("node:fs").then(f=>{for(const d of process.argv.slice(1))f.mkdirSync(d,{recursive:true})})', packDir, inspectDir, consumerDir], {
      encoding: 'utf8',
    });

    const packOut = execFileSync('npm', ['pack', '--json', '--pack-destination', packDir], {
      cwd: coreDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const packMeta = JSON.parse(packOut);
    const firstPack = Array.isArray(packMeta) ? packMeta[0] : undefined;
    if (!firstPack?.filename) {
      throw new Error('npm pack did not report a tarball filename.');
    }
    const tarballPath = join(packDir, firstPack.filename);

    execFileSync('tar', ['-xzf', tarballPath, '-C', inspectDir], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const unpackedRoot = join(inspectDir, 'package');
    const pkgJson = JSON.parse(readFileSync(join(unpackedRoot, 'package.json'), 'utf8'));
    const depFields = ['dependencies', 'peerDependencies', 'optionalDependencies'];
    for (const field of depFields) {
      const deps = pkgJson[field] ?? {};
      for (const depName of Object.keys(deps)) {
        if (FORBIDDEN_DEP_PATTERNS.some((rx) => rx.test(depName))) {
          throw new Error(
            `Packed ${pkgJson.name} declares forbidden dependency "${depName}" in ${field}.`,
          );
        }
      }
    }

    const allPackedFiles = walkFiles(unpackedRoot).map((f) =>
      relative(unpackedRoot, f).replaceAll('\\', '/'),
    );
    for (const relFile of allPackedFiles) {
      if (relFile !== 'package.json' && !relFile.startsWith('dist/')) {
        throw new Error(`Packed ${pkgJson.name} leaked non-dist file: ${relFile}`);
      }
      if (relFile.endsWith('.spec.js') || relFile.endsWith('.spec.d.ts')) {
        throw new Error(`Packed ${pkgJson.name} leaked test file: ${relFile}`);
      }
      if (relFile.endsWith('.js') || relFile.endsWith('.d.ts')) {
        const text = readFileSync(join(unpackedRoot, relFile), 'utf8');
        for (const { regex, reason } of FORBIDDEN_CODE_PATTERNS) {
          if (regex.test(text)) {
            throw new Error(`Packed ${pkgJson.name} (${relFile}): ${reason}`);
          }
        }
      }
    }

    writeFileSync(
      join(consumerDir, 'package.json'),
      JSON.stringify(
        {
          name: 'fpv-core-standalone-consumer',
          version: '0.0.0',
          private: true,
          type: 'module',
        },
        null,
        2,
      ),
      'utf8',
    );

    execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', tarballPath], {
      cwd: consumerDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    if (existsSync(join(consumerDir, 'node_modules', '@angular'))) {
      throw new Error('Standalone consumer node_modules pulled in @angular packages.');
    }

    execFileSync(process.execPath, ['--input-type=module', '-e', CONSUMER_SMOKE_SCRIPT], {
      cwd: consumerDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    return {
      packageName: pkgJson.name,
      packedFiles: allPackedFiles,
    };
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const coreDir = join(repoRoot, 'src', 'fpv-core');
  const result = verifyCoreStandaloneInstall(coreDir, { buildCommand: true });
  process.stdout.write(
    `Verified standalone pack & install for ${result.packageName} (${result.packedFiles.length} packed files; no Angular or app code).\n`,
  );
}
