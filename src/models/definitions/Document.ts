import { Typegoose, prop, Ref } from 'typegoose';
import Company from './Company';

export enum DocumentType {
  MOC_CERTIFICATE = 'moc_certificate',
  BUSINESS_EXTRACT_FILE = 'business_extract',
  VAT_CERTIFICATE = 'vat_certificate',
  PATENT = 'patent',
  GDT_CARD = 'gdt_card',
  OTHERS = 'others',
}

class Document extends Typegoose {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  file_url: string;

  @prop({
    enum: DocumentType,
  })
  type?: DocumentType;

  @prop({ ref: Company, required: true })
  compnay: Ref<Company>;

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Document;
