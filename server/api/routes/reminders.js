const express = require('express');
const { body, param } = require('express-validator/check');

const db = require('../models');
const authenticate = require('../middlewares/auth');
const { requireDeviceId } = require('../middlewares/device');
const validate = require('../middlewares/validator');
const forceJsonRequests = require('../middlewares/forceJsonRequests');
const wrap = require('../helpers/bubbleAsyncErrors');

const router = express.Router();

router.use(requireDeviceId);
router.use(authenticate);

const validations = [
  body('daysBefore').isIn(['1','2','3']).toInt(),
  body('time').matches(/^(?:\d|[01]\d|2[0-3]):[0-5]\d$/),
  body('remindNotShoppingSunday').isBoolean(),
  body('remindShoppingSunday').isBoolean(),
  body('remindHoliday').isBoolean(),
];

router.get('/',
  wrap(async (req, res) => {
    const device = await db.Device.findById(res.locals.deviceId, {
      include: [{ model: db.Reminder, as: 'reminders' },]
    });
    if (!device) {
      res.status('404').end();
      return;
    }
    res.json(device.reminders);
  })
);

router.post('/',
  forceJsonRequests,
  ...validations,
  validate,
  wrap(async (req, res) => {    
    const reminder = await db.Reminder.create({
      ...req.body,
      deviceId: res.locals.deviceId,
    });
    res.status(201).json(reminder);
  })
);

router.put('/:id',
  forceJsonRequests,
  param('id').isInt(),
  ...validations,
  validate,
  wrap(async (req, res) => {
    const reminder = await db.Reminder.findById(req.params.id);
    if (!reminder || res.locals.deviceId !== reminder.deviceId) {
      res.status(404).end();
      return;
    }
    await reminder.update(req.body);
    res.json(reminder);
  })
);

router.delete('/:id',
  param('id').isInt(),
  validate,
  wrap(async (req, res) => {
    const reminder = await db.Reminder.findById(req.params.id);
    if (!reminder || res.locals.deviceId !== reminder.deviceId) {
        res.status(404).end();
        return;
      }
      await reminder.destroy();
      res.status(204).end();
    })
);

module.exports = router;
