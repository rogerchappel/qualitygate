# qualitygate

`qualitygate` is a local-first verification gate for repository handoffs.
It detects common package scripts, runs them in a predictable order, and writes
Markdown plus JSON reports that can be attached to a PR or agent handoff.

## Status

The CLI is implemented and covered by fixture-backed tests. Treat v0.1 as a
small package-script gate, not as a general CI replacement or auto-fixer.

## Install

The npm package is not published yet. To try the current development version
before the first release, install the source from the repository's `main`
branch; the scoped package keeps the shorter `qualitygate` executable name:

```sh
npm install --global github:rogerchappel/qualitygate#main
qualitygate --help
```

After `@rogerchappel/qualitygate@0.1.0` is published, the supported registry
install will be `npm install --global @rogerchappel/qualitygate`.

For local development, install the locked dependencies and run the CLI
directly:

```sh
npm ci
node cli/qualitygate.js --help
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

The option can also precede the path:

```sh
qualitygate run --no-write ../some-project
```

The `run` command accepts at most one repository path and one exact
`--no-write` option. Unknown options, duplicate options, and extra paths are
usage errors; no checks run and no reports are written for those invocations.

## What It Checks

`qualitygate` detects `package.json` and chooses the package manager from its
supported `packageManager` field (`npm`, `pnpm`, `yarn`, or `bun`) when present.
That explicit declaration takes precedence over lockfiles. Without a supported
declaration, a single package-manager lockfile selects the manager; conflicting
lockfiles stop the run with a diagnostic so the wrong manager is never invoked.
With neither signal, npm remains the default. It runs available scripts in this
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

Run the complete release gate, which starts with the metadata and workflow
readiness audit before exercising syntax, tests, smoke checks, and the packed
package:

```sh
npm run release:check
```

Run only the metadata and workflow readiness audit when changing
`package.json` or release workflows:

```sh
npm run release:readiness
```

Run package smoke when changing the CLI, library entrypoints, docs, or support
files:

```sh
npm run package:smoke
```

It verifies the dry-run tarball includes the CLI, library modules, docs,
license, changelog, security policy, and contributing guide.

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
