#!/usr/bin/env node
import { resolve } from 'node:path';
import { createReport, detectProject, hasFailures, runChecks, writeReports } from '../src/index.js';

function printHelp() {
  console.log(`qualitygate\n\nUsage:\n  qualitygate run [path] [--no-write]\n  qualitygate --help\n\nCommands:\n  run   Detect and run safe package scripts in order: lint, typecheck, test, build\n\nReports:\n  QUALITY_REPORT.md and quality-report.json are written to the target repo by default.`);
}

async function main(argv) {
  const [command, maybePath, ...rest] = argv;
  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return 0;
  }

  if (command !== 'run') {
    console.error(`Unknown command: ${command}`);
    printHelp();
    return 2;
  }

  const noWrite = argv.includes('--no-write');
  const target = maybePath && !maybePath.startsWith('-') ? maybePath : process.cwd();
  const repoDir = resolve(target);
  const detection = await detectProject(repoDir);

  console.log(`qualitygate: ${repoDir}`);
  if (!detection.packageManager) {
    console.log('No package.json found; no checks to run.');
  } else {
    console.log(`Package manager: ${detection.packageManager}`);
    console.log(`Detected checks: ${detection.scripts.map((script) => script.name).join(', ') || 'none'}`);
  }

  const results = await runChecks(detection);
  const report = createReport({ ...detection, results });
  if (!noWrite) {
    const paths = await writeReports(report);
    console.log(`Wrote ${paths.markdownPath}`);
    console.log(`Wrote ${paths.jsonPath}`);
  }

  return hasFailures(results) ? 1 : 0;
}

main(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
}).catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
