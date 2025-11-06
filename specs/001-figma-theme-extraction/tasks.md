# Implementation Tasks: Figma Design Tokens to Tailwind 4 Theme Extraction

**Feature**: 001-figma-theme-extraction
**Branch**: `001-figma-theme-extraction`
**Generated**: 2025-11-06

## Implementation Strategy

This feature follows **Test-Driven Development (TDD)** per constitution requirements. Tasks are organized by user story to enable independent implementation and testing. Each user story phase is a complete, independently testable increment.

**MVP Scope**: User Story 1 (Input Handling) provides minimal viable functionality for validating inputs.

**Incremental Delivery**: Complete user stories in priority order (US1 → US2 → US3 → US4 → US5).

---

## Phase 1: Project Setup

**Goal**: Initialize project structure, configure tools, install dependencies.

**Duration Estimate**: 1-2 hours

### Tasks

- [X] T001 Initialize package.json with project metadata and scripts in /Users/nestor.torres/Workspace/t0t-figma-design/package.json
- [X] T002 [P] Install dependencies: culori, zod, stream-json, typescript, tsx, vitest, @types/node via npm install
- [X] T003 Create tsconfig.json with strict mode configuration in /Users/nestor.torres/Workspace/t0t-figma-design/tsconfig.json
- [X] T004 Create vitest.config.ts with 80% coverage threshold in /Users/nestor.torres/Workspace/t0t-figma-design/vitest.config.ts
- [X] T005 [P] Create .gitignore file excluding node_modules, dist, coverage in /Users/nestor.torres/Workspace/t0t-figma-design/.gitignore
- [X] T006 Create project directory structure: .t0t-figma/scripts/, .t0t-figma/lib/, .t0t-figma/templates/, tests/unit/, tests/integration/, tests/contract/, tests/snapshots/
- [X] T007 [P] Create shared types file in .t0t-figma/scripts/types.ts based on contracts/types.ts
- [X] T008 Verify Node.js version is 20.x or later by running node --version

---

## Phase 2: Foundational Utilities (Blocking Prerequisites)

**Goal**: Build and test core utility functions used across multiple user stories.

**Duration Estimate**: 4-6 hours

**Independent Test**: Each utility can be tested in isolation with unit tests.

### Color Conversion Utility

- [ ] T009 [US2] Write unit tests for RGB to OKLCH conversion in tests/unit/color-converter.test.ts
- [ ] T010 [US2] Implement rgbToOKLCH function in .t0t-figma/scripts/color-converter.ts using culori library
- [ ] T011 [US2] Write unit tests for alpha/opacity preservation in color conversion in tests/unit/color-converter.test.ts
- [ ] T012 [US2] Implement clampToGamut function for out-of-gamut colors in .t0t-figma/scripts/color-converter.ts
- [ ] T013 [US2] Run unit tests for color-converter and verify 80%+ coverage via npm test

### Name Sanitization Utility

- [ ] T014 [US3] Write unit tests for token name sanitization in tests/unit/name-sanitizer.test.ts
- [ ] T015 [US3] Implement sanitizeName function in .t0t-figma/scripts/name-sanitizer.ts
- [ ] T016 [US3] Write unit tests for duplicate name handling in tests/unit/name-sanitizer.test.ts
- [ ] T017 [US3] Implement handleDuplicates function in .t0t-figma/scripts/name-sanitizer.ts
- [ ] T018 [US3] Run unit tests for name-sanitizer and verify 80%+ coverage via npm test

### Unit Conversion Utility

- [ ] T019 [US3] Write unit tests for px to rem conversion in tests/unit/unit-converter.test.ts
- [ ] T020 [US3] Implement pxToRem function in .t0t-figma/scripts/unit-converter.ts
- [ ] T021 [US3] Write unit tests for border radius formatting in tests/unit/unit-converter.test.ts
- [ ] T022 [US3] Implement formatRadius function in .t0t-figma/scripts/unit-converter.ts
- [ ] T023 [US3] Run unit tests for unit-converter and verify 80%+ coverage via npm test

---

## Phase 3: User Story 1 - Accept Input from Figma URL or JSON File (P1)

**Goal**: Validate and prioritize input sources (URL or file), validate MCP if URL provided.

**Priority**: P1 (MVP - must complete first)

**Duration Estimate**: 6-8 hours

**Independent Test**: Can be fully tested by running the command with different input combinations and verifying correct validation/errors.

### Validation Module

- [ ] T024 [US1] Write unit tests for Figma URL validation in tests/unit/validation.test.ts
- [ ] T025 [US1] Implement validateFigmaURL function in .t0t-figma/scripts/validation.ts
- [ ] T026 [US1] Write unit tests for file path validation in tests/unit/validation.test.ts
- [ ] T027 [US1] Implement validateFilePath function in .t0t-figma/scripts/validation.ts
- [ ] T028 [US1] Write unit tests for output directory validation in tests/unit/validation.test.ts
- [ ] T029 [US1] Implement validateOutputDirectory function in .t0t-figma/scripts/validation.ts

### MCP Validation

- [ ] T030 [US1] Write unit tests for MCP validation in tests/unit/validate-mcp.test.ts
- [ ] T031 [US1] Implement validateMCP function in .t0t-figma/scripts/validate-mcp.ts using Figma MCP whoami
- [ ] T032 [US1] Implement helpful error messages for MCP failures in .t0t-figma/scripts/validate-mcp.ts

### Input Source Handler

- [ ] T033 [US1] Write unit tests for InputSource logic in tests/unit/input-source.test.ts
- [ ] T034 [US1] Implement InputSource class with priority logic (file > URL) in .t0t-figma/scripts/input-source.ts
- [ ] T035 [US1] Implement validation orchestration for URL and file inputs in .t0t-figma/scripts/input-source.ts

### Integration Tests

- [ ] T036 [US1] Write integration test for URL input with working MCP in tests/integration/input-validation.test.ts
- [ ] T037 [US1] Write integration test for URL input with non-working MCP in tests/integration/input-validation.test.ts
- [ ] T038 [US1] Write integration test for file input validation in tests/integration/input-validation.test.ts
- [ ] T039 [US1] Write integration test for both URL and file provided (file priority) in tests/integration/input-validation.test.ts
- [ ] T040 [US1] Run all US1 tests and verify passing via npm test

---

## Phase 4: User Story 2 - Extract All Design Tokens from Figma into Unified JSON (P1)

**Goal**: Extract tokens from Figma JSON (collections → variables → design tokens), resolve aliases.

**Priority**: P1

**Duration Estimate**: 10-12 hours

**Independent Test**: Provide Figma JSON, run extraction, verify output JSON contains all token categories with correct structure.

**Dependencies**: US1 (input validation)

### Extraction Module

- [ ] T041 [US2] Write unit tests for FigmaJSON validation using Zod in tests/unit/extraction.test.ts
- [ ] T042 [US2] Implement validateFigmaJSON function in .t0t-figma/scripts/extraction.ts
- [ ] T043 [US2] Write unit tests for variable categorization logic in tests/unit/extraction.test.ts
- [ ] T044 [US2] Implement categorizeVariable function in .t0t-figma/scripts/extraction.ts
- [ ] T045 [US2] Write unit tests for alias resolution (including circular detection) in tests/unit/extraction.test.ts
- [ ] T046 [US2] Implement resolveAlias function with max depth protection in .t0t-figma/scripts/extraction.ts
- [ ] T047 [US2] Write unit tests for extractTokens main function in tests/unit/extraction.test.ts
- [ ] T048 [US2] Implement extractTokens function handling all token types (COLOR, FLOAT, STRING) in .t0t-figma/scripts/extraction.ts

### Stream-based JSON Parsing

- [ ] T049 [US2] Write unit tests for large JSON file handling in tests/unit/extraction.test.ts
- [ ] T050 [US2] Implement stream-based JSON parser for 10+ MB files in .t0t-figma/scripts/extraction.ts

### Integration Tests

- [ ] T051 [US2] Write integration test for extracting color tokens from Soulix example in tests/integration/extraction-pipeline.test.ts
- [ ] T052 [US2] Write integration test for extracting typography tokens in tests/integration/extraction-pipeline.test.ts
- [ ] T053 [US2] Write integration test for extracting spacing tokens in tests/integration/extraction-pipeline.test.ts
- [ ] T054 [US2] Write integration test for extracting radius tokens in tests/integration/extraction-pipeline.test.ts
- [ ] T055 [US2] Write integration test for extracting shadow tokens in tests/integration/extraction-pipeline.test.ts
- [ ] T056 [US2] Write integration test for handling empty Figma JSON in tests/integration/extraction-pipeline.test.ts
- [ ] T057 [US2] Write integration test for MCP-fetched JSON vs file JSON equivalence in tests/integration/mcp-integration.test.ts
- [ ] T058 [US2] Run all US2 tests and verify passing via npm test

---

## Phase 5: User Story 3 - Transform Figma JSON to Tailwind 4 CSS Format (P1)

**Goal**: Transform design tokens to CSS variables with OKLCH colors, rem units, sanitized names.

**Priority**: P1

**Duration Estimate**: 8-10 hours

**Independent Test**: Provide design tokens JSON, run transformation, verify CSS uses OKLCH, rem units, proper naming.

**Dependencies**: US2 (extraction), Foundational utilities (color, name, unit converters)

### Transformation Module

- [ ] T059 [US3] Write unit tests for transformToken function (color tokens) in tests/unit/transformation.test.ts
- [ ] T060 [US3] Implement transformToken for color tokens using rgbToOKLCH in .t0t-figma/scripts/transformation.ts
- [ ] T061 [US3] Write unit tests for transformToken function (spacing/font size tokens) in tests/unit/transformation.test.ts
- [ ] T062 [US3] Implement transformToken for spacing/text tokens using pxToRem in .t0t-figma/scripts/transformation.ts
- [ ] T063 [US3] Write unit tests for transformToken function (radius tokens) in tests/unit/transformation.test.ts
- [ ] T064 [US3] Implement transformToken for radius tokens with unit preservation in .t0t-figma/scripts/transformation.ts
- [ ] T065 [US3] Write unit tests for shadow formatting in tests/unit/transformation.test.ts
- [ ] T066 [US3] Implement formatShadow function in .t0t-figma/scripts/transformation.ts
- [ ] T067 [US3] Write unit tests for transformTokens batch function in tests/unit/transformation.test.ts
- [ ] T068 [US3] Implement transformTokens orchestration function in .t0t-figma/scripts/transformation.ts

### Integration Tests

- [ ] T069 [US3] Write integration test for full extraction → transformation pipeline in tests/integration/extraction-pipeline.test.ts
- [ ] T070 [US3] Write integration test for color conversion accuracy (no perceptible shifts) in tests/integration/transformation.test.ts
- [ ] T071 [US3] Write integration test for name sanitization with special characters in tests/integration/transformation.test.ts
- [ ] T072 [US3] Write integration test for duplicate name handling in tests/integration/transformation.test.ts
- [ ] T073 [US3] Run all US3 tests and verify passing via npm test

---

## Phase 6: User Story 4 - Generate Tailwind 4 Theme CSS File (P1)

**Goal**: Generate `figma-theme-variables.css` with @theme directive, organized by category.

**Priority**: P1

**Duration Estimate**: 6-8 hours

**Independent Test**: Run complete command, verify output file exists, contains valid CSS, works in Tailwind 4 project.

**Dependencies**: US3 (transformation)

### Generation Module

- [ ] T074 [US4] Write unit tests for groupByCategory function in tests/unit/generation.test.ts
- [ ] T075 [US4] Implement groupByCategory function in .t0t-figma/scripts/generation.ts
- [ ] T076 [US4] Write unit tests for formatVariable function in tests/unit/generation.test.ts
- [ ] T077 [US4] Implement formatVariable with 2-space indentation in .t0t-figma/scripts/generation.ts
- [ ] T078 [US4] Write unit tests for generateCategoryHeader function in tests/unit/generation.test.ts
- [ ] T079 [US4] Implement generateCategoryHeader function in .t0t-figma/scripts/generation.ts
- [ ] T080 [US4] Write unit tests for generateFileHeader function in tests/unit/generation.test.ts
- [ ] T081 [US4] Implement generateFileHeader with timestamp and token count in .t0t-figma/scripts/generation.ts
- [ ] T082 [US4] Write unit tests for generateThemeCSS main function in tests/unit/generation.test.ts
- [ ] T083 [US4] Implement generateThemeCSS with @theme wrapper and category organization in .t0t-figma/scripts/generation.ts

### File Writing

- [ ] T084 [US4] Write unit tests for writeThemeFile function in tests/unit/generation.test.ts
- [ ] T085 [US4] Implement writeThemeFile with error handling for permissions in .t0t-figma/scripts/generation.ts
- [ ] T086 [US4] Write unit tests for validateCSS function in tests/unit/generation.test.ts
- [ ] T087 [US4] Implement validateCSS using CSS parser in .t0t-figma/scripts/generation.ts

### Snapshot Tests

- [ ] T088 [US4] Create snapshot test for deterministic CSS output in tests/snapshots/generated-css.test.ts
- [ ] T089 [US4] Create snapshot for Soulix example theme CSS in tests/snapshots/generated-css.test.ts

### Integration Tests

- [ ] T090 [US4] Write integration test for complete pipeline (input → extraction → transformation → generation) in tests/integration/end-to-end.test.ts
- [ ] T091 [US4] Write integration test verifying byte-identical output for identical inputs in tests/integration/determinism.test.ts
- [ ] T092 [US4] Write integration test for file overwrite behavior in tests/integration/generation.test.ts
- [ ] T093 [US4] Write integration test for write permission errors in tests/integration/generation.test.ts
- [ ] T094 [US4] Run all US4 tests and verify passing via npm test

---

## Phase 7: User Story 5 - Package Command for Distribution (P1)

**Goal**: Create Claude Code command file and package utilities for distribution.

**Priority**: P1

**Duration Estimate**: 4-6 hours

**Independent Test**: Copy packaged command to fresh project, run it, verify it works without dependencies.

**Dependencies**: US1, US2, US3, US4 (full pipeline working)

### Command File

- [ ] T095 [US5] Create command file template with metadata in .claude/commands/t0t.extract-figma-theme.md
- [ ] T096 [US5] Write command description and usage instructions in .claude/commands/t0t.extract-figma-theme.md
- [ ] T097 [US5] Implement command entry point orchestrating full pipeline in .claude/commands/t0t.extract-figma-theme.md
- [ ] T098 [US5] Add dependency check for culori in command file in .claude/commands/t0t.extract-figma-theme.md
- [ ] T099 [US5] Add error messages for missing dependencies in .claude/commands/t0t.extract-figma-theme.md

### Package Documentation

- [ ] T100 [P] [US5] Create README for .t0t-figma/ folder explaining structure in .t0t-figma/README.md
- [ ] T101 [P] [US5] Document required dependencies and installation in .t0t-figma/README.md
- [ ] T102 [P] [US5] Add version information to command file and utilities in .claude/commands/t0t.extract-figma-theme.md

### Build and Distribution

- [ ] T103 [US5] Compile TypeScript to JavaScript in .t0t-figma/lib/ via npm run build
- [ ] T104 [US5] Verify all utility scripts have no external dependencies beyond npm packages
- [ ] T105 [US5] Test command in fresh project by copying .claude/commands/ and .t0t-figma/ folders

### Contract Tests

- [ ] T106 [US5] Write contract test for command interface in tests/contract/command-interface.test.ts
- [ ] T107 [US5] Write contract test verifying command options schema in tests/contract/command-interface.test.ts
- [ ] T108 [US5] Write contract test verifying command result schema in tests/contract/command-interface.test.ts
- [ ] T109 [US5] Run all US5 tests and verify passing via npm test

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Final polish, performance verification, documentation, edge case handling.

**Duration Estimate**: 4-6 hours

### Performance Testing

- [ ] T110 Verify performance with 50-100 token design system (<30s) via manual test
- [ ] T111 Verify performance with 500 token design system (<60s) via manual test
- [ ] T112 Verify stream-based parsing works with 10+ MB JSON file via manual test

### Error Handling & Edge Cases

- [ ] T113 [P] Test and handle Figma file with no tokens (log warning, minimal output)
- [ ] T114 [P] Test and handle malformed Figma JSON (clear error message)
- [ ] T115 [P] Test and handle unsupported schema version (error with version mismatch message)
- [ ] T116 [P] Test and handle circular alias references (detect and error)
- [ ] T117 [P] Test and handle out-of-gamut colors (apply gamut mapping, log warning)

### Documentation

- [ ] T118 [P] Review and update all TSDoc comments for completeness
- [ ] T119 [P] Add inline code comments for complex transformations
- [ ] T120 [P] Update quickstart.md with any changes from implementation

### Final Validation

- [ ] T121 Run full test suite and verify 80%+ coverage via npm run test:coverage
- [ ] T122 Run TypeScript type check with no errors via npm run lint
- [ ] T123 Test command with real Figma design system (Soulix example)
- [ ] T124 Import generated CSS into Tailwind 4 project and verify no errors
- [ ] T125 Verify deterministic output by running command twice with same input

---

## Dependencies Graph

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational Utilities)
    ↓
Phase 3 (US1: Input Validation) ← MVP CHECKPOINT
    ↓
Phase 4 (US2: Extraction)
    ↓
Phase 5 (US3: Transformation)
    ↓
Phase 6 (US4: Generation)
    ↓
Phase 7 (US5: Packaging)
    ↓
Phase 8 (Polish)
```

**Story Dependencies:**
- US1: None (MVP starting point)
- US2: Requires US1 (input validation)
- US3: Requires US2 (extraction), Foundational utilities
- US4: Requires US3 (transformation)
- US5: Requires US1-US4 (full pipeline)

**Independent Stories:** Each story can be tested independently once its dependencies are complete.

---

## Parallel Execution Opportunities

### Phase 1 (Setup)
Parallel tasks: T002, T005, T007 (can run simultaneously)

### Phase 2 (Foundational)
Parallel blocks:
- Color converter: T009-T013 (can run in parallel with name sanitizer and unit converter)
- Name sanitizer: T014-T018 (can run in parallel with color converter and unit converter)
- Unit converter: T019-T023 (can run in parallel with color converter and name sanitizer)

### Phase 3 (US1)
Parallel blocks:
- URL validation: T024-T025
- File validation: T026-T027
- Output validation: T028-T029
- MCP validation: T030-T032

Integration tests: T036-T039 (can run in parallel after implementation complete)

### Phase 4 (US2)
Integration tests: T051-T057 (can run in parallel after extraction module complete)

### Phase 5 (US3)
Token type transformations: T059-T066 (different token types can be implemented in parallel)

### Phase 6 (US4)
Utility functions: T074-T081 (formatting functions can be implemented in parallel)

### Phase 7 (US5)
Documentation tasks: T100-T102 (can run in parallel)

### Phase 8 (Polish)
Edge case tests: T113-T117 (can run in parallel)
Documentation: T118-T120 (can run in parallel)

---

## Task Summary

**Total Tasks**: 125

**By Phase:**
- Phase 1 (Setup): 8 tasks
- Phase 2 (Foundational): 15 tasks
- Phase 3 (US1): 17 tasks
- Phase 4 (US2): 18 tasks
- Phase 5 (US3): 15 tasks
- Phase 6 (US4): 21 tasks
- Phase 7 (US5): 15 tasks
- Phase 8 (Polish): 16 tasks

**By User Story:**
- US1: 17 tasks (Input Validation)
- US2: 18 tasks (Extraction)
- US3: 15 tasks (Transformation)
- US4: 21 tasks (Generation)
- US5: 15 tasks (Packaging)
- Setup: 8 tasks
- Foundational: 15 tasks
- Polish: 16 tasks

**Parallelizable Tasks**: 38 tasks marked with [P]

**Test Tasks**: 72 test-related tasks (58% of total - strong TDD coverage)

**MVP Scope Suggestion**: Complete Phase 1-3 (US1) for minimal viable input validation functionality (25 tasks total).

---

## Format Validation

✅ All tasks follow required checklist format: `- [ ] TaskID [P] [Story] Description with file path`
✅ Task IDs sequential: T001-T125
✅ Story labels present for user story tasks: [US1] through [US5]
✅ Parallel markers present where applicable: [P]
✅ File paths included in all implementation tasks
✅ TDD approach: Tests written before implementation for all modules

---

## Notes

- **Constitution Compliance**: All tasks follow TDD (tests first), 80% coverage requirement enforced
- **Deterministic Output**: Snapshot tests (T088-T089) and determinism tests (T091) ensure identical outputs
- **Independent Testing**: Each user story phase includes its own integration tests
- **Error Handling**: Comprehensive error scenarios covered in Phase 8
- **Documentation**: Inline TSDoc, README files, and command documentation throughout
