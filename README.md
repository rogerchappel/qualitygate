# qualitygate

`qualitygate` is a local-first verification gate for repository handoffs.
It detects common package scripts, runs them in a predictable order, and writes
Markdown plus JSON reports that can be attached to a PR or agent handoff.

## Status

The CLI is implemented and covered by fixture-backed tests. Treat v0.1 as a
small package-script gate, not as a general CI replacement or auto-fixer.

## Install

Install dependencies for local development:

```sh
npm install
```

During development, run the CLI directly:

```sh
node cli/qualitygate.js --help
```

After publishing or linking the package, use the bin:

```sh
qualitygate --help
```

## Quick Start

Run the gate against the current repository:

```sh
qualitygate run
```

Run it against another repository:

```sh
qualitygate run ../some-project
```

By default, `qualitygate run` writes two handoff artifacts in the target
repository:

- `QUALITY_REPORT.md`
- `quality-report.json`

Use `--no-write` when you only want console output and an exit code:

```sh
qualitygate run ../some-project --no-write
```

## What It Checks

`qualitygate` detects `package.json` and chooses the package manager from
lockfiles or the `packageManager` field. It runs available scripts in this
order:

1. `lint`
2. `typecheck`
3. `test`
4. `build`

Missing scripts are skipped. Any failed detected check makes the CLI exit
non-zero.

## Verify

Run the available repository checks before opening a pull request:

```sh
npm test
```

If `release:check` exists in `package.json`, run it as the broader release-readiness gate:

```sh
npm run release:check
```

Run the metadata and package-surface audit on its own when changing
`package.json`, workflows, or packed files:

```sh
npm run release:readiness
```

## Limitations

- Only JavaScript package repositories are detected in v0.1.
- The script order is fixed to `lint`, `typecheck`, `test`, then `build`.
- The tool does not auto-install dependencies, auto-fix failures, or run
  destructive commands.
- Generated reports may include local filesystem paths from the target machine.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution expectations. Changes should be small, reviewable, and verified before review.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance.

## License

MIT
