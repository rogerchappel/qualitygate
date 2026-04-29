# PRD: qualitygate

Status: ready

## Scorecard

Total: 85/100
Band: build now
Last scored: 2026-04-29
Scored by: Neo

| Criterion | Points | Notes |
|---|---:|---|
| Problem pain | 18/20 | Broken builds and skipped checks slow high-velocity agent workflows. |
| Demand signal | 17/20 | Strong internal need across OSS repos and agent handoffs; external validation still needed. |
| V1 buildability | 19/20 | Package script detection and report generation are straightforward. |
| Differentiation | 11/15 | Adjacent to CI/task runners, but simpler local-first handoff focus is useful. |
| Agentic workflow leverage | 15/15 | Gives agents a standard verification gate before handoff. |
| Distribution potential | 5/10 | Easy to explain, but crowded with CI/check tooling. |

## Pitch

A tiny repo health gate agents must pass before handoff.

## Why It Matters

High velocity dies if broken builds stack up.

## V1 Scope

- CLI: `qualitygate run`
- Detect package manager and available scripts
- Run safe checks in order if present: lint, typecheck, test, build
- Emit `QUALITY_REPORT.md` and JSON
- Capture command, exit code, duration, summary
- Exit non-zero if required checks fail

## Out of Scope

- No destructive commands
- No auto-fixing
- No CI provider lock-in

## Verification

- Fixture package with pass/fail scripts
- Test JSON report schema

## Agent Prompt

Build `qualitygate`, a local-first CLI that detects common repo scripts and runs a configurable verification gate. It should emit Markdown/JSON reports suitable for PR handoff. Include package-manager detection, config, fixtures, tests, README, and GitHub Actions example.
