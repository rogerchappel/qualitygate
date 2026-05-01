import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CLI = new URL('../cli/qualitygate.js', import.meta.url).pathname;

test('CLI help includes qualitygate run', async () => {
  const result = await runNode([CLI, '--help']);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /qualitygate run/);
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
