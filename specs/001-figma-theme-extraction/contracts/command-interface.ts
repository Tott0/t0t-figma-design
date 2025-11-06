/**
 * Command Interface Contract
 *
 * Defines the public API for the t0t.extract-figma-theme command.
 * This is the user-facing interface exposed through Claude Code.
 */

/**
 * Command Input Options
 *
 * User can provide either a Figma URL or a JSON file path.
 * If both are provided, JSON file takes priority.
 */
export interface CommandOptions {
  /** Figma design system URL (requires working MCP) */
  url?: string;

  /** Path to exported Figma JSON file */
  input?: string;

  /** Output file path (default: ./figma-theme-variables.css) */
  output?: string;

  /** Enable verbose logging */
  verbose?: boolean;

  /** Skip MCP validation (assume it works) */
  skipMcpValidation?: boolean;
}

/**
 * Command Result
 *
 * Returns execution result with metadata and statistics.
 */
export interface CommandResult {
  /** Whether command completed successfully */
  success: boolean;

  /** Path to generated CSS file (if successful) */
  outputFilePath?: string;

  /** Total number of tokens processed */
  tokensProcessed: number;

  /** Tokens by category */
  tokensByCategory: Record<string, number>;

  /** Warnings encountered (non-fatal) */
  warnings: CommandWarning[];

  /** Errors encountered (fatal if success=false) */
  errors: CommandError[];

  /** Execution time in milliseconds */
  duration: number;
}

/**
 * Command Warning
 *
 * Non-fatal issues encountered during execution.
 */
export interface CommandWarning {
  code: 'DUPLICATE_NAME' | 'OUT_OF_GAMUT' | 'UNSUPPORTED_TOKEN' | 'EMPTY_COLLECTION' | 'MISSING_DESCRIPTION';
  message: string;
  tokenId?: string;
  tokenName?: string;
}

/**
 * Command Error
 *
 * Fatal errors that stopped execution.
 */
export interface CommandError {
  code: 'MCP_UNAVAILABLE' | 'FILE_NOT_FOUND' | 'INVALID_JSON' | 'UNSUPPORTED_SCHEMA' | 'WRITE_ERROR' | 'VALIDATION_ERROR';
  message: string;
  helpText?: string;
  fatal: boolean;
}

/**
 * Main Command Entry Point
 *
 * Executes the extraction pipeline from input to CSS output.
 *
 * @param options - Command configuration options
 * @returns Promise resolving to command result
 *
 * @throws Never throws - all errors are captured in result.errors
 *
 * @example
 * ```typescript
 * // Extract from Figma URL
 * const result = await extractFigmaTheme({
 *   url: 'https://figma.com/design/abc123/...',
 *   output: './theme.css'
 * });
 *
 * // Extract from JSON file
 * const result = await extractFigmaTheme({
 *   input: './figma-variables.json',
 *   output: './theme.css'
 * });
 * ```
 */
export async function extractFigmaTheme(options: CommandOptions): Promise<CommandResult>;

/**
 * Input Validation
 *
 * Validates command options before execution.
 *
 * @param options - Command options to validate
 * @returns Validation result with errors if any
 *
 * @example
 * ```typescript
 * const validation = validateCommandOptions({ url: 'invalid' });
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
export function validateCommandOptions(options: CommandOptions): {
  valid: boolean;
  errors: string[];
};
