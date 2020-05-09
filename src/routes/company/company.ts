import { Router } from 'express';
const mongoose = require('mongoose');
import requires from '../../middleware/requires';
const _ = require('lodash');
import { withAuth } from '../../middleware/withAuth';
import { InstanceType } from 'typegoose';
import company from '../../models/definitions/company';
import { validateString } from '../../middleware/validateString';
import { validateEmail } from '../../middleware/validateEmail';
import { validatePassword } from '../../middleware/validatePassword';
import { CompanyModel } from '../../models';
import { withAuthAdmin } from '../../middleware/withAuthAdmin';
const { validationResult } = require('express-validator/check');
const cloudinary = require('cloudinary').v2;
const upload = require('../../config/multer');
// get the router
const app = Router();

/**
 * GET: Get all companys `/company`
 */
app.get('/', withAuthAdmin, async (req, res) => {
  // get company from req acquired in with auth middleware
  const companys = await CompanyModel.find({ deleted: false });
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
// app.get('/:id', withAuth, requires({ params: ['id'] }), async (req, res) => {
//   const { id } = req.params;
//   // get company with id
//   const company = await companyModel.findOne({ _id: id, deleted: false });
//   // sanity check for company
//   if (!company) {
//     return res.status(400).json({ success: false, message: 'companys do not exist in the Database' });
//   }
//   // send the company back
//   return res.json({ company, success: true });
// });

// /**
//  * GET: Get current company `/company/current`
//  */
// app.get('/current', withAuth, (req, res) => {
//   // get company from req acquired in with auth middleware
//   const company = (req as any).company as InstanceType<company>;
//   // sanity check for company
//   if (!company) return res.status(400).json({ success: false, message: "Can't get current company" });
//   // send the company back
//   return res.json({ success: true, message: company.getcompanysafe() });
// });

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

    const company = await CompanyModel.findOne({ _id: id });
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
// app.delete('/:id', withAuth, requires({ params: ['id'] }), async (req, res) => {
//   const { id } = req.params;
//   try {
//     // try deleting
//     const companyDeleted = await companyModel.findOne({ _id: id, deleted: false });
//     // sanity check for company deleted
//     if (!companyDeleted) return res.status(400).json({ success: false, message: 'company not found' });
//     // respond if success
//     // soft delete this company
//     const myQuery = { _id: id };
//     const newValue = { $set: { deleted: true } };
//     await companyModel.updateOne(myQuery, newValue, err => {
//       if (err) {
//         return res.json({
//           success: false,
//           message: "Can't delete",
//         });
//       }
//       return res.json({
//         success: true,
//         message: 'company deleted',
//       });
//     });
//   } catch (e) {
//     // send errors
//     return res.status(500).json({ success: false, message: e });
//   }
// });

export default app;
