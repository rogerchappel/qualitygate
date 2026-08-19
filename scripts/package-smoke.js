import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

  const version = execFileSync(path.join(installRoot, 'node_modules', '.bin', 'qualitygate'), ['--version'], {
    encoding: 'utf8'
  });
  assert.equal(version, `${expected.version}\n`);
} finally {
  rmSync(installRoot, { recursive: true, force: true });
  rmSync(pack.filename, { force: true });
}

const versionFixtureRoot = mkdtempSync(path.join(tmpdir(), 'qualitygate-version-fixture-'));
const fixtureVersion = '9.8.7-test.1';

try {
  for (const entry of ['cli', 'src', 'docs', 'scripts', 'README.md', 'LICENSE', 'SECURITY.md', 'CHANGELOG.md', 'CONTRIBUTING.md']) {
    cpSync(entry, path.join(versionFixtureRoot, entry), { recursive: true });
  }
  writeFileSync(
    path.join(versionFixtureRoot, 'package.json'),
    `${JSON.stringify({ ...expected, version: fixtureVersion }, null, 2)}\n`
  );

  const fixturePackOutput = execFileSync('npm', ['pack', '--json'], {
    cwd: versionFixtureRoot,
    encoding: 'utf8'
  });
  const [fixturePack] = JSON.parse(fixturePackOutput);
  const fixtureInstallRoot = path.join(versionFixtureRoot, 'install');
  execFileSync('npm', ['install', '--prefix', fixtureInstallRoot, '--ignore-scripts', path.join(versionFixtureRoot, fixturePack.filename)], {
    encoding: 'utf8',
    stdio: 'pipe'
  });
  const fixtureCli = path.join(fixtureInstallRoot, 'node_modules', '.bin', 'qualitygate');
  const fixtureCliVersion = execFileSync(fixtureCli, ['--version'], { encoding: 'utf8' });
  assert.equal(fixtureCliVersion, `${fixtureVersion}\n`);
} finally {
  rmSync(versionFixtureRoot, { recursive: true, force: true });
}

console.log(`package smoke ok: ${pack.filename} includes ${pack.files.length} files and installed CLIs derive their manifest version`);
