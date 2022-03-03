import * as mongoose from 'mongoose';
import { logger } from '../logSettings';
import { buildSchema } from '../typegoose';
import { DecoratorKeys } from './constants.js';
import { constructors, schemas } from './data.js';
import { NoDiscriminatorFunctionError, PathNotInSchemaError } from './errors.js';
import { processProp } from './processProp.js';
import { assertion, assertionIsClass, assignGlobalModelOptions, getName, isNullOrUndefined, mergeSchemaOptions } from './utils.js';
/**
 * Private schema builder out of class props
 * -> If you discover this, don't use this function, use Typegoose.buildSchema!
 * @param cl The not initialized Class
 * @param sch Use a Already existing Schema as a base?
 * @param opt Options to override
 * @param isFinalSchema If it's the final schema to be built (defaults to `true`).
 * @returns Returns the Build Schema
 * @private
 */
export function _buildSchema(cl, origSch, opt, isFinalSchema = true, overwriteOptions) {
    var _a, _b;
    assertionIsClass(cl);
    assignGlobalModelOptions(cl); // to ensure global options are applied to the current class
    // Options sanity check
    opt = mergeSchemaOptions(isNullOrUndefined(opt) || typeof opt !== 'object' ? {} : opt, cl);
    /** used, because when trying to resolve an child, the overwriteOptions for that child are not available */
    const className = getName(cl);
    const finalName = getName(cl, overwriteOptions);
    logger.debug('_buildSchema Called for %s with options:', finalName, opt);
    /** Simplify the usage */
    const Schema = mongoose.Schema;
    const ropt = (_a = Reflect.getMetadata(DecoratorKeys.ModelOptions, cl)) !== null && _a !== void 0 ? _a : {};
    const schemaOptions = Object.assign({}, (_b = ropt === null || ropt === void 0 ? void 0 : ropt.schemaOptions) !== null && _b !== void 0 ? _b : {}, opt);
    const decorators = Reflect.getMetadata(DecoratorKeys.PropCache, cl.prototype);
    if (!isNullOrUndefined(decorators)) {
        for (const decorator of decorators.values()) {
            processProp(decorator);
        }
    }
    if (!schemas.has(className)) {
        schemas.set(className, {});
    }
    let sch;
    if (!(origSch instanceof Schema)) {
        sch = new Schema(schemas.get(className), schemaOptions);
    }
    else {
        sch = origSch.clone();
        sch.add(schemas.get(className));
    }
    sch.loadClass(cl);
    if (isFinalSchema) {
        /** Get Metadata for Nested Discriminators */
        const disMap = Reflect.getMetadata(DecoratorKeys.NestedDiscriminators, cl);
        if (disMap instanceof Map) {
            for (const [key, discriminators] of disMap) {
                logger.debug('Applying Nested Discriminators for:', key, discriminators);
                const path = sch.path(key);
                // TODO: add test for this error
                assertion(!isNullOrUndefined(path), () => new PathNotInSchemaError(finalName, key));
                // TODO: add test for this error
                assertion(typeof path.discriminator === 'function', () => new NoDiscriminatorFunctionError(finalName, key));
                for (const { type: child, value: childName } of discriminators) {
                    const childSch = getName(child) === finalName ? sch : buildSchema(child);
                    const discriminatorKey = childSch.get('discriminatorKey');
                    if (!!discriminatorKey && childSch.path(discriminatorKey)) {
                        // skip this check, otherwise "extends DiscriminatorBase" would not be allowed (discriminators cannot have the discriminator key defined multiple times)
                        childSch.paths[discriminatorKey].options.$skipDiscriminatorCheck = true;
                    }
                    path.discriminator(getName(child), childSch, childName);
                }
            }
        }
        // Hooks
        {
            /** Get Metadata for PreHooks */
            const preHooks = Reflect.getMetadata(DecoratorKeys.HooksPre, cl);
            if (Array.isArray(preHooks)) {
                preHooks.forEach((obj) => sch.pre(obj.method, obj.options, obj.func));
            }
            /** Get Metadata for PreHooks */
            const postHooks = Reflect.getMetadata(DecoratorKeys.HooksPost, cl);
            if (Array.isArray(postHooks)) {
                postHooks.forEach((obj) => sch.post(obj.method, obj.options, obj.func));
            }
        }
        /** Get Metadata for Virtual Populates */
        const virtuals = Reflect.getMetadata(DecoratorKeys.VirtualPopulate, cl);
        if (virtuals instanceof Map) {
            for (const [key, options] of virtuals) {
                logger.debug('Applying Virtual Populates:', key, options);
                sch.virtual(key, options);
            }
        }
        /** Get Metadata for indices */
        const indices = Reflect.getMetadata(DecoratorKeys.Index, cl);
        if (Array.isArray(indices)) {
            for (const index of indices) {
                logger.debug('Applying Index:', index);
                sch.index(index.fields, index.options);
            }
        }
        /** Get Metadata for Query Methods */
        const queryMethods = Reflect.getMetadata(DecoratorKeys.QueryMethod, cl);
        if (queryMethods instanceof Map) {
            for (const [funcName, func] of queryMethods) {
                logger.debug('Applying Query Method:', funcName, func);
                sch.query[funcName] = func;
            }
        }
        /** Get Metadata for indices */
        const plugins = Reflect.getMetadata(DecoratorKeys.Plugins, cl);
        if (Array.isArray(plugins)) {
            for (const plugin of plugins) {
                logger.debug('Applying Plugin:', plugin);
                sch.plugin(plugin.mongoosePlugin, plugin.options);
            }
        }
        // this method is to get the typegoose name of the model/class if it is user-handled (like buildSchema, then manually mongoose.model)
        sch.method('typegooseName', () => {
            return finalName;
        });
    }
    // add the class to the constructors map
    constructors.set(finalName, cl);
    return sch;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ludGVybmFsL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUNyQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQVkzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEQsT0FBTyxFQUFFLDRCQUE0QixFQUFFLG9CQUFvQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLHdCQUF3QixFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUVuSTs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUMxQixFQUFLLEVBQ0wsT0FBOEIsRUFDOUIsR0FBNEIsRUFDNUIsZ0JBQXlCLElBQUksRUFDN0IsZ0JBQWdDOztJQUVoQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVyQix3QkFBd0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDREQUE0RDtJQUUxRix1QkFBdUI7SUFDdkIsR0FBRyxHQUFHLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFM0YsMkdBQTJHO0lBQzNHLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxF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