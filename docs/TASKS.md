# Task Brief: Implement CLI command `qualitygate run`

## Objective

Create the main CLI entry point to run the quality gate checks

## Repository

qualitygate

## Suggested Branch

agent/implement-cli-command-qualitygate-run

## Task Type

feature

## Risk Level

Medium

## Context

Source: llm (openai:gpt-4.1-mini)

The CLI should provide a `qualitygate run` command that triggers the detection and execution of repo scripts for verification.

## Allowed Paths

- cli/**
- src/**
- package.json
- README.md

## Forbidden Paths

- ci/**
- docs/**

## Expected Commits

- feat(cli): add `qualitygate run` command entry point

## Verification

- Run `qualitygate run` on fixture packages and verify correct execution flow
- Check CLI help output includes `qualitygate run`

## Stop Conditions

- `qualitygate run` command is implemented and passes basic smoke tests

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement the CLI command `qualitygate run` as the main entry point for running quality gate checks.

---

# Task Brief: Detect package manager and available scripts

## Objective

Implement detection logic for package manager and scripts in the repo

## Repository

qualitygate

## Suggested Branch

agent/detect-package-manager-and-available-scripts

## Task Type

feature

## Risk Level

Medium

## Context

Source: llm (openai:gpt-4.1-mini)

The tool must detect which package manager is used (e.g., npm, yarn, pnpm) and identify available scripts such as lint, typecheck, test, and build.

## Allowed Paths

- src/detection/**
- package.json

## Forbidden Paths

- ci/**
- docs/**

## Expected Commits

- feat(detection): add package manager and script detection

## Verification

- Test detection on fixture packages with different package managers
- Verify scripts lint, typecheck, test, build are correctly identified if present

## Stop Conditions

- Detection logic correctly identifies package manager and scripts in all test fixtures

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement detection of package manager and available scripts in the repository.

---

# Task Brief: Run safe checks in order if present: lint, typecheck, test, build

## Objective

Execute detected scripts in a safe, ordered manner and capture results

## Repository

qualitygate

## Suggested Branch

agent/run-safe-checks-in-order-if-present-lint-typecheck-test-build

## Task Type

feature

## Risk Level

High

## Context

Source: llm (openai:gpt-4.1-mini)

The CLI should run the detected scripts in the order lint, typecheck, test, build if they exist, capturing command, exit code, duration, and summary for each.

## Allowed Paths

- src/execution/**
- src/detection/**

## Forbidden Paths

- ci/**
- docs/**

## Expected Commits

- feat(execution): run detected scripts in order with result capture

## Verification

- Run the CLI on fixture packages and verify each script runs in order
- Check captured command, exit code, duration, and summary are accurate

## Stop Conditions

- All detected scripts run in order with correct result capture

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement execution of detected scripts in order: lint, typecheck, test, build, capturing command, exit code, duration, and summary.

---

# Task Brief: Emit `QUALITY_REPORT.md` and JSON report

## Objective

Generate Markdown and JSON reports summarizing the quality gate results

## Repository

qualitygate

## Suggested Branch

agent/emit-quality-report-md-and-json-report

## Task Type

feature

## Risk Level

Medium

## Context

Source: llm (openai:gpt-4.1-mini)

After running checks, the tool must emit a `QUALITY_REPORT.md` and a JSON report capturing command, exit code, duration, and summary for each check.

## Allowed Paths

- src/reporting/**
- QUALITY_REPORT.md

## Forbidden Paths

- ci/**
- docs/**

## Expected Commits

- feat(reporting): add Markdown and JSON report generation

## Verification

- Verify `QUALITY_REPORT.md` is generated with correct content
- Validate JSON report schema against expected format

## Stop Conditions

- Reports are generated and validated against schema

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement generation of `QUALITY_REPORT.md` and JSON report summarizing check results.

---

# Task Brief: Exit non-zero if required checks fail

## Objective

Ensure CLI exits with non-zero code if any required checks fail

## Repository

qualitygate

## Suggested Branch

agent/exit-non-zero-if-required-checks-fail

## Task Type

feature

## Risk Level

Medium

## Context

Source: llm (openai:gpt-4.1-mini)

The CLI must exit with a non-zero status code if any of the required checks (lint, typecheck, test, build) fail to signal failure to calling processes.

## Allowed Paths

- src/cli/**
- src/execution/**

## Forbidden Paths

- ci/**
- docs/**

## Expected Commits

- fix(cli): exit non-zero on failed required checks

## Verification

- Run CLI with failing checks and verify non-zero exit code
- Run CLI with all passing checks and verify zero exit code

## Stop Conditions

- CLI exit codes correctly reflect check results

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement CLI exit code logic to return non-zero if required checks fail.

---

# Task Brief: Add fixture packages with pass/fail scripts for testing

## Objective

Create fixture packages with scripts that pass and fail for testing purposes

## Repository

qualitygate

## Suggested Branch

agent/add-fixture-packages-with-pass-fail-scripts-for-testing

## Task Type

test

## Risk Level

Low

## Context

Source: llm (openai:gpt-4.1-mini)

Fixtures are needed to verify detection, execution, and reporting of the quality gate CLI.

## Allowed Paths

- fixtures/**

## Forbidden Paths

- src/**
- ci/**

## Expected Commits

- test(fixtures): add pass/fail script fixtures

## Verification

- Fixtures contain scripts that reliably pass or fail
- Fixtures are used in automated tests

## Stop Conditions

- Fixtures are created and integrated into tests

## Review Pack Required

No.

## Human Decision Needed

- None

## Agent Prompt

Create fixture packages with scripts that pass and fail to support testing.

---

# Task Brief: Test JSON report schema

## Objective

Implement tests to validate the JSON report schema

## Repository

qualitygate

## Suggested Branch

agent/test-json-report-schema

## Task Type

test

## Risk Level

Low

## Context

Source: llm (openai:gpt-4.1-mini)

Tests must ensure the JSON report output conforms to the expected schema for downstream consumption.

## Allowed Paths

- tests/**
- src/reporting/**

## Forbidden Paths

- ci/**
- docs/**

## Expected Commits

- test(reporting): add JSON report schema validation tests

## Verification

- Tests validate JSON report schema against expected format

## Stop Conditions

- JSON report schema tests pass reliably

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement tests to validate the JSON report schema.

---

# Task Brief: Write README documentation

## Objective

Document usage, installation, and configuration of the qualitygate CLI

## Repository

qualitygate

## Suggested Branch

agent/write-readme-documentation

## Task Type

documentation

## Risk Level

Low

## Context

Source: llm (openai:gpt-4.1-mini)

README should explain the purpose, usage of `qualitygate run`, configuration options, and report formats.

## Allowed Paths

- README.md

## Forbidden Paths

- src/**
- ci/**

## Expected Commits

- docs: add README with usage and configuration

## Verification

- README covers all key features and usage instructions
- README is clear and free of errors

## Stop Conditions

- README is complete and reviewed

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Write comprehensive README documentation for the qualitygate CLI.

---

# Task Brief: Add GitHub Actions example workflow

## Objective

Provide example GitHub Actions workflow demonstrating usage of qualitygate CLI

## Repository

qualitygate

## Suggested Branch

agent/add-github-actions-example-workflow

## Task Type

feature

## Risk Level

Low

## Context

Source: llm (openai:gpt-4.1-mini)

An example workflow should show how to integrate qualitygate in CI for PR handoff verification.

## Allowed Paths

- .github/workflows/**

## Forbidden Paths

- src/**
- docs/**

## Expected Commits

- ci: add GitHub Actions example workflow for qualitygate

## Verification

- Example workflow runs successfully in GitHub Actions
- Workflow demonstrates running `qualitygate run` and handling results

## Stop Conditions

- GitHub Actions example workflow is added and tested

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Add example GitHub Actions workflow demonstrating usage of qualitygate CLI.
