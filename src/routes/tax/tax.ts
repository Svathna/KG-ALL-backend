import { Router } from 'express';
const mongoose = require('mongoose');
import requires from '../../middleware/requires';
const _ = require('lodash');
import { InstanceType } from 'typegoose';
import { withAuthAdmin } from '../../middleware/withAuthAdmin';
import { withAuth } from '../../middleware/withAuth';
import { MocModel, CompanyModel, TaxHistoryModel } from '../../models';
import Company from '../../models/definitions/Company';
import TaxHistory from '../../models/definitions/TaxHistory';
import { TaxPerMonth } from '../../models/interfaces/tax-per-month.interface';
const { validationResult } = require('express-validator/check');
// get the router
const app = Router();

/**
 * GET: Get one taxHistory `/tax/:id`
 */
app.get('/:id', withAuth, requires({ params: ['id'] }), async (req, res) => {
  const { id } = req.params;
  // get moc with id
  const taxHistory = await TaxHistoryModel.findOne({ _id: id, deleted: false });
  // sanity check for company
  if (!taxHistory) {
    return res
      .status(400)
      .json({ success: false, message: 'TaxHistory do not exist in the Database' });
  }
  // send the company back
  return res.json({ taxHistory, success: true });
});

/**
 * POST: Add a taxPerMonth to taxHistory`/tax/:id`
 */
app.post(
  '/taxPerMonth/:id',
  withAuthAdmin,
  requires({
    params: ['id'],
    body: ['year', 'month', 'revenue', 'spending', 'taxPaidAmount', 'others'],
  }),

  async (req, res) => {
    try {
      // get this piece of info
      const { id } = req.params;
      const { year, month, revenue, spending, taxPaidAmount, others } = req.body;
      // get errors
      const errors = validationResult(req);
      // check for errors
      if (!errors.isEmpty()) {
        // send errors
        return res.status(422).json({ errors: errors.array() });
      }
      // find the company and don't return the isAdmin flag
      const company = await CompanyModel.findOne({ _id: id, deleted: false });
      // sanity check
      if (!company) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input',
        });
      }

      let existingTaxHistory;

      if (company.taxHistory) {
        existingTaxHistory = await TaxHistoryModel.findOne({ _id: company.taxHistory });

        if (!existingTaxHistory) {
          return res.status(400).json({
            success: false,
            message: 'Invalid input',
          });
        }
      }

      const taxPerMonthProperties: TaxPerMonth = {
        year,
        month,
        revenue,
        spending,
        taxPaidAmount,
        others,
      };

      if (existingTaxHistory) {
        const taxPerMonths = existingTaxHistory.taxPerMonths
          ? [...existingTaxHistory.taxPerMonths]
          : [];
        taxPerMonths.push(taxPerMonthProperties);
        taxPerMonths.sort((item1: TaxPerMonth, item2: TaxPerMonth) => item1.month - item2.month);
        existingTaxHistory.taxPerMonths = [...taxPerMonths];

        await existingTaxHistory.save();

        return res.json({
          taxHistory: existingTaxHistory,
          success: true,
          message: 'Tax per month added to company',
        });
      }

      const taxPerMonths: TaxPerMonth[] = [];
      taxPerMonths.push(taxPerMonthProperties);

      const taxHistory = new TaxHistoryModel({ taxPerMonths });
      await taxHistory.save();

      company.taxHistory = taxHistory.id;
      await company.save();

      // return success
      return res.json({
        taxHistory,
        success: true,
        message: 'TaxHistory added to company',
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e });
    }
  },
);

/**
 * PATCH: Update a taxPerMonth to taxHistory `/tax/taxPermonth/:id`
 */
app.patch(
  '/taxPerMonth/:id',
  withAuthAdmin,
  requires({
    params: ['id'],
    body: ['year', 'month', 'revenue', 'spending', 'taxPaidAmount', 'others'],
  }),

  async (req, res) => {
    try {
      // get this piece of info
      const { id } = req.params;
      const { year, month, revenue, spending, taxPaidAmount, others } = req.body;
      // get errors
      const errors = validationResult(req);
      // check for errors
      if (!errors.isEmpty()) {
        // send errors
        return res.status(422).json({ errors: errors.array() });
      }

      const taxHistory = await TaxHistoryModel.findById({ _id: id });
      // sanity check
      if (!taxHistory) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input',
        });
      }

      const taxPerMonthProperties: TaxPerMonth = {
        year,
        month,
        revenue,
        spending,
        taxPaidAmount,
        others,
      };

      const taxPerMonths = taxHistory.taxPerMonths ? [...taxHistory.taxPerMonths] : [];
      // check to find existingData and remove it
      if (taxPerMonths.length > 0) {
        let existingDataIndex;
        for (let index = 0; index < taxPerMonths.length; index++) {
          if (taxPerMonths[index].month === month) {
            existingDataIndex = index;
            break;
          }
        }

        if (existingDataIndex) {
          taxPerMonths.splice(existingDataIndex, 1);
        }
      }

      taxPerMonths.push(taxPerMonthProperties);
      taxPerMonths.sort((item1: TaxPerMonth, item2: TaxPerMonth) => item1.month - item2.month);
      taxHistory.taxPerMonths = [...taxPerMonths];

      await taxHistory.save();

      // return success
      return res.json({
        taxHistory,
        success: true,
        message: 'Tax History updated',
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e });
    }
  },
);

// /**
//  * POST: Add a taxPerYear to taxHistory`/tax`
//  */
// app.post(
//   '/taxPerYear/:id',
//   withAuthAdmin,
//   requires({
//     params: ['id'],
//     body: [
//       'taxPerYears',
//     ],
//   }),

//   async (req, res) => {
//     try {
//       // get this piece of info
//       const { id } = req.params;
//       const {
//         taxPerYears,
//       } = req.body;
//       // get errors
//       const errors = validationResult(req);
//       // check for errors
//       if (!errors.isEmpty()) {
//         // send errors
//         return res.status(422).json({ errors: errors.array() });
//       }
//       // find the company and don't return the isAdmin flag
//       const company = await CompanyModel.findOne({ _id: id, deleted: false });
//       // sanity check
//       if (!company) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid input',
//         });
//       }

//       let existingTaxHistory;

//       if (taxHistoryId) {
//         existingTaxHistory = await TaxHistoryModel.findOne({ _id: taxHistoryId });

//         if (!existingTaxHistory) {
//           return res.status(400).json({
//             success: false,
//             message: 'Invalid input',
//           });
//         }
//       }

//       const taxPerMonthProperties: TaxPerMonth = {
//         year,
//         month,
//         revenue,
//         spending,
//         taxPaidAmount,
//         others,
//       };

//       if (existingTaxHistory) {
//         const taxPerMonths = existingTaxHistory.taxPerMonths ? [...existingTaxHistory.taxPerMonths] : [];
//         taxPerMonths.push(taxPerMonthProperties);
//         existingTaxHistory.taxPerMonths = [...taxPerMonths];

//         await existingTaxHistory.save();

//         return res.json({
//           taxHistory: existingTaxHistory,
//           success: true,
//           message: 'Tax per month added to company',
//         });
//       }

//       const taxPerMonths: TaxPerMonth[] = [];
//       taxPerMonths.push(taxPerMonthProperties)

//       const taxHistory = new TaxHistoryModel(taxPerMonths);
//       await taxHistory.save();

//       company.taxHistory = taxHistory.id;
//       await company.save();

//       // return success
//       return res.json({
//         taxHistory,
//         success: true,
//         message: 'TaxHistory added to company',
//       });
//     } catch (e) {
//       return res.status(500).json({ success: false, message: e });
//     }
//   },
// );

export default app;
