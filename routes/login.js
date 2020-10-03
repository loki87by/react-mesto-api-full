/* eslint-disable linebreak-style */
// **импорт
const loginRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login } = require('../controllers/users');

// **функционал
// eslint-disable-next-line arrow-body-style

loginRouter.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
  }),
}), login);

// **экспорт
module.exports = { loginRouter };
