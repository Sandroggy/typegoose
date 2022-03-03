import { __rest } from "tslib";
import { logger } from '../logSettings';
import { buildSchema, mongoose, Passthrough } from '../typegoose';
import { DecoratorKeys, PropType } from './constants.js';
import { schemas } from './data.js';
import { CannotBeSymbolError, InvalidEnumTypeError, InvalidTypeError, InvalidPropTypeError, NotAllVPOPElementsError, NotNumberTypeError, NotStringTypeError, OptionDoesNotSupportOptionError, RefOptionIsUndefinedError, SelfContainingClassError, StringLengthExpectedError, } from './errors.js';
import * as utils from './utils.js';
/**
 * Function that is the actual processing of the prop's (used for caching)
 * @param input All the options needed for prop's
 */
export function processProp(input) {
    var _a, _b, _c;
    const { key, target } = input;
    const name = utils.getName(target);
    const rawOptions = Object.assign({}, input.options);
    let Type = Reflect.getMetadata(DecoratorKeys.Type, target, key);
    const propKind = (_a = input.whatis) !== null && _a !== void 0 ? _a : detectPropType(Type);
    logger.debug('Starting to process "%s.%s"', name, key);
    utils.assertion(typeof key === 'string', () => new CannotBeSymbolError(name, key));
    // optionDeprecation(rawOptions);
    {
        // soft errors & "type"-alias mapping
        switch (propKind) {
            case PropType.NONE:
                break;
            case PropType.MAP:
            case PropType.ARRAY:
                // set the "Type" to undefined if "ref" or "refPath" are defined, as an fallback in case "type" is also not defined
                if (('ref' in rawOptions || 'refPath' in rawOptions) && !('type' in rawOptions)) {
                    Type = undefined;
                }
                break;
        }
    }
    if (!utils.isNullOrUndefined(rawOptions.type)) {
        logger.info('Prop Option "type" is set to ', rawOptions.type);
        const gotType = utils.getType(rawOptions.type);
        Type = gotType.type;
        if (gotType.dim > 0) {
            rawOptions.dim = gotType.dim;
        }
        delete rawOptions.type;
    }
    // prevent "infinite" buildSchema loop / Maximum Stack size exceeded
    if (Type === target.constructor) {
        throw new SelfContainingClassError(name, key);
    }
    // map to correct buffer type, otherwise it would result in "Mixed"
    if (Type === mongoose.Types.Buffer) {
        Type = mongoose.Schema.Types.Buffer;
    }
    // confirm that "PropType" is an ARRAY and if that the Type is still an *ARRAY, set them to Mixed
    // for issues like https://github.com/typegoose/typegoose/issues/300
    if (propKind === PropType.ARRAY && detectPropType(Type) === PropType.ARRAY) {
        logger.debug('Type is still *ARRAY, defaulting to Mixed');
        Type = mongoose.Schema.Types.Mixed;
    }
    // confirm that "PropType" is an MAP and if that the Type is still an *MAP, set them to Mixed
    if (propKind === PropType.MAP && detectPropType(Type) === PropType.MAP) {
        logger.debug('Type is still *Map, defaulting to Mixed');
        Type = mongoose.Schema.Types.Mixed;
    }
    if (utils.isNotDefined(Type)) {
        buildSchema(Type);
    }
    if ('discriminators' in rawOptions) {
        logger.debug('Found option "discriminators" in "%s.%s"', name, key);
        const gotType = utils.getType(rawOptions.discriminators, true);
        utils.assertion(gotType.dim === 1, () => new OptionDoesNotSupportOptionError('discriminators', 'dim', '1', `dim: ${gotType.dim}`));
        const discriminators = gotType.type.map((val, index) => {
            if (utils.isConstructor(val)) {
                return { type: val };
            }
            if (typeof val === 'object') {
                if (!('type' in val)) {
                    throw new Error(`"${name}.${key}" discriminator index "${index}" is an object, but does not contain the "type" property!`);
                }
                return val;
            }
            throw new Error(`"${name}.${key}" discriminators index "${index}" is not an object or an constructor!`);
        });
        const disMap = new Map((_b = Reflect.getMetadata(DecoratorKeys.NestedDiscriminators, target.constructor)) !== null && _b !== void 0 ? _b : []);
        disMap.set(key, discriminators);
        Reflect.defineMetadata(DecoratorKeys.NestedDiscriminators, disMap, target.constructor);
        delete rawOptions.discriminators;
    }
    // allow setting the type asynchronously
    if ('ref' in rawOptions) {
        const gotType = utils.getType(rawOptions.ref);
        utils.assertion(gotType.dim === 0, () => new OptionDoesNotSupportOptionError('ref', 'dim', '0', `dim: ${gotType.dim}`));
        rawOptions.ref = gotType.type;
        utils.assertion(!utils.isNullOrUndefined(rawOptions.ref), () => new RefOptionIsUndefinedError(name, key));
        rawOptions.ref =
            typeof rawOptions.ref === 'string'
                ? rawOptions.ref
                : utils.isConstructor(rawOptions.ref)
                    ? utils.getName(rawOptions.ref)
                    : rawOptions.ref;
    }
    if (utils.isWithVirtualPOP(rawOptions)) {
        if (!utils.includesAllVirtualPOP(rawOptions)) {
            throw new NotAllVPOPElementsError(name, key);
        }
        const virtuals = new Map((_c = Reflect.getMetadata(DecoratorKeys.VirtualPopulate, target.constructor)) !== null && _c !== void 0 ? _c : []);
        virtuals.set(key, rawOptions);
        Reflect.defineMetadata(DecoratorKeys.VirtualPopulate, virtuals, target.constructor);
        return;
    }
    if ('justOne' in rawOptions) {
        logger.warn(`Option "justOne" is defined in "${name}.${key}" but no Virtual-Populate-Options!\n` +
            'Look here for more: https://typegoose.github.io/typegoose/docs/api/virtuals#virtual-populate');
    }
    const schemaProp = utils.initProperty(name, key, propKind);
    // do this early, because the other options (enum, ref, refPath, discriminators) should not matter for this one
    if (Type instanceof Passthrough) {
        logger.debug('Type is "instanceof Passthrough" ("%s.%s", %s, direct: %s)', name, key, propKind, Type.direct);
        // this is because the check above narrows down the type, which somehow is not compatible
        const newType = Type.raw;
        if (Type.direct) {
            schemaProp[key] = newType;
            return;
        }
        switch (propKind) {
            case PropType.ARRAY:
                schemaProp[key] = utils.mapArrayOptions(rawOptions, newType, target, key);
                return;
            case PropType.MAP:
                const mapped = utils.mapOptions(rawOptions, newType, target, key);
                schemaProp[key] = Object.assign(Object.assign({}, mapped.outer), { type: Map, of: Object.assign({ type: newType }, mapped.inner) });
                return;
            case PropType.NONE:
                schemaProp[key] = Object.assign(Object.assign({}, rawOptions), { type: newType });
                return;
            default:
                throw new InvalidPropTypeError(propKind, name, key, 'PropType(Passthrough)');
        }
    }
    // use "Type" if it is an suitable ref-type, otherwise default back to "ObjectId"
    const refType = utils.isAnRefType(Type) ? Type : mongoose.Schema.Types.ObjectId;
    if ('ref' in rawOptions) {
        const ref = rawOptions.ref;
        delete rawOptions.ref;
        switch (propKind) {
            case PropType.ARRAY:
                schemaProp[key] = utils.mapArrayOptions(rawOptions, refType, target, key, undefined, { ref });
                break;
            case PropType.NONE:
                schemaProp[key] = Object.assign({ type: refType, ref }, rawOptions);
                break;
            case PropType.MAP:
                const mapped = utils.mapOptions(rawOptions, refType, target, key);
                schemaProp[key] = Object.assign(Object.assign({}, mapped.outer), { type: Map, of: Object.assign({ type: refType, ref }, mapped.inner) });
                break;
            default:
                throw new InvalidPropTypeError(propKind, name, key, 'PropType(ref)');
        }
        return;
    }
    if ('refPath' in rawOptions) {
        const refPath = rawOptions.refPath;
        delete rawOptions.refPath;
        utils.assertion(typeof refPath === 'string' && refPath.length > 0, () => new StringLengthExpectedError(1, refPath, `${name}.${key}`, 'refPath'));
        switch (propKind) {
            case PropType.ARRAY:
                schemaProp[key] = utils.mapArrayOptions(rawOptions, refType, target, key, undefined, { refPath });
                break;
            case PropType.NONE:
                schemaProp[key] = Object.assign({ type: refType, refPath }, rawOptions);
                break;
            default:
                throw new InvalidPropTypeError(propKind, name, key, 'PropType(refPath)');
        }
        return;
    }
    // check if Type is actually a real working Type
    if (utils.isNullOrUndefined(Type) || typeof Type !== 'function') {
        throw new InvalidTypeError(name, key, Type);
    }
    const enumOption = rawOptions.enum;
    if (!utils.isNullOrUndefined(enumOption)) {
        // check if the supplied value is already "mongoose-consumeable"
        if (!Array.isArray(enumOption)) {
            if (Type === String || Type === mongoose.Schema.Types.String) {
                rawOptions.enum = Object.entries(enumOption) // get all key-value pairs of the enum
                    // no reverse-filtering because if it is full of strings, there is no reverse mapping
                    .map(([enumKey, enumValue]) => {
                    // convert key-value pairs to an mongoose-usable enum
                    // safeguard, this should never happen because TypeScript only sets "design:type" to "String"
                    // if the enum is full of strings
                    if (typeof enumValue !== 'string') {
                        throw new NotStringTypeError(name, key, enumKey, typeof enumValue);
                    }
                    return enumValue;
                });
            }
            else if (Type === Number || Type === mongoose.Schema.Types.Number) {
                rawOptions.enum = Object.entries(enumOption) // get all key-value pairs of the enum
                    // filter out the "reverse (value -> name) mappings"
                    // https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings
                    .filter(([enumKey, enumValue], _i, arr) => {
                    // safeguard, this should never happen because typescript only sets "design:type" to "Number"
                    // if the enum is full of numbers
                    if (utils.isNullOrUndefined(enumValue) || arr.findIndex(([k]) => k === enumValue.toString()) <= -1) {
                        // if there is no reverse mapping, throw an error
                        throw new NotNumberTypeError(name, key, enumKey, typeof enumValue);
                    }
                    return typeof enumValue === 'number';
                })
                    .map(([enumKey, enumValue]) => {
                    // convert key-value pairs to an mongoose-useable enum
                    if (typeof enumValue !== 'number') {
                        throw new NotNumberTypeError(name, key, enumKey, typeof enumValue);
                    }
                    return enumValue;
                });
            }
            else {
                // this will happen if the enum type is not "String" or "Number"
                // most likely this error happened because the code got transpiled with babel or "tsc --transpile-only"
                throw new InvalidEnumTypeError(name, key, Type);
            }
        }
    }
    if (!utils.isNullOrUndefined(rawOptions.addNullToEnum)) {
        rawOptions.enum = Array.isArray(rawOptions.enum) ? rawOptions.enum : [];
        rawOptions.enum.push(null);
        delete rawOptions.addNullToEnum;
    }
    {
        let included = utils.isWithStringValidate(rawOptions);
        if (!utils.isString(Type)) {
            // warn if String-Validate options are included, but is not string
            utils.warnNotCorrectTypeOptions(name, key, 'String', 'String-Validate', included);
        }
        included = utils.isWithStringTransform(rawOptions);
        if (!utils.isString(Type)) {
            // warn if String-Transform options are included, but is not string
            utils.warnNotCorrectTypeOptions(name, key, 'String', 'String-Transform', included);
        }
        included = utils.isWithNumberValidate(rawOptions);
        if (!utils.isNumber(Type)) {
            // warn if Number-Validate options are included, but is not number
            utils.warnNotCorrectTypeOptions(name, key, 'Number', 'Number-Validate', included);
        }
        included = utils.isWithEnumValidate(rawOptions);
        if (!utils.isString(Type) && !utils.isNumber(Type)) {
            // warn if "enum" is included, but is not Number or String
            utils.warnNotCorrectTypeOptions(name, key, 'String | Number', 'extra', included);
        }
    }
    /** Is this Type (/Class) in the schemas Map? */
    const isInSchemas = schemas.has(utils.getName(Type));
    if (utils.isPrimitive(Type)) {
        if (utils.isObject(Type, true)) {
            utils.warnMixed(target, key);
        }
        switch (propKind) {
            case PropType.ARRAY:
                schemaProp[key] = utils.mapArrayOptions(rawOptions, Type, target, key);
                return;
            case PropType.MAP:
                const mapped = utils.mapOptions(rawOptions, Type, target, key);
                schemaProp[key] = Object.assign(Object.assign({}, mapped.outer), { type: Map, of: Object.assign({ type: Type }, mapped.inner) });
                return;
            case PropType.NONE:
                schemaProp[key] = Object.assign(Object.assign({}, rawOptions), { type: Type });
                return;
            default:
                throw new InvalidPropTypeError(propKind, name, key, 'PropType(primitive)');
        }
    }
    // If the 'Type' is not a 'Primitive Type' and no subschema was found treat the type as 'Object'
    // so that mongoose can store it as nested document
    if (utils.isObject(Type) && !isInSchemas) {
        utils.warnMixed(target, key);
        logger.warn('if someone can see this message, please open an new issue at https://github.com/typegoose/typegoose/issues with reproduction code for tests');
        schemaProp[key] = Object.assign(Object.assign({}, rawOptions), { type: mongoose.Schema.Types.Mixed });
        return;
    }
    const virtualSchema = buildSchema(Type);
    switch (propKind) {
        case PropType.ARRAY:
            schemaProp[key] = utils.mapArrayOptions(rawOptions, virtualSchema, target, key, Type);
            return;
        case PropType.MAP:
            // special handling if the lower type should be an array
            if ('dim' in rawOptions) {
                logger.debug('Map SubDocument Array for "%s.%s"', name, key);
                const _d = utils.mapArrayOptions(rawOptions, virtualSchema, target, key, Type), { type } = _d, outer = __rest(_d, ["type"]);
                schemaProp[key] = Object.assign(Object.assign({}, outer), { type: Map, of: type });
                return;
            }
            const mapped = utils.mapOptions(rawOptions, virtualSchema, target, key, Type);
            schemaProp[key] = Object.assign(Object.assign({}, mapped.outer), { type: Map, of: Object.assign({ type: virtualSchema }, mapped.inner) });
            return;
        case PropType.NONE:
            schemaProp[key] = Object.assign(Object.assign({}, rawOptions), { type: virtualSchema });
            return;
        default:
            throw new InvalidPropTypeError(propKind, name, key, 'PropType(subSchema)');
    }
}
// The following function ("optionDeprecation") is disabled until used again
/**
 * Check for deprecated options, and if needed process them
 * @param options
 */
// function optionDeprecation(options: any) {}
/**
 * Detect "PropType" based on "Type"
 * @param Type The Type used for detection
 */
function detectPropType(Type) {
    logger.debug('Detecting PropType');
    if (Type === Array ||
        Type === mongoose.Types.Array ||
        Type === mongoose.Schema.Types.Array ||
        Type === mongoose.Types.DocumentArray ||
        Type === mongoose.Schema.Types.DocumentArray) {
        return PropType.ARRAY;
    }
    if (Type === Map || Type === mongoose.Types.Map || Type === mongoose.Schema.Types.Map) {
        return PropType.MAP;
    }
    return PropType.NONE;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc1Byb3AuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW50ZXJuYWwvcHJvY2Vzc1Byb3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QyxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFTbEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3BDLE9BQU8sRUFDTCxtQkFBbUIsRUFDbkIsb0JBQW9CLEVBQ3BCLGdCQUFnQixFQUNoQixvQkFBb0IsRUFDcEIsdUJBQXVCLEVBQ3ZCLGtCQUFrQixFQUNsQixrQkFBa0IsRUFDbEIsK0JBQStCLEVBQy9CLHlCQUF5QixFQUN6Qix3QkFBd0IsRUFDeEIseUJBQXlCLEdBQzFCLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sS0FBSyxLQUFLLE1BQU0sWUFBWSxDQUFDO0FBRXBDOzs7R0FHRztBQUNILE1BQU0sVUFBVSxXQUFXLENBQUMsS0FBZ0M7O0lBQzFELE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQzlCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkMsTUFBTSxVQUFVLEdBQWlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsRSxJQUFJLElBQUksR0FBb0IsT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNqRixNQUFNLFFBQVEsR0FBRyxNQUFBLEtBQUssQ0FBQyxNQUFNLG1DQUFJLGNBQWMs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