const { cookie } = require('express-validator/check');

const getDeviceId = (req, res, next) => {
  const { deviceId } = req.cookies;
  res.locals.deviceId = deviceId;
  next();
};

const requireDeviceId = cookie('deviceId').isUUID(4);

module.exports = {
  getDeviceId,
  requireDeviceId,
};
