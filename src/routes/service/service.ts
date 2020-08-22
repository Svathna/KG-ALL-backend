import { Router } from 'express';
const mongoose = require('mongoose');
import requires from '../../middleware/requires';
import { withAuthAdmin } from '../../middleware/withAuthAdmin';
import { MonthlyTaxReturnService } from '../../models/interfaces/monthly-tax-return.interface';
import { AnnualTaxReturnService } from '../../models/interfaces/annual-tax-return.interface';
import { ServiceModel } from '../../models';
import Service from '../../models/definitions/Service';
const _ = require('lodash');
const { validationResult } = require('express-validator/check');
// get the router
const app = Router();

/**
 * POST: Create a service `/service`
 */
app.post(
  '/',
  withAuthAdmin,
  requires({
    body: [
      'threshold',
      'moreThanThresholdPrice',
      'lessThanThresholdPrice',
      'salaryTaxPrice',
      'patentTaxPrice',
      'trademarkTaxPrice',
      'propertyTaxPrice',
      'transportationTaxPrice',
      'docUrl',
    ],
  }),
  async (req, res) => {
    try {
      const {
        threshold,
        moreThanThresholdPrice,
        lessThanThresholdPrice,
        salaryTaxPrice,
        patentTaxPrice,
        trademarkTaxPrice,
        propertyTaxPrice,
        transportationTaxPrice,
        docUrl,
      } = req.body;

      // get errors
      const errors = validationResult(req);
      // check for errors
      if (!errors.isEmpty()) {
        // send errors
        return res.status(422).json({ errors: errors.array() });
      }
      // need this
      const monthlyTaxReturnService: MonthlyTaxReturnService = {
        threshold,
        moreThanThresholdPrice,
        lessThanThresholdPrice,
      };
      // need this
      const annualTaxReturnService: AnnualTaxReturnService = {
        salaryTaxPrice,
        patentTaxPrice,
        trademarkTaxPrice,
        propertyTaxPrice,
        transportationTaxPrice,
      };
      // set data
      const service = new ServiceModel({
        monthlyTaxReturnService,
        annualTaxReturnService,
        docUrl,
      });
      // save new user
      await service.save();
      // return success
      return res.json({
        service,
        success: true,
        message: 'Service created',
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  },
);

export default app;
