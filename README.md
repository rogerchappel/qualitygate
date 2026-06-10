# qualitygate

qualitygate is a local-first CLI for running a small, ordered verification gate
against a repository and writing handoff-friendly reports.

It detects package-manager scripts in this order:

1. `lint`
2. `typecheck`
3. `test`
4. `build`

The CLI runs only scripts that already exist in the target package and writes
`QUALITY_REPORT.md` plus `quality-report.json` unless `--no-write` is passed.

## Install from a checkout

```sh
git clone https://github.com/rogerchappel/qualitygate.git
cd qualitygate
npm install
```

## Use

Check the CLI surface:

```sh
npx qualitygate --help
npx qualitygate --version
```

Run the gate against the current checkout:

```sh
npx qualitygate run .
```

Preview a target without writing reports:

```sh
npx qualitygate run path/to/repo --no-write
```

For local development from this repository, use the checkout CLI directly:

```sh
node cli/qualitygate.js run . --no-write
```

## Verification

```sh
npm run check
npm test
npm run smoke
npm run package:smoke
npm run release:check
```

`npm run release:check` is the release-candidate gate used by CI. It validates
JavaScript syntax, runs the Node test suite, checks the CLI help/version smoke
path, and performs an npm pack dry run.

## Limitations

- The package is still a v0.1.0 project; treat output as advisory evidence for
  handoffs rather than a guarantee that a repository is production-ready.
- Only JavaScript package-manager scripts are detected today.
- The CLI executes existing package scripts in the target repository, so review
  the target `package.json` before running it on untrusted code.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes small, update the PRD or README when scope changes, and include the exact verification command in every pull request.

## Security

See [SECURITY.md](SECURITY.md). Do not include secrets, private tokens, proprietary dependency data, or sensitive logs in public issues or examples.

## License

MIT
