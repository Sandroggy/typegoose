import * as mongoose from 'mongoose';
import { isNullOrUndefined } from './internal/utils.js';
import { logger } from './logSettings.js';
/**
 * Check if the given document is already populated
 * @param doc The Ref with uncertain type
 */
export function isDocument(doc) {
    return doc instanceof mongoose.Model;
}
export function isDocumentArray(docs) {
    // its "any" & "unkown" because this is not listed as an overload
    return Array.isArray(docs) && docs.every((v) => isDocument(v));
}
/**
 * Check if the document is not undefined/null and is not an document
 * @param doc The Ref with uncretain type
 */
export function isRefType(doc, reftype) {
    logger.info('isRefType:', reftype);
    if (isNullOrUndefined(doc) || isDocument(doc)) {
        return false;
    }
    // this "ObjectId" test is in the front, because its the most common - to lower resource use
    if (reftype === mongoose.Types.ObjectId) {
        return doc instanceof mongoose.Types.ObjectId;
    }
    if (reftype === String) {
        return typeof doc === 'string';
    }
    if (reftype === Number) {
        return typeof doc === 'number';
    }
    if (reftype === Buffer || reftype === mongoose.Types.Buffer) {
        return doc instanceof Buffer;
    }
    return false;
}
export function isRefTypeArray(docs, reftype) {
    // its "any" & "unkown" because this is not listed as an overload
    return Array.isArray(docs) && docs.every((v) => isRefType(v, reftype));
}
/**
 * Check if the input is a mongoose.Model
 * @param model The Value to check
 */
export function isModel(model) {
    return (model === null || model === void 0 ? void 0 : model.prototype) instanceof mongoose.Model;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWd1YXJkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90eXBlZ3VhcmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUcxQzs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsVUFBVSxDQUF1QixHQUFjO0lBQzdELE9BQU8sR0FBRyxZQUFZLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDdkMsQ0FBQztBQVVELE1BQU0sVUFBVSxlQUFlLENBQUMsSUFBaUM7SUFDL0QsaUVBQWlFO0lBQ2pFLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBSUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FBdUIsR0FBMEIsRUFBRSxPQUF3QjtJQUNsRyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVuQyxJQUFJLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUM3QyxPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsNEZBQTRGO0lBQzVGLElBQUksT0FBTyxLQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO1FBQ3ZDLE9BQU8sR0FBRyxZQUFZLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0tBQy9DO0lBQ0QsSUFBSSxPQUFPLEtBQUssTUFBTSxFQUFFO1FBQ3RCLE9BQU8sT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDO0tBQ2hDO0lBQ0QsSUFBSSxPQUFPLEtBQUssTUFBTSxFQUFFO1FBQ3RCLE9BQU8sT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDO0tBQ2hDO0lBQ0QsSUFBSSxPQUFPLEtBQUssTUFBTSxJQUFJLE9BQU8sS0FBSyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUMzRCxPQUFPLEdBQUcsWUFBWSxNQUFNLENBQUM7S0FDOUI7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFXRCxNQUFNLFVBQVUsY0FBYyxDQUFDLElBQWlDLEVBQUUsT0FBd0I7SUFDeEYsaUVBQWlFO0lBQ2pFLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDekUsQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxPQUFPLENBQUMsS0FBVTtJQUNoQyxPQUFPLENBQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFNBQVMsYUFBWSxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQ3BELENBQUMifQ==