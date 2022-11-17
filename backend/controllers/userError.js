const { NotFoundError } = require("../utils/errors");

const getUserError = (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
};

module.exports = getUserError;
