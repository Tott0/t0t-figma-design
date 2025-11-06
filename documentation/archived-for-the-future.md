# Archived User Stories - Future Phases

**Archived Date**: 2025-11-06
**Reason**: Focusing specification on Phase 1 only (Figma Design Token Extraction to Tailwind Theme)

The following user stories and future phases have been archived for potential future implementation after Phase 1 is completed and validated.

---

## User Story 2 - Iterative Theme Refinement (Priority: P2)

A user has extracted a theme from Figma but needs to refine it based on updated designs or discovered issues. They want to re-run the extraction process to update the theme file without starting from scratch.

**Why this priority**: Design systems evolve continuously. Users need to keep their Tailwind themes in sync with Figma updates. This enables an iterative workflow where the tool becomes part of the design-to-code pipeline rather than a one-time conversion.

**Independent Test**: Can be fully tested by extracting a theme, modifying the Figma design system (e.g., changing color values), re-running the extraction, and verifying that the theme file is updated with new values while maintaining proper formatting and structure.

**Acceptance Scenarios**:

1. **Given** an existing theme file from a previous extraction, **When** the user re-runs extraction with the same Figma URL, **Then** the system updates the theme file with new values
2. **Given** a Figma design system where a color has been renamed, **When** re-extraction is performed, **Then** the old color variable is removed and the new one is added
3. **Given** a Figma design system with new design tokens added, **When** re-extraction is performed, **Then** the new tokens are appended to the existing theme file
4. **Given** conflicting theme variables between old and new extractions, **When** re-extraction is performed, **Then** the system preserves the new values and logs what changed

---

## User Story 3 - Theme Validation and Quality Checks (Priority: P2)

A user has extracted a theme and wants to ensure it follows Tailwind 4 conventions, has no naming conflicts, and will work correctly when imported into a project.

**Why this priority**: Automated extraction can produce edge cases or formatting issues. Validation catches problems before developers try to use the theme, reducing debugging time and ensuring consistency with Tailwind 4 standards.

**Independent Test**: Can be fully tested by providing an extracted theme file (or generating one with intentional errors), running validation, and verifying that the system reports all issues with specific line numbers and suggestions for fixes.

**Acceptance Scenarios**:

1. **Given** a generated theme file, **When** validation is run, **Then** the system confirms all theme variables follow Tailwind 4 naming conventions
2. **Given** a theme file with duplicate variable names, **When** validation is run, **Then** the system reports the duplicates and their locations
3. **Given** a theme file with invalid OKLCH color values, **When** validation is run, **Then** the system reports the invalid colors and suggests corrections
4. **Given** a theme file missing required CSS structure (e.g., `@theme {}` wrapper), **When** validation is run, **Then** the system reports the structural issues
5. **Given** a valid theme file, **When** validation is run, **Then** the system confirms successful validation with a summary of extracted tokens

---

## User Story 4 - Command Dependency Management (Priority: P3)

A user wants to run advanced commands (like future UI generation commands) but hasn't extracted a theme yet. The system should prevent running dependent commands and guide the user to run prerequisite steps first.

**Why this priority**: As the tool grows to support multiple phases (theme extraction, component generation, UI generation), users need clear guidance on execution order. This prevents cryptic errors and provides a better user experience.

**Independent Test**: Can be fully tested by attempting to run a dependent command (e.g., a future UI generation command) without having extracted a theme first, and verifying that the system blocks execution with a helpful error message pointing to the prerequisite command.

**Acceptance Scenarios**:

1. **Given** no theme file exists, **When** a user tries to run a command that depends on theme extraction, **Then** the system blocks execution and displays an error message indicating the prerequisite command
2. **Given** a theme file exists, **When** a user runs a dependent command, **Then** the system proceeds with execution
3. **Given** a corrupted or invalid theme file, **When** a user runs a dependent command, **Then** the system suggests re-running the extraction command
4. **Given** multiple commands with dependencies, **When** a user runs any command, **Then** the system validates the entire dependency chain and reports any missing prerequisites

---

## Future Phases

The following phases are explicitly **not** part of Phase 1 specification and are documented here for future reference only:

### Phase 2: Component Generation (POSTPONED)
- Generating reusable UI components following shadcn methodology
- Reading Figma component designs and translating them to component variants
- Creating component APIs based on theme variables

### Phase 3: Prompt-Based UI Generation (POSTPONED)
- Generating UI from natural language prompts
- Ensuring generated UI uses only theme variables (no inline styles)

### Phase 4: Full Page Generation (POSTPONED)
- Extracting entire page designs from Figma
- Breaking pages into semantic blocks
- Composing pages from generated components

---

## Related Requirements (Archived)

The following functional requirements from the original spec are related to archived user stories and future phases:

- **FR-010**: System MUST support re-running extraction to update existing theme files with new design token values (User Story 2)
- **FR-011**: System MUST validate generated theme files for Tailwind 4 compliance (User Story 3)
- **FR-012**: System MUST detect and report naming conflicts in theme variables (User Story 3)
- **FR-013**: System MUST detect and report invalid color format values (User Story 3)
- **FR-014**: System MUST validate CSS structure of generated theme files (User Story 3)
- **FR-015**: System MUST implement dependency checking to prevent running dependent commands without prerequisites (User Story 4)
- **FR-016**: System MUST provide clear error messages when prerequisites are missing (User Story 4)

---

## Success Criteria (Archived)

The following success criteria are related to archived user stories:

- **SC-006**: Users can iterate on theme extraction and see updates reflected in under 30 seconds per iteration (User Story 2)
- **SC-008**: Error messages for missing prerequisites or validation failures are clear enough that users can resolve 90% of issues without external help (User Stories 3 & 4)
- **SC-009**: Naming conflicts and validation issues are detected and reported with specific locations 100% of the time (User Story 3)
