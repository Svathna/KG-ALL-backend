import { Typegoose, prop } from 'typegoose';

// export enum DocType {
//   MOC_CERTIFICATE = 'moc_certificate',
//   BUSINESS_EXTRACT_FILE = 'business_extract',
//   VAT_CERTIFICATE = 'vat_certificate',
//   PATENT = 'patent',
//   GDT_CARD = 'gdt_card',
//   OTHERS = 'others',
// }

export interface OtherDocument {
  docUrl: string;
  title: string;
  titleInKhmer: string;
}

class Doc extends Typegoose {
  @prop()
  moc_certificate: string;

  @prop()
  business_extract: string;

  @prop()
  vat_certificate: string;

  @prop()
  patent: string;

  @prop()
  gdt_card: string;

  @prop()
  others: OtherDocument[];
}

export default Doc;
