/**
 * Transformation Module Contract
 *
 * Transforms extracted design tokens into Tailwind 4-compatible
 * CSS variables with proper formatting and conversions.
 */

import type { DesignToken, CSSVariable, TokenCategory } from './types';

/**
 * Transform design tokens to CSS variables
 *
 * Applies category-specific transformations (color conversion,
 * unit conversion, name sanitization) to generate Tailwind 4
 * CSS custom properties.
 *
 * @param tokens - Extracted design tokens
 * @param options - Transformation options
 * @returns Array of CSS variables ready for output
 *
 * @example
 * ```typescript
 * const cssVars = await transformTokens(tokens, {
 *   colorFormat: 'oklch',
 *   remBase: 16
 * });
 * ```
 */
export async function transformTokens(
  tokens: DesignToken[],
  options: TransformationOptions
): Promise<CSSVariable[]>;

/**
 * Transformation Options
 */
export interface TransformationOptions {
  /** Color format for output (default: 'oklch') */
  colorFormat?: 'oklch' | 'rgb' | 'hsl';

  /** Base font size for rem conversion (default: 16) */
  remBase?: number;

  /** Whether to apply gamut mapping for out-of-gamut colors (default: true) */
  applyGamutMapping?: boolean;

  /** How to handle duplicate names (default: 'suffix') */
  duplicateHandling?: 'suffix' | 'error' | 'skip';
}

/**
 * Transform a single token to CSS variable
 *
 * @param token - Design token to transform
 * @param options - Transformation options
 * @returns CSS variable
 */
export async function transformToken(
  token: DesignToken,
  options: TransformationOptions
): Promise<CSSVariable>;

/**
 * Color Conversion
 *
 * Convert Figma RGB color to OKLCH format.
 *
 * @param r - Red (0-1 range)
 * @param g - Green (0-1 range)
 * @param b - Blue (0-1 range)
 * @param a - Alpha (0-1 range, default: 1)
 * @returns OKLCH CSS value
 *
 * @example
 * ```typescript
 * rgbToOKLCH(0.91, 0.91, 0.93, 1);
 * // Returns: "oklch(0.92 0.01 280)"
 *
 * rgbToOKLCH(1, 0, 0, 0.5);
 * // Returns: "oklch(0.63 0.26 29 / 0.5)"
 * ```
 */
export function rgbToOKLCH(r: number, g: number, b: number, a?: number): string;

/**
 * Gamut Mapping
 *
 * Clamp out-of-gamut OKLCH colors to sRGB gamut while
 * maintaining visual appearance as much as possible.
 *
 * @param oklchString - OKLCH color string
 * @returns Clamped OKLCH color string
 *
 * @example
 * ```typescript
 * clampToGamut("oklch(0.5 0.8 180)");
 * // Returns: "oklch(0.5 0.37 180)" (chroma reduced to fit gamut)
 * ```
 */
export function clampToGamut(oklchString: string): string;

/**
 * Unit Conversion
 *
 * Convert pixel values to rem units.
 *
 * @param pxValue - Value in pixels
 * @param base - Base font size (default: 16)
 * @returns rem value as string
 *
 * @example
 * ```typescript
 * pxToRem(16);    // Returns: "1rem"
 * pxToRem(14);    // Returns: "0.875rem"
 * pxToRem(24, 18); // Returns: "1.3333rem" (with custom base)
 * ```
 */
export function pxToRem(pxValue: number, base?: number): string;

/**
 * Name Sanitization
 *
 * Convert Figma token name to valid CSS variable name.
 *
 * Rules:
 * - Lowercase
 * - Replace spaces and slashes with hyphens
 * - Remove invalid characters
 * - Collapse multiple hyphens
 *
 * @param figmaName - Original Figma variable name
 * @param category - Token category for prefix
 * @returns Sanitized CSS variable name
 *
 * @example
 * ```typescript
 * sanitizeName("Primary/Midnight Indigo/100", "color");
 * // Returns: "--color-primary-midnight-indigo-100"
 *
 * sanitizeName("Space 04", "spacing");
 * // Returns: "--spacing-space-04"
 *
 * sanitizeName("☽ Themes", "color");
 * // Returns: "--color-themes"
 * ```
 */
export function sanitizeName(figmaName: string, category: TokenCategory): string;

/**
 * Duplicate Name Detection
 *
 * Check for duplicate CSS variable names and resolve conflicts.
 *
 * @param variables - Array of CSS variables to check
 * @param handling - How to handle duplicates
 * @returns Variables with duplicates resolved
 *
 * @throws {DuplicateNameError} If handling='error' and duplicates found
 *
 * @example
 * ```typescript
 * const resolved = handleDuplicates(variables, 'suffix');
 * // Duplicate names get "-2", "-3" suffix
 * ```
 */
export function handleDuplicates(
  variables: CSSVariable[],
  handling: 'suffix' | 'error' | 'skip'
): CSSVariable[];

/**
 * Shadow Formatting
 *
 * Convert Figma shadow object to CSS box-shadow syntax.
 *
 * @param shadow - Shadow definition
 * @returns CSS box-shadow value
 *
 * @example
 * ```typescript
 * formatShadow({
 *   offset: { x: 0, y: 1 },
 *   blur: 3,
 *   spread: 0,
 *   color: { r: 0, g: 0, b: 0, a: 0.1 }
 * });
 * // Returns: "0 1px 3px 0 oklch(0 0 0 / 0.1)"
 * ```
 */
export function formatShadow(shadow: ShadowDefinition): string;

/**
 * Shadow Definition
 */
export interface ShadowDefinition {
  offset: { x: number; y: number };
  blur: number;
  spread: number;
  color: { r: number; g: number; b: number; a: number };
}

/**
 * Transformation Error
 *
 * Thrown when transformation fails.
 */
export class TransformationError extends Error {
  code: 'INVALID_VALUE' | 'DUPLICATE_NAME' | 'CONVERSION_ERROR';
  tokenId?: string;
  tokenName?: string;

  constructor(
    message: string,
    code: TransformationError['code'],
    tokenId?: string,
    tokenName?: string
  ) {
    super(message);
    this.name = 'TransformationError';
    this.code = code;
    this.tokenId = tokenId;
    this.tokenName = tokenName;
  }
}
