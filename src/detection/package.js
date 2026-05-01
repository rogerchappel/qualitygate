import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const SCRIPT_ORDER = ['lint', 'typecheck', 'test', 'build'];
const LOCKFILES = [
  ['pnpm', 'pnpm-lock.yaml'],
  ['npm', 'package-lock.json'],
  ['yarn', 'yarn.lock'],
  ['bun', 'bun.lockb'],
  ['bun', 'bun.lock']
];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function detectPackageManager(repoDir = process.cwd()) {
  for (const [manager, lockfile] of LOCKFILES) {
    if (await exists(path.join(repoDir, lockfile))) return manager;
  }

  const packageJsonPath = path.join(repoDir, 'package.json');
  const raw = await readFile(packageJsonPath, 'utf8');
  const pkg = JSON.parse(raw);
  if (typeof pkg.packageManager === 'string') {
    const [manager] = pkg.packageManager.split('@');
    if (['npm', 'pnpm', 'yarn', 'bun'].includes(manager)) return manager;
  }

  return 'npm';
}

export async function detectPackageScripts(repoDir = process.cwd()) {
  const packageManager = await detectPackageManager(repoDir);
  const packageJsonPath = path.join(repoDir, 'package.json');
  const raw = await readFile(packageJsonPath, 'utf8');
  const pkg = JSON.parse(raw);
  const scripts = pkg.scripts && typeof pkg.scripts === 'object' ? pkg.scripts : {};

  return SCRIPT_ORDER.filter((name) => typeof scripts[name] === 'string').map((name) => ({
    name,
    command: buildRunCommand(packageManager, name)
  }));
}


export function buildRunCommand(packageManager, scriptName) {
  switch (packageManager) {
    case 'pnpm':
      return `pnpm run ${scriptName}`;
    case 'yarn':
      return `yarn run ${scriptName}`;
    case 'bun':
      return `bun run ${scriptName}`;
    case 'npm':
    default:
      return `npm run ${scriptName}`;
  }
}

export async function detectProject(repoDir = process.cwd()) {
  const packageJsonPath = path.join(repoDir, 'package.json');
  if (!(await exists(packageJsonPath))) {
    return { repoDir, packageManager: null, scripts: [] };
  }

  const packageManager = await detectPackageManager(repoDir);
  const raw = await readFile(packageJsonPath, 'utf8');
  const pkg = JSON.parse(raw);
  const packageScripts = pkg.scripts && typeof pkg.scripts === 'object' ? pkg.scripts : {};
  const scripts = SCRIPT_ORDER.filter((name) => typeof packageScripts[name] === 'string').map((name) => ({
    name,
    command: buildRunCommand(packageManager, name)
  }));

  return { repoDir, packageManager, scripts };
}

export { SCRIPT_ORDER };
