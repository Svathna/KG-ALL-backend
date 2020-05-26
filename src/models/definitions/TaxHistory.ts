import { Typegoose, prop } from 'typegoose';

class TaxHistory extends Typegoose {
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

export default TaxHistory;
