import { SchemaOptions } from 'mongoose';
import User from './definitions/User';
import Tree from './definitions/Tree';
import Company from './definitions/Company';
import Request from './definitions/Request';
import Document from './definitions/Document';

const schema: { schemaOptions: SchemaOptions } = {
  schemaOptions: { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } },
};

// tslint:disable:variable-name
export const UserModel = new User().getModelForClass(User, schema);
export const TreeModel = new Tree().getModelForClass(Tree, schema);
export const CompanyModel = new Company().getModelForClass(Company, schema);
export const RequestModel = new Request().getModelForClass(Request, schema);
export const DocumentModel = new Document().getModelForClass(Document, schema);
