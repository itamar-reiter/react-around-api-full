const INVALID_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const SERVER_ERROR_ERROR_CODE = 500;

const defaultError = (res) => res.status(SERVER_ERROR_ERROR_CODE).send({ message: 'An error has occured on the server' });

const userUpdateError = (error, res, validationMessage) => {
  if (error.name === 'ValidationError') {
    return res.status(INVALID_DATA_ERROR_CODE).send({ message: validationMessage });
  }
  if (error.statusCode === NOT_FOUND_ERROR_CODE) {
    return res.status(NOT_FOUND_ERROR_CODE).send({
      message: `
    ${error.name}: ${error.message}.
    `,
    });
  }

  return defaultError(res);
};

module.exports = {
  defaultError, userUpdateError, INVALID_DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE,
};
