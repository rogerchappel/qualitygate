import { writeFile } from 'node:fs/promises';
import path from 'node:path';

export function createReport({ repoDir, packageManager, results }) {
  const generatedAt = new Date().toISOString();
  const status = results.every((result) => result.exitCode === 0) ? 'pass' : 'fail';
  return { generatedAt, repoDir, packageManager, status, checks: results };
}

export async function writeReports(report, { outputDir = report.repoDir } = {}) {
  const markdownPath = path.join(outputDir, 'QUALITY_REPORT.md');
  const jsonPath = path.join(outputDir, 'quality-report.json');
  await writeFile(markdownPath, renderMarkdown(report), 'utf8');
  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return { markdownPath, jsonPath };
}

export function renderMarkdown(report) {
  const rows = report.checks.length
    ? report.checks.map((check) => `| ${check.name} | \`${check.command}\` | ${check.exitCode} | ${check.durationMs} | ${escapePipes(check.summary)} |`).join('\n')
    : '| _none_ | _no supported scripts detected_ | 0 | 0 | Nothing to run. |';

  return `# Quality Report\n\n` +
    `- Status: **${report.status}**\n` +
    `- Generated: ${report.generatedAt}\n` +
    `- Package manager: ${report.packageManager ?? 'none'}\n` +
    `- Repository: ${report.repoDir}\n\n` +
    `| Check | Command | Exit code | Duration (ms) | Summary |\n` +
    `| --- | --- | ---: | ---: | --- |\n` +
    `${rows}\n`;
}

function escapePipes(value) {
  return String(value).replaceAll('|', '\\|').replace(/\s+/g, ' ').trim();
}
