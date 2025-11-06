/**
 * Generation Module Contract
 *
 * Generates Tailwind 4 theme CSS file from transformed CSS variables.
 */

import type { CSSVariable } from './types';

/**
 * Generate Tailwind 4 theme CSS file
 *
 * Creates a CSS file with @theme directive containing all
 * CSS variables organized by category.
 *
 * @param variables - Transformed CSS variables
 * @param options - Generation options
 * @returns Generated CSS content
 *
 * @example
 * ```typescript
 * const css = await generateThemeCSS(variables, {
 *   outputPath: './theme.css',
 *   includeComments: true
 * });
 * ```
 */
export async function generateThemeCSS(
  variables: CSSVariable[],
  options: GenerationOptions
): Promise<string>;

/**
 * Generation Options
 */
export interface GenerationOptions {
  /** Output file path (default: ./figma-theme-variables.css) */
  outputPath?: string;

  /** Whether to include category comment headers (default: true) */
  includeComments?: boolean;

  /** Indentation spaces (default: 2) */
  indent?: number;

  /** Whether to sort variables alphabetically within categories (default: true) */
  sortVariables?: boolean;

  /** Whether to add generation timestamp comment (default: true) */
  includeTimestamp?: boolean;

  /** Whether to add source attribution comment (default: true) */
  includeAttribution?: boolean;
}

/**
 * Write CSS file to disk
 *
 * Writes generated CSS content to the specified file path.
 * Creates parent directories if they don't exist.
 *
 * @param content - CSS content to write
 * @param filePath - Destination file path
 * @returns Absolute path of written file
 *
 * @throws {WriteError} If file cannot be written
 *
 * @example
 * ```typescript
 * const path = await writeThemeFile(css, './theme.css');
 * console.log(`Theme written to ${path}`);
 * ```
 */
export async function writeThemeFile(content: string, filePath: string): Promise<string>;

/**
 * Validate generated CSS
 *
 * Parses CSS to ensure it's valid and contains expected structure.
 *
 * @param cssContent - CSS content to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = validateCSS(css);
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
export function validateCSS(cssContent: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Group variables by category
 *
 * Organizes CSS variables into category groups for output.
 *
 * @param variables - CSS variables to group
 * @returns Variables grouped by category
 *
 * @example
 * ```typescript
 * const grouped = groupByCategory(variables);
 * // Returns:
 * // {
 * //   color: [var1, var2, ...],
 * //   spacing: [var3, var4, ...],
 * //   ...
 * // }
 * ```
 */
export function groupByCategory(
  variables: CSSVariable[]
): Record<string, CSSVariable[]>;

/**
 * Format CSS variable declaration
 *
 * Formats a single CSS variable as a declaration line.
 *
 * @param variable - CSS variable to format
 * @param indent - Number of spaces to indent (default: 2)
 * @returns Formatted CSS declaration
 *
 * @example
 * ```typescript
 * formatVariable({
 *   name: '--color-primary-500',
 *   value: 'oklch(0.5 0.2 180)'
 * }, 2);
 * // Returns: "  --color-primary-500: oklch(0.5 0.2 180);"
 * ```
 */
export function formatVariable(variable: CSSVariable, indent?: number): string;

/**
 * Generate category comment header
 *
 * Creates a CSS comment header for a category section.
 *
 * @param category - Category name
 * @returns Formatted comment header
 *
 * @example
 * ```typescript
 * generateCategoryHeader('color');
 * // Returns: "  /* Colors *\/"
 * ```
 */
export function generateCategoryHeader(category: string): string;

/**
 * Generate file header comment
 *
 * Creates a header comment with metadata.
 *
 * @param options - Header options
 * @returns Formatted header comment
 *
 * @example
 * ```typescript
 * generateFileHeader({
 *   includeTimestamp: true,
 *   includeAttribution: true,
 *   tokenCount: 42
 * });
 * // Returns:
 * // \/**
 * //  * Tailwind 4 Theme Variables
 * //  * Generated from Figma design tokens
 * //  * Date: 2025-11-06T...
 * //  * Tokens: 42
 * //  *\/
 * ```
 */
export function generateFileHeader(options: {
  includeTimestamp?: boolean;
  includeAttribution?: boolean;
  tokenCount?: number;
}): string;

/**
 * Generation Summary
 *
 * Statistics about generated theme file.
 */
export interface GenerationSummary {
  /** Total number of variables */
  totalVariables: number;

  /** Variables by category */
  byCategory: Record<string, number>;

  /** Output file path */
  outputPath: string;

  /** File size in bytes */
  fileSize: number;

  /** Generation timestamp */
  timestamp: string;
}

/**
 * Write Error
 *
 * Thrown when file write fails.
 */
export class WriteError extends Error {
  code: 'PERMISSION_DENIED' | 'DISK_FULL' | 'INVALID_PATH';
  filePath: string;

  constructor(message: string, code: WriteError['code'], filePath: string) {
    super(message);
    this.name = 'WriteError';
    this.code = code;
    this.filePath = filePath;
  }
}
