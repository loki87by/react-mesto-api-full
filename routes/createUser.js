/* eslint-disable linebreak-style */
// **импорт
const createUserRouter = require('express').Router();
const { celebrate, Joi, CelebrateErr } = require('celebrate');
const validator = require('validator');
const { createUser } = require('../controllers/users');

const validateUrl = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateErr('Введите корректный URL');
  }
  return value;
};

// **функционал
// eslint-disable-next-line arrow-body-style
createUserRouter.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().custom(validateUrl).required(),
  }),
}), createUser);
// **экспорт
module.exports = createUserRouter;
