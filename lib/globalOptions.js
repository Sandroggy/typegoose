import { Severity } from './internal/constants.js';
import { globalOptions } from './internal/data.js';
import { ExpectedTypeError } from './internal/errors.js';
import { assertion, isNullOrUndefined } from './internal/utils.js';
import { logger } from './logSettings.js';
/**
 * Set Typegoose's global Options
 */
export function setGlobalOptions(options) {
    assertion(!isNullOrUndefined(options) && typeof options === 'object', () => new ExpectedTypeError('options', 'object', options));
    logger.info('"setGlobalOptions" got called with', options);
    for (const key of Object.keys(options)) {
        globalOptions[key] = Object.assign({}, globalOptions[key], options[key]);
    }
    logger.info('new Global Options:', options);
}
/**
 * Parse Typegoose Environment Variables and apply them
 */
export function parseENV() {
    var _a;
    logger.info('"parseENV" got called');
    const options = {
        globalOptions: {},
        options: {
            allowMixed: process.env.TG_ALLOW_MIXED && process.env.TG_ALLOW_MIXED in Severity
                ? mapValueToSeverity(process.env.TG_ALLOW_MIXED)
                : (_a = globalOptions.options) === null || _a === void 0 ? void 0 : _a.allowMixed,
        },
    };
    setGlobalOptions(options);
}
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
export function mapValueToSeverity(value) {
    assertion(value in Severity, () => new Error(`"value" is not in range of "Severity"! (got: ${value})`));
    if (typeof value === 'number') {
        return value;
    }
    return mapValueToSeverity(Severity[value]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsT3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9nbG9iYWxPcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDekQsT0FBTyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUcxQzs7R0FFRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxPQUF1QjtJQUN0RCxTQUFTLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFakksTUFBTSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUUzRCxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDdEMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUMxRTtJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDOUMsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSxVQUFVLFFBQVE7O0lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUVyQyxNQUFNLE9BQU8sR0FBbUI7UUFDOUIsYUFBYSxFQUFFLEVBQUU7UUFDakIsT0FBTyxFQUFFO1lBQ1AsVUFBVSxFQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxJQUFJLFFBQVE7Z0JBQ2xFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQztnQkFDaEQsQ0FBQyxDQUFDLE1BQUEsYUFBYSxDQUFDLE9BQU8sMENBQUUsVUFBVTtTQUN4QztLQUNGLENBQUM7SUFFRixnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxLQUFzQjtJQUN2RCxTQUFTLENBQUMsS0FBSyxJQUFJLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRXhHLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQzdCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxPQUFPLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzdDLENBQUMifQ==