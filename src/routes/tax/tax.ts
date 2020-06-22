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
 * POST: Add a taxHistory to company `/tax`
 */
app.post(
  '/',
  withAuthAdmin,
  requires({
    body: ['taxPerMonths', 'taxPerYears', 'companyId'],
  }),

  async (req, res) => {
    try {
      // get this piece of info
      const { taxPerMonths, taxPerYears, companyId } = req.body;
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

      const taxProperties = {
        taxPerMonths,
        taxPerYears,
      };

      const taxHistory = new TaxHistoryModel(taxProperties);
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
 * PATCH: Update a taxHistory to company `/tax`
 */
app.patch(
  '/:id',
  withAuthAdmin,
  requires({ params: ['id'], body: [] }),

  async (req, res) => {
    try {
      // get this piece of info
      const { id } = req.params;
      const { taxPerMonths, taxPerYears } = req.body;
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

      if (taxPerMonths) {
        taxHistory.taxPerMonths = taxPerMonths;
      }

      if (taxPerYears) {
        taxHistory.taxPerYears = taxPerYears;
      }

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

export default app;
