import { Typegoose, prop, Ref } from 'typegoose';
import Moc from './Moc';
import Dot from './Dot';
import TaxHistory from './TaxHistory';

class Company extends Typegoose {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  nameInKhmer: string;

  @prop()
  description: string;

  @prop({ ref: Moc })
  MOC: Ref<Moc>;

  @prop({ ref: Dot })
  DOT: Ref<Dot>;

  @prop({ ref: TaxHistory })
  taxHistory: Ref<TaxHistory>;

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Company;
