import { Router } from 'express';
const mongoose = require('mongoose');
import requires from '../../middleware/requires';
import { withAuthAdmin } from '../../middleware/withAuthAdmin';
import { ServiceModel } from '../../models';
import { withAuth } from '../../middleware/withAuth';
import { MonthlyTaxService } from '../../models/interfaces/monthly-tax-return.interface';
import { AnnualTaxService } from '../../models/interfaces/annual-tax-return.interface';
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
      const monthlyTaxService: MonthlyTaxService = {
        threshold,
        moreThanThresholdPrice,
        lessThanThresholdPrice,
      };
      // need this
      const annualTaxService: AnnualTaxService = {
        salaryTaxPrice,
        patentTaxPrice,
        trademarkTaxPrice,
        propertyTaxPrice,
        transportationTaxPrice,
      };
      // set data
      const service = new ServiceModel({
        monthlyTaxService,
        annualTaxService,
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
app.get('/', withAuth, async (req, res) => {
  // get company from req acquired in with auth middleware
  const services = await ServiceModel.find().sort({ createdAt: -1 });
  // sanity check for company
  if (services.length === 0) {
    return res.json({ success: true, message: "Service doesn't exist in the Database" });
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

    const service = await ServiceModel.findOne({ _id: id });
    // sanity check
    if (!service) {
      return res.status(400).json({ success: false, message: 'Service not found' });
    }

    const monthlyTaxService: MonthlyTaxService = {
      threshold,
      moreThanThresholdPrice,
      lessThanThresholdPrice,
    };

    const annualTaxService: AnnualTaxService = {
      salaryTaxPrice,
      patentTaxPrice,
      trademarkTaxPrice,
      propertyTaxPrice,
      transportationTaxPrice,
    };

    // saving
    await ServiceModel.findOneAndUpdate(
      { _id: id },
      {
        monthlyTaxService,
        annualTaxService,
        docUrl,
      },
      { new: true },
    );

    // // saniy check for threshold
    // if (threshold && threshold !== service.monthlyTaxService.threshold) {
    //   service.monthlyTaxService.threshold = threshold;
    // }
    // // saniy check for moreThanThresholdPrice
    // if (
    //   moreThanThresholdPrice &&
    //   moreThanThresholdPrice !== service.monthlyTaxService.moreThanThresholdPrice
    // ) {
    //   service.monthlyTaxService.moreThanThresholdPrice = moreThanThresholdPrice;
    // }
    // // saniy check for lessThanThresholdPrice
    // if (
    //   lessThanThresholdPrice &&
    //   lessThanThresholdPrice !== service.monthlyTaxService.lessThanThresholdPrice
    // ) {
    //   service.monthlyTaxService.lessThanThresholdPrice = lessThanThresholdPrice;
    // }
    // // saniy check for salaryTaxPrice
    // if (salaryTaxPrice && salaryTaxPrice !== service.annualTaxService.salaryTaxPrice) {
    //   service.annualTaxService.salaryTaxPrice = salaryTaxPrice;
    // }
    // // saniy check for patentTaxPrice
    // if (patentTaxPrice && patentTaxPrice !== service.annualTaxService.patentTaxPrice) {
    //   service.annualTaxService.patentTaxPrice = patentTaxPrice;
    // }
    // // saniy check for trademarkTaxPrice
    // if (
    //   trademarkTaxPrice &&
    //   trademarkTaxPrice !== service.annualTaxService.trademarkTaxPrice
    // ) {
    //   service.annualTaxService.trademarkTaxPrice = trademarkTaxPrice;
    // }
    // // saniy check for propertyTaxPrice
    // if (
    //   propertyTaxPrice &&
    //   propertyTaxPrice !== service.annualTaxService.propertyTaxPrice
    // ) {
    //   service.annualTaxService.propertyTaxPrice = propertyTaxPrice;
    // }
    // // saniy check for transportationTaxPrice
    // if (
    //   transportationTaxPrice &&
    //   transportationTaxPrice !== service.annualTaxService.transportationTaxPrice
    // ) {
    //   service.annualTaxService.transportationTaxPrice = transportationTaxPrice;
    // }
    // // sanity check for docUrl
    // if (docUrl) {
    //   service.docUrl = docUrl;
    // }

    // saving service
    // await service.save();

    return res.json({
      service,
      success: true,
      message: 'Update successful!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
});

export default app;
