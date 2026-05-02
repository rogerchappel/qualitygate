import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { buildRunCommand } from '../detection/package.js';

const EXECUTABLES = {
  npm: ['npm', ['run']],
  pnpm: ['pnpm', ['run']],
  yarn: ['yarn', ['run']],
  bun: ['bun', ['run']]
};

export function runScript({ repoDir, packageManager, scriptName }) {
  const [command, baseArgs] = EXECUTABLES[packageManager] ?? EXECUTABLES.npm;
  const args = [...baseArgs, scriptName];
  const started = performance.now();

  return new Promise((resolve) => {
    let output = '';
    const child = spawn(command, args, {
      cwd: repoDir,
      env: { ...process.env, CI: process.env.CI ?? '1' },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    child.stdout.on('data', (chunk) => {
      output += chunk.toString();
      process.stdout.write(chunk);
    });
    child.stderr.on('data', (chunk) => {
      output += chunk.toString();
      process.stderr.write(chunk);
    });
    child.on('error', (error) => {
      const durationMs = Math.round(performance.now() - started);
      resolve({
        name: scriptName,
        command: buildRunCommand(packageManager, scriptName),
        exitCode: 127,
        durationMs,
        summary: error.message,
        output: trimOutput(output)
      });
    });
    child.on('close', (code) => {
      const durationMs = Math.round(performance.now() - started);
      const exitCode = code ?? 1;
      resolve({
        name: scriptName,
        command: buildRunCommand(packageManager, scriptName),
        exitCode,
        durationMs,
        summary: summarize(output, exitCode),
        output: trimOutput(output)
      });
    });
  });
}

export async function runChecks({ repoDir, packageManager, scripts }) {
  const results = [];
  for (const script of scripts) {
    results.push(await runScript({ repoDir, packageManager, scriptName: script.name }));
  }
  return results;
}

export function hasFailures(results) {
  return results.some((result) => result.exitCode !== 0);
}

function summarize(output, exitCode) {
  const lines = output.trim().split(/\r?\n/).filter(Boolean);
  const lastLine = lines.at(-1) ?? (exitCode === 0 ? 'completed successfully' : 'failed');
  return exitCode === 0 ? `passed: ${lastLine}` : `failed: ${lastLine}`;
}

function trimOutput(output) {
  const max = 12000;
  if (output.length <= max) return output;
  return `${output.slice(0, 6000)}\n...[output truncated]...\n${output.slice(-6000)}`;
}
