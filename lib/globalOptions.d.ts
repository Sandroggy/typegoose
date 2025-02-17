import { Severity } from './internal/constants.js';
import type { IGlobalOptions } from './types.js';
/**
 * Set Typegoose's global Options
 */
export declare function setGlobalOptions(options: IGlobalOptions): void;
/**
 * Parse Typegoose Environment Variables and apply them
 */
export declare function parseENV(): void;
/**
 * Maps strings to the number
 * -> This function is specifically build for "Severity"-Enum
 * @throws {Error} if not in range of the "Severity"-Enum
 * @example
 * ```ts
 * mapValueToSeverity("WARN") === 1
 * mapValueToSeverity("1") === 1
 * // now internal use
 * mapValueToSeverity(1) === 1
 * ```
 * @param value The value to check for
 * @internal
 */
export declare function mapValueToSeverity(value: string | number): Severity;
