import { intersection, mergeWith, omit } from 'lodash';
import * as mongoose from 'mongoose';
import { logger } from '../logSettings';
import { DecoratorKeys, Severity, PropType } from './constants';
import { constructors, globalOptions, schemas } from './data';
import { AssertionFallbackError, InvalidOptionsConstructorError, InvalidPropTypeError, NoValidClassError, ResolveTypegooseNameError, StringLengthExpectedError, } from './errors';
/**
 * Returns true, if the type is included in mongoose.Schema.Types
 * @param Type The Type
 * @returns true, if it includes it
 */
export function isPrimitive(Type) {
    if (typeof (Type === null || Type === void 0 ? void 0 : Type.name) === 'string') {
        // try to match "Type.name" with all the Property Names of "mongoose.Schema.Types"
        // (like "String" with "mongoose.Schema.Types.String")
        return (Object.getOwnPropertyNames(mongoose.Schema.Types).includes(Type.name) ||
            // try to match "Type.name" with all "mongoose.Schema.Types.*.name"
            // (like "SchemaString" with "mongoose.Schema.Types.String.name")
            Object.values(mongoose.Schema.Types).findIndex((v) => v.name === Type.name) >= 0);
    }
    return false;
}
/**
 * Returns true, if the type is included in mongoose.Schema.Types except the aliases
 * @param Type The Type
 * @returns true, if it includes it
 */
export function isAnRefType(Type) {
    if (typeof (Type === null || Type === void 0 ? void 0 : Type.name) === 'string') {
        // Note: this is not done "once" because types can be added as custom types
        const tmp = Object.getOwnPropertyNames(mongoose.Schema.Types).filter((x) => {
            switch (x) {
                case 'Oid':
                case 'Bool':
                case 'Object':
                case 'Boolean':
                    return false;
                default:
                    return true;
            }
        });
        // try to match "Type.name" with all the Property Names of "mongoose.Schema.Types" except the ones with aliases
        // (like "String" with "mongoose.Schema.Types.String")
        return (tmp.includes(Type.name) ||
            // try to match "Type.name" with all "mongoose.Schema.Types.*.name"
            // (like "SchemaString" with "mongoose.Schema.Types.String.name")
            Object.values(mongoose.Schema.Types).findIndex((v) => v.name === Type.name) >= 0);
    }
    return false;
}
/**
 * Returns true, if it is an Object
 * @param Type The Type
 * @param once Just run it once?
 * @returns true, if it is an Object
 */
export function isObject(Type, once = false) {
    if (typeof (Type === null || Type === void 0 ? void 0 : Type.name) === 'string') {
        let prototype = Type.prototype;
        let name = Type.name;
        while (name) {
            if (name === 'Object' || name === 'Mixed') {
                return true;
            }
            if (once) {
                break;
            }
            prototype = Object.getPrototypeOf(prototype);
            name = prototype === null || prototype === void 0 ? void 0 : prototype.constructor.name;
        }
    }
    return false;
}
/**
 * Returns true, if it is an Number
 * @param Type The Type
 * @returns true, if it is an Number
 */
export function isNumber(Type) {
    var _a;
    const name = (_a = Type === null || Type === void 0 ? void 0 : Type.name) !== null && _a !== void 0 ? _a : '';
    return name === 'Number' || name === mongoose.Schema.Types.Number.name;
}
/**
 * Returns true, if it is an String
 * @param Type The Type
 * @returns true, if it is an String
 */
export function isString(Type) {
    var _a;
    const name = (_a = Type === null || Type === void 0 ? void 0 : Type.name) !== null && _a !== void 0 ? _a : '';
    return name === 'String' || name === mongoose.Schema.Types.String.name;
}
/**
 * Initialize the property in the schemas Map
 * @param name Name of the current Model/Class
 * @param key Key of the property
 * @param proptype What should it be for a type?
 */
export function initProperty(name, key, proptype) {
    const schemaProp = !schemas.has(name) ? schemas.set(name, {}).get(name) : schemas.get(name);
    switch (proptype) {
        case PropType.ARRAY:
            schemaProp[key] = [{}];
            break;
        case PropType.MAP:
        case PropType.NONE:
            schemaProp[key] = {};
            break;
        default:
            throw new InvalidPropTypeError(proptype, name, key, 'PropType(initProperty)');
    }
    return schemaProp;
}
/**
 * Get the Class for a given Document
 * @param document The Document
 */
export function getClassForDocument(document) {
    const modelName = document.constructor.modelName;
    return constructors.get(modelName);
}
/**
 * Get the Class for a given Schema
 * @param input
 */
export function getClass(input) {
    if (typeof input === 'string') {
        return constructors.get(input);
    }
    if (typeof (input === null || input === void 0 ? void 0 : input.typegooseName) === 'string') {
        return constructors.get(input.typegooseName);
    }
    if (typeof (input === null || input === void 0 ? void 0 : input.typegooseName) === 'function') {
        return constructors.get(input.typegooseName());
    }
    throw new ResolveTypegooseNameError(input);
}
/**
 * Return an array of options that are included
 * @param options The raw Options
 */
export function isWithStringValidate(options) {
    return intersection(Object.keys(options), ['match', 'minlength', 'maxlength']);
}
/**
 * Return an array of options that are included
 * @param options The raw Options
 */
export function isWithStringTransform(options) {
    return intersection(Object.keys(options), ['lowercase', 'uppercase', 'trim']);
}
/**
 * Return an array of options that are included
 * @param options The raw Options
 */
export function isWithNumberValidate(options) {
    return intersection(Object.keys(options), ['min', 'max']);
}
/**
 * Return an array of options that are included
 * @param options The raw Options
 */
export function isWithEnumValidate(options) {
    return intersection(Object.keys(options), ['enum']);
}
const virtualOptions = ['localField', 'foreignField'];
/**
 * Check if Options include Virtual Populate Options
 * @param options RawOptions of the Prop
 */
export function isWithVirtualPOP(options) {
    return Object.keys(options).some((v) => virtualOptions.includes(v));
}
export const allVirtualoptions = virtualOptions.slice(0); // copy "virtualOptions" array
allVirtualoptions.push('ref');
/**
 * Check if all the required Options are present
 * @param options RawOptions of the Prop
 */
export function includesAllVirtualPOP(options) {
    return allVirtualoptions.every((v) => Object.keys(options).includes(v));
}
/**
 * Merge value & existing Metadata & Save it to the class
 * Difference with "mergeMetadata" is that this one DOES save it to the class
 * @param key Metadata key
 * @param value Raw value
 * @param cl The constructor
 * @internal
 */
export function assignMetadata(key, value, cl) {
    if (isNullOrUndefined(value)) {
        return value;
    }
    const newValue = mergeMetadata(key, value, cl);
    Reflect.defineMetadata(key, newValue, cl);
    return newValue;
}
/**
 * Merge value & existing Metadata
 * Difference with "assignMetadata" is that this one DOES NOT save it to the class
 * @param key Metadata key
 * @param value Raw value
 * @param cl The constructor
 * @internal
 */
export function mergeMetadata(key, value, cl) {
    assertion(typeof key === 'string' && key.length > 0, () => new StringLengthExpectedError(1, key, getName(cl), 'key'));
    assertionIsClass(cl);
    // Please don't remove the other values from the function, even when unused - it is made to be clear what is what
    return mergeWith({}, Reflect.getMetadata(key, cl), value, (_objValue, srcValue, ckey) => customMerger(ckey, srcValue));
}
/**
 * Used for lodash customizer's (cloneWith, cloneDeepWith, mergeWith)
 * @param key the key of the current object
 * @param val the value of the object that should get returned for "existingMongoose" & "existingConnection"
 */
function customMerger(key, val) {
    if (typeof key !== 'string') {
        return undefined;
    }
    if (/^(existingMongoose|existingConnection)$/.test(key)) {
        return val;
    }
    return undefined;
}
/**
 * Merge only schemaOptions from ModelOptions of the class
 * @param value The value to use
 * @param cl The Class to get the values from
 */
export function mergeSchemaOptions(value, cl) {
    return mergeMetadata(DecoratorKeys.ModelOptions, { schemaOptions: value }, cl).schemaOptions;
}
/**
 * Tries to return the right target
 * if target.constructor.name is "Function", return target, otherwise target.constructor
 * @param target The target to determine
 */
export function getRightTarget(target) {
    var _a;
    return ((_a = target.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Function' ? target : target.constructor;
}
/**
 * Get the correct name of the class's model
 * (with suffix)
 * @param cl The Class
 * @param customOptions Extra Options that can be added in "buildSchema"
 */
export function getName(cl, customOptions) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    // this case (cl being undefined / null) can happen when type casting (or type being "any") happened and wanting to throw a Error (and there using "getName" to help)
    // check if input variable is undefined, if it is throw a error (cannot be combined with the error below because of "getRightTarget")
    assertion(!isNullOrUndefined(cl), () => new NoValidClassError(cl));
    const ctor = getRightTarget(cl);
    assertion(isConstructor(ctor), () => new NoValidClassError(ctor));
    const options = (_a = Reflect.getMetadata(DecoratorKeys.ModelOptions, ctor)) !== null && _a !== void 0 ? _a : {};
    const baseName = ctor.name;
    const customName = (_c = (_b = customOptions === null || customOptions === void 0 ? void 0 : customOptions.options) === null || _b === void 0 ? void 0 : _b.customName) !== null && _c !== void 0 ? _c : (_d = options.options) === null || _d === void 0 ? void 0 : _d.customName;
    if (typeof customName === 'function') {
        const name = customName(options);
        assertion(typeof name === 'string' && name.length > 0, () => new StringLengthExpectedError(1, name, baseName, 'options.customName(function)'));
        return name;
    }
    const automaticName = (_f = (_e = customOptions === null || customOptions === void 0 ? void 0 : customOptions.options) === null || _e === void 0 ? void 0 : _e.automaticName) !== null && _f !== void 0 ? _f : (_g = options.options) === null || _g === void 0 ? void 0 : _g.automaticName;
    if (automaticName) {
        const suffix = (_j = customName !== null && customName !== void 0 ? customName : (_h = customOptions === null || customOptions === void 0 ? void 0 : customOptions.schemaOptions) === null || _h === void 0 ? void 0 : _h.collection) !== null && _j !== void 0 ? _j : (_k = options.schemaOptions) === null || _k === void 0 ? void 0 : _k.collection;
        return !isNullOrUndefined(suffix) ? `${baseName}_${suffix}` : baseName;
    }
    if (isNullOrUndefined(customName)) {
        return baseName;
    }
    assertion(typeof customName === 'string' && customName.length > 0, () => new StringLengthExpectedError(1, customName, baseName, 'options.customName'));
    return customName;
}
/**
 * Returns if it is not defined in "schemas"
 * @param cl The Type
 */
export function isNotDefined(cl) {
    return typeof cl === 'function' && !isPrimitive(cl) && cl !== Object && !schemas.has(getName(cl));
}
/**
 * Map Options to "inner" & "outer"
 * -> inner: means inner of "type: [{here})"
 * -> outer: means outer of "type: [{}], here"
 *
 * Specific to Arrays
 * @param rawOptions The raw options
 * @param Type The Type of the array
 * @param target The Target class
 * @param pkey Key of the Property
 * @param loggerType Type to use for logging
 */
export function mapArrayOptions(rawOptions, Type, target, pkey, loggerType, extra) {
    logger.debug('mapArrayOptions called');
    loggerType = loggerType !== null && loggerType !== void 0 ? loggerType : Type;
    if (!(Type instanceof mongoose.Schema)) {
        loggerType = Type;
    }
    const dim = rawOptions.dim; // needed, otherwise it will be included (and not removed) in the returnObject
    delete rawOptions.dim;
    const mapped = mapOptions(rawOptions, Type, target, pkey, loggerType);
    /** The Object that gets returned */
    const returnObject = Object.assign(Object.assign({}, mapped.outer), { type: [
            Object.assign(Object.assign({ type: Type }, mapped.inner), extra),
        ] });
    rawOptions.dim = dim; // re-add for "createArrayFromDimensions"
    returnObject.type = createArrayFromDimensions(rawOptions, returnObject.type, getName(target), pkey);
    if (loggerType) {
        logger.debug('(Array) Final mapped Options for Type "%s"', getName(loggerType), returnObject);
    }
    return returnObject;
}
/**
 * Map Options to "inner" & "outer"
 * @param rawOptions The raw options
 * @param Type The Type of the array
 * @param target The Target class
 * @param pkey Key of the Property
 * @param loggerType Type to use for logging
 */
export function mapOptions(rawOptions, Type, target, pkey, loggerType) {
    var _a;
    logger.debug('mapOptions called');
    loggerType = loggerType !== null && loggerType !== void 0 ? loggerType : Type;
    /** The Object that gets returned */
    const ret = {
        inner: {},
        outer: {},
    };
    // if Type is not a Schema, try to convert js type to mongoose type (Object => Mixed)
    if (!(Type instanceof mongoose.Schema)) {
        // set the loggerType to the js type
        loggerType = Type;
        const loggerTypeName = getName(loggerType);
        if (loggerTypeName in mongoose.Schema.Types) {
            logger.info('Converting "%s" to mongoose Type', loggerTypeName);
            Type = mongoose.Schema.Types[loggerTypeName];
            if (Type === mongoose.Schema.Types.Mixed) {
                warnMixed(target, pkey);
            }
        }
    }
    if (isNullOrUndefined(loggerType)) {
        logger.info('mapOptions loggerType is undefined!');
    }
    /** The OptionsConstructor to use */
    let OptionsCTOR = (_a = Type === null || Type === void 0 ? void 0 : Type.prototype) === null || _a === void 0 ? void 0 : _a.OptionsConstructor;
    if (Type instanceof mongoose.Schema) {
        OptionsCTOR = mongoose.Schema.Types.Subdocument.prototype.OptionsConstructor;
    }
    assertion(!isNullOrUndefined(OptionsCTOR), () => new InvalidOptionsConstructorError(getName(target), pkey, loggerType));
    const options = Object.assign({}, rawOptions); // for sanity
    if (OptionsCTOR.prototype instanceof mongoose.SchemaTypeOptions) {
        for (const [key, value] of Object.entries(options)) {
            if (Object.getOwnPropertyNames(OptionsCTOR.prototype).includes(key)) {
                ret.inner[key] = value;
            }
            else {
                ret.outer[key] = value;
            }
        }
    }
    else {
        if (loggerType) {
            logger.info('The Type "%s" has a property "OptionsConstructor" but it does not extend "SchemaTypeOptions"', getName(loggerType));
        }
        ret.outer = options;
    }
    if (typeof (options === null || options === void 0 ? void 0 : options.innerOptions) === 'object') {
        delete ret.outer.innerOptions;
        for (const [key, value] of Object.entries(options.innerOptions)) {
            ret.inner[key] = value;
        }
    }
    if (typeof (options === null || options === void 0 ? void 0 : options.outerOptions) === 'object') {
        delete ret.outer.outerOptions;
        for (const [key, value] of Object.entries(options.outerOptions)) {
            ret.outer[key] = value;
        }
    }
    if (loggerType) {
        logger.debug('Final mapped Options for Type "%s"', getName(loggerType), ret);
    }
    return ret;
}
/**
 * Warn, Error or Allow if an mixed type is set
 * -> this function exists for de-duplication
 * @param target Target Class
 * @param key Property key
 */
export function warnMixed(target, key) {
    var _a, _b;
    const name = getName(target);
    const modelOptions = (_a = Reflect.getMetadata(DecoratorKeys.ModelOptions, getRightTarget(target))) !== null && _a !== void 0 ? _a : {};
    switch ((_b = modelOptions.options) === null || _b === void 0 ? void 0 : _b.allowMixed) {
        default:
        case Severity.WARN:
            logger.debug('warnMixed: modelOptions:', modelOptions);
            logger.warn('Setting "Mixed" for property "%s.%s"\nLook here for how to disable this message: https://typegoose.github.io/typegoose/docs/api/decorators/model-options/#allowmixed', name, key);
            break;
        case Severity.ALLOW:
            break;
        case Severity.ERROR:
            throw new TypeError(`Setting "Mixed" is not allowed! (${name}, ${key}) [E017]`);
    }
    return; // always return, if "allowMixed" is not "ERROR"
}
/**
 * Because since node 4.0.0 the internal util.is* functions got deprecated
 * @param val Any value to test if null or undefined
 */
export function isNullOrUndefined(val) {
    return val === null || val === undefined;
}
/**
 * Assign Global ModelOptions if not already existing
 * @param target Target Class
 */
export function assignGlobalModelOptions(target) {
    if (isNullOrUndefined(Reflect.getMetadata(DecoratorKeys.ModelOptions, target))) {
        logger.info('Assigning global Schema Options to "%s"', getName(target));
        assignMetadata(DecoratorKeys.ModelOptions, omit(globalOptions, 'globalOptions'), target);
    }
}
/**
 * Loop over "dimensions" and create an array from that
 * @param rawOptions baseProp's rawOptions
 * @param extra What is actually in the deepest array
 * @param name name of the target for better error logging
 * @param key key of target-key for better error logging
 */
export function createArrayFromDimensions(rawOptions, extra, name, key) {
    // dimensions start at 1 (not 0)
    const dim = typeof rawOptions.dim === 'number' ? rawOptions.dim : 1;
    if (dim < 1) {
        throw new RangeError(`"dim" needs to be higher than 0 (${name}.${key}) [E018]`);
    }
    delete rawOptions.dim; // delete this property to not actually put it as an option
    logger.info('createArrayFromDimensions called with %d dimensions', dim);
    let retArray = Array.isArray(extra) ? extra : [extra];
    // index starts at 1 because "retArray" is already once wrapped in an array
    for (let index = 1; index < dim; index++) {
        retArray = [retArray];
    }
    return retArray;
}
/**
 * Assert an condition, if "false" throw error
 * Note: it is not named "assert" to differentiate between node and jest types
 *
 * Note: "error" can be a function to not execute the constructor when not needed
 * @param cond The Condition to throw
 * @param error An Custom Error to throw or a function that returns a Error
 */
export function assertion(cond, error) {
    if (!cond) {
        throw typeof error === 'function' ? error() : error !== null && error !== void 0 ? error : new AssertionFallbackError();
    }
}
/**
 * Assert if val is an function (constructor for classes)
 * @param val Value to test
 */
export function assertionIsClass(val) {
    assertion(isConstructor(val), () => new NoValidClassError(val));
}
/**
 * Get Type, if input is an arrow-function, execute it and return the result
 * @param typeOrFunc Function or Type
 * @param returnLastFoundArray Return the last found array (used for something like PropOptions.discriminators)
 */
export function getType(typeOrFunc, returnLastFoundArray = false) {
    const returnObject = {
        type: typeOrFunc,
        dim: 0,
    };
    if (typeof returnObject.type === 'function' && !isConstructor(returnObject.type)) {
        returnObject.type = returnObject.type();
    }
    function getDepth() {
        if (returnObject.dim > 100) {
            // this is arbitrary, but why would anyone have more than 10 nested arrays anyway?
            throw new Error('getDepth recursed too much (dim > 100)');
        }
        if (Array.isArray(returnObject.type)) {
            returnObject.dim++;
            if (returnLastFoundArray && !Array.isArray(returnObject.type[0])) {
                return;
            }
            returnObject.type = returnObject.type[0];
            getDepth();
        }
    }
    getDepth();
    logger.debug('Final getType: dim: %s, type:', returnObject.dim, returnObject.type);
    return returnObject;
}
/**
 * Is the provided input an class with an constructor?
 */
export function isConstructor(obj) {
    var _a, _b;
    return typeof obj === 'function' && !isNullOrUndefined((_b = (_a = obj.prototype) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name);
}
// /**
//  * Execute util.deprecate or when "process" does not exist use "console.log"
//  * (if "process" does not exist, the codes are not cached, and are always logged again)
//  * This Function is here to try to make typegoose compatible with the browser (see https://github.com/typegoose/typegoose/issues/33)
//  */
// eslint-disable-next-line @typescript-eslint/ban-types
// export function deprecate<T extends Function>(fn: T, message: string, code: string): T {
//   if (!isNullOrUndefined(process)) {
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     return require('util').deprecate(fn, message, code);
//   }
//   console.log(`[${code}] DeprecationWarning: ${message}`);
//   return fn;
// }
/**
 * Logs an warning if "included > 0" that the options of not the current type are included
 * @param name Name of the Class
 * @param key Name of the Currently Processed key
 * @param type Name of the Expected Type
 * @param extra Extra string to be included
 * @param included Included Options to be listed
 */
export function warnNotCorrectTypeOptions(name, key, type, extra, included) {
    // this "if" is in this function to de-duplicate code
    if (included.length > 0) {
        logger.warn(`Type of "${name}.${key}" is not ${type}, but includes the following ${extra} options [W001]:\n` + `  [${included.join(', ')}]`);
    }
}
/**
 * Try to convert input "value" to a String, without it failing
 * @param value The Value to convert to String
 * @returns A String, either "value.toString" or a placeholder
 */
export function toStringNoFail(value) {
    try {
        return String(value);
    }
    catch (_) {
        return '(Error: Converting value to String failed)';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW50ZXJuYWwvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ3ZELE9BQU8sS0FBSyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQWV4QyxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDaEUsT0FBTyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQzlELE9BQU8sRUFDTCxzQkFBc0IsRUFDdEIsOEJBQThCLEVBQzlCLG9CQUFvQixFQUNwQixpQkFBaUIsRUFDakIseUJBQXlCLEVBQ3pCLHlCQUF5QixHQUMxQixNQUFNLFVBQVUsQ0FBQztBQUVsQjs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FBQyxJQUFTO0lBQ25DLElBQUksT0FBTyxDQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxJQUFJLENBQUEsS0FBSyxRQUFRLEVBQUU7UUFDbEMsa0ZBQWtGO1FBQ2xGLHNEQUFzRDtRQUN0RCxPQUFPLENBQ0wsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDckUsbUVBQW1FO1lBQ25FLGlFQUFpRTtZQUNqRSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxD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