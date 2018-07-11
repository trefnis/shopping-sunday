const authenticate = (req, res, next) => {
  if (!res.locals.deviceId) {
    res.status(401).send();
    return;
  }
  next();
}

module.exports = authenticate;