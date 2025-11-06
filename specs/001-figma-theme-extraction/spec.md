# Feature Specification: Figma Design System to Tailwind Theme Extraction

**Feature Branch**: `001-figma-theme-extraction`
**Created**: 2025-11-05
**Status**: Draft
**Input**: User description: "Build a tool used to extract information from a figma url, usually a design system and then reformat the obtained information into useful style specifications."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Extract Figma Design Tokens to Tailwind Theme (Priority: P1)

A designer or developer has created a design system in Figma with defined colors, typography, spacing, and other design tokens. They want to automatically extract these design tokens and convert them into a Tailwind 4 theme file that can be imported into any project using Tailwind CSS v4.

**Why this priority**: This is the foundational capability that enables all other features. Without the ability to extract and format design tokens, no other workflows are possible. This delivers immediate value by automating the manual and error-prone process of translating design specifications into code.

**Independent Test**: Can be fully tested by providing a Figma URL with a design system, running the extraction command, and verifying that a valid Tailwind 4 theme CSS file is generated with correct `@theme` declarations for colors, spacing, fonts, and other design tokens.

**Acceptance Scenarios**:

1. **Given** a Figma URL containing a design system with color styles, **When** the user runs the extraction command with the URL, **Then** the system generates a CSS file with properly formatted `--color-*` theme variables in OKLCH format
2. **Given** a Figma design system with typography styles (font families, sizes, weights), **When** extraction is performed, **Then** the output includes `--font-*`, `--text-*`, `--font-weight-*`, and `--leading-*` theme variables
3. **Given** a Figma design system with spacing values, **When** extraction is performed, **Then** the output includes `--spacing-*` theme variables
4. **Given** a Figma design system with border radius values, **When** extraction is performed, **Then** the output includes `--radius-*` theme variables
5. **Given** a Figma design system with shadow effects, **When** extraction is performed, **Then** the output includes `--shadow-*` and `--inset-shadow-*` theme variables
6. **Given** the user provides downloaded Figma JSON instead of a URL, **When** extraction is performed, **Then** the system processes the JSON and generates the same quality theme file

---

### User Story 2 - Iterative Theme Refinement (Priority: P2)

A user has extracted a theme from Figma but needs to refine it based on updated designs or discovered issues. They want to re-run the extraction process to update the theme file without starting from scratch.

**Why this priority**: Design systems evolve continuously. Users need to keep their Tailwind themes in sync with Figma updates. This enables an iterative workflow where the tool becomes part of the design-to-code pipeline rather than a one-time conversion.

**Independent Test**: Can be fully tested by extracting a theme, modifying the Figma design system (e.g., changing color values), re-running the extraction, and verifying that the theme file is updated with new values while maintaining proper formatting and structure.

**Acceptance Scenarios**:

1. **Given** an existing theme file from a previous extraction, **When** the user re-runs extraction with the same Figma URL, **Then** the system updates the theme file with new values
2. **Given** a Figma design system where a color has been renamed, **When** re-extraction is performed, **Then** the old color variable is removed and the new one is added
3. **Given** a Figma design system with new design tokens added, **When** re-extraction is performed, **Then** the new tokens are appended to the existing theme file
4. **Given** conflicting theme variables between old and new extractions, **When** re-extraction is performed, **Then** the system preserves the new values and logs what changed

---

### User Story 3 - Theme Validation and Quality Checks (Priority: P2)

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

### User Story 4 - Command Dependency Management (Priority: P3)

A user wants to run advanced commands (like future UI generation commands) but hasn't extracted a theme yet. The system should prevent running dependent commands and guide the user to run prerequisite steps first.

**Why this priority**: As the tool grows to support multiple phases (theme extraction, component generation, UI generation), users need clear guidance on execution order. This prevents cryptic errors and provides a better user experience.

**Independent Test**: Can be fully tested by attempting to run a dependent command (e.g., a future UI generation command) without having extracted a theme first, and verifying that the system blocks execution with a helpful error message pointing to the prerequisite command.

**Acceptance Scenarios**:

1. **Given** no theme file exists, **When** a user tries to run a command that depends on theme extraction, **Then** the system blocks execution and displays an error message indicating the prerequisite command
2. **Given** a theme file exists, **When** a user runs a dependent command, **Then** the system proceeds with execution
3. **Given** a corrupted or invalid theme file, **When** a user runs a dependent command, **Then** the system suggests re-running the extraction command
4. **Given** multiple commands with dependencies, **When** a user runs any command, **Then** the system validates the entire dependency chain and reports any missing prerequisites

---

### Edge Cases

- What happens when a Figma URL points to a file without design tokens (e.g., just mockups)?
- What happens when the Figma file is private and the MCP tool cannot access it?
- What happens when color values in Figma use RGB/HSL instead of the expected formats?
- How does the system handle extremely large design systems (500+ tokens)?
- What happens when token names in Figma contain special characters or spaces?
- What happens when typography uses fonts not available as web fonts?
- What happens when a Figma file uses deprecated style formats?
- How does the system handle shadow effects with multiple layers?
- What happens when spacing values use inconsistent units (px, rem, em mixed)?
- What happens when the user provides a Figma node ID that doesn't exist?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST extract design tokens from a Figma URL using the Claude MCP Figma tool
- **FR-002**: System MUST accept either a Figma URL or a downloaded Figma JSON file as input
- **FR-003**: System MUST extract color styles and convert them to `--color-*` theme variables in OKLCH format
- **FR-004**: System MUST extract typography styles and convert them to `--font-*`, `--text-*`, `--font-weight-*`, `--tracking-*`, and `--leading-*` theme variables
- **FR-005**: System MUST extract spacing values and convert them to `--spacing-*` theme variables
- **FR-006**: System MUST extract border radius values and convert them to `--radius-*` theme variables
- **FR-007**: System MUST extract shadow effects and convert them to `--shadow-*` and `--inset-shadow-*` theme variables
- **FR-008**: System MUST generate output as a valid CSS file with `@theme {}` directive following Tailwind 4 syntax
- **FR-009**: System MUST output theme files that can be imported into any Tailwind 4 project without modification
- **FR-010**: System MUST support re-running extraction to update existing theme files with new design token values
- **FR-011**: System MUST validate generated theme files for Tailwind 4 compliance
- **FR-012**: System MUST detect and report naming conflicts in theme variables
- **FR-013**: System MUST detect and report invalid color format values
- **FR-014**: System MUST validate CSS structure of generated theme files
- **FR-015**: System MUST implement dependency checking to prevent running dependent commands without prerequisites
- **FR-016**: System MUST provide clear error messages when prerequisites are missing
- **FR-017**: System MUST handle Figma files that cannot be accessed due to permissions
- **FR-018**: System MUST handle Figma files without design token definitions gracefully
- **FR-019**: System MUST sanitize token names from Figma to ensure valid CSS variable names (remove special characters, spaces)
- **FR-020**: System MUST preserve the deterministic output principle: identical Figma inputs always produce identical theme outputs
- **FR-021**: System MUST log all extraction operations with timestamp, source URL/file, and tokens extracted
- **FR-022**: System MUST support extraction of animation timing functions and convert them to `--ease-*` theme variables
- **FR-023**: System MUST support extraction of breakpoint values if defined in Figma and convert them to `--breakpoint-*` theme variables

### Key Entities

- **Design Token**: A named design value from Figma (color, spacing, typography, etc.) that maps to a Tailwind theme variable. Attributes: name, value, type (color/spacing/font/etc.), Figma source reference.
- **Theme File**: The generated CSS output file containing all extracted design tokens formatted as Tailwind 4 theme variables. Attributes: file path, creation timestamp, source Figma URL/file, validation status, token count.
- **Extraction Session**: A single run of the extraction command. Attributes: timestamp, input source (URL or JSON file), output file path, success/failure status, tokens extracted count, errors/warnings.
- **Validation Result**: The outcome of validating a theme file. Attributes: validation timestamp, theme file path, pass/fail status, list of issues found, list of suggestions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can extract a complete theme from a Figma design system in under 30 seconds
- **SC-002**: Generated theme files pass Tailwind 4 validation 100% of the time when source Figma follows standard practices
- **SC-003**: Extracted themes produce no console errors or warnings when imported into a Tailwind 4 project
- **SC-004**: 95% of design tokens from Figma are successfully extracted and correctly formatted
- **SC-005**: Re-running extraction on the same Figma source produces byte-identical output (deterministic)
- **SC-006**: Users can iterate on theme extraction and see updates reflected in under 30 seconds per iteration
- **SC-007**: System successfully handles Figma files with up to 500 design tokens without performance degradation
- **SC-008**: Error messages for missing prerequisites or validation failures are clear enough that users can resolve 90% of issues without external help
- **SC-009**: Naming conflicts and validation issues are detected and reported with specific locations 100% of the time

## Assumptions

- Figma design systems follow common naming conventions for styles (e.g., "primary-500", "spacing-md", "font-body")
- Users have access to the Figma files they want to extract from (either public links or appropriate permissions)
- The Claude MCP Figma tool is properly configured and available in the user's environment
- Users understand basic CSS and Tailwind CSS concepts
- Figma color values can be reliably converted to OKLCH format (or a conversion library is available)
- Users will primarily use the tool as a CLI command integrated with Claude Code
- The tool will be run in environments with Node.js or Python available for any necessary dependencies
- Users want theme variables to follow Tailwind's default naming patterns unless explicitly customized
- Generated theme files will be checked into version control alongside other project files

## Future Phases (Archived)

The following phases are explicitly **not** part of this specification and are documented here for future reference only:

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
