import { DecoratorKeys } from './internal/constants.js';
import { getName } from './internal/utils.js';
import { logger } from './logSettings.js';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3BsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDeEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUcxQzs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUFxRCxjQUFxQixFQUFFLE9BQWlCO0lBQ2pILGlGQUFpRjtJQUNqRixPQUFPLENBQUMsTUFBVyxFQUFFLEVBQUU7O1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsK0NBQStDLEVBQUUsTUFBQSxjQUFjLGFBQWQsY0FBYyx1QkFBZCxjQUFjLENBQUUsSUFBSSxtQ0FBSSxhQUFhLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlILE1BQU0sT0FBTyxHQUF5QixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQUEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxtQ0FBSSxFQUFFLENBQUMsQ0FBQztRQUMzRyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDMUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRSxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsd0JBQXdCO0FBQ3hCLE9BQU8sRUFBRSxNQUFNLElBQUksT0FBTyxFQUFFLENBQUMifQ==