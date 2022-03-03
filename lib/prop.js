import { DecoratorKeys } from './internal/constants.js';
import * as utils from './internal/utils.js';
import { logger } from './logSettings.js';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQVksTUFBTSx5QkFBeUIsQ0FBQztBQUNsRSxPQUFPLEtBQUssS0FBSyxNQUFNLHFCQUFxQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQVkxQzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxTQUFTLElBQUksQ0FDWCxPQUE0SCxFQUM1SCxJQUFlO0lBRWYsT0FBTyxDQUFDLE1BQVcsRUFBRSxHQUFvQixFQUFFLEVBQUU7UUFDM0MsT0FBTyxHQUFHLE9BQU8sYUFBUCxPQUFPLGNBQVAsT0FBTyxHQUFJLEVBQUUsQ0FBQztRQUV4QixNQUFNLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQWlDLENBQUM7UUFFckgsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsRUFBRTtZQUNqRCxPQUFPLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxHQUFHLEVBQXFDLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDdkc7UUFFRCxNQUFNLFlBQVksR0FBRyxvQkFBb0IsYUFBcEIsb0JBQW9CLGNBQXBCLG9CQUFvQixHQUFLLE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQWtDLENBQUM7UUFFdkksWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUU5RCxNQUFNLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9GLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFFaEIsd0JBQXdCO0FBQ3hCLE9BQU8sRUFBRSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMifQ==