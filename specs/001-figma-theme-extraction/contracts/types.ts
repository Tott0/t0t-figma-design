/**
 * Shared Type Definitions
 *
 * Common types used across all modules.
 */

/**
 * Figma JSON Export Format
 *
 * Root structure of Figma variable export JSON.
 */
export interface FigmaJSON {
  schemaVersion: number;
  lastModified: string;
  collections: FigmaCollection[];
}

/**
 * Figma Collection
 *
 * A group of related variables (e.g., Colors, Themes, Spacing).
 */
export interface FigmaCollection {
  id: string;
  name: string;
  key: string;
  defaultModeId: string;
  modes: FigmaMode[];
  variables: FigmaVariable[];
  hiddenFromPublishing: boolean;
  remote: boolean;
  variableIds: string[];
}

/**
 * Figma Mode
 *
 * A variation of the design system (e.g., Light, Dark).
 */
export interface FigmaMode {
  name: string;
  modeId: string;
}

/**
 * Figma Variable
 *
 * A single design token from Figma.
 */
export interface FigmaVariable {
  id: string;
  name: string;
  description: string;
  key: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING';
  valuesByMode: Record<string, FigmaValue>;
  scopes: string[];
  hiddenFromPublishing: boolean;
  codeSyntax: Record<string, unknown>;
  variableCollectionId: string;
}

/**
 * Figma Value
 *
 * Value of a variable (can be primitive or alias).
 */
export type FigmaValue =
  | FigmaColorValue
  | FigmaFloatValue
  | FigmaStringValue
  | FigmaAliasValue;

/**
 * Figma Color Value (RGB)
 */
export interface FigmaColorValue {
  r: number; // 0-1 range
  g: number; // 0-1 range
  b: number; // 0-1 range
  a: number; // 0-1 range
}

/**
 * Figma Float Value
 */
export type FigmaFloatValue = number;

/**
 * Figma String Value
 */
export type FigmaStringValue = string;

/**
 * Figma Alias Value
 *
 * Reference to another variable.
 */
export interface FigmaAliasValue {
  type: 'VARIABLE_ALIAS';
  id: string;
}

/**
 * Design Token
 *
 * Normalized token extracted from Figma.
 */
export interface DesignToken {
  /** Original Figma variable ID */
  id: string;

  /** Token category (maps to Tailwind prefix) */
  category: TokenCategory;

  /** Original Figma variable name */
  name: string;

  /** Name split by hierarchy */
  namePath: string[];

  /** Resolved primitive value */
  value: TokenValue;

  /** Additional metadata */
  metadata: TokenMetadata;
}

/**
 * Token Category
 */
export type TokenCategory =
  | 'color'
  | 'font'
  | 'text'
  | 'font-weight'
  | 'leading'
  | 'tracking'
  | 'spacing'
  | 'radius'
  | 'shadow';

/**
 * Token Value
 *
 * Resolved primitive value.
 */
export type TokenValue =
  | ColorTokenValue
  | FloatTokenValue
  | StringTokenValue
  | ShadowTokenValue;

/**
 * Color Token Value
 */
export interface ColorTokenValue {
  type: 'color';
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Float Token Value
 */
export interface FloatTokenValue {
  type: 'float';
  value: number;
  unit?: string;
}

/**
 * String Token Value
 */
export interface StringTokenValue {
  type: 'string';
  value: string;
}

/**
 * Shadow Token Value
 */
export interface ShadowTokenValue {
  type: 'shadow';
  layers: ShadowLayer[];
}

/**
 * Shadow Layer
 */
export interface ShadowLayer {
  offset: { x: number; y: number };
  blur: number;
  spread: number;
  color: { r: number; g: number; b: number; a: number };
}

/**
 * Token Metadata
 */
export interface TokenMetadata {
  source: 'figma';
  collectionName: string;
  mode: string;
  description?: string;
  scopes: string[];
}

/**
 * CSS Variable
 *
 * Transformed token ready for CSS output.
 */
export interface CSSVariable {
  /** CSS variable name (e.g., --color-primary-500) */
  name: string;

  /** CSS value (e.g., oklch(0.5 0.2 180)) */
  value: string;

  /** Category */
  category: TokenCategory;

  /** Reference to source token ID */
  sourceTokenId: string;

  /** Original Figma name for traceability */
  originalName: string;
}
