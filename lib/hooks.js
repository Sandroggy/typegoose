import { DecoratorKeys } from './internal/constants';
import { ExpectedTypeError } from './internal/errors';
import { assertion, getName, isNullOrUndefined } from './internal/utils';
import { logger } from './logSettings';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaG9va3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQThFdkMsMkVBQTJFO0FBQzNFLE1BQU0sS0FBSyxHQUFVO0lBQ25CLEdBQUcsQ0FBQyxHQUFHLElBQUk7UUFDVCxPQUFPLENBQUMsTUFBVyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBQ0QsSUFBSSxDQUFDLEdBQUcsSUFBSTtRQUNWLE9BQU8sQ0FBQyxNQUFXLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FDRixDQUFDO0FBRUY7Ozs7O0dBS0c7QUFDSCxTQUFTLFVBQVUsQ0FBQyxNQUFXLEVBQUUsUUFBd0IsRUFBRSxJQUFXOztJQUNwRSx1REFBdUQ7SUFDdkQsTUFBTSxPQUFPLEdBQVUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLE1BQU0sSUFBSSxHQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsTUFBTSxXQUFXLEdBQXNCLE1BQUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxtQ0FBSSxFQUFFLENBQUM7SUFFckQsU0FBUyxDQUFDLE9BQU8sSUFBSSxLQUFLLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMzRixTQUFTLENBQ1AsT0FBTyxXQUFXLEtBQUssUUFBUSxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLEVBQ2xFLEdBQUcsRUFBRSxDQUFDLElBQUksaUJBQWlCLENBQUMsU0FBUyxFQUFFLG9CQUFvQixFQUFFLFdBQVcsQ0FBQyxDQUMxRSxDQUFDO0lBRUYsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLGlFQUFpRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUM5RjtJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsOENBQThDLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFMUcsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDNUIsUUFBUSxRQUFRLEVBQUU7WUFDaEIsS0FBSyxNQUFNO2dCQUNULE1BQU0sU0FBUyxHQUFrQixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQUEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxtQ0FBSSxFQUFFLENBQUMsQ0FBQztnQkFDeEcsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7Z0JBQ3ZELE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ25FLE1BQU07WUFDUixLQUFLLEtBQUs7Z0JBQ1IsTUFBTSxRQUFRLEdBQWtCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBQSxPQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLG1DQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUN0RyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztnQkFDdEQsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDakUsTUFBTTtTQUNUO0tBQ0Y7QUFDSCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDN0IsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFFL0Isd0JBQXdCO0FBQ3hCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO0FBQzdCLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDIn0=