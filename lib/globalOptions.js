import { Severity } from './internal/constants';
import { globalOptions } from './internal/data';
import { ExpectedTypeError } from './internal/errors';
import { assertion, isNullOrUndefined } from './internal/utils';
import { logger } from './logSettings';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsT3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9nbG9iYWxPcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDdEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHdkM7O0dBRUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsT0FBdUI7SUFDdEQsU0FBUyxDQUFDLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksaUJBQWlCLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRWpJLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0NBQW9DLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFM0QsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3RDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDMUU7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sVUFBVSxRQUFROztJQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFFckMsTUFBTSxPQUFPLEdBQW1CO1FBQzlCLGFBQWEsRUFBRSxFQUFFO1FBQ2pCLE9BQU8sRUFBRTtZQUNQLFVBQVUsRUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsSUFBSSxRQUFRO2dCQUNsRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7Z0JBQ2hELENBQUMsQ0FBQyxNQUFBLGFBQWEsQ0FBQyxPQUFPLDBDQUFFLFVBQVU7U0FDeEM7S0FDRixDQUFDO0lBRUYsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsS0FBc0I7SUFDdkQsU0FBUyxDQUFDLEtBQUssSUFBSSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsZ0RBQWdELEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztJQUV4RyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUM3QixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM3QyxDQUFDIn0=