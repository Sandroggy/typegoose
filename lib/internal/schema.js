import * as mongoose from 'mongoose';
import { logger } from '../logSettings';
import { buildSchema } from '../typegoose';
import { DecoratorKeys } from './constants';
import { constructors, schemas } from './data';
import { NoDiscriminatorFunctionError, PathNotInSchemaError } from './errors';
import { processProp } from './processProp';
import { assertion, assertionIsClass, assignGlobalModelOptions, getName, isNullOrUndefined, mergeSchemaOptions } from './utils';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ludGVybmFsL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUNyQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQVkzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQy9DLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUM5RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsd0JBQXdCLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRWhJOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQzFCLEVBQUssRUFDTCxPQUE4QixFQUM5QixHQUE0QixFQUM1QixnQkFBeUIsSUFBSSxFQUM3QixnQkFBZ0M7O0lBRWhDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRXJCLHdCQUF3QixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsNERBQTREO0lBRTFGLHVCQUF1QjtJQUN2QixHQUFHLEdBQUcsa0JBQWtCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUUzRiwyR0FBMkc7SUFDM0csTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEVBQUUs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