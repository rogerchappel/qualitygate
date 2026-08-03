import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const expected = JSON.parse(readFileSync('package.json', 'utf8'));
const output = execFileSync('npm', ['pack', '--json'], {
  encoding: 'utf8'
});

const [pack] = JSON.parse(output);
assert.equal(pack.name, '@rogerchappel/qualitygate');
assert.equal(pack.version, expected.version);
const files = new Set(pack.files.map((file) => file.path));
const required = [
  'cli/qualitygate.js',
  'src/index.js',
  'src/detection/package.js',
  'src/execution/run.js',
  'src/reporting/report.js',
  'docs/README.md',
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md'
];

for (const file of required) {
  assert.ok(files.has(file), `expected package to include ${file}`);
}

const installRoot = mkdtempSync(path.join(tmpdir(), 'qualitygate-package-smoke-'));

try {
  execFileSync('npm', ['install', '--prefix', installRoot, '--ignore-scripts', path.resolve(pack.filename)], {
    encoding: 'utf8',
    stdio: 'pipe'
  });

  const installedPackage = JSON.parse(
    readFileSync(path.join(installRoot, 'node_modules', '@rogerchappel', 'qualitygate', 'package.json'), 'utf8')
  );
  assert.equal(installedPackage.name, '@rogerchappel/qualitygate');
  assert.equal(installedPackage.version, expected.version);
  assert.deepEqual(installedPackage.bin, { qualitygate: './cli/qualitygate.js' });

  const help = execFileSync(path.join(installRoot, 'node_modules', '.bin', 'qualitygate'), ['--help'], {
    encoding: 'utf8'
  });
  assert.match(help, /qualitygate run/);
} finally {
  rmSync(installRoot, { recursive: true, force: true });
  rmSync(pack.filename, { force: true });
}

console.log(`package smoke ok: ${pack.filename} includes ${pack.files.length} files and installs the qualitygate CLI`);
