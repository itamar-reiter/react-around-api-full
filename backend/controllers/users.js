const Users = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const {
 NOT_FOUND_ERROR_CODE, UNAUTHENTICATED_ERROR_ERROR_CODE
} = require('../utils/errorCodes');
const {UnauthenticatedError} = require('../utils/errors/UnauthenticatedError');
const {NotFoundError} = require('../utils/errors/NotFoundError');
const {InvalidDataError} = require('../utils/errors/InvalidDataError');
const {ServerError} = require('../utils/errors/ServerError');
const ConflictError = require('../utils/errors/ConflictError');


const login = (req, res, next) => {
  const { email, password } = req.body;
  Users.findUserByCredentials(email, password)
    //TODO make so the hashed password wont come back to the user
    .then(user => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'not-so-secret-string');
      res.send({ token: token });
    })
    .catch((error) => {
      console.log(error);
      if (error.statusCode === UNAUTHENTICATED_ERROR_ERROR_CODE) {
        next(new UnauthenticatedError('Could not log in. email or password are invalid'));
      }
      else {
        next(new ServerError());
      }
    });
}

const getUsers = (req, res, next) => Users.find({})
  .then((users) => {
    if (!users) {
      throw new ServerError();
    }
    res.status(200).send(users);
  })
  .catch(next);

const getUserById = (req, res, next) => {
  const { id } = req.params;
  return Users.findOne({ _id: id })
    .orFail(() => {
      throw new NotFoundError(`not found user with ${id} id`);
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        next(new InvalidDataError('Invalid user id'));
      } else if (error.statusCode === NOT_FOUND_ERROR_CODE) {
        next(new NotFoundError('user is not found'));
      } else {
        next(error);
      }
    });
};

const getUserData = (req, res, next) => {
  const id = req.user._id;
  return Users.findOne({ _id: id })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const id = req.user._id;
  Users.findOneAndUpdate({ _id: id }, { name: req.body.name, about: req.body.about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(() => {
      throw new NotFoundError(`not found user with ${id} id`);
    })
    .then((profile) => res.status(200).send(profile))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new InvalidDataError("Invalid name or description"));
      }
      else if (err.name === 'TypeError') {
        next(new InvalidDataError('one or more of the request body is missing'));
      }
      else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        next(new NotFoundError(`not found user with ${id} id`));
      }
      else {
        next(new ServerError());
      }
    });
};

const updateAvatar = (req, res, next) => {
  const id = req.user._id;
  Users.findOneAndUpdate({ _id: id }, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(() => {
      throw new NotFoundError(`not found user with ${id} id`);
    })
    .then((profile) => res.status(200).send(profile))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new InvalidDataError("Invalid url"));
      }
      else if (err.name === 'TypeError') {
        next(new InvalidDataError('one or more of the request body is missing'));
      }
      else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        next(new NotFoundError(`not found user with ${id} id`));
      }
      else {
        next(new ServerError());
      }
    });
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => Users.create({ email: req.body.email, password: hash }))
    //TODO returning the user without the hashed password
    .then((user) => {
      console.log(user._doc.password);
      delete user._doc.password;
      console.log(user);
      res.status(200).send(user);
    })
    .catch((error) => {
      console.log(error);
      //TODO handling case when creating duplicate user and the app crash (mongooseError 'duplicate key error')
      if (error.name === 'ValidationError') {
        next(new InvalidDataError('Invalid email url or password. an item is missing.'));
      }
      else if (error.name === 'MongoServerError') {
        next(new ConflictError("There's allready a user with that email adress. please put another email"))
      } else {
        next(error);
      }
    });
};


module.exports = {
  login, getUsers, getUserById, getUserData, createUser, updateProfile, updateAvatar,
};