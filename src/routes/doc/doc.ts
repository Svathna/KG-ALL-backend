import { Router } from 'express';
const mongoose = require('mongoose');
import requires from '../../middleware/requires';
const _ = require('lodash');
import { InstanceType } from 'typegoose';
import { withAuthAdmin } from '../../middleware/withAuthAdmin';
import { withAuth } from '../../middleware/withAuth';
import { MocModel, CompanyModel, DocModel } from '../../models';
import Company from '../../models/definitions/Company';
const { validationResult } = require('express-validator/check');
// get the router
const app = Router();

/**
 * GET: Get one doc `/moc/:id`
 */
app.get('/:id', withAuth, requires({ params: ['id'] }), async (req, res) => {
  const { id } = req.params;
  // get moc with id
  const doc = await DocModel.findOne({ _id: id });
  // sanity check for company
  if (!doc) {
    return res
      .status(400)
      .json({ success: false, message: 'Document do not exist in the Database' });
  }
  // send the company back
  return res.json({ doc, success: true });
});

/**
 * POST: Add a moc to company `/moc`
 */
app.post(
  '/',
  withAuthAdmin,
  requires({ body: ['companyId'] }),

  async (req, res) => {
    try {
      // get this piece of info
      const {
        moc_certificate,
        business_extract,
        vat_certificate,
        patent,
        gdt_card,
        docId,
        companyId,
      } = req.body;
      // get errors
      const errors = validationResult(req);
      // check for errors
      if (!errors.isEmpty()) {
        // send errors
        return res.status(422).json({ errors: errors.array() });
      }
      // find the company and don't return the isAdmin flag
      const company = await CompanyModel.findOne({ _id: companyId, deleted: false });
      // sanity check
      if (!company) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input',
        });
      }

      const docProperties = {
        moc_certificate,
        business_extract,
        vat_certificate,
        patent,
        gdt_card,
      };

      // Just edit if doc already exist
      if (docId) {
        const doc = await DocModel.findOne({ _id: docId });
        if (!doc) {
          return res.status(400).json({
            success: false,
            message: 'Invalid input',
          });
        }

        if (moc_certificate) {
          doc.moc_certificate = moc_certificate;
        }

        if (business_extract) {
          doc.business_extract = business_extract;
        }

        if (vat_certificate) {
          doc.vat_certificate = vat_certificate;
        }

        if (patent) {
          doc.patent = patent;
        }

        if (gdt_card) {
          doc.gdt_card = gdt_card;
        }

        await doc.save();

        return res.json({
          doc,
          success: true,
          message: 'doc added to company',
        });
      }

      const doc = new DocModel(docProperties);
      await doc.save();
      company.docs = doc.id;
      await company.save();

      // return success
      return res.json({
        doc,
        success: true,
        message: 'doc added to company',
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e });
    }
  },
);

// /**
//  * DELETE: Remove a doc `/doc/:id`
//  */
app.delete('/:id', withAuthAdmin, requires({ params: ['id'] }), async (req, res) => {
  const { id } = req.params;
  try {
    // try deleting
    const doc = await DocModel.findOneAndDelete({ _id: id, deleted: false });
    // sanity check for company deleted
    if (!doc) return res.status(400).json({ success: false, message: 'Doc not found' });

    // soft delete this company

    return res.json({
      success: true,
      message: 'Doc deleted',
    });
  } catch (e) {
    // send errors
    return res.status(500).json({ success: false, message: e });
  }
});

/**
 * POST: Update a moc to company `/moc`
 */
// app.patch(
//   '/:id',
//   withAuthAdmin,
//   requires({ params: ['id'], body: []}),

//   async (req, res) => {
//     try {
//       // get this piece of info
//       const { id } = req.params;
//       const {
//         mocNumber,
//         notedDate,
//         capital,
//         dateOfBTV,
//         mocUsernameLogin,
//         mocPasswordLogin } = req.body;
//       // get errors
//       const errors = validationResult(req);
//       // check for errors
//       if (!errors.isEmpty()) {
//         // send errors
//         return res.status(422).json({ errors: errors.array() });
//       }

//       const moc = await MocModel.findById({ _id: id })
//       // sanity check
//       if (!moc) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid input'
//         });
//       }

//       if (mocNumber && mocNumber !== moc.mocNumber) {
//         moc.mocNumber = mocNumber;
//       }

//       if (notedDate && notedDate !== moc.notedDate) {
//         moc.notedDate = notedDate;
//       }

//       if (capital && capital !== moc.capital) {
//         moc.capital = capital;
//       }

//       if (dateOfBTV && dateOfBTV !== moc.dateOfBTV) {
//         moc.dateOfBTV = dateOfBTV;
//       }

//       if (mocUsernameLogin && mocUsernameLogin !== moc.mocUsernameLogin) {
//         moc.mocUsernameLogin = mocUsernameLogin;
//       }

//       if (mocPasswordLogin && mocPasswordLogin !== moc.mocPasswordLogin) {
//         moc.mocPasswordLogin = mocPasswordLogin;
//       }

//       await moc.save();

//       // return success
//       return res.json({
//         moc,
//         success: true,
//         message: 'moc updated',
//       });
//     } catch (e) {
//       return res.status(500).json({ success: false, message: e });
//     }
//   },
// );

export default app;
