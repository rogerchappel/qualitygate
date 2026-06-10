#!/usr/bin/env bash
set -euo pipefail

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

cat >"$tmpdir/package.json" <<'JSON'
{
  "scripts": {
    "lint": "node -e \"console.log('lint ok')\"",
    "test": "node -e \"console.log('test ok')\""
  }
}
JSON

node cli/qualitygate.js --help >"$tmpdir/help.txt"
grep -q "qualitygate run" "$tmpdir/help.txt"

node cli/qualitygate.js run "$tmpdir" >"$tmpdir/run.txt"
grep -q "Detected checks: lint, test" "$tmpdir/run.txt"
test -s "$tmpdir/QUALITY_REPORT.md"
node -e "const report = require('node:fs').readFileSync(process.argv[1], 'utf8'); if (!report.includes('| lint |') || !report.includes('| test |')) process.exit(1);" "$tmpdir/QUALITY_REPORT.md"
