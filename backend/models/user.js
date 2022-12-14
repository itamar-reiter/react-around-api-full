const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { urlRegex } = require('../utils/regex');
const UnauthenticatedError = require('../utils/errors/UnauthenticatedError');

const userSchema = new Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau',
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Explorer',
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid image url.`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email.`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthenticatedError('Email or Password are incorrect'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthenticatedError('bad cred'));
          }
          return user;
        });
    });
};

module.exports = model('user', userSchema);
