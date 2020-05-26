import { Router } from 'express';
const mongoose = require('mongoose');
import requires from '../../middleware/requires';
const _ = require('lodash');
import { withAuth } from '../../middleware/withAuth';
import { InstanceType } from 'typegoose';
import User, { UserType } from '../../models/definitions/User';
import { validateString } from '../../middleware/validateString';
import { validatePassword } from '../../middleware/validatePassword';
import { UserModel } from '../../models';
import { withAuthAdmin } from '../../middleware/withAuthAdmin';
const { validationResult } = require('express-validator/check');
// get the router
const app = Router();

/**
 * GET: Get all users `/user`
 */
app.get('/', withAuthAdmin, async (req, res) => {
  // get user from req acquired in with auth middleware
  const users = await UserModel.find({ deleted: false, type: 2 }).populate({
    path: 'company',
    match: { deleted: false },
  });
  // sanity check for user
  if (users.length === 0) {
    return res.status(400).json({ success: false, message: 'Users do not exist in the Database' });
  }
  // send the user back
  return res.json({ users, success: true, message: 'Success' });
});

/**
 * GET: Get one user `/user/:id`
 */
app.get('/:id', withAuth, requires({ params: ['id'] }), async (req, res) => {
  const { id } = req.params;
  // get user with id
  const user = await UserModel.findOne({ _id: id, deleted: false }).populate({
    path: 'company',
    match: { deleted: false },
  });
  // sanity check for user
  if (!user) {
    return res.status(400).json({ success: false, message: 'Users do not exist in the Database' });
  }
  // send the user back
  return res.json({ user, success: true });
});

/**
 * GET: Get current user `/user/current`
 */
app.get('/current/safe', withAuth, (req, res) => {
  // get user from req acquired in with auth middleware
  const user = (req as any).user as InstanceType<User>;
  // sanity check for user
  if (!user) return res.status(400).json({ success: false, message: "Can't get current user" });
  // send the user back
  return res.json({
    success: true,
    message: user.getUserSafe(),
  });
});

// /**
//  * POST: Login as admin `/user/admin/login`
//  */
app.post('/admin/login', requires({ body: ['userName', 'password'] }), async (req, res) => {
  // get this
  const { userName, password, registrationToken } = req.body;
  // try
  try {
    // find the user and don't return the isAdmin flag
    const user = await UserModel.findOne({ userName, deleted: false });
    // sanity check for user
    if (!user) {
      // error out
      return res.status(400).json({ success: false, message: 'User Name not found' });
    }
    // sanity check for admin
    if (user.type !== UserType.ADMIN) {
      return res.status(400).json({ success: false, message: 'No permission to access' });
    }
    // check that password is got for admin
    if (!(await user.checkPassword(password))) {
      // error out
      return res.status(400).json({ success: false, message: 'Not match User Name/password' });
    }

    if (registrationToken) {
      const tokens = user.registrationTokens;
      user.registrationTokens = _.union([registrationToken], tokens);
      await user.save();
    }

    // return the user
    return res.json({
      user: user.toJSON(),
      success: true,
      token: await user.getJWT(),
    });
  } catch (e) {
    // send errors
    return res.status(500).json({ success: false, message: e });
  }
});

// /**
//  * POST: Login a user `/user/login`
//  */
app.post('/login', requires({ body: ['userName', 'password'] }), async (req, res) => {
  // get this
  const { userName, password, registrationToken } = req.body;
  // try
  try {
    // find the user and don't return the isAdmin flag
    const user = await UserModel.findOne({ userName, deleted: false }).populate({
      path: 'company',
      match: { deleted: false },
    });
    // sanity check for user
    if (!user) {
      // error out
      return res.status(400).json({ success: false, message: 'User Name not found' });
    }
    // check that password is got for user
    if (!(await user.checkPassword(password))) {
      // error out
      return res.status(400).json({ success: false, message: 'Not match User Name/password' });
    }

    if (registrationToken) {
      const tokens = user.registrationTokens;
      user.registrationTokens = _.union([registrationToken], tokens);
      await user.save();
    }

    // return the user
    return res.json({
      user: user.toJSON(),
      success: true,
      token: await user.getJWT(),
    });
  } catch (e) {
    // send errors
    return res.status(500).json({ success: false, message: e });
  }
});

/**
 * POST: Register a user `/user`
 */
app.post(
  '/',
  withAuthAdmin,
  requires({ body: ['userName', 'password', 'company'] }),
  validateString('userName'),
  validatePassword('password'),

  async (req, res) => {
    try {
      // get this piece of info
      const { fullName, userName, password, phoneNumber, company } = req.body;
      // get errors
      const errors = validationResult(req);
      // check for errors
      if (!errors.isEmpty()) {
        // send errors
        return res.status(422).json({ errors: errors.array() });
      }
      // find the user and don't return the isAdmin flag
      const existUser = await UserModel.findOne({ userName, deleted: false });
      // sanity check for existing user
      if (existUser) {
        // send errors
        return res.status(400).json({ success: false, message: 'User Name is in use' });
      }
      const userProperties = {
        fullName,
        userName,
        password,
        type: UserType.NORMAL_USER,
        phoneNumber,
        company,
      };
      const user = new UserModel(userProperties);
      // generate hash from password
      await user.generateHash(password);
      // save new user
      await user.save();
      // return success
      return res.json({
        user,
        success: true,
        token: await user.getJWT(),
        message: 'User created',
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e });
    }
  },
);

/**
 * PATCH: Update a user `/user/:id`
 */
app.patch('/:id', withAuthAdmin, requires({ params: ['id'], body: [] }), async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, userName, password, phoneNumber } = req.body;
    const user = await UserModel.findById({ _id: id, deleted: false });
    // check if not user
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    // check if fullName
    if (fullName) {
      if (user.fullName !== fullName) {
        user.fullName = fullName;
      }
    }
    // check if userName
    if (userName) {
      if (user.userName !== fullName) {
        user.userName = userName;
      }
    }
    // if phone number
    if (phoneNumber) {
      if (user.phoneNumber !== phoneNumber) {
        user.phoneNumber = phoneNumber;
      }
    }
    // if password
    if (password) {
      await user.generateHash(password);
    }

    await user.save();

    return res.json({
      user,
      success: true,
      message: 'Update successful!',
    });
  } catch (e) {
    // send errors
    return res.status(500).json({ success: false, message: e });
  }
});

/**
 * PATCH: Change password `/user/password/:id`
 */
app.patch(
  '/password/:id',
  withAuth,
  requires({ params: ['id'], body: ['oldPassword', 'newPassword'] }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;
      const user = await UserModel.findById({ _id: id, deleted: false });
      // check if not user
      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }
      // sanity check if not update for own user
      const userId = (req as any).user.id;
      if (userId !== id) {
        return res.status(400).json({
          success: false,
          message: 'Do not have permission',
        });
      }
      // check if oldPassword is correct
      if (!(await user.checkPassword(oldPassword))) {
        // error out
        return res.status(400).json({ success: false, message: 'Old Password is incorrect' });
      }

      await user.generateHash(newPassword);

      await user.save();

      return res.json({
        user,
        success: true,
        message: 'Change password successful!',
      });
    } catch (e) {
      // send errors
      return res.status(500).json({ success: false, message: e });
    }
  },
);

// /**
//  * DELETE: Remove a user `/user/:id`
//  */
app.delete('/:id', withAuthAdmin, requires({ params: ['id'] }), async (req, res) => {
  const { id } = req.params;
  try {
    // try deleting
    const user = await UserModel.findOne({ _id: id, deleted: false });
    // sanity check for user deleted
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });
    // soft delete this user
    user.deleted = true;

    await user.save();

    return res.json({
      success: true,
      message: 'User deleted',
    });
  } catch (e) {
    // send errors
    return res.status(500).json({ success: false, message: e });
  }
});

/**
 * POST: Register a user as Admin `/user/admin`
 */
// app.post(
//     '/admin',
//     requires({ body: ['fullName', 'userName', 'password', 'phoneNumber'] }),
//     validateString('fullName'),
//     validateString('userName'),
//     validatePassword('password'),

//     async (req, res) => {
//         try {
//             // get this piece of info
//             const { fullName, userName, password, phoneNumber } = req.body;
//             // get errors
//             const errors = validationResult(req);
//             // check for errors
//             if (!errors.isEmpty()) {
//                 // send errors
//                 return res.status(422).json({ errors: errors.array() });
//             }
//             // find the admin user
//             const existUser = (await UserModel.findOne({ type: UserType.ADMIN, deleted: false })) as InstanceType<User>;
//             // sanity check for existing user
//             if (existUser) {
//                 // send errors
//                 return res.status(400).json({ success: false, message: 'Admin already registered!' });
//             }
//             const userProperties = {
//                 fullName,
//                 userName,
//                 password,
//                 type: UserType.ADMIN,
//                 phoneNumber
//             };
//             const user = new UserModel(userProperties);
//             // generate hash from password
//             await user.generateHash(password);
//             // save new user
//             await user.save();
//             // return success
//             return res.json({
//                 user,
//                 success: true,
//                 token: await user.getJWT(),
//                 message: 'Admin reigisterd!',
//             });
//         } catch (e) {
//             return res.status(500).json({ success: false, message: e });
//         }
//     },
// );

export default app;
