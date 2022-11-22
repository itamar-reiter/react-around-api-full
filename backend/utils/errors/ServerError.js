const { SERVER_ERROR_ERROR_CODE } = require("./errorCodes");

module.exports = class ServerError extends Error {
  constructor() {
    this.message = 'An error has occured on the server';
    this.statusCode = SERVER_ERROR_ERROR_CODE;
  }
}