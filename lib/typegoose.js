/* imports */
import * as mongoose from 'mongoose';
import 'reflect-metadata';
import * as semver from 'semver';
import { assertion, assertionIsClass, getName, isNullOrUndefined, mergeMetadata, mergeSchemaOptions } from './internal/utils.js';
/* istanbul ignore next */
if (!isNullOrUndefined(process === null || process === void 0 ? void 0 : process.version) && !isNullOrUndefined(mongoose === null || mongoose === void 0 ? void 0 : mongoose.version)) {
    // for usage on client side
    /* istanbul ignore next */
    if (semver.lt(mongoose === null || mongoose === void 0 ? void 0 : mongoose.version, '6.2.3')) {
        throw new Error(`Please use mongoose 6.2.3 or higher (Current mongoose: ${mongoose.version}) [E001]`);
    }
    /* istanbul ignore next */
    if (semver.lt(process.version.slice(1), '12.22.0')) {
        throw new Error('You are using a NodeJS Version below 12.22.0, Please Upgrade! [E002]');
    }
}
import { parseENV, setGlobalOptions } from './globalOptions.js';
import { DecoratorKeys } from './internal/constants.js';
import { constructors, models } from './internal/data.js';
import { _buildSchema } from './internal/schema.js';
import { logger } from './logSettings.js';
import { isModel } from './typeguards.js';
import { ExpectedTypeError, FunctionCalledMoreThanSupportedError, NotValidModelError } from './internal/errors.js';
/* exports */
// export the internally used "mongoose", to not need to always import it
export { mongoose, setGlobalOptions };
export { setLogLevel, LogLevels } from './logSettings.js';
export * from './prop.js';
export * from './hooks.js';
export * from './plugin.js';
export * from './index.js';
export * from './modelOptions.js';
export * from './queryMethod.js';
export * from './typeguards.js';
export * as defaultClasses from './defaultClasses.js';
export * as errors from './internal/errors.js';
export * as types from './types.js';
export { getClassForDocument, getClass, getName } from './internal/utils.js';
export { Severity, PropType } from './internal/constants.js';
parseENV(); // call this before anything to ensure they are applied
/**
 * Get a Model for a Class
 * @param cl The uninitialized Class
 * @returns The Model
 * @public
 * @example
 * ```ts
 * class ClassName {}
 *
 * const NameModel = getModelForClass(ClassName);
 * ```
 */
export function getModelForClass(cl, options) {
    var _a, _b, _c, _d, _e, _f;
    assertionIsClass(cl);
    options = typeof options === 'object' ? options : {};
    const roptions = mergeMetadata(DecoratorKeys.ModelOptions, options, cl);
    const name = getName(cl, options);
    if (models.has(name)) {
        return models.get(name);
    }
    const model = (_d = (_b = (_a = roptions === null || roptions === void 0 ? void 0 : roptions.existingConnection) === null || _a === void 0 ? void 0 : _a.model.bind(roptions.existingConnection)) !== null && _b !== void 0 ? _b : (_c = roptions === null || roptions === void 0 ? void 0 : roptions.existingMongoose) === null || _c === void 0 ? void 0 : _c.model.bind(roptions.existingMongoose)) !== null && _d !== void 0 ? _d : mongoose.model.bind(mongoose);
    const compiledmodel = model(name, buildSchema(cl, roptions.schemaOptions, options));
    const refetchedOptions = (_e = Reflect.getMetadata(DecoratorKeys.ModelOptions, cl)) !== null && _e !== void 0 ? _e : {};
    if ((_f = refetchedOptions === null || refetchedOptions === void 0 ? void 0 : refetchedOptions.options) === null || _f === void 0 ? void 0 : _f.runSyncIndexes) {
        // no async/await, to wait for execution on connection in the background
        compiledmodel.syncIndexes();
    }
    return addModelToTypegoose(compiledmodel, cl, {
        existingMongoose: roptions === null || roptions === void 0 ? void 0 : roptions.existingMongoose,
        existingConnection: roptions === null || roptions === void 0 ? void 0 : roptions.existingConnection,
    });
}
/**
 * Get Model from internal cache
 * @param key ModelName key
 * @example
 * ```ts
 * class ClassName {}
 * getModelForClass(ClassName); // build the model
 * const NameModel = getModelWithString<typeof ClassName>("ClassName");
 * ```
 */
export function getModelWithString(key) {
    assertion(typeof key === 'string', () => new ExpectedTypeError('key', 'string', key));
    return models.get(key);
}
/**
 * Generates a Mongoose schema out of class props, iterating through all parents
 * @param cl The not initialized Class
 * @returns Returns the Build Schema
 * @example
 * ```ts
 * class ClassName {}
 * const NameSchema = buildSchema(ClassName);
 * const NameModel = mongoose.model("Name", NameSchema);
 * ```
 */
export function buildSchema(cl, options, overwriteOptions) {
    assertionIsClass(cl);
    logger.debug('buildSchema called for "%s"', getName(cl, overwriteOptions));
    const mergedOptions = mergeSchemaOptions(options, cl);
    let sch = undefined;
    /** Parent Constructor */
    let parentCtor = Object.getPrototypeOf(cl.prototype).constructor;
    /* This array is to execute from lowest class to highest (when extending) */
    const parentClasses = [];
    // iterate trough all parents
    while ((parentCtor === null || parentCtor === void 0 ? void 0 : parentCtor.name) !== 'Object') {
        // add lower classes (when extending) to the front of the arrray to be processed first
        parentClasses.unshift(parentCtor);
        // set next parent
        parentCtor = Object.getPrototypeOf(parentCtor.prototype).constructor;
    }
    // iterate and build class schemas from lowest to highest (when extending classes, the lower class will get build first) see https://github.com/typegoose/typegoose/pull/243
    for (const parentClass of parentClasses) {
        // extend schema
        sch = _buildSchema(parentClass, sch, mergedOptions, false);
    }
    // get schema of current model
    sch = _buildSchema(cl, sch, mergedOptions, true, overwriteOptions);
    return sch;
}
/**
 * This can be used to add custom Models to Typegoose, with the type information of cl
 * Note: no gurantee that the type information is fully correct
 * @param model The model to store
 * @param cl The Class to store
 * @param options? Optional param for existingMongoose or existingConnection
 * @example
 * ```ts
 * class ClassName {}
 *
 * const schema = buildSchema(ClassName);
 * // modifications to the schame can be done
 * const model = addModelToTypegoose(mongoose.model("Name", schema), ClassName);
 * ```
 */
export function addModelToTypegoose(model, cl, options) {
    var _a, _b, _c;
    const mongooseModel = ((_a = options === null || options === void 0 ? void 0 : options.existingMongoose) === null || _a === void 0 ? void 0 : _a.Model) || ((_c = (_b = options === null || options === void 0 ? void 0 : options.existingConnection) === null || _b === void 0 ? void 0 : _b.base) === null || _c === void 0 ? void 0 : _c.Model) || mongoose.Model;
    assertion(model.prototype instanceof mongooseModel, new NotValidModelError(model, 'addModelToTypegoose.model'));
    assertionIsClass(cl);
    const name = model.modelName;
    assertion(!models.has(name), new FunctionCalledMoreThanSupportedError('addModelToTypegoose', 1, `This was caused because the model name "${name}" already exists in the typegoose-internal "models" cache`));
    if (constructors.get(name)) {
        logger.info('Class "%s" already existed in the constructors Map', name);
    }
    models.set(name, model);
    constructors.set(name, cl);
    return models.get(name);
}
/**
 * Deletes an existing model so that it can be overwritten with another model
 * (deletes from mongoose.connection & typegoose models cache & typegoose constructors cache)
 * @param name The Model's name
 * @example
 * ```ts
 * class ClassName {}
 * const NameModel = getModelForClass(ClassName);
 * deleteModel("ClassName");
 * ```
 */
export function deleteModel(name) {
    assertion(typeof name === 'string', () => new ExpectedTypeError('name', 'string', name));
    logger.debug('Deleting Model "%s"', name);
    const model = models.get(name);
    if (!isNullOrUndefined(model)) {
        model.db.deleteModel(name);
    }
    models.delete(name);
    constructors.delete(name);
}
/**
 * Delete a model, with the given class
 * Same as "deleteModel", only that it can be done with the class instead of the name
 * @param cl The Class
 * @example
 * ```ts
 * class ClassName {}
 * const NameModel = getModelForClass(ClassName);
 * deleteModelWithClass(ClassName);
 * ```
 */
export function deleteModelWithClass(cl) {
    assertionIsClass(cl);
    let name = getName(cl);
    if (!models.has(name)) {
        logger.debug(`Class "${name}" is not in "models", trying to find in "constructors"`);
        let found = false;
        // type "Map" does not have a "find" function, and using "get" would maybe result in the incorrect values
        for (const [cname, constructor] of constructors) {
            if (constructor === cl) {
                logger.debug(`Found Class in "constructors" with class name "${name}" and entered name "${cname}""`);
                name = cname;
                found = true;
            }
        }
        if (!found) {
            logger.debug(`Could not find class "${name}" in constructors`);
            return;
        }
    }
    return deleteModel(name);
}
/**
 * Build a Model from a given class and return the model
 * @param from The Model to build From
 * @param cl The Class to make a model out
 * @param value The Identifier to use to differentiate documents (default: cl.name)
 * @example
 * ```ts
 * class Class1 {}
 * class Class2 extends Class1 {}
 *
 * const Class1Model = getModelForClass(Class1);
 * const Class2Model = getDiscriminatorModelForClass(Class1Model, Class1);
 * ```
 */
export function getDiscriminatorModelForClass(from, cl, value) {
    assertion(isModel(from), new NotValidModelError(from, 'getDiscriminatorModelForClass.from'));
    assertionIsClass(cl);
    const name = getName(cl);
    if (models.has(name)) {
        return models.get(name);
    }
    const sch = buildSchema(cl);
    const discriminatorKey = sch.get('discriminatorKey');
    if (!!discriminatorKey && sch.path(discriminatorKey)) {
        sch.paths[discriminatorKey].options.$skipDiscriminatorCheck = true;
    }
    const model = from.discriminator(name, sch, value ? value : name);
    return addModelToTypegoose(model, cl);
}
/**
 * Use this class if raw mongoose for this path is wanted
 * It is still recommended to use the typegoose classes directly
 * @see Using `Passthrough`, the paths created will also result as an `Schema` (since mongoose 6.0), see {@link https://github.com/Automattic/mongoose/issues/7181 Mongoose#7181}
 * @example
 * ```ts
 * class Dummy {
 *   @prop({ type: () => new Passthrough({ somePath: String }) })
 *   public somepath: { somePath: string };
 * }
 *
 * class Dummy {
 *   @prop({ type: () => new Passthrough({ somePath: String }, true) })
 *   public somepath: { somePath: string };
 * }
 * ```
 */
export class Passthrough {
    /**
     * Use this like `new mongoose.Schema()`
     * @param raw The Schema definition
     * @param direct Directly insert "raw", instead of using "type" (this will not apply any other inner options)
     */
    constructor(raw, direct) {
        this.raw = raw;
        this.direct = direct !== null && direct !== void 0 ? direct : false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWdvb3NlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3R5cGVnb29zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxLQUFLLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDckMsT0FBTyxrQkFBa0IsQ0FBQztBQUMxQixPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVqSSwwQkFBMEI7QUFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxPQUFPLENBQUMsRUFBRTtJQUNqRiwyQkFBMkI7SUFDM0IsMEJBQTBCO0lBQzFCLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFO1FBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELFFBQVEsQ0FBQyxPQUFPLFVBQVUsQ0FBQyxDQUFDO0tBQ3ZHO0lBRUQsMEJBQTBCO0lBQzFCLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsRUFBRTtRQUNsRCxNQUFNLElBQUksS0FBSyxDQUFDLHNFQUFzRSxDQUFDLENBQUM7S0FDekY7Q0FDRjtBQUVELE9BQU8sRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFD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