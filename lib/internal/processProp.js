import { __rest } from "tslib";
import { logger } from '../logSettings.js';
import { buildSchema, mongoose, Passthrough } from '../typegoose.js';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc1Byb3AuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW50ZXJuYWwvcHJvY2Vzc1Byb3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQVNyRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUNMLG1CQUFtQixFQUNuQixvQkFBb0IsRUFDcEIsZ0JBQWdCLEVBQ2hCLG9CQUFvQixFQUNwQix1QkFBdUIsRUFDdkIsa0JBQWtCLEVBQ2xCLGtCQUFrQixFQUNsQiwrQkFBK0IsRUFDL0IseUJBQXlCLEVBQ3pCLHdCQUF3QixFQUN4Qix5QkFBeUIsR0FDMUIsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxLQUFLLEtBQUssTUFBTSxZQUFZLENBQUM7QUFFcEM7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FBQyxLQUFnQzs7SUFDMUQsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDOUIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuQyxNQUFNLFVBQVUsR0FBaUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xFLElBQUksSUFBSSxHQUFvQixPQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2pGLE1BQU0sUUFBUSxHQUFHLE1BQUEsS0FBSyxDQUFDLE1BQU0sbUNBQUksY0FB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