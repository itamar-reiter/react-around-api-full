const {
  INVALID_DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE
} = require('../utils/errors');

module.exports = (err, req, res, next) => {
 /*  if (err.name === 'CastError') {
    res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Invalid user id' });
  }
  else if (err.name === 'ValidationError') {
    res.status(INVALID_DATA_ERROR_CODE).send({ message: 'invalid input'});
  }
  else if (err.name === 'DocumentNotFoundError') {
    res.status(NOT_FOUND_ERROR_CODE).send({
      message: 'Object not found',
    });
  } */

  console.log("in error middleware");
  console.log(err.name);
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({
        // check the status and display a message based on it
        message: statusCode === 500
          ? 'An error occurred on the server (through middleware)'
          : message
      });
}