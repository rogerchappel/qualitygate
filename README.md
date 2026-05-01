# qualitygate

`qualitygate` is a planned local-first verification gate for agent and human
handoffs.

The goal is to detect the standard repository checks that matter, run them in a
predictable order, and write a small report showing what passed, what failed,
and what was skipped.

## Why this exists

High-velocity agent workflows fall apart when "done" arrives without proof.
`qualitygate` is meant to provide a tiny, repeatable readiness bar before work
is handed to a reviewer or pushed into CI.

## Planned V1

The scoped first version is intentionally small:

- detect safe repo scripts such as lint, typecheck, test, and build
- run checks in order when they exist
- emit Markdown and JSON reports with command, exit code, duration, and summary
- exit non-zero when required checks fail
- stay local-first and avoid destructive actions

## Current status

This repository is still early. It currently contains scaffolding, repository
workflow docs, and the product brief for the first implementation pass.

See [docs/PRD.md](docs/PRD.md) for the V1 scope.

## Development

```sh
pnpm install
node --test
```

Before opening a PR, run:

```sh
bash scripts/validate.sh
```

## Safety and local-first notes

`qualitygate` should make verification clearer, not more magical. Checks should
stay deterministic, reviewable, and easy to audit.

## License

MIT
