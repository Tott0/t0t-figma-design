# Research Report: Figma Design Tokens to Tailwind 4 Theme Extraction

**Date**: 2025-11-06
**Feature**: 001-figma-theme-extraction
**Status**: Phase 0 Complete

## Purpose

This document resolves all "NEEDS CLARIFICATION" items from the Technical Context and establishes technology decisions, best practices, and implementation patterns for the Figma to Tailwind 4 theme extraction tool.

---

## 1. Node.js Version Requirements

### Decision: Node.js 20.x minimum, 24.x recommended

**Rationale:**
- Node.js 20.x: Active LTS until mid-2026, provides stable ES2023+ features
- Node.js 22.x: Current Active LTS (October 2024), excellent modern feature support
- Node.js 24.x: Latest LTS (October 2025), includes native TypeScript support

**Why 20+**: Node.js 18.x reaches end-of-life April 30, 2025. Version 20+ includes stable ES2023+ features (Array.fromAsync(), Set methods, iterator helpers).

**Alternatives considered:**
- Node.js 18.x: Rejected due to imminent EOL
- Node.js 16.x: Rejected due to already EOL

---

## 2. Testing Framework Selection

### Decision: Vitest 3+

**Rationale:**
- **Performance**: Cold runs up to 4x faster than Jest, 30% lower memory usage
- **Modern**: Built-in ES module, TypeScript, and JSX support
- **CLI-friendly**: Watch mode by default in development (good for CLI iteration)
- **Compatible**: Jest-compatible API makes migration straightforward if needed
- **Parallel**: Multi-threading via Tinypool for faster test execution

**Alternatives considered:**
- Jest: Most established ecosystem, but slower and more memory-intensive
- Node's built-in test runner: Too minimal for comprehensive testing needs

**Configuration Note**: For CI/CD pipelines, use `vitest run --no-watch` to prevent hanging in non-interactive environments.

---

## 3. Language Choice: TypeScript vs JavaScript

### Decision: TypeScript with strict mode

**Rationale:**
- **Type safety**: Compile-time checking catches errors before execution (critical for deterministic tools)
- **Reliability**: Ensures consistent input/output validation across environments
- **IDE support**: Better autocomplete and refactoring for CLI option definitions
- **Constitution alignment**: Supports Principle I (Deterministic Output) and Principle IV (Code Quality)

**Implementation approach:**
- Use TypeScript with `tsx` or `esbuild` for compilation
- Enable strict mode in tsconfig.json
- Node.js 24+ native stripping is convenient but traditional compilation is more reliable for production

**Alternatives considered:**
- JavaScript only: Rejected due to lack of type safety
- Node.js 24 native TypeScript stripping: Convenient but limited (no decorators, JSX, path aliases)

---

## 4. Primary Dependencies

### Confirmed Dependencies:

1. **culori** (v4+): Color conversion library
   - Purpose: RGB/HSL/HEX to OKLCH conversion
   - Why: Excellent precision, maintains visual accuracy, supports alpha preservation

2. **Figma MCP tool**: Claude Code integration for Figma API access
   - Purpose: Fetch design system data from Figma URLs
   - Note: Optional if user provides JSON file directly

3. **stream-json**: Large JSON file handling
   - Purpose: Stream-based processing for 10+ MB JSON files
   - Why: Reduces memory usage by 60-80% compared to JSON.parse()

4. **zod**: JSON validation and schema enforcement
   - Purpose: Validate Figma JSON format and command inputs
   - Why: Best TypeScript integration, zero dependencies, intuitive API

5. **tsx** or **esbuild**: TypeScript compilation
   - Purpose: Compile TypeScript to JavaScript for execution
   - Why: Reliable production compilation

---

## 5. Large JSON File Handling (10+ MB)

### Decision: Stream-based processing with stream-json

**Strategy:**
```javascript
const StreamArray = require('stream-json/streamers/StreamArray');
const fs = require('fs');

const jsonStream = StreamArray.withParser();
fs.createReadStream('large-file.json')
  .pipe(jsonStream.input);

jsonStream.on('data', ({key, value}) => {
  // Process each object without loading entire file into memory
});
```

**Key benefits:**
- Constant memory footprint regardless of file size
- Avoids out-of-memory crashes with large files
- Process data piece-by-piece

**Maximum supported token count**: Unlimited (stream-based approach scales with file size)

**Maximum JSON file size**: Practically unlimited (limited only by disk space, not RAM)

**Alternatives considered:**
- JSON.parse(): Rejected due to memory issues with large files
- big-json: Alternative but stream-json has better ecosystem support

---

## 6. OKLCH Color Conversion Best Practices

### Implementation Pattern:

```javascript
import { oklch, parse, formatCss, displayable, clampChroma } from 'culori';

function convertToOKLCH(colorValue, alpha = 1) {
  // Step 1: Parse input color (RGB, HSL, or HEX)
  let color = parse(colorValue);

  // Step 2: Preserve alpha if provided
  if (alpha < 1) {
    color = { ...color, alpha };
  }

  // Step 3: Convert to OKLCH
  let oklchColor = oklch(color);

  // Step 4: Handle out-of-gamut colors
  if (!displayable(oklchColor)) {
    oklchColor = clampChroma(oklchColor, 'oklch');
  }

  // Step 5: Format as CSS string
  return formatCss(oklchColor); // e.g., "oklch(0.5 0.2 180 / 0.8)"
}
```

**Key considerations:**
- **Precision**: OKLCH channels are Lightness (0-1), Chroma (0-~0.4), Hue (0-360°)
- **Alpha preservation**: Culori automatically maintains alpha throughout conversion
- **Gamut mapping**: Use `displayable()` and `clampChroma()` for out-of-gamut colors
- **Visual accuracy**: Color difference can be measured with deltaE2000 if needed

**Figma RGB format:**
- Figma uses normalized float values (0-1, not 0-255)
- Always includes alpha channel (a)
- Example: `{r: 0.91, g: 0.91, b: 0.93, a: 1}` = RGB(232, 232, 237)

**Conversion formula:**
```javascript
function figmaRgbToOKLCH(figmaColor) {
  const { r, g, b, a } = figmaColor;
  const rgbString = `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
  return convertToOKLCH(rgbString, a);
}
```

---

## 7. Figma Variable JSON Format Analysis

### Structure Overview:

```
{
  schemaVersion: 1,
  lastModified: "ISO timestamp",
  collections: [
    {
      id: "VariableCollectionId:fileId:nodeId",
      name: "Collection name",
      modes: [ { name: "Light", modeId: "..." }, ... ],
      variables: [ { /* variable objects */ } ]
    }
  ]
}
```

### Variable Types by resolvedType:

1. **COLOR** (direct RGB values):
   ```json
   {
     "resolvedType": "COLOR",
     "valuesByMode": {
       "modeId": { "r": 0.91, "g": 0.91, "b": 0.93, "a": 1 }
     }
   }
   ```

2. **COLOR** (alias references):
   ```json
   {
     "resolvedType": "COLOR",
     "valuesByMode": {
       "modeId": { "type": "VARIABLE_ALIAS", "id": "VariableID:..." }
     }
   }
   ```

3. **FLOAT** (spacing, border radius):
   ```json
   {
     "resolvedType": "FLOAT",
     "valuesByMode": { "modeId": 16 }
   }
   ```

4. **STRING** (font families):
   ```json
   {
     "resolvedType": "STRING",
     "valuesByMode": { "modeId": "Satoshi Variable" }
   }
   ```

### Hierarchical Naming:

- Format: `Category/Subcategory/Value` (e.g., "Primary/Midnight Indigo/100")
- Split on `/` to extract hierarchy
- Names can include Unicode symbols (☽, ☉, 𖤓)

### Variable Alias Resolution:

When `type: "VARIABLE_ALIAS"`:
1. Extract target variable ID from `id` field
2. Find variable with matching `id` in the collections
3. Recursively resolve if target is also an alias
4. Return final primitive value (RGB, FLOAT, or STRING)

### Modes Handling:

- Collections can have multiple modes (Light, Dark, etc.)
- Each variable has `valuesByMode` object with modeId keys
- **Phase 1 Decision**: Extract first mode only (typically Light mode)
- **Phase 1 Out of Scope**: Multi-mode support (see spec.md line 327)

### Key Fields to Extract:

| Token Type | Extract | Transform To |
|-----------|---------|--------------|
| COLOR (RGB) | r, g, b, a | OKLCH CSS variable |
| COLOR (alias) | Resolve to RGB first | OKLCH CSS variable |
| FLOAT (spacing) | Numeric value | rem (divide by 16) |
| FLOAT (radius) | Numeric value | px (as-is) |
| STRING (font) | String value | font-family value |

---

## 8. Tailwind 4 Theme Format Reference

Based on `documentation/tailwindcss.txt`, the target format is:

```css
@theme {
  /* Colors */
  --color-primary-100: oklch(0.99 0 0);
  --color-primary-500: oklch(0.84 0.18 117.33);

  /* Typography */
  --font-display: "Satoshi", "sans-serif";
  --text-sm: 0.875rem;
  --leading-tight: 1.25;

  /* Spacing */
  --spacing-4: 1rem;
  --spacing-8: 2rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
}
```

**Key conventions:**
- All variables prefixed with `--`
- Categories: `color-*`, `font-*`, `text-*`, `leading-*`, `spacing-*`, `radius-*`, `shadow-*`
- Hierarchical names converted: "Primary/500" → `--color-primary-500`
- Colors always in OKLCH format
- Font sizes and spacing in rem
- Border radius in rem or px (preserve Figma units)

**Important note from user input**: These patterns are guidelines, not strict rules. The goal is functioning Tailwind 4 CSS, so adapt as needed based on actual Tailwind knowledge.

---

## 9. Token Name Sanitization Rules

### CSS Custom Property Requirements:

1. Must start with `--`
2. Can contain: alphanumeric, hyphens, underscores
3. Cannot contain: spaces, special characters (except - and _)
4. Case-sensitive but conventionally lowercase

### Transformation Rules:

```javascript
function sanitizeTokenName(figmaName) {
  return figmaName
    .toLowerCase()                    // "Primary" → "primary"
    .replace(/\s+/g, '-')            // "Space 04" → "space-04"
    .replace(/\//g, '-')             // "Primary/500" → "primary-500"
    .replace(/[^a-z0-9-_]/g, '')     // Remove invalid chars
    .replace(/^-+|-+$/g, '')         // Trim leading/trailing hyphens
    .replace(/--+/g, '-');           // Collapse multiple hyphens
}

// Examples:
// "Backgrounds/Principal" → "backgrounds-principal"
// "Primary / Midnight Indigo / 100" → "primary-midnight-indigo-100"
// "Space 04" → "space-04"
// "☽ Themes" → "themes"
```

### Duplicate Handling:

If duplicate names exist after sanitization:
1. Append `-2`, `-3`, etc. to later duplicates
2. Log warning: `Warning: Duplicate token name 'primary' found, renamed to 'primary-2'`

---

## 10. Unit Conversion Standards

### Font Sizes and Spacing: px → rem

**Conversion formula**: `rem = px / 16`

**Rationale**: 16px is the default browser font size. Using rem provides better accessibility (respects user font size preferences).

**Examples:**
- 14px → 0.875rem
- 16px → 1rem
- 24px → 1.5rem
- 32px → 2rem

**Implementation:**
```javascript
function pxToRem(pxValue) {
  return `${(pxValue / 16).toFixed(4).replace(/\.?0+$/, '')}rem`;
}
```

### Border Radius: Preserve units

**Rationale**: Border radius can be in px or % in Figma. Preserve as-is.

**Implementation:**
```javascript
function formatRadius(value) {
  // If value is between 0-1, treat as percentage
  if (value > 0 && value < 1) {
    return `${(value * 100)}%`;
  }
  // Otherwise treat as pixels
  return `${value}px`;
}
```

### Typography Line Heights: Dimensionless values

**Rationale**: Figma line heights are often in pixels or percentages. Convert to dimensionless ratio for better scaling.

**Implementation:**
```javascript
function formatLineHeight(value, fontSize) {
  // If value > fontSize, it's in pixels (convert to ratio)
  if (value > fontSize) {
    return (value / fontSize).toFixed(2);
  }
  // If value between 0-1, it's already a percentage (convert)
  if (value > 0 && value < 1) {
    return value.toFixed(2);
  }
  // Otherwise return as-is
  return value.toString();
}
```

---

## 11. Shadow Effect Transformation

### Figma Shadow Structure (Expected):

```json
{
  "type": "DROP_SHADOW",
  "offset": { "x": 0, "y": 1 },
  "blur": 3,
  "spread": 0,
  "color": { "r": 0, "g": 0, "b": 0, "a": 0.1 }
}
```

### CSS box-shadow Syntax:

`offset-x offset-y blur-radius spread-radius color`

### Transformation:

```javascript
function shadowToCSS(shadow) {
  const { offset, blur, spread, color } = shadow;
  const oklchColor = figmaRgbToOKLCH(color);

  return `${offset.x}px ${offset.y}px ${blur}px ${spread}px ${oklchColor}`;
}
```

### Multiple Shadow Layers:

Combine with commas:
```javascript
function combineShadows(shadows) {
  return shadows.map(shadowToCSS).join(', ');
}

// Example output:
// --shadow-lg: 0 10px 15px oklch(0 0 0 / 0.1), 0 4px 6px oklch(0 0 0 / 0.05)
```

---

## 12. MCP Validation Strategy

### Validation Steps:

1. **Check MCP availability**: Verify Figma MCP tool is installed
2. **Test operation**: Attempt a simple MCP call (e.g., whoami)
3. **Validate response**: Ensure response is valid JSON with expected structure
4. **Error handling**: Provide clear error messages with troubleshooting steps

### Implementation Pattern:

```javascript
async function validateFigmaMCP() {
  try {
    // Attempt to call Figma MCP whoami
    const response = await mcp.figma.whoami();

    if (!response || !response.user) {
      throw new Error('MCP returned invalid response');
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      help: 'Please check Figma MCP configuration: https://docs.example.com/mcp-setup'
    };
  }
}
```

### Error Messages:

```
❌ Figma MCP is not working

Possible issues:
1. Figma MCP tool is not installed
2. Figma authentication is not configured
3. Network connection issues

How to fix:
- Install Figma MCP: [installation instructions]
- Configure authentication: [auth instructions]
- Test connection: [test command]

Alternative: Provide a JSON file directly using --input flag
```

---

## 13. Memory Usage Limits

### Decision: No hard memory limits with stream-based processing

**Rationale:**
- Stream-based processing maintains constant memory footprint
- Memory usage depends on individual token size, not total file size
- Typical token: <1KB in memory
- 10,000 tokens processed individually: ~10MB peak memory usage

**Performance targets remain:**
- 50-100 tokens: <30 seconds
- Up to 500 tokens: <60 seconds
- 10+ MB files: Stream-based processing (no time limit specified, scales linearly)

**Fallback strategy:**
If streaming fails (malformed JSON), fall back to JSON.parse() with try-catch and clear error message.

---

## 14. Resolved Clarifications Summary

| Original Question | Decision |
|-------------------|----------|
| Node.js version requirements | Node.js 20.x minimum, 24.x recommended |
| Testing framework | Vitest 3+ with --no-watch for CI |
| TypeScript vs JavaScript | TypeScript with strict mode |
| JSON parsing library | Native JSON.parse() for small files, stream-json for large |
| File system utilities | Node.js built-in fs/promises |
| Validation library | Zod for schema validation |
| Maximum supported token count | Unlimited (stream-based) |
| Maximum JSON file size | Unlimited (stream-based) |
| Memory usage limits | No hard limit (constant with streaming) |

---

## 15. Implementation Priorities

Based on research findings, the implementation should proceed in this order:

1. **Input validation** (Zod schemas, file existence checks, MCP validation)
2. **JSON parsing** (stream-json setup, collection iteration)
3. **Token extraction** (handle all resolvedTypes, alias resolution)
4. **Color conversion** (culori integration, OKLCH conversion with gamut mapping)
5. **Name sanitization** (CSS variable name transformation, duplicate handling)
6. **Unit conversion** (px to rem, line height ratios)
7. **CSS generation** (template with @theme directive, category organization)
8. **File output** (write to figma-theme-variables.css, deterministic formatting)
9. **Error handling** (clear messages, troubleshooting steps)
10. **Testing** (unit, integration, snapshot tests)

---

## 16. Key Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Color conversion inaccuracy | Use culori with gamut mapping, validate with deltaE2000 |
| Large JSON files crash | Stream-based processing from start |
| Figma JSON format changes | Validate against schemaVersion, fail gracefully |
| MCP unavailable | Provide JSON file as alternative input |
| Duplicate token names | Detect and append suffix with warning |
| Out-of-gamut colors | Use clampChroma() for visual accuracy |
| Inconsistent units in Figma | Handle mixed units gracefully, log warnings |

---

## Conclusion

All "NEEDS CLARIFICATION" items have been resolved with specific technology choices, implementation patterns, and best practices. The project is ready to proceed to Phase 1 (Design & Contracts).

**Next Steps:**
- Generate data-model.md (token entities and relationships)
- Generate API contracts (command interface, utility function signatures)
- Generate quickstart.md (developer setup guide)
