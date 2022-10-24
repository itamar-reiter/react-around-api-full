const { celebrate, Joi } = require('celebrate');
const {urlRegex} = require('../utils/regex');

//TODELETE??
 /* const validateUrl = (value, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
} */

//cards validators

//TODO fix url validation
//TODO fix "Requested resource not found" error that comes across all requests

const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex)
  }),
  headers: Joi.object().keys({}).unknown(true)
});

//mongoose default id

const mongooseDefaultIdValidator = Joi.string().alphanum().length(24);

const cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: mongooseDefaultIdValidator
  }),
  headers: Joi.object().keys({}).unknown(true),
})


//users validators

const getUserDataValidator = celebrate({
  body: Joi.object().keys({
    id: mongooseDefaultIdValidator
  }),
  headers: Joi.object().keys({}).unknown(true),
});

const getUserByIdValidator = celebrate({
  params: Joi.object().keys({
    id: mongooseDefaultIdValidator
  }),
  headers: Joi.object().keys({}).unknown(true),
});

const updateProfileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30)
  }),
  headers: Joi.object().keys({}).unknown(true)
});

const updateAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex)
  }),
  headers: Joi.object().keys({}).unknown(true)
});




module.exports = {
  createCardValidator, cardIdValidator, getUserDataValidator, getUserByIdValidator, updateProfileValidator, updateAvatarValidator
}