# Feature Specification: Figma Design Tokens to Tailwind 4 Theme Extraction

**Feature Branch**: `001-figma-theme-extraction`
**Created**: 2025-11-05
**Updated**: 2025-11-06 (Restructured workflow to match execution flow)
**Status**: Draft
**Input**: User description: "Build a Claude Code executable command that extracts design tokens from Figma and converts them into a Tailwind 4 theme CSS file"

**Command Name**: `t0t.extract-figma-theme`
**Output File**: `figma-theme-variables.css`

## Clarifications

### Session 2025-11-06

- Q: Should colors be converted to OKLCH format, or would an alternative format be more appropriate given compatibility and conversion concerns? → A: OKLCH format - perceptually uniform, modern standard, better color interpolation. Growing browser support aligns with Tailwind 4's forward-looking approach.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accept Input from Figma URL or JSON File (Priority: P1)

A developer wants to extract design tokens from a Figma design system. They have two options: provide a Figma URL (which requires the Figma MCP tool to be working) or provide a downloaded JSON file from Figma. The command should accept either input method, with JSON file taking priority if both are provided. For the Figma URL path, the command must validate that the Figma MCP tool is active and functioning before proceeding.

**Why this priority**: Input handling is the first step in the workflow. Without a reliable way to get design system data, nothing else can happen. Validating MCP functionality upfront prevents wasted time and confusing errors later in the process.

**Independent Test**: Can be fully tested by running the command with: (1) only a Figma URL with working MCP, (2) only a Figma URL with non-working MCP, (3) only a JSON file, (4) both URL and JSON file. Verify correct input is used and appropriate validation/errors occur.

**Acceptance Scenarios**:

1. **Given** the user provides only a Figma URL, **When** the command runs, **Then** the system validates that Figma MCP is active and functioning before proceeding
2. **Given** the user provides a Figma URL but Figma MCP is not working, **When** the command runs, **Then** the system displays an error message asking the user to fix MCP configuration and stops execution
3. **Given** the user provides only a JSON file path, **When** the command runs, **Then** the system validates the JSON file exists and is readable, then proceeds with extraction
4. **Given** the user provides both a Figma URL and a JSON file path, **When** the command runs, **Then** the system prioritizes the JSON file and proceeds with that input
5. **Given** the user provides a JSON file that doesn't exist or is unreadable, **When** the command runs, **Then** the system displays a clear error message with the file path and stops execution
6. **Given** the user provides neither a Figma URL nor a JSON file, **When** the command runs, **Then** the system displays usage instructions showing both input methods
7. **Given** the user provides a Figma URL and MCP validation passes, **When** the command proceeds, **Then** the system can successfully fetch design system data from Figma

---

### User Story 2 - Extract All Design Tokens from Figma into Unified JSON (Priority: P1)

A developer has provided either a Figma URL or JSON file. The command should extract all design token categories (colors, typography, spacing, border radius, shadows, and any other design variables) from the Figma design system in a single extraction phase, producing a unified JSON structure that represents all design tokens. This JSON structure should match the expected format of Figma's variable export format.

**Why this priority**: Extracting all tokens at once is more efficient than multiple separate extraction phases. This unified approach ensures consistency and allows the transformation phase to work with a complete dataset. The extraction phase produces a normalized intermediate format that the transformation phase can consume.

**Independent Test**: Can be fully tested by providing a Figma design system (via URL or JSON), running extraction, and verifying that the output JSON contains all token categories with correct values and proper structure matching the expected Figma variable format.

**Acceptance Scenarios**:

1. **Given** a Figma design system with color variables, **When** extraction runs, **Then** the output JSON includes all color definitions with their values and metadata
2. **Given** a Figma design system with typography variables (font families, sizes, weights, line heights, letter spacing), **When** extraction runs, **Then** the output JSON includes all typography definitions
3. **Given** a Figma design system with spacing variables, **When** extraction runs, **Then** the output JSON includes all spacing definitions
4. **Given** a Figma design system with border radius variables, **When** extraction runs, **Then** the output JSON includes all radius definitions
5. **Given** a Figma design system with shadow effects, **When** extraction runs, **Then** the output JSON includes all shadow definitions with their properties (offset, blur, spread, color)
6. **Given** a Figma design system with multiple variable categories, **When** extraction runs, **Then** the output JSON organizes tokens by category in a consistent structure
7. **Given** a Figma design system with nested/hierarchical naming (e.g., "color/primary/500"), **When** extraction runs, **Then** the output JSON preserves the hierarchical structure
8. **Given** input from a Figma URL (via MCP), **When** extraction completes, **Then** the resulting JSON structure matches the format of a directly downloaded Figma JSON file
9. **Given** a Figma design system with no design tokens defined, **When** extraction runs, **Then** the system produces an empty or minimal JSON structure and logs a warning

**Reference**: The expected JSON structure should match the format found in `./documentation/Soulix Design System-variables-full` (baseline format established during planning phase).

---

### User Story 3 - Transform Figma JSON to Tailwind 4 CSS Format (Priority: P1)

A developer has successfully extracted design tokens into a unified JSON structure. The command should transform this JSON into Tailwind 4-compatible CSS custom properties, following Tailwind 4's `@theme` directive conventions. This includes converting color formats to OKLCH, converting units (px to rem where appropriate), and generating proper CSS variable names that follow Tailwind's naming patterns.

**Why this priority**: The transformation phase is where the extracted data becomes useful. Without proper transformation to Tailwind 4 format, the extracted tokens cannot be used in a Tailwind project. This phase handles all format conversions, naming conventions, and CSS structure requirements.

**Independent Test**: Can be fully tested by providing a JSON structure with design tokens, running transformation, and verifying that the output CSS uses correct Tailwind 4 syntax, proper variable naming, correct color format (OKLCH), and appropriate unit conversions.

**Acceptance Scenarios**:

1. **Given** a JSON with color tokens in RGB/HSL/HEX format, **When** transformation runs, **Then** the output CSS contains `--color-*` variables with values in OKLCH format
2. **Given** a JSON with color tokens that have opacity/alpha values, **When** transformation runs, **Then** the output CSS preserves opacity in OKLCH format (e.g., `oklch(0.5 0.2 180 / 0.8)`)
3. **Given** a JSON with typography tokens including font sizes in pixels, **When** transformation runs, **Then** the output CSS contains `--text-*` variables with values converted to rem units
4. **Given** a JSON with typography tokens including font families, **When** transformation runs, **Then** the output CSS contains `--font-*` variables with font family names
5. **Given** a JSON with typography tokens including weights, line heights, and letter spacing, **When** transformation runs, **Then** the output CSS contains `--font-weight-*`, `--leading-*`, and `--tracking-*` variables
6. **Given** a JSON with spacing tokens in pixels, **When** transformation runs, **Then** the output CSS contains `--spacing-*` variables with values converted to rem units
7. **Given** a JSON with border radius tokens, **When** transformation runs, **Then** the output CSS contains `--radius-*` variables with appropriate units (px or %)
8. **Given** a JSON with shadow tokens, **When** transformation runs, **Then** the output CSS contains `--shadow-*` variables with proper CSS box-shadow syntax and OKLCH color format
9. **Given** a JSON with shadow tokens that have multiple layers, **When** transformation runs, **Then** the output CSS combines layers into comma-separated box-shadow values
10. **Given** a JSON with tokens that have nested/hierarchical names (e.g., "color/primary/500"), **When** transformation runs, **Then** the output CSS converts these to valid CSS variable names (e.g., `--color-primary-500`)
11. **Given** a JSON with tokens that have special characters or spaces in names, **When** transformation runs, **Then** the output CSS sanitizes names to valid CSS custom property names (replace spaces with hyphens, remove invalid characters)
12. **Given** a JSON with duplicate token names, **When** transformation runs, **Then** the system handles conflicts by appending a unique suffix and logs a warning

**Reference**: The target CSS format and Tailwind 4 conventions should follow patterns found in `./documentation/tailwindcss.txt` (established during planning phase) (This patterns are not strict if knowledge of tailwind is found, the only goal is functioning tailwind4 css).

---

### User Story 4 - Generate Tailwind 4 Theme CSS File (Priority: P1)

A developer has successfully transformed design tokens into Tailwind 4-compatible CSS. The command should generate a final CSS file named `figma-theme-variables.css` that contains all theme variables wrapped in a `@theme {}` directive, organized by category (colors, fonts, spacing, etc.), and formatted for direct import into a Tailwind 4 project.

**Why this priority**: The final output file is the deliverable that users will import into their projects. It must be properly formatted, valid CSS, and require no manual editing to work with Tailwind 4. This is the tangible result of the entire extraction and transformation process.

**Independent Test**: Can be fully tested by running the complete command, verifying the output file exists at the expected path, contains valid CSS with `@theme {}` structure, and can be imported into a Tailwind 4 project without errors.

**Acceptance Scenarios**:

1. **Given** successfully transformed CSS variables, **When** file generation runs, **Then** the system creates a file named `figma-theme-variables.css` in the project directory
2. **Given** successfully transformed CSS variables, **When** file generation runs, **Then** the output file contains a valid `@theme {}` directive wrapper
3. **Given** successfully transformed CSS variables, **When** file generation runs, **Then** the output file organizes variables by category (colors section, fonts section, spacing section, etc.)
4. **Given** successfully transformed CSS variables, **When** file generation runs, **Then** the output file contains valid CSS that can be parsed by standard CSS parsers
5. **Given** a generated `figma-theme-variables.css` file, **When** the file is imported into a Tailwind 4 project via `@import` directive, **Then** all theme variables are available to Tailwind utility classes
6. **Given** a generated `figma-theme-variables.css` file, **When** the file is imported into a Tailwind 4 project, **Then** no CSS syntax errors or warnings appear in the browser console
7. **Given** a generated `figma-theme-variables.css` file, **When** the file is imported into a Tailwind 4 project, **Then** Tailwind utility classes can reference the custom theme variables (e.g., `bg-primary-500` uses `--color-primary-500`)
8. **Given** the command runs multiple times with the same input, **When** file generation completes, **Then** the output file is overwritten with the new content
9. **Given** the output file location is not writable, **When** file generation attempts to write, **Then** the system displays a clear error message about permission issues
10. **Given** successfully generated file, **When** generation completes, **Then** the system logs the output file path, total token count, and tokens by category

---

### User Story 5 - Package Command for Distribution to Any Project (Priority: P1)

A developer has completed the command implementation and wants to make it available for use in any project. The command should be packaged as a Claude Code command file (`.claude/commands/t0t.extract-figma-theme.md`) along with any required utility scripts in a `.t0t-figma/` folder. For initial distribution, users will manually copy these files into their projects.

**Why this priority**: Without proper packaging and distribution, the command cannot be used outside this development project. The command must be self-contained and installable via simple file copying. This enables users to adopt the tool immediately while an automated npm-based installer can be developed in the future.

**Independent Test**: Can be fully tested by copying the generated command file and utilities folder into a fresh project, running the command, and verifying it works without any dependencies on the original development project.

**Acceptance Scenarios**:

1. **Given** the command implementation is complete, **When** the packaging phase runs, **Then** a command file is generated at `.claude/commands/t0t.extract-figma-theme.md`
2. **Given** the command requires utility scripts (color conversion, name sanitization, etc.), **When** packaging runs, **Then** all utilities are organized in `.t0t-figma/scripts/` folder
3. **Given** the command file references utility scripts, **When** the command executes, **Then** it correctly resolves paths to `.t0t-figma/scripts/` from the project root
4. **Given** a user copies `.claude/commands/t0t.extract-figma-theme.md` and `.t0t-figma/` to their project, **When** they run the command via Claude Code, **Then** the command executes successfully without requiring any other files
5. **Given** the command package includes dependencies (culori library), **When** a user runs the command, **Then** the system provides clear instructions for installing required npm packages
6. **Given** the `.t0t-figma/` folder structure, **When** users explore it, **Then** it follows the pattern: `.t0t-figma/scripts/`, `.t0t-figma/templates/` (for future use), `.t0t-figma/lib/` (for compiled utilities)
7. **Given** the command file format, **When** it executes, **Then** it follows Claude Code command conventions (markdown format, clear description, proper invocation syntax)
8. **Given** the command needs to reference documentation, **When** packaging runs, **Then** inline documentation is included in the command file explaining usage, inputs, and outputs
9. **Given** future updates to the command, **When** users want to upgrade, **Then** they can simply replace the `.claude/commands/` file and `.t0t-figma/` folder
10. **Given** the command execution, **When** errors occur, **Then** error messages clearly indicate if the issue is with missing dependencies, MCP configuration, or input validation

---

### Edge Cases

- What happens when a Figma URL points to a file without any design token definitions (e.g., just mockups or wireframes)?
- What happens when the Figma file is private and the MCP tool cannot access it even with proper configuration?
- What happens when Figma MCP is configured but returns incomplete or malformed data?
- What happens when a JSON file is provided but doesn't match the expected Figma variable format?
- What happens when the JSON file is extremely large (10+ MB with thousands of tokens)?
- What happens when token names in Figma contain special characters, emojis, or non-Latin scripts?
- How does the system handle color values in unusual color spaces or formats not easily converted to OKLCH?
- What happens when typography uses fonts not available as web fonts or system fonts?
- What happens when spacing values use inconsistent units across different tokens (some in px, some in rem, some in em)?
- What happens when shadow effects have extremely high blur values or negative offsets?
- What happens when Figma styles are organized in deeply nested folders (e.g., "brand/primary/light/100")?
- How does the system handle color names that conflict with Tailwind's default color names (e.g., a custom "blue")?
- What happens when the Figma file contains both local styles and linked library styles?
- What happens when variable scoping exists in Figma (different values for light/dark modes)?
- What happens when the output directory doesn't exist or is not writable?
- How does the system handle running the command multiple times (overwrite vs append vs version)?
- What happens when the user cancels/interrupts the command mid-execution?

## Requirements *(mandatory)*

### Functional Requirements

#### Input Handling Requirements (User Story 1)

- **FR-001**: Command MUST accept a Figma URL as an input parameter
- **FR-002**: Command MUST accept a JSON file path as an input parameter
- **FR-003**: Command MUST prioritize JSON file input if both URL and file path are provided
- **FR-004**: Command MUST validate that at least one input method (URL or file path) is provided
- **FR-005**: Command MUST validate that the JSON file exists and is readable before proceeding
- **FR-006**: Command MUST validate Figma URL format before attempting to use MCP
- **FR-007**: Command MUST verify that Figma MCP tool is active and functioning when URL input is used
- **FR-008**: Command MUST perform a test MCP operation to confirm functionality before proceeding with extraction
- **FR-009**: Command MUST halt execution and display clear error message if MCP validation fails
- **FR-010**: Command MUST provide instructions for fixing MCP configuration when validation fails
- **FR-011**: Command MUST display usage instructions when no valid input is provided

#### Extraction Requirements (User Story 2)

- **FR-012**: System MUST extract all design token categories in a single extraction phase
- **FR-013**: System MUST extract color variables from Figma design system
- **FR-014**: System MUST extract typography variables (font families, sizes, weights, line heights, letter spacing) from Figma design system
- **FR-015**: System MUST extract spacing variables from Figma design system
- **FR-016**: System MUST extract border radius variables from Figma design system
- **FR-017**: System MUST extract shadow effect variables from Figma design system
- **FR-018**: System MUST produce a unified JSON structure containing all extracted tokens
- **FR-019**: System MUST organize extracted tokens by category in the JSON structure
- **FR-020**: System MUST preserve hierarchical naming structures from Figma (e.g., "color/primary/500")
- **FR-021**: System MUST produce equivalent JSON structure whether input is from URL (MCP) or JSON file
- **FR-022**: System MUST handle Figma design systems with no tokens gracefully (produce minimal JSON, log warning)
- **FR-023**: System MUST validate that extracted JSON matches expected Figma variable format structure

#### Transformation Requirements (User Story 3)

- **FR-024**: System MUST convert all color values from any format (RGB, HSL, HEX) to OKLCH format (rationale: OKLCH provides perceptually uniform colors, better interpolation, and aligns with modern CSS standards supported by Tailwind 4)
- **FR-025**: System MUST preserve opacity/alpha values when converting colors to OKLCH
- **FR-026**: System MUST convert font sizes from pixels to rem units
- **FR-027**: System MUST convert spacing values from pixels to rem units
- **FR-028**: System MUST preserve border radius units (px or %) without conversion
- **FR-029**: System MUST convert shadow effects to CSS box-shadow syntax
- **FR-030**: System MUST convert shadow colors to OKLCH format
- **FR-031**: System MUST combine multiple shadow layers into comma-separated box-shadow values
- **FR-032**: System MUST generate CSS variable names following Tailwind 4 patterns: `--color-*`, `--font-*`, `--text-*`, `--font-weight-*`, `--leading-*`, `--tracking-*`, `--spacing-*`, `--radius-*`, `--shadow-*`
- **FR-033**: System MUST convert hierarchical token names to valid CSS variable names (e.g., "color/primary/500" → `--color-primary-500`)
- **FR-034**: System MUST sanitize token names to valid CSS custom property names (alphanumeric, hyphens, underscores only)
- **FR-035**: System MUST handle duplicate token names by appending unique suffix and logging warning
- **FR-036**: System MUST maintain color precision during conversion (no visible color changes)
- **FR-037**: System MUST log warnings when token names contain special characters that require sanitization
- **FR-038**: System MUST log warnings when fonts may not be web-safe

#### Output Generation Requirements (User Story 4)

- **FR-039**: System MUST generate output file named `figma-theme-variables.css`
- **FR-040**: System MUST wrap all CSS variables in a `@theme {}` directive
- **FR-041**: System MUST organize variables by category within the `@theme {}` block (colors, fonts, spacing, etc.)
- **FR-042**: System MUST generate valid CSS parseable by standard CSS parsers
- **FR-043**: System MUST generate CSS compatible with Tailwind 4 without modification
- **FR-044**: System MUST write output file to the project directory (or user-specified location)
- **FR-045**: System MUST overwrite existing output file if it exists
- **FR-046**: System MUST handle file write permission errors with clear error messages
- **FR-047**: System MUST validate output directory is writable before attempting to write
- **FR-048**: System MUST log output file path upon successful generation
- **FR-049**: System MUST log total token count and breakdown by category upon completion
- **FR-050**: System MUST ensure deterministic output: identical inputs produce identical output files

#### Command Packaging Requirements (User Story 5)

- **FR-051**: System MUST generate a command file at `.claude/commands/t0t.extract-figma-theme.md` following Claude Code command format
- **FR-052**: System MUST organize all utility scripts in `.t0t-figma/scripts/` folder
- **FR-053**: System MUST organize compiled libraries in `.t0t-figma/lib/` folder
- **FR-054**: System MUST create `.t0t-figma/templates/` folder for future template storage
- **FR-055**: Command file MUST include inline documentation explaining usage, inputs (URL vs JSON), and expected outputs
- **FR-056**: Command file MUST reference utility scripts using project-root-relative paths (e.g., `.t0t-figma/scripts/transform.js`)
- **FR-057**: System MUST bundle all transformation utilities (color conversion, name sanitization, unit conversion) as standalone scripts
- **FR-058**: System MUST include a dependency check in the command that verifies required npm packages (culori) are installed
- **FR-059**: Command MUST provide clear error messages if dependencies are missing, with installation instructions
- **FR-060**: System MUST ensure packaged command works when copied to any project directory structure
- **FR-061**: System MUST document the `.t0t-figma/` folder structure in a README file within that folder
- **FR-062**: Command file MUST follow markdown format with proper metadata (title, description, tags)
- **FR-063**: System MUST ensure all utility scripts are self-contained with no external dependencies beyond documented npm packages
- **FR-064**: System MUST include version information in both command file and utility scripts for upgrade tracking

### Key Entities

- **Input Source**: The origin of design system data. Attributes: type (URL or JSON file), value (URL string or file path), validation status, priority (JSON prioritized over URL).

- **Figma MCP Validator**: Component that checks MCP functionality. Attributes: validation status (pass/fail), error message, test operation result.

- **Design Token JSON**: Intermediate JSON structure containing all extracted tokens. Attributes: token categories (colors, typography, spacing, radius, shadows), hierarchical structure, total token count, source type (from URL or file).

- **Design Token**: A named design value from Figma. Attributes: category (color/typography/spacing/radius/shadow), name (hierarchical), value (original format), metadata.

- **CSS Variable**: Transformed design token in Tailwind 4 CSS format. Attributes: CSS variable name (e.g., `--color-primary-500`), value (transformed format like OKLCH or rem), category, source token reference.

- **Theme File**: The generated `figma-theme-variables.css` output file. Attributes: file path, total token count, tokens by category, generation timestamp, validation status (valid CSS).

- **Extraction Session**: A single execution of the `t0t.extract-figma-theme` command. Attributes: timestamp, input type (URL or JSON), input value, MCP validation result (if applicable), extraction success/failure, transformation success/failure, output file path, total tokens processed, warnings logged, errors encountered.

- **Command Package**: The distributable package for the command. Attributes: command file path (`.claude/commands/t0t.extract-figma-theme.md`), utilities folder path (`.t0t-figma/`), version number, required dependencies list, installation instructions, README content, folder structure (scripts/, lib/, templates/).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Command correctly handles input from Figma URL 100% of the time when MCP is working
- **SC-002**: Command correctly handles input from JSON file 100% of the time when file is valid
- **SC-003**: Command detects non-working MCP 100% of the time and halts execution with clear error
- **SC-004**: Command prioritizes JSON file input when both URL and file are provided 100% of the time
- **SC-005**: Extraction phase successfully captures 95% of all design tokens from Figma design system
- **SC-006**: Extraction from URL (via MCP) produces structurally equivalent JSON to direct JSON file input
- **SC-007**: Color conversion from any format to OKLCH maintains visual accuracy (no perceptible color shift)
- **SC-008**: Font size and spacing conversions from px to rem use correct conversion ratio (e.g., 16px = 1rem)
- **SC-009**: Generated `figma-theme-variables.css` contains zero CSS syntax errors when validated by CSS parser
- **SC-010**: Generated `figma-theme-variables.css` produces zero console errors when imported into Tailwind 4 project
- **SC-011**: Tailwind utility classes can reference custom theme variables 100% of the time (e.g., `bg-primary-500` uses `--color-primary-500`)
- **SC-012**: Command completes extraction and transformation for design system with 50-100 tokens in under 30 seconds
- **SC-013**: Command completes extraction and transformation for design system with up to 500 tokens in under 60 seconds
- **SC-014**: Running command twice with identical input produces byte-identical output files (deterministic behavior)
- **SC-015**: 90% of token name sanitization cases preserve semantic meaning (e.g., "Primary / 500" becomes `--color-primary-500`)
- **SC-016**: Error messages for input validation failures are clear enough that users can resolve 90% of issues without external help
- **SC-017**: Command package (`.claude/commands/` file + `.t0t-figma/` folder) can be copied to any project and works immediately after copying
- **SC-018**: Users can install the command by copying 2 items (1 file, 1 folder) with zero configuration needed
- **SC-019**: Command file documentation is clear enough that 90% of users can successfully run the command on first try without external help
- **SC-020**: Utility scripts in `.t0t-figma/` folder have zero dependencies beyond documented npm packages

## Assumptions

- Users have Claude Code installed and configured
- Users understand how to run Claude Code commands
- Users have either access to a Figma design system URL or can export JSON from Figma
- The Figma MCP tool is available as an installable/configurable component for Claude Code
- Figma design systems follow common naming conventions for variables
- The Figma variable export format (JSON) has a consistent structure across different Figma files
- A color conversion library or formula exists to convert RGB/HSL/HEX to OKLCH with acceptable precision
- Users have Tailwind CSS v4 installed in their projects
- The `@theme {}` directive syntax is stable in Tailwind 4 (based on current documentation)
- Generated theme files will be checked into version control alongside project files
- Users will manually handle web font setup (tool only extracts font family names)
- Most Figma design systems use consistent units within token categories
- Users will re-run the command manually when Figma design system is updated
- The tool does not need real-time synchronization with Figma
- Output file can be overwritten safely (no need for versioning or backups within the tool)
- Users have write permissions in the directory where output file is generated
- Users can manually copy files (command file and utilities folder) into their projects
- Claude Code supports custom commands via `.claude/commands/` directory
- Claude Code commands can reference and execute external scripts from project folders
- Users will install required npm dependencies (culori) manually when instructed

## Out of Scope for Phase 1

The following features are explicitly **not** included in Phase 1:

- **Iterative theme refinement**: Re-running extraction to merge with existing theme files (see `documentation/archived-for-the-future.md`)
- **Theme validation**: Validating generated theme files and reporting issues (archived)
- **Command dependency management**: Prerequisite checking for dependent commands (archived)
- **Component generation**: Generating UI components from Figma (Phase 2)
- **Prompt-based UI generation**: Generating UI from natural language (Phase 3)
- **Full page generation**: Extracting page designs from Figma (Phase 4)
- **Animation tokens**: Extracting animation timing and durations
- **Breakpoint tokens**: Extracting responsive breakpoint values
- **Custom naming schemes**: User-customizable variable naming patterns
- **Web font integration**: Automatically setting up web fonts
- **Real-time synchronization**: Auto-updating theme when Figma changes
- **Interactive CLI prompts**: Guided extraction with prompts
- **Theme merging**: Combining multiple Figma sources
- **Partial extraction**: Extracting specific token categories only
- **Token documentation**: Generating documentation for tokens
- **Visual theme preview**: HTML preview of extracted theme
- **Custom output location**: User-specified output directory/filename
- **Multiple output formats**: Generating SCSS, JSON, or other formats alongside CSS
- **Dark mode / theme variants**: Handling Figma variable scoping for different modes
- **Automated npm package distribution**: Publishing to npm registry (manual copy/paste is Phase 1 approach)
- **Interactive installation wizard**: Automated setup script (npx-based installer for future)
- **Automatic dependency installation**: Auto-installing npm packages (users install manually in Phase 1)
- **Command versioning and updates**: Automatic update checking and installation (manual file replacement in Phase 1)
- **Multi-project workspace support**: Installing command once for multiple projects (each project gets own copy in Phase 1)
