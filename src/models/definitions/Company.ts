import { Typegoose, prop, Ref } from 'typegoose';

class Company extends Typegoose {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  address: string;

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Company;
