# qualitygate

Quality gate definitions and orchestration notes for project checks.

## Status

This repository is currently a planning and scaffolding repo. It contains project governance, product notes, and release hygiene files, but it does not yet include the package implementation advertised by `package.json`. Treat it as not ready for installation or production use until `src/` and real usage examples land.

## Install

There is no supported install path yet. For local stewardship or planning work, install dependencies only when a future implementation adds them:

```sh
npm install
```

## Use

No runtime API or CLI is available yet. Start with the planning material in `docs/PRD.md` and `ROADMAP.md` before implementing package entry points.

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

- The package entry points are placeholders until an implementation is added.
- README examples should be updated with real commands before any release claim is made.
- Security and production posture should be reassessed after the first implementation lands.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution expectations. Changes should be small, reviewable, and verified before review.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance.

## License

MIT
