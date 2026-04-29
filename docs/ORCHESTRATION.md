# Orchestration Handoff

## Summary

- Workspace: default
- Repository: qualitygate
- Source: taskbrief
- Total tasks: 8
- Dispatch now: qualitygate-detect-package-manager-and-available-scripts
- Blocked tasks: qualitygate-run-safe-checks-in-order-lint-typecheck-test-build

## Dispatch Prompt

Dispatch Wave 1 first. These tasks may run concurrently:
- qualitygate-detect-package-manager-and-available-scripts
Wait for the whole wave to finish and pass verification before dispatching the next sequential wave.

## Sequential Waves

### Wave 1: Foundation / setup

- Mode inside wave: sequential
- Dispatch: now
- Tasks: qualitygate-detect-package-manager-and-available-scripts

### Wave 2: Implementation

- Mode inside wave: concurrent
- Dispatch: after_dependencies
- Tasks: qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report

### Wave 3: Verification / tests

- Mode inside wave: concurrent
- Dispatch: after_dependencies
- Tasks: qualitygate-create-fixture-packages-with-pass-fail-scripts-for-testing, qualitygate-test-json-report-schema-validation

### Wave 4: Documentation / examples

- Mode inside wave: concurrent
- Dispatch: after_dependencies
- Tasks: qualitygate-write-readme-documentation, qualitygate-add-github-actions-example-workflow

### Wave 5: Final validation / release readiness

- Mode inside wave: sequential
- Dispatch: after_human_decision
- Tasks: qualitygate-run-safe-checks-in-order-lint-typecheck-test-build

## Task Dependencies

### qualitygate-detect-package-manager-and-available-scripts: Detect package manager and available scripts

- Phase: foundation
- Repo: qualitygate
- Branch: agent/detect-package-manager-and-available-scripts
- Risk: medium
- Depends on: None
- Can run concurrently with: None
- Dispatchable now: Yes
- Blocked by: None

### qualitygate-implement-cli-command-qualitygate-run: Implement CLI command `qualitygate run`

- Phase: implementation
- Repo: qualitygate
- Branch: agent/implement-cli-command-qualitygate-run
- Risk: medium
- Depends on: qualitygate-detect-package-manager-and-available-scripts
- Can run concurrently with: qualitygate-emit-quality-report-md-and-json-report
- Dispatchable now: No
- Blocked by: None

### qualitygate-emit-quality-report-md-and-json-report: Emit QUALITY_REPORT.md and JSON report

- Phase: implementation
- Repo: qualitygate
- Branch: agent/emit-quality-report-md-and-json-report
- Risk: medium
- Depends on: qualitygate-detect-package-manager-and-available-scripts
- Can run concurrently with: qualitygate-implement-cli-command-qualitygate-run
- Dispatchable now: No
- Blocked by: None

### qualitygate-create-fixture-packages-with-pass-fail-scripts-for-testing: Create fixture packages with pass/fail scripts for testing

- Phase: verification
- Repo: qualitygate
- Branch: agent/create-fixture-packages-with-pass-fail-scripts-for-testing
- Risk: low
- Depends on: qualitygate-detect-package-manager-and-available-scripts, qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report
- Can run concurrently with: qualitygate-test-json-report-schema-validation
- Dispatchable now: No
- Blocked by: None

### qualitygate-test-json-report-schema-validation: Test JSON report schema validation

- Phase: verification
- Repo: qualitygate
- Branch: agent/test-json-report-schema-validation
- Risk: low
- Depends on: qualitygate-detect-package-manager-and-available-scripts, qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report
- Can run concurrently with: qualitygate-create-fixture-packages-with-pass-fail-scripts-for-testing
- Dispatchable now: No
- Blocked by: None

### qualitygate-write-readme-documentation: Write README documentation

- Phase: documentation
- Repo: qualitygate
- Branch: agent/write-readme-documentation
- Risk: low
- Depends on: qualitygate-detect-package-manager-and-available-scripts, qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report, qualitygate-create-fixture-packages-with-pass-fail-scripts-for-testing, qualitygate-test-json-report-schema-validation
- Can run concurrently with: qualitygate-add-github-actions-example-workflow
- Dispatchable now: No
- Blocked by: None

### qualitygate-add-github-actions-example-workflow: Add GitHub Actions example workflow

- Phase: documentation
- Repo: qualitygate
- Branch: agent/add-github-actions-example-workflow
- Risk: low
- Depends on: qualitygate-detect-package-manager-and-available-scripts, qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report, qualitygate-create-fixture-packages-with-pass-fail-scripts-for-testing, qualitygate-test-json-report-schema-validation
- Can run concurrently with: qualitygate-write-readme-documentation
- Dispatchable now: No
- Blocked by: None

### qualitygate-run-safe-checks-in-order-lint-typecheck-test-build: Run safe checks in order: lint, typecheck, test, build

- Phase: final_validation
- Repo: qualitygate
- Branch: agent/run-safe-checks-in-order-lint-typecheck-test-build
- Risk: high
- Depends on: qualitygate-detect-package-manager-and-available-scripts, qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report, qualitygate-create-fixture-packages-with-pass-fail-scripts-for-testing, qualitygate-test-json-report-schema-validation, qualitygate-write-readme-documentation, qualitygate-add-github-actions-example-workflow
- Can run concurrently with: None
- Dispatchable now: No
- Blocked by: approve high-risk scope before dispatch

