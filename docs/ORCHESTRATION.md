# Orchestration Handoff

## Summary

- Workspace: default
- Repository: qualitygate
- Source: taskbrief + llm-orchestration (openai:gpt-4.1-mini)
- Total tasks: 9
- Dispatch now: qualitygate-detect-package-manager-and-available-scripts
- Blocked tasks: qualitygate-run-safe-checks-in-order-if-present-lint-typecheck-test-build

## Dispatch Prompt

Dispatch Wave 1 first. These tasks may run concurrently:
- qualitygate-detect-package-manager-and-available-scripts
Wait for the whole wave to finish and pass verification before dispatching the next sequential wave.

## LLM Refinement Notes

- The detection task must run first as it is a prerequisite for all implementation tasks.
- Implementation tasks depend on detection and can run concurrently as they do not depend on each other.
- Verification tasks depend on all implementation tasks and can run concurrently since they test different aspects.
- Documentation tasks depend on all verification tasks and can run concurrently as they cover different documentation aspects.
- The final validation task depends on all previous tasks and is high risk, requiring human decision before dispatch, so it is placed last and sequential.

## Sequential Waves

### Wave 1: Foundation / setup

- Mode inside wave: sequential
- Dispatch: now
- Tasks: qualitygate-detect-package-manager-and-available-scripts

### Wave 2: Implementation

- Mode inside wave: concurrent
- Dispatch: after_dependencies
- Tasks: qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report, qualitygate-exit-non-zero-if-required-checks-fail

### Wave 3: Verification / tests

- Mode inside wave: concurrent
- Dispatch: after_dependencies
- Tasks: qualitygate-add-fixture-packages-with-pass-fail-scripts-for-testing, qualitygate-test-json-report-schema

### Wave 4: Documentation / examples

- Mode inside wave: concurrent
- Dispatch: after_dependencies
- Tasks: qualitygate-write-readme-documentation, qualitygate-add-github-actions-example-workflow

### Wave 5: Final validation / release readiness

- Mode inside wave: sequential
- Dispatch: after_human_decision
- Tasks: qualitygate-run-safe-checks-in-order-if-present-lint-typecheck-test-build

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
- Can run concurrently with: qualitygate-emit-quality-report-md-and-json-report, qualitygate-exit-non-zero-if-required-checks-fail
- Dispatchable now: No
- Blocked by: None

### qualitygate-emit-quality-report-md-and-json-report: Emit `QUALITY_REPORT.md` and JSON report

- Phase: implementation
- Repo: qualitygate
- Branch: agent/emit-quality-report-md-and-json-report
- Risk: medium
- Depends on: qualitygate-detect-package-manager-and-available-scripts
- Can run concurrently with: qualitygate-implement-cli-command-qualitygate-run, qualitygate-exit-non-zero-if-required-checks-fail
- Dispatchable now: No
- Blocked by: None

### qualitygate-exit-non-zero-if-required-checks-fail: Exit non-zero if required checks fail

- Phase: implementation
- Repo: qualitygate
- Branch: agent/exit-non-zero-if-required-checks-fail
- Risk: medium
- Depends on: qualitygate-detect-package-manager-and-available-scripts
- Can run concurrently with: qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report
- Dispatchable now: No
- Blocked by: None

### qualitygate-add-fixture-packages-with-pass-fail-scripts-for-testing: Add fixture packages with pass/fail scripts for testing

- Phase: verification
- Repo: qualitygate
- Branch: agent/add-fixture-packages-with-pass-fail-scripts-for-testing
- Risk: low
- Depends on: qualitygate-detect-package-manager-and-available-scripts, qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report, qualitygate-exit-non-zero-if-required-checks-fail
- Can run concurrently with: qualitygate-test-json-report-schema
- Dispatchable now: No
- Blocked by: None

### qualitygate-test-json-report-schema: Test JSON report schema

- Phase: verification
- Repo: qualitygate
- Branch: agent/test-json-report-schema
- Risk: low
- Depends on: qualitygate-detect-package-manager-and-available-scripts, qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report, qualitygate-exit-non-zero-if-required-checks-fail
- Can run concurrently with: qualitygate-add-fixture-packages-with-pass-fail-scripts-for-testing
- Dispatchable now: No
- Blocked by: None

### qualitygate-write-readme-documentation: Write README documentation

- Phase: documentation
- Repo: qualitygate
- Branch: agent/write-readme-documentation
- Risk: low
- Depends on: qualitygate-detect-package-manager-and-available-scripts, qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report, qualitygate-exit-non-zero-if-required-checks-fail, qualitygate-add-fixture-packages-with-pass-fail-scripts-for-testing, qualitygate-test-json-report-schema
- Can run concurrently with: qualitygate-add-github-actions-example-workflow
- Dispatchable now: No
- Blocked by: None

### qualitygate-add-github-actions-example-workflow: Add GitHub Actions example workflow

- Phase: documentation
- Repo: qualitygate
- Branch: agent/add-github-actions-example-workflow
- Risk: low
- Depends on: qualitygate-detect-package-manager-and-available-scripts, qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report, qualitygate-exit-non-zero-if-required-checks-fail, qualitygate-add-fixture-packages-with-pass-fail-scripts-for-testing, qualitygate-test-json-report-schema
- Can run concurrently with: qualitygate-write-readme-documentation
- Dispatchable now: No
- Blocked by: None

### qualitygate-run-safe-checks-in-order-if-present-lint-typecheck-test-build: Run safe checks in order if present: lint, typecheck, test, build

- Phase: final_validation
- Repo: qualitygate
- Branch: agent/run-safe-checks-in-order-if-present-lint-typecheck-test-build
- Risk: high
- Depends on: qualitygate-detect-package-manager-and-available-scripts, qualitygate-implement-cli-command-qualitygate-run, qualitygate-emit-quality-report-md-and-json-report, qualitygate-exit-non-zero-if-required-checks-fail, qualitygate-add-fixture-packages-with-pass-fail-scripts-for-testing, qualitygate-test-json-report-schema, qualitygate-write-readme-documentation, qualitygate-add-github-actions-example-workflow
- Can run concurrently with: None
- Dispatchable now: No
- Blocked by: approve high-risk scope before dispatch

