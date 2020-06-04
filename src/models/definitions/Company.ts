import { Typegoose, prop, Ref, arrayProp } from 'typegoose';
import Moc from './Moc';
import Dot from './Dot';
import TaxHistory from './TaxHistory';
import User from './User';

class Company extends Typegoose {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  nameInKhmer: string;

  @prop()
  description: string;

  @prop({ ref: User })
  user?: Ref<User>;

  @prop({ ref: Moc })
  MOC?: Ref<Moc>;

  @prop({ ref: Dot })
  DOT?: Ref<Dot>;

  @arrayProp({ itemsRef: TaxHistory })
  taxHistory?: Ref<TaxHistory>[];

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Company;
