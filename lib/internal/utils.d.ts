import mongoose from 'mongoose';
import type { AnyParamConstructor, DeferredFunc, Func, GetTypeReturn, IModelOptions, IObjectWithTypegooseFunction, IObjectWithTypegooseName, IPrototype, KeyStringAny, PropOptionsForNumber, PropOptionsForString, VirtualOptions } from '../types.js';
import { DecoratorKeys, PropType } from './constants.js';
/**
 * Returns true, if the type is included in mongoose.Schema.Types
 * @param Type The Type
 * @returns true, if it includes it
 */
export declare function isPrimitive(Type: any): boolean;
/**
 * Returns true, if the type is included in mongoose.Schema.Types except the aliases
 * @param Type The Type
 * @returns true, if it includes it
 */
export declare function isAnRefType(Type: any): boolean;
/**
 * Returns true, if it is an Object
 * @param Type The Type
 * @param once Just run it once?
 * @returns true, if it is an Object
 */
export declare function isObject(Type: any, once?: boolean): boolean;
/**
 * Returns true, if it is an Number
 * @param Type The Type
 * @returns true, if it is an Number
 */
export declare function isNumber(Type: any): Type is number;
/**
 * Returns true, if it is an String
 * @param Type The Type
 * @returns true, if it is an String
 */
export declare function isString(Type: any): Type is string;
/**
 * Initialize the property in the schemas Map
 * @param name Name of the current Model/Class
 * @param key Key of the property
 * @param proptype What should it be for a type?
 */
export declare function initProperty(name: string, key: string, proptype: PropType): {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined>;
};
/**
 * Get the Class for a given Document
 * @param document The Document
 */
export declare function getClassForDocument(document: mongoose.Document): NewableFunction | undefined;
/**
 * Get the Class for a given Schema
 * @param input
 */
export declare function getClass(input: (mongoose.Document & IObjectWithTypegooseFunction) | (mongoose.Schema.Types.Subdocument & IObjectWithTypegooseFunction) | string | IObjectWithTypegooseName | any): NewableFunction | undefined;
/**
 * Return an array of options that are included
 * @param options The raw Options
 */
export declare function isWithStringValidate(options: PropOptionsForString): string[];
/**
 * Return an array of options that are included
 * @param options The raw Options
 */
export declare function isWithStringTransform(options: PropOptionsForString): string[];
/**
 * Return an array of options that are included
 * @param options The raw Options
 */
export declare function isWithNumberValidate(options: PropOptionsForNumber): string[];
/**
 * Return an array of options that are included
 * @param options The raw Options
 */
export declare function isWithEnumValidate(options: PropOptionsForNumber | PropOptionsForString): string[];
/**
 * Check if Options include Virtual Populate Options
 * @param options RawOptions of the Prop
 */
export declare function isWithVirtualPOP(options: any): options is VirtualOptions;
export declare const allVirtualoptions: string[];
/**
 * Check if all the required Options are present
 * @param options RawOptions of the Prop
 */
export declare function includesAllVirtualPOP(options: VirtualOptions): options is VirtualOptions;
/**
 * Merge value & existing Metadata & Save it to the class
 * Difference with "mergeMetadata" is that this one DOES save it to the class
 * @param key Metadata key
 * @param value Raw value
 * @param cl The constructor
 * @internal
 */
export declare function assignMetadata(key: DecoratorKeys, value: unknown, cl: AnyParamConstructor<any>): any;
/**
 * Merge value & existing Metadata
 * Difference with "assignMetadata" is that this one DOES NOT save it to the class
 * @param key Metadata key
 * @param value Raw value
 * @param cl The constructor
 * @internal
 */
export declare function mergeMetadata<T = any>(key: DecoratorKeys, value: unknown, cl: AnyParamConstructor<any>): T;
/**
 * Merge only schemaOptions from ModelOptions of the class
 * @param value The value to use
 * @param cl The Class to get the values from
 */
export declare function mergeSchemaOptions<U extends AnyParamConstructor<any>>(value: mongoose.SchemaOptions | undefined, cl: U): mongoose.SchemaOptions | undefined;
/**
 * Tries to return the right target
 * if target.constructor.name is "Function", return target, otherwise target.constructor
 * @param target The target to determine
 */
export declare function getRightTarget(target: any): any;
/**
 * Get the correct name of the class's model
 * (with suffix)
 * @param cl The Class
 * @param customOptions Extra Options that can be added in "buildSchema"
 */
export declare function getName<U extends AnyParamConstructor<any>>(cl: U, customOptions?: IModelOptions): string;
/**
 * Returns if it is not defined in "schemas"
 * @param cl The Type
 */
export declare function isNotDefined(cl: any): boolean;
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
export declare function mapArrayOptions(rawOptions: any, Type: AnyParamConstructor<any> | mongoose.Schema, target: any, pkey: string, loggerType?: AnyParamConstructor<any>, extra?: KeyStringAny): mongoose.SchemaTypeOptions<any>;
/**
 * Map Options to "inner" & "outer"
 * @param rawOptions The raw options
 * @param Type The Type of the array
 * @param target The Target class
 * @param pkey Key of the Property
 * @param loggerType Type to use for logging
 */
export declare function mapOptions(rawOptions: any, Type: AnyParamConstructor<any> | (mongoose.Schema & IPrototype), target: any, pkey: string, loggerType?: AnyParamConstructor<any>): {
    inner: KeyStringAny;
    outer: KeyStringAny;
};
/**
 * Warn, Error or Allow if an mixed type is set
 * -> this function exists for de-duplication
 * @param target Target Class
 * @param key Property key
 */
export declare function warnMixed(target: any, key: string): void | never;
/**
 * Because since node 4.0.0 the internal util.is* functions got deprecated
 * @param val Any value to test if null or undefined
 */
export declare function isNullOrUndefined(val: unknown): val is null | undefined;
/**
 * Assign Global ModelOptions if not already existing
 * @param target Target Class
 */
export declare function assignGlobalModelOptions(target: any): void;
/**
 * Loop over "dimensions" and create an array from that
 * @param rawOptions baseProp's rawOptions
 * @param extra What is actually in the deepest array
 * @param name name of the target for better error logging
 * @param key key of target-key for better error logging
 */
export declare function createArrayFromDimensions(rawOptions: any, extra: any, name: string, key: string): any[];
/**
 * Assert an condition, if "false" throw error
 * Note: it is not named "assert" to differentiate between node and jest types
 *
 * Note: "error" can be a function to not execute the constructor when not needed
 * @param cond The Condition to throw
 * @param error An Custom Error to throw or a function that returns a Error
 */
export declare function assertion(cond: any, error?: Error | DeferredFunc<Error>): asserts cond;
/**
 * Assert if val is an function (constructor for classes)
 * @param val Value to test
 */
export declare function assertionIsClass(val: any): asserts val is Func;
/**
 * Get Type, if input is an arrow-function, execute it and return the result
 * @param typeOrFunc Function or Type
 * @param returnLastFoundArray Return the last found array (used for something like PropOptions.discriminators)
 */
export declare function getType(typeOrFunc: Func | any, returnLastFoundArray?: boolean): GetTypeReturn;
/**
 * Is the provided input an class with an constructor?
 */
export declare function isConstructor(obj: any): obj is AnyParamConstructor<any>;
/**
 * Logs an warning if "included > 0" that the options of not the current type are included
 * @param name Name of the Class
 * @param key Name of the Currently Processed key
 * @param type Name of the Expected Type
 * @param extra Extra string to be included
 * @param included Included Options to be listed
 */
export declare function warnNotCorrectTypeOptions(name: string, key: string, type: string, extra: string, included: string[]): void;
/**
 * Try to convert input "value" to a String, without it failing
 * @param value The Value to convert to String
 * @returns A String, either "value.toString" or a placeholder
 */
export declare function toStringNoFail(value: unknown): string;
