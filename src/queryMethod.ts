import type { Query } from 'mongoose';
import { DecoratorKeys } from './internal/constants.js';
import { getName } from './internal/utils.js';
import { logger } from './logSettings.js';
import type { AnyParamConstructor, QueryHelperThis, QueryMethodMap } from './types.js';

/**
 * Adds a query method to schema.
 *
 * @param func Query function
 * @example
 * ```ts
 * interface FindHelpers {
 *   findByTitle: AsQueryMethod<typeof findByTitle>;
 * }
 *
 * function findByTitle(this: ReturnModelType<typeof Event, FindHelpers>, title: string) {
 *  return this.find({ title });
 * }
 *
 * @queryMethod(findByTitle)
 * class Event {
 *  @prop()
 *  public title: string;
 * }
 *
 * const EventModel = getModelForClass<typeof Event, FindHelpers>(Event);
 * ```
 */
export function queryMethod<QueryHelpers, U extends AnyParamConstructor<any>>(
  func: (this: QueryHelperThis<U, QueryHelpers>, ...params: any[]) => Query<any, any>
): ClassDecorator {
  return (target: any) => {
    logger.info('Adding query method "%s" to %s', func.name, getName(target));
    const queryMethods: QueryMethodMap = new Map(Reflect.getMetadata(DecoratorKeys.QueryMethod, target) ?? []);
    queryMethods.set(func.name, func);
    Reflect.defineMetadata(DecoratorKeys.QueryMethod, queryMethods, target);
  };
}

// Export it PascalCased
export { queryMethod as QueryMethod };
