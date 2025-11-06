/**
 * Extraction Module Contract
 *
 * Handles extraction of design tokens from Figma JSON.
 * Resolves variable aliases and normalizes data structure.
 */

import type {
  FigmaJSON,
  FigmaCollection,
  FigmaVariable,
  FigmaValue,
} from './types';

import type { DesignToken } from './types';

/**
 * Extract design tokens from Figma JSON
 *
 * Processes all collections and variables, resolving aliases
 * and normalizing into DesignToken objects.
 *
 * @param figmaJson - Parsed Figma variable export JSON
 * @param options - Extraction options
 * @returns Array of extracted design tokens
 *
 * @throws {ExtractionError} If JSON is malformed or aliases cannot be resolved
 *
 * @example
 * ```typescript
 * const tokens = await extractTokens(figmaJson, {
 *   modeId: '166:0', // Extract Light mode only
 *   resolveAliases: true
 * });
 * ```
 */
export async function extractTokens(
  figmaJson: FigmaJSON,
  options: ExtractionOptions
): Promise<DesignToken[]>;

/**
 * Extraction Options
 */
export interface ExtractionOptions {
  /** Which mode to extract (defaults to first mode in collection) */
  modeId?: string;

  /** Whether to resolve VARIABLE_ALIAS references (default: true) */
  resolveAliases?: boolean;

  /** Maximum alias resolution depth to prevent infinite loops (default: 10) */
  maxAliasDepth?: number;

  /** Whether to skip unsupported token types (default: true) */
  skipUnsupported?: boolean;
}

/**
 * Resolve a variable alias to its primitive value
 *
 * Follows VARIABLE_ALIAS references recursively until
 * a primitive value (RGB, FLOAT, STRING) is found.
 *
 * @param variableId - ID of variable to resolve
 * @param collections - All available collections
 * @param modeId - Which mode to extract value from
 * @param depth - Current recursion depth (internal)
 * @returns Resolved primitive value
 *
 * @throws {CircularAliasError} If circular reference detected
 * @throws {MaxDepthError} If recursion exceeds max depth
 * @throws {UnresolvableAliasError} If target variable not found
 *
 * @example
 * ```typescript
 * const value = await resolveAlias(
 *   'VariableID:169:4628',
 *   collections,
 *   '166:0'
 * );
 * // Returns: { r: 0.91, g: 0.91, b: 0.93, a: 1 }
 * ```
 */
export async function resolveAlias(
  variableId: string,
  collections: FigmaCollection[],
  modeId: string,
  depth?: number
): Promise<FigmaValue>;

/**
 * Categorize a Figma variable based on type and name
 *
 * Determines the appropriate Tailwind category (color, spacing, etc.)
 * based on variable type and naming patterns.
 *
 * @param variable - Figma variable to categorize
 * @returns Token category
 *
 * @example
 * ```typescript
 * categorizeVariable({
 *   name: 'Primary/500',
 *   resolvedType: 'COLOR'
 * });
 * // Returns: 'color'
 *
 * categorizeVariable({
 *   name: 'Space 04',
 *   resolvedType: 'FLOAT'
 * });
 * // Returns: 'spacing'
 * ```
 */
export function categorizeVariable(variable: FigmaVariable): TokenCategory;

/**
 * Token Category
 *
 * Maps to Tailwind CSS variable prefixes.
 */
export type TokenCategory =
  | 'color'          // --color-*
  | 'font'           // --font-*
  | 'text'           // --text-* (font sizes)
  | 'font-weight'    // --font-weight-*
  | 'leading'        // --leading-* (line height)
  | 'tracking'       // --tracking-* (letter spacing)
  | 'spacing'        // --spacing-*
  | 'radius'         // --radius-*
  | 'shadow';        // --shadow-*

/**
 * Extraction Error
 *
 * Thrown when extraction fails.
 */
export class ExtractionError extends Error {
  code: 'INVALID_JSON' | 'UNSUPPORTED_SCHEMA' | 'ALIAS_ERROR';
  details?: unknown;

  constructor(message: string, code: ExtractionError['code'], details?: unknown) {
    super(message);
    this.name = 'ExtractionError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Circular Alias Error
 *
 * Thrown when a circular alias reference is detected.
 */
export class CircularAliasError extends ExtractionError {
  aliasChain: string[];

  constructor(aliasChain: string[]) {
    super(
      `Circular alias reference detected: ${aliasChain.join(' -> ')}`,
      'ALIAS_ERROR',
      { aliasChain }
    );
    this.name = 'CircularAliasError';
    this.aliasChain = aliasChain;
  }
}
