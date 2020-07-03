import { Router } from 'express';
const mongoose = require('mongoose');
import requires from '../../middleware/requires';
const _ = require('lodash');
import { InstanceType } from 'typegoose';
import { withAuthAdmin } from '../../middleware/withAuthAdmin';
import { withAuth } from '../../middleware/withAuth';
import { MocModel, CompanyModel, TaxHistoryModel, RequestModel } from '../../models';
import Company from '../../models/definitions/Company';
import TaxHistory from '../../models/definitions/TaxHistory';
import { RequestStatus, RequestType } from '../../models/definitions/Request';
const { validationResult } = require('express-validator/check');
// get the router
const app = Router();

/**
 * GET: Get all request `/request`
 */
app.get('/', withAuthAdmin, async (req, res) => {
  // get user from req acquired in with auth middleware
  const requests = await RequestModel.find({
    deleted: false,
    status: RequestStatus.PENDING,
  })
    .sort({ createdAt: -1 })
    .populate({
      path: 'company',
      match: { deleted: false },
    });
  // sanity check for user
  if (!requests) {
    return res
      .status(400)
      .json({ success: false, message: 'Requests do not exist in the Database' });
  }
  // send the user back
  return res.json({ requests, success: true, message: 'Success' });
});

/**
 * GET: Get one request `/request/:id`
 */
app.get('/:id', withAuth, requires({ params: ['id'] }), async (req, res) => {
  const { id } = req.params;
  // get request with id
  const request = await RequestModel.findOne({ _id: id, deleted: false });
  // sanity check for company
  if (!request) {
    return res.status(400).json({ success: false, message: 'Reuest do not exist in the Database' });
  }
  // send the company back
  return res.json({ request, success: true });
});

/**
 * Get: Get request by company `/request/company/:id`
 */
app.get('/company/:id', withAuth, requires({ params: ['id'] }), async (req, res) => {
  const { id } = req.params;
  // get request with id
  const company = await CompanyModel.findOne({ _id: id, deleted: false });
  // sanity check for company
  if (!company) {
    return res
      .status(400)
      .json({ success: false, message: 'Company do not exist in the Database' });
  }

  const requests = await RequestModel.aggregate([
    {
      $unwind: {
        path: '$company',
      },
    },
    {
      $match: { company: company._id, deleted: false, status: RequestStatus.PENDING },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  // send the company back
  return res.json({ requests, success: true });
});

/**
 * POST: create a request `/request`
 */
app.post(
  '/',
  withAuth,
  requires({
    body: ['description', 'companyId'],
  }),

  async (req, res) => {
    try {
      // get this piece of info
      const { description, companyId } = req.body;
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

      const requestProperties = {
        description,
        status: RequestStatus.PENDING,
        type: RequestType.REQUEST_DOCUMENT,
        company: companyId,
      };

      const request = new RequestModel(requestProperties);
      await request.save();

      // return success
      return res.json({
        request,
        success: true,
        message: 'Request created',
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e });
    }
  },
);

/**
 * PATCH: Update a request status `/request`
 */
app.patch(
  '/:id',
  withAuthAdmin,
  requires({ params: ['id'], body: ['status'] }),

  async (req, res) => {
    try {
      // get this piece of info
      const { id } = req.params;
      const { status } = req.body;
      // get errors
      const errors = validationResult(req);
      // check for errors
      if (!errors.isEmpty()) {
        // send errors
        return res.status(422).json({ errors: errors.array() });
      }

      const request = await RequestModel.findById({ _id: id });
      // sanity check
      if (!request) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input',
        });
      }

      if (status) {
        request.status = status;
      }

      await request.save();

      // return success
      return res.json({
        request,
        success: true,
        message: 'Rquest status updated',
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e });
    }
  },
);

// /**
//  * DELETE: Delete a request `/request/:id`
//  */
app.delete('/:id', withAuth, requires({ params: ['id'] }), async (req, res) => {
  const { id } = req.params;
  try {
    // try deleting
    const request = await RequestModel.findOne({ _id: id, deleted: false });
    // sanity check for company deleted
    if (!request) return res.status(400).json({ success: false, message: 'Request not found' });

    // soft delete this company
    await RequestModel.findByIdAndUpdate(id, { deleted: true }, { new: true });

    return res.json({
      success: true,
      message: 'Request deleted',
    });
  } catch (e) {
    // send errors
    return res.status(500).json({ success: false, message: e });
  }
});

export default app;
