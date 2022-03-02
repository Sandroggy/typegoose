import { DecoratorKeys } from './internal/constants';
import { assignGlobalModelOptions, assignMetadata } from './internal/utils';
/**
 * Define Options for the Class
 * @param options Options
 * @example Example:
 * ```ts
 * @modelOptions({ schemaOptions: { timestamps: true } })
 * class ClassName {}
 *
 * // The default Class "TimeStamps" can be used for type information and options already set
 * ```
 */
export function modelOptions(options) {
    return (target) => {
        assignGlobalModelOptions(target);
        assignMetadata(DecoratorKeys.ModelOptions, options, target);
    };
}
// Export it PascalCased
export { modelOptions as ModelOptions };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxPcHRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vZGVsT3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRzVFOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUFDLE9BQXNCO0lBQ2pELE9BQU8sQ0FBQyxNQUFXLEVBQUUsRUFBRTtRQUNyQix3QkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqQyxjQUFjLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELHdCQUF3QjtBQUN4QixPQUFPLEVBQUUsWUFBWSxJQUFJLFlBQVksRUFBRSxDQUFDIn0=