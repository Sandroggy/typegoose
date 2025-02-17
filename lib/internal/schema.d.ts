import mongoose from 'mongoose';
import type { AnyParamConstructor, IModelOptions } from '../types.js';
/**
 * Private schema builder out of class props
 * -> If you discover this, don't use this function, use Typegoose.buildSchema!
 * @param cl The not initialized Class
 * @param sch Use a Already existing Schema as a base?
 * @param opt Options to override
 * @param isFinalSchema If it's the final schema to be built (defaults to `true`).
 * @returns Returns the Build Schema
 * @private
 */
export declare function _buildSchema<U extends AnyParamConstructor<any>>(cl: U, origSch?: mongoose.Schema<any>, opt?: mongoose.SchemaOptions, isFinalSchema?: boolean, overwriteOptions?: IModelOptions): mongoose.Schema<any, mongoose.Model<any, any, any, any>, any, any>;
