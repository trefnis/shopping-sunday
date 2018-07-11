const jsonOnly = (req, res, next) => {
  if (!req.is('application/json')) {
    res.status(415);
    res.send();
  }
  next();
}

module.exports = jsonOnly;