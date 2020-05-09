import { Typegoose, prop, Ref } from 'typegoose';

export enum CompanyType {
  SOLE_PROPRIETORSHIPS = 1,
  PRIVATE_LIMITED_COMPANY = 2,
  PUBLIC_LIMITED_COMPANY = 3,
}

export interface UsernamePasworrd {
  userName: string;
  password: string;
}

class Moc extends Typegoose {
  @prop({ required: true })
  mocNumber: number;

  @prop({ required: true })
  notedDate: Date;

  @prop({ required: true })
  capital: number;

  @prop({ required: true })
  dateOfBTV: Date;

  @prop({})
  mocUsernamePasswordLogin: UsernamePasworrd;

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Moc;
