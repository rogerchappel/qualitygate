import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const output = execFileSync('npm', ['pack', '--dry-run', '--json'], {
  encoding: 'utf8'
});

const [pack] = JSON.parse(output);
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

console.log(`package smoke ok: ${pack.filename} includes ${pack.files.length} files`);
