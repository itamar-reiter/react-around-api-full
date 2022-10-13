const Users = require('../models/user');
const bcrypt = require('bcryptjs');
const {
  defaultError, INVALID_DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE, userUpdateError,
} = require('../utils/errors');

const getUsers = (req, res) => Users.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => defaultError(res));

const getUserById = (req, res) => {
  const { id } = req.params;
  return Users.findOne({ _id: id })
    .orFail(() => {
      const error = new Error(`not found user with ${id} id`);
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
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
      userUpdateError(error, res, 'invalid name or description');
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
      userUpdateError(error, res, 'invalid url');
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
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
};
