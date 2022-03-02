import { DecoratorKeys } from './internal/constants';
import * as utils from './internal/utils';
import { logger } from './logSettings';
/**
 * Set Property Options for the property below
 * @param options Options
 * @param kind Overwrite auto-inferred kind
 * @example
 * ```ts
 * class ClassName {
 *   @prop()
 *   public someProp?: string;
 *
 *   @prop({ type: () => [String] })
 *   public someArrayProp?: string[];
 *
 *   @prop({ type: () => String })
 *   public someMapProp?: Map<string, string>;
 * }
 * ```
 */
function prop(options, kind) {
    return (target, key) => {
        options = options !== null && options !== void 0 ? options : {};
        const existingMapForTarget = Reflect.getOwnMetadata(DecoratorKeys.PropCache, target);
        if (utils.isNullOrUndefined(existingMapForTarget)) {
            Reflect.defineMetadata(DecoratorKeys.PropCache, new Map(), target);
        }
        const mapForTarget = existingMapForTarget !== null && existingMapForTarget !== void 0 ? existingMapForTarget : Reflect.getOwnMetadata(DecoratorKeys.PropCache, target);
        mapForTarget.set(key, { options, target, key, whatis: kind });
        logger.debug('Added "%s.%s" to the Decorator Cache', utils.getName(target.constructor), key);
    };
}
export { prop };
// Export it PascalCased
export { prop as Prop };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQVksTUFBTSxzQkFBc0IsQ0FBQztBQUMvRCxPQUFPLEtBQUssS0FBSyxNQUFNLGtCQUFrQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFZdkM7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0gsU0FBUyxJQUFJLENBQ1gsT0FBNEgsRUFDNUgsSUFBZTtJQUVmLE9BQU8sQ0FBQyxNQUFXLEVBQUUsR0FBb0IsRUFBRSxFQUFFO1FBQzNDLE9BQU8sR0FBRyxPQUFPLGFBQVAsT0FBTyxjQUFQLE9BQU8sR0FBSSxFQUFFLENBQUM7UUFFeEIsTUFBTSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFpQyxDQUFDO1FBRXJILElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLEVBQUU7WUFDakQsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksR0FBRyxFQUFxQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZHO1FBRUQsTUFBTSxZQUFZLEdBQUcsb0JBQW9CLGFBQXBCLG9CQUFvQixjQUFwQixvQkFBb0IsR0FBSyxPQUFPLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFrQyxDQUFDO1FBRXZJLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFFOUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvRixDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO0FBRWhCLHdCQUF3QjtBQUN4QixPQUFPLEVBQUUsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDIn0=