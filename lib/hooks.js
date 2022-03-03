import { DecoratorKeys } from './internal/constants.js';
import { ExpectedTypeError } from './internal/errors.js';
import { assertion, getName, isNullOrUndefined } from './internal/utils.js';
import { logger } from './logSettings.js';
// TSDoc for the hooks can't be added without adding it to *every* overload
const hooks = {
    pre(...args) {
        return (target) => addToHooks(target, 'pre', args);
    },
    post(...args) {
        return (target) => addToHooks(target, 'post', args);
    },
};
/**
 * Add a hook to the hooks Array
 * @param target Target Class
 * @param hookType What type is it
 * @param args All Arguments, that should be passed-throught
 */
function addToHooks(target, hookType, args) {
    var _a, _b, _c;
    // Convert Method to array if only a string is provided
    const methods = Array.isArray(args[0]) ? args[0] : [args[0]];
    const func = args[1];
    const hookOptions = (_a = args[2]) !== null && _a !== void 0 ? _a : {};
    assertion(typeof func === 'function', () => new ExpectedTypeError('fn', 'function', func));
    assertion(typeof hookOptions === 'object' && !isNullOrUndefined(hookOptions), () => new ExpectedTypeError('options', 'object / undefined', hookOptions));
    if (args.length > 3) {
        logger.warn(`"addToHooks" parameter "args" has a length of over 3 (length: ${args.length})`);
    }
    logger.info('Adding hooks for "[%s]" to "%s" as type "%s"', methods.join(','), getName(target), hookType);
    for (const method of methods) {
        switch (hookType) {
            case 'post':
                const postHooks = Array.from((_b = Reflect.getMetadata(DecoratorKeys.HooksPost, target)) !== null && _b !== void 0 ? _b : []);
                postHooks.push({ func, method, options: hookOptions });
                Reflect.defineMetadata(DecoratorKeys.HooksPost, postHooks, target);
                break;
            case 'pre':
                const preHooks = Array.from((_c = Reflect.getMetadata(DecoratorKeys.HooksPre, target)) !== null && _c !== void 0 ? _c : []);
                preHooks.push({ func, method, options: hookOptions });
                Reflect.defineMetadata(DecoratorKeys.HooksPre, preHooks, target);
                break;
        }
    }
}
export const pre = hooks.pre;
export const post = hooks.post;
// Export it PascalCased
export const Pre = hooks.pre;
export const Post = hooks.post;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaG9va3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBOEUxQywyRUFBMkU7QUFDM0UsTUFBTSxLQUFLLEdBQVU7SUFDbkIsR0FBRyxDQUFDLEdBQUcsSUFBSTtRQUNULE9BQU8sQ0FBQyxNQUFXLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFDRCxJQUFJLENBQUMsR0FBRyxJQUFJO1FBQ1YsT0FBTyxDQUFDLE1BQVcsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0QsQ0FBQztDQUNGLENBQUM7QUFFRjs7Ozs7R0FLRztBQUNILFNBQVMsVUFBVSxDQUFDLE1BQVcsRUFBRSxRQUF3QixFQUFFLElBQVc7O0lBQ3BFLHVEQUF1RDtJQUN2RCxNQUFNLE9BQU8sR0FBVSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEUsTUFBTSxJQUFJLEdBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxNQUFNLFdBQVcsR0FBc0IsTUFBQSxJQUFJLENBQUMsQ0FBQyxDQUFDLG1DQUFJLEVBQUUsQ0FBQztJQUVyRCxTQUFTLENBQUMsT0FBTyxJQUFJLEtBQUssVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksaUJBQWlCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzNGLFNBQVMsQ0FDUCxPQUFPLFdBQVcsS0FBSyxRQUFRLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsRUFDbEUsR0FBRyxFQUFFLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLEVBQUUsV0FBVyxDQUFDLENBQzFFLENBQUM7SUFFRixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUVBQWlFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQzlGO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyw4Q0FBOEMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUUxRyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUM1QixRQUFRLFFBQVEsRUFBRTtZQUNoQixLQUFLLE1BQU07Z0JBQ1QsTUFBTSxTQUFTLEdBQWtCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBQSxPQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLG1DQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUN4RyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztnQkFDdkQsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDbkUsTUFBTTtZQUNSLEtBQUssS0FBSztnQkFDUixNQUFNLFFBQVEsR0FBa0IsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFBLE9BQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsbUNBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ3RHLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO2dCQUN0RCxPQUFPLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNqRSxNQUFNO1NBQ1Q7S0FDRjtBQUNILENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUM3QixNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUUvQix3QkFBd0I7QUFDeEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDN0IsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMifQ==