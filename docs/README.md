# qualitygate Documentation

This directory holds release-readiness and design documentation for
`qualitygate`.

## Contents

- [Product requirements](PRD.md)
- [Release tasks](TASKS.md)
- [Orchestration notes](ORCHESTRATION.md)
- [README quickstart](../README.md)
- [Contributing guide](../CONTRIBUTING.md)
- [Security policy](../SECURITY.md)
- [Agent instructions](../AGENTS.md)

## CLI Surface

The implemented v0.1 command is:

```sh
qualitygate run [path] [--no-write]
```

It detects package scripts, runs supported checks, and writes
`QUALITY_REPORT.md` plus `quality-report.json` unless `--no-write` is set.
