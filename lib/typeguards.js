import * as mongoose from 'mongoose';
import { isNullOrUndefined } from './internal/utils';
import { logger } from './logSettings';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWd1YXJkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90eXBlZ3VhcmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHdkM7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FBdUIsR0FBYztJQUM3RCxPQUFPLEdBQUcsWUFBWSxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLENBQUM7QUFVRCxNQUFNLFVBQVUsZUFBZSxDQUFDLElBQWlDO0lBQy9ELGlFQUFpRTtJQUNqRSxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUlEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQXVCLEdBQTBCLEVBQUUsT0FBd0I7SUFDbEcsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFbkMsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDN0MsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELDRGQUE0RjtJQUM1RixJQUFJLE9BQU8sS0FBSyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtRQUN2QyxPQUFPLEdBQUcsWUFBWSxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztLQUMvQztJQUNELElBQUksT0FBTyxLQUFLLE1BQU0sRUFBRTtRQUN0QixPQUFPLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQztLQUNoQztJQUNELElBQUksT0FBTyxLQUFLLE1BQU0sRUFBRTtRQUN0QixPQUFPLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQztLQUNoQztJQUNELElBQUksT0FBTyxLQUFLLE1BQU0sSUFBSSxPQUFPLEtBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDM0QsT0FBTyxHQUFHLFlBQVksTUFBTSxDQUFDO0tBQzlCO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBV0QsTUFBTSxVQUFVLGNBQWMsQ0FBQyxJQUFpQyxFQUFFLE9BQXdCO0lBQ3hGLGlFQUFpRTtJQUNqRSxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3pFLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsT0FBTyxDQUFDLEtBQVU7SUFDaEMsT0FBTyxDQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxTQUFTLGFBQVksUUFBUSxDQUFDLEtBQUssQ0FBQztBQUNwRCxDQUFDIn0=