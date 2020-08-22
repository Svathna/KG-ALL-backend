import { Router } from 'express';
const mongoose = require('mongoose');
import requires from '../../middleware/requires';
import { withAuthAdmin } from '../../middleware/withAuthAdmin';
import { MonthlyTaxReturnService } from '../../models/interfaces/monthly-tax-return.interface';
import { AnnualTaxReturnService } from '../../models/interfaces/annual-tax-return.interface';
import { ServiceModel } from '../../models';
import Service from '../../models/definitions/Service';
import { withAuth } from '../../middleware/withAuth';
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

/**
 * GET: Get latest service `/service`
 */
app.get('/', async (req, res) => {
  // get company from req acquired in with auth middleware
  const services = await ServiceModel.find().sort({ createdAt: -1 });
  // sanity check for company
  if (services.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Service doesn't exist in the Database" });
  }
  // send the company back
  return res.json({ service: services[0], success: true, message: 'Success' });
});

/**
 * PATCH: Update a service `/service/:id`
 */
app.patch('/:id', withAuthAdmin, requires({ params: ['id'], body: [] }), async (req, res) => {
  try {
    // need this
    const { id } = req.params;
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

    const existingService = await ServiceModel.findOne({ _id: id });
    // sanity check
    if (!existingService) {
      return res.status(400).json({ success: false, message: 'Service not found' });
    }
    // saniy check for threshold
    if (threshold && threshold !== existingService.monthlyTaxReturnService.threshold) {
      existingService.monthlyTaxReturnService.threshold = threshold;
    }
    // saniy check for moreThanThresholdPrice
    if (
      moreThanThresholdPrice &&
      moreThanThresholdPrice !== existingService.monthlyTaxReturnService.moreThanThresholdPrice
    ) {
      existingService.monthlyTaxReturnService.moreThanThresholdPrice = moreThanThresholdPrice;
    }
    // saniy check for lessThanThresholdPrice
    if (
      lessThanThresholdPrice &&
      lessThanThresholdPrice !== existingService.monthlyTaxReturnService.lessThanThresholdPrice
    ) {
      existingService.monthlyTaxReturnService.lessThanThresholdPrice = lessThanThresholdPrice;
    }
    // saniy check for salaryTaxPrice
    if (
      salaryTaxPrice &&
      salaryTaxPrice !== existingService.annualTaxReturnService.salaryTaxPrice
    ) {
      existingService.annualTaxReturnService.salaryTaxPrice = salaryTaxPrice;
    }
    // saniy check for patentTaxPrice
    if (
      patentTaxPrice &&
      patentTaxPrice !== existingService.annualTaxReturnService.patentTaxPrice
    ) {
      existingService.annualTaxReturnService.patentTaxPrice = patentTaxPrice;
    }
    // saniy check for trademarkTaxPrice
    if (
      trademarkTaxPrice &&
      trademarkTaxPrice !== existingService.annualTaxReturnService.trademarkTaxPrice
    ) {
      existingService.annualTaxReturnService.trademarkTaxPrice = trademarkTaxPrice;
    }
    // saniy check for propertyTaxPrice
    if (
      propertyTaxPrice &&
      propertyTaxPrice !== existingService.annualTaxReturnService.propertyTaxPrice
    ) {
      existingService.annualTaxReturnService.propertyTaxPrice = propertyTaxPrice;
    }
    // saniy check for transportationTaxPrice
    if (
      transportationTaxPrice &&
      transportationTaxPrice !== existingService.annualTaxReturnService.transportationTaxPrice
    ) {
      existingService.annualTaxReturnService.transportationTaxPrice = transportationTaxPrice;
    }
    // sanity check for docUrl
    if (docUrl) {
      existingService.docUrl = docUrl;
    }

    // saving service
    await existingService.save();

    return res.json({
      service: existingService,
      success: true,
      message: 'Update successful!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
});

export default app;
