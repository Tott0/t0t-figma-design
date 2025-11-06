# Implementation Plan: Figma Design Tokens to Tailwind 4 Theme Extraction

**Branch**: `001-figma-theme-extraction` | **Date**: 2025-11-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-figma-theme-extraction/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a Claude Code executable command (`t0t.extract-figma-theme`) that extracts design tokens from Figma (via URL with MCP or JSON file) and converts them into a Tailwind 4 theme CSS file (`figma-theme-variables.css`). The command performs extraction, transformation (including OKLCH color conversion and unit conversions), and generates CSS with `@theme {}` directive. It's packaged for distribution via manual file copying to any project.

## Technical Context

**Language/Version**: JavaScript/Node.js (NEEDS CLARIFICATION: specific version requirements)
**Primary Dependencies**:
- culori (color conversion library for RGB/HSL/HEX to OKLCH)
- Figma MCP tool (Claude Code integration for Figma API access)
- NEEDS CLARIFICATION: JSON parsing library, file system utilities, validation library

**Storage**: File system (read JSON files, write CSS files)
**Testing**: NEEDS CLARIFICATION: Testing framework (Jest, Vitest, or other)
**Target Platform**: Node.js environment (Claude Code execution context)
**Project Type**: CLI tool / Claude Code command
**Performance Goals**:
- <30 seconds for 50-100 tokens
- <60 seconds for up to 500 tokens
- NEEDS CLARIFICATION: Memory usage limits for large JSON files (10+ MB)

**Constraints**:
- Deterministic output (identical inputs → identical outputs)
- No dependencies beyond documented npm packages
- Must work when copied to any project directory
- Color conversion must maintain visual accuracy (no perceptible shifts)

**Scale/Scope**:
- Handle design systems with 50-500 tokens
- NEEDS CLARIFICATION: Maximum supported token count
- NEEDS CLARIFICATION: Maximum JSON file size handling
- Support all token categories: colors, typography, spacing, radius, shadows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Deterministic Output (NON-NEGOTIABLE)
- ✅ **PASS**: Spec explicitly requires identical inputs produce identical outputs (SC-014)
- ✅ **PASS**: No randomness or generative AI in transformation logic
- ✅ **PASS**: Color conversion uses mathematical formulas (OKLCH conversion)
- ✅ **PASS**: All transformations are rule-based and deterministic

### Principle II: Specification-Driven Generation
- ✅ **PASS**: Output derived exclusively from Figma design token specifications
- ✅ **PASS**: No inference beyond explicit token definitions
- ✅ **PASS**: Missing data results in warnings/errors (FR-022: handle empty tokens gracefully)
- ✅ **PASS**: No "creative interpretation" of design tokens

### Principle III: Test-First Development (NON-NEGOTIABLE)
- ⚠️ **PENDING**: Testing framework not yet selected (marked NEEDS CLARIFICATION)
- ⚠️ **PENDING**: Test requirements defined in spec but tests not written yet
- 📋 **REQUIRED FOR IMPLEMENTATION**:
  - Unit tests for color conversion (visual accuracy validation)
  - Unit tests for name sanitization
  - Unit tests for unit conversion (px to rem)
  - Integration tests for full extraction pipeline
  - Snapshot tests for generated CSS output (determinism validation)
  - Contract tests for command interface

### Principle IV: Code Quality Standards
- ✅ **PASS**: Requirements specify clear error messages (FR-009, FR-010, FR-046)
- ✅ **PASS**: Modular design implied by separation of concerns (extraction → transformation → generation)
- ⚠️ **PENDING**: Type safety enforcement not yet specified
- 📋 **RECOMMENDED**: Use TypeScript with strict mode for type safety

### Principle V: User Experience Consistency
- ✅ **PASS**: Clear terminology throughout spec (design tokens, extraction, transformation)
- ✅ **PASS**: Actionable error messages required (FR-009, FR-010, FR-016)
- ✅ **PASS**: Progressive disclosure: simple usage (just provide URL/file), advanced optional
- ✅ **PASS**: Usage examples required in command documentation (FR-055)

### Quality Standards Assessment
- **Test Coverage**: Will require 80%+ coverage per constitution
- **Documentation**: README and inline docs specified in FR-055, FR-061, FR-062
- **Security**: Input validation required (FR-005, FR-006, FR-023), sanitization required (FR-034)
- **Performance**: Targets specified (<30s for 50-100 tokens, <60s for 500 tokens)

### Gate Status: ⚠️ CONDITIONAL PASS
**Blockers**: None for research phase
**Action Items Before Implementation**:
1. Select and configure testing framework
2. Choose TypeScript vs JavaScript (recommend TypeScript for type safety)
3. Define test coverage requirements for each module

---

## Post-Design Constitution Re-evaluation

**Re-evaluated**: 2025-11-06 after Phase 1 completion

### Principle I: Deterministic Output (NON-NEGOTIABLE)
- ✅ **PASS**: Data model ensures deterministic transformations
- ✅ **PASS**: All transformations use mathematical formulas (OKLCH, px→rem)
- ✅ **PASS**: CSS generation uses deterministic sorting (alphabetical within categories)
- ✅ **PASS**: Snapshot tests defined in contracts to verify determinism

### Principle II: Specification-Driven Generation
- ✅ **PASS**: Extraction contract explicitly requires resolving to primitive values only
- ✅ **PASS**: Transformation contract forbids inference (only defined token types processed)
- ✅ **PASS**: Data model defines clear validation rules for rejecting invalid inputs
- ✅ **PASS**: No creative interpretation - all transformations rule-based

### Principle III: Test-First Development (NON-NEGOTIABLE)
- ✅ **RESOLVED**: Vitest selected as testing framework (research.md)
- ✅ **RESOLVED**: Test types defined: unit, integration, contract, snapshot (quickstart.md)
- ✅ **RESOLVED**: 80%+ coverage requirement established (vitest.config.ts in quickstart)
- ✅ **PASS**: Contracts provide complete test specifications
- ⚠️ **ACTION REQUIRED**: Tests must be written before implementation begins

### Principle IV: Code Quality Standards
- ✅ **RESOLVED**: TypeScript with strict mode selected (research.md decision)
- ✅ **PASS**: Modular design reflected in contracts (6 separate modules)
- ✅ **PASS**: All contracts include TSDoc comments for self-documentation
- ✅ **PASS**: Error classes defined with specific error codes for clarity
- ✅ **PASS**: Validation module ensures input safety

### Principle V: User Experience Consistency
- ✅ **PASS**: Contracts use consistent terminology (DesignToken → CSSVariable → ThemeFile)
- ✅ **PASS**: Error messages include helpText fields (validation.ts, command-interface.ts)
- ✅ **PASS**: Command interface supports progressive disclosure (url OR file, optional verbose)
- ✅ **PASS**: Generation summary provides structured feedback (GenerationSummary type)

### Quality Standards Assessment (Post-Design)
- ✅ **Test Coverage**: Vitest configured with 80% threshold (quickstart.md)
- ✅ **Documentation**: README planned for .t0t-figma/, inline TSDoc in all contracts
- ✅ **Security**: Validation module handles all input sanitization (validation.ts)
- ✅ **Performance**: Stream-based processing for large files (research.md)

### Final Gate Status: ✅ PASS WITH IMPLEMENTATION REQUIREMENTS

**No Blockers**

**Implementation Checklist**:
1. ✅ Testing framework selected: Vitest
2. ✅ Language selected: TypeScript with strict mode
3. ✅ Test coverage requirements: 80% minimum
4. ✅ All unknowns from Technical Context resolved in research.md
5. ✅ Data model defines all entities and relationships
6. ✅ Contracts provide complete API specifications
7. ⚠️ **Tests must be written BEFORE implementation** (TDD requirement)

**Ready to proceed to Phase 2**: Task generation (/speckit.tasks)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
.claude/
└── commands/
    └── t0t.extract-figma-theme.md    # Command definition file

.t0t-figma/                            # Distribution package
├── scripts/                           # Utility scripts
│   ├── extract.js                    # Figma JSON extraction logic
│   ├── transform.js                  # Token transformation engine
│   ├── generate.js                   # CSS file generation
│   ├── color-converter.js            # RGB/HSL/HEX → OKLCH conversion
│   ├── name-sanitizer.js             # Token name → CSS variable name
│   ├── unit-converter.js             # px → rem conversion
│   └── validate-mcp.js               # MCP functionality validation
├── lib/                               # Compiled/bundled utilities
└── templates/                         # Future: output templates
    └── README.md                     # Package documentation

tests/
├── unit/
│   ├── color-converter.test.js
│   ├── name-sanitizer.test.js
│   ├── unit-converter.test.js
│   └── transform.test.js
├── integration/
│   ├── extraction-pipeline.test.js
│   └── mcp-integration.test.js
├── contract/
│   └── command-interface.test.js
└── snapshots/
    └── __snapshots__/
        └── generated-css.snap

documentation/                         # Reference materials
├── Soulix Design System-variables-full  # Example Figma JSON format
├── tailwindcss.txt                   # Tailwind 4 conventions reference
└── archived-for-the-future.md        # Out-of-scope features

package.json                           # Dependencies (culori, testing framework)
tsconfig.json                          # TypeScript configuration (if TypeScript chosen)
```

**Structure Decision**: Single project structure (CLI tool). The command is packaged for distribution in `.t0t-figma/` and `.claude/commands/`. All transformation logic is modular and self-contained in scripts. Users install by copying these two locations to their project.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
