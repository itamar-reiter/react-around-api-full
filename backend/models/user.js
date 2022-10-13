const { Schema, model } = require('mongoose');
const { urlRegex } = require('../utils/regex');
const validator = require('validator');

const userSchema = new Schema({
  name: {
    type: String,
    default: "Jacques Cousteau",
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    default: "Explorer",
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
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
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  }
});

module.exports = model('user', userSchema);
