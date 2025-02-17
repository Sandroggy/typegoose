import { defaultClasses, getModelForClass, prop } from '../../src/typegoose.js';

export class TestTimeStamps extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public someValue!: string;
}

export const TestTimeStampsModel = getModelForClass(TestTimeStamps);
