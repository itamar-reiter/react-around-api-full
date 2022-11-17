const INVALID_DATA_ERROR_CODE = 400;
const UNAUTHENTICATED_ERROR_ERROR_CODE = 401;
const UNAUTHORIZED_ERROR_ERROR_CODE = 403;
const NOT_FOUND_ERROR_CODE = 404;

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INVALID_DATA_ERROR_CODE;
  }
}

class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHENTICATED_ERROR_ERROR_CODE;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR_ERROR_CODE;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR_CODE;
  }
}

class ServerError extends Error {
  constructor() {
    this.message = 'An error has occured on the server';
    this.statusCode = 500;
  }
}

//message: 'An error has occured on the server'

module.exports = {
  NotFoundError, UnauthenticatedError, UnauthorizedError, InvalidDataError, ServerError, INVALID_DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE,
};