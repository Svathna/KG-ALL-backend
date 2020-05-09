import { Typegoose, prop, Ref } from 'typegoose';

export enum CompanyType {
  SOLE_PROPRIETORSHIPS = 1,
  PRIVATE_LIMITED_COMPANY = 2,
  PUBLIC_LIMITED_COMPANY = 3,
}

class Tax extends Typegoose {
  @prop({ required: true })
  revenue: number;

  @prop({ required: true })
  spending: number;

  @prop({ required: true })
  paidAmout: number;

  @prop()
  others: string;

  @prop({ required: true })
  month: string;

  @prop({ required: true })
  year: number;

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Tax;
