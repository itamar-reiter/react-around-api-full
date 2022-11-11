const Users = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const {
  NotFoundError, InvalidDataError, ServerError, INVALID_DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE, userUpdateError, UnauthenticatedError, UNAUTHENTICATED_ERROR_ERROR_CODE
} = require('../utils/errors');


//TODO console.log(error) for each catch;
const login = (req, res, next) => {
  const { email, password } = req.body;
  Users.findUserByCredentials(email, password)
    //TODO make so the hashed password wont come back to the user
    .then(user => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'not-so-secret-string');
      res.send({ token });
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
  const { id } = req.body;
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

const createUser = (req, res, next) =>
bcrypt.hash(req.body.password, 10)
    .then(hash => Users.create({ password: hash, email: req.body.email }))
    .orFail(() => {
      throw new ServerError();
    })
    //TODO returning the user without the hashed password
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      console.log(error);
      //TODO handling case when creating duplicate user and the app crash (mongooseError 'duplicate key error')
      if (error.name === 'ValidationError' || error.name === 'TypeError') {
      next(new InvalidDataError('Invalid avatar url or an item is missing.'));
      } else {
        next(error);
      }
    });


module.exports = {
  login, getUsers, getUserById, getUserData, createUser, updateProfile, updateAvatar,
};

/*
const Users = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const {
  NotFoundError, InvalidDataError, ServerError, INVALID_DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE, userUpdateError,
} = require('../utils/errors');

const login = (req, res) => {
  const { email, password } = req.body;
  Users.findUserByCredentials(email, password)
    //TODO make so the hashed password wont come back to the user
    .then(user => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'not-so-secret-string');
      res.send({ token });
    })
    //TODO handle the catch errors , maybe it was handled at findByCredentials
    //TODO centralize the error
    .catch(err => res.status(401).send({ message: err.message }));
}

const getUsers = (req, res) => Users.find({})
  .then((users) => {
    if (!users) {
      throw new ServerError();
    }
    res.status(200).send(users);
  })
  .catch(next);

const getUserById = (req, res) => {
  const { id } = req.params;
  return Users.findOne({ _id: id })
    .orFail(() => {
      throw new NotFoundError(`not found user with ${id} id`);
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Invalid user id' });
      } else if (error.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: `
        ${error.name}: ${error.message}.
        `,
        });
      } else {
        defaultError(res);
      }
    });
};

const getUserData = (req, res) => {
  const { id } = req.body;
  return Users.findOne({ _id: id })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => {
      defaultError(res);
    }
    );
};

const updateProfile = (req, res) => {
  const id = req.user._id;
  Users.findOneAndUpdate({ _id: id }, { name: req.body.name, about: req.body.about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(() => {
      const error = new Error(`not found user with ${id} id`);
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((profile) => res.status(200).send(profile))
    .catch((error) => {
      userUpdateError(error, 'invalid name or description');
    });
};

const updateAvatar = (req, res) => {
  const id = req.user._id;
  Users.findOneAndUpdate({ _id: id }, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(() => {
      const error = new Error(`not found user with ${id} id`);
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((profile) => res.status(200).send(profile))
    .catch((error) => {
      userUpdateError(error, 'invalid url');
    });
};

const createUser = (req, res) =>
  bcrypt.hash(req.body.password, 10)
    .then(hash => Users.create({ password: hash, email: req.body.email }))
    //TODO returning the user without the hashed password
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(INVALID_DATA_ERROR_CODE).send({
          message: 'Invalid avatar url or an item is missing.',
        });
      } else {
        defaultError(res);
      }
    });
module.exports = {
  login, getUsers, getUserById, getUserData, createUser, updateProfile, updateAvatar,
};

*/
