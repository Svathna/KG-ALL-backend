import { SchemaOptions } from 'mongoose';
import User from './definitions/User';
import Company from './definitions/Company';
import Request from './definitions/Request';
import Document from './definitions/Document';
import Moc from './definitions/Moc';
import Dot from './definitions/Dot';
import TaxHistory from './definitions/TaxHistory';

const schema: { schemaOptions: SchemaOptions } = {
  schemaOptions: { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } },
};

// tslint:disable:variable-name
export const UserModel = new User().getModelForClass(User, schema);
export const CompanyModel = new Company().getModelForClass(Company, schema);
export const RequestModel = new Request().getModelForClass(Request, schema);
export const DocumentModel = new Document().getModelForClass(Document, schema);
export const MocModel = new Moc().getModelForClass(Moc, schema);
export const DotModel = new Dot().getModelForClass(Dot, schema);
export const TaxHistoryModel = new TaxHistory().getModelForClass(TaxHistory, schema);
