import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const lockPath = path.join(root, 'package-lock.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const scripts = packageJson.scripts ?? {};
const failures = [];

function requireField(condition, message) {
  if (!condition) failures.push(message);
}

requireField(packageJson.repository, 'package.json must declare repository metadata');
requireField(packageJson.name === '@rogerchappel/qualitygate', 'package.json must use the publishable @rogerchappel/qualitygate name');
requireField(packageJson.bin?.qualitygate === './cli/qualitygate.js', 'package.json must map the qualitygate bin to ./cli/qualitygate.js');
requireField(Array.isArray(packageJson.files) && packageJson.files.length > 0, 'package.json must declare a non-empty files allowlist');
requireField(scripts['package:smoke'], 'package.json scripts must include package:smoke');
requireField(scripts['release:check'], 'package.json scripts must include release:check');
requireField(
  /(?:^|&&\s*)npm run release:readiness(?:\s*&&|$)/.test(scripts['release:check'] ?? ''),
  'package.json release:check must run release:readiness'
);
requireField(
  !/npm run release:check/.test(scripts['release:readiness'] ?? ''),
  'package.json release:readiness must not invoke release:check recursively'
);
requireField(fs.existsSync(lockPath), 'repository must include package-lock.json');

if (fs.existsSync(lockPath)) {
  const packageLock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  const lockedRoot = packageLock.packages?.[''] ?? {};
  const dependencyFields = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];

  for (const field of dependencyFields) {
    const declared = packageJson[field] ?? {};
    const locked = lockedRoot[field] ?? {};
    requireField(
      JSON.stringify(declared) === JSON.stringify(locked),
      `package-lock.json root ${field} must match package.json`
    );
  }

  requireField(packageLock.name === packageJson.name, 'package-lock.json name must match package.json');
  requireField(lockedRoot.name === packageJson.name, 'package-lock.json root name must match package.json');
  requireField(lockedRoot.version === packageJson.version, 'package-lock.json root version must match package.json');
  const normalizedBin = Object.fromEntries(
    Object.entries(packageJson.bin ?? {}).map(([name, target]) => [name, target.replace(/^\.\//, '')])
  );
  requireField(
    JSON.stringify(lockedRoot.bin ?? {}) === JSON.stringify(normalizedBin),
    'package-lock.json root bin must match package.json'
  );
}

const workflowDir = path.join(root, '.github', 'workflows');
if (fs.existsSync(workflowDir)) {
  const workflowFiles = fs.readdirSync(workflowDir).filter((file) => /\.ya?ml$/.test(file));
  requireField(workflowFiles.length > 0, 'repository must include at least one workflow file');

  for (const file of workflowFiles) {
    const workflow = fs.readFileSync(path.join(workflowDir, file), 'utf8');
    requireField(!/TODO|FIXME|template becomes an app|customization TODO/i.test(workflow), `.github/workflows/${file} still contains placeholder text`);
  }

  const combined = workflowFiles.map((file) => fs.readFileSync(path.join(workflowDir, file), 'utf8')).join('\n');
  requireField(/release:check/.test(combined), 'CI workflows must run npm run release:check');

  const releasePath = path.join(workflowDir, 'release.yml');
  requireField(fs.existsSync(releasePath), 'repository must include .github/workflows/release.yml');
  if (fs.existsSync(releasePath)) {
    const release = fs.readFileSync(releasePath, 'utf8');
    const releaseRequirements = [
      [/tags:\s*\n\s*- ['"]v\*['"]/, 'release workflow must run for v* tags'],
      [/workflow_dispatch:/, 'release workflow must provide manual recovery'],
      [/id-token:\s*write/, 'release workflow must grant OIDC id-token write permission'],
      [/npm ci/, 'release workflow must use npm ci'],
      [/npm run release:check/, 'release workflow must run npm run release:check'],
      [/npm publish --access public --provenance/, 'release workflow must publish publicly with provenance'],
      [/npm pack --json/, 'release workflow must pack the release artifact'],
      [/npm view [^\n]*steps\.version\.outputs\.version/, 'release workflow must check the exact npm version'],
      [/gh release (?:view|create)/, 'release workflow must manage a GitHub release']
    ];
    for (const [pattern, message] of releaseRequirements) {
      requireField(pattern.test(release), message);
    }
  }
}

if (failures.length > 0) {
  console.error('Release readiness validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Release readiness validation passed.');
