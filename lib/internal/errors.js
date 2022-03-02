import { allVirtualoptions, toStringNoFail } from './utils';
// Note: dont forget to use "toStringNoFail" on values that are "unknown" or "any"
export class InvalidTypeError extends Error {
    constructor(targetName, key, Type) {
        super(`"${targetName}.${key}"'s Type is invalid! Type is: "${toStringNoFail(Type)}" [E009]`);
    }
}
export class NotNumberTypeError extends Error {
    constructor(targetName, key, enumKey, enumValue) {
        super(`Typeof "${targetName}.${key}" is "Number", value is undefined/null or does not have a reverse mapping! [E011]\n` +
            `  Encountered with property: "${enumKey}.${typeof enumValue}"`);
    }
}
export class NotStringTypeError extends Error {
    constructor(targetName, key, enumKey, enumValue) {
        super(`Typeof "${targetName}.${key}" is "String", used enum is not only Strings! [E010]\n` +
            `  Encountered with property in Enum: "${enumKey}.${typeof enumValue}"`);
    }
}
/** Not All Virtual Populate Elements Error */
export class NotAllVPOPElementsError extends Error {
    constructor(name, key) {
        super(`"${name}.${key}" has not all needed Virtual Populate Options! Needed are: ${allVirtualoptions.join(', ')} [E006]`);
    }
}
export class NoValidClassError extends TypeError {
    constructor(value) {
        super('Value is not a function or does not have a constructor! [E028]\n' + `Value: "${toStringNoFail(value)}"`);
    }
}
export class AssertionFallbackError extends Error {
    constructor() {
        super('Assert failed - no custom error [E019]');
    }
}
/** Error for when an unknown PropType is passed to an switch, gets thrown in the default case */
export class InvalidPropTypeError extends Error {
    constructor(proptype, name, key, where) {
        super(`"${toStringNoFail(proptype)}"(${where}) is invalid for "${name}.${key}" [E013]`);
    }
}
// For Backwards-compatability
export const InvalidWhatIsItError = InvalidPropTypeError;
export class CannotBeSymbolError extends Error {
    constructor(name, key) {
        super(`A property key in Typegoose cannot be an symbol! ("${name}.${toStringNoFail(key)}") [E024]`);
    }
}
export class SelfContainingClassError extends TypeError {
    constructor(name, key) {
        super('It seems like the type used is the same as the target class, which is not supported\n' +
            `Please look at https://github.com/typegoose/typegoose/issues/42 for more information ("${name}.${key}") [E004]`);
    }
}
export class RefOptionIsUndefinedError extends Error {
    constructor(name, key) {
        super(`Prop-Option "ref"'s value is "null" or "undefined" for "${name}.${key}" [E005]`);
    }
}
export class NotValidModelError extends TypeError {
    constructor(model, where) {
        super(`Expected "${where}" to be a valid mongoose.Model! (got: "${toStringNoFail(model)}") [E025]`);
    }
}
export class FunctionCalledMoreThanSupportedError extends Error {
    constructor(functionName, supported, extra) {
        super(`Function "${functionName}" only supports to be called "${supported}" times with the same parameters [E003]\n${extra}`);
    }
}
export class StringLengthExpectedError extends TypeError {
    constructor(length, got, where, valueName) {
        // create the "got:" message, when string say it was a string, but not the length
        // if not string, then say it is not a string plus the value
        const gotMessage = typeof got === 'string' ? `(String: "${got.length}")` : `(not-String: "${toStringNoFail(got)}")`;
        super(`Expected "${valueName}" to have at least length of "${length}" (got: ${gotMessage}, where: "${where}") [E026]`);
    }
}
export class OptionDoesNotSupportOptionError extends TypeError {
    constructor(currentOption, problemOption, expected, provided) {
        super(`The Option "${currentOption}" does not support Option "${problemOption}" other than "${expected}" (provided was: "${provided}") [E027]`);
    }
}
export class ResolveTypegooseNameError extends ReferenceError {
    constructor(input) {
        super('Input was not a string AND didnt have a .typegooseName function AND didnt have a .typegooseName string [E014]\n' +
            `Value: "${toStringNoFail(input)}"`);
    }
}
export class ExpectedTypeError extends TypeError {
    constructor(optionName, expected, got) {
        super(`Expected Argument "${optionName}" to have type "${expected}", got: "${toStringNoFail(got)}" [E029]`);
    }
}
export class InvalidEnumTypeError extends TypeError {
    constructor(name, key, value) {
        super(`Invalid Type used for options "enum" at "${name}.${key}"! [E012]\n` +
            `Type: "${toStringNoFail(value)}"\n` +
            'https://typegoose.github.io/typegoose/docs/guides/error-warning-details#invalid-type-for-enum-e012');
    }
}
export class InvalidOptionsConstructorError extends TypeError {
    constructor(name, key, type) {
        super(`Type has a invalid "OptionsConstructor" on "${name}.${key}"! [E016]\n` + `Type: "${toStringNoFail(type)}"`);
    }
}
export class PathNotInSchemaError extends Error {
    constructor(name, key) {
        super(`Path "${key}" on "${name}" does not exist in the Schema! [E030]`);
    }
}
export class NoDiscriminatorFunctionError extends Error {
    constructor(name, key) {
        super(`Path "${name}.${key}" does not have a function called "discriminator"! (Nested Discriminator cannot be applied) [E031]`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ludGVybmFsL2Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRTVELGtGQUFrRjtBQUVsRixNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsS0FBSztJQUN6QyxZQUFZLFVBQWtCLEVBQUUsR0FBVyxFQUFFLElBQWE7UUFDeEQsS0FBSyxDQUFDLElBQUksVUFBVSxJQUFJLEdBQUcsa0NBQWtDLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDL0YsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLGtCQUFtQixTQUFRLEtBQUs7SUFDM0MsWUFBWSxVQUFrQixFQUFFLEdBQVcsRUFBRSxPQUFlLEVBQUUsU0FBaUI7UUFDN0UsS0FBSyxDQUNILFdBQVcsVUFBVSxJQUFJLEdBQUcscUZBQXFGO1lBQy9HLGlDQUFpQyxPQUFPLElBQUksT0FBTyxTQUFTLEdBQUcsQ0FDbEUsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxLQUFLO0lBQzNDLFlBQVksVUFBa0IsRUFBRSxHQUFXLEVBQUUsT0FBZSxFQUFFLFNBQWlCO1FBQzdFLEtBQUssQ0FDSCxXQUFXLFVBQVUsSUFBSSxHQUFHLHdEQUF3RDtZQUNsRix5Q0FBeUMsT0FBTyxJQUFJLE9BQU8sU0FBUyxHQUFHLENBQzFFLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCw4Q0FBOEM7QUFDOUMsTUFBTSxPQUFPLHVCQUF3QixTQUFRLEtBQUs7SUFDaEQsWUFBWSxJQUFZLEVBQUUsR0FBVztRQUNuQyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyw4REFBOEQsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM1SCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8saUJBQWtCLFNBQVEsU0FBUztJQUM5QyxZQUFZLEtBQWM7UUFDeEIsS0FBSyxDQUFDLGtFQUFrRSxHQUFHLFdBQVcsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsSCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sc0JBQXVCLFNBQVEsS0FBSztJQUMvQztRQUNFLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQ2xELENBQUM7Q0FDRjtBQUVELGlHQUFpRztBQUNqRyxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsS0FBSztJQUM3QyxZQUFZLFFBQWlCLEVBQUUsSUFBWSxFQUFFLEdBQVcsRUFBRSxLQUFhO1FBQ3JFLEtBQUssQ0FBQyxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLHFCQUFxQixJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQztJQUMxRixDQUFDO0NBQ0Y7QUFFRCw4QkFBOEI7QUFDOUIsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7QUFFekQsTUFBTSxPQUFPLG1CQUFvQixTQUFRLEtBQUs7SUFDNUMsWUFBWSxJQUFZLEVBQUUsR0FBb0I7UUFDNUMsS0FBSyxDQUFDLHNEQUFzRCxJQUFJLElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0RyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsU0FBUztJQUNyRCxZQUFZLElBQVksRUFBRSxHQUFXO1FBQ25DLEtBQUssQ0FDSCx1RkFBdUY7WUFDckYsMEZBQTBGLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FDbkgsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxLQUFLO0lBQ2xELFlBQVksSUFBWSxFQUFFLEdBQVc7UUFDbkMsS0FBSyxDQUFDLDJEQUEyRCxJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQztJQUMxRixDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsU0FBUztJQUMvQyxZQUFZLEtBQWMsRUFBRSxLQUFhO1FBQ3ZDLEtBQUssQ0FBQyxhQUFhLEtBQUssMENBQTBDLGNBQWMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEcsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLG9DQUFxQyxTQUFRLEtBQUs7SUFDN0QsWUFBWSxZQUFvQixFQUFFLFNBQWlCLEVBQUUsS0FBYTtRQUNoRSxLQUFLLENBQUMsYUFBYSxZQUFZLGlDQUFpQyxTQUFTLDRDQUE0QyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2hJLENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxTQUFTO0lBQ3RELFlBQVksTUFBYyxFQUFFLEdBQVEsRUFBRSxLQUFhLEVBQUUsU0FBaUI7UUFDcEUsaUZBQWlGO1FBQ2pGLDREQUE0RDtRQUM1RCxNQUFNLFVBQVUsR0FBRyxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFFcEgsS0FBSyxDQUFDLGFBQWEsU0FBUyxpQ0FBaUMsTUFBTSxXQUFXLFVBQVUsYUFBYSxLQUFLLFdBQVcsQ0FBQyxDQUFDO0lBQ3pILENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBTywrQkFBZ0MsU0FBUSxTQUFTO0lBQzVELFlBQVksYUFBcUIsRUFBRSxhQUFxQixFQUFFLFFBQWdCLEVBQUUsUUFBZ0I7UUFDMUYsS0FBSyxDQUNILGVBQWUsYUFBYSw4QkFBOEIsYUFBYSxpQkFBaUIsUUFBUSxxQkFBcUIsUUFBUSxXQUFXLENBQ3pJLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8seUJBQTBCLFNBQVEsY0FBYztJQUMzRCxZQUFZLEtBQWM7UUFDeEIsS0FBSyxDQUNILGlIQUFpSDtZQUMvRyxXQUFXLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUN0QyxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLGlCQUFrQixTQUFRLFNBQVM7SUFDOUMsWUFBWSxVQUFrQixFQUFFLFFBQWdCLEVBQUUsR0FBWTtRQUM1RCxLQUFLLENBQUMsc0JBQXNCLFVBQVUsbUJBQW1CLFFBQVEsWUFBWSxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlHLENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxTQUFTO0lBQ2pELFlBQVksSUFBWSxFQUFFLEdBQVcsRUFBRSxLQUFjO1FBQ25ELEtBQUssQ0FDSCw0Q0FBNEMsSUFBSSxJQUFJLEdBQUcsYUFBYTtZQUNsRSxVQUFVLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSztZQUNwQyxvR0FBb0csQ0FDdkcsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBTyw4QkFBK0IsU0FBUSxTQUFTO0lBQzNELFlBQVksSUFBWSxFQUFFLEdBQVcsRUFBRSxJQUFhO1FBQ2xELEtBQUssQ0FBQywrQ0FBK0MsSUFBSSxJQUFJLEdBQUcsYUFBYSxHQUFHLFVBQVUsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNySCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsS0FBSztJQUM3QyxZQUFZLElBQVksRUFBRSxHQUFXO1FBQ25DLEtBQUssQ0FBQyxTQUFTLEdBQUcsU0FBUyxJQUFJLHdDQUF3QyxDQUFDLENBQUM7SUFDM0UsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLDRCQUE2QixTQUFRLEtBQUs7SUFDckQsWUFBWSxJQUFZLEVBQUUsR0FBVztRQUNuQyxLQUFLLENBQUMsU0FBUyxJQUFJLElBQUksR0FBRyxvR0FBb0csQ0FBQyxDQUFDO0lBQ2xJLENBQUM7Q0FDRiJ9