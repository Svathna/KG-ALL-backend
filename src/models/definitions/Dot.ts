import { Typegoose, prop, Ref } from 'typegoose';

class Dot extends Typegoose {
  @prop({ required: true })
  dotNumber: string;

  @prop({ required: true })
  notedDate: Date;

  @prop({ required: true })
  notedAtBranch: string;

  @prop({ required: true })
  address: string;

  @prop({ required: true })
  bankName: string;

  @prop({ required: true })
  bankAccountName: string;

  @prop({ required: true })
  bankAccountNumber: string;

  @prop({ required: true })
  taxationCardNumber: string;

  @prop({ required: true })
  phoneNumber: number;

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Dot;
