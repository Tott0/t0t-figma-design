# Implementation Plan: Figma Design Tokens to Tailwind 4 Theme Extraction

**Branch**: `001-figma-theme-extraction` | **Date**: 2025-11-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-figma-theme-extraction/spec.md`

## Summary

Build a Claude Code executable command (`t0t.extract-figma-theme`) that extracts design tokens from Figma design systems (via URL using MCP or JSON file) and transforms them into Tailwind 4-compatible CSS theme files. The command follows a four-phase workflow: (1) Input validation and MCP verification, (2) Unified extraction of all design tokens into intermediate JSON, (3) Transformation to Tailwind 4 CSS format with proper color conversion (OKLCH) and unit conversion (px to rem), and (4) Generation of `figma-theme-variables.css` with `@theme` directive structure.

## Technical Context

**Language/Version**: TypeScript 5.x (target: Node.js 18+)
**Primary Dependencies**:
- **Color conversion**: `culori` library for RGB/HSL/HEX to OKLCH conversion
- **JSON parsing**: Native `JSON.parse` with Zod for schema validation
- **File operations**: Node.js `fs/promises` API
- **MCP integration**: Claude Code MCP client (assumed available via Claude Code environment)

**Storage**: File system only (read JSON inputs, write CSS output)
**Testing**: Vitest for unit/integration tests, snapshot testing for CSS output
**Target Platform**: Node.js 18+ (CLI command executed via Claude Code)
**Project Type**: Single project (CLI command library)
**Performance Goals**:
- 50-100 tokens: <30 seconds end-to-end
- 500 tokens: <60 seconds end-to-end
- Deterministic output (byte-identical for identical inputs)

**Constraints**:
- OKLCH color conversion must maintain visual accuracy (no perceptible shifts)
- px-to-rem conversion uses 16px base (web standard)
- Generated CSS must pass standard CSS parser validation
- Zero console errors when imported into Tailwind 4 projects

**Scale/Scope**:
- Support design systems with 50-500 design tokens
- Handle 5 token categories: colors, typography, spacing, radius, shadows
- Process nested hierarchical naming (e.g., "color/primary/500")
- Handle special characters and sanitization

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Deterministic Output ✅
**Status**: PASS
- JSON input → CSS output transformation is purely functional
- No randomness or time-based generation
- Identical inputs produce byte-identical outputs (FR-050, SC-014)
- Color conversion algorithms are deterministic
- Name sanitization follows explicit rules

### Principle II: Specification-Driven Generation ✅
**Status**: PASS
- All CSS generation derived from Figma JSON structure
- No hallucination: missing tokens → empty/minimal JSON with warning (FR-022)
- Transformation rules explicitly defined (FR-024 to FR-038)
- Output format constrained by Tailwind 4 `@theme` directive spec
- No inference beyond explicit mapping rules

### Principle III: Test-First Development ✅
**Status**: PASS - TDD Required
- Unit tests: Color conversion, name sanitization, unit conversion
- Integration tests: End-to-end extraction workflow
- Contract tests: MCP integration, Figma JSON validation, CSS output validation
- Snapshot tests: Generated CSS structure and formatting
- Performance tests: Token processing throughput

### Principle IV: Code Quality Standards ✅
**Status**: PASS - Standards Enforced
- TypeScript strict mode enabled
- ESLint + Prettier configured
- Modular architecture (input → extract → transform → output)
- Single Responsibility: separate modules for each phase
- Type safety: Zod schemas for Figma JSON validation

### Principle V: User Experience Consistency ✅
**Status**: PASS - UX Guidelines Applied
- Clear error messages with actionable fixes (FR-009, FR-010, FR-046)
- Usage instructions when inputs invalid (FR-011)
- Structured logging: warnings for sanitization and non-web-safe fonts
- Consistent terminology: "design tokens", "theme variables", "extraction"
- Progressive disclosure: core command simple, advanced via optional parameters (future)

### Post-Design Constitution Re-Check
*To be performed after Phase 1 design completion*

## Project Structure

### Documentation (this feature)

```text
specs/001-figma-theme-extraction/
├── spec.md                          # Feature specification
├── plan.md                          # This file
├── research.md                      # Phase 0: Technology decisions and patterns
├── data-model.md                    # Phase 1: JSON schemas and transformations
├── quickstart.md                    # Phase 1: Developer onboarding guide
├── contracts/                       # Phase 1: Interface contracts
│   ├── figma-json-schema.json       # Expected Figma variable export format
│   ├── intermediate-json-schema.json # Unified extraction format
│   └── css-output-spec.md           # Tailwind 4 @theme directive structure
├── checklists/
│   └── requirements.md              # Specification quality validation
└── tasks.md                         # Phase 2: NOT created by /speckit.plan
```

### Source Code (repository root)

```text
src/
├── commands/
│   └── extract-figma-theme.ts       # Main CLI command entry point
├── input/
│   ├── input-validator.ts           # Validates URL vs JSON file inputs
│   ├── mcp-validator.ts             # Tests Figma MCP functionality
│   ├── json-file-loader.ts          # Loads and validates JSON files
│   └── figma-mcp-client.ts          # Fetches design system via MCP
├── extraction/
│   ├── token-extractor.ts           # Unified extraction coordinator
│   ├── color-extractor.ts           # Extracts color variables
│   ├── typography-extractor.ts      # Extracts font/text variables
│   ├── spacing-extractor.ts         # Extracts spacing variables
│   ├── radius-extractor.ts          # Extracts border radius variables
│   ├── shadow-extractor.ts          # Extracts shadow effect variables
│   └── schemas/
│       └── figma-variable.schema.ts # Zod schemas for Figma JSON
├── transformation/
│   ├── token-transformer.ts         # Transformation coordinator
│   ├── color-converter.ts           # RGB/HSL/HEX → OKLCH conversion
│   ├── unit-converter.ts            # px → rem conversion (16px base)
│   ├── name-sanitizer.ts            # Token name → CSS variable name
│   ├── css-formatter.ts             # Formats CSS with proper structure
│   └── tailwind-mapper.ts           # Maps tokens to Tailwind namespaces
├── output/
│   ├── theme-generator.ts           # Generates @theme directive structure
│   ├── category-organizer.ts        # Organizes variables by category
│   ├── file-writer.ts               # Writes CSS file with validation
│   └── logger.ts                    # Structured logging (warnings, errors)
├── types/
│   ├── figma-types.ts               # Figma JSON structure types
│   ├── token-types.ts               # Design token intermediate types
│   └── css-types.ts                 # CSS variable types
└── utils/
    ├── validation.ts                # Common validation utilities
    └── constants.ts                 # Constants (base font size, etc.)

tests/
├── unit/
│   ├── input/                       # Input validation tests
│   ├── extraction/                  # Token extraction tests
│   ├── transformation/              # Transformation logic tests
│   └── output/                      # Output generation tests
├── integration/
│   ├── end-to-end.test.ts           # Full workflow tests
│   ├── mcp-integration.test.ts      # MCP client tests
│   └── file-operations.test.ts      # File I/O tests
├── contract/
│   ├── figma-json.test.ts           # Figma JSON schema contract
│   ├── css-output.test.ts           # CSS output contract
│   └── mcp-api.test.ts              # MCP API contract
├── snapshots/
│   ├── __snapshots__/               # CSS output snapshots
│   └── fixtures/                    # Test fixture files
│       ├── figma-design-systems/    # Sample Figma JSON exports
│       └── expected-outputs/        # Expected CSS outputs
└── performance/
    └── throughput.test.ts           # Performance benchmarks
```

**Structure Decision**: Single project structure chosen because this is a CLI command library without separate frontend/backend concerns. The modular architecture follows the four-phase workflow (Input → Extract → Transform → Output) with clear separation of concerns. TypeScript provides type safety across all modules, and the structure supports the TDD workflow with comprehensive test organization.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations - all constitution principles are satisfied by the proposed architecture.*

## Phase 0: Research & Technology Decisions

### Research Tasks

1. **Figma JSON Variable Format Analysis**
   - **Input**: `./documentation/Soulix Design System-variables-full.json`
   - **Goal**: Document the structure of Figma variable exports
   - **Output**: JSON schema capturing:
     - Collection structure (`collections`, `modes`, `variables`)
     - Variable types (`COLOR`, `FLOAT`, `STRING`, etc.)
     - Value formats (direct values vs `VARIABLE_ALIAS`)
     - Hierarchical naming patterns (e.g., "Backgrounds/Principal")
     - Metadata fields (`id`, `name`, `description`, `resolvedType`)

2. **Tailwind 4 Theme Format Analysis**
   - **Input**: `./documentation/tailwindcss.txt`
   - **Goal**: Document Tailwind 4 `@theme` directive structure and conventions
   - **Output**: CSS structure specification capturing:
     - `@theme {}` directive syntax and rules
     - Theme variable namespaces (`--color-*`, `--font-*`, `--text-*`, `--spacing-*`, `--radius-*`, `--shadow-*`)
     - Naming conventions (kebab-case, no special characters)
     - Color format (OKLCH with optional alpha)
     - Unit expectations (rem for spacing/text, px/% for radius)
     - Variable organization patterns (by category)

3. **Color Conversion Library Evaluation**
   - **Goal**: Select library for RGB/HSL/HEX → OKLCH conversion
   - **Options**: `culori`, `colorjs.io`, custom implementation
   - **Decision Criteria**: Accuracy, performance, TypeScript support, bundle size
   - **Expected Choice**: `culori` (comprehensive color space support, TypeScript types, well-maintained)

4. **MCP Integration Pattern Research**
   - **Goal**: Understand how to interact with Figma MCP from Claude Code command
   - **Output**: Integration pattern for:
     - Testing MCP availability
     - Fetching Figma file data
     - Error handling for MCP failures
     - Fallback strategies

5. **Transformation Rule Definitions**
   - **Goal**: Define explicit mapping rules from Figma tokens to Tailwind variables
   - **Output**: Transformation specification:
     - **Color mapping**: Figma `resolvedType: COLOR` → `--color-{name}` in OKLCH
     - **Typography mapping**:
       - Font families → `--font-{name}`
       - Font sizes (px) → `--text-{name}` (rem)
       - Font weights → `--font-weight-{name}` (numeric)
       - Line heights → `--leading-{name}`
       - Letter spacing → `--tracking-{name}`
     - **Spacing mapping**: Figma spacing (px) → `--spacing-{name}` (rem)
     - **Radius mapping**: Figma radius → `--radius-{name}` (preserve units)
     - **Shadow mapping**: Figma effects → `--shadow-{name}` (box-shadow syntax)
     - **Name sanitization rules**:
       - Replace `/` with `-` (e.g., "color/primary/500" → "color-primary-500")
       - Replace spaces with `-`
       - Remove special characters (keep alphanumeric, hyphens, underscores)
       - Convert to lowercase
       - Handle duplicates (append `-2`, `-3`, etc.)

### Research Deliverable: research.md

Structure:
```markdown
# Research: Figma to Tailwind 4 Transformation

## Figma JSON Variable Format

### Structure Overview
[Document collections, modes, variables structure from Soulix example]

### Variable Types
[Document each resolvedType and value format]

### Hierarchical Naming
[Document naming patterns and hierarchy]

## Tailwind 4 Theme Format

### @theme Directive
[Document syntax and rules]

### Theme Variable Namespaces
[Document each namespace with examples]

### Naming Conventions
[Document CSS variable naming rules]

## Color Conversion

### Library Decision: culori
**Rationale**: [Justify choice]
**Usage Pattern**: [Code example for RGB/HSL/HEX → OKLCH]
**Precision Handling**: [Document precision requirements]

## MCP Integration Pattern

### Availability Check
[Document test operation pattern]

### Data Fetching
[Document Figma file fetch pattern]

### Error Handling
[Document error scenarios and responses]

## Transformation Rules

### Figma Token → Tailwind Variable Mapping
[Document detailed mapping for each token category]

### Name Sanitization
[Document sanitization algorithm with examples]

### Unit Conversion
[Document px-to-rem conversion (16px base)]
[Document when to preserve units (radius)]

## Alternatives Considered

### Color Conversion
- **Rejected**: colorjs.io (larger bundle, complex API)
- **Rejected**: Custom implementation (reinventing wheel, accuracy risk)

### JSON Parsing
- **Chosen**: Native JSON.parse + Zod validation
- **Rejected**: Custom parser (unnecessary complexity)
```

## Phase 1: Design & Contracts

### Data Model: data-model.md

```markdown
# Data Model: Figma Design Token Extraction

## Input Models

### Input Source
```typescript
type InputSource = {
  type: 'url' | 'json-file';
  value: string;              // URL string or file path
  validationStatus: 'pending' | 'valid' | 'invalid';
  priority: number;           // JSON file = 1, URL = 2 (lower = higher priority)
};
```

### Figma Variable (from JSON export)
```typescript
type FigmaVariable = {
  id: string;
  name: string;              // e.g., "Backgrounds/Principal"
  description: string;
  key: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, FigmaValue>;
  scopes: string[];
  variableCollectionId: string;
};

type FigmaValue =
  | { type: 'VARIABLE_ALIAS'; id: string }
  | { r: number; g: number; b: number; a: number }  // COLOR
  | number                                           // FLOAT
  | string                                           // STRING
  | boolean;                                         // BOOLEAN
```

## Intermediate Models

### Design Token (unified extraction format)
```typescript
type DesignToken = {
  id: string;
  category: 'color' | 'typography' | 'spacing' | 'radius' | 'shadow';
  name: string;              // hierarchical, e.g., "Backgrounds/Principal"
  value: TokenValue;
  metadata: {
    source: 'figma-url' | 'figma-json';
    figmaId: string;
    description?: string;
  };
};

type TokenValue =
  | ColorValue
  | TypographyValue
  | NumericValue
  | ShadowValue;

type ColorValue = {
  type: 'color';
  format: 'rgb' | 'hsl' | 'hex';
  r?: number; g?: number; b?: number;  // RGB
  h?: number; s?: number; l?: number;  // HSL
  hex?: string;                        // HEX
  alpha?: number;
};

type TypographyValue = {
  type: 'typography';
  fontFamily?: string;
  fontSize?: number;        // pixels
  fontWeight?: number;      // numeric (400, 700, etc.)
  lineHeight?: number;      // unitless multiplier
  letterSpacing?: number;   // pixels or em
};

type NumericValue = {
  type: 'numeric';
  value: number;
  unit: 'px' | 'rem' | 'em' | '%';
};

type ShadowValue = {
  type: 'shadow';
  layers: Array<{
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    color: ColorValue;
    inset?: boolean;
  }>;
};
```

## Output Models

### CSS Variable
```typescript
type CSSVariable = {
  name: string;              // e.g., "--color-backgrounds-principal"
  value: string;             // e.g., "oklch(0.99 0 0)"
  category: 'color' | 'font' | 'text' | 'font-weight' | 'leading' | 'tracking' | 'spacing' | 'radius' | 'shadow';
  sourceToken: string;       // reference to original DesignToken.id
};
```

### Theme File
```typescript
type ThemeFile = {
  filePath: string;
  variables: CSSVariable[];
  metadata: {
    generatedAt: Date;
    sourceType: 'figma-url' | 'figma-json';
    source: string;
    tokenCount: Record<string, number>;  // count by category
  };
  content: string;          // Final CSS text with @theme directive
};
```

## Transformation Pipeline

```
Figma JSON
    ↓
[Extraction Phase]
    ↓
Design Tokens (intermediate format)
    ↓
[Transformation Phase]
    ↓
CSS Variables
    ↓
[Output Phase]
    ↓
Theme File (figma-theme-variables.css)
```

## Validation Rules

### Figma JSON Validation
- MUST have `collections` array
- Each collection MUST have `variables` array
- Each variable MUST have `id`, `name`, `resolvedType`, `valuesByMode`
- Color values MUST have `r`, `g`, `b` (alpha optional)

### CSS Variable Validation
- Name MUST match pattern: `^--[a-z0-9]+(-[a-z0-9]+)*$`
- Name MUST start with category prefix (`--color-`, `--font-`, etc.)
- Value MUST be valid CSS value for its category
- No duplicate names within same category

### Theme File Validation
- MUST start with `@theme {`
- MUST end with `}`
- Variables MUST be organized by category
- Each variable line MUST match format: `  --{name}: {value};`
- Generated CSS MUST parse without errors
```

### Contracts: contracts/

#### contracts/figma-json-schema.json
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Figma Variable Export Format",
  "description": "Schema for Figma design system variable exports used as input",
  "type": "object",
  "required": ["schemaVersion", "collections"],
  "properties": {
    "schemaVersion": {
      "type": "number",
      "description": "Figma export format version"
    },
    "lastModified": {
      "type": "string",
      "format": "date-time"
    },
    "collections": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "modes", "variables"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "modes": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["name", "modeId"],
              "properties": {
                "name": { "type": "string" },
                "modeId": { "type": "string" }
              }
            }
          },
          "variables": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "name", "resolvedType", "valuesByMode"],
              "properties": {
                "id": { "type": "string" },
                "name": { "type": "string" },
                "description": { "type": "string" },
                "resolvedType": {
                  "type": "string",
                  "enum": ["COLOR", "FLOAT", "STRING", "BOOLEAN"]
                },
                "valuesByMode": {
                  "type": "object",
                  "additionalProperties": true
                }
              }
            }
          }
        }
      }
    }
  }
}
```

#### contracts/css-output-spec.md
```markdown
# CSS Output Specification: Tailwind 4 Theme File

## File Structure

```css
@theme {
  /* Colors */
  --color-{category}-{name}: {oklch-value};

  /* Typography */
  --font-{name}: {font-family-value};
  --text-{name}: {rem-value};
  --font-weight-{name}: {numeric-value};
  --leading-{name}: {unitless-value};
  --tracking-{name}: {em-value};

  /* Spacing */
  --spacing-{name}: {rem-value};

  /* Border Radius */
  --radius-{name}: {px-or-percent-value};

  /* Shadows */
  --shadow-{name}: {box-shadow-value};
}
```

## Value Formats

### Colors (OKLCH)
- Format: `oklch({L} {C} {H})` or `oklch({L} {C} {H} / {alpha})`
- L (lightness): 0-1 (decimal)
- C (chroma): 0-0.4 typically (decimal)
- H (hue): 0-360 (degrees)
- alpha: 0-1 (decimal, optional)
- Example: `oklch(0.72 0.11 178)`
- Example with alpha: `oklch(0.72 0.11 178 / 0.8)`

### Font Sizes (rem)
- Format: `{value}rem`
- Conversion: px / 16 = rem
- Example: `1.5rem` (24px)

### Spacing (rem)
- Format: `{value}rem`
- Conversion: px / 16 = rem
- Example: `2rem` (32px)

### Font Weights (numeric)
- Format: `{numeric-value}`
- Common values: 100, 200, 300, 400, 500, 600, 700, 800, 900
- Example: `700`

### Line Heights (unitless)
- Format: `{decimal-value}`
- Example: `1.5`

### Letter Spacing (em)
- Format: `{value}em`
- Example: `0.05em`

### Border Radius (px or %)
- Format: `{value}px` or `{value}%`
- Example: `8px` or `50%`

### Box Shadows
- Format: `{offsetX} {offsetY} {blur} {spread} {color}`
- Multiple layers: comma-separated
- Example: `0 1px 3px 0 oklch(0 0 0 / 0.1), 0 1px 2px 0 oklch(0 0 0 / 0.06)`

## Naming Conventions

### General Rules
- Lowercase only
- Alphanumeric characters plus hyphens and underscores
- No spaces or special characters (except `-` and `_`)
- Must start with category prefix

### Category Prefixes
- Colors: `--color-`
- Fonts: `--font-`
- Text sizes: `--text-`
- Font weights: `--font-weight-`
- Line heights: `--leading-`
- Letter spacing: `--tracking-`
- Spacing: `--spacing-`
- Border radius: `--radius-`
- Shadows: `--shadow-`

### Hierarchical Names
- Figma: `"Backgrounds/Principal"` → CSS: `--color-backgrounds-principal`
- Figma: `"color/primary/500"` → CSS: `--color-primary-500`
- Replace `/` with `-`
- Replace spaces with `-`
- Normalize to lowercase

## Organization

Variables are organized by category in this order:
1. Colors
2. Fonts
3. Text sizes
4. Font weights
5. Line heights
6. Letter spacing
7. Spacing
8. Border radius
9. Shadows

Within each category, variables are sorted alphabetically.

## Validation Rules

1. File MUST start with `@theme {`
2. File MUST end with `}`
3. Each variable MUST be on its own line
4. Each variable MUST follow format: `  {name}: {value};` (2-space indent)
5. No empty lines within `@theme {}` block (except between categories)
6. No trailing whitespace
7. File MUST end with newline
8. Generated CSS MUST be parseable by standard CSS parsers
9. No duplicate variable names

## Example Output

```css
@theme {
  /* Colors */
  --color-backgrounds-principal: oklch(0.99 0 0);
  --color-backgrounds-secondary: oklch(0.98 0.04 113.22);
  --color-primary-500: oklch(0.84 0.18 117.33);

  /* Fonts */
  --font-sans: ui-sans-serif, system-ui, sans-serif;
  --font-display: "Satoshi", sans-serif;

  /* Text sizes */
  --text-xs: 0.75rem;
  --text-base: 1rem;
  --text-xl: 1.25rem;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-4: 1rem;
  --spacing-8: 2rem;

  /* Border radius */
  --radius-sm: 4px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.1);
}
```
```

### Quickstart: quickstart.md

```markdown
# Quickstart: Figma to Tailwind 4 Theme Extraction

## Prerequisites

- Node.js 18+
- Claude Code installed and configured
- Figma MCP tool installed (for URL-based extraction)
- Access to Figma design system (URL or exported JSON)

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Usage

### Extract from Figma URL (requires MCP)

```bash
# Command will validate MCP is working before proceeding
t0t.extract-figma-theme --url "https://figma.com/file/ABC123/Design-System"
```

### Extract from JSON File

```bash
# Download JSON from Figma: File → Export → Variables
t0t.extract-figma-theme --json "./design-system-variables.json"
```

### Priority: JSON over URL

```bash
# If both provided, JSON file takes priority
t0t.extract-figma-theme --url "..." --json "./variables.json"
# ^ Uses JSON file, ignores URL
```

## Output

Generated file: `figma-theme-variables.css`

```css
@theme {
  --color-primary-500: oklch(0.84 0.18 117.33);
  --font-sans: ui-sans-serif, system-ui, sans-serif;
  --text-base: 1rem;
  --spacing-4: 1rem;
  /* ... */
}
```

## Import into Tailwind 4 Project

```css
/* app.css */
@import "tailwindcss";
@import "./figma-theme-variables.css";
```

Now use extracted tokens in your HTML:

```html
<div class="bg-primary-500 text-base p-4">
  <!-- Uses your Figma design tokens -->
</div>
```

## Development Workflow

### 1. Write failing test

```typescript
// tests/unit/transformation/color-converter.test.ts
it('converts RGB to OKLCH', () => {
  const result = convertToOKLCH({ r: 255, g: 0, b: 0 });
  expect(result).toBe('oklch(0.63 0.26 29.23)');
});
```

### 2. Implement feature

```typescript
// src/transformation/color-converter.ts
export function convertToOKLCH(rgb: RGB): string {
  // Implementation using culori
}
```

### 3. Run tests

```bash
npm test
npm run test:watch  # Watch mode during development
```

### 4. Snapshot testing for CSS output

```typescript
// tests/integration/end-to-end.test.ts
it('generates valid Tailwind 4 theme CSS', async () => {
  const input = await loadFixture('minimal-design-system.json');
  const output = await extractFigmaTheme(input);
  expect(output).toMatchSnapshot();
});
```

## Architecture Overview

```
Input Phase
  ↓ Validate inputs (URL or JSON)
  ↓ Test MCP if using URL
  ↓ Load Figma data
  ↓
Extraction Phase
  ↓ Parse Figma JSON
  ↓ Extract all token categories
  ↓ Create intermediate JSON
  ↓
Transformation Phase
  ↓ Convert colors to OKLCH
  ↓ Convert units (px → rem)
  ↓ Sanitize names
  ↓ Map to Tailwind namespaces
  ↓
Output Phase
  ↓ Generate @theme structure
  ↓ Organize by category
  ↓ Write figma-theme-variables.css
  ↓ Log summary
```

## Troubleshooting

### MCP validation fails

```
Error: Figma MCP is not active or responding.

Solution:
1. Check Claude Code MCP configuration
2. Restart Claude Code
3. Or use JSON file instead: --json "./variables.json"
```

### Invalid color conversion

```
Warning: Color "custom-blue" could not be converted to OKLCH.
Using fallback: oklch(0.5 0 0)
```

Check Figma color format is RGB/HSL/HEX.

### CSS parse errors

Run validation:
```bash
npm run validate:css figma-theme-variables.css
```

## Testing Strategy

- **Unit tests**: Each transformation function in isolation
- **Integration tests**: Full extraction workflow
- **Contract tests**: Figma JSON schema, CSS output format
- **Snapshot tests**: CSS structure and formatting
- **Performance tests**: Token processing throughput

Run specific test suites:
```bash
npm test -- unit
npm test -- integration
npm test -- contract
npm test -- performance
```

## Next Steps

1. Review generated CSS: `cat figma-theme-variables.css`
2. Import into your Tailwind project
3. Test utility classes in your HTML
4. Re-run extraction when Figma updates: just run command again

## Common Patterns

### Handling nested token names

Figma: `"Backgrounds/Principal"` → CSS: `--color-backgrounds-principal`

### Multiple shadow layers

Figma multiple shadows → CSS: comma-separated box-shadow values

### Color with transparency

Figma opacity → OKLCH alpha channel: `oklch(L C H / alpha)`

### Font size conversion

Figma 24px → CSS `1.5rem` (24 / 16)
```

## Agent Context Update

After Phase 1 design artifacts are generated, update Claude Code's agent context:

```bash
.specify/scripts/bash/update-agent-context.sh claude
```

This will add the following to `.claude/CLAUDE.md`:
- Technology stack: TypeScript, Vitest, culori
- Project structure: source organization
- Testing approach: TDD workflow
- Key patterns: Figma JSON → Intermediate → Tailwind CSS

## Post-Phase 1 Constitution Re-Check

*Execute after data-model.md, contracts/, and quickstart.md are generated*

### Principle I: Deterministic Output
- ✅ CONFIRMED: Transformation pipeline is pure functional
- ✅ CONFIRMED: No randomness in color conversion or name sanitization
- ✅ CONFIRMED: Snapshot tests ensure byte-identical output

### Principle II: Specification-Driven Generation
- ✅ CONFIRMED: All transformations derived from Figma JSON schema
- ✅ CONFIRMED: No hallucination: missing data → empty JSON + warning
- ✅ CONFIRMED: Transformation rules explicit in data-model.md

### Principle III: Test-First Development
- ✅ CONFIRMED: Test structure defined in project layout
- ✅ CONFIRMED: TDD workflow documented in quickstart.md
- ✅ CONFIRMED: Contract tests defined for all interfaces

### Principle IV: Code Quality Standards
- ✅ CONFIRMED: TypeScript strict mode enforced
- ✅ CONFIRMED: Modular architecture with single responsibility
- ✅ CONFIRMED: Type safety via Zod schemas

### Principle V: User Experience Consistency
- ✅ CONFIRMED: Error messages documented in contracts
- ✅ CONFIRMED: Logging strategy defined
- ✅ CONFIRMED: Clear terminology established

**Final Gate Status**: ✅ PASS - Ready for Phase 2 (Task Generation)

## Next Command

```bash
/speckit.tasks
```

This will generate the actionable, dependency-ordered tasks in `tasks.md` based on this implementation plan.
