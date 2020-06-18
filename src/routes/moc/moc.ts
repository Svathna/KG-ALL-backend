import { Router } from 'express';
const mongoose = require('mongoose');
import requires from '../../middleware/requires';
const _ = require('lodash');
import { InstanceType } from 'typegoose';
import { withAuthAdmin } from '../../middleware/withAuthAdmin';
import { withAuth } from '../../middleware/withAuth';
import { MocModel, CompanyModel } from '../../models';
import Company from '../../models/definitions/Company';
const { validationResult } = require('express-validator/check');
// get the router
const app = Router();

/**
 * GET: Get one moc `/moc/:id`
 */
app.get('/:id', withAuth, requires({ params: ['id'] }), async (req, res) => {
  const { id } = req.params;
  // get moc with id
  const moc = await MocModel.findOne({ _id: id, deleted: false });
  // sanity check for company
  if (!moc) {
    return res.status(400).json({ success: false, message: 'moc do not exist in the Database' });
  }
  // send the company back
  return res.json({ moc, success: true });
});

/**
 * POST: Add a moc to company `/moc`
 */
app.post(
  '/',
  withAuthAdmin,
  requires({
    body: [
      'mocNumber',
      'notedDate',
      'capital',
      // 'annualTranscriptMaintenanceDate',
      'companyType',
      'mocUsernameLogin',
      'mocPasswordLogin',
      'companyId',
    ],
  }),

  async (req, res) => {
    try {
      // get this piece of info
      const {
        mocNumber,
        notedDate,
        capital,
        // annualTranscriptMaintenanceDate,
        companyId,
        companyType,
        mocUsernameLogin,
        mocPasswordLogin,
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

      const mocProperties = {
        mocNumber,
        notedDate,
        capital,
        // annualTranscriptMaintenanceDate,
        companyType,
        mocUsernameLogin,
        mocPasswordLogin,
      };

      const moc = new MocModel(mocProperties);
      await moc.save();
      company.MOC = moc.id;
      await company.save();

      // return success
      return res.json({
        moc,
        success: true,
        message: 'moc added to company',
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e });
    }
  },
);

/**
 * PATCH: Update a moc to company `/moc`
 */
app.patch(
  '/:id',
  withAuthAdmin,
  requires({ params: ['id'], body: [] }),

  async (req, res) => {
    try {
      // get this piece of info
      const { id } = req.params;
      const {
        mocNumber,
        notedDate,
        capital,
        companyType,
        annualTranscriptMaintenanceDate,
        mocUsernameLogin,
        mocPasswordLogin,
      } = req.body;
      // get errors
      const errors = validationResult(req);
      // check for errors
      if (!errors.isEmpty()) {
        // send errors
        return res.status(422).json({ errors: errors.array() });
      }

      const moc = await MocModel.findById({ _id: id });
      // sanity check
      if (!moc) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input',
        });
      }

      if (mocNumber && mocNumber !== moc.mocNumber) {
        moc.mocNumber = mocNumber;
      }

      if (notedDate && notedDate !== moc.notedDate) {
        moc.notedDate = notedDate;
      }

      if (capital && capital !== moc.capital) {
        moc.capital = capital;
      }

      if (
        annualTranscriptMaintenanceDate &&
        annualTranscriptMaintenanceDate !== moc.annualTranscriptMaintenanceDate
      ) {
        moc.annualTranscriptMaintenanceDate = annualTranscriptMaintenanceDate;
      }

      if (mocUsernameLogin && mocUsernameLogin !== moc.mocUsernameLogin) {
        moc.mocUsernameLogin = mocUsernameLogin;
      }

      if (mocPasswordLogin && mocPasswordLogin !== moc.mocPasswordLogin) {
        moc.mocPasswordLogin = mocPasswordLogin;
      }

      if (companyType && companyType !== moc.companyType) {
        moc.companyType = companyType;
      }

      await moc.save();

      // return success
      return res.json({
        moc,
        success: true,
        message: 'moc updated',
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e });
    }
  },
);

export default app;
