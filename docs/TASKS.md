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

The CLI should provide a command `qualitygate run` that triggers the detection and execution of repo scripts for verification.

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

Implement the CLI command `qualitygate run` as the main entry point for the quality gate tool.

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

The tool must detect which package manager is used (npm, yarn, pnpm) and identify available scripts like lint, typecheck, test, and build.

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
- Verify scripts detection matches expected scripts in package.json

## Stop Conditions

- Detection logic correctly identifies package manager and scripts in test fixtures

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement detection of package manager and available scripts in the repository.

---

# Task Brief: Run safe checks in order: lint, typecheck, test, build

## Objective

Execute detected scripts in a safe, ordered manner and capture results

## Repository

qualitygate

## Suggested Branch

agent/run-safe-checks-in-order-lint-typecheck-test-build

## Task Type

feature

## Risk Level

High

## Context

Source: llm (openai:gpt-4.1-mini)

Run the scripts lint, typecheck, test, and build if present, in that order, capturing command, exit code, duration, and summary. Exit non-zero if required checks fail.

## Allowed Paths

- src/execution/**
- src/reporting/**

## Forbidden Paths

- ci/**
- docs/**

## Expected Commits

- feat(execution): run lint, typecheck, test, build scripts in order with result capture

## Verification

- Run checks on fixture packages with passing and failing scripts
- Verify exit codes reflect failures in required checks

## Stop Conditions

- All checks run in order with correct result capture and exit code behavior

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement execution of safe checks in order: lint, typecheck, test, build, capturing results and enforcing exit codes.

---

# Task Brief: Emit QUALITY_REPORT.md and JSON report

## Objective

Generate Markdown and JSON reports summarizing the quality gate run

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

After running checks, emit a `QUALITY_REPORT.md` and a JSON report capturing command, exit code, duration, and summary for each check.

## Allowed Paths

- src/reporting/**
- QUALITY_REPORT.md
- reports/**

## Forbidden Paths

- ci/**
- docs/**

## Expected Commits

- feat(reporting): add Markdown and JSON report generation

## Verification

- Verify generated QUALITY_REPORT.md matches expected format
- Validate JSON report schema against test fixtures

## Stop Conditions

- Reports are generated correctly and pass schema validation

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement generation of QUALITY_REPORT.md and JSON reports summarizing the quality gate results.

---

# Task Brief: Create fixture packages with pass/fail scripts for testing

## Objective

Provide fixture packages to test passing and failing script scenarios

## Repository

qualitygate

## Suggested Branch

agent/create-fixture-packages-with-pass-fail-scripts-for-testing

## Task Type

test

## Risk Level

Low

## Context

Source: llm (openai:gpt-4.1-mini)

Fixtures are needed to verify detection, execution, and reporting of the quality gate tool.

## Allowed Paths

- tests/fixtures/**

## Forbidden Paths

- src/**
- ci/**

## Expected Commits

- test(fixtures): add fixture packages with pass and fail scripts

## Verification

- Fixtures include scripts that pass and fail for lint, typecheck, test, build

## Stop Conditions

- Fixtures are created and usable in automated tests

## Review Pack Required

No.

## Human Decision Needed

- None

## Agent Prompt

Create fixture packages with scripts that pass and fail to support testing.

---

# Task Brief: Test JSON report schema validation

## Objective

Implement tests to validate the JSON report schema

## Repository

qualitygate

## Suggested Branch

agent/test-json-report-schema-validation

## Task Type

test

## Risk Level

Low

## Context

Source: llm (openai:gpt-4.1-mini)

Ensure the JSON report emitted by the tool conforms to the expected schema using automated tests.

## Allowed Paths

- tests/**
- src/reporting/**

## Forbidden Paths

- ci/**
- docs/**

## Expected Commits

- test(reporting): add JSON report schema validation tests

## Verification

- Run automated tests validating JSON report schema against fixtures

## Stop Conditions

- JSON report schema validation tests pass reliably

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement automated tests to validate the JSON report schema.

---

# Task Brief: Write README documentation

## Objective

Document usage, installation, and features of qualitygate

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

Provide clear README including CLI usage, configuration, and example outputs.

## Allowed Paths

- README.md
- docs/**

## Forbidden Paths

- src/**
- tests/**

## Expected Commits

- docs: add README with usage and feature documentation

## Verification

- README includes usage examples and explanation of qualitygate features

## Stop Conditions

- README is complete and reviewed

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Write comprehensive README documentation for qualitygate CLI tool.

---

# Task Brief: Add GitHub Actions example workflow

## Objective

Provide example GitHub Actions workflow integrating qualitygate

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

Show how to run qualitygate in a GitHub Actions CI environment as an example for users.

## Allowed Paths

- .github/workflows/**

## Forbidden Paths

- src/**
- tests/**

## Expected Commits

- ci: add GitHub Actions example workflow for qualitygate

## Verification

- GitHub Actions workflow runs qualitygate and reports results

## Stop Conditions

- Example workflow is added and tested

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Add an example GitHub Actions workflow demonstrating qualitygate usage.
