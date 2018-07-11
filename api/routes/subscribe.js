const express = require('express');
const { body } = require('express-validator/check');

const db = require('../models');
const validate = require('../middlewares/validator');
const forceJsonRequests = require('../middlewares/forceJsonRequests');
const wrap = require('../helpers/bubbleAsyncErrors');

const router = express.Router();

router.use(forceJsonRequests);

router.post('/',
  body('endpoint').isURL({ protocols: ['https'] }),
  validate,
  wrap(async (req, res, next) => {
    if (res.locals.deviceId) {
      const device = await db.Device.findById(res.locals.deviceId); 
      if (device) {
        device.subscription = req.body;
        await device.save();
        return res.send();
      }
    } 

    const newDevice = await db.Device.create({
      subscription: req.body,
    });

    res.cookie('deviceId', newDevice.id, { httpOnly: true }).send();
  }));

module.exports = router;