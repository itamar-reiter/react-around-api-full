const INVALID_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const SERVER_ERROR_ERROR_CODE = 500;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.message = 'An error has occured on the server';
    this.statusCode = 500;
  }
}

//message: 'An error has occured on the server'

const userUpdateError = (error, validationMessage) => {
  if (error.name === 'ValidationError') {
    throw new InvalidDataError(validationMessage);
  }
  else if (error.statusCode === NOT_FOUND_ERROR_CODE) {
    throw new NotFoundError(error.message);
  }
  else {
    throw new ServerError();
  }

};

module.exports = {
  NotFoundError, InvalidDataError, ServerError, defaultError, userUpdateError, INVALID_DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE,
};
