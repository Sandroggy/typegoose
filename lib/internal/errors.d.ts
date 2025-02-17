export declare class InvalidTypeError extends Error {
    constructor(targetName: string, key: string, Type: unknown);
}
export declare class NotNumberTypeError extends Error {
    constructor(targetName: string, key: string, enumKey: string, enumValue: string);
}
export declare class NotStringTypeError extends Error {
    constructor(targetName: string, key: string, enumKey: string, enumValue: string);
}
/** Not All Virtual Populate Elements Error */
export declare class NotAllVPOPElementsError extends Error {
    constructor(name: string, key: string);
}
export declare class NoValidClassError extends TypeError {
    constructor(value: unknown);
}
export declare class AssertionFallbackError extends Error {
    constructor();
}
/** Error for when an unknown PropType is passed to an switch, gets thrown in the default case */
export declare class InvalidPropTypeError extends Error {
    constructor(proptype: unknown, name: string, key: string, where: string);
}
export declare const InvalidWhatIsItError: typeof InvalidPropTypeError;
export declare class CannotBeSymbolError extends Error {
    constructor(name: string, key: string | symbol);
}
export declare class SelfContainingClassError extends TypeError {
    constructor(name: string, key: string);
}
export declare class RefOptionIsUndefinedError extends Error {
    constructor(name: string, key: string);
}
export declare class NotValidModelError extends TypeError {
    constructor(model: unknown, where: string);
}
export declare class FunctionCalledMoreThanSupportedError extends Error {
    constructor(functionName: string, supported: number, extra: string);
}
export declare class StringLengthExpectedError extends TypeError {
    constructor(length: number, got: any, where: string, valueName: string);
}
export declare class OptionDoesNotSupportOptionError extends TypeError {
    constructor(currentOption: string, problemOption: string, expected: string, provided: string);
}
export declare class ResolveTypegooseNameError extends ReferenceError {
    constructor(input: unknown);
}
export declare class ExpectedTypeError extends TypeError {
    constructor(optionName: string, expected: string, got: unknown);
}
export declare class InvalidEnumTypeError extends TypeError {
    constructor(name: string, key: string, value: unknown);
}
export declare class InvalidOptionsConstructorError extends TypeError {
    constructor(name: string, key: string, type: unknown);
}
export declare class PathNotInSchemaError extends Error {
    constructor(name: string, key: string);
}
export declare class NoDiscriminatorFunctionError extends Error {
    constructor(name: string, key: string);
}
