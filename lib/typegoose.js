/* imports */
import * as mongoose from 'mongoose';
import 'reflect-metadata';
import * as semver from 'semver';
import { assertion, assertionIsClass, getName, isNullOrUndefined, mergeMetadata, mergeSchemaOptions } from './internal/utils';
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
import { parseENV, setGlobalOptions } from './globalOptions';
import { DecoratorKeys } from './internal/constants';
import { constructors, models } from './internal/data';
import { _buildSchema } from './internal/schema';
import { logger } from './logSettings';
import { isModel } from './typeguards';
import { ExpectedTypeError, FunctionCalledMoreThanSupportedError, NotValidModelError } from './internal/errors';
/* exports */
// export the internally used "mongoose", to not need to always import it
export { mongoose, setGlobalOptions };
export { setLogLevel, LogLevels } from './logSettings';
export * from './prop';
export * from './hooks';
export * from './plugin';
export * from './index';
export * from './modelOptions';
export * from './queryMethod';
export * from './typeguards';
export * as defaultClasses from './defaultClasses';
export * as errors from './internal/errors';
export * as types from './types';
export { getClassForDocument, getClass, getName } from './internal/utils';
export { Severity, PropType } from './internal/constants';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWdvb3NlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3R5cGVnb29zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxLQUFLLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDckMsT0FBTyxrQkFBa0IsQ0FBQztBQUMxQixPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU5SCwwQkFBMEI7QUFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxPQUFPLENBQUMsRUFBRTtJQUNqRiwyQkFBMkI7SUFDM0IsMEJBQTBCO0lBQzFCLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFO1FBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELFFBQVEsQ0FBQyxPQUFPLFVBQVUsQ0FBQyxDQUFDO0tBQ3ZHO0lBRUQsMEJBQTBCO0lBQzFCLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsRUFBRTtRQUNsRCxNQUFNLElBQUksS0FBSyxDQUFDLHNFQUFzRSxDQUFDLENBQUM7S0FDekY7Q0FDRjtBQUVELE9BQU8sRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFD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