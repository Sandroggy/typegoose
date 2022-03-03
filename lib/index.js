import { DecoratorKeys } from './internal/constants.js';
import { getName } from './internal/utils.js';
import { logger } from './logSettings.js';
/**
 * Defines an index (most likely compound) for this schema.
 * @param fields Which fields to give the Options
 * @param options Options to pass to MongoDB driver's createIndex() function
 * @example Example:
 * ```ts
 * @index({ article: 1, user: 1 }, { unique: true })
 * class ClassName {}
 * ```
 */
export function index(fields, options) {
    return (target) => {
        var _a;
        logger.info('Adding "%o" Indexes to %s', { fields, options }, getName(target));
        const indices = Array.from((_a = Reflect.getMetadata(DecoratorKeys.Index, target)) !== null && _a !== void 0 ? _a : []);
        indices.push({ fields, options });
        Reflect.defineMetadata(DecoratorKeys.Index, indices, target);
    };
}
// Export it PascalCased
export { index as Index };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFHMUM7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxVQUFVLEtBQUssQ0FDbkIsTUFBaUQsRUFDakQsT0FBeUI7SUFFekIsT0FBTyxDQUFDLE1BQVcsRUFBRSxFQUFFOztRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQy9FLE1BQU0sT0FBTyxHQUF1QixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQUEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxtQ0FBSSxFQUFFLENBQUMsQ0FBQztRQUN2RyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvRCxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsd0JBQXdCO0FBQ3hCLE9BQU8sRUFBRSxLQUFLLElBQUksS0FBSyxFQUFFLENBQUMifQ==