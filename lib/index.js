import { DecoratorKeys } from './internal/constants';
import { getName } from './internal/utils';
import { logger } from './logSettings';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3ZDOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQ25CLE1BQWlELEVBQ2pELE9BQXlCO0lBRXpCLE9BQU8sQ0FBQyxNQUFXLEVBQUUsRUFBRTs7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMvRSxNQUFNLE9BQU8sR0FBdUIsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFBLE9BQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsbUNBQUksRUFBRSxDQUFDLENBQUM7UUFDdkcsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDL0QsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELHdCQUF3QjtBQUN4QixPQUFPLEVBQUUsS0FBSyxJQUFJLEtBQUssRUFBRSxDQUFDIn0=