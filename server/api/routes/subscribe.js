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
    const { deviceId } = res.locals;

    if (deviceId) {
      const device = await db.Device.findById(deviceId); 
      if (device) {
        device.subscription = req.body;
        await device.save();
        return res.json({ deviceId });
      }
    } 

    const newDevice = await db.Device.create({
      subscription: req.body,
    });

    return res.json({ deviceId: newDevice.id });
  }));

module.exports = router;
