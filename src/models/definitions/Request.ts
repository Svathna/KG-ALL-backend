import { Typegoose, prop, Ref } from 'typegoose';
import Company from './Company';

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum RequestType {
  REQUEST_DOCUMENT = 1,
  OTHERS = 2,
}

class Request extends Typegoose {
  @prop({ required: true })
  description: string;

  @prop({
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @prop({
    enum: RequestType,
    default: RequestType.REQUEST_DOCUMENT,
  })
  type: RequestType;

  @prop({ ref: Company, required: true })
  company: Ref<Company>;

  @prop({ required: true, default: false })
  deleted: boolean;
}

export default Request;
