import 'reflect-metadata';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';

import { schema, models, methods, virtuals } from './data';

export * from './method';
export * from './prop';

export type InstanceType<T> = T & mongoose.Document;
export type ModelType<T> = mongoose.Model<InstanceType<T>> & T;

export class Typegoose {
  id: string;

  getModelForClass<T>(t: T, existingMongoose?: mongoose.Mongoose, schemaOptions?: mongoose.SchemaOptions) {
    const name = (this.constructor as any).name;
    if (!models[name]) {
      const Schema = existingMongoose ?
        existingMongoose.Schema.bind(existingMongoose) :
        mongoose.Schema.bind(mongoose);

      const sch = schemaOptions ?
        new Schema(schema[name], schemaOptions) :
        new Schema(schema[name]);

      const staticMethods = methods.staticMethods[name];
      sch.statics = staticMethods;

      const instanceMethods = methods.instanceMethods[name];
      sch.methods = instanceMethods;

      const getterSetters = virtuals[name];
      _.forEach(getterSetters, (value, key) => {
        if (value.get) {
          sch.virtual(key).get(value.get);
        }
        if (value.set) {
          sch.virtual(key).set(value.set);
        }
      });

      const model = existingMongoose ?
        existingMongoose.model.bind(existingMongoose) :
        mongoose.model.bind(mongoose);

      models[name] = model(name, sch);
    }

    return models[name] as ModelType<this> & T;
  }
}
