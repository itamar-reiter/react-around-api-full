const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log("through auth middleware, no authorization or authorization isn't JWT")
    throw new UnauthorizedError('Authorization required');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'not-so-secret-string');
  } catch (err) {
    console.log('through auth middleware, jwt payload not loaded')
    next(new UnauthorizedError('Authorization required'));
  }
  req.user = payload;
  console.log(req.user);
  console.log(payload);
  next();
};