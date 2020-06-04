import { Router } from 'express';
const mongoose = require('mongoose');
import requires from '../../middleware/requires';
const _ = require('lodash');
import { InstanceType } from 'typegoose';
import company from '../../models/definitions/company';
import { CompanyModel, UserModel } from '../../models';
import { withAuthAdmin } from '../../middleware/withAuthAdmin';
import { withAuth } from '../../middleware/withAuth';
const { validationResult } = require('express-validator/check');
// get the router
const app = Router();

/**
 * GET: Get all companys `/company`
 */
app.get('/', withAuthAdmin, async (req, res) => {
  // get company from req acquired in with auth middleware
  const companys = await CompanyModel.find({ deleted: false }).populate({
    path: 'user',
    match: { deleted: false },
  });
  // sanity check for company
  if (companys.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: 'companys do not exist in the Database' });
  }
  // send the company back
  return res.json({ companys, success: true, message: 'Success' });
});

/**
 * GET: Get one company `/company/:id`
 */
app.get('/:id', withAuth, requires({ params: ['id'] }), async (req, res) => {
  const { id } = req.params;
  // get company with id
  const company = await CompanyModel.findOne({ _id: id, deleted: false }).populate([
    'user',
    'MOC',
    'DOT',
    'taxHistory',
  ]);
  // sanity check for company
  if (!company) {
    return res
      .status(400)
      .json({ success: false, message: 'companys do not exist in the Database' });
  }
  // send the company back
  return res.json({ company, success: true });
});

// /**
//  * GET: Get current company `/company/current`
//  */
app.get('/current/safe', withAuth, async (req, res) => {
  // get company from req acquired in with auth middleware
  // try {
  //   const userId = (req as any).user.id;
  //   const user = await UserModel.findOne({ _id: userId, deleted: false });
  //   if (!user) {
  //     return res.status(400).json({ success: false, message: "Can't get current company" });
  //   }
  //   // sanity check for company
  //   if (!company) {
  //     return res.status(400).json({ success: false, message: "Can't get current company" });
  //   }
  //   // send the company back
  //   return res.json({ success: true, company });
  // } catch (error) {
  //   return res.status(400).json({ success: false, message: error });
  // }
});

// /**
//  * POST: Login a company `/company/login`
//  */
// app.post('/login', requires({ body: ['email', 'password'] }), async (req, res) => {
//   // get this
//   const { email, password, registrationToken } = req.body;
//   // try
//   try {
//     // find the company and don't return the isAdmin flag
//     const company = (await companyModel.findOne({ email })) as InstanceType<company>;
//     // sanity check for company
//     if (!company) {
//       // error out
//       return res.status(400).json({ success: false, message: 'Not found email' });
//     }
//     // check that password is got for company
//     if (!(await company.checkPassword(password))) {
//       // error out
//       return res.status(400).json({ success: false, message: 'Not match email/password' });
//     }

//     if (registrationToken) {
//       const tokens = company.registrationTokens;
//       company.registrationTokens = _.union([registrationToken], tokens);
//       await company.save();
//     }

//     // return the company
//     return res.json({
//       company: company.toJSON(),
//       success: true,
//       token: await company.getJWT(),
//     });
//   } catch (e) {
//     // send errors
//     return res.status(500).json({ success: false, message: e });
//   }
// });

/**
 * POST: Register a company `/company`
 */
app.post(
  '/',
  withAuthAdmin,
  requires({ body: ['name', 'nameInKhmer'] }),

  async (req, res) => {
    try {
      // get this piece of info
      const { name, nameInKhmer, description } = req.body;
      // get errors
      const errors = validationResult(req);
      // check for errors
      if (!errors.isEmpty()) {
        // send errors
        return res.status(422).json({ errors: errors.array() });
      }
      // find the company and don't return the isAdmin flag
      const existcompany = (await CompanyModel.findOne({ name, deleted: false })) as InstanceType<
        company
      >;
      // sanity check for existing company
      if (existcompany) {
        // send errors
        return res.status(400).json({ success: false, message: 'Name is in use' });
      }
      const companyProperties = {
        name,
        nameInKhmer,
        description,
      };
      const company = new CompanyModel(companyProperties);
      // save new company
      await company.save();
      // return success
      return res.json({
        company,
        success: true,
        message: 'company registered',
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e });
    }
  },
);

/**
 * PATCH: Update a company `/company/:id`
 */
app.patch('/:id', withAuthAdmin, requires({ params: ['id'], body: [] }), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nameInKhmer, description } = req.body;

    const company = await CompanyModel.findOne({ _id: id, deleted: false });
    if (!company) {
      return res.status(400).json({ success: false, message: 'Company not found' });
    }

    if (name) {
      if (company.name !== name) {
        company.name = name;
      }
    }

    if (nameInKhmer) {
      if (company.nameInKhmer !== nameInKhmer) {
        company.nameInKhmer = nameInKhmer;
      }
    }

    if (description) {
      if (company.description !== description) {
        company.description = description;
      }
    }

    await company.save();

    return res.json({
      company,
      success: true,
      message: 'Update successful!',
    });
  } catch (e) {
    // send errors
    return res.status(500).json({ success: false, message: e });
  }
});

// /**
//  * DELETE: Remove a company `/company/:id`
//  */
app.delete('/:id', withAuthAdmin, requires({ params: ['id'] }), async (req, res) => {
  const { id } = req.params;
  try {
    // try deleting
    const company = await CompanyModel.findOne({ _id: id, deleted: false });
    // sanity check for company deleted
    if (!company) return res.status(400).json({ success: false, message: 'Company not found' });

    // soft delete this company
    company.deleted = true;

    await company.save();

    return res.json({
      success: true,
      message: 'Company deleted',
    });
  } catch (e) {
    // send errors
    return res.status(500).json({ success: false, message: e });
  }
});

export default app;
