import { Typegoose, prop, Ref } from 'typegoose';

export enum CompanyType {
  SOLE_PROPRIETORSHIPS = 1,
  PRIVATE_LIMITED_COMPANY = 2,
  PUBLIC_LIMITED_COMPANY = 3,
}

class Vat extends Typegoose {
  @prop({ required: true })
  vatNumber: number;

  @prop({ required: true })
  notedDate: Date;

  @prop({ required: true })
  vatBranch: string;

  @prop({ required: true })
  address: string;

  @prop({ required: true })
  bankName: string;

  @prop({ required: true })
  bankAccountName: string;

  @prop({ required: true })
  bankAccountNumber: number;

  @prop({ required: true })
  taxCardNumber: string;

  @prop({ required: true })
  phoneNumber: string;

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Vat;
