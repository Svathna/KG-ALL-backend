import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserModel } from '../models';
import User, { UserType } from '../models/definitions/User';
/*
 * Middleware for Express. Gets id from JWT and sets User to req.user
 */
async function withAuthAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.get('Authorization');
  if (auth && (auth as string).split(' ')[0] === 'Token') {
    const token = (auth as string).split(' ')[1];
    try {
      const tokenObj = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      if (tokenObj.id) {
        const user = (await UserModel.findById(tokenObj.id)) as User;
        if (!user) throw 'Invalid User';
        if (user.type !== UserType.ADMIN) throw 'Invalid User';
        (req as any).user = user;
        next();
      } else {
        throw 'Invalid Token';
      }
    } catch (e) {
      return res.status(401).json({ success: false, message: e });
    }
  } else {
    return res.status(401).json({ success: false, message: 'No Token Found' });
  }
}

export { withAuthAdmin };
