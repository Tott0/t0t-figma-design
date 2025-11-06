# Quickstart Guide: Figma to Tailwind 4 Theme Extraction

**Feature**: 001-figma-theme-extraction
**For**: Developers implementing the extraction tool
**Last Updated**: 2025-11-06

## Overview

This guide helps developers set up their environment and understand the development workflow for the Figma to Tailwind 4 theme extraction tool.

---

## Prerequisites

### Required

- **Node.js**: Version 20.x or later (24.x recommended)
- **npm** or **yarn**: Package manager
- **Claude Code**: Installed and configured
- **Git**: Version control

### Optional

- **Figma MCP**: Required only if testing URL-based extraction
- **Figma account**: For exporting test design systems

---

## Initial Setup

### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd t0t-figma-design

# Install dependencies
npm install

# Verify Node.js version
node --version  # Should be >= 20.0.0
```

### 2. Install Project Dependencies

```bash
# Core dependencies
npm install culori          # Color conversion
npm install zod             # Schema validation
npm install stream-json     # Large JSON handling

# Development dependencies
npm install -D typescript   # Type checking
npm install -D tsx          # TypeScript execution
npm install -D vitest       # Testing framework
npm install -D @types/node  # Node.js type definitions
```

### 3. Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    ".t0t-figma/**/*.ts",
    "tests/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### 4. Configure Vitest

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'tests/**',
        'dist/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
```

### 5. Update package.json Scripts

```json
{
  "scripts": {
    "dev": "tsx watch .t0t-figma/scripts/extract.ts",
    "build": "tsc",
    "test": "vitest run --no-watch",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "tsc --noEmit",
    "format": "prettier --write \"./**/*.{ts,json,md}\""
  }
}
```

---

## Project Structure

```
t0t-figma-design/
├── .claude/
│   └── commands/
│       └── t0t.extract-figma-theme.md    # Command definition
├── .t0t-figma/
│   ├── scripts/
│   │   ├── extract.ts                    # Extraction logic
│   │   ├── transform.ts                  # Transformation engine
│   │   ├── generate.ts                   # CSS generation
│   │   ├── color-converter.ts            # OKLCH conversion
│   │   ├── name-sanitizer.ts             # Name sanitization
│   │   ├── unit-converter.ts             # Unit conversion
│   │   └── validate-mcp.ts               # MCP validation
│   ├── lib/                               # Compiled bundles
│   └── templates/
│       └── README.md
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── contract/
│   └── snapshots/
├── specs/
│   └── 001-figma-theme-extraction/
│       ├── spec.md                        # Feature specification
│       ├── plan.md                        # Implementation plan
│       ├── research.md                    # Research findings
│       ├── data-model.md                  # Data structures
│       ├── contracts/                     # API contracts
│       └── quickstart.md                  # This file
├── documentation/
│   ├── Soulix Design System-variables-full.json  # Example Figma JSON
│   ├── tailwindcss.txt                    # Tailwind 4 reference
│   └── archived-for-the-future.md         # Out-of-scope features
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## Development Workflow

### Phase 1: Test-First Development (TDD)

Following Constitution Principle III, all features follow strict TDD:

1. **Write tests first** (they should fail)
2. **Get user approval** (if applicable)
3. **Implement feature**
4. **Tests pass**
5. **Refactor** (if needed)

### Workflow Steps

#### 1. Create a Test File

```typescript
// tests/unit/color-converter.test.ts
import { describe, it, expect } from 'vitest';
import { rgbToOKLCH } from '../../.t0t-figma/scripts/color-converter';

describe('rgbToOKLCH', () => {
  it('converts white RGB to OKLCH', () => {
    const result = rgbToOKLCH(1, 1, 1);
    expect(result).toBe('oklch(1 0 0)');
  });

  it('converts black RGB to OKLCH', () => {
    const result = rgbToOKLCH(0, 0, 0);
    expect(result).toBe('oklch(0 0 0)');
  });

  it('preserves alpha channel', () => {
    const result = rgbToOKLCH(1, 0, 0, 0.5);
    expect(result).toContain('/ 0.5');
  });
});
```

#### 2. Run Tests (Should Fail)

```bash
npm test
# Tests should fail because rgbToOKLCH is not implemented
```

#### 3. Implement Feature

```typescript
// .t0t-figma/scripts/color-converter.ts
import { oklch, formatCss } from 'culori';

export function rgbToOKLCH(r: number, g: number, b: number, a: number = 1): string {
  const color = { mode: 'rgb', r, g, b, alpha: a };
  const oklchColor = oklch(color);
  return formatCss(oklchColor);
}
```

#### 4. Run Tests Again (Should Pass)

```bash
npm test
# Tests should now pass
```

#### 5. Check Coverage

```bash
npm run test:coverage
# Verify 80%+ coverage per constitution requirements
```

### Test Types

#### Unit Tests

Test individual functions in isolation:

```typescript
// tests/unit/name-sanitizer.test.ts
import { sanitizeName } from '../../.t0t-figma/scripts/name-sanitizer';

describe('sanitizeName', () => {
  it('converts spaces to hyphens', () => {
    expect(sanitizeName('Space 04', 'spacing')).toBe('--spacing-space-04');
  });

  it('converts slashes to hyphens', () => {
    expect(sanitizeName('Primary/500', 'color')).toBe('--color-primary-500');
  });

  it('removes Unicode symbols', () => {
    expect(sanitizeName('☽ Themes', 'color')).toBe('--color-themes');
  });
});
```

#### Integration Tests

Test multiple modules working together:

```typescript
// tests/integration/extraction-pipeline.test.ts
import { extractTokens } from '../../.t0t-figma/scripts/extract';
import { transformTokens } from '../../.t0t-figma/scripts/transform';
import figmaJson from '../../documentation/Soulix Design System-variables-full.json';

describe('Extraction Pipeline', () => {
  it('extracts and transforms tokens end-to-end', async () => {
    const tokens = await extractTokens(figmaJson, { modeId: '166:0' });
    expect(tokens.length).toBeGreaterThan(0);

    const cssVars = await transformTokens(tokens, { colorFormat: 'oklch' });
    expect(cssVars.length).toBe(tokens.length);
    expect(cssVars[0].name).toMatch(/^--/);
  });
});
```

#### Snapshot Tests

Ensure CSS output remains deterministic:

```typescript
// tests/snapshots/generated-css.test.ts
import { generateThemeCSS } from '../../.t0t-figma/scripts/generate';

describe('CSS Generation Snapshots', () => {
  it('generates consistent CSS output', async () => {
    const cssVars = [
      { name: '--color-primary-500', value: 'oklch(0.5 0.2 180)', category: 'color' }
    ];

    const css = await generateThemeCSS(cssVars, {});
    expect(css).toMatchSnapshot();
  });
});
```

---

## Common Development Tasks

### Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test color-converter
```

### Type Check

```bash
# Check TypeScript types
npm run lint

# Watch for type errors
npm run lint -- --watch
```

### Build

```bash
# Compile TypeScript to JavaScript
npm run build

# Output will be in ./dist folder
```

### Run Command Locally

```bash
# Execute command via tsx
tsx .claude/commands/t0t.extract-figma-theme.md \
  --input ./documentation/Soulix\ Design\ System-variables-full.json \
  --output ./test-output.css
```

---

## Testing with Real Data

### Using Example JSON

The repository includes a real Figma export:

```bash
# Test extraction with example data
npm test -- extraction-pipeline

# Generate theme from example
tsx .t0t-figma/scripts/extract.ts \
  --input "./documentation/Soulix Design System-variables-full.json" \
  --output "./examples/soulix-theme.css"
```

### Exporting from Figma

1. Open your Figma design system
2. Go to Design Tokens panel
3. Click "Export variables"
4. Save as `test-input.json`
5. Run extraction:

```bash
tsx .t0t-figma/scripts/extract.ts --input ./test-input.json
```

### Testing MCP Integration

```bash
# Verify MCP is working
tsx .t0t-figma/scripts/validate-mcp.ts

# Extract from Figma URL (requires MCP)
tsx .t0t-figma/scripts/extract.ts \
  --url "https://figma.com/design/abc123/..."
```

---

## Debugging

### Enable Verbose Logging

```typescript
// Set environment variable
export DEBUG=true

// Or pass flag
tsx .t0t-figma/scripts/extract.ts --verbose
```

### Inspect Intermediate Data

```typescript
// Add logging in extraction
console.log('Extracted tokens:', JSON.stringify(tokens, null, 2));

// Write intermediate JSON to file
import fs from 'fs/promises';
await fs.writeFile('debug-tokens.json', JSON.stringify(tokens, null, 2));
```

### Debug Tests

```bash
# Run single test with full output
npm test -- --reporter=verbose color-converter

# Debug with Node inspector
node --inspect-brk ./node_modules/vitest/vitest.mjs run color-converter
```

---

## Common Issues

### Issue: "Module not found"

**Solution**: Ensure all dependencies are installed:

```bash
npm install
```

### Issue: Tests fail with "unexpected token"

**Solution**: TypeScript not configured properly. Check `tsconfig.json` and ensure `tsx` is installed.

### Issue: "culori is not defined"

**Solution**: Import culori functions explicitly:

```typescript
import { oklch, formatCss, parse } from 'culori';
```

### Issue: MCP validation fails

**Solution**: Check Figma MCP installation:

```bash
# Verify MCP is in Claude Code config
cat ~/.claude/mcp.json | grep figma

# Reinstall if missing (see Figma MCP docs)
```

### Issue: Large JSON files cause out-of-memory

**Solution**: Use stream-based parsing:

```typescript
import StreamArray from 'stream-json/streamers/StreamArray';

const stream = StreamArray.withParser();
fs.createReadStream('large-file.json').pipe(stream.input);
```

---

## Next Steps

1. **Read the contracts**: Review `specs/001-figma-theme-extraction/contracts/` to understand API interfaces
2. **Write your first test**: Start with `tests/unit/color-converter.test.ts`
3. **Implement incrementally**: Build one module at a time (extraction → transformation → generation)
4. **Check coverage**: Ensure 80%+ test coverage per constitution requirements
5. **Review constitution**: Follow principles in `.specify/memory/constitution.md`

---

## Useful Resources

- **Figma JSON format**: See `documentation/Soulix Design System-variables-full.json`
- **Tailwind 4 reference**: See `documentation/tailwindcss.txt`
- **culori docs**: https://culorijs.org/
- **Vitest docs**: https://vitest.dev/
- **TypeScript docs**: https://www.typescriptlang.org/

---

## Getting Help

- **Constitution questions**: See `.specify/memory/constitution.md`
- **Feature requirements**: See `specs/001-figma-theme-extraction/spec.md`
- **Data structures**: See `specs/001-figma-theme-extraction/data-model.md`
- **API contracts**: See `specs/001-figma-theme-extraction/contracts/`

---

Happy coding! Remember: **tests first**, then implementation.
