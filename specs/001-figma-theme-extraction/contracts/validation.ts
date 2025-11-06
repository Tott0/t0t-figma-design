/**
 * Validation Module Contract
 *
 * Validates inputs, MCP functionality, and generated outputs.
 */

/**
 * Validate Figma MCP availability and functionality
 *
 * Performs a test operation to ensure MCP is working correctly.
 *
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = await validateMCP();
 * if (!result.valid) {
 *   console.error(result.error);
 *   console.log(result.helpText);
 * }
 * ```
 */
export async function validateMCP(): Promise<MCPValidationResult>;

/**
 * MCP Validation Result
 */
export interface MCPValidationResult {
  /** Whether MCP is available and functional */
  valid: boolean;

  /** Error message if validation failed */
  error?: string;

  /** Troubleshooting instructions */
  helpText?: string;

  /** MCP user info (if successful) */
  user?: {
    id: string;
    name: string;
    email?: string;
  };
}

/**
 * Validate Figma JSON format
 *
 * Checks that JSON matches expected Figma variable export format.
 *
 * @param json - Parsed JSON object to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = validateFigmaJSON(json);
 * if (!validation.valid) {
 *   console.error('Invalid Figma JSON:', validation.errors);
 * }
 * ```
 */
export function validateFigmaJSON(json: unknown): {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Validate file path
 *
 * Checks that file exists and is readable.
 *
 * @param filePath - File path to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateFilePath('./tokens.json');
 * if (!validation.valid) {
 *   console.error(validation.error);
 * }
 * ```
 */
export async function validateFilePath(filePath: string): Promise<{
  valid: boolean;
  error?: string;
  absolutePath?: string;
}>;

/**
 * Validate Figma URL format
 *
 * Checks that URL matches expected Figma URL pattern.
 *
 * @param url - URL to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateFigmaURL('https://figma.com/design/abc123/...');
 * // Returns: { valid: true, fileKey: 'abc123', ... }
 *
 * validateFigmaURL('https://google.com');
 * // Returns: { valid: false, error: 'Not a Figma URL' }
 * ```
 */
export function validateFigmaURL(url: string): {
  valid: boolean;
  error?: string;
  fileKey?: string;
  nodeId?: string;
};

/**
 * Validate output directory
 *
 * Checks that output directory exists and is writable.
 *
 * @param dirPath - Directory path to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateOutputDirectory('./output');
 * if (!validation.valid) {
 *   console.error('Cannot write to directory:', validation.error);
 * }
 * ```
 */
export async function validateOutputDirectory(dirPath: string): Promise<{
  valid: boolean;
  error?: string;
  writable?: boolean;
}>;

/**
 * Validation Error
 *
 * Base class for validation errors.
 */
export class ValidationError extends Error {
  code: string;
  details?: unknown;

  constructor(message: string, code: string, details?: unknown) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.details = details;
  }
}
