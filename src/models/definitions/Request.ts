import { Typegoose, prop, Ref } from 'typegoose';
import Company from './Company';

export enum RequestStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

class Request extends Typegoose {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  description: string;

  @prop({
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status?: RequestStatus;

  @prop({ ref: Company, required: true })
  compnay: Ref<Company>;

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Request;
