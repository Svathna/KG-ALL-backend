import { SchemaOptions } from 'mongoose';
import User from './definitions/User';
import Company from './definitions/Company';
import Request from './definitions/Request';
import Document from './definitions/Document';
import Moc from './definitions/Moc';
import Vat from './definitions/Vat';
import Tax from './definitions/Tax';

const schema: { schemaOptions: SchemaOptions } = {
  schemaOptions: { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } },
};

// tslint:disable:variable-name
export const UserModel = new User().getModelForClass(User, schema);
export const CompanyModel = new Company().getModelForClass(Company, schema);
export const RequestModel = new Request().getModelForClass(Request, schema);
export const DocumentModel = new Document().getModelForClass(Document, schema);
export const MocModel = new Moc().getModelForClass(Moc, schema);
export const VatModel = new Vat().getModelForClass(Vat, schema);
export const TaxModel = new Tax().getModelForClass(Tax, schema);
