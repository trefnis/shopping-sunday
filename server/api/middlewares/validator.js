const { validationResult } = require('express-validator/check');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  res.locals.errors = errors;
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.mapped() });
  } else {
    next();
  }
};

module.exports = validate;