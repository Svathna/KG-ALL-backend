import { Typegoose, prop, InstanceType, instanceMethod, Ref } from 'typegoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import Company from './Company';

export enum UserType {
  ADMIN = 1,
  NORMAL_USER = 2,
}

class User extends Typegoose {
  @prop({ required: true })
  fullName: string;

  @prop({
    enum: UserType,
    required: true,
  })
  type?: UserType;

  @prop({
    required: true,
  })
  userName: string;

  @prop({})
  phoneNumber: number;

  @prop({ default: [] })
  registrationTokens: string[];

  @prop({ required: true })
  password: string;

  @prop({ ref: Company })
  company?: Ref<Company>;

  @prop({ required: true, default: false })
  deleted: boolean;

  @instanceMethod
  async generateHash(this: InstanceType<User>, password: string) {
    try {
      const hash = await bcrypt.hash(password, 8);
      this.password = hash;
      return;
    } catch (e) {
      throw e;
    }
  }

  @instanceMethod
  async checkPassword(this: InstanceType<User>, password: string) {
    try {
      return await bcrypt.compare(password, this.password as string);
    } catch (e) {
      throw e;
    }
  }

  @instanceMethod
  toJSON(this: InstanceType<User>) {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  }

  @instanceMethod
  getJWT(this: InstanceType<User>): string {
    try {
      return jwt.sign(
        {
          id: this._id,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '30d',
        },
      );
    } catch (e) {
      throw e;
    }
  }

  @instanceMethod
  getUserSafe(this: InstanceType<User>) {
    return {
      fullName: this.fullName,
      userName: this.userName,
    };
  }
}

// function isEmail(val: string) {
//   return /\S+@\S+\.\S+/.test(val);
// }

export default User;
