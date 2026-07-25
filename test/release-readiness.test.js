import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

const VALIDATOR = new URL('../scripts/validate-release-readiness.mjs', import.meta.url).pathname;
const requiredPackageFields = {
  repository: 'https://example.test/qualitygate',
  files: ['src'],
  scripts: {
    'package:smoke': 'true',
    'release:check': 'true'
  }
};

async function runValidator(packageJson, packageLock) {
  const dir = await mkdtemp(path.join(tmpdir(), 'qualitygate-readiness-'));
  await writeFile(path.join(dir, 'package.json'), JSON.stringify(packageJson));
  if (packageLock) {
    await writeFile(path.join(dir, 'package-lock.json'), JSON.stringify(packageLock));
  }

  try {
    execFileSync(process.execPath, [VALIDATOR], { cwd: dir, encoding: 'utf8', stdio: 'pipe' });
    return '';
  } catch (error) {
    return `${error.stdout}${error.stderr}`;
  }
}

test('release readiness requires a package lock', async () => {
  const output = await runValidator(requiredPackageFields);
  assert.match(output, /repository must include package-lock\.json/);
});

test('release readiness rejects stale root dependency metadata', async () => {
  const packageJson = {
    ...requiredPackageFields,
    dependencies: { example: '^2.0.0' }
  };
  const packageLock = {
    lockfileVersion: 3,
    packages: {
      '': { dependencies: { example: '^1.0.0' } }
    }
  };

  const output = await runValidator(packageJson, packageLock);
  assert.match(output, /package-lock\.json root dependencies must match package\.json/);
});
