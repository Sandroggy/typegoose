import type { IModelOptions } from './types.js';
/**
 * Define Options for the Class
 * @param options Options
 * @example Example:
 * ```ts
 * @modelOptions({ schemaOptions: { timestamps: true } })
 * class ClassName {}
 *
 * // The default Class "TimeStamps" can be used for type information and options already set
 * ```
 */
export declare function modelOptions(options: IModelOptions): ClassDecorator;
export { modelOptions as ModelOptions };
