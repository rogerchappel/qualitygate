import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CLI = new URL('../cli/qualitygate.js', import.meta.url).pathname;
const PACKAGE = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('CLI help includes qualitygate run', async () => {
  const result = await runNode([CLI, '--help']);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /qualitygate run/);
});

test('CLI version prints package version', async () => {
  const result = await runNode([CLI, '--version']);
  assert.equal(result.code, 0);
  assert.equal(result.stdout, `${PACKAGE.version}\n`);
});

test('qualitygate run executes scripts and writes reports', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'qualitygate-pass-'));
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ scripts: { lint: 'node -e "console.log(\'lint ok\')"', test: 'node -e "console.log(\'test ok\')"' } }));

  const result = await runNode([CLI, 'run', dir]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Detected checks: lint, test/);
  const json = JSON.parse(await readFile(path.join(dir, 'quality-report.json'), 'utf8'));
  assert.equal(json.status, 'pass');
  assert.deepEqual(json.checks.map((check) => check.name), ['lint', 'test']);
});

test('qualitygate run exits non-zero when a check fails', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'qualitygate-fail-'));
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ scripts: { test: 'node -e "process.exit(7)"' } }));

  const result = await runNode([CLI, 'run', dir]);

  assert.equal(result.code, 1);
  const json = JSON.parse(await readFile(path.join(dir, 'quality-report.json'), 'utf8'));
  assert.equal(json.status, 'fail');
  assert.equal(json.checks[0].exitCode, 7);
});

test('qualitygate run accepts --no-write before the target path', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'qualitygate-no-write-'));
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ scripts: { test: 'node -e "console.log(\'target test ok\')"' } }));

  const result = await runNode([CLI, 'run', '--no-write', dir]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, new RegExp(`qualitygate: ${escapeRegExp(dir)}`));
  assert.match(result.stdout, /target test ok/);
  await assert.rejects(access(path.join(dir, 'QUALITY_REPORT.md')));
  await assert.rejects(access(path.join(dir, 'quality-report.json')));
});

test('qualitygate run accepts the documented path then --no-write ordering', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'qualitygate-no-write-documented-'));
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ scripts: { test: 'node -e "console.log(\'documented order ok\')"' } }));

  const result = await runNode([CLI, 'run', dir, '--no-write']);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /documented order ok/);
  await assert.rejects(access(path.join(dir, 'QUALITY_REPORT.md')));
  await assert.rejects(access(path.join(dir, 'quality-report.json')));
});

test('qualitygate run rejects malformed arguments before executing scripts', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'qualitygate-invalid-'));
  const marker = path.join(dir, 'script-ran');
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ scripts: { test: `node -e "require('node:fs').writeFileSync('${marker}', '')"` } }));

  const invocations = [
    [dir, '--bogus'],
    [dir, '--no-write=true'],
    [dir, path.join(dir, 'extra')],
    ['--no-write', '--no-write', dir]
  ];

  for (const args of invocations) {
    const result = await runNode([CLI, 'run', ...args]);
    assert.equal(result.code, 2, `expected usage failure for ${args.join(' ')}`);
    assert.match(result.stderr, /Invalid arguments for run:/);
  }

  await assert.rejects(access(marker));
  await assert.rejects(access(path.join(dir, 'QUALITY_REPORT.md')));
  await assert.rejects(access(path.join(dir, 'quality-report.json')));
});

test('qualitygate run reports conflicting lockfiles before executing a script', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'qualitygate-manager-conflict-'));
  const marker = path.join(dir, 'script-ran');
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ scripts: { test: `node -e "require('node:fs').writeFileSync('${marker}', '')"` } }));
  await writeFile(path.join(dir, 'package-lock.json'), '');
  await writeFile(path.join(dir, 'yarn.lock'), '');

  const result = await runNode([CLI, 'run', dir, '--no-write']);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Conflicting package manager lockfiles:/);
  assert.match(result.stderr, /set package\.json#packageManager/);
  await assert.rejects(access(marker));
});

function runNode(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
