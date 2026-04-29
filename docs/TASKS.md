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

The CLI should be local-first and run a series of safe checks in order, emitting reports and exiting with appropriate codes.

## Allowed Paths

- cli/
- src/
- package.json
- README.md

## Forbidden Paths

- ci/
- scripts/auto-fix.sh

## Expected Commits

- feat(cli): add `qualitygate run` command entrypoint
- test(cli): add tests for CLI command

## Verification

- Run `qualitygate run` on fixture packages and verify correct exit codes
- Check CLI help output includes `qualitygate run`

## Stop Conditions

- CLI command runs without errors
- Exit code is non-zero if required checks fail

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement the main CLI command `qualitygate run` that orchestrates the quality gate checks in order.

---

# Task Brief: Detect package manager and available scripts

## Objective

Automatically detect the package manager and scripts available in the repository

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

Detection is needed to know which checks to run (lint, typecheck, test, build) based on scripts present.

## Allowed Paths

- src/detection/
- package.json

## Forbidden Paths

- ci/
- scripts/

## Expected Commits

- feat(detection): add package manager and script detection logic
- test(detection): add tests for detection module

## Verification

- Verify detection works on fixture packages with different package managers
- Confirm scripts detected match those in package.json

## Stop Conditions

- Detection correctly identifies package manager and scripts

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement package manager and script detection to identify which checks can be run.

---

# Task Brief: Run safe checks in order: lint, typecheck, test, build

## Objective

Execute the detected scripts in a safe order and capture results

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

Checks must run sequentially if present, capturing command, exit code, duration, and summary.

## Allowed Paths

- src/checks/
- src/utils/

## Forbidden Paths

- scripts/auto-fix.sh
- ci/

## Expected Commits

- feat(checks): implement sequential execution of lint, typecheck, test, build
- test(checks): add tests for check execution and result capturing

## Verification

- Run checks on fixture packages and verify correct execution order
- Confirm exit codes and durations are captured accurately

## Stop Conditions

- All present checks run in order without destructive side effects

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement running of safe checks in order: lint, typecheck, test, build, capturing all relevant data.

---

# Task Brief: Emit `QUALITY_REPORT.md` and JSON report

## Objective

Generate human-readable and machine-readable reports summarizing check results

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

Reports must include command run, exit code, duration, and summary for each check.

## Allowed Paths

- src/reporting/
- QUALITY_REPORT.md

## Forbidden Paths

- ci/
- scripts/

## Expected Commits

- feat(reporting): add Markdown and JSON report generation
- test(reporting): add tests for report output

## Verification

- Verify generated Markdown and JSON reports match expected schema
- Test report generation on fixture packages

## Stop Conditions

- Reports are generated correctly after checks complete

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement report generation emitting QUALITY_REPORT.md and JSON summarizing check results.

---

# Task Brief: Exit with non-zero code if required checks fail

## Objective

Ensure CLI exits with failure code if any required check fails

## Repository

qualitygate

## Suggested Branch

agent/exit-with-non-zero-code-if-required-checks-fail

## Task Type

feature

## Risk Level

Medium

## Context

Source: llm (openai:gpt-4.1-mini)

This is critical to prevent handoff if quality gate is not passed.

## Allowed Paths

- cli/
- src/

## Forbidden Paths

- ci/
- scripts/

## Expected Commits

- fix(cli): set exit code based on check results
- test(cli): add tests for exit code behavior

## Verification

- Run CLI on failing fixture and verify non-zero exit code
- Run CLI on passing fixture and verify zero exit code

## Stop Conditions

- Exit codes reflect pass/fail status of required checks

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Implement exit code logic to fail CLI if required checks fail.

---

# Task Brief: Add fixture packages with pass/fail scripts for testing

## Objective

Provide test fixtures with scripts that pass and fail to verify behavior

## Repository

qualitygate

## Suggested Branch

agent/add-fixture-packages-with-pass-fail-scripts-for-testing

## Task Type

chore

## Risk Level

Low

## Context

Source: llm (openai:gpt-4.1-mini)

Fixtures are needed to verify detection, execution, and reporting.

## Allowed Paths

- fixtures/

## Forbidden Paths

- src/
- ci/

## Expected Commits

- test(fixtures): add pass and fail script fixtures

## Verification

- Fixtures contain scripts for lint, typecheck, test, build with pass and fail variants

## Stop Conditions

- Fixtures are available and used in tests

## Review Pack Required

No.

## Human Decision Needed

- None

## Agent Prompt

Add fixture packages with scripts that pass and fail for testing purposes.

---

# Task Brief: Add tests for JSON report schema validation

## Objective

Validate JSON report output matches expected schema

## Repository

qualitygate

## Suggested Branch

agent/add-tests-for-json-report-schema-validation

## Task Type

test

## Risk Level

Low

## Context

Source: llm (openai:gpt-4.1-mini)

Ensures report consumers can rely on consistent JSON format.

## Allowed Paths

- tests/
- src/reporting/

## Forbidden Paths

- ci/
- scripts/

## Expected Commits

- test(reporting): add JSON schema validation tests

## Verification

- Tests validate JSON schema against generated reports

## Stop Conditions

- JSON report schema tests pass

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Add tests to validate JSON report schema correctness.

---

# Task Brief: Write README with usage, config, and example GitHub Actions

## Objective

Document CLI usage, configuration options, and provide example GitHub Actions workflow

## Repository

qualitygate

## Suggested Branch

agent/write-readme-with-usage-config-and-example-github-actions

## Task Type

documentation

## Risk Level

Low

## Context

Source: llm (openai:gpt-4.1-mini)

Good documentation is needed for adoption and clarity.

## Allowed Paths

- README.md
- docs/

## Forbidden Paths

- src/
- ci/

## Expected Commits

- docs: add README with usage, config, and GitHub Actions example

## Verification

- README includes usage instructions, config details, and GitHub Actions example

## Stop Conditions

- README is complete and reviewed

## Review Pack Required

Yes.

## Human Decision Needed

- None

## Agent Prompt

Write comprehensive README including usage, configuration, and GitHub Actions example.
