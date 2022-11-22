const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../utils/regex');

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

const emailAndPasswordValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().unique(true).email(true),
    password: Joi.string().required()
  })
});

const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex)
  })
});

//mongoose default id

const mongooseDefaultIdValidator = Joi.string().alphanum().length(24);

const cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: mongooseDefaultIdValidator
  })
})


//users validators

const getUserDataValidator = celebrate({
  body: Joi.object().keys({
    id: mongooseDefaultIdValidator
  })
});

const getUserByIdValidator = celebrate({
  params: Joi.object().keys({
    id: mongooseDefaultIdValidator
  })
});

const updateProfileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30)
  })
});

const updateAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex)
  })
});




module.exports = {
  emailAndPasswordValidator, createCardValidator, cardIdValidator, getUserDataValidator, getUserByIdValidator, updateProfileValidator, updateAvatarValidator
}