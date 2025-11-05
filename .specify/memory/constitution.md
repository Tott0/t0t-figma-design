# t0t-figma-design Constitution

<!--
Sync Impact Report
==================
Version Change: (none) → 1.0.0
Change Type: Initial constitution creation
Modified Principles: N/A (new document)
Added Sections:
  - Core Principles (5 principles established)
  - Quality Standards
  - Development Workflow
  - Governance
Removed Sections: N/A
Templates Status:
  ✅ plan-template.md - Reviewed, constitution check section aligns
  ✅ spec-template.md - Reviewed, requirements align with consistency principles
  ✅ tasks-template.md - Reviewed, test-first approach supported
  ⚠️ Commands in .claude/commands/*.md - May need review for constitution references
Follow-up TODOs:
  - Review command files for any hardcoded agent references that should be generic
  - Consider adding constitution compliance validation to CI/CD pipeline
-->

## Core Principles

### I. Deterministic Output (NON-NEGOTIABLE)

Given identical input specifications, the system MUST produce identical output every time. No randomness, no variability, no generative deviations. All outputs—theme configurations, component definitions, design tokens—are strictly derived from explicit specifications. This ensures reproducibility, testability, and trust in the tool's behavior.

**Rationale**: Consistency is the foundation of reliable tooling. Users must be able to depend on predictable results. This enables proper version control, code review, and collaboration.

### II. Specification-Driven Generation

All generated artifacts (Tailwind 4 theme templates, reusable UI components) MUST be constrained by and derived exclusively from formal specifications. No hallucination, no inference beyond explicit rules, no "creative interpretation." If information is not in the specification, the system MUST NOT generate it—instead, fail fast with clear error messages identifying missing specification data.

**Rationale**: Prevents scope creep and ensures generated code matches intended design. Missing specifications should block generation, not trigger guesswork.

### III. Test-First Development (NON-NEGOTIABLE)

All features follow strict TDD: Tests written → User approved → Tests fail → Implementation → Tests pass. Integration tests are mandatory for:
- New component contracts
- Theme generation logic
- Specification parser changes
- Output format modifications

Contract tests validate all public interfaces. No implementation without failing tests first. Red-Green-Refactor cycle strictly enforced.

**Rationale**: Test-first development catches errors early, documents expected behavior, and ensures deterministic output is verifiable. For a tool that must produce consistent results, comprehensive testing is non-negotiable.

### IV. Code Quality Standards

Code MUST be:
- **Self-documenting**: Clear naming, obvious intent, minimal comments needed
- **Modular**: Single Responsibility Principle, loose coupling, high cohesion
- **Type-safe**: Full type coverage where language supports it (TypeScript strict mode, Python type hints)
- **Linted**: Pass all configured linters and formatters with zero warnings
- **Reviewed**: All changes require peer review before merge

Complexity MUST be justified. Prefer simple, explicit solutions over clever abstractions. If a simpler approach exists and was rejected, document why in code comments or architecture decision records.

**Rationale**: Quality code is maintainable code. Given this tool's purpose (reliable, deterministic generation), code quality directly impacts reliability.

### V. User Experience Consistency

All interfaces (CLI, API, configuration files) MUST:
- Use consistent terminology across all touchpoints
- Provide clear, actionable error messages with suggested fixes
- Follow progressive disclosure (simple by default, advanced when needed)
- Return structured, parseable output (JSON for machine, formatted text for human)
- Include usage examples in help text and documentation

**Rationale**: Consistency in UX reduces cognitive load and learning curve. Users should never be confused about terminology or next steps.

## Quality Standards

### Testing Requirements

- **Unit Test Coverage**: Minimum 80% coverage for core logic (specification parsing, generation engine)
- **Integration Tests**: Required for all cross-module interactions
- **Contract Tests**: Required for all public APIs and CLI interfaces
- **Snapshot Tests**: Required for all generated output (themes, components)
- **Performance Tests**: Generation must complete in <5 seconds for typical design systems (50-100 components)

### Documentation Requirements

- **README**: Quick start guide with working example in under 5 minutes
- **API Documentation**: Generated from code (JSDoc, docstrings, etc.)
- **Specification Format**: Formal schema documentation with validation rules
- **Change Log**: CHANGELOG.md following Keep a Changelog format
- **Architecture Decision Records**: Major design decisions documented in docs/adr/

### Security & Safety

- **Input Validation**: All external inputs (specifications, configuration files) validated against schemas
- **Sanitization**: All user-provided strings sanitized before use in generated code
- **Dependency Auditing**: Regular security audits (npm audit, pip check)
- **Principle of Least Privilege**: File system access limited to documented read/write paths
- **Safe Defaults**: Secure by default, require opt-in for potentially dangerous features

## Development Workflow

### Code Review Process

1. **Self Review**: Author reviews own changes using checklist (constitution compliance, test coverage, documentation)
2. **Peer Review**: At least one team member approves before merge
3. **Constitution Check**: Automated or manual verification of principle compliance
4. **Test Gate**: All tests must pass (unit, integration, contract)
5. **Documentation Gate**: Changes requiring documentation updates must include them

### Branch & Commit Strategy

- **Branch Naming**: `<type>/<issue-number>-<short-description>` (e.g., `feature/042-tailwind-v4-support`)
- **Commit Messages**: Conventional Commits format (`type(scope): description`)
- **Small Commits**: Atomic commits that can be reverted independently
- **Signed Commits**: GPG signing required for main branch merges

### Continuous Integration

- **Automated Testing**: All tests run on every pull request
- **Lint & Format Check**: Code style enforced automatically
- **Type Checking**: Static analysis must pass
- **Build Verification**: Ensure project builds successfully
- **Preview Environments**: Test changes in isolated environments before merge

## Governance

### Amendment Process

1. **Proposal**: Document proposed change with rationale
2. **Discussion**: Team review (minimum 3 business days for feedback)
3. **Approval**: Consensus required for principle changes; majority for process changes
4. **Migration Plan**: If change affects existing code, include migration steps
5. **Version Update**: Increment constitution version following rules below
6. **Template Sync**: Update all dependent templates to reflect changes

### Versioning Policy

Constitution versions follow semantic versioning:
- **MAJOR**: Breaking changes to core principles, principle removal, or non-negotiable rule changes
- **MINOR**: New principles added, significant process expansions, new quality gates
- **PATCH**: Clarifications, typo fixes, wording improvements, formatting changes

### Compliance Review

- **Pull Request Reviews**: Every PR checked against constitution principles
- **Quarterly Audits**: Full codebase review for constitution compliance
- **Violation Handling**: Document violations in complexity tracking table (plan.md) with justification
- **Retrospectives**: Monthly review of constitution effectiveness and needed updates

### Tool Evolution

As the tool evolves to generate Tailwind 4 themes and reusable UI components:
- **Specification Format**: Must remain backward compatible or include migration tooling
- **Output Format**: Changes must be versioned, users opt-in to new formats
- **Generative Limits**: Any new generative features must follow Principle I (Deterministic Output) and Principle II (Specification-Driven)
- **Testing Expansion**: New output types require new snapshot and contract tests

### Constitution Supersedes All

When conflicts arise between this constitution and other documentation, practices, or individual preferences, **the constitution wins**. If the constitution is wrong, amend it through the governance process—do not work around it.

**Version**: 1.0.0 | **Ratified**: 2025-11-05 | **Last Amended**: 2025-11-05
