import { __rest } from "tslib";
import { logger } from '../logSettings';
import { buildSchema, mongoose, Passthrough } from '../typegoose';
import { DecoratorKeys, PropType } from './constants';
import { schemas } from './data';
import { CannotBeSymbolError, InvalidEnumTypeError, InvalidTypeError, InvalidPropTypeError, NotAllVPOPElementsError, NotNumberTypeError, NotStringTypeError, OptionDoesNotSupportOptionError, RefOptionIsUndefinedError, SelfContainingClassError, StringLengthExpectedError, } from './errors';
import * as utils from './utils';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc1Byb3AuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW50ZXJuYWwvcHJvY2Vzc1Byb3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QyxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFTbEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDdEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLG9CQUFvQixFQUNwQixnQkFBZ0IsRUFDaEIsb0JBQW9CLEVBQ3BCLHVCQUF1QixFQUN2QixrQkFBa0IsRUFDbEIsa0JBQWtCLEVBQ2xCLCtCQUErQixFQUMvQix5QkFBeUIsRUFDekIsd0JBQXdCLEVBQ3hCLHlCQUF5QixHQUMxQixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEtBQUssS0FBSyxNQUFNLFNBQVMsQ0FBQztBQUVqQzs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsV0FBVyxDQUFDLEtBQWdDOztJQUMxRCxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztJQUM5QixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLE1BQU0sVUFBVSxHQUFpQixNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEUsSUFBSSxJQUFJLEdBQW9CLE9BQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDakYsTUFBTSxRQUFRLEdBQUcsTUFBQSxLQUFLLENBQUMsTUFBTSxtQ0FBSSxjQUFjLENB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