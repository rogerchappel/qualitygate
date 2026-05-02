import test from 'node:test';
import assert from 'node:assert/strict';
import { createReport, renderMarkdown } from '../src/index.js';

test('createReport produces expected JSON schema shape', () => {
  const report = createReport({
    repoDir: '/tmp/repo',
    packageManager: 'npm',
    results: [{ name: 'test', command: 'npm run test', exitCode: 0, durationMs: 12, summary: 'passed' }]
  });

  assert.equal(report.status, 'pass');
  assert.match(report.generatedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.deepEqual(Object.keys(report).sort(), ['checks', 'generatedAt', 'packageManager', 'repoDir', 'status']);
  assert.deepEqual(Object.keys(report.checks[0]).sort(), ['command', 'durationMs', 'exitCode', 'name', 'summary']);
});

test('renderMarkdown includes command result table', () => {
  const report = createReport({ repoDir: '/tmp/repo', packageManager: 'npm', results: [] });
  assert.match(renderMarkdown(report), /# Quality Report/);
  assert.match(renderMarkdown(report), /no supported scripts detected/);
});
