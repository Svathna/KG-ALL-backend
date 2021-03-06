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
  mocNumber: string;

  @prop({ required: true })
  notedDate: Date;

  @prop({ required: true })
  capital: number;

  @prop()
  // dateOfBTV: Date;
  annualTranscriptMaintenanceDate: Date;

  @prop({
    enum: CompanyType,
    required: true,
  })
  companyType?: CompanyType;

  @prop({})
  mocUsernameLogin: string;

  @prop({})
  mocPasswordLogin: string;

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Moc;
