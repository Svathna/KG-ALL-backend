import { Router } from 'express';
const mongoose = require('mongoose');
import requires from '../../middleware/requires';
const _ = require('lodash');
import { InstanceType } from 'typegoose';
import { withAuthAdmin } from '../../middleware/withAuthAdmin';
import { withAuth } from '../../middleware/withAuth';
import { MocModel, CompanyModel, DotModel } from '../../models';
import Company from '../../models/definitions/Company';
const { validationResult } = require('express-validator/check');
// get the router
const app = Router();

/**
 * GET: Get one dot `/dot/:id`
 */
app.get('/:id', withAuth, requires({ params: ['id'] }), async (req, res) => {
  const { id } = req.params;
  // get dot with id
  const dot = await DotModel.findOne({ _id: id, deleted: false });
  // sanity check for company
  if (!dot) {
    return res.status(400).json({ success: false, message: 'dot do not exist in the Database' });
  }
  // send the company back
  return res.json({ dot, success: true });
});

/**
 * POST: Add a dot to company `/dot`
 */
app.post(
  '/',
  withAuthAdmin,
  requires({
    body: [
      'dotNumber',
      'notedDate',
      'dotBranch',
      'address',
      'bankName',
      'bankAccountName',
      'bankAccountNumber',
      'taxationCardNumber',
      'phoneNumber',
      'companyId',
    ],
  }),

  async (req, res) => {
    try {
      // get this piece of info
      const {
        dotNumber,
        notedDate,
        dotBranch,
        address,
        bankName,
        bankAccountName,
        bankAccountNumber,
        taxationCardNumber,
        phoneNumber,
        companyId,
      } = req.body;
      // get errors
      const errors = validationResult(req);
      // check for errors
      if (!errors.isEmpty()) {
        // send errors
        return res.status(422).json({ errors: errors.array() });
      }
      // find the company
      const company = await CompanyModel.findOne({ _id: companyId, deleted: false });
      // sanity check
      if (!company) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input',
        });
      }

      const dotProperties = {
        dotNumber,
        notedDate,
        dotBranch,
        address,
        bankName,
        bankAccountName,
        bankAccountNumber,
        taxationCardNumber,
        phoneNumber,
      };

      const dot = new DotModel(dotProperties);
      await dot.save();
      company.DOT = dot.id;
      await company.save();

      // return success
      return res.json({
        dot,
        success: true,
        message: 'dot added to company',
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e });
    }
  },
);

/**
 * POST: Update a dot to company `/dot`
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
        dotNumber,
        notedDate,
        dotBranch,
        address,
        bankName,
        bankAccountName,
        bankAccountNumber,
        taxationCardNumber,
        phoneNumber,
      } = req.body;
      // get errors
      const errors = validationResult(req);
      // check for errors
      if (!errors.isEmpty()) {
        // send errors
        return res.status(422).json({ errors: errors.array() });
      }

      const dot = await DotModel.findById({ _id: id });
      // sanity check
      if (!dot) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input',
        });
      }

      if (dotNumber && dotNumber !== dot.dotNumber) {
        dot.dotNumber = dotNumber;
      }

      if (notedDate && notedDate !== dot.notedDate) {
        dot.notedDate = notedDate;
      }

      if (dotBranch && dotBranch !== dot.dotBranch) {
        dot.dotBranch = dotBranch;
      }

      if (address && address !== dot.address) {
        dot.address = address;
      }

      if (bankName && bankName !== dot.bankName) {
        dot.bankName = bankName;
      }

      if (bankAccountName && bankAccountName !== dot.bankAccountName) {
        dot.bankAccountName = bankAccountName;
      }

      if (bankAccountNumber && bankAccountNumber !== dot.bankAccountNumber) {
        dot.bankAccountNumber = bankAccountNumber;
      }

      if (taxationCardNumber && taxationCardNumber !== dot.taxationCardNumber) {
        dot.taxationCardNumber = taxationCardNumber;
      }

      if (phoneNumber && phoneNumber !== dot.phoneNumber) {
        dot.phoneNumber = phoneNumber;
      }

      await dot.save();

      // return success
      return res.json({
        dot,
        success: true,
        message: 'dot updated',
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e });
    }
  },
);

export default app;
