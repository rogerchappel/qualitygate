import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

const VALIDATOR = new URL('../scripts/validate-release-readiness.mjs', import.meta.url).pathname;
const requiredPackageFields = {
  name: '@rogerchappel/qualitygate',
  version: '0.1.0',
  bin: { qualitygate: './cli/qualitygate.js' },
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

test('release readiness rejects conflicting package and bin identities', async () => {
  const packageJson = {
    ...requiredPackageFields,
    name: 'qualitygate'
  };
  const packageLock = {
    name: 'qualitygate',
    lockfileVersion: 3,
    packages: {
      '': {
        name: 'qualitygate',
        version: packageJson.version,
        bin: packageJson.bin
      }
    }
  };

  const output = await runValidator(packageJson, packageLock);
  assert.match(output, /must use the publishable @rogerchappel\/qualitygate name/);
});

test('release readiness rejects stale locked package metadata', async () => {
  const packageLock = {
    name: requiredPackageFields.name,
    lockfileVersion: 3,
    packages: {
      '': {
        name: requiredPackageFields.name,
        version: '0.0.9',
        bin: { other: './cli/qualitygate.js' }
      }
    }
  };

  const output = await runValidator(requiredPackageFields, packageLock);
  assert.match(output, /root version must match package\.json/);
  assert.match(output, /root bin must match package\.json/);
});

test('release readiness accepts npm-normalized bin metadata', async () => {
  const packageLock = {
    name: requiredPackageFields.name,
    lockfileVersion: 3,
    packages: {
      '': {
        name: requiredPackageFields.name,
        version: requiredPackageFields.version,
        bin: { qualitygate: 'cli/qualitygate.js' }
      }
    }
  };

  const output = await runValidator(requiredPackageFields, packageLock);
  assert.equal(output, '');
});
