import { Typegoose, prop, Ref } from 'typegoose';
import Company from './Company';

export enum DocumentType {}
// ... Need to clear it later

class Document extends Typegoose {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  file_url: string;

  // ... Need to clear it later
  // @prop({
  //   enum: DocumentType,
  // })
  // type?: DocumentType;

  @prop({ ref: Company, required: true })
  compnay: Ref<Company>;

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Document;
