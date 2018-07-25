const { header } = require('express-validator/check');

const getDeviceId = (req, res, next) => {
  const deviceId = req.header('deviceId');
  if (deviceId) {
    res.locals.deviceId = deviceId;
  }
  next();
};

const requireDeviceId = header('deviceId').isUUID(4);

module.exports = {
  getDeviceId,
  requireDeviceId,
};
