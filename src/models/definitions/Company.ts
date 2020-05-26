import { Typegoose, prop, Ref } from 'typegoose';
import Moc from './Moc';
import Vat from './Vat';
import TaxHistory from './TaxHistory';

class Company extends Typegoose {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  nameInKhmer: string;

  @prop()
  description: string;

  @prop({ ref: Moc })
  moc: Ref<Moc>;

  @prop({ ref: Vat })
  vat: Ref<Vat>;

  @prop({ ref: TaxHistory })
  taxHistory: Ref<TaxHistory>;

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Company;
