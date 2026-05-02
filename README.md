# qualitygate

A tiny local-first quality gate for agent and maintainer handoffs. It detects
common package scripts, runs the safe verification set in order, and writes
Markdown/JSON reports that can be attached to PRs.

## Why this exists

High-velocity agent workflows fall apart when "done" arrives without proof.
`qualitygate` provides a small, repeatable readiness bar before work is handed
to a reviewer or pushed into CI.

## Install

```sh
npm install
```

For local development, run the CLI directly:

```sh
node cli/qualitygate.js --help
```

## Use

Run checks in the current repository:

```sh
qualitygate run
```

Run checks for another path:

```sh
qualitygate run ../some-repo
```

`qualitygate run` detects `package.json`, chooses the package manager from
lockfiles or `packageManager`, and runs available scripts in this order:

1. `lint`
2. `typecheck`
3. `test`
4. `build`

It does not install dependencies, auto-fix files, call remote services, or run
destructive commands. It only runs scripts already defined by the target repo.

## Reports

By default, the command writes:

- `QUALITY_REPORT.md`
- `quality-report.json`

Each check result includes:

- script name
- command
- exit code
- duration in milliseconds
- short summary

Use `--no-write` for a smoke run without report files:

```sh
qualitygate run --no-write
```

## Exit codes

- `0`: all detected checks passed, or no checks were detected
- `1`: one or more checks failed, or an unexpected error occurred
- `2`: invalid command usage

## GitHub Actions example

See [`.github/workflows/qualitygate-example.yml`](.github/workflows/qualitygate-example.yml)
for a minimal workflow that runs QualityGate and uploads the reports as
artifacts.

## Planned V1

The scoped first version is intentionally small:

- detect safe repo scripts such as lint, typecheck, test, and build
- run checks in order when they exist
- emit Markdown and JSON reports with command, exit code, duration, and summary
- exit non-zero when required checks fail
- stay local-first and avoid destructive actions

See [docs/PRD.md](docs/PRD.md) for the V1 scope.

## Verify this repository

Run the local validation script before opening a pull request:

```sh
bash scripts/validate.sh
```

## Safety and local-first notes

`qualitygate` should make verification clearer, not more magical. Checks should
stay deterministic, reviewable, and easy to audit.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution expectations. Changes
should be small, reviewable, and verified before review.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance.

## License

MIT
