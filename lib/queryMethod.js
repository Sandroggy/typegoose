import { DecoratorKeys } from './internal/constants';
import { getName } from './internal/utils';
import { logger } from './logSettings';
/**
 * Adds a query method to schema.
 *
 * @param func Query function
 * @example
 * ```ts
 * interface FindHelpers {
 *   findByTitle: AsQueryMethod<typeof findByTitle>;
 * }
 *
 * function findByTitle(this: ReturnModelType<typeof Event, FindHelpers>, title: string) {
 *  return this.find({ title });
 * }
 *
 * @queryMethod(findByTitle)
 * class Event {
 *  @prop()
 *  public title: string;
 * }
 *
 * const EventModel = getModelForClass<typeof Event, FindHelpers>(Event);
 * ```
 */
export function queryMethod(func) {
    return (target) => {
        var _a;
        logger.info('Adding query method "%s" to %s', func.name, getName(target));
        const queryMethods = new Map((_a = Reflect.getMetadata(DecoratorKeys.QueryMethod, target)) !== null && _a !== void 0 ? _a : []);
        queryMethods.set(func.name, func);
        Reflect.defineMetadata(DecoratorKeys.QueryMethod, queryMethods, target);
    };
}
// Export it PascalCased
export { queryMethod as QueryMethod };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlNZXRob2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcXVlcnlNZXRob2QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3ZDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FDekIsSUFBbUY7SUFFbkYsT0FBTyxDQUFDLE1BQVcsRUFBRSxFQUFFOztRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUUsTUFBTSxZQUFZLEdBQW1CLElBQUksR0FBRyxDQUFDLE1BQUEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxtQ0FBSSxFQUFFLENBQUMsQ0FBQztRQUMzRyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxRSxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsd0JBQXdCO0FBQ3hCLE9BQU8sRUFBRSxXQUFXLElBQUksV0FBVyxFQUFFLENBQUMifQ==