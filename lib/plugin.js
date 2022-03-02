import { DecoratorKeys } from './internal/constants';
import { getName } from './internal/utils';
import { logger } from './logSettings';
/**
 * Add a Middleware-Plugin
 * @param mongoosePlugin The Plugin to plug-in
 * @param options Options for the Plugin, if any
 * @example Example:
 * ```ts
 * @plugin(findOrCreate)
 * class ClassName {}
 * ```
 */
export function plugin(mongoosePlugin, options) {
    // don't check if options is an object, because any plugin could make it anything
    return (target) => {
        var _a, _b;
        logger.info('Adding plugin "%s" to "%s" with options: "%o"', (_a = mongoosePlugin === null || mongoosePlugin === void 0 ? void 0 : mongoosePlugin.name) !== null && _a !== void 0 ? _a : '<anonymous>', getName(target), options);
        const plugins = Array.from((_b = Reflect.getMetadata(DecoratorKeys.Plugins, target)) !== null && _b !== void 0 ? _b : []);
        plugins.push({ mongoosePlugin, options });
        Reflect.defineMetadata(DecoratorKeys.Plugins, plugins, target);
    };
}
// Export it PascalCased
export { plugin as Plugins };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3BsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHdkM7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxVQUFVLE1BQU0sQ0FBcUQsY0FBcUIsRUFBRSxPQUFpQjtJQUNqSCxpRkFBaUY7SUFDakYsT0FBTyxDQUFDLE1BQVcsRUFBRSxFQUFFOztRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLCtDQUErQyxFQUFFLE1BQUEsY0FBYyxhQUFkLGNBQWMsdUJBQWQsY0FBYyxDQUFFLElBQUksbUNBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM5SCxNQUFNLE9BQU8sR0FBeUIsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFBLE9BQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsbUNBQUksRUFBRSxDQUFDLENBQUM7UUFDM0csT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDakUsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELHdCQUF3QjtBQUN4QixPQUFPLEVBQUUsTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDIn0=