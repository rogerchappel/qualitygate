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
