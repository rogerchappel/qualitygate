import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { detectProject } from '../src/index.js';

test('detectProject detects package manager from packageManager and ordered scripts', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'qualitygate-detect-'));
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ packageManager: 'pnpm@9.0.0', scripts: { build: 'echo build', lint: 'echo lint', test: 'echo test' } }));

  const project = await detectProject(dir);

  assert.equal(project.packageManager, 'pnpm');
  assert.deepEqual(project.scripts.map((script) => script.name), ['lint', 'test', 'build']);
  assert.equal(project.scripts[0].command, 'pnpm run lint');
});

test('detectProject treats repos without package.json as no-op', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'qualitygate-empty-'));
  const project = await detectProject(dir);
  assert.equal(project.packageManager, null);
  assert.deepEqual(project.scripts, []);
});

for (const [manager, declaration, lockfile] of [
  ['npm', 'npm@11.0.0', 'package-lock.json'],
  ['pnpm', 'pnpm@10.0.0', 'pnpm-lock.yaml'],
  ['yarn', 'yarn@4.0.0', 'yarn.lock'],
  ['bun', 'bun@1.2.0', 'bun.lock']
]) {
  test(`detectProject accepts aligned ${manager} packageManager and lockfile signals`, async () => {
    const dir = await mkdtemp(path.join(tmpdir(), `qualitygate-${manager}-`));
    await writeFile(path.join(dir, 'package.json'), JSON.stringify({ packageManager: declaration, scripts: { test: 'echo test' } }));
    await writeFile(path.join(dir, lockfile), '');

    const project = await detectProject(dir);

    assert.equal(project.packageManager, manager);
    assert.equal(project.scripts[0].command, `${manager} run test`);
  });
}

test('detectProject honors a supported packageManager declaration over a conflicting lockfile', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'qualitygate-declared-manager-'));
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ packageManager: 'pnpm@10.0.0', scripts: { test: 'echo test' } }));
  await writeFile(path.join(dir, 'package-lock.json'), '');

  const project = await detectProject(dir);

  assert.equal(project.packageManager, 'pnpm');
  assert.equal(project.scripts[0].command, 'pnpm run test');
});

test('detectProject preserves single-lockfile fallback without packageManager', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'qualitygate-lockfile-fallback-'));
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ scripts: { test: 'echo test' } }));
  await writeFile(path.join(dir, 'yarn.lock'), '');

  const project = await detectProject(dir);

  assert.equal(project.packageManager, 'yarn');
});

test('detectProject rejects conflicting lockfiles without packageManager', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'qualitygate-lockfile-conflict-'));
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ scripts: { test: 'echo test' } }));
  await writeFile(path.join(dir, 'package-lock.json'), '');
  await writeFile(path.join(dir, 'pnpm-lock.yaml'), '');

  await assert.rejects(
    detectProject(dir),
    /Conflicting package manager lockfiles:.*pnpm-lock\.yaml \(pnpm\).*package-lock\.json \(npm\)/
  );
});
